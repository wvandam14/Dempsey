soccerStats.directive('schedule', function () {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/schedule.html",
        controller: function($scope, $rootScope, $window, configService){
            $scope.games = [
                {
                    date: "April 1, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "13"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "7"
                    },
                    status: "loss"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 2, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "8"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "6"
                    },
                    status: "win"
                },
                {
                    date: "April 1, 2015",
                    opponent: {
                        name: "FC Dallas",
                        symbol: "DAL",
                        score: "1"
                    },
                    team: {
                        name: "Seattle Sounders FC",
                        symbol: "SEA",
                        score: "2"
                    },
                    status: "review"
                }
            ];
            $scope.currGame = $scope.games[0];
            $scope.containerWidth = $scope.games.length * 105;
            $scope.slidePos = 0;

             $scope.range = function(size){
                var input = [];
                for (var i = 0; i < size; i++) input.push(i);
                return input;
              };

	        $scope.setGame = function (game) {
	            $rootScope.$broadcast(configService.messages.setGame, {game: $scope.currGame});
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


        }
    };
});
