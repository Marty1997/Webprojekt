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
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Authorize]
    [EnableCors("allowOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    public class PlayerController : ControllerBase {

        private readonly PlayerLogic _playerLogic;
        private readonly Authentication authentication;
        private readonly IRepository<Player> _playerRepos;
        private UserManager<User> userManager;

        public PlayerController(PlayerLogic playerLogic, IPlayerRepository<Player> playerRepos, Authentication authentication, UserCredentialsLogic userCredentialsLogic) {
            _playerLogic = playerLogic;
            _playerRepos = playerRepos;
            this.authentication = authentication;
            this.userManager = userManager;
        }

        // api/Player
        [AllowAnonymous]
        [HttpPost]
        public async Task<Object> Register([FromBody] Player entity) {
            User user = new User {
                Role = "Player",
                UserName = entity.Email,
            };
            try {
                var result = await userManager.CreateAsync(user, entity.Password);
                if (result.Succeeded) {
                    bool resultForPlayerCreate = _playerLogic.Create(entity);
                    if (resultForPlayerCreate) {
                        return Ok();
                    }
                    else {
                        await userManager.DeleteAsync(user);
                        return StatusCode(500);
                    }
                }
                else {
                    return StatusCode(500);
                }

            }
            catch (Exception) {
                return StatusCode(500);
            }
        }

        // api/Player/GetById
        [HttpGet("{id}")]
        [Route("[action]")]
        public IActionResult GetById([FromQuery]int id) {
            if(id > 0) {
                return Ok(_playerRepos.GetById(id));
            }
            else {
                return StatusCode(404);
            }
        }

        // api/Player/UpdateInfo
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateInfo([FromBody] Player entity) {
            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {

                //New password
                if (entity.Password != null && entity.NewPassword != null) {
                    //Check if current password is correct
                    if (authentication.CheckPassword(entity.Email, entity.Password)) {
                        //Create new password
                        entity.UserCredentials = _userCredentialsLogic.Create(entity.NewPassword);
                    }
                    else {
                        return StatusCode(400, "Invalid password");
                    }
                }

                // Update player info
                entity.Id = id;
                if (_playerLogic.UpdateInfo(entity)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Player/UpdateAdditionalInfo
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateAdditionalInfo([FromBody] Player entity) {
            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {
                
                // Update player additional info
                entity.Id = id;
                if (_playerLogic.UpdateAdditionalInfo(entity)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Player/Deletestrengthsandweaknesses
        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteStrengthsAndWeaknesses() {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {
                if (_playerLogic.DeleteStrengthsAndWeaknesses(id)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Player/UpdateStrengthsandweaknesses
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateStrengthsAndWeaknesses([FromBody] Player entity) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {
                entity.Id = id;
                if (_playerLogic.UpdateStrengthsAndWeaknesses(entity)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Player/UpdateSportCV
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateSportCV([FromBody] Player entity) {
            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {

                // Update player sport cv
                entity.Id = id;
                if (_playerLogic.UpdateSportCV(entity)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Player/UpdateProfile
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateProfile([FromBody] Player entity) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {
                entity.Id = id;
                if (_playerLogic.UpdateProfile(entity)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Player/UpdateVideo
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateVideo([FromBody] Player entity) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {
                entity.Id = id;
                if (_playerLogic.UpdateVideo(entity)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/DeletePlayer
        [HttpPost]
        [Route("[action]")]
        public IActionResult DeletePlayer() {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {
                if (_playerLogic.DeletePlayer(id)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/AddNationalTeam
        [HttpPost]
        [Route("[action]")]
        public IActionResult AddNationalTeam([FromBody] NationalTeam entity) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {
                if (_playerLogic.AddNationalTeam(entity, id)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/DeleteNationalTeam
        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteNationalTeam([FromBody] IDRequest data) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {
                if (_playerLogic.DeleteNationalTeam(data.ID, id)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Player/SearchPlayers
        [HttpGet]
        [Route("[action]")]
        public IActionResult SearchPlayers([FromQuery] SearchCriteriaForPlayer request) {
            
            
            return Ok(_playerLogic.HandleSearchAlgorithm(request));
        }
    }
}
