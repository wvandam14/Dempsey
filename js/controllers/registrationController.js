soccerStats.controller('registrationController',
    function registrationController($scope, emailService, viewService, $timeout) {
    	
        //tab functionality 
        $scope.tabNumber = 0;
        $scope.formList = ['accountForm', 'teamForm', 'inviteForm'];
        $scope.team = {}; //TODO: duplicate

        $scope.setTab = function (tab) {
            var currentForm = $scope.formList[$scope.tabNumber];
            if ($scope.tabNumber > tab) {
                $scope.tabNumber = tab;
            }
            if ($scope.confirmPassword() 
                && viewService.validateAreaByFormName(currentForm) 
                && (tab === ($scope.tabNumber + 1))) {
                $scope.tabNumber = tab;
            }

        };

        $scope.isTab = function (tab) {
        	return $scope.tabNumber === tab;
        };

        $scope.incrementTab = function () {
        	$scope.setTab($scope.tabNumber + 1);
        };

        // Array containing the emails who will receive the invitation to the team
        $scope.inviteEmails = [];
        $scope.addEmail = function () {
            if(viewService.validateAreaByFormName("inviteForm")){
                $scope.inviteEmails.unshift($scope.invite.email);
            }
            else {
                // TODO: pop up toast notification that they suck
            }
        };

        $scope.removeEmail = function (index){
            $scope.inviteEmails.splice(index, 1);
        }

        // Sends email via the cloud code with parse
        $scope.sendEmailInvite = function(newUser, team) {
            _.each($scope.inviteEmails, function (email) {
                emailService.sendEmailInvite(newUser.name, team.id, team.get("name"), email);
            });
        };

        //test 
		//user information
        $scope.newUser = {
            name: 'Tommy Glasser',
            email: 'tommyglasser@mailinator.com',
            password: '123',
            confirmPassword: '123',
            phone: '1234567890',
            city: 'Spokane',
            state: 'Washington'
        };

        //team information 
        $scope.team = {
            logo: '',
            name: 'Goliath',
            number: '1234DGC',
            leagueName: 'Champions',
            ageGroup: 'U12',
            city: 'Spokane',
            state: 'Montana'
        };

        // //user information
        // $scope.newUser = {
        //     name: '',
        //     email: '',
        //     password: '',
        //     confirmPassword: '',
        //     phone: '',
        //     city: '',
        //     state: ''
        // };

        // //team information 
        // $scope.team = {
        //     logo: '',
        //     name: '',
        //     number: '',
        //     leagueName: '',
        //     ageGroup: '',
        //     city: '',
        //     state: ''
        // };
        
        //register coach
        $scope.register = function (newUser, newTeam) {
            var Team = Parse.Object.extend("Team");
            var _team = new Team();

            _team.set("ageGroup", newTeam.ageGroup.value);
            _team.set("city", newTeam.city);
            _team.set("leagueName", newTeam.leagueName);
            _team.set("name", newTeam.name);
            _team.set("number", newTeam.number);
            _team.set("state", newTeam.state.value);
            _team.set("logo", $scope.logoFile);

            _team.save(null, {
                success: function (_team) {
                    console.log("Team registered");

                    var registerUser = new Parse.User();

                    registerUser.set("username", newUser.email);
                    registerUser.set("name", newUser.name);
                    registerUser.set("email", newUser.email);
                    registerUser.set("password", newUser.password);
                    registerUser.set("phone", newUser.phone);
                    registerUser.set("city", newUser.city);
                    registerUser.set("state", newUser.state.value);
                    registerUser.set("teams", [_team.id]);
                    registerUser.set("accountType", 1);

                    //register team
                    registerUser.signUp(null, {
                        success: function (registerUser) {
                            console.log("registration successful");
                            $scope.sendEmailInvite(newUser, _team);
                            viewService.goToPage('/home');
                        },
                        error: function (registerUser, error) {
                            console.log("Error: " + error.code + " " + error.message);
                        }
                    });

                },
                error: function (_team, error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            });

        };

        //compare new password with confirmation password
        $scope.confirmPassword = function() {
            return $scope.newUser.password === $scope.newUser.confirmPassword;
        };

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
                        $scope.team.logo = reader.result;
                    });
                }
                reader.readAsDataURL(file);
                //this.team = parseFile.url();
            }
        }

        //below are static arrays
        $scope.ageGroups = [
            { value: "", label: "Select an Age Group" },
            { value: "U12", label: "U12" },
            { value: "U16", label: "U16" }
        ];
        $scope.team.ageGroup = $scope.ageGroups[0];

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
        $scope.newUser.state = $scope.states[0];
        $scope.team.state = $scope.states[0];


    });