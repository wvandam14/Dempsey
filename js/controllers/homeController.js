soccerStats.controller('homeController', 
    function homeController($scope, $location, toastService, configService, dataService) {

    	$scope.verified = false;
        $scope.user = {
            name: '',
            accountType: ''
        };
        $scope.myPlayers = [];

        var currentUser = dataService.currentUser;

        if (currentUser) {
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
        //         player.set("fouls", 3);
        //         player.addUnique("cards", {
        //             type: "yellow",
        //             time: "05:42"
        //         });
        //         player.set("goals", 5);
        //         player.set("playingTime", 15.36);
        //         player.set("season", "2015-2016");
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

        $scope.teamGames = {
            data: [
                {
                    value: 3,
                    color: "#B4B4B4",
                    highlight: "#B4B4B4",
                    label: "Ties"
                },
                {
                    value: 7,
                    color:"#5DA97B",
                    highlight: "#5DA97B",
                    label: "Wins"
                },
                {
                    value: 4,
                    color:"#FF7373",
                    highlight: "#FF7373",
                    label: "Losses"
                }
            ]
        };

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
                        $scope.myPlayers.push({
                            photo: player.attributes.photo ? player.attributes.photo._url : './img/player-icon.svg',
                            fname: player.attributes.name,
                            lname: '',
                            number: player.attributes.jerseyNumber,
                            position: '',
                            total: {
                                goals: stats.attributes.goals,
                                passes:1,
                                corners:2,
                                fouls:3,
                                yellows:4,
                                reds:5
                            },
                            phone: "(123) 456 7890",
                            emergencyContact: {
                                name: player.attributes.emergencyContact,
                                phone: player.attributes.phone,
                                relationship: player.attributes.relationship
                            }
                        }); 
                    });
                    // console.log(player);
                    
                });
            });

        });
    });
