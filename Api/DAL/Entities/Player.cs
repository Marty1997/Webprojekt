using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Entities {
    public class Player {
        public int Id { get; set; }
        [JsonIgnore]
        public UserCredentials UserCredentials { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Country { get; set; }
        public string League { get; set; }
        public int Day { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int? Height { get; set; }
        public int? Weight { get; set; }
        public int? Bodyfat { get; set; }
        public string PrimaryPosition { get; set; }
        public string SecondaryPosition { get; set; }
        public string PreferredHand { get; set; }
        public string StrengthDescription { get; set; }
        public string WeaknessDescription { get; set; }
        public List<string> WeaknessList { get; set; }
        public List<string> StrengthList { get; set; }
        public List<NationalTeam> NationalTeamList { get; set; }
        public string CurrentClubPrimaryPosition { get; set; }
        public string CurrentClubSecondaryPosition { get; set; }
        public string CurrentClub { get; set; }
        public string Accomplishments { get; set; }
        public string Statistic { get; set; }
        public string VideoPath { get; set; }
        public string ImagePath { get; set; }
        public string FormerClubs { get; set; }
        public string ContractStatus { get; set; }
        public DateTime? ContractExpired { get; set; }
        public string InjuryStatus { get; set; }
        public DateTime? InjuryExpired { get; set; }
        public string InjuryDescription { get; set; }
        public bool IsAvailable { get; set; }
        public string ErrorMessage { get; set; }
        public string Token { get; set; }
        public bool IsPlayer { get; set; }

        public Player() {
            IsPlayer = true;
            WeaknessList = new List<string>();
            StrengthList = new List<string>();
            NationalTeamList = new List<NationalTeam>();
        }
    }
}
