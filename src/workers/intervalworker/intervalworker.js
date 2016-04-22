var IntervalWorker = function() {
    var cluster         = require("cluster");
    var logger          = require("../../logging/logger").makeLogger("INTERVALWORKER-");
    var messageFactory  = require("../../util/messagefactory").getInstance();
    var ws              = require("nodejs-websocket");

    //Required private imports for functionality.
    var Proximus        = require("../../services/lora/proximus");
    var proximus        = null;
    var socketServer    = null;

    init();

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    /**
     * Sets up the interval worker.
     * Sets up the arduino connection.
     * Starts and interval and after the given interval both functions are executed again.
     */
    function init() {
        proximus = new Proximus();
        cluster.worker.on("message", messageReceived);

        //Set up the arduino.
        setupWebsocket();

        //Set up the interval to update the data regularly.
        setInterval(function() {
            logger.INFO("Refreshing data (8 minutes elapsed)");

            //In the off chance the websocket dies, it will be automatically restarted here!
            setupWebsocket();
        }, 480000 );

        logger.INFO("Interval worker started!");
    }

    /**
     * Handles messages that are relayed here from the workers. Executes the targetFunc.
     * The targetFunc should map directly to one of the functions in the section "Data broker data handling".
     *
     * @param msg The message that was sent to the broker.
     */
    function messageReceived(msg) {
        logger.DEBUG("Broker received message from worker: " + msg.workerId);
        eval(msg.targetFunc)(msg);
    }

    /**
     * Sets up the arduino so external applications can get realtime information of what happens with the arduino!
     */
    function setupWebsocket() {
        logger.INFO("Setting up socket...");

        if(socketServer !== null) {
            logger.INFO("Websocket already up and running.");
        } else {
            socketServer = ws.createServer(onConnection).listen(7081);
        }
    }

    function onConnection(connection) {
        logger.INFO("New socket connection");

        try {
            connection.on("text", onMessageFromConnection);
            connection.on("close", onConnectionClosed);
        } catch (error) {
            logger.ERROR("Cannot handle new connection!");
        }
    }

    function onMessageFromConnection(message) {
        try {
            logger.INFO("Message from socket connection: " + message);
            var data = JSON.parse(message);

            //We ignore any messages from the clients, but we log them just in case...
            logger.DEBUG("Message received from websocket client: " + data);
        } catch(error) {
            logger.ERROR("An error occurred during web socket message handling...");
            logger.ERROR("Continuing, not critical!");
        }
    }

    function broadcastMessage(message) {
        logger.INFO("Broadcasting message: " + JSON.stringify(message.data, null, 4));

        socketServer.connections.forEach(
            function (connection) {
                connection.sendText(JSON.stringify(message.data, null, 4))
            }
        );
    }

    function onConnectionClosed(code, reason) {
        logger.DEBUG("Connection closed");
    }
};

module.exports = IntervalWorker;