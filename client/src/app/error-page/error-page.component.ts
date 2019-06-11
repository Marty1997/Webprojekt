import { Component, OnInit } from '@angular/core';
import { loginService } from 'src/app/services/loginService';
import { errorService } from 'src/app/services/errorService';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {
  userLoggedIn: boolean = false;
  numberOfError: number;
  constructor(private loginService: loginService, private errorService: errorService) { }

  ngOnInit() {
    if(this.loginService.typeOfLogin != "") {
      this.userLoggedIn = true;
    }
    this.numberOfError = this.errorService.numberOfError;
  }

}
