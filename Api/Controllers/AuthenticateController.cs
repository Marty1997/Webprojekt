using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Api.BusinessLogic;
using Api.DAL;
using Api.DAL.Entities;
using Api.DataTransferObjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.AspNetCore.Identity;

namespace Api.Controllers {
    [Authorize]
    [EnableCors("allowOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase {
        private readonly Authentication authentication;
        private readonly IRepository<Player> playerRepos;
        private readonly IClubRepository<Club> clubRepos;
        private UserManager<User> userManager;
        private SignInManager<User> signInManager;

        public AuthenticateController(Authentication authentication, IRepository<Player> playerRepos,
            IClubRepository<Club> clubRepos, UserManager<User> userManager, SignInManager<User> signInManager) {
            this.authentication = authentication;
            this.playerRepos = playerRepos;
            this.clubRepos = clubRepos;
            this.userManager = userManager;
            this.signInManager = signInManager;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<Object> Authenticate([FromBody] LoginRequest loginRequest) {
            try {
                var userFromIdentity = await userManager.FindByNameAsync(loginRequest.Email);
                if (userFromIdentity != null && await userManager.CheckPasswordAsync(userFromIdentity, loginRequest.Password)) {
                    if (userFromIdentity.Role == "Player") {
                        Player player = playerRepos.GetByEmail(loginRequest.Email);
                        player.Token = authentication.GenerateToken(player.Id, "Player");
                        return Ok(player);
                    }
                    else if (userFromIdentity.Role == "Club") {
                        Club club = clubRepos.GetByEmail(loginRequest.Email);
                        club.Token = authentication.GenerateToken(club.Id, "Club");
                        return Ok(club);
                    }
                    return StatusCode(400, "Failed to authenticate");
                }
                else {
                    return StatusCode(400, "Failed to authenticate");
                }
            }
            catch (Exception) {
                return StatusCode(400, "Failed to authenticate");
            }
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult RefreshUserWithValidToken() {
            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {
                Player player = playerRepos.GetById(id);
                return Ok(player);
            }
            else if (role == "Club") {
                Club club = clubRepos.GetById(id);
                return Ok(club);
            }
            return StatusCode(400, "Failed");
        }
    }
}