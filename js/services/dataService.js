soccerStats.factory('dataService', function ($location, $timeout, configService, toastService) {

    var
        ageGroups = [
                { value: "U12", label: "U12" },
                { value: "U16", label: "U16" },
                { value: "U18", label: "U18" },
                { value: "U20", label: "U20" },
                { value: "U23", label: "U23" }
        ],
        states = {
                "AL" : "Alabama",
                "AK" : "Alaska",
                "AZ" : "Arizona",
                "AR" : "Arkansas",
                "CA" : "California",
                "CO" : "Colorado",
                "CT" : "Connecticut",
                "DE" : "Delaware",
                "DC" : "District Of Columbia",
                "FL" : "Florida",
                "GA" : "Georgia",
                "HI" : "Hawaii",
                "ID" : "Idaho",
                "IL" : "Illinois",
                "IN" : "Indiana",
                "IA" : "Iowa",
                "KS" : "Kansas",
                "KY" : "Kentucky",
                "LA" : "Louisiana",
                "ME" : "Maine",
                "MD" : "Maryland",
                "MA" : "Massachusetts",
                "MI" : "Michigan",
                "MN" : "Minnesota",
                "MS" : "Mississippi",
                "MO" : "Missouri",
                "MT" : "Montana",
                "NE" : "Nebraska",
                "NV" : "Nevada",
                "NH" : "New Hampshire",
                "NJ" : "New Jersey",
                "NM" : "New Mexico",
                "NY" : "New York",
                "NC" : "North Carolina",
                "ND" : "North Dakota",
                "OH" : "Ohio",
                "OK" : "Oklahoma",
                "OR" : "Oregon",
                "PA" : "Pennsylvania",
                "RI" : "Rhode Island",
                "SC" : "South Carolina",
                "SD" : "South Dakota",
                "TN" : "Tennessee",
                "TX" : "Texas",
                "UT" : "Utah",
                "VT" : "Vermont",
                "VA" : "Virginia",
                "WA" : "Washington",
                "WV" : "West Virginia",
                "WI" : "Wisconsin",
                "WY" : "Wyoming"
        },
        getTeams = function(callback) {
            var teamDict = [];
            var currentUser = Parse.User.current();
            var userTable = Parse.Object.extend("_User");

            var query = new Parse.Query(userTable);
            query.include('teams');
            query.get(currentUser.id, {
                success: function(user) {
                    $timeout(function(){
                        var teams = user.get("teams");
                        // Add each team associated with the current user to the team dropdown list
                        _.each(teams, function (team) {
                            var logo = team.get("logo");
                            var teamName = team.get("name");
                            teamDict.push({value: team.id, label: teamName, logo: logo._url });
                        });

                        callback(teamDict);
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