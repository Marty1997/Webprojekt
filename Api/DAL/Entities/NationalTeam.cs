using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Entities {
    public class NationalTeam {
        public string Name { get; set; }
        public int Appearances { get; set; }
        public string Statistic { get; set; }
        public Position Position { get; set; }
    }
}
