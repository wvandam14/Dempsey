soccerStats.controller('gameSetupController', 
    function gameReviewController($scope, $rootScope, $location, $timeout, configService, dataService, viewService) {
        //$scope.players = [];
        //$scope.currFormation= [];

        $scope.roster = [];

        var currentUser = dataService.getCurrentUser();
        //console.log(currentUser);


        $scope.initFormation = function() {
          $scope.currFormation = [
              {
                 type: "GK",
                 player: 1,
                 x: 44,
                 y: 74
              },
              {
                 type: "CB",
                 player: 2,
                 x: 56,
                 y: 55
              },
              {
                 type: "CB",
                 player: 3,
                 x: 74,
                 y: 52
              },
              {
                 type: "CB",
                 player: 4,
                 x: 15,
                 y: 52
              },
              {
                 type: "CB",
                 player: 5,
                 x: 33,
                 y: 55
              },
              
              {
                 type: "CM",
                 player: 6,
                 x: 56,
                 y: 31
              },
              {
                 type: "CM",
                 player: 7,
                 x: 74,
                 y: 28
              },
              {
                 type: "CM",
                 player: 8,
                 x: 15,
                 y: 28
              },
              {
                 type: "CM",
                 player: 9,
                 x: 33,
                 y: 31
              },
              
              {
                 type: "ST",
                 player: 10,
                 x: 56,
                 y: 10
              },
              {
                 type: "ST",
                 player: 11,
                 x: 33,
                 y: 10
              },
          ];
        }
        var populatePlayers = function(team) {
            $scope.roster = [];
            $timeout(function(){
                //dataService.getTeamById(data.team.id, function(_team) {
                    dataService.getPlayersByTeamId(team.id, function(players) {
                        $timeout(function() {
                            //console.log(players);
                            _.each(players, function (player) {
                                $scope.roster.push({
                                    name: player.get("name"),
                                    lname: player.get("lastName"),
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
          $scope.players = new Array(11);
          $scope.initFormation();
        };

        populatePlayers(dataService.getCurrentTeam());


        $scope.$on(configService.messages.teamChanged, function(msg, data) {
            populatePlayers(dataService.getCurrentTeam());
        });

        $scope.isSelected = function (player) {
            if (player === $scope.currPlayer ) {
                return true;
            }
            return false;
        };

        $scope.selectPlayer = function (player) {
            $scope.currPlayer = player;
        };

        $scope.assignPosition = function(player) {
          if($scope.currPlayer) {
            _.each($scope.currFormation, function(position){
              if(player == position.player) {
                position.player = $scope.currPlayer;
              }
            })
          }
        };


        
    });
