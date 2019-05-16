using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Entities {
    public class NationalTeam {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Appearances { get; set; }
        public string Statistic { get; set; }
        public string Position { get; set; }
    }
}
