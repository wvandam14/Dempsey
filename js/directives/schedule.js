soccerStats.directive('schedule', function () {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/schedule.html",
        controller: function($scope, $rootScope, $window, $timeout, configService, viewService,dataService){

            $scope.games = [];
            $scope.currGame = {};

            $scope.range = function(size){
                var input = [];
                for (var i = 0; i < size; i++) input.push(i);
                return input;
              };

	        $scope.setGame = function (game) {
                //console.log($scope.currGame);
                viewService.goToPage('/game-review');
                $scope.selectGame(game);
                $timeout(function() {
	               $rootScope.$broadcast(configService.messages.setGame, {game: $scope.currGame});
                });
                
	        };

        	$scope.selectGame = function (game) {
        		$scope.currGame = game;
        	};

            $scope.goRight = function() {
                if (Math.abs($scope.slidePos) < ($scope.containerWidth - $window.innerWidth - 100)) {
                    $scope.slidePos -= 100;
                }
            }

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



            //populateGames(dataService.getCurrentTeam());

            $scope.$on(configService.messages.teamChanged,function(event,data){
                $scope.games = [];
                $scope.currGame = {};
                dataService.getGames(data.team, function(games){
                    $timeout(function() {
                        $scope.games = games;
                        $scope.currGame = $scope.games.length ? $scope.games[0] : {};
                        dataService.setCurrentGame($scope.currGame);
                    });

                });
            });
            
            $scope.slidePos = 0;
            
        }
    };
});
