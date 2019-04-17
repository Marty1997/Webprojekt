import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { CdkStepperModule } from '@angular/cdk/stepper';
import { MatStepperModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatSelectModule, MatRadioModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";


import { AppComponent } from './app.component';
import { FooterComponent } from './multi-page/footer/footer.component';
import { FrontPageNavbarComponent } from './front-page/front-page-navbar/front-page-navbar.component';
import { ForPlayersComponent } from './multi-page/for-players/for-players.component';
import { ForClubsComponent } from './multi-page/for-clubs/for-clubs.component';
import { AboutUsComponent } from './front-page/about-us/about-us.component';
import { FrontPageImageComponent } from './front-page/front-page-image/front-page-image.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { SearchForPlayersComponent } from './search-for-players/search-for-players.component';
import { SearchForClubsComponent } from './search-for-clubs/search-for-clubs.component';
import { PlayerDashboardComponent } from './player-dashboard/player-dashboard.component';
import { ClubDashboardComponent } from './club-dashboard/club-dashboard.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { RegisterPlayerComponent } from './front-page/front-page-image/register-player/register-player.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    FrontPageNavbarComponent,
    ForPlayersComponent,
    ForClubsComponent,
    AboutUsComponent,
    FrontPageImageComponent,
    FrontPageComponent,
    SearchForPlayersComponent,
    SearchForClubsComponent,
    PlayerDashboardComponent,
    ClubDashboardComponent,
    RegisterPlayerComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    TooltipModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: FrontPageComponent, pathMatch: 'full' },
      { path: 'club-dashboard', component: ClubDashboardComponent },
      { path: 'player-dashboard', component: PlayerDashboardComponent },
      { path: 'search-for-clubs', component: SearchForClubsComponent },
      { path: 'search-for-players', component: SearchForPlayersComponent },
    ]),
    ModalModule.forRoot(),
    CarouselModule.forRoot(),
    AccordionModule.forRoot(),
    CdkStepperModule,
    MatStepperModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatSelectModule, MatRadioModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
