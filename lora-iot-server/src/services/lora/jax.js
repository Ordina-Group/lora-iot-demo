var Jax = function() {
    var https           = require("https");
    var messageFactory  = require("../../util/messagefactory").getInstance();
    var logger          = require("../../logging/logger").makeLogger("SERV-JAX-LONDON");

    //Configuration.
    var Config  = require("../../../resources/config");
    var config  = new Config();

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.endpoint = function(request, response) {
        logger.INFO("Request received for buttonTrigger...");

        switch (request.method) {
            case "GET":
                handleEndpoint();

                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.write("Not yet implemented!", null, 4);
                response.end();
                break;
            case "POST":
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.write("To use this service, call it with a GET request!", null, 4);
                response.end();
                break;
        }
    };

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    function handleEndpoint() {
        logger.ERROR("Not yet implemented!");
    }
};

module.exports = Jax;