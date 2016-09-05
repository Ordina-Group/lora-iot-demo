var ArduinoJaxLondon = function() {
    var messageFactory  = require("../../util/messagefactory").getInstance();
    var logger          = require("../../logging/logger").makeLogger("SERV-ARDUINO---");
    var arduino         = require("johnny-five");

    //Private variables.
    var _self           = this;
    var board           = null;

    var inputSingle     = 8;
    var inputFlipFlop   = 9;
    var inputSensor     = 10;

    var sendPeriodic    = false;

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.init = function(board, sendMessageCallback) {
        _self.board = board;

        var buttonSingle = new arduino.Button(inputSingle);
        board.repl.inject({
            button: buttonSingle
        });

        buttonSingle.on('down', function(){
            logger.INFO('Button single pressed');
        });

        buttonSingle.on('up', function(){
            logger.INFO('Button single released');
            messageFactory.sendMessageWithHandler(messageFactory.TARGET_HTTP_WORKER, null, null, 'jax', 'handleJaxCall', {"temp": "42"});
        });

        var buttonFlipFlop = new arduino.Button(inputFlipFlop);
        board.repl.inject({
            button: buttonFlipFlop
        });

        buttonFlipFlop.on('down', function(){
            logger.INFO('Button flipflop pressed');
        });

        buttonFlipFlop.on('up', function(){
            logger.INFO('Button flipflop released');
            sendPeriodic = !sendPeriodic;
            if(sendPeriodic) {
                //TODO: Add interval to periodically send the temperature via Jax service to serverless endpoint!
            } else {
                //TODO: Remove interval!
            }
        });

        //TODO: Fix temp reading!
        var sensor = new arduino.Sensor.Digital(10);
        sensor.on("change", function() {
            logger.INFO("Sensor value changed to: " + sensor.value);
        });
    };

    this.handleMessage = function(data) {
        logger.ERROR("Not implemented yet!");
    };
};

module.exports = ArduinoJaxLondon;