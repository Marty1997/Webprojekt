import { Component, OnInit } from '@angular/core';
import { loginService } from 'src/app/services/loginService';

@Component({
  selector: 'app-for-clubs',
  templateUrl: './for-clubs.component.html',
  styleUrls: ['./for-clubs.component.css']
})
export class ForClubsComponent implements OnInit {
  isClub: boolean;
  constructor(private loginService: loginService) { }

  ngOnInit() {
    if(this.loginService.typeOfLogin == 'Club') {
      this.isClub = true;
    }
  }

}
