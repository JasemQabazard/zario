export class Blog {
   _id: string;
   username: string;
   media: string;    // embeded video or image stored on google S3 Cloud
   category: string;
   hearts: Number;
   hearted: [string];
   hate: Number;
   hated: [string];
   title: string;
   post: string;
   access: {
    allcustomerslevel: string,
    allmerchantslevel: string,
    onlymerchantmemberslevel: string
   };
   comments: [{
      _id: string,
      username: string,
      name: string,
      comment: string,
      hearts: Number,
      hearted: [string],
      hates: Number,
      hated: [string],
      createdAt: string,
      updatedAt: string
   }];
   createdAt: string;
   updatedAt: string;
}

export class Comment {
   _id: string;
   username: string;
   name: string;
   comment: string;
   hearts: Number;
   hearted: [string];
   hates: Number;
   hated: [string];
}

export class BlogCategory {
  blogcategoryname: string;
}

export class DraftBlog {
  _id: string;
  title: string;
  post: string;
  category: string;
  media: string;
  access: {
    allcustomerslevel: string,
    allmerchantslevel: string,
    onlymerchantmemberslevel: string
   };
}
