//import { nameModel } from "../models/name.model";
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';

@Injectable()

export class registerService {
  constructor(private http: HttpClient) {}

  registerPlayer(player: any) /* should be of type playerModel */ {
    let url = "WEB API controller metode";
    return this.http.post(url, player);
  }

}