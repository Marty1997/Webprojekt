using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Entities {
    public class Player {
        [JsonIgnore]
        public int Id { get; set; }
        [JsonIgnore]
        public UserCredentials UserCredentialscs { get; set; }
        [JsonIgnore]
        public string Password { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Country { get; set; }
        public string Day { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
        public int Height { get; set; }
        public int Weight { get; set; }
        public int BodyFat { get; set; }
        public string PrimaryPosition { get; set; }
        public string SecondaryPosition { get; set; }
        public string PreferredHand { get; set; }
        public string StrengthDescription { get; set; }
        public string WeaknessDescription { get; set; }
        public List<string> WeaknessList { get; set; }
        public List<string> StrengthList { get; set; }
        public List<NationalTeam> NationalTeamList { get; set; }
        public string CurrentClub { get; set; }
        public string CurrentClubPrimaryPosition { get; set; }
        public string CurrentClubSecondaryPosition { get; set; }
        public string Accomplishments { get; set; }
        public string Statistics { get; set; }
        public string FormerClubs { get; set; }
        public string ErrorMessage { get; set; }
        public string Token { get; set; }
        public bool IsPLayer { get; set; }

        public Player() {
            IsPLayer = true;
            WeaknessList = new List<string>();
            StrengthList = new List<string>();
            NationalTeamList = new List<NationalTeam>();
        }
    }
}
