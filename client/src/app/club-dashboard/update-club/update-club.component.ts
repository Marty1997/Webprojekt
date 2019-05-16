import { Component, OnInit, Input } from '@angular/core';
import { Club } from 'src/app/models/club.model';
import { loginService } from "src/app/services/loginService";

@Component({
  selector: 'app-update-club',
  templateUrl: './update-club.component.html',
  styleUrls: ['./update-club.component.css']
})
export class UpdateClubComponent implements OnInit {

  constructor(private loginService: loginService) { }

  ngOnInit() {
    this.clubBinding = this.loginService.clubInSession;
  }

  

}
