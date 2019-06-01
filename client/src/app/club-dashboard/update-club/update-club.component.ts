import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Club } from 'src/app/models/club.model';
import { loginService } from "src/app/services/loginService";
import { updateService } from "src/app/services/updateService";
import { deleteService } from "src/app/services/deleteService";
import { uploadFilesService} from "src/app/services/uploadFilesService";
import { SquadPlayer } from 'src/app/models/squadPlayer.model';
import { TrainingHours } from 'src/app/models/trainingHours.model';
import { JobPosition } from 'src/app/models/jobPosition';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/front-page/front-page-image/register-player/register-player.component';
import { MatCheckbox } from '@angular/material';

@Component({
  selector: 'app-update-club',
  templateUrl: './update-club.component.html',
  styleUrls: ['./update-club.component.css']
})
export class UpdateClubComponent implements OnInit {

  clubBinding: Club;
  clubLeague: string;
  clubCountry: string;
  facilityImages: string[] = [];
  regularHours = new TrainingHours();
  fitnessHours = new TrainingHours();

  fitnessMonTo = new FormControl("");
  fitnessMonFrom = new FormControl("");
  fitnessTueTo = new FormControl("");
  fitnessTueFrom = new FormControl("");
  fitnessWedTo = new FormControl("");
  fitnessWedFrom = new FormControl("");
  fitnessThuTo = new FormControl("");
  fitnessThuFrom = new FormControl("");
  fitnessFriTo = new FormControl("");
  fitnessFriFrom = new FormControl("");
  fitnessSatTo = new FormControl("");
  fitnessSatFrom = new FormControl("");
  fitnessSunTo = new FormControl("");
  fitnessSunFrom = new FormControl("");
  regularMonFrom = new FormControl("");
  regularMonTo = new FormControl("");
  regularTueFrom = new FormControl("");
  regularTueTo = new FormControl("");
  regularWedTo = new FormControl("");
  regularWedFrom = new FormControl("");
  regularThuFrom = new FormControl("");
  regularThuTo = new FormControl("");
  regularFriFrom = new FormControl("");
  regularFriTo = new FormControl("");
  regularSatFrom = new FormControl("");
  regularSatTo = new FormControl("");
  regularSunFrom = new FormControl("");
  regularSunTo = new FormControl("");
  
  step: number = 0;
  positionList: string[] = ['Goalkeeper', 'Left wing', 'Left back', 'Playmaker', 'Pivot', 'Right back', 'Right wing', 'Defence'];
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

  squadPlayerNameCtrl = new FormControl("");
  squadPlayerPositionCtrl = new FormControl("");
  squadPlayerShirtNumberCtrl = new FormControl("");
  squadPlayerNameCtrlNext = new FormControl("");
  squadPlayerPositionCtrlNext = new FormControl("");
  squadPlayerShirtNumberCtrlNext = new FormControl("");

  valueDescription = new FormControl("");
  preferenceDescription = new FormControl("");

  openPositionName = new FormControl("");
  openPositionLeague = new FormControl("");
  openPositionSeason = new FormControl("");
  openPositionContract = new FormControl("");
  openPositionMinAge = new FormControl("");
  openPositionMaxAge = new FormControl("");
  openPositionHeight = new FormControl("");
  openPositionHand = new FormControl("");

  deletedCurrentYearSquadPlayerList: SquadPlayer[] = [];
  deletedNextYearSquadPlayersList: SquadPlayer[] = [];
  deletedTrainingHoursList: TrainingHours[] = [];
  deletedClubValueList: string[] = [];
  deletedClubPreferenceList: string[] = [];
  deletedJobPositionList: JobPosition[] = [];
  deletedJobPositionStrengthList: string[] = [];

  // squad table
  displayedColumns: string[] = ["shirtNumber", "name", "position", "delete"];
  elementData: SquadPlayer[] = [];
  dataSource = this.elementData;
  @Input() squadPlayerName: string;
  @Input() squadPlayerPosition: string;
  @Input() squadPlayerShirtNumber: number;
  @Input() SquadPlayerDelete: any;
  squadPlayer = new SquadPlayer();

