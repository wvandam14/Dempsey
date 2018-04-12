// directive to handle all of the notable events for each game: cards, substitutions, goals
soccerStats.directive('gameTimeline', function ($rootScope, $location, $timeout, configService, dataService, viewService) {
    return {
        restrict: 'E',
        templateUrl: "./templates/directives/game-timeline.html",
        controller: function($scope){

            $scope.events = [];

            // when the page is ready to receive notable events and is done setting up players
            $scope.$on(configService.messages.notableEvents, function(msg, data) {
                console.log(data);
                $scope.events = [];

                // for substitution events
                _.each(data.subs, function(sub) {
                    if (sub.get("isSub")) {
                        var notableEvent = {
                            name: sub.get("subbedOut").get("lastName"),
                            sub: sub.get("subbedIn").get("lastName"),
                            time: sub.get("time"),
                            type: 'sub',
                            opponent: false
                        };
                        //console.log(notableEvent);
                        $scope.events.push(notableEvent);
                    }
                });

                // for red and yellow cards
                _.each(data.players, function(player) {
                    // red cards
                    _.each(player.total.red.time, function(red) {
                        var notableEvent = {
                            name: player.lname,
                            time: red,
                            type: 'red',
                            opponent: false
                        };
                        $scope.events.push(notableEvent);
                    });

                    // yellow cards
                    _.each(player.total.yellow.time, function(yellow) {
                        var notableEvent = {
                            name: player.lname,
                            time: yellow,
                            type: 'yellow',
                            opponent: false
                        };
                        $scope.events.push(notableEvent);
                    });

                    // goals
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
        }
    };
});
