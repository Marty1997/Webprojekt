import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgForm } from "@angular/forms";
import { loginService } from "src/app/services/loginService";
import { uploadFilesService } from "src/app/services/uploadFilesService";
import { updateService } from "src/app/services/updateService";
import { ActivatedRoute } from "@angular/router";
import { Player } from "../models/player.model";
import { searchService } from "../services/searchService";

@Component({
  selector: "app-player-dashboard",
  templateUrl: "./player-dashboard.component.html",
  styleUrls: ["./player-dashboard.component.css"],
  encapsulation: ViewEncapsulation.None,
  providers: [searchService]
})
export class PlayerDashboardComponent implements OnInit {
  isPlayer: boolean;
  playerBinding: Player;

  isATeamOpen: boolean;
  isBTeamOpen: boolean;
  isU21TeamOpen: boolean;
  isU18TeamOpen: boolean;

  constructor(
    private route: ActivatedRoute,
    private searchService: searchService,
    private loginService: loginService,
    private uploadFilesService: uploadFilesService,
    private updateService: updateService
  ) {}

  ngOnInit() {
    if (this.loginService.typeOfLogin == "Player") {
      this.isPlayer = true;
      if (this.loginService.refreshValue) {
        this.loginService.LoginUserIfValidTokenOnRefresh(
          this.loginService.getDecodeToken()
        );
        this.loginService.refreshValue = false;
      }
      this.playerBinding = this.loginService.playerInSession;
      console.log(this.playerBinding);

      console.log(this.playerBinding.nationalTeamList);
      
      //Check nationalTeamList for teams
      for(let nationalTeam of this.playerBinding.nationalTeamList) {
        this.isBTeamOpen = true;
        if(nationalTeam.name == "A") {
          this.isATeamOpen = true;
        }
        if(nationalTeam.name == "B") {
          this.isBTeamOpen = true;
        }
        if(nationalTeam.name == "U21") {
          this.isU21TeamOpen = true;
        }
        if(nationalTeam.name == "U18") {
          this.isU18TeamOpen = true;
        }
      }
        
    } else if (this.loginService.typeOfLogin == "Club") {
      //find spilleren som klubben vil se og put i playerBinding variablen
        this.playerBinding = this.searchService.player;
        }
     else {
      console.log("Den her");
      this.loginService.logout();
    }
  }

  uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    else {
      this.uploadFilesService.uploadFile(files).subscribe(res => {

        this.uploadFilesService.createImgPath(JSON.stringify(res.body));
        this.playerBinding.imagePath = this.uploadFilesService.imagePath;

        //Update player
        this.updatePlayer(this.playerBinding);
      });
    }
  }
  
  updatePlayer(p: Player) {
    this.updateService.updatePlayer(p);
  }
}
