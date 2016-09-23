var ArduinoSerialService = function() {
    var messageFactory  = require("../../messaging/messagefactory").getInstance();
    var logger          = require("../../logging/logger").makeLogger("SERV-ARDUINO---");
    var SerialPort      = require('serialport');

    //Configuration.
    var config  = require("../../../resources/config").getInstance();

    //Private variables.
    var port        = null;
    var portName    = null;

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.setupArduino = function setupArduino() {
        SerialPort.list(function (err, ports) {
            logger.INFO("Enumerating serial ports...");

            for(var i = 0; i < ports.length; i++) {
                var p = ports[i];
                if(p.comName.indexOf(config.arduino.nativeArduinoPortName) !== -1) {
                    logger.INFO("Port chosen: " + p.comName);
                    portName = p.comName;
                }
            }

            if(portName !== null) {
                port = new SerialPort(portName, {baudRate: 57600,  parser: SerialPort.parsers.raw});
                port.on('open', onCommOpen);
                port.on('error', onCommError);
                port.on('data', onData);
            } else {
                logger.ERROR("No comm port found to connect to!")
            }
        });
    };

    this.onMessage = function onMessage(message) {
        logger.ERROR("Not implemented yet!");
    };

    this.sendMessage = function sendMessage(message) {
        if(port !== null && port !== undefined) {
            port.write(message, onCommError);
        }
    };

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    function onCommOpen() {
        logger.INFO("COMM port open!");
    }

    function onCommError(error) {
        logger.ERROR("Arduino comm error: " + error.message);
    }

    function onData(data) {
        logger.INFO("Data : " + data);

        messageFactory.sendMessageWithHandler(messageFactory.TARGET_HTTP_WORKER, null, null, 'jax', 'handleJaxCall', {"temp": data + ""});
    }

};

module.exports = ArduinoSerialService;