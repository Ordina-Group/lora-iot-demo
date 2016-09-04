var ArduinoJaxLondon = function() {
    var messageFactory  = require("../../util/messagefactory").getInstance();
    var logger          = require("../../logging/logger").makeLogger("SERV-ARDUINO---");
    var arduino         = require("johnny-five");

    //Private variables.
    var _self           = this;
    var board           = null;

    var inputSingle     = 8;
    var inputFlipFlop   = 9;

    var sendPeriodic    = false;

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.init = function(board, sendMessageCallback) {

        messageFactory.sendSimpleMessage(messageFactory.TARGET_HTTP_WORKER, "sendData", {"temp": "42"});

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
            //TODO: Send current temperature via Jax service to serverless endpoint!
            messageFactory.sendSimpleMessage(messageFactory.TARGET_HTTP_WORKER, "sendData", {"temp": "42"});
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
    };

    this.handleMessage = function(data) {
        logger.ERROR("Not implemented yet!");
    };
};

module.exports = ArduinoJaxLondon;