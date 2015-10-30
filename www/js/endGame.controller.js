(function() {
    'use strict';

    angular.module('devoxx').controller('EndGameCtrl', EndGameCtrl);

    EndGameCtrl.$inject =['$scope'];

    function EndGameCtrl($scope, $location) {
        console.log("EndGameCtrl loaded");

        $scope.name = window.sessionStorage.getItem('name');
        $scope.winner = window.sessionStorage.getItem('winner');

        $scope.newGame = function() {
            $location.path('/game');
        }
    }
})();
