import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontPageImageComponent } from './front-page-image.component';

describe('FrontPageImageComponent', () => {
  let component: FrontPageImageComponent;
  let fixture: ComponentFixture<FrontPageImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontPageImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontPageImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
