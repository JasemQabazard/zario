export class Promotion {
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
      username: string,
      name:string,
      comment: string
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
   username: string;
   post:  string;
}