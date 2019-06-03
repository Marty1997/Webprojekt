import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Club } from "../models/club.model";
import { Player } from "../models/player.model";
import { SquadPlayer } from '../models/squadPlayer.model';
import { TrainingHours } from '../models/trainingHours.model';
import { JobPosition } from '../models/jobPosition';
import { NationalTeam } from '../models/nationalTeam.model';

@Injectable()
export class deleteService {
    
  constructor(private http: HttpClient) {}

  deletePlayer(player: Player) {
    let url = "https://localhost:44310/api/Player/Delete";
    console.log(player);
    return this.http.post(url, player).subscribe();
  }

  deleteClub(club: Club) {
    let url = "https://localhost:44310/api/Club/Delete";
    return this.http.post(url, club).subscribe();
  }
  
  deleteSquadPlayer(id: number) {
    let url = "https://localhost:44310/api/Club/DeleteSquadPlayer";
    return this.http.post(url, id).subscribe();
  }

  deleteTrainingHours(id: number) {
    let url = "https://localhost:44310/api/Club/DeleteTrainingHours";
    return this.http.post(url, id).subscribe();
  }

  deleteClubValue(clubValueList: string[]) {
    let url = "https://localhost:44310/api/Club/DeleteClubValue";
    return this.http.post(url, clubValueList).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  deleteClubPreference(clubPreferenceList: string[]) {
    let url = "https://localhost:44310/api/Club/DeleteClubPreference";
    return this.http.post(url, clubPreferenceList).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  deleteJobPosition(jobPositionList: JobPosition[]) {
    let url = "https://localhost:44310/api/Club/DeleteJobPosition";
    return this.http.post(url, jobPositionList).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  deleteJobPositionStrength(jobPositionStrengthList: string[]) {
    let url = "https://localhost:44310/api/Club/DeleteJobPositionStrength";
    return this.http.post(url, jobPositionStrengthList).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  
  deleteNationalTeam(nationalTeamList: NationalTeam[]) {
    let url = "https://localhost:44310/api/Club/DeleteNationalTeam";
    return this.http.post(url, nationalTeamList).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  deletePlayerWeakness(playerWeaknessList: string[]) {
    let url = "https://localhost:44310/api/Club/DeletePlayerWeakness";
    return this.http.post(url, playerWeaknessList).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  deletePlayerStrength(playerStrengthList: string[]) {
    let url = "https://localhost:44310/api/Club/DeletePlayerStrength";
    return this.http.post(url, playerStrengthList).subscribe(
      (success) => {
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
  }

  deleteClubRegularTrainingSchedule(id: number) {
    let url = "https://localhost:44310/api/Club/DeleteClubRegularTrainingSchedule";
    return this.http.post(url, id).subscribe();
  }

  deleteClubFitnessTrainingSchedule(id: number) {
    let url = "https://localhost:44310/api/Club/DeleteClubFitnessTrainingSchedule";
    return this.http.post(url, id).subscribe();
  }


}
