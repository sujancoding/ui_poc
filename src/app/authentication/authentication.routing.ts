import { Routes } from '@angular/router';
import { AgentLoginComponent } from './agent-login/agent-login.component';
import { EmploginComponent } from './emplogin/emplogin.component';

import { ErrorComponent } from './error/error.component';
import { ForgotComponent } from './forgot/forgot.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { LoginBranchuserComponent } from './login-branchuser/login-branchuser.component';
import { LoginComponent } from './login/login.component';
import { MfaComponent } from './mfa/mfa.component';
import { RegisterComponent } from './register/register.component';
import { ResetpwdComponent } from './resetpwd/resetpwd.component';
import { AuthenticatorComponent } from './authenticator/authenticator.component';
import { AuthenticatorSetupComponent } from './authenticator/authenticatorsetup.component';
import { RegistrationSuccessfulComponent } from './registration-successful/registration-successful.component';
import { LoginBusinessComponent } from './login-business/login-business.component';
import { SwUpdateGuard } from '../shared/services/swupdate.gaurd';
export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '404',
        component: ErrorComponent,
      },
      {
        path: 'forgot',
        component: ForgotComponent,
      },
      {
        path: 'resetpwd',
        component: ResetpwdComponent,
      },
      {
        path: 'lockscreen',
        component: LockscreenComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [SwUpdateGuard]
      },
      {
        path: 'emplogin',
        component: EmploginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'mfa',
        component: MfaComponent,
      },
      {
        path: 'login-branchuser',
        component: LoginBranchuserComponent,
      },
      {
        path: 'login-agent',
        component: AgentLoginComponent,
      },
      {
        path: 'authenticator',
        component: AuthenticatorComponent,
      }, 
      {
        path: 'authenticatorsetup',
        component: AuthenticatorSetupComponent,
      },
      {
        path: 'register-successful',
        component: RegistrationSuccessfulComponent,
      },
      {
        path: 'login-business',
        component: LoginBusinessComponent,
      },

    ],
  },
];
