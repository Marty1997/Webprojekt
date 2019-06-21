using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Entities {
    public class TrainingHours {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Mon { get; set; }
        public string Tue { get; set; }
        public string Wed { get; set; }
        public string Thu { get; set; }
        public string Fri { get; set; }
        public string Sat { get; set; }
        public string Sun { get; set; }
    }
}
