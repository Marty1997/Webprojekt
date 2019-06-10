using Api.DAL;
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
        private readonly IClubRepository<Club> clubRepos;
        private readonly AppSettings appSettings;

        public Authentication(Account account, IRepository<Player> playerRepos, IClubRepository<Club> clubRepos,
                                    IOptions<AppSettings> appSettings) {
            this.account = account;
            this.playerRepos = playerRepos;
            this.clubRepos = clubRepos;
            this.appSettings = appSettings.Value;
        }

        public object Validate(string email, string password) {
            UserCredentials credentials = playerRepos.getCredentialsByEmail(email);

            if(credentials != null && credentials.Club) {
                if (account.ValidateLogin(credentials.Salt, credentials.HashPassword, password)) {
                    Club club = clubRepos.GetByEmail(email);
                    club.Token = GenerateToken(club.Id, "Club");
                    return club;
                }
            }
            else {
                if(credentials != null && !credentials.Club) {
                    if(account.ValidateLogin(credentials.Salt, credentials.HashPassword, password)) {
                        Player player = playerRepos.GetByEmail(email);
                        player.Token = GenerateToken(player.Id, "Player");
                        return player;
                    }
                }
            }
            return "Failed to authenticate";
        }

        public bool CheckPassword(string email, string password) {

            bool res = false;

            UserCredentials credentials = playerRepos.getCredentialsByEmail(email);

            if (credentials != null) {
                if (account.ValidateLogin(credentials.Salt, credentials.HashPassword, password)) {
                    res = true;
                }
            }
            return res;
        }

        public JwtSecurityToken DecodeTokenFromRequest(string accesToken) {
            accesToken = accesToken.Substring(7);
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(accesToken) as JwtSecurityToken;
            return jsonToken;
        }

        public string GetRoleFromToken(JwtSecurityToken decodedToken) {
            var claimRole = decodedToken.Claims.First(claim => claim.Type == "role").Value;
            string tokenRole = Convert.ToString(claimRole);
            return tokenRole;
        }

        public int GetIDFromToken(JwtSecurityToken decodedToken) {
            var claimID = decodedToken.Claims.First(claim => claim.Type == "unique_name").Value;
            int tokenID = Int32.Parse(claimID);
            return tokenID;
        }

        private string GenerateToken(int id, string role) {
            var tokenHandler = new JwtSecurityTokenHandler();
            
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, id.ToString()),
                    new Claim(ClaimsIdentity.DefaultRoleClaimType, role)
                    
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
