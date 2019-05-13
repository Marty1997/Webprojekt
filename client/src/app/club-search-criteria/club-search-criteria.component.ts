import { Component, OnInit, ViewChild } from "@angular/core";
import { searchService } from "../services/searchService";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ClubSearchCriteria } from "../models/clubSearchCriteria.model";
import { MatCheckbox } from "@angular/material";
import { Club } from '../models/club.model';
import { loginService } from '../services/loginService';
import { Router } from '@angular/router';

@Component({
  selector: "app-club-search-criteria",
  templateUrl: "./club-search-criteria.component.html",
  styleUrls: ["./club-search-criteria.component.css"]
})
export class ClubSearchCriteriaComponent implements OnInit {
  searchForm: FormGroup;
  searchCriteria: ClubSearchCriteria = new ClubSearchCriteria();
  club: Club = new Club();
  countryList: string[] = ["All Countries", "Denmark", "Sweden", "Norway"];
  leagueList: string[] = ["All Leagues", "First League", "Second League", "Third League"];
  positionList: string[] = [
    "None",
    "Left Wing",
    "Left Back",
    "Playmaker",
    "Pivot",
    "Right Back",
    "Right Wing",
    "Defence"
  ];
  seasonList: string[] = ["None", "Current year", "Next year"];

  // values
  @ViewChild("hardWorking") hardWorking: MatCheckbox;
  @ViewChild("socialCohesion") socialCohesion: MatCheckbox;
  @ViewChild("winningMentality") winningMentality: MatCheckbox;
  // preferences
  @ViewChild("talentDevelopmentClub") talentDevelopmentClub: MatCheckbox;
  @ViewChild("strivesForTitles") strivesForTitles: MatCheckbox;
  @ViewChild("resultOriented") resultOriented: MatCheckbox;
  @ViewChild("processOriented") processOriented: MatCheckbox;

  constructor(
    private _formbuilder: FormBuilder,
    private searchService: searchService,
    private loginService: loginService,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchForm = this._formbuilder.group({
      country: [""],
      league: [""],
      position: [""],
      season: [""]
    });
  }

  searchForClubs() {
    this.validateSearchCriteria();    
    this.searchService.searchForClubsResult = [];
    this.searchService.searchForClubs(this.searchCriteria, this.loginService.playerInSession.id).subscribe(
      (success: Club[]) => {
        success.forEach(element => {
          this.club = element;
          this.searchService.searchForClubsResult.push(this.club);
        });
        this.router.navigate(['/search-for-clubs']);
      },
      (error) => {
        // redirect to error page
      }
    );
  }

  validateSearchCriteria() {
    if (this.searchForm.value.country != "") {
      if(this.searchForm.value.country != "All Countries") {
        this.searchCriteria.country = this.searchForm.value.country;
      } else {
        this.searchCriteria.country = null;
      }
    }

    if (this.searchForm.value.league != "") {
      if(this.searchForm.value.league != "All Leagues") {
        this.searchCriteria.league = this.searchForm.value.league;
      } else {
        this.searchCriteria.league = null;
      }
    }

    if (this.searchForm.value.position != "") {
      if(this.searchForm.value.position != "None") {
        this.searchCriteria.position = this.searchForm.value.position;
      } else {
        this.searchCriteria.position = null;
      }
    }

    if (this.searchForm.value.season != "") {
      if(this.searchForm.value.season != "None") {
        this.searchCriteria.season = this.searchForm.value.season;
      } else {
        this.searchCriteria.season = null;
      }
    }

    // values
    if (this.hardWorking.checked) {
      this.searchCriteria.valuesList.push(this.hardWorking.value);
    }
    if (this.socialCohesion.checked) {
      this.searchCriteria.valuesList.push(this.socialCohesion.value);
    }
    if (this.winningMentality.checked) {
      this.searchCriteria.valuesList.push(this.winningMentality.value);
    }

    // preferences
    if (this.talentDevelopmentClub.checked) {
      this.searchCriteria.preferencesList.push(this.talentDevelopmentClub.value);
    }
    if (this.strivesForTitles.checked) {
      this.searchCriteria.preferencesList.push(this.strivesForTitles.value);
    }
    if (this.resultOriented.checked) {
      this.searchCriteria.preferencesList.push(this.resultOriented.value);
    }
    if (this.processOriented.checked) {
      this.searchCriteria.preferencesList.push(this.processOriented.value);
    }
  }
}
