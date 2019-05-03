import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAdviserComponent } from './contact-adviser.component';

describe('ContactAdviserComponent', () => {
  let component: ContactAdviserComponent;
  let fixture: ComponentFixture<ContactAdviserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactAdviserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAdviserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
