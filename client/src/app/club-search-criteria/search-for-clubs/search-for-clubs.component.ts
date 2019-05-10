import { Component, OnInit } from '@angular/core';
import { Club } from '../../models/club.model';
import { searchService } from '../../services/searchService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-for-clubs',
  templateUrl: './search-for-clubs.component.html',
  styleUrls: ['./search-for-clubs.component.css'],
  providers: [searchService]
})
export class SearchForClubsComponent implements OnInit {

  clubList: Club[] = [];
  constructor(private searchService: searchService, private router: Router) { }

  ngOnInit() {
    this.clubList = this.searchService.searchForClubsResult;
    console.log(this.clubList);
  }

  selectedClub(id: number) {
    this.searchService.getClubById(id).subscribe(
      (success: Club) => {
        this.searchService.club = success;
        this.router.navigate(['/club-dashboard'])
      },
      (error) => {
        // redirect to error page
      }
    )
  }

}
