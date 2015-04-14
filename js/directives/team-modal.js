soccerStats.directive('teamModal', function ($location, $route, $rootScope, $timeout, viewService, toastService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/team-modal.html",
        controller: function($scope) {
            var self = 'teamModal';

            $scope.closeModal = function() {
                viewService.closeModal(self);
            }
            // Team information
            $scope.team = {
                logo: '',
                primaryColor: '',
                name: '',
                number: '',
                leagueName: '',
                ageGroup: '',
                city: '',
                state: ''
            };

            $scope.addNewTeam = function(newTeam) {
                console.log(newTeam);
                var _team = dataService.registerTeam(newTeam);

                _team.save(null, {
                    success: function(_team) {
                        var currentUser = Parse.User.current();
                        currentUser.addUnique("teams", _team);
                        currentUser.save(null, {
                            success: function(currenUser) {
                                toastService.success(configService.toasts.teamAddSuccess);
                                $scope.closeModal();
                                var leagueName = _team.get("leagueName"),
                                    logo = _team.get("logo"),
                                    teamName = _team.get("name"),
                                    ageGroup = _team.get("ageGroup"),
                                    city = _team.get("city"),
                                    teamNumber = _team.get("number"),
                                    state = _team.get("state"),
                                    primaryColor = _team.get("primaryColor")
                                ;
                                $scope.newTeam = {
                                    league: leagueName,
                                    value: _team.id, 
                                    label: teamName, 
                                    logo: logo._url,
                                    age: ageGroup,
                                    city: city,
                                    number: teamNumber,
                                    state: state,
                                    color: primaryColor 
                                };
                                // console.log($scope.newTeam);
                                $rootScope.$broadcast(configService.messages.addNewTeam, $scope.newTeam);
                            },
                            error: function(currentUser, error) {
                                toastService.error("There was a an error (" + error.code +"). Please try again.");
                            }
                        });
                        
                    },
                    error: function(_team, error) {
                        toastService.error("There was a an error (" + error.code +"). Please try again.");
                    }
                }); 
            }

            $scope.goToPage = function(page) {
                viewService.goToPage(page);
            };

            $scope.getImageColor = function(color) {
                console.log('color');
                $scope.team.primaryColor = color;
            }

            //below are static arrays
            $scope.ageGroups = dataService.ageGroups;

            $scope.states = dataService.states;
        }
    };
});