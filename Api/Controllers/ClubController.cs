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

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Register([FromBody] Club entity) {
                
            var club = _clubLogic.Create(entity);

            return Ok(club);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetById([FromBody] Club entity) {
            Club club = _clubLogic.GetById(entity.Id);

            return Ok(club);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult SearchForClubs([FromBody] ClubSearchCriteria clubSearchCriteria, Player player) {
            return  Ok(_clubLogic.HandleClubSearchAlgorithm(clubSearchCriteria, player));
        }
    }
}
