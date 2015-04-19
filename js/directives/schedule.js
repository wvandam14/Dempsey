soccerStats.directive('schedule', function () {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/schedule.html",
        controller: function($scope, $rootScope, $window,$timeout, configService, viewService,dataService){

            $scope.getGames = function(_team,callback) {             
            
                var Team = Parse.Object.extend("Team");
                var team = new Team();
                var Games = Parse.Object.extend("Game");
                var query = new Parse.Query(Games);


                team.id = _team.id;
                team.fetch().then(function(team){

                    console.log(team.get('name'));

                    query.equalTo('team',team);
                    query.include('gameTeamStats');
                    query.find().then(function(games_brute){
                        //console.log(games_brute);
                        var game;
                        var games = [];
                        
                        for(var i = 0; i < games_brute.length; i++ ){

                           game = {
                                date: games_brute[i].get("date"),
                                opponent: {
                                    name: games_brute[i].get("opponent"),
                                    symbol: games_brute[i].get("opponentSymbol"),
                                    score: games_brute[i].get("gameTeamStats").get("goalsTaken")
                                },
                                team: {
                                    name: team.get("name"),
                                    symbol: team.get("symbol"),
                                    score: games_brute[i].get("gameTeamStats").get("goalsMade")
                                },
                                status: games_brute[i].get("status")
                            }
                            games.push(game);
                        }

                    callback(games);
                }, function(error){
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");

                });
            });
        }


             $scope.range = function(size){
                var input = [];
                for (var i = 0; i < size; i++) input.push(i);
                return input;
              };

	        $scope.setGame = function (game) {
	            $rootScope.$broadcast(configService.messages.setGame, {game: $scope.currGame});
                viewService.goToPage('/game-review');
                $scope.selectGame(game);
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

            /*
            $scope.getGames(function(games) {
                $timeout(function(){
                    $scope.currGame = games.length > 0 ? games[0] : [] ;
                    $scope.containerWidth = games.length * 105;
                });
                //console.log($scope.games);    
            });
            
            $scope.currGame = $scope.games.length > 0 ? $scope.games[0] : [] ;
            $scope.containerWidth = $scope.games.length * 105;*/


            $scope.$on(configService.messages.teamChanged,function(event,data){
                $scope.getGames(data.team,function(games){
                $scope.games = games;
                $scope.currGame = $scope.games.length ? $scope.games[0] : {};

                //console.log($scope.games);
                //console.log($scope.currGame);
               });
            });
            
            $scope.slidePos = 0;
            

        }
    };
});
