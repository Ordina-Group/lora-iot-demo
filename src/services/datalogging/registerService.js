var RegisterService = function() {
    var logger          = require("../../logging/logger").makeLogger("SERV-REGISTE---");
    var messageFactory  = require("../../util/messagefactory").getInstance();

    //Variables:
    var today           = null;
    var folder          = null;
    var filename        = null;

    (function init() {
        folder      = "output/";
        today       = new Date().toISOString();
        today       = today.split("T")[0];
        filename    = today + "_Registrations.csv";
    })();

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
                response.writeHead(200, {'Content-Type': 'text/plain'});

                //Process the data.
                var data = JSON.parse(fullBody);

                var time    = new Date().toISOString();
                time        = time.split("T")[1].split(".")[0];
                var line    = time + "," + data.name + "," + data.email + "\n";

                messageFactory.sendSimpleMessage(messageFactory.TARGET_BROKER, "appendToFile", {folder: folder, filename: filename, value: line});
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