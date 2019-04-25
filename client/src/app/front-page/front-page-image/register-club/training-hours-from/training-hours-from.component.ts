import { Component, OnInit, Input } from '@angular/core';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

@Component({
  selector: 'app-training-hours-from',
  templateUrl: './training-hours-from.component.html',
  styleUrls: ['./training-hours-from.component.css']
})
export class TrainingHoursFromComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() controlName: string;
  @Input() matcher: ErrorStateMatcher;

  trainingHours: any[] = [
    {value: '00:00'}, {value: '00:15'}, {value: '00:30'}, {value: '00:45'},
    {value: '01:00'}, {value: '01:15'}, {value: '01:30'}, {value: '01:45'},
    {value: '02:00'}, {value: '02:15'}, {value: '02:30'}, {value: '02:45'},
    {value: '03:00'}, {value: '03:15'}, {value: '03:30'}, {value: '03:45'},
    {value: '04:00'}, {value: '04:15'}, {value: '04:30'}, {value: '04:45'},
    {value: '05:00'}, {value: '05:15'}, {value: '05:30'}, {value: '05:45'},
    {value: '06:00'}, {value: '06:15'}, {value: '06:30'}, {value: '06:45'},
    {value: '07:00'}, {value: '07:15'}, {value: '07:30'}, {value: '07:45'},
    {value: '08:00'}, {value: '08:15'}, {value: '08:30'}, {value: '08:45'},
    {value: '09:00'}, {value: '09:15'}, {value: '09:30'}, {value: '09:45'},
    {value: '10:00'}, {value: '10:15'}, {value: '10:30'}, {value: '10:45'},
    {value: '11:00'}, {value: '11:15'}, {value: '11:30'}, {value: '11:45'},
    {value: '12:00'}, {value: '12:15'}, {value: '12:30'}, {value: '12:45'},
    {value: '13:00'}, {value: '13:15'}, {value: '13:30'}, {value: '13:45'},
    {value: '14:00'}, {value: '14:15'}, {value: '14:30'}, {value: '14:45'},
    {value: '15:00'}, {value: '15:15'}, {value: '15:30'}, {value: '15:45'},
    {value: '16:00'}, {value: '16:15'}, {value: '16:30'}, {value: '16:45'},
    {value: '17:00'}, {value: '17:15'}, {value: '17:30'}, {value: '17:45'},
    {value: '18:00'}, {value: '18:15'}, {value: '18:30'}, {value: '18:45'},
    {value: '19:00'}, {value: '19:15'}, {value: '19:30'}, {value: '19:45'},
    {value: '20:00'}, {value: '20:15'}, {value: '20:30'}, {value: '20:45'},
    {value: '21:00'}, {value: '21:15'}, {value: '21:30'}, {value: '21:45'},
    {value: '22:00'}, {value: '22:15'}, {value: '22:30'}, {value: '22:45'},
    {value: '23:00'}, {value: '23:15'}, {value: '23:30'}, {value: '23:45'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
