var ArduinoClient = function() {
    var logger          = require("./logging/logger").makeLogger("MAIN-APPLICATION---");
    var Arduino         = require("./arduino/arduino");
    var WebSocketClient = require("websocket").client;

    //Configuration.
    var Config  = require("../resources/config");
    var config  = new Config();

    //Private variables.
    var arduino         = new Arduino();
    var socketClient    = null;
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
        socketClient = new WebSocketClient();

        socketClient.on('connect', function(conn) {
            logger.INFO('WebSocket Client Connected');

            connection = conn;
            connection.on('message', onMessage);
            connection.on('close', onConnectionClosed);
        });

        socketClient.on('connectFailed', function(error) {
            setTimeout(connectToSocket, 1000);
        });

        socketClient.connect(config.settings.socketUrl + ":" + config.settings.socketPort + "/");
    }

    function onMessage(message) {
        var data = JSON.parse(message.utf8Data);
        logger.INFO(JSON.stringify(data, null, 4));

        if(data.registered !== undefined && data.registered !== null) {
            arduino.onMessage(message.utf8Data);
        } else if(data.winner !== undefined && data.winner !== null) {
            arduino.onMessage(message.utf8Data);
        } else if(data.reset !== undefined && data.reset !== null) {
            arduino.onMessage(message.utf8Data);
        }
    }

    function onConnectionClosed() {
        connectToSocket();
    }

    function sendMessage(data) {
        if(connection !== null && connection !== undefined) {
            connection.send(JSON.stringify(data));
        }
    }
};

//Start the application.
var client = new ArduinoClient();