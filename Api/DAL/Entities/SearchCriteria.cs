using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Entities {
    public class SearchCriteria {
        public string Country { get; set; }
        public string League { get; set; }
        public string ContractStatus { get; set; }
        public int? MinAge { get; set; }
        public int? MaxAge { get; set; }
        public string PrimaryPosition { get; set; }
        public string SecondaryPosition { get; set; }
        public string InjuryStatus { get; set; }
        public string HandPreference { get; set; }
        public int? MinHeight { get; set; }
        public int? MaxWeight { get; set; }
        public List<string> StrengthsList { get; set; }

        public SearchCriteria() {
            StrengthsList = new List<string>();
        }
    }
}
