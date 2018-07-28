export class Promotion {
   _id: string;
   _mid: string;
   avatar: string;
   name: string;
   narrative : string;
   hearts: Number;
   hearted:[string];
   genre: string;
   level: string;
   category: string;
   daterange: [Date];
   discount: string;
   price: string;
   description: string;
   comments: [{
      _id: string,
      username: string,
      name:string,
      comment: string,
      createdAt: string,
      updatedAt: string
   }];
};

export class Genre {
   genreCode: string;
};

export class Level {
   levelCode: string;
};

export class Category {
   categoryCode: string;
};

export class Comment {
   _id: string;
   username: string;
   name: string;
   comment:  string;
   date: string;
}