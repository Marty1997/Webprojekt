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
        private readonly Account _account;
        private readonly UserCredentialsLogic _userCredentialsLogic;

        public ClubLogic(Account account, IRepository<Club> clubRepos, UserCredentialsLogic userCredentialsLogic) {
            _clubRepos = clubRepos;
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

        public Club GetById(int id) {
            return _clubRepos.GetById(id);
        }

        public List<Club> HandleClubSearchAlgorithm(ClubSearchCriteria criterias) {
            string sql = "";
            List<Club> clubs = new List<Club>();

            // If no criteria is selected all clubs is returned
            if(criterias.Country == null && criterias.League == null && 
                criterias.Position == null && criterias.PreferencesList.Count == 0 && 
                criterias.Season == null && criterias.ValuesList.Count == 0) {
                return (List<Club>)_clubRepos.GetAll();
            }

            // Remove clubs based on league and country
            if(criterias.Country != null || criterias.League != null) {

                if(criterias.League != null) {
                    sql += "c.league = '" + criterias.League + "'";
                }

                if(criterias.Country != null) {
                    if(sql == "") {
                        sql += "c.country = '" + criterias.Country + "'";
                    } else {
                        sql += "and c.country = '" + criterias.Country + "'";
                    }
                }

                //clubs = _clubRepos.GetBySearchCriteria();
            }

            return null;
        }

        /* 
            Helping method used to calculate match percentage
            If criteria is not null, amountOfCriterias + 1
            If criteria match with club, amountofMayches + 1
        */
        private List<Club> CalculateCriteriaMatchPercentage(List<Club> clubs, ClubSearchCriteria criterias) {
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
                    foreach (JobPosition jobPosition in club.JobPositionsList) {
                        amountOfCriterias++;
                        if(criterias.Position == jobPosition.Position) {
                            amountOfMatches++;
                        }
                        if(criterias.Season == jobPosition.Season) {
                            amountOfMatches++;
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
