var RegisterService = function() {
    var logger          = require("../../logging/logger").makeLogger("SERV-REGISTE---");


    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.register = function(request, response) {
        switch (request.method) {
            case "GET":
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.write("To use this service, post JSON data to it.\n\n Example: \n" + JSON.stringify({"name": "John Doe", "email": "john.doe@example.com"}, null, 4));
                response.end();
                break;
            case "POST":
                processData(request, response);
                break;
        }
    };

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    function processData(request, response) {
        var fullBody = "";
        request.on('data', function(chunk) {
            fullBody += chunk.toString();
        });

        request.on('end', function() {

            try {
                var data = JSON.parse(fullBody);

                //TODO: Handle data!

                response.writeHead(200, {'Content-Type': 'text/plain'});
            } catch (error) {
                logger.ERROR("Cannot parse request body!");
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.write("Cannot parse request body! Make sure that it is proper JSON!");
            }
            response.end();
        });
    }
};

module.exports = RegisterService;