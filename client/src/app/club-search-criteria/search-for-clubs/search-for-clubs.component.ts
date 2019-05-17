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
  clubList: Club[] = [];
  constructor(private searchService: searchService, private router: Router) {}

  ngOnInit() {
    for (let i = 0; i < this.searchService.searchForClubsResult.length && i < 5; i++) {
        this.clubList.push(this.searchService.searchForClubsResult[i]);
    }
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
