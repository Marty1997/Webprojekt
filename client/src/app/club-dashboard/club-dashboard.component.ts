import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { NgForm } from "@angular/forms";
import { loginService } from 'src/app/services/loginService';
import { Club } from '../models/club.model';

@Component({
  selector: 'app-club-dashboard',
  templateUrl: './club-dashboard.component.html',
  styleUrls: ['./club-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClubDashboardComponent implements OnInit {

  clubBinding: Club;

  myInterval = 3000;
  slides = [
    {image: 'assets/Images/Håndboldbane.jpg'},
    {image: 'assets/Images/omklædning.jpg'},
    {image: 'assets/Images/Styrke.jpg'}
  ];

  constructor(private loginService: loginService) {

   }

  ngOnInit() {
    if(this.loginService.typeOfLogin == "Club") {
      if(this.loginService.refreshValue) {
        this.loginService.LoginUserIfValidTokenOnRefresh(this.loginService.getDecodeToken());
        this.loginService.refreshValue = false;
      }
        this.clubBinding = this.loginService.clubInSession;
        console.log(this.clubBinding)
        this.clubBinding.trainingHoursList.forEach((elm) => {
          if(elm.mon == null) {
             elm.mon = "-"
          }
          if(elm.tue == null) {
            elm.tue = "-"
          }
          if(elm.wed == null) {
            elm.wed = "-"
          }
          if(elm.thu == null) {
            elm.thu = "-"
          }
          if(elm.fri == null) {
            elm.fri = "-"
          }
          if(elm.sat == null) {
            elm.sat = "-"
          }
          if(elm.sun == null) {
            elm.sun = "-"
          }
        }); 
        if(this.clubBinding.trainer == null) {
          this.clubBinding.trainer = "Not specified";
        }
        if(this.clubBinding.assistantTrainer == null) {
          this.clubBinding.assistantTrainer = "Not specified";
        }
        if(this.clubBinding.physiotherapist == null) {
          this.clubBinding.physiotherapist = "Not specified";
        }
        if(this.clubBinding.assistantPhysiotherapist == null) {
          this.clubBinding.assistantPhysiotherapist = "Not specified";
        }
        if(this.clubBinding.manager == null) {
          this.clubBinding.manager = "Not specified";
        }
        console.log(this.clubBinding)
    }
    else if(this.loginService.typeOfLogin == "Player") {
      //find klubben som spilleren vil se og put i clubBinding variablen
    }
    else {
      this.loginService.logout();
    }
  }

}
