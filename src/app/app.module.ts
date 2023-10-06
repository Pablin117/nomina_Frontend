import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { FormsModule } from '@angular/forms';
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
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { LogComponent } from './log/log.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from "@angular/material/menu";
import { ModuleMaintenanceComponent } from './module-maintenance/module-maintenance.component';
import { UserMComponent } from './user-m/user-m.component';
import { GenderComponent } from './gender/gender.component';
import { StatusUserComponent } from './status-user/status-user.component';
import { MenuComponent } from './menu/menu.component';
import { OptionComponent } from './option/option.component';
import { RoleUserComponent } from './role-user/role-user.component';
import { RoleOptionComponent } from './role-option/role-option.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BankComponent } from './bank/bank.component';
import { EmployeeComponent } from './employee/employee.component';
import { MaritalStatusComponent } from './marital-status/marital-status.component';
import { PersonDocumentComponent } from './person-document/person-document.component';
import { PersonComponent } from './person/person.component';
import { PositionComponent } from './position/position.component';
import { AbsenceComponent } from './absence/absence.component';
import { StatusEmployeeComponent } from './status-employee/status-employee.component';
import { DepartmentComponent } from './department/department.component';
import { TypeDocumentComponent } from './type-document/type-document.component';
import { CheckOnlineComponent } from './check-online/check-online.component';
import { PayrollComponent } from './payroll/payroll.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountBankEmployeeComponent } from './account-bank-employee/account-bank-employee.component';
import { FlowStatusEmployeeComponent } from './flow-status-employee/flow-status-employee.component';
import { PayrollDetailsComponent } from './payroll-details/payroll-details.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SetPasswordComponent,
    CompanyComponent,
    RecoverPasswordComponent,
    RoleComponent,
    LocationComponent,
    ResetPasswordComponent,
    CreateUserComponent,
    LogComponent,
    ModuleMaintenanceComponent,
    UserMComponent,
    GenderComponent,
    StatusUserComponent,
    MenuComponent,
    OptionComponent,
    RoleUserComponent,
    RoleOptionComponent,
    HomeComponent,
    NotFoundComponent,
    BankComponent,
    EmployeeComponent,
    MaritalStatusComponent,
    PersonDocumentComponent,
    PersonComponent,
    PositionComponent,
    AbsenceComponent,
    StatusEmployeeComponent,
    DepartmentComponent,
    TypeDocumentComponent,
    CheckOnlineComponent,
    PayrollComponent,
    AccountBankEmployeeComponent,
    FlowStatusEmployeeComponent,
    PayrollDetailsComponent,

  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule, MatDividerModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, BrowserAnimationsModule, MatMenuModule, NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
