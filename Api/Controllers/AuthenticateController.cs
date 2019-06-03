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

namespace Api.Controllers {
    [Authorize]
    [EnableCors("allowOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase {
        private readonly Authentication authentication;
        private readonly IRepository<Player> playerRepos;
        private readonly IClubRepository<Club> clubRepos;

        public AuthenticateController(Authentication authentication, IRepository<Player> playerRepos, IClubRepository<Club> clubRepos) {
            this.authentication = authentication;
            this.playerRepos = playerRepos;
            this.clubRepos = clubRepos;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Authenticate([FromBody] LoginRequest loginRequest) {
        
            var user = authentication.Validate(loginRequest.Email, loginRequest.Password);
 
            if (user.ToString() == "Failed to authenticate") {
                return StatusCode(400, "Failed to authenticate");
            }
            return Ok(user);
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