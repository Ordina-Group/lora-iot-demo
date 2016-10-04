"use strict";

var Config = (function() {
    var instance;

    function init() {
        /*-------------------------------------------------------------------------------------------------
         * ------------------------------------------------------------------------------------------------
         *                                   Private vars/functions
         * ------------------------------------------------------------------------------------------------
         ------------------------------------------------------------------------------------------------*/
        function arduinoImplementations() {
            return {
                slotMachine:                    "ArduinoSlotMachine",
                jaxLondon:                      "ArduinoJaxLondon"
            }
        }

        function nativeArduinoImplementations() {
            return {
                jaxLondon:                      "ArduinoSerialJaxLondon",
                sensy:                          "ArduinoSerialSensy"
            }
        }

        /*-------------------------------------------------------------------------------------------------
         * ------------------------------------------------------------------------------------------------
         *                                     Public vars/functions
         * ------------------------------------------------------------------------------------------------
         ------------------------------------------------------------------------------------------------*/
        return {
            settings: {
                httpPort:                       7080,
                socketPort:                     7081,

                webContentFolder:               "www"
            },

            keys: {
                proximusOwner:                  "",
                proximusBearerToken:            ""
            },

            arduino: {
                enableArduinoFunctionality:     true,
                enableNativeArduinoSerial:      true,

                nativeArduinoPortName:          "usbmodem",
                nativeActiveImplementation:     nativeArduinoImplementations().jaxLondon,
                nativeImplementations:          nativeArduinoImplementations(),

                activeImplementation:           arduinoImplementations().jaxLondon,
                implementations:                arduinoImplementations()
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

module.exports = Config;