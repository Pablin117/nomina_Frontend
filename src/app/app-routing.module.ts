import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SetPasswordComponent } from "./set-password/set-password.component";
import { CompanyComponent } from './company/company.component';
import { RecoverPasswordComponent } from "./recover-password/recover-password.component";
import { LocationComponent } from './location/location.component';
import { RoleComponent } from './role/role.component';
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { CreateUserComponent } from "./create-user/create-user.component";
import { LogComponent } from "./log/log.component";
import { FormsModule } from '@angular/forms';
import { ModuleMaintenanceComponent } from "./module-maintenance/module-maintenance.component";
import { UserMComponent } from "./user-m/user-m.component";
import { HomeComponent } from './home/home.component';
import { OptionComponent } from './option/option.component';
import { MenuComponent } from './menu/menu.component';
import { StatusUserComponent } from './status-user/status-user.component';
import { RoleUserComponent } from './role-user/role-user.component';
import { GenderComponent } from './gender/gender.component';
import {RoleOptionComponent} from "./role-option/role-option.component";
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'set-password', component: SetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'company', component: CompanyComponent },
  { path: 'recover', component: RecoverPasswordComponent },
  { path: 'location', component: LocationComponent },
  { path: 'role', component: RoleComponent },
  { path: 'role-option', component: RoleOptionComponent },
  { path: 'create', component: CreateUserComponent },
  { path: 'log', component: LogComponent },
  { path: 'module', component: ModuleMaintenanceComponent },
  { path: 'userM', component: UserMComponent },
  { path: 'option', component: OptionComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'status-user', component: StatusUserComponent },
  { path: 'role-user', component: RoleUserComponent },
  { path: 'gender', component: GenderComponent },
  { path: 'not-found', component: NotFoundComponent},
  { path: '**', redirectTo: 'not-found'}


];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
