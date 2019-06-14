using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.BusinessLogic;
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
    public class ClubController : ControllerBase {
        private readonly Authentication authentication;
        private readonly ClubLogic _clubLogic;
        private readonly UserCredentialsLogic _userCredentialsLogic;

        public ClubController(ClubLogic clubLogic, Authentication authentication, UserCredentialsLogic userCredentialsLogic) {
            _clubLogic = clubLogic;
            this.authentication = authentication;
            _userCredentialsLogic = userCredentialsLogic;
        }

        // api/Club
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Register([FromBody] Club entity) {
                
            var club = _clubLogic.Create(entity);

            return Ok(club);
        }

        // api/Club/UpdateInfo
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateInfo([FromBody] Club entity) {
            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);
            
            if (role == "Club") {

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

                // Update club info
                entity.Id = id;
                if(_clubLogic.UpdateInfo(entity)) {
                    return Ok();
                }    
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/UpdateTrainingHours
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateTrainingHours([FromBody] TrainingHours entity) {
            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                if(_clubLogic.UpdateTrainingHours(entity, id)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed"); 
        }

        // api/Club/UpdateSquadPlayer
        [HttpPost]
        [Route("[action]")]
        public IActionResult AddSquadPlayer([FromBody] SquadPlayer entity) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                if(_clubLogic.AddSquadPlayer(entity, id)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/AddOpenPosition
        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOpenPosition([FromBody] JobPosition entity) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                if(_clubLogic.AddOpenPosition(entity, id)) {
                    return Ok();
                }
               
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/UpdateStaff
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateStaff([FromBody] Club entity) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                entity.Id = id;
                if(_clubLogic.UpdateStaff(entity)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/UpdateClubValuesAndPreferences
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateValuesAndPreferences([FromBody] Club entity) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                entity.Id = id;
                if(_clubLogic.UpdateValuesAndPreferences(entity)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/UpdateProfile
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateProfile([FromBody] Club entity) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                entity.Id = id;
                if(_clubLogic.UpdateProfile(entity)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/UpdateFacility
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateFacility([FromBody] Club entity) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                entity.Id = id;
                if(_clubLogic.UpdateFacility(entity)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/DeleteJobPosition
        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteJobPosition([FromBody] IDRequest data) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                if(_clubLogic.DeleteJobPosition(data.ID, id)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/DeleteSquadPlayer
        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteSquadPlayer([FromBody] IDRequest data) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                if (_clubLogic.DeleteSquadPlayer(data.ID, id)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/GetOpenPositions
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetOpenPositions() {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                List<JobPosition> opl = _clubLogic.GetOpenPositions(id);

                if (opl != null) {
                    return Ok(opl);
                }
                else {
                    return StatusCode(404, "Resource not found");
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/DeleteTrainingHours
        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteTrainingHours([FromBody] NameRequest data) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                if(_clubLogic.DeleteTrainingHours(data.Name, id)) {
                    return Ok();
                }
                
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/GetNextSquadplayer
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetNextSquadplayer() {
            
            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                List<SquadPlayer> spl = _clubLogic.GetNextSquadplayer(id);

                if (spl != null) {
                    return Ok(spl);
                }
                else {
                    return StatusCode(404, "Resource not found");
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/GetCurrentSquadplayer
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCurrentSquadplayer() {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                List<SquadPlayer> spl = _clubLogic.GetCurrentSquadplayer(id);

                if (spl != null) {
                    return Ok(spl);
                }
                else {
                    return StatusCode(404, "Resource not found");
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/DeleteFacilityImage
        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteFacilityImage([FromBody] ImagePathRequest data) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                if (_clubLogic.DeleteFacilityImage(data.ImagePath, id)) {
                    return Ok();
                }

            }
            return StatusCode(400, "Failed");
        }

        // api/Club/DeleteClubValuesAndPreferences
        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteValuesAndPreferences() {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                if(_clubLogic.DeleteValuesAndPreferences(id)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/DeleteClub
        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteClub() {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                if (_clubLogic.DeleteClub(id)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Club/GetById
        [HttpGet("{id}")]
        [Route("[action]")]
        public IActionResult GetById([FromQuery]int id) {
            if (id > 0) {
                return Ok(_clubLogic.GetById(id));
            }
            else {
                return StatusCode(404, "Resource not found");
            }
        }

        // api/Club/SearchForClubs
        [HttpGet]
        [Route("[action]")]
        public IActionResult SearchForClubs([FromQuery] ClubSearchCriteria clubSearchCriteria, int id) {
            return  Ok(_clubLogic.HandleClubSearchAlgorithm(clubSearchCriteria, id));
        }
    }
}
