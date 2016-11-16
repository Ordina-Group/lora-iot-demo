var ArduinoSerialService = function() {
    var logger          = require("../../../logging/logger").makeLogger("SERV-ARDUINO---");
    var SerialPort      = require('serialport');

    var ArduinoSerialJaxLondon  = require("./impl/arduinoserialjaxlondon");
    var ArduinoSerialSensy      = require("./impl/arduinoserialsensy");

    //Configuration.
    var config  = require("../../../../resources/config").getInstance();

    //Private variables.
    var port            = null;
    var portName        = null;
    var implementation  = null;

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.setupArduino = function setupArduino() {
        SerialPort.list(function (err, ports) {

            activateImplementation();

            logger.INFO("Enumerating serial ports...");
            for(var i = 0; i < ports.length; i++) {
                var p = ports[i];
                logger.INFO("Port found: " + p.comName);

                if(p.comName.indexOf(config.arduino.nativeArduinoPortName) !== -1) {
                    logger.INFO("Port chosen: " + p.comName);
                    portName = p.comName;
                }
            }

            if(portName !== null) {
                port = new SerialPort(portName, {baudRate: 57600,  parser: SerialPort.parsers.readline('\n')});
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
    function activateImplementation() {
        switch (config.arduino.nativeActiveImplementation) {
            case config.arduino.nativeImplementations.jaxLondon:
                implementation = new ArduinoSerialJaxLondon();
                break;
            case config.arduino.nativeImplementations.sensy:
                implementation = new ArduinoSerialSensy();
                break;
            default:
                logger.ERROR("Arduino implementation: " + config.arduino.nativeActiveImplementation + " not found!");
        }
    }

    function onCommOpen() {
        logger.INFO("COMM port open!");
    }

    function onCommError(error) {
        logger.ERROR("Arduino comm error: " + error.message);
    }

    function onData(data) {
        logger.INFO("Data : " + data);
        data = data.replace('\r', '');

        implementation.handleMessage(data);
    }

};

module.exports = ArduinoSerialService;