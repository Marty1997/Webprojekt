import { Component, OnInit } from '@angular/core';
import { Club } from '../../models/club.model';
import { searchService } from '../../services/searchService';

@Component({
  selector: 'app-search-for-clubs',
  templateUrl: './search-for-clubs.component.html',
  styleUrls: ['./search-for-clubs.component.css'],
  providers: [searchService]
})
export class SearchForClubsComponent implements OnInit {

  clubList: Club[] = [];
  constructor(private searchService: searchService) { }

  ngOnInit() {
    this.clubList = this.searchService.searchForClubsResult;
    console.log(this.clubList);
  }

}
