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

namespace Api.Controllers {
    [Authorize]
    [EnableCors("allowOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase {
        private readonly Authentication authentication;
        private readonly IRepository<Player> playerRepos;
        private readonly IRepository<Club> clubRepos;

        public AuthenticateController(Authentication authentication, IRepository<Player> playerRepos, IRepository<Club> clubRepos) {
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

        [HttpPost]
        [Route("[action]")]
        public IActionResult RefreshUserWithValidToken([FromBody] RefreshUserRequest request) {

            if (request.Role == "Player") {
                Player player = playerRepos.GetById(request.ID);
                return Ok(player);
            }
            else if (request.Role == "Club") {
                Club club = clubRepos.GetById(request.ID);
                return Ok(club);
            }
            return StatusCode(400, "Failed");
        }
    }
}