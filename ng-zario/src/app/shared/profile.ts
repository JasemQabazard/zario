export class MProfile {
   _id: string;
   username: string;
   name: string;
   description: string;
   _gid: string;
   referral: Boolean;
   avatar: string;
   category: string;
   email: string;
   city: string;
   score: number;
   strategy: string;
   bronze: number;
   silver: number;
   gold: number;
   platinum: number;
   pearl: number;
   blackdiamond: number;
   countrycode: string;
   mobile: string;
   phone: string;
   longitude:  number;
   latitude: number;
   zarios: number;
   ukey: string;
   rkey: string;
   createdAt?: Date;
}

export class CProfile {
   _id: string;
   username: string;
   birthdate: Date;
   gender: string;
   social: string;
   occupation: string;
   education: string;
   work: string;
   avatar: string;
   score: number;
   initialflag: boolean;
   zarios: number;
   ukey: string;
   rkey: string;
}

export class Settings {
      _id?: string;
      username: string;
      name: string;
      avatar: string;
      email: string;
      city: string;
      countrycode: string;
      mobile: string;
      phone: string;
      bronze: number; // merchasnt application bands
      silver: number;
      gold: number;
      platinum: number;
      pearl: number;
      blackdiamond: number;
      cbronze: number;  // customer application bands
      csilver: number;
      cgold: number;
      cplatinum: number;
      cpearl: number;
      cblackdiamond: number;
      zariosmultiplier?: number;
      mdistributedzarios?: number;
      cdistributedzarios?: number;
}

export class Group {
   _id: string;
   username: string;
   name: string;
   description: string;
   email: string;
   city: string;
   countrycode: string;
   mobile: string;
   phone: string;
   score: number;
   strategy: string;
   bronze: number;
   silver: number;
   gold: number;
   platinum: number;
   pearl: number;
   blackdiamond: number;
}

export class CRM {
   _id?: string;
   _cid: string;
   _mid: string;
   score: number;
   vists: number;
   timedpromotions?: [{
     _id?: string,
     _pid?: string,
     createdAt?: string
   }];
}

export class Codes {
   countryCode: string;
}

export class Genders {
   genderCode: string;
}

export class Socials {
   socialCode: string;
}

export class Categories {
   categoryName: string;
}

export class Merchant {
   _id: string;
   name: string;
}

export class Strategy {
   strategyName: string;
}

export class Position {
   lng: number;
   lat: number;
}
