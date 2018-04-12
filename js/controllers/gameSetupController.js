// controller in charge of coach setting up the roster
soccerStats.controller('gameSetupController',
    function gameReviewController($scope, $rootScope, $location, $timeout, configService, dataService, viewService, toastService) {
        //$scope.players = [];
        //$scope.currFormation= [];

        $scope.roster = []; //empty array for player roster

        var currentUser = dataService.getCurrentUser();
        //console.log(currentUser);

        $scope.game = dataService.getCurrentGame();     // get the current game

        // initialize the formation and bench for the field and list
        $scope.initFormation = function() {
            $scope.currFormation = [
              {
                posId: 0,     // this is how we link up the player to the position on the field
                 type: "GK",  // default position
                 player: {},  
                 x: 44,
                 y: 74
              },
              {
                posId: 3,
                 type: "CB",
                 player: {},
                 x: 56,
                 y: 55
              },
              {
                posId: 4,
                 type: "RB",
                 player: {},
                 x: 74,
                 y: 52
              },
              {
                posId: 1,
                 type: "LB",
                 player: {},
                 x: 15,
                 y: 52
              },
              {
                posId: 2,
                 type: "CB",
                 player: {},
                 x: 33,
                 y: 55
              },
              
              {
                posId: 7,
                 type: "CM",
                 player: {},
                 x: 56,
                 y: 31
              },
              {
                posId: 8,
                 type: "RM",
                 player: {},
                 x: 74,
                 y: 28
              },
              {
                posId: 5,
                 type: "LM",
                 player: {},
                 x: 15,
                 y: 28
              },
              {
                posId: 6,
                 type: "CM",
                 player: {},
                 x: 33,
                 y: 31
              },
              
              {
                posId: 10,
                 type: "ST",
                 player: {},
                 x: 56,
                 y: 10
              },
              {
                posId: 9,
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

        // get all of the players
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
                                    benched: false,
                                    x: 0,
                                    y: 0,
                                    posId: -1
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

        populatePlayers(dataService.getCurrentTeam()); // initialize player setup

        // if the user switches team, we can use a different roster list
        $scope.$on(configService.messages.teamChanged, function(msg, data) {
            populatePlayers(dataService.getCurrentTeam());
        });

        $scope.playerSelected = false;

        // returns a boolean to see if a player has been selected or not
        $scope.isSelected = function (player) {
            if (player === $scope.currPlayer ) {
                return true;
            }
            return false;
        };

        // set current player to selected player
        $scope.selectPlayer = function (player) {
            //console.log(player);
            $scope.currPlayer = player;
            $scope.playerSelected = true;
        };

        // assign the selected player to the position on the field
        $scope.assignPosition = function(player) {

            // find the position in the current formation based on the player
            var position = _.find($scope.currFormation, function(position) {return player == position.player});
            console.log(position.posId);
            // if there is no player on the field, disable selection and position of the player in the roster
            if (!_.isEmpty(player)) {
                var index = $scope.roster.indexOf(player);
                $scope.roster[index].selected = false;
                $scope.roster[index].position = '';
                $scope.roster[index].x = 0;
                $scope.roster[index].y = 0;
                $scope.roster[index].posId = -1;
            }
            // if a player has been selected from the roster, we want to set the position of the player in the current formation to the selected player in the list
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
                $scope.roster[rosterIndex].x = $scope.currFormation[formationIndex].x;
                $scope.roster[rosterIndex].y = $scope.currFormation[formationIndex].y;
                $scope.roster[rosterIndex].posId = $scope.currFormation[formationIndex].posId;
                //console.log($scope.roster[rosterIndex]);
            } else {    // otherwise we can remove the player from the formation
                //if (!_.isEmpty(player)) {
                //    //console.log(player);
                //    var index = $scope.roster.indexOf(player);
                //    $scope.roster[index].selected = false;
                //    $scope.roster[index].position = '';
                //}
                position.player = {};
            }
            $scope.currPlayer = {};     // de-select roster
            $scope.playerSelected = false;
        };

        // similar to assignPosition but for the bench list below the formation field
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

        // gets the total length of players on the field and bench = 18
        var total = $scope.currFormation.length + $scope.bench.length;

        // do not allow user to save until they have filled out the field and bench
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

        // saving the roster
        $scope.saveRoster = function() {
            dataService.createRoster($scope.roster, dataService.getCurrentGame().id);
        }

        
    });
