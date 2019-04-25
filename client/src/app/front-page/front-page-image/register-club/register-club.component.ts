import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormGroupDirective, NgForm, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { registerService } from 'src/app/services/registerService';
import { uploadFilesService } from 'src/app/services/uploadFilesService';
import { Club } from '../../../models/club.model';
import { SquadPlayer } from '../../../models/squadPlayer.model';
import { asElementData } from '@angular/core/src/view';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register-club',
  templateUrl: './register-club.component.html',
  styleUrls: ['./register-club.component.css'],
  providers: [registerService, uploadFilesService]
})
export class RegisterClubComponent implements OnInit {
  @Input() modalRef: any;
  club: Club = new Club();
  hide = true; // password visibility
  clubRequiredInfoFormGroup: FormGroup;
  trainingScheduleFormGroup: FormGroup;
  clubSquadFormGroup: FormGroup;
  clubStaffFormGroup: FormGroup;
  clubPicturesFormGroup: FormGroup;
  valuesAndPreferencesFormGroup: FormGroup;
  clubLogo: File = null;
  facilityPictures: FileList = null;

  // squad table
  displayedColumns: string[] = ['shirtNumber', 'name', 'position'];
  elementData: SquadPlayer[] = [{name: 'name', position: 'pos', shirtNumber: 1}];
  dataSource = this.elementData;
  @Input() squadPlayerName: string;
  @Input() squadPlayerPosition: string;
  @Input() squadPlayerShirtNumber: number;
  squadPlayer = new SquadPlayer();

  // validate
  validate = new MyErrorStateMatcher();
  numbersOnlyRegex = /^[0-9]*$/;
  numbersOnlyControl = new FormControl('', Validators.pattern(this.numbersOnlyRegex));
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  clubNameControl = new FormControl('', Validators.required);
  countryControl = new FormControl('', Validators.required);
  leagueControl = new FormControl('', Validators.required);
  streetAddressControl = new FormControl('', Validators.required);
  streetNumberControl = new FormControl('', [Validators.required, Validators.pattern(this.numbersOnlyRegex)]);
  cityControl = new FormControl('', Validators.required);
  zipcodeControl = new FormControl('', Validators.required);

  constructor(private _formBuilder: FormBuilder, 
                private registerService: registerService, 
                private uploadFilesService: uploadFilesService) { }

  ngOnInit() {
    this.clubRequiredInfoFormGroup = this._formBuilder.group({
      email: this.emailControl, password: this.passwordControl, clubName: this.clubNameControl,
      country: this.countryControl, league: this.leagueControl, streetAddress: this.streetAddressControl,
      streetNumber: this.streetNumberControl, city: this.cityControl,
      zipcode: this.zipcodeControl
    });
    this.trainingScheduleFormGroup = this._formBuilder.group({
      regularMondayFromControl: [''], regularMondayToControl: [''], regularTuesdayFromControl: [''],
      regularTuesdayToControl: [''], regularWednesdayFromControl: [''], regularWednesdayToControl: [''],
      regularThursdayFromControl: [''], regularThursdayToControl: [''], regularFridayFromControl: [''],
      regularFridayToControl: [''], regularSaturdayFromControl: [''], regularSaturdayToControl: [''],
      regularSundayFromControl: [''], regularSundayToControl: [''], fitnessMondayFromControl: [''], 
      fitnessMondayToControl: [''], fitnessTuesdayFromControl: [''], fitnessTuesdayToControl: [''],
      fitnessWednesdayFromControl: [''], fitnessWednesdayToControl: [''], fitnessThursdayFromControl: [''],
      fitnessThursdayToControl: [''], fitnessFridayFromControl: [''], fitnessFridayToControl: [''],
      fitnessSaturdayFromControl: [''], fitnessSaturdayToControl: [''], fitnessSundayFromControl: [''],
      fitnessSundayToControl: ['']
    });
    this.clubSquadFormGroup = this._formBuilder.group({
      playerNameControl: [''], playerPositionControl: [''], shirtNumberControl: this.numbersOnlyControl
    });
    this.clubStaffFormGroup = this._formBuilder.group({
      trainerControl: [''], assistantTrainerControl: [''], physiotherapistControl: [''],
      assistantPhysiotherapistControl: [''], managerControl: ['']
    });
    this.clubPicturesFormGroup = this._formBuilder.group({
      clubLogoControl: [''], facilityPicturesControl: ['']
    });
    this.valuesAndPreferencesFormGroup = this._formBuilder.group({
      valuesControl: [''], preferencesControl: ['']
    });
  }

  onAddPlayerToSquad() {
    this.squadPlayer.name = this.clubSquadFormGroup.get('playerNameControl').value;
    this.squadPlayer.position = this.clubSquadFormGroup.get('playerPositionControl').value;
    this.squadPlayer.shirtNumber = this.clubSquadFormGroup.get('shirtNumberControl').value;

    this.elementData.push(this.squadPlayer);
    
    console.log(this.elementData);
  }

  onClubLogoSelected(event) {
    this.clubLogo = <File>event.target.files[0];
  }

  onFacilityPicturesSelected(event) {
    this.facilityPictures = <FileList>event.target.FileList;
  }

  onUpload() {
    if(this.clubLogo != null) {
      this.uploadFilesService.uploadFile(this.clubLogo);
    }
    if(this.facilityPictures != null) {
      this.uploadFilesService.uploadFiles(this.facilityPictures);
    }
  }

