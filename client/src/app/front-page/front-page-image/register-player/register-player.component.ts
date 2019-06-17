import { Component, OnInit, Input, Attribute, ViewChild, TemplateRef } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
  
  AbstractControl,
  Validator
} from "@angular/forms";
import { registerService } from "src/app/services/registerService";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ErrorStateMatcher, MatCheckbox, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from "@angular/material";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Player } from "../../../models/player.model";
import { NationalTeam } from "src/app/models/nationalTeam.model";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

/* Date format for the datepicker */
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: "app-register-player",
  templateUrl: "./register-player.component.html",
  styleUrls: ["./register-player.component.css"],
  providers: [
    registerService, 
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]}]
})
export class RegisterPlayerComponent implements OnInit {
  @Input() modalRef: any;
  privacyPolicyModal: BsModalRef | null;
  player: Player = new Player();
  nationalTeamA: NationalTeam = new NationalTeam();
  nationalTeamB: NationalTeam = new NationalTeam();
  nationalTeamU21: NationalTeam = new NationalTeam();
  nationalTeamU18: NationalTeam = new NationalTeam();
  errorRegister: boolean = false;
  isLoading: boolean = false;
  existingEmail: boolean = false;

  //privacy policy
  @ViewChild("privacyPolicy") privacyPolicy: MatCheckbox;
  privacyPolicyUnchecked: boolean = false;

  // strengths
  @ViewChild("speedy") private speedy: MatCheckbox;
  @ViewChild("athletic") private athletic: MatCheckbox;
  @ViewChild("greatShape") private greatShape: MatCheckbox;
  @ViewChild("quickShots") private quickShots: MatCheckbox;
  @ViewChild("accurateShooter") private accurateShooter: MatCheckbox;
  @ViewChild("tactical") private tactical: MatCheckbox;
  @ViewChild("teamPlayer") private teamPlayer: MatCheckbox;
  @ViewChild("social") private social: MatCheckbox;
  @ViewChild("winAtAllCosts") private winAtAllCosts: MatCheckbox;
  @ViewChild("longRangeShooter") private longRangeShooter: MatCheckbox;

  // weaknesses
  @ViewChild("slowMoving") private slowMoving: MatCheckbox;
  @ViewChild("badEndurance") private badEndurance: MatCheckbox;
  @ViewChild("historyOfInjuries") private historyOfInjuries: MatCheckbox;
  @ViewChild("badDefencePlayer") private badDefencePlayer: MatCheckbox;

  personalInfoFormGroup: FormGroup;
  additionalInfoFormGroup: FormGroup;
  strengthWeaknessFormGroup: FormGroup;
  sportCvFormGroup: FormGroup;
  nationalTeamFormGroup: FormGroup;
  playerRegister: FormGroup;
  hide = true; // password visibility
  countryList: string[] = [
    "Denmark",
    "Norway",
    "Sweden",
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antigua &amp; Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia &amp; Herzegovina",
    "Botswana",
    "Brazil",
    "British Virgin Islands",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Cayman Islands",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Congo",
    "Cook Islands",
    "Costa Rica",
    "Cote D Ivoire",
    "Croatia",
    "Cruise Ship",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Polynesia",
    "French West Indies",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kuwait",
    "Kyrgyz Republic",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macau",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Nepal",
    "Netherlands",
    "Netherlands Antilles",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Norway",
    "Oman",
    "Pakistan",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Reunion",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Pierre &amp; Miquelon",
    "Samoa",
    "San Marino",
    "Satellite",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "St Kitts &amp; Nevis",
    "St Lucia",
    "St Vincent",
    "St. Lucia",
    "Sudan",
    "Suriname",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor L'Este",
    "Togo",
    "Tonga",
    "Trinidad &amp; Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks &amp; Caicos",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "United States Minor Outlying Islands",
    "Uruguay",
    "Uzbekistan",
    "Venezuela",
    "Vietnam",
    "Virgin Islands (US)",
    "Yemen",
    "Zambia",
    "Zimbabwe"
  ];

