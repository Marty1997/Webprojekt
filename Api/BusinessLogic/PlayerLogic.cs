﻿using Api.DAL;
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

            //First we check if any League or PrimaryPosition is selected as search criteria. If true we selected after those 2 or 1 of them
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
            //If no league or primaryPosition was selected we try to selected after country if they specified any country in their search.
            else if (request.Country != null) {
                sqlSelectStatement = "p.country = '" + request.Country + "'";
            }
            // If no country, league or primary position was selected, we put togehter a selected statement for the rest of the search criteria
            // that are less important
            else if(request.ContractStatus != null || request.MinimumAge != null || request.MaximumAge != null || 
                request.SecondaryPosition != null || request.InjuryStatus != null || request.HandPreference != null || 
                request.MinimumHeight != null || request.MaximumWeight != null || request.StrengthsList.Count == 0) {
                if (request.ContractStatus != null) {
                    if (sqlSelectStatement == "") {
                        sqlSelectStatement = " p.contractstatus = '" + request.ContractStatus + "'";
                    }
                }
                if(request.MinimumAge != null) {
                    int timeNow = DateTime.Now.Year;
                    int? year = timeNow - request.MinimumAge;
                    if (sqlSelectStatement == "") {
                        sqlSelectStatement = " p.year <= " + year;
                    }
                    else {
                        sqlSelectStatement += " and p.year <= " + year;
                    }
                }
                if(request.MaximumAge != null) {
                    int timeNow = DateTime.Now.Year;
                    int? year = timeNow - request.MaximumAge;
                    if (sqlSelectStatement == "") {
                        sqlSelectStatement = " p.year >= " + year;
                    }
                    else {
                        sqlSelectStatement += " and p.year >= " + year;
                    }
                }
                if (request.SecondaryPosition != null) {
                    if (sqlSelectStatement == "") {
                        sqlSelectStatement = " sp.name = '" + request.SecondaryPosition + "'";
                    }
                    else {
                        sqlSelectStatement += " and sp.name = '" + request.SecondaryPosition + "'";
                    }
                }
                if (request.HandPreference != null) {
                    if (sqlSelectStatement == "") {
                        sqlSelectStatement = " p.handpreference = '" + request.HandPreference + "'";
                    }
                    else {
                        sqlSelectStatement += " and p.handpreference = '" + request.HandPreference + "'";
                    }
                }
                if (request.InjuryStatus != null) {
                    if (sqlSelectStatement == "") {
                        sqlSelectStatement = " p.Injurystatus = '" + request.InjuryStatus + "'";
                    }
                    else {
                        sqlSelectStatement += " and p.injurystatus = '" + request.InjuryStatus + "'";
                    }
                }
                if (request.MinimumHeight != null) {
                    if (sqlSelectStatement == "") {
                        sqlSelectStatement = " p.height >= " + request.MinimumHeight;
                    }
                    else {
                        sqlSelectStatement += " and p.height >= " + request.MinimumHeight;
                    }
                }
                if (request.MaximumWeight != null) {
                    if (sqlSelectStatement == "") {
                        sqlSelectStatement = " p.weight <= " + request.MaximumWeight;
                    }
                    else {
                        sqlSelectStatement += " and p.weight <= " + request.MaximumWeight;
                    }
                }
                if(request.StrengthsList.Count != 0) {
                    // select strength list på en måde
                }
                playerList = (List<Player>)_playerRepos.GetBySearchCriteria(sqlSelectStatement);
            }

            // Now we check for which values match the search criterias and calculate the percentage they match with of total search criteria 
            // selected and order the list by the percentage and return the finished list
            playerList = this.CheckWhichCriteriaMatchAndCalculatePercentage(playerList, request);
            SortListByPercentage sort = new SortListByPercentage();
            playerList.Sort(sort.Compare);
            return playerList;
        }

        // Method that check which criteria match and how many criterias were selected and calculate percentage of match on each player.
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
