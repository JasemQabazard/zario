import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray , Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../shared/security';
import { awsMediaPath } from '../../shared/blog';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {
  message: string;
  messageClass: string;
  user: User;
  username: string = undefined;
  userrole: string = undefined;
  realname: string = undefined;
  subscription: Subscription;
  selectedMediaFile = null;
  selectedMediaFileName = 'No Media Selected';
  mediaPath = awsMediaPath + 'blog-movement-2203657.png';
  mediaChanged = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
      .subscribe(
        name => {
          this.username = name;
          this.subscription.unsubscribe();
          this.authService.getUser(this.username)
          .subscribe(user => {
            this.userrole = user.role;
            this.realname = user.firstname + ' ' + user.lastname;
            this.user = user;
            console.log('user : ', user);
            if (this.user.documentlocation) {
              this.selectedMediaFileName = 'The Last document you uploaded is shown';
              this.mediaPath = awsMediaPath + this.user.documentlocation;
            }
          });
        });
  }

  mediaFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedMediaFile = event.target.files[0];
      this.displayMediaFile();
    }
  }

  displayMediaFile() {
    this.mediaChanged = true;
    this.selectedMediaFileName = 'Image selected but not Uploaded';
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
          this.mediaPath = event.target.result;
        } else {
          this.selectedMediaFileName = 'Your selection is not an Image File';
          this.mediaPath = awsMediaPath + 'blog-movement-2203657.png';
        }
      });
    };
    reader.readAsDataURL(this.selectedMediaFile);
  }

  uploadMediaFile() {
    const fileext = this.selectedMediaFile.type.slice(this.selectedMediaFile.type.indexOf('/') + 1);
    const specs = this.user._id + fileext;
    this.blogService.postAWSMediaURL(specs)
              .subscribe(uploadConfig => {
                this.blogService.putAWSMedia(uploadConfig.url , this.selectedMediaFile)
                .subscribe(resp => {
                  this.mediaPath = awsMediaPath + uploadConfig.key;
                  this.user.documentlocation = uploadConfig.key;
                  this.user.approvalstatus = 'submit';
                  this.selectedMediaFileName = '';
                  this.mediaChanged = false;
                  // update user
                  this.authService.updateUser(this.user._id, this.user).subscribe(
                    data => {
                      console.log('update data : ', data);
                      this.messageClass = 'alert alert-success';
                      this.message = 'User Data Update Successfull';
                      setTimeout(() => {
                        this.router.navigate(['/']);
                      }, 1500);
                    },
                    errormessage => {
                      console.log('error while accessing users : ', errormessage);
                    });
                },
                errormessage => {
                  console.log('postAWSMediaURL error--->message', errormessage);
                });
        });
  }

}
