soccerStats.directive('gameTimeline', function () {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/game-timeline.html",
        controller: function($scope){
            $scope.events = [
                {
                      name: 'Dempsey'
                    , time: '13'
                    , type: 'goal'
                    , opponent: false
                }
                , {
                      name: 'Alonso'
                    , time: '33'
                    , type: 'yellow'
                    , opponent: false
                }
                , {
                      name: 'FC Dallas'
                    , time: '50'
                    , type: 'goal'
                    , opponent: true
                }
                , {
                      name: 'Dempsey'
                    , time: '71'
                    , type: 'goal'
                    , opponent: false
                }
                , {
                      name: 'Dempsey'
                    , sub: 'Barret'
                    , time: '79'
                    , type: 'sub'
                    , opponent: false
                }
            ]
        }
    };
});
