import { Component, OnInit } from '@angular/core';

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
  selector: 'app-cdashboard',
  templateUrl: './cdashboard.component.html',
  styleUrls: ['./cdashboard.component.css']
})
export class CDashboardComponent implements OnInit {
  user: User;
  firstname = '';
  lastname = '';
  cprofile: CProfile;
  crm: CRM;
  crms: CRM[];
  mprofile: MProfile;
  mprofiles: Array<MProfile> = [];
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
  avatarPath = '../../../assets/img/avatardefault.png';
  caband = 'Application Band is Bronze';    // ca customer application color band for progress bar
  caimgband = '../../../assets/img/bronze.png';
  cacolorband = '#a15825';
  capercentageband = 45;
  catextband = '%';
  cafontband = 'white';
  maband = '';    // ma merchant application color band for progress bar
  maimgband = '../../../assets/img/bronze.png';
  macolorband = '#a15825';
  mapercentageband = 65;
  matextband = '%';
  mafontband = 'white';
  cmband = '';    // cm customer merchant color band for progress bar
  cmimgband = '../../../assets/img/bronze.png';
  cmcolorband = '#a15825';
  cmpercentageband = 91;
  cmtextband = '%';
  cmfontband = 'white';
  MI = 0;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private blogService: BlogService,
    private router: Router
  ) {
    this.catextband += this.capercentageband;
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
          this.profileService.getCProfile(this.username)
          .subscribe(cprofile => {
            this.cprofile = cprofile;
            this.authService.getUser(this.username)
            .subscribe(user => {
              this._uid = user._id;
              this.user = user;
            });
            if (!cprofile) {
              this.message = 'You have no profile';
              this.messageClass = 'alert alert-danger';
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 1500);
            } else {
              this._cid = cprofile._id;
              if (this.cprofile.avatar) {
                this.avatarPath = awsMediaPath + this.cprofile.avatar;
              } else {
                this.avatarPath = '../../../assets/img/avatardefault.png';
              }
            }
            this.checkcaBand(this.cprofile.score);
            this.getMerchants();
          },
            errmess => {
              console.log('error : ', errmess);
          });
      });
  }

  getMerchants() {
    //
    this.profileService.getCRM(this._cid)
        .subscribe(crm => {
          console.log('crm: ', crm);
          this.crms = crm;
          for (let i = 0; i < crm.length; i++) {
            this.profileService.getMProfileID(crm[i]._mid)
              .subscribe(mprofile => {
                  this.mprofiles.push(mprofile);
                  if (i === (crm.length - 1) ) {
                    this.MI = 0;
                    this._mid = this.mprofiles[0]._id;
                    console.log('profiles: ', this.mprofiles);
                  }
                });
          }
        });
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
      this.cmpercentageband = 100 * score / this.mprofile.bronze;
      if (score > this.mprofile.pearl) {
        this.cmband = 'Merchant Band is Blackdiamond';
        this.cmimgband = '../../../assets/img/blackdiamond.png';
        this.cmcolorband = '#222221';
        this.cmfontband = 'white';
        this.cmpercentageband = 100 * (score - this.mprofile.pearl) / (this.mprofile.blackdiamond - this.mprofile.pearl);
      } else if (score > this.mprofile.platinum) {
        this.cmband = 'Merchant Band is Pearl';
        this.cmimgband = '../../../assets/img/pearl.png';
        this.cmcolorband = '#f0d6c8';
        this.cmfontband = 'balck';
        this.cmpercentageband = 100 * (score - this.mprofile.platinum) / (this.mprofile.pearl - this.mprofile.platinum);
      } else if (score > this.mprofile.gold) {
        this.cmband = 'Merchant Band is Platinum';
        this.cmimgband = '../../../assets/img/platinum.png';
        this.cmcolorband = '#b3aea3';
        this.cmfontband = 'white';
        this.cmpercentageband = 100 * (score - this.mprofile.gold) / (this.mprofile.platinum - this.mprofile.gold);
      } else if (score > this.mprofile.silver) {
        this.cmband = 'Merchant Band is Gold';
        this.cmimgband = '../../../assets/img/gold.png';
        this.cmcolorband = '#ca961c';
        this.cmfontband = 'black';
        this.cmpercentageband = 100 * (score - this.mprofile.silver) / (this.mprofile.gold - this.mprofile.silver);
      } else if (score > this.mprofile.bronze) {
        this.cmband = 'Merchant Band is Silver';
        this.cmimgband = '../../../assets/img/silver.png';
        this.cmcolorband = '#d8d8d8';
        this.cmfontband = 'black';
        this.cmpercentageband = 100 * (score - this.mprofile.bronze) / (this.mprofile.silver - this.mprofile.bronze);
      }
    }
    this.cmtextband = '%' + this.cmpercentageband;
    console.log('band', this.cmband, this.cmpercentageband, this.cmfontband);
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

}
