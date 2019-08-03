import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { MProfile, Merchant, CProfile, Group, CRM, Settings } from '../../shared/profile';
import { User, ROLES } from '../../shared/security';
import { awsMediaPath } from '../../shared/blog';
import { BlogService } from '../../services/blog.service';
import { merchantpromotions } from '../../shared/promotions';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-mdashboard',
  templateUrl: './mdashboard.component.html',
  styleUrls: ['./mdashboard.component.css']
})
export class MDashboardComponent implements OnInit {
  fs: FormGroup;
  merchants: Array<Merchant> = [];
  mprofiles: MProfile[];
  users: User[];
  firstname = '';
  lastname = '';
  profile: MProfile;
  cprofile: CProfile;
  crm: CRM;
  settings: Settings;
  group: Group;
  subscription: Subscription;
  username: string = undefined;
  _mid = '';
  _gid = '';
  _uid = '';
  _cid = '';
  message: string;
  messageClass: string;
  nogroup = true;
  profileBox = true;
  avatarPath = '../../../assets/img/avatardefault.png';
  customerAvatar = '../../../assets/img/avatardefault.png';
  selectedMerchantName = '';
  maband = '';    // ma merchant application color band for progress bar
  maimgband = '../../../assets/img/bronze.png';
  macolorband = '#a15825';
  mapercentageband = 65;
  matextband = '%';
  mafontband = 'white';
  caband = '';    // ca customer application color band for progress bar
  caimgband = '../../../assets/img/bronze.png';
  cacolorband = '#a15825';
  capercentageband = 45;
  catextband = '%';
  cafontband = 'white';
  cmband = '';    // cm customer merchant color band for progress bar
  cmimgband = '../../../assets/img/bronze.png';
  cmcolorband = '#a15825';
  cmpercentageband = 91;
  cmtextband = '%';
  cmfontband = 'white';
  CUI = 0;    // Current User Index.

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private blogService: BlogService,
    private router: Router
  ) {
    this.createfs();
    this.matextband = '%' + this.mapercentageband;
    this.catextband = '%' + this.capercentageband;
    this.cmtextband = '%' + this.cmpercentageband;
  }

  ngOnInit() {
    this.profileService.getSettings()
    .subscribe(settings => {
      this.settings = settings[0];
      console.log('settings : ', this.settings);
    });
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
      .subscribe(
        name => {
          this.username = name;
          this.subscription.unsubscribe();
          this.authService.getUser(this.username)
          .subscribe(user => {
            this._uid = user._id;
          });
          // group access code
          this.profileService.getGroup(this.username)
          .subscribe(gp => {
            console.log('merchant group: ', gp);
            if (gp === null) {
              this.message = 'You must create a GROUP before viewing Merchant Profiles Dashboard';
              this.messageClass = 'alert alert-danger';
              setTimeout(() => {
                this.router.navigate(['/group']);
              }, 1500);
            } else {
              this._gid = gp._id;
              this.nogroup = false;
              this.group = gp;
            }
          },
            errormessage => {
              this.message = <any>errormessage;
              this.messageClass = 'alert alert-danger';
          });
          this.profileService.getMProfile(this.username)
          .subscribe(mprofiles => {
            this.mprofiles = mprofiles;
            console.log('profiles : ', this.mprofiles);
            if (mprofiles.length === 0) {
              this.message = 'You must create a PROFILE before viewing Merchant Profiles Dashboard';
              this.messageClass = 'alert alert-danger';
              setTimeout(() => {
                this.router.navigate(['/mprofile']);
              }, 1500);
            } else {
              this._mid = mprofiles[0]._id;
              this.checkmaBand(mprofiles[0].score);
              this.profileBox = true;
              if (this.mprofiles[0].avatar) {
                this.avatarPath = awsMediaPath + `${this.mprofiles[0].avatar}`;
              } else {
                this.avatarPath = '../../../assets/img/avatardefault.png';
              }
              for (let i = 0; i < mprofiles.length; i++) {
                console.log('merchant i name ', i, mprofiles[i].name);
                this.merchants.push({
                  '_id': mprofiles[i]._id,
                 'name': mprofiles[i].name
                });
              }
              console.log('merchants ', this.merchants);
              this.fs.controls['merchant'].setValue(this.merchants[0].name);
              this.selectedMerchantName = this.merchants[0].name;
              this.profile = mprofiles[0];
              this.usersbymid(this._mid);
            }
          },
            errormessage => {
              this.message = <any>errormessage;
              this.messageClass = 'alert alert-danger';
          });
        });
  }

  createfs() {
    this.fs = this.formBuilder.group({
      merchant: ''
    });
  }

  changeMerchant() {
    let ndx = 0;
    for ( ndx = 0; ndx < this.merchants.length; ndx++) {
       if (this.merchants[ndx].name === this.fs.controls['merchant'].value) {
        this.selectedMerchantName = this.merchants[ndx].name;
         break;
       }
    }
    this._mid = this.mprofiles[ndx]._id;
    this.profile = this.mprofiles[ndx];
    this.usersbymid(this._mid);
    this.checkmaBand(this.mprofiles[ndx].score);
    this.profileBox = true;
    if (this.mprofiles[ndx].avatar) {
      this.avatarPath = awsMediaPath + `${this.mprofiles[ndx].avatar}`;
    } else {
      this.avatarPath = '../../../assets/img/avatardefault.png';
    }
  }

  usersbymid(mid: string) {
    console.log('userbymid mid: ', mid);
    this.subscription = this.authService.getbymid(mid)
    .subscribe(
      users => {
        console.log('users.length: ', users.length, users);
        this.users = users;
        const removeIndex = users.map(function(item) { return item.role.toLowerCase(); }).indexOf('merchant');
        // remove object
        this.users.splice(removeIndex, 1);
        this.CUI = 0;
        if (this.users.length > 0) {
          this.getCustomer();
        } else {
          this.customerAvatar = '../../../assets/img/avatardefault.png';
          this.firstname = '';
          this.lastname = '';
        }
      },
      errormessage => {
        console.log('error while accessing users bymid : ', errormessage);
      });
  }

  checkmaBand(score: number) {
    this.maband = '';
    if (score || score === 0) {          // this will only be true if score !== null
      this.maband = 'Application Band is Bronze';
      this.maimgband = '../../../assets/img/bronze.png';
      this.macolorband = '#a15825';
      this.mafontband = 'white';
      this.mapercentageband = 100 * score / this.settings.cbronze;
      if (score > this.settings.cpearl) {
        this.maband = 'Application Band is Blackdiamond';
        this.maimgband = '../../../assets/img/blackdiamond.png';
        this.macolorband = '#222221';
        this.mafontband = 'white';
        this.mapercentageband = 100 * (score - this.settings.cpearl) / (this.settings.cblackdiamond - this.settings.cpearl);
      } else if (score > this.settings.cplatinum) {
        this.maband = 'Application Band is Pearl';
        this.maimgband = '../../../assets/img/pearl.png';
        this.macolorband = '#f0d6c8';
        this.mafontband = 'balck';
        this.mapercentageband = 100 * (score - this.settings.cplatinum) / (this.settings.cpearl - this.settings.cplatinum);
      } else if (score > this.settings.cgold) {
        this.maband = 'Application Band is Platinum';
        this.maimgband = '../../../assets/img/platinum.png';
        this.macolorband = '#b3aea3';
        this.mafontband = 'white';
        this.mapercentageband = 100 * (score - this.settings.cgold) / (this.settings.cplatinum - this.settings.cgold);
      } else if (score > this.settings.csilver) {
        this.maband = 'Application Band is Gold';
        this.maimgband = '../../../assets/img/gold.png';
        this.macolorband = '#ca961c';
        this.mafontband = 'black';
        this.mapercentageband = 100 * (score - this.settings.csilver) / (this.settings.cgold - this.settings.csilver);
      } else if (score > this.settings.cbronze) {
        this.maband = 'Application Band is Silver';
        this.maimgband = '../../../assets/img/silver.png';
        this.macolorband = '#d8d8d8';
        this.mafontband = 'black';
        this.mapercentageband = 100 * (score - this.settings.cbronze) / (this.settings.csilver - this.settings.cbronze);
      }
    }
    this.matextband = '%' + this.mapercentageband;
    console.log('band', this.maband, this.mapercentageband, this.mafontband);
  }

  clickedCustomer(i: any) {
    console.log('index : ', i, this.users[i]);
    this.CUI = i;
    this.getCustomer();
  }

  getCustomer() {
    this.profileService.getCProfile(this.users[this.CUI].username)
    .subscribe(cprofile => {
      this.cprofile = cprofile;
      this.profileService.getCRM(this.cprofile._id)
      .subscribe(crm => {
        for (let j = 0; j < crm.length; j++) {
          if (this._mid === crm[j]._mid) {
            this.crm = crm[j];
            console.log('cprofile - crm: ', this.cprofile, this.crm);
          }
        }
        this.customerDetails();
      });
    });
  }

  customerDetails() {
    if (this.cprofile.avatar) {
      this.customerAvatar = awsMediaPath + this.cprofile.avatar;
    } else {
      this.customerAvatar = '../../../assets/img/avatardefault.png';
    }
    this.firstname = this.users[this.CUI].firstname;
    this.lastname = this.users[this.CUI].lastname;
    this.checkcaBand(this.cprofile.score);
    this.checkcmBand(this.crm.score);
  }

  checkcaBand(score: number) {
    this.caband = '';
    if (score || score === 0) {          // this will only be true if score !== null
      this.caband = 'Application Band is Bronze';
      this.caimgband = '../../../assets/img/bronze.png';
      this.cacolorband = '#a15825';
      this.cafontband = 'white';
      this.capercentageband = 100 * score / this.settings.cbronze;
      if (score > this.settings.cpearl) {
        this.caband = 'Application Band is Blackdiamond';
        this.caimgband = '../../../assets/img/blackdiamond.png';
        this.cacolorband = '#222221';
        this.cafontband = 'white';
        this.capercentageband = 100 * (score - this.settings.cpearl) / (this.settings.cblackdiamond - this.settings.cpearl);
      } else if (score > this.settings.cplatinum) {
        this.caband = 'Application Band is Pearl';
        this.caimgband = '../../../assets/img/pearl.png';
        this.cacolorband = '#f0d6c8';
        this.cafontband = 'balck';
        this.capercentageband = 100 * (score - this.settings.cplatinum) / (this.settings.cpearl - this.settings.cplatinum);
      } else if (score > this.settings.cgold) {
        this.caband = 'Application Band is Platinum';
        this.caimgband = '../../../assets/img/platinum.png';
        this.cacolorband = '#b3aea3';
        this.cafontband = 'white';
        this.capercentageband = 100 * (score - this.settings.cgold) / (this.settings.cplatinum - this.settings.cgold);
      } else if (score > this.settings.csilver) {
        this.caband = 'Application Band is Gold';
        this.caimgband = '../../../assets/img/gold.png';
        this.cacolorband = '#ca961c';
        this.cafontband = 'black';
        this.capercentageband = 100 * (score - this.settings.csilver) / (this.settings.cgold - this.settings.csilver);
      } else if (score > this.settings.cbronze) {
        this.caband = 'Application Band is Silver';
        this.caimgband = '../../../assets/img/silver.png';
        this.cacolorband = '#d8d8d8';
        this.cafontband = 'black';
        this.capercentageband = 100 * (score - this.settings.cbronze) / (this.settings.csilver - this.settings.cbronze);
      }
    }
    this.catextband = '%' + this.capercentageband;
    console.log('band', this.caband, this.capercentageband, this.cafontband);
  }

  checkcmBand(score: number) {
    this.cmband = '';
    if (score || score === 0) {          // this will only be true if score !== null
      this.cmband = 'Merchant Band is Bronze';
      this.cmimgband = '../../../assets/img/bronze.png';
      this.cmcolorband = '#a15825';
      this.cmfontband = 'white';
      this.cmpercentageband = 100 * score / this.profile.bronze;
      if (score > this.profile.pearl) {
        this.cmband = 'Merchant Band is Blackdiamond';
        this.cmimgband = '../../../assets/img/blackdiamond.png';
        this.cmcolorband = '#222221';
        this.cmfontband = 'white';
        this.cmpercentageband = 100 * (score - this.profile.pearl) / (this.profile.blackdiamond - this.profile.pearl);
      } else if (score > this.profile.platinum) {
        this.cmband = 'Merchant Band is Pearl';
        this.cmimgband = '../../../assets/img/pearl.png';
        this.cmcolorband = '#f0d6c8';
        this.cmfontband = 'balck';
        this.cmpercentageband = 100 * (score - this.profile.platinum) / (this.profile.pearl - this.profile.platinum);
      } else if (score > this.profile.gold) {
        this.cmband = 'Merchant Band is Platinum';
        this.cmimgband = '../../../assets/img/platinum.png';
        this.cmcolorband = '#b3aea3';
        this.cmfontband = 'white';
        this.cmpercentageband = 100 * (score - this.profile.gold) / (this.profile.platinum - this.profile.gold);
      } else if (score > this.profile.silver) {
        this.cmband = 'Merchant Band is Gold';
        this.cmimgband = '../../../assets/img/gold.png';
        this.cmcolorband = '#ca961c';
        this.cmfontband = 'black';
        this.cmpercentageband = 100 * (score - this.profile.silver) / (this.profile.gold - this.profile.silver);
      } else if (score > this.profile.bronze) {
        this.cmband = 'Merchant Band is Silver';
        this.cmimgband = '../../../assets/img/silver.png';
        this.cmcolorband = '#d8d8d8';
        this.cmfontband = 'black';
        this.cmpercentageband = 100 * (score - this.profile.bronze) / (this.profile.silver - this.profile.bronze);
      }
    }
    this.cmtextband = '%' + this.cmpercentageband;
    console.log('band', this.cmband, this.cmpercentageband, this.cmfontband);
  }

}
