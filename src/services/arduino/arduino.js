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

            //Turn off the LEDs as they could still be on from a previous run!
            strip.color("rgb(0, 0, 0)");
            strip.show();

            //Start the regular fade cycle.
            ledStripUtils.startCycleFade([
                {"R": "255", "G": "0", "B": "0"},
                {"R": "0", "G": "0", "B": "255"},
                {"R": "255", "G": "255", "B": "255"}
            ], 2500);

            button.on('down', function(){
                logger.INFO('Button pressed');
                broadcastMessage({buttonPressed : true});
            });

            button.on('up', function(){
                logger.INFO('Button released');
                broadcastMessage({buttonPressed : false});
            });
        });
    }

    /*
    * Web socket functions
     */

    function onConnection(connection) {
        logger.DEBUG("New connection");

        try {
            connection.on("text", onMessageFromConnection);
            connection.on("close", onConnectionClosed);
        } catch (error) {
            logger.ERROR("Cannot handle new connection!");
        }
    }

    function onMessageFromConnection(message) {
        try {
            logger.DEBUG("Message from connection: " + message);
            var data = JSON.parse(message);

            //After registration message => A new user has been registered!
            if(data.registered === true) {
                ledStripUtils.stopAnimation();
                setTimeout(ledStripUtils.startScrollerAnimation(
                    [
                        {"R": "255", "G": "0", "B": "0"},
                        {"R": "0", "G": "0", "B": "255"},
                        {"R": "255", "G": "255", "B": "255"}
                    ], 1000), 500);
            }

            //After game message => Check for winner of loser.
            if(data.winner === true) {
                ledStripUtils.stopAnimation();
                setTimeout(ledStripUtils.startOffsetAnimation, 250);
            } else if(data.winner === false) {
                ledStripUtils.stopAnimation();
                setTimeout(ledStripUtils.startCycleFade(
                    [
                        {"R": "255", "G": "0", "B": "0"},
                        {"R": "0", "G": "0", "B": "255"},
                        {"R": "255", "G": "255", "B": "255"}
                    ], 2500), 500);
            }

            //After reset message => reset LED effects
            if(data.reset === true) {
                ledStripUtils.stopAnimation();
                setTimeout(ledStripUtils.startCycleFade(
                    [
                        {"R": "255", "G": "0", "B": "0"},
                        {"R": "0", "G": "0", "B": "255"},
                        {"R": "255", "G": "255", "B": "255"}
                    ], 2500), 500);
            }

            //Ignore all other cases and messages!
        } catch(error) {
            logger.ERROR("An error occurred during web socket message handling...");
            logger.ERROR("Continuing, not critical!");
        }
    }

    function broadcastMessage(message) {
        logger.DEBUG("Broadcasting message.");

        socketServer.connections.forEach(
            function (connection) {
                connection.sendText(JSON.stringify(message, null, 4))
            }
        );
    }

    function onConnectionClosed(code, reason) {
        logger.DEBUG("Connection closed");
    }
};

module.exports = ArduinoService;