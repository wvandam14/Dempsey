soccerStats.directive('playerModal', function ($location, $rootScope, $timeout, $route, viewService, toastService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/player-modal.html",
        controller: function($scope) {
            var self = 'playerModal';

            $scope.closeModal = function() {
                viewService.closeModal(self);
            }

            //below are static arrays
            $scope.states = dataService.states;

            // Player object
            $scope.player = {
                photo: '',
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
                newPhoto: ''
            };
            $scope.$on(configService.messages.updatePlayer, function(event, obj) {  
                $timeout(function() {
                    if (obj.state)
                        $scope.players = dataService.getPlayers(function(dictionary) {
                            console.log(dictionary);
                            var result = _.find($scope.teamDict, function(obj){return obj.value == dictionary[0].team.id});
                            console.log(result);
                            $scope.player = {
                                photo: dictionary[0].photo._url,
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
                                }
                            };
                        });
                });
            });

            

            $scope.goToPage = function(path) {
                $timeout(function() {
                    viewService.goToPage(path);
                });
            }

            // Register a player
            $scope.registerPlayer = function(player) {
                if (viewService.validateAreaByFormName('playerForm')) {
                    var currentUser = Parse.User.current();
                    var Player = Parse.Object.extend("Players");
                    var newPlayer = new Player();
                    var team = Parse.Object.extend("Team");
                    var query = new Parse.Query(team);
                    query.get(player.team.value, {
                        success: function (team) {
                            newPlayer.set("photo", player.photo);
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
                                        },
                                        erorr: function (currentUser, error) {
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
                            toastService.error("There was a an error (" + error.code +"). Please try again."); 
                        }
                    });
                } else {
                    toastService.error(configService.toasts.requiredFields);
                }
            };
            $scope.states = dataService.states;  
            // TODO: verify if user is logged in
            // moved to dataService
            if (Parse.User.current()) {
                $scope.teamDict = dataService.getTeams( function() {

                });  
            }

        }
    };
});