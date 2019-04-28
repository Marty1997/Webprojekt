using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Entities {
    public class UserCredentials {
        public string Salt { get; set; }
        public string HashPassword { get; set; }
        public int LoginAttempts { get; set; }
        public bool Club { get; set; }

        public UserCredentials() {
            Club = true;
        }
    }
}
