var Config = function() {

    return {
        settings: {
            httpPort: 7080,
            socketPort: 7081,

            webContentFolder: "www",

            enableArduinoFunctionality: false
        },

        keys: {
            proximusOwner: "",
            proximusBearerToken: ""
        }
    }
};

module.exports = Config;