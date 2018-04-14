import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { BlogComponent } from './components/blog/blog.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InvestorComponent } from './components/investor/investor.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { RegisterComponent } from './components/register/register.component';
import { SocialComponent } from './components/social/social.component';
import { PasswordchangeComponent } from './components/passwordchange/passwordchange.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'blog', component: BlogComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'investor', component: InvestorComponent},
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'promotions', component: PromotionsComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'social', component: SocialComponent},
  {path: 'passwordchange', component: PasswordchangeComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
