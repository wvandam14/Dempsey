soccerStats.controller('gameSetupController', 
    function gameReviewController($scope, $rootScope, $location, $timeout, configService, dataService, viewService, toastService) {
        //$scope.players = [];
        //$scope.currFormation= [];

        $scope.roster = [];

        var currentUser = dataService.getCurrentUser();
        //console.log(currentUser);


        $scope.initFormation = function() {
            $scope.currFormation = [
              {
                 type: "GK",
                 player: {},
                 x: 44,
                 y: 74
              },
              {
                 type: "CB",
                 player: {},
                 x: 56,
                 y: 55
              },
              {
                 type: "CB",
                 player: {},
                 x: 74,
                 y: 52
              },
              {
                 type: "CB",
                 player: {},
                 x: 15,
                 y: 52
              },
              {
                 type: "CB",
                 player: {},
                 x: 33,
                 y: 55
              },
              
              {
                 type: "CM",
                 player: {},
                 x: 56,
                 y: 31
              },
              {
                 type: "CM",
                 player: {},
                 x: 74,
                 y: 28
              },
              {
                 type: "CM",
                 player: {},
                 x: 15,
                 y: 28
              },
              {
                 type: "CM",
                 player: {},
                 x: 33,
                 y: 31
              },
              
              {
                 type: "ST",
                 player: {},
                 x: 56,
                 y: 10
              },
              {
                 type: "ST",
                 player: {},
                 x: 33,
                 y: 10
              },
          ];
            $scope.bench = [
                {
                    player: {}
                },
                {
                    player: {}
                },
                {
                    player: {}
                },
                {
                    player: {}
                },
                {
                    player: {}
                },
                {
                    player: {}
                },
                {
                    player: {}
                },
            ];
        };

        var populatePlayers = function(team) {
            $scope.roster = [];
            $timeout(function(){
                //dataService.getTeamById(data.team.id, function(_team) {
                    dataService.getPlayersByTeamId(team.id, function(players) {
                        $timeout(function() {
                            //console.log(players);
                            _.each(players, function (player) {
                                $scope.roster.push({
                                    id : player.id,
                                    name: player.get("name"),
                                    fname: player.get("firstName"),
                                    lname: player.get("lastName"),
                                    number: player.get("jerseyNumber"),
                                    photo: player.get("photo") ? player.get("photo")._url : './img/player-icon.svg',
                                    position: '',
                                    selected: false,
                                    benched: false
                                });
                                // TODO: Get all time stats for player
                            });
                        });
                    });
                //});
            });
          //$scope.players = new Array(11);
          $scope.initFormation();
        };

        populatePlayers(dataService.getCurrentTeam());


        $scope.$on(configService.messages.teamChanged, function(msg, data) {
            populatePlayers(dataService.getCurrentTeam());
        });

        $scope.playerSelected = false;

        $scope.isSelected = function (player) {
            if (player === $scope.currPlayer ) {
                return true;
            }
            return false;
        };

        $scope.selectPlayer = function (player) {
            //console.log(player);
            $scope.currPlayer = player;
            $scope.playerSelected = true;
        };

        $scope.assignPosition = function(player) {
            console.log(player);
            var position = _.find($scope.currFormation, function(position) {return player == position.player});
            if (!_.isEmpty(player)) {
                var index = $scope.roster.indexOf(player);
                $scope.roster[index].selected = false;
                $scope.roster[index].position = '';
            }
            if ($scope.playerSelected) {
                //if (!_.isEmpty(player)) {
                //    var index = $scope.roster.indexOf(player);
                //    $scope.roster[index].selected = false;
                //    $scope.roster[index].position = '';
                //}
                var rosterIndex = $scope.roster.indexOf($scope.currPlayer);
                position.player = $scope.currPlayer;
                $scope.roster[rosterIndex].selected = true;
                formationIndex = $scope.currFormation.indexOf(position);
                $scope.roster[rosterIndex].position = $scope.currFormation[formationIndex].type;
                console.log($scope.roster[rosterIndex]);
            } else {
                //if (!_.isEmpty(player)) {
                //    //console.log(player);
                //    var index = $scope.roster.indexOf(player);
                //    $scope.roster[index].selected = false;
                //    $scope.roster[index].position = '';
                //}
                position.player = {};
            }
            $scope.currPlayer = {};
            $scope.playerSelected = false;
        };

        $scope.assignBench = function(player) {
            console.log(player);
            var position = _.find($scope.bench, function(position) {return player == position.player});

            if (!_.isEmpty(player)) {
                var index = $scope.roster.indexOf(player);
                $scope.roster[index].selected = false;
                $scope.roster[index].position = '';
                $scope.roster[index].benched = false;
            }
            if ($scope.playerSelected) {
                //if (!_.isEmpty(player)) {
                //    var index = $scope.roster.indexOf(player);
                //    $scope.roster[index].selected = false;
                //    $scope.roster[index].position = '';
                //    $scope.roster[index].benched = false;
                //}
                var rosterIndex = $scope.roster.indexOf($scope.currPlayer);
                position.player = $scope.currPlayer;
                $scope.roster[rosterIndex].selected = true;
                $scope.roster[rosterIndex].benched = true;
            } else {
                //if (!_.isEmpty(player)) {
                //    //console.log(player);
                //    var index = $scope.roster.indexOf(player);
                //    $scope.roster[index].selected = false;
                //    $scope.roster[index].position = '';
                //    $scope.roster[index].benched = false;
                //}
                position.player = {};
            }
            $scope.currPlayer = {};
            $scope.playerSelected = false;
        };

        var total = $scope.currFormation.length + $scope.bench.length;

        $scope.checkRoster = function() {
            var counter = 0;
            _.each($scope.currFormation, function(position) {
               if (!_.isEmpty(position.player)) {
                   counter++;
               }
            });

            _.each($scope.bench, function(position) {
                if (!_.isEmpty(position.player)) {
                    counter++;
                }
            });

            //console.log(counter);
            if (counter === total) return true;
            else return false;
        };

        $scope.saveRoster = function() {
            dataService.createRoster($scope.roster, dataService.getCurrentGame().id);
        }

        
    });
