soccerStats.directive('playerModal', function ($location, $rootScope, $timeout, $route, viewService, toastService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/player-modal.html",
        controller: function($scope) {
            var self = 'playerModal';

            $scope.closeModal = function() {
                viewService.closeModal(self);
            }

            $scope.update = false;

            //below are static arrays
            $scope.states = dataService.states;
            
            $scope.$on(configService.messages.updatePlayer, function(event, data) {  
                console.log(data);
                $timeout(function() {
                    if (data.state) {
                        $scope.update = true;
                        $scope.players = dataService.getPlayers(function(dictionary) {
                            console.log(dictionary);
                            var result = _.find($scope.teamDict, function(obj){return obj.id == dictionary[0].team.id});
                            console.log(result);
                            $scope.player = {
                                photo: dictionary[0].photo ? dictionary[0].photo._url : './img/team-logo-icon.svg',
                                name: dictionary[0].name,
                                birthday: dictionary[0].birthday,
                                team: result,
                                jerseyNumber: dictionary[0].jerseyNumber,
                                city: dictionary[0].city,
                                state: $scope.states[dictionary[0].state],
                                emergencyContact: {
                                    name: dictionary[0].contact.emergencyContact,
                                    phone: dictionary[0].contact.phone,
                                    relationship: dictionary[0].contact.relationship
                                },
                                newPhoto: '',
                                id : dictionary[0].id
                            };
                        });
                    } else {
                        $scope.update = false;
                        console.log("add player");
                        // Player object
                        $scope.player = {
                            photo: './img/team-logo-icon.svg',
                            name: 'Zlatan',
                            birthday: '',
                            team: '',
                            jerseyNumber: '12',
                            city: 'Spokane',
                            state: '',
                            emergencyContact: {
                                name: 'Alec Moore',
                                phone: '5093336897',
                                relationship: 'Father'
                            },
                            newPhoto: '',
                            id: ''
                        };
                    }
                });
            });

            

            $scope.goToPage = function(path) {
                $timeout(function() {
                    viewService.goToPage(path);
                });
            }

            // Register a player
            $scope.registerPlayer = function(player) {
                if ($scope.update)
                    $scope.updatePlayer(player);
                else {
                    if (viewService.validateAreaByFormName('playerForm')) {
                        var currentUser = Parse.User.current();
                        var Player = Parse.Object.extend("Players");
                        var newPlayer = new Player();
                        var team = Parse.Object.extend("Team");
                        var query = new Parse.Query(team);
                        query.get(player.team.id, {
                            success: function (team) {
                                if (player.newPhoto)
                                    newPlayer.set("photo", player.newPhoto);
                                newPlayer.set("name", player.name);
                                newPlayer.set("birthday", player.birthday);
                                newPlayer.set("team", team);
                                newPlayer.set("jerseyNumber", player.jerseyNumber);
                                newPlayer.set("city", player.city);
                                newPlayer.set("state", (_.invert($scope.states))[player.state]);
                                newPlayer.set("emergencyContact", player.emergencyContact.name);
                                newPlayer.set("phone", player.emergencyContact.phone);
                                newPlayer.set("relationship", player.emergencyContact.relationship);

                                //update parse
                                newPlayer.save(null, {
                                    success: function (newPlayer) {
                                        currentUser.addUnique("players", newPlayer);
                                        currentUser.save(null, {
                                            success: function (currentUser) {
                                                toastService.success("Player, " + player.name + ", successfully added.");
                                                var seasonPlayerStats = Parse.Object.extend("SeasonPlayerStats");
                                                var playerStats = new seasonPlayerStats();
                                                playerStats.set("player", newPlayer);
                                                // playerStats.addUnique("shots", {
                                                //     blocked: 0,
                                                //     goals: 0,
                                                //     onGoal: 0,
                                                //     offGoal: 0
                                                // });
                                                // playerStats.addUnique("passes", {
                                                //     total: 0,
                                                //     turnovers: 0
                                                // });
                                                // playerStats.set("fouls", 0);
                                                // playerStats.addUnique("cards", {

                                                // });
                                                // playerStats.set("goals", 0);
                                                // playerStats.set("playingTime", 0);
                                                // playerStats.set("season", '');
                                                playerStats.save(null, {
                                                    success: function(player) {
                                                        $scope.closeModal();
                                                        $route.reload();
                                                        console.log('player stats saved');
                                                    },
                                                    error: function(player, error) {
                                                        console.log("Error: " + error.code + " " + error.message);
                                                        toastService.error("There was a an error (" + error.code +"). Please try again."); 
                                                    }
                                                });
                                            },
                                            erorr: function (currentUser, error) {
                                                console.log("Error: " + error.code + " " + error.message);
                                               toastService.error("There was a an error (" + error.code +"). Please try again."); 
                                            }
                                        });
                                    },
                                    error: function (newPlayer, error) {
                                        console.log("Error: " + error.code + " " + error.message);
                                        toastService.error("There was a an error (" + error.code +"). Please try again.");
                                    }
                                });
                            },
                            error: function (teamTable, error) {
                                console.log("Error: " + error.code + " " + error.message);
                                toastService.error("There was a an error (" + error.code +"). Please try again."); 
                            }
                        });
                    } else {
                        toastService.error(configService.toasts.requiredFields);
                    }
                }
            };

            $scope.updatePlayer = function(player) {
                var Player = Parse.Object.extend("Players");
                var query = new Parse.Query(Player);
                query.get(player.id, {
                    success: function(editPlayer) {
                        var teamTable = Parse.Object.extend("Team");
                        query = new Parse.Query(teamTable);
                        query.get(player.team.id, {
                            success: function(team) {
                                //console.log(team);
                                if (player.newPhoto)
                                    editPlayer.set("photo", player.newPhoto);
                                editPlayer.set("name", player.name);
                                editPlayer.set("birthday", player.birthday);
                                editPlayer.set("team", team);
                                editPlayer.set("jerseyNumber", player.jerseyNumber);
                                editPlayer.set("city", player.city);
                                editPlayer.set("state", (_.invert($scope.states))[player.state]);
                                editPlayer.set("emergencyContact", player.emergencyContact.name);
                                editPlayer.set("phone", player.emergencyContact.phone);
                                editPlayer.set("relationship", player.emergencyContact.relationship);
                                editPlayer.save(null, {
                                    success: function(editPlayer) {
                                        toastService.success("Player " + player.name + "'s profile updated.");
                                        $scope.closeModal();
                                        $route.reload();
                                    },
                                    error: function(editPlayer, error) {
                                        console.log("Error: " + error.code + " " + error.message);
                                        toastService.error("There was a an error (" + error.code +"). Please try again."); 
                                    }
                                });
                            },
                            error : function(team, error) {
                                console.log("Error: " + error.code + " " + error.message);
                                toastService.error("There was a an error (" + error.code +"). Please try again."); 
                            }
                        });
                        
                    },
                    error: function(player, error) {
                        console.log("Error: " + error.code + " " + error.message);
                        toastService.error("There was a an error (" + error.code +"). Please try again."); 
                    }
                });
            };

            $scope.states = dataService.states;  
            // TODO: verify if user is logged in
            // moved to dataService
            if (Parse.User.current()) {
                $scope.teamDict = dataService.getTeams( function(dictionary) {
                   //console.log(dictionary);
                });  
            }

        }
    };
});