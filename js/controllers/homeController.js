soccerStats.controller('homeController', 
    function homeController($scope, $location) {

        var currentUser = Parse.User.current();
        if (currentUser) {
            $scope.user = {name: currentUser.get("username")}
        } else {
            //show login page
        }
    });
