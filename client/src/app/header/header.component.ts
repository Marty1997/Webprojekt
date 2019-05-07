import { Component, OnInit } from "@angular/core";
import { loginService } from "../services/loginService";
import { Player } from '../models/player.model';
import { Club } from '../models/club.model';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  navbarCollapse: boolean = true;
  player: Player;
  club: Club;
  isPlayer: boolean = false;
  isClub: boolean = false;

  constructor(private loginService: loginService) {}

  ngOnInit() {
    if(this.loginService.typeOfLogin != 'Club') {
      this.player = this.loginService.playerInSession;
      this.isPlayer = true;
    } else {
      this.club = this.loginService.clubInSession;
      this.isClub = true;
    }
  }

  logout() {
    this.loginService.logout();
  }

  toggleNavbarCollapse() {
    this.navbarCollapse = !this.navbarCollapse;
  }
}
