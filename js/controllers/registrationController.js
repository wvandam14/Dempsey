soccerStats.controller('registrationController',
    function registrationController($scope, emailService, viewService, $timeout, toastService, configService, dataService) {
    	
        // Tab functionality
        $scope.tabNumber = 0;
        $scope.formList = ['accountForm', 'teamForm', 'inviteForm'];
        $scope.team = {}; //TODO: duplicate

        $scope.goToPage = function(page) {
            console.log(page);
            viewService.goToPage(page);
        };

        $scope.setTab = function (tab) {
            var currentForm = $scope.formList[$scope.tabNumber];

            // If the passwords do not match, don't allow them to continue
            if (!$scope.confirmPassword()) {
                toastService.error(configService.toasts.requiredFields);
                return;
            }

            // If you are going back in the registration process
            if ($scope.tabNumber > tab) {
                $scope.tabNumber = tab;
                return;
            }

            if (viewService.validateAreaByFormName(currentForm)
                && (tab === ($scope.tabNumber + 1))) {
                if (($scope.newUser.photo && tab === 1) || ($scope.team.logo && tab === 2))
                    $scope.tabNumber = tab;
                else
                    toastService.error(configService.toasts.missingPhoto);
            }

            else {
                toastService.error(configService.toasts.requiredFields);
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
                toastService.error(configService.toasts.requiredFields);
            }
        };

        $scope.removeEmail = function (index){
            $scope.inviteEmails.splice(index, 1);
        }

		// User information
        $scope.newUser = {
            firstName: 'Alec',
            lastName: 'Moore',
            email: 'abc@mailinator.com',
            password: '123',
            confirmPassword: '123',
            phone: '(123) 123-1234',
            city: 'Gig Harbor',
            state: '',
            photo: ''
        };

        // Team information
        $scope.team = {
            logo: '',
            primaryColor: '',
            name: 'Team Number 1',
            number: '1',
            leagueName: 'MLS',
            ageGroup: '',
            city: 'Gig Harbor',
            state: ''
        };


        
        // register coach
        $scope.register = function (newUser, newTeam) {
            var _team = dataService.registerTeam(newTeam);
            dataService.registerCoach(newUser, _team, $scope.inviteEmails);
        };

        //compare new password with confirmation password
        $scope.confirmPassword = function() {
            return $scope.newUser.password === $scope.newUser.confirmPassword;
        };


        // Delegate function passed into the image upload directive for the color picker
        // Gets the most dominant color from the image upload directive
        // The function returns an array of three values: Red, Green and Blue
        $scope.getImageColor = function(color) {
            console.log('color');
            $scope.team.primaryColor = color;
        }

        //below are static arrays
        $scope.ageGroups = dataService.ageGroups;

        $scope.states = dataService.states;
    });