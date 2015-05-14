// directive for handling password resets
soccerStats.directive('passwordResetModal', function (viewService, toastService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/password-reset-modal.html",
        controller: function($scope) {
            var self = 'passwordResetModal';
            $scope.userEmail = "";

            // reset the password
            $scope.passwordReset = function() {
                Parse.User.requestPasswordReset($scope.userEmail, {
                    success:function() {
                        viewService.closeModal(self);
                        toastService.success("Reset instructions emailed to you.");
                    },
                    error:function(error) {
                        toastService.error(error.message);
                    }
                });
            }

            $scope.closeModal = function() {
                viewService.closeModal(self);
            }
        }
    };
});