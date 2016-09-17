(function () {
    'use strict';

    angular
        .module('devoxx')
        .factory('settingsService', settingsService);

    function settingsService() {
        return {
            getSettings: getSettings
        }
    }

    function getSettings() {
        return {
            numberOfRounds: 3,
            shouldCheat: true,
            gamesToWin: [1, 3]
        }
    }
})();
