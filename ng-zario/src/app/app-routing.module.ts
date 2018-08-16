import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { BlogComponent } from './components/blog/blog.component';
import { ADashboardComponent } from './components/adashboard/adashboard.component';
import { MDashboardComponent } from './components/mdashboard/mdashboard.component';
import { CDashboardComponent } from './components/cdashboard/cdashboard.component';
import { LoginComponent } from './components/login/login.component';
import { MProfileComponent } from './components/mprofile/mprofile.component';
import { CProfileComponent } from './components/cprofile/cprofile.component';
import { MPromotionsComponent } from './components/mpromotions/mpromotions.component';
import { APromotionsComponent } from './components/apromotions/apromotions.component';
import { CPromotionsComponent } from './components/cpromotions/cpromotions.component';
import { MAddCustomerComponent } from './components/maddcustomer/maddcustomer.component';
import { UsersamendComponent } from './components/usersamend/usersamend.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordchangeComponent } from './components/passwordchange/passwordchange.component';
import { PasswordforgetComponent } from './components/passwordforget/passwordforget.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { CartComponent } from './components/cart/cart.component';
import { GroupComponent } from './components/group/group.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'blog', component: BlogComponent},
  {path: 'adashboard', component: ADashboardComponent},
  {path: 'mdashboard', component: MDashboardComponent},
  {path: 'cdashboard', component: CDashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'mprofile', component: MProfileComponent},
  {path: 'cprofile', component: CProfileComponent},
  {path: 'useramend', component: UsersamendComponent},
  {path: 'mpromotions', component: MPromotionsComponent},
  {path: 'apromotions', component: APromotionsComponent},
  {path: 'cpromotions', component: CPromotionsComponent},
  {path: 'maddcustomer', component: MAddCustomerComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'passwordchange', component: PasswordchangeComponent},
  {path: 'passwordforget', component: PasswordforgetComponent},
  {path: 'contactus', component: ContactusComponent},
  {path: 'wallet', component: WalletComponent},
  {path: 'cart', component: CartComponent},
  {path: 'group', component: GroupComponent},
  {path: 'settings', component: SettingsComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
