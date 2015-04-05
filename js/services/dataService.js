soccerStats.factory('dataService', function ($location, $timeout, configService, toastService) {

    var
        ageGroups = [
                { value: "U12", label: "U12" },
                { value: "U16", label: "U16" },
                { value: "U18", label: "U18" },
                { value: "U20", label: "U20" },
                { value: "U23", label: "U23" }
        ],
        states = [
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
        ],
        getTeams = function() {
            var teamDict = [];
            var currentUser = Parse.User.current();
            var user = Parse.Object.extend("_User");

            var query = new Parse.Query(user);
            query.include('teams');
            query.get(currentUser.id, {
                success: function(user) {
                    var teams = user.get("teams");
                    // Add each team associated with the current user to the team dropdown list
                    _.each(teams, function (team) {
                        $timeout(function(){
                            teamDict.push({value: team.id, label: team.get("name")});
                        });
                    });

                }, error: function(user, error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
            return teamDict;
        };



    return {
        ageGroups: ageGroups,
        states : states,
        getTeams : getTeams
    }

});