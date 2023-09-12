import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent} from "./reset-password/reset-password.component";
import { WelcomeComponent} from "./welcome/welcome.component";
import { SecuritiProfileComponent} from "./securiti-profile/securiti-profile.component";
import { CompanyRulesComponent } from './company-rules/company-rules.component';
import { RecoverPasswordComponent} from "./recover-password/recover-password.component";

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'reset',component: ResetPasswordComponent},
<<<<<<< HEAD
  {path:'welcome',component: WelcomeComponent},
  {path:'security',component: SecuritiProfileComponent},
  {path:'rules',component: CompanyRulesComponent }
=======
  {path:'rules',component: CompanyRulesComponent },
  {path:'recover',component: RecoverPasswordComponent }
>>>>>>> diboy
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
