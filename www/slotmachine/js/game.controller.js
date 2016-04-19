(function () {
    'use strict';

    angular.module('devoxx')
        .controller('GameCtrl', GameCtrl);

    GameCtrl.$inject = ['$scope', '$mdDialog', 'nodeSocketService', '$timeout'];

    function GameCtrl($scope, $mdDialog, nodeSocketService, $timeout) {

        $scope.name = window.sessionStorage.getItem('name');
        $scope.counter = 3;

        var state = {
            played: false,
            winner: false,
            intervalLaunch: null,
            intervalLoop: null,
            closeButNoCigar: false,
            slots: null
        };

        var mustRegister = false;

        $scope.showAdvanced = function () {
            if (mustRegister) {
                state.played = true;
                showRegisterDialog()
            } else {
                state.played = false;
            }
        };

        $(document).ready(init);

        /*-------------------------------------------------------------------------------------------------
         * ------------------------------------------------------------------------------------------------
         *                                        Private functions
         * ------------------------------------------------------------------------------------------------
         ------------------------------------------------------------------------------------------------*/
        /**
         * Initializes the resize events
         * Initializes the slots
         * Initializes the socket
         * Initializes click event on play button
         */
        function init() {
            resize();
            $(window).resize(function () {
                resize();
            });

            setupSlots();

            nodeSocketService.registerCallback(handleButtonPresses);
            $("#playButton").click(play);
        }


        /**
         * Handles screen resize events.
         * This will scale our slot machine to fit the page correctly.
         */
        function resize() {
            var hectoScale = window.innerHeight * 0.095;
            hectoScale = hectoScale / 100;
            $("#scalingWrapper").css('transform', 'scale(' + hectoScale + ')');
        }

        /**
         * Sets up the slots to play the game.
         */
        function setupSlots() {
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

        /**
         * Handles button presses that come from the websocket.
         * @param data The data object that contains the message that was received from the remote server via the socket.
         */
        function handleButtonPresses(data) {
            if (data.buttonPressed === true) {
                if (state.played === false) {
                    play();
                }
            }
        }

        /**
         * Play a new game.
         * Starts the slot animations.
         */
        function play() {
            if (!state.played) {
                state.played = true;

                document.getElementById('roller').pause();
                document.getElementById('roller').currentTime = 0;
                document.getElementById('roller').play();
                state.slots[0].shuffle(5, onSlotAnimationComplete);

                setTimeout(function () {
                    state.slots[1].shuffle(5, onSlotAnimationComplete);
                }, 500);

                setTimeout(function () {
                    state.slots[2].shuffle(5, onSlotAnimationComplete);
                }, 1000);
            }

            if ($scope.counter === 3) {
                $('#coin1').hide();
            }
            else if ($scope.counter === 2) {
                $('#coin2').hide();
            }
            else if ($scope.counter === 1) {
                $('#coin3').hide();
            }
        }

        /**
         * Executed each time a slot finished animating.
         */
        function onSlotAnimationComplete() {
            if (this.element[0].id === 'machine3') {
                if (hasJackpot()) {
                    state.winner = true;
                    state.closeButNoCigar = false;
                    nodeSocketService.sendJSONMessage({winner: true});
                    document.getElementById('victory').play();
                    setTimeout(function () {
                        startFireworks();
                        showEndGame();
                    }, 1500);
                }
                else {
                    state.played = false;
                    $scope.counter--;

                    if ($scope.counter === 0) {
                        state.played = true;
                        state.winner = false;
                        state.closeButNoCigar = wasItClose();
                        nodeSocketService.sendJSONMessage({winner: false});
                        $timeout(function () {
                            document.getElementById('loser').play();
                            showEndGame()
                        }, 1500);
                    }
                }
                updateSessionStorage();
            }
        }

        function hasJackpot() {
            return (state.slots[0].active === state.slots[1].active &&
            state.slots[1].active === state.slots[2].active);
        }

        function wasItClose() {
            return (state.slots[0].active === state.slots[1].active ||
            state.slots[1].active === state.slots[2].active ||
            state.slots[0].active === state.slots[2].active);
        }

        function updateSessionStorage() {
            window.sessionStorage.setItem('winner', (state.winner ? 1 : 0));
            window.sessionStorage.setItem('closeButNoCigar', (state.closeButNoCigar ? 1 : 0));
            window.sessionStorage.setItem('active1', state.slots[0].active);
            window.sessionStorage.setItem('active2', state.slots[1].active);
            window.sessionStorage.setItem('active3', state.slots[2].active);
        }

        /**
         * Shows the endgame sub page.
         */
        function showEndGame() {
            $mdDialog.show({
                templateUrl: 'endGame.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                escapeToClose: false
            }).then(function (answer) {
                $scope.counter = 3;
                $scope.showAdvanced(this);
                stopFireworks();
            }, function () {
            });

            setTimeout(function () {
                $("#newGame").click();
            }, 5000);
        }

        /**
         * Shows the register sub page.
         */
        function showRegisterDialog() {
            $mdDialog.show({
                templateUrl: 'register.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                escapeToClose: false
            }).then(function () {

            }, function () {
                state.played = false;
            });
        }

        /**
         * Starts the fireworks effects.
         */
        function startFireworks() {
            document.getElementById('fireworks').play();
            document.body.appendChild(canvas);
            canvas.width = SCREEN_WIDTH;
            canvas.height = SCREEN_HEIGHT;
            state.intervalLaunch = setInterval(launch, 500);
            state.intervalLoop = setInterval(loop, 1000 / 60);
        }

        /**
         * Stops the fireworks effects.
         */
        function stopFireworks() {
            document.getElementById('fireworks').pause();
            clearInterval(state.intervalLaunch);
            clearInterval(state.intervalLoop);
            try {
                document.body.removeChild(canvas);
            } catch (e) {
            }
            particles = [];
            rockets = [];
        }
    }
})();