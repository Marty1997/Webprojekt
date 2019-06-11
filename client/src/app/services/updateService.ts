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

  updatePlayerInfo(player: Player) {
    let url = "https://localhost:44310/api/Player/UpdateInfo";
    return this.http.post(url, player);
  }

  updatePlayerAdditionalInfo(player: Player) {
    let url = "https://localhost:44310/api/Player/UpdateAdditionalInfo";
    return this.http.post(url, player);
  }

  updateStrengthsAndWeaknesses(player: Player) {
    let url = "https://localhost:44310/api/Player/UpdateStrengthsAndWeaknesses";
    return this.http.post(url, player); 
  }

  updateClubInfo(club: Club) {
    let url = "https://localhost:44310/api/Club/UpdateInfo";
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
    let url = "https://localhost:44310/api/Club/AddOpenPosition";
    return this.http.post(url, jobPosition);
  }

  updateClubStaff(club: Club) {
     let url = "https://localhost:44310/api/Club/UpdateStaff";
     return this.http.post(url, club);
  }

   updateClubValuesAndPreferences(club: Club) {
     let url = "https://localhost:44310/api/Club/UpdateValuesAndPreferences";
     return this.http.post(url, club);
   }

   updateClubProfile(club: Club) {
     let url = "https://localhost:44310/api/Club/UpdateProfile";
     return this.http.post(url, club);
   }

   updateClubFacility(club: Club) {
     let url = "https://localhost:44310/api/Club/UpdateFacility";
     return this.http.post(url, club);
   }
}
