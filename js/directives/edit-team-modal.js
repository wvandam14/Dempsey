soccerStats.directive('editTeamModal', function ($location, $timeout, $route, viewService, toastService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/edit-team-modal.html",
        controller: function($scope) {
            var self = 'editTeamModal';
            $scope.currentTeam = {};
            $scope.editTeam = {};
            var currentUser = Parse.User.current();

            $scope.closeModal = function() {
                viewService.closeModal(self);
            }

            // Team information
            $scope.updateTeam = function(editTeam) {
                if (viewService.validateAreaByFormName('teamForm')) {
                    var teamTable = Parse.Object.extend("Team");
                    var query = new Parse.Query(teamTable);
                    query.get($scope.currentTeam.value, {
                        success: function(team) {

                            team.set("leagueName", $scope.editTeam.leagueName);
                            team.set("ageGroup", $scope.editTeam.ageGroup);
                            team.set("primaryColor", $scope.editTeam.primaryColor);
                            team.set("city", $scope.editTeam.city);
                            team.set("name", $scope.editTeam.name);
                            team.set("number", $scope.editTeam.number);
                            team.set("state", (_.invert($scope.states))[$scope.editTeam.state]);
                            if ($scope.editTeam.newLogo) 
                                team.set("logo", $scope.editTeam.newLogo);
                            console.log($scope.editTeam);
                            team.save(null, {
                                success: function (editTeam) {
                                    toastService.success(configService.toasts.teamUpdateSuccess);
                                    $scope.closeModal();
                                    // $route.reload();
                                },
                                error: function(editTeam, error) {
                                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                                }
                            });
                            
                        },
                        error: function(team, error) {
                            toastService.error("There was a an error (" + error.code +"). Please try again.");
                        }
                    });
                    
                } else {
                    toastService.error(configService.toasts.requiredFields);
                }
            }

            $scope.deleteTeam = function(team) {

            };

            $scope.goToPage = function(page) {
                viewService.goToPage(page);
            };

            //below are static arrays
            $scope.ageGroups = dataService.ageGroups;

            $scope.states = dataService.states;
            
            // console.log(dataService.getCurrentTeam());
            if (currentUser) {
                dataService.getTeams( function(_teams) {
                    console.log(dataService.currentTeam);
                    if (jQuery.isEmptyObject(dataService.getCurrentTeam())) 
                        $scope.currentTeam = _teams[0];
                    else
                        $scope.currentTeam = dataService.getCurrentTeam();
                    console.log($scope.currentTeam)
                    $scope.editTeam = {
                        logo: $scope.currentTeam.logo,
                        primaryColor: $scope.currentTeam.color,
                        name: $scope.currentTeam.label,
                        number: $scope.currentTeam.number,
                        leagueName: $scope.currentTeam.league,
                        ageGroup: $scope.ageGroups[$scope.currentTeam.age],
                        city: $scope.currentTeam.city,
                        state: $scope.states[$scope.currentTeam.state],
                        newLogo: ''
                    };
                    //console.log($scope.editTeam);
                });
            }

            $scope.getImageColor = function(color) {
                //console.log('color');
                $scope.editTeam.primaryColor = color;
            }

            $scope.ageGroups = dataService.ageGroups;

            $scope.states = dataService.states;
        }
    };
});