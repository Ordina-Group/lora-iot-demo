var Worker = function() {
    var logger          = require("../logging/logger").makeLogger("WORKERFACTORY--");
    var cluster         = require("cluster");

    //Private variables
    var jax             = null;

    createWorker();

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    /**
     * Creates a new specific worker.
     * This Worker class acts as a wrapper for the details worker types (data broker/interval worker/HTTP worker)
     */
    function createWorker() {
        //Imports.
        var Server          = require("../workers/httpworker/server");
        var DataBroker      = require("../workers/databroker/databroker");
        var IntervalWorker  = require("../workers/intervalworker/intervalworker");

        //If the process environment contains a name/value pair of name and it equals interval, start a new interval worker.
        //Otherwise start a normal server instance.
        switch (process.env["name"]) {
            case "broker":
                var broker = new DataBroker();
                broker.setupDefaultCaches();
                broker.setupFileStorage();
                break;
            case "interval":
                new IntervalWorker();
                break;
            case "http":
                jax = new (require("./../services/lora/jax"));
                sensy = new (require("./../services/lora/sensy"));
                cluster.worker.on("message", onMessageFromMasterReceived);
                new Server();
                break;
            default:
                logger.ERROR("Unknown worker type, cannot create a worker of type: " + process.env['name']);
                return;
        }

        logger.INFO("Worker (" + process.env["name"] + ") with id: " + cluster.worker.id + " created.");
    }

    /**
     * Handler for messages received from the master instance.
     *
     * @param msg The message the master instance forwarded to this instance. Must be router to the handler object and function.
     */
    function onMessageFromMasterReceived(msg) {
        logger.DEBUG("Received message from master: routing to: " + msg.handler + "." + msg.handlerFunction + "MessageHandler(\"\")");
        eval(msg.handler)[msg.handlerFunction](msg);
    }
};

module.exports = Worker;