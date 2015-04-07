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
                if (!$scope.newUser.newPassword) 
                    return true;
                if ($scope.confirmPassword()) 
                    return true;
                else 
                    return false;
            };

            //compare new password with confirmation password
            $scope.confirmPassword = function() {
                return $scope.newUser.newPassword === $scope.newUser.confirmPassword;
            };
            
            var currentUser = Parse.User.current();
            // User information
            $scope.newUser = {
                firstName: currentUser.get('firstName'),
                lastName: currentUser.get('lastName'),
                name: currentUser.get("name"),
                email: currentUser.get("email"),
                newPassword: '',
                confirmPassword: currentUser.get("password"),
                phone: currentUser.get("phone"),
                city: currentUser.get("city"),
                state: $scope.states[currentUser.get("state")],
                // TODO: add profile picture
                photo: currentUser.get("photo")._url        
            };

            $scope.updateAccount = function(newUser) {
                if (viewService.validateAreaByFormName('accountForm')) {
                    if ($scope.checkPassword()) {
                        currentUser.set("username", newUser.email);
                        currentUser.set("name", newUser.name);
                        currentUser.set("email", newUser.email);
                        currentUser.set("phone", newUser.phone);
                        currentUser.set("city", newUser.city);
                        //TODO: fix state values
                        currentUser.set("state", newUser.state.value);
                        //TODO: conditional statement if same picture since we are using the same url 
                        //currentUser.set("photo", newUser.photo);
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