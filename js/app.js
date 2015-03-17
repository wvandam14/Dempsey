var soccerStats = angular.module('soccerStats', ['ngRoute','ngSanitize','ngResource'])
    .config(function ($routeProvider) {

        //Default Route
        $routeProvider.otherwise({ redirectTo: '/login' });

        $routeProvider.when('/login', {
            templateUrl: 'templates/pages/login-page.html',
            controller: 'loginController',
            scope:{}
        });

        $routeProvider.when('/registration', {
        	templateUrl: './templates/pages/registration-page.html',
        	controller: 'registrationController',
        	scope:{}
        });

        $routeProvider.when('/home', {
            templateUrl: './templates/pages/home-page.html',
            controller: 'homeController',
            scope: {}
        });
    }
);
