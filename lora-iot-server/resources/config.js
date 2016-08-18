var Config = function() {

    function arduinoImplementations() {
        return {
            slotMachine:                    "ArduinoSlotMachine",
            jaxLondon:                      "ArduinoJaxLondon"
        }
    }

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
            enableArduinoFunctionality:     false,
            activeImplementation:           arduinoImplementations().slotMachine,
            implementations:                arduinoImplementations()
        }
    };
};

module.exports = Config;