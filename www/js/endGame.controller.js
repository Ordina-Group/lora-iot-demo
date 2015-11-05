(function() {
    'use strict';

    angular.module('devoxx').controller('EndGameCtrl', EndGameCtrl);

    EndGameCtrl.$inject = ['$scope', '$mdDialog'];

    function EndGameCtrl($scope, $mdDialog) {
        console.log("EndGameCtrl loaded");

        $scope.name = window.sessionStorage.getItem('name');
        $scope.winner = function (){
            return window.sessionStorage.getItem('winner') == 1;
        };

        $scope.closeButNoCigar = function() {
            return window.sessionStorage.getItem('closeButNoCigar') == 1;
        };

        $scope.active1 = function() {
            var active = parseInt(window.sessionStorage.getItem('active1'));
            var index = active + 1;
            console.log(index);
            return '../img/slot' + index + '.png';
        };

        $scope.active2 = function() {
            var active = parseInt(window.sessionStorage.getItem('active2'));
            var index = active + 1;
            console.log(index);
            return '../img/slot' + index + '.png';
        };

        $scope.active3 = function() {
            var active = parseInt(window.sessionStorage.getItem('active3'));
            var index = active + 1;
            console.log(index);
            return '../img/slot' + index + '.png';
        };

        $scope.newGame = function() {
            $mdDialog.hide();
            //$window.location.reload();
            $('#coin1').show();
            $('#coin2').show();
            $('#coin3').show();
        }
    }
})();
