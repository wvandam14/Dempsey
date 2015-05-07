soccerStats.directive('gameTimeline', function ($rootScope, $location, $timeout, configService, dataService, viewService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/game-timeline.html",
        controller: function($scope){

            $scope.events = [];

            $scope.$on(configService.messages.notableEvents, function(msg, data) {
                console.log(data);
                _.each(data.subs, function(sub) {
                    console.log(sub);
                    if (sub.get("isSub") === "out") {
                        var notableEvent = {
                            name: sub.get("subbedOut").get("player").get("lastName"),
                            sub: sub.get("subbedIn").get("player").get("lastName"),
                            time: sub.get("time"),
                            type: 'sub',
                            opponent: false
                        };
                        //console.log(notableEvent);
                        $scope.events.push(notableEvent);
                    }
                });
                _.each(data.players, function(player) {
                    _.each(player.total.red.time, function(red) {
                        var notableEvent = {
                            name: player.lname,
                            time: red,
                            type: 'red',
                            opponent: false
                        };
                        $scope.events.push(notableEvent);
                    });
                    _.each(player.total.yellow.time, function(yellow) {
                        var notableEvent = {
                            name: player.lname,
                            time: yellow,
                            type: 'yellow',
                            opponent: false
                        };
                        $scope.events.push(notableEvent);
                    });
                    _.each(player.shots.goals.time, function(goal) {
                        var notableEvent = {
                            name: player.lname,
                            time: goal,
                            type: 'goal',
                            opponent: false
                        };
                        $scope.events.push(notableEvent);
                    });
                });
            });
        //     $scope.events = [
        //         {
        //               name: 'Dempsey'
        //             , time: '13'
        //             , type: 'goal'
        //             , opponent: false
        //         }
        //         , {
        //               name: 'Alonso'
        //             , time: '33'
        //             , type: 'yellow'
        //             , opponent: false
        //         }
        //         , {
        //               name: 'FC Dallas'
        //             , time: '50'
        //             , type: 'goal'
        //             , opponent: true
        //         }
        //         , {
        //               name: 'Dempsey'
        //             , time: '71'
        //             , type: 'goal'
        //             , opponent: false
        //         }
        //         , {
        //               name: 'Dempsey'
        //             , sub: 'Barret'
        //             , time: '79'
        //             , type: 'sub'
        //             , opponent: false
        //         }
        //     ]
        }
    };
});
