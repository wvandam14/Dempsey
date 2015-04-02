soccerStats.directive('header', function () {
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

        }
    };
});
