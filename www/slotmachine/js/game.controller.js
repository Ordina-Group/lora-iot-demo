(function () {
    'use strict';

    angular .module('devoxx')
            .controller('GameCtrl', ['$scope', '$mdDialog', 'nodeSocketService', '$timeout',

            function($scope, $mdDialog, nodeSocketService, $timeout) {

                $scope.name = window.sessionStorage.getItem('name');
                $scope.counter = 3;

                //State machine variables
                var state = {
                    played: false,
                    winner: false,
                    intervalLaunch: null,
                    intervalLoop: null,
                    closeButNoCigar: false,
                    slots: null
                };

                var mustRegister = false;

                $scope.showAdvanced = function (ev) {
                    state.played = true;

                    if(mustRegister) {
                        $mdDialog
                         .show({
                         templateUrl: 'register.html',
                         parent: angular.element(document.body),
                         targetEvent: ev,
                         clickOutsideToClose: false,
                         escapeToClose: false
                         }).then(function () {

                         }, function () {
                         state.played = false;
                         })
                    } else {
                        state.played = false;
                    }
                };

                //When the page is loaded, set up our game components & state.
                $(document).ready(function () {
                    //Setup viewport resizing
                    resize();
                    $(window).resize(function() {
                        resize();
                    });

                    //Set up the slots with which we will play the game.
                    setupSlots();

                    //Handle play events from both the page and the remote button.
                    nodeSocketService.registerCallback(handleButtonPresses);
                    $("#playButton").click(play);
                });

                /*-------------------------------------------------------------------------------------------------
                 * ------------------------------------------------------------------------------------------------
                 *                                        Private functions
                 * ------------------------------------------------------------------------------------------------
                 ------------------------------------------------------------------------------------------------*/
                /**
                 * Handles screen resize events.
                 * This will scale our slot machine to fit the page correctly.
                 */
                function resize() {
                    var viewportHeight = window.innerHeight;

                    var hectoScale = viewportHeight * 0.095;
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
                 *
                 * @param data The data object that contains the message that was received from the remote server via the socket.
                 */
                function handleButtonPresses(data) {
                    //Button pressed!
                    if(data.buttonPressed === true) {
                        //Only play if allowed!
                        if(state.played === false) {
                            play();
                        } else {
                            document.getElementById('denied').play();
                        }
                    } else {
                        //Button released!
                    }
                }

                /**
                 * Play a new game.
                 * Starts the slot animations.
                 */
                function play() {
                    if(!state.played) {
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

                    if($scope.counter === 3) {
                        $('#coin1').hide();
                    }
                    else if($scope.counter === 2) {
                        $('#coin2').hide();
                    }
                    else if($scope.counter === 1) {
                        $('#coin3').hide();
                    }
                }

                /**
                 * Executed each time a slot finished animating.
                 */
                function onSlotAnimationComplete() {
                    switch (this.element[0].id) {
                        case 'machine3':

                            //See if the player has won the game.
                            if (state.slots[0].active === state.slots[1].active && state.slots[1].active === state.slots[2].active) {
                                state.winner = true;
                                state.closeButNoCigar = false;
                                nodeSocketService.sendJSONMessage({winner: true});
                                document.getElementById('victory').play();
                                setTimeout(startFireworks, 1500);
                                setTimeout(showEndGame, 1500);

                            } else if (state.slots[0].active === state.slots[1].active ||
                                state.slots[1].active === state.slots[2].active ||
                                state.slots[0].active === state.slots[2].active) {
                                state.played = false;
                                $scope.counter--;

                                if ($scope.counter === 0) {
                                    $timeout(function () {
                                        document.getElementById('loser').play();
                                    }, 1500);
                                    state.played = true;
                                    state.winner = false;
                                    state.closeButNoCigar = true;
                                    nodeSocketService.sendJSONMessage({winner: false});
                                    setTimeout(showEndGame, 1500);
                                }
                            }
                            else {
                                state.played = false;
                                $scope.counter--;
                                if ($scope.counter === 0) {
                                    $timeout(function () {
                                        document.getElementById('loser').play();
                                    }, 1500);
                                    state.played = true;
                                    state.winner = false;
                                    state.closeButNoCigar = false;
                                    nodeSocketService.sendJSONMessage({winner: false});
                                    setTimeout(showEndGame, 1500);
                                }
                            }
                            window.sessionStorage.setItem('winner', (state.winner ? 1 : 0));
                            window.sessionStorage.setItem('closeButNoCigar', (state.closeButNoCigar ? 1 : 0));
                            window.sessionStorage.setItem('active1', state.slots[0].active);
                            window.sessionStorage.setItem('active2', state.slots[1].active);
                            window.sessionStorage.setItem('active3', state.slots[2].active);

                            break;
                    }
                }

                /**
                 * Shows the endgame sub page.
                 */
                function showEndGame(){
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
                }

                /**
                 * Starts the fireworks effects.
                 */
                function startFireworks(){
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
            }
    ]);

})();