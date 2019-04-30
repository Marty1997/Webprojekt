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
        
        public Func<IDbConnection> Connection { get; set; }

        public Player Create(Player entity) {

            List<int> _rowCountList = new List<int>();

            Player p = new Player();

            using (var conn = Connection()) {
                    
                using (IDbTransaction tran = conn.BeginTransaction()) {
                    //try {
                        
                        //Insert userCredentials and return usercredentials ID
                        string userCredentialsSQL = @"INSERT INTO UserCredentials (Hashpassword, Salt, LoginAttempts) VALUES (@Hashpassword, @Salt, @LoginAttempts); 
                                     SELECT CAST(SCOPE_IDENTITY() as int)";
                        int userCredentials_ID = conn.Query<int>(userCredentialsSQL, new { Hashpassword = entity.UserCredentials.HashPassword, Salt = entity.UserCredentials.Salt, LoginAttempts = 0}, transaction: tran).Single();
                
                        //Return primary position ID
                        string primaryPositionSQL = @"Select id from position where name = @PrimaryPosition";
                        int? primaryPosition_ID = conn.Query<int>(primaryPositionSQL, new { PrimaryPosition = entity.PrimaryPosition }, transaction: tran).Single();

                        //Return secondary position ID
                        string secondaryPositionSQL = @"Select id from position where name = @SecondaryPosition";
                        int? secondaryPosition_ID = conn.Query<int>(secondaryPositionSQL, new { SecondaryPosition = entity.SecondaryPosition }, transaction: tran).Single();

                        //Return current club primary position ID
                        string currentClubPrimaryPositionSQL = @"Select id from position where name = @CurrentClubPrimaryPosition";
                        int? currentClubPrimaryPosition_ID = conn.Query<int>(currentClubPrimaryPositionSQL, new { CurrentClubPrimaryPosition  = entity.CurrentClubPrimaryPosition }, transaction: tran).Single();

                        //Return current club secondary position ID
                        string currentClubSecondaryPositionSQL = @"Select id from position where name = @CurrentClubSecondaryPosition";
                        int? currentClubSecondaryPosition_ID = conn.Query<int>(currentClubSecondaryPositionSQL, new { CurrentClubSecondaryPosition = entity.CurrentClubSecondaryPosition }, transaction: tran).Single();
                    
                        //Insert player and return player_ID
                        string playerSQL = @"INSERT INTO Player (Firstname, Lastname, Email, Day, Month, Year, Country, Height, Weight, Bodyfat, PreferredHand, CurrentClub, Accomplishments, Statistic, StrengthDescription, 
                                            WeaknessDescription, VideoPath, ImagePath, FormerClubs, PrimaryPosition_ID, SecondaryPosition_ID, CurrentClubPrimaryPosition_ID, CurrentClubSecondaryPosition_ID, UserCredentials_ID) 
                                        VALUES (@Firstname, @Lastname, @Email, @Day, @Month, @Year, @Country, @Height, @Weight, @Bodyfat, @PreferredHand, @CurrentClub, @Accomplishments, @Statistic,
                                            @StrengthDescription, @WeaknessDescription,
                                            @VideoPath, @ImagePath, @FormerClubs, @PrimaryPosition_ID, @SecondaryPosition_ID, @CurrentClubPrimaryPosition_ID, @CurrentClubSecondaryPosition_ID, @UserCredentials_ID);
                                        SELECT CAST(SCOPE_IDENTITY() as int)";

                        int player_ID = conn.Query<int>(playerSQL, new { Firstname = entity.FirstName, Lastname = entity.LastName, entity.Email, entity.Day, entity.Month, entity.Year, entity.Country, entity.Height, entity.Weight,
                                                      entity.BodyFat, entity.PreferredHand, entity.CurrentClub, entity.Accomplishments, entity.Statistic, entity.StrengthDescription, entity.WeaknessDescription,
                                                      entity.VideoPath, entity.ImagePath, entity.FormerClubs,
                                                      PrimaryPosition_ID = primaryPosition_ID, SecondaryPosition_ID = secondaryPosition_ID, CurrentClubPrimaryPosition_ID = currentClubPrimaryPosition_ID,
                                                        CurrentClubSecondaryPosition_ID = currentClubSecondaryPosition_ID, UserCredentials_ID = userCredentials_ID}, transaction: tran).Single();

                        //Player strengths
                        if (entity.StrengthList.Count > 0) {
                            foreach (string strength in entity.StrengthList) {

                                //Return strength ID
                                string strengthSQL = @"Select id from Strength where name = @Name";
                                int strength_ID = conn.Query<int>(strengthSQL, new { Name = strength }, transaction: tran).FirstOrDefault();

                                if(strength_ID != 0) {
                                
                                    //Insert PlayerStrength
                                    string playerStrengthSQL = @"INSERT INTO PlayerStrength (Player_ID, Strength_ID) 
                                        VALUES (@Player_ID, @Strength_ID)";

                                    _rowCountList.Add(conn.Execute(playerStrengthSQL, new {
                                        Player_ID = player_ID,
                                        Strength_ID = strength_ID
                                    }, transaction: tran));
                                } 
                            }
                        }

                        //Player weaknesses
                        if (entity.WeaknessList.Count > 0) {
                            foreach (string weakness in entity.WeaknessList) {

                                //Return weakness ID
                                string weaknessSQL = @"Select id from Weakness where name = @Name";
                                int weakness_ID = conn.Query<int>(weaknessSQL, new { Name = weakness }, transaction: tran).FirstOrDefault();

                                if (weakness_ID != 0) {

                                    //Insert PlayerWeakness
                                    string playerWeaknessSQL = @"INSERT INTO PlayerWeakness (Player_ID, Weakness_ID) 
                                        VALUES (@Player_ID, @Weakness_ID)";

                                    _rowCountList.Add(conn.Execute(playerWeaknessSQL, new {
                                        Player_ID = player_ID,
                                        Weakness_ID = weakness_ID
                                    }, transaction: tran));
                                }
                            }
                        }
                        
                        if (entity.NationalTeamList.Count > 0) {
                            foreach (NationalTeam nt in entity.NationalTeamList) {

                                //Return national team position ID
                                string nationalTeamPositionSQL = @"Select id from position where name = @Position";
                                int nationalTeamPosition_ID = conn.Query<int>(nationalTeamPositionSQL, new { Position = nt.Position }, transaction: tran).FirstOrDefault();

                                if (nationalTeamPosition_ID != 0) {

                                    //Insert NationalTeam
                                    string nationalTeamSQL = @"INSERT INTO NationalTeam (Name, Appearances, Statistic, Player_ID, Position_ID) 
                                        VALUES (@Name, @Appearances, @Statistic, @Player_ID, @Position_ID)";

                                    _rowCountList.Add(conn.Execute(nationalTeamSQL, new {
                                        Name = nt.Name,
                                        Appearances = nt.Appearances,
                                        Statistic = nt.Statistic,
                                        Player_ID = player_ID,
                                        Position_ID = nationalTeamPosition_ID
                                    }, transaction: tran));
                                }
                            }
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
                        
                    //}
                    //catch (SqlException e) {

                    //    tran.Rollback();
                    //    p.ErrorMessage = ErrorHandling.Exception(e);                 
                    //}
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

            Player player = new Player();

            using (var conn = Connection()) {

                try {
                    player = conn.QuerySingle<Player>("select * from Player where email = @email", new { email });

                    if (player.Id < 1) {
                        player.ErrorMessage = "The player does not exist";
                    }
                    else {
                        player.ErrorMessage = "";
                    }
                }
                catch (SqlException e) {
                    player.ErrorMessage = ErrorHandling.Exception(e);
                }

            }
            return player;
        }
        
        public Player GetById(int id) {
            throw new NotImplementedException();
        }

        public UserCredentials getCredentialsByEmail(string email) {

            int id = 0;
            UserCredentials UC = new UserCredentials();
            using (var conn = Connection()) {
                try {
                    id = conn.Query("select club.id from Club where email=@email", new { email }).Single();
                    if (id < 0) {
                        id = conn.Query("select player.id from Player where email=@email", new { email }).Single();
                        UC.Club = false;
                    }
                    if (id < 0) {
                        return null;
                    }
                    else {
                        UC = conn.QuerySingle<UserCredentials>("select * from Usercredentials where usercredentials.id=@id", new { id });
                        return UC;
                    }
                }
                catch (SqlException e) {
                    return null;
                }
            }
           
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
