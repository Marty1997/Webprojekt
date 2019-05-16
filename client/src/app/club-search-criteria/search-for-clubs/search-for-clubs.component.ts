import { Component, OnInit } from "@angular/core";
import { Club } from "../../models/club.model";
import { searchService } from "../../services/searchService";
import { Router } from "@angular/router";

@Component({
  selector: "app-search-for-clubs",
  templateUrl: "./search-for-clubs.component.html",
  styleUrls: ["./search-for-clubs.component.css"]
})
export class SearchForClubsComponent implements OnInit {
  clubList: Club[] = [
    // first 5 clubs as starting value
    this.searchService.searchForClubsResult[0],
    this.searchService.searchForClubsResult[1],
    this.searchService.searchForClubsResult[2],
    this.searchService.searchForClubsResult[3],
    this.searchService.searchForClubsResult[4]
  ];
  constructor(private searchService: searchService, private router: Router) {}

  ngOnInit() {
    // test clubs added to club list
    // this.clubList = this.searchService.searchForClubsResult;
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    this.searchService.searchForClubsResult.push(new Club());
    console.log(this.clubList);
  }

  onScroll() {
    if (this.clubList.length < this.searchService.searchForClubsResult.length) {
      let len = this.clubList.length;
      for (let i = len; i <= len + 2; i++) {
        this.clubList.push(this.searchService.searchForClubsResult[i]);
      }
      console.log(this.searchService.searchForClubsResult);
      
    }
  }

  selectedClub(id: number) {
    this.searchService.getClubById(id).subscribe(
      (success: Club) => {
        console.log(success);
        this.searchService.club = success;
        this.router.navigate(["/club-dashboard"]);
      },
      error => {
        // redirect to error page
      }
    );
  }
}
