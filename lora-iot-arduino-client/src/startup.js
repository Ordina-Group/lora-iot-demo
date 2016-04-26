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

    init();

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    function init() {
        socketClient = new WebSocketClient();

        socketClient.on('connectFailed', function(error) {
            logger.INFO('Connect Error: ' + error.toString());
        });

        socketClient.on('connect', function(connection) {
            logger.INFO('WebSocket Client Connected');

            connection.on('message', function(message) {
                var data = JSON.parse(message.utf8Data);
                logger.INFO(JSON.stringify(data, null, 4));

                if(data.registered !== undefined && data.registered !== null) {
                    arduino.onMessage(message.utf8Data);
                } else if(data.winner !== undefined && data.winner !== null) {
                    arduino.onMessage(message.utf8Data);
                } else if(data.reset !== undefined && data.reset !== null) {
                    arduino.onMessage(message.utf8Data);
                }
            });

            arduino.setupArduino(connection);
        });

        socketClient.connect(config.settings.socketUrl + ":" + config.settings.socketPort + "/");
    }
};

//Start the application.
var client = new ArduinoClient();