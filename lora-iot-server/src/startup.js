var WeatherGenie = function(runInDebug) {
    var logger          = require("./logging/logger").makeLogger("STARTUP--------");
    var cluster         = require("cluster");
    var Worker          = require("./workers/worker");

    //Private variables.
    var debug           = runInDebug === undefined ? false : runInDebug;
    var broker          = null;
    var intWorker       = null;
    var messageHandlers = null;

    init();

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    /**
     * Init simple purpose.
     * If the current node instance is the master, it proceeds to create the other node instances (forks/workers).
     * If the current node instance is a worker, it will create a new Worker and continue from there.
     *
     * The master node instance only creates, revives forks and passes messages between the workers.
     */
    function init() {
        //The master creates and revives the workers and passes messages between them.
        if (cluster.isMaster) {
            logger.INIT("--------------------------------------------------------------------------");
            logger.INIT("--------------------------------------------------------------------------");
            logger.INIT("                    WELCOME TO THE LORA IOT DEMO APP V1                   ");
            logger.INIT("--------------------------------------------------------------------------");
            logger.INIT("--------------------------------------------------------------------------");

            messageHandlers = createMessageHandlers();
            forkInstances();
        } else {
            new Worker();
        }
    }

    /**
     * Forks all the worker instances.
     * We need one data broker and one interval worker. All the other instances will be HTTP workers.
     * If enough cpu cores (also counts for HyperThreaded ones) are available, the number of HTTP workers will be:
     * NumberOfCores - 2
     * If not enough cpu cores are at hand, we will always spawn one data broker, one interval worker and one HTTP worker.
     * These node instances will than run on the same cpu core but the os scheduling will keep things a bit more vivid.
     */
    function forkInstances() {
        //Fork data broker.
        logger.INIT("Starting new data broker...");
        broker = cluster.fork({name: "broker", debug: debug});
        broker.on("message", messageHandlers.onDataBrokerMessageReceived);

        //Fork interval worker.
        logger.INIT("Starting new interval worker...");
        intWorker = cluster.fork({name: "interval", debug: debug});
        intWorker.on("message", messageHandlers.onIntervalWorkerMessageReceived);

        //Fork normal server worker instances. These will handle all HTTP requests.
        var cores = require("os").cpus().length;
        var numberOfHttpServants = cores - 2 > 0 ? cores - 2 : 1;
        for (var i = 0; i < numberOfHttpServants; i++) {
            logger.INIT("Starting new server worker...");

            var worker = cluster.fork({name: "http", debug: debug});
            worker.on("message", messageHandlers.onServerWorkerMessageReceived);
        }

        //Revive workers if they die!
        if(!debug) {
            cluster.on("exit", reviveDeadWorker);
        }
    }

    /**
     * If a worker dies due to some unforeseen event or bug in the code we will try to revive it to keep our application up and running.
     * On the main node instance we keep a reference to the data broker and interval worker instances. We detect which one has died and
     * restart the proper one.
     *
     * If for some reason the app starts reviving workers at high speed, there should be a critical bug. You should then start the app with
     * the "runInDebug" flag set to true, this will disable the worker reviving system.
     *
     * @param worker The instance of the worker that died. Mainly used to get the id.
     * @param code The exit code.
     * @param signal The exit signal.
     */
    function reviveDeadWorker(worker, code, signal) {
        logger.DEBUG("worker " + worker.id + " died! (details => code: " + code + " signal: " + signal);

        //CLEAR!
        switch (worker.id) {
            case broker.id:
                broker = cluster.fork({name: "broker", debug: debug});
                broker.on("message", messageHandlers.onDataBrokerMessageReceived);
                break;
            case intWorker.id:
                intWorker = cluster.fork({name: "interval", debug: debug});
                intWorker.on("message", messageHandlers.onIntervalWorkerMessageReceived);
                break;
            default:
                cluster.fork({name: "http", debug: debug}).on("message", messageHandlers.onServerWorkerMessageReceived);
        }
    }

    /*-------------------------------------------------------------------------------------------------
     *                                       Message handling
     ------------------------------------------------------------------------------------------------*/
    /**
     * Returns a closure with custom logger and the message handler functions.
     *
     * @returns {{onServerWorkerMessageReceived: Function, onIntervalWorkerMessageReceived: Function, onDataBrokerMessageReceived: Function}}
     */
    function createMessageHandlers() {
        var logger = require("./logging/logger").makeLogger("MESSAGEHANDLER-");

        return {
            /**
             * Handler for messages received from the HTTP worker(s).
             * The message will be forwarded to the target. (for now almost always the data broker)
             *
             * @param msg
             */
            onServerWorkerMessageReceived : function(msg) {
                logger.DEBUG("Message received from server worker: " + msg);

                switch (msg.target){
                    case "broker":
                        broker.send(msg);
                        break;
                    case "intworker":
                        intWorker.send(msg);
                        break;
                    default:
                        cluster.workers[msg.workerId].send({data: msg.data});
                }
            },
            /**
             * Handler for messages received from the interval worker.
             * The message will be forwarded to the target. (for now almost always the data broker)
             *
             * @param msg The message sent by the interval worker that needs to be forwarded to the correct target.
             */
            onIntervalWorkerMessageReceived : function(msg) {
                logger.DEBUG("Message received from interval worker: " + msg);

                switch (msg.target){
                    case "broker":
                        broker.send(msg);
                        break;
                    case "intworker":
                        intWorker.send(msg);
                        break;
                    default:
                        cluster.workers[msg.workerId].send({data: msg.data});
                }
            },
            /**
             * Handler for messages received from the data broker.
             * The message will be forwarded to the worker which sent the message to the data broker.
             *
             * @param msg The message originally sent by the worker which was sent and handled by the data broker and now sent back again.
             */
            onDataBrokerMessageReceived : function(msg) {
                logger.DEBUG("Message received from data broker: " + msg);
                cluster.workers[msg.workerId].send(msg);
            }
        }
    }
};

//Start the application.
var wg = new WeatherGenie();