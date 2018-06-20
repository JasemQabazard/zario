import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { CommonRoutinesService } from '../../services/common-routines.service';
import { MprofileService } from '../../services/mprofile.service';
import { MProfile, Codes, Categories, Merchant, Strategy } from '../../shared/mprofile';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-mprofile',
  templateUrl: './mprofile.component.html',
  styleUrls: ['./mprofile.component.css']
})
export class MProfileComponent implements OnInit {
  fp: FormGroup;  // initial profile input form control
  fpSelect: FormGroup;
  codes: Codes[];
  strategy: Strategy[];
  merchants: Array<Merchant> = [];
  categories: Categories[];
  mprofiles: MProfile[];
  profile: MProfile;
  subscription: Subscription;
  username: string = undefined;
  NOPROFILE: number = null;
  nogroup: boolean = true;
  message: string;
  messageClass: string;
  notUpdated: boolean = false;
  profileBox: boolean = false;
  _pid: string = "";
  _gid: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private mprofileService: MprofileService,
    private commonRoutinesService: CommonRoutinesService,
    private router: Router
  ) { 
    this.createfp();
    this.createfpSelect();
  }

  ngOnInit() { 
    this.codes = [
      {countryCode:"+973 Bahrain"},
      {countryCode:"+966 KSA"},
      {countryCode:"+965 Kuwait"},
      {countryCode:"+968 Oman"},
      {countryCode:"+974 Qatar"},
      {countryCode:"+66 Thailand"},
      {countryCode:"+971 UAE"},
      {countryCode:"+1 USA"}
    ];
    this.categories = [
      {categoryName:"Cafe"},
      {categoryName:"Fast Food"},
      {categoryName:"Arabic Resturant"},
      {categoryName:"Arabic Fast Food"},
      {categoryName:"Electronics"},
      {categoryName:"Gift Shop"},
      {categoryName:"Franchise Resturant"},
      {categoryName:"Department Store"},
      {categoryName:"Education & Training"},
      {categoryName:"Sports"},
      {categoryName:"Shoe Shop"},
      {categoryName:"Franchise Clothes"}
    ];
    this.strategy = [
      {strategyName:"number"},
      {strategyName:"value"}
    ];
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
      .subscribe(
        name => { 
          this.username = name;
          console.log("name: ", name);
          console.log("user name: ", this.username); 
          this.mprofileService.getMProfile(this.username)
          .subscribe(mprofiles => {
            this.mprofiles = mprofiles;
            console.log("profiles : ", this.mprofiles);
            if (mprofiles.length === 0) {
              this.notUpdated = false;
            } else {
              this._pid = mprofiles[0]._id;
              this.profileBox = true;
              this.fp.setValue({
                username: this.username, 
                name: this.mprofiles[0].name,
                category: this.mprofiles[0].category,
                referral: this.mprofiles[0].referral,
                email: this.mprofiles[0].email,
                city: this.mprofiles[0].city,
                countrycode: this.mprofiles[0].countrycode,
                mobile: this.mprofiles[0].mobile,
                phone: this.mprofiles[0].phone
              });
              this.NOPROFILE = 0;
              this.notUpdated = true;
              for (var i = 0; i < mprofiles.length; i++) {
                console.log("merchant i name ", i, mprofiles[i].name);
                this.merchants.push({
                  "_id":mprofiles[i]._id,
                 "name": mprofiles[i].name
                });
              }
              console.log("merchants ", this.merchants);
              this.fpSelect.controls['merchant'].setValue(this.merchants[0].name);
            }
          },
            errmess => {
              console.log("error : ", errmess);
          });
          // group access code
          console.log("group access code");
          this.mprofileService.getGroup(this.username)
          .subscribe(gp => {
            console.log("group in profile component ", gp);
            if (gp === null) {
              this.nogroup = true;
              this._gid = "5b2602dd73226f112c07b465";
            } else {
              this._gid = gp._id;
              this.nogroup = false;
              console.log("groupID, nogroup ", this._gid, this.nogroup);
            }
          },
            errmess => {
              console.log("error : ", errmess);
          });
      });
  }
  createfp() {
    this.fp= this.formBuilder.group({
      username: this.username, 
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(15),
        Validators.maxLength(50),
        this.validateName
      ])],
      category: "", 
      referral: false,
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
      strategy: 'value',
      bronze: ['', Validators.compose([
        Validators.required,
        this.validateValue
      ])],
      silver: ['', Validators.compose([
        Validators.required,
        this.validateValue
      ])],
      gold: ['', Validators.compose([
        Validators.required,
        this.validateValue
      ])],
      platinum: ['', Validators.compose([
        Validators.required,
        this.validateValue
      ])],
      pearl: ['', Validators.compose([
        Validators.required,
        this.validateValue
      ])],
      blackdiamond: ['', Validators.compose([
        Validators.required,
        this.validateValue
      ])],
    }, {validator: this.bandSync('bronze', 'silver', 'gold', 'platinum', 'pearl', 'blackdiamond')});

    this.onChanges();
    
  }
  onChanges(): void {
    this.fp.valueChanges.subscribe(val => {
      this.notUpdated = false;
    });
  }
  createfpSelect() {
    this.fpSelect= this.formBuilder.group({
      merchant: ''
    })
  }

  bandSync(bronze, silver, gold, platinum, pearl, blackdiamond) {
    return (group: FormGroup) => {
      if (group.controls[silver].value <= group.controls[bronze].value) {
        return { 'bandSync': true };
      } else if (group.controls[gold].value <= group.controls[silver].value) {
        return { 'bandSync': true };
      } else if (group.controls[platinum].value <= group.controls[gold].value) {
        return { 'bandSync': true };
      } else if (group.controls[pearl].value <= group.controls[platinum].value) {
        return { 'bandSync': true };
      } else if (group.controls[blackdiamond].value <= group.controls[pearl].value) {
        return { 'bandSync': true };
      } else {
        return null;
      }
    }
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
      return { 'validateName': true } // Return as invalid name
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
      return { 'validateEmail': true } // Return as invalid email
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
      return { 'validateMobile': true } // Return as invalid Mobile
    }
  }
  validateValue(controls) {
    // Create a regular expression
  const regExp = new RegExp(/^\d+$/);
  // Test Value for numeric against regular expression
  if (regExp.test(controls.value)) {
    return null; // Return as valid number
  } else {
    return { 'validateValue': true } // Return as invalid number
  }
  }

  changeMerchant(mvalue) {
    for ( var ndx = 0; ndx < this.merchants.length; ndx++) {
       if(this.merchants[ndx].name == this.fpSelect.controls['merchant'].value) {
         break;
       }
    }
    this._pid = this.mprofiles[ndx]._id;
    this.profileBox = true;
    this.fp.setValue({
      username: this.username, 
      name: this.mprofiles[ndx].name,
      category: this.mprofiles[ndx].category,
      referral: this.mprofiles[ndx].referral,
      email: this.mprofiles[ndx].email,
      city: this.mprofiles[ndx].city,
      countrycode: this.mprofiles[ndx].countrycode,
      mobile: this.mprofiles[ndx].mobile,
      phone: this.mprofiles[ndx].phone,
      strategy: this.mprofiles[ndx].strategy
    });
    this.NOPROFILE = ndx;
    this.notUpdated = true;
    this.fpSelect.controls['merchant'].setValue(this.merchants[ndx].name);
  }

  addMerchant() {
    if (this.nogroup) {
        this.message = "Add a GROUP before adding more merchant profiles";
        this.messageClass = "alert alert-danger";
        setTimeout(() => {
          this.router.navigate(['/group']); 
        }, 1500);
    } else {
        this.fp.setValue({
          username: this.username, 
          name: "",
          category: "",
          referral: false,
          email: "",
          city: "",
          countrycode: '+965 Kuwait', 
          mobile: "",
          phone: "",
          strategy: "value"
        });
        this.NOPROFILE = null;
        this.notUpdated = false;
        this._pid = "";
        this.message = "";
        this.messageClass = "";
        this.fpSelect.controls['merchant'].setValue("");
    };
  }

  onfpSubmit() {
    this.profile = this.fp.value;
    this.profile.username = this.username;
    this.profile.group_id = this._gid;
    console.log("profile ", this.profile);
    if (this.NOPROFILE === null) {
      this.mprofileService.addProfile(this.profile).subscribe(
        data => {
          this.messageClass= "alert alert-success";
          this.message="Profile Add Successfull";
          setTimeout(() => {
            this.router.navigate(['/']); 
          }, 1500);
        }, 
        errormessage => {
          this.message = <any>errormessage;
          this.messageClass= "alert alert-danger";
        }
      );
    } else {
      this.mprofileService.updateProfile(this._pid, this.profile).subscribe(
        data => {
          console.log("data : ", data);
          this.messageClass= "alert alert-success";
          this.message="Profile Update Successfull";
          setTimeout(() => {
            this.router.navigate(['/']); 
          }, 1500);
        }, 
        errormessage => {
          this.message = <any>errormessage;
          this.messageClass= "alert alert-danger";
        }
      );
    }
  }
  // _id: string;
  // username: string;

  // THIS IS THE ESSENTIAL DETAILS SECTION ================== done
  // name: string;
  // referral: Boolean;
  // category: string;
  // email: string;
  // city: string;
  // countrycode: string;
  // mobile:string;
  // phone: string;

  // group_id: string;  ========================================= done
  //(1)set this up as you create the record if there is a group id then use it if not keep the default. 
  //(2)when the user tries to add another merchant record make sure he has a group id record created and if he does not let him know that he can not ctreate another merchant record without a group id. 
  //(3)Also once the/a group id has been created check the merchant by user name and update the group id. 

  // ================= NEW FUTURE IDEA ===========================================================
  // new not in order to have more than one user per group, the following is a scenario forward on this issue:
  // 1- must add a _gid to user collection
  // 2- must modify user with _gid when group is created.
  // 3- access to group must be by _gid on the user record and not by username
  // 4- the first user who created the group can create additional users to help him manage a large group of merchants if need be
  // 5- once additional users are created then they can add new profiles on the same group and can manage them
  // 6- profile managment can be done by the user who created the profile only for security reasons since we will not be logging chnages to profile with this modoficatoin 
  // 7- But if we were logging changes to profiles and data by user the we could allow any user to change any profile 
  // ================================================= NOT DONE ===================================
 
  
  // avatar: string; avatar upload section. ================


  // strategy: string; a strategy section. ===================
  // bronze: Number;
  // silver: Number;
  // gold: Number;
  // platinum: Number;
  // pearl: Number;
  // blackdiamond: Number;

  // longitude:  string; this is the location of the merchant store section ===============
  // latitude: string; allow the user to enter this information but default it to the actual location of his computer. Investigate a utility that can read the location of the computer long and lat. (2) how to generate a QR Code foR the location of the store.
  

  // ============================================================================================
  // THIS INFORMATION WILL NOT BE DISPLAYRF HERE =============== BUJT WILL BE DISPLAYERD IN THERE PROPER SECTION
  // score: Number; on creation  this must default to zero.
  // zarios: Number; on creation  this must default to zero
  // ukey: string; How are you going to generate these keys these questions will be answered when we investigate the wallet related issues.
  // rkey: string;
}