import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray , Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { PromotionService } from '../../services/promotion.service';
import { ProfileService } from '../../services/profile.service';
import { Promotion, Timing, Action, Level, Category } from '../../shared/promotions';
import { MProfile, CProfile, CRM, Position} from '../../shared/profile';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { awsMediaPath } from '../../shared/blog';
import { BlogService } from '../../services/blog.service';

import { Subscription } from 'rxjs/Subscription';

import { AgmCoreModule } from '@agm/core';

interface Marker {
      _id?: string;
      lat: number;
      lng: number;
      name: string;
      avatar?: string;
      category?: string;
      description?: string;
      url?: {};
}

@Component({
  selector: 'app-cpromotions',
  templateUrl: './cpromotions.component.html',
  styleUrls: ['./cpromotions.component.css']
})
export class CPromotionsComponent implements OnInit {
  promotions: Promotion[];
  position: Position;
  merchants: Array<Marker> = [];
  merchantSelectIndex: number;
  currentPosition: Position;
  cprofile: CProfile;
  subscription: Subscription;
  username: string = undefined;
  realname: string = undefined;
  zoom = 15;
  urlfollowing = {
    url: './assets/img/followingMarkerIcon.png',
    scaledSize: {
        width: 30,
        height: 45
      }
  };
  komments: Array<string> = []; // since i am displaying all the promotions for the _mid then i need a field for each comment box in the display so i am using this field for that
  _mid = '';
  UPDATINGCOMMENT_J: number = null;
  commentNotUpdated = true;
  merchantsName = 'Not Selected';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private promotionService: PromotionService,
    private blogService: BlogService,
    private router: Router
  ) {
    this.position = {
      lng: 0,
      lat: 0
    };
    this.currentPosition = {
      lng: 0.0,
      lat: 0.0
    };
  }

  ngOnInit() {
    this.getUserPosition();
    const x = setInterval(() => {
      if (this.currentPosition.lat) {
        clearInterval(x);
        this.position.lng = this.currentPosition.lng;
        this.position.lat = this.currentPosition.lat;
        console.log('1- pos', this.position);
      }
    }, 1000);
    console.log('2- pos', this.position);
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getRealname()
    .subscribe(
      rname => {
        this.realname = rname;
      });
      this.subscription = this.authService.getUsername()
      .subscribe(
        name => {
          this.username = name;
          this.subscription.unsubscribe();
          this.profileService.getCProfile(this.username)
          .subscribe(cprofile => {
            if ( cprofile === null) {
              this.merchantsName = 'Please Build your Profile Record Before Proceeding';
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 1500);
            } else {
              this.cprofile = cprofile;
              this.profileService.getCRM(this.cprofile._id)
              .subscribe(crm => {
                console.log(crm);
                this.profileService.getMProfiles()
                .subscribe(mprofiles => {
                  let urlFollowNotFollow = null;
                  for (let i = 0; i < mprofiles.length; i++) {
                    console.log('merchant i name ', i, mprofiles[i].name);
                    for (let j = 0; j < crm.length; j++) {
                      if (mprofiles[i]._id === crm[j]._mid) {
                        urlFollowNotFollow = this.urlfollowing;
                      }
                    }
                    this.merchants.push({
                      '_id': mprofiles[i]._id,
                      'lat': mprofiles[i].latitude,
                      'lng': mprofiles[i].longitude,
                      'name': mprofiles[i].name,
                      'avatar': awsMediaPath + mprofiles[i].avatar,
                      'category': mprofiles[i].category,
                      'description': mprofiles[i].description,
                      'url': urlFollowNotFollow
                    });
                    urlFollowNotFollow = null;
                  }
                  console.log('merchants : ', this.merchants);
                },
                errormessage => {
                    console.log('errormessage mprofile access', errormessage);
                });
              },
              errormessage => {
                  console.log('errormessage cprofile CRM access', this.cprofile._id, errormessage);
              });
            }
          },
          errormessage => {
              console.log('errormessage cprofile access', errormessage);
          });
      });
  }

  getUserPosition() {
    /// locate the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        // this.currentPosition.lat = pos.coords.latitude;
        // this.currentPosition.lng = pos.coords.longitude;
        this.currentPosition.lat = 18.801109;
        this.currentPosition.lng = 98.951701;
        console.log('3- currentPosition', this.currentPosition);
      });
    }
  }

  clickedMarker(name, i) {
    this._mid = this.merchants[i]._id;
    this.merchantSelectIndex = i;
    this.merchantsName = this.merchants[this.merchantSelectIndex].name;
    const now = new Date();
    this.promotionService.getPromotions(this._mid)
    .subscribe(promotions => {
      this.promotions = promotions;
      console.log('promotions : ', this.promotions);
      for (let x = 0; x < this.promotions.length; x++) {
        this.komments.push(' ');
        if (this.promotions[x].activity && now < new Date(this.promotions[x].daterange[1]) && now > new Date(this.promotions[x].daterange[0])) {
          this.promotions[x].activity = true;
        } else {
          this.promotions[x].activity = false;
        }
        if (this.promotions[x].avatar !== '../../../assets/img/avatardefault.png') {
          this.promotions[x].avatar = awsMediaPath + this.promotions[x].avatar;
        }
      }
    },
    errormessage => {
      console.log('errormessage promotion access', errormessage);
    });
  }

  addUpdateComments(i) {
    if (this.UPDATINGCOMMENT_J === null) {
      const remark = {
        username: this.username,
        name: this.realname,
        comment:  this.komments[i]
      };
      this.komments[i] = '';
      this.commentNotUpdated = true;
      this.promotionService.addComment(this.promotions[i]._id, remark)
      .subscribe(promotion => {
        this.promotions[i] = promotion;
        console.log('promotions : ', this.promotions);
      },
        errormessage => {
          console.log('errormessage promotion comments add access', errormessage);
      });
    } else {
      const remark = {
        'comment':  this.komments[i]
      };
      this.komments[i] = '';
      console.log('remark.comment : ', this.UPDATINGCOMMENT_J, remark);
      this.promotionService.updateComment(this.promotions[i]._id, this.promotions[i].comments[this.UPDATINGCOMMENT_J]._id, remark)
      .subscribe(promotion => {
        this.promotions[i] = promotion;
        console.log('promotions : ', this.promotions);
      },
        errormessage => {
          console.log('errormessage promotion comments update access', errormessage);
      });
      this.cancelUpdateComments(i);
    }
  }

  deleteComments(i, j) {
    console.log('delete ixj:', i, j);
    if (this.UPDATINGCOMMENT_J !== null) {this.cancelUpdateComments(i); }
    this.promotionService.deleteComment(this.promotions[i]._id, this.promotions[i].comments[j]._id)
    .subscribe(promotion => {
      this.promotions[i] = promotion;
      console.log('promotions : ', this.promotions);
    },
      errormessage => {
        console.log('errormessage promotion comments delete access', errormessage);
    });
  }

  editComments(i, j) {
    console.log('edit ixj:', i, j);
    this.komments[i] = this.promotions[i].comments[j].comment;
    this.UPDATINGCOMMENT_J = j;
    this.commentNotUpdated = true;
  }

  cancelUpdateComments(i) {
    this.komments[i] = '';
    this.UPDATINGCOMMENT_J = null;
    this.commentNotUpdated = true;
  }

}
