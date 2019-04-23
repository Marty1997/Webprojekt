import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormGroupDirective, NgForm, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { registerService } from 'src/app/services/registerService';
import { uploadFilesService } from 'src/app/services/uploadFilesService';

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
  hide = true; // password visibility
  clubRequiredInfoFormGroup: FormGroup;
  trainingScheduleFormGroup: FormGroup;
  clubSquadFormGroup: FormGroup;
  clubStaffFormGroup: FormGroup;
  clubPicturesFormGroup: FormGroup;
  valuesAndPreferencesFormGroup: FormGroup;
  clubLogo: File = null;
  facilityPictures: FileList = null;


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
  streetAddressLineTwoControl = new FormControl('', Validators.required);
  cityControl = new FormControl('', Validators.required);
  stateControl = new FormControl('', Validators.required);
  zipcodeControl = new FormControl('', Validators.required);

  constructor(private _formBuilder: FormBuilder, 
                private registerService: registerService, 
                private uploadFilesService: uploadFilesService) { }

  ngOnInit() {
    this.clubRequiredInfoFormGroup = this._formBuilder.group({
      email: this.emailControl,
      password: this.passwordControl,
      clubName: this.clubNameControl,
      country: this.countryControl,
      league: this.leagueControl,
      streetAddress: this.streetAddressControl,
      streetAddressLineTwo: this.streetAddressLineTwoControl,
      city: this.cityControl,
      state: this.stateControl,
      zipcode: this.zipcodeControl
    });
    this.trainingScheduleFormGroup = this._formBuilder.group({
      regularMondayFromControl: [''],
      regularMondayToControl: [''],
      regularTuesdayFromControl: [''],
      regularTuesdayToControl: [''],
      regularWednesdayFromControl: [''],
      regularWednesdayToControl: [''],
      regularThursdayFromControl: [''],
      regularThursdayToControl: [''],
      regularFridayFromControl: [''],
      regularFridayToControl: [''],
      regularSaturdayFromControl: [''],
      regularSaturdayToControl: [''],
      regularSundayFromControl: [''],
      regularSundayToControl: [''],
      fitnessMondayFromControl: [''],
      fitnessMondayToControl: [''],
      fitnessTuesdayFromControl: [''],
      fitnessTuesdayToControl: [''],
      fitnessWednesdayFromControl: [''],
      fitnessWednesdayToControl: [''],
      fitnessThursdayFromControl: [''],
      fitnessThursdayToControl: [''],
      fitnessFridayFromControl: [''],
      fitnessFridayToControl: [''],
      fitnessSaturdayFromControl: [''],
      fitnessSaturdayToControl: [''],
      fitnessSundayFromControl: [''],
      fitnessSundayToControl: ['']
    });
    this.clubSquadFormGroup = this._formBuilder.group({
      goalkeeperControl: [''],
      leftWingControl: [''],
      leftBackControl: [''],
      centreBackControl: [''],
      rightBackControl: [''],
      rightWingControl: [''],
      defenceControl: [''],
      benchPlayerControl: ['']
    });
    this.clubStaffFormGroup = this._formBuilder.group({
      trainerControl: [''],
      assistantTrainerControl: [''],
      physiotherapistControl: [''],
      doctorControl: [''],
      managerControl: ['']
    });
    this.clubPicturesFormGroup = this._formBuilder.group({
      clubLogoControl: [''],
      facilityPicturesControl: ['']
    });
    this.valuesAndPreferencesFormGroup = this._formBuilder.group({
      valuesControl: [''],
      preferencesControl: ['']
    });
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
  }

  sendEmailConfirmation(clubEmail: string) {
    this.registerService.sendConfirmationEmail(clubEmail);
  }

  buildClub() {
    // club: Club = new Club(); //imported from model

    // required info

    // club.email = this.clubRequiredInfoFormGroup.value.email;
    // club.password = this.clubRequiredInfoFormGroup.value.password;
    // club.name = this.clubRequiredInfoFormGroup.value.clubName;
    // club.country = this.clubRequiredInfoFormGroup.value.country;
    // club.league = this.clubRequiredInfoFormGroup.value.league;
    // club.streetAddress = this.clubRequiredInfoFormGroup.value.streetAddress;
    // club.streetAddressLineTwo = this.clubRequiredInfoFormGroup.value.streetAddressLineTwo;
    // club.city = this.clubRequiredInfoFormGroup.value.city;
    // club.state = this.clubRequiredInfoFormGroup.value.state;
    // club.zipcode = this.clubRequiredInfoFormGroup.value.zipcode;

    // 

    // regularMondayFromControl: [''],
    //   regularMondayToControl: [''],
    //   regularTuesdayFromControl: [''],
    //   regularTuesdayToControl: [''],
    //   regularWednesdayFromControl: [''],
    //   regularWednesdayToControl: [''],
    //   regularThursdayFromControl: [''],
    //   regularThursdayToControl: [''],
    //   regularFridayFromControl: [''],
    //   regularFridayToControl: [''],
    //   regularSaturdayFromControl: [''],
    //   regularSaturdayToControl: [''],
    //   regularSundayFromControl: [''],
    //   regularSundayToControl: [''],
    //   fitnessMondayFromControl: [''],
    //   fitnessMondayToControl: [''],
    //   fitnessTuesdayFromControl: [''],
    //   fitnessTuesdayToControl: [''],
    //   fitnessWednesdayFromControl: [''],
    //   fitnessWednesdayToControl: [''],
    //   fitnessThursdayFromControl: [''],
    //   fitnessThursdayToControl: [''],
    //   fitnessFridayFromControl: [''],
    //   fitnessFridayToControl: [''],
    //   fitnessSaturdayFromControl: [''],
    //   fitnessSaturdayToControl: [''],
    //   fitnessSundayFromControl: [''],
    //   fitnessSundayToControl: ['']

    // return club;
  }
}
