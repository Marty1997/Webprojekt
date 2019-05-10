import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgForm } from "@angular/forms";
import { loginService } from "src/app/services/loginService";
import { uploadFilesService} from "src/app/services/uploadFilesService";
import { Club } from "../models/club.model";
import { searchService } from "../services/searchService";
import { ActivatedRoute } from "@angular/router";
import { updateService } from "src/app/services/updateService";

@Component({
  selector: "app-club-dashboard",
  templateUrl: "./club-dashboard.component.html",
  styleUrls: ["./club-dashboard.component.css"],
  providers: [searchService],
  encapsulation: ViewEncapsulation.None
})
export class ClubDashboardComponent implements OnInit {
  clubBinding: Club;
  isClub: boolean;
  clubs: Club[] = this.searchService.searchForClubsResult;

  myInterval = 3000;
  slides = [
    { image: "assets/Images/Håndboldbane.jpg" },
    { image: "assets/Images/omklædning.jpg" },
    { image: "assets/Images/Styrke.jpg" }
  ];

  constructor(
    private route: ActivatedRoute,
    private loginService: loginService,
    private searchService: searchService,
    private uploadFilesService: uploadFilesService,
    private updateService: updateService
  ) {}

  ngOnInit() {
    if (this.loginService.typeOfLogin == "Club") {
      this.isClub = true;
      if (this.loginService.refreshValue) {
        this.loginService.LoginUserIfValidTokenOnRefresh(
          this.loginService.getDecodeToken()
        );
        this.loginService.refreshValue = false;
      }
      this.clubBinding = this.loginService.clubInSession;
      this.clubBinding.trainingHoursList.forEach(elm => {
        if (elm.mon == null) {
          elm.mon = "-";
        }
        if (elm.tue == null) {
          elm.tue = "-";
        }
        if (elm.wed == null) {
          elm.wed = "-";
        }
        if (elm.thu == null) {
          elm.thu = "-";
        }
        if (elm.fri == null) {
          elm.fri = "-";
        }
        if (elm.sat == null) {
          elm.sat = "-";
        }
        if (elm.sun == null) {
          elm.sun = "-";
        }
      });
      if (this.clubBinding.trainer == null) {
        this.clubBinding.trainer = "Not specified";
      }
      if (this.clubBinding.assistantTrainer == null) {
        this.clubBinding.assistantTrainer = "Not specified";
      }
      if (this.clubBinding.physiotherapist == null) {
        this.clubBinding.physiotherapist = "Not specified";
      }
      if (this.clubBinding.assistantPhysiotherapist == null) {
        this.clubBinding.assistantPhysiotherapist = "Not specified";
      }
      if (this.clubBinding.manager == null) {
        this.clubBinding.manager = "Not specified";
      }
    } else if (this.loginService.typeOfLogin == "Player") {
      //find klubben som spilleren vil se og put i clubBinding variablen
      this.isClub = false;
      this.clubs.forEach((c: Club) => {
        if (c.id == this.route.snapshot.params.id) {
          this.searchService.getClubById(c); //fetch club data
          this.clubBinding = this.searchService.club;
        }
      });
    } else {
      this.loginService.logout();
    }
  }

  uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    else {
      let folder: string = "Images";

      this.uploadFilesService.uploadFile(files).subscribe(res => {

        this.uploadFilesService.createImgPath(JSON.stringify(res.body));
        this.clubBinding.imagePath = this.uploadFilesService.imagePath;

        //Update club
        this.updateClub(this.clubBinding);
      });
    }
  }

  uploadFiles = (files) => {
    if (files.length === 0) {
      return;
    }
    else {
      let folder: string = "Images";

      this.uploadFilesService.uploadFiles(files).subscribe( 
        (res: any) => {
          res.forEach(element => {
            console.log(element);
          });
        },
        (error) => {
          console.log(error);
        }
      );
        
        // this.uploadFilesService.createImgPath(JSON.stringify(res.body));
        // this.clubBinding.imagePath = this.uploadFilesService.imagePath;

        // //Update club
        // this.updateClub(this.clubBinding);
    }
  }
  
  updateClub(c: Club) {
    this.updateService.updateClub(c);
  }
}
