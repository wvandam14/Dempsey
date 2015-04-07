soccerStats.directive('schedule', function () {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/schedule.html",
        controller: function($scope, $rootScope, configService){
        	 $scope.range = function(size){
			    var input = [];
			    for (var i = 0; i < size; i++) input.push(i);
			    return input;
			  };

	        $scope.setGame = function (game) {
	            $rootScope.$broadcast(configService.messages.setGame, {game: $scope.currGame});
	        };

        	$scope.selectGame = function (index) {
        		$scope.currGame = $scope.games[index];
        	};

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
        }
    };
});
