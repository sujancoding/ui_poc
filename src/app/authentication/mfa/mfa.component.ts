import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'ngx-custom-validators';
import { AlertService } from 'src/app/shared/services/alert.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { AuthenticationService } from '../services/authentication.service';
import { Config } from './mfa.config';
import { first } from 'rxjs/operators';
import { ConsumerApplicantOTPEmail, ConsumerApplicantOTPPhone, ConsumerOTPApplicant, ConsumerOTPRq, OTPRq } from '../models/otprq.model';
import { noWhitespaceValidator } from 'src/app/shared/models/phone.model';
import { roleIdDetails } from 'src/assets/userrole';
import { SessionTimerService } from 'src/app/shared/session-timeout/public.api';


@Component({
  selector: 'app-mfa',
  templateUrl: './mfa.component.html',
  styleUrls: ['./mfa.component.scss']
})
export class MfaComponent implements OnInit {
  showOtpComponent = true;
  otp!: string;
  smsCode!: string;
  fromRegister!: boolean;
  loader = false;
  mfaValidation = true;
  customerType !: string ;
  password !: string ;
  registeredEmail !: string ;
  registeredPhone !: string ;

  public otpForm: FormGroup = Object.create(null);

  private otpRq: OTPRq = new OTPRq;

  constructor(private fb: FormBuilder, private router: Router,
    private store: InMemoryCache,
    private authService: AuthenticationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private sessionTimer : SessionTimerService
  ) { }

  ngOnInit(): void {

    this.otpForm = this.fb.group({
      smsCode: [null, [Validators.compose([Validators.required,noWhitespaceValidator, Validators.pattern("^[0-9]+$"),Validators.minLength(6)])]],

    });


  }


  ngAfterContentInit() {
    // contentChild is set after the content has been initialized
    console.log("ngAfterContentInit ");

    setTimeout(() => {
      this.route.queryParams.subscribe(param => {
        if (param.registered !== undefined && param.registered === 'true') {
          this.fromRegister = true;
        }
      });
    }, 0)

  }

  cancelMfa(){
    //first call logout API and navigate to corresponding login screen
    this.authService.logoutService().subscribe((data:any)=>{
      this.alertService.clear() ;
      this.sessionTimer.stopTimer();
      console.log(data) ;
      let getCustomerType = this.store.getItem('CUSTOMER_TYPE') ? this.store.getItem('CUSTOMER_TYPE') : "" ; 
      if(getCustomerType == "I"){
      this.router.navigate(['/authentication/login']);
      }
      else if(getCustomerType == "C"){
        this.router.navigate(['/authentication/login-business']);
        }
    },
    error => {
      console.log(error) ;
      this.alertService.clear() ;
      this.alertService.error("Oops Something went wrong. Please try again !") ;
     }
  )
  }

  buildPayload():ConsumerOTPRq{
   return new ConsumerOTPRq({
    "token" : this.otp ,
    "password" : this.password,
    "applicant" : this.buildApplicant(),
    "productName" : "TT,MC",
    "controlFlowId" : "1111111",
    "applicationType" : this.customerType ? this.customerType : "" 
   })
  }

  buildApplicant(): ConsumerOTPApplicant{
     return new ConsumerOTPApplicant({
       "email" : this.buildApplicantEmail(),
       "phone" : this.buildApplicantPhone()
     })
    }
  
    buildApplicantEmail():ConsumerApplicantOTPEmail[]{
      let email : ConsumerApplicantOTPEmail[]=[] ;
      email.push(new ConsumerApplicantOTPEmail({
        "emailAddress" : this.registeredEmail ,
        "isPreferredEmail" : "Y"
      })) ;
      return email ;
    }
  
    buildApplicantPhone():ConsumerApplicantOTPPhone[]{
      let phone : ConsumerApplicantOTPPhone[]=[] ;
      phone.push(new ConsumerApplicantOTPPhone({
        "phoneNumber" :  this.registeredPhone ,
        "phoneType" : "M"
      })) ;
      return phone ;
    }

