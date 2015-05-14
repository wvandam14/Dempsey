// directive for editing an account
soccerStats.directive('accountModal', function ($location, $timeout, $route, viewService, toastService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/account-modal.html",
        controller: function($scope, viewService) {
            var self = 'accountModal';  // name of modal

            // closing the modal
            $scope.closeModal = function() {
                viewService.closeModal(self);
            };

            $scope.states = dataService.states; // static array of states

            // checks the passwords if user wishes to change their password
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
            // get the user information from parse
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
            
            // update user account
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

            $scope.goToPage = function(page) {
                //console.log(page);
                viewService.goToPage(page);
            };

        }
    };
});