using Api.DAL.Entities;
using Api.DAL.Repos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.BusinessLogic {

    public class PlayerLogic : IService<Player> {
        private readonly PlayerRepos _playerRepository;
        private Account _account;
        private UserCredentialsLogic _userCredentialsLogic;


        public PlayerLogic(PlayerRepos playerRepository) {
            _playerRepository = playerRepository;
            _account = new Account();
            _userCredentialsLogic = new UserCredentialsLogic();
        }

        public Player Create(Player entity) {

            //Check if email already exist
            Player p = _playerRepository.GetByEmail(entity.Email);

            if (p.Id > 0) {
                p.ErrorMessage = "Email already exist";
            }
            else {
                //Adding userCredentials to player
                entity.UserCredentials = _userCredentialsLogic.Create(entity.Password);
                //Creating player
                p = _playerRepository.Create(entity);
            }
            return p;
        }
    }
}
