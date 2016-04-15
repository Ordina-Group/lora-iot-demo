(function () {
    'use strict';


    angular .module('devoxx')
            .controller('RegisterCtrl', ['$scope', '$mdToast', '$timeout', '$mdDialog', 'Restangular', 'nodeSocketService',

            function($scope, $mdToast, $timeout, $mdDialog, Restangular, nodeSocketService) {

                window.sessionStorage.clear();

                var last = { bottom:false, top:true, left:false, right:true};
                $scope.toastPosition = angular.extend({}, last);

                $scope.getToastPosition = function () {
                    sanitizePosition();
                    return Object
                        .keys($scope.toastPosition)
                        .filter(function (pos) {
                            return $scope.toastPosition[pos];
                        })
                        .join(' ');
                };

                /**
                 * Validates the entered form and if valid send it to the server.
                 *
                 * @param person The person object contains the data that was entered in the entry form.
                 */
                $scope.validateAndSend = function (person) {
                    //Only process the form if it is valid!
                    if ($scope.registerForm.$valid) {
                        //Bring over the items.
                        window.sessionStorage.setItem('name', person.name);
                        window.sessionStorage.setItem('email', person.email);
                        window.sessionStorage.setItem('company', person.entity);
                        window.sessionStorage.setItem('interested', person.interested);

                        //If the non required fields have been left blank, fill in with sane defauls.
                        if(person.interested === undefined){
                            person.interested = false;
                        }
                        if(person.entity === undefined){
                            person.entity = "";
                        }

                        //Send information to the socket and call the /register endpoint.
                        nodeSocketService.sendJSONMessage({registered: true});
                        Restangular.all('register').post(person);

                        //Show toast and remove the dialog from the screen after one second.
                        $scope.showActionToast('Successfully registered! Starting Game...');
                        $timeout(function () {
                            $mdDialog.cancel();
                        }, 1000);
                    }
                };


                /**
                 * Shows a toast message at a set position.
                 *
                 * @param message The message to display
                 */
                $scope.showActionToast = function (message) {
                    var toast = $mdToast.simple()
                        .content(message)
                        .position($scope.getToastPosition());
                    $mdToast.show(toast);
                };

                /*-------------------------------------------------------------------------------------------------
                 * ------------------------------------------------------------------------------------------------
                 *                                        Private functions
                 * ------------------------------------------------------------------------------------------------
                 ------------------------------------------------------------------------------------------------*/
                /**
                 * Sanitize the position of the toast message.
                 */
                function sanitizePosition() {
                    var current = $scope.toastPosition;
                    if (current.bottom && last.top) current.top = false;
                    if (current.top && last.bottom) current.bottom = false;
                    if (current.right && last.left) current.left = false;
                    if (current.left && last.right) current.right = false;
                    last = angular.extend({}, current);
                }
            }
        ]);
})();
