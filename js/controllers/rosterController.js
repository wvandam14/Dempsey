// controller in charge of viewing the roster
soccerStats.controller('rosterController',
    function rosterController($scope, $rootScope, $location, $timeout, configService, dataService) {

        $scope.players = [];

    	var currentUser = dataService.getCurrentUser();
        //console.log(currentUser);

        // returns whether or not a player has been selected
        $scope.isSelected = function (player) {
            if (player === $scope.currPlayer ) {
                return true;
            }
            return false;
        };

        // sets the current player to the selected player
        $scope.selectPlayer = function (player) {
            $scope.currPlayer = player;
        };

        // get all of the players associated with the current team
        var populatePlayers = function(team) {
            $scope.players = [];
            $timeout(function(){
                dataService.getPlayersByTeamId(team.id, function(players) {
                    $timeout(function() {
                        //console.log(players);
                        _.each(players, function (player) {
                            dataService.getSeasonPlayerStatsByPlayerId(player.get("playerStats").id, function(stats) {
                                //$timeout(function() {
                                    $scope.players.push(dataService.playerConstructor(player, stats));
                                // });
                            });
                        });
                    });
                });
            });
        };

        populatePlayers(dataService.getCurrentTeam());  // initialize players

        // if a team change occurs
        $scope.$on(configService.messages.teamChanged, function(msg, data) {
            populatePlayers(dataService.getCurrentTeam());
        });

        $scope.currGame = {};

        
    });
