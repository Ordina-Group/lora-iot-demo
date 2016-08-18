var Config = function() {

    return {
        settings: {
            socketUrl: "ws://localhost",
            //socketUrl: "ws://sensorlabs-frontend-itt.cloudapp.net",
            socketPort: 7081
        }
    }
};

module.exports = Config;