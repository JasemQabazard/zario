import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';

import { FormBuilder, FormGroup, FormArray , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { PromotionService } from '../../services/promotion.service';
import { ProfileService } from '../../services/profile.service';
import { TransService } from '../../services/trans.service';
import { PromotionScannerService } from '../../services/promotion-scanner.service';

import { Promotion, merchantpromotions } from '../../shared/promotions';
import { MProfile, CProfile, CRM, Merchant} from '../../shared/profile';
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
  cprofile: CProfile;
  mprofiles: Array<MProfile> = [];
  merchants: Array<Merchant> = [];
  crm: Array<CRM> = [];
  customername = '';
  subscription: Subscription;
  username: string = undefined;
  userrole: string = undefined;
  promotions: Array<Promotion> = [];
  originalpromotions: Array<Promotion> = [];
  applicationpromotions: Array<Promotion> = [];
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

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private promotionService: PromotionService,
    private promotionScannerServioce: PromotionScannerService,
    private transService: TransService,
    private router: Router
  ) {
    this.createft();
    this.createfm();
 }

  ngOnInit() {
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
              this.avatarPath = cprofile.avatar;
            }
            this.authService.getUser(cprofile.username)
            .subscribe(user => {
              this.customername = user.firstname + ' ' + user.lastname;
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
            });
          });
      });
  }

  getApplicationPromotions() {
    const now = new Date();
    this.profileService.getSettings()
    .subscribe(settings => {
      this.promotionService.getPromotions(settings[0]._id)
      .subscribe(promotions => {
        for (let x = 0; x < promotions.length; x++) {
          if (promotions[x].activity && now < new Date(promotions[x].daterange[1]) && now > new Date(promotions[x].daterange[0])) {
            this.applicationpromotions.push(promotions[x]);
          }
        }
        console.log('ap promnos ', promotions, this.applicationpromotions);
        // this.applicationpromotions = this.promotionScannerServioce.cartCore(this.applicationpromotions);
          for (let x = 0; x < this.applicationpromotions.length; x++) {
            this.displayPromotion = ({
              name: '',
              discount: 0,
              merits: 0,
              zarios: 0,
              productservicecode: '',
              applied: true
            });
            this.displayPromotion.name = this.applicationpromotions[x].name;
            this.displayPromotion.merits = this.applicationpromotions[x].merits;
            this.displayPromotion.zarios = this.applicationpromotions[x].zarios;
            this.adp.push(this.displayPromotion);
            if (x === 0) {
                  this.ft.patchValue({
                        'ap': this.adp
                  });
                  this.ap = this.ft.get('ap') as FormArray;
            } else {
                  this.ap.push(this.createItem());
            }
          }
          console.log('adp ', this.adp);
      });
    });
  }

  getMerchantPromotions() {
    const now = new Date();
    this.promotions = [];
    this.promotionService.getPromotions(this._mid)
    .subscribe(promotions => {
      for (let x = 0; x < promotions.length; x++) {
        if (promotions[x].activity && now < new Date(promotions[x].daterange[1]) && now > new Date(promotions[x].daterange[0])) {
          this.originalpromotions.push(promotions[x]);
        }
      }
      this.originalpromotions = this.promotionScannerServioce.cartCore(this.originalpromotions, this.mBand);
      this.promotions = this.promotionScannerServioce.cartTrans(this.originalpromotions, '');
      console.log(this.originalpromotions, this.promotions);
      if (this.mBand === '') {
        this.mBand = 'Bronze';
      }
      this.preparemp();
      console.log('promotions : ', this.promotions, this.dp);
    },
    errormessage => {
      console.log('errormessage promotion access', errormessage);
    });
  }

  preparemp() {
    this.applybtns = [];
    this.mp = this.ft.get('mp') as FormArray;
    console.log('1 mp resets', this.mp.length, this.mp);
    for (let j = (this.mp.length - 1); j > 0; j--) {
      console.log('@j = ', j);
      this.mp.removeAt(j);
      console.log('mp.length = ', this.mp.length);
    }
    console.log('2 mp resets', this.mp.length, this.mp);
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
            // this.mp = this.ft.get('mp') as FormArray;
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
    this.getMerchantPromotions();
  }

  LoadCRM() {
    this.crm = [];
    this.score = null;
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
        }
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
    console.log('band & score', band, score);
    return band;
  }

  amountChange() {
    this.ft.get('amount').valueChanges.subscribe(
      amount => {
        const merits = this.changeDiscountZariosMerits();
        const newBand = this.checkmBand(this.score + merits);
        console.log('merits ', merits, newBand, this.mBand, this.promotions.length, this.originalpromotions.length);
        if (newBand !== this.mBand && this.promotions.length !== this.originalpromotions.length) {
          this.promotions = this.promotionScannerServioce.cartTrans(this.originalpromotions, newBand);
          this.preparemp();
          this.changeDiscountZariosMerits();
        }
    });
  }

  changeDiscountZariosMerits(): number {
    let discount = 0;
    let zarios = 0;
    let merits = 0;
    let meritsonpurchase = 0;
    for (let x = 0; x < this.dp.length; x++) {
      if (this.dp[x].applied) {
        discount += this.dp[x].discount;
        zarios += this.dp[x].zarios;
        merits += this.dp[x].merits;
        if (this.promotions[x].meritsonpurchase) {
          meritsonpurchase = Number(this.ft.controls['amount'].value);
        }
      }
    }
    console.log(discount, zarios, merits, meritsonpurchase);
    discount = discount * Number(this.ft.controls['amount'].value);
    this.ft.patchValue({
          'discount': discount,
          'zarios': zarios,
          'meritsonpurchase': meritsonpurchase,
          'merits': merits
      });
    return (merits + meritsonpurchase);
  }

  toggleApplied(i) {
    console.log('toggle Applied');
    this.applybtns[i] = !this.applybtns[i];
    this.dp[i].applied = this.applybtns[i];
    this.changeDiscountZariosMerits();
  }
  onftSubmit() {
    console.log(this.ft.value);
  }

}
