(function () {
    'use strict';

    angular .module('devoxx')
            .controller('GameCtrl', GameCtrl);
    GameCtrl.$inject = ['$scope', '$location', '$mdDialog', 'nodeSocketService'];

    function GameCtrl($scope, $location, $mdDialog, nodeSocketService) {
        $scope.status = '  ';
        $scope.name = window.sessionStorage.getItem('name');

        $scope.showAdvanced = function (ev) {
            $mdDialog
            .show({
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

        //When the page is loaded, set up our game components & state.
        $(document).ready(function () {

            //State machine variables
            var state = {
                played: false,
                winner: false,
                intervalLaunch: null,
                intervalLoop: null,
                closeButNoCigar: false,

                slots: null
            };

            nodeSocketService.registerCallback(function onMessageFromSocket(data) {
                if(data.buttonPressed === true) {
                    //Button pressed!
                    if(state.played === false) {
                        $("#slotMachineButton1").trigger('click');
                    }
                } else {
                    //Button released!
                }
            });
            setupSlots(state);

            function onComplete() {
                switch (this.element[0].id) {
                    case 'machine3':

                        //See if the player has won the game.
                        if (state.slots[0].active === state.slots[1].active && state.slots[1].active === state.slots[2].active) {
                            state.winner = true;
                            state.closeButNoCigar = false;
                            nodeSocketService.sendJSONMessage({winner: true});

                            setTimeout(startFireworks, 1500);
                        } else if (state.slots[0].active === state.slots[1].active ||
                            state.slots[1].active === state.slots[2].active ||
                            state.slots[0].active === state.slots[2].active) {

                            state.winner = false;
                            state.closeButNoCigar = true;
                            nodeSocketService.sendJSONMessage({winner: false});
                        }
                        else {
                            state.winner = false;
                            state.closeButNoCigar = false;
                            nodeSocketService.sendJSONMessage({winner: false});
                        }

                        window.sessionStorage.setItem('winner', (state.winner ? 1 : 0));
                        window.sessionStorage.setItem('closeButNoCigar', (state.closeButNoCigar ? 1 : 0));
                        window.sessionStorage.setItem('active1', state.slots[0].active);
                        window.sessionStorage.setItem('active2', state.slots[1].active);
                        window.sessionStorage.setItem('active3', state.slots[2].active);

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
                    state.played = false;
                }, function () {
                });
            }

            function startFireworks(){
                document.getElementById('fireworks').play();
                document.body.appendChild(canvas);
                canvas.width = SCREEN_WIDTH;
                canvas.height = SCREEN_HEIGHT;
                state.intervalLaunch = setInterval(launch, 500);
                state.intervalLoop = setInterval(loop, 1000 / 60);
            }

            function stopFireworks(){
                document.getElementById('fireworks').pause();
                clearInterval(state.intervalLaunch);
                clearInterval(state.intervalLoop);
                try {
                    document.body.removeChild(canvas);
                } catch (e) {}
                particles = [];
                rockets = [];
            }


            $("#slotMachineButton1").click(function () {
                if(!state.played) {
                    state.played = true;

                    document.getElementById('roller').play();
                    state.slots[0].shuffle(5, onComplete);

                    setTimeout(function () {
                        state.slots[1].shuffle(5, onComplete);
                    }, 500);

                    setTimeout(function () {
                        state.slots[2].shuffle(5, onComplete);
                    }, 1000);
                }
            })
        });
    }

    function setupSlots(state) {
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

        state.slots = [machine1, machine2, machine3];
    }

})();