  // next year squad table
  nextYearSquadColumns: string[] = ["shirtNumber", "name", "position", "delete"];
  nextYearSquadData: SquadPlayer[] = [];
  nextYearSquadSource = this.nextYearSquadData;
  @Input() nextYearPlayerName: string;
  @Input() nextYearPlayerPosition: string;
  @Input() nextYearPlayerShirtNumber: number;
  nextYearSquadPlayer = new SquadPlayer();

  // open positions table
  openPositionColumns: string[]= ['position', 'league', 'hand', 'height', 'age', 'season', 'contract', 'strengths'];
  openPositionData: JobPosition[] = [];
  openPositionSource = this.openPositionData;
  openPosition = new JobPosition();
  // open position strengths
  @ViewChild("openPositionSpeedy") openPositionSpeedy: MatCheckbox;
  @ViewChild("openPositionAthletic") openPositionAthletic: MatCheckbox;
  @ViewChild("openPositionGreatShape") openPositionGreatShape: MatCheckbox;
  @ViewChild("openPositionQuickShots") openPositionQuickShots: MatCheckbox;
  @ViewChild("openPositionAccurateShooter") openPositionAccurateShooter: MatCheckbox;
  @ViewChild("openPositionTactical") openPositionTactical: MatCheckbox;
  @ViewChild("openPositionTeamplayer") openPositionTeamplayer: MatCheckbox;
  @ViewChild("openPositionSocial") openPositionSocial: MatCheckbox;
  @ViewChild("openPositionWinAtAllCosts") openPositionWinAtAllCosts: MatCheckbox;
  @ViewChild("openPositionLongRangeShooter") openPositionLongRangeShooter: MatCheckbox;

  // values&preferences
  @ViewChild("hardWorking") hardWorking: MatCheckbox;
  @ViewChild("socialCohesion") socialCohesion: MatCheckbox;
  @ViewChild("winningMentality") winningMentality: MatCheckbox;
  @ViewChild("talentDevelopmentClub") talentDevelopmentClub: MatCheckbox;
  @ViewChild("strivesForTitles") strivesForTitles: MatCheckbox;
  @ViewChild("resultOriented") resultOriented: MatCheckbox;
  @ViewChild("processOriented") processOriented: MatCheckbox;

  constructor(
    private loginService: loginService,
    private updateService: updateService,
    private uploadFilesService: uploadFilesService,
    private deleteService: deleteService
    ) { }

  ngOnInit() {
    this.clubBinding = this.loginService.clubInSession;
    this.clubLeague = this.clubBinding.league;
    this.clubCountry = this.clubBinding.country;
    this.clubBinding.trainingHoursList.forEach(element => {
      if(element.name == 'Handball') {
        this.buildRegularHours(element);
      } else if(element.name == 'Fitness training') {
        this.buildFitnessHours(element);
      }
    });
    if(this.clubBinding.currentSquadPlayersList.length > 0) {
      this.clubBinding.currentSquadPlayersList.forEach(element => {
        this.dataSource.push(element); //add the new model object to the dataSource
        this.dataSource = [...this.dataSource]; //refresh the dataSource
      });
    }
    if(this.clubBinding.nextYearSquadPlayersList.length > 0) {
      this.clubBinding.nextYearSquadPlayersList.forEach(element => {
        this.nextYearSquadSource.push(element); //add the new model object to the dataSource
        this.nextYearSquadSource = [...this.nextYearSquadSource]; //refresh the dataSource
      });
    }
    if(this.clubBinding.jobPositionsList.length > 0) {
      this.clubBinding.jobPositionsList.forEach(element => {
        this.openPositionSource.push(element);
        this.openPositionSource = [...this.openPositionSource];
      });
    }
    if(this.clubBinding.preferenceList.length > 0) {
      this.markPreferenceCheckboxes(this.clubBinding.preferenceList);
    }
    if(this.clubBinding.valuesList.length > 0) {
      this.markValueCheckboxes(this.clubBinding.valuesList);
    }
  }

