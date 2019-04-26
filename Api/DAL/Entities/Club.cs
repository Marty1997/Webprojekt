using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Entities {
    public class Club {
        [JsonIgnore]
        public int Id { get; set; }
        [JsonIgnore]
        public UserCredentials UserCredentials { get; set; }
        [JsonIgnore]
        public string Password { get; set; }
        public string ErrorMessage { get; set; }
        public string  Token { get; set; }
        public bool IsClub { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string League { get; set; }
        public string Country { get; set; }
        public string StreetAddress { get; set; }
        public string StreetNumber { get; set; }
        public string City { get; set; }
        public string Zipcode { get; set; }
        public string Trainer { get; set; }
        public string AssistantTrainer { get; set; }
        public string Physiotherapist { get; set; }
        public string AssistantPhysiotherapist { get; set; }
        public string Manager { get; set; }
        public string ValueDescription { get; set; }
        public string PreferenceDescription { get; set; }

        public List<TrainingHours> TrainingHoursList { get; set; }
        public List<SquadPlayer> SquadPlayersList { get; set; }
        public List<string> ValuesList { get; set; }
        public List<string> PreferenceList { get; set; }
        public List<Position> OpenPositionsList { get; set; }

        //// files
        //logo: File;
        //facilityPictures: FileList;


        public Club() {
            TrainingHoursList = new List<TrainingHours>();
            SquadPlayersList = new List<SquadPlayer>();
            ValuesList = new List<string>();
            PreferenceList = new List<string>();
            OpenPositionsList = new List<Position>();
            IsClub = true;
        }
    }
}
