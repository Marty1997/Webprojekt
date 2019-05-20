import { Component, OnInit } from '@angular/core';
import { Club } from 'src/app/models/club.model';
import { loginService } from "src/app/services/loginService";
import { updateService } from "src/app/services/updateService";
import { deleteService } from "src/app/services/deleteService";
import { uploadFilesService} from "src/app/services/uploadFilesService";
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/front-page/front-page-image/register-player/register-player.component';

@Component({
  selector: 'app-update-club',
  templateUrl: './update-club.component.html',
  styleUrls: ['./update-club.component.css']
})
export class UpdateClubComponent implements OnInit {

  clubBinding: Club;
  facilityImages: string[] = [];
  
  step: number = 0;
  leagueList: string[] = ['First League', 'Second League', 'Third League'];
  countryList: string[] = ['Denmark', 'Sweden', 'Norway'];
  trainingHours: any[] = [
    {value: 'Rest'},
    {value: '00:00'}, {value: '00:15'}, {value: '00:30'}, {value: '00:45'},
    {value: '01:00'}, {value: '01:15'}, {value: '01:30'}, {value: '01:45'},
    {value: '02:00'}, {value: '02:15'}, {value: '02:30'}, {value: '02:45'},
    {value: '03:00'}, {value: '03:15'}, {value: '03:30'}, {value: '03:45'},
    {value: '04:00'}, {value: '04:15'}, {value: '04:30'}, {value: '04:45'},
    {value: '05:00'}, {value: '05:15'}, {value: '05:30'}, {value: '05:45'},
    {value: '06:00'}, {value: '06:15'}, {value: '06:30'}, {value: '06:45'},
    {value: '07:00'}, {value: '07:15'}, {value: '07:30'}, {value: '07:45'},
    {value: '08:00'}, {value: '08:15'}, {value: '08:30'}, {value: '08:45'},
    {value: '09:00'}, {value: '09:15'}, {value: '09:30'}, {value: '09:45'},
    {value: '10:00'}, {value: '10:15'}, {value: '10:30'}, {value: '10:45'},
    {value: '11:00'}, {value: '11:15'}, {value: '11:30'}, {value: '11:45'},
    {value: '12:00'}, {value: '12:15'}, {value: '12:30'}, {value: '12:45'},
    {value: '13:00'}, {value: '13:15'}, {value: '13:30'}, {value: '13:45'},
    {value: '14:00'}, {value: '14:15'}, {value: '14:30'}, {value: '14:45'},
    {value: '15:00'}, {value: '15:15'}, {value: '15:30'}, {value: '15:45'},
    {value: '16:00'}, {value: '16:15'}, {value: '16:30'}, {value: '16:45'},
    {value: '17:00'}, {value: '17:15'}, {value: '17:30'}, {value: '17:45'},
    {value: '18:00'}, {value: '18:15'}, {value: '18:30'}, {value: '18:45'},
    {value: '19:00'}, {value: '19:15'}, {value: '19:30'}, {value: '19:45'},
    {value: '20:00'}, {value: '20:15'}, {value: '20:30'}, {value: '20:45'},
    {value: '21:00'}, {value: '21:15'}, {value: '21:30'}, {value: '21:45'},
    {value: '22:00'}, {value: '22:15'}, {value: '22:30'}, {value: '22:45'},
    {value: '23:00'}, {value: '23:15'}, {value: '23:30'}, {value: '23:45'}
  ];
  // validate inputs
  errorMessage = "";
  validate = new MyErrorStateMatcher();
  numbersOnlyRegex = /^[0-9]*$/;
  numbersOnlyControl = new FormControl(
    "",
    Validators.pattern(this.numbersOnlyRegex)
  );
  currentPassword = new FormControl("", [
    Validators.required,
    Validators.minLength(6)
  ]);
  password = new FormControl("", [
    Validators.required,
    Validators.minLength(6)
  ]);
  name = new FormControl("", Validators.required);
  league = new FormControl("", Validators.required);
  streetAddress = new FormControl("", Validators.required);
  streetNumber = new FormControl("", [
    Validators.required,
    Validators.pattern(this.numbersOnlyRegex)
  ]);
  country = new FormControl("", Validators.required);
  city = new FormControl("", Validators.required);
  zipcode = new FormControl("", Validators.required);

  constructor(
    private loginService: loginService,
    private updateService: updateService,
    private uploadFilesService: uploadFilesService,
    private deleteService: deleteService
    ) { }

  ngOnInit() {
    this.clubBinding = this.loginService.clubInSession;
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  upload = (files, type: string) => {
    if (files.length === 0) {
      return;
    }
    else {
      this.uploadFilesService.uploadFile(files).subscribe(res => {
        this.uploadFilesService.createPath(JSON.stringify(res.body), 'image');
        if(type === 'profile') {
          this.clubBinding.imagePath = this.uploadFilesService.imagePath;
        }
        if(type === 'facility') {
          if(this.clubBinding.facilityImagesList != null) {
            this.facilityImages = this.clubBinding.facilityImagesList;
          }
        this.facilityImages.push(this.uploadFilesService.imagePath);
        this.clubBinding.facilityImagesList = this.facilityImages;
        }
      });
    }
  }

  updateClub() {
    this.updateService.updateClub(this.clubBinding);
  }

  deleteSquadPlayer(type: string) {
    if(type == 'Current Year') {
      this.deleteService.deleteSquadPlayer(this.clubBinding.currentSquadPlayersList);
    }
    if(type == 'Next Year') {
      this.deleteService.deleteSquadPlayer(this.clubBinding.nextYearSquadPlayersList);
    }
  }

  deleteTrainingHours() {
    this.deleteService.deleteTrainingHours(this.clubBinding.trainingHoursList);
  }

  deleteClubValue() {
    this.deleteService.deleteClubValue(this.clubBinding.valuesList);
  }

  deleteClubPreference() {
    this.deleteService.deleteClubPreference(this.clubBinding.preferenceList);
  }

  deleteJobPosition() {
    this.deleteService.deleteJobPosition(this.clubBinding.jobPositionsList);
  }

  deleteJobPositionStrength() {
    // this.deleteService.deleteJobPositionStrength();
  }

  cancel() {
    this.clubBinding = this.loginService.clubInSession;
  }
}
