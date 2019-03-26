import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForPlayersComponent } from './search-for-players.component';

describe('SearchForPlayersComponent', () => {
  let component: SearchForPlayersComponent;
  let fixture: ComponentFixture<SearchForPlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchForPlayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchForPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
