export class Club {
    // required info
    email: string;
    password: string;
    name: string;
    country: string;
    league: string;
    streetAddress: string;
    streetAddressLineTwo: string;
    city: string;
    state: string;
    zipcode: string;
    // training schedule
    regularMonday: string;
    regularTuesday: string;
    regularWednesday: string;
    regularThursday: string;
    regularFriday: string;
    regularSaturday: string;
    regularSunday: string;
    fitnessMonday: string;
    fitnessTuesday: string;
    fitnessWednesday: string;
    fitnessThursday: string;
    fitnessFriday: string;
    fitnessSaturday: string;
    fitnessSunday: string;
    // squad
    goalkeeper: string;
    leftWing: string;
    leftBack: string;
    centreBack: string;
    rightBack: string;
    rightWing: string;
    pivot: string;
    defence: string;
    benchPlayers: string[];
    // staff
    trainer: string;
    assistantTrainer: string;
    physiotherapist: string;
    doctor: string;
    manager: string;
    // files
    logo: File;
    facilityPictures: FileList;
    // values/preferences
    values: string;
    preferences: string;

    constructor() {}
}