  // Add player to the squad player table for current season
  onAddPlayerToSquad() {
    if (
      this.squadPlayerNameCtrl.value !== "" &&
      this.squadPlayerPositionCtrl.value !== "" &&
      this.squadPlayerShirtNumberCtrl.value !== "" &&
      Number(this.squadPlayerShirtNumberCtrl.value)
    ) {
      this.squadPlayer = new SquadPlayer();
      this.squadPlayer.season = "Current year";
      this.squadPlayer.name = this.squadPlayerNameCtrl.value;
      this.squadPlayer.position = this.squadPlayerPositionCtrl.value;
      this.squadPlayer.shirtNumber = this.squadPlayerShirtNumberCtrl.value;

      this.dataSource.push(this.squadPlayer); //add the new model object to the dataSource
      this.dataSource = [...this.dataSource]; //refresh the dataSource

      // reset input fields
      this.squadPlayerNameCtrl.setValue("");
      this.squadPlayerPositionCtrl.setValue("");
      this.squadPlayerShirtNumberCtrl.setValue("");
    }
  }

  // Add player to the squad player table for next season
  onAddPlayerToNextYearSquad() {
    if (
      this.squadPlayerNameCtrlNext.value !== "" &&
      this.squadPlayerPositionCtrlNext.value !== "" &&
      this.squadPlayerShirtNumberCtrlNext.value !== "" &&
      Number(this.squadPlayerShirtNumberCtrlNext.value)
    ) {
      this.nextYearSquadPlayer = new SquadPlayer();
      this.nextYearSquadPlayer.season = "Next year";
      this.nextYearSquadPlayer.name = this.squadPlayerNameCtrlNext.value;
      this.nextYearSquadPlayer.position = this.squadPlayerPositionCtrlNext.value;
      this.nextYearSquadPlayer.shirtNumber = this.squadPlayerShirtNumberCtrlNext.value;

      this.nextYearSquadSource.push(this.nextYearSquadPlayer); //add the new model object to the dataSource
      this.nextYearSquadSource = [...this.nextYearSquadSource]; //refresh the dataSource

      // reset input fields
      this.squadPlayerNameCtrlNext.setValue("");
      this.squadPlayerPositionCtrlNext.setValue("");
      this.squadPlayerShirtNumberCtrlNext.setValue("");
    }
  }

  onAddJobPosition() {
    if (this.openPositionName.value !== "") {
      this.openPosition = new JobPosition();
      if(this.openPositionLeague.value !== "") {
        this.openPosition.league = this.openPositionLeague.value;
      } else {
        this.openPosition.league = null;
      }
      if(this.openPositionHand.value !== "") {
        this.openPosition.preferredHand = this.openPositionHand.value;
      } else {
        this.openPosition.preferredHand = null;
      }
      this.openPosition.height = this.openPositionHeight.value;
      this.openPosition.maxAge = this.openPositionMaxAge.value;
      this.openPosition.minAge = this.openPositionMinAge.value;
      if(this.openPositionSeason.value !== "") {
        this.openPosition.season = this.openPositionSeason.value;
      } else {
        this.openPosition.season = null;
      }
      if(this.openPositionContract.value !== "") {
        this.openPosition.contractStatus = this.openPositionContract.value;
      } else {
        this.openPosition.contractStatus = null;
      }
      if(this.openPositionName.value !== "") {
        this.openPosition.position = this.openPositionName.value;
      } else {
        this.openPosition.position = null;
      }

      if (this.openPositionSpeedy.checked) {
        this.openPosition.strengthsList.push(this.openPositionSpeedy.value);
        this.openPositionSpeedy.toggle();
      }
      if (this.openPositionAthletic.checked) {
        this.openPosition.strengthsList.push(this.openPositionAthletic.value);
        this.openPositionAthletic.toggle();
      }
      if (this.openPositionGreatShape.checked) {
        this.openPosition.strengthsList.push(this.openPositionGreatShape.value);
        this.openPositionGreatShape.toggle();
      }
      if (this.openPositionQuickShots.checked) {
        this.openPosition.strengthsList.push(this.openPositionQuickShots.value);
        this.openPositionQuickShots.toggle();
      }
      if (this.openPositionAccurateShooter.checked) {
        this.openPosition.strengthsList.push(this.openPositionAccurateShooter.value);
        this.openPositionAccurateShooter.toggle();
      }
      if (this.openPositionTactical.checked) {
        this.openPosition.strengthsList.push(this.openPositionTactical.value);
        this.openPositionTactical.toggle();
      }
      if (this.openPositionTeamplayer.checked) {
        this.openPosition.strengthsList.push(this.openPositionTeamplayer.value);
        this.openPositionTeamplayer.toggle();
      }
      if (this.openPositionSocial.checked) {
        this.openPosition.strengthsList.push(this.openPositionSocial.value);
        this.openPositionSocial.toggle();
      }
      if (this.openPositionWinAtAllCosts.checked) {
        this.openPosition.strengthsList.push(this.openPositionWinAtAllCosts.value);
        this.openPositionWinAtAllCosts.toggle();
      }
      if (this.openPositionLongRangeShooter.checked) {
        this.openPosition.strengthsList.push(this.openPositionLongRangeShooter.value);
        this.openPositionLongRangeShooter.toggle();
      }

      this.openPositionSource.push(this.openPosition); // add the new model object to the dataSource
      this.openPositionSource = [...this.openPositionSource]; // refresh the dataSource

      // reset input fields
      this.openPositionLeague.setValue("");
      this.openPositionHand.setValue("");
      this.openPositionHeight.setValue("");
      this.openPositionMaxAge.setValue("");
      this.openPositionMinAge.setValue("");
      this.openPositionSeason.setValue("");
      this.openPositionContract.setValue("");
      this.openPositionName.setValue("");
    }
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

    // Check if lists with deleted content are empty
    if(this.deletedTrainingHoursList.length > 0) {
      this.deleteService.deleteTrainingHours(this.deletedTrainingHoursList);
    }
    if(this.deletedCurrentYearSquadPlayerList.length > 0) {
      this.deleteService.deleteSquadPlayer(this.deletedCurrentYearSquadPlayerList);
    }
    if(this.deletedNextYearSquadPlayersList.length > 0) {
      this.deleteService.deleteSquadPlayer(this.deletedNextYearSquadPlayersList);
    }
    if(this.deletedClubValueList.length > 0) {
      this.deleteService.deleteClubValue(this.deletedClubValueList);
    }
    if(this.deletedClubPreferenceList.length > 0) {
      this.deleteService.deleteClubPreference(this.deletedClubPreferenceList);
    }
    if(this.deletedJobPositionList.length > 0) {
      this.deleteService.deleteJobPosition(this.deletedJobPositionList);
    }
    if(this.deletedJobPositionStrengthList.length > 0) {
      this.deleteService.deleteJobPositionStrength(this.deletedJobPositionStrengthList);
    }

    // Update club
    this.updateService.updateClub(this.clubBinding);
  }

