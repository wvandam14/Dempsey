soccerStats.controller('testController',
    function testController($scope, $location, toastService, configService, dataService) {
    		var currentUser = Parse.User.current();
    		$scope.players = dataService.getPlayers( function(dictionary) {
    			
    		});
    		
    });
