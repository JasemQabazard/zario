import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../../services/login.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  ADMIN: Boolean = false;
  CUSTOMER: Boolean = false;
  MERCHANT: Boolean = false;
  USER: Boolean = true;

  username: string = undefined;
  userrole: string = undefined;
  subscription: Subscription;

  constructor(
    private loginService: LoginService
  ) { }

  ngOnInit() {
    console.log("init-1");
    this.loginService.loadUserCredentials();
    console.log("init-2");
    this.subscription = this.loginService.getUsername()
      .subscribe(name => { console.log(name); this.username = name; });
    this.subscription = this.loginService.getUserrole()
      .subscribe(role => { 
        console.log(role); this.userrole = role; 
        this.ADMIN = false;
        this.CUSTOMER = false;
        this.MERCHANT = false;
        this.USER = false;
        if (this.userrole == "CUSTOMER" ) {
          this.CUSTOMER = true;
        } else if (this.userrole == "MERCHANT" ) {
          this.MERCHANT = true;
        } else if (this.userrole == "ADMIN" ) {
          this.ADMIN = true;
        } else if (!this.ADMIN && !this.MERCHANT && !this.CUSTOMER) {
          this.USER = true;
        }
        console.log(this.CUSTOMER, this.MERCHANT, this.ADMIN, this.USER);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logOut() {
    this.username = undefined;
    this.userrole = undefined;
    this.loginService.logOut();
  }

}
