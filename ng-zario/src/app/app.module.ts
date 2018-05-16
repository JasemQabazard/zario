import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ProcessHttpmsgService } from './services/process-httpmsg.service';

import { baseURL } from './shared/baseurl';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { SocialComponent } from './components/social/social.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InvestorComponent } from './components/investor/investor.component';
import { BlogComponent } from './components/blog/blog.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordchangeComponent } from './components/passwordchange/passwordchange.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { LocationsComponent } from './components/locations/locations.component';
import { FooterComponent } from './components/footer/footer.component';
import { PasswordforgetComponent } from './components/passwordforget/passwordforget.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProfileComponent,
    PromotionsComponent,
    SocialComponent,
    DashboardComponent,
    InvestorComponent,
    BlogComponent,
    RegisterComponent,
    LoginComponent,
    PasswordchangeComponent,
    ContactusComponent,
    LocationsComponent,
    FooterComponent,
    PasswordforgetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [
    AuthService,
    { provide: 'BaseURL', useValue: baseURL },
    ProcessHttpmsgService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
