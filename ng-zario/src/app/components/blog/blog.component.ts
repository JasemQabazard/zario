import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray , Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { Blog, Comment, BlogCategory, DraftBlog } from '../../shared/blog';
import { Level } from '../../shared/promotions';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  fb: FormGroup;  // initial profile input form control
  addEditPost: boolean;
  support: boolean;
  retail: boolean;
  openInnovation: boolean;
  ZarioCrypto: boolean;
  category: string;
  comments: Array<string>;
  dataModel: string;
  notUpdated: boolean;
  blogcategories: BlogCategory[];
  levels: Level[];
  blogs: Blog[];
  displayedBlogs: Array<Blog> = new Array(3);
  displayedBlogsNDX: number;
  currentlyDisplayed: Blog;
  blog: Blog;
  comment: Comment;
  _bid = '';
  _cid = '';
  selectedMediaFile: File = null;
  selectedMediaFileName = 'No New Media Selected';
  mediaPath = '../../../assets/img/blog-movement-2203657.png';
  mediaChanged = false;
  draftblog: DraftBlog = new DraftBlog;
  blogKey: string;
  subscription: Subscription;
  username: string = undefined;
  userrole: string = undefined;
  message: string;
  messageClass: string;
  NEXT = true;
  PREVIOUS = true;
  LOCALSTORAGE = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
    private router: Router
  ) {
    this.createfb();
  }

  ngOnInit() {
    this.addEditPost = false;
    this.support = false;
    this.retail = false;
    this.openInnovation = false;
    this.ZarioCrypto = false;
    this.comments = [];
    this.dataModel = '';
    this.notUpdated = true;
    this.blogKey = 'BLOG';
    this.draftblog = {
      _id: '',
      username: '',
      media: '',
      category: '',
      title: '',
      post: '',
      access: {
        allcustomerslevel: '',
        allmerchantslevel: '',
        onlymerchantmemberslevel: ''
       }
    };
    for (let j = 0; j < 3; j++) {
      this.displayedBlogs[j] = {
        _id: '',
        username: '',
        media: '',
        category: '',
        title: '',
        post: '',
        access: {
          allcustomerslevel: '',
          allmerchantslevel: '',
          onlymerchantmemberslevel: ''
        }
      };
    }
    this.currentlyDisplayed = this.displayedBlogs[0];
    this.blogcategories = [
      {blogcategoryname: 'support'},
      {blogcategoryname: 'retailtainment'},
      {blogcategoryname: 'open innovation'},
      {blogcategoryname: 'zario & cryptoCurrency'}
    ];
    this.levels = [
      {levelCode: 'NO ACCESS'},
      {levelCode: 'Bronze'},
      {levelCode: 'Silver'},
      {levelCode: 'Gold'},
      {levelCode: 'Platinum'},
      {levelCode: 'Pearl'},
      {levelCode: 'Blackdiamond'}
    ];
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUserrole()
    .subscribe(
      role => {
        this.userrole = role;
      });
    this.subscription = this.authService.getUsername()
    .subscribe(
      name => {
        this.username = name;
        this.subscription.unsubscribe();
        const draft: DraftBlog = this.loadDraftBlog();
        if (draft === null) {
          console.log('NO DRAFT BLOG EXISTS ');
        } else {
          this.draftblog = draft;
          this._bid = this.draftblog._id;
          console.log('loadDraftBlog: ', this.draftblog);
          this.LOCALSTORAGE = true;
          this.fb.setValue({
            blogcategory: this.draftblog.category,
            allcustomerslevel: this.draftblog.access.allcustomerslevel,
            allmerchantslevel: this.draftblog.access.allmerchantslevel,
            onlymemberslevel: this.draftblog.access.onlymerchantmemberslevel
          });
          // this.selectedMediaFile = <File>this.draftblog.media;
          // this.displayMediaFile();
        }
      });
      // get all blogs
      this.blogService.getBlogs()
      .subscribe(blogs => {
        this.blogs = blogs;
        console.log('get all blogs in the system: ', blogs);
        this.changeCategory('support');
      });
  }

  createfb() {
    this.fb = this.formBuilder.group({
      blogcategory: 'support',
      allcustomerslevel: 'NO ACCESS',
      allmerchantslevel: 'NO ACCESS',
      onlymemberslevel: 'NO ACCESS'
    });

    this.onChanges();

  }
  onChanges(): void {
    this.fb.valueChanges.subscribe(val => {
      this.notUpdated = false;
    });
  }

  changeCategory(category) {
    this.category = category;
    if (this.category === 'Add Edit Post') {
      this.addEditPost = true;
    } else {
      this.addEditPost = false;
      this.displayedBlogsNDX = 0;
      this.prepareBlogDisplay();
    }
  }

  mediaFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedMediaFile = <File>event.target.files[0];
      this.displayMediaFile();
    }
  }

  displayMediaFile() {
    this.selectedMediaFileName = `Selected Image: ${this.selectedMediaFile.name}`;
    this.mediaChanged = true;
    this.notUpdated = false;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.mediaPath = event.target.result;
    };
    console.log(this.selectedMediaFileName, this.selectedMediaFile);
    reader.readAsDataURL(<File>this.selectedMediaFile);
  }

  saveDraft() {
    this.draftblog.category = this.fb.controls['blogcategory'].value;
    this.draftblog.username = this.username;
    this.draftblog.access.allcustomerslevel = this.fb.controls['allcustomerslevel'].value;
    this.draftblog.access.allmerchantslevel = this.fb.controls['allmerchantslevel'].value;
    this.draftblog.access.onlymerchantmemberslevel = this.fb.controls['onlymemberslevel'].value;
    // this.draftblog.media = this.selectedMediaFile;
    this.storeDraftBlog();
    this.LOCALSTORAGE = true;
  }

  cancelDraftPost() {
    localStorage.removeItem(this.blogKey);
    this.LOCALSTORAGE = false;
  }

  publish() {
    this.blog = {
      username: this.username,
      media: 'for later work',
      category: this.fb.controls['blogcategory'].value,
      title: this.draftblog.title,
      post: this.draftblog.post,
      access: {
        allcustomerslevel: this.fb.controls['allcustomerslevel'].value,
        allmerchantslevel: this.fb.controls['allmerchantslevel'].value,
        onlymerchantmemberslevel: this.fb.controls['onlymemberslevel'].value
      }
    };
    this.blogService.addBlog(this.blog).subscribe(
      data => {
        this.messageClass = 'alert alert-success';
        this.message = 'Blog Add Successfull';
        console.log('Blog Data Added : ', data);
        this.fb.reset();
        this.fb.setValue ({
          blogcategory: 'support',
          allcustomerslevel: 'NO ACCESS',
          allmerchantslevel: 'NO ACCESS',
          onlymemberslevel: 'NO ACCESS'
        });
        if (this.LOCALSTORAGE) {
          this.cancelDraftPost();
        }
        this.blogService.getBlogs()
        .subscribe(blogs => {
          this.blogs = blogs;
        });
      });
  }

  updatePost() {
    this.blog = {
      username: this.username,
      media: 'for later work',
      category: this.fb.controls['blogcategory'].value,
      title: this.draftblog.title,
      post: this.draftblog.post,
      access: {
        allcustomerslevel: this.fb.controls['allcustomerslevel'].value,
        allmerchantslevel: this.fb.controls['allmerchantslevel'].value,
        onlymerchantmemberslevel: this.fb.controls['onlymemberslevel'].value
      }
    };
    this.blogService.updateBlog(this._bid, this.blog).subscribe(
      data => {
        this.messageClass = 'alert alert-success';
        this.message = 'Blog Update Successfull';
        console.log('Blog Data Updated : ', data);
        this.fb.reset();
        this.fb.setValue ({
          blogcategory: 'support',
          allcustomerslevel: 'NO ACCESS',
          allmerchantslevel: 'NO ACCESS',
          onlymemberslevel: 'NO ACCESS'
        });
        if (this.LOCALSTORAGE) {
          this.cancelDraftPost();
        }
        this._bid = '';
        this.blogService.getBlogs()
        .subscribe(blogs => {
          this.blogs = blogs;
        });
      });
  }

  loadDraftBlog(): DraftBlog {
    let blog: DraftBlog;
    blog = JSON.parse(localStorage.getItem(this.blogKey));
    return blog;
  }

  storeDraftBlog() {
    console.log('storeDraftBlog ', this.draftblog);
    localStorage.setItem(this.blogKey, JSON.stringify(this.draftblog));
  }

  prepareBlogDisplay() {
    let no = 0;
    for (let j = 0; j < 3; j++) {
      this.displayedBlogs[j] = {
        _id: '',
        username: '',
        media: '',
        category: '',
        title: '',
        post: '',
        access: {
          allcustomerslevel: '',
          allmerchantslevel: '',
          onlymerchantmemberslevel: ''
        }
      };
    }
    console.log('displayedBlogsNDX Before - ', this.displayedBlogsNDX);
    for ( let i = this.displayedBlogsNDX; i < this.blogs.length; i++) {
      if (no === 3) {
        break;
      } else if (this.blogs[i].category === this.category) {
        this.displayedBlogs[no] = this.blogs[i];
        no++;
        this.displayedBlogsNDX++;
      }
    }
   console.log('displayedBlogsNDX After - ', this.displayedBlogsNDX);
   this.currentlyDisplayed = this.displayedBlogs[0];
   if (this.displayedBlogsNDX < this.blogs.length) {
    this.NEXT = true;
   } else {
     this.NEXT = false;
   }
   if (this.displayedBlogsNDX <= 3) {
    this.PREVIOUS = false;
   } else {
     this.PREVIOUS = true;
   }
  }

  editBlogPost() {
    this.draftblog = {
      _id: this.currentlyDisplayed._id,
      username: this.currentlyDisplayed.username,
      media: this.currentlyDisplayed.media,
      category: this.currentlyDisplayed.category,
      title: this.currentlyDisplayed.title,
      post: this.currentlyDisplayed.post,
      access: {
        allcustomerslevel: this.currentlyDisplayed.access.allcustomerslevel,
        allmerchantslevel: this.currentlyDisplayed.access.allmerchantslevel,
        onlymerchantmemberslevel: this.currentlyDisplayed.access.onlymerchantmemberslevel
       }
    };
    this.changeCategory('Add Edit Post');
    this._bid = this.currentlyDisplayed._id;
    this.fb.setValue ({
      blogcategory: this.draftblog.category,
      allcustomerslevel: this.draftblog.access.allcustomerslevel,
      allmerchantslevel: this.draftblog.access.allmerchantslevel,
      onlymemberslevel: this.draftblog.access.onlymerchantmemberslevel
    });
    console.log('draftblog : ', this.draftblog);
    this.notUpdated = true;
  }
  addPostComment() {}
  cancelPostComment() {}
  firstBlogGroup() {
    this.displayedBlogsNDX = 0;
    this.prepareBlogDisplay();
  }
  previousBlogGroup() {
    this.displayedBlogsNDX = this.displayedBlogsNDX - 4;
    while ((this.displayedBlogsNDX) % 3 !== 0) {
      this.displayedBlogsNDX--;
    }
    this.prepareBlogDisplay();
  }
  nextBlogGroup() {
    this.prepareBlogDisplay();
  }
  lastBlogGroup() {
    if (this.blogs.length % 3 === 0) {
      this.displayedBlogsNDX = this.blogs.length - 3;
    } else {
      this.displayedBlogsNDX = this.blogs.length - (this.blogs.length % 3);
    }
    this.prepareBlogDisplay();
  }
  displayThisBlog(j) {
    this.currentlyDisplayed = this.displayedBlogs[j];
  }

  changeNotUpdated() {
    if (this.draftblog.title !== '' && this.draftblog.post !== '') {
      this.notUpdated = false;
    }
  }

}
