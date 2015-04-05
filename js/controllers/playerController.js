soccerStats.controller('playerController', function loginController($scope, $rootScope, $location, $timeout, viewService, toastService, configService, dataService) {
        // Player object
        $scope.player = {
            photo: '',
            name: '',
            birthday: '',
            team: '',
            jerseyNumber: '',
            city: '',
            state: '',
            emergencyContact: {
                name: '',
                phone: '',
                relationship: ''
            }

        };

        $scope.goToPage = function(path) {
            $timeout(function() {
                viewService.goToPage(path);
            });
        }

        // Register a player
        $scope.registerPlayer = function(player) {
            if (viewService.validateAreaByFormName('playerForm')) {
                var Player = Parse.Object.extend("Players");
                var newPlayer = new Player();

                newPlayer.set("photo", player.photo);
                newPlayer.set("name", player.name);
                newPlayer.set("birthday", player.birthday);
                newPlayer.set("team", player.team.value);
                newPlayer.set("jerseyNumber", player.jerseyNumber);
                newPlayer.set("city", player.city);
                newPlayer.set("state", player.state.value);
                newPlayer.set("emergencyContact", player.emergencyContact.name);
                newPlayer.set("phone", player.emergencyContact.phone);
                newPlayer.set("relationship", player.emergencyContact.relationship);

                //update parse
                newPlayer.save(null, {
                    success: function (newPlayer) {
                        toastService.success("Player, " + player.name + ", successfully added.");
                        // Return to home page
                        viewService.goToPage('/home');
                    },
                    error: function (newPlayer, error) {
                        console.log("Error: " + error.code + " " + error.message);
                        toastService.error("There was a an error (" + error.code +"). Please try again.");
                    }
                });
            } else {
                toastService.error(configService.toasts.requiredFields);
            }
        };

        //TODO: verify if user is logged in
        // moved to dataService
        $scope.teamDict = dataService.getTeams();
        console.log($scope.teamDict);
        

        //TODO: states
        $scope.states = dataService.states;

    });
