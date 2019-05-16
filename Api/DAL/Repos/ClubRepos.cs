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
    public class ClubRepos : IRepository<Club>, IClub<Club> {

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
                                        IsAvailable, ZipcodeCity_ID, UserCredentials_ID) 
                                        VALUES (@Name, @Email, @League, @Country, @StreetAddress, @StreetNumber, @Trainer, @AssistantTrainer, @Physiotherapist, @AssistantPhysiotherapist, @Manager, @ValueDescription, @PreferenceDescription, 
                                        @IsAvailable, @ZipcodeCity_ID, @UserCredentials_ID);
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
                        entity.IsAvailable,
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
         * Get all clubs with jobposition list
         * Used to show as search for clubs result
         * when no criteria is selected
         */
        public IEnumerable<Club> GetAll() {
            List<Club> clubs = new List<Club>();
            string sql =
                "SELECT c.*, ci.zipcode, ci.city, jp.* FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN jobposition jp ON jp.club_id = c.id WHERE isAvailable = 1";

            using (var conn = Connection()) {
                Club result = null;
                conn.Query<Club, int, string, JobPosition, Club>(sql, (clubinside, zipcode, city, jobposition) => {
                    Club c = null;
                    if (!clubs.Any(cl => cl.Id == clubinside.Id)) {
                        c = BuildClub(clubinside, zipcode, city);
                        result = c;
                        clubs.Add(result);
                    }
                    else {
                        result = clubs.Single(cl => cl.Id == clubinside.Id);
                    }

                    if (jobposition != null) {
                        result.JobPositionsList.Add(jobposition);
                    }

                    return result;
                }, splitOn: "zipcode, city, id");
            }
            return clubs;
        }

        /**
         * Get clubs with jobposition, preference and value
         */ 
        public IEnumerable<Club> GetBySearchCriteriaWithJobPositionPreferenceValue(string sqlWhereStatementValue, 
                                                                                   string sqlWhereStatementPreference, 
                                                                                   string sqlWhereStatementJobposition) {
            List<Club> clubs = new List<Club>();
            string sql = 
                "SELECT c.*, ci.zipcode, ci.city, v.name as value, null as preference, " +
                "null as id, null as league, null as preferredHand, null as height, null as minAge, " +
                "null as maxAge, null as season, null as contractStatus, null as position, null as club_id FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN clubvalue cv ON cv.club_id = c.id " +
                "INNER JOIN value v ON cv.value_ID = v.id WHERE " + sqlWhereStatementValue +
                " UNION ALL " +
                "SELECT c.*, ci.zipcode, ci.city, null as value, p.name as preference, " +
                "null as id, null as league, null as preferredHand, null as height, null as minAge, " +
                "null as maxAge, null as season, null as contractStatus, null as position, null as club_id FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN clubpreference cp ON cp.club_id = c.id " +
                "INNER JOIN preference p ON cp.preference_id = p.id WHERE " + sqlWhereStatementPreference +
                " UNION ALL" +
                "SELECT c.*, ci.zipcode, ci.city, null as value, null as preference, " +
                "jp.id as id, jp.league as league, jp.preferredHand as preferredHand, jp.height as height, jp.minAge as minAge, " +
                "jp.maxAge as maxAge, jp.season as season, jp.contractStatus as contractStatus, jp.position as position, jp.club_id as club_id FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN jobposition jp ON jp.club_id = c.id WHERE " + sqlWhereStatementJobposition;

            using (var conn = Connection()) {
                Club result = null;
                conn.Query<Club, int, string, JobPosition, string, string, Club>(sql, 
                    (clubinside, zipcode, city, jobposition, preference, value) => {
                        Club c = null;
                        if (!clubs.Any(cl => cl.Id == clubinside.Id)) {
                            c = BuildClub(clubinside, zipcode, city);
                            result = c;
                            clubs.Add(result);
                        }
                        else {
                            result = clubs.Single(cl => cl.Id == clubinside.Id);
                        }

                        if(jobposition != null) {
                            result.JobPositionsList.Add(jobposition);
                        }

                        if(preference != null) {
                            result.PreferenceList.Add(preference);
                        }

                        if(value != null) {
                            result.ValuesList.Add(value);
                        }

                        return result;
                    }, splitOn: "zipcode, city, id, preference, value");
            }

            return clubs;
        }

        /**
         * Get clubs with jobposition and preference
         */ 
        public IEnumerable<Club> GetBySearchCriteriaWithJobPoisitionPreference(string sqlWhereStatementJobposition,
                                                                               string sqlWhereStatementPreference) {
            List<Club> clubs = new List<Club>();
            string sql =
                "SELECT c.*, ci.zipcode, ci.city, null as preference, " +
                "jp.id as id, jp.league as league, jp.preferredHand as preferredHand, jp.height as height, jp.minAge as minAge,  " +
                "jp.maxAge as maxAge, jp.season as season, jp.contractStatus as contractStatus, jp.position as position, jp.club_id as club_id FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id WHERE " + sqlWhereStatementJobposition +
                "INNER JOIN jobposition jp ON jp.club_id = c.id " +
                " UNION ALL " +
                "SELECT c.*, ci.zipcode, ci.city, p.name as preference, " +
                "null as id, null as league, null as preferredHand, null as height, null as minAge, " +
                "null as maxAge, null as season, null as contractStatus, null as position, null as club_id FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " + 
                "INNER JOIN clubpreference cp ON cp.club_id = c.id " +
                "INNER JOIN preference p ON cp.preference_ID = p.id WHERE " + sqlWhereStatementPreference;

            using (var conn = Connection()) {
                Club result = null;
                conn.Query<Club, int, string, JobPosition, string, Club>(sql,
                    (clubinside, zipcode, city, jobposition, preference) => {
                        Club c = null;
                        if (!clubs.Any(cl => cl.Id == clubinside.Id)) {
                            c = BuildClub(clubinside, zipcode, city);
                            result = c;
                            clubs.Add(result);
                        }
                        else {
                            result = clubs.Single(cl => cl.Id == clubinside.Id);
                        }

                        if (jobposition != null) {
                            result.JobPositionsList.Add(jobposition);
                        }

                        if (preference != null) {
                            result.PreferenceList.Add(preference);
                        }

                        return result;
                    }, splitOn: "zipcode, city, id, preference");
            }

            return clubs;
        }

        /**
         * Get clubs with jobposition and value
         */ 
        public IEnumerable<Club> GetBySearchCriteriaWithJobPoisitionValue(string sqlWhereStatementJobposition,
                                                                          string sqlWhereStatementValue) {
            List<Club> clubs = new List<Club>();
            string sql =
                "SELECT c.*, ci.zipcode, ci.city, null as value, " +
                "jp.id as id, jp.league as league, jp.preferredHand as preferredHand, jp.height as height, jp.minAge as minAge, " +
                "jp.maxAge as maxAge, jp.season as season, jp.contractStatus as contractStatus, jp.position as position, jp.club_id as club_id FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN jobposition jp ON jp.club_id = c.id WHERE " + sqlWhereStatementJobposition +
                " UNION ALL " +
                "SELECT c.*, ci.zipcode, ci.city, v.name as value, " +
                "null as id, null as league, null as preferredHand, null as height, null as minAge, " +
                "null as maxAge, null as season, null as contractStatus, null as position, null as club_id FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN clubvalue cv ON cv.club_id = c.id " +
                "INNER JOIN value v ON cv.value_ID = v.id WHERE " + sqlWhereStatementValue;

            using (var conn = Connection()) {
                Club result = null;
                conn.Query<Club, int, string, JobPosition, string, Club>(sql,
                    (clubinside, zipcode, city, jobposition, value) => {
                        Club c = null;
                        if (!clubs.Any(cl => cl.Id == clubinside.Id)) {
                            c = BuildClub(clubinside, zipcode, city);
                            result = c;
                            clubs.Add(result);
                        }
                        else {
                            result = clubs.Single(cl => cl.Id == clubinside.Id);
                        }

                        if (jobposition != null) {
                            result.JobPositionsList.Add(jobposition);
                        }

                        if (value != null) {
                            result.ValuesList.Add(value);
                        }

                        return result;
                    }, splitOn: "zipcode, city, id, value");
            }

            return clubs;
        }

        /**
         * Get clubs with preference and value
         */ 
        public IEnumerable<Club> GetBySearchCriteriaWithPreferenceValue(string sqlWhereStatementPreference,
                                                                        string sqlWhereStatementValue) {
            List<Club> clubs = new List<Club>();
            string sql =
                "SELECT c.*, ci.zipcode, ci.city, v.name as value, null as preference FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN clubvalue cv ON cv.club_id = c.id " +
                "INNER JOIN value v ON cv.value_ID = v.id WHERE " + sqlWhereStatementValue +
                " UNION ALL " +
                "SELECT c.*, ci.zipcode, ci.city, null as value, p.name as preference FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN clubpreference cp ON cp.club_id = c.id " +
                "INNER JOIN preference p ON cp.preference_id = p.id WHERE " + sqlWhereStatementPreference;

            using (var conn = Connection()) {
                Club result = null;
                conn.Query<Club, int, string, string, string, Club>(sql,
                    (clubinside, zipcode, city, preference, value) => {
                        Club c = null;
                        if (!clubs.Any(cl => cl.Id == clubinside.Id)) {
                            c = BuildClub(clubinside, zipcode, city);
                            result = c;
                            clubs.Add(result);
                        }
                        else {
                            result = clubs.Single(cl => cl.Id == clubinside.Id);
                        }

                        if (preference != null) {
                            result.PreferenceList.Add(preference);
                        }

                        if (value != null) {
                            result.ValuesList.Add(value);
                        }

                        return result;
                    }, splitOn: "zipcode, city, preference, value");
            }

            return clubs;
        }

        /**
         * Get clubs with job position
         */ 
        public IEnumerable<Club> GetBySearchCriteriaWithJobPosition(string sqlWhereStatementJobposition) {
            List<Club> clubs = new List<Club>();
            string sql =
                "SELECT c.*, ci.zipcode, ci.city, jp.* FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN jobposition jp ON jp.club_id = c.id WHERE " + sqlWhereStatementJobposition;

            using (var conn = Connection()) {
                Club result = null;
                conn.Query<Club, int, string, JobPosition, Club>(sql, (clubinside, zipcode, city, jobposition) => {
                    Club c = null;
                    if (!clubs.Any(cl => cl.Id == clubinside.Id)) {
                        c = BuildClub(clubinside, zipcode, city);
                        result = c;
                        clubs.Add(result);
                    }
                    else {
                        result = clubs.Single(cl => cl.Id == clubinside.Id);
                    }

                    if (jobposition != null) {
                        result.JobPositionsList.Add(jobposition);
                    }

                    return result;
                }, splitOn: "zipcode, city, id");
            }
            return clubs;
        }

        /**
         * Get clubs with preference
         */ 
        public IEnumerable<Club> GetBySearchCriteriaWithPreference(string sqlWhereStatementPreference) {
            List<Club> clubs = new List<Club>();
            string sql =
                "SELECT c.*, ci.zipcode, ci.city, p.name as preference FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN clubpreference cp ON cp.club_id = c.id " +
                "INNER JOIN preference p ON cp.preference_id = p.id WHERE " + sqlWhereStatementPreference;

            using (var conn = Connection()) {
                Club result = null;
                conn.Query<Club, int, string, string, Club>(sql, (clubinside, zipcode, city, preference) => {
                    Club c = null;
                    if (!clubs.Any(cl => cl.Id == clubinside.Id)) {
                        c = BuildClub(clubinside, zipcode, city);
                        result = c;
                        clubs.Add(result);
                    }
                    else {
                        result = clubs.Single(cl => cl.Id == clubinside.Id);
                    }

                    if (preference != null) {
                        result.PreferenceList.Add(preference);
                    }

                    return result;
                }, splitOn: "zipcode, city, preference");
            }
            return clubs;
        }

        /**
         * Get clubs with value
         */ 
        public IEnumerable<Club> GetBySearchCriteriaWithValue(string sqlWhereStatementValue) {
            List<Club> clubs = new List<Club>();
            string sql =
                "SELECT c.*, ci.zipcode, ci.city, v.name as value FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN clubvalue cv ON cv.club_id = c.id " +
                "INNER JOIN value v ON cv.value_ID = v.id WHERE " + sqlWhereStatementValue;

            using (var conn = Connection()) {
                Club result = null;
                conn.Query<Club, int, string, string, Club>(sql, (clubinside, zipcode, city, value) => {
                    Club c = null;
                    if (!clubs.Any(cl => cl.Id == clubinside.Id)) {
                        c = BuildClub(clubinside, zipcode, city);
                        result = c;
                        clubs.Add(result);
                    }
                    else {
                        result = clubs.Single(cl => cl.Id == clubinside.Id);
                    }

                    if (value != null) {
                        result.ValuesList.Add(value);
                    }

                    return result;
                }, splitOn: "zipcode, city, value");
            }
            return clubs;
        }

        public UserCredentials getCredentialsByEmail(string email) {
            throw new NotImplementedException();
        }

        public Club Update(Club entity) {

            Club c = new Club();
            for (int i = 0; i < 5; i++) {

                List<int> _rowCountList = new List<int>();

                using (var conn = Connection()) {
                    

                    using (IDbTransaction tran = conn.BeginTransaction()) {
                        //try {
                        
                            //Return row ID
                            string rowIDSQL = @"Select rowID from Club where email = @Email";
                            byte[] row_ID = conn.Query<byte[]>(rowIDSQL, new { Email = entity.Email }, transaction: tran).Single();

                            //Update club
                            string updateClubSQL = @"Update Club Set Name = @Name, League = @League, Country = @Country, StreetAddress = @StreetAddress, StreetNumber = @StreetNumber, Trainer = @Trainer,
                                                                    AssistantTrainer = @AssistantTrainer, Physiotherapist = @Physiotherapist, AssistantPhysiotherapist = @AssistantPhysiotherapist, Manager = @Manager,
                                                                    ValueDescription = @ValueDescription, PreferenceDescription = @PreferenceDescription, ImagePath = @ImagePath
                                                                 Where Email = @Email AND RowID = @RowID";


                            _rowCountList.Add(conn.Execute(updateClubSQL, new {
                                Name = entity.Name,
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
                                entity.ImagePath,
                                Email = entity.Email,
                                RowID = row_ID
                            }, transaction: tran));

                           
                            //Facility image
                            if (entity.FacilityImagesList.Count > 0) {

                                //Return club ID
                                string clubIDSQL = @"Select id from Club where email = @Email";
                                int club_ID = conn.Query<int>(clubIDSQL, new { Email = entity.Email }, transaction: tran).FirstOrDefault();

                                foreach (string imagePath in entity.FacilityImagesList) {
                                
                                    if(club_ID != 0) {

                                        //Check if imagePath already exist in DB
                                        string facilityImageIDSQL = @"Select id from FacilityImage where imagePath = @ImagePath";
                                        int id = conn.Query<int>(facilityImageIDSQL, new { ImagePath = imagePath }, transaction: tran).FirstOrDefault();
                                        
                                        if(id == 0) {
                                            //Insert facility image
                                            string facilityImageSQL = @"INSERT INTO FacilityImage (ImagePath, Club_ID) 
                                            VALUES (@ImagePath, @Club_ID)";

                                            _rowCountList.Add(conn.Execute(facilityImageSQL, new {
                                                ImagePath = imagePath,
                                                Club_ID = club_ID
                                            }, transaction: tran));
                                        }
                                     
                                    }
                                       

                                }
                            }

                            //Check for 0 in rowcount list
                            if (_rowCountList.Contains(0)) {
                                c.ErrorMessage = "The club was not updated";
                                tran.Rollback();
                            }
                            else {
                                c.ErrorMessage = "";
                                tran.Commit();
                                break;
                            }
                        //}
                        //catch (SqlException e) {

                        //    tran.Rollback();
                        //    c.ErrorMessage = ErrorHandling.Exception(e);
                        //}
                    }
                }
            }
            return c;
        }

        // Helping method to get club with all lists by club id
        private string SqlSelectWithId(int id) {
            return 
                "SELECT c.*, ci.zipcode, ci.city FROM club c INNER JOIN zipcodecity ci " +
                "ON c.zipcodecity_id = ci.id WHERE c.id = " + id +
                "SELECT p.name FROM clubpreference cp INNER JOIN preference p " +
                "ON p.id = cp.preference_id WHERE cp.club_id = " + id +
                "SELECT v.name FROM clubvalue cv INNER JOIN value v " +
                "ON v.id = cv.value_id WHERE cv.club_id = " + id +
                "SELECT th.* FROM traininghours th WHERE th.club_id = " + id +
                "SELECT csp.* FROM squadplayers csp WHERE csp.club_id = " + id + " AND csp.season = 'Current year';" +
                "SELECT nsp.* FROM squadplayers nsp WHERE nsp.club_id = " + id + " AND nsp.season = 'Next year';" +
                "SELECT jp.* FROM jobposition jp WHERE jp.club_id = " + id;
        }

        // Helping method to get club with all lists by club email
        private string SqlSelectWithEmail(string email) {
            return 
                "SELECT c.*, ci.zipcode, ci.city FROM club c INNER JOIN zipcodecity ci " +
                "ON c.zipcodecity_id = ci.id WHERE c.email = '" + email + "'; " +
                "SELECT p.name, c.id FROM club c INNER JOIN clubpreference cp " +
                "ON cp.club_id = c.id INNER JOIN preference p ON p.id = cp.preference_id " +
                "WHERE c.email = '" + email + "'; " +
                "SELECT v.name, c.id FROM club c INNER JOIN clubvalue cv ON cv.club_id = c.id " +
                "INNER JOIN value v ON v.id = cv.value_id WHERE c.email = '" + email + "';" +
                "SELECT th.*, c.id FROM club c INNER JOIN traininghours th " +
                "ON th.club_id = c.id WHERE c.email = '" + email + "'; " +
                "SELECT csp.*, c.id FROM club c INNER JOIN squadplayers csp ON csp.club_id = c.id " +
                "WHERE c.email = '" + email + "' AND csp.season = 'Current year'; " +
                "SELECT nsp.*, c.id FROM club c INNER JOIN squadplayers nsp ON nsp.club_id = c.id " +
                "WHERE c.email = '" + email + "' AND nsp.season = 'Next year'; " +
                "SELECT jp.*, c.id FROM club c INNER JOIN jobposition jp " +
                "ON jp.club_id = c.id WHERE c.email = '" + email + "';";
        }

        // Helping method used to build club values
        private Club BuildClub(Club clubinside, int zipcode, string city) {
            return new Club {
                Id = clubinside.Id,
                Name = clubinside.Name,
                Email = clubinside.Email,
                League = clubinside.League,
                Country = clubinside.Country,
                StreetAddress = clubinside.StreetAddress,
                StreetNumber = clubinside.StreetNumber,
                Trainer = clubinside.Trainer,
                AssistantTrainer = clubinside.AssistantTrainer,
                Physiotherapist = clubinside.Physiotherapist,
                AssistantPhysiotherapist = clubinside.AssistantPhysiotherapist,
                Manager = clubinside.Manager,
                ValueDescription = clubinside.ValueDescription,
                PreferenceDescription = clubinside.PreferenceDescription,
                ImagePath = clubinside.ImagePath,
                IsAvailable = clubinside.IsAvailable,
                Zipcode = zipcode,
                City = city
            };
        }
    }
}
