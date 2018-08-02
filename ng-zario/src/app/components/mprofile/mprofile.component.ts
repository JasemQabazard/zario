import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AgmCoreModule } from '@agm/core';

import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { MProfile, Codes, Categories, Merchant, Strategy, Position } from '../../shared/profile';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-mprofile',
  templateUrl: './mprofile.component.html',
  styleUrls: ['./mprofile.component.css']
})
export class MProfileComponent implements OnInit, OnDestroy {
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
  selectedImageFile: File =null;
  selectedImageFileName: string = "No New Image Selected";
  avatarPath: string ="../../../assets/img/avatardefault.png";
  avatarShow: boolean = false;
  avatarChanged: boolean = false;
  position: Position;
  clickedPosition: Position;
  currentPosition: Position;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) { 
    this.createfp();
    this.createfpSelect();
    this.position = {
      lng:0.0,
      lat:0.0
    };
    this.clickedPosition = {
      lng:0.0,
      lat:0.0
    };
    this.currentPosition = {
      lng:0.0,
      lat:0.0
    };
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
    this.getUserPosition();
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
      .subscribe(
        name => { 
          this.username = name;
          this.subscription.unsubscribe();
          this.profileService.getMProfile(this.username)
          .subscribe(mprofiles => {
            this.mprofiles = mprofiles;
            console.log("profiles : ", this.mprofiles);
            if (mprofiles.length === 0) {
              this.notUpdated = false;
              var x = setInterval(() => {
                if (this.currentPosition.lat) {
                  clearInterval(x);
                  this.position.lng = this.currentPosition.lng;
                  this.position.lat = this.currentPosition.lat;
                  this.fp.patchValue({
                    longitude:this.currentPosition.lng,
                    latitude:this.currentPosition.lat
                  });
                }
              }, 1000);
            } else {
              this._pid = mprofiles[0]._id;
              this.profileBox = true;
              this.avatarShow = true;
              if (this.mprofiles[0].avatar) {
                this.avatarPath = `avatars/${this.mprofiles[0].avatar}`;
              } else {
                this.avatarPath = "../../../assets/img/avatardefault.png";
              }
              this.fp.setValue({
                username: this.username, 
                name: this.mprofiles[0].name,
                category: this.mprofiles[0].category,
                referral: this.mprofiles[0].referral,
                email: this.mprofiles[0].email,
                city: this.mprofiles[0].city,
                countrycode: this.mprofiles[0].countrycode,
                mobile: this.mprofiles[0].mobile,
                phone: this.mprofiles[0].phone,
                strategy: this.mprofiles[0].strategy,
                bronze: this.mprofiles[0].bronze,
                silver: this.mprofiles[0].silver,
                gold: this.mprofiles[0].gold,
                platinum: this.mprofiles[0].platinum,
                pearl: this.mprofiles[0].pearl,
                blackdiamond: this.mprofiles[0].blackdiamond,
                longitude: this.mprofiles[0].longitude,
                latitude: this.mprofiles[0].latitude
              })
              console.log("this.mprofiles[0].longitude ", this.mprofiles[0].longitude);
              this.position.lng = this.mprofiles[0].longitude;
              this.position.lat = this.mprofiles[0].latitude;
              console.log("my GPS Position 2 ", this.position);
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
          this.profileService.getGroup(this.username)
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getUserPosition() {
    /// locate the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.currentPosition.lat = pos.coords.latitude;
        this.currentPosition.lng = pos.coords.longitude;
        console.log("pos.coords : ", pos.coords.latitude, pos.coords.longitude);
        console.log("my GPS Position ", this.currentPosition);
      });
    }
  }

  setLocation2Current() {
    this.clickedPosition.lat = 0.0;
    this.clickedPosition.lng = 0.0;
    this.position.lng = this.currentPosition.lng;
    this.position.lat = this.currentPosition.lat;
    this.fp.patchValue({
      longitude:this.currentPosition.lng,
      latitude:this.currentPosition.lat
    });
  }

  mapClicked($event:any) {
    this.clickedPosition.lat = $event.coords.lat;
    this.clickedPosition.lng = $event.coords.lng;
    this.fp.patchValue({
      longitude:this.clickedPosition.lng,
      latitude:this.clickedPosition.lat
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
      longitude:0,
      latitude: 0,
      blackdiamond: [0, Validators.compose([
        Validators.required,
        this.validateValue
      ])]
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

  imageFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImageFile = <File>event.target.files[0];
      this.selectedImageFileName = `Selected Image: ${this.selectedImageFile.name}`;
      this.avatarChanged = true;
      this.notUpdated = false;
      
      var reader = new FileReader();
  
      reader.onload = (event:any) => {
        this.avatarPath = event.target.result;
      }
  
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  bandSync(bronze, silver, gold, platinum, pearl, blackdiamond) {
    return (group: FormGroup) => {
      if (Number(group.controls[silver].value) <= Number(group.controls[bronze].value)) {
        return { 'bandSync': true };
      } else if (Number(group.controls[gold].value) <= Number(group.controls[silver].value)) {
        return { 'bandSync': true };
      } else if (Number(group.controls[platinum].value) <= Number(group.controls[gold].value)) {
        return { 'bandSync': true };
      } else if (Number(group.controls[pearl].value) <= Number(group.controls[platinum].value)) {
        return { 'bandSync': true };
      } else if (Number(group.controls[blackdiamond].value) <= Number(group.controls[pearl].value)) {
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
    if (this.mprofiles[ndx].avatar) {
      this.avatarPath = `avatars/${this.mprofiles[ndx].avatar}`;
    } else {
      this.avatarPath = "../../../assets/img/avatardefault.png";
    }
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
      strategy: this.mprofiles[ndx].strategy,
      bronze: this.mprofiles[ndx].bronze,
      silver: this.mprofiles[ndx].silver,
      gold: this.mprofiles[ndx].gold,
      platinum: this.mprofiles[ndx].platinum,
      pearl: this.mprofiles[ndx].pearl,
      blackdiamond: this.mprofiles[ndx].blackdiamond,
      longitude: this.mprofiles[ndx].longitude,
      latitude: this.mprofiles[ndx].latitude
    });
    this.NOPROFILE = ndx;
    this.notUpdated = true;
    this.avatarShow = true;
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
          strategy: "value",
          bronze: 0,
          silver: 0,
          gold: 0,
          platinum: 0,
          pearl: 0,
          blackdiamond: 0,
          longitude:this.position.lng,
          latitude:this.position.lat
        });
        this.NOPROFILE = null;
        this.notUpdated = false;
        this.avatarShow = false;
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
    console.log("storing profile ", this.profile);
    if (this.NOPROFILE === null) {
      this.profileService.addMProfile(this.profile).subscribe(
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
      if (this.avatarChanged) {
        const fd = new FormData();
        fd.append('imageFile', this.selectedImageFile);
        this.profileService.imageUpload(fd).subscribe(
          imageData => {
            this.profile.avatar = imageData.filename;
            this.profileService.updateMProfile(this._pid, this.profile).subscribe(
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
          }, 
          errormessage => {
            this.message = "Accepts image files less than 500KB ONLY, Please try another image";
            this.messageClass= "alert alert-danger";
          }
        );
      } else {
        this.profileService.updateMProfile(this._pid, this.profile).subscribe(
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
  }

  // AIzaSyBQZFTAbfC2foRcTVmLLCL4RxeXdc4Z4Is ========== Google api key

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