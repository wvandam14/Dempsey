soccerStats.directive('teamModal', function (viewService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/team-modal.html",
        controller: function($scope){
            $scope.showTeamForm = false;
            $scope.$on('teamModal', function(event) {
                $scope.showTeamForm = true;
            });
            $scope.goToPage = function(page) {
                viewService.goToPage(page);
            };
        }
    };
});