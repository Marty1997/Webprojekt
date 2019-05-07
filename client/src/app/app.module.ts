import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { CdkStepperModule, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepperModule, MatTabsModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatSelectModule, MatRadioModule, MatIconModule, MatCardModule, MatCheckboxModule, MatTableModule, ErrorStateMatcher, MatMenuModule, MatDividerModule, MatDatepickerModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialFileInputModule } from 'ngx-material-file-input';

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
import { RegisterClubComponent } from './front-page/front-page-image/register-club/register-club.component';
import { TrainingHoursFromComponent } from './front-page/front-page-image/register-club/training-hours-from/training-hours-from.component';
import { TrainingHoursToComponent } from './front-page/front-page-image/register-club/training-hours-to/training-hours-to.component';
import { loginService } from './services/loginService';
import { AuthGuardService } from './services/authGuardService';
import { TokenInterceptor } from './services/TokenInterceptor';
import { ContactAdviserComponent } from './multi-page/contact-adviser/contact-adviser.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { HeaderComponent } from './header/header.component';
import { PlayerSearchCriteriaComponent } from './player-search-criteria/player-search-criteria.component';

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
    RegisterClubComponent,
    TrainingHoursFromComponent,
    TrainingHoursToComponent,
    ContactAdviserComponent,
    HeaderComponent,
    PlayerSearchCriteriaComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    TooltipModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: FrontPageComponent, pathMatch: 'full' },
      { path: 'club-dashboard', component: ClubDashboardComponent, canActivate: [AuthGuardService] },
      { path: 'player-dashboard', component: PlayerDashboardComponent, canActivate: [AuthGuardService] },
      { path: 'search-for-clubs', component: SearchForClubsComponent, canActivate: [AuthGuardService] },
      { path: 'search-for-players', component: SearchForPlayersComponent, canActivate: [AuthGuardService] },
      { path: 'player-search-criteria', component: PlayerSearchCriteriaComponent, canActivate: [AuthGuardService] },
      { path: 'player-profile/:id', component: PlayerDashboardComponent, canActivate: [AuthGuardService] },
      { path: 'club-how-to', component: ForClubsComponent },
      { path: 'player-how-to', component: ForPlayersComponent }
    ]),
    ModalModule.forRoot(),
    CarouselModule.forRoot(),
    AccordionModule.forRoot(),
    CdkStepperModule,
      MatStepperModule, MatTabsModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatSelectModule, MatRadioModule, MatIconModule,
      MatPaginatorModule, MatCheckboxModule, MatTableModule, MatDatepickerModule, MatMomentDateModule, MatMenuModule, MatDividerModule,
    MatCardModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialFileInputModule
  ],
  providers: [
    ErrorStateMatcher,
    loginService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
