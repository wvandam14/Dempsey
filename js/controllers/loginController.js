soccerStats.controller('loginController', function loginController($scope, $rootScope, $location) {
        // User object
        $scope.user = {name: '', password: ''};

        $scope.go = function (path) {
            $location.path(path);
        };

        $scope.login = function(user) {
            if ($scope.isFormValid('loginForm')) {
                Parse.User.logIn(user.name, user.password, {
                    success: function(user) {
                        // Todo: Redirect to home page
                        console.log("login successful!");
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


        // Todo: Move to registrationController.js
        //user register
        //need to make sure database and user submission is consistent 
        // $scope.newUser = {
        //     name: '',
        //     email: '',
        //     password: '',
        //     phone: '',
        //     city: '',
        //     state: ''
        // };

        // $scope.register = function (newUser) {
        //     var registerUser = new Parse.User();
        //     registerUser.set("name", newUser.name);
        //     registerUser.set("email", newUser.email);
        //     registerUser.set("password", newUser.password);
        //     registerUser.set("phone", newUser.phone);
        //     registerUser.set("city", newUser.city);
        //     registerUser.set("state", newUser.state);
        //     registerUser.set("birthday", newUser.birthday);

        //     user.signUp(null, {
        //         success: function (registerUser) {
        //             alert("registration successful");
        //         },
        //         error: function (registerUser, error) {
        //             alert("Error: " + error.code + " " + error.message);
        //         }
        //     });
        // };
    });
