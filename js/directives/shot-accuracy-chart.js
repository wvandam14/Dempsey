// directive in charge of handling the shot accuracy chart
soccerStats.directive('shotAccuracyChart', function () {
    return {
        restrict: 'E',
        templateUrl: './templates/directives/shot-accuracy-chart.html',
        scope: {
            data: '='
        },
        link: function(scope, elem, attrs) {
            scope.init(elem);
        },
        controller: function($scope){



            $scope.init = function(elem) { }

        }
    };
});
