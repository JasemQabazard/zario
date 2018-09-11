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
    this.category = 'Support';
    this.comments = [];
    this.dataModel = '';
    this.notUpdated = true;
    this.blogKey = 'BLOG';
    this.draftblog = {
      _id: '',
      title: 'Enter Blog Post Title Here',
      post: 'Enter Post Here',
      category: '',
      media: '',
      access: {
        allcustomerslevel: '',
        allmerchantslevel: '',
        onlymerchantmemberslevel: ''
       }
    };
    this.blogcategories = [
      {blogcategoryname: 'Support'},
      {blogcategoryname: 'Retailtainment'},
      {blogcategoryname: 'Open Innovation'},
      {blogcategoryname: 'Zario & CryptoCurrency'}
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
    this.subscription = this.authService.getUsername()
    .subscribe(
      name => {
        this.username = name;
        this.subscription.unsubscribe();
      });
      const blog: DraftBlog = this.loadDraftBlog();
      if (blog === null) {
        console.log('calling loadDraftBlog returned NO DRAFT BLOG EXISTS ');
      } else {
        this.draftblog = blog;
        console.log('loadDraftBlog: ', this.draftblog);
        this.fb.setValue({
          blogcategory: this.draftblog.category,
          allcustomerslevel: this.draftblog.access.allcustomerslevel,
          allmerchantslevel: this.draftblog.access.allmerchantslevel,
          onlymemberslevel: this.draftblog.access.onlymerchantmemberslevel
        });
        // this.selectedMediaFile = <File>this.draftblog.media;
        // this.displayMediaFile();
      }
  }

  createfb() {
    this.fb = this.formBuilder.group({
      blogcategory: 'Retailtainment',
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
    }
    console.log('addEditPost', this.addEditPost);
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
    this.draftblog.access.allcustomerslevel = this.fb.controls['allcustomerslevel'].value;
    this.draftblog.access.allmerchantslevel = this.fb.controls['allmerchantslevel'].value;
    this.draftblog.access.onlymerchantmemberslevel = this.fb.controls['onlymemberslevel'].value;
    // this.draftblog.media = this.selectedMediaFile;
    this.storeDraftBlog();
  }

  publish() {}

  loadDraftBlog(): DraftBlog {
    let blog: DraftBlog;
    blog = JSON.parse(localStorage.getItem(this.blogKey));
    return blog;
  }

  storeDraftBlog() {
    console.log('storeDraftBlog ', this.draftblog);
    localStorage.setItem(this.blogKey, JSON.stringify(this.draftblog));
  }

}
