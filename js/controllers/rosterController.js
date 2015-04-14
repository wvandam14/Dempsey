soccerStats.controller('rosterController', 
    function rosterController($scope, $rootScope, $location, $timeout, configService, dataService) {

        $scope.players = [];
    	var currentUser = Parse.User.current();

        $scope.$on(configService.messages.teamChanged, function(msg, data) {
            $timeout(function(){
                dataService.getTeamById(data.team.id, function(_team) {
                    dataService.getPlayersByTeamId(_team, function(players) {
                        $timeout(function() {
                            console.log(players);
                            _.each(players, function (player) {
                                $scope.players.push({
                                    name: player.get("name"),
                                    number: player.get("jerseyNumber"),
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
                                    },
                                    total: {
                                        goals:0,
                                        passes:1,
                                        corners:2,
                                        fouls:3,
                                        yellows:4,
                                        reds:5
                                    },
                                    phone: player.get("phone"),
                                    emergencyContact: {
                                        name: player.get("emergencyContact"),
                                        phone: player.get("phone"),
                                        relationship:player.get("relationship")
                                    }

                                });
                                // TODO: Get all time stats for player
                            });
                        });
                    });
                });
            });
        });

        $scope.currGame = {};


        // DUMMY DATA

        // Test section
        /*
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
                },
                total: {
                    goals:0,
                    passes:1,
                    corners:2,
                    fouls:3,
                    yellows:4,
                    reds:5
                },
                phone: "(123) 456 7890",
                emergencyContact: {
                    name:"Jude Law",
                    phone:"9856523952",
                    relationship:"Employer"
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
                },
                total: {
                    goals:0,
                    passes:1,
                    corners:2,
                    fouls:3,
                    yellows:4,
                    reds:5
                },
                phone: "(123) 456 7890",
                emergencyContact: {
                    name:"Jude Law",
                    phone:"9856523952",
                    relationship:"Employer"
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
                ],
                total: {
                    goals:0,
                    passes:1,
                    corners:2,
                    fouls:3,
                    yellows:4,
                    reds:5
                },
                phone: "(123) 456 7890",
                emergencyContact: {
                    name:"Jude Law",
                    phone:"9856523952",
                    relationship:"Employer"
                }
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
                ],
                total: {
                    goals:0,
                    passes:1,
                    corners:2,
                    fouls:3,
                    yellows:4,
                    reds:5
                },
                phone: "(123) 456 7890",
                emergencyContact: {
                    name:"Jude Law",
                    phone:"9856523952",
                    relationship:"Employer"
                }
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
                ],
                total: {
                    goals:0,
                    passes:1,
                    corners:2,
                    fouls:3,
                    yellows:4,
                    reds:5
                },
                phone: "(123) 456 7890",
                emergencyContact: {
                    name:"Jude Law",
                    phone:"9856523952",
                    relationship:"Employer"
                }
            },{
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
                },
                total: {
                    goals:0,
                    passes:1,
                    corners:2,
                    fouls:3,
                    yellows:4,
                    reds:5
                },
                phone: "(123) 456 7890",
                emergencyContact: {
                    name:"Jude Law",
                    phone:"9856523952",
                    relationship:"Employer"
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
                },
                total: {
                    goals:0,
                    passes:1,
                    corners:2,
                    fouls:3,
                    yellows:4,
                    reds:5
                },
                phone: "(123) 456 7890",
                emergencyContact: {
                    name:"Jude Law",
                    phone:"9856523952",
                    relationship:"Employer"
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
                ],
                total: {
                    goals:0,
                    passes:1,
                    corners:2,
                    fouls:3,
                    yellows:4,
                    reds:5
                },
                phone: "(123) 456 7890",
                emergencyContact: {
                    name:"Jude Law",
                    phone:"9856523952",
                    relationship:"Employer"
                }
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
                ],
                total: {
                    goals:0,
                    passes:1,
                    corners:2,
                    fouls:3,
                    yellows:4,
                    reds:5
                },
                phone: "(123) 456 7890",
                emergencyContact: {
                    name:"Jude Law",
                    phone:"9856523952",
                    relationship:"Employer"
                }
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
                ],
                total: {
                    goals:0,
                    passes:1,
                    corners:2,
                    fouls:3,
                    yellows:4,
                    reds:5
                },
                phone: "(123) 456 7890",
                emergencyContact: {
                    name:"Jude Law",
                    phone:"9856523952",
                    relationship:"Employer"
                }
            },

        ];
       */
       // $scope.currPlayer = $scope.players[0];

        $scope.isSelected = function (player) {
            if (player === $scope.currPlayer ) {
                return true;
            }
            return false;
        };

        $scope.selectPlayer = function (player) {
            $scope.currPlayer = player;
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
