soccerStats.directive('header', function ($timeout, viewService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/header.html",
        controller: function($scope, dataService){
            $scope.showTeams = false;
            $scope.showAccount = false;

            var parseUser = Parse.User.current();
            $scope.currentUser = {initials: (parseUser.get('firstName')[0] + parseUser.get('lastName')[0]) };

            $scope.toggleTeams = function() {
                $scope.showTeams = !$scope.showTeams;
            }

            $scope.toggleAccount = function() {
                $scope.showAccount = !$scope.showAccount;
            }

            $scope.showCreateTeam = function() {
                viewService.openModal('teamModal');
            }

            $scope.showEditAccount = function() {
                viewService.openModal('accountModal');
            }

            // TODO: verify if user is logged in
            if (Parse.User.current()) {
                $scope.teamDict = [];
                $scope.teamDict = dataService.getTeams();
            }
            
        }
    };
});
