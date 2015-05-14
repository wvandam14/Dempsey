// directive for checking the role of a user
soccerStats.directive('role', function ($rootScope) {
    return {
    	
        restrict: 'A',
     	link: function ($scope, element, attrs) {

	    	var parseUser = Parse.User.current();

	    	$scope.checkRole = function(){
	    		var roleList = {'1' : 'coach','2' : 'parent'};
	    		if(attrs.role != roleList[parseUser.get('accountType')] ){
	    			angular.element(element).attr('style','display : none !important');
	    		}
	    	}
    		$scope.checkRole();
    	}
    };
});