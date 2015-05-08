soccerStats.factory('dataService', function ($location, $timeout, $rootScope, configService, toastService, emailService, viewService) {

    var
         ageGroups = { "U12" : "U12" , "U16" : "U16", "U18" : "U18", "U20" : "U20", "U23" : "U23" }
        , states = {AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",DC:"District Of Columbia",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"}
        
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

        // Team Table        
        , setCurrentTeam = function(team) {
            currentTeam = team;
            //window.localStorage['currentTeam'] = JSON.stringify(currentTeam);
        }

        , getCurrentTeam = function() {
            //console.log(currentTeam);
            return currentTeam;
            //return JSON.parse( window.localStorage['currentTeam'] || '{}');
        }

        , setCurrentGame = function (game) {
            currentGame = game;
        }

        , getCurrentGame = function() {
            return currentGame;
        }

        , getTeams = function(callback) {
            var teamDict = [];
            var query = new Parse.Query(userTable);
            var currentUser = Parse.User.current();
            // console.log(currentUser);
            query.include('teams');
            query.get(currentUser.id, {
                success: function(user) {
                    $timeout(function(){
                        var teams = user.get("teams");
                        // Add each team associated with the current user to the team dropdown list
                        _.each(teams, function (team) {
                            teamDict.push(team);
                        });

                        callback(teamDict);
                    });

                }, error: function(user, error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
            return teamDict;
        }

        , getPlayers = function(callback) {
            var dictionary = [];
            var currentUser = Parse.User.current();
            var query = new Parse.Query(userTable);
            query.include('players');
            query.get(currentUser.id, {
                success: function (user) {
                    $timeout(function() {
                        var players = user.get("players");
                        _.each(players, function (player) {
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
                        
                        callback(dictionary);
                    });
                    
                },
                error: function (user, error) {

                }
            });
            return dictionary;
        }

        , getGames = function(_team,callback){
            var team = new teamTable();
            var query = new Parse.Query(gameTable);


            team.id = _team.id;
            team.fetch().then(function(team){
                query.equalTo('team',team);
                query.include('gameTeamStats');
                query.find().then(function(games_brute){
                    //console.log(games_brute);
                    var game;
                    var games = [];
                    
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
                        // console.log(game);
                        games.push(game);
                    }
                    //console.log(games);

                    callback(games);
                }, function(error){
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");

                });
            });
        }

        , getSeasonTeamStats = function(team_id,callback){
            
            var query = new Parse.Query(teamTable);

            query.include('teamStats');
            query.include("teamStats.topAssists");
            query.include("teamStats.topAssists.playerStats");
            query.include("teamStats.topGoals");
            query.include("teamStats.topGoals.playerStats");
            query.include("teamStats.topShots");
            query.include("teamStats.topShots.playerStats");

            query.equalTo('objectId',team_id)
            query.first().then(function(team){

                if (team.get('teamStats').get('topAssists'))  team.get('teamStats').get('topAssists').slice(0,4);
                if (team.get('teamStats').get('topGoals'))  team.get('teamStats').get('topGoals').slice(0,4);
                if(team.get('teamStats').get('topShots'))  team.get('teamStats').get('topShots').slice(0,4);
                callback(team.get('teamStats'));
            }, function(error){
                 console.log("Error: " + error.code + " " + error.message);
                 callback({error:"Someting happened"});
            });
        }

        , registerTeam = function(newTeam) {
            var _team = new teamTable();

            _team.set("ageGroup", newTeam.ageGroup);
            _team.set("city", newTeam.city);
            _team.set("leagueName", newTeam.leagueName);
            _team.set("name", newTeam.name);
            _team.set("number", newTeam.number);
            _team.set("state", (_.invert(states))[newTeam.state]);
            _team.set("logo", newTeam.logo);
            _team.set("primaryColor", newTeam.primaryColor);
            _team.set("teamStats", new SeasonTeamTable());

            return _team;
        }

        , registerCoach = function (newUser, _team, inviteEmails) {
            _team.save(null, {
                success: function (_team) {
                    var registerUser = new Parse.User();

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
                            sendEmailInvite(registerUser, _team.id, _team.get("name"), inviteEmails);
                            viewService.goToPage('/home');
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

        , registerPlayer = function(player, self, coach) {
            var currentUser = getCurrentUser();
            var newPlayer = new playersTable();
            var playerStats = new playerStatsTable();
            var query = new Parse.Query(teamTable);
            query.get(player.team.id, {
                success: function (team) {
                    if (coach) {
                        newPlayer.set("name", player.name);
                        newPlayer.set("jerseyNumber", player.jerseyNumber);
                        newPlayer.set("team", team);
                        newPlayer.set("playerStats", playerStats);

                    } else {
                        if (player.newPhoto) newPlayer.set("photo", player.newPhoto);
                        newPlayer.set("name", player.name);
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
                    //update parse
                    newPlayer.save(null, {
                        success: function (newPlayer) {
                            if (player.parentId) {
                                //parseRegisterPlayer(newPlayer, player, self);
                                Parse.Cloud.run('addPlayer', {newPlayerId: newPlayer.id, parentId: player.parentId}, {
                                    success: function (result) {
                                        console.log(result);
                                        toastService.success("Player " + player.name + ", successfully added.");
                                        $rootScope.$broadcast(configService.messages.playerAdded, newPlayer);
                                        //$rootScope.$broadcast(configService.messages.teamChanged, {refresh: true});
                                        viewService.closeModal(self);
                                    },
                                    error: function (error) {
                                        console.log("Error: " + error.code + " " + error.message);
                                        toastService.error("There was an error (" + error.code +"). Please try again.");
                                    }
                                });
                            } else {
                                currentUser.addUnique("players", newPlayer);
                                currentUser.save(null, {
                                    success: function (currentUser) {
                                        toastService.success("Player " + player.name + ", successfully added.");
                                        $rootScope.$broadcast(configService.messages.playerAdded, newPlayer);
                                        //$rootScope.$broadcast(configService.messages.teamChanged, {refresh: true});
                                        viewService.closeModal(self);
                                    },
                                    erorr: function (currentUser, error) {
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

        , registerNewTeam = function(_team, self) {
            var currentUser = getCurrentUser();
            _team.save(null, {
                success: function(_team) {
                    currentUser.addUnique("teams", _team);
                    currentUser.save(null, {
                        success: function(currenUser) {
                            toastService.success(configService.toasts.teamAddSuccess);
                            viewService.closeModal(self);
                            $rootScope.$broadcast(configService.messages.addNewTeam, _team);
                            $rootScope.$broadcast(configService.messages.teamChanged, {team: _team, refresh: false});
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

        , updateAccount = function (editUser, self) {
            var currentUser = getCurrentUser();
            currentUser.set("username", editUser.email);
            currentUser.set("firstName", editUser.firstName);
            currentUser.set("lastName", editUser.lastName);
            currentUser.set("name", editUser.firstName + " " + editUser.lastName);
            currentUser.set("email", editUser.email);
            currentUser.set("phone", editUser.phone);
            currentUser.set("city", editUser.city);
            currentUser.set("state", (_.invert(states))[editUser.state]);
            //console.log((_.invert($scope.states))[$scope.editUser.state]);
            if (editUser.newPhoto)
                currentUser.set("photo", editUser.newPhoto);
            if(editUser.newPassword !== '')
                currentUser.set("password", editUser.newPassword);
            
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

        , updateTeam = function(currentTeamID, editTeam, self) {
            var query = new Parse.Query(teamTable);
            query.get(currentTeamID, {
                success: function(team) {
                    team.set("leagueName", editTeam.leagueName);
                    team.set("ageGroup", editTeam.ageGroup);
                    team.set("primaryColor", editTeam.primaryColor);
                    team.set("city", editTeam.city);
                    team.set("name", editTeam.name);
                    team.set("number", editTeam.number);
                    team.set("state", (_.invert(states))[editTeam.state]);
                    if (editTeam.newLogo) 
                        team.set("logo", editTeam.newLogo);
                    team.save(null, {
                        success: function (editTeam) {
                            setCurrentTeam(editTeam);
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
        
        , updatePlayer = function(player, self) {
            var query = new Parse.Query(playersTable);
            query.get(player.id, {
                success: function(editPlayer) {
                    query = new Parse.Query(teamTable);
                    query.get(player.team.id, {
                        success: function(team) {
                            //console.log(team);
                            if (player.newPhoto)
                                editPlayer.set("photo", player.newPhoto);
                            editPlayer.set("name", player.name);
                            editPlayer.set("birthday", player.birthday);
                            editPlayer.set("team", team);
                            editPlayer.set("jerseyNumber", player.jerseyNumber);
                            editPlayer.set("city", player.city);
                            editPlayer.set("state", (_.invert(states))[player.state]);
                            editPlayer.set("emergencyContact", player.emergencyContact.name);
                            editPlayer.set("phone", player.emergencyContact.phone);
                            editPlayer.set("relationship", player.emergencyContact.relationship);
                            editPlayer.save(null, {
                                success: function(editPlayer) {
                                    if (player.parentId) {
                                        removeParentsByPlayerId(player.id);
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

        , removeParentsByPlayerId = function(playerId) {
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

        , getTeamById = function(id, callback) {
            var query = new Parse.Query(teamTable);
            query.equalTo('objectId', id);
            query.first({
                success: function(team) {
                    $timeout(function(){
                        callback(team);
                    });

                }, error: function(user, error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
        }

        // Player Table
        , getPlayersByTeamId = function(id, callback) {
            var query = new Parse.Query(playersTable);
            query.equalTo('team', {
                __type: "Pointer",
                className: "Team",
                objectId: id
            });
            query.find({
                success: function(players) {
                    $timeout(function(){
                        callback(players);
                    });

                }, error: function(user, error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
        }

        , getSeasonPlayerStatsByPlayerId = function(id, callback) {
            var query = new Parse.Query(playerStatsTable);
            query.equalTo('objectId', id);
            query.first({
                success: function(playerStats) {
                    $timeout(function() {
                        callback(playerStats);
                    });
                }, error: function(user, error) {
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
        }

        , getPlayerByPlayerId = function (playerID, callback) {
            var query = new Parse.Query(playersTable);
            query.equalTo("objectId", playerID);
            query.first({
                success: function(player) {
                    $timeout(function() {
                        callback(player);
                    });
                },
                error: function(error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        , getGameStatsById = function(game_id){
            //console.log(game_id);
            var query = new Parse.Query(gameTable);
            query.include('gameTeamStats');
            query.equalTo("objectId", game_id);
            return query.first();
        }

        , getGamePlayerStatsById = function(gameTeamStatsId) {
            var query = new Parse.Query(gameStatsTable);
            query.equalTo('objectId', gameTeamStatsId);
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
            return query.first();
        }

        , getParentEmailsByTeamId = function(teamId, callback) {
            var query = new Parse.Query(userTable);
            query.equalTo("teams", {
                __type : "Pointer",
                className : "Team",
                objectId : teamId
            });
            query.equalTo("accountType", 2);
            query.find({
                success: function(parentEmails) {
                    callback(parentEmails);
                },
                error: function(parentEmails, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        , getParentByPlayerId = function(playerId, callback) {
            var query = new Parse.Query(userTable);
            query.equalTo("players", {
                __type: "Pointer",
                className: "Players",
                objectId : playerId
            });
            query.equalTo("accountType", 2);
            query.first({
                success: function(parent) {
                    callback(parent);
                },
                error : function(parent, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        , getGameByGameId = function(gameId) {
            console.log(gameId);
            var query = new Parse.Query(gameTable);
            query.equalTo('objectId', gameId);
            return query.first();
        }

        , saveGame = function(game, teamID) {
            console.log(game);
            console.log(teamID);
            var newGame = new gameTable();
  
            // Things the user entered
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
                },
                error: function(newGame, error) {
                    console.log("Error saving game: " + error.code + " " + error.message);
                    toastService.error("There was an error (" + error.code + "). Please try again.");
                }
            });
        }

        , saveGameAttributes = function (game, attributes, data) {
            var query = new Parse.Query(gameTable);
            query.equalTo("objectId", game.id);
            query.first({
                success: function(editGame) {
                    console.log(editGame);

                    for(var i = 0; i < attributes.length; i++) {
                        editGame.set(attributes[i], data[i]);
                    }

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

        , saveRoster = function (roster) {
            var gameTeamStats = new gameStatsTable();
            var promise = new Parse.Promise();
            _.each(roster, function(gamePlayer) {
                getPlayerByPlayerId(gamePlayer.id, function(player) {
                    var gamePlayerStats = new gamePlayerStatsTable();
                    gamePlayerStats.set("player", player);
                    if (gamePlayer.selected)
                        gamePlayerStats.set("startingStatus", "On");
                    else
                        gamePlayerStats.set("startingStatus", "Off");
                    gamePlayerStats.set("position", gamePlayer.position);
                    gamePlayerStats.save(null, {
                        success: function(gamePlayerStats) {
                            gameTeamStats.addUnique("roster", gamePlayerStats);
                        },
                        error: function(error) {
                            console.log("Error: " + error.code + " " + error.message);
                            toastService.error("There was a an error (" + error.code +"). Please try again.");
                        }
                    });
                });
            });
            promise.resolve(gameTeamStats);
            return promise;
        }

        , saveGameTeamStats = function(gameTeamStats, gameId) {
            gameTeamStats.save(null, {
                success: function(gameTeamStats) {
                    getGameByGameId(gameId).then(function(game) {
                        console.log(game);
                        game.set("status", "prepared");
                        game.save(null, {
                            success: function(game) {
                                toastService.success("Game roster successfully created");
                                viewService.goToPage('/game-review');
                            },
                            error: function(error) {
                                console.log("Error: " + error.code + " " + error.message);
                                toastService.error("There was a an error (" + error.code +"). Please try again.");
                            }
                        });

                    });

                } ,
                error: function(error) {
                    console.log("Error: " + error.code + " " + error.message);
                    toastService.error("There was a an error (" + error.code +"). Please try again.");
                }
            });
        }

        , playerConstructor = function(player, stats) {
            var retPlayer = {
                                id : player.id,
                                photo: player.attributes.photo ? player.attributes.photo._url : './img/player-icon.svg',
                                fname: player.attributes.name,
                                lname: '',
                                number: player.attributes.jerseyNumber,
                                position: '',
                                total: {
                                    goals: stats.attributes.goals ? stats.attributes.goals : 0,
                                    fouls: stats.attributes.fouls ? stats.attributes.fouls : 0,
                                    playingTime : stats.attributes.playingTime ? Math.round(stats.attributes.playingTime) : 0,
                                    assists: stats.attributes.assists ? stats.attributes.assists : 0,
                                    yellows: 0,
                                    reds: 0,
                                    cardInit : function(playerCard, stats) {
                                        //console.log(stats);
                                        _.each(stats.attributes.cards, function(card) {
                                            if (card.type === "yellow")
                                                playerCard.yellows++;
                                            else if (card.type === "red")
                                                playerCard.reds++;
                                        });
                                    }
                                },
                                // TODO: how are we calculating shot accuracy?
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
                                    blocks: 0,
                                    onGoal: 0,
                                    offGoal: 0,
                                    goals: 0,
                                    shotInit: function(playerShot, stats) {
                                        _.each(stats.attributes.shots, function(shot) {
                                            playerShot.blocks += shot.blocked;
                                            playerShot.onGoal += shot.onGoal;
                                            playerShot.offGoal += shot.offGoal;
                                            playerShot.goals += shot.goals;
                                        });
                                        var total = playerShot.blocks + playerShot.onGoal + playerShot.offGoal + playerShot.goals;
                                        playerShot.accuracy = Math.round(((total - playerShot.offGoal) / total)*100);
                                        playerShot.data[0].value = playerShot.offGoal;
                                        playerShot.data[1].value = total;
                                    }
                                },
                                passes: {
                                    data : [
                                        {
                                            value: 0,
                                            color: "#B4B4B4",
                                            highlight: "#B4B4B4",
                                            label: "Turnovers"
                                        },
                                        {
                                            value: 0,
                                            color:"#5DA97B",
                                            highlight: "#5DA97B",
                                            label: "Total Passes"
                                        }
                                    ],
                                    completion: '0/0',
                                    turnovers: 0,
                                    total: 0,
                                    passInit: function(playerPass, stats) {
                                        _.each(stats.attributes.passes, function(pass) {
                                            playerPass.turnovers += pass.turnovers;
                                            playerPass.total += pass.total;
                                        });
                                        playerPass.completion = (playerPass.total-playerPass.turnovers) + '/' + playerPass.total;
                                        playerPass.data[0].value = playerPass.turnovers;
                                        playerPass.data[1].value = playerPass.total;
                                    }
                                },
                                phone: "(123) 456 7890",
                                emergencyContact: {
                                    name: player.attributes.emergencyContact,
                                    phone: player.attributes.phone,
                                    relationship: player.attributes.relationship
                                }
                            }; 
            // console.log(index);
            if (stats.attributes.cards)
                retPlayer.total.cardInit(retPlayer.total, stats);
            if (stats.attributes.shots)
                retPlayer.shots.shotInit(retPlayer.shots, stats); 
            if (stats.attributes.passes)
                retPlayer.passes.passInit(retPlayer.passes, stats); 

            return retPlayer;            
        }

        , gamePlayerConstructor = function(player, gamePlayer) {
            var retPlayer =
                {
                    fname: player.get("firstName"),
                    lname: player.get("lastName"),
                    number: player.get("jerseyNumber"),
                    photo: player.get("photo") ? player.get("photo")._url : './img/player-icon.svg',
                    position: gamePlayer.get("position"),
                    notableEvents: [],
                    eventsInit : function(retPlayer, subbedOut, subbedIn) {
                        if (subbedOut) {
                            _.each(subbedOut, function (subOut) {
                                retPlayer.notableEvents.push({
                                    type: "Subbed out",
                                    time: subOut
                                });
                            });
                        }
                        if (subbedIn) {
                            _.each(subbedIn, function (subIn) {
                                retPlayer.notableEvents.push({
                                    type: "Subbed in",
                                    time: subIn
                                });
                            });
                        }
                    },
                    total: {
                        fouls: gamePlayer.get("fouls"),
                        red: {
                            total: 0,
                            time: []
                        },
                        yellow: {
                            total: 0,
                            time: []
                        },
                        cardInit: function(playerCards, cards) {
                            _.each(cards, function(card) {
                               if (card.type == "yellow") {
                                   playerCards.red.total++;
                                   playerCards.red.time.push(card.time);
                               }
                                else if (card.type == "red") {
                                   playerCards.yellow.total++;
                                   playerCards.yellow.time.push(card.time);
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
                                label: "Attempted"
                            },
                            {
                                value: 0,
                                color:"#5DA97B",
                                highlight: "#5DA97B",
                                label: "Completed"
                            }
                        ],
                        completion: '0/0',
                        turnovers: 0,
                        total: 0,
                        passInit: function(playerPasses, passes) {
                            playerPasses.turnovers = passes.turnovers;
                            playerPasses.total = passes.total;
                            playerPasses.data[0].value = passes.turnovers;;
                            playerPasses.data[1].value = passes.total;
                            playerPasses.completion = (passes.total - passes.turnovers) + '/' + passes.total;
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
                            time: []
                        },
                        shotInit: function(playerShots, shots, goals) {
                            if (shots) {
                                _.each(shots, function (shot) {
                                    if (shot.blocked) {
                                        playerShots.blocks.total++;
                                        playerShots.blocks.startPos.push(shot.blocked.shotPos);
                                        playerShots.blocks.resultPos.push(shot.blocked.resultPos);
                                    }
                                    if (shot.onGoal) {
                                        playerShots.onGoal.total++;
                                        playerShots.onGoal.startPos.push(shot.onGoal.shotPos);
                                        playerShots.onGoal.resultPos.push(shot.onGoal.resultPos);
                                    }
                                    if (shot.offGoal) {
                                        playerShots.offGoal.total++;
                                        playerShots.offGoal.startPos.push(shot.offGoal.shotPos);
                                        playerShots.offGoal.resultPos.push(shot.offGoal.resultPos);
                                    }
                                });
                            }
                            if (goals) {
                                _.each(goals, function (goal) {
                                    if (goal) {
                                        playerShots.goals.total++;
                                        playerShots.goals.startPos.push(goal.startPos);
                                        playerShots.goals.resultPos.push(goal.resultPos);
                                        playerShots.goals.time.push(goal.time);
                                    }
                                });
                            }
                            var total = playerShots.blocks.total + playerShots.onGoal.total + playerShots.offGoal.total + playerShots.goals.total;
                            playerShots.total = total;
                            playerShots.accuracy = Math.round(((total - playerShots.offGoal.total) / total)*100);
                            playerShots.data[0].value = playerShots.offGoal.total;
                            playerShots.data[1].value = total;
                        }
                    }
                };
            if (gamePlayer.get("cards"))
                retPlayer.total.cardInit(retPlayer.total, gamePlayer.get("cards"));
            if (gamePlayer.get("subbedOut") || gamePlayer.get("subbedIn"))
                retPlayer.eventsInit(retPlayer, gamePlayer.get("subbedOut"), gamePlayer.get("subbedIn"));
            if (gamePlayer.get("passes"))
                retPlayer.passes.passInit(retPlayer.passes, gamePlayer.get("passes"));
            if (gamePlayer.get("shots") || gamePlayer.get("goals"))
                retPlayer.shots.shotInit(retPlayer.shots, gamePlayer.get("shots"), gamePlayer.get("goals"));

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
        saveRoster : saveRoster,
        getGameByGameId : getGameByGameId,
        saveGameTeamStats : saveGameTeamStats
    }

});