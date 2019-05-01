import { Component, OnInit, Input, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormGroupDirective,
  NgForm,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { ErrorStateMatcher, MatCheckbox } from "@angular/material";
import { registerService } from "src/app/services/registerService";
import { uploadFilesService } from "src/app/services/uploadFilesService";
import { Club } from "../../../models/club.model";
import { SquadPlayer } from "../../../models/squadPlayer.model";
import { TrainingHours } from "../../../models/trainingHours.model";

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

@Component({
  selector: "app-register-club",
  templateUrl: "./register-club.component.html",
  styleUrls: ["./register-club.component.css"],
  providers: [registerService, uploadFilesService]
})
export class RegisterClubComponent implements OnInit {
  @Input() modalRef: any;
  club: Club = new Club();
  hide = true; // password visibility
  clubRequiredInfoFormGroup: FormGroup;
  trainingScheduleFormGroup: FormGroup;
  clubSquadFormGroup: FormGroup;
  nextYearSquadFormGroup: FormGroup;
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
  @ViewChild("goalkeeperOpen") goalkeeperOpen: MatCheckbox;
  @ViewChild("leftWingOpen") leftWingOpen: MatCheckbox;
  @ViewChild("leftBackOpen") leftBackOpen: MatCheckbox;
  @ViewChild("centreBackOpen") centreBackOpen: MatCheckbox;
  @ViewChild("pivotOpen") pivotOpen: MatCheckbox;
  @ViewChild("rightBackOpen") rightBackOpen: MatCheckbox;
  @ViewChild("rightWingOpen") rightWingOpen: MatCheckbox;
  @ViewChild("defenceOpen") defenceOpen: MatCheckbox;

  // values&preferences
  @ViewChild("firstValue") firstValue: MatCheckbox;
  @ViewChild("secondValue") secondValue: MatCheckbox;
  @ViewChild("thirdValue") thirdValue: MatCheckbox;
  @ViewChild("fourthValue") fourthValue: MatCheckbox;
  @ViewChild("fifthValue") fifthValue: MatCheckbox;
  @ViewChild("firstPreference") firstPreference: MatCheckbox;
  @ViewChild("secondPreference") secondPreference: MatCheckbox;
  @ViewChild("thirdPreference") thirdPreference: MatCheckbox;
  @ViewChild("fourthPreference") fourthPreference: MatCheckbox;
  @ViewChild("fifthPreference") fifthPreference: MatCheckbox;

  // squad table
  displayedColumns: string[] = ["shirtNumber", "name", "position"];
  elementData: SquadPlayer[] = [];
  dataSource = this.elementData;
  @Input() squadPlayerName: string;
  @Input() squadPlayerPosition: string;
  @Input() squadPlayerShirtNumber: number;
  squadPlayer = new SquadPlayer();

  // next year squad table
  nextYearSquadColumns: string[] = ["shirtNumber", "name", "position"];
  nextYearSquadData: SquadPlayer[] = [];
  nextYearSquadSource = this.nextYearSquadData;
  @Input() nextYearPlayerName: string;
  @Input() nextYearPlayerPosition: string;
  @Input() nextYearPlayerShirtNumber: number;
  nextYearSquadPlayer = new SquadPlayer();

  // validate
  errorMessage = "";
  validate = new MyErrorStateMatcher();
  numbersOnlyRegex = /^[0-9]*$/;
  numbersOnlyControl = new FormControl(
    "",
    Validators.pattern(this.numbersOnlyRegex)
  );
  emailControl = new FormControl("", [Validators.required, Validators.email]);
  passwordControl = new FormControl("", [
    Validators.required,
    Validators.minLength(6)
  ]);
  clubNameControl = new FormControl("", Validators.required);
  countryControl = new FormControl("", Validators.required);
  leagueControl = new FormControl("", Validators.required);
  streetAddressControl = new FormControl("", Validators.required);
  streetNumberControl = new FormControl("", [
    Validators.required,
    Validators.pattern(this.numbersOnlyRegex)
  ]);
  cityControl = new FormControl("", Validators.required);
  zipcodeControl = new FormControl("", Validators.required);

  constructor(
    private _formBuilder: FormBuilder,
    private registerService: registerService,
    private uploadFilesService: uploadFilesService
  ) {}

  ngOnInit() {
    this.clubRequiredInfoFormGroup = this._formBuilder.group({
      email: this.emailControl,
      password: this.passwordControl,
      clubName: this.clubNameControl,
      country: this.countryControl,
      league: this.leagueControl,
      streetAddress: this.streetAddressControl,
      streetNumber: this.streetNumberControl,
      city: this.cityControl,
      zipcode: this.zipcodeControl
    });
    this.trainingScheduleFormGroup = this._formBuilder.group({
      regularMondayFromControl: [""],
      regularMondayToControl: [""],
      regularTuesdayFromControl: [""],
      regularTuesdayToControl: [""],
      regularWednesdayFromControl: [""],
      regularWednesdayToControl: [""],
      regularThursdayFromControl: [""],
      regularThursdayToControl: [""],
      regularFridayFromControl: [""],
      regularFridayToControl: [""],
      regularSaturdayFromControl: [""],
      regularSaturdayToControl: [""],
      regularSundayFromControl: [""],
      regularSundayToControl: [""],
      fitnessMondayFromControl: [""],
      fitnessMondayToControl: [""],
      fitnessTuesdayFromControl: [""],
      fitnessTuesdayToControl: [""],
      fitnessWednesdayFromControl: [""],
      fitnessWednesdayToControl: [""],
      fitnessThursdayFromControl: [""],
      fitnessThursdayToControl: [""],
      fitnessFridayFromControl: [""],
      fitnessFridayToControl: [""],
      fitnessSaturdayFromControl: [""],
      fitnessSaturdayToControl: [""],
      fitnessSundayFromControl: [""],
      fitnessSundayToControl: [""]
    });
    this.clubSquadFormGroup = this._formBuilder.group({
      playerNameControl: [""],
      playerPositionControl: [""],
      shirtNumberControl: this.numbersOnlyControl
    });
    this.nextYearSquadFormGroup = this._formBuilder.group({
      playerNameControl: [""],
      playerPositionControl: [""],
      shirtNumberControl: this.numbersOnlyControl
    });
    this.openPositionsFormGroup = this._formBuilder.group({});
    this.clubStaffFormGroup = this._formBuilder.group({
      trainerControl: [""],
      assistantTrainerControl: [""],
      physiotherapistControl: [""],
      assistantPhysiotherapistControl: [""],
      managerControl: [""]
    });
    this.clubPicturesFormGroup = this._formBuilder.group({
      clubLogoControl: [""],
      facilityPicturesControl: [""]
    });
    this.valuesAndPreferencesFormGroup = this._formBuilder.group({
      valuesControl: [""],
      preferencesControl: [""]
    });
  }

  onAddPlayerToSquad() {
    if (
      this.clubSquadFormGroup.get("playerNameControl").value !== "" &&
      this.clubSquadFormGroup.get("playerPositionControl").value !== "" &&
      this.clubSquadFormGroup.get("shirtNumberControl").value !== "" &&
      Number(this.clubSquadFormGroup.get("shirtNumberControl").value)
    ) {
      this.squadPlayer = new SquadPlayer();
      this.squadPlayer.season = "Current year";
      this.squadPlayer.name = this.clubSquadFormGroup.get(
        "playerNameControl"
      ).value;
      this.squadPlayer.position = this.clubSquadFormGroup.get(
        "playerPositionControl"
      ).value;
      this.squadPlayer.shirtNumber = this.clubSquadFormGroup.get(
        "shirtNumberControl"
      ).value;

      this.dataSource.push(this.squadPlayer); //add the new model object to the dataSource
      this.dataSource = [...this.dataSource]; //refresh the dataSource

      // reset input fields
      this.clubSquadFormGroup.get("playerNameControl").setValue("");
      this.clubSquadFormGroup.get("playerPositionControl").setValue("");
      this.clubSquadFormGroup.get("shirtNumberControl").setValue("");
      console.log(this.dataSource);
    }
  }

  onAddPlayerToNextYearSquad() {
    if (
      this.nextYearSquadFormGroup.get("playerNameControl").value !== "" &&
      this.nextYearSquadFormGroup.get("playerPositionControl").value !== "" &&
      this.nextYearSquadFormGroup.get("shirtNumberControl").value !== "" &&
      Number(this.nextYearSquadFormGroup.get("shirtNumberControl").value)
    ) {
      this.nextYearSquadPlayer = new SquadPlayer();
      this.nextYearSquadPlayer.season = "Next year";
      this.nextYearSquadPlayer.name = this.nextYearSquadFormGroup.get(
        "playerNameControl"
      ).value;
      this.nextYearSquadPlayer.position = this.nextYearSquadFormGroup.get(
        "playerPositionControl"
      ).value;
      this.nextYearSquadPlayer.shirtNumber = this.nextYearSquadFormGroup.get(
        "shirtNumberControl"
      ).value;

      this.nextYearSquadSource.push(this.nextYearSquadPlayer); //add the new model object to the dataSource
      this.nextYearSquadSource = [...this.nextYearSquadSource]; //refresh the dataSource

      // reset input fields
      this.nextYearSquadFormGroup.get("playerNameControl").setValue("");
      this.nextYearSquadFormGroup.get("playerPositionControl").setValue("");
      this.nextYearSquadFormGroup.get("shirtNumberControl").setValue("");
      console.log(this.nextYearSquadSource);
    }
  }

  onClubLogoSelected(event) {
    this.clubLogo = <File>event.target.files[0];
  }

  onFacilityPicturesSelected(event) {
    this.facilityPictures = <FileList>event.target.FileList;
  }

  onUpload() {
    if (this.clubLogo != null) {
      this.uploadFilesService.uploadFile(this.clubLogo);
    }
    if (this.facilityPictures != null) {
      this.uploadFilesService.uploadFiles(this.facilityPictures);
    }
  }

  registerClub() {
    this.onUpload();
    if (this.registerService.registerClub(this.buildClub())) {
      this.sendEmailConfirmation(this.emailControl.value);
    } else {
      this.errorMessage = "Something went wrong with the registration.";
    }
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
    // regular training hours
    if (
      this.trainingScheduleFormGroup.value.regularMondayFromControl !== "" ||
      this.trainingScheduleFormGroup.value.regularMondayToControl !== ""
    ) {
      this.regular.name = "Handball";
      if (
        this.trainingScheduleFormGroup.value.regularMondayFromControl !=
          "Rest" &&
        this.trainingScheduleFormGroup.value.regularMondayToControl != "Rest"
      ) {
        this.regular.mon =
          this.trainingScheduleFormGroup.value.regularMondayFromControl +
          " - " +
          this.trainingScheduleFormGroup.value.regularMondayToControl;
      } else {
        this.regular.mon = "Rest";
      }
    } else {
      this.regular.mon = null;
    }

    if (
      this.trainingScheduleFormGroup.value.regularTuesdayFromControl !== "" &&
      this.trainingScheduleFormGroup.value.regularTuesdayToControl !== ""
    ) {
      if (
        this.trainingScheduleFormGroup.value.regularTuesdayFromControl !==
          "Rest" &&
        this.trainingScheduleFormGroup.value.regularTuesdayToControl !== "Rest"
      ) {
        this.regular.tue =
          this.trainingScheduleFormGroup.value.regularTuesdayFromControl +
          " - " +
          this.trainingScheduleFormGroup.value.regularTuesdayToControl;
      } else {
        this.regular.tue = "Rest";
      }
    } else {
      this.regular.tue = null;
    }

    if (
      this.trainingScheduleFormGroup.value.regularWednesdayFromControl !== "" &&
      this.trainingScheduleFormGroup.value.regularWednesdayToControl !== ""
    ) {
      if (
        this.trainingScheduleFormGroup.value.regularWednesdayFromControl !==
          "Rest" &&
        this.trainingScheduleFormGroup.value.regularWednesdayToControl !==
          "Rest"
      ) {
        this.regular.wed =
          this.trainingScheduleFormGroup.value.regularWednesdayFromControl +
          " - " +
          this.trainingScheduleFormGroup.value.regularWednesdayToControl;
      } else {
        this.regular.wed = "Rest";
      }
    } else {
      this.regular.wed = null;
    }

    if (
      this.trainingScheduleFormGroup.value.regularThursdayFromControl !== "" &&
      this.trainingScheduleFormGroup.value.regularThursdayToControl !== ""
    ) {
      if (
        this.trainingScheduleFormGroup.value.regularThursdayFromControl !==
          "Rest" &&
        this.trainingScheduleFormGroup.value.regularThursdayToControl !== "Rest"
      ) {
        this.regular.thu =
          this.trainingScheduleFormGroup.value.regularThursdayFromControl +
          " - " +
          this.trainingScheduleFormGroup.value.regularThursdayToControl;
      } else {
        this.regular.thu = "Rest";
      }
    } else {
      this.regular.thu = null;
    }

    if (
      this.trainingScheduleFormGroup.value.regularFridayFromControl !== "" &&
      this.trainingScheduleFormGroup.value.regularFridayToControl !== ""
    ) {
      if (
        this.trainingScheduleFormGroup.value.regularFridayFromControl !==
          "Rest" &&
        this.trainingScheduleFormGroup.value.regularFridayToControl !== "Rest"
      ) {
        this.regular.fri =
          this.trainingScheduleFormGroup.value.regularFridayFromControl +
          " - " +
          this.trainingScheduleFormGroup.value.regularFridayToControl;
      } else {
        this.regular.fri = "Rest";
      }
    } else {
      this.regular.fri = null;
    }

    if (
      this.trainingScheduleFormGroup.value.regularSaturdayFromControl !== "" &&
      this.trainingScheduleFormGroup.value.regularSaturdayToControl !== ""
    ) {
      if (
        this.trainingScheduleFormGroup.value.regularSaturdayFromControl !==
          "Rest" &&
        this.trainingScheduleFormGroup.value.regularSaturdayToControl !== "Rest"
      ) {
        this.regular.sat =
          this.trainingScheduleFormGroup.value.regularSaturdayFromControl +
          " - " +
          this.trainingScheduleFormGroup.value.regularSaturdayToControl;
      } else {
        this.regular.sat = "Rest";
      }
    } else {
      this.regular.sat = null;
    }

    if (
      this.trainingScheduleFormGroup.value.regularSundayFromControl !== "" &&
      this.trainingScheduleFormGroup.value.regularSundayToControl !== ""
    ) {
      if (
        this.trainingScheduleFormGroup.value.regularSundayFromControl !==
          "Rest" &&
        this.trainingScheduleFormGroup.value.regularSundayToControl !== "Rest"
      ) {
        this.regular.sun =
          this.trainingScheduleFormGroup.value.regularSundayFromControl +
          " - " +
          this.trainingScheduleFormGroup.value.regularSundayToControl;
      } else {
        this.regular.sun = "Rest";
      }
    } else {
      this.regular.sun = null;
    }

    if (this.regular.name === "Handball") {
      this.club.trainingHoursList.push(this.regular);
    }

    // fitness training hours
    if (
      this.trainingScheduleFormGroup.value.fitnessMondayFromControl !== "" &&
      this.trainingScheduleFormGroup.value.fitnessMondayToControl !== ""
    ) {
      this.fitness.name = "Fitness training";
      if (
        this.trainingScheduleFormGroup.value.fitnessMondayFromControl !==
          "Rest" &&
        this.trainingScheduleFormGroup.value.fitnessMondayToControl !== "Rest"
      ) {
        this.fitness.mon =
          this.trainingScheduleFormGroup.value.fitnessMondayFromControl +
          " - " +
          this.trainingScheduleFormGroup.value.fitnessMondayToControl;
      } else {
        this.fitness.mon = "Rest";
      }
    } else {
      this.fitness.mon = null;
    }

    if (
      this.trainingScheduleFormGroup.value.fitnessTuesdayFromControl !== "" &&
      this.trainingScheduleFormGroup.value.fitnessTuesdayToControl !== ""
    ) {
      if (
        this.trainingScheduleFormGroup.value.fitnessTuesdayFromControl !==
          "Rest" &&
        this.trainingScheduleFormGroup.value.fitnessTuesdayToControl !== "Rest"
      ) {
        this.fitness.tue =
          this.trainingScheduleFormGroup.value.fitnessTuesdayFromControl +
          " - " +
          this.trainingScheduleFormGroup.value.fitnessTuesdayToControl;
      } else {
        this.fitness.tue = "Rest";
      }
    } else {
      this.fitness.tue = null;
    }

    if (
      this.trainingScheduleFormGroup.value.fitnessWednesdayFromControl !== "" &&
      this.trainingScheduleFormGroup.value.fitnessWednesdayToControl !== ""
    ) {
      if (
        this.trainingScheduleFormGroup.value.fitnessWednesdayFromControl !==
          "Rest" &&
        this.trainingScheduleFormGroup.value.fitnessWednesdayToControl !==
          "Rest"
      ) {
        this.fitness.wed =
          this.trainingScheduleFormGroup.value.fitnessWednesdayFromControl +
          " - " +
          this.trainingScheduleFormGroup.value.fitnessWednesdayToControl;
      } else {
        this.fitness.wed = "Rest";
      }
    } else {
      this.fitness.wed = null;
    }

    if (
      this.trainingScheduleFormGroup.value.fitnessThursdayFromControl !== "" &&
      this.trainingScheduleFormGroup.value.fitnessThursdayToControl !== ""
    ) {
      if (
        this.trainingScheduleFormGroup.value.fitnessThursdayFromControl !==
          "Rest" &&
        this.trainingScheduleFormGroup.value.fitnessThursdayToControl !== "Rest"
      ) {
        this.fitness.thu =
          this.trainingScheduleFormGroup.value.fitnessThursdayFromControl +
          " - " +
          this.trainingScheduleFormGroup.value.fitnessThursdayToControl;
      } else {
        this.fitness.thu = "Rest";
      }
    } else {
      this.fitness.thu = null;
    }

    if (
      this.trainingScheduleFormGroup.value.fitnessFridayFromControl !== "" &&
      this.trainingScheduleFormGroup.value.fitnessFridayToControl !== ""
    ) {
      if (
        this.trainingScheduleFormGroup.value.fitnessFridayFromControl !==
          "Rest" &&
        this.trainingScheduleFormGroup.value.fitnessFridayToControl !== "Rest"
      ) {
        this.fitness.fri =
          this.trainingScheduleFormGroup.value.fitnessFridayFromControl +
          " - " +
          this.trainingScheduleFormGroup.value.fitnessFridayToControl;
      } else {
        this.fitness.fri = "Rest";
      }
    } else {
      this.fitness.fri = null;
    }

    if (
      this.trainingScheduleFormGroup.value.fitnessSaturdayFromControl !== "" &&
      this.trainingScheduleFormGroup.value.fitnessSaturdayToControl !== ""
    ) {
      if (
        this.trainingScheduleFormGroup.value.fitnessSaturdayFromControl !==
          "Rest" &&
        this.trainingScheduleFormGroup.value.fitnessSaturdayToControl !== "Rest"
      ) {
        this.fitness.sat =
          this.trainingScheduleFormGroup.value.fitnessSaturdayFromControl +
          " - " +
          this.trainingScheduleFormGroup.value.fitnessSaturdayToControl;
      } else {
        this.fitness.sat = "Rest";
      }
    } else {
      this.fitness.sat = null;
    }

    if (
      this.trainingScheduleFormGroup.value.fitnessSundayFromControl !== "" &&
      this.trainingScheduleFormGroup.value.fitnessSundayToControl !== ""
    ) {
      if (
        this.trainingScheduleFormGroup.value.fitnessSundayFromControl !==
          "Rest" &&
        this.trainingScheduleFormGroup.value.fitnessSundayToControl !== "Rest"
      ) {
        this.fitness.sun =
          this.trainingScheduleFormGroup.value.fitnessSundayFromControl +
          " - " +
          this.trainingScheduleFormGroup.value.fitnessSundayToControl;
      } else {
        this.fitness.sun = "Rest";
      }
    } else {
      this.fitness.sun = null;
    }
    if (this.fitness.name === "Fitness training") {
      this.club.trainingHoursList.push(this.fitness);
    }

    // squad
    this.club.currentSquadPlayersList = this.dataSource;
    this.club.nextYearSquadPlayersList = this.nextYearSquadSource;
    // open positions
    if (this.goalkeeperOpen.checked) {
      this.club.openPositionList.push(this.goalkeeperOpen.value);
    }
    if (this.leftWingOpen.checked) {
      this.club.openPositionList.push(this.leftWingOpen.value);
    }
    if (this.leftBackOpen.checked) {
      this.club.openPositionList.push(this.leftBackOpen.value);
    }
    if (this.centreBackOpen.checked) {
      this.club.openPositionList.push(this.centreBackOpen.value);
    }
    if (this.pivotOpen.checked) {
      this.club.openPositionList.push(this.pivotOpen.value);
    }
    if (this.rightBackOpen.checked) {
      this.club.openPositionList.push(this.rightBackOpen.value);
    }
    if (this.rightWingOpen.checked) {
      this.club.openPositionList.push(this.rightWingOpen.value);
    }
    if (this.defenceOpen.checked) {
      this.club.openPositionList.push(this.defenceOpen.value);
    }

    // staff
    if (this.clubStaffFormGroup.value.trainerControl !== "") {
      this.club.trainer = this.clubStaffFormGroup.value.trainerControl;
    } else {
      this.club.trainer = null;
    }

    if (this.clubStaffFormGroup.value.assistantTrainerControl !== "") {
      this.club.assistantTrainer = this.clubStaffFormGroup.value.assistantTrainerControl;
    } else {
      this.club.assistantTrainer = null;
    }

    if (this.clubStaffFormGroup.value.physiotherapistControl !== "") {
      this.club.physiotherapist = this.clubStaffFormGroup.value.physiotherapistControl;
    } else {
      this.club.physiotherapist = null;
    }
    if (this.clubStaffFormGroup.value.assistantPhysiotherapistControl !== "") {
      this.club.assistantPhysiotherapist = this.clubStaffFormGroup.value.assistantPhysiotherapistControl;
    } else {
      this.club.assistantPhysiotherapist = null;
    }
    if (this.clubStaffFormGroup.value.managerControl !== "") {
      this.club.manager = this.clubStaffFormGroup.value.managerControl;
    } else {
      this.club.manager = null;
    }

    // files
    if (this.clubPicturesFormGroup.value.clubLogoControl !== "") {
      this.club.logo = this.clubPicturesFormGroup.value.clubLogoControl;
    } else {
      this.club.logo = null;
    }

    if (this.clubPicturesFormGroup.value.facilityPicturesControl !== "") {
      this.club.facilityPictures = this.clubPicturesFormGroup.value.facilityPicturesControl;
    } else {
      this.club.facilityPictures = null;
    }

    // values
    if (this.valuesAndPreferencesFormGroup.value.valuesControl !== "") {
      this.club.valueDescription = this.valuesAndPreferencesFormGroup.value.valuesControl;
    } else {
      this.club.valueDescription = null;
    }

    if (this.firstValue.checked) {
      this.club.valuesList.push(this.firstValue.value);
    }
    if (this.secondValue.checked) {
      this.club.valuesList.push(this.secondValue.value);
    }
    if (this.thirdValue.checked) {
      this.club.valuesList.push(this.thirdValue.value);
    }
    if (this.fourthValue.checked) {
      this.club.valuesList.push(this.fourthValue.value);
    }
    if (this.fifthValue.checked) {
      this.club.valuesList.push(this.fifthValue.value);
    }

    // preferences
    if (this.valuesAndPreferencesFormGroup.value.preferencesControl !== "") {
      this.club.preferenceDescription = this.valuesAndPreferencesFormGroup.value.preferencesControl;
    } else {
      this.club.preferenceDescription = null;
    }

    if (this.firstPreference.checked) {
      this.club.valuesList.push(this.firstPreference.value);
    }
    if (this.secondPreference.checked) {
      this.club.valuesList.push(this.secondPreference.value);
    }
    if (this.thirdPreference.checked) {
      this.club.valuesList.push(this.thirdPreference.value);
    }
    if (this.fourthPreference.checked) {
      this.club.valuesList.push(this.fourthPreference.value);
    }
    if (this.fifthPreference.checked) {
      this.club.valuesList.push(this.fifthPreference.value);
    }

    return this.club;
  }
}
