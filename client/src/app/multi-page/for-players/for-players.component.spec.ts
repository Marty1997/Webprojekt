import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForPlayersComponent } from './for-players.component';

describe('ForPlayersComponent', () => {
  let component: ForPlayersComponent;
  let fixture: ComponentFixture<ForPlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForPlayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
