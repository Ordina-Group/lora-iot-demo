(function () {
    'use strict';


    angular .module('devoxx')
            .controller('RegisterCtrl', RegisterCtrl);
    RegisterCtrl.$inject = ['$scope', '$mdToast', '$timeout', '$mdDialog', 'Restangular', 'nodeSocketService'];

    function RegisterCtrl($scope, $mdToast, $timeout, $mdDialog, Restangular, nodeSocketService) {
        window.sessionStorage.clear();

        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
        $scope.toastPosition = angular.extend({}, last);
        $scope.getToastPosition = function () {
            sanitizePosition();
            return Object.keys($scope.toastPosition)
                .filter(function (pos) {
                    return $scope.toastPosition[pos];
                })
                .join(' ');
        };
        function sanitizePosition() {
            var current = $scope.toastPosition;
            if (current.bottom && last.top) current.top = false;
            if (current.top && last.bottom) current.bottom = false;
            if (current.right && last.left) current.left = false;
            if (current.left && last.right) current.right = false;
            last = angular.extend({}, current);
        }
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
        $scope.validate = function (person) {

            if ($scope.registerForm.$valid) {
                window.sessionStorage.setItem('name', person.name);
                window.sessionStorage.setItem('email', person.email);
                window.sessionStorage.setItem('company', person.entity);
                window.sessionStorage.setItem('interested', person.interested);
                if(person.interested === undefined){
                    person.interested =false;
                }
                if(person.entity === undefined){
                    person.entity="";
                }

                //Send information to the socket and call the /register endpoint.
                nodeSocketService.sendJSONMessage({registered: true});
                Restangular.all('register').post(person);

                $scope.showActionToast();
                $timeout(function () {
                    $mdDialog.cancel();
                }, 1000);
            }
        };
        $scope.showActionToast = function () {
            var toast = $mdToast.simple()
                .content('Successfully registered! Starting Game...')
                .position($scope.getToastPosition());
            $mdToast.show(toast);
        }
    }
})();
