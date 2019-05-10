import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SearchCriteria } from '../models/searchCriteria.model';
import { MatCheckbox } from '@angular/material';
import { searchService } from '../services/searchService';
import { Player } from '../models/player.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-search-criteria',
  templateUrl: './player-search-criteria.component.html',
  styleUrls: ['./player-search-criteria.component.css'],
  providers: []
})
export class PlayerSearchCriteriaComponent implements OnInit {
  p: Player = new Player();
  searchForm: FormGroup;
  searchCriteria: SearchCriteria = new SearchCriteria();
  @ViewChild('speedy') speedy: MatCheckbox;
  @ViewChild('athletic') athletic: MatCheckbox;
  @ViewChild('greatShape') greatShape: MatCheckbox;
  @ViewChild('quickShots') quickShots: MatCheckbox;
  @ViewChild('accurateShooter') accurateShooter: MatCheckbox;
  @ViewChild('tactical') tactical: MatCheckbox;
  @ViewChild('teamPlayer') teamPlayer: MatCheckbox;
  @ViewChild('social') social: MatCheckbox;
  @ViewChild('winAtAllCosts') winAtAllCosts: MatCheckbox;
  @ViewChild('longRangeShooter') longRangeShooter: MatCheckbox;

  // predefined options
  contractStatusList: string[] = ['Active', 'Open for Offers', 'In Negotiation', 'Contract Expired'];
  weightList: number[] = [
    50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,
    87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,123,124,125,126,127,
    128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,
    156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,
    184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200
  ];
  heightList: number[] = [
    150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,
    178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,
    206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230];
  injuryStatusList: string[] = ['Both', 'Injured', 'Healthy']
  handPreferenceList: string[] = ['None', 'Left Hand', 'Right Hand', 'Both Hands'];
  positionList: string[] = ['None', 'Left Wing', 'Left Back', 'Playmaker', 'Pivot', 'Right Back', 'Right Wing', 'Defence'];
  leagueList: string[] = ['All Leagues', 'First League', 'Second League', 'Third League'];
  ageList: number[] = [15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,
    47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70];
  countryList: string[] = [
    'All Countries',
    "Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria",
    "Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan",
    "Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso",
    "Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo",
    "Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti",
    "Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands",
    "Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany",
    "Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti",
    "Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel",
    "Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho",
    "Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia",
    "Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat",
    "Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua",
    "Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines",
    "Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon",
    "Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia",
    "Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia",
    "Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga",
    "Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates",
    "United Kingdom","United States","United States Minor Outlying Islands","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"
  ];

  constructor(private _formbuilder: FormBuilder, private searchService: searchService,
    private router: Router) {}

  ngOnInit() {
    this.searchForm = this._formbuilder.group({
      country: [''], league: [''], contractStatus: [''], minimumAge: [''], maximumAge: [''],
      primaryPosition: [''], secondaryPosition: [''], injuryStatus: [''],
      handPreference: [''], minimumHeight: [''], maximumWeight: ['']
    });
  }

  /*
    Connect the input with search service
  */
  searchForPlayers() {
    this.validateSearchCriteria();

    // some call to the searchService
    this.searchService.searchForPlayers(this.searchCriteria).subscribe(
      (success: Player[]) => {
        // const data = JSON.stringify(success);
        // this.searchService.searchForPlayersResult = data;
        success.forEach(element => {
          this.p = element;
          this.searchService.searchForPlayersResult.push(this.p);
        });
        console.log(this.searchService.searchForPlayersResult);
        this.router.navigate(['/search-for-players'])
      },
      (error) => {
        console.log(error);
      }
    );
    console.log(this.searchCriteria);
  }

