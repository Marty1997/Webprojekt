import {NationalTeam} from '../models/nationalTeam.model'

export class Player {
    // required info
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    country: string;
    day: string;
    month: string;
    year: string;
    // additional info
    height: number;
    weight: number;
    bodyfat: number;
    primaryPosition: string;
    secondaryPosition: string;
    preferredHand: string;
    // strengths/weaknesses
    strengthDescription: string;
    weaknessDescription: string;
    strengthList : string [] = [];
    weaknessList : string [] = [];
    // sport cv
    currentClub: string;
    currentClubPrimaryPosition: string;
    currentClubSecondaryPosition: string;
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