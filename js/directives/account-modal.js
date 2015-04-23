soccerStats.directive('accountModal', function ($location, $timeout, $route, viewService, toastService, configService, dataService) {
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
                if (!$scope.editUser.newPassword && !$scope.editUser.confirmPassword) 
                    return true;
                if ($scope.confirmPassword()) 
                    return true;
                else {
                    toastService.error("Please check the password fields.");
                    return false;
                }
            };

            //compare new password with confirmation password
            $scope.confirmPassword = function() {
                return $scope.editUser.newPassword === $scope.editUser.confirmPassword;
            };

            var currentUser = Parse.User.current();
            $scope.editUser = {
                firstName: currentUser.get('firstName') ? currentUser.get('firstName') : '',
                lastName: currentUser.get('lastName') ? currentUser.get('lastName') : '',
                name: currentUser.get('name') ? currentUser.get('name') : '',
                email: currentUser.get('email') ? currentUser.get('email') : '',
                newPassword: '',
                confirmPassword: currentUser.get('password') ? currentUser.get('password') : '',
                phone: currentUser.get('phone') ? currentUser.get('phone') : '',
                city: currentUser.get('city') ? currentUser.get('city') : '',
                state: $scope.states[currentUser.get('state') ? currentUser.get('state') : ''],
                photo: currentUser.get('photo') ? currentUser.get('photo')._url : './img/manager-icon.svg',  
                newPhoto: ''      
            };
            
            // User information
            $scope.updateAccount = function(editUser) {
                if (viewService.validateAreaByFormName('accountForm')) {
                    if ($scope.checkPassword()) {
                        currentUser.set("username", $scope.editUser.email);
                        currentUser.set("firstName", $scope.editUser.firstName);
                        currentUser.set("lastName", $scope.editUser.lastName);
                        currentUser.set("name", $scope.editUser.firstName + " " + $scope.editUser.lastName);
                        currentUser.set("email", $scope.editUser.email);
                        currentUser.set("phone", $scope.editUser.phone);
                        currentUser.set("city", $scope.editUser.city);
                        currentUser.set("state", (_.invert($scope.states))[$scope.editUser.state]);
                        //console.log((_.invert($scope.states))[$scope.editUser.state]);
                        if ($scope.editUser.newPhoto)
                            currentUser.set("photo", $scope.editUser.newPhoto);
                        if($scope.editUser.newPassword !== '')
                            currentUser.set("password", $scope.editUser.newPassword);
                        
                        currentUser.save(null, {
                            success: function (currentUser) {
                                toastService.success(configService.toasts.accountUpdateSuccess);
                                $scope.closeModal();
                                //$route.reload();
                                //currentUser.fetch();
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

            console.log($scope.editUser);

            //TODO: not working
            $scope.goToPage = function(page) {
                console.log(page);
                viewService.goToPage(page);
            };

        }
    };
});