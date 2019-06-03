import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Club } from "../models/club.model";
import { Player } from "../models/player.model";
import { TrainingHours } from '../models/trainingHours.model';
import { SquadPlayer } from '../models/squadPlayer.model';
import { JobPosition } from '../models/jobPosition';

@Injectable()
export class updateService {
  constructor(private http: HttpClient) {}

  updatePlayer(player: Player) {
    let url = "https://localhost:44310/api/Player/Update";
    console.log(player);
    return this.http.post(url, player);
  }

  updateClubInfo(club: Club) {
    let url = "https://localhost:44310/api/Club/UpdateClubInfo";
    return this.http.post(url, club);
  }

  updateTrainingSchedule(trainingHours: TrainingHours) {
    let url = "https://localhost:44310/api/Club/UpdateTrainingHours";
    return this.http.post(url, trainingHours);
  }

  addClubSquadPlayer(squadPlayer: SquadPlayer) {
    let url = "https://localhost:44310/api/Club/AddSquadPlayer";
    return this.http.post(url, squadPlayer);
  }

  addClubOpenPosition(jobPosition: JobPosition) {
    let url = "https://localhost:44310/api/Club/AddJobPosition";
    return this.http.post(url, jobPosition);
  }

  updateClubStaff(club: Club) {
     let url = "https://localhost:44310/api/Club/UpdateClubStaff";
     return this.http.post(url, club);
  }

   updateValuesAndPreferences(club: Club) {
     let url = "https://localhost:44310/api/Club/UpdateClubValuesAndPreferences";
     return this.http.post(url, club);
   }

   updateClubProfile(club: Club) {
     let url = "https://localhost:44310/api/Club/UpdateClubProfile";
     return this.http.post(url, club);
   }

   updateClubFacility(club: Club) {
     let url = "https://localhost:44310/api/Club/UpdateClubFacility";
     return this.http.post(url, club);
   }
}
