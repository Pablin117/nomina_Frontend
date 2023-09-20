import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SetPasswordComponent } from "./set-password/set-password.component";
import { SecuritiProfileComponent } from "./securiti-profile/securiti-profile.component";
import { CompanyComponent } from './company/company.component';
import { RecoverPasswordComponent } from "./recover-password/recover-password.component";
import { LocationComponent } from './location/location.component';
import { RoleComponent } from './role/role.component';
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { CreateUserComponent } from "./create-user/create-user.component";
import { LogComponent } from "./log/log.component";
import { FormsModule } from '@angular/forms';
import { ModuleMaintenanceComponent } from "./module-maintenance/module-maintenance.component";
import { HomeComponent } from './home/home.component';
import { OptionComponent } from './option/option.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'set-password', component: SetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'security', component: SecuritiProfileComponent },
  { path: 'company', component: CompanyComponent },
  { path: 'recover', component: RecoverPasswordComponent },
  { path: 'location', component: LocationComponent },
  { path: 'role', component: RoleComponent },
  { path: 'create', component: CreateUserComponent },
  { path: 'log', component: LogComponent },
  { path: 'module-maintenance', component: ModuleMaintenanceComponent },
  { path: 'option', component: OptionComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
