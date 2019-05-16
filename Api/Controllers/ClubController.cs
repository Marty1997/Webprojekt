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

        // api/Club/Update
        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] Club entity) {

            var club = _clubLogic.Update(entity);

            return Ok(club);
        }

        // api/Club/GetById
        [HttpGet("{id}")]
        [Route("[action]")]
        public IActionResult GetById([FromQuery]int id) {

            Club club = _clubLogic.GetById(id);

            return Ok(club);
        }

        // api/Club/SearchForClubs
        [HttpGet]
        [Route("[action]")]
        public IActionResult SearchForClubs([FromQuery] ClubSearchCriteria clubSearchCriteria, int id) {
            return  Ok(_clubLogic.HandleClubSearchAlgorithm(clubSearchCriteria, id));
        }
    }
}
