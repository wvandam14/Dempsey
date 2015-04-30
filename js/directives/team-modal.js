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
                dataService.createNewTeam(_team, self); 
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