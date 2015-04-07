soccerStats.controller('testController',
    function testController($scope, $location, toastService, configService) {


        $scope.teamForm = {
            data: [
                {
                    value: 3,
                    color: "#FF7272",
                    highlight: "#FF7272",
                    label: "Defeats"
                },
                {
                    value: 3,
                    color: "#B4B4B4",
                    highlight: "#B4B4B4",
                    label: "Ties"
                },
                {
                    value: 8,
                    color:"#5DA97B",
                    highlight: "#5DA97B",
                    label: "Wins"
                }
            ]
        };

        $scope.teamPossession = {
            data: [
                {
                    value: 48,
                    color: "#B4B4B4",
                    highlight: "#B4B4B4",
                    label: "Ties"
                },
                {
                    value: 52,
                    color:"#5DA97B",
                    highlight: "#5DA97B",
                    label: "Wins"
                }
            ]
        };


        $scope.shotCountData = {
            shots: 5,
            onGoal: 3,
            offGoal: 1,
            blocked: 1
        }

        // Shot Types: off, on, goal, blocked
        $scope.shotLinesData = [
            {
                type: 'off',
                shotPos: {x: 98, y: 111},
                resultPos: {x: 218, y: 24}
            },
            {
                type: 'blocked',
                shotPos: {x: 157, y: 125},
                resultPos: {x:192, y: 49}
            },
            {
                type: 'goal',
                shotPos: {x: 135, y: 69},
                resultPos: {x: 166, y: 24}
            },
            {
                type: 'goal',
                shotPos: {x: 245, y: 141},
                resultPos: {x: 148, y: 24}
            },
            {
                type: 'on',
                shotPos: {x: 193, y: 138},
                resultPos: {x: 148, y: 24}
            }
        ];

    });
