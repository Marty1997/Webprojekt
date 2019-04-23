using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.BusinessLogic;
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
    public class AuthenticateController : ControllerBase {
        private readonly Authentication authentication;

        public AuthenticateController(Authentication authentication) {
            this.authentication = authentication;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Authenticate([FromBody] LoginRequest loginRequest) {

            var user = authentication.Validate(loginRequest.Email, loginRequest.Password);
 
            if (user.ToString() == "") {
                return StatusCode(400, "Failed to authenticate");
            }
            return Ok(user);
        }
    }
}