import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent} from "./reset-password/reset-password.component";
import { WelcomeComponent} from "./welcome/welcome.component";
import { SecuritiProfileComponent} from "./securiti-profile/securiti-profile.component";
import { CompanyRulesComponent } from './company-rules/company-rules.component';
import { PlanillaComponent} from "./planilla/planilla.component";
import { AuthGuard} from "./welcome/auth.guard";

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'reset',component: ResetPasswordComponent},
  {path:'welcome',component: WelcomeComponent, canActivate: [AuthGuard]},
  {path:'security',component: SecuritiProfileComponent},
  {path:'rules',component: CompanyRulesComponent },
  {path:'planilla',component: PlanillaComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
