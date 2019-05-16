import { Component, OnInit, Input } from '@angular/core';
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

  
// <!-- Delete SquadPlayer button -->
// <input type="button" class="btn btn-success" value="Delete" (click) ="DeleteSquadPlayer()">

// <!-- Delete TrainingHours button -->
// <input type="button" class="btn btn-success" value="Delete" (click) ="DeleteTrainingHours()">

// <!-- Delete Club value button -->
// <input type="button" class="btn btn-success" value="Delete" (click) ="DeleteClubValue()">

// <!-- Delete Club preference button -->
// <input type="button" class="btn btn-success" value="Delete" (click) ="DeleteClubPreference()">

// <!-- Delete Job position button -->
// <input type="button" class="btn btn-success" value="Delete" (click) ="DeleteJobPosition()">

// <!-- Delete Job position strength button -->
// <input type="button" class="btn btn-success" value="Delete" (click) ="DeleteJobPositionStrength()">

// <!-- Update button -->
// <input type="button" class="btn btn-success" value="Update" (click) ="updateClub()">


  cancel() {
    this.clubBinding = this.loginService.clubInSession;
  }
}
