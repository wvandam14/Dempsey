soccerStats.controller('loginController', function loginController($scope, $rootScope, $location, viewService) {
        // User object
        $scope.user = {name: '', password: ''};

        $scope.go = function (path) {
            $location.path(path);
        };

        $scope.login = function(user) {
            if (viewService.validateAreaByFormName('loginForm')) {
                Parse.User.logIn(user.name, user.password, {
                    success: function(user) {
                        // Todo: Redirect to home page
                        $scope.go('/home');
                    },
                    error: function(user, error) {
                        // Todo: Send Toast notification that the login was unsuccessful based on the error given
                        console.log("failed to login");
                    }
                });

            } else {
                // Todo: Send Toast notification that the form is invalid
            }
        };

    });
