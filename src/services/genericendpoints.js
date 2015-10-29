var GenericEndpoints = function() {
    var logger      = require("../logging/logger").makeLogger("SERV-GENERICRST");
    var util         = require("util");
    var fs          = require("fs-extra");
    var formidable  = require('formidable');

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    /**
     * Redirects the user to the index.html page.
     *
     * @param request The request to handle.
     * @param response The response to write to.
     */
     this.index = function(request, response) {
        logger.INFO("Redirecting from '/' to '/index.html'!");
        response.writeHead(301, {
            "Location" : "/index.html"
        });
        response.end();
    };

    /**
     * Handles the upload of one or multiple files.
     * All uploads will be put under the /www/uploads/ folder!
     *
     * @param request The request to handle.
     * @param response The response to write to.
     */
     this.upload = function(request, response) {
        logger.INFO("Attempting to upload files...");

        var files = [];
        var fields = [];
        var form = new formidable.IncomingForm();

        //Process all the fields in the form.
        form.on('field', function(field, value) {
            fields.push([field, value]);
        });
        //Process all the files in the form.
        form.on('file', function(field, file) {
            logger.DEBUG("File added: " + file.name);
            files.push([field, file]);
        });
        //After the form has been processed.
        form.on('end', function() {
            var upload_location = "www/uploads/";

            for(var i = 0 ; i < files.length ; i++) {
                var temp_path = files[i][1].path;
                var file_name = files[i][1].name;

                logger.DEBUG("Copying file : " + temp_path + file_name + " to : " + upload_location + file_name);
                fs.copy(temp_path, upload_location + file_name, function(err) {
                    if (err) {
                        logger.ERROR(err);
                    } else {
                        logger.INFO("File (" + file_name + ") successfully copied to: " + upload_location);
                    }
                });
            }

            //Show the client what was received.
            response.writeHead(200, {'content-type': 'text/plain'});
            response.write('Received upload:\n\n');
            response.end(util.inspect({fields: fields, files: files}));
        });

        //Start processing the form.
        form.parse(request);
    };
};

module.exports = GenericEndpoints;