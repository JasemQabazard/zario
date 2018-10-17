import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { CProfile, Genders, Socials } from '../../shared/profile';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-cprofile',
  templateUrl: './cprofile.component.html',
  styleUrls: ['./cprofile.component.css']
})
export class CProfileComponent implements OnInit, OnDestroy {
  datePickerConfig: Partial<BsDatepickerConfig>;
  fp: FormGroup;    // initial profile input form control
  fpSelect: FormGroup;
  cprofile: CProfile;
  subscription: Subscription;
  genders: Genders[];
  socials: Socials[];
  username: string = undefined;
  NOPROFILE: number = null;
  message: string;
  messageClass: string;
  notUpdated = false;
  _pid = '';
  selectedImageFile: File = null;
  selectedImageFileName = 'No New Image Selected';
  avatarPath = '../../../assets/img/avatardefault.png';
  avatarChanged = false;
  start: Date = new Date();
  max: Date = new Date(this.start.getFullYear() - 10, this.start.getMonth(), this.start.getDate(), 0, 0, 0);
  min: Date = new Date(this.start.getFullYear() - 100, this.start.getMonth(), this.start.getDate(), 0, 0, 0);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {
    console.log(this.min, this.max);
    this.datePickerConfig = Object.assign( {},
      {
        containerClass: 'theme-dark-blue',
        showWeekNumbers: false,
        minDate: this.min,
        maxDate: this.max,
        dateInputFormat: 'DD/MM/YYYY'
      });
    this.createfp();
  }

  ngOnInit() {

    this.socials = [
      {socialCode: 'Single'},
      {socialCode: 'Married'},
      {socialCode: 'Other'}
    ];

    this.genders = [
      {genderCode: 'Male'},
      {genderCode: 'Female'}
    ];
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
      .subscribe(
        name => {
          this.username = name;
          this.subscription.unsubscribe();
          this.profileService.getCProfile(this.username)
          .subscribe(cprofile => {
            this.cprofile = cprofile;
            console.log('profiles : ', this.cprofile);
            if (!cprofile) {
              this.notUpdated = false;
              this.fp.patchValue({
                birthdate: this.max
              });
              console.log('form values: ', this.fp.value);
            } else {
              this._pid = cprofile._id;
              if (this.cprofile.avatar) {
                this.avatarPath = `avatars/${this.cprofile.avatar}`;
              } else {
                this.avatarPath = '../../../assets/img/avatardefault.png';
              }
              this.fp.setValue({
                username: this.username,
                birthdate: new Date(this.cprofile.birthdate),
                gender: this.cprofile.gender,
                social: this.cprofile.social,
                occupation: this.cprofile.occupation,
                education: this.cprofile.education,
                work: this.cprofile.work
              });
              this.NOPROFILE = 0;
              this.notUpdated = true;
            }
          },
            errmess => {
              console.log('error : ', errmess);
          });
      });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createfp() {
    this.fp = this.formBuilder.group({
      username: this.username,
      birthdate: '',
      gender: 'Female',
      social: 'Single',
      occupation: ['', Validators.compose([
        Validators.required,
        Validators.minLength(30)
      ])],
      education: ['', Validators.compose([
        Validators.required,
        Validators.minLength(30)
      ])],
      work: ['', Validators.compose([
        Validators.required,
        Validators.minLength(30)
      ])]
    });

    this.onChanges();

  }
  onChanges(): void {
    this.fp.valueChanges.subscribe(val => {
      this.notUpdated = false;
    });
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
    this.cprofile = this.fp.value;
    this.cprofile.username = this.username;
    if (this.avatarChanged) {
      const fd = new FormData();
      fd.append('imageFile', this.selectedImageFile);
      this.profileService.imageUpload(fd).subscribe(
        imageData => {
          this.cprofile.avatar = imageData.filename;
          this.cProfileDataBaseChange();
        },
        errormessage => {
          this.message = 'Accepts image files less than 500KB ONLY, Please try another image';
          this.messageClass = 'alert alert-danger';
        }
      );
    } else {
      this.cProfileDataBaseChange();
    }
  }

  cProfileDataBaseChange() {
    console.log('cprofile cProfileDataBaseChange: ', this.cprofile);
    if (this.NOPROFILE === null) {
      this.profileService.addCProfile(this.cprofile).subscribe(
        data => {
          console.log('add data : ', data);
          this.messageClass = 'alert alert-success';
          this.message = 'Profile Add Successfull';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        },
        errormessage => {
          this.message = <any>errormessage;
          this.messageClass = 'alert alert-danger';
        }
      );
    } else {
        this.profileService.updateCProfile(this._pid, this.cprofile).subscribe(
          data => {
            console.log('update data : ', data);
            this.messageClass = 'alert alert-success';
            this.message = 'Profile Update Successfull';
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1500);
          },
          errormessage => {
            this.message = <any>errormessage;
            this.messageClass = 'alert alert-danger';
          }
        );
    }
  }
}
