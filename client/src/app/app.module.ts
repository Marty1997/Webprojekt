import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { CdkStepperModule, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepperModule, MatTabsModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatSelectModule, MatRadioModule, MatIconModule, MatCardModule, MatCheckboxModule, MatTableModule, ErrorStateMatcher, MatMenuModule, MatDividerModule, MatDatepickerModule, MatExpansionModule } from '@angular/material';
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
import { SearchForPlayersComponent } from './player-search-criteria/search-for-players/search-for-players.component';
import { SearchForClubsComponent } from './club-search-criteria/search-for-clubs/search-for-clubs.component';
import { PlayerDashboardComponent } from './player-dashboard/player-dashboard.component';
import { ClubDashboardComponent } from './club-dashboard/club-dashboard.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { RegisterPlayerComponent } from './front-page/front-page-image/register-player/register-player.component';
import { RegisterClubComponent } from './front-page/front-page-image/register-club/register-club.component';
import { TrainingHoursFromComponent } from './front-page/front-page-image/register-club/training-hours-from/training-hours-from.component';
import { TrainingHoursToComponent } from './front-page/front-page-image/register-club/training-hours-to/training-hours-to.component';
import { loginService } from './services/loginService';
import { errorService } from './services/errorService';
import { updateService } from './services/updateService';
import { deleteService } from './services/deleteService';
import { FileService } from './services/FileService';
import { searchService } from './services/searchService';
import { AuthGuardService } from './services/authGuardService';
import { ErrorsHandler } from './services/errorsHandling';
import { TokenInterceptor } from './services/TokenInterceptor';
import { ContactAdviserComponent } from './multi-page/contact-adviser/contact-adviser.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { HeaderComponent } from './header/header.component';
import { PlayerSearchCriteriaComponent } from './player-search-criteria/player-search-criteria.component';
import { ClubSearchCriteriaComponent } from './club-search-criteria/club-search-criteria.component';
import { LoadingIconComponent } from './multi-page/loading-icon/loading-icon.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UpdateClubComponent } from './club-dashboard/update-club/update-club.component';
import { UpdatePlayerComponent } from './player-dashboard/update-player/update-player.component';
import { ConfirmationDialogComponent } from './multi-page/confirmation-dialog/confirmation-dialog.component';
import { UpdateMessageComponent } from './multi-page/update-message/update-message.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PrivacyPolicyComponent } from './multi-page/privacy-policy/privacy-policy.component';

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
    ClubSearchCriteriaComponent,
    LoadingIconComponent,
    UpdateClubComponent,
    UpdatePlayerComponent,
    ConfirmationDialogComponent,
    UpdateMessageComponent,
    ErrorPageComponent,
    ResetPasswordComponent,
    PrivacyPolicyComponent,
    
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
      { path: 'club-search-criteria', component: ClubSearchCriteriaComponent, canActivate: [AuthGuardService] },
      { path: 'club-profile/:id', component: ClubDashboardComponent, canActivate: [AuthGuardService], },
      { path: 'club-how-to', component: ForClubsComponent },
      { path: 'update-club', component: UpdateClubComponent/*, canActivate: [AuthGuardService]*/ },
      { path: 'update-player', component: UpdatePlayerComponent, canActivate: [AuthGuardService] },
      { path: 'player-how-to', component: ForPlayersComponent }, 
      { path: 'error', component: ErrorPageComponent },
      { path: 'reset-password/:token', component: ResetPasswordComponent},
      { path: 'reset-password', component: ResetPasswordComponent, canActivate: [AuthGuardService]},

    ], ),
    ModalModule.forRoot(),
    CarouselModule.forRoot(),
    AccordionModule.forRoot(),
    PopoverModule.forRoot(),
    CdkStepperModule,
      MatStepperModule, MatTabsModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatSelectModule, MatRadioModule, MatIconModule,
      MatPaginatorModule, MatCheckboxModule, MatTableModule, MatDatepickerModule, MatMomentDateModule, MatMenuModule, MatDividerModule,
    MatCardModule, MatExpansionModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialFileInputModule,
    NgxSpinnerModule
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ],
  providers: [
    ErrorStateMatcher,
    loginService,
    FileService,
    errorService,
    updateService,
    deleteService,
    searchService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: ErrorHandler, useClass: ErrorsHandler},
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
