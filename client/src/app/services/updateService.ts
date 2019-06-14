import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Club } from "../models/club.model";
import { Player } from "../models/player.model";

@Injectable()
export class updateService {
  constructor(private http: HttpClient) {}

  resetPasswordWithToken(form: any, urlToken: string) {
    const body = {
      url: urlToken,
      password: form.value.newPassword
  };
    let url = "https://localhost:44310/api/email/HandlePasswordReset";
    return this.http.post(url, body);
  }

  updatePlayer(player: Player) {
    let url = "https://localhost:44310/api/Player/Update";
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

  updateClub(club: Club) {
    let url = "https://localhost:44310/api/Club/Update";
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
}
