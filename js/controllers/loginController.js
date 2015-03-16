soccerStats.controller('loginController',
    function loginController($scope) {
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
    });