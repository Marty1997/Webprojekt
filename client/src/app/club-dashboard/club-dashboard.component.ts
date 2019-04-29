import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { NgForm } from "@angular/forms";
import { loginService } from 'src/app/services/loginService';
import { Club } from '../models/club.model';
import { TrainingHours } from '../models/trainingHours.model';

@Component({
  selector: 'app-club-dashboard',
  templateUrl: './club-dashboard.component.html',
  styleUrls: ['./club-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClubDashboardComponent implements OnInit {

  clubBinding: Club;
  traning1 = new TrainingHours();
  traning2 = new TrainingHours();

  myInterval = 3000;
  slides = [
    {image: 'assets/Images/Håndboldbane.jpg'},
    {image: 'assets/Images/omklædning.jpg'},
    {image: 'assets/Images/Styrke.jpg'}
  ];
  constructor(private loginService: loginService) {
    this.clubBinding = new Club();
    this.clubBinding.name="lkamsd";
    this.clubBinding.league="First leauge";
    this.clubBinding.country="Denmark";
    this.clubBinding.streetAddress="Fyensgade";
    this.clubBinding.streetNumber="2";
    this.clubBinding.city="Tvis";
    this.clubBinding.zipcode="1212";
    this.clubBinding.trainer="Morten";
    this.clubBinding.assistantTrainer="John";
    this.clubBinding.physiotherapist="kmalsd";
    this.clubBinding.assistantPhysiotherapist="klmasd";
    this.clubBinding.manager="msam";
    
    this.traning1.name="Handball";
    this.traning1.mon="19-20";
    this.traning1.tue="REST";
    this.traning1.wed="19-12";
    this.traning1.thu="REST";
    this.traning1.fri="REST";
    this.traning1.sat="12-12";
    this.traning1.sun="REST";
    this.clubBinding.trainingHoursList.push(this.traning1);

    this.traning2.name="Fitness Traning";
    this.traning2.mon="19-20";
    this.traning2.tue="REST";
    this.traning2.wed="19-12";
    this.traning2.thu="REST";
    this.traning2.fri="REST";
    this.traning2.sat="12-12";
    this.traning2.sun="REST";
    this.clubBinding.trainingHoursList.push(this.traning2);
    
    this.clubBinding.openPositionList.push("Left back");
    this.clubBinding.openPositionList.push("Right back");
    this.clubBinding.valueDescription="Vlaue value value";
    this.clubBinding.preferenceDescription="prefe pref pref pref";
    this.clubBinding.valuesList.push("mklasd");
    this.clubBinding.valuesList.push("lkmasdkm");
   this.clubBinding.preferenceList.push("Pref");
   this.clubBinding.preferenceList.push("Pref pref pref");
   }

  ngOnInit() {
    if(this.loginService.typeOfLogin == "Club") {
        //this.clubBinding = this.loginService.clubInSession;
    }
    else if(this.loginService.typeOfLogin == "Player") {
      //find klubben som spilleren vil se og put i clubBinding variablen
    }
    else {
      this.loginService.logout();
    }
  }

}
