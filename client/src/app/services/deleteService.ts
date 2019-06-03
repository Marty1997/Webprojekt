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
    return this.http.post(url, player);
  }

  deleteClub(club: Club) {
    let url = "https://localhost:44310/api/Club/Delete";
    return this.http.post(url, club);
  }
  
  deleteSquadPlayer(id: number) {
    let url = "https://localhost:44310/api/Club/DeleteSquadPlayer";
    return this.http.post(url, id);
  }

  deleteTrainingHours(id: number) {
    let url = "https://localhost:44310/api/Club/DeleteTrainingHours";
    return this.http.post(url, id);
  }

  deleteOpenPosition(id: number) {
    let url = "https://localhost:44310/api/Club/DeleteJobPosition";
    return this.http.post(url, id);
  }

  deleteNationalTeam(id: number) {
    let url = "https://localhost:44310/api/Club/DeleteNationalTeam";
    return this.http.post(url, id);
  }
}
