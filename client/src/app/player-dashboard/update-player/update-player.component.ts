import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { loginService } from "src/app/services/loginService";
import { updateService } from "src/app/services/updateService";
import { deleteService } from "src/app/services/deleteService";
import { uploadFilesService} from "src/app/services/uploadFilesService";

@Component({
  selector: 'app-update-player',
  templateUrl: './update-player.component.html',
  styleUrls: ['./update-player.component.css']
})
export class UpdatePlayerComponent implements OnInit {

  playerBinding: Player;

  constructor(
    private loginService: loginService,
    private updateService: updateService,
    private uploadFilesService: uploadFilesService,
    private deleteService: deleteService
    ) { }

  ngOnInit() {
    this.playerBinding = this.loginService.playerInSession;
  }

  upload = (files, type: string) => {
    if (files.length === 0) {
      return;
    }
    else {
      this.uploadFilesService.uploadFile(files).subscribe(res => {
        if(type === 'profile') {
          this.uploadFilesService.createPath(JSON.stringify(res.body), 'image');
          this.playerBinding.imagePath = this.uploadFilesService.imagePath;
        }
        if(type === 'video') {
          this.uploadFilesService.createPath(JSON.stringify(res.body), 'video');
          this.playerBinding.videoPath = this.uploadFilesService.videoPath;
        }
      });
    }
  }

  updatePlayer() {

    //Check if nationalteam(s) was deleted from playerBinding
    if(this.playerBinding.nationalTeamList.length > 0 ) {
      this.deleteService.deleteNationalTeam(this.playerBinding.nationalTeamList);
    }
    //Check if  was deleted from playerBinding
    if(this.playerBinding.nationalTeamList.length > 0 ) {
      this.deleteService.deleteNationalTeam(this.playerBinding.nationalTeamList);
    }

    this.updateService.updatePlayer(this.playerBinding);
  }

  deleteNationalTeam() {
    this.deleteService.deleteNationalTeam(this.playerBinding.nationalTeamList);
  }

  deletePlayerWeakness() {
    this.deleteService.deletePlayerWeakness(this.playerBinding.weaknessList);
  }

  deletePlayerStrength() {
    this.deleteService.deletePlayerStrength(this.playerBinding.strengthList);
  }

  cancel() {
    this.playerBinding = this.loginService.playerInSession;
  }
}

