import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Club } from "src/app/models/club.model";
import { loginService } from "src/app/services/loginService";
import { updateService } from "src/app/services/updateService";
import { deleteService } from "src/app/services/deleteService";
import { FileService } from "src/app/services/FileService";
import { SquadPlayer } from "src/app/models/squadPlayer.model";
import { TrainingHours } from "src/app/models/trainingHours.model";
import { JobPosition } from "src/app/models/jobPosition";
import { FormControl, Validators } from "@angular/forms";
import { MyErrorStateMatcher } from "src/app/front-page/front-page-image/register-player/register-player.component";
import { MatCheckbox, MatDialog, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import {
  ConfirmDialogModel,
  ConfirmationDialogComponent
} from "src/app/multi-page/confirmation-dialog/confirmation-dialog.component";
import { UpdateMessageComponent } from 'src/app/multi-page/update-message/update-message.component';

@Component({
  selector: "app-update-club",
  templateUrl: "./update-club.component.html",
  styleUrls: ["./update-club.component.css"]
})
export class UpdateClubComponent implements OnInit {
  clubBinding: Club;
  wrongPassword: boolean = false;
  clubLeague: string;
  clubCountry: string;
  facilityImages: string[] = [];
  regularHours = new TrainingHours();
  fitnessHours = new TrainingHours();

  snackBar: MatSnackBar;
  updateMessageComponent = new UpdateMessageComponent(this.snackBar);

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

  trainerCtrl = new FormControl("");
  assistantTrainerCtrl = new FormControl("");
  physiotherapistCtrl = new FormControl("");
  assistantPhysiotherapistCtrl = new FormControl("");
  managerCtrl = new FormControl("");

  step: number = 0;
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
  leagueList: string[] = ["First League", "Second League", "Third League"];
  countryList: string[] = ["Denmark", "Sweden", "Norway"];
  trainingHours: any[] = [
    { value: "Rest" },
    { value: "00:00" },
    { value: "00:15" },
    { value: "00:30" },
    { value: "00:45" },
    { value: "01:00" },
    { value: "01:15" },
    { value: "01:30" },
    { value: "01:45" },
    { value: "02:00" },
    { value: "02:15" },
    { value: "02:30" },
    { value: "02:45" },
    { value: "03:00" },
    { value: "03:15" },
    { value: "03:30" },
    { value: "03:45" },
    { value: "04:00" },
    { value: "04:15" },
    { value: "04:30" },
    { value: "04:45" },
    { value: "05:00" },
    { value: "05:15" },
    { value: "05:30" },
    { value: "05:45" },
    { value: "06:00" },
    { value: "06:15" },
    { value: "06:30" },
    { value: "06:45" },
    { value: "07:00" },
    { value: "07:15" },
    { value: "07:30" },
    { value: "07:45" },
    { value: "08:00" },
    { value: "08:15" },
    { value: "08:30" },
    { value: "08:45" },
    { value: "09:00" },
    { value: "09:15" },
    { value: "09:30" },
    { value: "09:45" },
    { value: "10:00" },
    { value: "10:15" },
    { value: "10:30" },
    { value: "10:45" },
    { value: "11:00" },
    { value: "11:15" },
    { value: "11:30" },
    { value: "11:45" },
    { value: "12:00" },
    { value: "12:15" },
    { value: "12:30" },
    { value: "12:45" },
    { value: "13:00" },
    { value: "13:15" },
    { value: "13:30" },
    { value: "13:45" },
    { value: "14:00" },
    { value: "14:15" },
    { value: "14:30" },
    { value: "14:45" },
    { value: "15:00" },
    { value: "15:15" },
    { value: "15:30" },
    { value: "15:45" },
    { value: "16:00" },
    { value: "16:15" },
    { value: "16:30" },
    { value: "16:45" },
    { value: "17:00" },
    { value: "17:15" },
    { value: "17:30" },
    { value: "17:45" },
    { value: "18:00" },
    { value: "18:15" },
    { value: "18:30" },
    { value: "18:45" },
    { value: "19:00" },
    { value: "19:15" },
    { value: "19:30" },
    { value: "19:45" },
    { value: "20:00" },
    { value: "20:15" },
    { value: "20:30" },
    { value: "20:45" },
    { value: "21:00" },
    { value: "21:15" },
    { value: "21:30" },
    { value: "21:45" },
    { value: "22:00" },
    { value: "22:15" },
    { value: "22:30" },
    { value: "22:45" },
    { value: "23:00" },
    { value: "23:15" },
    { value: "23:30" },
    { value: "23:45" }
  ];
  // validate inputs
  errorMessage = "";
  validate = new MyErrorStateMatcher();
  numbersOnlyRegex = /^[0-9]*$/;
  numbersOnlyControl = new FormControl(
    "",
    Validators.pattern(this.numbersOnlyRegex)
  );
  currentPassword = new FormControl("", [Validators.minLength(6)]);

  password = new FormControl("", [Validators.minLength(6)]);

  @ViewChild("isLooking") private isLooking: MatCheckbox;

  name = new FormControl("", Validators.required);
  league = new FormControl("", Validators.required);
  streetAddress = new FormControl("", Validators.required);
  streetNumber = new FormControl("", [
    Validators.required,
    Validators.pattern(this.numbersOnlyRegex)
  ]);
  country = new FormControl("", Validators.required);
  city = new FormControl("", Validators.required);
  zipcode = new FormControl("", [
    Validators.required,
    Validators.pattern(this.numbersOnlyRegex)
  ]);
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

  // squad table
  displayedColumns: string[] = ["shirtNumber", "name", "position", "delete"];
  elementData: SquadPlayer[] = [];
  dataSource = this.elementData;
  @Input() squadPlayerName: string;
  @Input() squadPlayerPosition: string;
  @Input() squadPlayerShirtNumber: number;
  // @Input() SquadPlayerDelete: any;
  squadPlayer = new SquadPlayer();

  // next year squad table
  nextYearSquadColumns: string[] = [
    "shirtNumber",
    "name",
    "position",
    "delete"
  ];
  nextYearSquadData: SquadPlayer[] = [];
  nextYearSquadSource = this.nextYearSquadData;
  @Input() nextYearPlayerName: string;
  @Input() nextYearPlayerPosition: string;
  @Input() nextYearPlayerShirtNumber: number;
  nextYearSquadPlayer = new SquadPlayer();

  // open positions table
  openPositionColumns: string[] = [
    "position",
    "league",
    "hand",
    "height",
    "age",
    "season",
    "contract",
    "strengths",
    "actions"
  ];
  openPositionData: JobPosition[] = [];
  openPositionSource = this.openPositionData;
  openPosition = new JobPosition();
  // open position strengths
  @ViewChild("openPositionSpeedy") openPositionSpeedy: MatCheckbox;
  @ViewChild("openPositionAthletic") openPositionAthletic: MatCheckbox;
  @ViewChild("openPositionGreatShape") openPositionGreatShape: MatCheckbox;
  @ViewChild("openPositionQuickShots") openPositionQuickShots: MatCheckbox;
  @ViewChild("openPositionAccurateShooter")
  openPositionAccurateShooter: MatCheckbox;
  @ViewChild("openPositionTactical") openPositionTactical: MatCheckbox;
  @ViewChild("openPositionTeamplayer") openPositionTeamplayer: MatCheckbox;
  @ViewChild("openPositionSocial") openPositionSocial: MatCheckbox;
  @ViewChild("openPositionWinAtAllCosts")
  openPositionWinAtAllCosts: MatCheckbox;
  @ViewChild("openPositionLongRangeShooter")
  openPositionLongRangeShooter: MatCheckbox;

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
    private fileService: FileService,
    private deleteService: deleteService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.clubBinding = this.loginService.clubInSession;
    this.clubLeague = this.clubBinding.league;
    this.clubCountry = this.clubBinding.country;
    if (this.clubBinding.isAvailable) {
      this.isLooking.checked = true;
    } else {
      this.isLooking.checked = false;
    }
    this.clubBinding.trainingHoursList.forEach(element => {
      if (element.name == "Handball") {
        this.buildRegularHours(element);
      } else if (element.name == "Fitness training") {
        this.buildFitnessHours(element);
      }
    });
    if (this.clubBinding.currentSquadPlayersList.length > 0) {
      this.clubBinding.currentSquadPlayersList.forEach(element => {
        this.dataSource.push(element); //add the new model object to the dataSource
        this.dataSource = [...this.dataSource]; //refresh the dataSource
      });
    }
    if (this.clubBinding.nextYearSquadPlayersList.length > 0) {
      this.clubBinding.nextYearSquadPlayersList.forEach(element => {
        this.nextYearSquadSource.push(element); //add the new model object to the dataSource
        this.nextYearSquadSource = [...this.nextYearSquadSource]; //refresh the dataSource
      });
    }
    if (this.clubBinding.jobPositionsList.length > 0) {
      this.clubBinding.jobPositionsList.forEach(element => {
        this.openPositionSource.push(element);
        this.openPositionSource = [...this.openPositionSource];
      });
    }
    if (this.clubBinding.preferenceList.length > 0) {
      this.markPreferenceCheckboxes(this.clubBinding.preferenceList);
    }
    if (this.clubBinding.valuesList.length > 0) {
      this.markValueCheckboxes(this.clubBinding.valuesList);
    }

    this.setClubInfo();
    this.setClubStaff();
    this.setClubValuesAndPreferences();
  }

  updateMessage(message: string, action: string) {
    this.updateMessageComponent.openSnackBar(message, action);
  }

  setClubInfo() {
    this.name.setValue(this.clubBinding.name);
    this.league.setValue(this.clubBinding.league);
    this.streetAddress.setValue(this.clubBinding.streetAddress);
    this.streetNumber.setValue(this.clubBinding.streetNumber);
    this.country.setValue(this.clubBinding.country);
    this.city.setValue(this.clubBinding.city);
    this.zipcode.setValue(this.clubBinding.zipcode);
  }

  setClubStaff() {
    
    this.trainerCtrl.setValue(this.clubBinding.trainer == "Not specified" ? null : this.clubBinding.trainer);
    this.assistantTrainerCtrl.setValue(this.clubBinding.assistantTrainer == "Not specified" ? null : this.clubBinding.assistantTrainer);
    this.physiotherapistCtrl.setValue(this.clubBinding.physiotherapist == "Not specified" ? null : this.clubBinding.physiotherapist);
    this.assistantPhysiotherapistCtrl.setValue(this.clubBinding.assistantPhysiotherapist == "Not specified" ? null : this.clubBinding.assistantPhysiotherapist);
    this.managerCtrl.setValue(this.clubBinding.manager == "Not specified" ? null : this.clubBinding.manager);
  }

  setClubValuesAndPreferences() {
    this.valueDescription.setValue(this.clubBinding.valueDescription == "Not specified" ? null : this.clubBinding.valueDescription);
    this.preferenceDescription.setValue(this.clubBinding.preferenceDescription == "Not specified" ? null : this.clubBinding.preferenceDescription);
  }

  // Add player to the squad player table for current season
  onAddPlayerToCurrentYearSquad() {
    if (
      this.squadPlayerNameCtrl.value !== "" &&
      this.squadPlayerPositionCtrl.value !== "" &&
      this.squadPlayerShirtNumberCtrl.value !== "" &&
      Number(this.squadPlayerShirtNumberCtrl.value)
    ) {
      this.addClubCurrentSeasonSquadPlayer();
    }
  }

  // Delete player from squad player table for current season
  deletePlayerFromCurrentYearSquad(squadPlayer: SquadPlayer) {
    this.dataSource.forEach((sp, index) => {
      if (sp === squadPlayer) {
        this.dataSource.splice(index, 1);
      }
    });
    this.dataSource = [...this.dataSource]; //refresh the dataSource
    this.clubBinding.currentSquadPlayersList = this.dataSource;
  }

  // Add player to the squad player table for next season
  onAddPlayerToNextYearSquad() {

    if (
      this.squadPlayerNameCtrlNext.value !== "" &&
      this.squadPlayerPositionCtrlNext.value !== "" &&
      this.squadPlayerShirtNumberCtrlNext.value !== "" &&
      Number(this.squadPlayerShirtNumberCtrlNext.value)
    ) {
      this.addClubNextSeasonSquadPlayer();
    }
  }

  // Delete player from squad player table for current season
  deletePlayerFromNextYearSquad(squadPlayer: SquadPlayer) {
    this.nextYearSquadSource.forEach((sp, index) => {
      if (sp === squadPlayer) {
        this.nextYearSquadSource.splice(index, 1);
      }
    });
    this.nextYearSquadSource = [...this.nextYearSquadSource]; //refresh the dataSource
    this.clubBinding.nextYearSquadPlayersList = this.nextYearSquadSource; //refresh the clubBinding
  }

  onAddJobPosition() {
    if (this.openPositionName.value !== "")
    {
      this.addClubOpenPosition();
    }
    
  }

  deleteOpenPosition(jobPosition: JobPosition) {
    this.openPositionSource.forEach((jp, index) => {
      if (jp === jobPosition) {
        this.openPositionSource.splice(index, 1);
      }
    });
    this.openPositionSource = [...this.openPositionSource]; // refresh the dataSource
    this.clubBinding.jobPositionsList = this.openPositionSource; //refresh the clubBinding
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
    } else {
      this.fileService.uploadFile(files).subscribe(res => {
        this.fileService.createPath(JSON.stringify(res.body), "image");
        if (type === "profile") {
          //Delete former image file from filesystem
          this.deleteFile(this.clubBinding.imagePath);
          this.clubBinding.imagePath = this.fileService.imagePath;
          // Update new club profile
          this.updateClubProfile(); 
        }
        if (type === "facility") {
          if (this.clubBinding.facilityImagesList != null) {
            this.facilityImages = this.clubBinding.facilityImagesList;
          }
        this.facilityImages.push(this.fileService.imagePath);
        this.clubBinding.facilityImagesList = this.facilityImages;
        // Update club facility
        this.updateClubFacility();
        }
      },
      error => {

      });;
    }
  };

  deleteFile(filename: string) {
    // Delete former image from filesystem 
    this.fileService.deleteFile(filename).subscribe(
      (succes: any) => {
  
      },
      error => {

      });
  }

  updateClubInfo() {
    this.updateService.updateClubInfo(this.buildClubInfo()).subscribe(
      (succes: any) => {

        this.overWriteClubInfo();

      },
      error => {
        
      });
  }

  updatePassword() {

    if(this.currentPassword.value === this.password.value) {
      this.updateService.updateClubPassword(this.buildPassword()).subscribe(
        (succes: any) => {
  
        },
        error => {
          
        });
    }
  }

  overWriteClubInfo() {
    if(this.isLooking.checked == true) {
      this.clubBinding.isAvailable = true;
    }
    else {
      this.clubBinding.isAvailable = false;
    }
    this.clubBinding.league = this.league.value == "" ? this.clubBinding.league : this.league.value;
    this.clubBinding.name = this.name.value  == "" ? this.clubBinding.name : this.name.value;
    this.clubBinding.streetAddress = this.streetAddress.value  == "" ? this.clubBinding.streetAddress : this.streetAddress.value;
    this.clubBinding.streetNumber = this.streetNumber.value  == "" ? this.clubBinding.streetNumber : this.streetNumber.value;
    this.clubBinding.country = this.country.value  == "" ? this.clubBinding.country : this.country.value;
    this.clubBinding.city = this.city.value  == "" ? this.clubBinding.city : this.city.value;
    this.clubBinding.zipcode = this.zipcode.value  == "" ? this.clubBinding.zipcode : this.zipcode.value;
  }

  updateClubRegularTrainingSchedule() {
    this.updateService.updateTrainingSchedule(this.buildRegularTrainingHours()).subscribe(
      (succes: any) => {
        
        this.clubBinding.trainingHoursList.forEach( (elm, index) => {
          if(elm.name == 'Handball') {
            this.clubBinding.trainingHoursList.splice(index, 1);
          } 
        });
        
        this.clubBinding.trainingHoursList.push(this.regularHours);
      },
      error => {

      });
  }

  deleteClubFacilityImage(imagePath: string) {
    // Delete facility image from filesystem
    this.fileService.deleteFile(imagePath).subscribe(
      (succes: any) => {
        //Delete facility image from DB
        this.deleteFacilityImage(imagePath);
      },
      error => {

      });
  }

  deleteFacilityImage(imagePath: string) {
    this.deleteService.deleteFacilityImage(imagePath).subscribe(
      (succes: any) => {
        this.deleteFacilityImageFromList(imagePath);
      },
      error => {}
    );
  }

  deleteFacilityImageFromList(imagePath: string) {
    this.clubBinding.facilityImagesList.forEach( (elm, index) => {
      if(elm === imagePath ) {
        this.clubBinding.facilityImagesList.splice(index, 1);
      } 
      this.clubBinding.facilityImagesList = [...this.clubBinding.facilityImagesList];
    });
  }

  updateClubFitnessTrainingSchedule() {
    this.updateService.updateTrainingSchedule(this.buildFitnessTrainingHours()).subscribe(
      (succes: any) => {
        this.clubBinding.trainingHoursList.forEach( (elm, index) => {
          if(elm.name == 'Fitness training') {
            this.clubBinding.trainingHoursList.splice(index, 1);
          } 
        });
        
        this.clubBinding.trainingHoursList.push(this.fitnessHours);
        
      },
      error => {

      });;
  }
  
  updateClubStaff() {
    this.updateService.updateClubStaff(this.buildClubStaff()).subscribe(
      (succes: any) => {
        this.overWriteClubStaff();
      },
      error => {
        
      });;
  }
  
  overWriteClubStaff() {
    this.clubBinding.trainer = this.trainerCtrl.value == "" ? null : this.trainerCtrl.value;
    this.clubBinding.assistantTrainer = this.assistantTrainerCtrl.value == "" ? null : this.assistantTrainerCtrl.value;
    this.clubBinding.physiotherapist = this.physiotherapistCtrl.value == "" ? null : this.physiotherapistCtrl.value;
    this.clubBinding.assistantPhysiotherapist = this.assistantPhysiotherapistCtrl.value == "" ? null : this.assistantPhysiotherapistCtrl.value;
    this.clubBinding.manager = this.managerCtrl.value == "" ? null : this.managerCtrl.value;
  }
  
  updateValuesAndPreferences() {
    this.updateService.updateClubValuesAndPreferences(this.buildClubValuesAndPreferences()).subscribe(
      (succes: any) => {
        this.overWriteValuesAndPrefs();
      },
      error => {

      });;
  }

  overWriteValuesAndPrefs() {

    //Reset clubBinding values and prefs lists
    this.clubBinding.valuesList = [];
    this.clubBinding.preferenceList = [];

    // values
    if (this.hardWorking.checked) {
      this.clubBinding.valuesList.push(this.hardWorking.value);
    }
    if (this.socialCohesion.checked) {
      this.clubBinding.valuesList.push(this.socialCohesion.value);
    }
    if (this.winningMentality.checked) {
      this.clubBinding.valuesList.push(this.winningMentality.value);
    }

    // preferences
    if (this.talentDevelopmentClub.checked) {
      this.clubBinding.preferenceList.push(this.talentDevelopmentClub.value);
    }
    if (this.strivesForTitles.checked) {
      this.clubBinding.preferenceList.push(this.strivesForTitles.value);
    }
    if (this.resultOriented.checked) {
      this.clubBinding.preferenceList.push(this.resultOriented.value);
    }
    if (this.processOriented.checked) {
      this.clubBinding.preferenceList.push(this.processOriented.value);
    }

    // value description
    this.clubBinding.valueDescription = this.valueDescription.value;

    // preference description
    this.clubBinding.preferenceDescription = this.preferenceDescription.value;
  }

  updateClubProfile() {
    this.updateService.updateClubProfile(this.buildClubProfile()).subscribe(
      (succes: any) => {      
      },
      error => {
        // Delete image from filesystem
      });;
  }

  updateClubFacility() {
    this.updateService.updateClubFacility(this.buildClubFacility()).subscribe(
      (succes: any) => {
        
      },
      error => {
        // Delete from filesystem
      });;
  }

  addClubCurrentSeasonSquadPlayer() {
    this.updateService
      .addClubSquadPlayer(this.buildCurrentSquadplayer())
      .subscribe(
        (succes: any) => {
          this.updateCurrentSquadplayerList();
          let message = 'Added squadplayer to current squad!';
          this.updateMessage(message, 'OK');
          console.log(this.dataSource);
        },
        error => {}
      );
  }

  addClubNextSeasonSquadPlayer() {
    this.updateService
      .addClubSquadPlayer(this.buildNextSquadplayer())
      .subscribe(
        (succes: any) => {
          this.updateNextSquadplayerList();
        },
        error => {}
      );
  }

  addClubOpenPosition() {
    this.updateService.addClubOpenPosition(this.buildJobPosition()).subscribe(
      (succes: any) => {
        this.updateOpenPositionList();
      },
      error => {}
    );
  }

  deleteClubRegularTrainingSchedule() {
    
    this.deleteService.deleteTrainingHours("Handball").subscribe(
      (succes: any) => {
        this.deleteTraininghours();
        this.resetRegularHoursFields();
      },
      error => {

      });
  }

  deleteClubFitnessTrainingSchedule() {
    this.deleteService.deleteTrainingHours("Fitness training").subscribe(
      (succes:any) => {      
        this.deleteTraininghours();
        this.resetFitnessHoursFields();
      },
      error => {}
    );
  }

  deleteClubCurrentSquadPlayer(squadPlayer: SquadPlayer) {
    this.deleteService.deleteSquadPlayer(squadPlayer.id).subscribe(
      (succes: any) => {
        this.deletePlayerFromCurrentYearSquad(squadPlayer);
      },
      error => {}
    );
  }

  deleteClubNextYearSquadPlayer(squadPlayer: SquadPlayer) {
    this.deleteService.deleteSquadPlayer(squadPlayer.id).subscribe(
      (succes: any) => {
        this.deletePlayerFromNextYearSquad(squadPlayer);
      },
      error => {}
    );
  }

  deleteClubOpenPosition(jobPosition: JobPosition) {
    this.deleteService.deleteOpenPosition(jobPosition.id).subscribe(
      (succes: any) => {
        this.deleteOpenPosition(jobPosition);
      },
      error => {}
    );
  }

  deleteClub() {
    const message = `Are you sure you want to delete your profile?`;

    const dialogData = new ConfirmDialogModel("Confirmation", message);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      minWidth: "400px",
      maxWidth: "401px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.deleteService.deleteClub().subscribe(
          (succes: any) => {
            this.loginService.logout();
            this.router.navigate(["/"]);
          },
          error => {}
        );
      }
    });
  }

  deleteClubProfile() {
    // Delete image from filesystem 
    this.fileService.deleteFile(this.clubBinding.imagePath).subscribe(
      (succes: any) => {
        this.clubBinding.imagePath = "https:\\localhost:44310\\Resources\\Files\\club-icon.png";
        //Update club imagePath in DB to default image
        this.updateClubProfile();
      },
      error => {

      });
  }

  deleteClubValuesAndPreferences() {
    // Delete club values and preferences
    this.deleteService.deleteValuesAndPreferences().subscribe(
      (succes: any) => {
        // Insert new club values and preferences
        this.updateValuesAndPreferences();
      },
      error => {}
    );
  }

  markPreferenceCheckboxes(preferenceList: any) {
    preferenceList.forEach(element => {
      if (element == "Talent development club") {
        this.talentDevelopmentClub.checked = true;
      } else if (element == "Strives for titles") {
        this.strivesForTitles.checked = true;
      } else if (element == "Result oriented") {
        this.resultOriented.checked = true;
      } else {
        this.processOriented.checked = true;
      }
    });
  }

  markValueCheckboxes(valuesList: any) {
    valuesList.forEach(element => {
      if (element == "Hard working") {
        this.hardWorking.checked = true;
      } else if (element == "Social cohesion") {
        this.socialCohesion.checked = true;
      } else {
        this.winningMentality.checked = true;
      }
    });
  }

  buildClubProfile() {
    var club = new Club();
    club.imagePath = this.clubBinding.imagePath;
    return club;
  }

  buildClubProfileWithDefault() {
    var club = new Club();
    club.imagePath = "https:\\localhost:44310\\Resources\\Files\\club-icon.png";
    return club;
  }

  buildClubFacility() {
    var club = new Club();
    club.facilityImagesList = this.clubBinding.facilityImagesList;
    return club;
  }

  // Helping method used to build staff
  buildClubStaff() {
    var club = new Club();
    club.trainer = this.trainerCtrl.value == "" ? null : this.trainerCtrl.value;
    club.assistantTrainer = this.assistantTrainerCtrl.value == "" ? null : this.assistantTrainerCtrl.value;
    club.physiotherapist = this.physiotherapistCtrl.value == "" ? null : this.physiotherapistCtrl.value;
    club.assistantPhysiotherapist = this.assistantPhysiotherapistCtrl.value == "" ? 
      null : this.assistantPhysiotherapistCtrl.value;
    club.manager = this.managerCtrl.value == "" ? null : this.managerCtrl.value;
    return club;
  }

  // Helping method used to build values and preferences
  buildClubValuesAndPreferences() {
    let club = new Club();

    // values
    if (this.hardWorking.checked) {
      club.valuesList.push(this.hardWorking.value);
    }
    if (this.socialCohesion.checked) {
      club.valuesList.push(this.socialCohesion.value);
    }
    if (this.winningMentality.checked) {
      club.valuesList.push(this.winningMentality.value);
    }

    // preferences
    if (this.talentDevelopmentClub.checked) {
      club.preferenceList.push(this.talentDevelopmentClub.value);
    }
    if (this.strivesForTitles.checked) {
      club.preferenceList.push(this.strivesForTitles.value);
    }
    if (this.resultOriented.checked) {
      club.preferenceList.push(this.resultOriented.value);
    }
    if (this.processOriented.checked) {
      club.preferenceList.push(this.processOriented.value);
    }

    // value description
    club.valueDescription = this.valueDescription.value == "" ? null : this.valueDescription.value;

    // preference description
    club.preferenceDescription = this.preferenceDescription.value == "" ? null : this.preferenceDescription.value;

    return club;
  }

  // Helping method used to build current season squadplayer
  buildCurrentSquadplayer() {
    this.squadPlayer = new SquadPlayer();
    this.squadPlayer.season = "Current year";
    this.squadPlayer.name = this.squadPlayerNameCtrl.value;
    this.squadPlayer.position = this.squadPlayerPositionCtrl.value;
    this.squadPlayer.shirtNumber = this.squadPlayerShirtNumberCtrl.value;

    return this.squadPlayer;
  }

  // Helping method used to update current squadplayers
  updateNextSquadplayerList() {
    
    this.getNextSquadplayer();

    // reset input fields
    this.squadPlayerNameCtrlNext.setValue("");
    this.squadPlayerPositionCtrlNext.setValue("");
    this.squadPlayerShirtNumberCtrlNext.setValue("");
    this.clubBinding.nextYearSquadPlayersList = this.nextYearSquadSource; //Overwrite clubBinding jobPosition list
  }

  getNextSquadplayer() {
    this.updateService.getNextSquadplayer().subscribe(
      (succes: any) => {
        this.nextYearSquadSource = succes; //refresh the dataSource
        this.clubBinding.nextYearSquadPlayersList = this.nextYearSquadSource; //refresh the clubBinding
      },
      error => {}
    );
  }

  getCurrentSquadplayer() {
    this.updateService.getCurrentSquadplayer().subscribe(
      (succes: any) => {
        this.dataSource = succes; //refresh the dataSource
        this.clubBinding.currentSquadPlayersList = this.dataSource; //refresh the clubBinding
      },
      error => {}
    );
  }

  // Helping method used to build current season squadplayer
  buildNextSquadplayer() {
    this.nextYearSquadPlayer = new SquadPlayer();
    this.nextYearSquadPlayer.season = "Next year";
    this.nextYearSquadPlayer.name = this.squadPlayerNameCtrlNext.value;
    this.nextYearSquadPlayer.position = this.squadPlayerPositionCtrlNext.value;
    this.nextYearSquadPlayer.shirtNumber = this.squadPlayerShirtNumberCtrlNext.value;

    return this.nextYearSquadPlayer;
  }

  // Helping method used to update next squadplayers
  updateCurrentSquadplayerList() {
    this.getCurrentSquadplayer();

    // reset input fields
    this.squadPlayerNameCtrl.setValue("");
    this.squadPlayerPositionCtrl.setValue("");
    this.squadPlayerShirtNumberCtrl.setValue("");
  }

  deleteTraininghours() {
    this.clubBinding.trainingHoursList.forEach( (elm, index) => {
      if(elm.name == 'Handball') {
        this.clubBinding.trainingHoursList.splice(index, 1);
      } else if(elm.name == 'Fitness training') {
        this.clubBinding.trainingHoursList.splice(index, 1);
      }
      this.clubBinding.trainingHoursList = [...this.clubBinding.trainingHoursList];
    });
  }

  buildClubInfo() {
    var club = new Club();
    club.email = this.clubBinding.email;
    club.zipcodeCity_ID = this.clubBinding.zipcodeCity_ID;
    club.password = this.currentPassword.value == "" ? null : this.currentPassword.value;
    club.isAvailable = this.isLooking.checked;
    club.newPassword = this.password.value == "" ? null : this.password.value;
    club.name = this.name.value == "" ? this.clubBinding.league : this.name.value;
    club.league = this.league.value == "" ? this.clubBinding.league : this.league.value;
    club.streetAddress = this.streetAddress.value == "" ? this.clubBinding.streetAddress : this.streetAddress.value;
    club.streetNumber = this.streetNumber.value == "" ? this.clubBinding.streetNumber : this.streetNumber.value;
    club.country = this.country.value == "" ? this.clubBinding.country : this.country.value;
    club.city = this.city.value == "" ? this.clubBinding.city : this.city.value;
    club.zipcode = this.zipcode.value == "" ? this.clubBinding.zipcode : this.zipcode.value;
    return club;
  }


  buildPassword() {
    var club = new Club();
    club.password = this.currentPassword.value == "" ? null : this.currentPassword.value;
    club.newPassword = this.password.value == "" ? null : this.password.value;
    return club;
  }

  buildJobPosition() {
    this.openPosition = new JobPosition();

    this.openPosition.position = this.openPositionName.value;
    this.openPosition.league = this.openPositionLeague.value == "" ? null : this.openPositionLeague.value;
    this.openPosition.preferredHand = this.openPositionHand.value !== "" ? null : this.openPositionHand.value;
    this.openPosition.height = this.openPositionHeight.value;
    this.openPosition.maxAge = this.openPositionMaxAge.value;
    this.openPosition.minAge = this.openPositionMinAge.value;
    this.openPosition.season = this.openPositionSeason.value == "" ? null : this.openPositionSeason.value;
    this.openPosition.contractStatus = this.openPositionContract.value == "" ? null : this.openPositionContract.value;
    
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
      this.openPosition.strengthsList.push(
        this.openPositionAccurateShooter.value
      );
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
      this.openPosition.strengthsList.push(
        this.openPositionWinAtAllCosts.value
      );
      this.openPositionWinAtAllCosts.toggle();
    }
    if (this.openPositionLongRangeShooter.checked) {
      this.openPosition.strengthsList.push(
        this.openPositionLongRangeShooter.value
      );
      this.openPositionLongRangeShooter.toggle();
    }
    return this.openPosition;
  }

  // Helping method used to display current regular traininghours
  buildRegularHours(element: any) {
    this.regularMonFrom.setValue((element.mon == null ? element.mon : element.mon.slice(0, 5)));
    this.regularMonTo.setValue(element.mon == null ? element.mon : element.mon.slice(8, 13));
    this.regularTueFrom.setValue(element.tue == null ? element.tue : element.tue.slice(0, 5));
    this.regularTueTo.setValue(element.tue == null ? element.tue : element.tue.slice(8, 13));
    this.regularWedFrom.setValue(element.wed == null ? element.wed : element.wed.slice(0, 5));
    this.regularWedTo.setValue(element.wed == null ? element.wed : element.wed.slice(8, 13));
    this.regularThuFrom.setValue(element.thu == null ? element.thu : element.thu.slice(0, 5));
    this.regularThuTo.setValue(element.thu == null ? element.thu : element.thu.slice(8, 13));
    this.regularFriFrom.setValue(element.fri == null ? element.fri : element.fri.slice(0, 5));
    this.regularFriTo.setValue(element.fri == null ? element.fri : element.fri.slice(8, 13));
    this.regularSatFrom.setValue(element.sat == null ? element.sat : element.sat.slice(0, 5));
    this.regularSatTo.setValue(element.sat == null ? element.sat : element.sat.slice(8, 13));
    this.regularSunFrom.setValue(element.sun == null ? element.sun : element.sun.slice(0, 5));
    this.regularSunTo.setValue(element.sun == null ? element.sun : element.sun.slice(8, 13));
  }

  resetRegularHoursFields() {
    this.regularMonFrom.setValue("");
    this.regularMonTo.setValue("");
    this.regularTueFrom.setValue("");
    this.regularTueTo.setValue("");
    this.regularWedFrom.setValue("");
    this.regularWedTo.setValue("");
    this.regularThuFrom.setValue("");
    this.regularThuTo.setValue("");
    this.regularFriFrom.setValue("");
    this.regularFriTo.setValue("");
    this.regularSatFrom.setValue("");
    this.regularSatTo.setValue("");
    this.regularSunFrom.setValue("");
    this.regularSunTo.setValue("");
  }

  // Helping method used to split up fitness traininghours into from and to
  buildFitnessHours(element: any) {
    this.fitnessMonFrom.setValue(element.mon == null ? element.mon : element.mon.slice(0, 5));
    this.fitnessMonTo.setValue(element.mon == null ? element.mon : element.mon.slice(8, 13));
    this.fitnessTueFrom.setValue(element.tue == null ? element.tue : element.tue.slice(0, 5));
    this.fitnessTueTo.setValue(element.tue == null ? element.tue : element.tue.slice(8, 13));
    this.fitnessWedFrom.setValue(element.wed == null ? element.wed : element.wed.slice(0, 5));
    this.fitnessWedTo.setValue(element.wed == null ? element.wed : element.wed.slice(8, 13));
    this.fitnessThuFrom.setValue(element.thu == null ? element.thu : element.thu.slice(0, 5));
    this.fitnessThuTo.setValue(element.thu == null ? element.thu : element.thu.slice(8, 13));
    this.fitnessFriFrom.setValue(element.fri == null ? element.fri : element.fri.slice(0, 5));
    this.fitnessFriTo.setValue(element.fri == null ? element.fri : element.fri.slice(8, 13));
    this.fitnessSatFrom.setValue(element.sat == null ? element.sat : element.sat.slice(0, 5));
    this.fitnessSatTo.setValue(element.sat == null ? element.sat : element.sat.slice(8, 13));
    this.fitnessSunFrom.setValue(element.sun == null ? element.sun : element.sun.slice(0, 5));
    this.fitnessSunTo.setValue(element.sun == null ? element.sun : element.sun.slice(8, 13));
  }

  resetFitnessHoursFields() {
    this.fitnessMonFrom.setValue("");
    this.fitnessMonTo.setValue("");
    this.fitnessTueFrom.setValue("");
    this.fitnessTueTo.setValue("");
    this.fitnessWedFrom.setValue("");
    this.fitnessWedTo.setValue("");
    this.fitnessThuFrom.setValue("");
    this.fitnessThuTo.setValue("");
    this.fitnessFriFrom.setValue("");
    this.fitnessFriTo.setValue("");
    this.fitnessSatFrom.setValue("");
    this.fitnessSatTo.setValue("");
    this.fitnessSunFrom.setValue("");
    this.fitnessSunTo.setValue("");
  }

  buildRegularTrainingHours() {
    this.regularHours.name = "Handball";

    if(this.regularMonFrom.value == null  ||  this.regularMonTo.value == null) {
      this.regularHours.mon = null;
    }
    else if(this.regularMonFrom.value == ""  ||  this.regularMonTo.value == "") {
      this.regularHours.mon = null;
    }
    else if (this.regularMonFrom.value == "Rest" && this.regularMonTo.value == "Rest") {
        this.regularHours.mon = "Rest";
    }
    else {
        this.regularHours.mon = this.regularMonFrom.value + " - " + this.regularMonTo.value;
    }

    if(this.regularTueFrom.value == null  ||  this.regularTueTo.value == null) {
      this.regularHours.tue = null;
    }
    else if(this.regularTueFrom.value == ""  ||  this.regularTueTo.value == "") {
      this.regularHours.tue = null;
    }
    else if (this.regularTueFrom.value == "Rest" && this.regularTueTo.value == "Rest") {
        this.regularHours.tue = "Rest";
    }
    else {
        this.regularHours.tue = this.regularTueFrom.value + " - " + this.regularTueTo.value;
    }

    if(this.regularWedFrom.value == null  ||  this.regularWedTo.value == null) {
      this.regularHours.wed = null;
    }
    else if(this.regularWedFrom.value == ""  ||  this.regularWedTo.value == "") {
      this.regularHours.wed = null;
    }
    else if (this.regularWedFrom.value == "Rest" && this.regularWedTo.value == "Rest") {
        this.regularHours.wed = "Rest";
    }
    else {
        this.regularHours.wed = this.regularWedFrom.value + " - " + this.regularWedTo.value;
    }
    
    if(this.regularThuFrom.value == null  ||  this.regularThuTo.value == null) {
      this.regularHours.thu = null;
    }
    else if(this.regularThuFrom.value == ""  ||  this.regularThuTo.value == "") {
      this.regularHours.thu = null;
    }
    else if (this.regularThuFrom.value == "Rest" && this.regularThuTo.value == "Rest") {
        this.regularHours.thu = "Rest";
    }
    else {
        this.regularHours.thu = this.regularThuFrom.value + " - " + this.regularThuTo.value;
    }

    if(this.regularFriFrom.value == null  ||  this.regularFriTo.value == null) {
      this.regularHours.fri = null;
    }
    else if(this.regularFriFrom.value == ""  ||  this.regularFriTo.value == "") {
      this.regularHours.fri = null;
    }
    else if (this.regularFriFrom.value == "Rest" && this.regularFriTo.value == "Rest") {
        this.regularHours.fri = "Rest";
    }
    else {
        this.regularHours.fri = this.regularFriFrom.value + " - " + this.regularFriTo.value;
    }
    
    if(this.regularSatFrom.value == null  ||  this.regularSatTo.value == null) {
      this.regularHours.sat = null;
    }
    else if(this.regularSatFrom.value == ""  ||  this.regularSatTo.value == "") {
      this.regularHours.sat = null;
    }
    else if (this.regularSatFrom.value == "Rest" && this.regularSatTo.value == "Rest") {
        this.regularHours.sat = "Rest";
    }
    else {
        this.regularHours.sat = this.regularSatFrom.value + " - " + this.regularSatTo.value;
    }

    if(this.regularSunFrom.value == null  ||  this.regularSunTo.value == null) {
      this.regularHours.sun = null;
    }
    else if(this.regularSunFrom.value == ""  ||  this.regularSunTo.value == "") {
      this.regularHours.sun = null;
    }
    else if (this.regularSunFrom.value == "Rest" && this.regularSunTo.value == "Rest") {
        this.regularHours.sun = "Rest";
    }
    else {
        this.regularHours.sun = this.regularSunFrom.value + " - " + this.regularSunTo.value;
    }

    return this.regularHours;
  }

  buildFitnessTrainingHours() {
    this.fitnessHours.name = "Fitness training";

    if(this.fitnessMonFrom.value == null  ||  this.fitnessMonTo.value == null) {
      this.fitnessHours.mon = null;
    }
    else if(this.fitnessMonFrom.value == ""  ||  this.fitnessMonTo.value == "") {
      this.fitnessHours.mon = null;
    }
    else if (this.fitnessMonFrom.value == "Rest" && this.fitnessMonTo.value == "Rest") {
        this.fitnessHours.mon = "Rest";
    }
    else {
        this.fitnessHours.mon = this.fitnessMonFrom.value + " - " + this.fitnessMonTo.value;
    }

    if(this.fitnessTueFrom.value == null  ||  this.fitnessTueTo.value == null) {
      this.fitnessHours.tue = null;
    }
    else if(this.fitnessTueFrom.value == ""  ||  this.fitnessTueTo.value == "") {
      this.fitnessHours.tue = null;
    }
    else if (this.fitnessTueFrom.value == "Rest" && this.fitnessTueTo.value == "Rest") {
        this.fitnessHours.tue = "Rest";
    }
    else {
        this.fitnessHours.tue = this.fitnessTueFrom.value + " - " + this.fitnessTueTo.value;
    }

    if(this.fitnessWedFrom.value == null  ||  this.fitnessWedTo.value == null) {
      this.fitnessHours.wed = null;
    }
    else if(this.fitnessWedFrom.value == ""  ||  this.fitnessWedTo.value == "") {
      this.fitnessHours.wed = null;
    }
    else if (this.fitnessWedFrom.value == "Rest" && this.fitnessWedTo.value == "Rest") {
        this.fitnessHours.wed = "Rest";
    }
    else {
        this.fitnessHours.wed = this.fitnessWedFrom.value + " - " + this.fitnessWedTo.value;
    }
    
    if(this.fitnessThuFrom.value == null  ||  this.fitnessThuTo.value == null) {
      this.fitnessHours.thu = null;
    }
    else if(this.fitnessThuFrom.value == ""  ||  this.fitnessThuTo.value == "") {
      this.fitnessHours.thu = null;
    }
    else if (this.fitnessThuFrom.value == "Rest" && this.fitnessThuTo.value == "Rest") {
        this.fitnessHours.thu = "Rest";
    }
    else {
        this.fitnessHours.thu = this.fitnessThuFrom.value + " - " + this.fitnessThuTo.value;
    }

    if(this.fitnessFriFrom.value == null  ||  this.fitnessFriTo.value == null) {
      this.fitnessHours.fri = null;
    }
    else if(this.fitnessFriFrom.value == ""  ||  this.fitnessFriTo.value == "") {
      this.fitnessHours.fri = null;
    }
    else if (this.fitnessFriFrom.value == "Rest" && this.fitnessFriTo.value == "Rest") {
        this.fitnessHours.fri = "Rest";
    }
    else {
        this.fitnessHours.fri = this.fitnessFriFrom.value + " - " + this.fitnessFriTo.value;
    }
    
    if(this.fitnessSatFrom.value == null  ||  this.fitnessSatTo.value == null) {
      this.fitnessHours.sat = null;
    }
    else if(this.fitnessSatFrom.value == ""  ||  this.fitnessSatTo.value == "") {
      this.fitnessHours.sat = null;
    }
    else if (this.fitnessSatFrom.value == "Rest" && this.fitnessSatTo.value == "Rest") {
        this.fitnessHours.sat = "Rest";
    }
    else {
        this.fitnessHours.sat = this.fitnessSatFrom.value + " - " + this.fitnessSatTo.value;
    }

    if(this.fitnessSunFrom.value == null  ||  this.fitnessSunTo.value == null) {
      this.fitnessHours.sun = null;
    }
    else if(this.fitnessSunFrom.value == ""  ||  this.fitnessSunTo.value == "") {
      this.fitnessHours.sun = null;
    }
    else if (this.fitnessSunFrom.value == "Rest" && this.fitnessSunTo.value == "Rest") {
        this.fitnessHours.sun = "Rest";
    }
    else {
        this.fitnessHours.sun = this.fitnessSunFrom.value + " - " + this.fitnessSunTo.value;
    }

    return this.fitnessHours;
  }

  // Helping method used to update open position list
  updateOpenPositionList() {

    this.getOpenPositions();

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

  getOpenPositions() {
    this.updateService.getOpenPositions().subscribe(
      (succes: any) => {
        console.log(succes);
        this.openPositionSource = succes; //refresh the dataSource
        this.clubBinding.jobPositionsList = this.openPositionSource; //refresh the clubBinding
      },
      error => {}
    );
  }
}
