using Api.DAL;
using Api.DAL.Entities;
using Api.DAL.Repos;
using Api.DataTransferObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.BusinessLogic {

    public class PlayerLogic {

        private readonly Account _account;
        private readonly IRepository<Player> _playerRepos;
        private readonly UserCredentialsLogic _userCredentialsLogic;


        public PlayerLogic(Account account, IRepository<Player> playerRepos, UserCredentialsLogic userCredentialsLogic) {
            _playerRepos = playerRepos;
            _account = account;
            _userCredentialsLogic = userCredentialsLogic;
        }

        public Player Create(Player entity) {

            ////Check if email already exist
            //Player p = _playerRepository.GetByEmail(entity.Email);

            //if (p.Id > 0) {
            //    p.ErrorMessage = "Email already exist";
            //}
            //else {
            //    //Adding userCredentials to player
            //    entity.UserCredentials = _userCredentialsLogic.Create(entity.Password);
            //    //Creating player
            //    p = _playerRepository.Create(entity);
            //}

            //return p;

            //Adding userCredentials to player
            entity.UserCredentials = _userCredentialsLogic.Create(entity.Password);
            //Creating player
            return _playerRepos.Create(entity);
        }


        public Player GetById(int id) {
            return _playerRepos.GetById(id);

        }

        public List<Player> HandleSearchAlgorithm(SearchCriteriaForPlayer request) {
            string sqlSelectStatement = "";
            List<Player> playerList = new List<Player>();

            //If no search criteria were selected, we select all player in DB and return them.
            if (request.Country == null && request.League == null && request.ContractStatus == null && request.MinimumAge == null &&
                request.MaximumAge == null && request.PrimaryPosition == null && request.SecondaryPosition == null &&
                request.InjuryStatus == null && request.HandPreference == null && request.MinimumHeight == null &&
                request.MaximumWeight == null && request.StrengthsList.Count == 0) {
                return (List<Player>)_playerRepos.GetAll();
            }

            if(request.League != null || request.PrimaryPosition != null) {  
                if(request.League != null) {
                    sqlSelectStatement = "p.league = '" + request.League + "'";
                }
                if(request.PrimaryPosition != null) {
                    if(sqlSelectStatement == "") {
                        sqlSelectStatement = "pp.name = '" + request.PrimaryPosition + "'";
                    }
                    else {
                        sqlSelectStatement += " and pp.name = '" + request.PrimaryPosition + "'";
                    }
                }
                playerList = (List<Player>)_playerRepos.GetBySearchCriteria(sqlSelectStatement);
            }
            //else if() {

            //}


            //playerList = (List<Player>)_playerRepos.GetAll();
            playerList = this.CheckWhichCriteriaMatchAndCalculatePercentage(playerList, request);
            SortListByPercentage sort = new SortListByPercentage();
            playerList.Sort(sort.Compare);

            return playerList;
            
            //if(request.PrimaryPosition != null || request.SecondaryPosition != null || request.Country != null || request.League != null) {
            //    if (request.Country != null) {
            //        criteriaNumber += 1;
            //        sqlSelectStatement = " p.country = '" + request.Country + "'";
            //    }
            //    if (request.League != null) {
            //        criteriaNumber += 1;
            //        if (sqlSelectStatement == "") {
            //            sqlSelectStatement = " p.league = '" + request.League + "'";
            //        }
            //        else {
            //            sqlSelectStatement += " and p.league = '" + request.League + "'";
            //        }
            //    }
            //    if (request.PrimaryPosition != null) {
            //        criteriaNumber += 1;
            //    }
            //    if (request.SecondaryPosition != null) {
            //        criteriaNumber += 1;
            //    }
            //}

            ////Following check if any values was specified into these search criterias
            //if (request.MinimumAge != null) {
            //    criteriaNumber += 1;
            //        int timeNow = DateTime.Now.Year;
            //        int? minYear = timeNow - request.MinimumAge;
            //}
            //if (request.MaximumAge != null) {
            //    criteriaNumber += 1;
            //        int timeNow = DateTime.Now.Year;
            //        int? maxYear = timeNow - request.MaximumAge;
            //    }
            //if (request.PrimaryPosition != null) {
            //    criteriaNumber += 1;
            //}
            //if (request.SecondaryPosition != null) {
            //    criteriaNumber += 1;
            //}

            //// Following if statement checks which search criteria were specified. If they only specified something in 
            //// max&min age and primary position and secondary position we skip this and select all player after this if statement
            //// If we get inside this if statement, we confirgued a SQL statement so we only select player from DB which 
            //// have our required criterias
            //if (request.Country != null || request.League != null || request.ContractStatus != null ||
            //        request.InjuryStatus != null || request.HandPreference != null || request.MinimumHeight != null ||
            //        request.MaximumWeight != null) {

            //    if (request.ContractStatus != null) {
            //        criteriaNumber += 1;
            //        if (sqlSelectStatement == "") {
            //            sqlSelectStatement = " p.contractstatus = '" + request.ContractStatus + "'";
            //        }
            //        else {
            //            sqlSelectStatement += " and p.contractstatus = '" + request.ContractStatus + "'";
            //        }
            //    }
            //    if (request.HandPreference != null) {
            //        criteriaNumber += 1;
            //        if (sqlSelectStatement == "") {
            //            sqlSelectStatement = " p.handpreference = '" + request.HandPreference + "'";
            //        }
            //        else {
            //            sqlSelectStatement += " and p.handpreference = '" + request.HandPreference + "'";
            //        }
            //    }
            //    if (request.InjuryStatus != null) {
            //        criteriaNumber += 1;
            //        if (sqlSelectStatement == "") {
            //            sqlSelectStatement = " p.Injurystatus = '" + request.InjuryStatus + "'";
            //        }
            //        else {
            //            sqlSelectStatement += " and p.injurystatus = '" + request.InjuryStatus + "'";
            //        }
            //    }
            //    if (request.MinimumHeight != null) {
            //        criteriaNumber += 1;
            //        if (sqlSelectStatement == "") {
            //            sqlSelectStatement = " p.height >= " + request.MinimumHeight;
            //        }
            //        else {
            //            sqlSelectStatement += " and p.height >= " + request.MinimumHeight;
            //        }
            //    }
            //    if (request.MaximumWeight != null) {
            //        criteriaNumber += 1;
            //        if (sqlSelectStatement == "") {
            //            sqlSelectStatement = " p.weight <= " + request.MaximumWeight;
            //        }
            //        else {
            //            sqlSelectStatement += " and p.weight <= " + request.MaximumWeight;
            //        }
            //    }
            //    /*playerList =*/
            //    return (List<Player>)_playerRepos.GetBySearchCriteria(sqlSelectStatement);
            //}
            //else {
            //    /*playerList =*/ return (List<Player>)_playerRepos.GetAll();
            //}

            //Mere logik her med playerList
        }

        private List<Player> CheckWhichCriteriaMatchAndCalculatePercentage(List<Player> playerList, SearchCriteriaForPlayer request) {
            foreach (Player player in playerList) {
                int criteriaNumber = 0;
                int matchedCriteriaNumber = 0;
                if (request.Country != null) {
                    criteriaNumber += 1;
                    if (request.Country == player.Country) {
                        matchedCriteriaNumber += 1;
                    }
                }
                if (request.League != null) {
                    criteriaNumber += 1;
                    if (request.League == player.League) {
                        matchedCriteriaNumber += 1;
                    }
                }
                if (request.PrimaryPosition != null) {
                    criteriaNumber += 1;
                    if (request.PrimaryPosition == player.PrimaryPosition) {
                        matchedCriteriaNumber += 1;
                    }
                }
                if (request.SecondaryPosition != null) {
                    criteriaNumber += 1;
                    if (request.SecondaryPosition == player.SecondaryPosition) {
                        matchedCriteriaNumber += 1;
                    }
                }
                if (request.ContractStatus != null) {
                    criteriaNumber += 1;
                    if (request.ContractStatus == player.ContractStatus) {
                        matchedCriteriaNumber += 1;
                    }
                }
                if (request.MinimumAge != null) {
                    int timeNow = DateTime.Now.Year;
                    int minYear = timeNow - player.Year;
                    criteriaNumber += 1;
                    if (request.MinimumAge <= minYear) {
                        matchedCriteriaNumber += 1;
                    }
                }
                if (request.MaximumAge != null) {
                    int timeNow = DateTime.Now.Year;
                    int maxYear = timeNow - player.Year;
                    criteriaNumber += 1;
                    if (request.MaximumAge >= maxYear) {
                        matchedCriteriaNumber += 1;
                    }
                }
                if (request.InjuryStatus != null) {
                    criteriaNumber += 1;
                    if (request.InjuryStatus == player.InjuryStatus) {
                        matchedCriteriaNumber += 1;
                    }
                }
                if (request.HandPreference != null) {
                    criteriaNumber += 1;
                    if (request.HandPreference == player.PreferredHand) {
                        matchedCriteriaNumber += 1;
                    }
                }
                if (request.MinimumHeight != null) {
                    criteriaNumber += 1;
                    if (request.MinimumHeight <= player.Height) {
                        matchedCriteriaNumber += 1;
                    }
                }
                if (request.MaximumWeight != null) {
                    criteriaNumber += 1;
                    if (request.MaximumWeight >= player.Weight) {
                        matchedCriteriaNumber += 1;
                    }
                }
                if(request.StrengthsList.Count > 0) {
                    foreach (string rList in request.StrengthsList) {
                        criteriaNumber += 1;
                        foreach (string pList in player.StrengthList) {
                            if(rList == pList) {
                                matchedCriteriaNumber += 1;
                            }
                        }
                    }
                }
                player.CalculatePercentage(matchedCriteriaNumber, criteriaNumber);
            }
            return playerList;
        }   
    }
}
