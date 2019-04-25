import {Component, OnInit, Input, Attribute} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, AbstractControl, Validator} from '@angular/forms';
import { registerService } from 'src/app/services/registerService';
import { uploadFilesService } from 'src/app/services/uploadFilesService';
import { ErrorStateMatcher } from '@angular/material';
import { Player } from '../../../models/player.model';
import { NationalTeam } from 'src/app/models/nationalTeam.model';

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
  nationalTeamA: NationalTeam = new NationalTeam();
  nationalTeamB: NationalTeam = new NationalTeam();
  nationalTeamU21: NationalTeam = new NationalTeam();
  nationalTeamU18: NationalTeam = new NationalTeam();

  personalInfoFormGroup: FormGroup; 
  additionalInfoFormGroup: FormGroup;
  strengthWeaknessFormGroup: FormGroup;
  sportCvFormGroup: FormGroup;
  nationalTeamFormGroup: FormGroup;
  playerPresentationFormGroup: FormGroup;
  hide = true; // password visibility
  profilePicture: File = null;
  presentationVideo: File = null;
  countryList: string[] = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
	,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands"
	,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
	,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
	,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
	,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
	,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
	,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
	,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
	,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
	,"Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
	,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
	,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia"
	,"Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay"
	,"Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

  // input validators
  validate = new MyErrorStateMatcher();
  numbersOnlyRegex = /^[0-9]*$/;
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  firstNameControl = new FormControl('', Validators.required);
  lastNameControl = new FormControl('', Validators.required);
  countryControl = new FormControl('', Validators.required);
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
      lastName: this.lastNameControl, country: this.countryControl,
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
    this.player.day = this.personalInfoFormGroup.value.day;
    this.player.month = this.personalInfoFormGroup.value.month;
    this.player.year = this.personalInfoFormGroup.value.year;
    this.player.height = this.additionalInfoFormGroup.value.height;
    this.player.weight = this.additionalInfoFormGroup.value.weight;
    this.player.bodyfat = this.additionalInfoFormGroup.value.bodyfat;
    this.player.primaryPosition = this.additionalInfoFormGroup.value.primaryPosition;
    this.player.secondaryPosition = this.additionalInfoFormGroup.value.secondaryPosition;
    this.player.preferredHand = this.additionalInfoFormGroup.value.preferredHand;
    this.player.strengthDescription = this.strengthWeaknessFormGroup.value.strengths;
    this.player.weaknessDescription = this.strengthWeaknessFormGroup.value.weaknesses;
    // checkbox weaknesses goes here...

    this.player.currentClub = this.sportCvFormGroup.value.currentClub;
    this.player.currentClubPrimaryPosition = this.sportCvFormGroup.value.currentPrimaryPosition;
    this.player.currentClubSecondaryPosition = this.sportCvFormGroup.value.currentSecondaryPosition;
    this.player.accomplishments = this.sportCvFormGroup.value.accomplishments;
    this.player.statistics = this.sportCvFormGroup.value.statistics;
    this.player.formerClubs = this.sportCvFormGroup.value.formerClubs;
    // national teams
    this.nationalTeamA.name = "A";
    this.nationalTeamA.appearances = this.nationalTeamFormGroup.value.aTeamAppearances;
    this.nationalTeamA.position = this.nationalTeamFormGroup.value.aTeamPosition;
    this.nationalTeamA.statistic = this.nationalTeamFormGroup.value.aTeamStatistics;
    this.nationalTeamB.name = "B";
    this.nationalTeamB.appearances = this.nationalTeamFormGroup.value.bTeamAppearances;
    this.nationalTeamB.position = this.nationalTeamFormGroup.value.bTeamPosition;
    this.nationalTeamB.statistic = this.nationalTeamFormGroup.value.bTeamStatistics;
    this.nationalTeamU21.name = "U21";
    this.nationalTeamU21.appearances = this.nationalTeamFormGroup.value.u21TeamAppearances;
    this.nationalTeamU21.position = this.nationalTeamFormGroup.value.u21TeamPosition;
    this.nationalTeamU21.statistic = this.nationalTeamFormGroup.value.u21TeamStatistics;
    this.nationalTeamU18.name = "U18";
    this.nationalTeamU18.appearances = this.nationalTeamFormGroup.value.u18TeamAppearances;
    this.nationalTeamU18.position = this.nationalTeamFormGroup.value.u18TeamPosition;
    this.nationalTeamU18.statistic = this.nationalTeamFormGroup.value.u18TeamStatistics;
    
    this.player.profilePicture = this.playerPresentationFormGroup.value.profilePictureControl;
    this.player.videoPresentation = this.playerPresentationFormGroup.value.videoFileControl;

    return this.player;
  }
}