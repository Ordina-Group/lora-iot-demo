var ArduinoJaxLondon = function() {
    var messageFactory  = require("../../messaging/messagefactory").getInstance();
    var logger          = require("../../logging/logger").makeLogger("SERV-ARDUINO---");
    var arduino         = require("johnny-five");

    //Private variables.
    var _self           = this;
    var board           = null;

    var inputSingle     = 8;
    var inputFlipFlop   = 9;
    var inputSensor     = 10;

    var sendPeriodic    = false;
    var interval        = null;
    var lastSensorValue = null;

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.init = function init(board, sendMessageCallback) {
        _self.board = board;

        var buttonSingle = new arduino.Button(inputSingle);
        board.repl.inject({
            button: buttonSingle
        });

        buttonSingle.on('up', function(){
            logger.INFO('Button single released');
            messageFactory.sendMessageWithHandler(messageFactory.TARGET_HTTP_WORKER, null, null, 'jax', 'handleJaxCall', {"temp": "" + lastSensorValue});
        });

        var buttonFlipFlop = new arduino.Button(inputFlipFlop);
        board.repl.inject({
            button: buttonFlipFlop
        });

        buttonFlipFlop.on('up', function(){
            logger.INFO('Button flipflop released');
            sendPeriodic = !sendPeriodic;
            if(sendPeriodic) {
                interval = setInterval(onInterval, 1000);
            } else {
                clearInterval(interval);
            }
        });

        //TODO: Fix temp reading! (DHT reading with johnny-five might not be possible)
        var sensor = new arduino.Sensor.Digital(10);
        sensor.on("change", function() {
            logger.INFO("Sensor value changed to: " + sensor.value);
            lastSensorValue = sensor.value;
        });
    };

    this.handleMessage = function handleMessage(data) {
        logger.ERROR("Not implemented yet!");
    };

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    function onInterval() {
        if(lastSensorValue !== null && lastSensorValue !== undefined) {
            messageFactory.sendMessageWithHandler(messageFactory.TARGET_HTTP_WORKER, null, null, 'jax', 'handleJaxCall', {"temp": "" + lastSensorValue});
        }
    }
};

module.exports = ArduinoJaxLondon;