import { Component, OnInit, Input, ViewChild, TemplateRef } from "@angular/core";
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
import { Club } from "../../../models/club.model";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SquadPlayer } from "../../../models/squadPlayer.model";
import { TrainingHours } from "../../../models/trainingHours.model";
import { JobPosition } from "src/app/models/jobPosition";

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
  providers: [registerService]
})
export class RegisterClubComponent implements OnInit {
  @Input() modalRef: any;
  privacyPolicyModal: BsModalRef | null;
  club: Club = new Club();
  errorRegister: boolean = false;
  isLoading: boolean = false;
  existingEmail: boolean = false;
  hide = true; // password visibility
  clubRequiredInfoFormGroup: FormGroup;
  trainingScheduleFormGroup: FormGroup;
  clubSquadFormGroup: FormGroup;
  nextYearSquadFormGroup: FormGroup;
  openPositionsFormGroup: FormGroup;
  clubStaffFormGroup: FormGroup;
  clubRegister: FormGroup;
  valuesAndPreferencesFormGroup: FormGroup;

  // training hours
  regular: TrainingHours = new TrainingHours();
  fitness: TrainingHours = new TrainingHours();

  // open positions
  openPositionColumns: string[] = [
    "Position",
    "League",
    "Hand",
    "Height",
    "Age",
    "Season",
    "Contract",
    "Strengths"
  ];
  openPositionData: JobPosition[] = [];
  openPositionSource = this.openPositionData;
  @Input() openPositionName: string;
  @Input() openPositionLeague: string;
  @Input() openPositionHand: string;
  @Input() openPositionHeight: number;
  @Input() openPositionAge: number;
  @Input() openPositionSeason: string;
  @Input() openPositionContract: string;
  jobPosition: JobPosition = new JobPosition();
  // // 
  // <!-- Speedy, Athletic, Great shape, Quick shots, Accurate shooter, Tactical
  // , Teamplayer, Social, Win at all costs, Long range shooter. -->
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

  // Checkbox for privacy policy
  @ViewChild("privacyPolicy") privacyPolicy: MatCheckbox;
  privacyPolicyUnchecked: boolean = false;

