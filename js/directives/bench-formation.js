soccerStats.directive('benchFormation', function () {
    return {
        restrict: 'E',
        templateUrl: './templates/directives/bench-formation.html',
        scope: {
            formation: '=',
            selectPlayer: '&',
            isSelected: '&'
        },
        link: function(scope, elem, attrs) {
            scope.init(elem);
        },
        controller: function($scope) {
        	$scope.bench = new Array(7);
            $scope.init = function(elem) {
            }
        }
    };
});
