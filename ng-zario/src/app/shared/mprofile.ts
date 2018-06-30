export class MProfile {
   _id: string;
   username: string;
   name: string;
   group_id: string;
   referral: Boolean;
   avatar: string;
   category: string;
   email: string;
   city: string;
   score: Number;
   strategy: string;
   bronze: Number;
   silver: Number;
   gold: Number;
   platinum: Number;
   pearl: Number;
   blackdiamond: Number;
   countrycode: string;
   mobile:string;
   phone: string;
   longitude:  number;
   latitude: number;
   zarios: Number;
   ukey: string;
   rkey: string;
};

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
   merchants: [string];
};

export class Codes {
   countryCode: string;
};

export class Categories {
   categoryName: string;
};

export class Merchant {
   _id: string;
   name: string;
};

export class Strategy {
   strategyName: string;
}

export class Position {
   lat: number;
   lng: number;
}