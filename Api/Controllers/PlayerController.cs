﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.BusinessLogic;
using Api.DAL;
using Api.DAL.Entities;
using Api.DataTransferObjects;
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
        private readonly IRepository<Player> _playerRepos;
        private readonly Authentication authentication;
        private readonly UserCredentialsLogic _userCredentialsLogic;

        public PlayerController(PlayerLogic playerLogic, IRepository<Player> playerRepos, Authentication authentication, UserCredentialsLogic userCredentialsLogic) {
            _playerLogic = playerLogic;
            _playerRepos = playerRepos;
            this.authentication = authentication;
            _userCredentialsLogic = userCredentialsLogic;
        }

        // api/Player
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Register([FromBody] Player entity) {

            Player player = _playerLogic.Create(entity);

            return Ok(player);
        }

        // api/Player/GetById
        [HttpGet("{id}")]
        [Route("[action]")]
        public IActionResult GetById([FromQuery]int id) {
            if(id > 0) {
                return Ok(_playerRepos.GetById(id));
            }
            else {
                return StatusCode(404, "Resource not found");
            }
        }

        // api/Player/UpdateInfo
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateInfo([FromBody] Player entity) {
            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {

                //New password
                if (entity.Password != null && entity.NewPassword != null) {
                    //Check if current password is correct
                    if (authentication.CheckPassword(entity.Email, entity.Password)) {
                        //Create new password
                        entity.UserCredentials = _userCredentialsLogic.Create(entity.NewPassword);
                    }
                    else {
                        return StatusCode(400, "Invalid password");
                    }
                }

                // Update player info
                entity.Id = id;
                if (_playerLogic.UpdateInfo(entity)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Player/UpdateAdditionalInfo
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateAdditionalInfo([FromBody] Player entity) {
            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {
                
                // Update player additional info
                entity.Id = id;
                if (_playerLogic.UpdateAdditionalInfo(entity)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Player/Deletestrengthsandweaknesses
        [HttpPost]
        [Route("[action]")]
        public IActionResult DeleteStrengthsAndWeaknesses() {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {
                if (_playerLogic.DeleteStrengthsAndWeaknesses(id)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Player/UpdateStrengthsandweaknesses
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateStrengthsAndWeaknesses([FromBody] Player entity) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {
                entity.Id = id;
                if (_playerLogic.UpdateStrengthsAndWeaknesses(entity)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Player/UpdateSportCV
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateSportCV([FromBody] Player entity) {
            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {

                // Update player sport cv
                entity.Id = id;
                if (_playerLogic.UpdateSportCV(entity)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }

        // api/Player/UpdateProfile
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateProfile([FromBody] Player entity) {

            var decodedToken = authentication.DecodeTokenFromRequest(Request.Headers["Authorization"]);
            string role = authentication.GetRoleFromToken(decodedToken);
            int id = authentication.GetIDFromToken(decodedToken);

            if (role == "Player") {
                entity.Id = id;
                if (_playerLogic.UpdateProfile(entity)) {
                    return Ok();
                }
            }
            return StatusCode(400, "Failed");
        }


        // api/Player/SearchPlayers
        [HttpGet]
        [Route("[action]")]
        public IActionResult SearchPlayers([FromQuery] SearchCriteriaForPlayer request) {
            
            
            return Ok(_playerLogic.HandleSearchAlgorithm(request));
        }
    }
}
