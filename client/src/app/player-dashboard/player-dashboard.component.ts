import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from "@angular/forms";
import { loginService } from 'src/app/services/loginService';
import { Player } from '../models/player.model';

@Component({
  selector: 'app-player-dashboard',
  templateUrl: './player-dashboard.component.html',
  styleUrls: ['./player-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlayerDashboardComponent implements OnInit {

  playerBinding: Player;

  isFirstOpen = true;
  
  constructor(private loginService: loginService) { }

  ngOnInit() {

    if(this.loginService.typeOfLogin == "Player") {
      this.playerBinding = this.loginService.playerInSession;
      console.log(this.playerBinding);

      if(this.playerBinding.primaryPosition == null) {
        this.playerBinding.primaryPosition = "Not specified";
      }
      if(this.playerBinding.secondaryPosition == null) {
        this.playerBinding.secondaryPosition = "Not specified";
      }
      if(this.playerBinding.contractStatus == null) {
        this.playerBinding.contractStatus = "Not specified";
      }
      if(this.playerBinding.preferredHand == null) {
        this.playerBinding.preferredHand = "Not specified";
      }
      if(this.playerBinding.injuryStatus == null) {
        this.playerBinding.injuryStatus = "Not specified";
      }
      if(this.playerBinding.currentClub == null) {
        this.playerBinding.currentClub = "Not specified";
      }
      if(this.playerBinding.currentClubPrimaryPosition  == null) {
        this.playerBinding.currentClubPrimaryPosition  = "Not specified";
      }
      if(this.playerBinding.currentClubSecondaryPosition  == null) {
        this.playerBinding.currentClubSecondaryPosition  = "Not specified";
      }
      if(this.playerBinding.accomplishments  == null) {
        this.playerBinding.accomplishments  = "Not specified";
      }
      if(this.playerBinding.statistic  == null) {
        this.playerBinding.statistic  = "Not specified";
      }
      if(this.playerBinding.formerClubs  == null) {
        this.playerBinding.formerClubs  = "Not specified";
      }
      
    }
    else if(this.loginService.typeOfLogin == "Club") {
      //find spilleren som klubben vil se og put i playerBinding variablen
    }
    else {
      this.loginService.logout();
    }
  }

}
