﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.BusinessLogic;
using Api.DAL.Entities;
using Api.DataTransferObjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;


namespace Api.Controllers {
    [Authorize]
    [EnableCors("allowOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    public class ClubController : ControllerBase {
        private readonly Authentication authentication;
        private readonly ClubLogic _clubLogic;
        private UserManager<User> userManager;

        public ClubController(ClubLogic clubLogic, UserManager<User> userManager, Authentication authentication) {
            _clubLogic = clubLogic;
            this.userManager = userManager;
            this.authentication = authentication;
        }

        // api/Club
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] Club entity) {
            User user = new User {
                Role = "Club",
                UserName = entity.Email,
            };
            try {
                var result = await userManager.CreateAsync(user, entity.Password);
                if(result.Succeeded) {
                    bool resultForClubCreate = _clubLogic.Create(entity);
                    if(resultForClubCreate) {
                        return Ok();
                    }
                    else {
                        await userManager.DeleteAsync(user);
                        return StatusCode(500, "Failed");
                    }
                }
                else {
                    return StatusCode(500, "Failed");
                }
            }
            catch (Exception) {
                return StatusCode(500, "Failed");
            }
        }

        // api/Club/UpdateInfo
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateInfo([FromBody] Club entity) {
            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);
            
            if (role == "Club") {
                // Update club info
                entity.Id = id;
                if(_clubLogic.UpdateInfo(entity)) {
                    return Ok();
                }    
            }
            return StatusCode(500, "Failed");
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdatePassword([FromBody] Club entity) {
            try {
                var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
                string role = authentication.GetRoleFromToken(decodedToken);
                int id = authentication.GetIDFromToken(decodedToken);

                if (role == "Club") {
                    // Update club info
                    string email = _clubLogic.GetEmailById(id);
                    var user = await userManager.FindByNameAsync(email);
                    if(user != null) {
                        var result = await userManager.ChangePasswordAsync(user, entity.Password, entity.NewPassword);
                        if(result.Succeeded) {
                            return Ok();
                        }
                        else {
                            return StatusCode(400, "Invalid password");
                        }
                    }
                }
                return StatusCode(500, "Failed");
            }
            catch (Exception) {
               return StatusCode(500, "Failed");
            }
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
            return StatusCode(500, "Failed"); 
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
            return StatusCode(500, "Failed");
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
            return StatusCode(500, "Failed");
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
            return StatusCode(500, "Failed");
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
            return StatusCode(500, "Failed");
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
            return StatusCode(500, "Failed");
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
            return StatusCode(500, "Failed");
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
            return StatusCode(500, "Failed");
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
            return StatusCode(500, "Failed");
        }

        // api/Club/GetOpenPositions
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetOpenPositions() {

            try {
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
                return StatusCode(500, "Failed");
            }
            catch(Exception) {
                return StatusCode(500, "Failed");
            }       
        }

        // api/Club/GetOpenPositions
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetTrainingHours() {

            try {
                var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
                string role = authentication.GetRoleFromToken(decodedToken);
                int id = authentication.GetIDFromToken(decodedToken);

                if (role == "Club") {
                    List<TrainingHours> thl = _clubLogic.GetTrainingHours(id);

                    if (thl != null) {
                        return Ok(thl);
                    }
                    else {
                        return StatusCode(404, "Resource not found");
                    }
                }
                return StatusCode(500, "Failed");
            }
            catch(Exception) {
                return StatusCode(500, "Failed");
            }
            
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
            return StatusCode(500, "Failed");
        }

        // api/Club/GetNextSquadplayer
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetNextSquadplayer() {
            
            try {
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
                return StatusCode(500, "Failed");
            }
            catch(Exception) {
                return StatusCode(500, "Failed");
            }
            
        }

        // api/Club/GetCurrentSquadplayer
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetCurrentSquadplayer() {

            try {
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
                return StatusCode(500, "Failed");
            }
            catch(Exception) {
                return StatusCode(500, "Failed");
            }
            
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
            return StatusCode(500, "Failed");
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
            return StatusCode(500, "Failed");
        }

        // api/Club/DeleteClub
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteClub() {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Club") {
                string email = _clubLogic.GetEmailById(id);
                if (_clubLogic.DeleteClub(id)) {
                    var user = await userManager.FindByNameAsync(email);
                    if (user != null) {
                        var result = await userManager.DeleteAsync(user);
                        if (result.Succeeded) {
                            return Ok();
                        }
                        else {
                            return StatusCode(500, "Failed");
                        }
                    }
                }
                return StatusCode(500, "Failed");
            }
            return StatusCode(500, "Failed");
        }

        // api/Club/GetById
        [HttpGet("{id}")]
        [Route("[action]")]
        public IActionResult GetById([FromQuery]int id) {
            if (id > 0) {
                return Ok(_clubLogic.GetById(id));
            }
            else {
                return StatusCode(404);
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
