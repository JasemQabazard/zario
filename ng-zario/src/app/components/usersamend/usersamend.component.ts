import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { User, Codes } from '../../shared/security';
import { CommonRoutinesService } from '../../services/common-routines.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-usersamend',
  templateUrl: './usersamend.component.html',
  styleUrls: ['./usersamend.component.css']
})
export class UsersamendComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  fu: FormGroup;  // initial user input form control
  vrifyemailform: FormGroup;
  user: User;
  codes: Codes[];
  username: string = undefined;
  existingEmail = '';
  message: string;
  messageClass: string;
  emailValid = true;
  emailMessage: string;
  notUpdated = false;
  _uid = '';
  timeleft: number;
  showverifyemail = false;
  processing = false;
  verifycode: string = this.commonRoutinesService.codeGen();


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private commonRoutinesService: CommonRoutinesService,
    private router: Router
  ) {
    this.createfu();
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
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
    .subscribe(
      name => {
        this.username = name;
        this.subscription.unsubscribe();
        this.authService.getUser(this.username)
        .subscribe(user => {
          this.user = user;
          console.log('user : ', this.user);
          this._uid = user._id;
          this.fu.setValue({
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            countrycode: user.countrycode,
            mobile: user.mobile
          });
          this.notUpdated = true;
          this.existingEmail = user.email;
        },
          errmess => {
            console.log('error : ', errmess);
        });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  createfu() {
    this.fu = this.formBuilder.group({
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
    this.onChanges();
  }

  onChanges(): void {
    this.fu.valueChanges.subscribe(val => {
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

    // Function to check if e-mail is taken
    checkEmail() {
      // Function from authentication file to check if e-mail is taken
      if (this.fu.get('email').value === '' ||
              this.fu.get('email').value === this.existingEmail) { return; }
      this.emailValid = false;
      this.authService.checkEmail(this.fu.get('email').value).subscribe(
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

    onUpdateSubmit() {
      if (this.existingEmail === this.fu.get('email').value) {
              this.onVerifyClick();
      } else {
        const codeData = {
          email: '',
          vcode: ''
        };
        codeData.email = this.fu.get('email').value;
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
            this.message = <any>errormessage;
            this.messageClass = 'alert alert-danger';
          }
        );
      }
    }

    onVerifyClick() {
      this.enableForm();
      const user = this.fu.value;
      console.log(user);
      this.authService.updateUser(this._uid, user).subscribe(
        data => {
          console.log('update data : ', data);
          this.messageClass = 'alert alert-success';
          this.message = 'User Data Update Successfull';
          setTimeout(() => {
            this.router.navigate(['/']);
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
      this.fu.controls['email'].enable();
      this.fu.controls['firstname'].enable();
      this.fu.controls['lastname'].enable();
      this.fu.controls['countrycode'].enable();
      this.fu.controls['mobile'].enable();
    }

    disableForm() {
      this.fu.controls['email'].disable();
      this.fu.controls['firstname'].disable();
      this.fu.controls['lastname'].disable();
      this.fu.controls['countrycode'].disable();
      this.fu.controls['mobile'].disable();
    }

}

// username: String;
// password: string;
// ========================= Amendable fields ==================
// email: String;
// firstname: String;
// lastname:String;
// countrycode: String;
// mobile: String;
