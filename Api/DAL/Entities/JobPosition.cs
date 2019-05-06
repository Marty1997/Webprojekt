using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Entities {
    public class JobPosition {
        public string Leauge { get; set; }
        public string PreferredHand { get; set; }
        public string Height { get; set; }
        public int MaxAge { get; set; }
        public int MinAge { get; set; }
        public string Season { get; set; }
        public string ContractStatus { get; set; }
        public string Position { get; set; }
        public string MyProperty { get; set; }
        public List<string> StrengthList { get; set; }

        public JobPosition() {
            StrengthList = new List<string>();
        }
    }
}
