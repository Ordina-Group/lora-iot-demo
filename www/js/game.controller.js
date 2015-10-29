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

            function startFireworks(){
                document.body.appendChild(canvas);
                canvas.width = SCREEN_WIDTH;
                canvas.height = SCREEN_HEIGHT;
                setInterval(launch, 100);
                setInterval(launch, 200);
                setInterval(launch, 300);
                setInterval(launch, 400);
                setInterval(launch, 500);
                setInterval(loop, 1000 / 60);
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
