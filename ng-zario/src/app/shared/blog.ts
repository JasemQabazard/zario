export class Blog {
   _id?: string;
   username: string;
   media: string;    // embeded video or image stored on google S3 Cloud
   category: string;
   hearts?: number;
   hearted?: [string];
   hates?: number;
   hated?: [string];
   title: string;
   post: string;
   access: {
    allcustomerslevel: string,  // this is the application level can be "NO ACCESS" which means no one in the app can do any comments. It can be set to a certain level from Bronze, Silver, Gold, Platinum, Pearl, and Blackdiamond. Once set only that level in the app can make comments and loves and hates against the post.
    allmerchantslevel: string,  // this setting determines if the post owner allows other merchants to make comments, loves,and hates against the post. "NO ACCESS" means no merchant while a specific level here means that only merchants with that app level can make comments., love, hate the post.
    onlymerchantmemberslevel: string  // this security flag is for merchant owned posts where a particular merchant allows only customers that subscribe to him be allowed comments, loves,a nd hates. NO ACCESS means he is not using this flag while a specific level means that customers that have that specific level be allowed to comment, love, and hate.
    // when an individual customer makes a blog post then this flag should be diabeled.
   };
   comments?: [{
      _id: string,
      username: string,
      name: string,
      comment: string,
      hearts: number,
      hearted: [string],
      hates: number,
      hated: [string],
      createdAt: string,
      updatedAt: string
   }];
   createdAt?: string;
   updatedAt?: string;
}

export class Comment {
   _id: string;
   username: string;
   name: string;
   comment: string;
   hearts: number;
   hearted: [string];
   hates: number;
   hated: [string];
}

export class BlogCategory {
  blogcategoryname: string;
}

export class DraftBlog {
  _id?: string;
  username: string;
  media: string;
  category: string;
  title: string;
  post: string;
  access: {
    allcustomerslevel: string,
    allmerchantslevel: string,
    onlymerchantmemberslevel: string
   };
}