  // values&preferences
  @ViewChild("hardWorking") hardWorking: MatCheckbox;
  @ViewChild("socialCohesion") socialCohesion: MatCheckbox;
  @ViewChild("winningMentality") winningMentality: MatCheckbox;
  @ViewChild("talentDevelopmentClub") talentDevelopmentClub: MatCheckbox;
  @ViewChild("strivesForTitles") strivesForTitles: MatCheckbox;
  @ViewChild("resultOriented") resultOriented: MatCheckbox;
  @ViewChild("processOriented") processOriented: MatCheckbox;

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
  emailControl = new FormControl("", [Validators.required, Validators.pattern(/.+@.+\..+/)]);
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
    private modalService: BsModalService
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
    this.openPositionsFormGroup = this._formBuilder.group({
      openPositionName: [""],
      openPositionLeague: [""],
      openPositionSeason: [""],
      openPositionContract: [""],
      openPositionMinAge: [""],
      openPositionMaxAge: [""],
      openPositionHeight: [""],
      openPositionHand: [""]
    });
    this.openPositionsFormGroup.get("openPositionSeason").setValue("Current year");
    this.clubStaffFormGroup = this._formBuilder.group({
      trainerControl: [""],
      assistantTrainerControl: [""],
      physiotherapistControl: [""],
      assistantPhysiotherapistControl: [""],
      managerControl: [""]
    });
    this.clubRegister = this._formBuilder.group({});
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
    }
  }

  onAddJobPosition() {
    if (this.openPositionsFormGroup.value.openPositionName !== "") {
      this.jobPosition = new JobPosition();
      if(this.openPositionsFormGroup.value.openPositionLeague !== "") {
        this.jobPosition.league = this.openPositionsFormGroup.value.openPositionLeague;
      } else {
        this.jobPosition.league = null;
      }
      if(this.openPositionsFormGroup.value.openPositionHand !== "") {
        this.jobPosition.preferredHand = this.openPositionsFormGroup.value.openPositionHand;
      } else {
        this.jobPosition.preferredHand = null;
      }
      this.jobPosition.height = this.openPositionsFormGroup.value.openPositionHeight;
      this.jobPosition.maxAge = this.openPositionsFormGroup.value.openPositionMaxAge;
      this.jobPosition.minAge = this.openPositionsFormGroup.value.openPositionMinAge;
      if(this.openPositionsFormGroup.value.openPositionSeason !== "") {
        this.jobPosition.season = this.openPositionsFormGroup.value.openPositionSeason;
      } else {
        this.jobPosition.season = null;
      }
      if(this.openPositionsFormGroup.value.openPositionContract !== "") {
        this.jobPosition.contractStatus = this.openPositionsFormGroup.value.openPositionContract;
      } else {
        this.jobPosition.contractStatus = null;
      }
      if(this.openPositionsFormGroup.value.openPositionName !== "") {
        this.jobPosition.position = this.openPositionsFormGroup.value.openPositionName;
      } else {
        this.jobPosition.position = null;
      }

      if (this.openPositionSpeedy.checked) {
        this.jobPosition.strengthsList.push(this.openPositionSpeedy.value);
        this.openPositionSpeedy.toggle();
      }
      if (this.openPositionAthletic.checked) {
        this.jobPosition.strengthsList.push(this.openPositionAthletic.value);
        this.openPositionAthletic.toggle();
      }
      if (this.openPositionGreatShape.checked) {
        this.jobPosition.strengthsList.push(this.openPositionGreatShape.value);
        this.openPositionGreatShape.toggle();
      }
      if (this.openPositionQuickShots.checked) {
        this.jobPosition.strengthsList.push(this.openPositionQuickShots.value);
        this.openPositionQuickShots.toggle();
      }
      if (this.openPositionAccurateShooter.checked) {
        this.jobPosition.strengthsList.push(this.openPositionAccurateShooter.value);
        this.openPositionAccurateShooter.toggle();
      }
      if (this.openPositionTactical.checked) {
        this.jobPosition.strengthsList.push(this.openPositionTactical.value);
        this.openPositionTactical.toggle();
      }
      if (this.openPositionTeamplayer.checked) {
        this.jobPosition.strengthsList.push(this.openPositionTeamplayer.value);
        this.openPositionTeamplayer.toggle();
      }
      if (this.openPositionSocial.checked) {
        this.jobPosition.strengthsList.push(this.openPositionSocial.value);
        this.openPositionSocial.toggle();
      }
      if (this.openPositionWinAtAllCosts.checked) {
        this.jobPosition.strengthsList.push(this.openPositionWinAtAllCosts.value);
        this.openPositionWinAtAllCosts.toggle();
      }
      if (this.openPositionLongRangeShooter.checked) {
        this.jobPosition.strengthsList.push(this.openPositionLongRangeShooter.value);
        this.openPositionLongRangeShooter.toggle();
      }

      this.openPositionSource.push(this.jobPosition); // add the new model object to the dataSource
      this.openPositionSource = [...this.openPositionSource]; // refresh the dataSource

      // reset input fields
      this.openPositionsFormGroup.get("openPositionLeague").setValue("");
      this.openPositionsFormGroup.get("openPositionHand").setValue("");
      this.openPositionsFormGroup.get("openPositionHeight").setValue("");
      this.openPositionsFormGroup.get("openPositionMaxAge").setValue("");
      this.openPositionsFormGroup.get("openPositionMinAge").setValue("");
      this.openPositionsFormGroup.get("openPositionSeason").setValue("Current year");
      this.openPositionsFormGroup.get("openPositionContract").setValue("");
      this.openPositionsFormGroup.get("openPositionName").setValue("");
    }
  }

  @ViewChild('stepper') stepper;
  checkIfEmailExists() {
    this.existingEmail = false;
    this.registerService.checkIfEmailExists(this.clubRequiredInfoFormGroup.get('email').value ).subscribe(
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

  registerClub() {
    this.privacyPolicyUnchecked = false;
    if (this.privacyPolicy.checked) {
      this.isLoading = true;
      this.registerService.registerClub(this.buildClub()).subscribe(
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
    if(
      this.trainingScheduleFormGroup.value.regularMondayFromControl !== "" ||
      this.trainingScheduleFormGroup.value.regularMondayToControl !== "" ||
      this.trainingScheduleFormGroup.value.regularTuesdayFromControl !== "" ||
      this.trainingScheduleFormGroup.value.regularTuesdayToControl !== "" ||
      this.trainingScheduleFormGroup.value.regularWednesdayFromControl !== "" ||
      this.trainingScheduleFormGroup.value.regularWednesdayToControl !== "" ||
      this.trainingScheduleFormGroup.value.regularThursdayFromControl !== "" ||
      this.trainingScheduleFormGroup.value.regularThursdayToControl !== "" ||
      this.trainingScheduleFormGroup.value.regularFridayFromControl !== "" ||
      this.trainingScheduleFormGroup.value.regularFridayToControl !== "" ||
      this.trainingScheduleFormGroup.value.regularSaturdayFromControl !== "" ||
      this.trainingScheduleFormGroup.value.regularSaturdayToControl !== "" ||
      this.trainingScheduleFormGroup.value.regularSundayFromControl !== "" ||
      this.trainingScheduleFormGroup.value.regularSundayToControl !== ""
    ) {

      if (
        this.trainingScheduleFormGroup.value.regularMondayFromControl !== "" ||
        this.trainingScheduleFormGroup.value.regularMondayToControl !== ""
      ) {
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
        this.trainingScheduleFormGroup.value.regularTuesdayFromControl !== "" ||
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
        this.trainingScheduleFormGroup.value.regularWednesdayFromControl !== "" ||
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
        this.trainingScheduleFormGroup.value.regularThursdayFromControl !== "" ||
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
        this.trainingScheduleFormGroup.value.regularFridayFromControl !== "" ||
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
        this.trainingScheduleFormGroup.value.regularSaturdayFromControl !== "" ||
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
        this.trainingScheduleFormGroup.value.regularSundayFromControl !== "" ||
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
    this.regular.name = "Handball";
    this.club.trainingHoursList.push(this.regular);
  }

    // fitness training hours
    if(this.trainingScheduleFormGroup.value.fitnessMondayFromControl !== "" ||
        this.trainingScheduleFormGroup.value.fitnessMondayToControl !== "" ||
        this.trainingScheduleFormGroup.value.fitnessTuesdayFromControl !== "" ||
        this.trainingScheduleFormGroup.value.fitnessTuesdayToControl !== "" || 
        this.trainingScheduleFormGroup.value.fitnessWednesdayFromControl !== "" ||
        this.trainingScheduleFormGroup.value.fitnessWednesdayToControl !== "" ||
        this.trainingScheduleFormGroup.value.fitnessThursdayFromControl !== "" ||
        this.trainingScheduleFormGroup.value.fitnessThursdayToControl !== "" ||
        this.trainingScheduleFormGroup.value.fitnessFridayFromControl !== "" ||
        this.trainingScheduleFormGroup.value.fitnessFridayToControl !== "" ||
        this.trainingScheduleFormGroup.value.fitnessSaturdayFromControl !== "" ||
        this.trainingScheduleFormGroup.value.fitnessSaturdayToControl !== "" || 
        this.trainingScheduleFormGroup.value.fitnessSundayFromControl !== "" ||
        this.trainingScheduleFormGroup.value.fitnessSundayToControl !== "") {
          if (
            this.trainingScheduleFormGroup.value.fitnessMondayFromControl !== "" ||
            this.trainingScheduleFormGroup.value.fitnessMondayToControl !== ""
          ) {
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
            this.trainingScheduleFormGroup.value.fitnessTuesdayFromControl !== "" ||
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
            this.trainingScheduleFormGroup.value.fitnessWednesdayFromControl !== "" ||
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
            this.trainingScheduleFormGroup.value.fitnessThursdayFromControl !== "" ||
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
            this.trainingScheduleFormGroup.value.fitnessFridayFromControl !== "" ||
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
            this.trainingScheduleFormGroup.value.fitnessSaturdayFromControl !== "" ||
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
            this.trainingScheduleFormGroup.value.fitnessSundayFromControl !== "" ||
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
      this.fitness.name = "Fitness training";
      this.club.trainingHoursList.push(this.fitness);
    }

    // squad
    this.club.currentSquadPlayersList = this.dataSource;
    this.club.nextYearSquadPlayersList = this.nextYearSquadSource;
    // open positions
    this.club.jobPositionsList = this.openPositionSource;
    if(this.club.jobPositionsList.length > 0) {
      this.club.isAvailable = true;
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

    // values
    if (this.valuesAndPreferencesFormGroup.value.valuesControl !== "") {
      this.club.valueDescription = this.valuesAndPreferencesFormGroup.value.valuesControl;
    } else {
      this.club.valueDescription = null;
    }

    if (this.hardWorking.checked) {
      this.club.valuesList.push(this.hardWorking.value);
    }
    if (this.socialCohesion.checked) {
      this.club.valuesList.push(this.socialCohesion.value);
    }
    if (this.winningMentality.checked) {
      this.club.valuesList.push(this.winningMentality.value);
    }

    // preferences
    if (this.valuesAndPreferencesFormGroup.value.preferencesControl !== "") {
      this.club.preferenceDescription = this.valuesAndPreferencesFormGroup.value.preferencesControl;
    } else {
      this.club.preferenceDescription = null;
    }

    if (this.talentDevelopmentClub.checked) {
      this.club.preferenceList.push(this.talentDevelopmentClub.value);
    }
    if (this.strivesForTitles.checked) {
      this.club.preferenceList.push(this.strivesForTitles.value);
    }
    if (this.resultOriented.checked) {
      this.club.preferenceList.push(this.resultOriented.value);
    }
    if (this.processOriented.checked) {
      this.club.preferenceList.push(this.processOriented.value);
    }

    return this.club;
  }
}
