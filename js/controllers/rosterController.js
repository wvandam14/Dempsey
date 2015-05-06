soccerStats.controller('rosterController', 
    function rosterController($scope, $rootScope, $location, $timeout, configService, dataService) {

        $scope.players = [];

    	var currentUser = dataService.getCurrentUser();
        //console.log(currentUser);

        var populatePlayers = function(team) {
            $scope.players = [];
            $timeout(function(){
                //dataService.getTeamById(data.team.id, function(_team) {
                    dataService.getPlayersByTeamId(team.id, function(players) {
                        $timeout(function() {
                            //console.log(players);
                            _.each(players, function (player) {
                                $scope.players.push({
                                    name: player.get("name"),
                                    number: player.get("jerseyNumber"),
                                    photo: player.get("photo") ? player.get("photo")._url : './img/player-icon.svg',
                                    position: "ST",
                                    notableEvents: [
                                        {
                                            type: "Subbed out",
                                            time: "88'"
                                        },
                                        {
                                            type: "Subbed out",
                                            time: "88'"
                                        },
                                        {
                                            type: "Subbed out",
                                            time: "88'"
                                        }
                                    ],
                                    passData: [
                                            {
                                                value: 10,
                                                color: "#B4B4B4",
                                                highlight: "#B4B4B4",
                                                label: "Attempted"
                                            },
                                            {
                                                value: 20,
                                                color:"#5DA97B",
                                                highlight: "#5DA97B",
                                                label: "Completed"
                                            }
                                    ],
                                    shotsData: [
                                            {
                                                value: 4,
                                                color: "#B4B4B4",
                                                highlight: "#B4B4B4",
                                                label: "Attempted"
                                            },
                                            {
                                                value: 3,
                                                color:"#5DA97B",
                                                highlight: "#5DA97B",
                                                label: "Completed"
                                            }
                                        ],
                                    total: {
                                        goals:0,
                                        passes:1,
                                        corners:2,
                                        fouls:3,
                                        yellows:4,
                                        reds:5
                                    },
                                    phone: player.get("phone"),
                                    emergencyContact: {
                                        name: player.get("emergencyContact"),
                                        phone: player.get("phone"),
                                        relationship: player.get("relationship")
                                    }

                                });
                                // TODO: Get all time stats for player
                            });
                            $scope.currPlayer = $scope.players[0];
                        });
                    });
                //});
            });
        };

        populatePlayers(dataService.getCurrentTeam());


        $scope.$on(configService.messages.teamChanged, function(msg, data) {
            populatePlayers(data.team);
        });

        $scope.currGame = {};

        $scope.isSelected = function (player) {
            if (player === $scope.currPlayer ) {
                return true;
            }
            return false;
        };

        $scope.selectPlayer = function (player) {
            $scope.currPlayer = player;
        };

    });
