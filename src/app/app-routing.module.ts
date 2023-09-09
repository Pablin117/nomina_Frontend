import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent} from "./reset-password/reset-password.component";
import { CompanyRulesComponent } from './company-rules/company-rules.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'reset',component: ResetPasswordComponent},
  {path:'rules',component: CompanyRulesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
