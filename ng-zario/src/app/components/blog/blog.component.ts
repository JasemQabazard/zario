import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray , Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { ProfileService } from '../../services/profile.service';
import { Blog, Comment, BlogCategory, DraftBlog } from '../../shared/blog';
import { MProfile, CProfile, Group, Settings } from '../../shared/profile';
import { Level } from '../../shared/promotions';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit, OnDestroy {
  fb: FormGroup;  // initial profile input form control
  addEditPost: boolean;
  support: boolean;
  retail: boolean;
  openInnovation: boolean;
  ZarioCrypto: boolean;
  category: string;
  dataModel: string;
  notUpdated: boolean;
  commentNotUpdated = true;
  blogcategories: BlogCategory[];
  levels: Level[];
  blogs: Blog[];
  xblogs: Blog[];
  displayedBlogs: Array<Blog> = new Array(3);
  displayedBlogsNDX: number;
  currentlyDisplayed: Blog;
  currentlyDisplayedNDX = 0;
  blog: Blog;
  comment: Comment;
  _bid = '';
  _cid = '';
  _mid = '';
  selectedMediaFile: File = null;
  selectedMediaFileName = 'No New Media Selected';
  mediaPath = '../../../assets/img/blog-movement-2203657.png';
  mediaChanged = false;
  draftblog: DraftBlog = new DraftBlog;
  blogKey: string;
  subscription: Subscription;
  username: string = undefined;
  userrole: string = undefined;
  realname: string = undefined;
  message: string;
  messageClass: string;
  NEXT = false;
  PREVIOUS = false;
  LOCALSTORAGE = false;
  iHate = false;
  iLove = true;
  komment: string;
  secureCLHDisplay = true;    // security for Comment Love Hate display and access
  score = 0;
  _gid = '';
  settings: Settings;
  noProfile = false;
  mprofile: MProfile;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
    private profileService: ProfileService,
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
    this.komment = '';
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
    // get all blogs
    this.blogService.getBlogs()
    .subscribe(blogs => {
      this.blogs = blogs;
      console.log('get all blogs in the system: ', blogs);
      setTimeout(() => {
        if (this.username === undefined) {
          console.log('1- changecategory at blog read time out');
          this.changeCategory('support');
        }
      }, 1000);
    });
    this.subscription = this.authService.getRealname()
    .subscribe(
      rname => {
        this.realname = rname;
        this.subscription.unsubscribe();
      });
    this.profileService.getSettings()
    .subscribe(settings => {
      this.settings = settings[0];
      console.log('settings : ', this.settings);
    });
    this.subscription = this.authService.getUsername()
    .subscribe(
      name => {
        console.log('name ', name);
        this.username = name;
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
        this.authService.getUser(this.username)
        .subscribe(user => {
          console.log('user : ', user);
          this.userrole = user.role;
          this._gid = user._gid;
          this._mid = user._mid;
          console.log('this viewer _gid', this._gid);
          if (this.userrole === 'CUSTOMER') {
            this.profileService.getCProfile(this.username)
            .subscribe(cprofile => {
                if (cprofile) {
                  this.score = cprofile.score;
                  this._cid = cprofile._id;
                }
                console.log('2- changecategory at userrole customer');
                this.changeCategory('support');
              });
          } else if (this.userrole === 'MERCHANT' || this.userrole === 'merchant') {
            if (this._gid !== null) {
              this.profileService.getGroupById(this._gid)
              .subscribe(group => {
                this.score = group.score;
                console.log('3- changecategory at userrole === merchnat');
                this.changeCategory('support');
                if (this._mid !== null) {
                  this.profileService.getMProfileID(this._mid)
                  .subscribe(mprofile => {
                    this.mprofile = mprofile;
                    this.noProfile = true;
                  });
                } else {
                  this.noProfile = false;
                }
              });
            } else {
              this.noProfile = false;
              console.log('4- changecategory at userrole === merchnat but with null _gid');
              this.changeCategory('support');
            }
          } else {
            console.log('5- changecategory at userrole admin probably', this.userrole);
            this.changeCategory('support');
          }
        });
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
      this.xblogs = this.blogs.filter( (b) => {
        return b.category === this.category;
       });
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
        this.blogs.push(data);
        this.notUpdated = true;
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
        const ndx = this.blogs.findIndex((b) => {
          return b._id === this._bid;
        });
        this._bid = '';
        this.blogs[ndx] = data;
        this.notUpdated = true;
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
    for ( let i = this.displayedBlogsNDX; i < this.xblogs.length; i++) {
      if (no === 3) {
        break;
      } else {
        this.displayedBlogs[no] = this.xblogs[i];
        no++;
        this.displayedBlogsNDX++;
      }
    }
    console.log('displayedBlogsNDX After - ', this.displayedBlogsNDX);
    this.currentlyDisplayed = this.displayedBlogs[0];
    this.currentlyDisplayedNDX = 0;
    this.secureCLH();
    this.setHateLove();
    this._bid = this.currentlyDisplayed._id;
    this._cid = '';
    this.komment = '';
    this.commentNotUpdated = true;
    if (this.displayedBlogsNDX < this.xblogs.length) {
      this.NEXT = true;
    } else {
      this.NEXT = false;
    }
    if (this.displayedBlogsNDX <= 3) {
      this.PREVIOUS = false;
    } else {
      this.PREVIOUS = true;
    }
    if (this.displayedBlogsNDX === 0) {
      this.PREVIOUS = false;
      this.NEXT = false;
    }
  }

  secureCLH() {
    this.secureCLHDisplay = true;
    if (this.userrole === 'ADMIN') {
      this.secureCLHDisplay = false;
    } else if (this.userrole === 'MERCHANT' || this.userrole === 'merchant') {
      this.authService.getUser(this.currentlyDisplayed.username)
      .subscribe(user => {
        console.log('this bolg creator _gid', user._gid);
        if (user._gid === this._gid) {
          this.secureCLHDisplay = false;
        } else if (this.currentlyDisplayed.access.allmerchantslevel !== 'NO ACCESS') {
          this.mapMerchantLevels(this.score, this.currentlyDisplayed.access.allmerchantslevel);
        }
      });
    } else if (this.userrole === 'CUSTOMER') {
      if (this.currentlyDisplayed.access.onlymerchantmemberslevel === 'NO ACCESS' && this.currentlyDisplayed.access.allcustomerslevel !== 'NO ACCESS') {
        this.mapCustomerLevels(this.score, this.currentlyDisplayed.access.allcustomerslevel);
      } else if (this.currentlyDisplayed.access.onlymerchantmemberslevel !== 'NO ACCESS' && this.currentlyDisplayed.access.allcustomerslevel === 'NO ACCESS') {
        this.checkCRMS();
      } else if (this.currentlyDisplayed.access.onlymerchantmemberslevel !== 'NO ACCESS' && this.currentlyDisplayed.access.allcustomerslevel !== 'NO ACCESS') {
        this.mapCustomerLevels(this.score, this.currentlyDisplayed.access.allcustomerslevel);
        this.checkCRMS();
      }
    }
  }

  checkCRMS() {
    this.profileService.getCRM(this._cid)
    .subscribe(crms => {
      console.log('crms read', crms);
      if (crms.length === 0) {
        this.secureCLHDisplay = true;
      } else {
        this.authService.getUser(this.currentlyDisplayed.username)
        .subscribe(user => {
          let score = null;
          for (let i = 0; i < crms.length; i++) {
            if (user._mid === crms[i]._mid) {
              score = crms[i].score;
              this.profileService.getMProfileID(user._mid)
              .subscribe(mprofile => {
                this.mprofile = mprofile;
                console.log('this.mprofile for blog creator', this.mprofile);
                if (score !== null) {
                  this.mapCustomer2Merchant(score, this.currentlyDisplayed.access.onlymerchantmemberslevel);
                } else {
                  this.secureCLHDisplay = true;
                }
              });
            }
            break;
          }
        });
      }
    });
  }

  mapCustomer2Merchant(score, level) {
    let levelScore = 0;
    if (level === 'Bronze') {
      levelScore = 0;
    } else if (level === 'Silver') {
      levelScore = this.mprofile.bronze;
    } else if (level === 'Gold') {
      levelScore = this.mprofile.bronze + this.mprofile.silver;
    } else if (level === 'Platinum') {
      levelScore = this.mprofile.bronze + this.mprofile.silver + this.mprofile.gold;
    } else if (level === 'Pearl') {
      levelScore = this.mprofile.bronze + this.mprofile.silver + this.mprofile.gold + this.settings.platinum;
    } else if (level === 'Blackdiamond') {
      levelScore = this.mprofile.bronze + this.mprofile.silver + this.mprofile.gold + this.mprofile.platinum + this.mprofile.pearl;
    }
    if (score > levelScore) {
      this.secureCLHDisplay = false;
    } else {
      this.secureCLHDisplay = true;
    }
  }

  mapMerchantLevels(score, level) {
    let levelScore = 0;
    if (level === 'Bronze') {
      levelScore = 0;
    } else if (level === 'Silver') {
      levelScore = this.settings.bronze;
    } else if (level === 'Gold') {
      levelScore = this.settings.bronze + this.settings.silver;
    } else if (level === 'Platinum') {
      levelScore = this.settings.bronze + this.settings.silver + this.settings.gold;
    } else if (level === 'Pearl') {
      levelScore = this.settings.bronze + this.settings.silver + this.settings.gold + this.settings.platinum;
    } else if (level === 'Blackdiamond') {
      levelScore = this.settings.bronze + this.settings.silver + this.settings.gold + this.settings.platinum + this.settings.pearl;
    }
    if (score > levelScore) {
      this.secureCLHDisplay = false;
    } else {
      this.secureCLHDisplay = true;
    }
  }

  mapCustomerLevels(score, level) {
    let levelScore = 0;
    if (level === 'Bronze') {
      levelScore = 0;
    } else if (level === 'Silver') {
      levelScore = this.settings.cbronze;
    } else if (level === 'Gold') {
      levelScore = this.settings.cbronze + this.settings.csilver;
    } else if (level === 'Platinum') {
      levelScore = this.settings.cbronze + this.settings.csilver + this.settings.cgold;
    } else if (level === 'Pearl') {
      levelScore = this.settings.cbronze + this.settings.csilver + this.settings.cgold + this.settings.cplatinum;
    } else if (level === 'Blackdiamond') {
      levelScore = this.settings.cbronze + this.settings.csilver + this.settings.cgold + this.settings.cplatinum + this.settings.cpearl;
    }
    if (score > levelScore) {
      this.secureCLHDisplay = false;
    } else {
      this.secureCLHDisplay = true;
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
    if (this.xblogs.length % 3 === 0) {
      this.displayedBlogsNDX = this.xblogs.length - 3;
    } else {
      this.displayedBlogsNDX = this.xblogs.length - (this.xblogs.length % 3);
    }
    this.prepareBlogDisplay();
  }
  displayThisBlog(j) {
    this.currentlyDisplayed = this.displayedBlogs[j];
    this.currentlyDisplayedNDX = j;
    this.secureCLH();
    this.setHateLove();
    this._bid = this.currentlyDisplayed._id;
    this._cid = '';
    this.komment = '';
    this.commentNotUpdated = true;
  }

  changeNotUpdated() {
    if (this.draftblog.title !== '' && this.draftblog.post !== '') {
      this.notUpdated = false;
    }
  }
  setHateLove() {
    if (this.currentlyDisplayed.hearted.indexOf(this.realname) === -1) {
      this.iLove = false;
    } else {
      this.iLove = true;
    }
    if (this.currentlyDisplayed.hated.indexOf(this.realname) === -1) {
      this.iHate = false;
    } else {
      this.iHate = true;
    }
    console.log('this.realname, this.iHate, this.iLove ', this.realname, this.iHate, this.iLove);
  }
  toggleLove() {
    if (this.iLove) {
      this.currentlyDisplayed.hearts--;
      this.currentlyDisplayed.hearted.splice(this.currentlyDisplayed.hearted.indexOf(this.realname), 1);
    } else {
      this.currentlyDisplayed.hearts++;
      this.currentlyDisplayed.hearted.push(this.realname);
      if (this.iHate) {
        this.currentlyDisplayed.hates--;
        this.currentlyDisplayed.hated.splice(this.currentlyDisplayed.hated.indexOf(this.realname), 1);
        this.iHate = !this.iHate;
      }
    }
    this.iLove = !this.iLove;
    this.updateToggleLoveHate();
  }
  toggleHate() {
    if (this.iHate) {
      this.currentlyDisplayed.hates--;
      this.currentlyDisplayed.hated.splice(this.currentlyDisplayed.hated.indexOf(this.realname), 1);
    } else {
      this.currentlyDisplayed.hates++;
      this.currentlyDisplayed.hated.push(this.realname);
      if (this.iLove) {
        this.currentlyDisplayed.hearts--;
        this.currentlyDisplayed.hearted.splice(this.currentlyDisplayed.hearted.indexOf(this.realname), 1);
        this.iLove = !this.iLove;
      }
    }
    this.iHate = !this.iHate;
    this.updateToggleLoveHate();
  }
  updateToggleLoveHate() {
    const blog = {
      hearts: this.currentlyDisplayed.hearts,
      hearted: this.currentlyDisplayed.hearted,
      hates: this.currentlyDisplayed.hates,
      hated: this.currentlyDisplayed.hated
    };
    this.blogService.updateBlog(this._bid, blog).subscribe(
      data => {
        console.log('Blog Data Updated : ', data);
        const ndx = this.blogs.findIndex((b) => {
          return b._id === this._bid;
        });
        this.blogs[ndx] = data;
        this.xblogs = this.blogs.filter( (b) => {
          return b.category === this.category;
         });
         this.displayedBlogs[this.currentlyDisplayedNDX] = data;
      });
  }
  addPostComment() {
    if (this._cid === '') {
      const remark = {
        username: this.username,
        name: this.realname,
        comment:  this.komment
      };
      console.log('remark : ', remark, this._bid);
      this.blogService.addComment(this._bid, remark)
      .subscribe(blog => {
        this.currentlyDisplayed = blog;
        console.log('currentlyDisplayed : ', this.currentlyDisplayed);
        const ndx = this.blogs.findIndex((b) => {
          return b._id === this._bid;
        });
        this.blogs[ndx] = blog;
        this.xblogs = this.blogs.filter( (b) => {
          return b.category === this.category;
         });
         this.displayedBlogs[this.currentlyDisplayedNDX] = blog;
      },
        errormessage => {
          this.message = <any>errormessage;
          this.messageClass = 'alert alert-danger';
      });
    } else {
      const remark = {
        'comment':  this.komment
      };
      this.blogService.updateComment(this._bid, this._cid, remark)
      .subscribe(blog => {
        this.currentlyDisplayed = blog;
        console.log('currentlyDisplayed : ', this.currentlyDisplayed);
        const ndx = this.blogs.findIndex((b) => {
          return b._id === this._bid;
        });
        this.blogs[ndx] = blog;
        this.xblogs = this.blogs.filter( (b) => {
          return b.category === this.category;
         });
         this.displayedBlogs[this.currentlyDisplayedNDX] = blog;
      },
        errormessage => {
          this.message = <any>errormessage;
          this.messageClass = 'alert alert-danger';
      });
    }
    this.commentNotUpdated = true;
    this.komment = '';
    this._cid = '';
  }
  cancelPostComment() {
    console.log('canceling post comment');
    this._cid = '';
    this.komment = '';
    this.commentNotUpdated = true;
  }
  deleteComments(j) {
    this.blogService.deleteComment(this._bid, this.currentlyDisplayed.comments[j]._id)
    .subscribe(blog => {
      this.currentlyDisplayed = blog;
      console.log('currentlyDisplayed : ', this.currentlyDisplayed);
      const ndx = this.blogs.findIndex((b) => {
        return b._id === this._bid;
      });
      this.blogs[ndx] = blog;
      this.xblogs = this.blogs.filter( (b) => {
        return b.category === this.category;
       });
       this.displayedBlogs[this.currentlyDisplayedNDX] = blog;
    },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass = 'alert alert-danger';
    });
  }
  editComments(j) {
    this.komment = this.currentlyDisplayed.comments[j].comment;
    this._cid = this.currentlyDisplayed.comments[j]._id;
    console.log(j, this._bid, this._cid);
    this.commentNotUpdated = true;
  }
}
