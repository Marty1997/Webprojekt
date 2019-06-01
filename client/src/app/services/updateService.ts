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
    return this.http.post(url, player).subscribe();
  }

  updateClubInfo(club: Club) {
    let url = "https://localhost:44310/api/Club/UpdateClubInfo";
    return this.http.post(url, club).subscribe();
  }

  updateClubRegularTrainingSchedule(trainingHours: TrainingHours) {
    let url = "https://localhost:44310/api/Club/UpdateClubRegularTrainingSchedule";
    return this.http.post(url, trainingHours).subscribe();
  }

  updateClubFitnessTrainingSchedule(trainingHours: TrainingHours) {
    let url = "https://localhost:44310/api/Club/UpdateClubFitnessTrainingSchedule";
    return this.http.post(url, trainingHours).subscribe();
  }

  updateClubCurrentSeasonSquad(currentSeasonSquad: SquadPlayer[]) {
    let url = "https://localhost:44310/api/Club/UpdateClubCurrentSeasonSquad";
    return this.http.post(url, currentSeasonSquad).subscribe();
  }

  updateNextSeasonSquad(nextSeasonSquad: SquadPlayer[]) {
    let url = "https://localhost:44310/api/Club/UpdateClubNextSeasonSquad";
    return this.http.post(url, nextSeasonSquad).subscribe();
  }

  // updateOpenPosition(jobPositions: JobPosition[]) {
  //   let url = "https://localhost:44310/api/Club/UpdateClubCurrentSeasonSquad";
  //   return this.http.post(url, jobPosition).subscribe();
  // }

  // updateStaff() {
  //   let url = "https://localhost:44310/api/Club/UpdateClubCurrentSeasonSquad";
  //   return this.http.post(url, currentSeasonSquad).subscribe();
  // }

  // updateValuesAndPreferences() {
  //   let url = "https://localhost:44310/api/Club/UpdateClubCurrentSeasonSquad";
  //   return this.http.post(url, currentSeasonSquad).subscribe();
  // }

  // updateClubProfile() {
  //   let url = "https://localhost:44310/api/Club/UpdateClubCurrentSeasonSquad";
  //   return this.http.post(url, currentSeasonSquad).subscribe();
  // }

  // updateClubFacility() {
  //   let url = "https://localhost:44310/api/Club/UpdateClubCurrentSeasonSquad";
  //   return this.http.post(url, currentSeasonSquad).subscribe();
  // }
}
