soccerStats.directive('inviteEmailModal', function (viewService, toastService, configService, dataService, emailService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/invite-email-modal.html",
        controller: function($scope) {
            var self = 'inviteEmailModal';
            $scope.currentTeam = {};
            $scope.teams = [];
            var currentUser = Parse.User.current();

            $scope.closeModal = function() {
                viewService.closeModal(self);
            }

                // Array containing the emails who will receive the invitation to the team
            $scope.inviteEmails = [];
            $scope.addEmail = function () {
                if(viewService.validateAreaByFormName("inviteForm")){
                    $scope.inviteEmails.unshift($scope.invite.email);
                }
                else {
                    toastService.error(configService.toasts.requiredFields);
                }
            };

            $scope.removeEmail = function (index){
                $scope.inviteEmails.splice(index, 1);
            }

            // Sends email via the cloud code with parse
            $scope.sendEmailInvite = function() {
                dataService.sendEmailInvite(currentUser, $scope.currentTeam.id, $scope.currentTeam.label, $scope.inviteEmails);
                // _.each($scope.inviteEmails, function (email) {
                //     emailService.sendEmailInvite(currentUser.get("name"), $scope.currentTeam.id, $scope.currentTeam.label, email);
                // });
            };

            if (currentUser) {
                dataService.getTeams( function(_teams) {
                    console.log(_teams);
                    if (jQuery.isEmptyObject(dataService.getCurrentTeam())) 
                        $scope.currentTeam = _teams[0];
                    else
                        $scope.currentTeam = dataService.getCurrentTeam();
                    console.log($scope.currentTeam)
                    //console.log($scope.editTeam);
                });
            }
        }
    };
});