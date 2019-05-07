import {NationalTeam} from '../models/nationalTeam.model'

export class Player {
    // required info
    id: number;
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
    statistic: string;
    formerClubs: string;
    // national team
    nationalTeamList : NationalTeam [] = [];
    // picture/video
    profilePicture: File;
    videoPresentation: File;

    constructor() {}
}