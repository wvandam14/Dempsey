soccerStats.controller('gameReviewController', 
    function gameReviewController($scope, $rootScope, $location, configService) {
        $rootScope.$on(configService.messages.setGame, function(msg, data) {
            if(data.game) {
                $scope.currGame = data.game;
            }
            else {
                throw new Error('No game data received');
            }
        });

    	var currentUser = Parse.User.current();
        $scope.currGame = {};


        // DUMMY DATA

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
            onGoal: 2,
            offGoal: 2,
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

        // Test section
        $scope.players = [
            {
                fname: "William",
                lname: "Van Dam",
                number: 22,
                position: "ST",
                notableEvents: [
                    {
                        type: "Subbed out",
                        time: "88'"
                    },
                    {
                        type: "Subbed out",
                        time: "88'"
                    },
                    {
                        type: "Subbed out",
                        time: "88'"
                    }
                ]
            },
            {
                fname: "Will",
                lname: "Van Dam",
                number: 3,
                position: "LM",
                notableEvents: [
                    {
                        type: "Subbed out",
                        time: "88'"
                    },
                    {
                        type: "Subbed out",
                        time: "88'"
                    },
                    {
                        type: "Subbed out",
                        time: "88'"
                    }
                ]
            },
            {
                fname: "Bill",
                lname: "Van Dam",
                number: 6,
                position: "CAM",
                notableEvents: [
                    {
                        type: "Subbed out",
                        time: "88'"
                    },
                    {
                        type: "Subbed out",
                        time: "88'"
                    },
                    {
                        type: "Subbed out",
                        time: "88'"
                    }
                ]
            },
            {
                fname: "Willy",
                lname: "Van Dam",
                number: 9,
                position: "CDM",
                notableEvents: [
                    {
                        type: "Subbed out",
                        time: "88'"
                    },
                    {
                        type: "Subbed out",
                        time: "88'"
                    },
                    {
                        type: "Subbed out",
                        time: "88'"
                    }
                ]
            },
            {
                fname: "Billy",
                lname: "Van Dam",
                number: 10,
                position: "RM",
                notableEvents: [
                    {
                        type: "Subbed out",
                        time: "88'"
                    },
                    {
                        type: "Subbed out",
                        time: "88'"
                    },
                    {
                        type: "Subbed out",
                        time: "88'"
                    }
                ]
            }

        ];

        $scope.currPlayer = $scope.players[0];

        $scope.isSelected = function (index) {
            if ( $scope.players[index] === $scope.currPlayer ) {
                return true;
            }
            else {
                return false;
            }
        };

        $scope.selectPlayer = function (index) {
            $scope.currPlayer = $scope.players[index];
        };

        $scope.notableEvents = [
            {
                type: "Subbed out",
                time: "88'"
            },
            {
                type: "Subbed out",
                time: "88'"
            },
            {
                type: "Subbed out",
                time: "88'"
            }
        ];


    });
