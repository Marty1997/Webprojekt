using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Api.BusinessLogic;
using Api.DAL.Entities;
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
    public class FileController : ControllerBase {
        
        [HttpPost, DisableRequestSizeLimit]
        [Route("[action]")]
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

        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteFile([FromBody] FilenameRequest data) {
            try {
                string fullPath = "";

                if (data.Filename != null
                    && !data.Filename.Equals("https:\\localhost:44310\\Resources\\Files\\player-icon.png")
                    && !data.Filename.Equals("https:\\localhost:44310\\Resources\\Files\\club-icon.png")) {
                    //Trim to get filename
                    string filename = data.Filename.Substring(data.Filename.LastIndexOf('\\') + 1);

                    //Create full path
                    string folderName = Path.Combine("Resources", "Files");
                    string path = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    fullPath = path + "\\" + filename;
                }

                if ((System.IO.File.Exists(fullPath))) {
                    System.IO.File.Delete(fullPath);
                    return Ok();
                }
                else {
                    return StatusCode(500, "Failed");
                }
            }
            catch (Exception) {
                return StatusCode(500, "Failed");
            }
        }
    }
}

