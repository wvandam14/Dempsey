// controller in charge of game review page
soccerStats.controller('gameReviewController',
    function gameReviewController($scope, $rootScope, $location, $timeout, configService, dataService, viewService) {

        // initializes current formation of the field - currently static field
        $scope.initCurrFormation = function() {
            $scope.currFormation = [
              {
                posId: 0,
                 type: "GK",
                 player: {},
                 x: 44,
                 y: 74
              },
              {
                posId: 1,
                 type: "CB",
                 player: {},
                 x: 56,
                 y: 55
              },
              {
                posId: 2,
                 type: "RB",
                 player: {},
                 x: 74,
                 y: 52
              },
              {
                posId: 3,
                 type: "LB",
                 player: {},
                 x: 15,
                 y: 52
              },
              {
                posId: 4,
                 type: "CB",
                 player: {},
                 x: 33,
                 y: 55
              },
              
              {
                posId: 5,
                 type: "CM",
                 player: {},
                 x: 56,
                 y: 31
              },
              {
                posId: 6,
                 type: "RM",
                 player: {},
                 x: 74,
                 y: 28
              },
              {
                posId: 7,
                 type: "LM",
                 player: {},
                 x: 15,
                 y: 28
              },
              {
                posId: 8,
                 type: "CM",
                 player: {},
                 x: 33,
                 y: 31
              },
              
              {
                posId: 9,
                 type: "ST",
                 player: {},
                 x: 56,
                 y: 10
              },
              {
                posId: 10,
                 type: "ST",
                 player: {},
                 x: 33,
                 y: 10
              },
          ];
        };

        // returns whether or not a player is selected
        $scope.isSelected = function (player) {
            if ( player === $scope.currPlayer ) {
                return true;
            }
            else {
                return false;
            }
        };

        // sets the current player to selected player
        $scope.selectPlayer = function (player) {
            console.log(player);
            $scope.currPlayer = player;
        };

        // save game notes from input
        $scope.saveGameNotes = function () {
            //console.log($scope.currGame)
            dataService.saveGameAttributes(dataService.getCurrentGame(), ["gameNotes"], [$scope.notes]);
        };

        // retrieves players and sets up their statistics
        $scope.populatePlayers = function(teamStatsId) {
            var promise = new Parse.Promise();
            // get game player stats for each player
            dataService.getGamePlayerStatsById(teamStatsId).then(function(gameTeamStats) {
                $timeout(function() {
                    //console.log(gameTeamStats);
                    $scope.gameSubs = gameTeamStats.get("substitutions");
                    $scope.players = [];
                    _.each(gameTeamStats.get("roster"), function(gamePlayer) {
                        // for every player in the roster, we create a javascript object with all of their information and stats
                        $scope.players.push(dataService.gamePlayerConstructor(gamePlayer.get("player"), gamePlayer));
                    });

                    promise.resolve('success');
                });
            });
            return promise;
        };

        // calculates all team statistics including notable events for the timeline and shot accuracy shot
        $scope.populateStats = function() {
            var shots = 0,
                onGoal = 0,
                offGoal = 0,
                blocked = 0,
                passCompletion = 0,
                passTotal = 0;

            // contains pass information
            $scope.passData = {
                data : [
                    {
                        value: 0,
                        color: "#B4B4B4",
                        highlight: "#B4B4B4",
                        label: "Missed"
                    },
                    {
                        value: 0,
                        color:"#5DA97B",
                        highlight: "#5DA97B",
                        label: "Completed"
                    }
                ],
                completed: 0,
                total: 0,
                successRate: 0
            };

            // contains shot information for shot chart
            $scope.shotCountData = {
                shots: 0,
                onGoal: 0,
                offGoal: 0,
                blocked: 0
            };

            // any other relevant information for the page
            $scope.otherData = {
                goals: 0,
                fouls: 0,
                reds: 0,
                yellows: 0
            };

            // calculate team statistics from each player
            _.each($scope.players, function(player) {
                $scope.shotCountData.shots += player.shots.total;
                $scope.shotCountData.onGoal += player.shots.onGoal.total;
                $scope.shotCountData.offGoal += player.shots.offGoal.total;
                $scope.shotCountData.blocked += player.shots.blocks.total;
                $scope.otherData.goals += player.shots.goals.total;
                $scope.otherData.fouls += player.total.fouls;
                $scope.otherData.reds += player.total.red.total;
                $scope.otherData.yellows += player.total.yellow.total;
                $scope.passData.completed += player.passes.completed;
                $scope.passData.total += player.passes.total;
            });

            // sets up the pass data success rate for team
            $scope.passData.successRate = $scope.passData.total && $scope.passData.completed ? Math.round(( $scope.passData.completed / $scope.passData.total)*100) : 0;
            $scope.passData.data[1].value = $scope.passData.successRate;
            $scope.passData.data[0].value = 100 - $scope.passData.successRate;

            // initialize the current formation
            $scope.initCurrFormation();

            // creates the positions and angles for the shot data chart
            $scope.shotLinesData = [];
            _.each($scope.players, function(player) {
                var shotLineData = {};  // create a simple object

                // offGoal shots
                if (player.shots.offGoal.total) {
                    for (var i = 0; i < player.shots.offGoal.total; i++) {
                        shotLineData =
                        {
                            type: 'off',
                            shotPos: player.shots.offGoal.startPos[i],
                            resultPos: player.shots.offGoal.resultPos[i]
                        };
                        $scope.shotLinesData.push(shotLineData);    // push to data array for chart
                    }
                }

                // onGoal shots
                if (player.shots.onGoal.total) {
                    for (var i = 0; i < player.shots.onGoal.total; i++) {
                        shotLineData =
                        {
                            type: 'on',
                            shotPos: player.shots.onGoal.startPos[i],
                            resultPos: player.shots.onGoal.resultPos[i]
                        };
                        $scope.shotLinesData.push(shotLineData);
                    }
                }

                // blocked shots
                if (player.shots.blocks.total) {
                    for (var i = 0; i < player.shots.blocks.total; i++) {
                        shotLineData =
                        {
                            type: 'blocked',
                            shotPos: player.shots.blocks.startPos[i],
                            resultPos: player.shots.blocks.resultPos[i]
                        };
                        $scope.shotLinesData.push(shotLineData);
                    }
                }

                // goal shots
                if (player.shots.goals.total) {
                    for (var i = 0; i < player.shots.goals.total; i++) {
                        shotLineData =
                        {
                            type: 'goal',
                            shotPos: player.shots.goals.startPos[i],
                            resultPos: player.shots.goals.resultPos[i]
                        };
                        $scope.shotLinesData.push(shotLineData);
                    }
                }
            });

            // fill in the formation field with players set up from the setup page
            _.each($scope.players, function(player) {
                if (!player.benched) {
                    var position = _.find($scope.currFormation, function(position) {
                        return player.x == position.x &&
                                player.y == position.y
                    });
                    position.player = player;
                }
            });

            // get the assisted players for each player that had a goal with an assisted player
            _.each($scope.players, function(player) {
                //console.log(player);
                var assistPlayer = {};
                //_.each(player.shots.goals.assistedBy, function(assistId) {
                //    //console.log(assistId);
                //    assistPlayer = _.find($scope.players, function(assistPlayer) {
                //        //console.log(assistPlayer.id);
                //        return  assistPlayer.playerId === assistId;
                //    });
                //    //console.log(assistPlayer);
                //    if (assistPlayer) {
                //        player.notableEvents.push({
                //            type: "Assisted By",
                //            assistedBy: assistPlayer.lname
                //        });
                //    }
                //});
                _.each(player.notableEvents, function(event) {
                    if (event.type === 'goal') {
                        assistPlayer = _.find($scope.players, function(assistPlayer) {
                            //console.log(assistPlayer.id);
                            return  assistPlayer.playerId === event.assistId;
                        });

                        //console.log(assistPlayer);
                        if (assistPlayer) {
                            event.assistedBy = 'Asst. by ' + assistPlayer.lname;
                        }
                    }
                });
            });

            // if a parent is reviewing the page, we want to limit their view to only seeing their own player stats
            if (currentUser.get("accountType") == 2) {
                _.each($scope.players, function(player) {
                    //console.log(currentUser.get("players"));
                    var child = _.find(currentUser.get("players"), function(childPlayer) {return childPlayer.id == player.playerId});
                    // set the player to false so we do not see their information
                    if (child == undefined) {
                        player.myKid = false;
                    }
                });
            }

            $rootScope.$broadcast(configService.messages.notableEvents, {players: $scope.players, subs: $scope.gameSubs});

        };

        // set up all of the game data
        $scope.populateGameData = function(game) {
            //console.log(game);
            //var promise = new Parse.Promise();

            // get the game stats
            dataService.getGameStatsById(game.id).then(function(game) {
                $timeout(function() {
                    // set up empty object
                    $scope.gameStats = {
                        corners : 0,
                        offsides : 0,
                        goalsMade : 0,
                        goalsTaken : 0,
                        passes : 0,
                        tackles : 0,
                        fouls : 0,
                        possession : 0,
                        teamPossession : { data: []}
                    };

                    if(game){   // if viable game
                        $scope.notes = game.get("gameNotes");
                        // set up the game stats
                        $scope.gameStats = {
                            corners : game.get('gameTeamStats').get('corners') ? game.get('gameTeamStats').get('corners') : 0,
                            offsides : game.get('gameTeamStats').get('offsides') ? game.get('gameTeamStats').get('offsides') : 0,
                            //goalsMade : game.get('gameTeamStats').get('goalsMade') ? game.get('gameTeamStats').get('goalsMade') : 0,
                            goalsTaken : game.get('gameTeamStats').get('goalsTaken') ? game.get('gameTeamStats').get('goalsTaken') : 0,
                            //passes : game.get('gameTeamStats').get('passes') ? game.get('gameTeamStats').get('passes') : 0,
                            tackles : game.get('gameTeamStats').get('tackles') ? game.get('gameTeamStats').get('tackles') : 0,
                            //fouls :  game.get('gameTeamStats').get('fouls') ? game.get('gameTeamStats').get('fouls') : 0,
                            saves :  game.get('gameTeamStats').get('saves') ? game.get('gameTeamStats').get('saves') : 0,
                            possession : game.get('gameTeamStats').get('possession') ? game.get('gameTeamStats').get('possession') : 0,
                            teamPossession : {
                                data : [
                                    {
                                        value: game.get('gameTeamStats').get('possession') ? 100 - game.get('gameTeamStats').get('possession') : 0,
                                        color: "#B4B4B4",
                                        highlight: "#B4B4B4",
                                        label: "Theirs"
                                    },
                                    {
                                        value: game.get('gameTeamStats').get('possession') ? game.get('gameTeamStats').get('possession') : 0,
                                        color:"#5DA97B",
                                        highlight: "#5DA97B",
                                        label: "Ours"
                                    }
                                ]
                            }
                        };
                        // console.log(promise);
                        //promise.resolve(game.get('gameTeamStats').id);

                        //set up the players
                        $scope.populatePlayers(game.get('gameTeamStats').id).then(function(result) {
                            //set up player stats
                            $scope.populateStats();          
                        });
                    }
                    // else{
                    //     promise.reject('Error in populateGameData');
                    // }
                });
            });
            //return promise;
        };
           
        var currentUser = Parse.User.current();         // current user
        $scope.currPlayer = dataService.currentPlayer;  // set up current player

        // set up empty objects and arrays
        $scope.players = [];
        $scope.gameSubs = {};
        $scope.shotLinesData = [];
        $scope.passData = {};
        $scope.currFormation = [];
        $scope.otherData = {};
        $scope.notes = '';
        $scope.shotCountData = {
            shots: 0,
            onGoal: 0,
            offGoal: 0,
            blocked: 0
        };

        $scope.populateGameData(dataService.getCurrentGame()); // initialize game data

        // when a game is clicked on from the scheduler
        $scope.$on(configService.messages.setGame, function(event, data) {
            // set everything to empty so we do not conflict with previous information
            $scope.currPlayer = {};
            $scope.players = [];
            $scope.gameSubs = {};
            $scope.shotLinesData = [];
            $scope.passData = {};
            $scope.currFormation = [];
            $scope.otherData = {};
            $scope.notes = '';
            $scope.shotCountData = {
                shots: 0,
                onGoal: 0,
                offGoal: 0,
                blocked: 0
            };

            // clear timeline
            $rootScope.$broadcast(configService.messages.notableEvents, {players: $scope.players, subs: $scope.gameSubs})
            //$timeout(function() {
                $scope.populateGameData(dataService.getCurrentGame());  // populate the game data
            //});

        });

    });
