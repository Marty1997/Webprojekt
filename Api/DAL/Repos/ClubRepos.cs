﻿using Dapper;
using Api.DAL.Entities;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Repos {
    public class ClubRepos : IRepository<Club> {

        public Func<IDbConnection> Connection { get; set; }

        public Club Create(Club entity) {

            List<int> _rowCountList = new List<int>();

            Club c = new Club();

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    //try {
                        
                        //Return usercredentials ID
                        string userCredentialsSQL = @"INSERT INTO UserCredentials (Hashpassword, Salt, LoginAttempts) VALUES (@Hashpassword, @Salt, @LoginAttempts); 
                                     SELECT CAST(SCOPE_IDENTITY() as int)";

                        var userCredentials_ID = conn.Query<int>(userCredentialsSQL, new { Hashpassword = entity.UserCredentials.HashPassword, Salt = entity.UserCredentials.Salt, LoginAttempts = 0 }, transaction: tran).Single();


                        //Insert Club
                        string clubSQL = @"INSERT INTO Club (Name, Email, League, Country, StreetAddress, AddressNumber, Trainer, AssistantTrainer, Physiotherapist, AssistantPhysiotherapist, Manager, ValueDescription, PreferenceDescription, 
                                        Zipcode, UserCredentials_ID) 
                                        VALUES (@Name, @Email, @League, @Country, @StreetAddress, @AddressNumber, @Trainer, @AssistantTrainer, @Physiotherapist, @AssistantPhysiotherapist, @Manager, @ValueDescription, @PreferenceDescription, 
                                        @Zipcode, @UserCredentials_ID);
                                            SELECT CAST(SCOPE_IDENTITY() as int)";

                        var club_ID = conn.Query<int>(clubSQL, new {
                            Name = entity.Name,
                            Email = entity.Email,
                            entity.League,
                            entity.Country,
                            entity.StreetAddress,
                            AddressNumber = entity.StreetNumber,
                            entity.Trainer,
                            entity.AssistantTrainer,
                            entity.Physiotherapist,
                            entity.AssistantPhysiotherapist,
                            entity.Manager,
                            entity.ValueDescription,
                            entity.PreferenceDescription,
                            entity.Zipcode,
                            UserCredentials_ID = userCredentials_ID
                        }, transaction: tran).Single();
               
                        //Club values
                        if (entity.ValuesList.Count > 0) {
                            foreach (string value in entity.ValuesList) {

                                //Return value ID
                                string valuesSQL = @"Select value_id from Value where name = @Name";
                                var value_ID = conn.Query<int>(valuesSQL, new { Name = value }, transaction: tran).Single();

                                //Insert ClubValue
                                string clubValueSQL = @"INSERT INTO ClubValue (Club_ID, Value_ID) 
                                        VALUES (@Club_ID, @Value_ID)";

                                _rowCountList.Add(conn.Execute(clubValueSQL, new {
                                    Club_ID = club_ID,
                                    Value_ID = value_ID
                                }, transaction: tran));
                            }
                        }

                        //Club preferences
                        if (entity.PreferenceList.Count > 0) {
                            foreach (string preference in entity.PreferenceList) {

                                //Return preference ID
                                string preferenceSQL = @"Select preference_id from Preference where name = @Name";
                                var preference_ID = conn.Query<int>(preferenceSQL, new { Name = preference }, transaction: tran).Single();

                                //Insert ClubPreference
                                string clubPreferenceSQL = @"INSERT INTO ClubPreference (Club_ID, Preference_ID) 
                                        VALUES (@Club_ID, @Preference_ID)";

                                _rowCountList.Add(conn.Execute(clubPreferenceSQL, new {
                                    Club_ID = club_ID,
                                    Preference_ID = preference_ID
                                }, transaction: tran));
                            }
                        }
                       

                        //Current Squad Players
                        foreach (SquadPlayer csp in entity.CurrentSquadPlayersList) {

                            //Return squad player position ID

                            string squadPlayerPositionSQL = @"Select position_id from position where name = @Position";

                            var squadPlayerPosition_ID = conn.Query<int>(squadPlayerPositionSQL, new { Position = csp.Position }, transaction: tran).Single();

                            //Insert Squad Player
                            string squadPlayerSQL = @"INSERT INTO SquadPlayers (ShirtNumber, Season, Name, Club_ID, Position_ID) 
                                        VALUES (@ShirtNumber, @Season, @Name, @Club_ID, @Position_ID)";

                            _rowCountList.Add(conn.Execute(squadPlayerSQL, new {
                                ShirtNumber = csp.ShirtNumber,
                                Season = csp.Season,
                                Name = csp.Name,
                                Club_ID = club_ID,
                                Position_ID = squadPlayerPosition_ID
                            }, transaction: tran));
                        }

                        //Next Year Squad Players
                        foreach (SquadPlayer nysp in entity.NextYearSquadPlayersList) {

                            //Return squad player position ID

                            string squadPlayerPositionSQL = @"Select position_id from position where name = @Position";

                            var squadPlayerPosition_ID = conn.Query<int>(squadPlayerPositionSQL, new { Position = nysp.Position }, transaction: tran).Single();

                            //Insert Squad Player
                            string squadPlayerSQL = @"INSERT INTO SquadPlayers (ShirtNumber, Season, Name, Club_ID, Position_ID) 
                                        VALUES (@ShirtNumber, @Season, @Name, @Club_ID, @Position_ID)";

                            _rowCountList.Add(conn.Execute(squadPlayerSQL, new {
                                ShirtNumber = nysp.ShirtNumber,
                                Season = nysp.Season,
                                Name = nysp.Name,
                                Club_ID = club_ID,
                                Position_ID = squadPlayerPosition_ID
                            }, transaction: tran));
                        }

                        //Open positions
                        if (entity.OpenPositionsList.Count > 0) {
                            foreach (string openPosition in entity.OpenPositionsList) {

                                //Return open position ID
                                string openPositionSQL = @"Select position_id from Position where name = @Name";
                                var openPosition_ID = conn.Query<int>(openPositionSQL, new { Name = openPosition }, transaction: tran).Single();

                                //Insert ClubPosition
                                string clubPositionSQL = @"INSERT INTO ClubPosition (Club_ID, Position_ID) 
                                        VALUES (@Club_ID, @Position_ID)";

                                _rowCountList.Add(conn.Execute(clubPositionSQL, new {
                                    Club_ID = club_ID,
                                    Position_ID = openPosition_ID
                                }, transaction: tran));
                            }
                        }
                        

                        //Training hours
                        foreach (TrainingHours traininghours in entity.TrainingHoursList) {

                            //Insert Training hours
                            string trainingHoursSQL = @"INSERT INTO TrainingHours (Name, Mon, Tue, Wed, Thu, Fri, Sat, Sun, Club_ID) 
                                        VALUES (@Name, @Mon, @Tue, @Wed, @Thu, @Fri, @Sat, @Sun, @Club_ID)";

                            _rowCountList.Add(conn.Execute(trainingHoursSQL, new {
                                Name = traininghours.Name,
                                Mon = traininghours.Mon,
                                Tue = traininghours.Tue,
                                Wed = traininghours.Wed,
                                Thu = traininghours.Thu,
                                Fri = traininghours.Fri,
                                Sat = traininghours.Sat,
                                Sun = traininghours.Sun,
                                Club_ID = club_ID
                            }, transaction: tran));
                        }


                        //Check for 0 in rowcount list
                        if (_rowCountList.Contains(0)) {
                            c.ErrorMessage = "The club was not registred";
                            tran.Rollback();
                        }
                        else {
                            c.ErrorMessage = "";
                            tran.Commit();
                        }
                    //}
                    //catch (SqlException e) {

                    //    tran.Rollback();
                    //    c.ErrorMessage = ErrorHandling.Exception(e);
                    //}
                }
            }
            return c;
        }
        

        public int Delete(int id) {
            throw new NotImplementedException();
        }

        public IEnumerable<Club> GetAll() {
            throw new NotImplementedException();
        }

        public Club GetByEmail(string email) {

            Club club = new Club();
            var varEmail = new {
                Email = email
            };
            using (var conn = Connection()) {

                //try {
                //club = conn.Query<Club, string, Club>("select c.* | ci.* from club c inner join ZipcodeCity" +
                //    " ci on c.zipcode = ci.zipcode where c.email = @Email",
                //(clubinside, city) => { clubinside.City = city; return club; }, varEmail).Single();




                club = conn.QuerySingle<Club>("select * from Club where email = @email", new { email });
                club.City = conn.Query<string>("select city from zipcodecity where zipcode = @zipcode", new { zipcode = club.Zipcode }).Single();
                club.TrainingHoursList = conn.Query<TrainingHours>("select * from TrainingHours where club_ID = @id", new { id = club.Id }).ToList();
                club.CurrentSquadPlayersList = conn.Query<SquadPlayer>("select * from Squadplayers where club_id = @id and season = 'Current year' ", new { id = club.Id }).ToList();
                club.NextYearSquadPlayersList = conn.Query<SquadPlayer>("select * from Squadplayers where club_id = @id and season = 'Next year' ", new { id = club.Id }).ToList();
                foreach (SquadPlayer item in club.CurrentSquadPlayersList) {
                    item.Position = conn.Query<string>("select name from position where position.id = @id", new { id = item.Position_ID }).Single();
                }
                foreach (SquadPlayer item in club.NextYearSquadPlayersList) {
                    item.Position = conn.Query<string>("select name from position where id = @id", new { id = item.Position_ID }).Single();
                }

                if (club.Id < 1) {
                        club.ErrorMessage = "The club does not exist";
                    }
                    else {
                        club.ErrorMessage = "";
                    }
                //}
                //catch (SqlException e) {
                //    club.ErrorMessage = ErrorHandling.Exception(e);
                //}

            }
            return club;
        }

        public Club GetById(int id) {
            throw new NotImplementedException();
        }

        public UserCredentials getCredentialsByEmail(string email) {
            throw new NotImplementedException();
        }

        public void Insert(Club entity) {
            throw new NotImplementedException();
        }

        public void Save() {
            throw new NotImplementedException();
        }

        public bool Update(Club entity) {
            throw new NotImplementedException();
        }
    }
}
