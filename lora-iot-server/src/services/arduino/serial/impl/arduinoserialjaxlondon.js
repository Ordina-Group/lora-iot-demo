var ArduinoSerialJaxLondon = function() {
    var messageFactory  = require("../../../../messaging/messagefactory").getInstance();
    var logger          = require("../../../../logging/logger").makeLogger("SERV-ARDSER-JAX");

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.handleMessage = function handleMessage(data) {
        messageFactory.sendMessageWithHandler(messageFactory.TARGET_HTTP_WORKER, null, null, 'jax', 'handleJaxCall', {"temp": data + ""});
    };
};

module.exports = ArduinoSerialJaxLondon;