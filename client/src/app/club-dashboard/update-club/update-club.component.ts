import { Component, OnInit } from '@angular/core';
import { Club } from 'src/app/models/club.model';
import { loginService } from "src/app/services/loginService";
import { updateService } from "src/app/services/updateService";
import { deleteService } from "src/app/services/deleteService";
import { uploadFilesService} from "src/app/services/uploadFilesService";
import { SquadPlayer } from 'src/app/models/squadPlayer.model';
import { TrainingHours } from 'src/app/models/trainingHours.model';
import { JobPosition } from 'src/app/models/jobPosition';

@Component({
  selector: 'app-update-club',
  templateUrl: './update-club.component.html',
  styleUrls: ['./update-club.component.css']
})
export class UpdateClubComponent implements OnInit {

  clubBinding: Club;
  facilityImages: string[] = [];
  deletedCurrentYearSquadPlayerList: SquadPlayer[] = [];
  deletedNextYearSquadPlayersList: SquadPlayer[] = [];
  deletedTrainingHoursList: TrainingHours[] = [];
  deletedClubValueList: string[] = [];
  deletedClubPreferenceList: string[] = [];
  deletedJobPositionList: JobPosition[] = [];
  deletedJobPositionStrengthList: string[] = [];

  constructor(
    private loginService: loginService,
    private updateService: updateService,
    private uploadFilesService: uploadFilesService,
    private deleteService: deleteService
    ) { }

  ngOnInit() {
    this.clubBinding = this.loginService.clubInSession;
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
}
