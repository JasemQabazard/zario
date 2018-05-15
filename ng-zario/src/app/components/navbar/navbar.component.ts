import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  ADMIN: Boolean = false;
  CUSTOMER: Boolean = false;
  MERCHANT: Boolean = false;
  USER: Boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
