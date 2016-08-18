/**
 * Creates a logger that will print with the given application part.
 *
 * @param applicationPart
 * @returns {{INIT: Function, INFO: Function, DEBUG: Function, WARNING: Function, ERROR: Function}}
 */
function makeLogger(applicationPart) {
    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    /**
     * Prints a message to STDOUT.
     * If debugging is enabled (via process.env["debug"] equals "true") then messages of the type DEBUG will be printed, otherwise they will be omitted!
     *
     * @param type The type of the message.
     * @param message The message to print.
     */
    function log(type, message) {
        var debug = process.env["debug"];

        if(debug === "true" || ((debug === undefined || debug === "false") && type !== "DEBUG")) {
            var time = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
            console.log("[" + time + "]\t" + applicationPart + " \t [" + type + "] \t==> " + message);
        }
    }

    /**
     * Prints a message to STDERR.
     *
     * @param type The type of the message.
     * @param message The message to print.
     */
    function error(type, message) {
        var time = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
        console.error("[" + time + "]\t" + applicationPart + " \t [" + type + "] \t==> " + message);
    }

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    return {
        /**
         * Print a message of the type INIT.
         *
         * @param message The message to print.
         */
        INIT : function(message) {
            log("INIT", message);
        },
        /**
         * Print a message of the type INFO.
         *
         * @param message The message to print.
         */
        INFO : function(message) {
            log("INFO", message);
        },
        /**
         * Print a message of the type DEBUG.
         *
         * @param message The message to print.
         */
        DEBUG : function(message) {
            log("DEBUG", message);
        },
        /**
         * Print a message of the type WARNING.
         *
         * @param message The message to print.
         */
        WARNING : function(message) {
            log("WARNING", message);
        },
        /**
         * Print a message of the type ERROR.
         * This message will be printed to the STDERR output!
         *
         * @param message The message to print.
         */
        ERROR : function(message) {
            error("ERROR", message);
        }
    };
}

exports.makeLogger = makeLogger;