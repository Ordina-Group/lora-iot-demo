(function () {
    'use strict';


    angular.module('devoxx')
        .controller('GameCtrl', GameCtrl);
    GameCtrl.$inject = ['$scope', '$location'];

    function GameCtrl($scope, $location) {

        console.log("gamectrl loaded");

    }

})();
