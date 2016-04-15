var IntervalWorker = function() {
    var logger          = require("../../logging/logger").makeLogger("INTERVALWORKER-");
    var messageFactory  = require("../../util/messagefactory").getInstance();

    //Required private imports for functionality.
    var LoRa            = require("../../services/lora/lora");
    var loRa            = null;

    init();

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    /**
     * Sets up the interval worker.
     * Sets up the arduino connection.
     * Starts and interval and after the given interval both functions are executed again.
     */
    function init() {
        loRa = new LoRa();

        //Set up the arduino.
        setupLoRaStream();

        //Set up the interval to update the data regularly.
        setInterval(function() {
            logger.INFO("Refreshing data (8 minutes elapsed)");

            //In the off chance the websocket dies, it will be automatically restarted here!
            setupLoRaStream();
        }, 480000 );

        logger.INFO("Interval worker started!");
    }

    /**
     * Sets up the arduino so external applications can get realtime information of what happens with the arduino!
     */
    function setupLoRaStream() {
        logger.INFO("Attempting to setup LoRa stream...");
        loRa.setupStream();
    }
};

module.exports = IntervalWorker;