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

        public PlayerRepos(IConfiguration config) {
            _connString = config.GetConnectionString("DefaultConnection");
        }

        public Player Create(Player entity) {

            Player p = new Player();

            using (var conn = new SqlConnection(_connString)) {
                conn.Open();
                
                using (SqlTransaction tran = conn.BeginTransaction()) {
                    try {


                        //Return usercredentials ID
                        string userCredentialsSQL = @"INSERT INTO [UserCredentials] ([Hashpassword, Salt]) VALUES (@Hashpassword, @Salt); 
                                     SELECT CAST(SCOPE_IDENTITY() as int)";

                        var userCredentials_ID = conn.Query<int>(userCredentialsSQL, new { Hashpassword = entity.UserCredentials.HashPassword, Salt = entity.UserCredentials.Salt}).Single();

                       
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
                        
                        
                        //Insert Player
                        string playerSQL = @"INSERT INTO [Player] ([Firstname, Lastname, Email, Day, Month, Year, Country, Height, Weight, Bodyfat, PreferredHand, CurrentClub, StrengthDescription, 
                                        WeaknessDescription, VideoPath, ImagePath, PrimaryPosition_ID, SecondaryPosition_ID, CurrentClubPrimaryPosition_ID, CurrentClubPrimaryPosition_ID, UserCredentials_ID]) 
                                        VALUES (@Firstname, @Lastname, @Email, @Day, @Month, @Year, @Country, @Height, @Weight, @Bodyfat, @PreferredHand, @CurrentClub, @StrengthDescription, @WeaknessDescription,
                                        @VideoPath, @ImagePath, @PrimaryPosition_ID, @SecondaryPosition_ID, @CurrentClubPrimaryPosition_ID, @CurrentClubSecondaryPosition_ID, @UserCredentials_ID)";

                        var rowCount = conn.Execute(playerSQL, new { Firstname = entity.FirstName, Lastname = entity.LastName, entity.Email, entity.Day, entity.Month, entity.Year, entity.Country, entity.Height, entity.Weight,
                                                      entity.BodyFat, entity.PreferredHand, entity.CurrentClub, entity.StrengthDescription, entity.WeaknessDescription, entity.VideoPath, entity.ImagePath,
                                                      PrimaryPosition = primaryPosition_ID, SecondaryPosition = secondaryPosition_ID, CurrentClubPrimaryPosition = currentClubPrimaryPosition_ID, CurrentClubSecondaryPosition = currentClubSecondaryPosition_ID, UserCredentials_ID = userCredentials_ID}, tran);

                        
                        if (rowCount == 0) {
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
            throw new NotImplementedException();
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
