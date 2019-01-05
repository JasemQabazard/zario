import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { CProfile, Genders, Socials } from '../../shared/profile';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { awsMediaPath } from '../../shared/blog';
import { BlogService } from '../../services/blog.service';

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
  _uid = '';
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
    private blogService: BlogService,
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
            this.authService.getUser(this.username)
            .subscribe(user => {
              this._uid = user._id;
            });
            if (!cprofile) {
              this.notUpdated = false;
              this.fp.patchValue({
                birthdate: this.max
              });
              console.log('form values: ', this.fp.value);
            } else {
              this._pid = cprofile._id;
              if (this.cprofile.avatar) {
                this.avatarPath = awsMediaPath + this.cprofile.avatar;
                this.selectedImageFileName = 'Image Selected from file';
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
      this.selectedImageFile = event.target.files[0];
      this.displayMediaFile();
    }
  }

  displayMediaFile() {
    this.avatarChanged = true;
    this.notUpdated = false;
    this.selectedImageFileName = `Selected Image: ${this.selectedImageFile.name}`;
    function imageExists(url, callback) {
      const img = new Image();
      img.onload = function() { callback(true); };
      img.onerror = function() { callback(false); };
      img.src = url;
    }
    const reader = new FileReader();
    reader.onload = (event: any) => {
      imageExists(event.target.result, (exists) => {
        if (exists) {
          this.avatarPath = event.target.result;
        } else {
          this.selectedImageFileName = 'Your selection is not an Image File';
          this.avatarPath = '../../../assets/img/avatardefault.png';
        }
      });
    };
    reader.readAsDataURL(this.selectedImageFile);
  }

  onfpSubmit() {
    this.cprofile = this.fp.value;
    this.cprofile.username = this.username;
    if (this.avatarChanged) {
      const fileext = this.selectedImageFile.type.slice(this.selectedImageFile.type.indexOf('/') + 1);
      const specs = this._uid + fileext;
      this.blogService.postAWSMediaURL(specs)
                .subscribe(uploadConfig => {
                  this.blogService.putAWSMedia(uploadConfig.url , this.selectedImageFile)
                  .subscribe(resp => {
                    this.avatarPath = awsMediaPath + uploadConfig.key;
                    this.cprofile.avatar = uploadConfig.key;
                    this.selectedImageFileName = '';
                    this.avatarChanged = false;
                    this.cProfileDataBaseChange();
                  },
                  errormessage => {
                    this.message = errormessage;
                    this.messageClass = 'alert alert-danger';
                  });
          });
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
