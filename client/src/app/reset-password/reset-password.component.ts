import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { updateService } from 'src/app/services/updateService';
import { Router } from "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  passwordsDontMatch: boolean = false;
  passwordResetCompleted: boolean = false;
  passwordResetErrorFromServer: boolean = false;
  invalidTokenFromServer: boolean = false;
  constructor(private updateService: updateService, private router: Router) { }

  ngOnInit() {
  }

  goToFrontpage() {
    window.scrollTo(0, 0)
    this.router.navigate(['/'])
  }

  resetCurrentPassword(form: NgForm) {
    this.passwordResetErrorFromServer = false;
    this.passwordsDontMatch = false;
    this.invalidTokenFromServer = false;
    if(form.value.newPassword === form.value.confirmPassword) {
      this.updateService.resetPasswordWithToken(form, this.router.url).subscribe(
        (succes) =>(this.passwordResetCompleted = true), 
        (error) => {
          if(error.error == "Invalid Token") {
            this.invalidTokenFromServer = true;
          }
          else {
            this.passwordResetErrorFromServer = true
          }
        }
      );
    }
    else {
      this.passwordsDontMatch = true;
    }
  }

  

}
