﻿soccerStats.controller('homeController', 
    function homeController($scope, $location, toastService, configService) {

    	$scope.verified = false;
        $scope.user = {
            name: '',
            accountType: ''
        };

        var currentUser = Parse.User.current();
        if (currentUser.fetch()) {
            $scope.user.name = currentUser.get("name");
            //check for email verification 
            if (!currentUser.get("emailVerified")) {
                 toastService.error(configService.toasts.emailVerification);
                //TODO: disable user functionality until user verifies email
            } else {
            	$scope.verified = true;
            }
        } else {
            //show login page
        }

        // TODO: implement this
        $scope.editPlayerInfo = function (player) {
            console.log("This is where the edit player modal/function will go");
        }

        $scope.teamGames = {
            data: [
                {
                    value: 3,
                    color: "#B4B4B4",
                    highlight: "#B4B4B4",
                    label: "Ties"
                },
                {
                    value: 7,
                    color:"#5DA97B",
                    highlight: "#5DA97B",
                    label: "Wins"
                },
                {
                    value: 4,
                    color:"#FF7373",
                    highlight: "#FF7373",
                    label: "Losses"
                }
            ]
        };

        $scope.topGoals = [
            {
                name: 'CLINT DEMPSEY',
                num: 4
            },
            {
                name: 'OBAFEMI MARTINS',
                num: 3
            },
            {
                name: 'MARCO PAPPA',
                num: 2
            },
            {
                name: 'LAMAR NEAGLE',
                num: 1
            },
            {
                name: 'ANDY ROSE',
                num: 1
            },
        ];

        $scope.topAssists = [
            {
                name: 'OBAFEMI MARTINS',
                num: 4
            },
            {
                name: 'CLINT DEMPSEY',
                num: 3
            },
            {
                name: 'MARCO PAPPA',
                num: 2
            },
            {
                name: 'LAMAR NEAGLE',
                num: 1
            },
            {
                name: 'ANDY ROSE',
                num: 1
            },
        ];

        $scope.topShots = [
            {
                name: 'OBAFEMI MARTINS',
                num: 4
            },
            {
                name: 'CLINT DEMPSEY',
                num: 3
            },
            {
                name: 'MARCO PAPPA',
                num: 2
            },
            {
                name: 'LAMAR NEAGLE',
                num: 1
            },
            {
                name: 'ANDY ROSE',
                num: 1
            },
        ];


        // Ignore below here
        $scope.isCoach = false;
        $scope.myPlayers = [
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

            }
        ];


    });