  // input validators
  errorMessage = "";
  validate = new MyErrorStateMatcher();
  numbersOnlyRegex = /^[0-9]*$/;
  aTeamNumberControl = new FormControl(
    "",
    Validators.pattern(this.numbersOnlyRegex)
  );
  bTeamNumberControl = new FormControl(
    "",
    Validators.pattern(this.numbersOnlyRegex)
  );
  u21NumberControl = new FormControl(
    "",
    Validators.pattern(this.numbersOnlyRegex)
  );
  u18NumberControl = new FormControl(
    "",
    Validators.pattern(this.numbersOnlyRegex)
  );
  emailControl = new FormControl("", [Validators.required, Validators.pattern(/.+@.+\..+/)]);
  passwordControl = new FormControl("", [
    Validators.required,
    Validators.minLength(6)
  ]);
  firstNameControl = new FormControl("", Validators.required);
  lastNameControl = new FormControl("", Validators.required);
  countryControl = new FormControl("", Validators.required);
  dayControl = new FormControl("", [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(2),
    Validators.pattern(this.numbersOnlyRegex)
  ]);
  monthControl = new FormControl("", Validators.required);
  yearControl = new FormControl("", [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(4),
    Validators.pattern(this.numbersOnlyRegex)
  ]);
  heightControl = new FormControl(
    "",
    Validators.pattern(this.numbersOnlyRegex)
  );
  weightControl = new FormControl(
    "",
    Validators.pattern(this.numbersOnlyRegex)
  );
  bodyfatControl = new FormControl(
    "",
    Validators.pattern(this.numbersOnlyRegex)
  );

  constructor(
    private _formBuilder: FormBuilder,
    private registerService: registerService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.personalInfoFormGroup = this._formBuilder.group({
      email: this.emailControl,
      password: this.passwordControl,
      firstName: this.firstNameControl,
      lastName: this.lastNameControl,
      country: this.countryControl,
      day: this.dayControl,
      month: this.monthControl,
      year: this.yearControl
    });
    this.additionalInfoFormGroup = this._formBuilder.group({
      height: this.heightControl,
      weight: this.weightControl,
      bodyfat: this.bodyfatControl,
      primaryPosition: [""],
      secondaryPosition: [""],
      preferredHand: [""],
      leagueControl: [''],
      contractStatusControl: [''],
      contractExpired: [''],
      injuryStatus: [''],
      injuryRecoveryDate: [''],
      injuryDescription: ['']
    });
    this.strengthWeaknessFormGroup = this._formBuilder.group({
      strengths: [""],
      weaknesses: [""],
      strengthOne: [""]
    });
    this.sportCvFormGroup = this._formBuilder.group({
      currentClub: [""],
      currentPrimaryPosition: [""],
      currentSecondaryPosition: [""],
      accomplishments: [""],
      statistics: [""],
      formerClubs: [""]
    });
    this.nationalTeamFormGroup = this._formBuilder.group({
      aTeamAppearances: this.aTeamNumberControl,
      aTeamPosition: [""],
      aTeamStatistics: [""],
      bTeamAppearances: this.bTeamNumberControl,
      bTeamPosition: [""],
      bTeamStatistics: [""],
      u21TeamAppearances: this.u21NumberControl,
      u21TeamPosition: [""],
      u21TeamStatistics: [""],
      u18TeamAppearances: this.u18NumberControl,
      u18TeamPosition: [""],
      u18TeamStatistics: [""]
    });
    this.playerRegister = this._formBuilder.group({});
  }

  validateNationalTeamAppearances() {
    if (
      this.nationalTeamFormGroup.value.aTeamAppearances !== "" &&
      this.nationalTeamFormGroup.value.bTeamAppearances !== "" &&
      this.nationalTeamFormGroup.value.u21TeamAppearances !== "" &&
      this.nationalTeamFormGroup.value.u18TeamAppearances !== ""
    ) {
      return true;
    } else {
      return false;
    }
  }

  @ViewChild('stepper') stepper;
  checkIfEmailExists() {
    this.existingEmail = false;
    this.registerService.checkIfEmailExists(this.personalInfoFormGroup.get('email').value ).subscribe(
      (success) => {
        if(success) {
          this.existingEmail = true;
        }
        else {
          this.stepper.next();
        }
      },
      (error) => {
        
      }
    );
  }

  openPolicyModalRef(template: TemplateRef<any>) {
    this.privacyPolicyModal = this.modalService.show(template, {class: 'customModalForPrivacyPolicy'});
  }

