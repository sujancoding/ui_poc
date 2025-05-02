import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'ngx-custom-validators';
import { AlertService } from 'src/app/shared/services/alert.service';
import { CHGPWDRq } from '../models/chgpwdrq.model';
import { AuthenticationService } from '../services/authentication.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

const passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-_!@$]).{8,}$"; //atleast one UPPERCASE , number , special character .
  //like #, %, ^, &, *, ., ,, and ?, which are often used in SQL injection attacks. 
  //The remaining characters -, _, !, @, and $ are generally safer to use in SQL queries.

const password = new FormControl('', Validators.compose([Validators.required , Validators.pattern(passwordPattern) , Validators.maxLength(16),Validators.minLength(8)] ));
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));



@Component({
  selector: 'app-resetpwd',
  templateUrl: './resetpwd.component.html',
  styleUrls: ['./resetpwd.component.scss']
})
export class ResetpwdComponent implements OnInit {

  displayView = 'initiate';

  logo = 'assets/images/logo1.jpg'

  userid!: string;
  token!: string;
  email!: string;

  public changePasswordForm: FormGroup = Object.create(null);
  public chngPwdRq: CHGPWDRq = Object.create(null);

  userMessage : string = "" ;
  buttonMessage : string = "" ;
  customerType : string = "" ;
  

  constructor(private route: ActivatedRoute, private fb: FormBuilder,
    private router: Router, private authService: AuthenticationService,
    private alertService: AlertService, private store: InMemoryCache, ) { }



  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      password: password,
      confirmPassword: confirmPassword
    });

    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.userid = params.id;
        this.token = params.token;
        this.customerType = params.customerType ? params.customerType : "" ;
        console.log(this.userid); // userid
        console.log(this.token); // userid
      }
      );


  }

  // convenience getter for easy access to form fields
  get f() { return this.changePasswordForm.controls; }

  onSubmit(): void {

    this.store.setItem('CHANNEL_ID','MOBILE');
    this.store.setItem('USER_ID','PWD_CHANGE');
    this.store.setItem('USERNAME','PWD_CHANGE');

    this.chngPwdRq.password = this.f.password.value;
    this.chngPwdRq.id = this.userid;
    this.chngPwdRq.token = this.token;
    let isChangePwd : boolean = false ;
    if(this.token == ""){ // If token is empty string , this change password is navigated thru login screen .
      isChangePwd = true ;
      this.userMessage = "";
      this.buttonMessage = "Go to Dashboard" ;
    }
    else if(this.token != ""){  // If token is not empty string , this change password is navigated thru gmail .
      isChangePwd = false ;
      this.userMessage = "Please use new password to login" ;
      this.buttonMessage = "Please Login" ;
    }
    this.chngPwdRq.isForcePwdChange = isChangePwd ;

    this.authService.changePwd(this.chngPwdRq)
      .subscribe(
        data => {
          if ("success" === data.status) {
            this.displayView = "complete"
          } else if("TOKEN_EXPIRED" === data.status){
            this.alertService.clear()
            this.alertService.error("Expired.Try Forgot Password again");
          }
          else if("failed" == data.status){
            this.alertService.clear()
            this.alertService.error("Password change is failed. Please Try again");
          }
          else {
            this.alertService.clear()
            this.alertService.error("Expired.Try Forgot Password again");
          }
        },
        error => {
          console.log(" api failed  ", error);
          this.alertService.clear()
          this.alertService.error("Failed.Try Forgot Password");
        });
  }


  navigateScreen(){
    if(this.token == ""){   //Go to customer dashboard ..
     if(this.customerType == "I"){
      this.router.navigate(['/dashboard/custdash']); 
     }
     else if(this.customerType == "C"){
      this.router.navigate(['/profile/corporate-dashboard']);
     }
     else{
      this.router.navigate(['/authentication/login']) ;
     }
    }
    else if(this.token != ""){  //Go to customer login ..
      if(this.customerType == "I"){ //Individual
        this.router.navigate(['/authentication/login']) ;
      }
      else if(this.customerType == "C"){ //Corporate
        this.router.navigate(['/authentication/login-business']);
       }
       else if(this.customerType == "S"){ //Backoffice
        this.router.navigate(['/authentication/login-branchuser']) ;
       }
       else if(this.customerType == "A"){ //Agent
        this.router.navigate(['/authentication/login-agent']) ;
       }
       else{
        this.router.navigate(['/authentication/login']) ;
       }
    }
  }

  navigateToLogin(){
    if(this.customerType == "I"){ //Individual
      this.router.navigate(['/authentication/login']) ;
    }
    else if(this.customerType == "C"){ //Corporate
      this.router.navigate(['/authentication/login-business']);
     }
     else if(this.customerType == "S"){ //Backoffice
      this.router.navigate(['/authentication/login-branchuser']) ;
     }
     else if(this.customerType == "A"){ //Agent
      this.router.navigate(['/authentication/login-agent']) ;
     }
     else{
      this.router.navigate(['/authentication/login']) ;
     }
  }

}
