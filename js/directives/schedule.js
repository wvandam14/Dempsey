// directive for handling the schedule of games
soccerStats.directive('schedule', function () {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/schedule.html",
        controller: function($scope, $rootScope, $window, $timeout, configService, viewService, dataService, toastService){

            $scope.games = [];
            $scope.currGame = {};
            var currentUser = dataService.getCurrentUser();

            $scope.range = function(size){
                var input = [];
                for (var i = 0; i < size; i++) input.push(i);
                return input;
              };

            // set the current game to the selected game and redirect to appropriate page
	        $scope.setGame = function (game) {
                //console.log(game);
                
                //console.log(currentUser);
                if (game.status === "not_started" && currentUser.get("accountType") == 2)
                    toastService.error('This game has not been setup yet. Please try again at a later time');
                else {
                    $scope.currGame = game;
                    dataService.setCurrentGame(game);
                    if (game.status === "not_started" && currentUser.get("accountType") == 1)
                        viewService.goToPage('/game-setup');
                    else if (game.status === 'pending') {
                        viewService.openModal('gameDataConfirm');
                        $timeout(function() {
                            $rootScope.$broadcast(configService.messages.pendingStats);
                        });

                    }
                    else
                        viewService.goToPage('/game-review');
                    
                    //$timeout(function() {
                       $rootScope.$broadcast(configService.messages.setGame, {game: $scope.currGame});
                    //});
                }
                
	        };

            // set the current game to the selected game
        	$scope.selectGame = function (game) {
        		$scope.currGame = game;
        	};

            // moving panel to the right
            $scope.goRight = function() {
                if (Math.abs($scope.slidePos) < ($scope.containerWidth - $window.innerWidth - 100)) {
                    $scope.slidePos -= 100;
                }
            }

            // moving panel to the left
            $scope.goLeft = function() {
                if ($scope.slidePos) {
                    $scope.slidePos += 100;
                }
            }

            $scope.getTransform = function() {
                return    "-moz-transform: translate3d(" + $scope.slidePos + "px,0,0);" +
                       "-webkit-transform: translate3d(" + $scope.slidePos + "px,0,0);" +
                            "-o-transform: translate3d(" + $scope.slidePos + "px,0,0);" +
                           "-ms-transform: translate3d(" + $scope.slidePos + "px,0,0);" +
                               "transform: translate3d(" + $scope.slidePos + "px,0,0);"
            }

            // get all games
            $scope.populateGames = function(team) {
                $scope.games = [];
                $scope.currGame = {};
                dataService.getGames(team, function(games){
                    $timeout(function() {
                        $scope.games = games;
                        $scope.currGame = $scope.games.length ? $scope.games[0] : {};
                        //console.log(games)
                    });

                });
            };

            // get all games based if team has changed
            $scope.$on(configService.messages.teamChanged,function(event, data){
                $scope.populateGames(dataService.getCurrentTeam());
            });

            // get all games if status of game has changed
            $scope.$on(configService.messages.gameStatusChanged, function(event, data) {
                $scope.populateGames(dataService.getCurrentTeam());
            });

            $scope.populateGames(dataService.getCurrentTeam()); // initialization
            
            $scope.slidePos = 0; // start at first game
            
        }
    };
});
