var Sensy = function() {
    var https           = require("https");
    var logger          = require("../../logging/logger").makeLogger("SERV-SENSY-----");

    //Configuration.
    var config  = require("../../../resources/config").getInstance();

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.handleSensyCall = function handleSensyCall(msg) {

        var id = null;
        var data = msg.handlerParams;

        //Sensor IDs for M21
        //Motion:   57ecdaf8e0b902133b5c94d1
        //Temp:     57ecdaf8e0b902133b5c94cf
        //Humidity: 57ecdaf8e0b902133b5c94d0

        if(data.lastIndexOf("M") > -1) {
            id = "57ecdaf8e0b902133b5c94d1";
        } else if(data.lastIndexOf("T") > -1) {
            id = "57ecdaf8e0b902133b5c94cf";
        } else if(data.lastIndexOf("H") > -1) {
            id = "57ecdaf8e0b902133b5c94d0";
        } else {
            logger.ERROR("Data could not be parsed!");
            return;
        }

        sendData(id, data.split(":")[1]);
    };

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    function sendData(id, data) {
        logger.INFO("Sending data to SENSY endpoint: " + JSON.stringify(data, null, 4));

        callServerLessEndpoint(id, data, function(response, responseBody) {
            logger.INFO(JSON.stringify(responseBody, null, 4));
        });
    }

    function callServerLessEndpoint(id, postData, callback) {
        var options = {
            host:   "sensymcsensefacebe-dev.cfapps.io",
            path:   "/sensors/" + id + "/data",
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
            }
        };
        var request = https.request(options, function(response) {
            response.setEncoding('utf8');
            //TODO: It would be cleaner to make sure no more chunks of data follow!
            response.on('data', function(chunk){
                callback(response, JSON.parse(chunk));
            });
        });

        request.on("error", function(error) {
            logger.ERROR("Call to sensy env failed => " + JSON.stringify(error));
            callback(error, null);
        });

        //request.write(JSON.stringify(postData));
        request.end('{"value": ' + postData + '}');
    }
};

module.exports = Sensy;