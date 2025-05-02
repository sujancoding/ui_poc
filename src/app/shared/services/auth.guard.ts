import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { InMemoryCache } from './cache.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationDialogComponent } from '../modals/logoutconfirmationdialog/logout-confirmation-dialog/logout-confirmation-dialog.component';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { roleIdDetails } from 'src/assets/userrole';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    constructor(private routes: Router,
        private authenticationService: AuthenticationService,
        private router: Router,
        private dialog: MatDialog,
        private store: InMemoryCache) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {

          let userId = this.store.getItem("USER_ID") ? this.store.getItem("USER_ID") : "";
        if (userId != "") { //change done on 27 Sep 2023 , desc : previous check was JWT TOKEN , but token was set in cookies , so as per karthik sir instr we made check for user id.
            return true;
        } else {
            var role = this.store.getItem('USER_ROLE');
            let logoutURL = '';
            if (role && role === roleIdDetails.CONSUMER) { // consumer - 111
              logoutURL = '/authentication/login';
            } 
            else if(role && role == roleIdDetails.AGENT){ // agent - 888
              logoutURL = '/authentication/login-agent';
            }
            else if(role == roleIdDetails.CORPORATE_OWNER || role == roleIdDetails.CORPORATE_RUNNER || role == roleIdDetails.CORPORATE_DEALER){ //corporate - 555 - owner , 556-runner , 557-dealer
              logoutURL = '/authentication/login-business';
            }
            else{
              logoutURL = '/authentication/login-branchuser';
            }
            this.router.navigate([logoutURL]);
            return false;
        }
        return true;
    }

    // canDeactivate() {
    //     if (this.router.url) {
    //       const dialogRef = this.dialog.open(LogoutConfirmationDialogComponent);
    
    //       dialogRef.afterClosed().pipe(
    //         map(result => {
    //           if (result === 'ok') {
    //             this.authenticationService.logout();
    //             return true; // Allow navigation after logout
    //           } else {
    //             return false; // Prevent navigation if logout is canceled
    //           }
    //         })
    //       );
    //     } else {
    //       return true; // Allow navigation for other routes
    //     }
    //   }
}