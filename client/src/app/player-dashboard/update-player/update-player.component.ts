import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { loginService } from "src/app/services/loginService";
import { updateService } from "src/app/services/updateService";
import { deleteService } from "src/app/services/deleteService";
import { uploadFilesService} from "src/app/services/uploadFilesService";
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/front-page/front-page-image/register-player/register-player.component';

@Component({
  selector: 'app-update-player',
  templateUrl: './update-player.component.html',
  styleUrls: ['./update-player.component.css']
})
export class UpdatePlayerComponent implements OnInit {

  playerBinding: Player;
  step: number;

  // Validators
  validate = new MyErrorStateMatcher();
  numbersOnlyRegex = /^[0-9]*$/;
  currentPassword = new FormControl("", [
    Validators.required,
    Validators.minLength(6)
  ]);
  password = new FormControl("", [
    Validators.required,
    Validators.minLength(6)
  ]); 
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
  emailControl = new FormControl("", [Validators.required, Validators.email]);
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
  primaryPositionCtrl = new FormControl("");
  secondaryPositionCtrl = new FormControl("");

  constructor(
    private loginService: loginService,
    private updateService: updateService,
    private uploadFilesService: uploadFilesService,
    private deleteService: deleteService
    ) { }

  ngOnInit() {
    this.setStep(-1); // start with closed accordions
    this.playerBinding = this.loginService.playerInSession;
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
        if(type === 'profile') {
          this.uploadFilesService.createPath(JSON.stringify(res.body), 'image');
          this.playerBinding.imagePath = this.uploadFilesService.imagePath;
        }
        if(type === 'video') {
          this.uploadFilesService.createPath(JSON.stringify(res.body), 'video');
          this.playerBinding.videoPath = this.uploadFilesService.videoPath;
        }
      });
    }
  }

  // updatePlayer() {

  //   //Check if nationalteam(s) was deleted from playerBinding
  //   if(this.playerBinding.nationalTeamList.length > 0 ) {
  //     this.deleteService.deleteNationalTeam(this.playerBinding.nationalTeamList);
  //   }
  //   //Check if player weakness was deleted from playerBinding
  //   if(this.playerBinding.weaknessList.length > 0 ) {
  //     this.deleteService.deletePlayerWeakness(this.playerBinding.weaknessList);
  //   }

  //   //Check if player strength was deleted from playerBinding
  //   if(this.playerBinding.strengthList.length > 0 ) {
  //     this.deleteService.deletePlayerStrength(this.playerBinding.strengthList);
  //   }

  //   this.updateService.updatePlayer(this.playerBinding);
  // }

  deleteNationalTeam() {
    
    //Decrement nationalTeam from playerbinding
  }

  deletePlayerWeakness() {
    //Decrement player weakness from playerbinding
  }

  deletePlayerStrength() {
    //Decrement player strength from playerbinding
  }

  cancel() {
    this.playerBinding = this.loginService.playerInSession;
  }

  positionList: string[] = [
    "Goalkeeper",
    "Left wing",
    "Left back",
    "Playmaker",
    "Pivot",
    "Right back",
    "Right wing",
    "Defence"
  ];
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
}

