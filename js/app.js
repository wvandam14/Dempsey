// the main module to start the angular application. handles all of the routing and connection between pages
var soccerStats = angular.module('soccerStats', ['ngRoute','ngSanitize','ngResource','ng.deviceDetector'])
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

        $routeProvider.when('/game-review', {
            templateUrl: 'templates/pages/game-review.html',
            controller: 'gameReviewController',
            scope:{}
        });

        $routeProvider.when('/test', {
            templateUrl: 'templates/pages/test-page.html',
            controller: 'testController',
            scope:{}
        });

        $routeProvider.when('/verify-email', {
            templateUrl: 'templates/pages/email-verification.html',
            controller: 'emailController',
            scope:{}
        });

        $routeProvider.when('/password-reset-success', {
            templateUrl: 'templates/pages/password-reset-success.html',
            controller: 'emailController',
            scope:{}
        });

        $routeProvider.when('/password-reset', {
            templateUrl: 'templates/pages/password-reset.html',
            controller: 'emailController',
            scope:{}
        });

        $routeProvider.when('/roster', {
            templateUrl: 'templates/pages/roster.html',
            controller: 'rosterController',
            scope:{}
        });

        $routeProvider.when('/game-setup', {
            templateUrl: 'templates/pages/game-setup.html',
            controller: 'gameSetupController',
            scope:{}
        });
    }
);
