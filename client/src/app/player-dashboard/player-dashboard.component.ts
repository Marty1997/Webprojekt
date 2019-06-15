import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgForm } from "@angular/forms";
import { loginService } from "src/app/services/loginService";
import { updateService } from "src/app/services/updateService";
import { ActivatedRoute } from "@angular/router";
import { Player } from "../models/player.model";
import { searchService } from "../services/searchService";
import { Router } from "@angular/router";

@Component({
  selector: "app-player-dashboard",
  templateUrl: "./player-dashboard.component.html",
  styleUrls: ["./player-dashboard.component.css"],
  encapsulation: ViewEncapsulation.None,
  providers: []
})
export class PlayerDashboardComponent implements OnInit {
  isPlayer: boolean;
  playerBinding: Player;

  isFirstOpen = true;
  
  constructor(
    private route: ActivatedRoute,
    private searchService: searchService,
    private loginService: loginService,
    private updateService: updateService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.loginService.typeOfLogin == "Player") {
      this.isPlayer = true;
      if (this.loginService.refreshValue) {
        this.loginService.LoginUserIfValidTokenOnRefresh();
        this.loginService.refreshValue = false;
      }
 
      this.playerBinding = this.loginService.playerInSession;
   
    } else if (this.loginService.typeOfLogin == "Club") {
      //find spilleren som klubben vil se og put i playerBinding variablen
        this.playerBinding = this.searchService.player;
        }
     else {
      this.loginService.logout();
    }
  }
  
  updatePlayer() {
    this.router.navigate(['/update-player'])
  }
}
