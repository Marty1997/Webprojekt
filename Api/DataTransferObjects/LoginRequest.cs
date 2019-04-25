using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DataTransferObjects {
    public class LoginRequest {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
