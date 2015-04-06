soccerStats.directive('accountModal', function (viewService, toastService, registerService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/account-modal.html",
        controller: function($scope, viewService) {
            var self = 'accountModal';

            $scope.closeModal = function() {
                viewService.closeModal(self);
            }
            
            var currentUser = Parse.User.current();
            // TODO: reset password
            // User information
            $scope.newUser = {
                name: currentUser.get("name"),
                email: currentUser.get("email"),
                password: currentUser.get("password"),
                confirmPassword: currentUser.get("password"),
                phone: currentUser.get("phone"),
                city: currentUser.get("city"),
                state: '',
                // TODO: add profile picture
                photo: ''
            };

            $scope.updateAccount = function(newUser) {
                if (viewService.validateAreaByFormName('accountForm')) {
                    currentUser.set("username", newUser.email);
                    currentUser.set("name", newUser.name);
                    currentUser.set("email", newUser.email);
                    currentUser.set("phone", newUser.phone);
                    currentUser.set("city", newUser.city);
                    // TODO: save as label instead of value?
                    currentUser.set("state", newUser.state.value);
                    // TODO: set photo -> conditional statement?
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
                } else {
                    toastService.error(configService.toasts.requiredFields);
                }
            }

            //TODO: not working
            $scope.goToPage = function(page) {
                viewService.goToPage(page);
            };

            //below are static arrays
            $scope.states = dataService.states;
        }
    };
});