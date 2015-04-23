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
                if (viewService.validateAreaByFormName('gameForm')) {
                    var currentUser = Parse.User.current();
                    var Game = Parse.Object.extend("Game");
                    var Team = Parse.Object.extend("Team");
                    var GameStats = Parse.Object.extend("GameTeamStats");

                    var query = new Parse.Query(Team);
                    console.log("Form validated");
                    _.each($scope.games, function(game) {
                        console.log(game);
                        var newGame = new Game();

                        query.get($scope.currentTeam.id, {
                            success: function(team) {
                                // Things the user entered
                                newGame.set("date", game.date);
                                newGame.set("opponent", game.opponent.name);
                                newGame.set("opponentSymbol", game.opponent.symbol);
                                newGame.set("startTime", game.time.toTimeString());
                                newGame.set("team", {__type:"Pointer",className:"Team",objectId:$scope.currentTeam.id});
                                newGame.set("gameTeamStats", new GameStats());
                                
                                // Default values
                                newGame.set("status", "not_started");

                                // Save the game object
                                newGame.save(null, {
                                    success: function(newGame) {
                                        toastService.success("Game on " + game.date + " added.");
                                    },
                                    error: function(newGame, error) {
                                        console.log("Error saving game: " + error.code + " " + error.message);
                                        toastService.error("There was an error (" + error.code + "). Please try again.");
                                    }
                                });
                            },
                            error: function(team, error) {
                                console.log("Error getting team: " + error.code + " " + error.message);
                            }
                        });    
                    });
                }
                else {
                    console.log("Form not validated");
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