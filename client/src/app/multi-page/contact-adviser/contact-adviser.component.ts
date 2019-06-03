import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EmailService } from 'src/app/services/emailService';
import { loginService } from 'src/app/services/loginService';

@Component({
  selector: 'app-contact-adviser',
  templateUrl: './contact-adviser.component.html',
  styleUrls: ['./contact-adviser.component.css'],
  providers: [EmailService]
})

export class ContactAdviserComponent implements OnInit {
  isCollapsed: boolean = true;
  succesMessage: boolean = false;
  errorMessage: boolean = false;
  form: FormGroup;
  message: FormControl;

  constructor(private emailService: EmailService, private loginService: loginService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      message: new FormControl()
    });
  }

  onSubmit() {
      this.emailService.sendContactEmail(this.form.get('message').value).subscribe(
        (success) => {
           this.errorMessage = false;
           this.succesMessage = true;
           this.form.reset();
        },
        (error) => {
           this.errorMessage = true;
        }
    );  
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    this.succesMessage = false;
    this.errorMessage = false;
    this.form.reset();
  }
  
}