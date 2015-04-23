soccerStats.controller('homeController', 
    function homeController($scope, $location, $timeout, toastService, configService, dataService, viewService) {

    	$scope.verified = false;
        $scope.user = {
            name: '',
            accountType: ''
        };


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

                //console.log(teamStats);


                if(!teamStats){
                     $scope.teamStats = {

                        teamGames : { data: []},
                        goalsConceded : 0,
                        goalsScored : 0,
                        avgGoals : 0,
                        ballPossession : 0,
                        foulsCommitted :  0,
                        gamesPlayed : 0,
                        goalsDifference : 0,
                        topAssists : [],
                        topGoals : [],
                        topShots : []
                    };
                }
                else{
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
                        goalsDifference : (teamStats.get("goalsScored") - teamStats.get("goalsConceded")) >= 0 ? '+'.concat(teamStats.get("goalsScored") - teamStats.get("goalsConceded")) : '-'.concat(teamStats.get("goalsScored") - teamStats.get("goalsConceded")), 
                        topAssists : [],
                        topGoals : [],
                        topShots : []
                    };


                    _.each(teamStats.get('topAssists'),function(player){
                        $scope.teamStats.topAssists.push({ name : player.get("name"), num : player.get("playerStats").get("assists") });
                    });





                }
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

       /* $scope.topAssists = [
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
        ];*/

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
        $scope.$on(configService.messages.teamSet, function(event, team) {
            $scope.myPlayers = [];
            if (currentUser.get("accountType") === 1) {
                dataService.getPlayersByTeamId(team.id, function(players) {
                    _.each(players, function(player) {
                        dataService.getSeasonPlayerStatsByPlayerId(player.id, function(stats) {
                            $scope.myPlayers.push(dataService.playerConstructor(player, stats));
                        });
                    });
                });
            } else {
                // console.log(currentUser.get("players"));
                _.each(currentUser.get("players"), function(player) {
                    dataService.getPlayerByPlayerId(player.id, function(player) {
                        // console.log(player);
                        if (player.get("team").id === team.id) {
                            dataService.getSeasonPlayerStatsByPlayerId(player.id, function(stats) {
                                $scope.myPlayers.push(dataService.playerConstructor(player, stats));
                            });
                        }
                    });
                }); 
            }
        });
    
    });
