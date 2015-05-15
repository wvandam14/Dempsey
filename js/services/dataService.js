// main data service for handling all query get and set requests to the parse database
soccerStats.factory('dataService', function ($location, $timeout, $rootScope, configService, toastService, emailService, viewService) {

    var
         ageGroups = { "U12" : "U12" , "U16" : "U16", "U18" : "U18", "U20" : "U20", "U23" : "U23" }     // static array of age groups
        , states = {AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",DC:"District Of Columbia",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"}    // static array of states
        
        // Current focus variables
        , getCurrentUser = function() {
            return Parse.User.current();
        }
        , currentPlayer = {}
        , currentTeam = {}
        , currentGame = {}


        // Parse Tables
        , playersTable = Parse.Object.extend("Players")
        , userTable = Parse.Object.extend("_User")
        , teamTable = Parse.Object.extend("Team")
        , playerStatsTable = Parse.Object.extend("SeasonPlayerStats")
        , gameTable = Parse.Object.extend("Game")
        , SeasonTeamTable = Parse.Object.extend("SeasonTeamStats")
        , gameStatsTable = Parse.Object.extend("GameTeamStats")
        , gamePlayerStatsTable = Parse.Object.extend("GamePlayerStats")

        // get and set teams
        , setCurrentTeam = function(team) {
            currentTeam = team;
            //window.localStorage['currentTeam'] = JSON.stringify(currentTeam);
        }

        , getCurrentTeam = function() {
            //console.log(currentTeam);
            return currentTeam;z
            //return JSON.parse( window.localStorage['currentTeam'] || '{}');
        }

        // get and set games
        , setCurrentGame = function (game) {
            currentGame = game;
        }

        , getCurrentGame = function() {
            return currentGame;
        }

        // get teams associated with the current user
        , getTeams = function(callback) {
            var teamDict = [];
            var query = new Parse.Query(userTable);
            var currentUser = Parse.User.current();
            // console.log(currentUser);
            query.include('teams');
            query.get(currentUser.id, {
                success: function(user) {
                    $timeout(function(){
                        // get the user teams
                        var teams = user.get("teams");
                        // add each team to an array
                        _.each(teams, function (team) {
                            teamDict.push(team);
                        });
                        // return the team array
                        callback(teamDict);
                    });
                }, error: function(user, error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
            return teamDict;
        }

        // get players associated with the current user
        , getPlayers = function(callback) {
            var dictionary = [];
            var currentUser = Parse.User.current();
            var query = new Parse.Query(userTable);
            query.include('players');
            query.get(currentUser.id, {
                success: function (user) {
                    $timeout(function() {
                        var players = user.get("players");  // get the players associated with current user
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
                                    emergencyContact : player.get("emergencyContact"),
                                    phone : player.get("phone"),
                                    relationship : player.get("relationship")
                                }
                            ;
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
                    });
                    
                },
                error: function (user, error) {

                }
            });
            return dictionary;
        }

        // get games based on team id
        , getGames = function(_team,callback){
            var team = new teamTable();
            var query = new Parse.Query(gameTable);

            // get the team
            team.id = _team.id;
            team.fetch().then(function(team){
                query.equalTo('team',team);
                query.include('gameTeamStats');
                // get the team stats
                query.find().then(function(games_brute){
                    //console.log(games_brute);
                    var game;
                    var games = [];

                    // set up game objects
                    for(var i = 0; i < games_brute.length; i++ ){
                       game = {
                            id: games_brute[i].id,
                            date: games_brute[i].get("date"),
                            opponent: {
                                name: games_brute[i].get("opponent"),
                                symbol: games_brute[i].get("opponentSymbol"),
                                score: games_brute[i].get("gameTeamStats").get("goalsTaken")
                            },
                            team: {
                                name: team.get("name"),
                                symbol: team.get("symbol"),
                                score: games_brute[i].get("gameTeamStats").get("goalsMade")
                            },
                            status: games_brute[i].get("status"),
                            notes: games_brute[i].get("gameNotes")
                        }
                        // push games into an array
                        games.push(game);
                    }
                    //console.log(games);
                    // return games array
                    callback(games);
                }, function(error){
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");

                });
            });
        }

        // get season team stats based on team id
        , getSeasonTeamStats = function(team_id,callback){
            
            var query = new Parse.Query(teamTable);

            // have the query also include the actual following parse objects
            query.include('teamStats');
            query.include("teamStats.topAssists");
            query.include("teamStats.topAssists.playerStats");
            query.include("teamStats.topGoals");
            query.include("teamStats.topGoals.playerStats");
            query.include("teamStats.topShots");
            query.include("teamStats.topShots.playerStats");

            query.equalTo('objectId',team_id)

            // get the team
            query.first().then(function(team){
                // get the top 5 players
                if (team.get('teamStats').get('topAssists'))  team.get('teamStats').get('topAssists').slice(0,4);
                if (team.get('teamStats').get('topGoals'))  team.get('teamStats').get('topGoals').slice(0,4);
                if(team.get('teamStats').get('topShots'))  team.get('teamStats').get('topShots').slice(0,4);
                // return the team stats
                callback(team.get('teamStats'));
            }, function(error){
                 console.log("Error: " + error.code + " " + error.message);
                 callback({error:"Someting happened"});
            });
        }

        // register a team with a team passed in as a parameter - part 2 of registration process
        , registerTeam = function(newTeam) {
            var _team = new teamTable();

            // set up a new team
            _team.set("ageGroup", newTeam.ageGroup);
            _team.set("city", newTeam.city);
            _team.set("leagueName", newTeam.leagueName);
            _team.set("name", newTeam.name);
            _team.set("number", newTeam.number);
            _team.set("state", (_.invert(states))[newTeam.state]);
            _team.set("logo", newTeam.logo);
            _team.set("primaryColor", newTeam.primaryColor);
            _team.set("teamStats", new SeasonTeamTable());

            // return parse object
            return _team;
        }

        // register a new coach - part 1 of registration process
        , registerCoach = function (newUser, _team, inviteEmails) {
            _team.save(null, {
                success: function (_team) {
                    // create a new parse user object
                    var registerUser = new Parse.User();
                    // set up new parse user information
                    registerUser.set("username", newUser.email);
                    registerUser.set("firstName", newUser.firstName);
                    registerUser.set("lastName", newUser.lastName);
                    registerUser.set("name", newUser.firstName + ' ' + newUser.lastName);
                    registerUser.set("email", newUser.email);
                    registerUser.set("password", newUser.password);
                    registerUser.set("phone", newUser.phone);
                    registerUser.set("city", newUser.city);
                    registerUser.set("state", (_.invert(states))[newUser.state]);
                    registerUser.set("photo", newUser.photo);

                    // Adds a pointer to the team to an array of pointers
                    registerUser.addUnique("teams", _team);
                    registerUser.set("accountType", 1);

                    //register team
                    registerUser.signUp(null, {
                        success: function (registerUser) {
                            toastService.success(configService.toasts.registrationSuccess);
                            // part 3 of registration process
                            sendEmailInvite(registerUser, _team.id, _team.get("name"), inviteEmails);
                            viewService.goToPage('/home');  // redirect back to home
                        },
                        error: function (registerUser, error) {
                            console.log("Error: " + error.code + " " + error.message);
                            if (error.code === 202)
                                toastService.error(error.message);
                            // toastService.error("There was a an error (" + error.code +"). Please try again.");

                        }
                    });

                },
                error: function (_team, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        // register the player
        , registerPlayer = function(player, self, coach) {
            var currentUser = getCurrentUser();
            var newPlayer = new playersTable();
            var playerStats = new playerStatsTable();
            var query = new Parse.Query(teamTable);
            // get the team based on the team the player belongs to
            query.get(player.team.id, {
                success: function (team) {
                    if (coach) {    // set up information if parent is registering
                        newPlayer.set("name", player.firstName + ' ' + player.lastName);
                        newPlayer.set("firstName", player.firstName);
                        newPlayer.set("lastName", player.lastName);
                        newPlayer.set("jerseyNumber", player.jerseyNumber);
                        newPlayer.set("team", team);
                        newPlayer.set("playerStats", playerStats);

                    } else {       // set up information if parent is registering
                        if (player.newPhoto) newPlayer.set("photo", player.newPhoto);
                        newPlayer.set("name", player.firstName + ' ' + player.lastName);
                        newPlayer.set("firstName", player.firstName);
                        newPlayer.set("lastName", player.lastName);
                        newPlayer.set("birthday", player.birthday);
                        newPlayer.set("team", team);
                        newPlayer.set("jerseyNumber", player.jerseyNumber);
                        newPlayer.set("city", player.city);
                        newPlayer.set("state", (_.invert(states))[player.state]);
                        newPlayer.set("emergencyContact", player.emergencyContact.name);
                        newPlayer.set("phone", player.emergencyContact.phone);
                        newPlayer.set("relationship", player.emergencyContact.relationship);
                        newPlayer.set("playerStats", playerStats);
                    }

                    // create a new player
                    newPlayer.save(null, {
                        success: function (newPlayer) {
                            if (player.parentId) {  // if the player has a parent id
                                // run parse to add player to parent
                                Parse.Cloud.run('addPlayer', {newPlayerId: newPlayer.id, parentId: player.parentId}, {
                                    success: function (result) {
                                        console.log(result);
                                        toastService.success("Player " + newPlayer.name + ", successfully added.");
                                        $rootScope.$broadcast(configService.messages.playerAdded, newPlayer);
                                        //$rootScope.$broadcast(configService.messages.teamChanged, {refresh: true});
                                        viewService.closeModal(self);
                                    },
                                    error: function (error) {
                                        console.log("Error: " + error.code + " " + error.message);
                                        toastService.error("There was an error (" + error.code +"). Please try again.");
                                    }
                                });
                            } else {    // if the player does not have a parent, just add the player to coach for now
                                currentUser.addUnique("players", newPlayer);
                                currentUser.save(null, {
                                    success: function (currentUser) {
                                        toastService.success("Player " + player.name + ", successfully added.");
                                        $rootScope.$broadcast(configService.messages.playerAdded, newPlayer);
                                        //$rootScope.$broadcast(configService.messages.teamChanged, {refresh: true});
                                        viewService.closeModal(self);
                                    },
                                    error: function (currentUser, error) {
                                        console.log("Error: " + error.code + " " + error.message);
                                       toastService.error("There was a an error (" + error.code +"). Please try again."); 
                                    }
                                });
                            }
                        },
                        error: function (newPlayer, error) {
                            console.log("Error: " + error.code + " " + error.message);
                            toastService.error("There was a an error (" + error.code +"). Please try again.");
                        }
                    });
                },
                error: function (teamTable, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again."); 
                }
            });
        } 

        // register a new team
        , registerNewTeam = function(_team, self) {
            var currentUser = getCurrentUser();
            // create a new team
            _team.save(null, {
                success: function(_team) {
                    currentUser.addUnique("teams", _team);
                    // update current user table
                    currentUser.save(null, {
                        success: function(currentUser) {
                            setCurrentTeam(_team);
                            toastService.success(configService.toasts.teamAddSuccess);
                            viewService.closeModal(self);
                            $rootScope.$broadcast(configService.messages.addNewTeam, _team);
                            $rootScope.$broadcast(configService.messages.teamChanged, {team: _team, refresh: true});
                        },
                        error: function(currentUser, error) {
                            toastService.error("There was a an error (" + error.code +"). Please try again.");
                            console.log(error.message);
                        }
                    });
                    
                },
                error: function(_team, error) {
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                    console.log(error.message);
                }
            }); 
        }

        // update account
        , updateAccount = function (editUser, self) {
            var currentUser = getCurrentUser();
            // set up edited information
            currentUser.set("username", editUser.email);
            currentUser.set("firstName", editUser.firstName);
            currentUser.set("lastName", editUser.lastName);
            currentUser.set("name", editUser.firstName + " " + editUser.lastName);
            currentUser.set("email", editUser.email);
            currentUser.set("phone", editUser.phone);
            currentUser.set("city", editUser.city);
            currentUser.set("state", (_.invert(states))[editUser.state]);
            //console.log((_.invert($scope.states))[$scope.editUser.state]);
            // if user has a new photo
            if (editUser.newPhoto)
                currentUser.set("photo", editUser.newPhoto);
            // if user has a new password
            if(editUser.newPassword !== '')
                currentUser.set("password", editUser.newPassword);

            // update user
            currentUser.save(null, {
                success: function (currentUser) {
                    toastService.success(configService.toasts.accountUpdateSuccess);
                    viewService.closeModal(self);
                    //$route.reload();
                    //currentUser.fetch();
                },
                error: function (currentUser, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        // update team information
        , updateTeam = function(currentTeamID, editTeam, self) {
            var query = new Parse.Query(teamTable);
            // get team object from parse
            query.get(currentTeamID, {
                success: function(team) {
                    // set up the edited information
                    team.set("leagueName", editTeam.leagueName);
                    team.set("ageGroup", editTeam.ageGroup);
                    team.set("primaryColor", editTeam.primaryColor);
                    team.set("city", editTeam.city);
                    team.set("name", editTeam.name);
                    team.set("number", editTeam.number);
                    team.set("state", (_.invert(states))[editTeam.state]);
                    // if the tema has a new logo
                    if (editTeam.newLogo) 
                        team.set("logo", editTeam.newLogo);
                    // update team
                    team.save(null, {
                        success: function (editTeam) {
                            setCurrentTeam(editTeam);   // set the current team to same team, but not edited
                            toastService.success(configService.toasts.teamUpdateSuccess);
                            viewService.closeModal(self);
                            //$route.reload();
                        },
                        error: function(editTeam, error) {
                            toastService.error("There was a an error (" + error.code +"). Please try again.");
                        }
                    });
                    
                },
                error: function(team, error) {
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        // update player information
        , updatePlayer = function(player, self) {
            var query = new Parse.Query(playersTable);
            // get player object from parse
            query.get(player.id, {
                success: function(editPlayer) {
                    query = new Parse.Query(teamTable);
                    // get team player is associated with
                    query.get(player.team.id, {
                        success: function(team) {
                            //console.log(team);
                            // if player has a new photo
                            if (player.newPhoto)
                                editPlayer.set("photo", player.newPhoto);
                            // set up edited player information
                            editPlayer.set("name", player.name);
                            editPlayer.set("birthday", player.birthday);
                            editPlayer.set("team", team);
                            editPlayer.set("jerseyNumber", player.jerseyNumber);
                            editPlayer.set("city", player.city);
                            editPlayer.set("state", (_.invert(states))[player.state]);
                            editPlayer.set("emergencyContact", player.emergencyContact.name);
                            editPlayer.set("phone", player.emergencyContact.phone);
                            editPlayer.set("relationship", player.emergencyContact.relationship);
                            // update parse
                            editPlayer.save(null, {
                                success: function(editPlayer) {
                                    if (player.parentId) {  // if the player now has a parent
                                        removeParentsByPlayerId(player.id); // remove parents from other users in the case of accidental switching
                                        // add the player to the parent using direct parse cloud
                                        Parse.Cloud.run('addPlayer', {newPlayerId: editPlayer.id, parentId: player.parentId}, {
                                            success: function (result) {
                                                //console.log(result);
                                                toastService.success("Player " + player.name + ", successfully added.");
                                                //$rootScope.$broadcast(configService.messages.playerAdded, newPlayer);
                                                $rootScope.$broadcast(configService.messages.teamChanged, {refresh: true});
                                                viewService.closeModal(self);
                                            },
                                            error: function (error) {
                                                console.log("Error: " + error.code + " " + error.message);
                                                toastService.error("There was an error (" + error.code +"). Please try again.");
                                            }
                                        });
                                    }
                                    else {
                                        toastService.success("Player " + player.name + "'s profile updated.");
                                        $rootScope.$broadcast(configService.messages.teamChanged, {refresh: true});
                                        viewService.closeModal(self);
                                    }
                                    // $route.reload();
                                },
                                error: function(editPlayer, error) {
                                    console.log("Error: " + error.code + " " + error.message);
                                    toastService.error("There was a an error (" + error.code +"). Please try again."); 
                                }
                            });
                        },
                        error : function(team, error) {
                            console.log("Error: " + error.code + " " + error.message);
                            toastService.error("There was a an error (" + error.code +"). Please try again."); 
                        }
                    });
                    
                },
                error: function(player, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again."); 
                }
            });
        }

        // remove parents by the player id
        , removeParentsByPlayerId = function(playerId) {
            // remove the player from the parent
            Parse.Cloud.run('removePlayer', {playerId : playerId}, {
               success: function (result) {
                   console.log('remove player from parent successful')
               },
               error: function(error) {
                   console.log("Error: " + error.code + " " + error.message);
                   toastService.error("There was an error (" + error.code +"). Please try again.");
               }
            });
        }

    // TODO: remove player from several tables
        //, removePlayer = function(player, self) {
        //    Parse.Cloud.run('removeAllPlayers', {player: player}, {
        //        success: function (result) {
        //            console.log(result)
        //            configService.closeModal(self);
        //            console.log('player successfully removed');
        //            $rootScope.$broadcast(configService.messages.teamChanged, {refresh: true});
        //        },
        //        error: function(error) {
        //            console.log("Error: " + error.code + " " + error.message);
        //            toastService.error("There was an error (" + error.code +"). Please try again.");
        //        }
        //    });
        //}

        // get team based on team id
        , getTeamById = function(id, callback) {
            var query = new Parse.Query(teamTable);
            query.equalTo('objectId', id);
            // get team
            query.first({
                success: function(team) {
                    $timeout(function(){
                        // return the parse team object
                        callback(team);
                    });

                }, error: function(user, error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
        }

        // get all the players associated with the team id
        , getPlayersByTeamId = function(id, callback) {
            var query = new Parse.Query(playersTable);
            query.equalTo('team', {
                __type: "Pointer",
                className: "Team",
                objectId: id
            });
            // get all players
            query.find({
                success: function(players) {
                    $timeout(function(){
                        // return players array
                        callback(players);
                    });

                }, error: function(error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
        }

        // get season stats of player based on their id
        , getSeasonPlayerStatsByPlayerId = function(id, callback) {
            var query = new Parse.Query(playerStatsTable);
            query.equalTo('objectId', id);
            // get player season stats
            query.first({
                success: function(playerStats) {
                    $timeout(function() {
                        // return player's season stats
                        callback(playerStats);
                    });
                }, error: function(user, error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
        }

        // get player by player id in the case we need the whole parse object
        , getPlayerByPlayerId = function (playerID, callback) {
            var query = new Parse.Query(playersTable);
            query.equalTo("objectId", playerID);
            // get player
            query.first({
                success: function(player) {
                    $timeout(function() {
                        // return player
                        callback(player);
                    });
                },
                error: function(error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        // get game stats based on the game id
        , getGameStatsById = function(game_id){
            //console.log(game_id);
            var query = new Parse.Query(gameTable);
            query.include('gameTeamStats');
            query.equalTo("objectId", game_id);
            // return game
            return query.first();
        }

        // get stats of the players that are playing in the game
        , getGamePlayerStatsById = function(gameTeamStatsId) {
            var query = new Parse.Query(gameStatsTable);
            query.equalTo('objectId', gameTeamStatsId);
            // include parse objects associated with the players in the roster and substitutions
            query.include('roster');
            query.include('roster.player');
            query.include('substitutions');
            query.include('substitutions.subbedIn');
            query.include('substitutions.subbedOut');
            query.include('substitutions.subbedIn.player');
            query.include('substitutions.subbedOut.player');
            //console.log(gameTeamStatsId);
            // query.first().then(function(gameTeamStats) {
            //     query = new Parse.Query(playersTable);
            //     var playerPointers = _.pluck(gameTeamStats.get("substitutions"),  )
            // });
            // return player game stats
            return query.first();
        }

        // get parent emails based on which parents are on the team
        , getParentEmailsByTeamId = function(teamId, callback) {
            var query = new Parse.Query(userTable);
            query.equalTo("teams", {
                __type : "Pointer",
                className : "Team",
                objectId : teamId
            });
            query.equalTo("accountType", 2);    // limit our search to parents
            // get all parents so we can access their email later
            query.find({
                success: function(parentEmails) {
                    // return parents
                    callback(parentEmails);
                },
                error: function(parentEmails, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        // get parent based on the player's id
        , getParentByPlayerId = function(playerId, callback) {
            var query = new Parse.Query(userTable);
            query.equalTo("players", {
                __type: "Pointer",
                className: "Players",
                objectId : playerId
            });
            query.equalTo("accountType", 2);    // limit search to parents in case the coach has the player
            // get parent
            query.first({
                success: function(parent) {
                    // return parent
                    callback(parent);
                },
                error : function(parent, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        // get game by game id in the case we need the whole parse object
        , getGameByGameId = function(gameId) {
            // console.log(gameId);
            var query = new Parse.Query(gameTable);
            query.equalTo('objectId', gameId);
            // return game
            return query.first();
        }

        // create a new game
        , saveGame = function(game, teamID) {
            console.log(game);
            console.log(teamID);
            var newGame = new gameTable();  // create a new game object
  
            // set up new game information
            newGame.set("date", game.date);
            newGame.set("opponent", game.opponent.name);
            newGame.set("opponentSymbol", game.opponent.symbol);
            newGame.set("startTime", game.time.toTimeString());
            newGame.set("team", {__type: "Pointer", className: "Team", objectId: teamID});
            newGame.set("gameTeamStats", new gameStatsTable());
            
            // Default values
            newGame.set("status", "not_started");

            // Save the game object
            newGame.save(null, {
                success: function(newGame) {
                    toastService.success("Game on " + (game.date.getMonth() + 1) + "/" + game.date.getDate() + " added.");
                    $rootScope.$broadcast(configService.messages.gameStatusChanged);
                },
                error: function(newGame, error) {
                    console.log("Error saving game: " + error.code + " " + error.message);
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
        }

        // save game attributes of the game such as game notes
        , saveGameAttributes = function (game, attributes, data) {
            var query = new Parse.Query(gameTable);
            query.equalTo("objectId", game.id);
            // first get the game parse object
            query.first({
                success: function(editGame) {
                    console.log(editGame);

                    for(var i = 0; i < attributes.length; i++) {
                        editGame.set(attributes[i], data[i]);
                    }
                    // update parse object
                    editGame.save(null, {
                        success: function() {
                            toastService.success("Successfully saved game notes.");
                        },
                        error: function (error) {
                            toastService.error("There was an error.");
                        }
                    })
                },
                error: function(editGame, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        // create a roster for a game
        , createRoster = function(roster, gameId){
            //console.log(gameId);

            var players = [];
            var game = {};
            var promise = new Parse.Promise();

            // get the length of the roster being passed in
            var getRosterLength = function(roster) {
                var counter = 0;
                 _.each(roster, function(rosterPlayer) { 
                    if (rosterPlayer.selected) {
                        counter++;
                    }
                 });
                 return counter;
            }
            var rosterLength = getRosterLength(roster);

            // for each player in the roster, set up a new game player so we can record stats for that game
            _.each(roster, function(rosterPlayer){
                if (rosterPlayer.selected) {
                    var ptr = {
                        "__type": "Pointer",
                        "className": "Players",
                        "objectId": rosterPlayer.id
                    };

                    var playerStats = new gamePlayerStatsTable();
                    // set up game player information
                    playerStats.set("player", ptr);
                    playerStats.set("shots", []);
                    playerStats.set("passes", {});
                    playerStats.set("cards", []);
                    playerStats.set("fouls", 0);
                    playerStats.set("playingTime", 0);
                    playerStats.set("subbedOut", []);
                    playerStats.set("subbedIn", []);
                    playerStats.set("assists", 0);
                    !rosterPlayer.benched ? playerStats.set("startingStatus", "On") : playerStats.set("startingStatus", "Off");
                    rosterPlayer.position ? playerStats.set("position", rosterPlayer.position) : playerStats.set("position", "B");
                    // create new player stats for the game
                    playerStats.save().then(function (gamePlayerStats) {
                        players.push(gamePlayerStats);

                        if (players.length == rosterLength) {
                            promise.resolve("ok");
                        }
                    });
                } 
            });

            // after a player for a game has been created
            promise.then(function(result){
                query = new Parse.Query(gameTable);
                query.include("gameTeamStats");
                query.equalTo("objectId", gameId);
                // get game statistics
                query.first().then(function(result){
                    game = result;
                    // save the roster into the game stats table
                    var gameStats = result.get("gameTeamStats");
                    gameStats.set("roster", players);
                    gameStats.set("goalsMade", 0);
                    gameStats.set("goalsTaken", 0);
                    gameStats.set("possession", 0);
                    gameStats.set("corners", 0);
                    gameStats.set("offsides", 0);
                    gameStats.set("tackles", 0);
                    gameStats.set("saves", 0);
                    gameStats.set("substitutions", []);
                    // save the game stats object
                    return gameStats.save();
                }).then(function(gameStats){
                     game.set("status", "ready ");  // set the status of the game to ready so stats can start recording
                     return game.save();
                }).then(function(result){
                    setCurrentGame(result); // set the edited current game
                    $rootScope.$broadcast(configService.messages.gameStatusChanged);
                    toastService.success("Game roster successfully created");
                    viewService.goToPage('/game-review');   // go to the game review page
                },function(error){
                     console.log("Error: " + error.code + " " + error.message);
                });

            });
        }

        /*  creating a custom player object for the home-page
            contains player information and player statistics
            for a season
         */
        , playerConstructor = function(player, stats) {
            var retPlayer = {
                                id : player.id,
                                photo: player.attributes.photo ? player.attributes.photo._url : './img/player-icon.svg',
                                fname: player.attributes.firstName,
                                lname: player.attributes.lastName,
                                number: player.attributes.jerseyNumber,
                                position: '',
                                total: {
                                    goals: stats.attributes.goals ? stats.attributes.goals : 0,
                                    fouls: stats.attributes.fouls ? stats.attributes.fouls : 0,
                                    playingTime : stats.attributes.playingTime ? Math.round(stats.attributes.playingTime) : 0,
                                    assists: stats.attributes.assists ? stats.attributes.assists : 0,
                                    yellows: 0,
                                    reds: 0,
                                    // initialize the card data
                                    cardInit : function(playerCard, stats) {
                                        // calculate totals and set data values
                                        card = stats.attributes.cards;
                                        //console.log(stats);
                                        //_.each(stats.attributes.cards, function(card) {
                                            //if (card.type === "yellow")
                                                playerCard.yellows = card.yellow;
                                            //else if (card.type === "red")
                                                playerCard.reds = card.red;
                                       // });
                                    }
                                },
                                shots : {
                                    data : [
                                        {
                                            value: 0,
                                            color: "#B4B4B4",
                                            highlight: "#B4B4B4",
                                            label: "Missed"
                                        },
                                        {
                                            value: 0,
                                            color:"#5DA97B",
                                            highlight: "#5DA97B",
                                            label: "Completed"
                                        }
                                    ],
                                    accuracy: 0,
                                    goals: 0,
                                    // initialziing shot data
                                    shotInit: function(playerShot, stats) {
                                        var blocks = 0,
                                            onGoal = 0,
                                            offGoal = 0,
                                            shot = stats.attributes.shots
                                        ;
                                        //_.each(stats.attributes.shots, function(shot) {
                                            blocks = shot.blocked;
                                            onGoal = shot.onGoal;
                                            offGoal = shot.offGoal;
                                            playerShot.goals = shot.goal;
                                        //});
                                        // calculate totals and set data values
                                        var total = blocks + onGoal + offGoal + playerShot.goals;
                                        playerShot.accuracy = Math.round(((total - offGoal) / total)*100);
                                        console.log(playerShot.accuracy);
                                        playerShot.data[0].value = offGoal;
                                        playerShot.data[1].value = total;
                                    }
                                },
                                passes: {
                                    data : [
                                        {
                                            value: 0,
                                            color: "#B4B4B4",
                                            highlight: "#B4B4B4",
                                            label: "Completed"
                                        },
                                        {
                                            value: 0,
                                            color:"#5DA97B",
                                            highlight: "#5DA97B",
                                            label: "Total"
                                        }
                                    ],
                                    completed: 0,
                                    total: 0,
                                    // initializing pass data
                                    passInit: function(playerPass, stats) {
                                        // calculate totals and set data values
                                        pass = stats.attributes.passes;
                                        //_.each(stats.attributes.passes, function(pass) {
                                            playerPass.completed = pass.completed;
                                            playerPass.total = pass.total;
                                        //});
                                        playerPass.data[0].value = playerPass.completed;
                                        playerPass.data[1].value = playerPass.total;
                                    }
                                },
                                emergencyContact: {
                                    name: player.attributes.emergencyContact,
                                    phone: player.attributes.phone,
                                    relationship: player.attributes.relationship
                                }
                            }; 
            // call the initializing functions
            if (stats.attributes.cards)
                retPlayer.total.cardInit(retPlayer.total, stats);
            if (stats.attributes.shots)
                retPlayer.shots.shotInit(retPlayer.shots, stats); 
            if (stats.attributes.passes)
                retPlayer.passes.passInit(retPlayer.passes, stats); 

            // return the player constructor object
            return retPlayer;            
        }

        /*  creating a custom player object for the game review page
            contains player information and player statistics
            for a specific game
         */
        , gamePlayerConstructor = function(player, gamePlayer) {
            //console.log(gamePlayer);
            var retPlayer =
                {
                    gameId: gamePlayer.id,
                    playerId: player.id,
                    fname: player.get("firstName"),
                    lname: player.get("lastName"),
                    number: player.get("jerseyNumber"),
                    photo: player.get("photo") ? player.get("photo")._url : './img/player-icon.svg',
                    position: gamePlayer.get("position") ? gamePlayer.get("position") : '',
                    benched: gamePlayer.get("startingStatus") !== "On" ? true : false,  // check if user is benched to determine lineups
                    myKid : true,   // boolean variable for parent to determine which player is there
                    notableEvents: [],  // array of notable events: cards, goals, substitutions
                    // initializes events
                    eventsInit : function(retPlayer, subbedOut, subbedIn) {
                        if (subbedOut) {
                            _.each(subbedOut, function (subOut) {
                                retPlayer.notableEvents.push({
                                    type: "Subbed Out",
                                    time: subOut
                                });
                            });
                        }
                        if (subbedIn) {
                            _.each(subbedIn, function (subIn) {
                                retPlayer.notableEvents.push({
                                    type: "Subbed In",
                                    time: subIn
                                });
                            });
                        }
                    },
                    total: {
                        fouls: gamePlayer.get("fouls") ? gamePlayer.get("fouls") : 0,
                        assists: gamePlayer.get("assists") ? gamePlayer.get("assists") : 0,
                        playingTime: gamePlayer.get("playingTime") ? gamePlayer.get("playingTime") : 0,
                        red: {
                            total: 0,
                            time: []
                        },
                        yellow: {
                            total: 0,
                            time: []
                        },
                        // initializes cards
                        cardInit: function(player, cards) {
                            playerCards = player.total;
                            _.each(cards, function(card) {
                               if (card.type == "red") {
                                   playerCards.red.total++;
                                   playerCards.red.time.push(card.time);
                                   player.notableEvents.push({
                                       type: "red",
                                       time: card.time
                                   });
                               }
                                else if (card.type == "yellow") {
                                   playerCards.yellow.total++;
                                   playerCards.yellow.time.push(card.time);
                                   player.notableEvents.push({
                                       type: "yellow",
                                       time: card.time
                                   });
                               }

                            });
                        }
                    },
                    passes: {
                        data: [
                            {
                                value: 0,
                                color: "#B4B4B4",
                                highlight: "#B4B4B4",
                                label: "Completed"
                            },
                            {
                                value: 0,
                                color:"#5DA97B",
                                highlight: "#5DA97B",
                                label: "Total"
                            }
                        ],
                        completed: 0,
                        total: 0,
                        // initializes pass data
                        passInit: function(playerPasses, passes) {
                            // calculate totals and set data values
                            playerPasses.completed = passes.completed;
                            playerPasses.total = passes.total;
                            playerPasses.data[0].value = passes.completed;
                            playerPasses.data[1].value = passes.total;
                        }
                    },
                    shots: {
                        data: [
                            {
                                value: 0,
                                color: "#B4B4B4",
                                highlight: "#B4B4B4",
                                label: "Attempted"
                            },
                            {
                                value: 0,
                                color:"#5DA97B",
                                highlight: "#5DA97B",
                                label: "Completed"
                            }
                        ],
                        accuracy: 0,
                        total: 0,
                        blocks: {
                            total: 0,
                            startPos: [],
                            resultPos: []
                        },
                        onGoal: {
                            total: 0,
                            startPos: [],
                            resultPos: []
                        },
                        offGoal: {
                            total: 0,
                            startPos: [],
                            resultPos: []
                        },
                        goals: {
                            total: 0,
                            startPos: [],
                            resultPos: [],
                            time: [],
                            assistedBy: []
                        },
                        // initializes shot data
                        shotInit: function(player, shots) {
                            playerShots = player.shots;
                            if(shots){
                                _.each(shots,function(shot){
                                    switch(shot.type){
                                        case "offGoal":
                                            playerShots.offGoal.total++;
                                            playerShots.offGoal.startPos.push(shot.shotPos);
                                            playerShots.offGoal.resultPos.push(shot.resultPos);
                                            break;
                                        case "onGoal":
                                            playerShots.onGoal.total++;
                                            playerShots.onGoal.startPos.push(shot.shotPos);
                                            playerShots.onGoal.resultPos.push(shot.resultPos);
                                            break;
                                        case "goal":
                                            playerShots.goals.total++;
                                            playerShots.goals.startPos.push(shot.shotPos);
                                            playerShots.goals.resultPos.push(shot.resultPos);
                                            playerShots.goals.time.push(shot.time);
                                            if (shot.assistedBy) {
                                                playerShots.goals.assistedBy.push(shot.assistedBy);
                                            }
                                            player.notableEvents.push({
                                                type: "goal",
                                                time: shot.time
                                            });
                                            break;
                                        case "blocked":
                                            playerShots.blocks.total++;
                                            playerShots.blocks.startPos.push(shot.shotPos);
                                            playerShots.blocks.resultPos.push(shot.resultPos);
                                            break;
                                    }
                                });
                            }
                            // calculate totals and set data values
                            var total = playerShots.blocks.total + playerShots.onGoal.total + playerShots.offGoal.total + playerShots.goals.total;
                            playerShots.total = total;
                            playerShots.accuracy = Math.round(((total - playerShots.offGoal.total) / total)*100);
                            playerShots.data[0].value = playerShots.offGoal.total;
                            playerShots.data[1].value = total;
                        }
                    }
                };
            // call the initializing functions within each data
            if (gamePlayer.get("cards"))
                retPlayer.total.cardInit(retPlayer, gamePlayer.get("cards"));
            if (gamePlayer.get("subbedOut") || gamePlayer.get("subbedIn"))
                retPlayer.eventsInit(retPlayer, gamePlayer.get("subbedOut"), gamePlayer.get("subbedIn"));
            if (gamePlayer.get("passes"))
                retPlayer.passes.passInit(retPlayer.passes, gamePlayer.get("passes"));
            if (gamePlayer.get("shots"))
                retPlayer.shots.shotInit(retPlayer, gamePlayer.get("shots"));
            return retPlayer;
        }

        , sendEmailInvite = function(user, teamID, teamName, inviteEmails, self) {
            _.each(inviteEmails, function (email) {
                emailService.sendEmailInvite(user.get("name"), teamID, teamName, email);
            });
            viewService.closeModal(self);
        }

    ; return {
        ageGroups: ageGroups,
        states : states,
        getTeams : getTeams,
        getTeamById : getTeamById,
        getPlayersByTeamId : getPlayersByTeamId,
        setCurrentTeam : setCurrentTeam,
        getCurrentTeam : getCurrentTeam,
        setCurrentGame : setCurrentGame,
        getCurrentGame : getCurrentGame,
        registerTeam : registerTeam,
        getPlayers: getPlayers,
        getCurrentUser: getCurrentUser,
        getSeasonPlayerStatsByPlayerId : getSeasonPlayerStatsByPlayerId,
        getGames : getGames,
        playerConstructor : playerConstructor,
        getPlayerByPlayerId : getPlayerByPlayerId,
        getSeasonTeamStats : getSeasonTeamStats,
        saveGame : saveGame,
        saveGameAttributes : saveGameAttributes,
        getGameStatsById : getGameStatsById,
        registerCoach : registerCoach,
        sendEmailInvite : sendEmailInvite,
        updateAccount : updateAccount,
        updateTeam : updateTeam,
        registerPlayer : registerPlayer,
        updatePlayer : updatePlayer,
        registerNewTeam : registerNewTeam,
        getParentEmailsByTeamId : getParentEmailsByTeamId,
        getParentByPlayerId : getParentByPlayerId,
        getGamePlayerStatsById : getGamePlayerStatsById,
        gamePlayerConstructor : gamePlayerConstructor,
        getGameByGameId : getGameByGameId,
        createRoster : createRoster
        //removePlayer : removePlayer
    }

});