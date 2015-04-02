soccerStats.controller('loginController', function loginController($scope, $rootScope, $timeout, $location, viewService, toastService, configService) {
        // User object
        $scope.user = {email: '', password: ''};

        $scope.goToPage = function(path) {
            viewService.goToPage(path);
        }
        $scope.login = function(user) {
            if (viewService.validateAreaByFormName('loginForm')) {
                Parse.User.logIn(user.email, user.password, {
                    success: function (user) {
                        console.log(user);
                        toastService.success(configService.toasts.loginSuccess(user.get('name')));
                        $scope.goToPage('/home');
                    },
                    error: function(user, error) {
                        toastService.error(configService.toasts.notAuthenticated);
                    }
                });
            } else {
                toastService.error(configService.toasts.requiredFields);
            }
        };

    });
