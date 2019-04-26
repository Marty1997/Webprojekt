using Api.DAL.Entities;
using Api.DAL.Repos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.BusinessLogic {

    public interface IPlayerService {

        Player Create(Player entity);
    }

    public class PlayerLogic : IPlayerService {
        private readonly PlayerRepos _playerRepository;
        private Account _account;

        public PlayerLogic(PlayerRepos playerRepository) {
            _playerRepository = playerRepository;
            _account = new Account();
        }

        public Player Create(Player entity) {

            //tjek email

            string s = _account.CreatePasswordHash(entity.Password);
            char[] splitter = { ':' };
            var split = s.Split(splitter);
            string salt = split[0];
            string hashValue = split[1];

            UserCredentials userCredentials = new UserCredentials();
            userCredentials.HashPassword = hashValue;
            userCredentials.Salt = salt;

            entity.UserCredentials = userCredentials;

            return _playerRepository.Create(entity);
        }
    }
}
