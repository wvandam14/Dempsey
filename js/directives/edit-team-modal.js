soccerStats.directive('editTeamModal', function (viewService, toastService, registerService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/edit-team-modal.html",
        controller: function($scope) {
            var self = 'editTeamModal';

            $scope.closeModal = function() {
                viewService.closeModal(self);
            }

            var currentUser = Parse.User.current();
            if (Parse.User.current()) {
                $scope.teams = dataService.getTeams( function(_teams) {
                    $scope.currentTeam = _teams[0];
                    console.log(_teams[0]);
                });
            }
            console.log($scope.currentTeam);
            // Team information
            $scope.editTeam = {
                logo: currentUser.get("photo")._url,
                primaryColor: currentUser.get("primaryColor"),
                name: currentUser.get("name"),
                number: currentUser.get("number"),
                leagueName: currentUser.get("leagueName"),
                ageGroup: currentUser.get("ageGroup"),
                city: currentUser.get("city"),
                state: currentUser.get("state")
            };

            $scope.addNewTeam = function(editTeam) {
                var _team = registerService.registerTeam(editTeam);

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