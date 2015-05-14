// directive for handling
soccerStats.directive('playerModal', function ($location, $rootScope, $timeout, $route, viewService, toastService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/player-modal.html",
        controller: function($scope) {
            var self = 'playerModal';

            $scope.closeModal = function() {
                viewService.closeModal(self);
            };

            var currentUser = dataService.getCurrentUser();

            $scope.parents = {};

            $scope.update = false;

            //below are static arrays
            $scope.states = dataService.states;

            // when the modal is clicked on, check if this is a new or existing player
            $scope.$on(configService.messages.updatePlayer, function(event, data) {  
                $timeout(function() {
                    // if player exists
                    if (data.state) {
                        $scope.update = true;   // ready for update
                        // get players
                        $scope.players = dataService.getPlayerByPlayerId(data.id, function(player) {
                            $scope.getParentEmails(player.get("team"));
                            dataService.getParentByPlayerId(player.id, function(parent) {
                                //console.log(parent.get("email"));
                                //parent.id = $scope.parents[parent.get("email")];
                                //console.log(parent.id);
                                var _team = _.find($scope.teamDict, function(obj){return obj.id == player.get("team").id});
                                $scope.player = {
                                    photo: player.get("photo") ? player.get("photo")._url : './img/team-logo-icon.svg',
                                    firstName: player.get("firstName"),
                                    lastName: player.get("lastName"),
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
                                    id : player.id,
                                    parentId: parent ? parent.id : ''
                                };
                                //console.log($scope.player.parentId);
                            });
                        });
                    } else {    // if player does not exist - adding a new player
                        $scope.update = false;
                        //console.log("add player");
                        // Player object
                        $scope.player = {
                            photo: './img/team-logo-icon.svg',
                            firstName: 'Player',
                            lastName: 'Person',
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
            };

            // Register a player
            $scope.registerPlayer = function(player) {
                if ($scope.update)
                    dataService.updatePlayer(player, self);
                else {
                    if (viewService.validateAreaByFormName('playerForm')) {
                        dataService.registerPlayer(player, self, false)
                    } else {
                        toastService.error(configService.toasts.requiredFields);
                    }
                }
            };

            // get parent emails so we can assign players to parents
            $scope.getParentEmails = function(team) {
                //console.log(team.id);
                $scope.parents = {};
                dataService.getParentEmailsByTeamId(team.id, function(parents) {
                    $timeout(function() {
                        _.each(parents, function(parent) {
                            $scope.parents[parent.get("email")] = parent.id;
                        });
                    });
                });
            };

            // allows coach to temporarily register a player for a parent
            $scope.registerTempPlayer = function(player) {
                if ($scope.update)
                    dataService.updatePlayer(player, self);
                else {
                    if (viewService.validateAreaByFormName('tempPlayerForm')) {
                        dataService.registerPlayer(player, self, true)
                    } else {
                        toastService.error(configService.toasts.requiredFields);
                    }
                }
            };

            //TODO: implement this
            $scope.removePlayer = function(player) {
                console.log(player);
                //dataService.removePlayer(player, self);
            };

            $scope.states = dataService.states;  

            if (currentUser) {
                $scope.teamDict = dataService.getTeams( function(dictionary) {
                   //console.log(dictionary);
                });  
            }

        }
    };
});