export class Player {
    // required info
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    country: string;
    city: string;
    day: number;
    month: string;
    year: number;
    // additional info
    height: string;
    weight: string;
    bodyfat: string;
    primaryPosition: string;
    secondaryPosition: string;
    preferredHand: string;
    // strengths/weaknesses
    strengths: string;
    weaknesses: string;
    // sport cv
    currentClub: string;
    currentPrimaryPosition: string;
    currentSecondaryPosition: string;
    accomplishments: string;
    statistics: string;
    formerClubs: string;
    // national team
    aTeamAppearances: string;
    aTeamPosition: string;
    aTeamStatistics: string;
    bTeamAppearances: string;
    bTeamPosition: string;
    bTeamStatistics: string;
    u21TeamAppearances: string;
    u21TeamPosition: string;
    u21TeamStatistics: string;
    u18TeamAppearances: string;
    u18TeamPosition: string;
    u18TeamStatistics: string;
    // picture/video
    profilePicture: File;
    videoPresentation: File;

    constructor() {}
}