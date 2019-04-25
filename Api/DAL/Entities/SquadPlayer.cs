using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Entities {
    public class SquadPlayer {

        public string ShirtNumber { get; set; }
        public string Name { get; set; }
        public Position Position { get; set; }
    }
}
