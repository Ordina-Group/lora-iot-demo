var ArduinoService = function() {
    var logger          = require("../../logging/logger").makeLogger("SERV-ARDUIN---");
    var arduino         = require('duino');
    var ws              = require("nodejs-websocket");

    //Private variables.
    var socketServer    = null;
    var board           = null;

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.setupArduino = function() {
        if(board !== null && socketServer !== null) {
            logger.INFO("Arduino and websocket already up and running.");
            return;
        } else {
            //TODO: Stale checks and reinit if required!

            socketServer = ws.createServer(onConnection).listen(8081);

            //TODO: Swap out for better arduino lib!
            //board = new arduino.Board({debug: false});
            //board.on('ready', onArduinoReady);
        }
    };

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    function onArduinoReady() {
        var led = new arduino.Led({
            board: board,
            pin: 12
        });

        var button = new arduino.Button(
            {
                board: board,
                pin: 2
            }
        );

        button.on('down', function(){
            logger.DEBUG('Button pressed');

            led.on();
            broadcastMessage({"status" : "true"});
        });

        button.on('up', function(){
            logger.DEBUG('Button released');

            led.off();
            broadcastMessage({"status" : "false"});
        });
    }

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