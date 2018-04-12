// directive handles the bar chart
soccerStats.directive('barChart', function () {
    return {
        restrict: 'E',
        templateUrl: './templates/directives/bar-chart.html',
        scope: {
            data: '='
        },
        link: function(scope, elem, attrs) {
            scope.init(elem);
        },
        controller: function($scope){

            $scope.getHeight = function(num) {
                return (num * 100) / $scope.data.shots;
            }

            $scope.init = function(elem) { }

        }
    };
});
