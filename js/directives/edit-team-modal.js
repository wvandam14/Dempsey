soccerStats.directive('editTeamModal', function ($location, $timeout, $route, $rootScope, viewService, toastService, configService, dataService) {
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
                    dataService.updateTeam($scope.currentTeam.id, editTeam, self);
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
                        logo: $scope.currentTeam.get("logo") ? $scope.currentTeam.get("logo")._url : './img/team-logo-icon.svg',
                        primaryColor: $scope.currentTeam.get("primaryColor") ? $scope.currentTeam.get("primaryColor") : '',
                        name: $scope.currentTeam.get("name"),
                        number: $scope.currentTeam.get("number"),
                        leagueName: $scope.currentTeam.get("leagueName"),
                        ageGroup: $scope.ageGroups[$scope.currentTeam.get("ageGroup")],
                        city: $scope.currentTeam.get("city"),
                        state: $scope.states[$scope.currentTeam.get("state")],
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