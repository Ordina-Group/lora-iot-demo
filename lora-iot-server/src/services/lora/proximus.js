var Proximus = function() {
    var https           = require("https");
    var messageFactory  = require("../../util/messagefactory").getInstance();
    var logger          = require("../../logging/logger").makeLogger("SERV-PROXIMUS--");

    //Configuration.
    var Config  = require("../../../resources/config");
    var config  = new Config();

    //Private variables.
    var host            = "api.enabling.be";
    var auth            = "Bearer " + config.keys.proximusBearerToken;

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.devices = function(request, response) {
        logger.INFO("Listing registered LoRa devices.");

        var options = {
            host: host,
            path: "/seaas/0.0.1/device/list?owner=" + config.keys.proximusOwner,
            method: "GET",
            headers: {
                'Authorization' :   auth,
                'content-type'  :   "application/json"
            }
        };

        https.request(options, function(res) {
            var data = '';
            res.setEncoding('utf8');

            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function() {
                var result = null;
                if(this.statusCode !== 200) {
                    result = data;
                } else {
                    result = JSON.parse(data);
                }

                response.write(JSON.stringify(result, null, 4));
                response.end();
            });
        }).end();
    };

    this.buttonTrigger = function(request, response) {
        logger.INFO("Request received for buttonTrigger...");

        switch (request.method) {
            case "GET":
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.write("To use this service, post JSON data to it!", null, 4);
                response.end();
                break;
            case "POST":
                processData(request, response, handleButtonTrigger);
                break;
        }
    };

    this.levelTrigger = function (request, response) {
        logger.INFO("Request received for levelTrigger...");

        switch (request.method) {
            case "GET":
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.write("To use this service, post JSON data to it!", null, 4);
                response.end();
                break;
            case "POST":
                processData(request, response, handleLevelTrigger);
                break;
        }
    };

    this.levelFull = function (request, response) {
        messageFactory.sendSimpleMessage(messageFactory.TARGET_INTERVAL_WORKER, "broadcastMessage", {level: "FULL"});
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write("Level set to FULL", null, 4);
        response.end();
    };

    this.levelHigh = function (request, response) {
        messageFactory.sendSimpleMessage(messageFactory.TARGET_INTERVAL_WORKER, "broadcastMessage", {level: "HIGH"});
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write("Level set to HIGH", null, 4);
        response.end();
    };

    this.levelMedium = function (request, response) {
        messageFactory.sendSimpleMessage(messageFactory.TARGET_INTERVAL_WORKER, "broadcastMessage", {level: "MEDIUM"});
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write("Level set to MEDIUM", null, 4);
        response.end();
    };

    this.levelLow = function (request, response) {
        messageFactory.sendSimpleMessage(messageFactory.TARGET_INTERVAL_WORKER, "broadcastMessage", {level: "LOW"});
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write("Level set to LOW", null, 4);
        response.end();
    };

    this.levelEmpty = function (request, response) {
        messageFactory.sendSimpleMessage(messageFactory.TARGET_INTERVAL_WORKER, "broadcastMessage", {level: "EMPTY"});
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write("Level set to EMPTY", null, 4);
        response.end();
    };


    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    function processData(request, response, callback) {
        var data = null;
        var fullBody = "";

        request.on('data', function(chunk) {
            fullBody += chunk.toString();
        });

        request.on('end', function() {
            try {
                response.writeHead(200, {'Content-Type': 'text/plain'});
                data = JSON.parse(fullBody);

                logger.INFO(JSON.stringify(data));
            } catch (error) {
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.write("Cannot parse request body! Make sure that it is proper JSON!");
            }
            response.end();

            callback(data);
        });
    }

    function handleButtonTrigger(data) {

        switch (data.macaddress) {
            case "1C8779C00000003E":
            case "1C8779C00000003F":
                messageFactory.sendSimpleMessage(messageFactory.TARGET_INTERVAL_WORKER, "broadcastMessage", {buttonPressed: true});
                break;
            default:
                if(data.payload == true || data.payload == "true" || data.payload == 1) {
                    messageFactory.sendSimpleMessage(messageFactory.TARGET_INTERVAL_WORKER, "broadcastMessage", {buttonPressed: true});
                } else if(data.payload == false || data.payload == "false" || data.payload == 0) {
                    messageFactory.sendSimpleMessage(messageFactory.TARGET_INTERVAL_WORKER, "broadcastMessage", {buttonPressed: false});
                }
        }
    }

    function handleLevelTrigger(data) {
        //TODO: Code to prevent levels from switching rapidly?
        switch (data.macaddress) {
            case "020000FFFF00B0B6":
                messageFactory.sendSimpleMessage(messageFactory.TARGET_INTERVAL_WORKER, "broadcastMessage", {level: "FULL"});
                break;
            case "020000FFFF00B0B8":
                messageFactory.sendSimpleMessage(messageFactory.TARGET_INTERVAL_WORKER, "broadcastMessage", {level: "HIGH"});
                break;
            case "020000FFFF00B0C9":
                messageFactory.sendSimpleMessage(messageFactory.TARGET_INTERVAL_WORKER, "broadcastMessage", {level: "MEDIUM"});
                break;
            case "020000FFFF00B0AC":
                messageFactory.sendSimpleMessage(messageFactory.TARGET_INTERVAL_WORKER, "broadcastMessage", {level: "LOW"});
                break;
            case "1C8779C00000003E":
            case "1C8779C00000003F":
                var level = "LOW";
                if(data.payload > 2) {
                    level = "MEDIUM"
                } else if(data.payload > 20) {
                    level = "HIGH"
                }
                messageFactory.sendSimpleMessage(messageFactory.TARGET_INTERVAL_WORKER, "broadcastMessage", {level: level});
                break;
            default:
                logger.ERROR("Unknown hardware id for sensor! Cannot map to level value!");
                break;
        }
    }
};

module.exports = Proximus;