import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AgmCoreModule } from '@agm/core';
import { environment } from '../environments/environment';

import { AuthService } from './services/auth.service';
import { ProcessHttpmsgService } from './services/process-httpmsg.service';
import { CommonRoutinesService } from './services/common-routines.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { ProfileService } from './services/profile.service';
import { PromotionService } from './services/promotion.service';
import { baseURL } from './shared/baseurl';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { MProfileComponent } from './components/mprofile/mprofile.component';
import { MPromotionsComponent } from './components/mpromotions/mpromotions.component';
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
import { GroupComponent } from './components/group/group.component';
import { CProfileComponent } from './components/cprofile/cprofile.component';
import { SettingsComponent } from './components/settings/settings.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    MProfileComponent,
    MPromotionsComponent,
    DashboardComponent,
    BlogComponent,
    RegisterComponent,
    LoginComponent,
    PasswordchangeComponent,
    ContactusComponent,
    FooterComponent,
    PasswordforgetComponent,
    TransactionsComponent,
    CartComponent,
    GroupComponent,
    CProfileComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.googleMaps_api_key
    }),
    HttpClientModule
  ],
  providers: [
    AuthService,
    { provide: 'BaseURL', useValue: baseURL },
    ProcessHttpmsgService,
    CommonRoutinesService,
    ProfileService,
    PromotionService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
