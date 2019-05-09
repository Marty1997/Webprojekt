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

        /*
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

        //Mere logik her med playerList*/
        public List<Club> HandleClubSearchAlgorithm(ClubSearchCriteria criterias) {
            string sql = "";
            List<Club> clubs = new List<Club>();

            // If no criteria is selected
            if(criterias.Country == null && criterias.League == null && 
                criterias.Position == null && criterias.PreferencesList.Count == 0 && 
                criterias.Season == null && criterias.ValuesList.Count == 0) {
                // return all clubs
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
    }
}
