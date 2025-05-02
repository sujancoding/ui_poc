import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { AuthRq } from '../models/authreq.model';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { roleIdDetails } from 'src/assets/userrole';
import { TokenRefreshService } from 'src/app/core/services/refresh-token.service';

@Component({
  selector: 'app-agent-login',
  templateUrl: './agent-login.component.html',
  styleUrls: ['./agent-login.component.scss']
})
export class AgentLoginComponent implements OnInit {
  public form: FormGroup = Object.create(null);
  private authRq: AuthRq = new AuthRq();
  hide= true;
  loading = false;
  submitted = false;
  loader : Boolean = false;
  signIn : Boolean = true ;
  logo = 'assets/images/logo1.jpg';

  constructor(private fb: FormBuilder,private router: Router,private alertService: AlertService,private authService: AuthenticationService,
    private store: InMemoryCache,private refreshTokenService : TokenRefreshService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required,Validators.email])],
      password: [null, Validators.compose([Validators.required])],
    });
  }
  get f() { return this.form.controls; }

  onSubmit(){
    this.submitted = true;
    this.loader = true;
    this.signIn = false;
    this.authRq.username = this.f.uname.value;
    this.authRq.password = this.f.password.value;
    this.authRq.productCode = "RT" //Hardcoded on 07 May 2024 ..
    this.authRq.customerType = "A" //Hardcoded as 'A' for agent login ...
    //this.authRq.role='888';
   // this.store.clear() ;
    this.loading = true;
    this.authService.loginAgent(this.authRq)
      .pipe(first())
      .subscribe(
        data => {
           // After successful login, trigger the token refresh interval
           this.refreshTokenService.startTokenRefreshPolling();
          this.loader = false;
          this.signIn = true;
          const role = this.store.getItem('USER_ROLE');
          
          // otp verification
          if (role && role === roleIdDetails.AGENT) {

            // if(data.customerStatus == "ACTIVE"){
            //   this.router.navigate(['dashboard/agent']);
            // }

            if(data.customerStatus == "ACTIVE" && data.mfaEnrollmentStatus == false){
              console.log("ACTIVE AND MFA NOT ENROLLED");
              this.router.navigate(['/authentication/authenticatorsetup'], { queryParams: { agent: 'true' } });
            }else if (data.customerStatus == "ACTIVE" && data.mfaValidationStatus   == false){
              console.log("ACTIVE AND MFA NOT VALIDATED");
              this.router.navigate(['/authentication/authenticator'], { queryParams: { agent: 'true' } });
            }else if(data.customerStatus == "INACTIVE"){
              this.alertService.clear();
              this.alertService.error("Your Application has been Deactivated.<br>Please Contact Admin")
            }
          } 
          else{  //If other Agent tried to login .. throw valid error message .
            this.alertService.clear()
            this.alertService.warn("This is Agent Login. Access your account through the designated login screen");
          }
        },
        error => {
          console.log("Print Login failed..") ;
          this.loader = false;
          this.signIn = true;
          this.alertService.clear()
          if(error.error.errorMessage == "Bad credentials" || error.error.errorMessage == "User account is locked"){
            this.alertService.info("Invalid Username/Password or Account locked. Please retry or Contact Us.");
          }
          else{
            this.alertService.error("Login Failed. Try Again");
          }
          this.loading = false;
          this.submitted = false;
        });
  }  

  //on click forgot password 
  forgotPassword(){
    this.store.setItem('FORGOT_PASSWORD_KEY','AGENT') ;
    this.router.navigate(['/authentication/forgot']) ;
  }

}
