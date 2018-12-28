import { Component, OnInit, OnDestroy } from '@angular/core';

import { FormBuilder, FormGroup, FormArray , Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { PromotionService } from '../../services/promotion.service';
import { ProfileService } from '../../services/profile.service';
import { Promotion, Timing, Action, Level, Category } from '../../shared/promotions';
import { MProfile, Merchant } from '../../shared/profile';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-mpromotions',
  templateUrl: './mpromotions.component.html',
  styleUrls: ['./mpromotions.component.css']
})
export class MPromotionsComponent implements OnInit, OnDestroy {
  datePickerConfig: Partial<BsDatepickerConfig>;
  fp: FormGroup;  // initial promotion input form control
  fmSelect: FormGroup;
  levels: Level[];
  timings: Timing[];
  actions: Action[];
  categories: Category[];
  promotions: Promotion[];
  mprofiles: Array<MProfile> = [];
  merchants: Array<Merchant> = [];
  // merchant: Merchant;
  promotion: Promotion;
  subscription: Subscription;
  username: string = undefined;
  userrole: string = undefined;
  realname: string = undefined;
  merchant_id: string;
  NEWPROMOTION = true;
  UPDATINGCOMMENT_J: number = null;
  message: string;
  messageClass: string;
  notUpdated = true;
  commentNotUpdated = true;
  showPromotionEntry = false;
  _mid = '';
  _pid = '';
  selectedImageFile: File = null;
  selectedImageFileName = 'No New Image Selected';
  avatarPath = '../../../assets/img/avatardefault.png';
  avatarChanged = false;
  generated: boolean;
  duplicatable: boolean;
  ADDFLAG = false;
  komments: Array<string> = []; // since i am displaying all the promotions for the _mid then i need a field for each comment box in the display so i am using this field for that

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private promotionService: PromotionService,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.datePickerConfig = Object.assign( {},
      {
        containerClass: 'theme-dark-blue',
        showWeekNumbers: false,
        rangeInputFormat : 'DD/MM/YYYY'
      });
    this.createfp();
    this.createfmSelect();
  }

  ngOnInit() {
    this.generated = false;    // if the promotion created date is the same as the mprofile created date.
    this.timings = [
      {timeCode: 'daily'},
      {timeCode: 'weekly'},
      {timeCode: 'monthly'},
      {timeCode: 'day2day'}
    ];
    this.actions = [                // action selection not available to merchant
      {actionCode: 'treasurehunt'},
      {actionCode: 'purchase'},
      {actionCode: 'transition'},
      {actionCode: 'game'},
      {actionCode: 'visit'}
    ];
    this.levels = [
      {levelCode: 'All'},
      {levelCode: 'Bronze'},
      {levelCode: 'Silver'},
      {levelCode: 'Gold'},
      {levelCode: 'Platinum'},
      {levelCode: 'Pearl'},
      {levelCode: 'Blackdiamond'}
    ];
    this.categories = [
      {categoryCode: 'product'},
      {categoryCode: 'service'},
      {categoryCode: 'application'},          // available only for admin and not for merchant
      {categoryCode: 'membership'}
    ];
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
          this.authService.getUser(this.username)
          .subscribe(user => {
            console.log('user : ', user);
            if (user._gid === null || user._mid === null) {
              if (user.role === 'ADMIN') {
                this.message = 'You must setup the System parameter option before proceeding';
              } else {
                this.message = 'Group Admin must set Group and Merchant Profile before proceeding';
              }
              this.messageClass = 'alert alert-danger';
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 1500);
            }
            this.userrole = user.role;
            if (user.role === 'MERCHANT') {
              this.profileService.getMProfile(this.username)
              .subscribe(mprofiles => {
                this.mprofiles = mprofiles;
                console.log('this.mprofiles : ', this.mprofiles[0]._id, this.mprofiles.length);
                this.processPromotions();
              },
              errormessage => {
                this.message = <any>errormessage;
                this.messageClass = 'alert alert-danger';
              });
            } else if (user.role === 'merchant') {
              console.log('merchant logic here');
              this.profileService.getMProfileID(user._mid)
              .subscribe(mprofile => {
                this.mprofiles[0] = mprofile;
                console.log('this.mprofiles : ', this.mprofiles[0]);
                this.processPromotions();
              },
              errormessage => {
                this.message = <any>errormessage;
                this.messageClass = 'alert alert-danger';
              });
            } else if (user.role === 'ADMIN') {
              this._mid = user._mid;
              this.profileService.getMProfiles()
              .subscribe(mprofiles => {
                this.mprofiles = mprofiles;
                this.merchants.push({
                  '_id': this._mid,
                  'name': 'System Administrator Promotions'
                });
                for (let i = 0; i < this.mprofiles.length; i++) {
                  console.log('merchant i name ', i, this.mprofiles[i].name);
                  this.merchants.push({
                    '_id': this.mprofiles[i]._id,
                    'name': this.mprofiles[i].name
                  });
                }
                this.fmSelect.controls['merchant'].setValue(this.merchants[0].name);
                    // Use merchant_id and fetch promotions note: these are set to fetch the system administrator promotions
                this.promotionService.getPromotions(this._mid)
                .subscribe(promotions => {
                  this.promotions = promotions;
                  console.log('promotions : ', this.promotions);
                  for (let x = 0; x < this.promotions.length; x++) {
                    this.komments.push(' ');
                    console.log('building komments i = ', x);
                  }
                },
                errormessage => {
                    this.message = <any>errormessage;
                    this.messageClass = 'alert alert-danger';
                });
              },
              errormessage => {
                this.message = <any>errormessage;
                this.messageClass = 'alert alert-danger';
              });
            }
          },
            errormessage => {
                this.message = <any>errormessage;
                this.messageClass = 'alert alert-danger';
          });
      });
  }

  processPromotions() {
    if (this.mprofiles.length === 0) {
      this.message = 'Please Add a merchant profiles before adding promotions';
      this.messageClass = 'alert alert-danger';
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1500);
    } else if (this.mprofiles.length > 0) {
      for (let i = 0; i < this.mprofiles.length; i++) {
        console.log('merchant i name ', i, this.mprofiles[i].name);
        this.merchants.push({
          '_id': this.mprofiles[i]._id,
          'name': this.mprofiles[i].name
        });
      }
      this.fmSelect.controls['merchant'].setValue(this.merchants[0].name);
    }
    this._mid = this.mprofiles[0]._id;
    // Use merchant_id and fetch promotions
    this.promotionService.getPromotions(this._mid)
    .subscribe(promotions => {
      this.promotions = promotions;
      console.log('promotions : ', this.promotions);
      for (let x = 0; x < this.promotions.length; x++) {
        this.komments.push(' ');
        console.log('building komments i = ', x);
      }
    },
    errormessage => {
        this.message = <any>errormessage;
        this.messageClass = 'alert alert-danger';
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  togglePromotionEntry() {
    this.showPromotionEntry = !this.showPromotionEntry;
  }

  AddNewPromotion() {
    this.NEWPROMOTION = true;
    this.notUpdated = true;
    this.fp.controls['name'].enable();
    this.fp.controls['narrative'].enable();
    this.fp.controls['level'].enable();
    if (this.userrole === 'ADMIN') {
      this.fp.controls['category'].enable();
      this.fp.controls['action'].enable();
      this.fp.controls['timing'].enable();
    }
    this.generated = false;
    this.ADDFLAG = false;
  }

  changeMerchant() {
    let ndx;
    for ( ndx = 0; ndx < this.merchants.length; ndx++) {
      if (this.merchants[ndx].name === this.fmSelect.controls['merchant'].value) {
        break;
      }
    }
    this.fmSelect.controls['merchant'].setValue(this.merchants[ndx].name);
    this._mid = this.merchants[ndx]._id;
    // Use merchant_id and fetch promotions or use settings _id for admin staff
    this.promotionService.getPromotions(this._mid)
    .subscribe(promotions => {
      this.promotions = promotions;
      console.log('promotions : ', this.promotions);
    },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass = 'alert alert-danger';
    });
  }

  createfmSelect() {
    this.fmSelect = this.formBuilder.group({
      merchant: ''
    });
  }

  createfp() {
    this.fp = this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(50),
        this.validateName
      ])],
      narrative: '',
      activity: false,
      timing: 'day2day',
      action: 'purchase',
      level: 'All',
      category: 'membership',
      daterange: [null, Validators.compose([
        Validators.required
      ])],
      discount: [0, Validators.compose([
        Validators.required,
        this.validateNumericFloat
      ])],
      meritsonpurchase: true,
      merits: [0, Validators.compose([
        Validators.required,
        this.validateNumericFloat
      ])],
      zarios: [0, Validators.compose([
        Validators.required,
        this.validateNumericFloat
      ])],
      description: ['', Validators.compose([
        Validators.required,
        Validators.minLength(50)
      ])]
    });

    this.onChanges();

  }
  onChanges(): void {
    this.fp.valueChanges.subscribe(val => {
      this.notUpdated = false;
    });
  }


  // Function to validate name is proper format
  validateName(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[a-zA-Z '.-]*$/);
    // Test name against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid name
    } else {
      return { 'validateName': true }; // Return as invalid name
    }
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

  imageFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImageFile = <File>event.target.files[0];
      this.selectedImageFileName = `Selected Image: ${this.selectedImageFile.name}`;
      this.avatarChanged = true;
      this.notUpdated = false;
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.avatarPath = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onfpSubmit() {
    if (this.userrole !== 'ADMIN') {
      this.fp.controls['category'].enable();
      this.fp.controls['action'].enable();
      this.fp.controls['timing'].enable();
    }
    this.promotion = this.fp.value;
    this.promotion._mid = this._mid;
    this.promotion.avatar = this.avatarPath;
    console.log('promotion and formValues', this.promotion, this.fp.value);

    if (this.avatarChanged) {
      const fd = new FormData();
      fd.append('imageFile', this.selectedImageFile);
      this.profileService.imageUpload(fd).subscribe(
        imageData => {
          this.promotion.avatar = 'avatars/' + imageData.filename;
          this.promotionsDataBaseChange();
        },
        errormessage => {
          this.message = 'Accepts image files less than 500KB ONLY, Please try another image';
          this.messageClass = 'alert alert-danger';
        }
      );
    } else {
      this.promotionsDataBaseChange();
    }
  }

  promotionsDataBaseChange() {
    if (this.NEWPROMOTION) {
      this.promotion.generated = false;
      this.promotionService.addPromotion(this.promotion).subscribe(
        data => {
          console.log('add data : ', data);
          this.messageClass = 'alert alert-success';
          this.message = 'Promotion Add Successfull';
          setTimeout(() => {
            this.messageClass = '';
            this.message = '';
          }, 1500);
          // get promotions again and make ready for display
          this.getPromotions();
          this.clearfp();
        },
        errormessage => {
          this.message = <any>errormessage;
          this.messageClass = 'alert alert-danger';
        }
      );
    } else {
        this.promotionService.updatePromotion(this._pid, this.promotion).subscribe(
          data => {
            console.log('update data : ', data);
            this.messageClass = 'alert alert-success';
            this.message = 'Promotion Update Successfull';
            setTimeout(() => {
              this.messageClass = '';
              this.message = '';
            }, 1500);
            // get promotions again and make ready for display
            this.getPromotions();
            this.clearfp();
          },
          errormessage => {
            this.message = <any>errormessage;
            this.messageClass = 'alert alert-danger';
          }
        );
    }
  }

  clearfp() {
    this.avatarPath = '../../../assets/img/avatardefault.png';
    this.fp.reset();
    this.fp.setValue ({
      name: '',
      narrative: '',
      activity: false,
      timing: 'day2day',
      action: 'purchase',
      level: 'All',
      category: 'membership',
      daterange: null,
      discount: 0,
      meritsonpurchase: true,
      merits: 0,
      zarios: 0,
      description: ''
    });
    this.AddNewPromotion();
    this.togglePromotionEntry();
  }

  getPromotions() {
      // Use merchant_id and fetch promotions
      this.promotionService.getPromotions(this._mid)
      .subscribe(promotions => {
        this.promotions = promotions;
        console.log('promotions : ', this.promotions);
      },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass = 'alert alert-danger';
      });
  }

  editPromotion(i) {
    // get the index value for the promotion and set the form to its values from the array
    // allow for change and update when requested.
    this._pid = this.promotions[i]._id;
    this.generated = this.promotions[i].generated;
    this.duplicatable = this.promotions[i].duplicatable;
    if (this.promotions[i].avatar) {
      this.avatarPath = this.promotions[i].avatar;
    } else {
      this.avatarPath = '../../../assets/img/avatardefault.png';
    }
    const dates: Date[] = [
      new Date(this.promotions[i].daterange[0]),
      new Date(this.promotions[i].daterange[1])
    ];
    this.fp.setValue ({
      name: this.promotions[i].name,
      narrative: this.promotions[i].narrative,
      activity: this.promotions[i].activity,
      timing: this.promotions[i].timing,
      action: this.promotions[i].action,
      level: this.promotions[i].level,
      category: this.promotions[i].category,
      daterange: dates,
      discount: this.promotions[i].discount,
      meritsonpurchase: this.promotions[i].meritsonpurchase,
      merits: this.promotions[i].merits,
      zarios: this.promotions[i].zarios,
      description: this.promotions[i].description
    });
    if (this.generated) {
      this.fp.controls['name'].disable();
      this.fp.controls['narrative'].disable();
      this.fp.controls['timing'].disable();
      this.fp.controls['level'].disable();
      this.fp.controls['category'].disable();
      this.fp.controls['action'].disable();
    }
    this.NEWPROMOTION = false;
    this.notUpdated = true;
    this.showPromotionEntry = true;
    this.ADDFLAG = true;
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
          this.message = <any>errormessage;
          this.messageClass = 'alert alert-danger';
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
          this.message = <any>errormessage;
          this.messageClass = 'alert alert-danger';
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
        this.message = <any>errormessage;
        this.messageClass = 'alert alert-danger';
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

