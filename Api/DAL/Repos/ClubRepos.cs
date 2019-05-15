using Dapper;
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
                    int userCredentials_ID = conn.Query<int>(userCredentialsSQL, new { Hashpassword = entity.UserCredentials.HashPassword, Salt = entity.UserCredentials.Salt, LoginAttempts = 0 }, transaction: tran).Single();

                    //Return zipcodeCity ID
                    string zipcodeCitySQL = @"INSERT INTO ZipcodeCity (Zipcode, City) VALUES (@Zipcode, @City);
                                        SELECT CAST(SCOPE_IDENTITY() as int)";
                    int zipcodeCity_ID = conn.Query<int>(zipcodeCitySQL, new { Zipcode = entity.Zipcode, City = entity.City }, transaction: tran).Single();

                    //Insert Club
                    string clubSQL = @"INSERT INTO Club (Name, Email, League, Country, StreetAddress, StreetNumber, Trainer, AssistantTrainer, Physiotherapist, AssistantPhysiotherapist, Manager, ValueDescription, PreferenceDescription, 
                                        ZipcodeCity_ID, UserCredentials_ID) 
                                        VALUES (@Name, @Email, @League, @Country, @StreetAddress, @StreetNumber, @Trainer, @AssistantTrainer, @Physiotherapist, @AssistantPhysiotherapist, @Manager, @ValueDescription, @PreferenceDescription, 
                                        @ZipcodeCity_ID, @UserCredentials_ID);
                                            SELECT CAST(SCOPE_IDENTITY() as int)";

                    var club_ID = conn.Query<int>(clubSQL, new {
                        Name = entity.Name,
                        Email = entity.Email,
                        entity.League,
                        entity.Country,
                        entity.StreetAddress,
                        entity.StreetNumber,
                        entity.Trainer,
                        entity.AssistantTrainer,
                        entity.Physiotherapist,
                        entity.AssistantPhysiotherapist,
                        entity.Manager,
                        entity.ValueDescription,
                        entity.PreferenceDescription,
                        ZipcodeCity_ID = zipcodeCity_ID,
                        UserCredentials_ID = userCredentials_ID
                    }, transaction: tran).Single();

                    //Club values
                    if (entity.ValuesList.Count > 0) {
                        foreach (string value in entity.ValuesList) {

                            //Return value ID
                            string valuesSQL = @"Select id from Value where name = @Name";
                            int value_ID = conn.Query<int>(valuesSQL, new { Name = value }, transaction: tran).FirstOrDefault();

                            if (value_ID != 0) {

                                //Insert ClubValue
                                string clubValueSQL = @"INSERT INTO ClubValue (Club_ID, Value_ID) 
                                        VALUES (@Club_ID, @Value_ID)";

                                _rowCountList.Add(conn.Execute(clubValueSQL, new {
                                    Club_ID = club_ID,
                                    Value_ID = value_ID
                                }, transaction: tran));
                            }
                        }
                    }

                    //Club preferences
                    if (entity.PreferenceList.Count > 0) {
                        foreach (string preference in entity.PreferenceList) {

                            //Return preference ID
                            string preferenceSQL = @"Select id from Preference where name = @Name";
                            int preference_ID = conn.Query<int>(preferenceSQL, new { Name = preference }, transaction: tran).FirstOrDefault();

                            if (preference_ID != 0) {

                                //Insert ClubPreference
                                string clubPreferenceSQL = @"INSERT INTO ClubPreference (Club_ID, Preference_ID) 
                                        VALUES (@Club_ID, @Preference_ID)";

                                _rowCountList.Add(conn.Execute(clubPreferenceSQL, new {
                                    Club_ID = club_ID,
                                    Preference_ID = preference_ID
                                }, transaction: tran));
                            }
                        }
                    }


                    //Current Squad Players
                    if (entity.CurrentSquadPlayersList.Count > 0) {
                        foreach (SquadPlayer csp in entity.CurrentSquadPlayersList) {

                            
                            //Insert Squad Player
                            string squadPlayerSQL = @"INSERT INTO SquadPlayers (ShirtNumber, Season, Name, Position, Club_ID) 
                                        VALUES (@ShirtNumber, @Season, @Name, @Position, @Club_ID)";

                            _rowCountList.Add(conn.Execute(squadPlayerSQL, new {
                                ShirtNumber = csp.ShirtNumber,
                                Season = csp.Season,
                                Name = csp.Name,
                                Position = csp.Position,
                                Club_ID = club_ID
                            }, transaction: tran));

                        }
                    }

                    //Next Year Squad Players
                    if (entity.NextYearSquadPlayersList.Count > 0) {
                        foreach (SquadPlayer nysp in entity.NextYearSquadPlayersList) {

                            
                            //Insert Squad Player
                            string squadPlayerSQL = @"INSERT INTO SquadPlayers (ShirtNumber, Season, Name, Position, Club_ID) 
                                        VALUES (@ShirtNumber, @Season, @Name, @Position, @Club_ID)";

                            _rowCountList.Add(conn.Execute(squadPlayerSQL, new {
                                ShirtNumber = nysp.ShirtNumber,
                                Season = nysp.Season,
                                Name = nysp.Name,                                
                                Position = nysp.Position,
                                Club_ID = club_ID,
                            }, transaction: tran));

                        }
                    }

                    //Job position
                    if (entity.JobPositionsList.Count > 0) {
                        foreach (JobPosition jp in entity.JobPositionsList) {

                            var jobPosition_ID = 0;

                            //Insert JobPosition
                            string jobPositionSQL = @"INSERT INTO JobPosition (League, PreferredHand, Height, MinAge, MaxAge, Season, ContractStatus, Position, Club_ID) 
                                        VALUES (@League, @PreferredHand, @Height, @MinAge, @MaxAge, @Season, @ContractStatus, @Position, @Club_ID);
                                            SELECT CAST(SCOPE_IDENTITY() as int)";

                            jobPosition_ID = conn.Query<int>(jobPositionSQL, new {
                                League = jp.League,
                                PreferredHand = jp.PreferredHand,
                                Height = jp.Height,
                                MinAge = jp.MinAge,
                                MaxAge = jp.MaxAge,
                                Season = jp.Season,
                                ContractStatus = jp.ContractStatus,
                                Position = jp.Position,
                                Club_ID = club_ID
                            }, transaction: tran).Single();

                            if (jp.StrengthsList.Count > 0) {
                                foreach (string strength in jp.StrengthsList) {

                                    //Return strength ID
                                    string strengthSQL = @"Select id from Strength where name = @Name";
                                    int strength_ID = conn.Query<int>(strengthSQL, new { Name = strength }, transaction: tran).FirstOrDefault();

                                    if (strength_ID != 0) {

                                        //Insert JobPositionStrength
                                        string jobPositionStrengthSQL = @"INSERT INTO JobPositionStrength (JobPosition_ID, Strength_ID) 
                                        VALUES (@JobPosition_ID, @Strength_ID)";

                                        _rowCountList.Add(conn.Execute(jobPositionStrengthSQL, new {
                                            JobPosition_ID = jobPosition_ID,
                                            Strength_ID = strength_ID
                                        }, transaction: tran));
                                    }
                                }

                            }

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

        /**
         * Get all club entities from database with
         *  JobPositionsList
         *  ValuesList
         *  PreferenceList
         */ 
        public IEnumerable<Club> GetAll() {
            List<Club> clubs = new List<Club>();
            List<JobPosition> jobPositions = null;
            string sql =
                "SELECT c.*, jp.* " +
                "FROM club c " +
                "INNER JOIN jobposition jp ON jp.club_id = c.id ";

            using (var conn = Connection()) {
                using (var multi = conn.QueryMultiple(sql)) {
                    clubs = multi.Read<Club>().ToList();
                    jobPositions = multi.Read<JobPosition>().ToList();

                    foreach (Club club in clubs) {
                        club.JobPositionsList = jobPositions.Where(jp => jp.Club_ID == club.Id).ToList();
                    }
                }
            }

            return clubs;
        }

        /**
         * Get club by email with all lists
         */ 
        public Club GetByEmail(string email) {
            Club c = new Club();
            string sql = SqlSelectWithEmail(email);

            using (var connection = Connection()) {
                using (var multi = connection.QueryMultiple(sql, new { email })) {
                    c = multi.Read<Club>().First();
                    c.PreferenceList = multi.Read<string>().ToList();
                    c.ValuesList = multi.Read<string>().ToList();
                    c.TrainingHoursList = multi.Read<TrainingHours>().ToList();
                    c.CurrentSquadPlayersList = multi.Read<SquadPlayer>().ToList();
                    c.NextYearSquadPlayersList = multi.Read<SquadPlayer>().ToList();
                    c.JobPositionsList = multi.Read<JobPosition>().ToList();
                }
            }
            return c;
        }

        /**
         * Get club by id with all lists
         */ 
        public Club GetById(int id) {
            Club c = new Club();
            string sql = SqlSelectWithId(id);

            using (var connection = Connection()) {
                using (var multi = connection.QueryMultiple(sql, new { id })) {
                    c = multi.Read<Club>().First();
                    c.PreferenceList = multi.Read<string>().ToList();
                    c.ValuesList = multi.Read<string>().ToList();
                    c.TrainingHoursList = multi.Read<TrainingHours>().ToList();
                    c.CurrentSquadPlayersList = multi.Read<SquadPlayer>().ToList();
                    c.NextYearSquadPlayersList = multi.Read<SquadPlayer>().ToList();
                    c.JobPositionsList = multi.Read<JobPosition>().ToList();
                }
            }
            return c;
        }

        /**
         * Get a list of club based on search criteria
         * 3 possible combinations with 
         *  Jobpositions
         *  Values
         *  Preferences
         */ 
        public IEnumerable<Club> GetBySearchCriteria(string sqlStatement) {
            List<Club> clubs = new List<Club>();

            using (var conn = Connection()) {
                
            }

            return clubs;
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

        // Helping method to get club with all lists
        private string SqlSelectWithId(int id) {
            return 
                "SELECT c.*, ci.zipcode, ci.city FROM club c " +
                "INNER JOIN zipcodecity ci " +
                "ON c.zipcodecity_id = ci.id " +
                "WHERE c.id = " + id +

                "SELECT p.name FROM clubpreference cp " +
                "INNER JOIN preference p " +
                "ON p.id = cp.preference_id " +
                "WHERE cp.club_id = " + id +

                "SELECT v.name FROM clubvalue cv " +
                "INNER JOIN value v " +
                "ON v.id = cv.value_id " +
                "WHERE cv.club_id = " + id +

                "SELECT th.* FROM traininghours th " +
                "WHERE th.club_id = " + id +

                "SELECT csp.* FROM squadplayers csp " +
                "WHERE csp.club_id = " + id + " AND csp.season = 'Current year';" +

                "SELECT nsp.*, pos.positionName FROM squadplayers nsp " +
                "WHERE nsp.club_id = " + id + " AND nsp.season = 'Next year';" +

                "SELECT jp.* FROM jobposition jp " +
                "WHERE jp.club_id = " + id;
        }

        // Helping method to get club with all lists
        private string SqlSelectWithEmail(string email) {
            return 
                "SELECT c.*, ci.zipcode, ci.city FROM club c " +
                "INNER JOIN zipcodecity ci " +
                "ON c.zipcodecity_id = ci.id " +
                "WHERE c.email = " + email + ";" +

                "SELECT p.name, c.id FROM club c " +
                "INNER JOIN clubpreference cp " +
                "   ON cp.club_id = c.id " +
                "INNER JOIN preference p " +
                "   ON p.id = cp.preference_id " +
                "WHERE c.email = " + email +

                "SELECT v.name, c.id FROM club c " +
                "INNER JOIN clubvalue cv " +
                "   ON cv.club_id = c.id " +
                "INNER JOIN value v " +
                "   ON v.id = cv.value_id " +
                "WHERE c.email " + email +

                "SELECT th.*, c.id FROM club c " +
                "INNER JOIN traininghours th" +
                "   ON th.club_id = c.id " +
                "WHERE c.email = " + email +

                "SELECT csp.*, c.id FROM club c " +
                "INNER JOIN squadplayers csp " +
                "   ON csp.club_id = c.id" +
                "WHERE c.email = " + email + " AND csp.season = 'Current year'" +
                
                "SELECT nsp.*, c.id FROM club c" +
                "INNER JOIN squadplayers nsp " +
                "   ON nsp.club_id = c.id " +
                "WHERE c.email = " + email + " AND nsp.season = 'Next year';" +

                "SELECT jp.*, c.id FROM club c " +
                "INNER JOIN jobposition jp" +
                "   ON jp.club_id = c.id " +
                "WHERE c.email = " + email;
        }
    }
}
