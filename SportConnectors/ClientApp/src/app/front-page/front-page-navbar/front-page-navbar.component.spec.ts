import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontPageNavbarComponent } from './front-page-navbar.component';

describe('FrontPageNavbarComponent', () => {
  let component: FrontPageNavbarComponent;
  let fixture: ComponentFixture<FrontPageNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontPageNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontPageNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
