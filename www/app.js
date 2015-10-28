(function () {
    'use strict';

    angular
        .module('devoxx', [
            'ngMessages',
            'ngRoute',
            'ngSanitize',
            'restangular',
            'ngMaterial',
            'ngMdIcons',
            'ngAnimate',
            'ngAria'
        ])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    redirectTo: '/register'
                })

                .when('/register', {
                    templateUrl: 'register.html',
                    controller: 'RegisterCtrl'
                })
                .when('/game', {
                    templateUrl: 'game.html',
                    controller: 'GameCtrl'
                })
                .when('/endGame', {
                    templateUrl: 'endGame.html',
                    controller: 'endGameCtrl'
                })


                .otherwise({
                    redirectTo: '/'
                });
        });
})();
