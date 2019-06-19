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

        [AllowAnonymous]
        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult> SendResetPassword(EmailRequest request) {
            try {
                var result = await userManager.FindByNameAsync(request.Email);

                if (result == null) {
                    return Ok();
                }

                var code = await userManager.GeneratePasswordResetTokenAsync(result);
                code = System.Web.HttpUtility.UrlEncode(code);
                var callbackUrl = new Uri("http://localhost:4200/reset-password/token" + code + "userId" + result.Id);

                string message = /*"Please reset your password by clicking <a href=\"" + callbackUrl + "\">here</a>";*/
                    "<img src='data:image/jpeg;base64,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' alt='SCLogo'/> <br><br>" +
                    "Hi, <br><br>" +
                    "You recently requested to reset your password for your SportConnectors account. Please use the link below to reset it. " +
                    "<b><u>This password reset is only valid for the next 10 minutes</u></b>. <br><br>" +
                    "<a href=\"" + callbackUrl + "\">Reset your password</a> <br><br>" +
                    "If you did not request a password reset, please ignore this email or contact support on support@support.com if you have any questions. <br><br>" +
                    "Thanks, <br> The SportConnectors Team <br><br><br>" +
                    "©2019 SportConnectors. All rights reserved. <br>" +
                    "SportConnectors, LLC";

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
        public async Task<ActionResult> HandlePasswordReset(ResetPasswordRequest request) {
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