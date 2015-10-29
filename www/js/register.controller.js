(function () {
    'use strict';


    angular.module('devoxx')
        .controller('RegisterCtrl', RegisterCtrl);
    RegisterCtrl.$inject = ['$scope', '$location', '$mdToast', '$timeout', '$mdDialog'];

    function RegisterCtrl($scope, $location, $mdToast, $timeout, $mdDialog) {

        console.log("gamectrl loaded");
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

    angular.module('devoxx')
        .controller('ToastCtrl', function ($scope, $mdToast) {
            $scope.closeToast = function () {
                $mdToast.hide();
            };
        });

})();
