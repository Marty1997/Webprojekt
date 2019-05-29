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
  facilityImages: string[] = [];
  fitnessMonTo: string;
  fitnessMonFrom: string;
  fitnessTueTo: string;
  fitnessTueFrom: string;
  fitnessWedTo: string;
  fitnessWedFrom: string;
  fitnessThuTo: string;
  fitnessThuFrom: string;
  fitnessFriTo: string;
  fitnessFriFrom: string;
  fitnessSatTo: string;
  fitnessSatFrom: string;
  fitnessSunTo: string;
  fitnessSunFrom: string;
  regularMonFrom: string;
  regularMonTo: string;
  regularTueFrom: string;
  regularTueTo: string;
  regularWedTo: string;
  regularWedFrom: string;
  regularThuFrom: string;
  regularThuTo: string;
  regularFriFrom: string;
  regularFriTo: string;
  regularSatFrom: string;
  regularSatTo: string;
  regularSunFrom: string;
  regularSunTo: string;
  
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
    this.clubBinding.trainingHoursList.forEach(element => {
      if(element.name == 'Handball') {
        this.buildRegularHours(element);
      } else if(element.name == 'Fitness training') {
        this.buildFitnessHours(element);
      }
    });
    if(this.clubBinding.currentSquadPlayersList.length > 0) {
      this.elementData = this.clubBinding.currentSquadPlayersList;
    }
    if(this.clubBinding.nextYearSquadPlayersList.length > 0) {
      this.nextYearSquadData = this.clubBinding.nextYearSquadPlayersList;
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
          this.updateClubProfile(); 
        }
        if(type === 'facility') {
          if(this.clubBinding.facilityImagesList != null) {
            this.facilityImages = this.clubBinding.facilityImagesList;
          }
        this.facilityImages.push(this.uploadFilesService.imagePath);
        this.clubBinding.facilityImagesList = this.facilityImages;
        this.updateClubFacility();
        }
      });
    }
  }

  updateClubInfo() {
    this.updateService.updateClubInfo(this.buildClubInfo());
  }

  updateClubRegularTrainingSchedule() {
    this.updateService.updateClubRegularTrainingSchedule(this.buildClubRegularTrainingSchedule());
  }

  deleteClubRegularTrainingSchedule() {
    this.deleteService.deleteClubRegularTrainingSchedule(); 
  }

  updateClubFitnessTrainingSchedule() {
    this.updateService.updateClubFitnessTrainingSchedule();
  }

  deleteClubFitnessTrainingSchedule() {
    this.deleteService.deleteClubFitnessTrainingSchedule(); 
  }

  updateCurrentSeasonSquad() {
    this.updateService.updateCurrentSeasonSquad();
  }

  deleteCurrentSeasonSquad() {
    this.deleteService.deleteCurrentSeasonSquad();
  }

  updateNextSeasonSquad() {
    this.updateService.updateNextSeasonSquad();
  }

  deleteNextSeasonSquad() {
    this.deleteService.deleteNextSeasonSquad();
  }

  updateOpenPosition() {
    this.updateService.updateOpenPosition();
  }

  deleteOpenPosition() {
    this.deleteService.deleteOpenPosition();
  }

  updateStaff() {
    this.updateService.updateStaff();
  }

  updateValuesAndPreferences() {
    this.updateService.updateValuesAndPreferences(this.clubBinding);
  }

  updateClubProfile() {
    this.updateService.updateProfile(this.clubBinding);
  }

  updateClubFacility() {
    this.updateService.updateFacility(this.clubBinding);
  }

  deleteClubValue(index: number) {
    
  }

  deleteClubPreference(index: number) {
    
  }

  deleteJobPosition(index: number) {
    
  }

  deleteJobPositionStrength(index: number) {
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

  buildClubInfo() {
    let club: Club;
    club.password = this.currentPassword.value;
    club.newPassword = this.password.value;
    club.name = this.name.value;
    club.league = this.league.value;
    club.streetAddress = this.streetAddress.value;
    club.streetNumber = this.streetNumber.value;
    club.country = this.country.value;
    club.city = this.city.value;
    club.zipcode = this.zipcode.value;
    return club;
  }

  // Helping method used to split up regular traininghours into from and to
  buildRegularHours(element: any) {
    this.regularMonFrom = element.mon.slice(0, 5);
    this.regularMonTo = element.mon.slice(8, 13);
    this.regularTueFrom = element.tue.slice(0, 5);
    this.regularTueTo = element.tue.slice(8, 13);
    this.regularWedFrom = element.wed.slice(0, 5);
    this.regularWedTo = element.wed.slice(8, 13);
    this.regularThuFrom = element.thu.slice(0, 5);
    this.regularThuTo = element.thu.slice(8, 13);
    this.regularFriFrom = element.fri.slice(0, 5);
    this.regularFriTo = element.fri.slice(8, 13);
    this.regularSatFrom = element.sat.slice(0, 5);
    this.regularSatTo = element.sat.slice(8, 13);
    this.regularSunFrom = element.sun.slice(0, 5);
    this.regularSunTo = element.sun.slice(8, 13);
  }

  // Helping method used to split up fitness traininghours into from and to
  buildFitnessHours(element: any) {
    this.fitnessMonFrom = element.mon.slice(0, 5);
    this.fitnessMonTo = element.mon.slice(8, 13);
    this.fitnessTueFrom = element.tue.slice(0, 5);
    this.fitnessTueTo = element.tue.slice(8, 13);
    this.fitnessWedFrom = element.wed.slice(0, 5);
    this.fitnessWedTo = element.wed.slice(8, 13);
    this.fitnessThuFrom = element.thu.slice(0, 5);
    this.fitnessThuTo = element.thu.slice(8, 13);
    this.fitnessFriFrom = element.fri.slice(0, 5);
    this.fitnessFriTo = element.fri.slice(8, 13);
    this.fitnessSatFrom = element.sat.slice(0, 5);
    this.fitnessSatTo = element.sat.slice(8, 13);
    this.fitnessSunFrom = element.sun.slice(0, 5);
    this.fitnessSunTo = element.sun.slice(8, 13);
  }
}
