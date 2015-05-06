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
                        dataService.updateAccount(editUser, self);
                    }
                } else {
                    toastService.error(configService.toasts.requiredFields);
                }
            }

            console.log($scope.editUser);

            //TODO: not working
            $scope.goToPage = function(page) {
                //console.log(page);
                viewService.goToPage(page);
            };

        }
    };
});