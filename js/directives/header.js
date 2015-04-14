soccerStats.directive('header', function ($timeout, $route, viewService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/header.html",
        controller: function($scope, dataService){
            $scope.showTeams = false;
            $scope.showAccount = false;
            $scope.currentTeam = {};
            $scope.teams = [];

            var self = 'headerModal';

            var parseUser = Parse.User.current();
            if (parseUser)
                $scope.currentUser = {initials: (parseUser.get('firstName')[0] + parseUser.get('lastName')[0]) };

            $scope.toggleTeams = function() {
                $scope.showTeams = !$scope.showTeams;
            }

            $scope.toggleAccount = function() {
                $scope.showAccount = !$scope.showAccount;
            }

            // create a new team
            $scope.showCreateTeam = function() {
                viewService.openModal('teamModal');
            }
            // edit coach account
            $scope.showEditAccount = function() {
                viewService.openModal('accountModal');
            }

            // edit team 
            $scope.editTeam = function() {
                viewService.openModal('editTeamModal');
            }

            // coach can invite more parents
            $scope.inviteEmails = function() {
                viewService.openModal('inviteEmailModal');
            }

            $scope.changeTeam = function(team) {
                $scope.currentTeam = team;
                // console.log($scope.currentTeam);
                dataService.setCurrentTeam($scope.currentTeam);
                //$route.reload();
            }

            $scope.$on(configService.messages.addNewTeam, function(event, team) {
                $timeout(function() {
                    // console.log(team);
                    $scope.teams.push(team);
                    $scope.currentTeam = team;
                    dataService.setCurrentTeam($scope.currentTeam);
                });
            });
            // TODO: verify if user is logged in
            if (Parse.User.current()) {
                $scope.teams = dataService.getTeams( function(_teams) {
                    $scope.currentTeam = _teams[0];
                });
            }
            
        }
    };
});
