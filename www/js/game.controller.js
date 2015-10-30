(function () {
    'use strict';


    angular.module('devoxx')
        .controller('GameCtrl', GameCtrl);
    GameCtrl.$inject = ['$scope', '$location', '$mdDialog'];

    function GameCtrl($scope, $location, $mdDialog) {
        $scope.status = '  ';


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
                    case 'machine1':
                        index1 = this.active;
                        break;
                    case 'machine2':
                        index2 = this.active;
                        break;
                    case 'machine3':
                        index3 = this.active;

                        if(index1 == index2 && index2 == index3)
                            setTimeout(startFireworks, 500);
                        break;
                }
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
                document.body.removeChild(canvas);
                particles = [];
                rockets = [];
            }

            $("#slotMachineButton1").click(function () {

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
