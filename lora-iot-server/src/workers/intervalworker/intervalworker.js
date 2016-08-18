var IntervalWorker = function() {
    var cluster         = require("cluster");
    var logger          = require("../../logging/logger").makeLogger("INTERVALWORKER-");
    var ws              = require("nodejs-websocket");

    //Configuration.
    var Config  = require("../../../resources/config");
    var config  = new Config();

    //Required private imports for functionality.
    var Proximus        = require("../../services/lora/proximus");
    var proximus        = null;
    var Arduino         = require("../../services/arduino/arduino");
    var arduino         = null;
    var socketServer    = null;

    init();

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    /**
     * Sets up the interval worker.
     * Sets up the Arduino connection.
     * Starts and interval and after the given interval both functions are executed again.
     */
    function init() {
        proximus    = new Proximus();
        arduino     = new Arduino();
        cluster.worker.on("message", messageReceived);

        //Set up the web socket & arduino
        setup();

        //Set up the interval to update the data regularly.
        setInterval(function() {
            logger.INFO("Refreshing data (8 minutes elapsed)");

            //In the off chance the websocket or Arduino logic die, it will be automatically restarted here!
            setup();
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
     * Sets up the Arduino so external applications can get real-time information of what happens with the Arduino!
     */
    function setup() {
        logger.INFO("Setting up socket...");

        if(config.arduino.enableArduinoFunctionality) {
            arduino.setupArduino();
        } else {
            logger.INFO("Arduino functionality disabled, messages will be sent over the socket!")
        }

        if(socketServer !== null) {
            logger.INFO("Websocket already up and running.");
        } else {
            socketServer = ws.createServer(onConnection).listen(config.settings.socketPort);
        }
    }

    function onConnection(connection) {
        logger.INFO("New socket connection");

        try {
            connection.on("text", onMessageFromConnection);
            connection.on("close", onConnectionClosed);
            connection.on("error", onError);
        } catch (error) {
            logger.ERROR("Cannot handle new connection!");
        }
    }

    function onMessageFromConnection(message) {
        try {
            logger.INFO("Message from socket connection: " + message);
            var data = JSON.parse(message);

            //Pass messages from the client to the arduino logic
            logger.DEBUG("Message received from websocket client: " + data);

            if(config.settings.arduino.enableArduinoFunctionality) {
                arduino.onMessage(message);
            } else {
                broadcastMessage({data : data});
            }

        } catch(error) {
            logger.ERROR("An error occurred during web socket message handling: " + JSON.stringify(error, null, 4));
            logger.ERROR("Continuing, not critical!");
        }
    }

    function onConnectionClosed(code, reason) {
        logger.DEBUG("Connection closed");
    }

    function onError(error) {
        logger.ERROR("An error occurred with the socket: " +  JSON.stringify(error, null, 4));
    }

    function broadcastMessage(message) {
        logger.INFO("Broadcasting message: " + JSON.stringify(message.data, null, 4));

        socketServer.connections.forEach(
            function (connection) {
                connection.sendText(JSON.stringify(message.data, null, 4))
            }
        );
    }
};

module.exports = IntervalWorker;