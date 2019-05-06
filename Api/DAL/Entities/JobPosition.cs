using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Entities {
    public class JobPosition {
        public string League { get; set; }
        public string PreferredHand { get; set; }
        public string Height { get; set; }
        public int MinAge { get; set; }
        public int MaxAge { get; set; }
        public string Season { get; set; }
        public string ContractStatus { get; set; }
        public string Position { get; set; }
        public List<string> StrengthsList { get; set; }

        public JobPosition() {
            StrengthsList = new List<string>();
        }
    }
}
