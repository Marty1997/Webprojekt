using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DataTransferObjects {
    public class SearchCriteriaForPlayer {
        public string Country { get; set; }
        public string League { get; set; }
        public string ContractStatus { get; set; }
        public int? MinimumAge { get; set; }
        public int? MaximumAge { get; set; }
        public string PrimaryPosition { get; set; }
        public string SecondaryPosition { get; set; }
        public string InjuryStatus { get; set; }
        public string HandPreference { get; set; }
        public int? MinimumHeight { get; set; }
        public int? MaximumWeight { get; set; }
        public List<string> StrengthsList { get; set; }

        public SearchCriteriaForPlayer() {
            StrengthsList = new List<string>();
        }
    }
}
