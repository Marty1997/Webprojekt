using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.BusinessLogic;
using Api.DAL.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers {

    [Route("api/[controller]")]
    [ApiController]
    public class ClubController : ControllerBase {

        private readonly IService<Club> _clubService;

        public ClubController(IService<Club> clubService) {
            _clubService = clubService;
        }

        [HttpPost]
        public IActionResult Create([FromBody] Club entity) {

            var club = _clubService.Create(entity);

            return Ok(club);
        }
    }
}
