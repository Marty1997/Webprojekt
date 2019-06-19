import { NationalTeam } from "../models/nationalTeam.model";

export class Player {
  // required info
  id: number;
  isAvailable: boolean;
  password: string = "";
  newPassword: string = "";
  email: string = "";
  firstName: string = "";
  lastName: string = "";
  country: string = "";
  league: string = "";
  day: number;
  month: number;
  year: number;
  // additional info
  height: number;
  weight: number;
  bodyfat: number;
  primaryPosition: string = "";
  secondaryPosition: string = "";
  preferredHand: string = "";
  // strengths/weaknesses
  strengthDescription: string = "";
  weaknessDescription: string = "";
  strengthList: string[] = [];
  weaknessList: string[] = [];
  // sport cv
  currentClub: string = "";
  currentClubPrimaryPosition: string = "";
  currentClubSecondaryPosition: string = "";
  accomplishments: string = "";
  statistic: string = "";
  formerClubs: string = "";
  contractStatus: string = "";
  contractExpired: string = "";
  contractExpiredDate: Date;
  injuryStatus: string = "";
  injuryExpired: string = "";
  injuryExpiredDate: Date;
  injuryDescription: string = "";
  // national team
  nationalTeamList: NationalTeam[] = [];
  // picture/video
  imagePath: string;
  videoPath: string;

  constructor() {}

    buildPlayer(succes: any, player: Player) {
        this.id = succes.id;
        this.contractExpired = succes.contractExpired;
        this.injuryExpired = succes.injuryExpired;
        this.injuryStatus = succes.injuryStatus;
        this.injuryDescription = succes.injuryDescription;
        this.isAvailable = succes.isAvailable;
        this.email = succes.email;
        this.firstName = succes.firstName;
        this.lastName = succes.lastName;
        this.country = succes.country;
        this.league = succes.league;
        this.day = succes.day;
        this.month = succes.month;
        this.year = succes.year;
        this.height = succes.height;
        this.weight = succes.weight;
        this.bodyfat = succes.bodyfat;
        this.primaryPosition = succes.primaryPosition;
        this.secondaryPosition = succes.secondaryPosition;
        this.preferredHand = succes.preferredHand;
        this.strengthDescription = succes.strengthDescription;
        this.weaknessDescription = succes.weaknessDescription;
        this.strengthList = succes.strengthList;
        this.weaknessList = succes.weaknessList;
        this.currentClub = succes.currentClub;
        this.currentClubPrimaryPosition = succes.currentClubPrimaryPosition;
        this.currentClubSecondaryPosition = succes.currentClubSecondaryPosition;
        this.accomplishments = succes.accomplishments;
        this.statistic = succes.statistic;
        this.formerClubs = succes.formerClubs;
        this.contractStatus = succes.contractStatus;
        this.injuryStatus = succes.injuryStatus;
        this.nationalTeamList = succes.nationalTeamList;
        this.imagePath = succes.imagePath;
        this.videoPath = succes.videoPath;

    return player;
  }
}
