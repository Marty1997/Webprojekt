using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Entities {
    public class Player {
        [JsonIgnore]
        public int Id { get; set; }
        [JsonIgnore]
        public UserCredentialscs UserCredentialscs { get; set; }
        public string ErrorMessage { get; set; }
        public string Token { get; set; }
        public bool IsPLayer { get; set; }

        public Player() {
            IsPLayer = true;
        }
    }
}
