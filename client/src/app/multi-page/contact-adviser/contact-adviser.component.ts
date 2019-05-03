import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-adviser',
  templateUrl: './contact-adviser.component.html',
  styleUrls: ['./contact-adviser.component.css']
})

export class ContactAdviserComponent implements OnInit {
  
  isCollapsed: boolean = true;

  form: FormGroup;
  email: FormControl;

  constructor() { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createFormControls() {
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern("[^ @]*@[^ @]*")
    ]);
  }

  createForm() {
    this.form = new FormGroup({
      email: this.email,
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log("Form Submitted!");
      this.form.reset();
    }
    else{
      console.log("Form not Submitted!");
    }
  }

  toggle(){
    this.isCollapsed = !this.isCollapsed;
  }

}
