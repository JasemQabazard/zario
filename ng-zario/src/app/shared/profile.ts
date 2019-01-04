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
   cdistributedzarios?: number;
   notrans?: number;
   totalcommision?: number;
   totsales?: number;
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
   notrans?: number;
   totpurchase?: number;
   totcommissions?: number;
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
      nocustomers: number;
      nomerchants: number;
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
      zariosprice?: number;
      zariosdistributionratio?: number;
      commission?: number;
      mdistributedzarios?: number;
      cdistributedzarios?: number;
      notrans?: number;
      totcommissions?: number;
      zarios?: number;
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
   cdistributedzarios?: number;
   notrans?: number;
   totalcommision?: number;
   totsales?: number;
}

export class CRM {
   _id?: string;
   _cid: string;
   _mid: string;
   score: number;
   vists: number;
   distributedzarios?: number;
   totalcommision?: number;
   totsales?: number;
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
