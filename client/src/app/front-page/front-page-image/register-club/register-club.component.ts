import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormGroupDirective, NgForm, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register-club',
  templateUrl: './register-club.component.html',
  styleUrls: ['./register-club.component.css']
})
export class RegisterClubComponent implements OnInit {
  @Input() modalRef: any;
  hide = true; // password visibility
  clubRequiredInfoFormGroup: FormGroup;
  trainingScheduleFormGroup: FormGroup;


  // validate
  validate = new MyErrorStateMatcher();
  numbersOnlyRegex = /^[0-9]*$/;
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  clubNameControl = new FormControl('', Validators.required);
  countryControl = new FormControl('', Validators.required);
  leagueControl = new FormControl('', Validators.required);
  streetAddressControl = new FormControl('', Validators.required);
  streetAddressLineTwoControl = new FormControl('', Validators.required);
  cityControl = new FormControl('', Validators.required);
  stateControl = new FormControl('', Validators.required);
  zipcodeControl = new FormControl('', Validators.required);

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.clubRequiredInfoFormGroup = this._formBuilder.group({
      email: this.emailControl,
      password: this.passwordControl,
      clubName: this.clubNameControl,
      country: this.countryControl,
      league: this.leagueControl,
      streetAddress: this.streetAddressControl,
      streetAddressLineTwo: this.streetAddressLineTwoControl,
      city: this.cityControl,
      state: this.stateControl,
      zipcode: this.zipcodeControl
    });
    this.trainingScheduleFormGroup = this._formBuilder.group({
      
    });
  }

}
