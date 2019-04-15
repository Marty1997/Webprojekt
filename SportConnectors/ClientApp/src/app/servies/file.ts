//Lav en service til component som kommunikere med en web service.Der skal også være en model klasse
//Lav en providers: [nameService] i @component der hvor den skal bruges
//i klassens component skriv:
//private nameService: NameServce;
//i construc para myNameService: NameService
//inde i con skrive this.nameService = myNameService;

//eller skriv 1 linje i con para: private nameService : NameService

//  Hvis servicen skal være en singleton (Som ved authentication) så laves provider i app.module i providers
// Så har alle acces til den, for at tjekke om brugeren er logget ind. Det giver en måde for comp at kommunikere via den singleton service

// i NgOnInit kald metoden som laver dit kald til servicen
//constructor(private nameService : Nameservice)
//ngOnInti() {
//  this.nameSerive.getNames().subscribe(
//    (succes:any <- det er et objekt. Any fortæller javascript at det
//          ikke nødvendigvis er et objekt men kan være anything) => (console.log("succes")),
//    (error) => (console.log(error)),
//    () => (console.log("Completed"))
//  )
//}

// Servicen står for at return observable og i comp bruge den til at hente dataen.
// Hvis servicen stod for at hente dataen ville comp blive loadet uden data fordi det er async


//nameList : NameList[] = [] sådan laves en liste

//import { nameModel } from "../models/name.model";
import { Injectable } from '@angular/core'
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Injectable()

export class file {
  constructor(private http: HttpClient) {}

  getSomethingFromWeb() {
    let url = "Din service";
    return this.http.get(url);

  }

}
