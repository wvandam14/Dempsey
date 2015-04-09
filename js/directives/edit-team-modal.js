soccerStats.directive('editTeamModal', function ($location, $timeout, $route, viewService, toastService, registerService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/edit-team-modal.html",
        controller: function($scope) {
            var self = 'editTeamModal';
            $scope.currentTeam = {};
            $scope.editTeam = {};

            $scope.closeModal = function() {
                viewService.closeModal(self);
            }

            // Team information
            
            console.log($scope.editTeam);


            $scope.addNewTeam = function(editTeam) {
                var _team = registerService.registerTeam(editTeam);


                _team.save(null, {
                    success: function(_team) {
                        var currentUser = Parse.User.current();
                        currentUser.addUnique("teams", _team);
                        currentUser.save(null, {
                            success: function(currenUser) {
                                toastService.success(configService.toasts.teamAddSuccess);
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

            var currentUser = Parse.User.current();
            if (currentUser) {
                dataService.getTeams( function(_teams) {
                    $scope.currentTeam = _teams[0];
                    $scope.editTeam = {
                        logo: $scope.currentTeam.logo,
                        primaryColor: $scope.currentTeam.color,
                        name: $scope.currentTeam.label,
                        number: $scope.currentTeam.number,
                        leagueName: $scope.currentTeam.league,
                        ageGroup: $scope.ageGroups[$scope.currentTeam.age],
                        city: $scope.currentTeam.city,
                        state: $scope.states[$scope.currentTeam.state]
                    };
                    console.log($scope.editTeam);
                });
            }

            $scope.ageGroups = dataService.ageGroups;

            $scope.states = dataService.states;
        }
    };
});