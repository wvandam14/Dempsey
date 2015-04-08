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




        // Test section
        $scope.players = [
            {
                fname: "Williamliamliamliamliamliamliamliamliamliamliamliamliamliamliamliamliamliamliamliamliamliamliamliamliam",
                lname: "Van Dam",
                number: 22,
                position: "ST"
            },
            {
                fname: "Will",
                lname: "Van Dam",
                number: 3,
                position: "LM"
            },
            {
                fname: "Bill",
                lname: "Van Dam",
                number: 6,
                position: "CAM"
            },
            {
                fname: "Willy",
                lname: "Van Dam",
                number: 9,
                position: "CDM"
            },
            {
                fname: "Billy",
                lname: "Van Dam",
                number: 10,
                position: "RM"
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


    });
