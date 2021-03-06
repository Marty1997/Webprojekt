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
    public class ClubRepos : IClubRepository<Club> {

        public Func<IDbConnection> Connection { get; set; }

        public bool Create(Club entity) {

            List<int> _rowCountList = new List<int>();

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Set imagePath to default image
                        string imagePath = "https:\\localhost:44310\\Resources\\Files\\club-icon.png";

                        //Return zipcodeCity ID
                        string zipcodeCitySQL = @"INSERT INTO ZipcodeCity (Zipcode, City) VALUES (@Zipcode, @City);
                                        SELECT CAST(SCOPE_IDENTITY() as int)";
                        int zipcodeCity_ID = conn.Query<int>(zipcodeCitySQL, new { Zipcode = entity.Zipcode, City = entity.City }, transaction: tran).Single();

                        //Insert Club
                        string clubSQL = @"INSERT INTO Club (Name, Email, League, Country, StreetAddress, StreetNumber, Trainer, AssistantTrainer, Physiotherapist, AssistantPhysiotherapist, Manager, ValueDescription, PreferenceDescription, 
                                        ImagePath, IsAvailable, ZipcodeCity_ID) 
                                        VALUES (@Name, @Email, @League, @Country, @StreetAddress, @StreetNumber, @Trainer, @AssistantTrainer, @Physiotherapist, @AssistantPhysiotherapist, @Manager, @ValueDescription, @PreferenceDescription, 
                                        @ImagePath, @IsAvailable, @ZipcodeCity_ID);
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
                            ImagePath = imagePath,
                            ZipcodeCity_ID = zipcodeCity_ID,
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
                            tran.Rollback();
                            return false;
                        }
                        else {
                            tran.Commit();
                            return true;
                        }
                    }
                    catch (SqlException) {
                        tran.Rollback();
                        return false;
                    }
                }
            }
        }

        public bool Delete(int id) {

            bool res = false;

            int rowCount = 0;

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Delete club
                        string deleteClubSQL = @"Delete From Club Where ID = @ID";

                        rowCount = conn.Execute(deleteClubSQL, new {
                            ID = id
                        }, transaction: tran);

                        //Check for 0 in rowcount
                        if (rowCount == 0) {
                            tran.Rollback();
                        }
                        else {
                            tran.Commit();
                            res = true;
                        }
                    }
                    catch (SqlException) {
                        tran.Rollback();
                    }
                }
            }
            return res;
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
                    c.FacilityImagesList = multi.Read<string>().ToList();
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
                    c.FacilityImagesList = multi.Read<string>().ToList();
                }
            }
            return c;
        }

        /**
         * Get all clubs with jobposition list
         * Used to show as search for clubs result
         * when no criteria is selected
         */
        public IEnumerable<Club> GetAll(string seasonSql) { 
            List<Club> clubs = new List<Club>();
            string sql =
                "SELECT c.*, ci.zipcode, ci.city, jp.* FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN jobposition jp ON jp.club_id = c.id WHERE c.isAvailable = 1 " + seasonSql;

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
        public IEnumerable<Club> GetBySearchCriteriaWithJobPositionPreferenceValue(string sqlWhereStatementPreference,
                                                                                   string sqlWhereStatementValue,
                                                                                   string sqlSeason) {
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
                " UNION ALL " +
                "SELECT c.*, ci.zipcode, ci.city, null as value, null as preference, " +
                "jp.id as id, jp.league as league, jp.preferredHand as preferredHand, jp.height as height, jp.minAge as minAge, " +
                "jp.maxAge as maxAge, jp.season as season, jp.contractStatus as contractStatus, jp.position as position, jp.club_id as club_id FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN jobposition jp ON jp.club_id = c.id WHERE c.isAvailable = 1 " + sqlSeason;

            using (var conn = Connection()) {
                Club result = null;
                conn.Query<Club, int, string, string, string, JobPosition, Club>(sql,
                    (clubinside, zipcode, city, value, preference, jobPosition) => {
                        Club c = null;
                        if (!clubs.Any(cl => cl.Id == clubinside.Id)) {
                            c = BuildClub(clubinside, zipcode, city);
                            result = c;
                            clubs.Add(result);
                        }
                        else {
                            result = clubs.Single(cl => cl.Id == clubinside.Id);
                        }

                        if (jobPosition != null) {
                            result.JobPositionsList.Add(jobPosition);
                        }

                        if (preference != null) {
                            result.PreferenceList.Add(preference);
                        }

                        if (value != null) {
                            result.ValuesList.Add(value);
                        }

                        return result;
                    }, splitOn: "zipcode, city, value, preference, id");
            }

            return clubs;
        }

        /**
         * Get clubs with jobposition and preference
         */
        public IEnumerable<Club> GetBySearchCriteriaWithJobPoisitionPreference(string sqlWhereStatementPreference, string sqlSeason) {
            List<Club> clubs = new List<Club>();
            string sql =
                "SELECT c.*, ci.zipcode, ci.city, null as preference, " +
                "jp.id as id, jp.league as league, jp.preferredHand as preferredHand, jp.height as height, jp.minAge as minAge,  " +
                "jp.maxAge as maxAge, jp.season as season, jp.contractStatus as contractStatus, jp.position as position, jp.club_id as club_id FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN jobposition jp ON jp.club_id = c.id WHERE c.isAvailable = 1 " + sqlSeason + 
                " UNION ALL " +
                "SELECT c.*, ci.zipcode, ci.city, p.name as preference, " +
                "null as id, null as league, null as preferredHand, null as height, null as minAge, " +
                "null as maxAge, null as season, null as contractStatus, null as position, null as club_id FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN clubpreference cp ON cp.club_id = c.id " +
                "INNER JOIN preference p ON cp.preference_ID = p.id WHERE " + sqlWhereStatementPreference;

            using (var conn = Connection()) {
                Club result = null;
                conn.Query<Club, int, string, string, JobPosition, Club>(sql,
                    (clubinside, zipcode, city, preference, jobposition) => {
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
                    }, splitOn: "zipcode, city, preference, id ");
            }

            return clubs;
        }

        /**
         * Get clubs with jobposition and value
         */
        public IEnumerable<Club> GetBySearchCriteriaWithJobPoisitionValue(string sqlWhereStatementValue, string sqlSeason) {
            List<Club> clubs = new List<Club>();
            string sql =
                "SELECT c.*, ci.zipcode, ci.city, null as value, " +
                "jp.id as id, jp.league as league, jp.preferredHand as preferredHand, jp.height as height, jp.minAge as minAge, " +
                "jp.maxAge as maxAge, jp.season as season, jp.contractStatus as contractStatus, jp.position as position, jp.club_id as club_id FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN jobposition jp ON jp.club_id = c.id WHERE c.isAvailable = 1 " + sqlSeason +
                " UNION ALL " +
                "SELECT c.*, ci.zipcode, ci.city, v.name as value, " +
                "null as id, null as league, null as preferredHand, null as height, null as minAge, " +
                "null as maxAge, null as season, null as contractStatus, null as position, null as club_id FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN clubvalue cv ON cv.club_id = c.id " +
                "INNER JOIN value v ON cv.value_ID = v.id WHERE " + sqlWhereStatementValue;

            using (var conn = Connection()) {
                Club result = null;
                conn.Query<Club, int, string, string, JobPosition, Club >(sql,
                    (clubinside, zipcode, city, value, jobposition) => {
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
                    }, splitOn: "zipcode, city, value, id");
            }

            return clubs;
        }
        /**
         * Get clubs with job position
         */
        public IEnumerable<Club> GetBySearchCriteriaWithJobPosition(string sqlSeason) {
            List<Club> clubs = new List<Club>();
            string sql =
                "SELECT c.*, ci.zipcode, ci.city, jp.* FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN jobposition jp ON jp.club_id = c.id WHERE c.isAvailable = 1 " + sqlSeason;

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

        public bool UpdateInfo(Club entity) {

            bool res = false;

            List<int> _rowCountList = new List<int>();

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {
                        
                        //Update zipcodeCity
                        string updateZipcodeCitySQL = @"Update ZipcodeCity Set Zipcode = @Zipcode, City = @City
                                                                        Where ID = @ID";

                        _rowCountList.Add(conn.Execute(updateZipcodeCitySQL, new {
                            entity.Zipcode,
                            entity.City,
                            ID = entity.ZipcodeCity_ID
                        }, transaction: tran));

                        //Update club
                        string updateClubSQL = @"Update Club Set Name = @Name, League = @League, Country = @Country, StreetAddress = @StreetAddress, 
                                                                    StreetNumber = @StreetNumber, isAvailable = @isAvailable, ZipcodeCity_ID = @ZipcodeCity_ID 
                                                                        Where ID = @ID";

                        _rowCountList.Add(conn.Execute(updateClubSQL, new {
                            entity.Name,
                            entity.League,
                            entity.Country,
                            entity.StreetAddress,
                            entity.StreetNumber,
                            entity.IsAvailable,
                            entity.ZipcodeCity_ID,
                            entity.Id
                        }, transaction: tran));
                        
                        if (_rowCountList.Contains(0)) {
                            tran.Rollback();
                        }
                        else {
                            tran.Commit();
                            res = true;
                        }
                    }
                    catch (SqlException) {
                        tran.Rollback();
                    }
                }
            }
            return res;
        }

        public bool UpdateTrainingHours(TrainingHours entity, int club_ID) {

            bool res = false;

            int rowCount = 0;

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Create training hours if not existing
                        string trainingHoursIDSQL = @"Select id from TrainingHours where Name = @Name AND club_ID = @club_ID";
                        int trainingHours_ID = conn.Query<int>(trainingHoursIDSQL, new { entity.Name, club_ID }, transaction: tran).FirstOrDefault();

                        if (trainingHours_ID == 0) {

                            //Insert Training hours
                            string trainingHoursSQL = @"INSERT INTO TrainingHours (Name, Mon, Tue, Wed, Thu, Fri, Sat, Sun, Club_ID) 
                                        VALUES (@Name, @Mon, @Tue, @Wed, @Thu, @Fri, @Sat, @Sun, @Club_ID)";

                            rowCount = conn.Execute(trainingHoursSQL, new {
                                entity.Name,
                                entity.Mon,
                                entity.Tue,
                                entity.Wed,
                                entity.Thu,
                                entity.Fri,
                                entity.Sat,
                                entity.Sun,
                                Club_ID = club_ID
                            }, transaction: tran);

                        }
                        //Update if exists
                        else {

                            string trainingHoursSQL = @"Update TrainingHours Set Name = @Name, Mon = @Mon, Tue = @Tue, Wed = @Wed, Thu = @Thu, Fri = @Fri, Sat = @Sat, Sun = @Sun
                                                                 Where ID = @ID AND club_ID = @club_ID";

                            rowCount = conn.Execute(trainingHoursSQL, new {
                                entity.Name,
                                entity.Mon,
                                entity.Tue,
                                entity.Wed,
                                entity.Thu,
                                entity.Fri,
                                entity.Sat,
                                entity.Sun,
                                ID = trainingHours_ID,
                                club_ID
                            }, transaction: tran);
                        }
                        
                        if (rowCount == 0) {
                            tran.Rollback();
                        }
                        else {
                            tran.Commit();
                            res = true;
                        }
                    }
                    catch (SqlException) {
                        tran.Rollback();
                    }
                }
            }
            return res;
        }

        public bool AddSquadPlayer(SquadPlayer entity, int club_ID) {

            bool res = false;

            int rowCount = 0;
            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Insert Squad Player
                        string squadPlayerSQL = @"INSERT INTO SquadPlayers (ShirtNumber, Season, Name, Position, Club_ID) 
                                        VALUES (@ShirtNumber, @Season, @Name, @Position, @Club_ID)";

                        rowCount = conn.Execute(squadPlayerSQL, new {
                            ShirtNumber = entity.ShirtNumber,
                            Season = entity.Season,
                            Name = entity.Name,
                            Position = entity.Position,
                            Club_ID = club_ID
                        }, transaction: tran);

                        if (rowCount == 0) {
                            tran.Rollback();
                        }
                        else {
                            tran.Commit();
                            res = true;
                        }
                    }
                    catch (SqlException) {
                        tran.Rollback();
                    }
                }
            }
            return res;
        }

        public bool AddOpenPosition(JobPosition entity, int club_ID) {

            bool res = false;

            List<int> _rowCountList = new List<int>();

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        int jobPosition_ID = 0;

                        //Insert JobPosition
                        string jobPositionSQL = @"INSERT INTO JobPosition (League, PreferredHand, Height, MinAge, MaxAge, Season, ContractStatus, Position, Club_ID) 
                                        VALUES (@League, @PreferredHand, @Height, @MinAge, @MaxAge, @Season, @ContractStatus, @Position, @Club_ID);
                                            SELECT CAST(SCOPE_IDENTITY() as int)";

                        jobPosition_ID = conn.Query<int>(jobPositionSQL, new {
                            League = entity.League,
                            PreferredHand = entity.PreferredHand,
                            Height = entity.Height,
                            MinAge = entity.MinAge,
                            MaxAge = entity.MaxAge,
                            Season = entity.Season,
                            ContractStatus = entity.ContractStatus,
                            Position = entity.Position,
                            Club_ID = club_ID
                        }, transaction: tran).Single();

                        if (entity.StrengthsList.Count > 0) {
                            foreach (string strength in entity.StrengthsList) {

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

                        if (_rowCountList.Contains(0) && jobPosition_ID == 0) {
                            tran.Rollback();
                        }
                        else {
                            tran.Commit();
                            res = true;
                        }
                    }
                    catch (SqlException) {
                        tran.Rollback();
                    }
                }
            }
            return res;
        }

        public bool UpdateStaff(Club entity) {

            bool res = false;

            int rowCount = 0;
            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Update club staff
                        string updateClubSQL = @"Update Club Set Trainer = @Trainer, AssistantTrainer = @AssistantTrainer, Physiotherapist = @Physiotherapist, 
                                                            AssistantPhysiotherapist = @AssistantPhysiotherapist, Manager = @Manager
                                                                 Where ID = @ID";

                        rowCount = conn.Execute(updateClubSQL, new {
                            entity.Trainer,
                            entity.AssistantTrainer,
                            entity.Physiotherapist,
                            entity.AssistantPhysiotherapist,
                            entity.Manager,
                            entity.Id,
                        }, transaction: tran);


                        if (rowCount == 0) {
                            tran.Rollback();
                        }
                        else {
                            tran.Commit();
                            res = true;
                        }
                    }
                    catch (SqlException) {
                        tran.Rollback();
                    }
                }
            }
            return res;
        }

        public bool UpdateValuesAndPreferences(Club entity) {

            bool res = false;

            List<int> _rowCountList = new List<int>();

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Update club
                        string updateClubSQL = @"Update Club Set ValueDescription = @ValueDescription, PreferenceDescription = @PreferenceDescription
                                                                 Where ID = @ID";


                        _rowCountList.Add(conn.Execute(updateClubSQL, new {
                            entity.ValueDescription,
                            entity.PreferenceDescription,
                            entity.Id
                        }, transaction: tran));

                        //Values
                        if (entity.ValuesList.Count > 0) {

                            foreach (string value in entity.ValuesList) {

                                //Return value ID
                                string valueSQL = @"Select id from Value where name = @Name";
                                int value_ID = conn.Query<int>(valueSQL, new { Name = value }, transaction: tran).FirstOrDefault();

                                if (value_ID != 0) {

                                    //Insert ClubValue
                                    string clubValueSQL = @"INSERT INTO ClubValue (Club_ID, Value_ID) 
                                        VALUES (@Club_ID, @Value_ID)";

                                    _rowCountList.Add(conn.Execute(clubValueSQL, new {
                                        Club_ID = entity.Id,
                                        Value_ID = value_ID
                                    }, transaction: tran));
                                }
                            }
                        }

                        //Preference
                        if (entity.PreferenceList.Count > 0) {

                            foreach (string preference in entity.PreferenceList) {

                                //Return preference ID
                                string preferenceSQL = @"Select id from Preference where name = @Name";
                                int preference_ID = conn.Query<int>(preferenceSQL, new { Name = preference }, transaction: tran).FirstOrDefault();

                                if (preference_ID != 0) {

                                    //Update ClubPreference
                                    string clubPreferenceSQL = @"INSERT INTO ClubPreference (Club_ID, Preference_ID)
                                                                 VALUES (@Club_ID, @Preference_ID)";

                                    _rowCountList.Add(conn.Execute(clubPreferenceSQL, new {
                                        Club_ID = entity.Id,
                                        Preference_ID = preference_ID
                                    }, transaction: tran));
                                }
                            }
                        }

                        //Check for 0 in rowcount list
                        if (_rowCountList.Contains(0)) {
                            tran.Rollback();
                        }
                        else {
                            tran.Commit();
                            res = true;
                        }
                    }
                    catch (SqlException) {

                        tran.Rollback();
                    }
                }
            }
            return res;
        }
   
        public bool UpdateProfile(Club entity) {

            bool res = false;

            int rowCount = 0;

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Update club
                        string updateClubSQL = @"Update Club Set ImagePath = @ImagePath Where ID = @ID";

                        rowCount = conn.Execute(updateClubSQL, new {
                            entity.ImagePath,
                            entity.Id
                        }, transaction: tran);

                        //Check for 0 in rowcount list
                        if (rowCount == 0) {
                            tran.Rollback();
                        }
                        else {
                            tran.Commit();
                            res = true;
                        }
                    }
                    catch (SqlException) {

                        tran.Rollback();
                    }
                }
            }
            return res;
        }

        public bool UpdateFacility(Club entity) {

            bool res = false;

            List<int> _rowCountList = new List<int>();

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Facility image
                        if (entity.FacilityImagesList.Count > 0) {

                            foreach (string imagePath in entity.FacilityImagesList) {

                                if (entity.Id != 0) {

                                    //Check if imagePath already exist in DB
                                    string facilityImageIDSQL = @"Select id from FacilityImage where imagePath = @ImagePath";
                                    int id = conn.Query<int>(facilityImageIDSQL, new { ImagePath = imagePath }, transaction: tran).FirstOrDefault();

                                    if (id == 0) {
                                        //Insert facility image
                                        string facilityImageSQL = @"INSERT INTO FacilityImage (ImagePath, Club_ID) 
                                            VALUES (@ImagePath, @Club_ID)";

                                        _rowCountList.Add(conn.Execute(facilityImageSQL, new {
                                            ImagePath = imagePath,
                                            Club_ID = entity.Id
                                        }, transaction: tran));
                                    }
                                }
                            }
                        }

                        //Check for 0 in rowcount list
                        if (_rowCountList.Contains(0)) {
                            tran.Rollback();
                        }
                        else {
                            tran.Commit();
                            res = true;
                        }
                    }
                    catch (SqlException) {
                        tran.Rollback();
                    }
                }
            }
            return res;
        }
        
        public bool DeleteJobPosition(int jobPosition_ID, int club_ID) {

            bool res = false;

            int rowCount = 0;

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {
                        
                        //Delete jobPosition
                        string deleteJobPositionSQL = @"Delete From JobPosition Where ID = @ID AND club_ID = @Club_ID";

                        rowCount = conn.Execute(deleteJobPositionSQL, new {
                            ID = jobPosition_ID,
                            club_ID
                        }, transaction: tran);

                        //Check for 0 in rowcount
                        if (rowCount == 0) {
                            tran.Rollback();
                        }
                        else {
                            tran.Commit();
                            res = true;
                        }
                    }
                    catch (SqlException) {
                        tran.Rollback();
                    }
                }
            }
            return res;
        }

        public bool DeleteSquadPlayer(int squadPlayer_ID, int club_ID) {

            bool res = false;

            int rowCount = 0;

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Delete squadPlayer
                        string deleteSquadPlayerSQL = @"Delete From SquadPlayers Where ID = @ID AND club_ID = @Club_ID";

                        rowCount = conn.Execute(deleteSquadPlayerSQL, new {
                            ID = squadPlayer_ID,
                            club_ID
                        }, transaction: tran);

                        //Check for 0 in rowcount
                        if (rowCount == 0) {
                            tran.Rollback();
                        }
                        else {
                            tran.Commit();
                            res = true;
                        }
                    }
                    catch (SqlException) {
                        tran.Rollback();
                    }
                }
            }
            return res;
        }

        public bool DeleteTrainingHours(string name, int club_ID) {

            bool res = false;

            int rowCount = 0;

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Delete trainingHours
                        string deleteTrainingHoursSQL = @"Delete From TrainingHours Where Name = @Name AND club_ID = @Club_ID";

                        rowCount = conn.Execute(deleteTrainingHoursSQL, new {
                            name,
                            club_ID
                        }, transaction: tran);

                        //Check for 0 in rowcount
                        if (rowCount == 0) {
                            tran.Rollback();
                        }
                        else {
                            tran.Commit();
                            res = true;
                        }
                    }
                    catch (SqlException) {
                        tran.Rollback();
                    }
                }
            }
            return res;
        }

        public bool DeleteValuesAndPreferences(int club_ID) {

            bool res = false;

            List<int> _rowCountList = new List<int>();

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Check if club value exist in DB
                        string clubValueSQL = @"Select * from ClubValue where Club_ID = @Club_ID";
                        int valuecheck = conn.Query<int>(clubValueSQL, new { Club_ID = club_ID }, transaction: tran).FirstOrDefault();

                        if (valuecheck != 0) {
                            //Delete club values
                            string deleteClubValuesSQL = @"Delete From ClubValue Where club_ID = @club_ID";

                            _rowCountList.Add(conn.Execute(deleteClubValuesSQL, new {
                                club_ID
                            }, transaction: tran));
                        }

                        //Check if club preference exist in DB
                        string clubPreferenceSQL = @"Select * from ClubPreference where Club_ID = @Club_ID";
                        int prefcheck = conn.Query<int>(clubPreferenceSQL, new { Club_ID = club_ID }, transaction: tran).FirstOrDefault();

                        if (prefcheck != 0) {
                            //Delete club preferences
                            string deleteClubPreferencesSQL = @"Delete From ClubPreference Where club_ID = @club_ID";

                            _rowCountList.Add(conn.Execute(deleteClubPreferencesSQL, new {
                                club_ID
                            }, transaction: tran));
                        }


                        //Check for 0 in rowcount
                        if (_rowCountList.Contains(0)) {
                            tran.Rollback();
                        }
                        else {
                            tran.Commit();
                            res = true;
                        }
                    }
                    catch (SqlException) {
                        tran.Rollback();
                    }
                }
            }
            return res;
        }

        // Helping method to get club with all lists by club id
        private string SqlSelectWithId(int id) {
            return
                "SELECT c.*, ci.id as zipcodeCity_ID, ci.zipcode, ci.city FROM club c INNER JOIN zipcodecity ci " +
                "ON c.zipcodecity_id = ci.id WHERE c.id = " + id +
                "SELECT p.name FROM clubpreference cp INNER JOIN preference p " +
                "ON p.id = cp.preference_id WHERE cp.club_id = " + id +
                "SELECT v.name FROM clubvalue cv INNER JOIN value v " +
                "ON v.id = cv.value_id WHERE cv.club_id = " + id +
                "SELECT th.* FROM traininghours th WHERE th.club_id = " + id +
                "SELECT csp.* FROM squadplayers csp WHERE csp.club_id = " + id + " AND csp.season = 'Current year';" +
                "SELECT nsp.* FROM squadplayers nsp WHERE nsp.club_id = " + id + " AND nsp.season = 'Next year';" +
                "SELECT jp.* FROM jobposition jp WHERE jp.club_id = " + id +
                "SELECT fi.imagePath FROM facilityimage fi WHERE fi.club_id = " + id;
        }

        // Helping method to get club with all lists by club email
        private string SqlSelectWithEmail(string email) {
            return 
                "SELECT c.*, ci.id as zipcodeCity_ID, ci.zipcode, ci.city FROM club c INNER JOIN zipcodecity ci " +
                "ON c.zipcodecity_id = ci.id WHERE c.email = '" + email + "'; " +
                "SELECT p.name, c.id FROM club c INNER JOIN clubpreference cp " +
                "ON cp.club_id = c.id INNER JOIN preference p ON p.id = cp.preference_id " +
                "WHERE c.email = '" + email + "'; " +
                "SELECT v.name, c.id FROM club c INNER JOIN clubvalue cv ON cv.club_id = c.id " +
                "INNER JOIN value v ON v.id = cv.value_id WHERE c.email = '" + email + "'; " +
                "SELECT th.*, c.id FROM club c INNER JOIN traininghours th " +
                "ON th.club_id = c.id WHERE c.email = '" + email + "'; " +
                "SELECT csp.*, c.id FROM club c INNER JOIN squadplayers csp ON csp.club_id = c.id " +
                "WHERE c.email = '" + email + "' AND csp.season = 'Current year'; " +
                "SELECT nsp.*, c.id FROM club c INNER JOIN squadplayers nsp ON nsp.club_id = c.id " +
                "WHERE c.email = '" + email + "' AND nsp.season = 'Next year'; " +
                "SELECT jp.*, c.id FROM club c INNER JOIN jobposition jp " +
                "ON jp.club_id = c.id WHERE c.email = '" + email + "'; " +
                "SELECT fi.imagePath, c.id FROM club c INNER JOIN facilityimage fi " +
                "ON fi.club_id = c.id WHERE c.email = '" + email + "'; ";
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

        public IEnumerable<Club> GetBySearchCriteria(string sqlStatement) {
            List<Club> clubs = new List<Club>();
            string sql =
                "SELECT c.*, ci.zipcode, ci.city, v.name as value, null as preference, " +
                "jp.id, jp.league, jp.preferredHand, jp.height, jp.minAge, " +
                "jp.maxAge, jp.season, jp.contractStatus, jp.position, jp.club_id FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN clubvalue cv ON cv.club_id = c.id " +
                "INNER JOIN value v ON cv.value_ID = v.id " +
                "INNER JOIN jobposition jp ON jp.club_id = c.id WHERE c.isAvailable = 1 " + sqlStatement + 
                " UNION ALL " +
                "SELECT c.*, ci.zipcode, ci.city, null as value, p.name as preference, " +
                "jp.id, jp.league, jp.preferredHand, jp.height, jp.minAge, " +
                "jp.maxAge, jp.season, jp.contractStatus, jp.position, jp.club_id FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN clubpreference cp ON cp.club_id = c.id " +
                "INNER JOIN preference p ON cp.preference_id = p.id " +
                "INNER JOIN jobposition jp ON jp.club_id = c.id WHERE c.isAvailable = 1 " + sqlStatement +
                " UNION ALL " +
                "SELECT c.*, ci.zipcode, ci.city, null as value, null as preference, " +
                "jp.id, jp.league, jp.preferredHand, jp.height, jp.minAge, " +
                "jp.maxAge, jp.season, jp.contractStatus, jp.position, jp.club_id FROM club c " +
                "INNER JOIN zipcodecity ci ON c.zipcodecity_id = ci.id " +
                "INNER JOIN jobposition jp ON jp.club_id = c.id WHERE c.isAvailable = 1 " + sqlStatement;

            using (var conn = Connection()) {
                Club result = null;
                conn.Query<Club, int, string, string, string, JobPosition, Club>(sql,
                    (clubinside, zipcode, city, value, preference, jobPosition) => {
                        Club c = null;
                        if (!clubs.Any(cl => cl.Id == clubinside.Id)) {
                            c = BuildClub(clubinside, zipcode, city);
                            result = c;
                            clubs.Add(result);
                        }
                        else {
                            result = clubs.Single(cl => cl.Id == clubinside.Id);
                        }

                        if (jobPosition != null) {
                            if (!result.JobPositionsList.Any(cl => cl.Id == jobPosition.Id)) {
                                result.JobPositionsList.Add(jobPosition);
                            }
                        }

                        if (preference != null) {
                            result.PreferenceList.Add(preference);
                        }

                        if (value != null) {
                            result.ValuesList.Add(value);
                        }

                        return result;
                    }, splitOn: "zipcode, city, value, preference, id");
            }
            return clubs;
        }

        public bool DeleteFacilityImage(string imagePath, int club_ID) {
            bool res = false;

            int rowCount = 0;

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Delete squadPlayer
                        string deleteSquadPlayerSQL = @"Delete From FacilityImage Where ImagePath = @ImagePath AND club_ID = @Club_ID";

                        rowCount = conn.Execute(deleteSquadPlayerSQL, new {
                            ImagePath = imagePath,
                            club_ID
                        }, transaction: tran);

                        //Check for 0 in rowcount
                        if (rowCount == 0) {
                            tran.Rollback();
                        }
                        else {
                            tran.Commit();
                            res = true;
                        }
                    }
                    catch (SqlException) {
                        tran.Rollback();
                    }
                }
            }
            return res;
        }

        public List<SquadPlayer> GetNextSquadplayer(int club_ID) {
            List<SquadPlayer> spl = new List<SquadPlayer>();

            using (var conn = Connection()) {
                
                string getNextYearSquadPlayerSQL = "Select * from Squadplayers where Season = 'Next year' And club_ID = @Club_ID";

                spl = conn.Query<SquadPlayer>(getNextYearSquadPlayerSQL, new { club_ID }).ToList();

            }
            return spl;
        }

        public List<SquadPlayer> GetCurrentSquadplayer(int club_ID) {
            List<SquadPlayer> spl = new List<SquadPlayer>();

            using (var conn = Connection()) {

                string getCurrentYearSquadPlayerSQL = "Select * from Squadplayers where Season = 'Current year' And club_ID = @Club_ID";

                spl = conn.Query<SquadPlayer>(getCurrentYearSquadPlayerSQL, new { club_ID }).ToList();

            }
            return spl;
        }

        public List<JobPosition> GetOpenPositions(int id) {
            List<JobPosition> opl = new List<JobPosition>();

            using (var conn = Connection()) {

                string getOpenPositionsSQL = "Select * from JobPosition where Club_ID = @Club_ID";

                opl = conn.Query<JobPosition>(getOpenPositionsSQL, new { Club_ID = id }).ToList();

            }
            return opl;
        }

        public List<TrainingHours> GetTrainingHours(int id) {
            List<TrainingHours> thl = new List<TrainingHours>();

            using (var conn = Connection()) {

                string getTrainingHoursSQL = "Select * from TrainingHours where Club_ID = @Club_ID";

                thl = conn.Query<TrainingHours>(getTrainingHoursSQL, new { Club_ID = id }).ToList();

            }
            return thl;
        }

        public string GetEmailByID(int id) {
            string email = "";
            using (var conn = Connection()) {
                email = conn.QueryFirstOrDefault<string>("select email from Club where id = " + id);
            }
            return email;
        }
    }
}
