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
                $timeout(function() {
                    if (data.state) {
                        $scope.update = true;
                        $scope.players = dataService.getPlayerByPlayerId(data.id, function(player) {
                            var _team = _.find($scope.teamDict, function(obj){return obj.id == player.get("team").id});
                            $scope.player = {
                                photo: player.get("photo") ? player.get("photo")._url : './img/team-logo-icon.svg',
                                name: player.get("name"),
                                birthday: player.get("birthday"),
                                team: _team,
                                jerseyNumber: player.get("jerseyNumber"),
                                city: player.get("city"),
                                state: $scope.states[player.get("state")],
                                emergencyContact: {
                                    name: player.get("emergencyContact"),
                                    phone: player.get("phone"),
                                    relationship: player.get("relationship")
                                },
                                newPhoto: '',
                                id : player.id
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
                        var seasonPlayerStats = Parse.Object.extend("SeasonPlayerStats");
                        var playerStats = new seasonPlayerStats();
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
                                newPlayer.set("playerStats", playerStats);
                                //update parse
                                newPlayer.save(null, {
                                    success: function (newPlayer) {
                                        currentUser.addUnique("players", newPlayer);
                                        currentUser.save(null, {
                                            success: function (currentUser) {
                                                toastService.success("Player, " + player.name + ", successfully added.");
                                                $scope.closeModal();
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
                                        // $route.reload();
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