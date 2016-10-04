var ArduinoService = function() {
    var logger          = require("../../../lora-iot-server/src/logging/logger").makeLogger("SERV-ARDUINO---");
    var arduino         = require("johnny-five");
    var pixel           = require("node-pixel");

    var ArduinoSlotMachine  = require("../../../lora-iot-server/src/services/arduino/impl/arduinoslotmachine");

    //Private variables.
    var board           = null;
    var implementation  = null;

    var sendMessageCallback = null;

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.setupArduino = function(sendMessageFunction) {
        sendMessageCallback = sendMessageFunction;

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
        implementation = new ArduinoSlotMachine();
        implementation.init(board, sendMessageCallback);
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