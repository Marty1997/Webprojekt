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
        private readonly IRepository<Player> _playerRepos;
        private UserManager<User> userManager;

        public PlayerController(PlayerLogic playerLogic, IRepository<Player> playerRepos, UserManager<User> userManager) {
            _playerLogic = playerLogic;
            _playerRepos = playerRepos;
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

        // api/Player/Update
        [HttpGet]
        [Route("[action]")]
        public IActionResult Update([FromBody] Player entity) {

            var player = _playerLogic.Update(entity);

            return Ok(player);
        }

        // api/Player/SearchPlayers
        [HttpGet]
        [Route("[action]")]
        public IActionResult SearchPlayers([FromQuery] SearchCriteriaForPlayer request) {
            
            
            return Ok(_playerLogic.HandleSearchAlgorithm(request));
        }
    }
}
