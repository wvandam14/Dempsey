soccerStats.controller('loginController', function loginController($scope, $rootScope, $timeout, $location, viewService) {
        // User object
        $scope.user = {name: '', password: ''};

        $scope.goToPage = function(path) {
            $timeout(function() {
                console.log("loginsuccess");
                viewService.goToPage(path);
            });
        }

        $scope.login = function(user) {
            if (viewService.validateAreaByFormName('loginForm')) {
                Parse.User.logIn(user.name, user.password, {
                    success: function (user) {
                        // Todo: Redirect to home page
                        // Todo: must click more than once on login in order to redirect to home page
                        console.log("loginsuccess");
                        $scope.goToPage('/home');
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
