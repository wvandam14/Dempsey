soccerStats.directive('header', function ($timeout, viewService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/header.html",
        controller: function($scope, dataService){
            $scope.showTeams = false;
            $scope.showAccount = false;

            var parseUser = Parse.User.current();
            // Todo: Update this code to get the initials when we have a first and last name field
            $scope.currentUser = {initials: ((parseUser.get('name').split(' ')[0])[0] + (parseUser.get('name').split(' ')[1])[0]) };

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

            $scope.temaDict = [];
            $scope.teamDict = dataService.getTeams();
        }
    };
});
