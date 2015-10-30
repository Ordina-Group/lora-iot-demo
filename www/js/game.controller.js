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

        var index1 = 0;
        var index2 = 0;
        var index3 = 0;

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

            function onComplete(active) {
                switch (this.element[0].id) {
                    case 'machine3':
                        index3 = this.active;

                        var winner = false;
                        if (machine1.active == machine2.active && machine2.active == machine3.active) {
                            setTimeout(startFireworks, 900);
                            winner = true;
                        }
                        window.sessionStorage.setItem('winner', (winner? 1 : 0));

                        showEndGame();
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
                }, function () {
                });
            }

            var intervalLaunch;
            var intervalLoop;

            function startFireworks(){
                document.body.appendChild(canvas);
                canvas.width = SCREEN_WIDTH;
                canvas.height = SCREEN_HEIGHT;
                intervalLaunch = setInterval(launch, 500);
                intervalLoop = setInterval(loop, 1000 / 60);
            }

            function stopFireworks(){
                clearInterval(intervalLaunch);
                clearInterval(intervalLoop);
                context.fillStyle = "rgba(0, 0, 0, 1)";
                context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
                try {
                    document.body.removeChild(canvas);
                }catch(e){

                }
                particles = [];
                rockets = [];
            }

            $("#slotMachineButton1").click(function () {
                document.getElementById('roller').play()

                machine1.shuffle(5, onComplete);

                setTimeout(function () {
                    machine2.shuffle(5, onComplete);
                }, 500);

                setTimeout(function () {
                    machine3.shuffle(5, onComplete);
                }, 1000);

            })
        });

    }

})();