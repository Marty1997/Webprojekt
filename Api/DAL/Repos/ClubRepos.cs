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

        
        private List<int> _rowCountList;
        private readonly string _connString;

        public ClubRepos(IConfiguration config) {
            _connString = config.GetConnectionString("DefaultConnection");
            _rowCountList = new List<int>();
        }

        public Club Create(Club entity) {

            Club c = new Club();

            using (var conn = new SqlConnection(_connString)) {
                conn.Open();

                using (SqlTransaction tran = conn.BeginTransaction()) {
                    try {


                        //Return usercredentials ID
                        string userCredentialsSQL = @"INSERT INTO [UserCredentials] ([Hashpassword, Salt, LoginAttempts]) VALUES (@Hashpassword, @Salt, @LoginAttempts); 
                                     SELECT CAST(SCOPE_IDENTITY() as int)";

                        var userCredentials_ID = conn.Query<int>(userCredentialsSQL, new { Hashpassword = entity.UserCredentials.HashPassword, Salt = entity.UserCredentials.Salt, LoginAttempts = 0 }).Single();


                        //Insert Club
                        string clubSQL = @"INSERT INTO [Club] ([Name, Email, League, Country, StreetAddress, AddressNumber, Trainer, AssistantTrainer, Physiotherapist, AssistantPhysiotherapist, Manager, ValueDescription, PreferenceDescription, 
                                        Zipcode, UserCredentials_ID]) 
                                        VALUES (@Name, @Email, @League, @Country, @StreetAddress, @AddressNumber, @Trainer, @AssistantTrainer, @Physiotherapist, @AssistantPhysiotherapist, @Manager, @ValueDescription, @PreferenceDescription, 
                                        @Zipcode, @UserCredentials_ID);
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
                            entity.Zipcode,
                            UserCredentials_ID = userCredentials_ID
                        }, tran).Single();

                        
                        //Club values
                        if (entity.ValuesList.Count > 0) {
                            foreach (string value in entity.ValuesList) {

                                //Return value ID
                                string valuesSQL = @"Select value_id from Value where name = @Name";
                                var value_ID = conn.Query<int>(valuesSQL, new { Name = value }).Single();

                                //Insert ClubValue
                                string clubValueSQL = @"INSERT INTO [ClubValue] ([Club_ID, Value_ID]) 
                                        VALUES (@Club_ID, @Value_ID)";

                                _rowCountList.Add(conn.Execute(clubValueSQL, new {
                                    Club_ID = club_ID,
                                    Value_ID = value_ID
                                }, tran));
                            }
                        }
                        else {
                            c.ErrorMessage = "The club has no values";
                        }


                        //Club preferences
                        if (entity.PreferenceList.Count > 0) {
                            foreach (string preference in entity.PreferenceList) {

                                //Return preference ID
                                string preferenceSQL = @"Select preference_id from Preference where name = @Name";
                                var preference_ID = conn.Query<int>(preferenceSQL, new { Name = preference }).Single();

                                //Insert ClubPreference
                                string clubPreferenceSQL = @"INSERT INTO [ClubPreference] ([Club_ID, Preference_ID]) 
                                        VALUES (@Club_ID, @Preference_ID)";

                                _rowCountList.Add(conn.Execute(clubPreferenceSQL, new {
                                    Club_ID = club_ID,
                                    Preference_ID = preference_ID
                                }, tran));
                            }
                        }
                        else {
                            c.ErrorMessage = "The club has no preferences";
                        }

                        //SquadPlayers
                        foreach (SquadPlayer sp in entity.SquadPlayersList) {

                            //Return squad player position ID

                            string squadPlayerPositionSQL = @"Select position_id from position where name = @Position";

                            var squadPlayerPosition_ID = conn.Query<int>(squadPlayerPositionSQL, new { Position = sp.Position }).Single();

                            //Insert Squad Player
                            string squadPlayerSQL = @"INSERT INTO [SquadPlayer] ([ShirtNumber, Name, Club_ID, Position_ID]) 
                                        VALUES (@ShirtNumber, @Name, @Club_ID, @Position_ID)";

                            _rowCountList.Add(conn.Execute(squadPlayerSQL, new {
                                ShirtNumber = sp.ShirtNumber,
                                Name = sp.Name,
                                Club_ID = club_ID,
                                Position_ID = squadPlayerPosition_ID
                            }, tran));
                        }

                        //Open positions
                        if (entity.OpenPositionsList.Count > 0) {
                            foreach (string openPosition in entity.OpenPositionsList) {

                                //Return open position ID
                                string openPositionSQL = @"Select position_id from Position where name = @Name";
                                var openPosition_ID = conn.Query<int>(openPositionSQL, new { Name = openPosition }).Single();

                                //Insert ClubPosition
                                string clubPositionSQL = @"INSERT INTO [ClubPosition] ([Club_ID, Position_ID]) 
                                        VALUES (@Club_ID, @Position_ID)";

                                _rowCountList.Add(conn.Execute(clubPositionSQL, new {
                                    Club_ID = club_ID,
                                    Position_ID = openPosition_ID
                                }, tran));
                            }
                        }
                        else {
                            c.ErrorMessage = "The club has no open positions";
                        }

                        //Training hours
                        foreach (TrainingHours traininghours in entity.TrainingHoursList) {

                            //Insert Training hours
                            string trainingHoursSQL = @"INSERT INTO [TrainingHours] ([Name, Mon, Tue, Wed, Thu, Fri, Sat, Sun, Club_ID]) 
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
                            }, tran));
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
                    }
                    catch (SqlException e) {

                        tran.Rollback();
                        c.ErrorMessage = ErrorHandling.Exception(e);
                    }
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

            Club c = new Club();

            using (var conn = new SqlConnection(_connString)) {
                conn.Open();

                try {

                    //Return club_ID
                    string clubSQL = @"Select club_ID from Club where email = @Email";
                    var club_ID = conn.Query<int>(clubSQL, new { Email = email }).Single();

                    if (club_ID < 1) {
                        c.ErrorMessage = "The club does not exist";
                    }
                    else {
                        c.ErrorMessage = "";
                    }

                }
                catch (SqlException e) {
                    c.ErrorMessage = ErrorHandling.Exception(e);
                }
            }
            return c;
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
