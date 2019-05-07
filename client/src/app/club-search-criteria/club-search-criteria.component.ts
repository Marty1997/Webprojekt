import { Component, OnInit, ViewChild } from "@angular/core";
import { searchService } from "../services/searchService";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ClubSearchCriteria } from "../models/clubSearchCriteria.model";
import { MatCheckbox } from "@angular/material";

@Component({
  selector: "app-club-search-criteria",
  templateUrl: "./club-search-criteria.component.html",
  styleUrls: ["./club-search-criteria.component.css"],
  providers: [searchService]
})
export class ClubSearchCriteriaComponent implements OnInit {
  searchForm: FormGroup;
  searchCriteria: ClubSearchCriteria = new ClubSearchCriteria();
  countryList: string[] = ["Denmark", "Sweden", "Norway"];
  leagueList: string[] = ["First League", "Second League", "Third League"];
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
  @ViewChild("val1") val1: MatCheckbox;
  @ViewChild("val2") val2: MatCheckbox;
  @ViewChild("val3") val3: MatCheckbox;
  @ViewChild("val4") val4: MatCheckbox;
  @ViewChild("val5") val5: MatCheckbox;
  // preferences
  @ViewChild("pref1") pref1: MatCheckbox;
  @ViewChild("pref2") pref2: MatCheckbox;
  @ViewChild("pref3") pref3: MatCheckbox;
  @ViewChild("pref4") pref4: MatCheckbox;
  @ViewChild("pref5") pref5: MatCheckbox;

  constructor(
    private _formbuilder: FormBuilder,
    private searchService: searchService
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
    console.log(this.searchCriteria);
    this.searchService.searchForClubs(this.searchCriteria);
  }

  validateSearchCriteria() {
    if (this.searchForm.value.country != "") {
      this.searchCriteria.country = this.searchForm.value.country;
    } else {
      this.searchCriteria.country = null;
    }

    if (this.searchForm.value.league != "") {
      this.searchCriteria.league = this.searchForm.value.league;
    } else {
      this.searchCriteria.league = null;
    }

    if (this.searchForm.value.position != "") {
      this.searchCriteria.position = this.searchForm.value.position;
    } else {
      this.searchCriteria.position = null;
    }

    if (this.searchForm.value.season != "") {
      this.searchCriteria.season = this.searchForm.value.season;
    } else {
      this.searchCriteria.season = null;
    }

    // values
    if (this.val1.checked) {
      this.searchCriteria.valuesList.push(this.val1.value);
    }
    if (this.val2.checked) {
      this.searchCriteria.valuesList.push(this.val2.value);
    }
    if (this.val3.checked) {
      this.searchCriteria.valuesList.push(this.val3.value);
    }
    if (this.val4.checked) {
      this.searchCriteria.valuesList.push(this.val4.value);
    }
    if (this.val5.checked) {
      this.searchCriteria.valuesList.push(this.val5.value);
    }

    // preferences
    if (this.pref1.checked) {
      this.searchCriteria.preferencesList.push(this.pref1.value);
    }
    if (this.pref2.checked) {
      this.searchCriteria.preferencesList.push(this.pref2.value);
    }
    if (this.pref3.checked) {
      this.searchCriteria.preferencesList.push(this.pref3.value);
    }
    if (this.pref4.checked) {
      this.searchCriteria.preferencesList.push(this.pref4.value);
    }
    if (this.pref5.checked) {
      this.searchCriteria.preferencesList.push(this.pref5.value);
    }
  }
}
