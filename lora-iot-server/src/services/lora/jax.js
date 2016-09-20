var Jax = function() {
    var https           = require("https");

    var messageFactory  = require("../../messaging/messagefactory").getInstance();
    var callbackManager = require("../../messaging/callbackmanager").getInstance();
    var brokerconstants = require("../../workers/databroker/databrokerconstants").getInstance();
    var logger          = require("../../logging/logger").makeLogger("SERV-JAX-LONDON");

    //Configuration.
    var config  = require("../../../resources/config").getInstance();

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.showCache = function(request, response) {
        logger.INFO("Request received for buttonTrigger...");

        switch (request.method) {
            case "GET":
                retrieveCache(function (data) {
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.write(JSON.stringify(data, null, 4));
                    response.end();
                });
                break;
            case "POST":
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.write("To use this service, call it with a GET request!", null, 4);
                response.end();
                break;
        }
    };

    this.retrieveCacheMessageHandler = function(msg) {
        callbackManager.returnAndRemoveCallbackForId(msg.handlerParams.callbackId)(msg.returnData);
    };

    this.testFire = function(request, response) {
        callServerLessEndpoint({"temp": "42"}, function(serverlessResponse, serverlessResponseBody) {
            var data = {
                dateTime:           new Date(),
                statusCode:         serverlessResponse.statusCode,
                status:             serverlessResponse.statusMessage,
                responseHeaders:    serverlessResponse.headers,
                responseBody:       serverlessResponseBody
            };

            messageFactory.sendSimpleMessage(messageFactory.TARGET_BROKER, brokerconstants.FUNC_ADD_TO_CACHE, {cacheName: "endpointCache", value: data});

            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write("Request sent:" + JSON.stringify(data, null, 4), null, 4);
            response.end();
        });
    };

    this.handleJaxCall = function handleJaxCall(msg) {
      sendData(msg.handlerParams);
    };

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    function retrieveCache(callback) {
        var id = callbackManager.generateIdForCallback(callback);
        messageFactory.sendMessageWithHandler(  messageFactory.TARGET_BROKER,
            brokerconstants.FUNC_RETRIEVE_CACHE, {cacheName: "endpointCache"},
            "jax", "retrieveCacheMessageHandler", {callbackId: id}
        );
    }

    function sendData(data) {
        logger.INFO("Sending data to JAX endpoint: " + JSON.stringify(data, null, 4));

        callServerLessEndpoint(data, function(serverlessResponse, serverlessResponseBody) {
            var data = {
                dateTime:           new Date(),
                statusCode:         serverlessResponse.statusCode,
                status:             serverlessResponse.statusMessage,
                responseHeaders:    serverlessResponse.headers,
                responseBody:       serverlessResponseBody
            };

            messageFactory.sendSimpleMessage(messageFactory.TARGET_BROKER, brokerconstants.FUNC_ADD_TO_CACHE, {cacheName: "endpointCache", value: data});
        });
    }

    function callServerLessEndpoint(postData, callback) {
        var options = {
            host:   "webtask.it.auth0.com",
            path:   "/api/run/wt-daggieken-hotmail_com-0/temp?webtask_no_cache=1",
            method: "POST",
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
            logger.ERROR("Call to serverless env failed => " + JSON.stringify(error));
            callback(error, null);
        });

        request.write(JSON.stringify(postData));
        request.end();
    }
};

module.exports = Jax;