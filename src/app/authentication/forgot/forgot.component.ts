import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { AuthenticationService } from '../services/authentication.service';
import { FWPRq } from '../models/fwprq.model';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/services/alert.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent implements OnInit {
  displayView = 'initiate';
  logo = 'assets/images/logo1.jpg'

  private fwpRq: FWPRq = new FWPRq;
  customerType : string = "" ;


  public form: FormGroup = Object.create(null);
  constructor(private fb: FormBuilder, private router: Router,
    private authService: AuthenticationService,
    private alertService: AlertService, private store : InMemoryCache,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {

    let forgotPwdKey = this.store.getItem('FORGOT_PASSWORD_KEY') ?  this.store.getItem('FORGOT_PASSWORD_KEY') : "" ;

    switch(forgotPwdKey) {
      case "PERSONAL":
        this.customerType = "I";
        break;
      case "BACKOFFICE":
        this.customerType = "S";
        break;
      case "AGENT":
        this.customerType = "A";
        break;
      case "BUSINESS":
        this.customerType = "C";
        break;
      default:
        this.customerType = ""; // handle cases not matching the above
        break;
    }

    this.fwpRq.email = this.f.email.value;
    this.fwpRq.customerType = this.customerType ? this.customerType : "" ;
    console.log(this.fwpRq.email);

    this.authService.forgotPwdVerify(this.fwpRq)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data.status);
          if ("success" === data.status) {
            this.displayView = "complete";
          } else if ("EMAIL_NOT_FOUND" === data.status || "failed" === data.status) {
            this.alertService.clear()
            this.alertService.error("Invalid Email. Try Again");
          } else {
            this.alertService.clear()
            this.alertService.error("Invalid Email. Try Again");
          }
        },
        error => {
          console.log(" api failed  ");
          this.alertService.clear()
          this.alertService.error("Failed.Try Again");
        });
  }

  goToLogin(){
   let user : string = this.store.getItem('FORGOT_PASSWORD_KEY') ?  this.store.getItem('FORGOT_PASSWORD_KEY') : "" ;
   if(user == "PERSONAL"){ //Individual
    this.router.navigate(['/authentication/login']) ;
   }
   else if(user == "BACKOFFICE"){
    this.router.navigate(['/authentication/login-branchuser']) ;
   }
   else if(user == "AGENT"){
    this.router.navigate(['/authentication/login-agent']) ;
   }
   else if(user == "BUSINESS"){ //corporate
    this.router.navigate(['/authentication/login-business']) ;
   }
   else{
    this.router.navigate(['/authentication/login']) ;
   }
  }
}

