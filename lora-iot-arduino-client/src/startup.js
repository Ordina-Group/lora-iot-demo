var ArduinoClient = function() {
    var logger          = require("./logging/logger").makeLogger("MAIN-APPLIC----");
    var Arduino         = require("./arduino/arduino");
    var ws              = require("nodejs-websocket");

    //Configuration.
    var Config  = require("../resources/config");
    var config  = new Config();

    //Private variables.
    var arduino         = new Arduino();
    var connection      = null;

    init();

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    function init() {
        arduino.setupArduino(sendMessage);

        connectToSocket();
    }

    function connectToSocket() {
        connection = ws.connect(config.settings.socketUrl + ":" + config.settings.socketPort, {}, function () {
            console.log("Connected to web socket host!");

            this.on("text", onMessage);
            this.on("close", onConnectionClosed);
        });
    }

    function onMessage(message) {
        var data = JSON.parse(message);
        logger.INFO(JSON.stringify(data, null, 4));

        if(data.registered !== undefined && data.registered !== null) {
            arduino.onMessage(message);
        } else if(data.winner !== undefined && data.winner !== null) {
            arduino.onMessage(message);
        } else if(data.reset !== undefined && data.reset !== null) {
            arduino.onMessage(message);
        }
    }

    function onConnectionClosed() {
        connection = null;
        setTimeout(connectToSocket, 500);
    }

    function sendMessage(data) {
        if(connection !== null && connection !== undefined) {
            connection.sendText(JSON.stringify(data));
        } else {
            logger.INFO("Connection no longer available...");
        }
    }
};

//Start the application.
var client = new ArduinoClient();