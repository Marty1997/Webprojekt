import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Player } from "src/app/models/player.model";
import { loginService } from "src/app/services/loginService";
import { updateService } from "src/app/services/updateService";
import { deleteService } from "src/app/services/deleteService";
import { FileService} from "src/app/services/FileService";
import { Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";
import { MyErrorStateMatcher, MY_FORMATS } from "src/app/front-page/front-page-image/register-player/register-player.component";
import { MatCheckbox, MatDialog, MatSnackBar, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from "@angular/material";
import { NationalTeam } from "src/app/models/nationalTeam.model";
import { ConfirmDialogModel, ConfirmationDialogComponent } from 'src/app/multi-page/confirmation-dialog/confirmation-dialog.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';


export const MY_FORMATS2 = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: "app-update-player",
  templateUrl: "./update-player.component.html",
  styleUrls: ["./update-player.component.css"],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]}]
})
export class UpdatePlayerComponent implements OnInit {
  playerBinding: Player;
  step: number = 0;
  passwordCheck: boolean = false;
  notify: MatSnackBar;
  showMessage: boolean = false;
  message: string;

  // Validators
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
  emailControl = new FormControl("", [Validators.required, Validators.email]);
  passwordControl = new FormControl("", [
    Validators.required,
    Validators.minLength(6)
  ]);

  @ViewChild("isLooking") private isLooking: MatCheckbox;

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
  preferredHandCtrl = new FormControl("");
  leagueCtrl = new FormControl("");
  contractStatusCtrl = new FormControl("");
  contractExpiredCtrl = new FormControl(moment());
  injuryStatusCtrl = new FormControl("");
  injuryDescriptionCtrl = new FormControl("");
  injuryRecoveryDateCtrl = new FormControl(moment());
  strengthsCtrl = new FormControl("");
  weaknessesCtrl = new FormControl("");
  currentClubCtrl = new FormControl("");
  currentPrimaryPositionCtrl = new FormControl("");
  currentSecondaryPositionCtrl = new FormControl("");
  accomplishmentsCtrl = new FormControl("");
  statistics = new FormControl("");
  formerClubsCtrl = new FormControl("");
  nationalTeamNameCtrl = new FormControl("");
  nationalTeamAppearancesCtrl = new FormControl("");
  nationalTeamPositionCtrl = new FormControl("");
  nationalTeamStatisticsCtrl = new FormControl("");

  // strengths and weaknesses
  @ViewChild("speedy") private speedy: MatCheckbox;
  @ViewChild("athletic") private athletic: MatCheckbox;
  @ViewChild("greatShape") private greatShape: MatCheckbox;
  @ViewChild("quickShots") private quickShots: MatCheckbox;
  @ViewChild("accurateShooter") private accurateShooter: MatCheckbox;
  @ViewChild("tactical") private tactical: MatCheckbox;
  @ViewChild("teamPlayer") private teamPlayer: MatCheckbox;
  @ViewChild("social") private social: MatCheckbox;
  @ViewChild("winAtAllCosts") private winAtAllCosts: MatCheckbox;
  @ViewChild("longRangeShooter") private longRangeShooter: MatCheckbox;
  @ViewChild("slowMoving") private slowMoving: MatCheckbox;
  @ViewChild("badEndurance") private badEndurance: MatCheckbox;
  @ViewChild("historyOfInjuries") private historyOfInjuries: MatCheckbox;
  @ViewChild("badDefencePlayer") private badDefencePlayer: MatCheckbox;

  // National team table
  nationalTeamColumns: string[] = [
    "name",
    "appearances",
    "statistics",
    "position",
    "delete"
  ];
  nationalTeamData: NationalTeam[] = [];
  nationalTeamSource = this.nationalTeamData;
  nationalTeam = new NationalTeam();
  dateContract: Date;
  dateInjury: Date;
  constructor(
    private loginService: loginService,
    private updateService: updateService,
    private fileService: FileService,
    private deleteService: deleteService,
    private router: Router,
    public dialog: MatDialog,
    ) { }

