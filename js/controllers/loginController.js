soccerStats.controller('loginController',
    ['$scope', '$location', function loginController($scope, $location) {
        //user login
        $scope.user = {name: '', password: ''};

        $scope.go = function (path) {
            $location.path(path);
        };


        $scope.login = function(user) {
            if ($scope.isFormValid('loginForm')) {
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

        // Validates the form
        $scope.isFormValid = function(formName) {
            // Does form element exist and does it have the '$valid' property?
            if ($scope[formName] && $scope[formName].hasOwnProperty('$valid')) {
                return $scope[formName].$valid;
            }
            // Todo: highlight form elements in the UI which are causing the form to be invalid
            return false;
        }


    }]);
