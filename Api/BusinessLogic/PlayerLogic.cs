using Api.DAL;
using Api.DAL.Entities;
using Api.DAL.Repos;
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
    }
}
