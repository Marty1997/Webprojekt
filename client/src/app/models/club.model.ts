import { TrainingHours } from '../models/trainingHours.model'
import { SquadPlayer } from '../models/squadPlayer.model'
import { Value } from '../models/value.model'
import { Preference } from '../models/preference.model'
import { Position } from '../models/position.model'

export class Club {
    // required info
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
    valuesList : Value[] = [];
    preferenceList : Preference[] = [];
    openPositionList : Position[] = [];

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

    constructor() {}
}