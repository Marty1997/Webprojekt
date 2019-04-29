using Api.DAL.Entities;
using Api.DAL.Repos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.BusinessLogic {

    public class ClubLogic : IService<Club> {
        private readonly ClubRepos _clubRepository;
        private Account _account;
        private UserCredentialsLogic _userCredentialsLogic;

        public ClubLogic(ClubRepos clubRepository) {
            _clubRepository = clubRepository;
            _account = new Account();
            _userCredentialsLogic = new UserCredentialsLogic();
        }
        
        public Club Create(Club entity) {

            //Check if email already exist
            Club c = _clubRepository.GetByEmail(entity.Email);

            if (c.Id > 0) {
                c.ErrorMessage = "Email already exist";
            }
            else {
                //Adding userCredentials to club
                entity.UserCredentials = _userCredentialsLogic.Create(entity.Password);
                //Creating club
                c = _clubRepository.Create(entity);
            }
            return c;
        }
    }
}
