using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.DataTransferObjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;
using Api.DAL;
using Api.DAL.Entities;
using Api.BusinessLogic;
using Microsoft.AspNetCore.Identity;

namespace Api.Controllers {
    [Authorize]
    [EnableCors("allowOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase {

        private IConfiguration confirguration;
        private readonly IClubRepository<Club> _clubRepos;
        private readonly IRepository<Player> _playerRepos;
        private readonly Authentication authentication;
        private UserManager<User> userManager;

        public EmailController(IConfiguration iConfig, IClubRepository<Club> clubRepos,
                                    Authentication authentication, IRepository<Player> playerRepos, UserManager<User> userManager) {
            confirguration = iConfig;
            _clubRepos = clubRepos;
            _playerRepos = playerRepos;
            this.authentication = authentication;
            this.userManager = userManager;
        }

        [HttpPost]
        public IActionResult ContactAdviser([FromBody] ContactAdviserRequest body) {
            string emailFromDB = "";
            //Gets the user email fi token ID
            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            //Find user with ID and get the email
            if (role == "Club") {
                emailFromDB = _clubRepos.GetEmailByID(id);
            }
            else if(role == "Player") {
                emailFromDB = _playerRepos.GetEmailByID(id);
            }
            else {
                return StatusCode(400, "Failed to send email");
            }
            if(emailFromDB == null) {
                return StatusCode(400, "Failed to send email");
            }

            //Gets email and password from config
            var email = confirguration.GetSection("AppSettings").GetSection("Email").Value;
            var password = confirguration.GetSection("AppSettings").GetSection("EmailPassword").Value;

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(email));
            message.To.Add(new MailboxAddress("albertsen96@gmail.com"));
            message.Subject = "Contact Adviser question";
            message.Body = new TextPart("html") {
                Text = "From " + emailFromDB + "<br>" +
                "Message " + body.Message
            };

            // Commented out, so we dont recive mails all the time. The method has been tested to work.

            //using (var client = new SmtpClient()) {
            //    client.Connect("smtp.gmail.com", 587);
            //    client.Authenticate(email, password);
            //    client.Send(message);
            //    client.Disconnect(false);
            //}
            return Ok();
        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<Object> CheckIfEmailExists([FromQuery] string email) {
            try {
                var user = await userManager.FindByNameAsync(email);
                if (user != null) {
                    return Ok(true);
                }
                else {
                    return Ok(false);
                }
            }
            catch (Exception) {
                return StatusCode(500);
            }

        }

    }
}