import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { EmailService } from 'src/app/services/emailService';
import { loginService } from 'src/app/services/loginService';
import { Player } from 'src/app/models/player.model';
import { Club } from 'src/app/models/club.model';

@Component({
  selector: 'app-contact-adviser',
  templateUrl: './contact-adviser.component.html',
  styleUrls: ['./contact-adviser.component.css'],
  providers: [EmailService]
})

export class ContactAdviserComponent implements OnInit {

  isCollapsed: boolean = true;

  playerBinding: Player;
  clubBinding: Club;

  form: FormGroup;
  email: FormControl;
  message: FormControl;

  constructor(private emailService: EmailService, private loginService: loginService) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();

    if (this.loginService.typeOfLogin == "Player") {
      this.playerBinding = this.loginService.playerInSession;
    }

    if (this.loginService.typeOfLogin == "Club") {
      this.clubBinding = this.loginService.clubInSession;
    }
  }

  createFormControls() {
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern("[^ @]*@[^ @]*")
    ]);

    this.message = new FormControl();
  }

  createForm() {
    this.form = new FormGroup({
      email: this.email,
      message: this.message,
    });
  }

  onSubmit(form: NgForm) {
    // if (this.form.valid) {
    //   console.log("Form Submitted!");
    //   console.log(this.form);
    //   console.log(this.form.value);
    //   this.emailService.sendContactEmail(this.form);
    //   this.form.reset();
    // }
    // else{
    //   console.log("Form not Submitted!");
    // }
    console.log(this.form)
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }
  
}
