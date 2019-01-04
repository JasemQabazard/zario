import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { User, SUBMITTER } from '../../shared/security';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-astatuschange',
  templateUrl: './astatuschange.component.html',
  styleUrls: ['./astatuschange.component.css']
})
export class AstatuschangeComponent implements OnInit {
  fu: FormGroup;
  message: string;
  messageClass: string;
  users: Array<SUBMITTER> = [];
  subscription: Subscription;
  NDX = 0;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createfu();
    this.users = [{
      _id: '',
      username: '',
      email: '',
      firstname: '',
      lastname: '',
      mobile: '',
      role: '',
      approvalstatus: ''
    }];
   }

  ngOnInit() {
    const status = 'submit';
    this.subscription = this.authService.getbystatus(status)
    .subscribe(
      datas => {
        if (datas.length !== 0) {
          this.users = datas;
          this.fu.controls['user'].setValue(this.users[0].username);
        } else {
          this.message = 'There in no submitted documents yet, exit in seconds';
          this.messageClass = 'alert alert-danger';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        }
      },
      errormessage => {
        console.log('error while accessing users : ', errormessage);
      });
  }

  createfu() {
    this.fu = this.formBuilder.group({
      user: ''
    });
    this.changeUser();
  }

  changeUser(): void {
    this.fu.valueChanges.subscribe(val => {
      for ( let i = 0; i < this.users.length; i++) {
        if (this.users[i].username === this.fu.controls['user'].value) {
          this.NDX = i;
          break;
        }
     }
    });
  }

  changeStatus() {
    if (this.users[this.NDX].role === 'PENDING') {
      this.users[this.NDX].role = 'MERCHANT';
    }
    this.users[this.NDX].approvalstatus = 'approved';
    this.authService.updateUser(this.users[this.NDX]._id, this.users[this.NDX]).subscribe(
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
  }

}
