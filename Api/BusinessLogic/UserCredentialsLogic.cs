﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.DAL.Entities;

namespace Api.BusinessLogic {
    public class UserCredentialsLogic {

        private readonly Account _account;
        private UserCredentials _userCredentials;


        public UserCredentialsLogic(Account account) {
            _account = account;
            _userCredentials = new UserCredentials();
        }

        public UserCredentials Create(string password) {

            string s = _account.CreatePasswordHash(password);
            char[] splitter = { ':' };
            var split = s.Split(splitter);
            _userCredentials.Salt = split[0];
            _userCredentials.HashPassword = split[1];
            return _userCredentials;
        }
    }
}
