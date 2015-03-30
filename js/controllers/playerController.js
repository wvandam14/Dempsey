soccerStats.controller('playerController', function loginController($scope, $rootScope, $location, $timeout, viewService, toastService, configService) {
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
        $scope.teamDict = [];
        var currentUser = Parse.User.current();
        console.log(currentUser);

        var user = Parse.Object.extend("_User");

        var query = new Parse.Query(user);
        query.include('teams');
        query.get(currentUser.id, {
            success: function(user) {
                var teams = user.get("teams")
                // Add each team associated with the current user to the team dropdown list
                _.each(teams, function (team) {
                    $timeout(function(){
                        $scope.teamDict.push({value: team.id, label: team.get("name")});
                    });
                });

            }, error: function(user, error) {
                toastService.error("There was a an error (" + error.code +"). Please try again.");
            }
        });

        //TODO: states
        $scope.states = [
            {value: "AL", label: "Alabama"},
            {value: "AK", label: "Alaska"},
            {value: "AZ", label: "Arizona"},
            {value: "AR", label: "Arkansas"},
            {value: "CA", label: "California"},
            {value: "CO", label: "Colorado"},
            {value: "CT", label: "Connecticut"},
            {value: "DE", label: "Delaware"},
            {value: "DC", label: "District Of Columbia"},
            {value: "FL", label: "Florida"},
            {value: "GA", label: "Georgia"},
            {value: "HI", label: "Hawaii"},
            {value: "ID", label: "Idaho"},
            {value: "IL", label: "Illinois"},
            {value: "IN", label: "Indiana"},
            {value: "IA", label: "Iowa"},
            {value: "KS", label: "Kansas"},
            {value: "KY", label: "Kentucky"},
            {value: "LA", label: "Louisiana"},
            {value: "ME", label: "Maine"},
            {value: "MD", label: "Maryland"},
            {value: "MA", label: "Massachusetts"},
            {value: "MI", label: "Michigan"},
            {value: "MN", label: "Minnesota"},
            {value: "MS", label: "Mississippi"},
            {value: "MO", label: "Missouri"},
            {value: "MT", label: "Montana"},
            {value: "NE", label: "Nebraska"},
            {value: "NV", label: "Nevada"},
            {value: "NH", label: "New Hampshire"},
            {value: "NJ", label: "New Jersey"},
            {value: "NM", label: "New Mexico"},
            {value: "NY", label: "New York"},
            {value: "NC", label: "North Carolina"},
            {value: "ND", label: "North Dakota"},
            {value: "OH", label: "Ohio"},
            {value: "OK", label: "Oklahoma"},
            {value: "OR", label: "Oregon"},
            {value: "PA", label: "Pennsylvania"},
            {value: "RI", label: "Rhode Island"},
            {value: "SC", label: "South Carolina"},
            {value: "SD", label: "South Dakota"},
            {value: "TN", label: "Tennessee"},
            {value: "TX", label: "Texas"},
            {value: "UT", label: "Utah"},
            {value: "VT", label: "Vermont"},
            {value: "VA", label: "Virginia"},
            {value: "WA", label: "Washington"},
            {value: "WV", label: "West Virginia"},
            {value: "WI", label: "Wisconsin"},
            {value: "WY", label: "Wyoming"}
        ];

    });