  ngOnInit() {
    this.playerBinding = this.loginService.playerInSession;

    if(this.playerBinding.isAvailable) {
      this.isLooking.checked = true;
    } else {
      this.isLooking.checked = false;
    }

    // set strengths and weaknesses
    if (this.playerBinding.strengthList.length > 0) {
      this.checkStrengthBoxes(this.playerBinding.strengthList);
    }
    if (this.playerBinding.weaknessList.length > 0) {
      this.checkWeaknessBoxes(this.playerBinding.weaknessList);
    }

    if (this.playerBinding.nationalTeamList.length > 0) {
      this.playerBinding.nationalTeamList.forEach(element => {
        // Add the intitial national team data
        this.nationalTeamSource.push(element);
        this.nationalTeamSource = [...this.nationalTeamSource];
      });
    }
    
    if(this.playerBinding.contractExpired != null) {
      var splittedContract = this.playerBinding.contractExpired.split("/", 3);
      this.dateContract = new Date(Number(splittedContract[2]), Number(splittedContract[1]) - 1, Number(splittedContract[0]));
    }

    if(this.playerBinding.injuryExpired != null) {
      var splittedInjury = this.playerBinding.injuryExpired.split("/", 3);
      this.dateInjury = new Date(Number(splittedInjury[2]), Number(splittedInjury[1]) - 1, Number(splittedInjury[0]));
    }



    // set the values
    this.setPersonalInfo();
    this.setAdditionalInfo();
    this.setStrengthsAndWeaknesses();
    this.setSportCV();
  }

  showNotificationBar(message: string) {
    this.showMessage = true;
    this.message = message;
  }

  setPersonalInfo() {
    this.firstNameControl.setValue(this.playerBinding.firstName);
    this.lastNameControl.setValue(this.playerBinding.lastName);
    this.countryControl.setValue(this.playerBinding.country);
    this.dayControl.setValue(this.playerBinding.day);
    this.monthControl.setValue(this.playerBinding.month);
    this.yearControl.setValue(this.playerBinding.year);
  }

  setAdditionalInfo() {
    this.heightControl.setValue(this.playerBinding.height);
    this.weightControl.setValue(this.playerBinding.weight);
    this.bodyfatControl.setValue(this.playerBinding.bodyfat);
    this.primaryPositionCtrl.setValue(this.playerBinding.primaryPosition);
    this.secondaryPositionCtrl.setValue(this.playerBinding.secondaryPosition);
    this.preferredHandCtrl.setValue(this.playerBinding.preferredHand);
    this.leagueCtrl.setValue(this.playerBinding.league);
    this.contractStatusCtrl.setValue(this.playerBinding.contractStatus);
    this.injuryStatusCtrl.setValue(this.playerBinding.injuryStatus);
    this.injuryDescriptionCtrl.setValue(this.playerBinding.injuryDescription);
  }

  setStrengthsAndWeaknesses() {
    this.strengthsCtrl.setValue(this.playerBinding.strengthDescription);
    this.weaknessesCtrl.setValue(this.playerBinding.weaknessDescription);
  }

