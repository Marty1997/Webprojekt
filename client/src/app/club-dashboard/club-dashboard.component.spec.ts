import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubDashboardComponent } from './club-dashboard.component';

describe('ClubDashboardComponent', () => {
  let component: ClubDashboardComponent;
  let fixture: ComponentFixture<ClubDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
