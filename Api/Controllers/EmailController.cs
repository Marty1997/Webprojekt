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

namespace Api.Controllers {
    [Authorize]
    [EnableCors("allowOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase {

        private IConfiguration confirguration;
        private readonly IClubRepository<Club> _clubRepos;

        public EmailController(IConfiguration iConfig, IClubRepository<Club> clubRepos) {
            confirguration = iConfig;
            _clubRepos = clubRepos;
        }

        [HttpPost]
        public IActionResult ContactAdviser([FromBody] ContactAdviserRequest body) {
            var email = confirguration.GetSection("AppSettings").GetSection("Email").Value;
            var password = confirguration.GetSection("AppSettings").GetSection("EmailPassword").Value;

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(email));
            message.To.Add(new MailboxAddress("albertsen96@gmail.com"));
            message.Subject = "Contact Adviser question";
            message.Body = new TextPart("html") {
                Text = "From " + body.Email + "<br>" +
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
        public IActionResult CheckIfEmailExists([FromQuery] string email) {
             return Ok(_clubRepos.CheckIfEmailExists(email));
        }

    }
}