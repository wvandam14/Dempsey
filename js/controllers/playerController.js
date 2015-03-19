soccerStats.controller('playerController', function loginController($scope, $rootScope, $location, viewService, $timeout) {
        // User object
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

        //register a player
        $scope.registerPlayer = function(player) {
            if (viewService.validateAreaByFormName('playerForm')) {
                var Player = Parse.Object.extend("Players");
                var newPlayer = new Player();

                newPlayer.set("photo", $scope.logoFile);
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
                        console.log("player registration successful");
                        //return to home page
                        viewService.goToPage('/home');
                    },
                    error: function (newPlayer, error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });
            } else {
                // Todo: Send Toast notification that the form is invalid
            }
        };

        //TODO: put this section into viewService - this code exists in registerController.js
        //triggers file upload
        $scope.selectFile = function(){
            $("#file").trigger('click');
        }

        //upload the selected picture
        $scope.fileNameChanged = function(files) {
          console.log("select file");

            var fileUploadControl = files;
            if (fileUploadControl.files.length > 0) {
                var file = fileUploadControl.files[0];
                var name = "photo."+file.type.split('/').pop();
                var parseFile = new Parse.File(name, file);

                 $timeout(function(){
                    $scope.logoFile = parseFile;
                 });
                    
                var reader = new FileReader();
                reader.onloadend = function() {
                    $timeout(function(){
                        $scope.player.photo = reader.result;
                    });
                }
                reader.readAsDataURL(file);
                //this.team = parseFile.url();
            }
        }


        //TODO: verify if user is logged in
        var currentUser = Parse.User.current();
        console.log(currentUser.get("username"));
        var user = Parse.Object.extend("_User");
        var team = Parse.Object.extend("Team");
        var query = new Parse.Query(user);
        $scope.teamDict = [];
        query.get(currentUser.id, {
            success: function(user) {
                var teams = user.get("teams");
                query = new Parse.Query(team);
                _.each(teams, function (i) {
                    console.log("1");
                    query.get(i, {
                        success: function(team) {
                            console.log("2");
                            $timeout(function(){
                                $scope.teamDict.push({value: i, label: team.get("name")});
                            });   
                        }, error: function(team, error) {
                            console.log("3");
                            console.log("Error: " + error.code + " " + error.message);
                        }
                    });
                });
            }, error: function(user, error) {

            }
        });

        //TODO: states
        $scope.states = [
            {value:   "", label: "Select a State"},
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
        $scope.player.state = $scope.states[0];


    });
