import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { MProfile, Group, Codes } from '../../shared/profile';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  fg: FormGroup;  // group input form control
  codes: Codes[];
  group: Group;
  profile: MProfile;
  subscription: Subscription;
  username: string = undefined;
  nogroup: boolean = true;
  message: string;
  messageClass: string;
  notUpdated: boolean = false;
  _gid: string = "";
  _pid: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) { 
    this.createfg();
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
          console.log("name: ", name);
          console.log("user name: ", this.username); 
          this.profileService.getGroup(this.username)
          .subscribe(gp => {
            console.log("group : ", gp);
            if (gp === null) {
              this.nogroup = true;
              this.notUpdated = false;
            } else {
              this.group = gp;
              this._gid = gp._id;
              this.fg.setValue({
                username: this.username, 
                name: this.group.name,
                description: this.group.description,
                email: this.group.email,
                city: this.group.city,
                countrycode: this.group.countrycode,
                mobile: this.group.mobile,
                phone: this.group.phone
              });
              this.nogroup = false;
              this.notUpdated = true;
            }
          },
            errmess => {
              console.log("error : ", errmess);
          });
      });
  }
  createfg() {
    this.fg= this.formBuilder.group({
      username: this.username, 
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(50),
        this.validateName
      ])],
      description: ['', Validators.compose([
        Validators.required,
        Validators.minLength(50),
        this.validateName
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail // Custom validation
      ])],
      city: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
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
      ])]
    });
    this.onChanges();
  }
  onChanges(): void {
    this.fg.valueChanges.subscribe(val => {
      this.notUpdated = false;
    });
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

  onfgSubmit() {
    this.group = this.fg.value;
    this.group.username = this.username;
    console.log("group ", this.group);
    if (this.nogroup) {
      console.log("there is no group");
      // this.group.merchants = [];
      this.profileService.addGroup(this.group).subscribe(
        data => {
          this.messageClass= "alert alert-success";
          this.message="Group Add Successfull";
          console.log("Group Data Added : ", data);
          this.profileService.getMProfile(this.username)
          .subscribe(mprofiles => {
            this.profile = mprofiles[0];
            console.log("mprofiles[0] : ", this.profile);
            if (mprofiles.length === 0) {
              setTimeout(() => {
                this.router.navigate(['/']); 
              }, 1500);
            } else {
              this.profile.group_id = data._id;
              this._pid = mprofiles[0]._id;
              this.profileService.updateMProfile(this._pid, this.profile).subscribe(
                mp => {
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
          },
            errmess => {
              console.log("error : ", errmess);
          });
        }, 
        errormessage => {
          this.message = <any>errormessage;
          this.messageClass= "alert alert-danger";
        }
      );
    } else {
      this.profileService.updateGroup(this._gid, this.group).subscribe(
        data => {
          this.messageClass= "alert alert-success";
          this.message="Group Update Successfull";
          setTimeout(() => {
            this.message = "";
            this.messageClass = "";
            this.notUpdated = true;
          }, 1000);
        }, 
        errormessage => {
          this.message = <any>errormessage;
          this.messageClass= "alert alert-danger";
        }
      );
    }

  }
}