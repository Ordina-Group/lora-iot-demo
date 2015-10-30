(function () {
    'use strict';


    angular.module('devoxx')
        .controller('GameCtrl', GameCtrl);
    GameCtrl.$inject = ['$scope', '$location', '$mdDialog'];

    function GameCtrl($scope, $location, $mdDialog) {
        $scope.status = '  ';

        $scope.name = window.sessionStorage.getItem('name');

        $scope.showAdvanced = function (ev) {
            $mdDialog.show({
                templateUrl: 'register.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

        $(document).ready(function () {
            var machine1 = $("#machine1").slotMachine({
                active: 1,
                delay: 300
            });

            var machine2 = $("#machine2").slotMachine({
                active: 1,
                delay: 300
            });

            var machine3 = $("#machine3").slotMachine({
                active: 1,
                delay: 300
            });

            var played = false;

            function onComplete(active) {
                switch (this.element[0].id) {
                    case 'machine3':
                        var winner = false;
                        if (machine1.active == machine2.active && machine2.active == machine3.active) {
                            setTimeout(startFireworks, 1500);
                            winner = true;
                        }
                        window.sessionStorage.setItem('winner', (winner? 1 : 0));
                        setTimeout(showEndGame, 1500);
                        break;
                }
            }

            function showEndGame(){
                $mdDialog.show({
                    templateUrl: 'endGame.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: false
                }).then(function (answer) {
                    $scope.showAdvanced(this);
                    stopFireworks();
                    played = false;
                }, function () {
                });
            }

            var intervalLaunch;
            var intervalLoop;

            function startFireworks(){
                document.getElementById('fireworks').play()
                document.body.appendChild(canvas);
                canvas.width = SCREEN_WIDTH;
                canvas.height = SCREEN_HEIGHT;
                intervalLaunch = setInterval(launch, 500);
                intervalLoop = setInterval(loop, 1000 / 60);
            }

            function stopFireworks(){
                document.getElementById('fireworks').pause();
                clearInterval(intervalLaunch);
                clearInterval(intervalLoop);
                try {
                    document.body.removeChild(canvas);
                }catch(e){}
                particles = [];
                rockets = [];
            }


            $("#slotMachineButton1").click(function () {
                if(!played) {
                    played = true;

                    document.getElementById('roller').play()
                    machine1.shuffle(5, onComplete);

                    setTimeout(function () {
                        machine2.shuffle(5, onComplete);
                    }, 500);

                    setTimeout(function () {
                        machine3.shuffle(5, onComplete);
                    }, 1000);
                }
            })
        });

    }

})();