import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { FormsModule } from '@angular/forms';
import { SecuritiProfileComponent } from './securiti-profile/securiti-profile.component';
import { CompanyComponent } from './company/company.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { RoleComponent } from './role/role.component';
import { LocationComponent } from './location/location.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PlanillaComponent } from './planilla/planilla.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { LogComponent } from './log/log.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from "@angular/material/menu";
import { ModuleMaintenanceComponent } from './module-maintenance/module-maintenance.component';
import { GenderComponent } from './gender/gender.component';
import { StatusUserComponent } from './status-user/status-user.component';
import { MenuComponent } from './menu/menu.component';
import { OptionComponent } from './option/option.component';
import { RoleUserComponent } from './role-user/role-user.component';
import { RoleOptionComponent } from './role-option/role-option.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SetPasswordComponent,
    SecuritiProfileComponent,
    PlanillaComponent,
    CompanyComponent,
    RecoverPasswordComponent,
    RoleComponent,
    LocationComponent,
    ResetPasswordComponent,
    CreateUserComponent,
    LogComponent,
    ModuleMaintenanceComponent,
    GenderComponent,
    StatusUserComponent,
    MenuComponent,
    OptionComponent,
    RoleUserComponent,
    RoleOptionComponent,
    HomeComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule, MatDividerModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, BrowserAnimationsModule, MatMenuModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
