var CallbackManager = (function() {
    var logger = require("../logging/logger").makeLogger("UTIL-CLBCKMNGR-");
    var instance;

    /**
     * Private constructor which creates the actual CallbackManager instance.
     *
     * @returns {{generateIdForCallback: Function, returnCallbackForId: Function, returnAndRemoveCallbackForId: Function}}
     */
    function init() {
        /*-------------------------------------------------------------------------------------------------
         * ------------------------------------------------------------------------------------------------
         *                                   Private vars/functions
         * ------------------------------------------------------------------------------------------------
         ------------------------------------------------------------------------------------------------*/
        var callbacks = {};

        /**
         * Private function that can print out the stored callbacks.
         */
        function listCallbacks(){
            logger.DEBUG(JSON.stringify(callbacks));
        }

        /*-------------------------------------------------------------------------------------------------
         * ------------------------------------------------------------------------------------------------
         *                                     Public vars/functions
         * ------------------------------------------------------------------------------------------------
         ------------------------------------------------------------------------------------------------*/
        return {
            /**
             * Generates a new callback id for the given callback.
             * Actually all this does is make a new id by taking the current time in millis and adding a random salt.
             *
             * @param callback The callback to assign an id to.
             * @returns {string} The generated id.
             */
            generateIdForCallback : function generateIdForCallback(callback) {
                var id = new Date().getTime() + "--" + (Math.random() * 6);
                callbacks[id] = callback;

                logger.DEBUG("Id generated for callback: " + id);
                return id;
            },
            /**
             * Returns the callback function for the given id.
             *
             * @param id The id for which to return the callback.
             * @returns The callback function.
             */
            returnCallbackForId : function returnCallbackForId(id) {
                logger.DEBUG("Returning callback for id: " + id);

                return callbacks[id];
            },
            /**
             * Returns the callback function for the given id.
             * It will also delete the callback from the local cache.
             *
             * @param id The id for which to return the callback.
             * @returns The callback function.
             */
            returnAndRemoveCallbackForId: function returnAndRemoveCallbackForId(id) {
                logger.DEBUG("Returning and deleting callback for id: " + id);

                var clbk = callbacks[id];
                delete callbacks[id];
                return clbk;
            }
        };
    }

    return {
        /**
         * Returns the singleton instance.
         * @returns {*}
         */
        getInstance: function getInstance() {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();

module.exports = CallbackManager;