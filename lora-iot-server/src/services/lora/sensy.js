var Sensy = function() {
    var https           = require("https");
    var logger          = require("../../logging/logger").makeLogger("SERV-SENSY-----");

    //Configuration.
    var config  = require("../../../resources/config").getInstance();

    var ids = {
        M21: {
            TEMP: "57ecdaf8e0b902133b5c94cf",
            HUMI: "57ecdaf8e0b902133b5c94d0",
            MOTI: "57ecdaf8e0b902133b5c94d1"
        },
        M22: {
            TEMP: "57ecdaf8e0b902133b5c94d2",
            HUMI: "57ecdaf8e0b902133b5c94d3",
            MOTI: "57ecdaf8e0b902133b5c94d4"
        }
    };

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.handleSensyCall = function handleSensyCall(msg) {
        var id = null;
        var data = msg.handlerParams;

        var activeRoom = ids.M21;

        if(data.lastIndexOf("M") > -1) {
            id = activeRoom.MOTI;
        } else if(data.lastIndexOf("T") > -1) {
            id = activeRoom.TEMP;
        } else if(data.lastIndexOf("H") > -1) {
            id = activeRoom.HUMI;
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
        logger.INFO("Sending data for sensor: " + id + " data: " + data);

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
            response.on('data', function(chunk){
                callback(response, JSON.parse(chunk));
            });
        });

        request.on("error", function(error) {
            logger.ERROR("Call to sensy env failed => " + JSON.stringify(error));
            callback(error, null);
        });

        request.end('{"value": ' + postData + '}');
    }
};

module.exports = Sensy;