using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.BusinessLogic;
using Api.DAL.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers {

    [Route("api/[controller]")]
    [ApiController]
    public class ClubController : ControllerBase {

        private readonly ClubLogic _clubLogic;

        public ClubController(ClubLogic clubLogic) {
            _clubLogic = clubLogic;
        }

        [HttpPost]
        public IActionResult Create() {

            Club entity = new Club();
            TrainingHours th1 = new TrainingHours();
            th1.Name = "Handball";
            th1.Mon = "Rest";
            th1.Tue = "17-19";
            th1.Wed = "15-16";
            th1.Thu = "13-14";
            th1.Fri = "Rest";
            th1.Sat = "Rest";
            th1.Sun = "Rest";

            TrainingHours th2 = new TrainingHours();
            th2.Name = "Fitness training";
            th2.Mon = "Rest";
            th2.Tue = "17-19";
            th2.Wed = "15-16";
            th2.Thu = "13-14";
            th2.Fri = "Rest";
            th2.Sat = "Rest";
            th2.Sun = "Rest";

            SquadPlayer nextYearSP = new SquadPlayer();
            nextYearSP.ShirtNumber = 10;
            nextYearSP.Season = "Next year";
            nextYearSP.Name = "Jon Petersen";
            nextYearSP.Position = "Left wing";

            SquadPlayer currentYearSP = new SquadPlayer();
            currentYearSP.ShirtNumber = 22;
            currentYearSP.Season = "Current year";
            currentYearSP.Name = "Max Jensen";
            currentYearSP.Position = "Right wing";

            entity.Email = "TMTTønder@gmail.com";
            entity.Password = "Club1234";
            entity.Name = "TMT Tønder";
            entity.Country = "Denmark";
            entity.League = "First league";
            entity.StreetAddress = "Tøndervej";
            entity.StreetNumber = "3";
            entity.City = "Tønder";
            entity.Zipcode = 9000;
            entity.Trainer = "Lars Larsen";
            entity.AssistantTrainer = "Jens Petersen";
            entity.Physiotherapist = "John Johnsen";
            entity.AssistantPhysiotherapist = "Jakob Jakobsen";
            entity.Manager = "Morten Mortensen";
            entity.ValueDescription = "Gode værdier";
            entity.PreferenceDescription = "Unge spillere";

            entity.TrainingHoursList.Add(th1);
            entity.TrainingHoursList.Add(th2);
            entity.CurrentSquadPlayersList.Add(currentYearSP);
            entity.NextYearSquadPlayersList.Add(nextYearSP);
            entity.ValuesList.Add("Talent development club");
            entity.PreferenceList.Add("Young players");
            entity.OpenPositionsList.Add("Pivot");
                
            var club = _clubLogic.Create(entity);

            return Ok(club);
        }
    }
}
