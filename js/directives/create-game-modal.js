soccerStats.directive('createGameModal', function (viewService, toastService, configService, dataService, emailService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/create-game-modal.html",
        controller: function($scope) {
            var self = 'createGameModal';
            $scope.currentTeam = {};
            $scope.teams = [];
            var currentUser = Parse.User.current();

            $scope.closeModal = function() {
                viewService.closeModal(self);
            }

                // Array containing the emails who will receive the invitation to the team
            $scope.games = [];
            $scope.addGame = function (game) {
                if(viewService.validateAreaByFormName("gameForm")){
                    $scope.games.unshift({
                        opponent: {
                            name:$scope.opponentName,
                            symbol:$scope.opponentSymbol
                        },
                        date:$scope.date,
                        time:$scope.gameTime
                    });
                }
                else {
                    toastService.error(configService.toasts.requiredFields);
                }
            };

            $scope.removeGame = function (index){
                $scope.games.splice(index, 1);
            };

            $scope.currentTeam = {};
            $scope.$on(configService.messages.teamChanged, function(event, data) {
                $scope.currentTeam = data.team;
            });

            // Register a player
            $scope.sendGames = function() {
                var teamID = $scope.currentTeam.id;
                if (viewService.validateAreaByFormName('gameForm')) {

                    //console.log("Form validated");
                    _.each($scope.games, function(game) {
                        dataService.saveGame(game, teamID);                            
                    });
                }
                else {
                    //console.log("Form not validated");
                    toastService.error(configService.toasts.requiredFields);
                }

                $scope.closeModal();
            };

            // // Sends email via the cloud code with parse
            // $scope.sendEmailInvite = function() {
            //     _.each($scope.inviteEmails, function (email) {
            //         emailService.sendEmailInvite(currentUser.get("name"), $scope.currentTeam.value, $scope.currentTeam.label, email);
            //     });
            // };

            if (currentUser) {
                dataService.getTeams( function(_teams) {
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