  setSportCV() {
    this.currentClubCtrl.setValue(this.playerBinding.currentClub);
    this.currentPrimaryPositionCtrl.setValue(this.playerBinding.currentClubPrimaryPosition);
    this.currentSecondaryPositionCtrl.setValue(this.playerBinding.currentClubSecondaryPosition);
    this.accomplishmentsCtrl.setValue(this.playerBinding.accomplishments);
    this.statistics.setValue(this.playerBinding.statistic);
    this.formerClubsCtrl.setValue(this.playerBinding.formerClubs);
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
      this.showMessage = false;
      this.fileService.uploadFile(files).subscribe(res => {
        if(type === 'profile') {
          //Delete former image file from filesystem
          this.deleteFile(this.playerBinding.imagePath);
          this.fileService.createPath(JSON.stringify(res.body), 'image');
          this.playerBinding.imagePath = this.fileService.imagePath;
          //Update new image in DB
          this.updatePlayerProfile();
        }
        if(type === 'video') {
          //Delete former video file from filesystem
          this.deleteFile(this.playerBinding.videoPath);
          this.fileService.createPath(JSON.stringify(res.body), 'video');
          this.playerBinding.videoPath = this.fileService.videoPath;
          //Update new video in DB
          this.updatePlayerVideo();
        }
      },
      error => {
        this.showNotificationBar('Failed to upload');
      });
    }
  };

  openSnackBar(message: string, action: string) {
    this.notify.open(message, action, {
      duration: 2000,
    });
  }

  updatePlayerProfile() {
    this.showMessage = false;
    this.updateService.updatePlayerProfile(this.buildPlayerProfile()).subscribe(
      (succes: any) => {
      },
      error => {
        this.showNotificationBar('Failed to update');
      });
  }

  buildPlayerProfile() {
    var player = new Player();
    player.imagePath = this.playerBinding.imagePath;
    return player;
  }

  updatePlayerVideo() {
    this.showMessage = false;
    this.updateService.updatePlayerVideo(this.buildPlayerVideo()).subscribe(
      (succes: any) => {
 
      },
      error => {
        this.showNotificationBar('Failed to update');
      }
    );
  }

  buildPlayerVideo() {
    var player = new Player();
    player.videoPath = this.playerBinding.videoPath;
    return player;
  }

  updatePlayerInfo() {
    this.showMessage = false;
    this.updateService.updatePlayerInfo(this.buildPlayerInfo()).subscribe(
      (succes: any) => {
        this.overWritePlayerInfo();
        this.showNotificationBar('Update was successful');
      },
      error => {
        this.showNotificationBar('Failed to update');
      }
    );
  }

  updatePassword() {
    this.passwordCheck = false;
    this.showMessage = false;
     
    this.updateService.updatePlayerPassword(this.buildPassword()).subscribe(
      (succes: any) => {

        this.showNotificationBar('Password was updated')

      },
      error => {
        if(error.error == "Invalid password") {
          this.passwordCheck = true;
        }
        this.showNotificationBar('Update failed')
      });
  }

  overWritePlayerInfo() {
    this.playerBinding.firstName = this.firstNameControl.value == "" ? null : this.firstNameControl.value;
    this.playerBinding.lastName = this.lastNameControl.value == "" ? null : this.lastNameControl.value;
    this.playerBinding.country = this.countryControl.value == "" ? null : this.countryControl.value;
    this.playerBinding.day = this.dayControl.value == "" ? null : this.dayControl.value;
    this.playerBinding.month = this.monthControl.value == "" ? null : this.monthControl.value;
    this.playerBinding.year = this.yearControl.value == "" ? null : this.yearControl.value;
  }

  updatePlayerAdditionalInfo() {
    this.showMessage = false;
    this.updateService.updatePlayerAdditionalInfo(this.buildPlayerAdditionalInfo()).subscribe(
      (succes: any) => {
          this.overWriteAdditionalInfo();
          this.showNotificationBar('Update was successful');
      },
      error => {
        this.showNotificationBar('Failed to update');
      });
      console.log(this.contractExpiredCtrl.value);
      console.log(this.injuryRecoveryDateCtrl.value);
  }

  overWriteAdditionalInfo() {
    this.playerBinding.height = this.heightControl.value == "" ? null : this.heightControl.value;
    this.playerBinding.weight = this.weightControl.value == "" ? null : this.weightControl.value;
    this.playerBinding.bodyfat = this.bodyfatControl.value == "" ? null : this.bodyfatControl.value;
    this.playerBinding.primaryPosition = this.primaryPositionCtrl.value == "" ? null : this.primaryPositionCtrl.value;
    this.playerBinding.secondaryPosition = this.secondaryPositionCtrl.value == "" ? null : this.secondaryPositionCtrl.value;
    this.playerBinding.preferredHand = this.preferredHandCtrl.value == "" ? null : this.preferredHandCtrl.value;
    this.playerBinding.league = this.leagueCtrl.value == "" ? null : this.leagueCtrl.value;
    this.playerBinding.contractStatus = this.contractStatusCtrl.value == "" ? null : this.contractStatusCtrl.value;
    
    if(this.contractExpiredCtrl.value == "") {
      this.playerBinding.contractExpired = null;
    }
    else {
      this.playerBinding.contractExpiredDate = new Date(this.contractExpiredCtrl.value);
      this.playerBinding.contractExpired = this.playerBinding.contractExpiredDate.getDate() + 
      "/" + (this.playerBinding.contractExpiredDate.getMonth() + 1) +
      "/" + this.playerBinding.contractExpiredDate.getFullYear();
    }

    this.playerBinding.injuryStatus = this.injuryStatusCtrl.value == "" ? null : this.injuryStatusCtrl.value;
    this.playerBinding.injuryDescription = this.injuryDescriptionCtrl.value == "" ? null : this.injuryDescriptionCtrl.value;
    
    if(this.injuryRecoveryDateCtrl.value == "") {
      this.playerBinding.injuryExpired = null;
    }
    else {
      this.playerBinding.injuryExpiredDate = new Date(this.injuryRecoveryDateCtrl.value);
      this.playerBinding.injuryExpired = this.playerBinding.injuryExpiredDate.getDate() + 
      "/" + (this.playerBinding.injuryExpiredDate.getMonth() + 1) +
      "/" + this.playerBinding.injuryExpiredDate.getFullYear();
    }
  }

  deletePlayerStrengthsAndWeaknesses() {
    this.showMessage = false;
    // Delete player strengths and weaknesses
    this.deleteService.deleteStrengthsAndWeaknesses().subscribe(
      (succes: any) => {
        // Insert new player strengths and weaknesses
        this.updateStrengthsAndWeaknesses();
      },
      error => {
        this.showNotificationBar('Failed to update');
      });
  }

  updateStrengthsAndWeaknesses() {
    this.showMessage = false;
    this.updateService.updateStrengthsAndWeaknesses(this.buildStrengthsAndWeaknesses()).subscribe(
      (succes: any) => {
        this.overWriteStrengthAndWeaknesses();
        this.showNotificationBar('Update was successful');
      },
      error => {
        this.showNotificationBar('Failed to update');
      });
  }

  overWriteStrengthAndWeaknesses() {

    //Reset playerBinding strength and weaknesses lists
    this.playerBinding.strengthList = [];
    this.playerBinding.weaknessList = [];

    if (this.speedy.checked) {
      this.playerBinding.strengthList.push(this.speedy.value);
    }
    if (this.athletic.checked) {
      this.playerBinding.strengthList.push(this.athletic.value);
    }
    if (this.greatShape.checked) {
      this.playerBinding.strengthList.push(this.greatShape.value);
    }
    if (this.quickShots.checked) {
      this.playerBinding.strengthList.push(this.quickShots.value);
    }
    if (this.accurateShooter.checked) {
      this.playerBinding.strengthList.push(this.accurateShooter.value);
    }
    if (this.tactical.checked) {
      this.playerBinding.strengthList.push(this.tactical.value);
    }
    if (this.teamPlayer.checked) {
      this.playerBinding.strengthList.push(this.teamPlayer.value);
    }
    if (this.social.checked) {
      this.playerBinding.strengthList.push(this.social.value);
    }
    if (this.winAtAllCosts.checked) {
      this.playerBinding.strengthList.push(this.winAtAllCosts.value);
    }
    if (this.longRangeShooter.checked) {
      this.playerBinding.strengthList.push(this.longRangeShooter.value);
    }
    if (this.slowMoving.checked) {
      this.playerBinding.weaknessList.push(this.slowMoving.value);
    }
    if (this.badEndurance.checked) {
      this.playerBinding.weaknessList.push(this.badEndurance.value);
    }
    if (this.historyOfInjuries.checked) {
      this.playerBinding.weaknessList.push(this.historyOfInjuries.value);
    }
    if (this.badDefencePlayer.checked) {
      this.playerBinding.weaknessList.push(this.badDefencePlayer.value);
    }

    // value description
    this.playerBinding.strengthDescription = this.strengthsCtrl.value;

    // preference description
    this.playerBinding.weaknessDescription = this.weaknessesCtrl.value;
  }

  updateSportCV() {
    this.showMessage = false;
    this.updateService.updateSportCV(this.buildSportCv()).subscribe(
      (succes: any) => {
        this.overWriteSportCV();
        this.showNotificationBar('Update was successful');
      },
      error => {
        this.showNotificationBar('Failed to update');
      });
  }

  overWriteSportCV() {
    this.playerBinding.currentClub = this.currentClubCtrl.value == "" ? null : this.currentClubCtrl.value;
    this.playerBinding.currentClubPrimaryPosition = this.currentPrimaryPositionCtrl.value == "" ? null : this.currentPrimaryPositionCtrl.value;
    this.playerBinding.currentClubSecondaryPosition = this.currentSecondaryPositionCtrl.value == "" ? null : this.currentSecondaryPositionCtrl.value;
    this.playerBinding.accomplishments = this.accomplishmentsCtrl.value == "" ? null : this.accomplishmentsCtrl.value;
    this.playerBinding.statistic = this.statistics.value == "" ? null : this.statistics.value;
    this.playerBinding.formerClubs = this.formerClubsCtrl.value == "" ? null : this.formerClubsCtrl.value;
  }

  deleteFile(filename: string) {
    // Delete former image from filesystem 
    this.fileService.deleteFile(filename).subscribe(
      (succes: any) => {
  
      },
      error => {

      });
  }

  deletePlayerProfile() {
    this.showMessage = false;
    // Delete image from filesystem 
    this.fileService.deleteFile(this.playerBinding.imagePath).subscribe(
      (succes: any) => {
        this.playerBinding.imagePath = "https:\\localhost:44310\\Resources\\Files\\player-icon.png";
        //Update player imagePath in DB to default image
        this.updatePlayerProfile();
      },
      error => {
        this.showNotificationBar('Failed to delete');
      });
  }
  

  deletePlayerVideo() {
    this.showMessage = false;
    // Delete video from filesystem 
    this.fileService.deleteFile(this.playerBinding.videoPath).subscribe(
      (succes: any) => {
        this.playerBinding.videoPath = null;
        //Update player videoPath in DB to null
        this.updatePlayerVideo();
      },
      error => {
        this.showNotificationBar('Failed to delete');
      });
  }

  onAddNationalTeamToPlayer() {
    if(
      this.nationalTeamNameCtrl.value !== "" &&
      this.nationalTeamAppearancesCtrl.value !== "" &&
      this.nationalTeamPositionCtrl.value !== "" &&
      Number(this.nationalTeamAppearancesCtrl.value)
    ) {
      // add national team to the list
      this.addPlayerNationalTeam();

    }
  }

  updateNationalTeamList() {
    this.getNationalTeams();

    // reset input fields
    this.nationalTeamNameCtrl.setValue('');
    this.nationalTeamAppearancesCtrl.setValue('');
    this.nationalTeamPositionCtrl.setValue('');
    this.nationalTeamStatisticsCtrl.setValue('');
  }

  getNationalTeams() {
    this.updateService.getNationalTeams().subscribe(
      (succes: any) => {
        this.nationalTeamSource = succes; //refresh the dataSource
        this.playerBinding.nationalTeamList = this.nationalTeamSource; //refresh the clubBinding
      },
      error => {}
    );
  }

  buildNationalTeam() {
    let nt = new NationalTeam();
    nt.name = this.nationalTeamNameCtrl.value;
    nt.appearances = this.nationalTeamAppearancesCtrl.value;
    nt.position = this.nationalTeamPositionCtrl.value;
    nt.statistic = this.nationalTeamStatisticsCtrl.value;
    return nt;
  }

  addPlayerNationalTeam() {
    this.showMessage = false;
    this.updateService.addPlayerNationalTeam(this.buildNationalTeam()).subscribe(
      (succes:any) => {      
        this.updateNationalTeamList();
        
      },
      error => {
        this.showNotificationBar('Failed to add national team');
      })
  }

  checkStrengthBoxes(strengths: string[]) {
    strengths.forEach(str => {
      if (str === "Speedy") {
        this.speedy.checked = true;
      } else if (str === "Athletic") {
        this.athletic.checked = true;
      } else if (str === "Great shape") {
        this.greatShape.checked = true;
      } else if (str === "Quick shots") {
        this.quickShots.checked = true;
      } else if (str === "Accurate shooter") {
        this.accurateShooter.checked = true;
      } else if (str === "Tactical") {
        this.tactical.checked = true;
      } else if (str === "Teamplayer") {
        this.teamPlayer.checked = true;
      } else if (str === "Social") {
        this.social.checked = true;
      } else if (str === "Win at all costs") {
        this.winAtAllCosts.checked = true;
      } else if (str === "Long range shooter") {
        this.longRangeShooter.checked = true;
      }
    });
  }

  checkWeaknessBoxes(weaknesses: string[]) {
    weaknesses.forEach(weak => {
      if (weak === "Slow moving") {
        this.slowMoving.checked = true;
      } else if (weak === "Bad endurance") {
        this.badEndurance.checked = true;
      } else if (weak === "History of injuries") {
        this.historyOfInjuries.checked = true;
      } else if (weak === "Bad defence player") {
        this.badDefencePlayer.checked = true;
      }
    });
  }

  buildPlayerInfo() {
    var player = new Player();
    player.email = this.playerBinding.email;
    player.password =
      this.currentPassword.value == "" ? null : this.currentPassword.value;
    player.newPassword = this.password.value == "" ? null : this.password.value;
    player.isAvailable = this.isLooking.checked;
    player.firstName =
      this.firstNameControl.value == ""
        ? this.playerBinding.firstName
        : this.firstNameControl.value;
    player.lastName =
      this.lastNameControl.value == ""
        ? this.playerBinding.lastName
        : this.lastNameControl.value;
    player.country =
      this.countryControl.value == ""
        ? this.playerBinding.country
        : this.countryControl.value;
    player.day =
      this.dayControl.value == ""
        ? this.playerBinding.day
        : this.dayControl.value;
    player.month =
      this.monthControl.value == ""
        ? this.playerBinding.month
        : this.monthControl.value;
    player.year =
      this.yearControl.value == ""
        ? this.playerBinding.year
        : this.yearControl.value;
    return player;
  }

  buildPassword() {
    var player = new Player();
    player.password =
      this.currentPassword.value == "" ? null : this.currentPassword.value;
    player.newPassword = this.password.value == "" ? null : this.password.value;
    return player;
  }

  buildPlayerAdditionalInfo() {
    var player = new Player();
    player.height =
      this.heightControl.value == ""
        ? null
        : this.heightControl.value;
    player.weight =
      this.weightControl.value == ""
        ? null
        : this.weightControl.value;
    player.bodyfat =
      this.bodyfatControl.value == ""
        ? null
        : this.bodyfatControl.value;
    player.primaryPosition =
      this.primaryPositionCtrl.value == ""
        ? null
        : this.primaryPositionCtrl.value;
    player.secondaryPosition =
      this.secondaryPositionCtrl.value == ""
        ? null
        : this.secondaryPositionCtrl.value;
    player.preferredHand =
      this.preferredHandCtrl.value == ""
        ? null
        : this.preferredHandCtrl.value;
    player.league =
      this.leagueCtrl.value == ""
        ? null
        : this.leagueCtrl.value;
    player.contractStatus =
      this.contractStatusCtrl.value == ""
        ? null
        : this.contractStatusCtrl.value;

    if(this.contractExpiredCtrl.value == "") {
      player.contractExpired = null;
    }
    else {
      player.contractExpiredDate = new Date(this.contractExpiredCtrl.value);
      player.contractExpired = player.contractExpiredDate.getDate() + 
      "/" + (player.contractExpiredDate.getMonth() + 1) +
      "/" + player.contractExpiredDate.getFullYear();
    }

    player.injuryStatus =
      this.injuryStatusCtrl.value == ""
        ? null
        : this.injuryStatusCtrl.value;
    player.injuryDescription =
      this.injuryDescriptionCtrl.value == ""
        ? null
        : this.injuryDescriptionCtrl.value;

    if (this.injuryRecoveryDateCtrl.value == "") {
      player.injuryExpired = null;
    }
    else {
      player.injuryExpiredDate = new Date(this.injuryRecoveryDateCtrl.value);
      player.injuryExpired = player.injuryExpiredDate.getDate() +
        "/" + (player.injuryExpiredDate.getMonth() + 1) +
        "/" + player.injuryExpiredDate.getFullYear();
    }
    return player;
  }

  buildStrengthsAndWeaknesses() {
    var player = new Player();
    player.weaknessDescription =
      this.weaknessesCtrl.value == ""
        ? null
        : this.weaknessesCtrl.value;
    player.strengthDescription =
      this.strengthsCtrl.value == ""
        ? null
        : this.strengthsCtrl.value;
    if (this.speedy.checked) {
      player.strengthList.push(this.speedy.value);
    }
    if (this.athletic.checked) {
      player.strengthList.push(this.athletic.value);
    }
    if (this.greatShape.checked) {
      player.strengthList.push(this.greatShape.value);
    }
    if (this.quickShots.checked) {
      player.strengthList.push(this.quickShots.value);
    }
    if (this.accurateShooter.checked) {
      player.strengthList.push(this.accurateShooter.value);
    }
    if (this.tactical.checked) {
      player.strengthList.push(this.tactical.value);
    }
    if (this.teamPlayer.checked) {
      player.strengthList.push(this.teamPlayer.value);
    }
    if (this.social.checked) {
      player.strengthList.push(this.social.value);
    }
    if (this.winAtAllCosts.checked) {
      player.strengthList.push(this.winAtAllCosts.value);
    }
    if (this.longRangeShooter.checked) {
      player.strengthList.push(this.longRangeShooter.value);
    }
    if (this.slowMoving.checked) {
      player.weaknessList.push(this.slowMoving.value);
    }
    if (this.badEndurance.checked) {
      player.weaknessList.push(this.badEndurance.value);
    }
    if (this.historyOfInjuries.checked) {
      player.weaknessList.push(this.historyOfInjuries.value);
    }
    if (this.badDefencePlayer.checked) {
      player.weaknessList.push(this.badDefencePlayer.value);
    }
    return player;
  }

  buildSportCv() {
    var player = new Player();
    player.currentClub =
      this.currentClubCtrl.value == ""
        ? null
        : this.currentClubCtrl.value;
    player.currentClubPrimaryPosition =
      this.currentPrimaryPositionCtrl.value == ""
        ? null
        : this.currentPrimaryPositionCtrl.value;
    player.currentClubSecondaryPosition =
      this.currentSecondaryPositionCtrl.value == ""
        ? null
        : this.currentSecondaryPositionCtrl.value;
    player.accomplishments =
      this.accomplishmentsCtrl.value == ""
        ? null
        : this.accomplishmentsCtrl.value;
    player.statistic =
      this.statistics.value == ""
        ? null
        : this.statistics.value;
    player.formerClubs =
      this.formerClubsCtrl.value == ""
        ? null
        : this.formerClubsCtrl.value;
    return player;
  }

  deletePlayerNationalTeam(nt: NationalTeam) {
    this.showMessage = false;
    this.deleteService.deleteNationalTeam(nt.id).subscribe(
      (succes:any) => {      
        this.deleteNationalTeam(nt);
      },
      error => {
        this.showNotificationBar('Failed to delete');
      });
  }

  deletePlayer() {
    const message = `Are you sure you want to delete your profile?`;

    const dialogData = new ConfirmDialogModel("Confirmation", message);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      minWidth: "400px",
      maxWidth: "401px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((res) => {
      if(res) {
        this.showMessage = false;
        this.deleteService.deletePlayer().subscribe(
          (succes:any) => {      
            this.loginService.logout();
            this.router.navigate(['/']);
          },
          error => {
            this.showNotificationBar('Failed to delete');
          });
      }
    });
  }
  deleteNationalTeam(nationalTeam: NationalTeam) {
    this.nationalTeamSource.forEach( (nt, index) => {
      if(nt === nationalTeam) {
        this.nationalTeamSource.splice(index, 1);
      }
    })
    this.nationalTeamSource = [...this.nationalTeamSource]; // refresh the dataSource
    this.playerBinding.nationalTeamList = this.nationalTeamSource;
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

  nationalTeamNames: string[] = [
    "01",
    "B",
    "U21",
    "U18"
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