  registerClub() {
    this.onUpload();
    this.registerService.registerClub(this.buildClub());
    this.sendEmailConfirmation(this.emailControl.value);
    console.log(this.club);
  }

  sendEmailConfirmation(clubEmail: string) {
    this.registerService.sendConfirmationEmail(clubEmail);
  }

  buildClub() {
    this.club.email = this.clubRequiredInfoFormGroup.value.email;
    this.club.password = this.clubRequiredInfoFormGroup.value.password;
    this.club.name = this.clubRequiredInfoFormGroup.value.clubName;
    this.club.country = this.clubRequiredInfoFormGroup.value.country;
    this.club.league = this.clubRequiredInfoFormGroup.value.league;
    this.club.streetAddress = this.clubRequiredInfoFormGroup.value.streetAddress;
    this.club.streetNumber = this.clubRequiredInfoFormGroup.value.streetNumber;
    this.club.city = this.clubRequiredInfoFormGroup.value.city;
    this.club.state = this.clubRequiredInfoFormGroup.value.state;
    this.club.zipcode = this.clubRequiredInfoFormGroup.value.zipcode;
    this.club.regularMonday = this.trainingScheduleFormGroup.value.regularMondayFromControl + " - " + this.trainingScheduleFormGroup.value.regularMondayToControl;
    this.club.regularTuesday = this.trainingScheduleFormGroup.value.regularTuesdayToControl + " - " + this.trainingScheduleFormGroup.value.regularTuesdayFromControl;
    this.club.regularWednesday = this.trainingScheduleFormGroup.value.regularWednesdayToControl + " - " + this.trainingScheduleFormGroup.value.regularWednesdayFromControl;
    this.club.regularThursday = this.trainingScheduleFormGroup.value.regularThursdayToControl + " - " + this.trainingScheduleFormGroup.value.regularThursdayFromControl;
    this.club.regularFriday = this.trainingScheduleFormGroup.value.regularFridayToControl + " - " + this.trainingScheduleFormGroup.value.regularFridayFromControl;
    this.club.regularSaturday = this.trainingScheduleFormGroup.value.regularSaturdayToControl + " - " + this.trainingScheduleFormGroup.value.regularSaturdayFromControl;
    this.club.regularSunday = this.trainingScheduleFormGroup.value.regularSundayToControl + " - " + this.trainingScheduleFormGroup.value.regularSundayFromControl;
    this.club.fitnessMonday = this.trainingScheduleFormGroup.value.fitnessMondayFromControl + " - " + this.trainingScheduleFormGroup.value.fitnessMondayToControl;
    this.club.fitnessTuesday = this.trainingScheduleFormGroup.value.fitnessTuesdayToControl + " - " + this.trainingScheduleFormGroup.value.fitnessTuesdayFromControl;
    this.club.fitnessWednesday = this.trainingScheduleFormGroup.value.fitnessWednesdayToControl + " - " + this.trainingScheduleFormGroup.value.fitnessWednesdayFromControl;
    this.club.fitnessThursday = this.trainingScheduleFormGroup.value.fitnessThursdayToControl + " - " + this.trainingScheduleFormGroup.value.fitnessThursdayFromControl;
    this.club.fitnessFriday = this.trainingScheduleFormGroup.value.fitnessFridayToControl + " - " + this.trainingScheduleFormGroup.value.fitnessFridayFromControl;
    this.club.fitnessSaturday = this.trainingScheduleFormGroup.value.fitnessSaturdayToControl + " - " + this.trainingScheduleFormGroup.value.fitnessSaturdayFromControl;
    this.club.fitnessSunday = this.trainingScheduleFormGroup.value.fitnessSundayToControl + " - " + this.trainingScheduleFormGroup.value.fitnessSundayFromControl;
    this.club.goalkeeper = this.clubSquadFormGroup.value.goalkeeperControl;
    this.club.leftWing = this.clubSquadFormGroup.value.leftWingControl;
    this.club.leftBack = this.clubSquadFormGroup.value.leftBackControl;
    this.club.centreBack = this.clubSquadFormGroup.value.centreBackControl;
    this.club.rightBack = this.clubSquadFormGroup.value.rightBackControl;
    this.club.rightWing = this.clubSquadFormGroup.value.rightWingControl;
    this.club.pivot = this.clubSquadFormGroup.value.pivotControl;
    this.club.defence = this.clubSquadFormGroup.value.defenceControl;
    this.club.benchPlayers = this.clubSquadFormGroup.value.benchPlayerControl;
    this.club.trainer = this.clubStaffFormGroup.value.trainerControl;
    this.club.assistantTrainer = this.clubStaffFormGroup.value.assistantTrainerControl;
    this.club.physiotherapist = this.clubStaffFormGroup.value.physiotherapistControl;
    this.club.assistantPhysiotherapist = this.clubStaffFormGroup.value.assistantPhysiotherapistControl;
    this.club.manager = this.clubStaffFormGroup.value.managerControl;
    this.club.logo = this.clubPicturesFormGroup.value.clubLogoControl;
    this.club.facilityPictures = this.clubPicturesFormGroup.value.facilityPicturesControl;
    this.club.values = this.valuesAndPreferencesFormGroup.value.valuesControl;
    this.club.preferences = this.valuesAndPreferencesFormGroup.value.preferencesControl;

    return this.club;
  }
}