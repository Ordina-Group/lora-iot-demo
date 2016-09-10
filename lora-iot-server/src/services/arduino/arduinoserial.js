var ArduinoSerialService = function() {
    var messageFactory  = require("../../util/messagefactory").getInstance();
    var logger          = require("../../logging/logger").makeLogger("SERV-ARDUINO---");
    var SerialPort      = require('serialport');

    //Configuration.
    var Config  = require("../../../resources/config");
    var config  = new Config();

    //Private variables.
    var port        = null;
    var portName    = null;

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.setupArduino = function() {
        SerialPort.list(function (err, ports) {
            logger.INFO("Enumerating serial ports...");

            for(var i = 0; i < ports.length; i++) {
                var p = ports[i];
                if(p.comName.indexOf("ch341") !== -1) {
                    logger.INFO("Port chosen: " + p.comName);
                    portName = p.comName;
                }
            }

            port = new SerialPort(portName);
            port.on('open', onCommOpen);
            port.on('error', onCommError);
            port.on('data', onData);
        });
    };

    this.onMessage = function(message) {
        //Not needed for now!
    };

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    function onCommOpen() {
        port.write('main screen turn on', function(err) {
            if (err) {
                return logger.ERROR('Error on write: ', err.message);
            }
            logger.INFO('message written');
        });
    }

    function onCommError(error) {
        logger.ERROR("Arduino comm error: " + error.message);
    }

    function onData(data) {
        logger.INFO("Data : " + data);

        //TODO: Detect which button was pressed, or what action that should be taken!
        //messageFactory.sendMessageWithHandler(messageFactory.TARGET_HTTP_WORKER, null, null, 'jax', 'handleJaxCall', {"temp": "42"});
    }

};

module.exports = ArduinoSerialService;