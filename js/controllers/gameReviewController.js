soccerStats.controller('gameReviewController', 
    function gameReviewController($scope, $location) {

    	var currentUser = Parse.User.current();
        $scope.currGame = {};
        $scope.team = {};
        $scope.against = {};
        $scope.currGame.date = "April 1, 2015";
        $scope.team.name = "Seattle Sounders FC";
        $scope.against.name = "FC Dallas";
        $scope.team.score = 2;
        $scope.against.score = 1;
        
        

    });
