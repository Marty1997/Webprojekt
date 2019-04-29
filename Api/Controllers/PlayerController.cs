using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.BusinessLogic;
using Api.DAL.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayerController : ControllerBase {

        private readonly IService<Player> _playerService;

        public PlayerController(IService<Player> playerService) {
            _playerService = playerService;
        }

        [HttpPost]
        public IActionResult Create([FromBody] Player entity) {

            var player = _playerService.Create(entity);

            return Ok(player);
        }
    }
}
