import { Component, OnInit } from '@angular/core';
import { Club } from 'src/app/models/club.model';
import { loginService } from "src/app/services/loginService";
import { updateService } from "src/app/services/updateService";
import { deleteService } from "src/app/services/deleteService";
import { uploadFilesService} from "src/app/services/uploadFilesService";

@Component({
  selector: 'app-update-club',
  templateUrl: './update-club.component.html',
  styleUrls: ['./update-club.component.css']
})
export class UpdateClubComponent implements OnInit {

  clubBinding: Club;
  facilityImages: string[] = [];

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
    this.updateService.updateClub(this.clubBinding);
  }

  deleteSquadPlayer(type: string) {
    if(type == 'Current Year') {
      this.deleteService.deleteSquadPlayer(this.clubBinding.currentSquadPlayersList);
    }
    if(type == 'Next Year') {
      this.deleteService.deleteSquadPlayer(this.clubBinding.nextYearSquadPlayersList);
    }
  }

  deleteTrainingHours() {
    this.deleteService.deleteTrainingHours(this.clubBinding.trainingHoursList);
  }

  deleteClubValue() {
    this.deleteService.deleteClubValue(this.clubBinding.valuesList);
  }

  deleteClubPreference() {
    this.deleteService.deleteClubPreference(this.clubBinding.preferenceList);
  }

  deleteJobPosition() {
    this.deleteService.deleteJobPosition(this.clubBinding.jobPositionsList);
  }

  deleteJobPositionStrength() {
    this.deleteService.deleteJobPositionStrength();
  }

  cancel() {
    this.clubBinding = this.loginService.clubInSession;
  }
}
