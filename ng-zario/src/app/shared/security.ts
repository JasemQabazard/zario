export class User {
   _id: string;
   username: string;
   email: string;
   password: string;
   firstname: string;
   lastname: string;
   countrycode: string;
   mobile: string;
   documentlocation?: string;
   role: string;
   _gid: string;
   _mid: string;
   approvalstatus: string;
   lastsignondate: Date;
}

// used by admin to change user status after document submital
export class SUBMITTER {
  _id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  mobile: string;
  role: string;
  approvalstatus: string;
}

export class Codes {
   countryCode: string;
}

export class ROLES {
   name: string;
}
