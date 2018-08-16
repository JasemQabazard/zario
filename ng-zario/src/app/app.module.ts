import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AgmCoreModule } from '@agm/core';
import { environment } from '../environments/environment';

import { AuthService } from './services/auth.service';
import { ProcessHttpmsgService } from './services/process-httpmsg.service';
import { CommonRoutinesService } from './services/common-routines.service';
import { PromotionScannerService } from './services/promotion-scanner.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { ProfileService } from './services/profile.service';
import { PromotionService } from './services/promotion.service';
import { baseURL } from './shared/baseurl';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { MProfileComponent } from './components/mprofile/mprofile.component';
import { MPromotionsComponent } from './components/mpromotions/mpromotions.component';
import { ADashboardComponent } from './components/adashboard/adashboard.component';
import { BlogComponent } from './components/blog/blog.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordchangeComponent } from './components/passwordchange/passwordchange.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { FooterComponent } from './components/footer/footer.component';
import { PasswordforgetComponent } from './components/passwordforget/passwordforget.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { CartComponent } from './components/cart/cart.component';
import { GroupComponent } from './components/group/group.component';
import { CProfileComponent } from './components/cprofile/cprofile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { UsersamendComponent } from './components/usersamend/usersamend.component';
import { MAddCustomerComponent } from './components/maddcustomer/maddcustomer.component';
import { CPromotionsComponent } from './components/cpromotions/cpromotions.component';
import { APromotionsComponent } from './components/apromotions/apromotions.component';
import { CDashboardComponent } from './components/cdashboard/cdashboard.component';
import { MDashboardComponent } from './components/mdashboard/mdashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    MProfileComponent,
    MPromotionsComponent,
    ADashboardComponent,
    BlogComponent,
    RegisterComponent,
    LoginComponent,
    PasswordchangeComponent,
    ContactusComponent,
    FooterComponent,
    PasswordforgetComponent,
    WalletComponent,
    CartComponent,
    GroupComponent,
    CProfileComponent,
    SettingsComponent,
    UsersamendComponent,
    MAddCustomerComponent,
    CPromotionsComponent,
    APromotionsComponent,
    CDashboardComponent,
    MDashboardComponent
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
    PromotionScannerService,
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
