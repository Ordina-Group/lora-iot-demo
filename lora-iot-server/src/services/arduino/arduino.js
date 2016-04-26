var ArduinoService = function() {
    var messageFactory  = require("../../util/messagefactory").getInstance();
    var logger          = require("../../logging/logger").makeLogger("SERV-ARDUINO---");
    var arduino         = require("johnny-five");
    var pixel           = require("node-pixel");
    var LedStripUtils   = require("../arduino/ledstriputils");

    //Private variables.
    var board           = null;
    var ledStrip        = null;
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
        if(board !== null) {
            logger.INFO("Arduino already up and running.");
        } else {
            board = new arduino.Board();
            board.on('ready', onArduinoReady);
        }
    };

    this.onMessage = function(message) {
        processMessage(message);
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

        ledStrip = new pixel.Strip({
            data: outputPin,
            length: ledCount,
            board: board,
            controller: "FIRMATA"
        });

        ledStrip.on("ready", function() {
            ledStripUtils = new LedStripUtils(ledStrip, ledCount);

            //Turn off the LEDs as they could still be on from a previous run!
            ledStrip.color("rgb(0, 0, 0)");
            ledStrip.show();

            //Start the regular fade cycle.
            ledStripUtils.startCycleFade([
                {"R": "255", "G": "0", "B": "0"},
                {"R": "0", "G": "0", "B": "255"},
                {"R": "255", "G": "255", "B": "255"}
            ], 2500);

            button.on('down', function(){
                logger.INFO('Button pressed');
                messageFactory.sendSimpleMessage(messageFactory.TARGET_INTERVAL_WORKER, "broadcastMessage", {buttonPressed: true});
            });

            button.on('up', function(){
                logger.INFO('Button released');
                messageFactory.sendSimpleMessage(messageFactory.TARGET_INTERVAL_WORKER, "broadcastMessage", {buttonPressed: false});
            });
        });
    }

    function processMessage(message) {
        try {
            logger.DEBUG("Message from connection: " + message);
            var data = JSON.parse(message);

            //After registration message => A new user has been registered!
            if(data.registered === true) {
                ledStripUtils.stopAnimation();
                ledStripUtils = new LedStripUtils(ledStrip, ledCount);
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
                ledStripUtils = new LedStripUtils(ledStrip, ledCount);
                setTimeout(ledStripUtils.startOffsetAnimation, 250);
            } else if(data.winner === false) {
                ledStripUtils.stopAnimation();
                ledStripUtils = new LedStripUtils(ledStrip, ledCount);
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
                ledStripUtils = new LedStripUtils(ledStrip, ledCount);
                setTimeout(ledStripUtils.startCycleFade(
                    [
                        {"R": "255", "G": "0", "B": "0"},
                        {"R": "0", "G": "0", "B": "255"},
                        {"R": "255", "G": "255", "B": "255"}
                    ], 2500), 500);
            }

            //Ignore all other cases and messages!
        } catch(error) {
            logger.ERROR("An error occurred during message handling...");
            logger.ERROR("Continuing, not critical!");
        }
    }
};

module.exports = ArduinoService;