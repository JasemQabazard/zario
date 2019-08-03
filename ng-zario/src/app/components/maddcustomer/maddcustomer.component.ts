import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { CommonRoutinesService } from '../../services/common-routines.service';
import { ProfileService } from '../../services/profile.service';
import { User, Codes, ROLES } from '../../shared/security';
import { MProfile, CProfile, Merchant, CRM } from '../../shared/profile';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-maddcustomer',
  templateUrl: './maddcustomer.component.html',
  styleUrls: ['./maddcustomer.component.css']
})
export class MAddCustomerComponent implements OnInit {

  form: FormGroup;
  fmSelect: FormGroup;
  frSelect: FormGroup;
  codes: Codes[];
  user: User;
  crm: CRM;
  cprofile: CProfile;
  roles: ROLES[];
  mprofiles: Array<MProfile> = [];
  merchants: Array<Merchant> = [];
  subscription: Subscription;
  username: string = undefined;
  userrole = 'merchant';
  message: string;
  messageClass: string;
  emailValid = false;
  emailMessage: string;
  usernameValid = false;
  usernameMessage: string;
  mobileValid = false;
  mobileMessage: string;
  passcode: string = this.commonRoutinesService.codeGen() + 'aM5$';
  merchantname: string;
  _mid: string;
  _gid: string;
  _cid: string;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private commonRoutinesService: CommonRoutinesService,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.createForm();
    this.createfmSelect();
    this.createfrSelect();
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
    // get userrole
    // change profile get via user._gid if MERCHANT
    // or using user._pid if merchant
    this.subscription = this.authService.getUsername()
      .subscribe(
        name => {
          this.username = name;
          this.subscription.unsubscribe();
          this.authService.getUser(this.username)
          .subscribe(user => {
            console.log('user : ', user);
            this.userrole = user.role;
            if (user._gid === null || user._mid === null) {
              this.message = 'Create Group/ Merchant Profile Before using this function';
              this.messageClass = 'alert alert-danger';
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 1200);
            }
            this._gid = user._gid;
            this._mid = user._mid;
            if (this.userrole === 'MERCHANT') {
              this.roles = [{name: 'customer'}, {name: 'merchant'}];
              this.profileService.getGroupMerchants(this._gid)
              .subscribe(mprofiles => {
                this.mprofiles = mprofiles;
                console.log('profiles : ', this.mprofiles);
                this.setProfileSelect();
              },
              errormessage => {
                this.message = <any>errormessage;
                this.messageClass = 'alert alert-danger';
              });
            } else if (this.userrole === 'merchant') {
              this.roles = [{name: 'customer'}];
              console.log('dealing with a single merchant _mid');
              this.profileService.getMProfileID(this._mid)
              .subscribe(mprofile => {
                this.mprofiles[0] = mprofile;
                console.log('profiles : ', this.mprofiles);
                this.setProfileSelect();
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
        }
      );
  }

  setProfileSelect() {
    if (this.mprofiles.length === 0) {
      this.message = 'Please build your profile before adding customers';
      this.messageClass = 'alert alert-danger';
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1200);
    } else {
      for (let i = 0; i < this.mprofiles.length; i++) {
        console.log('merchant i name ', i, this.mprofiles[i].name);
        this.merchants.push({
          '_id': this.mprofiles[i]._id,
          'name': this.mprofiles[i].name
        });
      }
      this._mid = this.mprofiles[0]._id;
      this.fmSelect.controls['merchant'].setValue(this.merchants[0].name);
      this.merchantname = this.mprofiles[0].name;
    }
  }

  createfmSelect() {
    this.fmSelect = this.formBuilder.group({
      merchant: ''
    });
  }

  createfrSelect() {
    this.frSelect = this.formBuilder.group({
      role: 'customer'
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail // Custom validation
      ])],
      firstname: ['', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
        this.validateName
      ])],
      lastname: ['', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
        this.validateName
      ])],
      countrycode: '+965 Kuwait',
      mobile: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(10),
        this.validateMobile
      ])]
    });
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

      // Function to validate username is proper format
  validateUsername(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    // Test username against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid username
    } else {
      return { 'validateUsername': true }; // Return as invalid username
    }
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

  onMaddSubmit() {
    this.user = this.form.value;
    this.user.password = this.passcode;
    this.user.role = this.frSelect.controls['role'].value;
    if (this.user.role === 'customer') { this.user.role = 'CUSTOMER'; }
    this.user._gid = this._gid;
    this.user._mid = this._mid;
    console.log(this.user);
    this.authService.registerUser(this.user).subscribe(
      data => {
        this.messageClass = 'alert alert-success';
        this.message = 'User Registration added Successfull';
        this.sendMaddMailer();
      },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass = 'alert alert-danger';
      }
    );
    // record the CRM record for customers
  }

  sendMaddMailer() {
    const mailerBody = {
      email: this.form.controls['email'].value,
      username: this.form.controls['username'].value,
      password: this.passcode,
      merchantname: this.merchantname,
    };
    this.authService.maddmailer(mailerBody).subscribe(
      data => {
        this.message = 'Email sent to user with Registration Data';
        if (this.frSelect.controls['role'].value === 'customer') {
          this.crmAndCProfileAdd();
        } else {
          setTimeout(() => {
            this.router.navigate(['/']); // Redirect to login page
          }, 1500);
        }
      },
      errormessage => {
        this.message = 'OPPS! error please try later! Thank You';
        this.messageClass = 'alert alert-danger';
      }
    );
  }

  crmAndCProfileAdd() {
    const cprofile = {
      username: this.form.controls['username'].value,
      gender: 'Male'
    };
    // this.cprofile = cprofile;

    const crm = {
      _cid: '',
      _mid: this._mid,
    };
    console.log('crm : ', crm, 'cprofile: ', cprofile);

    this.profileService.addCProfile(cprofile).subscribe(
      data => {
        console.log('add data : ', data);
        this.messageClass = 'alert alert-success';
        this.message = 'Profile Add Successfull';
        crm._cid = data._id;
        console.log('crm : ', crm);
        this.profileService.addCRM(crm)
        .subscribe(crmData => {
          console.log('crm : ', crmData);
          setTimeout(() => {
            this.router.navigate(['/']); // Redirect to login page
          }, 1500);
        },
          errormessage => {
            this.message = <any>errormessage;
            this.messageClass = 'alert alert-danger';
        });
      },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass = 'alert alert-danger';
      }
    );
  }

  changeMerchant() {
    for ( let ndx = 0; ndx < this.merchants.length; ndx++) {
       if (this.merchants[ndx].name === this.fmSelect.controls['merchant'].value) {
        this._mid = this.mprofiles[ndx]._id;
        this.merchantname = this.mprofiles[ndx].name;
       }
    }
  }


 // Function to check if e-mail is taken
  checkEmail() {
    // Function from authentication file to check if e-mail is taken
    if (this.form.get('email').value === '') { return; }
    this.authService.checkEmail(this.form.get('email').value).subscribe(
      data => {
        // Check if success true or false was returned from API
        if (!data.success) {
          this.emailValid = false; // Return email as invalid
          this.emailMessage = data.message; // Return error message
        } else {
          this.emailValid = true; // Return email as valid
        }
      },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass = 'alert alert-danger';
      }
    );
  }

  // Function to check if username is available
  checkUsername() {
    // Function from authentication file to check if username is taken
    if (this.form.get('username').value === '') { return; }
    this.authService.checkUsername(this.form.get('username').value).subscribe(
      data => {
      // Check if success true or success false was returned from API
        if (!data.success) {
          this.usernameValid = false; // Return username as invalid
          this.usernameMessage = data.message; // Return error message
        } else {
          this.usernameValid = true; // Return username as valid
        }
      },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass = 'alert alert-danger';
      }
    );
  }

    // Function to check if mobile number is not previously used  is unique
    checkMobile() {
      // Function from authentication file to check if username is taken
      if (this.form.get('mobile').value === '') { return; }
      this.authService.checkMobile(this.form.get('mobile').value).subscribe(
        user => {
        // Check user exists then mobile is used already
          if (user) {
            this.mobileValid = false; // Return mobile as invalid
            this.mobileMessage = 'user mobile number already in system. Please enter another mobile';
          } else {
            this.mobileValid = true; // Return mobile as valid
          }
        },
        errormessage => {
          this.message = <any>errormessage;
          this.messageClass = 'alert alert-danger';
        }
      );
  }
}
