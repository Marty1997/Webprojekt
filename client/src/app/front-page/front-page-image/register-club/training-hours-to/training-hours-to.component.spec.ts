import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingHoursToComponent } from './training-hours-to.component';

describe('TrainingHoursToComponent', () => {
  let component: TrainingHoursToComponent;
  let fixture: ComponentFixture<TrainingHoursToComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingHoursToComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingHoursToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
