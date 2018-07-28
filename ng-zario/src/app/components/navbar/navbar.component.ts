import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';

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
  realname: string = undefined;
  userrole: string = undefined;
  subscription: Subscription;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getRealname()
      .subscribe(rname => { console.log(name); this.realname = rname; });
    this.subscription = this.authService.getUserrole()
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
    this.authService.logOut();
  }

}
