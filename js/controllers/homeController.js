soccerStats.controller('homeController', 
    function homeController($scope, $location, $timeout, $rootScope, toastService, configService, dataService, viewService) {

    	$scope.verified = false;
        $scope.user = {
            name: '',
            accountType: ''
        };

        $scope.myPlayers = [];
        $scope.currentTeam = {};


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

       /* var seasonPlayersTable = Parse.Object.extend("SeasonPlayerStats");
        var query = new Parse.Query(seasonPlayersTable);
        query.get("BVzkQmN2MY", {
            success: function (player) {
                player.set("shots", {
                    total: 10,
                    goals: 3,
                    blocked: 2,
                    onGoal: 5,
                    offGoal: 7
                });
                player.set("passes", {
                    turnovers: 2,
                    total: 10
                });
                //player.set("fouls", 3);
                player.set("cards", {
                    type: "yellow",
                    time: "05:42"
                });
                //player.set("goals", 5);
                //player.set("playingTime", 15.36);
                //player.set("season", "2015-2016");
                //player.set("assists", 10);
                player.save(null, {
                    success: function(player) {
                        console.log('save successful');
                    },
                    error : function(player, error) {
                        console.log(error.message)
                    }
                });
            },
            error: function (player, error) {
                console.log(error.message);
            }
        });*/
        
        // TODO: implement this
        $scope.updatePlayer = function(player) {
            viewService.openModal('playerModal');
            $timeout(function() {
                $rootScope.$broadcast(configService.messages.updatePlayer, {state: true, id : player.id});
            });
            
        }

        $scope.$on(configService.messages.teamChanged,function(event,data){
            dataService.getSeasonTeamStats(data.team.id,function(teamStats){

                console.log(teamStats);
                if(teamStats){
                     var goalsDifference = (teamStats.get("goalsScored") && teamStats.get("goalsConceded")) ? 
                                           teamStats.get("goalsScored") -  teamStats.get("goalsConceded") :
                                            0; 
                    $scope.teamStats = {

                        teamGames : {                        
                            data: [
                                {
                                    value: teamStats.get('gamesDraw') ? teamStats.get('gamesDraw'): '',
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
                        goalsConceded : teamStats.get("goalsConceded") ? teamStats.get("goalsConceded") : '0',
                        goalsScored : teamStats.get("goalsScored") ? teamStats.get("goalsScored") : '0',
                        avgGoals : teamStats.get("avgGoals") ? teamStats.get("avgGoals") : '0',
                        ballPossession : teamStats.get("ballPossession") ? teamStats.get("ballPossession") : '0',
                        foulsCommitted : teamStats.get("foulsCommitted") ? teamStats.get("foulsCommitted") : '0',
                        gamesPlayed : teamStats.get("gamesPlayed") ? teamStats.get("gamesPlayed") : '0',
                        goalsDifference : goalsDifference >= 0 ? '+'.concat(goalsDifference) : goalsDifference,
                        topAssists : [],
                        topGoals : [],
                        topShots : []
                    };


                    _.each(teamStats.get('topAssists'),function(player){
                        var photo = player.get("photo") ? player.get("photo")._url : "./img/sample/profile-small.jpg"; 
                        $scope.teamStats.topAssists.push({ name : player.get("name"), num : player.get("playerStats").get("assists"), photo : photo});
                    });

                    

                    _.each(teamStats.get('topGoals'),function(player){
                        var photo = player.get("photo") ? player.get("photo")._url : "./img/sample/profile-small.jpg"; 
                        $scope.teamStats.topGoals.push({ name : player.get("name"), num : player.get("playerStats").get("goals"), photo : photo});
                    });

                    _.each(teamStats.get('topShots'),function(player){
                        var photo = player.get("photo") ? player.get("photo")._url : "./img/sample/profile-small.jpg"; 
                        $scope.teamStats.topShots.push({ name : player.get("name"), num : player.get("playerStats").get("shots").total, photo : photo});
                    });
                }
                else{
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
            });
        });


        // Ignore below here
        $scope.isCoach = false;
        $scope.$on(configService.messages.teamChanged, function(event, data) {
            $scope.myPlayers = [];
            if (!data.refresh)
                $scope.currentTeam = data.team;
            //console.log($scope.currentTeam);
            if (currentUser.get("accountType") === 1) {
                dataService.getPlayersByTeamId($scope.currentTeam.id, function(players) {
                    _.each(players, function(player) {
                        //console.log(player);
                        dataService.getSeasonPlayerStatsByPlayerId(player.get("playerStats").id, function(stats) {
                            $scope.myPlayers.push(dataService.playerConstructor(player, stats));
                        });
                    });
                });
            } else {
                //console.log(currentUser.get("players"));
                _.each(currentUser.get("players"), function(playerPointer) {
                    dataService.getPlayerByPlayerId(playerPointer.id, function(player) {
                        //console.log(player);
                        if (player.get("team").id === $scope.currentTeam.id) {
                            //console.log(player);
                            dataService.getSeasonPlayerStatsByPlayerId(player.get("playerStats").id, function(stats) {
                                //console.log(stats);
                                $scope.myPlayers.push(dataService.playerConstructor(player, stats));
                                //console.log($scope.myPlayers);
                            });
                        }
                    });
                }); 
            }
            //console.log($scope.myPlayers);
        });

        $scope.$on(configService.messages.playerAdded, function(event, player) {
            dataService.getSeasonPlayerStatsByPlayerId(player.get("playerStats").id, function(stats) {
                $scope.myPlayers.push(dataService.playerConstructor(player, stats));
            })
        });
    
    });
