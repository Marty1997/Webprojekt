import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForClubsComponent } from './search-for-clubs.component';

describe('SearchForClubsComponent', () => {
  let component: SearchForClubsComponent;
  let fixture: ComponentFixture<SearchForClubsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchForClubsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchForClubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
