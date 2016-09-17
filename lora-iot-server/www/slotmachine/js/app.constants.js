(function () {
    'use strict';

    angular
        .module('devoxx')
        .constant("NUMBER_OF_ROUNDS", 3)
        .constant("SHOULD_CHEAT", true)
        .constant("GAMES_TO_WIN", [1,3]); //empty -> always win last round
})();
