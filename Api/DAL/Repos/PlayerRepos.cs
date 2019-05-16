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
                        string primaryPositionSQL = @"Select id from position where positionName = @PrimaryPosition";
                        int? primaryPosition_ID = conn.Query<int>(primaryPositionSQL, new { PrimaryPosition = entity.PrimaryPosition }, transaction: tran).FirstOrDefault();

                        if(primaryPosition_ID == 0) {
                            primaryPosition_ID = null;
                        }

                        //Return secondary position ID
                        string secondaryPositionSQL = @"Select id from position where positionName = @SecondaryPosition";
                        int? secondaryPosition_ID = conn.Query<int>(secondaryPositionSQL, new { SecondaryPosition = entity.SecondaryPosition }, transaction: tran).FirstOrDefault();

                        if (secondaryPosition_ID == 0) {
                            secondaryPosition_ID = null;
                        }

                        //Return current club primary position ID
                        string currentClubPrimaryPositionSQL = @"Select id from position where positionName = @CurrentClubPrimaryPosition";
                        int? currentClubPrimaryPosition_ID = conn.Query<int>(currentClubPrimaryPositionSQL, new { CurrentClubPrimaryPosition  = entity.CurrentClubPrimaryPosition }, transaction: tran).FirstOrDefault();

                        if (currentClubPrimaryPosition_ID == 0) {
                            currentClubPrimaryPosition_ID = null;
                        }

                        //Return current club secondary position ID
                        string currentClubSecondaryPositionSQL = @"Select id from position where positionName = @CurrentClubSecondaryPosition";
                        int? currentClubSecondaryPosition_ID = conn.Query<int>(currentClubSecondaryPositionSQL, new { CurrentClubSecondaryPosition = entity.CurrentClubSecondaryPosition }, transaction: tran).FirstOrDefault();

                        if (currentClubSecondaryPosition_ID == 0) {
                            currentClubSecondaryPosition_ID = null;
                        }

                        //Insert player and return player_ID
                        string playerSQL = @"INSERT INTO Player (Firstname, Lastname, Email, Day, Month, Year, Country, League, Height, Weight, Bodyfat, PreferredHand, CurrentClub, Accomplishments, Statistic, StrengthDescription, 
                                            WeaknessDescription, VideoPath, ImagePath, FormerClubs, ContractStatus, ContractExpired, InjuryStatus, InjuryExpired, InjuryDescription, IsAvailable, PrimaryPosition_ID, SecondaryPosition_ID, CurrentClubPrimaryPosition_ID, CurrentClubSecondaryPosition_ID, UserCredentials_ID) 
                                        VALUES (@Firstname, @Lastname, @Email, @Day, @Month, @Year, @Country, @League, @Height, @Weight, @Bodyfat, @PreferredHand, @CurrentClub, @Accomplishments, @Statistic,
                                            @StrengthDescription, @WeaknessDescription, @VideoPath, @ImagePath, @FormerClubs, @ContractStatus, @ContractExpired, @InjuryStatus, 
                                            @InjuryExpired, @InjuryDescription, @IsAvailable, @PrimaryPosition_ID, @SecondaryPosition_ID, @CurrentClubPrimaryPosition_ID, @CurrentClubSecondaryPosition_ID, @UserCredentials_ID);
                                        SELECT CAST(SCOPE_IDENTITY() as int)";

                        int player_ID = conn.Query<int>(playerSQL, new { Firstname = entity.FirstName, Lastname = entity.LastName, entity.Email, entity.Day, entity.Month, entity.Year, entity.Country, entity.League, entity.Height, entity.Weight,
                                                      entity.Bodyfat, entity.PreferredHand, entity.CurrentClub, entity.Accomplishments, entity.Statistic, entity.StrengthDescription, entity.WeaknessDescription,
                                                      entity.VideoPath, entity.ImagePath, entity.FormerClubs, entity.ContractStatus, entity.ContractExpired, entity.InjuryStatus, entity.InjuryExpired, entity.InjuryDescription, entity.IsAvailable,
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
                                string nationalTeamPositionSQL = @"Select id from position where positionName = @Position";
                                int nationalTeamPosition_ID = conn.Query<int>(nationalTeamPositionSQL, new { Position = nt.PositionName }, transaction: tran).FirstOrDefault();

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
            List<Player> playerList = new List<Player>();
            using (var conn = Connection()) {
                //try {
                playerList = conn.Query<Player, string, string, string, string, string, Player>("select p.*, pp.positionName, sp.positionName, cp.positionName, cs.positionName, s.positionName from player p" +
                " left join Position pp on pp.id = p.primaryPosition_ID" +
                " left join Position sp on sp.id = p.secondaryPosition_ID" +
                " left join Position cp on cp.id = p.currentClubPrimaryPosition_ID" +
                " left join Position cs on cs.id = p.currentCLubSecondaryPosition_ID" +
                " left join playerstrength ps on ps.player_id = p.id" +
                " left join strength s on s.id = ps.strength_ID where isAvailable = 1",
                (playerinside, pp, sp, cp, cs, strength) => {
                    playerinside.PrimaryPosition = pp;
                    playerinside.SecondaryPosition = sp;
                    playerinside.CurrentClubPrimaryPosition = cp;
                    playerinside.CurrentClubSecondaryPosition = cs;
                    return playerinside;
                }, splitOn: "positionName,positionName,positionName,positionName").ToList();
                return playerList;
                //}
                //catch(SqlException e) {

                //}
            }
        }



        public Player GetByEmail(string email) {
            Player player = new Player();
            string sql =
                " select p.*, pp.positionname, sp.positionname, cp.positionname, cs.positionname from player p" +
                " left join Position pp on pp.id = p.primaryPosition_ID" +
                " left join Position sp on sp.id = p.secondaryPosition_ID" +
                " left join Position cp on cp.id = p.currentClubPrimaryPosition_ID" +
                " left join Position cs on cs.id = p.currentCLubSecondaryPosition_ID where p.email = @email;" +

                " select s.name from Player p " +
                " inner join playerstrength ps on ps.player_id = p.id " +
                " inner join strength s on s.id = ps.strength_ID where p.email = @email;" +

                " select w.name from Player p " +
                " inner join playerweakness pw on pw.player_id = p.id " +
                " inner join weakness w on w.id = pw.weakness_ID where p.email = @email;" +

                " select nt.name, nt.appearances, nt.statistic, po.positionname from Player p" +
                " inner join NationalTeam nt on nt.player_Id = p.id" +
                " inner join Position po on po.id = nt.position_ID where p.email = @email;";

            using (var conn = Connection()) {
                //try {

                using (var multi = conn.QueryMultiple(sql, new { email })) {
                    player = multi.Read<Player>().First();
                    player.StrengthList = multi.Read<string>().ToList();
                    player.WeaknessList = multi.Read<string>().ToList();
                    player.NationalTeamList = multi.Read<NationalTeam>().ToList();
                }
                return player;
                //}
                //catch(SqlException) {

                //}
            }


            //Player player = new Player();
            //using (var conn = Connection()) {
            //    //try {
            //    Player result = null;
            //    conn.Query<Player, string, string, string, string, string, string, Player>("select p.*, pp.name, sp.name, cp.name, cs.name, s.name, w.name  from player p" +
            //        " left join Position pp on pp.id = p.primaryPosition_ID" +
            //        " left join Position sp on sp.id = p.secondaryPosition_ID" +
            //        " left join Position cp on cp.id = p.currentClubPrimaryPosition_ID" +
            //        " left join Position cs on cs.id = p.currentCLubSecondaryPosition_ID" +
            //        " left join playerstrength ps on ps.player_id = p.id" +
            //        " left join strength s on s.id = ps.strength_ID" +
            //        " left join playerweakness pw on pw.player_id = p.id" +
            //        " left join weakness w on w.id = pw.weakness_ID where p.email = @email",
            //        (playerinside, pp, sp, cp, cs, strength, weakness) => {
            //            Player p = null;
            //            if (result == null) {
            //                result = BuildPlayer(p, playerinside, pp, sp, cp, cs);
            //            }
            //            if(strength != null) {
            //                result.StrengthList.Add(strength);
            //            }
            //            else if(weakness != null) {
            //                result.WeaknessList.Add(weakness);
            //            }

            //            return result;
            //        }, new { email }, splitOn: "name,name,name,name,name");
            //    player = result;
            //    result.NationalTeamList = GetPlayerNationalTeams(result, conn);
            //    //player.StrengthList = GetPlayerStrengthList(player, conn);
            //    //result.WeaknessList = GetPlayerWeaknessList(result, conn);


            //    //}
            //    //catch (SqlException e) {
            //    //    player.ErrorMessage = ErrorHandling.Exception(e);
            //    //}
            //}
            //return player;
        }

        public Player GetById(int id) {
            Player player = new Player();
            string sql =
                " select p.*, pp.positionname, sp.positionname, cp.positionname, cs.positionname from player p" +
                " left join Position pp on pp.id = p.primaryPosition_ID" +
                " left join Position sp on sp.id = p.secondaryPosition_ID" +
                " left join Position cp on cp.id = p.currentClubPrimaryPosition_ID" +
                " left join Position cs on cs.id = p.currentCLubSecondaryPosition_ID where p.id = @id;" +

                " select s.name from Player p " +
                " inner join playerstrength ps on ps.player_id = p.id " +
                " inner join strength s on s.id = ps.strength_ID where p.id = @id;" +

                " select w.name from Player p " +
                " inner join playerweakness pw on pw.player_id = p.id " +
                " inner join weakness w on w.id = pw.weakness_ID where p.id = @id;" +

                " select nt.name, nt.appearances, nt.statistic, po.positionname from Player p" +
                " inner join NationalTeam nt on nt.player_Id = p.id" +
                " inner join Position po on po.id = nt.position_ID where p.id = @id;";

            using (var conn = Connection()) {
                //try {
                using (var multi = conn.QueryMultiple(sql, new { id })) {
                    player = multi.Read<Player>().First(); 
                    player.StrengthList = multi.Read<string>().ToList();
                    player.WeaknessList = multi.Read<string>().ToList();
                    player.NationalTeamList = multi.Read<NationalTeam>().ToList();
                }
                return player;
                //}
                //catch(SqlException) {

                //}
            }

            //using (var conn = Connection()) {
            //    //try {
            //    player = conn.Query<Player, string, string, string, string, Player>("select p.*, pp.name, sp.name, cp.name, cs.name from player p" +
            //        " left join Position pp on pp.id = p.primaryPosition_ID" +
            //        " left join Position sp on sp.id = p.secondaryPosition_ID" +
            //        " left join Position cp on cp.id = p.currentClubPrimaryPosition_ID" +
            //        " left join Position cs on cs.id = p.currentCLubSecondaryPosition_ID where p.id = @id",
            //    (playerinside, pp, sp, cp, cs) => {
            //        playerinside.PrimaryPosition = pp;
            //        playerinside.SecondaryPosition = sp;
            //        playerinside.CurrentClubPrimaryPosition = cp;
            //        playerinside.CurrentClubSecondaryPosition = cs;
            //        return playerinside;
            //    }, new { id }, splitOn: "name,name,name,name").Single();

            //    player.NationalTeamList = GetPlayerNationalTeams(player, conn);
            //    player.StrengthList = GetPlayerStrengthList(player, conn);
            //    player.WeaknessList = GetPlayerWeaknessList(player, conn);
            //}
            //catch (SqlException e) {
            //    player.ErrorMessage = ErrorHandling.Exception(e);
            //}

            //}
            //return player;
        }

        public IEnumerable<Player> GetBySearchCriteria(string sqlStatement) {
            List<Player> playerList = new List<Player>();
            using (var conn = Connection()) {
                //try {
                    playerList = conn.Query<Player, string, string, Player>("select p.*, pp.positionName, sp.positionName from player p" +
                    " left join Position pp on pp.id = p.primaryPosition_ID" +
                    " left join Position sp on sp.id = p.secondaryPosition_ID where " + sqlStatement,
                    (playerinside, pp, sp) => {
                    playerinside.PrimaryPosition = pp;
                    playerinside.SecondaryPosition = sp;
                    return playerinside;
                    }, splitOn: "positionName,PositionName").ToList();
                //foreach (Player item in playerList) {
                //    item.StrengthList = GetPlayerStrengthList(item, conn);
                //}
                //}
                //catch(SqlException e) {

                //}
            }
            return playerList;
        }

        public UserCredentials getCredentialsByEmail(string email) {

            int id = 0;
            bool club = false;
            using (var conn = Connection()) {
                //try {
                //Select a club, if we find one we set UC.club to true, if not, we try to find a player, if we find one, we set uc.club to false 
                id = conn.Query<int>("select userCredentials_id from Club where email=@email", new { email }).FirstOrDefault();
                if (id != 0) {
                    club = true;
                }
                else if (id == 0) {
                    id = conn.Query<int>("select userCredentials_id from Player where email=@email", new { email }).FirstOrDefault();
                }

                //Checks if we found a player or a club. If found, we select their credentials from DB
                if (id == 0) {
                    return null;
                }
                else {
                    UserCredentials UC = conn.Query<UserCredentials>("select * from Usercredentials where id=@id", new { id }).FirstOrDefault();
                    UC.Club = club;
                    return UC;
                }
                //}
                //catch (SqlException e) {
                //    return null;
                //}
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

        // Helping method to build only NationalTeams on your player
        private List<NationalTeam> GetPlayerNationalTeams(Player player, IDbConnection conn) {
            player.NationalTeamList = conn.Query<NationalTeam, string, NationalTeam>("select nt.*, p.positionName from NationalTeam nt " +
                    " inner join Position p on p.id = nt.position_id where nt.player_id = @id", (nationalTeam, p) => { nationalTeam.PositionName = p; return nationalTeam; },
                    new { id = player.Id }, splitOn: "name").ToList();
            return player.NationalTeamList;
        }

        // Helping method to build only Strengths on your player
        private List<string> GetPlayerStrengthList(Player player, IDbConnection conn) {
            player.StrengthList = conn.Query<string>("select s.name from Strength s " +
                 "inner join PlayerStrength ps on ps.strength_id = s.id where ps.player_id = @id", new { id = player.Id }).ToList();
            return player.StrengthList;
        }

        // Helping method to build only Weakness on your player
        private List<string> GetPlayerWeaknessList(Player player, IDbConnection conn) {
            player.WeaknessList = conn.Query<string>("select w.name from Weakness w " +
                 "inner join PlayerWeakness pw on pw.weakness_id = w.id where pw.player_ID = @id", new { id = player.Id }).ToList();
            return player.WeaknessList;
        }

        private Player BuildPlayer(Player p, Player playerinside, string pp, string sp, string cp, string cs) {
             p = new Player {
                Id = playerinside.Id,
                FirstName = playerinside.FirstName,
                LastName = playerinside.LastName,
                Email = playerinside.Email,
                Day = playerinside.Day,
                Month = playerinside.Month,
                Year = playerinside.Year,
                Country = playerinside.Country,
                League = playerinside.League,
                Height = playerinside.Height,
                Weight = playerinside.Weight,
                Bodyfat = playerinside.Bodyfat,
                PreferredHand = playerinside.PreferredHand,
                CurrentClub = playerinside.CurrentClub,
                Accomplishments = playerinside.Accomplishments,
                Statistic = playerinside.Statistic,
                StrengthDescription = playerinside.StrengthDescription,
                WeaknessDescription = playerinside.WeaknessDescription,
                VideoPath = playerinside.VideoPath,
                ImagePath = playerinside.ImagePath,
                FormerClubs = playerinside.FormerClubs,
                ContractStatus = playerinside.ContractStatus,
                ContractExpired = playerinside.ContractExpired,
                InjuryStatus = playerinside.InjuryStatus,
                InjuryDescription = playerinside.InjuryDescription,
                InjuryExpired = playerinside.InjuryExpired,
                IsAvailable = playerinside.IsAvailable,
                PrimaryPosition = pp,
                SecondaryPosition = sp,
                CurrentClubPrimaryPosition = cp,
                CurrentClubSecondaryPosition = cs
            };
            return p;
        }
    }
}
