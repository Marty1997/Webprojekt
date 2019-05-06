import { TrainingHours } from '../models/trainingHours.model'
import { SquadPlayer } from '../models/squadPlayer.model'
import { JobPosition } from './jobPosition';

export class Club {
    // required info
    password: string
    isAvailable: boolean;
    name: string = "";
    email: string = "";
    league: string = "";
    country: string = "";
    streetAddress: string = "";
    streetNumber: number; 
    city: string = "";    
    zipcode: number;      
    trainingHoursList : TrainingHours[] = [];
    currentSquadPlayersList : SquadPlayer[] = [];
    nextYearSquadPlayersList : SquadPlayer[] = [];
    jobPositionsList : JobPosition[] = [];

    // staff
    trainer: string = "";
    assistantTrainer: string = "";
    physiotherapist: string = "";
    assistantPhysiotherapist: string = "";
    manager: string = "";

    // files
    logo: File;
    facilityPictures: FileList;
    
    // values/preferences
    valueDescription: string = "";
    preferenceDescription: string = "";
    valuesList : string[] = [];
    preferenceList : string[] = [];

    constructor() {}

    buildClub(succes:any, club: Club)  {
        this.isAvailable = succes.isAvailable;
        this.name = succes.name;
        this.email = succes.email;
        this.league = succes.league;
        this.country = succes.country;
        this.streetAddress = succes.streetAddress;
        this.streetNumber = succes.streetNumber;
        this.city = succes.city; 
        this.zipcode = succes.zipcode; 
        this.trainingHoursList = succes.trainingHoursList;
        this.currentSquadPlayersList = succes.currentSquadPlayersList;
        this.nextYearSquadPlayersList = succes.nextYearSquadPlayersList;
        this.jobPositionsList = succes.jobPositionsList;

        // staff
        this.trainer = succes.trainer;
        this.assistantTrainer = succes.assistantTrainer;
        this.physiotherapist = succes.physiotherapist;
        this.assistantPhysiotherapist = succes.assistantPhysiotherapist;
        this.manager = succes.manager;

        // values/preferences
        this.valueDescription = succes.valueDescription;
        this.preferenceDescription = succes.preferenceDescription;
        this.valuesList = succes.valuesList;
        this.preferenceList = succes.preferenceList;

        return club;
    }
}