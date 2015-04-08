soccerStats.directive('accountModal', function (viewService, toastService, registerService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/account-modal.html",
        controller: function($scope, viewService) {
            var self = 'accountModal';

            $scope.closeModal = function() {
                viewService.closeModal(self);
            }

            //below are static arrays
            $scope.states = dataService.states;

            $scope.checkPassword = function() {
                if (!$scope.editUser.newPassword) 
                    return true;
                if ($scope.confirmPassword()) 
                    return true;
                else 
                    return false;
            };

            //compare new password with confirmation password
            $scope.confirmPassword = function() {
                return $scope.editUser.newPassword === $scope.editUser.confirmPassword;
            };
            
            var currentUser = Parse.User.current();
            // User information
            $scope.editUser = {
                firstName: currentUser.get('firstName'),
                lastName: currentUser.get('lastName'),
                name: currentUser.get("name"),
                email: currentUser.get("email"),
                newPassword: '',
                confirmPassword: currentUser.get("password"),
                phone: currentUser.get("phone"),
                city: currentUser.get("city"),
                state: $scope.states[currentUser.get("state")],
                photo: currentUser.get("photo")._url,  
                newPhoto: ''      
            };

            $scope.updateAccount = function(editUser) {
                if (viewService.validateAreaByFormName('accountForm')) {
                    if ($scope.checkPassword()) {
                        currentUser.set("username", editUser.email);
                        currentUser.set("firstName", editUser.firstName);
                        currentUser.set("lastName", editUser.lastName);
                        currentUser.set("name", editUser.firstName + " " + editUser.lastName);
                        currentUser.set("email", editUser.email);
                        currentUser.set("phone", editUser.phone);
                        currentUser.set("city", editUser.city);
                        currentUser.set("state", (_.invert($scope.states))[editUser.state]);
                        console.log(editUser.newPhoto);
                        if ($scope.editUser.newPhoto) 
                            currentUser.set("photo", editUser.newPhoto);
                        currentUser.set("password", editUser.newPassword);
                        currentUser.save(null, {
                            success: function (currentUser) {
                                toastService.success(configService.toasts.accountUpdateSuccess);
                                viewService.goToPage('/home');
                            },
                            error: function (currentUser, error) {
                                console.log("Error: " + error.code + " " + error.message);
                                toastService.error("There was a an error (" + error.code +"). Please try again.");
                            }
                        });
                    }
                } else {
                    
                    toastService.error(configService.toasts.requiredFields);
                }
            }

            //TODO: not working
            $scope.goToPage = function(page) {
                viewService.goToPage(page);
            };

        }
    };
});