soccerStats.controller('rosterController', 
    function rosterController($scope, $rootScope, $location, $timeout, configService, dataService) {

        $scope.players = [];

    	var currentUser = dataService.getCurrentUser();
        //console.log(currentUser);

        $scope.isSelected = function (player) {
            if (player === $scope.currPlayer ) {
                return true;
            }
            return false;
        };

        $scope.selectPlayer = function (player) {
            $scope.currPlayer = player;
        };


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

        populatePlayers(dataService.getCurrentTeam());


        $scope.$on(configService.messages.teamChanged, function(msg, data) {
            populatePlayers(dataService.getCurrentTeam());
        });

        $scope.currGame = {};

        
    });
