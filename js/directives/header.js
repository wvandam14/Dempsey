soccerStats.directive('header', function (viewService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/header.html",
        controller: function($scope){
            $scope.showTeams = false;
            $scope.showAccount = false;

            $scope.toggleTeams = function() {
                $scope.showTeams = !$scope.showTeams;
            }

            $scope.toggleAccount = function() {
                $scope.showAccount = !$scope.showAccount;
            }

            $scope.showCreateTeam = function() {
                viewService.openModal('teamModal');
            }

            // $scope.teamDict = dataService.getTeams();
            // $scope.defaultTeam = $scope.teamDict.0[label];
            $scope.defaultTeam = 'Seattle Sounders FC';
        }
        
    };
});
