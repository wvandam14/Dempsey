soccerStats.controller('gameReviewController', 
    function gameReviewController($scope, $rootScope, $location, $timeout, configService, dataService, viewService) {

        $scope.initCurrFormation = function() {
            $scope.currFormation = [
                {
                   type: "GK",
                   player: $scope.players[0],
                   x: 44,
                   y: 74
                },
                {
                   type: "CB",
                   player: $scope.players[1],
                   x: 56,
                   y: 55
                },
                {
                   type: "CB",
                   player: $scope.players[2],
                   x: 74,
                   y: 52
                },
                {
                   type: "CB",
                   player: $scope.players[3],
                   x: 15,
                   y: 52
                },
                {
                   type: "CB",
                   player: $scope.players[4],
                   x: 33,
                   y: 55
                },
                
                {
                   type: "CM",
                   player: $scope.players[5],
                   x: 56,
                   y: 31
                },
                {
                   type: "CM",
                   player: $scope.players[6],
                   x: 74,
                   y: 28
                },
                {
                   type: "CM",
                   player: $scope.players[7],
                   x: 15,
                   y: 28
                },
                {
                   type: "CM",
                   player: $scope.players[8],
                   x: 33,
                   y: 31
                },
                
                {
                   type: "ST",
                   player: $scope.players[9],
                   x: 56,
                   y: 10
                },
                {
                   type: "ST",
                   player: $scope.players[10],
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
                        value: 95,
                        color: "#B4B4B4",
                        highlight: "#B4B4B4",
                        label: "Missed"
                    },
                    {
                        value: 5,
                        color:"#5DA97B",
                        highlight: "#5DA97B",
                        label: "Completed"
                    }
                ],
                turnovers: 0,
                total: 0,
                successRate: 0
            };


            $scope.shotCountData = {
                shots: 0,
                onGoal: 0,
                offGoal: 0,
                blocked: 0
            };
            //console.log($scope.players);
            _.each($scope.players, function(player) {
                $scope.shotCountData.shots += player.shots.total;
                $scope.shotCountData.onGoal += player.shots.onGoal.total;
                $scope.shotCountData.offGoal += player.shots.offGoal.total;
                $scope.shotCountData.blocked += player.shots.blocks.total;
                $scope.passData.turnovers += player.passes.turnovers;
                $scope.passData.total += player.passes.total;
            });

            $scope.passData.successRate = $scope.passData.total && $scope.passData.turnovers ? Math.round((($scope.passData.total - $scope.passData.turnovers) / $scope.passData.total)*100) : 0;
            $scope.passData.data[1].value = $scope.passData.successRate;
            $scope.passData.data[0].value = 100 - $scope.passData.successRate;

            $scope.initCurrFormation();

            //console.log($scope.passData);
            $scope.shotLinesData = [];
            _.each($scope.players, function(player) {
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
                            type: 'on',
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
            console.log($scope.shotLinesData);
            
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
                            goalsMade : game.get('gameTeamStats').get('goalsMade') ? game.get('gameTeamStats').get('goalsMade') : 0,
                            goalsTaken : game.get('gameTeamStats').get('goalsTaken') ? game.get('gameTeamStats').get('goalsTaken') : 0,
                            passes : game.get('gameTeamStats').get('passes') ? game.get('gameTeamStats').get('passes') : 0,
                            tackles : game.get('gameTeamStats').get('tackles') ? game.get('gameTeamStats').get('tackles') : 0,
                            fouls :  game.get('gameTeamStats').get('fouls') ? game.get('gameTeamStats').get('fouls') : 0,
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

        // $scope.setGame = function(game) {
        //     console.log(dataService.getCurrentGame());
        //     //console.log(game);
        //       // $scope.populateGameData(game).then(function(gameStats){
        //       //       $scope.populatePlayers(gameStats);
        //       //   }).then(function(result){
        //       //       $scope.populateStats();
        //       //   });
        //     $scope.populateGameData(game);
        // }
           
        var currentUser = Parse.User.current();
        $scope.currPlayer = dataService.currentPlayer;

        $scope.players = [];
        $scope.gameSubs = {};
        $scope.shotLinesData = [];
        $scope.passData = {};
        $scope.currFormation = [];
        $scope.notes = '';
        $scope.shotCountData = {
            shots: 0,
            onGoal: 0,
            offGoal: 0,
            blocked: 0
        };


        $scope.$on(configService.messages.setGame, function(event, data) {
            //$timeout(function() {
                $scope.populateGameData(dataService.getCurrentGame()); 
            //});
            
        });

    });
