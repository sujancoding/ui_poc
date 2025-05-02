import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { NgOtpInputModule } from 'ng-otp-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthenticationRoutes } from './authentication.routing';
import { ErrorComponent } from './error/error.component';
import { ForgotComponent } from './forgot/forgot.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { AngularMaterialModule } from '../angular-material-module';
import { MfaComponent } from './mfa/mfa.component';
import { EmploginComponent } from './emplogin/emplogin.component';
import { ResetpwdComponent } from './resetpwd/resetpwd.component';
import { LoginBranchuserComponent } from './login-branchuser/login-branchuser.component';
import { AgentLoginComponent } from './agent-login/agent-login.component';
import { AuthenticatorComponent } from './authenticator/authenticator.component';
import { AuthenticatorSetupComponent } from './authenticator/authenticatorsetup.component';
import { AgreementDialogComponent } from './modals/agreement-dialog/agreement-dialog.component';
import { RegistrationSuccessfulComponent } from './registration-successful/registration-successful.component';
import { LoginBusinessComponent } from './login-business/login-business.component';
import { LoginCustomerOptionsDialogComponent } from './modals/login-customer-options-dialog/login-customer-options-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes),
    MatIconModule,
    MatCardModule,
    MatInputModule ,
    MatCheckboxModule,
    MatButtonModule,
    FlexLayoutModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgOtpInputModule,
    AngularMaterialModule
  ],
  declarations: [
    ErrorComponent,
    ForgotComponent,
    LockscreenComponent,
    LoginComponent,
    RegisterComponent,
    MfaComponent,
    EmploginComponent,
    ResetpwdComponent,
    LoginBranchuserComponent,
    AgentLoginComponent,
    AuthenticatorComponent,
    AuthenticatorSetupComponent,
    AgreementDialogComponent,
    RegistrationSuccessfulComponent,
    LoginBusinessComponent,
    LoginCustomerOptionsDialogComponent
  ],
})
export class AuthenticationModule { }
