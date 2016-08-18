var ArduinoJaxLondon = function() {
    var messageFactory  = require("../../util/messagefactory").getInstance();
    var logger          = require("../../logging/logger").makeLogger("SERV-ARDUINO---");
    var arduino         = require("johnny-five");

    //Private variables.
    var _self           = this;
    var board           = null;

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.init = function(board) {
        _self.board = board;

        logger.ERROR("Not implemented yet!");
    };

    this.handleMessage = function(data) {
        logger.ERROR("Not implemented yet!");
    };
};

module.exports = ArduinoJaxLondon;