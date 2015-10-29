(function() {
    'use strict';

    angular.module('devoxx').controller('EndGameCtrl', EndGameCtrl);

    EndGameCtrl.$inject =['$scope'];

    function EndGameCtrl($scope, $location) {
        console.log("EndGameCtrl loaded");


    }
})();
