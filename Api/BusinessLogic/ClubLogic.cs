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
        private readonly IRepository<Club> _clubRepos;
        private readonly IRepository<Player> _playerRepos;
        private readonly Account _account;
        private readonly UserCredentialsLogic _userCredentialsLogic;

        public ClubLogic(Account account, IRepository<Club> clubRepos, IRepository<Player> playerRepos, UserCredentialsLogic userCredentialsLogic) {
            _clubRepos = clubRepos;
            _playerRepos = playerRepos;
            _account = account; ;
            _userCredentialsLogic = userCredentialsLogic;
        }
        
        public Club Create(Club entity) {

            ////Check if email already exist
            //Club c = _clubRepository.GetByEmail(entity.Email);

            //if (c.Id > 0) {
            //    c.ErrorMessage = "Email already exist";
            //}
            //else {
            //    //Adding userCredentials to club
            //    entity.UserCredentials = _userCredentialsLogic.Create(entity.Password);
            //    //Creating club
            //    c = _clubRepository.Create(entity);
            //}

            //return c

            //Adding userCredentials to club
            entity.UserCredentials = _userCredentialsLogic.Create(entity.Password);
            //Creating club
            return _clubRepos.Create(entity);
            
        }

        public Club Update(Club entity) {
            return _clubRepos.Update(entity);
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

                if(criterias.League != null) {
                    sql = " c.league = '" + criterias.League + "' and isavailable = 1 ";
                }

                if(criterias.Country != null) {
                    if(sql == "") {
                        sql = " c.country = '" + criterias.Country + "' and isavailable = 1 ";
                    } else {
                        sql += " and c.country = '" + criterias.Country + "' and isavailable = 1 ";
                    }
                }

                if(criterias.Position != null) {
                    if(sql == "") {
                        sql = " jp.position = '" + criterias.Position + "' and isavailable = 1 ";
                    } else {
                        sql += " and jp.position = '" + criterias.Position + "' and isavailable = 1 ";
                    }
                }

                clubs = _clubRepos.GetBySearchCriteriaWithJobposition(sql).ToList();
            }
            // If Country, League and Position is not selected as a criteria
            // We continue to match with the 'less important' criterias
            else if(criterias.PreferencesList.Count > 0 && criterias.Season != null && criterias.ValuesList.Count > 0) {

                if(criterias.PreferencesList.Count > 0) {
                    // wtf is going on
                }

                if(criterias.Season != null) {
                    if (sql == "") {
                        sql = "c.season = '" + criterias.Season + "'";
                    } else {
                        sql += "and c.season = '" + criterias.Season + "'";
                    }
                }

                if(criterias.ValuesList.Count > 0) {
                    // wtf is going on
                }

                clubs = _clubRepos.GetBySearchCriteria(sql, "").ToList();
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
            int amountOfCriterias = 0; // how many criterias is selected
            int amountOfMatches = 0; // how many criterias matches with club

            foreach (Club club in clubs) {
                if(criterias.Country != null) {
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
                            if (criterias.Position == jobPosition.Position) {
                                amountOfMatches++;
                            }
                        }
                        if(jobPosition.Season != null) {
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
    }
}
