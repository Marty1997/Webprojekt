using Api.DAL.Entities;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;

namespace Api.DAL.Repos {
    public class PlayerRepos : IRepository<Player> {

        private readonly string _connString;
        private List<int> _rowCountList;

        public PlayerRepos(IConfiguration config) {
            _connString = config.GetConnectionString("DefaultConnection");
            _rowCountList = new List<int>();

        }

        public Player Create(Player entity) {

            Player p = new Player();

            using (var conn = new SqlConnection(_connString)) {
                conn.Open();
                
                using (SqlTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Insert userCredentials and return usercredentials ID
                        string userCredentialsSQL = @"INSERT INTO [UserCredentials] ([Hashpassword, Salt, LoginAttempts]) VALUES (@Hashpassword, @Salt, @LoginAttempts); 
                                     SELECT CAST(SCOPE_IDENTITY() as int)";

                        var userCredentials_ID = conn.Query<int>(userCredentialsSQL, new { Hashpassword = entity.UserCredentials.HashPassword, Salt = entity.UserCredentials.Salt, LoginAttempts = 0}).Single();

                       
                        //Return primary position ID
                        string primaryPositionSQL = @"Select position_id from position where name = @PrimaryPosition";

                        var primaryPosition_ID = conn.Query<int>(primaryPositionSQL, new { PrimaryPosition = entity.PrimaryPosition }).Single();


                        //Return secondary position ID
                        string secondaryPositionSQL = @"Select position_id from position where name = @SecondaryPosition";

                        var secondaryPosition_ID = conn.Query<int>(secondaryPositionSQL, new { SecondaryPosition = entity.SecondaryPosition }).Single();

                        //Return current club primary position ID
                        string currentClubPrimaryPositionSQL = @"Select position_id from position where name = @CurrentClubPrimaryPosition";

                        var currentClubPrimaryPosition_ID = conn.Query<int>(currentClubPrimaryPositionSQL, new { CurrentClubPrimaryPosition  = entity.CurrentClubPrimaryPosition }).Single();

                        //Return current club secondary position ID
                        string currentClubSecondaryPositionSQL = @"Select position_id from position where name = @CurrentClubSecondaryPosition";

                        var currentClubSecondaryPosition_ID = conn.Query<int>(currentClubSecondaryPositionSQL, new { CurrentClubPrimaryPosition = entity.CurrentClubSecondaryPosition }).Single();
                        
                        
                        //Insert player and return player_ID
                        string playerSQL = @"INSERT INTO [Player] ([Firstname, Lastname, Email, Day, Month, Year, Country, Height, Weight, Bodyfat, PreferredHand, CurrentClub, StrengthDescription, 
                                        WeaknessDescription, VideoPath, ImagePath, PrimaryPosition_ID, SecondaryPosition_ID, CurrentClubPrimaryPosition_ID, CurrentClubPrimaryPosition_ID, UserCredentials_ID]) 
                                        VALUES (@Firstname, @Lastname, @Email, @Day, @Month, @Year, @Country, @Height, @Weight, @Bodyfat, @PreferredHand, @CurrentClub, @StrengthDescription, @WeaknessDescription,
                                        @VideoPath, @ImagePath, @PrimaryPosition_ID, @SecondaryPosition_ID, @CurrentClubPrimaryPosition_ID, @CurrentClubSecondaryPosition_ID, @UserCredentials_ID);
                                            SELECT CAST(SCOPE_IDENTITY() as int)";


                        var player_ID = conn.Query<int>(playerSQL, new { Firstname = entity.FirstName, Lastname = entity.LastName, entity.Email, entity.Day, entity.Month, entity.Year, entity.Country, entity.Height, entity.Weight,
                                                      entity.BodyFat, entity.PreferredHand, entity.CurrentClub, entity.StrengthDescription, entity.WeaknessDescription, entity.VideoPath, entity.ImagePath,
                                                      PrimaryPosition = primaryPosition_ID, SecondaryPosition = secondaryPosition_ID, CurrentClubPrimaryPosition = currentClubPrimaryPosition_ID,
                                                        CurrentClubSecondaryPosition = currentClubSecondaryPosition_ID, UserCredentials_ID = userCredentials_ID}, tran).Single();

                        
                        //Player strengths
                        if (entity.StrengthList.Count > 0) {
                            foreach (string strength in entity.StrengthList) {

                                //Return strength ID
                                string strengthSQL = @"Select strength_id from Strength where name = @Name";
                                var strength_ID = conn.Query<int>(strengthSQL, new { Name = strength }).Single();

                                //Insert PlayerStrength
                                string playerStrengthSQL = @"INSERT INTO [PlayerStrength] ([Player_ID, Strength_ID]) 
                                        VALUES (@Player_ID, @Strength_ID)";

                                _rowCountList.Add(conn.Execute(playerStrengthSQL, new {
                                    Player_ID = player_ID,
                                    Strength_ID = strength_ID
                                }, tran));
                            }
                        }
                        else {
                            p.ErrorMessage = "The player has no strengths";
                        }


                        //Player weaknesses
                        if (entity.WeaknessList.Count > 0) {
                            foreach (string weakness in entity.WeaknessList) {

                                //Return weakness ID
                                string weaknessSQL = @"Select weakness_id from Weakness where name = @Name";
                                var weakness_ID = conn.Query<int>(weaknessSQL, new { Name = weakness }).Single();

                                //Insert PlayerWeakness
                                string playerWeaknessSQL = @"INSERT INTO [PlayerWeakness] ([Player_ID, Weakness_ID]) 
                                        VALUES (@Player_ID, @Weakness_ID)";

                                _rowCountList.Add(conn.Execute(playerWeaknessSQL, new {
                                    Player_ID = player_ID,
                                    Weakness_ID = weakness_ID
                                }, tran));
                            }
                        }
                        else {
                            p.ErrorMessage = "The player has no weaknesses";
                        }


                        if (entity.NationalTeamList.Count > 0) {
                            foreach (NationalTeam nt in entity.NationalTeamList) {

                                //Return national team position ID
                                
                                string nationalTeamPositionSQL = @"Select position_id from position where name = @Position";

                                var nationalTeamPosition_ID = conn.Query<int>(nationalTeamPositionSQL, new { Position = nt.Position }).Single();

                                //Insert NationalTeam
                                string nationalTeamSQL = @"INSERT INTO [NationalTeam] ([Name, Appearances, Statistic, Player_ID, Position_ID]) 
                                        VALUES (@Name, @Appearances, @Statitic, @Player_ID, @Position_ID)";

                                _rowCountList.Add(conn.Execute(nationalTeamSQL, new {
                                    Name = nt.Name,
                                    Appearances = nt.Appearances,
                                    Statistic = nt.Statistic,
                                    Player_ID = player_ID,
                                    Position_ID = nationalTeamPosition_ID
                                }, tran));
                            }
                        }
                        else {
                            p.ErrorMessage = "The player has no nationalteams";
                        }
                        
                        //Check for 0 in rowcount list
                        if (_rowCountList.Contains(0)) {
                            p.ErrorMessage = "The player was not registred";
                            tran.Rollback();
                        }
                        else {
                            p.ErrorMessage = "";
                            tran.Commit();
                        }
                        
                    }
                    catch (SqlException e) {

                        tran.Rollback();
                        p.ErrorMessage = ErrorHandling.Exception(e);                 
                    }
                }
            }
            return p;
        }

        public int Delete(int id) {
            throw new NotImplementedException();
        }

        public IEnumerable<Player> GetAll() {
            throw new NotImplementedException();
        }

        public Player GetByEmail(string email) {

            Player p = new Player();

            using (var conn = new SqlConnection(_connString)) {
                conn.Open();

                try {

                    //Return playerID
                    string playerSQL = @"Select player_ID from Player where email = @Email";
                    var player_ID = conn.Query<int>(playerSQL, new { Email = email }).Single();

                    if (player_ID < 1) {
                        p.ErrorMessage = "The player does not exist";
                    }
                    else {
                        p.ErrorMessage = "";
                    }

                }
                catch (SqlException e) {
                    p.ErrorMessage = ErrorHandling.Exception(e);
                }
            }
            return p;
        }
        
        public Player GetById(int id) {
            throw new NotImplementedException();
        }

        public UserCredentials getCredentialsByEmail(string email) {
            throw new NotImplementedException();
        }

        public void Insert(Player entity) {
            throw new NotImplementedException();
        }

        public void Save() {
            throw new NotImplementedException();
        }

        public bool Update(Player entity) {
            throw new NotImplementedException();
        }
    }
}
