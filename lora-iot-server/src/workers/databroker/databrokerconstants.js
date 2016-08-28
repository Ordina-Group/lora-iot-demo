var DataBrokerConstants = (function() {
    var logger = require("../../logging/logger").makeLogger("CONSTANTS------");

    //Private variables.
    var instance;

    /**
     * Private constructor which creates the actual DataBrokerConstants instance.
     *
     * @returns {{FUNC_SAVE_DATA: string, FUNC_UPDATE_DATA: string, FUNC_RETRIEVE_DATA: string, FUNC_DElETE_DATA: string, FUNC_CREATE_CACHE: string, FUNC_ADD_TO_CACHE: string, FUNC_RETRIEVE_CACHE: string, FUNC_REMOVE_FROM_CACHE: string, FUNC_CLEAR_CACHE: string}}
     */
    function init() {
        /*-------------------------------------------------------------------------------------------------
         * ------------------------------------------------------------------------------------------------
         *                                        Public functions
         * ------------------------------------------------------------------------------------------------
         ------------------------------------------------------------------------------------------------*/
        return {
            FUNC_SAVE_DATA            : "saveData",
            FUNC_UPDATE_DATA          : "updateData",
            FUNC_RETRIEVE_DATA        : "retrieveData",
            FUNC_DElETE_DATA          : "deleteData",

            FUNC_CREATE_CACHE         : "createCache",
            FUNC_ADD_TO_CACHE         : "addToCache",
            FUNC_RETRIEVE_CACHE       : "retrieveCache",
            FUNC_REMOVE_FROM_CACHE    : "removeFromCache",
            FUNC_CLEAR_CACHE          : "clearCache",
            FUNC_APPEND_FILE          : "appendToFile"
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

module.exports = DataBrokerConstants;