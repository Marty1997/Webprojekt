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

namespace Api.Controllers {
    [Authorize]
    [EnableCors("allowOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase {

        public EmailController() {
        }

        [HttpPost]
        public IActionResult ContactAdviser([FromBody] ContactAdviserRequest body) {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("albertmort3@gmail.com"));
            message.To.Add(new MailboxAddress("albertsen96@gmail.com"));
            message.Subject = "Contact Adviser question";
            message.Body = new TextPart("html") {
                Text = "From " /*+ *//*body.Email*/ + "<br>" +
                "Message " + body.Message
                //Text = "lkmasdlkmasdlmk"
            };
            //using (var client = new SmtpClient()) {
            //    client.Connect("smtp.gmail.com", 587);
            //    client.Authenticate("albertmort3@gmail.com", "I gætter det aldrig fuckerhoveder");
            //    client.Send(message);
            //    client.Disconnect(false);
            //}
            return Ok();
        }
    }
}