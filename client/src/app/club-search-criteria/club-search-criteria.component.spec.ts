import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubSearchCriteriaComponent } from './club-search-criteria.component';

describe('ClubSearchCriteriaComponent', () => {
  let component: ClubSearchCriteriaComponent;
  let fixture: ComponentFixture<ClubSearchCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubSearchCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubSearchCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
