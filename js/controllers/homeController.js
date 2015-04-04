soccerStats.controller('homeController', 
    function homeController($scope, $location, toastService, configService) {

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
                 toastService.error(configService.toasts.emailVerification);
                //TODO: disable user functionality until user verifies email
            } else {
            	$scope.verified = true;
            }
        } else {
            //show login page
        }

        $scope.test = function () {
            alert('hello');
        };
    });
