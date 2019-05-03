import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSearchCriteriaComponent } from './player-search-criteria.component';

describe('PlayerSearchCriteriaComponent', () => {
  let component: PlayerSearchCriteriaComponent;
  let fixture: ComponentFixture<PlayerSearchCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerSearchCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSearchCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
