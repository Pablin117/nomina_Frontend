import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SetPasswordComponent} from "./set-password/set-password.component";
import { WelcomeComponent} from "./welcome/welcome.component";
import { SecuritiProfileComponent} from "./securiti-profile/securiti-profile.component";
import { CompanyComponent } from './company/company.component';
import { RecoverPasswordComponent} from "./recover-password/recover-password.component";
import { LocationComponent } from './location/location.component';
import { RoleComponent } from './role/role.component';


const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'set-password',component: SetPasswordComponent},
  {path:'welcome',component: WelcomeComponent},
  {path:'security',component: SecuritiProfileComponent},
  {path:'company',component: CompanyComponent },
  {path:'recover',component: RecoverPasswordComponent },
  {path:'location',component: LocationComponent },
  {path:'role',component: RoleComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
