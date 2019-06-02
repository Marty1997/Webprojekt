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
  step: number;

  constructor(
    private loginService: loginService,
    private updateService: updateService,
    private uploadFilesService: uploadFilesService,
    private deleteService: deleteService
    ) { }

  ngOnInit() {
    this.setStep(-1); // start with closed accordions
    this.playerBinding = this.loginService.playerInSession;
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
    //Check if player weakness was deleted from playerBinding
    if(this.playerBinding.weaknessList.length > 0 ) {
      this.deleteService.deletePlayerWeakness(this.playerBinding.weaknessList);
    }

    //Check if player strength was deleted from playerBinding
    if(this.playerBinding.strengthList.length > 0 ) {
      this.deleteService.deletePlayerStrength(this.playerBinding.strengthList);
    }

    this.updateService.updatePlayer(this.playerBinding);
  }

  deleteNationalTeam() {
    
    //Decrement nationalTeam from playerbinding
  }

  deletePlayerWeakness() {
    //Decrement player weakness from playerbinding
  }

  deletePlayerStrength() {
    //Decrement player strength from playerbinding
  }

  cancel() {
    this.playerBinding = this.loginService.playerInSession;
  }
}

