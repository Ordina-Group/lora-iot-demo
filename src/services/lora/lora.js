var LoRaService = function() {
    var logger          = require("../../logging/logger").makeLogger("SERV-LORA------");
    //var ws              = require("nodejs-websocket");

    //Private variables.
    var socketServer    = null;

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.setupStream = function() {
        logger.INFO("Setting up LoRa stream...");
        //socketServer = ws.createServer(onConnection).listen(8081);
    };

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/

    /*
     * Web socket functions
     */

    function onConnection(connection) {
        logger.DEBUG("New connection");

        try {
            connection.on("text", onMessageFromConnection);
            connection.on("close", onConnectionClosed);
        } catch (error) {
            logger.ERROR("Cannot handle new connection!");
        }
    }

    function onMessageFromConnection(message) {
        try {
            logger.DEBUG("Message from connection: " + message);
            var data = JSON.parse(message);

            //After registration message => A new user has been registered!
            if(data.registered === true) {
               //TODO: Implement!
            }

            //After game message => Check for winner of loser.
            if(data.winner === true) {
                //TODO: Implement!
            } else if(data.winner === false) {
               //TODO: Implement!
            }

            if(data.reset === true) {
                //TODO: Implement!
            }

            //Ignore all other cases and messages!
        } catch(error) {
            logger.ERROR("An error occurred during web socket message handling...");
            logger.ERROR("Continuing, not critical!");
        }
    }

    function broadcastMessage(message) {
        logger.DEBUG("Broadcasting message.");

        socketServer.connections.forEach(
            function (connection) {
                connection.sendText(JSON.stringify(message, null, 4))
            }
        );
    }

    function onConnectionClosed(code, reason) {
        logger.DEBUG("Connection closed");
    }
};

module.exports = LoRaService;