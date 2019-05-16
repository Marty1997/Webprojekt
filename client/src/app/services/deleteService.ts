import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Club } from "../models/club.model";
import { Player } from "../models/player.model";
import { SquadPlayer } from '../models/squadPlayer.model';
import { TrainingHours } from '../models/trainingHours.model';
import { JobPosition } from '../models/jobPosition';

@Injectable()
export class deleteService {
  
  constructor(private http: HttpClient) {}

  deletePlayer(player: Player) {
    let url = "https://localhost:44310/api/Player/Delete";
    console.log(player);
    return this.http.post(url, player).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  deleteClub(club: Club) {
    let url = "https://localhost:44310/api/Club/Delete";
    return this.http.post(url, club).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  deleteSquadPlayer(squadPlayer: SquadPlayer[]) {
    let url = "https://localhost:44310/api/Club/DeleteSquadPlayer";
    return this.http.post(url, squadPlayer).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  deleteTrainingHours(trainingHours: TrainingHours[]) {
    let url = "https://localhost:44310/api/Club/DeleteTrainingHours";
    return this.http.post(url, trainingHours).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  deleteClubValue(clubValue: string[]) {
    let url = "https://localhost:44310/api/Club/DeleteClubValue";
    return this.http.post(url, clubValue).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  deleteClubPreference(clubPreference: string[]) {
    let url = "https://localhost:44310/api/Club/DeleteClubPreference";
    return this.http.post(url, clubPreference).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  deleteJobPosition(jobPosition: JobPosition[]) {
    let url = "https://localhost:44310/api/Club/DeleteClubValue";
    return this.http.post(url, clubValue).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  deleteJobPositionStrength() {
    this.deleteService.deleteJobPositionStrength();
  }

  cancel() {
    this.clubBinding = this.loginService.clubInSession;
  }

}
