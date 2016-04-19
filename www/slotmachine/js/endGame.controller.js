(function() {
    'use strict';

    angular .module('devoxx')
            .controller('EndGameCtrl', ['$scope', '$mdDialog', 'nodeSocketService',

            function($scope, $mdDialog, nodeSocketService) {

                $scope.name = window.sessionStorage.getItem('name');

                $scope.winner = function (){
                    return window.sessionStorage.getItem('winner') == 1;
                };

                $scope.closeButNoCigar = function() {
                    return window.sessionStorage.getItem('closeButNoCigar') == 1;
                };

                $scope.active1 = function() {
                    var active = parseInt(window.sessionStorage.getItem('active1'));
                    return 'img/slot' + (active + 1) + '.png';
                };

                $scope.active2 = function() {
                    var active = parseInt(window.sessionStorage.getItem('active2'));
                    return 'img/slot' + (active + 1) + '.png';
                };

                $scope.active3 = function() {
                    var active = parseInt(window.sessionStorage.getItem('active3'));
                    return 'img/slot' + (active + 1) + '.png';
                };

                $scope.newGame = function() {
                    $mdDialog.hide();
                    $('#coin1').show();
                    $('#coin2').show();
                    $('#coin3').show();
                    nodeSocketService.sendJSONMessage({reset: true});
                }
            }
        ]);
})();