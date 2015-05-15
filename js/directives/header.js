// directive to handle the navigation bar actions
soccerStats.directive('header', function ($timeout, $rootScope, $route, viewService, configService, dataService, $location) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/header.html",
        controller: function($scope){
            $scope.showTeams = false;
            $scope.showAccount = false;
            $scope.currentUser = {};
            $scope.currentTeam = {};
            $scope.teams = [];
            $scope.loading = false;

            var parseUser = Parse.User.current();
            if (parseUser.fetch() && parseUser.get('firstName')) {
                $scope.currentUser = {initials: (parseUser.get('firstName')[0] + parseUser.get('lastName')[0]) };
            }

            $scope.goToPage = function(page) {
                viewService.goToPage(page);
            };

            $scope.toggleTeams = function() {
                $scope.showTeams = !$scope.showTeams;
            };

            $scope.toggleAccount = function() {
                $scope.showAccount = !$scope.showAccount;
            };

            // create a new team
            $scope.createTeam = function() {
                $scope.toggleTeams();
                viewService.openModal('teamModal');
            };

            // edit team 
            $scope.editTeam = function() {
                viewService.openModal('editTeamModal');
                // $timeout(function() {
                //     $rootScope.$broadcast(configService.messages.updateTeam, {team: $scope.currentTeam, state: true});
                // });
            };

            // edit coach or parent account
            $scope.editAccount = function() {
                $scope.toggleAccount();
                viewService.openModal('accountModal');
            };

            // coach can invite more parents
            $scope.inviteEmails = function() {
                viewService.openModal('inviteEmailModal');
            };

            // user can add new players
            $scope.addNewPlayer = function() {
                viewService.openModal('playerModal');
                $timeout(function() {
                    $rootScope.$broadcast(configService.messages.updatePlayer, {state: false});
                });
            };

            // change the team upon click from dropdown menu
            $scope.changeTeam = function(team) {
                //console.log(team);
                $scope.toggleTeams();
                $scope.currentTeam = team;
                // console.log($scope.currentTeam);
                dataService.setCurrentTeam($scope.currentTeam);

                if ($location.path() === '/game-review')
                    $scope.goToPage('/home');
                $timeout(function() {
                    $rootScope.$broadcast(configService.messages.teamChanged, {team: team});
                });
                //$route.reload();
            };

            // upon click for creating a game
            $scope.createGame = function() {
                viewService.openModal('createGameModal');
            };

            // upon click for viewing the roster
            $scope.viewRoster = function() {
                $scope.goToPage('/roster');
                //$rootScope.$broadcast(configService.messages.teamChanged, {team: dataService.getCurrentTeam()}); 
            };

            $scope.viewHomePage = function() {
                //$scope.loading = true;                 
                $scope.goToPage('/home');
                $timeout(function() {
                    $rootScope.$broadcast(configService.messages.teamChanged, {team: dataService.getCurrentTeam()});                    
                });
                //$scope.loading = false;
             }

            // if a new team has been added, retrieve the update
            $scope.$on(configService.messages.addNewTeam, function(event, team) {
                $timeout(function() {
                    // console.log(team);
                    $scope.teams.push(team);
                    $scope.currentTeam = team;
                    dataService.setCurrentTeam($scope.currentTeam);
                });
            });

            // get recent changes from team update
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
                    // set the current team
                    $scope.currentTeam = _teams[0];
                    dataService.setCurrentTeam(_teams[0]);
                    //console.log(dataService.getCurrentTeam());
                    $timeout(function() {
                        $rootScope.$broadcast(configService.messages.teamChanged, {team: _teams[0]});
                    });
                    
                });
                //$rootScope.$broadcast(configService.messages.teamChanged, {team: $scope.teams[0]});
                
            }
        }
    };
});
