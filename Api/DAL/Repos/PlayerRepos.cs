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
    public class PlayerRepos : IPlayerRepository<Player> {
        
        public Func<IDbConnection> Connection { get; set; }

        public bool Create(Player entity) {

            List<int> _rowCountList = new List<int>();

            using (var conn = Connection()) {
                    
                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Set imagePath to default image
                        string imagePath = "https:\\localhost:44310\\Resources\\Files\\player-icon.png";
                        
                        //Insert player and return player_ID
                        string playerSQL = @"INSERT INTO Player (Firstname, Lastname, Email, Day, Month, Year, Country, League, Height, Weight, Bodyfat, PreferredHand, CurrentClub, Accomplishments, Statistic, StrengthDescription, 
                                            WeaknessDescription, VideoPath, ImagePath, FormerClubs, ContractStatus, ContractExpired, InjuryStatus, InjuryExpired, InjuryDescription, IsAvailable, PrimaryPosition, SecondaryPosition, CurrentClubPrimaryPosition, CurrentClubSecondaryPosition) 
                                        VALUES (@Firstname, @Lastname, @Email, @Day, @Month, @Year, @Country, @League, @Height, @Weight, @Bodyfat, @PreferredHand, @CurrentClub, @Accomplishments, @Statistic,
                                            @StrengthDescription, @WeaknessDescription, @VideoPath, @ImagePath, @FormerClubs, @ContractStatus, @ContractExpired, @InjuryStatus, 
                                            @InjuryExpired, @InjuryDescription, @IsAvailable, @PrimaryPosition, @SecondaryPosition, @CurrentClubPrimaryPosition, @CurrentClubSecondaryPosition);
                                        SELECT CAST(SCOPE_IDENTITY() as int)";

                        int player_ID = conn.Query<int>(playerSQL, new {
                            Firstname = entity.FirstName,
                            Lastname = entity.LastName,
                            entity.Email,
                            entity.Day,
                            entity.Month,
                            entity.Year,
                            entity.Country,
                            entity.League,
                            entity.Height,
                            entity.Weight,
                            entity.Bodyfat,
                            entity.PreferredHand,
                            entity.CurrentClub,
                            entity.Accomplishments,
                            entity.Statistic,
                            entity.StrengthDescription,
                            entity.WeaknessDescription,
                            entity.VideoPath,
                            ImagePath = imagePath,
                            entity.FormerClubs,
                            entity.ContractStatus,
                            entity.ContractExpired,
                            entity.InjuryStatus,
                            entity.InjuryExpired,
                            entity.InjuryDescription,
                            entity.IsAvailable,
                            entity.PrimaryPosition,
                            entity.SecondaryPosition,
                            entity.CurrentClubPrimaryPosition,
                            entity.CurrentClubSecondaryPosition,
                        }, transaction: tran).Single();



                        //Player strengths
                        if (entity.StrengthList.Count > 0) {
                            foreach (string strength in entity.StrengthList) {

                                //Return strength ID
                                string strengthSQL = @"Select id from Strength where name = @Name";
                                int strength_ID = conn.Query<int>(strengthSQL, new { Name = strength }, transaction: tran).FirstOrDefault();

                                if (strength_ID != 0) {

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

                                //Insert NationalTeam
                                string nationalTeamSQL = @"INSERT INTO NationalTeam (Name, Appearances, Statistic, Position, Player_ID) 
                                            VALUES (@Name, @Appearances, @Statistic, @Position, @Player_ID)";

                                _rowCountList.Add(conn.Execute(nationalTeamSQL, new {
                                    Name = nt.Name,
                                    Appearances = nt.Appearances,
                                    Statistic = nt.Statistic,
                                    Position = nt.Position,
                                    Player_ID = player_ID,
                                }, transaction: tran));
                            }
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

        public IEnumerable<Player> GetAll() {
            List<Player> playerList = new List<Player>();
            using (var conn = Connection()) {
                try {
                    playerList = conn.Query<Player>("select * from player where isAvailable = 1").ToList();
                    return playerList;
                }
                catch (SqlException ) {
                    return null;
                }
                
            }
        }

        public Player GetByEmail(string email) {
            Player player = new Player();
            string sql =
                " select p.* from player p where p.email = @email;" +

                " select s.name from Player p " +
                " inner join playerstrength ps on ps.player_id = p.id " +
                " inner join strength s on s.id = ps.strength_ID where p.email = @email;" +

                " select w.name from Player p " +
                " inner join playerweakness pw on pw.player_id = p.id " +
                " inner join weakness w on w.id = pw.weakness_ID where p.email = @email;" +

                " select nt.name, nt.appearances, nt.statistic, nt.position, nt.id from Player p" +
                " inner join NationalTeam nt on nt.player_Id = p.id where p.email = @email;";

            using (var conn = Connection()) {
                try {

                    using (var multi = conn.QueryMultiple(sql, new { email })) {
                        player = multi.Read<Player>().First();
                        player.StrengthList = multi.Read<string>().ToList();
                        player.WeaknessList = multi.Read<string>().ToList();
                        player.NationalTeamList = multi.Read<NationalTeam>().ToList();
                    }
                    return player;
                }
                catch (SqlException) {
                    return null;
                }
            }
        }

        public Player GetById(int id) {
            Player player = new Player();
            string sql =
                " select p.* from player p where p.id = @id;" +

                " select s.name from playerstrength ps " +
                " inner join strength s on s.id = ps.strength_ID where ps.player_id = @id;" +

                " select w.name from playerweakness pw " +
                " inner join weakness w on w.id = pw.weakness_ID where pw.player_id = @id;" +

                " select nt.name, nt.appearances, nt.statistic, nt.position, nt.id from NationalTeam nt where nt.player_id = @id;";

            using (var conn = Connection()) {
                    using (var multi = conn.QueryMultiple(sql, new { id })) {
                        player = multi.Read<Player>().First();
                        player.StrengthList = multi.Read<string>().ToList();
                        player.WeaknessList = multi.Read<string>().ToList();
                        player.NationalTeamList = multi.Read<NationalTeam>().ToList();
                    }
                    return player;
            }
        }

        public IEnumerable<Player> GetBySearchCriteria(string sqlStatement) {
            List<Player> playerList = new List<Player>();
       
              string sql = " select p.*, s.name from player p " +
                    "left join playerstrength ps on ps.player_id = p.id " +
                     "left join strength s on s.id = ps.strength_ID where " + sqlStatement;

            using (var conn = Connection()) {
                Player result = null;

                conn.Query<Player, string, Player>(sql,
                    (playerinside, strength) => {

                        Player p = null;
                        if (!playerList.Any(pl => pl.Id == playerinside.Id)) {
                            p = BuildPlayer(playerinside);
                            result = p;
                            playerList.Add(result);
                        }
                        else {
                            result = playerList.Single(pl => pl.Id == playerinside.Id);
                        }
                        if (strength != null) {
                            result.StrengthList.Add(strength);
                        }
                        return result;
                    }, splitOn: "name");    
            }
            return playerList;
        }

        public string GetEmailByID(int id) {
            string email = "";
            using (var conn = Connection()) {
                email = conn.QueryFirstOrDefault<string>("select email from Player where id = " + id);
            }
            return email;
        }

        public bool UpdateInfo(Player entity) {

            bool res = false;

            int rowCount = 0;

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Update player
                        string updatePlayerSQL = @"Update Player Set Firstname = @FirstName, Lastname = @LastName, Day = @Day, Month = @Month, Year = @Year, Country = @Country, isAvailable = @isAvailable
                                                        Where ID = @ID";
                        rowCount = conn.Execute(updatePlayerSQL, new {
                            entity.FirstName,
                            entity.LastName,
                            entity.Day,
                            entity.Month,
                            entity.Year,
                            entity.Country,
                            entity.IsAvailable,
                            entity.Id
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

        public bool UpdateAdditionalInfo(Player entity) {

            bool res = false;

            int rowCount = 0;
            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Update player additional info
                        string updatePlayerSQL = @"Update Player Set League = @League, Height = @Height, Weight = @Weight, Bodyfat = @Bodyfat,
                                                                    PreferredHand = @PreferredHand, ContractStatus = @ContractStatus,
                                                                    ContractExpired = @ContractExpired, InjuryStatus = @InjuryStatus, InjuryExpired = @InjuryExpired, 
                                                                    InjuryDescription = @InjuryDescription, PrimaryPosition = @PrimaryPosition, 
                                                                    SecondaryPosition = @SecondaryPosition
                                                                 Where ID = @ID";
                        rowCount = conn.Execute(updatePlayerSQL, new {
                            entity.League,
                            entity.Height,
                            entity.Weight,
                            entity.Bodyfat,
                            entity.PreferredHand,
                            entity.ContractStatus,
                            entity.ContractExpired,
                            entity.InjuryStatus,
                            entity.InjuryExpired,
                            entity.InjuryDescription,
                            entity.PrimaryPosition,
                            entity.SecondaryPosition,
                            entity.Id
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

        public bool DeleteStrengthsAndWeaknesses(int player_ID) {

            bool res = false;

            List<int> _rowCountList = new List<int>();

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Check if player weakness exist in DB
                        string playerWeaknessSQL = @"Select * from PlayerWeakness where player_ID = @Player_ID";
                        int weaknesscheck = conn.Query<int>(playerWeaknessSQL, new { Player_ID = player_ID }, transaction: tran).FirstOrDefault();

                        if (weaknesscheck != 0) {

                            //Delete playerWeakness
                            string deletePlayerWeaknessSQL = @"Delete From PlayerWeakness Where Player_ID = @Player_ID";

                            _rowCountList.Add(conn.Execute(deletePlayerWeaknessSQL, new {
                                player_ID
                            }, transaction: tran));
                        }

                        //Check if player strength exist in DB
                        string playerStrengthSQL = @"Select * from playerStrength where Player_ID = @Player_ID";
                        int strengthcheck = conn.Query<int>(playerStrengthSQL, new { Player_ID = player_ID }, transaction: tran).FirstOrDefault();

                        if (strengthcheck != 0) {

                            //Delete playerStrength
                            string deletePlayerStrengthSQL = @"Delete From PlayerStrength Where player_ID = @Player_ID";

                            _rowCountList.Add(conn.Execute(deletePlayerStrengthSQL, new {
                                player_ID
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

        public bool UpdateStrengthsAndWeaknesses(Player entity) {

            bool res = false;

            List<int> _rowCountList = new List<int>();

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Update player
                        string updatePlayerSQL = @"Update Player Set StrengthDescription = @StrengthDescription, WeaknessDescription = @WeaknessDescription
                                                                 Where ID = @ID";


                        _rowCountList.Add(conn.Execute(updatePlayerSQL, new {
                            entity.StrengthDescription,
                            entity.WeaknessDescription,
                            entity.Id
                        }, transaction: tran));
                        
                        //Weaknesses
                        if (entity.WeaknessList.Count > 0) {

                            foreach (string weakness in entity.WeaknessList) {

                                //Return weakness ID
                                string weaknessSQL = @"Select id from Weakness where name = @Name";
                                int weakness_ID = conn.Query<int>(weaknessSQL, new { Name = weakness }, transaction: tran).FirstOrDefault();

                                if (weakness_ID != 0) {

                                    //Update PlayerWeakness
                                    string playerWeaknessSQL = @"Insert into PlayerWeakness (Player_ID, Weakness_ID) 
                                                                Values (@Player_ID, @Weakness_ID)";

                                    _rowCountList.Add(conn.Execute(playerWeaknessSQL, new {
                                        Player_ID = entity.Id,
                                        Weakness_ID = weakness_ID
                                    }, transaction: tran));
                                }
                            }
                        }

                        //Strengths
                        if (entity.StrengthList.Count > 0) {

                            foreach (string strength in entity.StrengthList) {

                                //Return strength ID
                                string strengthSQL = @"Select id from Strength where name = @Name";
                                int strength_ID = conn.Query<int>(strengthSQL, new { Name = strength }, transaction: tran).FirstOrDefault();

                                if (strength_ID != 0) {

                                    //Update PlayerStrength
                                    string playerStrengthSQL = @"Insert into PlayerStrength (Player_ID, Strength_ID) 
                                                                Values (@Player_ID, @Strength_ID)";

                                    _rowCountList.Add(conn.Execute(playerStrengthSQL, new {
                                        Player_ID = entity.Id,
                                        Strength_ID = strength_ID
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

        public bool UpdateSportCV(Player entity) {

            bool res = false;

            List<int> _rowCountList = new List<int>();

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {
                        
                        //Update player sport cv
                        string updatePlayerSQL = @"Update Player Set CurrentClub = @CurrentClub, Accomplishments = @Accomplishments,
                                                                    Statistic = @Statistic, FormerClubs = @FormerClubs, CurrentClubPrimaryPosition = @CurrentClubPrimaryPosition,
                                                                    CurrentClubSecondaryPosition = @CurrentClubSecondaryPosition
                                                                 Where ID = @ID";
                        _rowCountList.Add(conn.Execute(updatePlayerSQL, new {
                            entity.CurrentClub,
                            entity.Accomplishments,
                            entity.Statistic,
                            entity.FormerClubs,
                            entity.CurrentClubPrimaryPosition,
                            entity.CurrentClubSecondaryPosition,
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

        public bool UpdateProfile(Player entity) {

            bool res = false;

            int rowCount = 0;

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Update player
                        string updateClubSQL = @"Update Player Set ImagePath = @ImagePath Where ID = @ID";

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

        public bool UpdateVideo(Player entity) {

            bool res = false;

            int rowCount = 0;

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Update player
                        string updateClubSQL = @"Update Player Set VideoPath = @VideoPath Where ID = @ID";

                        rowCount = conn.Execute(updateClubSQL, new {
                            entity.VideoPath,
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

        public bool AddNationalTeam(NationalTeam entity, int player_ID) {

            bool res = false;

            int rowCount = 0;
            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Insert National team
                        string nationalTeamSQL = @"INSERT INTO NationalTeam (Name, Appearances, Position, Statistic, Player_ID) 
                                        VALUES (@Name, @Appearances, @Position, @Statistic, @Player_ID)";

                        rowCount = conn.Execute(nationalTeamSQL, new {
                            entity.Name,
                            entity.Appearances,
                            entity.Position,
                            entity.Statistic,
                            Player_ID = player_ID
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

        public bool DeleteNationalTeam(int nationalTeam_ID, int player_ID) {

            bool res = false;

            int rowCount = 0;

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Delete National Team
                        string deleteNationalTeamSQL = @"Delete From NationalTeam Where ID = @ID AND player_ID = @Player_ID";

                        rowCount = conn.Execute(deleteNationalTeamSQL, new {
                            ID = nationalTeam_ID,
                            player_ID,
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

        public bool Delete(int id) {

            bool res = false;

            int rowCount = 0;

            using (var conn = Connection()) {

                using (IDbTransaction tran = conn.BeginTransaction()) {
                    try {

                        //Delete player
                        string deletePlayerSQL = @"Delete From Player Where ID = @ID";

                        rowCount = conn.Execute(deletePlayerSQL, new {
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

        private Player BuildPlayer(Player playerinside) {
            return new Player {
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
                PrimaryPosition = playerinside.PrimaryPosition,
                SecondaryPosition = playerinside.SecondaryPosition,
                CurrentClubPrimaryPosition = playerinside.CurrentClubPrimaryPosition,
                CurrentClubSecondaryPosition = playerinside.CurrentClubSecondaryPosition
            };
        }

        public List<NationalTeam> GetNationalTeams(int id) {
            List<NationalTeam> ntl = new List<NationalTeam>();

            using (var conn = Connection()) {

                try {

                string getNationalTeamsSQL = "Select * from NationalTeam where Player_ID = @Player_ID";

                ntl = conn.Query<NationalTeam>(getNationalTeamsSQL, new { Player_ID = id }).ToList();

                }
                catch (SqlException) {
                }
            }
            return ntl;
        }
    }
}