  /*
    Helping method to make sure only filled out 
    inputs are being used
  */
  validateSearchCriteria() {
    if(this.searchForm.value.country != '') {
      if(this.searchForm.value.country != 'All Countries') {
        this.searchCriteria.country = this.searchForm.value.country;
      } else {
        this.searchCriteria.country = null;
      }  
    } 
    
    if(this.searchForm.value.league != '') {
      if(this.searchForm.value.league != 'All Leagues') {
        this.searchCriteria.league = this.searchForm.value.league;
      } else {
        this.searchCriteria.league = null;
      }
    }

    if(this.searchForm.value.contractStatus != '') {
      this.searchCriteria.contractStatus = this.searchForm.value.contractStatus;
    } else {
      this.searchCriteria.contractStatus = null;
    }

    if(this.searchForm.value.minimumAge != '') {
      if(this.searchForm.value.minimumAge != 'None') {
        this.searchCriteria.minimumAge = this.searchForm.value.minimumAge;
      } else {
        this.searchCriteria.minimumAge = null;
      }
    }

    if(this.searchForm.value.maximumAge != '') {
      if(this.searchForm.value.maximumAge != 'None') {
        this.searchCriteria.maximumAge = this.searchForm.value.maximumAge;
      } else {
        this.searchCriteria.maximumAge = null;
      }
    }

    if(this.searchForm.value.primaryPosition != '') {
      if(this.searchForm.value.primaryPosition != 'None') {
        this.searchCriteria.primaryPosition = this.searchForm.value.primaryPosition;
      } else {
        this.searchCriteria.primaryPosition = null;
      }
    }

    if(this.searchForm.value.secondaryPosition != '') {
      if(this.searchForm.value.secondaryPosition != 'None') {
        this.searchCriteria.secondaryPosition = this.searchForm.value.secondaryPosition;
      } else {
        this.searchCriteria.secondaryPosition = null;
      }
    }

    if(this.speedy.checked) {this.searchCriteria.strengthsList.push(this.speedy.value)}
    if(this.athletic.checked) {this.searchCriteria.strengthsList.push(this.athletic.value)}
    if(this.greatShape.checked) {this.searchCriteria.strengthsList.push(this.greatShape.value)}
    if(this.quickShots.checked) {this.searchCriteria.strengthsList.push(this.quickShots.value)}
    if(this.accurateShooter.checked) {this.searchCriteria.strengthsList.push(this.accurateShooter.value)}
    if(this.tactical.checked) {this.searchCriteria.strengthsList.push(this.tactical.value)}
    if(this.teamPlayer.checked) {this.searchCriteria.strengthsList.push(this.teamPlayer.value)}
    if(this.social.checked) {this.searchCriteria.strengthsList.push(this.social.value)}
    if(this.winAtAllCosts.checked) {this.searchCriteria.strengthsList.push(this.winAtAllCosts.value)}
    if(this.longRangeShooter.checked) {this.searchCriteria.strengthsList.push(this.longRangeShooter.value)}

    if(this.searchForm.value.injuryStatus != '') {
      if(this.searchForm.value.injuryStatus != 'Both') {
        this.searchCriteria.injuryStatus = this.searchForm.value.injuryStatus;
      } else {
        this.searchCriteria.injuryStatus = null;
      }
    }

    if(this.searchForm.value.handPreference != '') {
      if(this.searchForm.value.handPreference != 'None') {
        this.searchCriteria.handPreference = this.searchForm.value.handPreference;
      } else {
        this.searchCriteria.handPreference = null;
      }
    }

    if(this.searchForm.value.minimumHeight != '') {
      if(this.searchForm.value.minimumHeight != 'None') {
        this.searchCriteria.minimumHeight = this.searchForm.value.minimumHeight;
      } else {
        this.searchCriteria.minimumHeight = null;
      }
    }

    if(this.searchForm.value.maximumWeight != '') {
      if(this.searchForm.value.maximumWeight != 'None') {
        this.searchCriteria.maximumWeight = this.searchForm.value.maximumWeight;
      } else {
        this.searchCriteria.maximumWeight = null;
      }
    }
  }
  
}
