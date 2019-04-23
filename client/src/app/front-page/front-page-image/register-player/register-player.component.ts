import {Component, OnInit, Input, Attribute} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, AbstractControl, Validator} from '@angular/forms';
import { registerService } from 'src/app/services/registerService';
import { uploadFilesService } from 'src/app/services/uploadFilesService';
import { ErrorStateMatcher } from '@angular/material';
import { Player } from '../../../models/player.model';

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
  @Input() modalRef: any;
  player: Player = new Player();
  personalInfoFormGroup: FormGroup; 
  additionalInfoFormGroup: FormGroup;
  strengthWeaknessFormGroup: FormGroup;
  sportCvFormGroup: FormGroup;
  nationalTeamFormGroup: FormGroup;
  playerPresentationFormGroup: FormGroup;
  hide = true; // password visibility
  profilePicture: File = null;
  presentationVideo: File = null;

  // input validators
  validate = new MyErrorStateMatcher();
  numbersOnlyRegex = /^[0-9]*$/;
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
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
      email: this.emailControl, password: this.passwordControl, firstName: this.firstNameControl,
      lastName: this.lastNameControl, country: this.countryControl, city: this.cityControl,
      day: this.dayControl, month: this.monthControl, year: this.yearControl
    });
    this.additionalInfoFormGroup = this._formBuilder.group({
      height: this.heightControl, weight: this.weightControl, bodyfat: this.bodyfatControl,
      primaryPosition: [''], secondaryPosition: [''], preferredHand: ['']
    });
    this.strengthWeaknessFormGroup = this._formBuilder.group({
      strengths: [''], weaknesses: ['']
    });
    this.sportCvFormGroup = this._formBuilder.group({
      currentClub: [''], currentPrimaryPosition: [''], currentSecondaryPosition: [''],
      accomplishments: [''], statistics: [''], formerClubs: ['']
    });
    this.nationalTeamFormGroup = this._formBuilder.group({
      aTeamAppearances: [''], aTeamPosition: [''], aTeamStatistics: [''], 
      bTeamAppearances: [''], bTeamPosition: [''], bTeamStatistics: [''],
      u21TeamAppearances: [''], u21TeamPosition: [''], u21TeamStatistics: [''],
      u18TeamAppearances: [''], u18TeamPosition: [''], u18TeamStatistics: ['']
    });
    this.playerPresentationFormGroup = this._formBuilder.group({
      profilePictureControl: [''], videoFileControl: ['']
    });
  }

  onProfilePictureFileSelected(event) {
    this.profilePicture = <File>event.target.files[0];
  }

  onPresentationVideoFileSelected(event) {
    this.presentationVideo = <File>event.target.files[0];
  }

  /* 
    Upload files with uploadService
  */
  onUpload() {
    if(this.profilePicture != null) {
      this.uploadFilesService.uploadFile(this.profilePicture);
    }
    if(this.presentationVideo != null) {
      this.uploadFilesService.uploadFile(this.presentationVideo);
    }
  }

  /* 
    Register player with registerService
  */
  registerPlayer() {
    this.onUpload();
    this.registerService.registerPlayer(this.buildPlayer());
    this.sendConfirmationEmail(this.emailControl.value);
    console.log(this.player);
  }

  /*
    Send confirmation email to player's email
  */
 sendConfirmationEmail(playerEmail: string) {
    this.registerService.sendConfirmationEmail(playerEmail);
 }

  /* 
    Build player with form inputs
  */
  buildPlayer() {
    this.player.email = this.personalInfoFormGroup.value.email;
    this.player.password = this.personalInfoFormGroup.value.password;
    this.player.firstName = this.personalInfoFormGroup.value.firstName;
    this.player.lastName = this.personalInfoFormGroup.value.lastName;
    this.player.country = this.personalInfoFormGroup.value.country;
    this.player.city = this.personalInfoFormGroup.value.city;
    this.player.day = this.personalInfoFormGroup.value.day;
    this.player.month = this.personalInfoFormGroup.value.month;
    this.player.year = this.personalInfoFormGroup.value.year;
    this.player.height = this.additionalInfoFormGroup.value.height;
    this.player.weight = this.additionalInfoFormGroup.value.weight;
    this.player.bodyfat = this.additionalInfoFormGroup.value.bodyfat;
    this.player.primaryPosition = this.additionalInfoFormGroup.value.primaryPosition;
    this.player.secondaryPosition = this.additionalInfoFormGroup.value.secondaryPosition;
    this.player.preferredHand = this.additionalInfoFormGroup.value.preferredHand;
    this.player.strengths = this.strengthWeaknessFormGroup.value.strengths;
    this.player.weaknesses = this.strengthWeaknessFormGroup.value.weaknesses;
    this.player.currentClub = this.sportCvFormGroup.value.currentClub;
    this.player.currentPrimaryPosition = this.sportCvFormGroup.value.currentPrimaryPosition;
    this.player.currentSecondaryPosition = this.sportCvFormGroup.value.currentSecondaryPosition;
    this.player.accomplishments = this.sportCvFormGroup.value.accomplishments;
    this.player.statistics = this.sportCvFormGroup.value.statistics;
    this.player.formerClubs = this.sportCvFormGroup.value.formerClubs;
    this.player.aTeamAppearances = this.nationalTeamFormGroup.value.aTeamAppearances;
    this.player.aTeamPosition = this.nationalTeamFormGroup.value.aTeamPosition;
    this.player.aTeamStatistics = this.nationalTeamFormGroup.value.aTeamStatistics;
    this.player.bTeamAppearances = this.nationalTeamFormGroup.value.bTeamAppearances;
    this.player.bTeamPosition = this.nationalTeamFormGroup.value.bTeamPosition;
    this.player.bTeamStatistics = this.nationalTeamFormGroup.value.bTeamStatistics;
    this.player.u21TeamAppearances = this.nationalTeamFormGroup.value.u21TeamAppearances;
    this.player.u21TeamPosition = this.nationalTeamFormGroup.value.u21TeamPosition;
    this.player.u21TeamStatistics = this.nationalTeamFormGroup.value.u21TeamStatistics;
    this.player.u18TeamAppearances = this.nationalTeamFormGroup.value.u18TeamAppearances;
    this.player.u18TeamPosition = this.nationalTeamFormGroup.value.u18TeamPosition;
    this.player.u18TeamStatistics = this.nationalTeamFormGroup.value.u18TeamStatistics;
    this.player.profilePicture = this.playerPresentationFormGroup.value.profilePictureControl;
    this.player.videoPresentation = this.playerPresentationFormGroup.value.videoFileControl;

    return this.player;
  }
}