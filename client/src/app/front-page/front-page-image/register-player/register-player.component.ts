import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
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
  personalInfoFormGroup: FormGroup; 
  additionalInfoFormGroup: FormGroup;
  strengthWeaknessFormGroup: FormGroup;
  sportCvFormGroup: FormGroup;
  nationalTeamFormGroup: FormGroup;
  playerPresentationFormGroup: FormGroup;
  hide = true; // password visibility
  selectedFile: File = null;
  uploadStatus: boolean = false;
  uploadText: string = "";

  constructor(private _formBuilder: FormBuilder, 
                private registerService: registerService, 
                private uploadFilesService: uploadFilesService) {}

  ngOnInit() {
    this.personalInfoFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      day: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      month: ['', Validators.required],
      year: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });
    this.email = this.personalInfoFormGroup.value.email;
    this.additionalInfoFormGroup = this._formBuilder.group({
      height: [''],
      weight: [''],
      bodyfat: [''],
      primaryPosition: [''],
      secondaryPosition: [''],
      preferredHand: ['']
    });
    this.strengthWeaknessFormGroup = this._formBuilder.group({
      strengths: [''],
      weaknesses: ['']
    });
    this.sportCvFormGroup = this._formBuilder.group({
      currentClub: [''],
      currentPosition: [''],
      accomplishments: [''],
      statistics: [''],
      formerClubs: ['']
    });
    this.nationalTeamFormGroup = this._formBuilder.group({
      aTeamAppearances: [''],
      aTeamPosition: [''],
      aTeamStatistics: [''],
      bTeamAppearances: [''],
      bTeamPosition: [''],
      bTeamStatistics: [''],
      u21TeamAppearances: [''],
      u21TeamPosition: [''],
      u21TeamStatistics: [''],
      u18TeamAppearances: [''],
      u18TeamPosition: [''],
      u18TeamStatistics: [''],
    });
    this.playerPresentationFormGroup = this._formBuilder.group({
      file: ['']
    });
  }

  getErrorMessage() {
    return this.personalInfoFormGroup.value.email.hasError('required') ? 'You must enter a value' : 
      this.personalInfoFormGroup.value.email.hasError('email') ? 'Not a valid email' : '';
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

    // player.email = this.personalInfoFormGroup.value.email;
    // player.password = this.personalInfoFormGroup.value.password;
    // player.firstName = this.personalInfoFormGroup.value.firstName;
    // player.lastName = this.personalInfoFormGroup.value.lastName;
    // player.country = this.personalInfoFormGroup.value.country;
    // player.city = this.personalInfoFormGroup.value.city;
    // player.day = this.personalInfoFormGroup.value.day;
    // player.month = this.personalInfoFormGroup.value.month;
    // player.year = this.personalInfoFormGroup.value.year;

    // optional info - (can be null)

    // player.height = this.additionalInfoFormGroup.value.height;
    // player.weight = this.additionalInfoFormGroup.value.weight;
    // player.bodyfat = this.additionalInfoFormGroup.value.bodyfat;
    // player.primaryPosition = this.additionalInfoFormGroup.value.primaryPosition;
    // player.secondaryPosition = this.additionalInfoFormGroup.value.secondaryPosition;
    // player.preferredHand = this.additionalInfoFormGroup.value.preferredHand;

    // player.strengths = this.strengthWeaknessFormGroup.value.strengths;
    // player.weaknesses = this.strengthWeaknessFormGroup.value.weaknesses;

    // player.currentClub = this.sportCvFormGroup.value.currentClub;
    // player.currentPosition = this.sportCvFormGroup.value.currentPosition;
    // player.accomplishments = this.sportCvFormGroup.value.accomplishments;
    // player.statistics = this.sportCvFormGroup.value.statistics;
    // player.formerClubs = this.sportCvFormGroup.value.formerClubs;

    // player.aTeamAppearances = this.nationalTeamFormGroup.value.aTeamAppearances;
    // player.aTeamPosition = this.nationalTeamFormGroup.value.aTeamPosition;
    // player.aTeamStatistics = this.nationalTeamFormGroup.value.aTeamStatistics;
    // player.bTeamAppearances = this.nationalTeamFormGroup.value.bTeamAppearances;
    // player.bTeamPosition = this.nationalTeamFormGroup.value.bTeamPosition;
    // player.bTeamStatistics = this.nationalTeamFormGroup.value.bTeamStatistics;
    // player.u21TeamAppearances = this.nationalTeamFormGroup.value.u21TeamAppearances;
    // player.u21TeamPosition = this.nationalTeamFormGroup.value.u21TeamPosition;
    // player.u21TeamStatistics = this.nationalTeamFormGroup.value.u21TeamStatistics;
    // player.u18TeamAppearances = this.nationalTeamFormGroup.value.u18TeamAppearances;
    // player.u18TeamPosition = this.nationalTeamFormGroup.value.u18TeamPosition;
    // player.u18TeamStatistics = this.nationalTeamFormGroup.value.u18TeamStatistics;

    // return player;
  }
}