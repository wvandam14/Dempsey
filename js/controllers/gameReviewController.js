soccerStats.controller('gameReviewController', 
    function gameReviewController($scope, $rootScope, $location, $timeout, configService, dataService, viewService) {

        $scope.initCurrFormation = function() {
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
        };

        $scope.isSelected = function (player) {
            if ( player === $scope.currPlayer ) {
                return true;
            }
            else {
                return false;
            }
        };

        $scope.selectPlayer = function (player) {
            console.log(player);
            $scope.currPlayer = player;
        };

        $scope.saveGameNotes = function () {
            //console.log($scope.currGame)
            dataService.saveGameAttributes(dataService.getCurrentGame(), ["gameNotes"], [$scope.notes]);
        }    

        $scope.populatePlayers = function(teamStatsId) {
            var promise = new Parse.Promise();
            dataService.getGamePlayerStatsById(teamStatsId).then(function(gameTeamStats) {
                $timeout(function() {
                    //console.log(gameTeamStats);
                    $scope.gameSubs = gameTeamStats.get("substitutions");
                    $scope.players = [];
                    _.each(gameTeamStats.get("roster"), function(gamePlayer) {
                        $scope.players.push(dataService.gamePlayerConstructor(gamePlayer.get("player"), gamePlayer));
                    });

                    promise.resolve('success');
                });
            });
            return promise;
        };

        $scope.populateStats = function() {


            var shots = 0,
                onGoal = 0,
                offGoal = 0,
                blocked = 0,
                passCompletion = 0,
                passTotal = 0;

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


            $scope.shotCountData = {
                shots: 0,
                onGoal: 0,
                offGoal: 0,
                blocked: 0
            };

            $scope.otherData = {
                goals: 0,
                fouls: 0,
                reds: 0,
                yellows: 0
            };
            //console.log($scope.players);
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


            $scope.passData.successRate = $scope.passData.total && $scope.passData.completed ? Math.round(( $scope.passData.completed / $scope.passData.total)*100) : 0;
            $scope.passData.data[1].value = $scope.passData.successRate;
            $scope.passData.data[0].value = 100 - $scope.passData.successRate;

            $scope.initCurrFormation();

            //console.log($scope.passData);
            $scope.shotLinesData = [];
            //console.log($scope.players.shots);
            _.each($scope.players, function(player) {
                //console.log($scope.shotLinesData.length);
                var shotLineData = {};
                if (player.shots.offGoal.total) {
                    for (var i = 0; i < player.shots.offGoal.total; i++) {
                        shotLineData =
                        {
                            type: 'off',
                            shotPos: player.shots.offGoal.startPos[i],
                            resultPos: player.shots.offGoal.resultPos[i]
                        };
                        $scope.shotLinesData.push(shotLineData);
                    }
                }
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

            _.each($scope.players, function(player) {
                if (!player.benched) {
                    var position = _.find($scope.currFormation, function(position) {
                        return player.position == position.type
                            && _.isEmpty(position.player)
                    });
                    position.player = player;
                }
            });

            _.each($scope.players, function(player) {
                //console.log(player);
                var assistPlayer = {};
                _.each(player.shots.goals.assistedBy, function(assistId) {
                    //console.log(assistId);
                    assistPlayer = _.find($scope.players, function(assistPlayer) {
                        //console.log(assistPlayer.id);
                        return  assistPlayer.gameId === assistId;
                    });
                    //console.log(assistPlayer);
                    if (assistPlayer) {
                        player.notableEvents.push({
                            type: "Assisted By",
                            assistedBy: assistPlayer.lname
                        });
                    }
                });
            });

            if (currentUser.get("accountType") == 2) {
                _.each($scope.players, function(player) {
                    //console.log(currentUser.get("players"));
                    var child = _.find(currentUser.get("players"), function(childPlayer) {return childPlayer.id == player.playerId});
                    if (child == undefined) {
                        player.myKid = false;
                    }
                });
            }

            $rootScope.$broadcast(configService.messages.notableEvents, {players: $scope.players, subs: $scope.gameSubs});

        };

        $scope.populateGameData = function(game) {
            //console.log(game);
            //var promise = new Parse.Promise();

            dataService.getGameStatsById(game.id).then(function(game) {

                $timeout(function() {

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

                    if(game){
                        $scope.notes = game.get("gameNotes");
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

                        $scope.populatePlayers(game.get('gameTeamStats').id).then(function(result) {
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
           
        var currentUser = Parse.User.current();
        $scope.currPlayer = dataService.currentPlayer;

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

        $scope.populateGameData(dataService.getCurrentGame());

        $scope.$on(configService.messages.setGame, function(event, data) {
            //console.log(dataService.getCurrentGame());
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
            $rootScope.$broadcast(configService.messages.notableEvents, {players: $scope.players, subs: $scope.gameSubs})
            //$timeout(function() {
                $scope.populateGameData(dataService.getCurrentGame());
            //});

        });

    });
