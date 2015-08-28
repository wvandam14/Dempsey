// directive for editing an account
soccerStats.directive('gameDataConfirm', function ($location, $timeout, $route, viewService, toastService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/game-data-confirm.html",
        controller: function($scope, viewService) {
            var self = 'gameDataConfirm';  // name of modal

            $scope.toggleShowPlayer = function(index) {
                console.log($scope.players);
                $scope.players[index].showPlayer = $scope.players[index].showPlayer === false ? true : false;
            };

            $scope.closeModal = function() {
                viewService.closeModal(self);
            };

            // Tab functionality
            $scope.tabNumber = 0;
            $scope.formList = ['gameTeamStatsForm', 'gamePlayerStatsForm', 'confirmForm'];
            $scope.team = {}; //TODO: duplicate

            $scope.goToPage = function(page) {
                console.log(page);
                viewService.goToPage(page);
            };

            $scope.setTab = function (tab) {
                var currentForm = $scope.formList[$scope.tabNumber];

                // If you are going back in the registration process, you may
                if ($scope.tabNumber > tab) {
                    $scope.tabNumber = tab;
                    return;
                }

                // If the form is valid and you are not skipping a tab, continue, otherwise throw an error
                if (viewService.validateAreaByFormName(currentForm)
                    && (tab === ($scope.tabNumber + 1))) {
                    // If the photos are populated, continue, otherwise throw an error
                        $scope.tabNumber = tab;
                }
                else {
                    toastService.error(configService.toasts.requiredFields);
                }

            };

            // Checks if the passed tab number is the current tab
            $scope.isTab = function (tab) {
                return $scope.tabNumber === tab;
            };

            // Goes to the next tab
            $scope.incrementTab = function () {
                $scope.setTab($scope.tabNumber + 1);
            };

            $scope.addYellow = function(gamePlayer) {
                gamePlayer.cards.yellows.push(0);
            };

            $scope.addRed = function(gamePlayer) {
                gamePlayer.cards.reds.push(0);
            };

            $scope.addGoal = function(gamePlayer) {
                gamePlayer.shots.goals.push({
                    time: 0,
                    assistedBy: ''
                });
                gamePlayer.goals++;
                $scope.gameTeamStats.homeScore++;
            };

            $scope.removeYellow = function(gamePlayer, index) {
                gamePlayer.cards.yellows.splice(index, 1);
            };

            $scope.removeRed = function(gamePlayer, index) {
                gamePlayer.cards.reds.splice(index, 1);
            };

            $scope.removeGoal = function(gamePlayer, index) {
                gamePlayer.shots.goals.splice(index, 1);
                gamePlayer.goals--;
                $scope.gameTeamStats.homeScore--;
            };
            $scope.$on(configService.messages.pendingStats, function(event, data) {
                dataService.getGameByGameId(dataService.getCurrentGame().id).then(function(game) {
                    $timeout(function() {

                        // get pending data from the team and player game stats
                        $scope.gameTeamStats = game.get("pendingTeamStats");
                        $scope.gameTeamStats.opponent = game.get("opponent");
                        var playerData = game.get("pendingPlayerStats");
                        var startTime = new Date(game.get("startTime")).getTime();

                        // get currentTeam
                        $scope.currentTeam = dataService.getCurrentTeam();

                        // array of players
                        $scope.players = [];

                        // create objects with pending player stats and push to players array

                        _.each(playerData, function(player, index) {
                            if (player.subbedIn.length || player.subbedOut.length)
                                console.log(player);
                            var i = $scope.players.push({
                                playerId: index,
                                firstName: player.player.firstName,
                                lastName: player.player.lastName,
                                playerName: player.player.name,
                                showPlayer: false,
                                playingTime: 0,
                                goals: player.goals ? player.goals : 0,
                                passes: {
                                    completed: player.passes.completed ? player.passes.completed : 0,
                                    total: player.passes.total ? player.passes.total : 0
                                },
                                tackles: player.tackles ? player.tackles : 0,
                                assists: player.assists ? player.assists : 0,
                                fouls: player.fouls ? player.fouls : 0,
                                cards: {
                                    total: 0,
                                    reds: [],
                                    yellows: []
                                },
                                shots: {
                                    total: 0,
                                    on: 0,
                                    off: 0,
                                    blocked: 0,
                                    goals: []
                                }
                            })-1;

                            // get card data from each player
                            _.each(player.cards, function(card) {
                                $scope.players[i].cards.total++;
                                var d = moment.duration(card.time - startTime);
                                if (card.type === "yellow")
                                    $scope.players[i].cards.yellows.push(d.minutes());
                                if (card.type === "red")
                                    $scope.players[i].cards.reds.push(d.minutes());
                            });

                            // get shot data from each player
                            _.each(player.shots, function(shot) {
                                $scope.players[i].shots.total++;
                                if (shot.type === "on") $scope.players[i].shots.on++;
                                if (shot.type === "off") $scope.players[i].shots.off++;
                                if (shot.type === "blocked") $scope.players[i].shots.blocked++;
                                if (shot.type === "goal") {
                                    //console.log(shot.timeStamp - startTime);
                                    //console.log(moment.duration(shot.timeStamp - startTime).minutes());
                                    $scope.players[i].shots.on++;
                                    var player;
                                    if (shot.assistedBy) {
                                        player = _.find(playerData, function (p) {
                                            return p.player.objectId === shot.assistedBy;
                                        });
                                        // console.log(player);
                                    }
                                    $scope.players[i].shots.goals.push({
                                        time: moment.duration(shot.timeStamp-startTime).minutes(),
                                        assistedBy: shot.assistedBy ? player.player.name : '',
                                        id: shot.assistedBy ? player.player.objectId : ''
                                    });
                                }
                            });
                        });
                    });

                });
            });

            $scope.submitGame = function() {
                // update team stats based on changed player data
                _.each($scope.players, function(player) {
                    $scope.gameTeamStats.tackles += player.tackles;
                    $scope.gameTeamStats.passes += player.passes.total;
                    $scope.gameTeamStats.fouls += player.fouls;
                });

                // submit game into parse
                dataService.submitGame($scope.players, $scope.gameTeamStats);
            };
        }
    };
});