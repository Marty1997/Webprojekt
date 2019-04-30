using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Entities {
    public class SquadPlayer {
        [JsonIgnore]
        public int Position_ID { get; set; }
        public int ShirtNumber { get; set; }
        public string Season { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }

    }
}
