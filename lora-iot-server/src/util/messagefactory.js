var MessageFactory = (function() {
    var cluster = require("cluster");
    var logger = require("../logging/logger").makeLogger("UTIL-MSGFACTORY");
    var instance;

    /**
     * Private constructor which creates the actual CallbackManager instance.
     *
     * @returns {{TARGET_BROKER: string, TARGET_INTERVAL_WORKER: string, sendSimpleMessage: Function, sendMessageWithHandler: Function}}
     */
    function init() {
        /*-------------------------------------------------------------------------------------------------
         * ------------------------------------------------------------------------------------------------
         *                                     Public vars/functions
         * ------------------------------------------------------------------------------------------------
         ------------------------------------------------------------------------------------------------*/
        return {
            TARGET_BROKER           : "broker",
            TARGET_INTERVAL_WORKER  : "intworker",

            /**
             * Sends a simple message to the master instance.
             *
             * @param target The target should be one of the items defined in this class.
             * @param targetFunction The target function on the broker of intworker. These classes/objects should define these values as constants.
             * @param data The data to send, represented as a JSON object.
             */
            sendSimpleMessage : function(target, targetFunction, data) {
                var payload         = {};
                payload.workerId    = cluster.worker.id;
                payload.target      = target;
                payload.targetFunc  = targetFunction;
                payload.data        = data;
                process.send(payload);
            },
            /**
             * Sends a message that contains a handler object, function and params. After the target was reached and the function executed, the message will be forwarded
             * to be handled by handler object and function with the handler params.
             *
             * @param target The target should be one of the items defined in this class.
             * @param targetFunction The target function on the broker of intworker. These classes/objects should define these values as constants.
             * @param data The data to send, represented as a JSON object.
             * @param handlerObject
             * @param handlerFunction
             * @param handlerParams
             */
            sendMessageWithHandler : function(target, targetFunction, data, handlerObject, handlerFunction, handlerParams) {
                var payload             = {};
                payload.workerId        = cluster.worker.id;
                payload.handler         = handlerObject;
                payload.handlerFunction = handlerFunction;
                payload.handlerParams   = handlerParams;
                payload.target          = target;
                payload.targetFunc      = targetFunction;
                payload.data            = data;
                process.send(payload);
            }
        };
    }

    return {
        /**
         * Returns the singleton instance.
         * @returns {*}
         */
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();

module.exports = MessageFactory;