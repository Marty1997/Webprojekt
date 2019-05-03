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
    }
    else if(this.loginService.typeOfLogin == "Club") {
      //find spilleren som klubben vil se og put i playerBinding variablen
    }
    else {
      this.loginService.logout();
    }
  }

}
