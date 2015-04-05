soccerStats.directive('teamModal', function (viewService, toastService, registerService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/team-modal.html",
        controller: function($scope) {
            var self = 'teamModal';

            $scope.closeModal = function() {
                viewService.closeModal(self);
            }
            $scope.showTeamForm = false;
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

            // listener when 'Create A Team' is pressed from the dropdown menu on header
            $scope.$on('teamModal', function(event) {
                $scope.showTeamForm = true;
            });

            $scope.addNewTeam = function(newTeam) {
                var _team = registerService.registerTeam(newTeam);

                _team.save(null, {
                    success: function(_team) {
                        var currentUser = Parse.User.current();
                        currentUser.addUnique("teams", _team);
                        currentUser.save(null, {
                            success: function(currenUser) {
                                toastService.success(configService.toasts.teamAddSuccess);
                                //TODO: not working
                                viewService.goToPage('/home');
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

            //below are static arrays
            $scope.ageGroups = dataService.ageGroups;

            $scope.states = dataService.states;
        }
    };
});