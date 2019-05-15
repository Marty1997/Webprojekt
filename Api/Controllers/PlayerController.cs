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

namespace Api.Controllers
{
    [Authorize]
    [EnableCors("allowOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    public class PlayerController : ControllerBase {

        private readonly PlayerLogic _playerLogic;
        private readonly IRepository<Player> _playerRepos;

        public PlayerController(PlayerLogic playerLogic, IRepository<Player> playerRepos) {
            _playerLogic = playerLogic;
            _playerRepos = playerRepos;

        }

        // api/Player
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Register([FromBody] Player entity) {

            Player player = _playerLogic.Create(entity);

            return Ok(player);
        }

        // api/Player/GetById
        [HttpGet("{id}")]
        [Route("[action]")]
        public IActionResult GetById([FromQuery]int id) {
            if(id > 0) {
                return Ok(_playerRepos.GetById(id));
            }
            else {
                return StatusCode(404, "Resource not found");
            }

           
        }

        // api/Player/SearchPlayers
        [HttpGet]
        [Route("[action]")]
        public IActionResult Update([FromBody] Player entity) {

            var player = _playerLogic.Update(entity);

            return Ok(player);
        }


        [HttpGet]
        [Route("[action]")]
        public IActionResult SearchPlayers([FromQuery] SearchCriteriaForPlayer request) {
            var firsTime = DateTime.Now;
            List<Player> list = _playerLogic.HandleSearchAlgorithm(request);
            var afterTime = DateTime.Now;

            List<DateTime> lol = new List<DateTime>();
            
            return Ok(list);
        }
    }
}
