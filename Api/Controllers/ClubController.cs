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

        private readonly ClubLogic _clubLogic;

        public ClubController(ClubLogic clubLogic) {
            _clubLogic = clubLogic;
        }

        // api/Club
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Register([FromBody] Club entity) {
                
            var club = _clubLogic.Create(entity);

            return Ok(club);
        }

        // api/Club/UpdateClubInfo
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateInfo([FromBody] Club entity) {
            //var accessToken = Request.Headers["Authorization"];
            var club = _clubLogic.UpdateInfo(entity);
            return Ok(club);
        }

        // api/Club/UpdateTrainingHours
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateTrainingHours([FromBody] TrainingHours entity) {

            var response = _clubLogic.UpdateTrainingHours(entity);
            return Ok(response);
        }

        // api/Club/UpdateSquadPlayer
        [HttpPost]
        [Route("[action]")]
        public IActionResult AddSquadPlayer([FromBody] SquadPlayer entity) {

            var response = _clubLogic.AddSquadPlayer(entity);
            return Ok(response);
        }

        // api/Club/AddOpenPosition
        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOpenPosition([FromBody] JobPosition entity) {

            var response = _clubLogic.AddOpenPosition(entity);
            return Ok(response);
        }

        // api/Club/UpdateClubStaff
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateStaff([FromBody] Club entity) {

            var response = _clubLogic.UpdateStaff(entity);
            return Ok(response);
        }

        // api/Club/UpdateClubValuesAndPreferences
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateValuesAndPreferences([FromBody] Club entity) {

            var response = _clubLogic.UpdateValuesAndPreferences(entity);
            return Ok(response);
        }


        // api/Club/UpdateProfile
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateProfile([FromBody] Club entity) {

            var response = _clubLogic.UpdateProfile(entity);
            return Ok(response);
        }

        // api/Club/UpdateFacility
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateFacility([FromBody] Club entity) {

            var response = _clubLogic.UpdateFacility(entity);
            return Ok(response);
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
