soccerStats.controller('gameReviewController', 
    function gameReviewController($scope, $rootScope, $location, $timeout, configService, dataService, viewService) {

        
       /* $scope.gameStats = {
            corners : 0,
            offsides : 0,
            goalsMade : 0,
            goalsTaken : 0,
            passes : 0,
            possession : 0,
            tackles : 0,
            fouls : 0
        };*/


        $scope.$on(configService.messages.setGame, function(event, data) {
            dataService.getGameStatsById(data.game.id, function(game) {
                $timeout(function() {
                    $scope.gameStats = {
                        corners : 0,
                        offsides : 0,
                        goalsMade : 0,
                        goalsTaken : 0,
                        passes : 0,
                        tackles : 0,
                        fouls : 0,
                        possession : 0,
                        teamPossession : { data: []},
                    }


                    if(game){
                         $scope.gameStats = {
                            corners : game.get('gameTeamStats').get('corners'),
                            offsides : game.get('gameTeamStats').get('offsides'),
                            goalsMade : game.get('gameTeamStats').get('goalsMade'),
                            goalsTaken : game.get('gameTeamStats').get('goalsTaken'),
                            passes : game.get('gameTeamStats').get('passes'),
                            tackles : game.get('gameTeamStats').get('tackles'),
                            fouls :  game.get('gameTeamStats').get('fouls'),
                            possession : game.get('gameTeamStats').get('possession'),
                            teamPossession : {
                                data : [
                                    {
                                        value: 100 - game.get('gameTeamStats').get('possession'),
                                        color: "#B4B4B4",
                                        highlight: "#B4B4B4",
                                        label: "Theirs"
                                    },
                                    {
                                        value: game.get('gameTeamStats').get('possession'),
                                        color:"#5DA97B",
                                        highlight: "#5DA97B",
                                        label: "Ours"
                                    }
                                ]
                            }
                        };
                    }


                });
               

                console.log($scope.gameStats);
            });
        });


        // $scope.$on(configService.messages.teamChanged,function(event,data){
        //     viewService.goToPage('/home');
        // });

    	var currentUser = Parse.User.current();
        

        // DUMMY DATA

/*        $scope.teamForm = {
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
*/
        /*$scope.teamPossession = {
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
        };*/


        $scope.shotCountData = {
            shots: 5,
            onGoal: 2,
            offGoal: 2,
            blocked: 1
        };

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
                ],
                passes: {
                    data: [
                        {
                            value: 10,
                            color: "#B4B4B4",
                            highlight: "#B4B4B4",
                            label: "Attempted"
                        },
                        {
                            value: 20,
                            color:"#5DA97B",
                            highlight: "#5DA97B",
                            label: "Completed"
                        }
                    ]
                },
                shots: {
                    data: [
                        {
                            value: 4,
                            color: "#B4B4B4",
                            highlight: "#B4B4B4",
                            label: "Attempted"
                        },
                        {
                            value: 3,
                            color:"#5DA97B",
                            highlight: "#5DA97B",
                            label: "Completed"
                        }
                    ]
                }
           
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
                ],
                passes: {
                    data: [
                        {
                            value: 10,
                            color: "#B4B4B4",
                            highlight: "#B4B4B4",
                            label: "Attempted"
                        },
                        {
                            value: 20,
                            color:"#5DA97B",
                            highlight: "#5DA97B",
                            label: "Completed"
                        }
                    ]
                },
                shots: {
                    data: [
                        {
                            value: 4,
                            color: "#B4B4B4",
                            highlight: "#B4B4B4",
                            label: "Attempted"
                        },
                        {
                            value: 3,
                            color:"#5DA97B",
                            highlight: "#5DA97B",
                            label: "Completed"
                        }
                    ]
                }

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
            },
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
                ],
                passes: {
                    data: [
                        {
                            value: 10,
                            color: "#B4B4B4",
                            highlight: "#B4B4B4",
                            label: "Attempted"
                        },
                        {
                            value: 20,
                            color:"#5DA97B",
                            highlight: "#5DA97B",
                            label: "Completed"
                        }
                    ]
                },
                shots: {
                    data: [
                        {
                            value: 4,
                            color: "#B4B4B4",
                            highlight: "#B4B4B4",
                            label: "Attempted"
                        },
                        {
                            value: 3,
                            color:"#5DA97B",
                            highlight: "#5DA97B",
                            label: "Completed"
                        }
                    ]
                }

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
                ],
                passes: {
                    data: [
                        {
                            value: 10,
                            color: "#B4B4B4",
                            highlight: "#B4B4B4",
                            label: "Attempted"
                        },
                        {
                            value: 20,
                            color:"#5DA97B",
                            highlight: "#5DA97B",
                            label: "Completed"
                        }
                    ]
                },
                shots: {
                    data: [
                        {
                            value: 4,
                            color: "#B4B4B4",
                            highlight: "#B4B4B4",
                            label: "Attempted"
                        },
                        {
                            value: 3,
                            color:"#5DA97B",
                            highlight: "#5DA97B",
                            label: "Completed"
                        }
                    ]
                }

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
                ],
                passes: {
                    data: [
                        {
                            value: 10,
                            color: "#B4B4B4",
                            highlight: "#B4B4B4",
                            label: "Attempted"
                        },
                        {
                            value: 20,
                            color:"#5DA97B",
                            highlight: "#5DA97B",
                            label: "Completed"
                        }
                    ]
                },
                shots: {
                    data: [
                        {
                            value: 4,
                            color: "#B4B4B4",
                            highlight: "#B4B4B4",
                            label: "Attempted"
                        },
                        {
                            value: 3,
                            color:"#5DA97B",
                            highlight: "#5DA97B",
                            label: "Completed"
                        }
                    ]
                }

            },
            {
                fname: "William",
                lname: "Van Dam",
                bench: true,

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
                ],
                passes: {
                    data: [
                        {
                            value: 10,
                            color: "#B4B4B4",
                            highlight: "#B4B4B4",
                            label: "Attempted"
                        },
                        {
                            value: 20,
                            color:"#5DA97B",
                            highlight: "#5DA97B",
                            label: "Completed"
                        }
                    ]
                },
                shots: {
                    data: [
                        {
                            value: 4,
                            color: "#B4B4B4",
                            highlight: "#B4B4B4",
                            label: "Attempted"
                        },
                        {
                            value: 3,
                            color:"#5DA97B",
                            highlight: "#5DA97B",
                            label: "Completed"
                        }
                    ]
                }

            },

            {
                fname: "Bill",
                lname: "Van Dam",
                bench: true,

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
                bench: true,

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
                bench: true,
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

        $scope.currFormation = [
            {
                type: "GK",
                player: $scope.players[0],
                x: 44,
                y: 74
            },
            {
                type: "CB",
                player: $scope.players[1],
                x: 56,
                y: 55
            },
            {
                type: "CB",
                player: $scope.players[2],
                x: 74,
                y: 52
            },
            {
                type: "CB",
                player: $scope.players[3],
                x: 15,
                y: 52
            },
            {
                type: "CB",
                player: $scope.players[4],
                x: 33,
                y: 55
            },

            {
                type: "CM",
                player: $scope.players[5],
                x: 56,
                y: 31
            },
            {
                type: "CM",
                player: $scope.players[6],
                x: 74,
                y: 28
            },
            {
                type: "CM",
                player: $scope.players[7],
                x: 15,
                y: 28
            },
            {
                type: "CM",
                player: $scope.players[8],
                x: 33,
                y: 31
            },

            {
                type: "ST",
                player: $scope.players[9],
                x: 56,
                y: 10
            },
            {
                type: "ST",
                player: $scope.players[10],
                x: 33,
                y: 10
            },
        ];

        $scope.currPlayer = dataService.currentPlayer;

        $scope.isSelected = function (player) {
            if ( player === $scope.currPlayer ) {
                return true;
            }
            else {
                return false;
            }
        };

        $scope.selectPlayer = function (player) {
            $scope.currPlayer = player;
        };

        $scope.saveGameNotes = function () {
            console.log($scope.currGame)
            dataService.saveGameAttributes($scope.currGame, ["gameNotes"], [$scope.game.notes]);
        }        

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
