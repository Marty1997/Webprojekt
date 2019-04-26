﻿using Api.DAL;
using Api.DAL.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Api.BusinessLogic {
    public class Authentication {
        private readonly Account account;
        private readonly IRepository<Player> playerRepos;
        private readonly IRepository<Club> clubRepos;
        private readonly AppSettings appSettings;

        public Authentication(Account account, IRepository<Player> playerRepos, IRepository<Club> clubRepos,
                                    IOptions<AppSettings> appSettings) {
            this.account = account;
            this.playerRepos = playerRepos;
            this.clubRepos = clubRepos;
            this.appSettings = appSettings.Value;
        }

        public object Validate(string email, string password) {
            //UserCredentialscs clubCredentialscs = clubRepos.getCredentialscsByEmail(email);

            if(/*clubCredentialscs != null*/ true) {
                if (true /*account.ValidateLogin(club.UserCredentialscs.Salt, club.UserCredentialscs.HashPassword, password)*/) {
                    Club club = new Club(); /*FIND KLUBBEN HER*/
                    club.Token = GenerateToken(club.Id);
                    club.ErrorMessage = "Email =" + email + " " + "Password =" + password;
                    return club;
                }
            }
            else {
                UserCredentials playerCredentials = playerRepos.getCredentialsByEmail(email);
                if(playerCredentials != null) {
                    if(true /*account.ValidateLogin(player.UserCredentialscs.Salt, player.UserCredentialscs.HashPassword, password)*/) {
                        Player player = new Player(); /*FIND SPILLER HER*/
                        player.Token = GenerateToken(player.Id);
                        player.ErrorMessage = "Email =" + email + " " + "Password =" + password;
                        return player;
                    }
                }
            }
            return "Failed to authenticate";
        }

        private string GenerateToken(int id) {
            var tokenHandler = new JwtSecurityTokenHandler();
            
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            string finishToken;
            return finishToken = tokenHandler.WriteToken(token);
        }
    }
}