// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { Directionality } from '@angular/cdk/bidi';
// import { CdkStepper } from '@angular/cdk/stepper';

// @Component({
//   selector: 'app-register-player',
//   templateUrl: './register-player.component.html',
//   styleUrls: ['./register-player.component.css'],
//   providers: [{ provide: CdkStepper, useExisting: RegisterPlayerComponent }]
// })
// export class RegisterPlayerComponent extends CdkStepper implements OnInit {

//     constructor(dir: Directionality, changeDetectorRef: ChangeDetectorRef) {
//         super(dir, changeDetectorRef);
//     }

//     onClick(index: number) {
//         this.selectedIndex = index;
//     }

//     ngOnInit() {
//     }

// }

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-register-player',
    templateUrl: './register-player.component.html',
    styleUrls: ['./register-player.component.css']
})
export class RegisterPlayerComponent implements OnInit {
  isLinear = true;
  personalInfoFormGroup: FormGroup;
  additionalInfoFormGroup: FormGroup;
  strengthWeaknessFormGroup: FormGroup;
  sportCvFormGroup: FormGroup;
  nationalTeamFormGroup: FormGroup;
  

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.personalInfoFormGroup = this._formBuilder.group({
      emailCtrl: ['', Validators.required],
      passwordCtrl: ['', Validators.required],
      firstNameCtrl: ['', Validators.required],
      lastNameCtrl: ['', Validators.required],
      countryCtrl: ['', Validators.required],
      cityCtrl: ['', Validators.required],
      dayCtrl: ['', Validators.required],
      monthCtrl: ['', Validators.required],
      yearCtrl: ['', Validators.required]
    });
    this.additionalInfoFormGroup = this._formBuilder.group({
      
    });
    this.sportCvFormGroup = this._formBuilder.group({

    });
    this.strengthWeaknessFormGroup = this._formBuilder.group({

    });
    this.nationalTeamFormGroup = this._formBuilder.group({

    });
  }
}