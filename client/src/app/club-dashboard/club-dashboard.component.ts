import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { loginService } from "src/app/services/loginService";
import { Club } from "../models/club.model";
import { searchService } from "../services/searchService";
import { Router } from "@angular/router";

@Component({
  selector: "app-club-dashboard",
  templateUrl: "./club-dashboard.component.html",
  styleUrls: ["./club-dashboard.component.css"],
  providers: []
})
export class ClubDashboardComponent implements OnInit {
  clubBinding: Club;
  isClub: boolean;
  myInterval = 6000;


  constructor(
    private loginService: loginService,
    private searchService: searchService,
    private router: Router
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    if (this.loginService.typeOfLogin == "Club") {
      this.isClub = true;
      if (this.loginService.refreshValue) {
        this.loginService.LoginUserIfValidTokenOnRefresh();
        this.loginService.refreshValue = false;
      }
      this.clubBinding = this.loginService.clubInSession;

      if (this.clubBinding.trainer == null) {
        this.clubBinding.trainer = "Not specified";
      }
      if (this.clubBinding.assistantTrainer == null) {
        this.clubBinding.assistantTrainer = "Not specified";
      }
      if (this.clubBinding.physiotherapist == null) {
        this.clubBinding.physiotherapist = "Not specified";
      }
      if (this.clubBinding.assistantPhysiotherapist == null) {
        this.clubBinding.assistantPhysiotherapist = "Not specified";
      }
      if (this.clubBinding.manager == null) {
        this.clubBinding.manager = "Not specified";
      }
    } else if (this.loginService.typeOfLogin == "Player") {
      //find klubben som spilleren vil se og put i clubBinding variablen
      this.clubBinding = this.searchService.club;
    } else {
      this.loginService.logout();
    }
  }

  updateClub() {
    this.router.navigate(['/update-club'])
  }
}
