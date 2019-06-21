﻿using System;
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
            try {
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
                if (res) {
                    return Ok();
                }
                return StatusCode(500, "Failed");
            }
            catch (Exception) {
                return StatusCode(500, "Failed");
            }
        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> CheckIfEmailExists([FromQuery] string email) {
            if(email == null) {
                return Ok(false);
            }
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

                string message = /*"Please reset your password by clicking <a href=\"" + callbackUrl + "\">here</a>";*/
                    "<body style='background-color: #000115; padding-bottom: 20px;'>" +
                    "<img class='responsive' alt='SCLogo' style='width:100%; height:40px' src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAwADAAAD/4RDiRXhpZgAATU0AKgAAAAgABAE7AAIAAAAIAAAISodpAAQAAAABAAAIUpydAAEAAAAQAAAQyuocAAcAAAgMAAAAPgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFRoYUJvenoAAAWQAwACAAAAFAAAEKCQBAACAAAAFAAAELSSkQACAAAAAzgyAACSkgACAAAAAzgyAADqHAAHAAAIDAAACJQAAAAAHOoAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyMDE5OjA2OjIxIDE5OjIwOjU5ADIwMTk6MDY6MjEgMTk6MjA6NTkAAABUAGgAYQBCAG8AegB6AAAA/+ELGmh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4NCjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPjxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iLz48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+PHhtcDpDcmVhdGVEYXRlPjIwMTktMDYtMjFUMTk6MjA6NTkuODIwPC94bXA6Q3JlYXRlRGF0ZT48L3JkZjpEZXNjcmlwdGlvbj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+PGRjOmNyZWF0b3I+PHJkZjpTZXEgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOmxpPlRoYUJveno8L3JkZjpsaT48L3JkZjpTZXE+DQoJCQk8L2RjOmNyZWF0b3I+PC9yZGY6RGVzY3JpcHRpb24+PC9yZGY6UkRGPjwveDp4bXBtZXRhPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSd3Jz8+/9sAQwAHBQUGBQQH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'>" +

                    "<div alt='Section' style='padding-right: 15px; padding-left: 15px;'>" +

                    "<div style='background-color: #E8EAEC; margin-bottom: 15px; padding-top: 15px; padding-right: 15px; padding-left: 15px; border-radius: 4px;'>" +
                    "Hi, <br><br>" +
                    "You recently requested to reset your password for your SportConnectors account. Please use the link below to reset it. " +
                    "<b><u>This password reset is only valid for the next 10 minutes</u></b>. <br><br>" +
                    "<a href=\"" + callbackUrl + "\">Reset your password</a> <br><br>" +
                    "If you did not request a password reset, please ignore this email or contact support on support@support.com if you have any questions. <br><br><br>" +
                    "Thanks, <br> SportConnectors <br><br><br>" +
                    "</div>" +

                    "<div alt='footer' style='background-color: #252525; color: white; padding: 15px; border-radius: 4px;'>" +
                    "©2019 SportConnectors. All rights reserved. <br>" +
                    "</div>" +

                    "</div>" +

                    "</body>";

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