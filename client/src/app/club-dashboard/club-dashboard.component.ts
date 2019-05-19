import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { loginService } from "src/app/services/loginService";
import { Club } from "../models/club.model";
import { searchService } from "../services/searchService";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";

@Component({
  selector: "app-club-dashboard",
  templateUrl: "./club-dashboard.component.html",
  styleUrls: ["./club-dashboard.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class ClubDashboardComponent implements OnInit {
  clubBinding: Club;
  isClub: boolean;
  clubs: Club[] = this.searchService.searchForClubsResult;

  myInterval = 3000;

  constructor(
    private loginService: loginService,
    private searchService: searchService,
    private router: Router
  ) {}

  ngOnInit() {
    
    if (this.loginService.typeOfLogin == "Club") {
      this.isClub = true;
      if (this.loginService.refreshValue) {
        this.loginService.LoginUserIfValidTokenOnRefresh(
          this.loginService.getDecodeToken()
        );
        this.loginService.refreshValue = false;
      }
      this.clubBinding = this.loginService.clubInSession;
      console.log(this.clubBinding);
      this.clubBinding.trainingHoursList.forEach(elm => {
        if (elm.mon == null) {
          elm.mon = "-";
        }
        if (elm.tue == null) {
          elm.tue = "-";
        }
        if (elm.wed == null) {
          elm.wed = "-";
        }
        if (elm.thu == null) {
          elm.thu = "-";
        }
        if (elm.fri == null) {
          elm.fri = "-";
        }
        if (elm.sat == null) {
          elm.sat = "-";
        }
        if (elm.sun == null) {
          elm.sun = "-";
        }
      });
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
      console.log(this.searchService.club);
      this.clubBinding = this.searchService.club;
      console.log(this.clubBinding);
    } else {
      this.loginService.logout();
    }
  }

  updateClub() {
    console.log("ramt");
    this.router.navigate(['/update-club'])
  }
}
