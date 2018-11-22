// main data service for handling all query get and set requests to the parse database
soccerStats.factory('dataService', function ($location, $timeout, $rootScope, configService, toastService, emailService, viewService) {
    const connectionString = "http://localhost:3000";

    var
         ageGroups = { "U12" : "U12" , "U16" : "U16", "U18" : "U18", "U20" : "U20", "U23" : "U23" }     // static array of age groups
        , states = {AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",DC:"District Of Columbia",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"}    // static array of states

        , getCurrentUser = function(){
            return {
                id: "1",
                username: "wvandam",
                firstName: "Will",
                lastname: "Van Dam",
                name: "Will Van Dam",
                email: "wvandam14@my.whitworth.edu",
                password: "password",
                phone: "575-219-9362",
                city: "Spokane",
                state: "WA",
                photo: "1"
            }
        }
        , currentPlayer = {}
        , currentTeam = {}
        , currentGame = {}

        , playersTable = {
            id:"",
            name:"",
            firstName:"",
            lastName:"",
            birthday:"",
            team:"",
            jerseyNumber:"",
            city:"",
            state:"",
            emergencyContact:"",
            phone:"",
            relationship:"",
            playerStats:""
        }
        , coachesTable = {
            id:"",
            username:"",
            firstName:"",
            lastname:"",
            email:"",
            password:"",
            phone:"",
            city:"",
            state:"",
            photoID:""
        }
        , teamsTable = {
            name:"",
            city:"",
            state:"",
            ageGroup:"",
            leagueName:"",
            number:"",
            logoID:"",
            primaryColor:"",
            teamStatsID:"",
            coachID:""
        }
        
        // get and set teams
        , setCurrentTeam = function(team) {
            currentTeam = team;
            //window.localStorage['currentTeam'] = JSON.stringify(currentTeam);
        }

        , getCurrentTeam = function() {
            //console.log(currentTeam);
            return currentTeam;
            //return JSON.parse( window.localStorage['currentTeam'] || '{}');
        }

        // get and set games
        , setCurrentGame = function (game) {
            currentGame = game;
        }

        , getCurrentGame = function() {
            return currentGame;
        }

        // get players associated with the current user
        , getPlayers = function(callback) {
            var dictionary = [];
            var currentUser = getCurentUser();
            var query = connectionString + "/api/v1/user/" + currentUser.id + "/players";
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    // Typical action to be performed when the document is ready:
                    const players = JSON.parse(this.responseText);
                    _.each(players, function (player) {
                        // set up variables from player information
                        var photo = player.get("photo"),
                            name = player.get("name"),
                            birthday = player.get("birthday"),
                            team = player.get("team"),
                            jerseyNumber = player.get("jerseyNumber"),
                            city = player.get("city"),
                            state = player.get("state"),
                            contact = {
                                emergencyContact : player.get("emergencyContactName"),
                                phone : player.get("emergencContactPhone"),
                                relationship : player.get("emergencyContactRelationship")
                            };

                        // push variables into custom javascript objects for use
                        dictionary.push({
                            photo : photo,
                            name : name,
                            birthday : birthday,
                            team : team,
                            jerseyNumber : jerseyNumber,
                            city : city,
                            state : state,
                            contact : contact,
                            id : player.id
                        });
                    });
                    // return array
                    callback(dictionary);
                }
            };
            xhttp.open("GET", query, true);
            xhttp.send();
            return dictionary;
        }
});