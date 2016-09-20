var ArduinoService = function() {
    var logger          = require("../../logging/logger").makeLogger("SERV-ARDUINO---");
    var arduino         = require("johnny-five");

    var ArduinoSlotMachine  = require("../arduino/arduinoslotmachine");
    var ArduinoJaxLondon    = require("../arduino/arduinojaxlondon");

    //Configuration.
    var config  = require("../../../resources/config").getInstance();

    //Private variables.
    var board           = null;
    var implementation  = null;

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
        switch (config.arduino.activeImplementation) {
            case config.arduino.implementations.slotMachine:
                implementation = new ArduinoSlotMachine();
                break;
            case config.arduino.implementations.jaxLondon:
                implementation = new ArduinoJaxLondon();
                break;
            default:
                logger.ERROR("Arduino implementation: " + config.arduino.activeImplementation + " not found!");
        }
        if(implementation !== null) {
            implementation.init(board, null);
        }
    }

    function processMessage(message) {
        try {
            logger.DEBUG("Message from connection: " + message);
            var data = JSON.parse(message);

            if(implementation !== null) {
                implementation.handleMessage(data);
            }

        } catch(error) {
            logger.ERROR("An error occurred during message handling...");
            logger.ERROR("Continuing, not critical!");
        }
    }
};

module.exports = ArduinoService;