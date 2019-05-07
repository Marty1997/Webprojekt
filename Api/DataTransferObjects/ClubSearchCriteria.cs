using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DataTransferObjects {
    public class ClubSearchCriteria {
        public string Country { get; set; }
        public string League { get; set; }
        public string Position { get; set; }
        public string Season { get; set; }
        public List<string> ValuesList { get; set; }
        public List<string> PreferencesList { get; set; }

        public ClubSearchCriteria() {
            ValuesList = new List<string>();
            PreferencesList = new List<string>();
        }
    }
}