  /* 
    Register player with registerService
  */
  registerPlayer() {
    this.privacyPolicyUnchecked = false;
    if(this.privacyPolicy.checked) {
      this.isLoading = true;
      this.registerService.registerPlayer(this.buildPlayer()).subscribe(
        (success) => {
          this.modalRef.hide();
          this.modalRef = null;
          this.isLoading = false;
          this.errorRegister = false;
        },
        (error) => {
          this.isLoading = false;
          this.errorRegister = true;
        }
      );
    }
    else {
      this.privacyPolicyUnchecked = true;
    }
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
    this.player.isAvailable = true;

    if (this.additionalInfoFormGroup.value.height !== "") {
      this.player.height = this.additionalInfoFormGroup.value.height;
    } else {
      this.player.height = null;
    }
    if (this.additionalInfoFormGroup.value.weight !== "") {
      this.player.weight = this.additionalInfoFormGroup.value.weight;
    } else {
      this.player.weight = null;
    }
    if (this.additionalInfoFormGroup.value.bodyfat !== "") {
      this.player.bodyfat = this.additionalInfoFormGroup.value.bodyfat;
    } else {
      this.player.bodyfat = null;
    }
    if (this.additionalInfoFormGroup.value.primaryPosition !== "") {
      this.player.primaryPosition = this.additionalInfoFormGroup.value.primaryPosition;
    } else {
      this.player.primaryPosition = null;
    }
    if (this.additionalInfoFormGroup.value.secondaryPosition !== "") {
      this.player.secondaryPosition = this.additionalInfoFormGroup.value.secondaryPosition;
    } else {
      this.player.secondaryPosition = null;
    }
    if (this.additionalInfoFormGroup.value.preferredHand !== "") {
      this.player.preferredHand = this.additionalInfoFormGroup.value.preferredHand;
    } else {
      this.player.preferredHand = null;
    }
    if(this.additionalInfoFormGroup.value.leagueControl !== "") {
      this.player.league = this.additionalInfoFormGroup.value.leagueControl;
    } else {
      this.player.league = null;
    }
    if(this.additionalInfoFormGroup.value.contractStatusControl !== '') {
      this.player.contractStatus = this.additionalInfoFormGroup.value.contractStatusControl;
    } else {
      this.player.contractStatus = null;
    }
    if(this.additionalInfoFormGroup.value.contractExpired !== '') {
      this.player.contractExpiredDate = new Date(this.additionalInfoFormGroup.value.contractExpired._d);
      this.player.contractExpired = 
        this.player.contractExpiredDate.getDate() + 
        "/" +
        (this.player.contractExpiredDate.getMonth() + 1) +
        "/" +
        this.player.contractExpiredDate.getFullYear();
    } else {
      this.player.contractExpired = null;
    }
    if(this.additionalInfoFormGroup.value.injuryStatus !== '') {
      this.player.injuryStatus = this.additionalInfoFormGroup.value.injuryStatus;
    } else {
      this.player.injuryStatus = null;
    }
    if(this.additionalInfoFormGroup.value.injuryRecoveryDate !== '') {
      this.player.injuryExpiredDate = new Date(this.additionalInfoFormGroup.value.injuryRecoveryDate._d);
      this.player.injuryExpired = 
        this.player.injuryExpiredDate.getDate() +
        "/" +
        (this.player.injuryExpiredDate.getMonth() + 1) +
        "/" +
        this.player.injuryExpiredDate.getFullYear();
    } else {
      this.player.injuryExpired = null;
    }
    if(this.additionalInfoFormGroup.value.injuryDescription !== '') {
      this.player.injuryDescription = this.additionalInfoFormGroup.value.injuryDescription;
    } else {
      this.player.injuryDescription = null;
    }

    // strengths
    if (this.strengthWeaknessFormGroup.value.strengths !== "") {
      this.player.strengthDescription = this.strengthWeaknessFormGroup.value.strengths;
    } else {
      this.player.strengthDescription = null;
    }
    if (this.speedy.checked) {
      this.player.strengthList.push(this.speedy.value);
    }
    if (this.athletic.checked) {
      this.player.strengthList.push(this.athletic.value);
    }
    if (this.greatShape.checked) {
      this.player.strengthList.push(this.greatShape.value);
    }
    if (this.quickShots.checked) {
      this.player.strengthList.push(this.quickShots.value);
    }
    if (this.accurateShooter.checked) {
      this.player.strengthList.push(this.accurateShooter.value);
    }
    if (this.tactical.checked) {
      this.player.strengthList.push(this.tactical.value);
    }
    if (this.teamPlayer.checked) {
      this.player.strengthList.push(this.teamPlayer.value);
    }
    if (this.social.checked) {
      this.player.strengthList.push(this.social.value);
    }
    if (this.winAtAllCosts.checked) {
      this.player.strengthList.push(this.winAtAllCosts.value);
    }
    if (this.longRangeShooter.checked) {
      this.player.strengthList.push(this.longRangeShooter.value);
    }

    // weaknesses
    if (this.strengthWeaknessFormGroup.value.weaknesses !== "") {
      this.player.weaknessDescription = this.strengthWeaknessFormGroup.value.weaknesses;
    } else {
      this.player.weaknessDescription = null;
    }
    if (this.slowMoving.checked) {
      this.player.weaknessList.push(this.slowMoving.value);
    }
    if (this.badEndurance.checked) {
      this.player.weaknessList.push(this.badEndurance.value);
    }
    if (this.badDefencePlayer.checked) {
      this.player.weaknessList.push(this.badDefencePlayer.value);
    }
    if (this.historyOfInjuries.checked) {
      this.player.weaknessList.push(this.historyOfInjuries.value);
    }

    // sport cv
    if (this.sportCvFormGroup.value.currentClub !== "") {
      this.player.currentClub = this.sportCvFormGroup.value.currentClub;
    } else {
      this.player.currentClub = null;
    }
    if (this.sportCvFormGroup.value.currentPrimaryPosition !== "") {
      this.player.currentClubPrimaryPosition = this.sportCvFormGroup.value.currentPrimaryPosition;
    } else {
      this.player.currentClubPrimaryPosition = null;
    }
    if (this.sportCvFormGroup.value.currentSecondaryPosition !== "") {
      this.player.currentClubSecondaryPosition = this.sportCvFormGroup.value.currentSecondaryPosition;
    } else {
      this.player.currentClubSecondaryPosition = null;
    }
    if (this.sportCvFormGroup.value.accomplishments !== "") {
      this.player.accomplishments = this.sportCvFormGroup.value.accomplishments;
    } else {
      this.player.accomplishments = null;
    }
    if (this.sportCvFormGroup.value.statistics !== "") {
      this.player.statistic = this.sportCvFormGroup.value.statistics;
    } else {
      this.player.statistic = null;
    }
    if (this.sportCvFormGroup.value.formerClubs !== "") {
      this.player.formerClubs = this.sportCvFormGroup.value.formerClubs;
    } else {
      this.player.formerClubs = null;
    }

    // national teams
    if (
      this.nationalTeamFormGroup.value.aTeamAppearances !== "" &&
      this.nationalTeamFormGroup.value.aTeamPosition !== ""
    ) {
      this.nationalTeamA.name = "A";
      this.nationalTeamA.appearances = this.nationalTeamFormGroup.value.aTeamAppearances;
      this.nationalTeamA.position = this.nationalTeamFormGroup.value.aTeamPosition;
      this.nationalTeamA.statistic = this.nationalTeamFormGroup.value.aTeamStatistics;
      this.player.nationalTeamList.push(this.nationalTeamA);
    }
    if (
      this.nationalTeamFormGroup.value.bTeamAppearances !== "" &&
      this.nationalTeamFormGroup.value.bTeamPosition !== ""
    ) {
      this.nationalTeamB.name = "B";
      this.nationalTeamB.appearances = this.nationalTeamFormGroup.value.bTeamAppearances;
      this.nationalTeamB.position = this.nationalTeamFormGroup.value.bTeamPosition;
      this.nationalTeamB.statistic = this.nationalTeamFormGroup.value.bTeamStatistics;
      this.player.nationalTeamList.push(this.nationalTeamB);
    }
    if (
      this.nationalTeamFormGroup.value.u21TeamAppearances !== "" &&
      this.nationalTeamFormGroup.value.u21TeamPosition !== "" 
    ) {
      this.nationalTeamU21.name = "U21";
      this.nationalTeamU21.appearances = this.nationalTeamFormGroup.value.u21TeamAppearances;
      this.nationalTeamU21.position = this.nationalTeamFormGroup.value.u21TeamPosition;
      this.nationalTeamU21.statistic = this.nationalTeamFormGroup.value.u21TeamStatistics;
      this.player.nationalTeamList.push(this.nationalTeamU21);
    }
    if (
      this.nationalTeamFormGroup.value.u18TeamAppearances !== "" &&
      this.nationalTeamFormGroup.value.u18TeamPosition !== "" 
    ) {
      this.nationalTeamU18.name = "U18";
      this.nationalTeamU18.appearances = this.nationalTeamFormGroup.value.u18TeamAppearances;
      this.nationalTeamU18.position = this.nationalTeamFormGroup.value.u18TeamPosition;
      this.nationalTeamU18.statistic = this.nationalTeamFormGroup.value.u18TeamStatistics;
      this.player.nationalTeamList.push(this.nationalTeamU18);
    }

    return this.player;
  }
}
