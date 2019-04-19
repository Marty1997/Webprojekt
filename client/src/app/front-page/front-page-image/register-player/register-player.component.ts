import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import { registerService } from 'src/app/services/registerService';
import { uploadFilesService } from 'src/app/services/uploadFilesService';
import { ErrorStateMatcher } from '@angular/material';
// import {playerModel} from '..models/player.model';
// import { MustMatch } from './_helpers/must-match.validator';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

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

  // input validators
  validate = new MyErrorStateMatcher();
  numbersOnlyRegex = /^[0-9]*$/;
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  confirmPasswordControl = new FormControl('', Validators.required);
  firstNameControl = new FormControl('', Validators.required);
  lastNameControl = new FormControl('', Validators.required);
  countryControl = new FormControl('', Validators.required);
  cityControl = new FormControl('', Validators.required);
  dayControl = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern(this.numbersOnlyRegex)]);
  monthControl = new FormControl('', Validators.required);
  yearControl = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(this.numbersOnlyRegex)]);
  heightControl = new FormControl('', Validators.pattern(this.numbersOnlyRegex));
  weightControl = new FormControl('', Validators.pattern(this.numbersOnlyRegex));
  bodyfatControl = new FormControl('', Validators.pattern(this.numbersOnlyRegex));

  constructor(private _formBuilder: FormBuilder, 
                private registerService: registerService, 
                private uploadFilesService: uploadFilesService) {}

  ngOnInit() {
    this.personalInfoFormGroup = this._formBuilder.group({
      email: ['', this.emailControl],
      password: ['', this.passwordControl],
      confirmPassword: ['', this.passwordControl],
      firstName: ['', this.firstNameControl],
      lastName: ['', this.lastNameControl],
      country: ['', this.countryControl],
      city: ['', this.cityControl],
      day: ['', this.dayControl],
      month: ['', this.monthControl],
      year: ['', this.yearControl]
    });
    this.additionalInfoFormGroup = this._formBuilder.group({
      height: ['', this.heightControl],
      weight: ['', this.weightControl],
      bodyfat: ['', this.bodyfatControl],
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