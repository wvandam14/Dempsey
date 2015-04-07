soccerStats.controller('gameReviewController', 
    function gameReviewController($scope, $rootScope, $location, configService) {
        $rootScope.$on(configService.messages.setGame, function(msg, data) {
            if(data.game) {
                $scope.currGame = data.game;
            }
            else {
                throw new Error('No game data received');
            }
        });

    	var currentUser = Parse.User.current();
        $scope.currGame = {};       

    });
