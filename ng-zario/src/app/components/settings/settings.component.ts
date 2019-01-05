import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { PromotionService } from '../../services/promotion.service';
import { Settings, Codes } from '../../shared/profile';
import { apppromotions } from '../../shared/promotions';
import { awsMediaPath } from '../../shared/blog';
import { BlogService } from '../../services/blog.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  fs: FormGroup;  // Setting Form control
  vbg: FormGroup;
  codes: Codes[];
  settings: Settings;
  subscription: Subscription;
  username: string = undefined;
  SETTINGS = false; // is their a Settings records (true) or not (false)
  message: string;
  messageClass: string;
  notUpdated = false;
  selectedImageFile: File = null;
  selectedImageFileName = 'No New Image Selected';
  avatarPath = '../../../assets/img/avatardefault.png';
  avatarShow = false;
  avatarChanged = false;
  _sid = '';
  _uid = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private promotionService: PromotionService,
    private blogService: BlogService,
    private router: Router
  ) {
    this.createfs();
   }

  ngOnInit() {
    this.codes = [
      {countryCode: '+973 Bahrain'},
      {countryCode: '+966 KSA'},
      {countryCode: '+965 Kuwait'},
      {countryCode: '+968 Oman'},
      {countryCode: '+974 Qatar'},
      {countryCode: '+66 Thailand'},
      {countryCode: '+971 UAE'},
      {countryCode: '+1 USA'}
    ];
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
      .subscribe(
        name => {
          this.username = name;
          this.subscription.unsubscribe();
          this.profileService.getSettings()
          .subscribe(settings => {
            this.settings = settings[0];
            this.authService.getUser(this.username)
            .subscribe(user => {
              this._uid = user._id;
            });
            if (!this.settings) {
              this.notUpdated = false;
            } else {
              this._sid = this.settings._id;
              if (this.settings.avatar) {
                this.avatarPath = awsMediaPath + this.settings.avatar;
                this.selectedImageFileName = 'Image Selected from file';
              } else {
                this.avatarPath = '../../../assets/img/avatardefault.png';
              }
              this.fs.setValue({
                username: this.username,
                name: this.settings.name,
                email: this.settings.email,
                city: this.settings.city,
                countrycode: this.settings.countrycode,
                mobile: this.settings.mobile,
                phone: this.settings.phone,
                bronze: this.settings.bronze,
                silver: this.settings.silver,
                gold: this.settings.gold,
                platinum: this.settings.platinum,
                pearl: this.settings.pearl,
                blackdiamond: this.settings.blackdiamond,
                cbronze: this.settings.cbronze,
                csilver: this.settings.csilver,
                cgold: this.settings.cgold,
                cplatinum: this.settings.cplatinum,
                cpearl: this.settings.cpearl,
                cblackdiamond: this.settings.cblackdiamond,
                zariosprice: this.settings.zariosprice,
                zariosdistributionratio: this.settings.zariosdistributionratio,
                commission: this.settings.commission
              });
              this.SETTINGS = true;
              this.notUpdated = true;
            }
            console.log('form values: ', this.fs.value);
          },
            errmess => {
              console.log('error : ', errmess);
          });
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createfs() {
    this.fs = this.formBuilder.group({
      username: this.username,
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(15),
        Validators.maxLength(50),
        this.validateName
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
        this.validateEmail // Custom validation
      ])],
      city: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        this.validateName
      ])],
      countrycode: '+965 Kuwait',
      mobile: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(10),
        this.validateMobile
      ])],
      phone: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(10),
        this.validateMobile
      ])],
        bronze: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        silver: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        gold: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        platinum: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        pearl: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        blackdiamond: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        cbronze: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        csilver: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        cgold: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        cplatinum: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        cpearl: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        cblackdiamond: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        zariosprice: [0, Validators.compose([
          Validators.required,
          this.validateNumericFloat
        ])],
        zariosdistributionratio: [0, Validators.compose([
          Validators.required,
          this.validateNumericFloat
        ])],
        commission: [0, Validators.compose([
          Validators.required,
          this.validateNumericFloat
        ])]
    }, {
      validator:
      Validators.compose([
        this.bandmSync('bronze', 'silver', 'gold', 'platinum', 'pearl', 'blackdiamond'),
        this.bandcSync('cbronze', 'csilver', 'cgold', 'cplatinum', 'cpearl', 'cblackdiamond')
      ])
    });

    this.onChanges();
  }

  onChanges(): void {
    this.fs.valueChanges.subscribe(val => {
      this.notUpdated = false;
    });
  }

  imageFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImageFile = event.target.files[0];
      this.displayMediaFile();
    }
  }

  displayMediaFile() {
    this.avatarChanged = true;
    this.notUpdated = false;
    this.selectedImageFileName = `Selected Image: ${this.selectedImageFile.name}`;
    function imageExists(url, callback) {
      const img = new Image();
      img.onload = function() { callback(true); };
      img.onerror = function() { callback(false); };
      img.src = url;
    }
    const reader = new FileReader();
    reader.onload = (event: any) => {
      imageExists(event.target.result, (exists) => {
        if (exists) {
          this.avatarPath = event.target.result;
        } else {
          this.selectedImageFileName = 'Your selection is not an Image File';
          this.avatarPath = '../../../assets/img/avatardefault.png';
        }
      });
    };
    reader.readAsDataURL(this.selectedImageFile);
  }

  validateNumericFloat(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[+-]?\d+(\.\d+)?$/);
    // Test Value for numeric against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid number
    } else {
      return { 'validateNumericFloat': true }; // Return as invalid number
    }
  }

  bandmSync(bronze, silver, gold, platinum, pearl, blackdiamond) {
    return (group: FormGroup) => {
      if (Number(group.controls[silver].value) <= Number(group.controls[bronze].value)) {
        return { 'bandmSync': true };
      } else if (Number(group.controls[gold].value) <= Number(group.controls[silver].value)) {
        return { 'bandmSync': true };
      } else if (Number(group.controls[platinum].value) <= Number(group.controls[gold].value)) {
        return { 'bandmSync': true };
      } else if (Number(group.controls[pearl].value) <= Number(group.controls[platinum].value)) {
        return { 'bandmSync': true };
      } else if (Number(group.controls[blackdiamond].value) <= Number(group.controls[pearl].value)) {
        return { 'bandmSync': true };
      } else {
        return null;
      }
    };
  }

  bandcSync(cbronze, csilver, cgold, cplatinum, cpearl, cblackdiamond) {
    return (group: FormGroup) => {
      if (Number(group.controls[csilver].value) <= Number(group.controls[cbronze].value)) {
        return { 'bandcSync': true };
      } else if (Number(group.controls[cgold].value) <= Number(group.controls[csilver].value)) {
        return { 'bandcSync': true };
      } else if (Number(group.controls[cplatinum].value) <= Number(group.controls[cgold].value)) {
        return { 'bandcSync': true };
      } else if (Number(group.controls[cpearl].value) <= Number(group.controls[cplatinum].value)) {
        return { 'bandcSync': true };
      } else if (Number(group.controls[cblackdiamond].value) <= Number(group.controls[cpearl].value)) {
        return { 'bandcSync': true };
      } else {
        return null;
      }
    };
  }

  // Function to validate name is proper format
  validateName(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(([A-Za-z]+[\-\']?)*([A-Za-z]+)?\s)+([A-Za-z]+[\-\']?)*([A-Za-z]+)?$/);
    const regExpSingle = new RegExp(/^[a-zA-Z '.-]*$/);
    // Test name against regular expression
    if (regExp.test(controls.value) || regExpSingle.test(controls.value)) {
      return null; // Return as valid name
    } else {
      return { 'validateName': true }; // Return as invalid name
    }
  }
  // Function to validate e-mail is proper format
  validateEmail(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Test email against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid email
    } else {
      return { 'validateEmail': true }; // Return as invalid email
    }
  }
  // Function to validate name is proper format
  validateMobile(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(?:[1-9]\d*|\d)$/);
    // Test phone against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid phone
    } else {
      return { 'validateMobile': true }; // Return as invalid Mobile
    }
  }
  validateValue(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^\d+$/);
    // Test Value for numeric against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid number
    } else {
      return { 'validateValue': true }; // Return as invalid number
    }
  }

  onfsSubmit() {
    this.settings = this.fs.value;
    this.settings.username = this.username;
    console.log('avatarChanged flag : ', this.avatarChanged);
    if (this.avatarChanged) {
      const fileext = this.selectedImageFile.type.slice(this.selectedImageFile.type.indexOf('/') + 1);
      const specs = this._uid + fileext;
      this.blogService.postAWSMediaURL(specs)
                .subscribe(uploadConfig => {
                  this.blogService.putAWSMedia(uploadConfig.url , this.selectedImageFile)
                  .subscribe(resp => {
                    this.avatarPath = awsMediaPath + uploadConfig.key;
                    this.settings.avatar = uploadConfig.key;
                    this.selectedImageFileName = '';
                    this.avatarChanged = false;
                    this.settingsDataBaseChange();
                  },
                  errormessage => {
                    this.message = errormessage;
                    this.messageClass = 'alert alert-danger';
                  });
          });
    } else {
      this.settingsDataBaseChange();
    }
  }

  settingsDataBaseChange() {
    console.log('settings settingsDataBaseChange: ', this.settings);
    if (!this.SETTINGS) {
      this.profileService.addSettings(this.settings).subscribe(
        data => {
          console.log('added settings data : ', data);
          this.messageClass = 'alert alert-success';
          this.message = 'Settings Add Successfull';
          // data._id should be placed in the user record for _gid & _mid for the admin staff
          this.authService.getUser(this.username)
          .subscribe(user => {
            console.log('user : ', user);
            user._mid = data._id;
            user._gid = data._id;
            this.authService.updateUser(user._id, user).subscribe(
              data => {
                console.log('update USER data : ', data);
                this.messageClass = 'alert alert-success';
                this.message = 'User Data Update Successfull';
                for (let i = 0; i < apppromotions.length; i++) {
                  apppromotions[i]._mid = user._mid;
                  this.promotionService.addPromotion(apppromotions[i]).subscribe(
                    data => {
                      console.log('adding admin promotions i = ', i);
                    },
                    errormessage => {
                      this.message = <any>errormessage;
                      this.messageClass = 'alert alert-danger';
                    }
                  );
                }
              },
              errormessage => {
                this.message = <any>errormessage;
                this.messageClass = 'alert alert-danger';
              }
            );
          },
            errormessage => {
                this.message = <any>errormessage;
                this.messageClass = 'alert alert-danger';
          });
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        },
        errormessage => {
          this.message = <any>errormessage;
          this.messageClass = 'alert alert-danger';
        }
      );
    } else {
        this.profileService.updateSettings(this._sid, this.settings).subscribe(
          data => {
            console.log('updated settings data : ', data);
            this.messageClass = 'alert alert-success';
            this.message = 'Settings Update Successfull';
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1500);
          },
          errormessage => {
            this.message = <any>errormessage;
            this.messageClass = 'alert alert-danger';
          }
        );
    }
  }

}
