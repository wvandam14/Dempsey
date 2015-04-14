soccerStats.controller('testController',
    function testController($scope, $location, toastService, configService) {

    	var currentUser = Parse.User.current();
    	$scope.game = {
    			team : '',
				opponent : '',
				opponentSymbol : '',
				startTime : '',
				halfTimeStart : '',
				halfTimeEnd : '',
				endTime : '',
				date : '',
				location : '',
				status : 'Recap'
    	};


    	$scope.addGame = function(game){

    		var Team = Parse.Object.extend("Team");
    		var query = new Parse.Query(Team);

    		query.equalTo("name","Seattle Sounders");
    		query.find().then(function(teams){
    			game.team = teams[0];

    			var Game = Parse.Object.extend("Game");
    			var newGame = new Game;
    			newGame.set("team",game.team);
    			newGame.set("opponent",game.opponent);
    			newGame.set("opponentSymbol",game.opponentSymbol);
    			newGame.set("startTime",game.startTime);
    			newGame.set("halfTimeStart",game.halfTimeStart);
    			newGame.set("halfTimeEnd",game.halfTimeEnd);
    			newGame.set("endTime",game.endTime);
    			newGame.set("date",game.date);
    			newGame.set("location",game.location);
    			newGame.set("status",game.status);

    			newGame.save(null,{
    				success : function(game){
    					console.log("Success");
    				},
    				error : function(game,error){
		    			console.log("Error: " + error.code + " " + error.message);
		                toastService.error("There was a an error (" + error.code +"). Please try again.");
		            }
				});
    		});

	   	}
});
