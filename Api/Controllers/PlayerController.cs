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

namespace Api.Controllers
{
    [Authorize]
    [EnableCors("allowOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    public class PlayerController : ControllerBase {

        private readonly PlayerLogic _playerLogic;

        public PlayerController(PlayerLogic playerLogic) {
            _playerLogic = playerLogic;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Register([FromBody] Player entity) {

            //Player entity = new Player();
            //NationalTeam nt = new NationalTeam();
            //nt.Name = "A Team";
            //nt.Appearances = 1;
            //nt.Statistic = "lort";
            //nt.Position = "Left wing";

            //entity.Email = "jens@gmail.com";
            //entity.Password = "Jens1234";
            //entity.FirstName = "Jens";
            //entity.LastName = "Jensen";
            //entity.Country = "Denmark";
            //entity.Day = "01";
            //entity.Month = "03";
            //entity.Year = "1993";
            //entity.Height = 188;
            //entity.Weight = 85;
            //entity.BodyFat = 15;
            //entity.PrimaryPosition = "Right wing";
            //entity.SecondaryPosition = "Left wing";
            //entity.PreferredHand = "Right hand";
            //entity.StrengthDescription = "Hurtig";
            //entity.WeaknessDescription = "Lidt for hurtig";
            //entity.WeaknessList.Add("Bad endurance");
            //entity.StrengthList.Add("Feintplayer");
            //entity.NationalTeamList.Add(nt);
            //entity.CurrentClubPrimaryPosition = "Right wing";
            //entity.CurrentClubSecondaryPosition = "Left wing";
            //entity.CurrentClub = "Right wing";
            //entity.Accomplishments = "MVP 2017";
            //entity.Statistic = "Gode resultater";
            //entity.ImagePath = "imagepath.com";
            //entity.VideoPath = "videopath.com";
            //entity.FormerClubs = "TMT Tønder";

            Player player = _playerLogic.Create(entity);

            return Ok(player);
        }
    }
}
