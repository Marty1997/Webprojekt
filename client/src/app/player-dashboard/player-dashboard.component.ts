import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgForm } from "@angular/forms";
import { loginService } from "src/app/services/loginService";

import { ActivatedRoute } from "@angular/router";
import { Player } from "../models/player.model";
import { searchService } from "../services/searchService";

@Component({
  selector: "app-player-dashboard",
  templateUrl: "./player-dashboard.component.html",
  styleUrls: ["./player-dashboard.component.css"],
  encapsulation: ViewEncapsulation.None,
  providers: [searchService]
})
export class PlayerDashboardComponent implements OnInit {
  isPlayer: boolean;
  playerBinding: Player;
  players: Player[] = this.searchService.searchForPlayersResult;

  isFirstOpen = true;
  constructor(
    private route: ActivatedRoute,
    private searchService: searchService,
    private loginService: loginService
  ) {}

  ngOnInit() {
    if (this.loginService.typeOfLogin == "Player") {
      this.isPlayer = true;
      if (this.loginService.refreshValue) {
        this.loginService.LoginUserIfValidTokenOnRefresh(
          this.loginService.getDecodeToken()
        );
        this.loginService.refreshValue = false;
      }
      this.playerBinding = this.loginService.playerInSession;
      console.log(this.playerBinding);
    } else if (this.loginService.typeOfLogin == "Club") {
      //find spilleren som klubben vil se og put i playerBinding variablen
      this.isPlayer = false;
      this.players.forEach((p: Player) => {
        if (p.id == this.route.snapshot.params.id) {
          this.searchService.getPlayerById(p); //fetch player data
          this.playerBinding = this.searchService.player;
        }
      });
    } else {
      console.log("Den her");
      this.loginService.logout();
    }
  }
}
