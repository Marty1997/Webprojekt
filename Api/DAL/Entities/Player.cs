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
        public Position PrimaryPosition { get; set; }
        public Position SecondaryPosition { get; set; }
        public string PreferredHand { get; set; }
        public string StrengthDescription { get; set; }
        public string WeaknessDescription { get; set; }
        public List<Weakness> WeaknessList { get; set; }
        public List<Strength> StrengthList { get; set; }
        public List<NationalTeam> NationalTeamList { get; set; }
        public string CurrentClub { get; set; }
        public Position CurrentClubPrimaryPosition { get; set; }
        public Position CurrentClubSecondaryPosition { get; set; }
        public string Accomplishments { get; set; }
        public string Statistics { get; set; }
        public string FormerClubs { get; set; }
        public string ErrorMessage { get; set; }
        public string Token { get; set; }
        public bool IsPLayer { get; set; }

        public Player() {
            IsPLayer = true;
            WeaknessList = new List<Weakness>();
            StrengthList = new List<Strength>();
            NationalTeamList = new List<NationalTeam>();
        }
    }
}
