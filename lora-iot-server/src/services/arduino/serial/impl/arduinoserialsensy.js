var ArduinoSerialSensy = function() {
    var messageFactory  = require("../../../../messaging/messagefactory").getInstance();
    var logger          = require("../../../../logging/logger").makeLogger("SERV-ARDSER-SEN");

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.handleMessage = function handleMessage(data) {
        messageFactory.sendMessageWithHandler(messageFactory.TARGET_HTTP_WORKER, null, null, 'sensy', 'handleSensyCall', data);
    };
};

module.exports = ArduinoSerialSensy;