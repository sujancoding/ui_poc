import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/shared/global.constant';
import { UserProfile } from '../models/profile.model';
import { AuthRq } from '../models/authreq.model';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { ConsumerOTPRq, OTPRq } from '../models/otprq.model';
import { Router } from '@angular/router';
import { FWPRq } from '../models/fwprq.model';
import { CHGPWDRq } from '../models/chgpwdrq.model';
import { ApplicationService } from 'src/app/core/services/application.service';
import { CorporateApplicationSteps } from 'src/app/core/model/ApplicationFlagSteps';
import { Observable } from 'rxjs';
import { roleIdDetails } from 'src/assets/userrole';
import { MFARq } from '../models/mfarq.model';
import { TokenRefreshService } from 'src/app/core/services/refresh-token.service';
import ngswFile from 'ngsw-config.json' ;
import { MatDialog } from '@angular/material/dialog';
import { WindowManagementService } from 'src/app/shared/services/popupwindow.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SessionTimerService } from 'src/app/shared/session-timeout/public.api';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

 
  myApp : any;
  private logoutUserNull: UserProfile = {} as any;
  corporateScreenStatus : CorporateApplicationSteps = new CorporateApplicationSteps();

  constructor(private http: HttpClient, private store: InMemoryCache, private router: Router,private applicationService : ApplicationService,
    private refreshTokenService: TokenRefreshService, private dialog : MatDialog, private windowManagementService : WindowManagementService,
    private bottomSheet : MatBottomSheet, private sessionTimer : SessionTimerService
  ) {


  }

   //error handling function is declared because we will not take the error message from response , we take only status code here (401)
   errorHandling(error:HttpErrorResponse){
    return Observable.throw(error || "server issue") ;
  }

  loginUser(authRq: AuthRq) {
    this.store.setItem('CHANNEL_ID','MOBILE');
    this.store.setItem('USERID',authRq.username);
    return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.AUTH_API, authRq)
      .pipe(map(response => {
        if (response) {
        //changes done on 27 Sep 2023 , desc : Jwt Token was set in cookies , will not come in login response body , browser will handle cookies automatically //
           // this.store.setItem('JWT_TOKEN', response.jwttoken);
            this.store.setItem('CUSTOMER_TYPE',response.customerType);
            this.store.setItem('USER_ROLE', response.role);
            this.store.setItem('OTP_REFNO', response.otpRefNo);
            let appSteps = JSON.stringify(response.applicationSteps);
            this.store.setItem('APPLICATION_STEPS', appSteps);
            this.store.setItem('APPLICATIONSTATUS', response.applicationStatus);
            this.store.setItem('APPLICATION_ID', response.applicationId);
            this.store.setItem('CUSTOMER_ID',response.customerId);
            this.store.setItem('USER_ID',response.userId);
            this.store.setItem('USERNAME',response.userName);
            this.store.setItem('CUSTOMER_STATUS',response.customerStatus);
            this.store.setItem('LOGGEDIN_ID',response.loggedInId);
            this.store.setItem('LOGGEDIN_EMAIL_ID', response.loggedInEmail) ;
            this.store.setItem('CHANNEL_TYPE', 'MOBILE') ; //store this channel type for self onboading purpose , only used in corporate docs .
            this.store.setItem('ISFIRSTTIMELOGIN', response.firstTimeLogin) ;

            var profile = new UserProfile();
      

          /** To Dev Mode User role Support */
          let role = this.store.getItem('USER_ROLE');
          if (role == undefined || role == '') {
            this.store.setItem('USER_ROLE', authRq.role);
            this.store.setItem('APPLICATION_STEPS', response.applicationSteps)
            this.store.setItem('APPLICATION_ID', response.applicationId)
            this.store.setItem('CUSTOMER_ID',response.customerId);
            this.store.setItem('USER_ID',response.userId);
            this.store.setItem('CHANNEL_TYPE', 'MOBILE') ;
          }

        }
        return response;
         
      }));

  }
  loginBranch(authRq: AuthRq, counterId:string){ //-- MC code
 // loginBranch(authRq: AuthRq) {
   this.store.setItem('CHANNEL_ID','BRANCH');
   this.store.setItem('USERID',authRq.username);

   let backofficeAuthenticationUri : string ;
   if(counterId != ""){
    backofficeAuthenticationUri = GlobalConstants.AUTH_API + `counterId` + "=" + `${counterId}` ;
   }
   else {
    backofficeAuthenticationUri = GlobalConstants.AUTH_API ;
   }

    return this.http.post<any>(GlobalConstants.API_BASE_URL + backofficeAuthenticationUri, authRq)
      .pipe(map(response => {
        if (response) {
           //changes done on 27 Sep 2023 , desc : Jwt Token was set in cookies , will not come in login response body , browser will handle cookies automatically //
          //  this.store.setItem('JWT_TOKEN', response.jwttoken);
            this.store.setItem('USER_ROLE', response.role);
            this.store.setItem('OTP_REFNO', response.otpRefNo);
            this.store.setItem('APPLICATION_STEPS', response.applicationSteps);
            this.store.setItem('APPLICATIONSTATUS', response.applicationStatus);
            this.store.setItem('APPLICATION_ID', response.applicationId);
            this.store.setItem('CUSTOMER_ID',response.customerId);
            this.store.setItem('USER_ID',response.userId);
            this.store.setItem('LOGGEDIN_ID',response.loggedInId);
            this.store.setItem('LOGGEDIN_EMAIL_ID', response.loggedInEmail) ;
            this.store.setItem('USERNAME',response.userName);
            this.store.setItem('PRODUCT_CODE_BIZ',response.productCode);
            this.store.setItem('RESPONSE_COUNTER_ID',response.counterId);
            this.store.setItem('RESPONSE_COUNTER_TYPE',response.counterType);
            this.store.setItem('MFA_ENROLLED_STATUS',response.mfaEnrollmentStatus);
            this.store.setItem('MFA_VALIDATION_STATUS',response.mfaValidationStatus);
            this.store.setItem('MFA_QR',response.qrMFAImage);
           
           
            if(response.roleDetail != null){
              let accessControlDtl = JSON.stringify(response.roleDetail.accessDetails);
              this.store.setItem('ACCESS_CONTROLS_ARRAY', accessControlDtl) ;
              if(response.counterType && response.counterType == "R"){
                if (accessControlDtl) {
                  const arrayOfObjects = JSON.parse(accessControlDtl); //debug and check what's coming in arrayOfObjects variable and proceed below change..
                  //filter out and remove the object from 'ACCESS_CONTROLS_ARRAY' where accessId == "BADEM" ;
                  let filteredAccessArray = arrayOfObjects.filter((item: any) => item.accessId != 'BADEM');
                  // converting filteredAccessArray as string...
                  accessControlDtl = JSON.stringify(filteredAccessArray);
                  // storing accessControlDtl in store.
                  this.store.setItem('ACCESS_CONTROLS_ARRAY', accessControlDtl) ;
                }
              }
            }

            var profile = new UserProfile();

          
          /** To Dev Mode User role Support */
          let role = this.store.getItem('USER_ROLE');
          if (role == undefined || role == '') {
            this.store.setItem('USER_ROLE', authRq.role);
            this.store.setItem('APPLICATION_STEPS', response.applicationSteps)
            this.store.setItem('APPLICATION_ID', response.applicationId)
            this.store.setItem('CUSTOMER_ID',response.customerId);
            this.store.setItem('USER_ID',response.userId);
            this.store.setItem('USERNAME',response.userName);
            this.store.setItem('PRODUCT_CODE_BIZ',response.productCode);
            this.store.setItem('RESPONSE_COUNTER_ID',response.counterId);
            this.store.setItem('RESPONSE_COUNTER_TYPE',response.counterType);
            this.store.setItem('MFA_ENROLLED_STATUS',response.mfaEnrollmentStatus);
            this.store.setItem('MFA_VALIDATION_STATUS',response.mfaValidationStatus);
            this.store.setItem('MFA_QR',response.qrMFAImage);
            
           
          }

        }
        return response;

      }));
  }

  loginAgent(authRq: AuthRq) {
    this.store.setItem('CHANNEL_ID','MOBILE');
    this.store.setItem('USERID',authRq.username);
    return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.AUTH_API, authRq)
      .pipe(map(response => {
        if (response) {
         //changes done on 27 Sep 2023 , desc : Jwt Token was set in cookies , will not come in login response body , browser will handle cookies automatically //
          //  this.store.setItem('JWT_TOKEN', response.jwttoken);
            this.store.setItem('USER_ROLE', response.role);
            this.store.setItem('USER_ID',response.userId);
            this.store.setItem('USERNAME',response.userName);
            this.store.setItem('LOGGEDIN_ID',response.loggedInId);
            this.store.setItem('LOGGEDIN_EMAIL_ID', response.loggedInEmail) ;
           // this.store.setItem('OTP_REFNO', response.otpRefNo);
           this.store.setItem('MFA_ENROLLED_STATUS',response.mfaEnrollmentStatus);
           this.store.setItem('MFA_VALIDATION_STATUS',response.mfaValidationStatus);
           this.store.setItem('MFA_QR',response.qrMFAImage);

            var profile = new UserProfile();
          
          /** To Dev Mode User role Support */
          let role = this.store.getItem('USER_ROLE');
          if (role == undefined || role == '') {
            this.store.setItem('USER_ROLE', authRq.role);
          }

        }
        return response;

      }));
  }

  validateOTP(otpRq: OTPRq) {
    return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.OTP_API, otpRq)
      .pipe(map(response => {
        if (response) {
          console.log(response);
        }
        return response;

      }));
  }

   //Customer Registration (Consumer) > OTP > Setpup API .
    validateConsumerOtp(otpReq: ConsumerOTPRq): Observable<any> {
      return this.http.post<ConsumerOTPRq>(GlobalConstants.API_BASE_URL + GlobalConstants.CUSTOMER_REGISTER_CONSUMER_STEPUP_API, otpReq).catch(this.errorHandling)
    }

  validateMFA(mfaRq: MFARq) {
    console.log("validateMFA");
    return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MFA_API, mfaRq)
      .pipe(map(response => {
        if (response) {
          console.log(response);
        }
        return response;

      }));
  }


  forgotPwdVerify(fwpRq: FWPRq) {
    this.store.setItem('CHANNEL_ID','MOBILE');
    this.store.setItem('USERID',fwpRq.email);
 
    return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.FWP_VERIFY_API, fwpRq).catch(this.errorHandling)
      // .pipe(map(response => {
      //   if (response) {

      //   }π
      //   return response;

      // }));
  }

  changePwd(chgpwdRq: CHGPWDRq) {
    console.log("Test Pwd Change");
    return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.FWP_CHANGE_API, chgpwdRq)
      .pipe(map(response => {
        if (response) {
          console.log(response);
        }
        return response;
      }));
  }

  logout() {
        const role = this.store.getItem('USER_ROLE');
      
        console.log(role)
        this.dialog.closeAll();
        this.bottomSheet.dismiss() ;
        let logoutURL = '';
        if (role && role === roleIdDetails.CONSUMER) { // 111 - consumer
          logoutURL = '/authentication/login';
        }
        else if (role && role == roleIdDetails.AGENT) { // 888 - agent
          logoutURL = '/authentication/login-agent';
        }
        else if (role == roleIdDetails.CORPORATE_OWNER || role == roleIdDetails.CORPORATE_RUNNER || role == roleIdDetails.CORPORATE_DEALER) {  //corporate - 555 - owner , 556-runner , 557-dealer
          logoutURL = '/authentication/login-business';
        }
        else{ // other than any role 111,888,555,556,557 , the block will executed.
           logoutURL = '/authentication/login-branchuser';
           this.windowManagementService.closeAllWindow() ;
        }
        
       // this.store.removeItem('JWT_TOKEN')
        this.store.removeItem('USER_ROLE')
        this.store.removeItem('OTP_REFNO')
        this.store.clear(); //clearing all datas in session storage once application is logout
        this.refreshTokenService.stopTokenRefresh() ;
        this.sessionTimer.stopTimer(); //session timer (user inactivity) is stopped .

        //checking for mobileappservice from native to check its mobileapp or not..
    this.myApp = window.MobileAppService ? window.MobileAppService.isMobileApp() : "" ;
    if(this.myApp != ""){
      this.myApp.then(
        function(resolve: any){
            var isMobileApp = resolve;
            console.log("Its a mobile device..")
            console.log(isMobileApp);
          if (isMobileApp == "Y") {
            sessionStorage.setItem('ISMOBILEAPP', 'Y');
            //If its mobile app , can check device type and app version from native...
            let deviceDetails = window.MobileAppService?.getDeviceDetails();
            if (deviceDetails) {
              let appVersion: string;
              let deviceType: string;
              deviceDetails.then((message: any) => {
                console.log(message);
                let deviceDetailsObject = JSON.parse(message) ;
                deviceType = deviceDetailsObject.osName ? deviceDetailsObject.osName : ""; 
                sessionStorage.setItem('DEVICE_TYPE', deviceType); //eg: Android, iOS, Browser/Desktop
                appVersion = deviceDetailsObject.appVersion ? deviceDetailsObject.appVersion : "";
                sessionStorage.setItem('APP_VERSION', appVersion); //eg: 1.0, 1.1
              }).catch((message: any) => {
                console.log(message);
              });
            }
            //Response from native: {"deviceName”:”xxxxx”,”deviceModel":"Pixel 8","osVersion":"14","osName":"Android","appVersion":"1.0"}
          }
        
        },
        function(failure: any){
            console.log(failure) ;
        }
        );
        
    }
    else{
      console.log("Its not a mobile device..") ;
      console.log(navigator.userAgent) ;
      const userAgent = navigator.userAgent;
      let deviceType : string ;
    if (/android/i.test(userAgent)) {
      deviceType = 'Android';
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      deviceType = 'iOS';
    } else {
      deviceType = 'Desktop';
    }
    console.log(deviceType) ;
    sessionStorage.setItem('DEVICE_TYPE', deviceType); //eg: Android, iOS, Browser/Deskto
    let ngswVersionTrack = ngswFile.appData.version ;
    sessionStorage.setItem('APP_VERSION', ngswVersionTrack); //eg: 1.0, 1.1
    }


       
          this.router.navigate([logoutURL]);
        
  }


 //backoffice >> update commission 
 logoutService(): Observable<any> {
  return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.LOGOUT_API,{}).catch(this.errorHandling)
}


}


