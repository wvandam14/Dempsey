soccerStats.controller('gameReviewController', 
    function gameReviewController($scope, $rootScope, $location, $timeout, configService, dataService, viewService) {

        $scope.players = [];
        $scope.shotCountData = {};
        $scope.shotLinesData = [];

        //var gamePlayersTable = Parse.Object.extend("GamePlayerStats");
        //var query = new Parse.Query(gamePlayersTable);
        //query.get("jceOI7KFM3", {
        //    success: function(stats) {
        //        stats.addUnique("shots", {
        //            onGoal: {
        //                    shotPos: {x: 193, y: 138},
        //                    resultPos: {x: 148, y: 24}
        //            },
        //            offGoal: {
        //                    shotPos: {x: 98, y: 111},
        //                    resultPos: {x: 218, y: 24}
        //            },
        //            blocked: {
        //                    shotPos: {x: 157, y: 125},
        //                    resultPos: {x:192, y: 49}
        //            }
        //        });
        //        stats.set("fouls", 8);
        //        //stats.addUnique("cards", {});
        //        stats.addUnique("goals", {
        //            time: "68",
        //            shotPos: {x: 115, y: 69},
        //            resultPos: {x: 166, y: 24}
        //        });
        //        stats.set("playingTime", 0);
        //        stats.addUnique("subbedOut", "88");
        //        stats.addUnique("subbedIn", "53");
        //        stats.set("startingStatus", "On");
        //        stats.set("position", "ST");
        //        stats.set("passes", {
        //            turnovers: 7,
        //            total: 13
        //        });
        //        stats.save(null, {
        //           success: function(stats) {
        //               console.log(stats);
        //           },
        //            error: function(stats, error) {
        //                console.log(error.message);
        //            }
        //        });
        //    },
        //    error: function(stats, error) {
        //        console.log(error.message);
        //    }
        //});

        var populatePlayers = function(teamStatsId) {
            dataService.getGamePlayerStatsById(teamStatsId, function(gamePlayers) {
                _.each(gamePlayers, function(gamePlayer) {
                    dataService.getPlayerByPlayerId(gamePlayer.get("player").id, function(player) {
                        $scope.players.push(dataService.gamePlayerConstructor(player, gamePlayer));
                    });
                });
            });
        };

        var populateStats = function() {
            var shots,
                onGoal,
                offGoal,
                blocked;
            _.each($scope.players, function(player) {
                shots += player.shots.total;
                onGoal += player.shots.onGoal.total;
                offGoal += player.shots.offGoal.total;
                blocked += player.shots.blocked.total;
            });

            $scope.shotCountData = {
                shots: shots,
                onGoal: onGoal,
                offGoal: offGoal,
                blocked: blocked
            };

            console.log($scope.shotCountData);

            var shotLineData;
            _.each($scope.players, function(player) {
                if (player.shots.offGoal.total.length) {
                    for (var i = 0; i < player.shots.offGoal.total.length; i++) {
                        shotLineData =
                        {
                            type: 'off',
                            shotPos: player.shots.offGoal.startPos[i],
                            resultPos: player.shots.offGoal.resultPos[i]
                        };
                        $scope.shotLinesData.push(shotLineData);
                    }
                }
                if (player.shots.onGoal.total.length) {
                    for (var i = 0; i < player.shots.onGoal.total.length; i++) {
                        shotLineData =
                        {
                            type: 'on',
                            shotPos: player.shots.onGoal.startPos[i],
                            resultPos: player.shots.onGoal.resultPos[i]
                        };
                        $scope.shotLinesData.push(shotLineData);
                    }
                }
                if (player.shots.blocks.total.length) {
                    for (var i = 0; i < player.shots.blocks.total.length; i++) {
                        shotLineData =
                        {
                            type: 'on',
                            shotPos: player.shots.blocks.startPos[i],
                            resultPos: player.shots.blocks.resultPos[i]
                        };
                        $scope.shotLinesData.push(shotLineData);
                    }
                }
                if (player.shots.goals.total.length) {
                    for (var i = 0; i < player.shots.goals.total.length; i++) {
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
        };

        var populateGameData = function(game) {

            //console.log(dataService.getCurrentGame());
            dataService.getGameStatsById(game.id, function(game) {
                //console.log(game);
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
                        $scope.players = [];
                        $scope.shotCountData = {};
                        $scope.shotLinesData = [];
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

                        // TODO: async populate players and populate stats
                        populatePlayers(game.get('gameTeamStats').id).then(function(result) {
                            populateStats();
                        });
                    }

                });
            });
        };

        populateGameData(dataService.getCurrentGame());
        $scope.$on(configService.messages.setGame, function(event, data) {
            populateGameData(data.game);
        });


        // $scope.$on(configService.messages.teamChanged,function(event,data){
        //     viewService.goToPage('/home');
        // });

    	var currentUser = Parse.User.current();
        

        // DUMMY DATA

/*        $scope.teamForm = {
            data: [
                {
                    value: 3,
                    color: "#FF7272",
                    highlight: "#FF7272",
                    label: "Defeats"
                },
                {
                    value: 3,
                    color: "#B4B4B4",
                    highlight: "#B4B4B4",
                    label: "Ties"
                },
                {
                    value: 8,
                    color:"#5DA97B",
                    highlight: "#5DA97B",
                    label: "Wins"
                }
            ]
        };
*/
        /*$scope.teamPossession = {
            data: [
                {
                    value: 48,
                    color: "#B4B4B4",
                    highlight: "#B4B4B4",
                    label: "Ties"
                },
                {
                    value: 52,
                    color:"#5DA97B",
                    highlight: "#5DA97B",
                    label: "Wins"
                }
            ]
        };*/




        $scope.currFormation = [
            //{
            //    type: "GK",
            //    player: $scope.players[0],
            //    x: 44,
            //    y: 74
            //},
            //{
            //    type: "CB",
            //    player: $scope.players[1],
            //    x: 56,
            //    y: 55
            //},
            //{
            //    type: "CB",
            //    player: $scope.players[2],
            //    x: 74,
            //    y: 52
            //},
            //{
            //    type: "CB",
            //    player: $scope.players[3],
            //    x: 15,
            //    y: 52
            //},
            //{
            //    type: "CB",
            //    player: $scope.players[4],
            //    x: 33,
            //    y: 55
            //},
            //
            //{
            //    type: "CM",
            //    player: $scope.players[5],
            //    x: 56,
            //    y: 31
            //},
            //{
            //    type: "CM",
            //    player: $scope.players[6],
            //    x: 74,
            //    y: 28
            //},
            //{
            //    type: "CM",
            //    player: $scope.players[7],
            //    x: 15,
            //    y: 28
            //},
            //{
            //    type: "CM",
            //    player: $scope.players[8],
            //    x: 33,
            //    y: 31
            //},
            //
            //{
            //    type: "ST",
            //    player: $scope.players[9],
            //    x: 56,
            //    y: 10
            //},
            //{
            //    type: "ST",
            //    player: $scope.players[10],
            //    x: 33,
            //    y: 10
            //},
        ];

        $scope.currPlayer = dataService.currentPlayer;

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
            console.log($scope.currGame)
            dataService.saveGameAttributes($scope.currGame, ["gameNotes"], [$scope.game.notes]);
        }        

        $scope.notableEvents = [
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
        ];


    });
