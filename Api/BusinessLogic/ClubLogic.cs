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

        public List<Club> HandleClubSearchAlgorithm(ClubSearchCriteria clubSearchCriteria) {

            return null;
        }
    }
}
