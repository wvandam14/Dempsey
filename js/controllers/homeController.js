soccerStats.controller('homeController', 
    function homeController($scope, $location) {

    	$scope.verified = false;
        $scope.user = {
            name: '',
            accountType: ''
        };

        var currentUser = Parse.User.current();
        if (currentUser) {
            $scope.user.name = currentUser.get("username");
            //check for email verification 
            if (!currentUser.get("emailVerified")) {
                console.log("Hey! You need to verify your account first");
                //TODO: disable user functionality until user verifies email
            } else {
            	$scope.verified = true;
            }
        } else {
            //show login page
        }
    });
