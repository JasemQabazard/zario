import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { BlogComponent } from './components/blog/blog.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordchangeComponent } from './components/passwordchange/passwordchange.component';
import { PasswordforgetComponent } from './components/passwordforget/passwordforget.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { CartComponent } from './components/cart/cart.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'blog', component: BlogComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'promotions', component: PromotionsComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'passwordchange', component: PasswordchangeComponent},
  {path: 'passwordforget', component: PasswordforgetComponent},
  {path: 'contactus', component: ContactusComponent},
  {path: 'transactions', component: TransactionsComponent},
  {path: 'cart', component: CartComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
