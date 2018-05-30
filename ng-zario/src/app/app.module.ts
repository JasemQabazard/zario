import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import { AuthService } from './services/auth.service';
import { ProcessHttpmsgService } from './services/process-httpmsg.service';
import { CommonRoutinesService } from './services/common-routines.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { baseURL } from './shared/baseurl';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BlogComponent } from './components/blog/blog.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordchangeComponent } from './components/passwordchange/passwordchange.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { FooterComponent } from './components/footer/footer.component';
import { PasswordforgetComponent } from './components/passwordforget/passwordforget.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { CartComponent } from './components/cart/cart.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProfileComponent,
    PromotionsComponent,
    DashboardComponent,
    BlogComponent,
    RegisterComponent,
    LoginComponent,
    PasswordchangeComponent,
    ContactusComponent,
    FooterComponent,
    PasswordforgetComponent,
    TransactionsComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    { provide: 'BaseURL', useValue: baseURL },
    ProcessHttpmsgService,
    CommonRoutinesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
