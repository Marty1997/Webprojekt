using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.DataTransferObjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using Microsoft.Extensions.Configuration;
using Api.DAL;
using Api.DAL.Entities;
using Api.BusinessLogic;
using Microsoft.AspNetCore.Identity;
using MailKit.Net.Smtp;

namespace Api.Controllers {
    [Authorize]
    [EnableCors("allowOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase {

        private IConfiguration confirguration;
        private readonly IClubRepository<Club> _clubRepos;
        private readonly IPlayerRepository<Player> _playerRepos;
        private readonly Authentication authentication;
        private UserManager<User> userManager;

        public EmailController(IConfiguration iConfig, IClubRepository<Club> clubRepos,
                                    Authentication authentication, IPlayerRepository<Player> playerRepos, UserManager<User> userManager) {
            confirguration = iConfig;
            _clubRepos = clubRepos;
            _playerRepos = playerRepos;
            this.authentication = authentication;
            this.userManager = userManager;
        }

        [AllowAnonymous]
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
            else if (role == "Player") {
                emailFromDB = _playerRepos.GetEmailByID(id);
            }
            else {
                return StatusCode(500, "Failed");
            }
            if (emailFromDB == null) {
                return StatusCode(500, "Failed");
            }

            bool res = SetupEmail("albertsen96@gmail.com", "Contact Adviser question", "From " + emailFromDB + "<br> Message " + body.Message);
            if(res) {
               return Ok();
            }
             return StatusCode(500, "Failed");


        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> CheckIfEmailExists([FromQuery] string email) {
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

        [AllowAnonymous]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> SendResetPassword(EmailRequest request) {
            try {
                var result = await userManager.FindByNameAsync(request.Email);

                if (result == null) {
                    return Ok();
                }

                var code = await userManager.GeneratePasswordResetTokenAsync(result);
                code = System.Web.HttpUtility.UrlEncode(code);
                var callbackUrl = new Uri("http://localhost:4200/reset-password/token" + code + "userId" + result.Id);
                
                string message = "Please reset your password by clicking <a href=\"" + callbackUrl + "\">here</a>";

                bool res = SetupEmail(request.Email, "Reset Password", message);
                if (res) {
                    return Ok();
                }
                return StatusCode(500, "Failed");
            }
            catch (Exception) {
                return null;
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> HandlePasswordReset(ResetPasswordRequest request) {
            request.Url = request.Url.Substring(21);
            string[] strings = request.Url.Split(new[] { "userId" }, StringSplitOptions.None);
            string token = System.Web.HttpUtility.UrlDecode(strings[0]);

            try {
                var user = await userManager.FindByIdAsync(strings[1]);
                if(user == null) {
                    return StatusCode(500, "Failed");
                }
                var result = await userManager.ResetPasswordAsync(user, token, request.Password);
                if (result.Succeeded) {
                    return Ok();
                }
                else {
                    return StatusCode(500, "Failed");
                }
            }
            catch (Exception) {
                return StatusCode(500);
            }
        }

        private bool SetupEmail(string receivingEmail, string subject, string body) {
            //Gets email and password from config
            try {
                var email = confirguration.GetSection("AppSettings").GetSection("Email").Value;
                var password = confirguration.GetSection("AppSettings").GetSection("EmailPassword").Value;

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(email));
                message.To.Add(new MailboxAddress(receivingEmail));
                message.Subject = subject;
                message.Body = new TextPart("html") {
                    Text = body
                };

                using (var client = new SmtpClient()) {
                    client.Connect("smtp.gmail.com", 587);
                    client.Authenticate(email, password);
                    client.Send(message);
                    client.Disconnect(true);
                }
                return true;
            }

            catch (Exception) {
                return false;
            }

        }
    }
}