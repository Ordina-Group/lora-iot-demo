var LedStripUtils = function(ledStrip, amountOfLeds) {
    var logger          = require("../../logging/logger").makeLogger("UTIL-LEDSTRIP--");

    //Private constants.
    const self            = this;
    const framerate       = 8;//Any value higher than 8 starts to give problems (some LEDs not working, massive delays...)
    const ledCount        = amountOfLeds;

    var animationRunning  = false;

    //Private variables.
    var fadeVars = {
        steps: 0,
        currentStep: 0,
        durationPerStep: 0,
        fadeInterval: null,

        additions: null,
        floatColors: null,
        newColors: null,
        clbck: null
    };

    var cycleVars = {
        currentCycle: 0,
        maxCycles: 0,

        cyclesColors: null,
        cycleDuration: null
    };


    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.startCycleFade = function(targetColorsArray, singleFadeDuration){
        animationRunning = true;

        cycleVars.currentCycle  = 0;
        cycleVars.maxCycles     = targetColorsArray.length;

        cycleVars.cyclesColors  = targetColorsArray;
        cycleVars.cycleDuration = singleFadeDuration;

        fadeCycle();
    };

    this.stopCycleFade = function() {
        animationRunning = false;
    };

    /**
     * Fades the current colors of the led strip to the given color over the given time.
     * When the animation completes, the callback function is called.
     *
     * @param targetColors JSON color object: {"R": number, "G": number, "B": number}
     * @param fadeDuration Duration for the fade in milliseconds
     * @param callback Function to call when the fade has completed.
     */
    this.fade = function(targetColors, fadeDuration, callback) {
        fadeVars.currentStep     = 0;
        fadeVars.steps           = fadeDuration / 1000 * framerate;
        fadeVars.durationPerStep = 1000 / framerate;
        fadeVars.newColors       = targetColors;
        fadeVars.clbck           = callback;

        fadeVars.floatColors     = [];
        fadeVars.additions       = [];

        for(var i = 0; i < ledCount; i++) {
            var ledColors       = ledStrip.pixel(i).color();

            var floatColor      = {};
            floatColor.r        = ledColors.r;
            floatColor.g        = ledColors.g;
            floatColor.b        = ledColors.b;
            fadeVars.floatColors.push(floatColor);

            var addition        = {};
            addition.redStep    = (targetColors.R - floatColor.r) / fadeVars.steps;
            addition.greenStep  = (targetColors.G - floatColor.g) / fadeVars.steps;
            addition.blueStep   = (targetColors.B - floatColor.b) / fadeVars.steps;
            fadeVars.additions.push(addition);
        }

        fadeVars.fadeInterval = setInterval(fadeStep, fadeVars.durationPerStep);
    };

    /**
     *
     */
    this.startOffsetAnimation = function() {

    };

    /**
     *
     */
    this.stopOffsetAnimation = function() {
        animationRunning = false;
    };

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    function fadeCycle() {
        logger.INFO("Fade cycle started!");

        //Hold the current color for one whole second.
        setTimeout(function() {
            if(cycleVars.currentCycle == cycleVars.maxCycles) {
                cycleVars.currentCycle = 0;
            }
            if(!animationRunning) {
                return;
            }

            var targetColor = cycleVars.cyclesColors[cycleVars.currentCycle++];
            self.fade(targetColor, cycleVars.cycleDuration, fadeCycle);
        }, 1000);
    }

    /**
     * Performs 1 step in the fade animation.
     * If the current step is the last step, the interval for the animation will be cleared.
     */
    function fadeStep() {
        logger.DEBUG("Fade step: " + fadeVars.currentStep);

        //Animation step calculations.
        for(var i = 0; i < ledCount; i++) {
            var led         = ledStrip.pixel(i);
            var addition    = fadeVars.additions[i];

            var floatColor  = fadeVars.floatColors[i];

            var newR = floatColor.r + addition.redStep;
            var newG = floatColor.g + addition.greenStep;
            var newB = floatColor.b + addition.blueStep;

            floatColor.r = Math.min(Math.max(0, newR), 255);
            floatColor.g = Math.min(Math.max(0, newG), 255);
            floatColor.b = Math.min(Math.max(0, newB), 255);

            var newColor = "rgb(" + Math.floor(floatColor.r) + "," + Math.floor(floatColor.g) + "," + Math.floor(floatColor.b) + ")";
            //logger.INFO("Fade step: " + currentStep + " " + newColor);
            led.color(newColor);
        }
        ledStrip.show();

        //Check to see if the animation needs to stop, or if this was the last step in the animation.
        if(animationRunning && fadeVars.currentStep++ == fadeVars.steps - 1) {
            logger.INFO("Fade completed!");

            //This last fade is required because the last is not the correct target color, this is because of float rounding errors!
            ledStrip.color("rgb(" + fadeVars.newColors.r + "," + fadeVars.newColors.g + "," + fadeVars.newColors.b+ ")");
            ledStrip.show();

            //Clear the animation interval.
            clearInterval(fadeVars.fadeInterval);
            //Call the callback function.
            fadeVars.clbck();
        }
    }
};

module.exports = LedStripUtils;