  deleteSquadPlayer(type: string, index: number) {
    if(type == 'Current Year') {
      var removed = this.clubBinding.currentSquadPlayersList.splice(index, 1);
      this.deletedCurrentYearSquadPlayerList.push(removed[0]);   
    }
    if(type == 'Next Year') {
      var removed = this.clubBinding.nextYearSquadPlayersList.splice(index, 1);
      this.deletedNextYearSquadPlayersList.push(removed[0]);
    }
  }

  deleteTrainingHours(index: number) {
    // Remove selected element from clubBinding.trainingHoursList
    var removed = this.clubBinding.trainingHoursList.splice(index, 1);
    // Add selected element to deletedTrainingHoursList
    this.deletedTrainingHoursList.push(removed[0]);   
  }

  deleteClubValue(index: number) {
    var removed = this.clubBinding.valuesList.splice(index, 1);
    this.deletedClubValueList.push(removed[0]);  
  }

  deleteClubPreference(index: number) {
    var removed = this.clubBinding.preferenceList.splice(index, 1);
    this.deletedClubPreferenceList.push(removed[0]);  
  }

  deleteJobPosition(index: number) {
    var removed = this.clubBinding.jobPositionsList.splice(index, 1);
    this.deletedJobPositionList.push(removed[0]);  
  }

  deleteJobPositionStrength(index: number) {
  }

  cancel() {
    this.clubBinding = this.loginService.clubInSession;
  }

  markPreferenceCheckboxes(preferenceList: any) {
    preferenceList.forEach(element => {
      if(element == 'Talent development club') {
        this.talentDevelopmentClub.checked = true;
      } else if(element == 'Strives for titles') {
        this.strivesForTitles.checked = true;
      } else if(element == 'Result oriented') {
        this.resultOriented.checked = true;
      } else {
        this.processOriented.checked = true;
      }
    });
  }

