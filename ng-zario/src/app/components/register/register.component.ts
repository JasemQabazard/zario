import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { CommonRoutinesService } from '../../services/common-routines.service';
import { User, Codes, ROLES } from '../../shared/security';
import { CProfile, Settings} from '../../shared/profile';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  vrifyemailform: FormGroup;
  codes: Codes[];
  roles: ROLES[];
  user: User;
  cprofile: CProfile;
  settings: Settings = null;
  message: string;
  messageClass: string;
  emailValid = false;
  emailMessage: string;
  usernameValid = false;
  usernameMessage: string;
  mobileValid = false;
  mobileMessage: string;
  timeleft: number;
  showverifyemail = false;
  processing = false;
  verifycode: string = this.commonRoutinesService.codeGen();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private commonRoutinesService: CommonRoutinesService,
    private router: Router,
    @Inject('BaseURL') private BaseURL
  ) {
    this.createForm();
    this.createForm2();
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
    this.roles = [
      {name: 'CUSTOMER'},
      {name: 'MERCHANT'}
    ];
    this.profileService.getSettings()
    .subscribe(settings => {
      if (settings) {
        this.settings = settings[0];
      }
    },
    errormessage => {
      console.log('settings data base access error : ', errormessage);
    });
  }

  createForm2() {
    this.vrifyemailform = this.formBuilder.group({
      verifyInput: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)])]
      }, {
        validator: this.emailVerification(this.verifycode, 'verifyInput')
      }
    );
  }

  emailVerification(vcode, verifyInput) {
    console.log(vcode, verifyInput);
    return (group: FormGroup) => {
      if (vcode === group.controls[verifyInput].value) {
        return null; // Return as valid Verification Code { 'emailVerification': false }
      } else {
        return { 'emailVerification': true }; // Return as invalid Verification Code
      }
    };
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
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      role: 'CUSTOMER',
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

  // Function to validate password
  validatePassword(controls) {
    // Create a regular expression
    // const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    const regExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
    // Test password against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid password
    } else {
      return { 'validatePassword': true }; // Return as invalid password
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

  onRegisterSubmit() {
    const codeData = {
      email: '',
      vcode: ''
    };
    codeData.email = this.form.get('email').value;
    codeData.vcode = this.verifycode;
    this.authService.mailVerification(codeData).subscribe(
      data => {
        this.processing = true;
        this.disableForm();
        this.showverifyemail = true;
        this.timeleft = 90;
        const x = setInterval(() => {
                --this.timeleft;
                if (this.timeleft === 0) {
                  clearInterval(x);
                  this.processing = false;
                  this.showverifyemail = false;
                  this.enableForm();
                }
              }, 1000);
      },
      errormessage => {
        this.message = 'OPPS! error please try later! Thank You';
        this.messageClass = 'alert alert-danger';
      }
    );
  }

  onVerifyClick() {
    this.enableForm();
    this.user = this.form.value;
    if (this.user.role === 'MERCHANT') {
      this.user.role = 'PENDING';
    }
    const codeData = {
      email: this.user.email,
      name: this.user.firstname + ' ' + this.user.lastname,
      username: this.user.username,
      password: this.user.password
    };
    this.authService.registerUser(this.user).subscribe(
      data => {
        this.messageClass = 'alert alert-success';
        this.message = 'User Log Successfull';
        /////////////////////////////
        // settings update after implementing user roile selection
        ////////////////////////////
        if (this.settings) {
          if (this.user.role === 'PENDING') {
            this.settings.nomerchants++;
            // send merchant email
            this.authService.merchantmailer(codeData).subscribe(
              data => {

              });
          } else if (this.user.role === 'CUSTOMER') {
            this.settings.nocustomers++;
            const cprofile = {
              username: this.user.username,
              gender: 'Male'
            };
            this.profileService.addCProfile(cprofile).subscribe(
              data => {
                // send customer email
                this.authService.customermailer(codeData).subscribe(
                  data => {

                  });
              },
              errormessage => {
                console.log('errormessage transaction add service ', errormessage);
              });
          }
          this.profileService.updateSettings(this.settings._id, this.settings).subscribe(
            data => {
              console.log('updated settings data : ', data);
            },
            errormessage => {
              console.log('errormessage transaction add service ', errormessage);
            }
          );
        }
        this.form.reset();
        this.form.controls['countrycode'].setValue('+965 Kuwait');
        setTimeout(() => {
          this.router.navigate(['/login']); // Redirect to login page
        }, 1500);
      },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass = 'alert alert-danger';
        this.processing = false;
        this.showverifyemail = false;
      }
    );
  }

  enableForm() {
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['email'].enable();
    this.form.controls['role'].enable();
    this.form.controls['firstname'].enable();
    this.form.controls['lastname'].enable();
    this.form.controls['countrycode'].enable();
    this.form.controls['mobile'].enable();
  }

  disableForm() {
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['email'].disable();
    this.form.controls['role'].disable();
    this.form.controls['firstname'].disable();
    this.form.controls['lastname'].disable();
    this.form.controls['countrycode'].disable();
    this.form.controls['mobile'].disable();
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
