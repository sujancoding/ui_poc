import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { AuthRq } from '../models/authreq.model';
import { AuthenticationService } from '../services/authentication.service';
import { first } from 'rxjs/operators';
import { roleIdDetails } from 'src/assets/userrole';
import { TokenRefreshService } from 'src/app/core/services/refresh-token.service';

@Component({
  selector: 'app-login-branchuser',
  templateUrl: './login-branchuser.component.html',
  styleUrls: ['./login-branchuser.component.scss']
})
export class LoginBranchuserComponent implements OnInit {
  public form: FormGroup = Object.create(null);
  private authRq: AuthRq = new AuthRq();
  hide = true;
  logo = 'assets/images/logo1.jpg'
  loader = false;
  signIn = true;
  getBusiness : string[] = ["Remittance", "Money Changer"] ;
  getCounterIdList : string[] = ["1","111"] // 1 -> Wholesale, 111 -> Retail
  selectedBusiness !: string ;
  showCounterIdField : boolean = false ;

  constructor(private fb: FormBuilder, private router: Router,
    private authService: AuthenticationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private store: InMemoryCache,
    private refreshTokenService : TokenRefreshService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required,Validators.email])],
      password: [null, Validators.compose([Validators.required])],
      business : [null, Validators.compose([Validators.required])] ,//-- MC code
      counterId : [null]
    });

  }
  get f() { return this.form.controls; }
  onSubmit(){
    this.loader = true;
    this.signIn = false;
    let business : string = this.form.controls['business'].value ; //-> MC Code
 ///   let business = "Remittance" -- for time being RT cide
    this.authRq.username = this.f.uname.value;
    this.authRq.password = this.f.password.value;
   // this.authRq.role='222';
    this.authRq.customerType = "S" //Hardcoded as "S" for backoffice login .
    if(business == "Remittance"){
      this.authRq.productCode = "RT"
    }
     else if(business == "Money Changer"){
       this.authRq.productCode = "MC"
     }
    
   // this.store.clear() ;
    let prodCode = this.authRq.productCode ? this.authRq.productCode : "" ;
   let counterId = "";
   //let paramsValue = "";
    if(prodCode == "MC"){ //if business is MC , check the route params and map the counterId in URI .
//       this.route.queryParamMap.subscribe((params:any) =>{
//         const routeParams : any = params.params; ;
//         const keysArray = Object.keys(routeParams);

//        if (keysArray.length === 1) {
//         paramsKey = keysArray[0];
//         paramsValue = routeParams[paramsKey];

// }     else {
//       console.log('More than one param in route URL or No Param found');
// }
//       })

        counterId = this.form.controls['counterId'].value ? this.form.controls['counterId'].value : "" ;
    }

    this.store.setItem('BUSINESS_TYPE',prodCode) ;
    this.authService.loginBranch(this.authRq,counterId) //--MC code
    //this.authService.loginBranch(this.authRq) -- for time being RT code
      .pipe(first())
      .subscribe(
        data => {
           // After successful login, trigger the token refresh interval
           this.refreshTokenService.startTokenRefreshPolling();
          const role = this.store.getItem('USER_ROLE');
          this.loader = false;
          this.signIn = true;

          this.store.setItem('MONEY_CHANGER_BUSINESS',business) ;
          
          if(role === roleIdDetails.CONSUMER || role === roleIdDetails.CORPORATE_OWNER || role === roleIdDetails.CORPORATE_RUNNER || role === roleIdDetails.CORPORATE_DEALER || role === roleIdDetails.AGENT){
            this.alertService.clear() ; //If other Backoffice tried to login .. throw valid error message .
            this.alertService.warn("This is Staff Login. Access your account through the designated login screen");
          }
          else{
            if(data.customerStatus == "ACTIVE" && data.mfaEnrollmentStatus == false){
              console.log("ACTIVE AND MFA NOT ENROLLED");
              this.router.navigate(['/authentication/authenticatorsetup'], { queryParams: { branch: 'true' } }); 
              // if(business == "Remittance"){
              //   this.router.navigate(['/dashboard/empdash']); //--> Remittance user dashboard
              // }
              // else if(business == "Money Changer"){
              //   this.router.navigate(['/moneychanger/dashboard']) ;  //--> Money changer user dashboard
              // }
            }
            else if (data.customerStatus == "ACTIVE" && data.mfaValidationStatus   == false){
              console.log("ACTIVE AND MFA NOT VALIDATED");
             this.router.navigate(['/authentication/authenticator'], { queryParams: { branch: 'true' } });
            // this.router.navigate(['/dashboard/empdash']);
            }
            
            else if(data.customerStatus == "INACTIVE"){
              this.alertService.clear();
              this.alertService.error("Your Application has been Deactivated.<br>Please Contact Admin")
            }
          }
        },
        error => {
          console.log("Print Login failed..") ;
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

  //on click forgot password 
  forgotPassword(){
    this.store.setItem('FORGOT_PASSWORD_KEY','BACKOFFICE') ;
    this.router.navigate(['/authentication/forgot']) ;
  }

  //on change business dropdown field 
  changeBusiness(business:string){
    
    this.form.patchValue({
      counterId : ""
    }) //on every business dropdown changes --> make counterID field empty...

    if(business == "Remittance"){
      this.showCounterIdField = false ;
      this.form.controls['counterId'].clearValidators();
      this.form.controls['counterId'].updateValueAndValidity();
    }
    else if(business == "Money Changer"){
      this.showCounterIdField = true ;
      this.form.controls['counterId'].setValidators([Validators.required]);
      this.form.controls['counterId'].updateValueAndValidity();
    }
  }
  }


