import {NationalTeam} from '../models/nationalTeam.model'
import {Position} from '../models/position.model'
import {Strength} from '../models/strength.model'
import {Weakness} from '../models/weakness.model'

export class Player {
    // required info
    email: string;
    firstName: string;
    lastName: string;
    country: string;
    day: string;
    month: string;
    year: string;
    // additional info
    height: string;
    weight: string;
    bodyfat: string;
    primaryPosition: Position;
    secondaryPosition: Position;
    preferredHand: string;
    // strengths/weaknesses
    strengthDescription: string;
    weaknessDescription: string;
    strengthList : Strength [] = [];
    weaknessList : Weakness [] = [];
    // sport cv
    currentClub: string;
    currentPrimaryPosition: Position;
    currentSecondaryPosition: Position;
    accomplishments: string;
    statistics: string;
    formerClubs: string;
    // national team
    nationalTeam : NationalTeam [] = [];
    // picture/video
    profilePicture: File;
    videoPresentation: File;

    constructor() {}
}