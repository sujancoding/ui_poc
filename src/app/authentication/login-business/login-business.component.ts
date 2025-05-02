import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthRq } from '../models/authreq.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { MatDialog } from '@angular/material/dialog';
import { TokenRefreshService } from 'src/app/core/services/refresh-token.service';
import { first } from 'rxjs/operators';
import { roleIdDetails } from 'src/assets/userrole';

@Component({
  selector: 'app-login-business',
  templateUrl: './login-business.component.html',
  styleUrls: ['./login-business.component.scss']
})
export class LoginBusinessComponent implements OnInit {

  public form: FormGroup = Object.create(null);
  private authRq: AuthRq = new AuthRq();
  logo = 'assets/images/logo1.jpg'
  hide= true;
  loader = false;
  signIn = true;
  
  constructor(private fb: FormBuilder, private router: Router,
    private authService: AuthenticationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private store: InMemoryCache,
    private refreshTokenService : TokenRefreshService
  ) {
    
  }

  // Custom validator function
 validateEmailOrPhoneNumber(control:any) {
  const value = control.value;
  if (!value) {
    return null; // If no value provided, consider it valid
  }

  // Check if it's a valid email address
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return null; // Valid email
  }

  // Check if it's a valid phone number (only numbers and max length 8)
  if (/^\d+$/.test(value) && value.length <= 15) {
    return null; // Valid phone number
  }

  // If neither email nor phone number, return validation error
  return { invalidEmailOrPhoneNumber: true };
}

  ngOnInit(): void {
    this.form = this.fb.group({
      uname: [null, [Validators.required, this.validateEmailOrPhoneNumber]],
      password: [null, Validators.compose([Validators.required])],
    });
    //getScreenWidth will get the windows inner width.
  this.getScreenWidth = window.innerWidth;
  this.getScreenHeight = window.innerHeight;
  }
  public getScreenWidth: any;
  public getScreenHeight: any;
  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  ngAfterContentInit() {
    // contentChild is set after the content has been initialized
    setTimeout(() => {
      this.route.queryParams.subscribe(params => {
        if (params.registered !== undefined && params.registered === 'true') {
          this.alertService.success("Registration Successful!!");
          this.alertService.clear()
        }
      });
    }, 0)

  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit(): void {
    this.loader = true;
    this.signIn = false;
   
    if(this.getScreenWidth >= 1200){
    this.authRq.username = this.f.uname.value;
    this.authRq.password = this.f.password.value;
    this.authRq.productCode = "RT" ; //Hardcoded on 07 May 2024 ..
    this.authRq.customerType = "C" ;

   // this.store.clear() ;
    this.authService.loginUser(this.authRq)
      .pipe(first())
      .subscribe(
        data => {
      // After successful login, trigger the token refresh interval
      this.refreshTokenService.startTokenRefreshPolling();
          const role = this.store.getItem('USER_ROLE');
          this.loader = false;
          this.signIn = true;
          // otp verification
        
        if(role == roleIdDetails.CORPORATE_OWNER || role == roleIdDetails.CORPORATE_RUNNER || role == roleIdDetails.CORPORATE_DEALER){
         
          if (role && role === roleIdDetails.CORPORATE_OWNER ) {  // owner - 555
            if (data != null) {
              if(data.applicationStatus == "REJECTED"){
                this.alertService.clear();
                this.alertService.error("Your Application has been Rejected.<br>Please Contact Admin")
              }
              else if(data.customerStatus == "INACTIVE"){
                this.alertService.clear();
                this.alertService.error("Your Application has been Deactivated.<br>Please Contact Admin")
              }
              else if ("OTP_SUPPRESSED" == data.otpRefNo) {
                this.router.navigate(['/profile/corporate-dashboard']);
              } 
              else
               {
                 this.router.navigate(['/authentication/mfa']);
              }
            }
          } 
          if (role && role === roleIdDetails.CORPORATE_RUNNER) { // runner - 556
            if (data != null) {
              if(data.applicationStatus == "REJECTED"){
                this.alertService.clear();
                this.alertService.error("Your Application has been Rejected.<br>Please Contact Admin")
              }
              else if(data.customerStatus == "INACTIVE"){
                this.alertService.clear();
                this.alertService.error("Your Application has been Deactivated.<br>Please Contact Admin")
              }
              else if ("OTP_SUPPRESSED" == data.otpRefNo) {
                this.router.navigate(['/profile/corporate-dashboard']);
              } else {
                 this.router.navigate(['/authentication/mfa']);
              }
            }
          } 
          if (role && role === roleIdDetails.CORPORATE_DEALER) {  // dealer - 557
            if (data != null) {
              if(data.applicationStatus == "REJECTED"){
                this.alertService.clear();
                this.alertService.error("Your Application has been Rejected.<br>Please Contact Admin")
              }
              else if(data.customerStatus == "INACTIVE"){
                this.alertService.clear();
                this.alertService.error("Your Application has been Deactivated.<br>Please Contact Admin")
              }
              else if ("OTP_SUPPRESSED" == data.otpRefNo) {
                this.router.navigate(['/profile/corporate-dashboard']);
              } else {
                 this.router.navigate(['/authentication/mfa']);
              }
            }
          } 
       
       
      }
        else { // if role other than 111/555/556/557 , we show login failed .
          this.alertService.clear() ;
          this.alertService.warn("This is Business Login. Access your account through the designated login screen");
           }
        },
        error => {
          console.log(" Login failure") ;
          this.alertService.clear();
          if(error.error.errorMessage == "Bad credentials" || error.error.errorMessage == "User account is locked"){
            this.alertService.info("Invalid Username/Password or Account locked. Please retry or Contact Us.");
          }
          else{
            this.alertService.error("Login Failed. Try Again");
          }
        
          this.loader = false;
          this.signIn = true;
        });
      }
      else{
        this.loader = false;
          this.signIn = true;
        this.alertService.clear();
          this.alertService.info("For Better experience, use Dekstop device")
      }
  }

  //on click forgot password 
  forgotPassword(){
    this.store.setItem('FORGOT_PASSWORD_KEY','BUSINESS') ;
    this.router.navigate(['/authentication/forgot']) ;
  }

}
