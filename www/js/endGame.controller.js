(function() {
    'use strict';

    angular.module('devoxx').controller('EndGameCtrl', EndGameCtrl);

    EndGameCtrl.$inject =['$scope'];

    function EndGameCtrl($scope, $location) {
        console.log("EndGameCtrl loaded");

        $scope.name = window.sessionStorage.getItem('name');

        $scope.newGame = function() {
            $location.path('/game');
        }
    }
})();
