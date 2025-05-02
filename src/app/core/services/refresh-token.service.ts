import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { interval, Observable } from 'rxjs';
import { GlobalConstants } from '../../shared/global.constant';
import { InMemoryCache } from '../../shared/services/cache.service';
import { MatDialog } from '@angular/material/dialog';
import { TokenExpiredDialogComponent } from '../../shared/modals/tokenexpireddialog/token-expired-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class TokenRefreshService {

  timeInterval: any;
  refreshTokenInterval: any;
  constructor(private http: HttpClient, private store: InMemoryCache, private dialog: MatDialog) { }

  //Will call RefreshToken API
  refreshToken() {
    return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.REFRESH_JWT_TOKEN_API, {}).catch(this.errorHandling)

  }

  //This function is triggered once logged-in
  startTokenRefreshPolling() {
    let type = this.store.getItem('CUSTOMER_TYPE') ? this.store.getItem('CUSTOMER_TYPE') : "";
    if (type == "I") {
      this.timeInterval = 9 * 60 * 1000   // for consumer refresh token every 9 minutes 
    }
    else {
      this.timeInterval = 19 * 60 * 1000     // for other refresh token every 19 minutes 
    }
    // Poll the refreshToken() method every 10 minutes (600,000 milliseconds).
    this.refreshTokenInterval = interval(this.timeInterval).subscribe(() => {
      this.refreshToken().subscribe(
        (data: any) => {
          if (data.status === 'SUCCESS') {
            // Token refreshed successfully
          }
          if (data.status === 'FAILURE') {
            this.stopTokenRefresh();
            // Redirect to the login page if failed to refresh token.
            this.dialog.open(TokenExpiredDialogComponent, {
              width: '460px',
              disableClose: true
            })
          }
        },
        (error:any) => {
        
            this.stopTokenRefresh();
            // Redirect to the login page or perform any other action
            this.dialog.open(TokenExpiredDialogComponent, {
              width: '460px',
              disableClose: true
            })
          
        }
      );
    });
  }

  //error handling function
  errorHandling(error: HttpErrorResponse) {
    return Observable.throw(error || "server issue");
  }

  //will stop the polling / interval 
  stopTokenRefresh() {
    if (this.refreshTokenInterval) {
      this.refreshTokenInterval.unsubscribe();
    }
  }
}
