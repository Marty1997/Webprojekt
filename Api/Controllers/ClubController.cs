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
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;


namespace Api.Controllers {
    [Authorize]
    [EnableCors("allowOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    public class ClubController : ControllerBase {

        private readonly ClubLogic _clubLogic;
        private UserManager<User> userManager;

        public ClubController(ClubLogic clubLogic, UserManager<User> userManager) {
            _clubLogic = clubLogic;
            this.userManager = userManager;
        }

        // api/Club
        [AllowAnonymous]
        [HttpPost]
        public async Task<Object> Register([FromBody] Club entity) {
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
