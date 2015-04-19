soccerStats.controller('loginController', function loginController($scope, $rootScope, $timeout, $location, viewService, toastService, configService, dataService) {
        // User object
        $scope.user = {email: '', password: ''};

        $scope.init = function() {
            if (dataService.currentUser) {
                $scope.goToPage('/home');
            }
        };
        $timeout(function() {
            $scope.init();
        });

        $scope.goToPage = function(path) {
            viewService.goToPage(path);
        }
        $scope.login = function(user) {
            if (viewService.validateAreaByFormName('loginForm')) {
                Parse.User.logIn(user.email, user.password, {
                    success: function (user) {
                        console.log(user);
                        var name = user.get('name');
                        toastService.success(configService.toasts.loginSuccess(
                            name === undefined ? "parent. Please edit your profile" : name)
                        );
                        $scope.goToPage('/home');
                        $rootScope.$broadcast(configService.messages.loginSuccess);
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