  markValueCheckboxes(valuesList: any) {
    valuesList.forEach(element => {
      if(element == 'Hard working') {
        this.hardWorking.checked = true;
      } else if(element == 'Social cohesion') {
        this.socialCohesion.checked = true;
      } else {
        this.winningMentality.checked = true;
      }
    });
  }

  // Helping method used to display current regular traininghours
  buildRegularHours(element: any) {
    this.regularHours.id = element.id;
    this.regularMonFrom.setValue(element.mon.slice(0, 5));
    this.regularMonTo.setValue(element.mon.slice(8, 13));
    this.regularTueFrom.setValue(element.tue.slice(0, 5));
    this.regularTueTo.setValue(element.tue.slice(8, 13));
    this.regularWedFrom.setValue(element.wed.slice(0, 5));
    this.regularWedTo.setValue(element.wed.slice(8, 13));
    this.regularThuFrom.setValue(element.thu.slice(0, 5));
    this.regularThuTo.setValue(element.thu.slice(8, 13));
    this.regularFriFrom.setValue(element.fri.slice(0, 5));
    this.regularFriTo.setValue(element.fri.slice(8, 13));
    this.regularSatFrom.setValue(element.sat.slice(0, 5));
    this.regularSatTo.setValue(element.sat.slice(8, 13));
    this.regularSunFrom.setValue(element.sun.slice(0, 5));
    this.regularSunTo.setValue(element.sun.slice(8, 13));
  }

  // Helping method used to display current fitness traininghours
  buildFitnessHours(element: any) {
    this.fitnessHours.id = element.id;
    this.fitnessMonFrom.setValue(element.mon.slice(0, 5));
    this.fitnessMonTo.setValue(element.mon.slice(8, 13));
    this.fitnessTueFrom.setValue(element.tue.slice(0, 5));
    this.fitnessTueTo.setValue(element.tue.slice(8, 13));
    this.fitnessWedFrom.setValue(element.wed.slice(0, 5));
    this.fitnessWedTo.setValue(element.wed.slice(8, 13));
    this.fitnessThuFrom.setValue(element.thu.slice(0, 5));
    this.fitnessThuTo.setValue(element.thu.slice(8, 13));
    this.fitnessFriFrom.setValue(element.fri.slice(0, 5));
    this.fitnessFriTo.setValue(element.fri.slice(8, 13));
    this.fitnessSatFrom.setValue(element.sat.slice(0, 5));
    this.fitnessSatTo.setValue(element.sat.slice(8, 13));
    this.fitnessSunFrom.setValue(element.sun.slice(0, 5));
    this.fitnessSunTo.setValue(element.sun.slice(8, 13));
  }

  // Helping method used to get updated regular training hours
  buildRegularTrainingHours() {
    this.regularHours.name = 'Handball';

    this.regularHours.mon = this.regularMonFrom.value + '-' + this.regularMonTo.value
    this.regularHours.tue = this.regularTueFrom.value + '-' + this.regularTueTo.value
    this.regularHours.wed = this.regularWedFrom.value + '-' + this.regularWedTo.value
    this.regularHours.thu = this.regularThuFrom.value + '-' + this.regularThuTo.value
    this.regularHours.fri = this.regularFriFrom.value + '-' + this.regularFriTo.value
    this.regularHours.sat = this.regularSatFrom.value + '-' + this.regularSatTo.value
    this.regularHours.sun = this.regularSunFrom.value + '-' + this.regularSunTo.value

    return this.regularHours;
  }

  // Helping method used to get updated fitness training hours
  buildFitnessTrainingHours() {
    this.fitnessHours.name = 'Fitness training';

    this.fitnessHours.mon = this.fitnessMonFrom.value + '-' + this.fitnessMonTo.value
    this.fitnessHours.tue = this.fitnessTueFrom.value + '-' + this.fitnessTueTo.value
    this.fitnessHours.wed = this.fitnessWedFrom.value + '-' + this.fitnessWedTo.value
    this.fitnessHours.thu = this.fitnessThuFrom.value + '-' + this.fitnessThuTo.value
    this.fitnessHours.fri = this.fitnessFriFrom.value + '-' + this.fitnessFriTo.value
    this.fitnessHours.sat = this.fitnessSatFrom.value + '-' + this.fitnessSatTo.value
    this.fitnessHours.sun = this.fitnessSunFrom.value + '-' + this.fitnessSunTo.value

    return this.regularHours;
  }
}
