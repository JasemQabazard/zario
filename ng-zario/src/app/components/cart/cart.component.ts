import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';

import { FormBuilder, FormGroup, FormArray , FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { PromotionService } from '../../services/promotion.service';
import { ProfileService } from '../../services/profile.service';
import { TransService } from '../../services/trans.service';
import { PromotionScannerService } from '../../services/promotion-scanner.service';

import { Promotion, merchantpromotions } from '../../shared/promotions';
import { MProfile, CProfile, CRM, Merchant, Settings} from '../../shared/profile';
import { Trans } from '../../shared/trans';
import { Zario } from '../../shared/zario';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { Subscription } from 'rxjs/Subscription';

interface DisplayPromotion {
  name: string;
  discount: number;
  merits: number;
  zarios: number;
  productservicecode: string;
  applied: boolean;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CartComponent implements OnInit {

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent;
  ft: FormGroup;  // initial transaction input form control
  fm: FormGroup;
  ap: FormArray;  // application promotions
  mp: FormArray; // merchant promotions
  _cid = '';
  _mid = '';
  _gid = '';
  _tid = '';      // cart transaction _id after it is added to data base table
  CRMINDEX: number = null;
  cprofile: CProfile;
  settings: Settings;
  mprofiles: Array<MProfile> = [];
  merchants: Array<Merchant> = [];
  crm: Array<CRM> = [];
  customername = '';
  subscription: Subscription;
  username: string = undefined;
  userrole: string = undefined;
  useremail = '';
  usermobile = '';
  promotions: Array<Promotion> = [];
  originalpromotions: Array<Promotion> = [];
  Apromotions: Array<Promotion> = []; // application promotions
  originalApromotions: Array<Promotion> = []; // application original promotions
  message: string;
  messageClass: string;
  avatarPath = '../../../assets/img/avatardefault.png';
  applybtns: Array<boolean> = [];
  dp: Array<DisplayPromotion> = []; // merchant display promotions
  adp: Array<DisplayPromotion> = []; // application display promotions
  displayPromotion: DisplayPromotion = {
    name: '',
    discount: 0,
    merits: 0,
    zarios: 0,
    productservicecode: '',
    applied: true
  };
  CMI: number = null;
  score: number = null;
  mBand = '';
  aBand = '';
  BAND: string[] = ['NONE', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Pearl', 'Blackdiamond'];
  zariosdistribution = {             // to customer & merchant
    app: 0,                        // from app promotions to customer
    merchant: 0,                   // from merchant promotions to customer
    purchase: 0                    // based on purchase as part of commision going to customer-->
  };                                  // -->/merchant/ & app (me).
  totalcommission: number;
  menuoption = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private promotionService: PromotionService,
    private promotionScannerService: PromotionScannerService,
    private transService: TransService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.menuoption = activatedRoute.snapshot.params['menuoption'];
    console.log('activated router parameter value: ', this.menuoption);
    this.createft();
    this.createfm();
 }

  ngOnInit() {
      if (this.menuoption === '1') {
        console.log('using customer mobile or name for cart trans processing');
      } else if (this.menuoption === '0') {
        this.qrScannerComponent.getMediaDevices().then(devices => {
          console.log(devices);
          const videoDevices: MediaDeviceInfo[] = [];
          for (const device of devices) {
              if (device.kind.toString() === 'videoinput') {
                  videoDevices.push(device);
              }
          }
          if (videoDevices.length > 0) {
              let choosenDev;
              for (const dev of videoDevices) {
                  if (dev.label.includes('front')) {
                      choosenDev = dev;
                      break;
                  }
              }
              if (choosenDev) {
                  this.qrScannerComponent.chooseCamera.next(choosenDev);
              } else {
                  this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
              }
          }
        });
        this.qrScannerComponent.capturedQr.subscribe(result => {
          console.log(result);
            this._cid = result;
            this.profileService.getCProfileID(this._cid)
            .subscribe(cprofile => {
              this.cprofile = cprofile;
              console.log(cprofile);
              if (cprofile.avatar) {
                this.avatarPath = `avatars/${cprofile.avatar}`;
              }
              this.authService.getUser(cprofile.username)
              .subscribe(user => {
                this.customername = user.firstname + ' ' + user.lastname;
                this.useremail = user.email;
                this.processmerchant();
              });
            });
        });
      }
  }

  emailentry() {
    this.authService.getUserbyemail(this.useremail)
    .subscribe(user => {
      if (user) {
        this.customername = user.firstname + ' ' + user.lastname;
        this.useremail = user.email;
        this.username = user.username;
        this.profileService.getCProfile(this.username)
            .subscribe(cprofile => {
              this.cprofile = cprofile;
              this._cid = cprofile._id;
              if (cprofile.avatar) {
                this.avatarPath = `avatars/${cprofile.avatar}`;
              }
              this.processmerchant();
            },
            errormessage => {
              console.log('user access error by email : ', errormessage);
            });
      } else {
        this.message = 'email not correct or not in system!';
        this.messageClass = 'alert alert-danger';
      }
     },
     errormessage => {
       console.log('user access error by email : ', errormessage);
     });
  }

  mobileentry() {
    console.log('mobile: ', this.usermobile);
    this.authService.getUserbymobile(this.usermobile)
    .subscribe(user => {
      if (user) {
        this.customername = user.firstname + ' ' + user.lastname;
        this.useremail = user.email;
        this.username = user.username;
        this.profileService.getCProfile(this.username)
            .subscribe(cprofile => {
              if (cprofile) {
                this.cprofile = cprofile;
                this._cid = cprofile._id;
                if (cprofile.avatar) {
                  this.avatarPath = `avatars/${cprofile.avatar}`;
                }
                this.processmerchant();
                } else {
                  this.message = 'mobile does not belong to customer!';
                  this.messageClass = 'alert alert-danger';
                }
              },
              errormessage => {
                console.log('user access error by mobile : ', errormessage);
              });
      } else {
        this.message = 'mobile not correct or not in system!';
        this.messageClass = 'alert alert-danger';
      }
     },
     errormessage => {
       console.log('user access error by mobile : ', errormessage);
     });
  }

  processmerchant() {
    this.message = '';
    this.messageClass = '';
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
    .subscribe(
      name => {
        this.username = name;
        // this.subscription.unsubscribe();
        this.authService.getUser(this.username)
        .subscribe(user => {
          console.log('user : ', user);
          this.userrole = user.role;
          this._mid = user._mid;
          this._gid = user._gid;
          if (this.userrole === 'merchant') {
            console.log('only one mprofile exists for merchant');
            this.profileService.getMProfileID(user._mid)
            .subscribe(mprofile => {
              this.mprofiles[0] = mprofile;
              console.log('this.mprofiles : ', this.mprofiles[0]);
              this.merchants.push({
                '_id': mprofile._id,
                'name': mprofile.name
              });
              this.fm.controls['merchant'].setValue(this.merchants[0].name);
              this.CMI = 0;
              this.LoadCRM();
              this.getApplicationPromotions();
            },
            errormessage => {
              console.log('merchant: error while access mprofile table', errormessage);
            });
          } else if (this.userrole === 'MERCHANT') {
            console.log('multiple profiles exist for MERCHANT');
            this.profileService.getMProfile(this.username)
            .subscribe(mprofiles => {
              this.mprofiles = mprofiles;
              console.log('this.mprofiles : ', this.mprofiles[0]._id, this.mprofiles.length);
              for (let i = 0; i < this.mprofiles.length; i++) {
                console.log('merchant i name ', i, this.mprofiles[i].name);
                this.merchants.push({
                  '_id': this.mprofiles[i]._id,
                  'name': this.mprofiles[i].name
                });
              }
              this.fm.controls['merchant'].setValue(this.merchants[0].name);
              this._mid = this.merchants[0]._id;
              this.CMI = 0;
              this.LoadCRM();
              this.getApplicationPromotions();
            },
            errormessage => {
              console.log('MERCHANT: error wile access mprofile ntable', errormessage);
            });
          }
        });
    });
  }

  getApplicationPromotions() {
    const now = new Date();
    this.profileService.getSettings()
    .subscribe(settings => {
      this.settings = settings[0];
      this.aBand = this.checkaBand(this.cprofile.score);
      this.promotionService.getPromotions(settings[0]._id)
      .subscribe(promotions => {
        for (let x = 0; x < promotions.length; x++) {
          if (promotions[x].activity && now < new Date(promotions[x].daterange[1]) && now > new Date(promotions[x].daterange[0])) {
            this.originalApromotions.push(promotions[x]);
          }
        }
        console.log('app promotions ', promotions, this.originalApromotions);
        this.originalApromotions = this.promotionScannerService.cartCore(this.originalApromotions, this.aBand);
        this.Apromotions = this.promotionScannerService.cartTransitions(this.originalApromotions, 'NONE', 0);
        this.prepareap();
        console.log('adp ', this.adp);
      },
      errormessage => {
        console.log('errormessage promotion access', errormessage);
      });
    });
  }

  getMerchantPromotions() {
    const now = new Date();
    this.promotions = [];
    this.originalpromotions = [];
    this.promotionService.getPromotions(this._mid)
    .subscribe(promotions => {
      for (let x = 0; x < promotions.length; x++) {
        if (promotions[x].activity && now < new Date(promotions[x].daterange[1]) && now > new Date(promotions[x].daterange[0])) {
          this.originalpromotions.push(promotions[x]);
        }
      }
      this.originalpromotions = this.promotionScannerService.cartCore(this.originalpromotions, this.mBand);
      this.cartTimed();
      this.promotions = this.promotionScannerService.cartTransitions(this.originalpromotions, 'NONE', 0);
      if (this.mBand === '') {
        this.mBand = 'Bronze';
      }
      let zarios = 0;
      for (let x = 0; x < this.promotions.length; x++) {
        zarios += this.promotions[x].zarios;
      }
      if (zarios > this.mprofiles[this.CMI].zarios) {
        this.message = 'Merchant profile does not have enough zarios coins to distribute to Customer. Transaction will carry on with distribution.';
        this.messageClass = 'alert alert-danger';
        for (let x = 0; x < this.promotions.length; x++) {
          this.promotions[x].zarios = 0;
        }
      }
      this.preparemp();
    },
    errormessage => {
      console.log('errormessage promotion access', errormessage);
    });
  }

  prepareap() {
    this.ap = this.ft.get('ap') as FormArray;
    for (let j = (this.ap.length - 1); j > 0; j--) {
      this.ap.removeAt(j);
    }
    this.adp = [];
    for (let x = 0; x < this.Apromotions.length; x++) {
      this.displayPromotion = ({
        name: '',
        discount: 0,
        merits: 0,
        zarios: 0,
        productservicecode: '',
        applied: true
      });
      this.displayPromotion.name = this.Apromotions[x].name;
      this.displayPromotion.merits = this.Apromotions[x].merits;
      this.displayPromotion.zarios = this.Apromotions[x].zarios;
      this.adp.push(this.displayPromotion);
      if (x === 0) {
            this.ap.setValue(this.adp);
      } else {
            this.ap.push(this.createItem());
      }
    }
  }

  preparemp() {
    this.applybtns = [];
    this.mp = this.ft.get('mp') as FormArray;
    for (let j = (this.mp.length - 1); j > 0; j--) {
      this.mp.removeAt(j);
    }
    this.dp = [];
    for (let x = 0; x < this.promotions.length; x++) {
      this.displayPromotion = ({
        name: '',
        discount: 0,
        merits: 0,
        zarios: 0,
        productservicecode: '',
        applied: true
      });
      this.displayPromotion.name = this.promotions[x].name;
      this.displayPromotion.discount = this.promotions[x].discount;
      this.displayPromotion.merits = this.promotions[x].merits;
      this.displayPromotion.zarios = this.promotions[x].zarios;
      this.displayPromotion.productservicecode = this.promotions[x].productservicecode;
      if (this.promotions[x].category === 'product' || this.promotions[x].category === 'service') {
        this.displayPromotion.applied = false;
        this.applybtns.push(false);
      } else {
        this.displayPromotion.applied = true;
        this.applybtns.push(true);
      }
      console.log(this.displayPromotion);
      this.dp.push(this.displayPromotion);
      if (x === 0) {
            this.mp.setValue(this.dp);
      } else {
            this.mp.push(this.createItem());
      }
    }
    console.log('dp and applybtns', this.dp, this.applybtns, this.promotions.length);
  }

  createfm() {
    this.fm = this.formBuilder.group({
      merchant: ''
    });
  }

  createft() {
    this.ft = this.formBuilder.group({
      amount: [0, Validators.compose([
        Validators.required,
        this.validateNumericFloat
      ])],
      mp: this.formBuilder.array([this.createItem()]),
      ap: this.formBuilder.array([this.createItem()]),
      discount: {value: 0, disabled: true},
      meritsonpurchase: {value: 0, disabled: true},
      merits: {value: 0, disabled: true},
      zarios: {value: 0, disabled: true},
      description: ['', Validators.compose([
        Validators.required,
        Validators.minLength(50)
      ])],
      category: ['', Validators.compose([
        Validators.required,
        Validators.minLength(10)
      ])]
    });
    this.amountChange();
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
        name: {value: this.displayPromotion.name, disabled: true},
        discount: {value: this.displayPromotion.discount, disabled: true},
        merits: {value: this.displayPromotion.merits, disabled: true},
        zarios: {value: this.displayPromotion.zarios, disabled: true},
        productservicecode: {value: this.displayPromotion.productservicecode, disabled: true},
        applied: this.displayPromotion.applied
    });
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

  changeMerchant() {
    let ndx;
    for ( ndx = 0; ndx < this.merchants.length; ndx++) {
      if (this.merchants[ndx].name === this.fm.controls['merchant'].value) {
        break;
      }
    }
    this.fm.controls['merchant'].setValue(this.merchants[ndx].name);
    this._mid = this.merchants[ndx]._id;
    this.CMI = ndx;
    this.LoadCRM();
  }

  LoadCRM() {
    this.crm = [];
    this.score = null;
    this.CRMINDEX = null;
    this.profileService.getCRM(this.cprofile._id)
    .subscribe(crm => {
      for (let i = 0; i < this.mprofiles.length; i++) {
        for (let j = 0; j < crm.length; j++) {
          if (this.mprofiles[i]._id === crm[j]._mid) {
            this.crm.push(crm[j]);
          }
        }
      }
      for (let j = 0; j < this.crm.length; j++) {
        if (this.crm[j]._mid === this._mid) {
          this.score = this.crm[j].score;
          this.CRMINDEX = j;
        }
      }
      if (this.CRMINDEX === null) {
        this.crm.push({
          _id: '',
          _cid: this._cid,
          _mid: this._mid,
          score: 0,
          vists: 0,
          timedpromotions: [{ _pid: ''}]
        });
        this.CRMINDEX = 0;
      }
      console.log('crm ', this.crm);
      this.mBand = this.checkmBand(this.score);
      this.getMerchantPromotions();
    });
  }

  checkmBand(score: number): string {
    let band = '';
    if (score) {             // this will only be true if score !== zero and !== null
      band = 'Bronze';
      if (score > this.mprofiles[this.CMI].pearl) {
        band = 'Blackdiamond';
      } else if (score > this.mprofiles[this.CMI].platinum) {
        band = 'Pearl';
      } else if (score > this.mprofiles[this.CMI].gold) {
        band = 'Platinum';
      } else if (score > this.mprofiles[this.CMI].silver) {
        band = 'Gold';
      } else if (score > this.mprofiles[this.CMI].bronze) {
        band = 'Silver';
      }
    }
    console.log('mband & score', band, score);
    return band;
  }

  checkaBand(score: number): string {
    let band = '';
    if (score) {             // this will only be true if score !== zero and !== null
      band = 'Bronze';
      if (score > this.settings.cpearl) {
        band = 'Blackdiamond';
      } else if (score > this.settings.cplatinum) {
        band = 'Pearl';
      } else if (score > this.settings.cgold) {
        band = 'Platinum';
      } else if (score > this.settings.csilver) {
        band = 'Gold';
      } else if (score > this.settings.cbronze) {
        band = 'Silver';
      }
    }
    console.log('aband & score', band, score);
    return band;
  }

  amountChange() {
    this.ft.get('amount').valueChanges.subscribe(
      amount => {
        let merits = {
          mMerits: 0,
          aMerits: 0
        };
        merits = this.changeDiscountZariosMerits();
        const newmBand = this.checkmBand(this.score + merits.mMerits);
        let reCalcFlag = false;
        if (newmBand !== this.mBand && this.promotions.length !== this.originalpromotions.length) {
          this.promotions = this.promotionScannerService.cartTransitions(this.originalpromotions, newmBand, this.BAND.indexOf(newmBand) - this.BAND.indexOf(this.mBand));
          this.preparemp();
          reCalcFlag = true;
        }
        const newaBand = this.checkaBand(this.cprofile.score + merits.aMerits + merits.mMerits);
        if (newaBand !== this.aBand && this.Apromotions.length !== this.originalApromotions.length) {
          this.Apromotions = this.promotionScannerService.cartTransitions(this.originalApromotions, newaBand, this.BAND.indexOf(newaBand) - this.BAND.indexOf(this.aBand));
          this.prepareap();
          reCalcFlag = true;
        }
        if (reCalcFlag) {
          this.changeDiscountZariosMerits();
        }
    });
  }

  changeDiscountZariosMerits() {
    let discount = 0;
    this.zariosdistribution.app = 0;
    this.zariosdistribution.merchant = 0;
    this.zariosdistribution.purchase = 0;
    const merits = {
      mMerits: 0,
      aMerits: 0
    };
    let meritsonpurchase = 0;
    const amount = Number(this.ft.controls['amount'].value);
    for (let x = 0; x < this.dp.length; x++) {
      if (this.dp[x].applied) {
        discount += this.dp[x].discount;
        this.zariosdistribution.merchant += this.dp[x].zarios;
        merits.mMerits += this.dp[x].merits;
        if (this.promotions[x].meritsonpurchase) {
          meritsonpurchase = amount;
        }
      }
    }
    for (let y = 0; y < this.adp.length; y++) {
      this.zariosdistribution.app += this.adp[y].zarios;
        merits.aMerits += this.adp[y].merits;
    }
    console.log(discount, this.zariosdistribution, merits, meritsonpurchase);
    discount = discount * amount / 100;
    this.totalcommission = 0;
    if (amount * this.settings.zariosdistributionratio < 1) {
      this.totalcommission = amount * this.settings.zariosdistributionratio;
      this.zariosdistribution.purchase = this.totalcommission / this.settings.zariosprice;
    } else {
      this.totalcommission = 1;
      this.zariosdistribution.purchase = 1.0 / this.settings.zariosprice;
    }
    this.ft.patchValue({
          'discount': discount,
          'zarios': this.zariosdistribution.purchase + this.zariosdistribution.app + this.zariosdistribution.merchant,
          'meritsonpurchase': meritsonpurchase,
          'merits': merits.mMerits + merits.aMerits
      });
      merits.mMerits += meritsonpurchase;
    return (merits);
  }

  toggleApplied(i) {
    console.log('toggle Applied');
    this.applybtns[i] = !this.applybtns[i];
    this.dp[i].applied = this.applybtns[i];
    if (this.ft.controls['amount'].value !== 0) {
      this.changeDiscountZariosMerits();
    }
  }
  onftSubmit() {
    console.log(this.ft.value);
    const transaction = {
      _cid: this._cid,
      _mid: this._mid,
      appliedpromotions: [],
      amount: this.ft.controls['amount'].value,
      discount: this.ft.controls['discount'].value,
      meritsonpurchase: this.ft.controls['meritsonpurchase'].value,
      merits: this.ft.controls['merits'].value,
      zarios: this.ft.controls['zarios'].value,
      description: this.ft.controls['description'].value,
      category: this.ft.controls['category'].value
    };
    const crm: CRM = {
      _cid: this._cid,
      _mid: this._mid,
      score: this.crm[this.CRMINDEX].score + transaction.merits + transaction.meritsonpurchase,
      vists: this.crm[this.CRMINDEX].vists + 1,
      distributedzarios: this.crm[this.CRMINDEX].distributedzarios + this.zariosdistribution.merchant,
      totalcommision: this.crm[this.CRMINDEX].totalcommision + this.totalcommission,
      totsales: this.crm[this.CRMINDEX].totsales + this.ft.controls['amount'].value,
      timedpromotions: this.crm[this.CRMINDEX].timedpromotions
    };
    for (let x = 0; x < this.dp.length; x++) {
      if (this.dp[x].applied) {
          if (this.promotions[x].timing === 'hourly' ||
              this.promotions[x].timing === 'daily' ||
              this.promotions[x].timing === 'weekly' ||
              this.promotions[x].timing === 'weekly' ) {
                    if (this.crm[this.CRMINDEX]._id === '' &&
                    crm.timedpromotions.length === 1) {
                      crm.timedpromotions[0]._pid = this.promotions[x]._id;
                    } else {
                      crm.timedpromotions.push({
                        _pid: this.promotions[x]._id
                      });
                    }
          }
          transaction.appliedpromotions.push (
            {
              _pid: this.promotions[x]._id,
              discount: this.promotions[x].discount,
              meritsonpurchase: this.promotions[x].meritsonpurchase,
              merits: this.promotions[x].merits,
              zarios: this.promotions[x].zarios,
              productservicecode: this.promotions[x].productservicecode
            }
          );
      }
    }
    for (let x = 0; x < this.adp.length; x++) {
      transaction.appliedpromotions.push (
        {
          _pid: this.Apromotions[x]._id,
          discount: this.Apromotions[x].discount,
          meritsonpurchase: this.Apromotions[x].meritsonpurchase,
          merits: this.Apromotions[x].merits,
          zarios: this.Apromotions[x].zarios,
          productservicecode: this.Apromotions[x].productservicecode
        }
      );
    }
    if (crm.timedpromotions.length === 1) {
      if (crm.timedpromotions[0]._pid === '') {
        crm.timedpromotions.splice(0, 1);
        console.log('spliced');
      }
    }
    console.log('transaction : ', transaction, crm);
    this.transService.addTrans(<Trans>transaction)
    .subscribe(trans => {
      console.log('transaction sent to data base');
      this._tid = trans._id;
      if (this.crm[this.CRMINDEX]._id === '') {
        this.profileService.addCRM(crm)
        .subscribe(dbcrm => {
          console.log('added to db ', dbcrm);
          this.updateStates();
        },
        errormessage => {
          console.log('errormessage crm add service ', errormessage);
        });
      } else {
        this.profileService.updateCRM(this.crm[this.CRMINDEX]._id, crm)
        .subscribe(dbcrm => {
          console.log('updated in db ', dbcrm);
          this.updateStates();
        },
        errormessage => {
          console.log('errormessage crm update service ', errormessage);
        });
      }
      setTimeout(() => {
        this.router.navigate(['/home']); // Redirect to home page
      }, 1500);
    },
    errormessage => {
      console.log('errormessage transaction add service ', errormessage);
    });
  }

  updateStates() {
    console.log('update cprofile mprofile group settings data tables');
    this.settings.mdistributedzarios += this.zariosdistribution.purchase;
    this.settings.cdistributedzarios += this.zariosdistribution.purchase + this.zariosdistribution.app;
    this.settings.zarios += this.zariosdistribution.purchase;   // my zario coins
    this.settings.notrans += 1;
    this.settings.totcommissions += this.totalcommission;
    this.profileService.updateSettings(this.settings._id, this.settings).subscribe(
      data => {
        console.log('updated settings data : ', data);
        this.messageClass = 'alert alert-success';
        this.message = 'Settings Update Successfull';
      },
      errormessage => {
        console.log('errormessage transaction add service ', errormessage);
      }
    );
    this.cprofile.score += Number(this.ft.controls['merits'].value);
    this.cprofile.zarios += this.zariosdistribution.purchase + this.zariosdistribution.merchant + this.zariosdistribution.app;
    this.cprofile.notrans++;
    this.cprofile.totpurchase += Number(this.ft.controls['amount'].value);
    this.cprofile.totcommissions += this.totalcommission;
    this.profileService.updateCProfile(this._cid, this.cprofile).subscribe(
      data => {
        console.log('update data : ', data);
        this.messageClass = 'alert alert-success';
        this.message = 'Profile Update Successfull';
      },
      errormessage => {
        console.log('errormessage transaction add service ', errormessage);
      }
    );
    this.mprofiles[this.CMI].score += Number(this.ft.controls['merits'].value);
    this.mprofiles[this.CMI].zarios += this.zariosdistribution.purchase;
    this.mprofiles[this.CMI].zarios -= this.zariosdistribution.merchant;
    this.mprofiles[this.CMI].cdistributedzarios += this.zariosdistribution.merchant;
    this.mprofiles[this.CMI].notrans++;
    this.mprofiles[this.CMI].totalcommision += this.totalcommission;
    this.mprofiles[this.CMI].totsales += Number(this.ft.controls['amount'].value);
    this.profileService.updateMProfile(this._mid, this.mprofiles[this.CMI]).subscribe(
      data => {
        console.log('data : ', data);
        this.messageClass = 'alert alert-success';
        this.message = 'Profile Update Successfull';
      },
      errormessage => {
        console.log('errormessage transaction add service ', errormessage);
      }
    );
    this.profileService.getGroup(this.username)
    .subscribe(gp => {
      console.log('group in profile component ', gp);
      gp.notrans++;
      gp.score += Number(this.ft.controls['merits'].value);
      gp.cdistributedzarios += this.zariosdistribution.merchant;
      gp.totalcommision += this.totalcommission;
      gp.totsales += Number(this.ft.controls['amount'].value);
      this.profileService.updateGroup(this._gid, gp).subscribe(
        data => {
          this.messageClass = 'alert alert-success';
          this.message = 'Group Update Successfull';
        },
        errormessage => {
          console.log('errormessage group update service ', errormessage);
        }
      );
    },
      errormessage => {
        console.log('errormessage group read service ', errormessage);
    });
    const zario: Zario = {
      _fid: '',
      _toid: '',
      participants: '',   // a2m a2c m2c m2m c2m c2c
      description: `ref to cart trans_id ${this._tid} `,
      quantity: 0,
      price: this.settings.zariosprice
    };
    if (this.zariosdistribution.app) {
      // 1- from app to customer for app promotions a2c
      zario.participants = 'a2c';
      zario.description += 'from APP to customer as APP promotions.';
      zario.quantity = this.zariosdistribution.app;
      zario._fid = this.settings._id;
      zario._toid = this._cid;
      this.transService.addZarios(zario)
      .subscribe(zee => {
        console.log('transaction 1 added : ', zee);
      },
      errormessage => {
        console.log('errormessage transaction 1 add zario service ', errormessage);
      });
    }
    if (this.zariosdistribution.merchant) {
      // 2- from merchant to customer for merchant promotions
      zario.participants = 'm2c';
      zario.description += 'from merchant to customer as merchant promotions.';
      zario.quantity = this.zariosdistribution.merchant;
      zario._fid = this._mid;
      zario._toid = this._cid;
      this.transService.addZarios(zario)
      .subscribe(zee => {
        console.log('transaction 2 added : ', zee);
      },
      errormessage => {
        console.log('errormessage transaction 2 add zario service ', errormessage);
      });
    }
    if (this.zariosdistribution.purchase) {
      // 3- from app to merchant for purchase
      zario.participants = 'a2m';
      zario.description += 'from APP to merchant as purchase commission zarios.';
      zario.quantity = this.zariosdistribution.purchase;
      zario._fid = this.settings._id;
      zario._toid = this._mid;
      this.transService.addZarios(zario)
      .subscribe(zee => {
        console.log('transaction 3 added : ', zee);
      },
      errormessage => {
        console.log('errormessage transaction 3 add zario service ', errormessage);
      });
      // 4- from app to customer for purchase
      zario.participants = 'a2c';
      zario.description += 'from APP to customer as purchase commission zarios.';
      zario._toid = this._cid;
      this.transService.addZarios(zario)
      .subscribe(zee => {
        console.log('transaction 4 added : ', zee);
      },
      errormessage => {
        console.log('errormessage transaction 4 add zario service ', errormessage);
      });
      // 5- from app to app for purchase
      zario.participants = 'a2a';
      zario.description += 'from APP to jasem Qabazard as purchase commission zarios.';
      zario._toid = this.settings._id;
      this.transService.addZarios(zario)
      .subscribe(zee => {
        console.log('transaction 5 added : ', zee);
      },
      errormessage => {
        console.log('errormessage transaction 5 add zario service ', errormessage);
      });
    }
    this.sendTransEmail();
  }

  sendTransEmail() {
    const transData = {
      email: this.useremail,
      merchant: this.mprofiles[this.CMI].name,
      amount: this.ft.controls['amount'].value,
      description: this.ft.controls['description'].value,
      merits: this.ft.controls['merits'].value,
      zarios: this.ft.controls['zarios'].value,
      discount: this.ft.controls['discount'].value
    };
    this.transService.notifyTrans(transData).subscribe(
      data => {
        console.log('trans notification email sent with following transdata ', transData);
      },
      errormessage => {
        this.message = 'OPPS! error please try later! Thank You';
        this.messageClass = 'alert alert-danger';
      }
    );
  }

  cartTimed () {
    let days2pass = 0;
    const now = new Date();
    let promotionCreateAtDate = new Date();
    for (let x = 0; x < this.crm[this.CRMINDEX].timedpromotions.length; x++) {
      for (let y = 0; y < this.originalpromotions.length; y++) {
        if (this.crm[this.CRMINDEX].timedpromotions[x]._pid === this.originalpromotions[y]._id) {
          if (this.originalpromotions[y].timing = 'hourly') {
            days2pass = 1;
          } else if (this.originalpromotions[y].timing = 'daily') {
            days2pass = 1;
          } else if (this.originalpromotions[y].timing = 'weekly') {
            days2pass = 7;
          } else if (this.originalpromotions[y].timing = 'monthly') {
            days2pass = 31;
          }
          promotionCreateAtDate = new Date(this.crm[this.CRMINDEX].timedpromotions[x].createdAt);
          console.log('now promotionCreatedAtDate days2pass', now, promotionCreateAtDate, days2pass);
          promotionCreateAtDate.setDate(promotionCreateAtDate.getDate() + days2pass);
          console.log('promotionCreatedAtDate', promotionCreateAtDate);
          if (now > promotionCreateAtDate) {
            // expired remove from crm
            this.crm[this.CRMINDEX].timedpromotions.splice(x, 1);
          } else {
            // still active remove from original promotions
            this.originalpromotions.splice(y, 1);
          }
          break;
        }
      }
    }
  }

}
