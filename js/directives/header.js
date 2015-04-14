soccerStats.directive('header', function ($timeout, $rootScope, $route, viewService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/header.html",
        controller: function($scope){
            $scope.showTeams = false;
            $scope.showAccount = false;
            $scope.currentTeam = {};
            $scope.teams = [];

            var parseUser = Parse.User.current();
            if (parseUser && parseUser.get('firstName')) {
                $scope.currentUser = {initials: (parseUser.get('firstName')[0] + parseUser.get('lastName')[0]) };
            }

            $scope.toggleTeams = function() {
                $scope.showTeams = !$scope.showTeams;
            }

            $scope.toggleAccount = function() {
                $scope.showAccount = !$scope.showAccount;
            }

            // create a new team
            $scope.showCreateTeam = function() {
                $scope.toggleTeams();
                viewService.openModal('teamModal');
            }
            // edit coach account
            $scope.showEditAccount = function() {
                $scope.toggleAccount();
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

            $scope.addNewPlayer = function() {
                console.log('add player');
                viewService.openModal('playerModal');
            }

            // coach can invite more parents
            $scope.viewPlayer = function() {
                viewService.openModal('inviteEmailModal');
            }

            $scope.changeTeam = function(team) {
                $scope.toggleTeams();
                $scope.currentTeam = team;
                // console.log($scope.currentTeam);
                dataService.setCurrentTeam($scope.currentTeam);
                //$route.reload();
            }

            $scope.createGame = function() {
                viewService.openModal('createGameModal');
            }

            $scope.$on(configService.messages.addNewTeam, function(event, team) {
                $timeout(function() {
                    // console.log(team);
                    $scope.teams.push(team);
                    $scope.currentTeam = team;
                    dataService.setCurrentTeam($scope.currentTeam);
                });
            });

            $scope.$on(configService.messages.updateTeam, function(event, team) {
                $timeout(function() {
                    // console.log($scope.teams);
                    $scope.currentTeam = team;
                    dataService.setCurrentTeam($scope.currentTeam);
                });
            });
            $scope.goToPage = function(page) {
                viewService.goToPage(page);
            }

            // TODO: verify if user is logged in
            if (Parse.User.current()) {
                $scope.teams = dataService.getTeams( function(_teams) {
                    $scope.currentTeam = _teams[0];
                    dataService.setCurrentTeam(_teams[0]);
                    $timeout(function() {
                       $rootScope.$broadcast(configService.messages.teamChanged, {team: _teams[0]});
                    });
                    dataService.setCurrentTeam($scope.currentTeam);
                });
            }
            
        }
    };
});