  onSubmit(): void {
    //Stored in customer registration screen and retriving here to map it in step-ip API .
    this.customerType = this.store.getItem('CUSTOMER_TYPE') ? this.store.getItem('CUSTOMER_TYPE') : "" ;
    this.password = this.store.getItem('REGISTER_PASSWORD') ? this.store.getItem('REGISTER_PASSWORD') : "" ;
    this.registeredEmail = this.store.getItem('REGISTER_EMAIL') ? this.store.getItem('REGISTER_EMAIL') : "" ;
    this.registeredPhone = this.store.getItem('REGISTER_PHONE') ? this.store.getItem('REGISTER_PHONE') : "" ;

     this.otp = this.otpForm.controls['smsCode'].value ;
     if (this.otp && this.otp.length === 6) {
      console.log(this.otp)
      this.loader = true;
      this.mfaValidation = false;
      this.otpRq.otpToken = this.otp;
      this.otpRq.otpRefNo = this.store.getItem("OTP_REFNO") ? this.store.getItem("OTP_REFNO") : "";

      if(this.customerType == "I" && this.fromRegister){  //Individual feeds otp and should be registration flow...
        this.authService.validateConsumerOtp(this.buildPayload()).subscribe(data =>{
          //SUCCESS CASE
          console.log(data) ;
          this.alertService.clear() ;
          this.loader = false;
          this.mfaValidation = true;
          this.store.setItem('CHANNEL_TYPE', 'MOBILE') ; //store this channel type for self onboading purpose , only used in corporate docs .
          if (data.result === "success" || data.result === "VALID") {
          this.router.navigate(['/authentication/register-successful']) ; //navigate to register successful component.
          }
        },
        error =>{ //error handling
          this.alertService.clear() ;
          this.alertService.error("You may entered incorrect code!");
          this.loader = false;
          this.mfaValidation = true;
        }
      )
      }

      else{ //login flow OTP and also Corporate registration flow OTP

      this.authService.validateOTP(this.otpRq)
        .pipe(first())
        .subscribe(
          data => {
            console.log(data.result);

            if (data.result === "success" || data.result === "VALID") {
              const role = this.store.getItem('USER_ROLE');
              this.loader = false;
              this.mfaValidation = true;
              console.log(role);
              if (this.fromRegister) { //Register --> OTP --> Go to confirmation dialog . 
                this.router.navigate(['/authentication/register-successful']) ;
               // this.router.navigate(['/authentication/login'], { queryParams: { registered: 'true' } });
              } else {
      
                if (role == roleIdDetails.CORPORATE_OWNER || role == roleIdDetails.CORPORATE_RUNNER || role == roleIdDetails.CORPORATE_DEALER) { //Corporate
                   //if its migrate customer doing first time login --> navigate to "change password" screen .
                   let firstTimeLogin : string = this.store.getItem('ISFIRSTTIMELOGIN') ? this.store.getItem('ISFIRSTTIMELOGIN'): "" ;
                   if(firstTimeLogin == "Y"){   //Take them to Change pwd screen ..
                     let id :string = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "";
                     this.router.navigate(['/authentication/resetpwd'],
                     { queryParams: { id: id , token : '' , customerType : 'C' } }
                     );
                   }
                   else if(firstTimeLogin == "N"){ //Take them to corporate dashboard ..
                    this.router.navigate(['/profile/corporate-dashboard']);
                   }
                } 
                else { //Individual
                  //if its migrate customer doing first time login --> navigate to "change password" screen .
                  let firstTimeLogin : string = this.store.getItem('ISFIRSTTIMELOGIN') ? this.store.getItem('ISFIRSTTIMELOGIN'): "" ;
                  if(firstTimeLogin == "Y"){   //Take them to Change pwd screen ..
                    let id : string = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "";
                    this.router.navigate(['/authentication/resetpwd'],
                    { queryParams: { id: id , token : '' , customerType : 'I' } }
                    );
                  }
                  else if(firstTimeLogin == "N"){ //Take them to Dashboard screen ..
                    this.router.navigate(['/dashboard/custdash']); 
                  }
                }
                
              } 
            } else {
              this.alertService.clear()
              this.alertService.error("You may entered incorrect code!");
              this.loader = false;
              this.mfaValidation = true;
              //this.ngOtpInput.setValue('');
            }
          },
          error => {
            this.alertService.clear()
            this.alertService.error("You may entered incorrect code!");
            this.loader = false;
            this.mfaValidation = true;
           // this.ngOtpInput.setValue('');

          });

        }  

    } 
    else {
      this.alertService.clear() ;
      this.alertService.error("Please enter correct code");

    }

  }
}
