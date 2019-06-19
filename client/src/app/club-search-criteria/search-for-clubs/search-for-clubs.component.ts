import { Component, OnInit } from "@angular/core";
import { Club } from "../../models/club.model";
import { searchService } from "../../services/searchService";
import { Router } from "@angular/router";
import { ViewportScroller } from '@angular/common';

@Component({
  selector: "app-search-for-clubs",
  templateUrl: "./search-for-clubs.component.html",
  styleUrls: ["./search-for-clubs.component.css"]
})
export class SearchForClubsComponent implements OnInit {
  clubList: Club[] = [];
  scrollPosition: number [] = [];
  constructor(private searchService: searchService, private router: Router,private scroller: ViewportScroller) {}

  ngOnInit() {
    // Add the first 5 clubs to the result list
    this.clubList = this.searchService.searchForClubsResult;

    setTimeout(() => {
      if(this.searchService.scrollPosition1 != undefined && this.searchService.scrollPosition2 != undefined) {
        this.scroller.scrollToPosition([this.searchService.scrollPosition1, this.searchService.scrollPosition2]);
      }
      this.searchService.scrollPosition1 = undefined;
      this.searchService.scrollPosition2 = undefined;
    }, 100);
  }

  selectedClub(id: number) {
    this.scrollPosition = this.scroller.getScrollPosition();
    this.searchService.scrollPosition1 = this.scrollPosition[0];
    this.searchService.scrollPosition2 = this.scrollPosition[1];

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
