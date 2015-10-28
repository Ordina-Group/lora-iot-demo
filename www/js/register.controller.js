(function () {
    'use strict';


    angular.module('devoxx')
        .controller('RegisterCtrl', RegisterCtrl);
    RegisterCtrl.$inject = ['$scope', '$location'];

    function RegisterCtrl($scope, $location) {

        console.log("gamectrl loaded");
    }

})();
