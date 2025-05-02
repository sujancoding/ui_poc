import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { TokenExpiredDialogComponent } from '../modals/tokenexpireddialog/token-expired-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthHeadearInterceptor implements HttpInterceptor {
  constructor(private store: InMemoryCache, private dialog: MatDialog) {

  }
  username !: string;
  businessType !: string;
  appVersion !: string; //eg: 1.0 , 1.1 
  deviceType !: string; //eg: iOS, Android, Desktop/Browser

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //Retrieve what business it is ;
    this.businessType = this.store.getItem('BUSINESS_TYPE') ? this.store.getItem('BUSINESS_TYPE') : "";
    this.deviceType = this.store.getItem('DEVICE_TYPE') ? this.store.getItem('DEVICE_TYPE') : "";
    this.appVersion = this.store.getItem('APP_VERSION') ? this.store.getItem('APP_VERSION') : "" ;


    //if business == MC , we have to follow seperate request header object because to send counterid and type in rest of MC api except auth api
    if (this.businessType == "MC") {
      const userId = this.store.getItem('USER_ID') ? this.store.getItem('USER_ID') : "";

      if (userId == "") {
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            channelid: this.store.getItem('CHANNEL_ID'),
            consumerorgcode: 'APT',
            userid: this.store.getItem('USERID'),
            username: this.store.getItem('USERID'),
            appVersion : this.appVersion,
            deviceType : this.deviceType
            
          },
          withCredentials: true,
        });
      }

      if (userId) {
        const getUserName: string = this.store.getItem('USERNAME') ?? '';
        this.username = getUserName || this.store.getItem('LOGGEDIN_ID') || '';
        let counterId = this.store.getItem('RESPONSE_COUNTER_ID') ? this.store.getItem('RESPONSE_COUNTER_ID') : "";
        let counterType = this.store.getItem('RESPONSE_COUNTER_TYPE') ? this.store.getItem('RESPONSE_COUNTER_TYPE') : "";
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            channelid: this.store.getItem('CHANNEL_ID'),
            consumerorgcode: 'APT',
            userid: this.store.getItem('USER_ID'),
            username: this.username,
            counterId: counterId,
            counterType: counterType,
            appVersion : this.appVersion,
            deviceType : this.deviceType
          },
          withCredentials: true,
        });
      }
    }
    // businesstype not equal to MC 
    else {
      //changes done on 27 Sep 2023 , desc : Jwt Token was set in cookies , will not come in login response body , browser will handle cookies automatically , so removed token condition and added userId condition //
      let userId = this.store.getItem('USER_ID') ? this.store.getItem('USER_ID') : ""; //==> This USER_ID key is stored only when authentication res is successful
      let id = this.store.getItem('USERID') ? this.store.getItem('USERID') : "" ;
      console.log("else userId is " + userId);
      if (userId == "") {
        request = request.clone({
          setHeaders: {
            'Content-Type': "application/json",
            channelid: this.store.getItem('CHANNEL_ID') ? this.store.getItem('CHANNEL_ID') : "BRANCH",
            consumerorgcode: 'APT',
            userid: id ? id : "APT", //actual logged in emailid 
            username: id ? id : "APT", //actual logged in emailid 
            appVersion : this.appVersion,
            deviceType : this.deviceType
          }, withCredentials: true,
        });
      }


      if (userId) {
        let getUserName: string = this.store.getItem('USERNAME');
        if (getUserName == "" || getUserName == undefined) {
          this.username = this.store.getItem('LOGGEDIN_ID');
        }
        else if (getUserName != undefined || getUserName != "") {
          this.username = getUserName;
        }
        request = request.clone({
          setHeaders: {
            'Content-Type': "application/json",
            channelid: this.store.getItem('CHANNEL_ID'),
            consumerorgcode: 'APT',
            userid: this.store.getItem('USER_ID'), //authentication response user id
            username: this.username,
            appVersion : this.appVersion,
            deviceType : this.deviceType
          }, withCredentials: true,
        });
      }
    }
    // add check to pass channel id based on device
    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
      console.log("error is " + error.status);

      if (error.status === 401) {
        // Redirect to the login page or perform any other action
        // this.router.navigate(['/login']);
        this.dialog.open(TokenExpiredDialogComponent, {
          width: '460px',
          disableClose: true
        })
      }
      return throwError(error);
    }
    ))
  }





}

