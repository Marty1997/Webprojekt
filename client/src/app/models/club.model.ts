import { TrainingHours } from '../models/trainingHours.model'
import { SquadPlayer } from '../models/squadPlayer.model'

export class Club {
    // required info
    password: string
    name: string;
    email: string;
    league: string;
    country: string;
    streetAddress: string;
    streetNumber: string;
    city: string;
    zipcode: string;
    trainingHoursList : TrainingHours[] = [];
    squadPlayersList : SquadPlayer[] = [];
    openPositionList : string[] = [];

    // staff
    trainer: string;
    assistantTrainer: string;
    physiotherapist: string;
    assistantPhysiotherapist: string;
    manager: string;

    // files
    logo: File;
    facilityPictures: FileList;
    
    // values/preferences
    valueDescription: string;
    preferenceDescription: string;
    valuesList : string[] = [];
    preferenceList : string[] = [];

    constructor() {}
}