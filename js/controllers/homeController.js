soccerStats.controller('homeController', 
    function homeController($scope, $location, $timeout, toastService, configService, dataService, viewService) {

    	$scope.verified = false;
        $scope.user = {
            name: '',
            accountType: ''
        };
        $scope.myPlayers = [];

        var currentUser = Parse.User.current();

        if (currentUser.fetch()) {
            $scope.user.name = currentUser.get("name");
            //check for email verification 
            if (!currentUser.get("emailVerified")) {
                 toastService.error(configService.toasts.emailVerification);
                //TODO: disable user functionality until user verifies email
            } else {
            	$scope.verified = true;
            }
        } else {
            //show login page
        }

        // var seasonPlayersTable = Parse.Object.extend("SeasonPlayerStats");
        // var query = new Parse.Query(seasonPlayersTable);
        // query.get("Reh5Ac0Rvn", {
        //     success: function (player) {
        //         player.addUnique("shots", {
        //             goals: 3,
        //             blocked: 2,
        //             onGoal: 5,
        //             offGoal: 7
        //         });
        //         player.addUnique("passes", {
        //             turnovers: 2,
        //             total: 10
        //         });
        //         player.set("fouls", 3);
        //         player.addUnique("cards", {
        //             type: "yellow",
        //             time: "05:42"
        //         });
        //         player.set("goals", 5);
        //         player.set("playingTime", 15.36);
        //         player.set("season", "2015-2016");
        //         player.set("assists", 10);
        //         player.save(null, {
        //             success: function(player) {
        //                 console.log('save successful');
        //             },
        //             error : function(player, error) {
        //                 console.log(error.message)
        //             }
        //         });
        //     },
        //     error: function (player, error) {
        //         console.log(error.message);
        //     }
        // });
        
        // TODO: implement this
        $scope.editPlayerInfo = function (player) {
            console.log("This is where the edit player modal/function will go");
        }

        $scope.$on(configService.messages.teamChanged,function(event,data){
            dataService.getSeasonTeamStats(data.team.id,function(teamStats){
                console.log(teamStats);
                $scope.teamStats = {};

                $scope.teamStats = {

                    teamGames : {                        
                        data: [
                            {
                                value: teamStats.get('gamesDraw'),
                                color: "#B4B4B4",
                                highlight: "#B4B4B4",
                                label: "Draws"
                            },
                            {
                                value:  teamStats.get('gamesWon'),
                                color:"#5DA97B",
                                highlight: "#5DA97B",
                                label: "Wins"
                            },
                            {
                                value:  teamStats.get('gamesDefeat'),
                                color:"#FF7373",
                                highlight: "#FF7373",
                                label: "Losses"
                            }
                        ]
                    },
                    goalsConceded : teamStats.get("goalsConceded"),
                    goalsScored : teamStats.get("goalsScored"),
                    avgGoals : teamStats.get("avgGoals"),
                    ballPossession : teamStats.get("ballPossession"),
                    foulsCommitted :  teamStats.get("foulsCommitted"),
                    gamesPlayed : teamStats.get("gamesPlayed"),
                    goalsDifference : (teamStats.get("goalsScored") - teamStats.get("goalsConceded")) >= 0 ? '+'.concat(teamStats.get("goalsScored") - teamStats.get("goalsConceded")) : '-'.concat(teamStats.get("goalsScored") - teamStats.get("goalsConceded")) 
                };
                
            });
        });


        $scope.topGoals = [
            {
                name: 'CLINT DEMPSEY',
                num: 4
            },
            {
                name: 'OBAFEMI MARTINS',
                num: 3
            },
            {
                name: 'MARCO PAPPA',
                num: 2
            },
            {
                name: 'LAMAR NEAGLE',
                num: 1
            },
            {
                name: 'ANDY ROSE',
                num: 1
            },
        ];

        $scope.topAssists = [
            {
                name: 'OBAFEMI MARTINS',
                num: 4
            },
            {
                name: 'CLINT DEMPSEY',
                num: 3
            },
            {
                name: 'MARCO PAPPA',
                num: 2
            },
            {
                name: 'LAMAR NEAGLE',
                num: 1
            },
            {
                name: 'ANDY ROSE',
                num: 1
            },
        ];

        $scope.topShots = [
            {
                name: 'OBAFEMI MARTINS',
                num: 4
            },
            {
                name: 'CLINT DEMPSEY',
                num: 3
            },
            {
                name: 'MARCO PAPPA',
                num: 2
            },
            {
                name: 'LAMAR NEAGLE',
                num: 1
            },
            {
                name: 'ANDY ROSE',
                num: 1
            },
        ];


        // Ignore below here
        $scope.isCoach = false;
        $scope.$on(configService.messages.teamSet, function(event, obj) {
            dataService.getPlayersByTeamId(obj.id, function(players) {
                _.each(players, function(player) {
                    dataService.getSeasonPlayerStatsByPlayerId(player.id, function(stats) {
                        //console.log(index);
                        var index = $scope.myPlayers.push({
                            photo: player.attributes.photo ? player.attributes.photo._url : './img/player-icon.svg',
                            fname: player.attributes.name,
                            lname: '',
                            number: player.attributes.jerseyNumber,
                            position: '',
                            total: {
                                goals: stats.attributes.goals ? stats.attributes.goals : 0,
                                fouls: stats.attributes.fouls ? stats.attributes.fouls : 0,
                                playingTime : stats.attributes.playingTime ? Math.round(stats.attributes.playingTime) : 0,
                                assists: stats.attributes.assists ? stats.attributes.assists : 0,
                                yellows: 0,
                                reds: 0,
                                cardInit : function(playerCard, stats) {
                                    //console.log(stats);
                                    _.each(stats.attributes.cards, function(card) {
                                        if (card.type === "yellow")
                                            playerCard.yellows++;
                                        else if (card.type === "red")
                                            playerCard.reds++;
                                    });
                                }
                            },
                            // TODO: how are we calculating shot accuracy?
                            shots : {
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
                                accuracy: 0,
                                blocks: 0,
                                onGoal: 0,
                                offGoal: 0,
                                goals: 0,
                                shotInit: function(playerShot, stats) {
                                    _.each(stats.attributes.shots, function(shot) {
                                        playerShot.blocks += shot.blocked;
                                        playerShot.onGoal += shot.onGoal;
                                        playerShot.offGoal += shot.offGoal;
                                        playerShot.goals += shot.goals;
                                    });
                                    var total = playerShot.blocks + playerShot.onGoal + playerShot.offGoal + playerShot.goals;
                                    playerShot.accuracy = Math.round(((total - playerShot.offGoal) / total)*100);
                                    playerShot.data[0].value = playerShot.offGoal;
                                    playerShot.data[1].value = total;
                                }
                            },
                            passes: {
                                data : [
                                    {
                                        value: 0,
                                        color: "#B4B4B4",
                                        highlight: "#B4B4B4",
                                        label: "Turnovers"
                                    },
                                    {
                                        value: 0,
                                        color:"#5DA97B",
                                        highlight: "#5DA97B",
                                        label: "Total Passes"
                                    }
                                ],
                                completion: '0/0',
                                turnovers: 0,
                                total: 0,
                                passInit: function(playerPass, stats) {
                                    _.each(stats.attributes.passes, function(pass) {
                                        playerPass.turnovers += pass.turnovers;
                                        playerPass.total += pass.total;
                                    });
                                    playerPass.completion = (playerPass.total-playerPass.turnovers) + '/' + playerPass.total;
                                    playerPass.data[0].value = playerPass.turnovers;
                                    playerPass.data[1].value = playerPass.total;
                                }
                            },
                            phone: "(123) 456 7890",
                            emergencyContact: {
                                name: player.attributes.emergencyContact,
                                phone: player.attributes.phone,
                                relationship: player.attributes.relationship
                            }
                        }) - 1; 
                        // console.log(index);
                        if (stats.attributes.cards)
                            $scope.myPlayers[index].total.cardInit($scope.myPlayers[index].total, stats);
                        if (stats.attributes.shots)
                            $scope.myPlayers[index].shots.shotInit($scope.myPlayers[index].shots, stats); 
                        if (stats.attributes.passes)
                            $scope.myPlayers[index].passes.passInit($scope.myPlayers[index].passes, stats); 
                    });
                });
            });
        });
        
    });
