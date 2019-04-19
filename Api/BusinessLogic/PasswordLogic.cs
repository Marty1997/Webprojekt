using Api.DAL;
using Api.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.BusinessLogic {
    public class PasswordLogic {
        private readonly Account account;
        private readonly IRepository<Player> playerRepos;
        private readonly IRepository<Club> clubRepos;


        public PasswordLogic(Account account, IRepository<Player> playerRepos, IRepository<Club> clubRepos) {
            this.account = account;
            this.playerRepos = playerRepos;
            this.clubRepos = clubRepos;
        }

        public Player ValidatePlayer(string email, string password) {
            Player player = playerRepos.GetByEmail(email);
            if (player != null) {
                if (account.ValidateLogin(player.Salt, player.HashPassword, password)) {

                }
            }
            else {
                player.ErrorMessage = "Wrong email or password";
            }
            return player;
        }

        public Club ValidateClub(string email, string password) {
            Club club = clubRepos.GetByEmail(email);
            if (club != null) {
                if (account.ValidateLogin(club.Salt, club.HashPassword, password)) {

                }
            }
            else {
                club.ErrorMessage = "Wrong email or password";
            }
            return club;
        }
    }
}
