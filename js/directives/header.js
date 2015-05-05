soccerStats.directive('header', function ($timeout, $rootScope, $route, viewService, configService, dataService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/header.html",
        controller: function($scope){
            $scope.showTeams = false;
            $scope.showAccount = false;
            $scope.currentUser = {};
            $scope.currentTeam = {};
            $scope.teams = [];

            var parseUser = Parse.User.current();
            if (parseUser.fetch() && parseUser.get('firstName')) {
                $scope.currentUser = {initials: (parseUser.get('firstName')[0] + parseUser.get('lastName')[0]) };
            }

            $scope.goToPage = function(page) {
                viewService.goToPage(page);
            }

            $scope.toggleTeams = function() {
                $scope.showTeams = !$scope.showTeams;
            }

            $scope.toggleAccount = function() {
                $scope.showAccount = !$scope.showAccount;
            }

            // create a new team
            $scope.createTeam = function() {
                $scope.toggleTeams();
                viewService.openModal('teamModal');
            }

            // edit team 
            $scope.editTeam = function() {
                viewService.openModal('editTeamModal');
                // $timeout(function() {
                //     $rootScope.$broadcast(configService.messages.updateTeam, {team: $scope.currentTeam, state: true});
                // });
            }

            // edit coach or parent account
            $scope.editAccount = function() {
                $scope.toggleAccount();
                viewService.openModal('accountModal');
            }

            // coach can invite more parents
            $scope.inviteEmails = function() {
                viewService.openModal('inviteEmailModal');
            }

            $scope.addNewPlayer = function() {
                viewService.openModal('playerModal');
                $timeout(function() {
                    $rootScope.$broadcast(configService.messages.updatePlayer, {state: false});
                });
            }

            $scope.changeTeam = function(team) {
                $scope.toggleTeams();
                $scope.currentTeam = team;
                // console.log($scope.currentTeam);
                dataService.setCurrentTeam($scope.currentTeam);

                $timeout(function() {
                   $rootScope.$broadcast(configService.messages.teamChanged, {team: team});
                });
                //$route.reload();
            }

            $scope.createGame = function() {
                viewService.openModal('createGameModal');
            }

            $scope.viewRoster = function() {
                $scope.goToPage('/roster');
                $timeout(function() {
                    $rootScope.$broadcast(configService.messages.teamChanged, {team: dataService.getCurrentTeam()}); 
                });
                
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

            

            // verify if user is logged in
            if (Parse.User.current()) {
                $scope.teams = dataService.getTeams( function(_teams) {
                    //console.log(_teams);
                    $scope.currentTeam = _teams[0];
                    dataService.setCurrentTeam(_teams[0]);
     
                    $timeout(function() {
                       $rootScope.$broadcast(configService.messages.teamChanged, {team: _teams[0]});
                    });
                });
                //$rootScope.$broadcast(configService.messages.teamChanged, {team: $scope.teams[0]});
                
            }
        }
    };
});
