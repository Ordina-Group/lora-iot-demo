var ArduinoService = function() {
    var logger          = require("../../logging/logger").makeLogger("SERV-ARDUINO---");
    var arduino         = require("johnny-five");
    var pixel           = require("node-pixel");
    var ws              = require("nodejs-websocket");
    var LedStripUtils   = require("../arduino/ledstriputils");

    //Private variables.
    var socketServer    = null;
    var board           = null;
    var ledStripUtils   = null;

    var inputPin        = 8;
    var outputPin       = 9;
    var ledCount        = 60;

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.setupArduino = function() {
        if(board !== null && socketServer !== null) {
            logger.INFO("Arduino and websocket already up and running.");
        } else {
            //TODO: Stale checks and reinit if required!

            socketServer = ws.createServer(onConnection).listen(8081);

            board = new arduino.Board();
            board.on('ready', onArduinoReady);
        }
    };

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    function onArduinoReady() {
        var button = new arduino.Button(inputPin);
        board.repl.inject({
            button: button
        });

        var strip = new pixel.Strip({
            data: outputPin,
            length: ledCount,
            board: board,
            controller: "FIRMATA"
        });

        strip.on("ready", function() {
            ledStripUtils = new LedStripUtils(strip, ledCount);

            strip.color("rgb(0, 0, 0)");
            strip.show();
            //fadeToRed();
            ledStripUtils.startCycleFade([
                {"R": "255", "G": "0", "B": "0"},
                {"R": "0", "G": "0", "B": "255"},
                {"R": "255", "G": "255", "B": "255"}
            ], 5000);

            button.on('down', function(){
                logger.INFO('Button pressed');

                strip.color("rgb(0, 0, 255)");
                strip.show();
                broadcastMessage({"status" : "true"});
            });

            button.on('up', function(){
                logger.INFO('Button released');

                strip.color("rgb(255, 0, 0)");
                strip.show();
                broadcastMessage({"status" : "false"});
            });
        });
    }

    /*
    * Web socket functions
     */

    function onConnection(connection) {
        logger.DEBUG("New connection");

        connection.on("text", onMessageFromConnection);
        connection.on("close", onConnectionClosed);
    }

    function onMessageFromConnection(message) {
        logger.DEBUG("Message from connection: " + message);
    }

    function broadcastMessage(message) {
        socketServer.connections.forEach(
            function (connection) {
                connection.sendText(message)
            }
        );
    }

    function onConnectionClosed(code, reason) {
        logger.DEBUG("Connection closed");
    }
};

module.exports = ArduinoService;