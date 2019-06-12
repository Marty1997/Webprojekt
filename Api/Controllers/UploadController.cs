using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Api.BusinessLogic;
using Api.DAL.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers {
    [Authorize]
    [EnableCors("allowOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase {
        
      
        [HttpPost, DisableRequestSizeLimit]
        public IActionResult UploadFile() {
            try {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Files");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0) {
                    var guid = Guid.NewGuid().ToString();
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var uniqueFileName = guid + fileName;
                    var fullPath = Path.Combine(pathToSave, uniqueFileName);
                    var dbPath = Path.Combine(folderName, uniqueFileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create)) {
                        file.CopyTo(stream);
                    }

                    return Ok(new { dbPath });
                }
                else {
                    return BadRequest();
                }
            }
            catch (Exception) {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}

