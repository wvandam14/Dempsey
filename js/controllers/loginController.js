soccerStats.controller('loginController',
    function loginController($scope) {
        //user login
        $scope.user = {name: '', password: ''};

        $scope.login = function(user) {
            Parse.User.logIn(user.name, user.password, {
                success: function(user) {
                    alert("login successful!");
                },
                error: function(user, error) {
                    alert("failed to login");
                }
            });
        };

        //user register
            //need to make sure database and user submission is consistent 
        $scope.newUser = {
            name: '',
            email: '',
            password: '',
            phone: '',
            city: '',
            state: ''
        };

        $scope.register = function (newUser) {
            var registerUser = new Parse.User();
            registerUser.set("name", newUser.name);
            registerUser.set("email", newUser.email);
            registerUser.set("password", newUser.password);
            registerUser.set("phone", newUser.phone);
            registerUser.set("city", newUser.city);
            registerUser.set("state", newUser.state);
            registerUser.set("birthday", newUser.birthday);

            user.signUp(null, {
                success: function (registerUser) {
                    alert("registration successful");
                },
                error: function (registerUser, error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        };
    });