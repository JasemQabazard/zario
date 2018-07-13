import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { Settings, Codes } from '../../shared/profile';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  fs: FormGroup;  // Setting Form control
  vbg: FormGroup;
  codes: Codes[];
  settings: Settings;
  subscription: Subscription;
  username: string = undefined;
  SETTINGS: boolean = false; // is their a Settings records (true) or not (false)
  message: string;
  messageClass: string;
  notUpdated: boolean = false;
  selectedImageFile: File =null;
  selectedImageFileName: string = "No New Image Selected";
  avatarPath: string ="../../../assets/img/avatardefault.png";
  avatarShow: boolean = false;
  avatarChanged: boolean = false;
  _sid: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.createfs();
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
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
      .subscribe(
        name => { 
          this.username = name;
          this.profileService.getSettings()
          .subscribe(settings => {
            this.settings = settings[0];
            console.log("settings : ", settings);
            if (!this.settings) {
              this.notUpdated = false;
            } else {
              this._sid = this.settings._id;
              if (this.settings.avatar) {
                this.avatarPath = `avatars/${this.settings.avatar}`;
              } else {
                this.avatarPath = "../../../assets/img/avatardefault.png";
              }
              this.fs.setValue({
                username: this.username, 
                name: this.settings.name,
                email: this.settings.email,
                city: this.settings.city,
                countrycode: this.settings.countrycode,
                mobile:this.settings.mobile,
                phone: this.settings.phone,
                bronze: this.settings.bronze,
                silver: this.settings.silver,
                gold: this.settings.gold,
                platinum: this.settings.platinum,
                pearl: this.settings.pearl,
                blackdiamond: this.settings.blackdiamond,
                nobronze: this.settings.nobronze,
                nosilver: this.settings.nosilver,
                nogold: this.settings.nogold,
                noplatinum: this.settings.noplatinum,
                nopearl: this.settings.nopearl,
                noblackdiamond: this.settings.noblackdiamond
              });
              this.SETTINGS = true;
              this.notUpdated = true;
            }
            console.log("form values: ", this.fs.value);
          },
            errmess => {
              console.log("error : ", errmess);
          });
      });
  }

  createfs() {
    this.fs= this.formBuilder.group({
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
        nobronze: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        nosilver: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        nogold: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        noplatinum: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        nopearl: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])],
        noblackdiamond: [0, Validators.compose([
          Validators.required,
          this.validateValue
        ])]  
    }, {
      validator: 
      Validators.compose([
        this.bandSync('bronze', 'silver', 'gold', 'platinum', 'pearl', 'blackdiamond'),
        this.bandnoSync('nobronze', 'nosilver', 'nogold', 'noplatinum', 'nopearl', 'noblackdiamond')
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

  bandnoSync(nobronze, nosilver, nogold, noplatinum, nopearl, noblackdiamond) {
    return (group: FormGroup) => {
      if (Number(group.controls[nosilver].value) <= Number(group.controls[nobronze].value)) {
        return { 'bandnoSync': true };
      } else if (Number(group.controls[nogold].value) <= Number(group.controls[nosilver].value)) {
        return { 'bandnoSync': true };
      } else if (Number(group.controls[noplatinum].value) <= Number(group.controls[nogold].value)) {
        return { 'bandnoSync': true };
      } else if (Number(group.controls[nopearl].value) <= Number(group.controls[noplatinum].value)) {
        return { 'bandnoSync': true };
      } else if (Number(group.controls[noblackdiamond].value) <= Number(group.controls[nopearl].value)) {
        return { 'bandnoSync': true };
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
  
  onfsSubmit() {
    this.settings = this.fs.value;
    this.settings.username = this.username;
    console.log("avatarChanged flag : ", this.avatarChanged);
    if (this.avatarChanged) {
      const fd = new FormData();
      fd.append('imageFile', this.selectedImageFile);
      this.profileService.imageUpload(fd).subscribe(
        imageData => {
          this.settings.avatar = imageData.filename;
          this.settingsDataBaseChange();
        }, 
        errormessage => {
          this.message = "Accepts image files less than 500KB ONLY, Please try another image";
          this.messageClass= "alert alert-danger";
        }
      );
    } else {
      this.settingsDataBaseChange();
    }
  }

  settingsDataBaseChange() {
    console.log("settings settingsDataBaseChange: ", this.settings);
    if (!this.SETTINGS) {
      this.profileService.addSettings(this.settings).subscribe(
        data => {
          console.log("added settings data : ", data);
          this.messageClass= "alert alert-success";
          this.message="Settings Add Successfull";
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
        this.profileService.updateSettings(this._sid, this.settings).subscribe(
          data => {
            console.log("updated settings data : ", data);
            this.messageClass= "alert alert-success";
            this.message="Settings Update Successfull";
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

// _id: string; 
// username: string;

// name: string; 
// avatar: string;
// email: string;
// city: string;
// countrycode: string;
// mobile:string;
// phone: string;

// nocustomers: Number; ==========> +1 Updated by customer add component
// nomerchants: Number; ==========> +1 Updated by merchant add component

// Value Based Bands ================>
// bronze: Number;
// silver: Number;
// gold: Number;
// platinum: Number;
// pearl: Number;
// blackdiamond: Number;

// Number Based Bands ================>
// nobronze: Number;
// nosilver: Number;
// nogold: Number;
// noplatinum: Number;
// nopearl: Number;
// noblackdiamond: Number;
