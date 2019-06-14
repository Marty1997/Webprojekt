using Api.DAL;
using Api.DAL.Entities;
using Api.DAL.Repos;
using Api.DataTransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.BusinessLogic {

    public class ClubLogic {
        private readonly IClubRepository<Club> _clubRepos;
        private readonly IPlayerRepository<Player> _playerRepos;
        private readonly Account _account;
        private readonly UserCredentialsLogic _userCredentialsLogic;
        private readonly Authentication _authentication;

        public ClubLogic(Account account, IClubRepository<Club> clubRepos, IPlayerRepository<Player> playerRepos, UserCredentialsLogic userCredentialsLogic, Authentication authentication) {
            _clubRepos = clubRepos;
            _playerRepos = playerRepos;
            _account = account; ;
            _userCredentialsLogic = userCredentialsLogic;
            _authentication = authentication;
        }
        
        public Club Create(Club entity) {
            entity.UserCredentials = _userCredentialsLogic.Create(entity.Password);
            return _clubRepos.Create(entity);
        }

        public bool UpdateInfo(Club entity) {
            return _clubRepos.UpdateInfo(entity);
        }

        public bool UpdateTrainingHours(TrainingHours entity, int club_ID) {
            return _clubRepos.UpdateTrainingHours(entity, club_ID);
        }

        public bool AddSquadPlayer(SquadPlayer entity, int club_ID) {
            return _clubRepos.AddSquadPlayer(entity, club_ID);
        }

        public bool AddOpenPosition(JobPosition entity, int club_ID) {
            return _clubRepos.AddOpenPosition(entity, club_ID);
        }

        public bool UpdateStaff(Club entity) {
            return _clubRepos.UpdateStaff(entity);
        }

        public bool UpdateValuesAndPreferences(Club entity) {
            return _clubRepos.UpdateValuesAndPreferences(entity);
        }

        public bool UpdateProfile(Club entity) {
            return _clubRepos.UpdateProfile(entity);
        }

        public bool UpdateFacility(Club entity) {
            return _clubRepos.UpdateFacility(entity);
        }

        public bool DeleteJobPosition(int jobPosition_ID, int club_ID) {
            return _clubRepos.DeleteJobPosition(jobPosition_ID, club_ID);
        }

        public bool DeleteFacilityImage(string imagePath, int club_ID) {
            return _clubRepos.DeleteFacilityImage(imagePath, club_ID);
        }

        public bool DeleteTrainingHours(string name, int club_ID) {
            return _clubRepos.DeleteTrainingHours(name, club_ID);
        }

        public bool DeleteSquadPlayer(int squadPlayer_ID, int club_ID) {
            return _clubRepos.DeleteSquadPlayer(squadPlayer_ID, club_ID);
        }

        public bool DeleteValuesAndPreferences(int club_ID) {
            return _clubRepos.DeleteValuesAndPreferences(club_ID);
        }

        public bool DeleteClub(int club_ID) {
            return _clubRepos.Delete(club_ID);
        }

        public Club GetById(int id) {
            return _clubRepos.GetById(id);
        }

        /**
         * Search for clubs based on the search criteria
         * Only gets neccessary club info based on the search criteria
         * Sorts the list based on Match Percentage and returns the list
         */ 
        public List<Club> HandleClubSearchAlgorithm(ClubSearchCriteria criterias, int id) {
            string sql = "";
            string sqlPreference = "";
            string sqlValue = "";
            string sqlJobposition = "";
            List<Club> clubs = new List<Club>();

            // If no criteria is selected all clubs is returned
            // Since no criteria is selected, all clubs match 100%
            if(criterias.Country == null && criterias.League == null && 
                criterias.Position == null && criterias.PreferencesList.Count == 0 && 
                criterias.Season == null && criterias.ValuesList.Count == 0) {
                return (List<Club>)_clubRepos.GetAll();
            }

            // Country, league and position is a must-match when selected
            // Get all clubs with matching league, country and/or position
            if(criterias.Country != null || criterias.League != null || criterias.Position != null) {
                sql += " c.isAvailable = 1 ";
                if(criterias.League != null) {
                    sql += " and c.league = '" + criterias.League + "' and isavailable = 1 ";
                }

                if(criterias.Country != null) {
                    sql += " and c.country = '" + criterias.Country + "' and isavailable = 1 ";
                }

                if(criterias.Position != null) {
                    sql += GetJobpositionSql(criterias);
                }

                clubs = _clubRepos.GetBySearchCriteriaWithJobPosition(sql).ToList();
            }
            // If Country, League and Position is not selected as a criteria
            // We continue to match with the 'less important' criterias

            // If only preference, season and value is selected
            else if (criterias.PreferencesList.Count > 0 && criterias.Season != null && criterias.ValuesList.Count > 0) {
                sqlPreference = GetPreferenceSql(criterias);
                sqlJobposition = GetJobpositionSql(criterias);
                sqlValue = GetValueSql(criterias);

                clubs = _clubRepos.GetBySearchCriteriaWithJobPositionPreferenceValue(sqlJobposition, sqlPreference, sqlValue).ToList();
            }
            // If only season and value is selected
            else if (criterias.Season != null && criterias.ValuesList.Count > 0) {
                sqlJobposition = GetJobpositionSql(criterias);
                sqlValue = GetValueSql(criterias);

                clubs = _clubRepos.GetBySearchCriteriaWithJobPoisitionValue(sqlJobposition, sqlValue).ToList();
            }
            // If only season and preference is selected
            else if (criterias.Season != null && criterias.PreferencesList.Count > 0) {
                sqlJobposition = GetJobpositionSql(criterias);
                sqlPreference = GetPreferenceSql(criterias);

                clubs = _clubRepos.GetBySearchCriteriaWithJobPoisitionPreference(sqlJobposition, sqlPreference).ToList();
            }
            // If only preference and value is selected
            else if (criterias.PreferencesList.Count > 0 && criterias.ValuesList.Count > 0) {
                sqlJobposition = GetJobpositionSql(criterias);
                sqlPreference = GetPreferenceSql(criterias);
                sqlValue = GetValueSql(criterias);

                clubs = _clubRepos.GetBySearchCriteriaWithJobPositionPreferenceValue(sqlJobposition, sqlPreference, sqlValue).ToList();
            }
            // If only season is selected
            else if (criterias.Season != null) {
                sqlJobposition = GetJobpositionSql(criterias);

                clubs = _clubRepos.GetBySearchCriteriaWithJobPosition(sqlJobposition).ToList();
            }
            // If only preference is selected
            else if (criterias.PreferencesList.Count > 0) {
                sqlJobposition = GetJobpositionSql(criterias);
                sqlPreference = GetPreferenceSql(criterias);

                clubs = _clubRepos.GetBySearchCriteriaWithJobPoisitionPreference(sqlJobposition, sqlPreference).ToList();
            }
            // If only value is selected
            else if (criterias.ValuesList.Count > 0) {
                sqlJobposition = GetJobpositionSql(criterias);
                sqlValue = GetValueSql(criterias);

                clubs = _clubRepos.GetBySearchCriteriaWithJobPoisitionValue(sqlJobposition, sqlValue).ToList();
            }
            // When the clubs list is build it is ready to be sorted by match percentage
            // Since we match player with open job positions, we need to get the player first
            Player player = _playerRepos.GetById(id);
            // Calculate match percentage, sort by match percentage and return the list
            clubs = CalculateCriteriaMatchPercentage(clubs, criterias, player);
            SortListByPercentage sort = new SortListByPercentage();
            clubs.Sort(sort.CompareClub);
            return clubs;
        }

        /**
        * Helping method used to calculate match percentage
        * If criteria is not null, amountOfCriterias + 1
        * If criteria match with club, amountofMatches + 1
        */
        private List<Club> CalculateCriteriaMatchPercentage(List<Club> clubs, ClubSearchCriteria criterias, Player player) {
            foreach (Club club in clubs) {
                int amountOfCriterias = 0; // how many criterias is selected
                int amountOfMatches = 0; // how many criterias matches with club
                if (criterias.Country != null) {
                    amountOfCriterias++;
                    if(criterias.Country == club.Country) {
                        amountOfMatches++;
                    }
                }
                if(criterias.League != null) {
                    amountOfCriterias++;
                    if(criterias.League == club.League) {
                        amountOfMatches++;
                    }
                }
                if(club.JobPositionsList.Count > 0) {

                    int playerAge = DateTime.Now.Year - player.Year;

                    foreach (JobPosition jobPosition in club.JobPositionsList) {
                        if(jobPosition.Position != null) {
                            amountOfCriterias++;
                            if (player.PrimaryPosition == jobPosition.Position) {
                                amountOfMatches++;
                            }
                        }
                        if (criterias.Position != null) {
                            amountOfCriterias++;
                            if (criterias.Position == jobPosition.Position) {
                                amountOfMatches++;
                            }
                        }
                        if (jobPosition.Season != null) {
                            amountOfCriterias++;
                            if (criterias.Season == jobPosition.Season) {
                                amountOfMatches++;
                            }
                        }
                        if(jobPosition.League != null) {
                            amountOfCriterias++;
                            if (player.League == jobPosition.League) {
                                amountOfMatches++;
                            }
                        }
                        if(jobPosition.PreferredHand != null) {
                            amountOfCriterias++;
                            if (player.PreferredHand == jobPosition.PreferredHand) {
                                amountOfMatches++;
                            }
                        }
                        if(jobPosition.Height != null) {
                            amountOfCriterias++;
                            if (player.Height >= jobPosition.Height) {
                                amountOfMatches++;
                            }
                        }
                        if(jobPosition.MinAge != null) {
                            amountOfCriterias++;
                            if (playerAge > jobPosition.MinAge) {
                                amountOfMatches++;
                            }
                        }
                        if(jobPosition.MaxAge != null) {
                            amountOfCriterias++;
                            if (playerAge < jobPosition.MaxAge) {
                                amountOfMatches++;
                            }
                        }
                        if(jobPosition.ContractStatus != null) {
                            amountOfCriterias++;
                            if(player.ContractStatus == jobPosition.ContractStatus) {
                                amountOfMatches++;
                            }
                        }
                        if(jobPosition.StrengthsList.Count > 0) {
                            foreach (string jobStrength in jobPosition.StrengthsList) {
                                amountOfCriterias++;
                                foreach (string playerStrength in player.StrengthList) {
                                    if(playerStrength == jobStrength) {
                                        amountOfMatches++;
                                    }
                                }
                            }
                        }
                    }
                }
                if(criterias.PreferencesList.Count > 0) {
                    foreach (string criteriaPreference in criterias.PreferencesList) {
                        amountOfCriterias++;
                        foreach (string clubPrefernce in club.PreferenceList) {
                            if(criteriaPreference == clubPrefernce) {
                                amountOfMatches++;
                            }
                        }
                    }
                }
                if(criterias.ValuesList.Count > 0) {
                    foreach (string criteriaValue in criterias.ValuesList) {
                        amountOfCriterias++;
                        foreach (string clubValue in club.ValuesList) {
                            if(criteriaValue == clubValue) {
                                amountOfMatches++;
                            }
                        }
                    }
                }
                club.CalculatePercentage(amountOfMatches, amountOfCriterias);
            }
            return clubs;
        }

        /**
         * Helping method used to get the SQL for preferences
         */ 
        private string GetPreferenceSql(ClubSearchCriteria criterias) {
            string sqlPreference = "";
            foreach (string preference in criterias.PreferencesList) {
                if (sqlPreference == "") {
                    sqlPreference += " p.name = '" + preference + "' and c.isAvailable = 1 ";
                }
                else {
                    sqlPreference += " or p.name = '" + preference + "' and c.isAvailable = 1 ";
                }
            }
            return sqlPreference;
        }

        /**
         * Helping method used to get the SQL for jobpositions
         */
        private string GetJobpositionSql(ClubSearchCriteria criterias) {
            string sqlJobposition = "";
            if (sqlJobposition == "") {
                sqlJobposition += " jp.season = '" + criterias.Season + "' and c.isAvailable = 1 ";
            }
            else {
                sqlJobposition += " or jp.season = '" + criterias.Season + "' and c.isAvailable = 1 ";
            }
            return sqlJobposition;
        }

        /**
         * Helping method used to get the SQL for values
         */ 
        private string GetValueSql(ClubSearchCriteria criterias) {
            string sqlValue = "";
            foreach (string value in criterias.ValuesList) {
                if (sqlValue == "") {
                    sqlValue += " v.name = '" + value + "' and c.isAvailable = 1 ";
                }
                else {
                    sqlValue += " or v.name = '" + value + "' and c.isAvailable = 1 ";
                }
            }
            return sqlValue;
        }
    }
}
