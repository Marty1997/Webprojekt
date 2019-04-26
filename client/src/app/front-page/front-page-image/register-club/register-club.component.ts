import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, NgForm, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher, MatCheckbox } from '@angular/material';
import { registerService } from 'src/app/services/registerService';
import { uploadFilesService } from 'src/app/services/uploadFilesService';
import { Club } from '../../../models/club.model';
import { SquadPlayer } from '../../../models/squadPlayer.model';
import { TrainingHours } from '../../../models/trainingHours.model';
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
  openPositionsFormGroup: FormGroup;
  clubStaffFormGroup: FormGroup;
  clubPicturesFormGroup: FormGroup;
  valuesAndPreferencesFormGroup: FormGroup;
  clubLogo: File = null;
  facilityPictures: FileList = null;

  // training hours
  regular: TrainingHours = new TrainingHours();
  fitness: TrainingHours = new TrainingHours();

  // open positions
  @ViewChild('goalkeeperOpen') goalkeeperOpen: MatCheckbox;
  @ViewChild('leftWingOpen') leftWingOpen: MatCheckbox;
  @ViewChild('leftBackOpen') leftBackOpen: MatCheckbox;
  @ViewChild('centreBackOpen') centreBackOpen: MatCheckbox;
  @ViewChild('pivotOpen') pivotOpen: MatCheckbox;
  @ViewChild('rightBackOpen') rightBackOpen: MatCheckbox;
  @ViewChild('rightWingOpen') rightWingOpen: MatCheckbox;
  @ViewChild('defenceOpen') defenceOpen: MatCheckbox;

  // values&preferences
  @ViewChild('firstValue') firstValue: MatCheckbox;
  @ViewChild('secondValue') secondValue: MatCheckbox;
  @ViewChild('thirdValue') thirdValue: MatCheckbox;
  @ViewChild('fourthValue') fourthValue: MatCheckbox;
  @ViewChild('fifthValue') fifthValue: MatCheckbox;
  @ViewChild('firstPreference') firstPreference: MatCheckbox;
  @ViewChild('secondPreference') secondPreference: MatCheckbox;
  @ViewChild('thirdPreference') thirdPreference: MatCheckbox;
  @ViewChild('fourthPreference') fourthPreference: MatCheckbox;
  @ViewChild('fifthPreference') fifthPreference: MatCheckbox;

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
    this.openPositionsFormGroup = this._formBuilder.group({
      
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
    this.club.zipcode = this.clubRequiredInfoFormGroup.value.zipcode;
    // training hours
    this.regular.name = "Regular";
    this.regular.mon = this.trainingScheduleFormGroup.value.regularMondayFromControl + " - " + this.trainingScheduleFormGroup.value.regularMondayToControl;
    this.regular.tue = this.trainingScheduleFormGroup.value.regularTuesdayToControl + " - " + this.trainingScheduleFormGroup.value.regularTuesdayFromControl;
    this.regular.wed = this.trainingScheduleFormGroup.value.regularWednesdayToControl + " - " + this.trainingScheduleFormGroup.value.regularWednesdayFromControl;
    this.regular.thu = this.trainingScheduleFormGroup.value.regularThursdayToControl + " - " + this.trainingScheduleFormGroup.value.regularThursdayFromControl;
    this.regular.fri = this.trainingScheduleFormGroup.value.regularFridayToControl + " - " + this.trainingScheduleFormGroup.value.regularFridayFromControl;
    this.regular.sat = this.trainingScheduleFormGroup.value.regularSaturdayToControl + " - " + this.trainingScheduleFormGroup.value.regularSaturdayFromControl;
    this.regular.sun = this.trainingScheduleFormGroup.value.regularSundayToControl + " - " + this.trainingScheduleFormGroup.value.regularSundayFromControl;
    this.club.trainingHoursList.push(this.regular);
    this.fitness.name = "Fitness";
    this.fitness.mon = this.trainingScheduleFormGroup.value.fitnessMondayFromControl + " - " + this.trainingScheduleFormGroup.value.fitnessMondayToControl;
    this.fitness.tue = this.trainingScheduleFormGroup.value.fitnessTuesdayToControl + " - " + this.trainingScheduleFormGroup.value.fitnessTuesdayFromControl;
    this.fitness.wed = this.trainingScheduleFormGroup.value.fitnessWednesdayToControl + " - " + this.trainingScheduleFormGroup.value.fitnessWednesdayFromControl;
    this.fitness.thu = this.trainingScheduleFormGroup.value.fitnessThursdayToControl + " - " + this.trainingScheduleFormGroup.value.fitnessThursdayFromControl;
    this.fitness.fri = this.trainingScheduleFormGroup.value.fitnessFridayToControl + " - " + this.trainingScheduleFormGroup.value.fitnessFridayFromControl;
    this.fitness.sat = this.trainingScheduleFormGroup.value.fitnessSaturdayToControl + " - " + this.trainingScheduleFormGroup.value.fitnessSaturdayFromControl;
    this.fitness.sun = this.trainingScheduleFormGroup.value.fitnessSundayToControl + " - " + this.trainingScheduleFormGroup.value.fitnessSundayFromControl;
    this.club.trainingHoursList.push(this.fitness);
    // squad
    this.club.squadPlayersList = this.elementData;
    // open positions
    if(this.goalkeeperOpen.checked) {
      this.club.openPositionList.push(this.goalkeeperOpen.value);
    }
    if(this.leftWingOpen.checked) {
      this.club.openPositionList.push(this.leftWingOpen.value);
    }
    if(this.leftBackOpen.checked) {
      this.club.openPositionList.push(this.leftBackOpen.value);
    }
    if(this.centreBackOpen.checked) {
      this.club.openPositionList.push(this.centreBackOpen.value);
    }
    if(this.pivotOpen.checked) {
      this.club.openPositionList.push(this.pivotOpen.value);
    }
    if(this.rightBackOpen.checked) {
      this.club.openPositionList.push(this.rightBackOpen.value);
    }
    if(this.rightWingOpen.checked) {
      this.club.openPositionList.push(this.rightWingOpen.value);
    }
    if(this.defenceOpen.checked) {
      this.club.openPositionList.push(this.defenceOpen.value);
    }
    // staff
    this.club.trainer = this.clubStaffFormGroup.value.trainerControl;
    this.club.assistantTrainer = this.clubStaffFormGroup.value.assistantTrainerControl;
    this.club.physiotherapist = this.clubStaffFormGroup.value.physiotherapistControl;
    this.club.assistantPhysiotherapist = this.clubStaffFormGroup.value.assistantPhysiotherapistControl;
    this.club.manager = this.clubStaffFormGroup.value.managerControl;
    // files
    this.club.logo = this.clubPicturesFormGroup.value.clubLogoControl;
    this.club.facilityPictures = this.clubPicturesFormGroup.value.facilityPicturesControl;
    // values
    this.club.valueDescription = this.valuesAndPreferencesFormGroup.value.valuesControl;
    if(this.firstValue.checked) {
      this.club.valuesList.push(this.firstValue.value);
    }
    if(this.secondValue.checked) {
      this.club.valuesList.push(this.secondValue.value);
    }
    if(this.thirdValue.checked) {
      this.club.valuesList.push(this.thirdValue.value);
    }
    if(this.fourthValue.checked) {
      this.club.valuesList.push(this.fourthValue.value);
    }
    if(this.fifthValue.checked) {
      this.club.valuesList.push(this.fifthValue.value);
    }
    // preferences
    this.club.preferenceDescription = this.valuesAndPreferencesFormGroup.value.preferencesControl;
    if(this.firstPreference.checked) {
      this.club.valuesList.push(this.firstPreference.value);
    }
    if(this.secondPreference.checked) {
      this.club.valuesList.push(this.secondPreference.value);
    }
    if(this.thirdPreference.checked) {
      this.club.valuesList.push(this.thirdPreference.value);
    }
    if(this.fourthPreference.checked) {
      this.club.valuesList.push(this.fourthPreference.value);
    }
    if(this.fifthPreference.checked) {
      this.club.valuesList.push(this.fifthPreference.value);
    }

    return this.club;
  }
}