﻿// controller in charge of all the features on the home-page
soccerStats.controller('homeController',
    function homeController($scope, $location, $timeout, $rootScope, toastService, configService, dataService, viewService) {

    	$scope.verified = false;
        $scope.user = {
            name: '',
            accountType: ''
        };

        var currentUser = Parse.User.current();     // get current parse user

        // see if a user has been verified. otherwise, notify them
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

        // update player
        $scope.updatePlayer = function(player) {
            viewService.openModal('playerModal');
            $timeout(function() {
                $rootScope.$broadcast(configService.messages.updatePlayer, {state: true, id : player.id}); 
            });
        }

        // populate season team statistics
        $scope.populateTeamStats = function(team) {
            // get season team statistics
            dataService.getSeasonTeamStats(team.id,function(teamStats){
                //console.log(teamStats);
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

                // if the team stats exists, fill in information for season stats
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

                    // top assists
                    _.each(teamStats.get('topAssists'),function(player){
                        //console.log(player);
                        var photo = player.get("photo") ? player.get("photo")._url : "./img/sample/profile-small.jpg";
                        $scope.teamStats.topAssists.push({ name : player.get("name"), num : player.get("playerStats").get("assists"), photo : photo});
                    });

                    // top goals
                    _.each(teamStats.get('topGoals'),function(player){
                        var photo = player.get("photo") ? player.get("photo")._url : "./img/sample/profile-small.jpg";
                        $scope.teamStats.topGoals.push({ name : player.get("name"), num : player.get("playerStats").get("goals"), photo : photo});
                    });

                    // top shots
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
        };

        // Ignore below here
        $scope.isCoach = false;

        // get all of the players based on user account
        $scope.populatePlayers = function() {

            $scope.myPlayers = [];

            // if the current user is a coach
            if (currentUser.get("accountType") === 1) {
                dataService.getPlayersByTeamId(dataService.getCurrentTeam().id, function(players) {
                    _.each(players, function(player) {
                        //console.log(player);
                        dataService.getSeasonPlayerStatsByPlayerId(player.get("playerStats").id, function(stats) {
                            // create a player with information and stats
                            $scope.myPlayers.push(dataService.playerConstructor(player, stats));
                        });
                    });
                });
            } else {
                //console.log(currentUser.get("players"));

                // if the current user is a parent
                _.each(currentUser.get("players"), function(playerPointer) {
                    dataService.getPlayerByPlayerId(playerPointer.id, function(player) {
                        //console.log(player);
                        if (player) {
                            if (player.get("team").id === dataService.getCurrentTeam().id) {
                                //console.log(player);
                                dataService.getSeasonPlayerStatsByPlayerId(player.get("playerStats").id, function (stats) {
                                    //console.log(stats);
                                    $scope.myPlayers.push(dataService.playerConstructor(player, stats));
                                    //console.log($scope.myPlayers);
                                });
                            }
                        }
                    });
                });
            }
        };

        //$scope.populatePlayers();
        //$scope.populateTeamStats(dataService.getCurrentTeam());

        // on team changes, populate the data for players and team stats
        $scope.$on(configService.messages.teamChanged, function(event, data) {
            $scope.myPlayers = [];
            if (!data.refresh)
                $scope.currentTeam = data.team;
            $scope.populatePlayers();
            $scope.populateTeamStats(dataService.getCurrentTeam());
            //$rootScope.$on(configService.messages.homeClicked);
        });

        // if a user has added a player, the page will automatically update that change
        $scope.$on(configService.messages.playerAdded, function(event, player) {
            dataService.getSeasonPlayerStatsByPlayerId(player.get("playerStats").id, function(stats) {
                $scope.myPlayers.push(dataService.playerConstructor(player, stats));
            });
        });

        // initial values
        $scope.myPlayers = [];
        $scope.currentTeam = {};
    });
