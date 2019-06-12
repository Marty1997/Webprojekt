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

  deleteClub() {
    let url = "https://localhost:44310/api/Club/DeleteClub";
    return this.http.post(url, null);
  }

  deletePlayer() {
    let url = "https://localhost:44310/api/Player/DeletePlayer";
    return this.http.post(url, null);
  }
  
  deleteSquadPlayer(id: number) {
    let url = "https://localhost:44310/api/Club/DeleteSquadPlayer";
    const data = {
      id: id.toString(),
    }
    return this.http.post(url, data);
  }

  deleteFacilityImage(imagePath: string) {
    let url = "https://localhost:44310/api/Club/DeleteFacilityImage";
    const data = {
      imagePath: imagePath,
    }
    return this.http.post(url, data);
  }

  deleteNationalTeam(id: number) {
    let url = "https://localhost:44310/api/Player/DeleteNationalTeam";
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

  deleteValuesAndPreferences() {
    let url = "https://localhost:44310/api/Club/DeleteValuesAndPreferences";
    return this.http.post(url, null);
  }

  deleteStrengthsAndWeaknesses() {
    let url = "https://localhost:44310/api/Player/DeleteStrengthsAndWeaknesses";
    return this.http.post(url, null);
  }
}
