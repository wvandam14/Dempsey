soccerStats.directive('schedule', function () {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/schedule.html",
        controller: function($scope, $rootScope, $window,$timeout, configService){

           /* $scope.games = [
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
                }
            ];*/

            /*$scope.games = [
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
            ];*/
            
            $scope.getGames = function(callback) {             

                var Teams = Parse.Object.extend("Team");
                var query = new Parse.Query(Teams);


                query.equalTo("name","Seattle Sounders");
                query.first({
                    success : function(team){

                        var Games = Parse.Object.extend("Game");
                        query = new Parse.Query(Games);
                        query.equalTo("team",team);
                        query.find({
                            success : function(games_brute){

                                var game;
                                var games = [];
                                for(var i = 0; i < games_brute.length; i++ ){
                                    game = {
                                        date: games_brute[i].get("date"),
                                        opponent: {
                                            name: games_brute[i].get("opponent"),
                                            symbol: games_brute[i].get("symbol"),
                                            score: "1"
                                        },
                                        team: {
                                            name: team.get("name"),
                                            symbol: team.get("symbol"),
                                            score: "2"
                                        },
                                        status: games_brute[i].get("status")
                                    }

                                   games.push(game);
                                }
                               
                                $scope.games = games;
                                callback(games);
                            },
                            error : function(games,error){
                                console.log("Error: " + error.code + " " + error.message);
                                toastService.error("There was a an error (" + error.code +"). Please try again.");

                            }
                        });
                    },
                    error : function(team,error){
                        console.log("Error: " + error.code + " " + error.message);
                        toastService.error("There was a an error (" + error.code +"). Please try again.");

                    }

                });

            }


           


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

           
            $scope.getGames(function(games) {
                $timeout(function(){
                    $scope.currGame = games.length > 0 ? games[0] : [] ;
                    $scope.containerWidth = games.length * 105;
                });
                //console.log($scope.games);    
            });
            
            /*$scope.currGame = $scope.games.length > 0 ? $scope.games[0] : [] ;
            $scope.containerWidth = $scope.games.length * 105;*/
            
            
            $scope.slidePos = 0;
            

        }
    };
});
