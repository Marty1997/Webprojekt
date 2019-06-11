import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Club } from "../models/club.model";
import { Player } from "../models/player.model";
import { SquadPlayer } from '../models/squadPlayer.model';
import { TrainingHours } from '../models/trainingHours.model';
import { JobPosition } from '../models/jobPosition';
import { NationalTeam } from '../models/nationalTeam.model';
import { JsonPipe } from '@angular/common';

@Injectable()
export class deleteService {
    
  constructor(private http: HttpClient) {}

  deletePlayer(player: Player) {
    let url = "https://localhost:44310/api/Player/Delete";
    console.log(player);
    return this.http.post(url, player);
  }

  deleteClub() {
    let url = "https://localhost:44310/api/Club/DeleteClub";
    return this.http.post(url, null);
  }
  
  deleteSquadPlayer(id: number) {
    let url = "https://localhost:44310/api/Club/DeleteSquadPlayer";
    const data = {
      id: id.toString(),
    }
    return this.http.post(url, data);
  }

  deleteTrainingHours(id: number) {
    let url = "https://localhost:44310/api/Club/DeleteTrainingHours";
    const data = {
      id: id.toString(),
    }
    return this.http.post(url, data);
  }

  deleteOpenPosition(id: number) {
    let url = "https://localhost:44310/api/Club/DeleteJobPosition";
    const data = {
      id: id.toString(),
    }
    return this.http.post(url, data);
  }

  deleteNationalTeam(id: number) {
    let url = "https://localhost:44310/api/Club/DeleteNationalTeam";
    return this.http.post(url, id);
  }

  deleteValuesAndPreferences() {
    let url = "https://localhost:44310/api/Club/DeleteValuesAndPreferences";
    return this.http.post(url, null);
  }
}
