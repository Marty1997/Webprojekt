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

                            //Return squad player position ID

                            string squadPlayerPositionSQL = @"Select id from position where positionName = @Position";

                            int squadPlayerPosition_ID = conn.Query<int>(squadPlayerPositionSQL, new { Position = csp.PositionName }, transaction: tran).FirstOrDefault();

                            if (squadPlayerPosition_ID != 0) {

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
                        }
                    }

                    //Next Year Squad Players
                    if (entity.NextYearSquadPlayersList.Count > 0) {
                        foreach (SquadPlayer nysp in entity.NextYearSquadPlayersList) {

                            //Return squad player position ID

                            string squadPlayerPositionSQL = @"Select id from position where positionName = @Position";

                            int squadPlayerPosition_ID = conn.Query<int>(squadPlayerPositionSQL, new { Position = nysp.PositionName }, transaction: tran).FirstOrDefault();

                            if (squadPlayerPosition_ID != 0) {

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
                        }
                    }

                    //Job position
                    if (entity.JobPositionsList.Count > 0) {
                        foreach (JobPosition jp in entity.JobPositionsList) {

                            var jobPosition_ID = 0;
                            //Return jobPosition position ID
                            string positionSQL = @"Select id from position where positionName = @Position";
                            int position_ID = conn.Query<int>(positionSQL, new { Position = jp.PositionName }, transaction: tran).FirstOrDefault();

                            if (position_ID != 0) {

                                //Insert JobPosition
                                string jobPositionSQL = @"INSERT INTO JobPosition (League, PreferredHand, Height, MinAge, MaxAge, Season, ContractStatus, Club_ID, Position_ID) 
                                        VALUES (@League, @PreferredHand, @Height, @MinAge, @MaxAge, @Season, @ContractStatus, @Club_ID, @Position_ID);
                                            SELECT CAST(SCOPE_IDENTITY() as int)";

                                jobPosition_ID = conn.Query<int>(jobPositionSQL, new {
                                    League = jp.League,
                                    PreferredHand = jp.PreferredHand,
                                    Height = jp.Height,
                                    MinAge = jp.MinAge,
                                    MaxAge = jp.MaxAge,
                                    Season = jp.Season,
                                    ContractStatus = jp.ContractStatus,
                                    Club_ID = club_ID,
                                    Position_ID = position_ID
                                }, transaction: tran).Single();
                            }

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

        public IEnumerable<Club> GetAll() {
            List<Club> clubs = new List<Club>();

            using (var conn = Connection()) {
                clubs = conn.Query<Club, int, string, Club>("select c.*, ci.zipcode, ci.city from club c" +
                    " inner join ZipcodeCity ci on c.zipcodecity_id = ci.id",
                (clubinside, code, city) => { clubinside.Zipcode = code; clubinside.City = city; return clubinside; }, splitOn: "Zipcode,city").ToList();

                foreach (Club club in clubs) {
                    club.TrainingHoursList = GetClubTraningHourList(club, conn);
                    club.CurrentSquadPlayersList = GetClubCurrentSquadList(club, conn);
                    club.NextYearSquadPlayersList = GetClubNextYearSquadList(club, conn);
                    club.JobPositionsList = GetJobPosition(club, conn);
                    club.ValuesList = GetClubValueList(club, conn);
                    club.PreferenceList = GetClubPreferenceList(club, conn);
                }
            }

            return clubs;
        }

        public Club GetByEmail(string email) {
            Club club = new Club();
            using (var conn = Connection()) {
                //try {
                club = conn.Query<Club, int, string, Club>("select c.*, ci.zipcode, ci.city from club c" +
                    " inner join ZipcodeCity ci on c.zipcodecity_id = ci.id where c.email = @email",
                (clubinside, code, city) => { clubinside.Zipcode = code; clubinside.City = city; return clubinside; }, new { email }, splitOn: "Zipcode,city").Single();

                club.TrainingHoursList = GetClubTraningHourList(club, conn);
                club.CurrentSquadPlayersList = GetClubCurrentSquadList(club, conn);
                club.NextYearSquadPlayersList = GetClubNextYearSquadList(club, conn);
                club.JobPositionsList = GetJobPosition(club, conn);
                club.ValuesList = GetClubValueList(club, conn);
                club.PreferenceList = GetClubPreferenceList(club, conn);

                //}
                //catch (SqlException e) {
                //    club.ErrorMessage = ErrorHandling.Exception(e);
                //}
            }
            return club;
        }

        public Club GetById(int id) {
            Club c = new Club();

            string sql = 
                "SELECT c.*, ci.zipcode, ci.city FROM club c " +
                "INNER JOIN zipcodecity ci " +
                "ON c.zipcodecity_id = ci.id " +
                "WHERE c.id = @id; " +

                "SELECT p.name FROM clubpreference cp " +
                "INNER JOIN preference p " +
                "ON p.id = cp.preference_id " +
                "WHERE cp.club_id = @id; " +

                "SELECT v.name FROM clubvalue cv " +
                "INNER JOIN value v " +
                "ON v.id = cv.value_id " +
                "WHERE cv.club_id = @id; " +
                
                "SELECT th.* FROM traininghours th " +
                "WHERE th.club_id = @id; " +

                "SELECT csp.*, cpos.name FROM squadplayers csp " +
                "INNER JOIN position cpos " +
                "ON cpos.id = csp.position_id " +
                "WHERE csp.club_id = @id AND csp.season = 'Current year';" +
                
                "SELECT nsp.*, pos.name FROM squadplayers nsp " +
                "INNER JOIN position pos " +
                "ON pos.id = nsp.position_id " +
                "WHERE nsp.club_id = @id AND nsp.season = 'Next year';";

            using (var connection = Connection()) {

                using (var multi = connection.QueryMultiple(sql, new { id })) {
                    c = multi.Read<Club>().First();
                    c.PreferenceList = multi.Read<string>().ToList();
                    c.ValuesList = multi.Read<string>().ToList();
                    c.TrainingHoursList = multi.Read<TrainingHours>().ToList();
                    c.CurrentSquadPlayersList = multi.Read<SquadPlayer>().ToList();
                    c.NextYearSquadPlayersList = multi.Read<SquadPlayer>().ToList();
                }

            }

            return c;
        }

        //public Club GetById(int id) {
        //    using (var conn = Connection()) {
        //        //try {
        //        Club result = null;
        //        TrainingHours schedule = null;
        //        conn.Query<Club, int, string, string, string, TrainingHours, SquadPlayer, Club>(
        //            " select c.*, ci.zipcode, ci.city, v.name, p.name, th.*, csp.* from club c " +
        //            " inner join zipcodecity ci on c.zipcodecity_id = ci.id " +
        //            " left join clubvalue cv on cv.club_id = c.id " +
        //            " left join value v on v.id = cv.value_id " +
        //            " left join clubpreference cp on cp.club_id = c.id " +
        //            " left join preference p on p.id = cp.preference_id " +
        //            " left join traininghours th on th.club_id = c.id " +
        //            " left join squadplayers csp on csp.club_id = c.id where c.id = @id ",
        //        (clubinside, code, city, value, preference, traininghours, currentsquadplayers) => {
        //            Club c = null;
        //            if(result == null) {
        //                c = new Club {
        //                    Id = clubinside.Id,
        //                    Name = clubinside.Name,
        //                    Email = clubinside.Email,
        //                    League = clubinside.League,
        //                    Country = clubinside.Country,
        //                    StreetAddress = clubinside.StreetAddress,
        //                    StreetNumber = clubinside.StreetNumber,
        //                    Trainer = clubinside.Trainer,
        //                    AssistantTrainer = clubinside.AssistantTrainer,
        //                    Physiotherapist = clubinside.Physiotherapist,
        //                    AssistantPhysiotherapist = clubinside.AssistantPhysiotherapist,
        //                    Manager = clubinside.Manager,
        //                    ValueDescription = clubinside.ValueDescription,
        //                    PreferenceDescription = clubinside.PreferenceDescription,
        //                    Zipcode = code,
        //                    City = city
        //                };
        //                result = c;
        //            }

        //            if(value != null && !result.ValuesList.Contains(value)) {
        //                result.ValuesList.Add(value);
        //            }
        //            if(preference != null && !result.PreferenceList.Contains(preference)) {
        //                result.PreferenceList.Add(preference);
        //            }
        //            if(traininghours != null && !result.TrainingHoursList.Contains(traininghours)) {
        //                result.TrainingHoursList.Add(schedule);
        //            }
        //            if(currentsquadplayers != null && !result.CurrentSquadPlayersList.Contains(currentsquadplayers)) {
        //                result.CurrentSquadPlayersList.Add(currentsquadplayers);
        //            }

        //            return result;

        //        }, new { id }, splitOn: "Zipcode,city,name,name, name, id");

        //        //result.TrainingHoursList = GetClubTraningHourList(result, conn);
        //        result.CurrentSquadPlayersList = GetClubCurrentSquadList(result, conn);
        //        result.NextYearSquadPlayersList = GetClubNextYearSquadList(result, conn);
        //        result.JobPositionsList = GetJobPosition(result, conn);
        //        //club.ValuesList = GetClubValueList(club, conn);
        //        //club.PreferenceList = GetClubPreferenceList(club, conn);

        //        //}
        //        //catch (SqlException e) {
        //        //    club.ErrorMessage = ErrorHandling.Exception(e);
        //        //}
        //        return result;
        //    }
            
        //}



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

        //Helping method to build club traininghours
        private List<TrainingHours> GetClubTraningHourList(Club club, IDbConnection conn) {
            club.TrainingHoursList = conn.Query<TrainingHours>("select * from TrainingHours where club_ID = @id", new { id = club.Id }).ToList();
            return club.TrainingHoursList;
        }

        //Helping method to build club current squad list
        private List<SquadPlayer> GetClubCurrentSquadList(Club club, IDbConnection conn) {
            club.CurrentSquadPlayersList = conn.Query<SquadPlayer, string, SquadPlayer>("select s.*, p.* from SquadPlayers s" +
                    " inner join Position p on p.id = s.position_ID where s.club_id = @id and s.season = 'Current year'",
            (squadPlayers, position) => { squadPlayers.PositionName = position; return squadPlayers; }, new { id = club.Id }, splitOn: "name").ToList();
            return club.CurrentSquadPlayersList;
        }

        //Helping method to build club next year squad list
        private List<SquadPlayer> GetClubNextYearSquadList(Club club, IDbConnection conn) {
            club.NextYearSquadPlayersList = conn.Query<SquadPlayer, string, SquadPlayer>("select s.*, p.* from SquadPlayers s" +
                     " inner join Position p on p.id = s.position_ID where s.club_id = @id and s.season = 'Next year'",
                (squadPlayers, position) => { squadPlayers.PositionName = position; return squadPlayers; }, new { id = club.Id }, splitOn: "name").ToList();
            return club.NextYearSquadPlayersList;
        }

        //Helping method to build club open position list
        private List<JobPosition> GetJobPosition(Club club, IDbConnection conn) {
            club.JobPositionsList = conn.Query<JobPosition, string, JobPosition>("select jp.*, p.name from JobPosition jp " +
                "inner join Position p on p.id = jp.position_ID where jp.club_ID = @id",
                (jobPosition, position) => { jobPosition.PositionName = position; return jobPosition; }, new { id = club.Id }, splitOn: "name").ToList();

            foreach (JobPosition item in club.JobPositionsList) {
                item.StrengthsList = conn.Query<string>("select s.name from Strength s " +
                    "inner join JobPositionStrength jps on jps.strength_id = s.id where jps.jobposition_ID = @newid", new { newid = item.ID }).ToList();
            }
            return club.JobPositionsList;
        }

        //Helping method to build club value list
        private List<string> GetClubValueList(Club club, IDbConnection conn) {
            club.ValuesList = conn.Query<string>("select v.name from Value v " +
                 "inner join ClubValue cv on cv.value_id = v.id where cv.club_ID = @id", new { id = club.Id }).ToList();
            return club.ValuesList;
        }

        //Helping method to build club strength list
        private List<string> GetClubPreferenceList(Club club, IDbConnection conn) {
            club.PreferenceList = conn.Query<string>("select p.name from Preference p" +
                " inner join ClubPreference cp on cp.preference_id = p.id where cp.club_ID = @id", new { id = club.Id }).ToList();
            return club.PreferenceList;
        }

        public IEnumerable<Club> GetBySearchCriteria(string sqlStatement) {
            List<Club> clubs = new List<Club>();

            using (var conn = Connection()) {
                clubs = conn.Query<Club, int, string, Club>("select c.*, ci.zipcode, ci.city from club c" +
                    " inner join ZipcodeCity ci on c.zipcodecity_id = ci.id where " + sqlStatement,
                (clubinside, code, city) => { clubinside.Zipcode = code; clubinside.City = city; return clubinside; }, splitOn: "Zipcode,city").ToList();

                foreach (Club club in clubs) {
                    club.JobPositionsList = GetJobPosition(club, conn);
                    club.PreferenceList = GetClubPreferenceList(club, conn);
                    club.ValuesList = GetClubValueList(club, conn);
                }
            }

            return clubs;
        }
    }
}
