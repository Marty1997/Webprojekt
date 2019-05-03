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

                                string squadPlayerPositionSQL = @"Select id from position where name = @Position";

                                int squadPlayerPosition_ID = conn.Query<int>(squadPlayerPositionSQL, new { Position = csp.Position }, transaction: tran).FirstOrDefault();

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

                                string squadPlayerPositionSQL = @"Select id from position where name = @Position";

                                int squadPlayerPosition_ID = conn.Query<int>(squadPlayerPositionSQL, new { Position = nysp.Position }, transaction: tran).FirstOrDefault();

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

                        //Open positions
                        if (entity.OpenPositionsList.Count > 0) {
                            foreach (string openPosition in entity.OpenPositionsList) {

                                //Return open position ID
                                string openPositionSQL = @"Select id from Position where name = @Name";
                                int openPosition_ID = conn.Query<int>(openPositionSQL, new { Name = openPosition }, transaction: tran).FirstOrDefault();

                                if (openPosition_ID != 0) {

                                    //Insert ClubPosition
                                    string clubPositionSQL = @"INSERT INTO ClubPosition (Club_ID, Position_ID) 
                                        VALUES (@Club_ID, @Position_ID)";

                                    _rowCountList.Add(conn.Execute(clubPositionSQL, new {
                                    Club_ID = club_ID,
                                    Position_ID = openPosition_ID
                                    }, transaction: tran));
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
            throw new NotImplementedException();
        }

        public Club GetByEmail(string email) {
            Club club = new Club();
            using (var conn = Connection()) {
                //try {
                club = conn.Query<Club, int, string, Club>("select c.*, ci.zipcode, ci.city from club c" +
                    " inner join ZipcodeCity ci on c.zipcodecity_id = ci.id where c.email = @email",
                (clubinside, code, city) => { clubinside.Zipcode = code; clubinside.City = city; return clubinside; }, new { email }, splitOn: "Zipcode,city").Single();

                club = GetClubTraningHourList(club, conn);
                club = GetClubCurrentSquadList(club, conn);
                club = GetClubNextYearSquadList(club, conn);
                club = GetOpenPositionList(club, conn);
                club = GetClubValueList(club, conn);
                club = GetClubPreferenceList(club, conn);

                //}
                //catch (SqlException e) {
                //    club.ErrorMessage = ErrorHandling.Exception(e);
                //}
            }
            return club;
        }

        public Club GetById(int id) {
            Club club = new Club();
            using (var conn = Connection()) {
                //try {
                club = conn.Query<Club, int, string, Club>("select c.*, ci.zipcode, ci.city from club c" +
                    " inner join ZipcodeCity ci on c.zipcodecity_id = ci.id where c.id = @id",
                (clubinside, code, city) => { clubinside.Zipcode = code; clubinside.City = city; return clubinside; }, new { id }, splitOn: "Zipcode,city").Single();

                club = GetClubTraningHourList(club, conn);
                club = GetClubCurrentSquadList(club, conn);
                club = GetClubNextYearSquadList(club, conn);
                club = GetOpenPositionList(club, conn);
                club = GetClubValueList(club, conn);
                club = GetClubPreferenceList(club, conn);

                //}
                //catch (SqlException e) {
                //    club.ErrorMessage = ErrorHandling.Exception(e);
                //}
            }
            return club;
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

        //Helping method to build club traininghours
        private Club GetClubTraningHourList(Club club, IDbConnection conn) {
            club.TrainingHoursList = conn.Query<TrainingHours>("select * from TrainingHours where club_ID = @id", new { id = club.Id }).ToList();
            return club;
        }

        //Helping method to build club current squad list
        private Club GetClubCurrentSquadList(Club club, IDbConnection conn) {
            club.CurrentSquadPlayersList = conn.Query<SquadPlayer, string, SquadPlayer>("select s.*, p.* from SquadPlayers s" +
                    " inner join Position p on p.id = s.position_ID where s.club_id = @id and s.season = 'Current year'",
            (squadPlayers, position) => { squadPlayers.Position = position; return squadPlayers; }, new { id = club.Id }, splitOn: "name").ToList();
            return club;
        }

        //Helping method to build club next year squad list
        private Club GetClubNextYearSquadList(Club club, IDbConnection conn) {
            club.NextYearSquadPlayersList = conn.Query<SquadPlayer, string, SquadPlayer>("select s.*, p.* from SquadPlayers s" +
                     " inner join Position p on p.id = s.position_ID where s.club_id = @id and s.season = 'Next year'",
                (squadPlayers, position) => { squadPlayers.Position = position; return squadPlayers; }, new { id = club.Id }, splitOn: "name").ToList();
            return club;
        }

        //Helping method to build club open position list
        private Club GetOpenPositionList(Club club, IDbConnection conn) {
            club.OpenPositionsList = conn.Query<string>("select p.name from Position p " +
                "inner join ClubPosition cp on cp.position_id = p.id where cp.club_ID = @id", new { id = club.Id }).ToList();
            return club;
        }

        //Helping method to build club value list
        private Club GetClubValueList(Club club, IDbConnection conn) {
            club.ValuesList = conn.Query<string>("select v.name from Value v " +
                 "inner join ClubValue cv on cv.value_id = v.id where cv.club_ID = @id", new { id = club.Id }).ToList();
            return club;
        }

        //Helping method to build club strength list
        private Club GetClubPreferenceList(Club club, IDbConnection conn) {
            club.PreferenceList = conn.Query<string>("select p.name from Preference p" +
                " inner join ClubPreference cp on cp.preference_id = p.id where cp.club_ID = @id", new { id = club.Id }).ToList();
            return club;
        }
    }
}
