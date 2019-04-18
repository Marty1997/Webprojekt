import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { registerService } from 'src/app/services/registerService';
import { uploadFilesService } from 'src/app/services/uploadFilesService';
// import {playerModel} from '..models/player.model';
// import { MustMatch } from './_helpers/must-match.validator';

@Component({
    selector: 'app-register-player',
    templateUrl: './register-player.component.html',
    styleUrls: ['./register-player.component.css'],
    providers: [registerService, uploadFilesService]
})
export class RegisterPlayerComponent implements OnInit {
  isLinear = true;
  personalInfoFormGroup: FormGroup;
  additionalInfoFormGroup: FormGroup;
  strengthWeaknessFormGroup: FormGroup;
  sportCvFormGroup: FormGroup;
  nationalTeamFormGroup: FormGroup;
  playerPresentationFormGroup: FormGroup;

  selectedFile: File = null;
  uploadStatus: boolean = false;
  uploadText: string = "";

  constructor(private _formBuilder: FormBuilder, 
                private registerService: registerService, 
                private uploadFilesService: uploadFilesService) {

  }

  ngOnInit() {
    this.personalInfoFormGroup = this._formBuilder.group({
      emailCtrl: ['', [Validators.required, Validators.email]],
      passwordCtrl: ['', [Validators.required, Validators.minLength(6)]],
      confirmPasswordCtrl: ['', Validators.required],
      firstNameCtrl: ['', Validators.required],
      lastNameCtrl: ['', Validators.required],
      countryCtrl: ['', Validators.required],
      cityCtrl: ['', Validators.required],
      dayCtrl: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      monthCtrl: ['', Validators.required],
      yearCtrl: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });
    this.additionalInfoFormGroup = this._formBuilder.group({
      heightCtrl: [''],
      weightCtrl: [''],
      bodyfatCtrl: [''],
      primaryPositionCtrl: [''],
      secondaryPositionCtrl: [''],
      preferredHandCtrl: ['']
    });
    this.strengthWeaknessFormGroup = this._formBuilder.group({
      strengthsCtrl: [''],
      weaknessesCtrl: ['']
    });
    this.sportCvFormGroup = this._formBuilder.group({
      currentClubCtrl: [''],
      currentPositionCtrl: [''],
      accomplishmentsCtrl: [''],
      statisticsCtrl: [''],
      formerClubsCtrl: ['']
    });
    this.nationalTeamFormGroup = this._formBuilder.group({
      aTeamAppearancesCtrl: [''],
      aTeamPositionCtrl: [''],
      aTeamStatisticsCtrl: [''],
      bTeamAppearancesCtrl: [''],
      bTeamPositionCtrl: [''],
      bTeamStatisticsCtrl: [''],
      u21TeamAppearancesCtrl: [''],
      u21TeamPositionCtrl: [''],
      u21TeamStatisticsCtrl: [''],
      u18TeamAppearancesCtrl: [''],
      u18TeamPositionCtrl: [''],
      u18TeamStatisticsCtrl: [''],
    });
    this.playerPresentationFormGroup = this._formBuilder.group({
      removableFile: ['']
    });
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    if(this.selectedFile.size > 0) {
      this.uploadStatus = true;
      this.uploadText = 'Your file has been uploaded';
    } else {
      this.uploadStatus = false;
      this.uploadText = '';
    }
  }

  onUpload() {
    if(this.selectedFile != null) {
      this.uploadFilesService.uploadFile(this.selectedFile);
      this.uploadText = "Your file has been uploaded";
      this.uploadStatus = true;
    } else {
      this.uploadText = "Please select a file"
      this.uploadStatus = false;
    }
  }

  /* 
    Register player with registerService
  */
  registerPlayer() {
    this.registerService.registerPlayer(this.buildPlayer());
  }

  /* 
    Build player with form inputs
  */
  buildPlayer() {
    // player: Player = new Player(); //imported from player model

    // required info

    // player.email = this.personalInfoFormGroup.value.emailCtrl;
    // player.password = this.personalInfoFormGroup.value.passwordCtrl;
    // player.firstName = this.personalInfoFormGroup.value.firstNameCtrl;
    // player.lastName = this.personalInfoFormGroup.value.lastNameCtrl;
    // player.country = this.personalInfoFormGroup.value.countryCtrl;
    // player.city = this.personalInfoFormGroup.value.cityCtrl;
    // player.day = this.personalInfoFormGroup.value.dayCtrl;
    // player.month = this.personalInfoFormGroup.value.monthCtrl;
    // player.year = this.personalInfoFormGroup.value.yearCtrl;

    // optional info - (can be null)

    // player.height = this.additionalInfoFormGroup.value.heightCtrl;
    // player.weight = this.additionalInfoFormGroup.value.weightCtrl;
    // player.bodyfat = this.additionalInfoFormGroup.value.bodyfatCtrl;
    // player.primaryPosition = this.additionalInfoFormGroup.value.primaryPositionCtrl;
    // player.secondaryPosition = this.additionalInfoFormGroup.value.secondaryPositionCtrl;
    // player.preferredHand = this.additionalInfoFormGroup.value.preferredHandCtrl;

    // player.strengths = this.strengthWeaknessFormGroup.value.strengthsCtrl;
    // player.weaknesses = this.strengthWeaknessFormGroup.value.weaknessesCtrl;

    // player.currentClub = this.sportCvFormGroup.value.currentClubCtrl;
    // player.currentPosition = this.sportCvFormGroup.value.currentPositionCtrl;
    // player.accomplishments = this.sportCvFormGroup.value.accomplishmentsCtrl;
    // player.statistics = this.sportCvFormGroup.value.statisticsCtrl;
    // player.formerClubs = this.sportCvFormGroup.value.formerClubsCtrl;

    // player.aTeamAppearances = this.nationalTeamFormGroup.value.aTeamAppearancesCtrl;
    // player.aTeamPosition = this.nationalTeamFormGroup.value.aTeamPositionCtrl;
    // player.aTeamStatistics = this.nationalTeamFormGroup.value.aTeamStatisticsCtrl;
    // player.bTeamAppearances = this.nationalTeamFormGroup.value.bTeamAppearancesCtrl;
    // player.bTeamPosition = this.nationalTeamFormGroup.value.bTeamPositionCtrl;
    // player.bTeamStatistics = this.nationalTeamFormGroup.value.bTeamStatisticsCtrl;
    // player.u21TeamAppearances = this.nationalTeamFormGroup.value.u21TeamAppearancesCtrl;
    // player.u21TeamPosition = this.nationalTeamFormGroup.value.u21TeamPositionCtrl;
    // player.u21TeamStatistics = this.nationalTeamFormGroup.value.u21TeamStatisticsCtrl;
    // player.u18TeamAppearances = this.nationalTeamFormGroup.value.u18TeamAppearancesCtrl;
    // player.u18TeamPosition = this.nationalTeamFormGroup.value.u18TeamPositionCtrl;
    // player.u18TeamStatistics = this.nationalTeamFormGroup.value.u18TeamStatisticsCtrl;

    // return player;
  }
}