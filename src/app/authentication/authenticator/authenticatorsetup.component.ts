import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { AuthenticationService } from '../services/authentication.service';
import { first } from 'rxjs/operators';
import { MFARq } from '../models/mfarq.model';
import { noWhitespaceValidator } from 'src/app/shared/models/phone.model';
import { roleIdDetails } from 'src/assets/userrole';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionTimerService } from 'src/app/shared/session-timeout/public.api';


@Component({
  selector: 'setup-mfa',
  templateUrl: './authenticatorsetup.component.html',
  styleUrls: ['./authenticatorsetup.component.scss']
})
export class AuthenticatorSetupComponent implements OnInit {
  showOtpComponent = true;
  mfa!: string;
  mfaCode!: string;
  fromBranch!: boolean;
  fromAgent!: boolean;

  loader = false;
  mfaValidation = true;
  qrCodeImage :any;


  public mfaForm: FormGroup = Object.create(null);

  private mfaRq: MFARq = new MFARq;

  constructor(private fb: FormBuilder, private router: Router,
    private store: InMemoryCache,
    private authService: AuthenticationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private sessionTimer : SessionTimerService
  ) { }

  ngOnInit(): void {

    this.mfaForm = this.fb.group({
      mfaCode: [null, [Validators.compose([Validators.required,noWhitespaceValidator, Validators.pattern("^[0-9]+$"),Validators.minLength(6)])]],
      
    });

    console.log(this.store.getItem('MFA_QR'))
    //this.qrCodeImage = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + this.store.getItem('MFA_QR'));
    //this.qrCodeImage = this.store.getItem('MFA_QR');

    //const image ='iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQAAAACFI5MzAAAB90lEQVR42u2YUYocMQxEDbqWQFc36FoCp6rcPUkW9k/6SNhm2enxa7All0vqWee7a/2Qf5fstWz7cttWcbKCAwMk8VduiZuKxEdqrJ9sy9yYNLEYroMDUwRLQJjb9MQc2cbZkU/FPUSUUeQSuEy5PROEgsg/r7+000eea7sCRl6/noUmsldgqCAN/V8r3oz2EqbRshbiK+0d1nEmCO6xhpASDw8WvgyQcvco5/bhHg/Uu4JmAhEiULhSCNCTYoBw20Jb5rQMYH+dr5Xg6EIUcAoEzHEa7gTRXimP2MBiwJJ9O6F3l+yBPgHo9KZ+UgwTsx+qHmox6mSCLCZRJksjhyH5COEdywQ3zhQzvGOAKML7nXKnvX4U0knoC8/p4swUfOQMuRUWZi4p2rtzvQSD1yFYCBGyvGKCqP3RdqXK+vlU2laSnPM5ushqUJkxQBgenMj4yVPGYG2ChI4suy4W2SLPAcI6Xhw4qVKIWN0GCKenFOM60pLuB0g+TT6DPcyl7LafPJ39vv0dj1i9nV0rofLYoLLU6gSr2e8nah+DD6gdRrjbY4AwnbA721fppfZhgNwO/wpxqbvL3wrpJGyA2QEtXihPnw6ln+RtgUJvSXTCKaK+WKVPrj5CbuutEsi+63ptP9EbmN4h2Dzk1kvLAPn5reY/I78ArCFLbFVio0QAAAAASUVORK5CYII=';
    const image = this.store.getItem('MFA_QR');
    this.qrCodeImage = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${image}`);


;  }


  ngAfterContentInit() {
    console.log("ngAfterContentInit ");
    setTimeout(() => {
      this.route.queryParams.subscribe(param => {
        if (param.branch !== undefined && param.branch === 'true') {
          this.fromBranch = true;
        }
        else if (param.agent !== undefined && param.agent === 'true') {
          this.fromAgent = true;
        }
      });
    }, 0)

  }

  cancelMfa(){
     //first call logout API and navigate to corresponding login screen
     this.authService.logoutService().subscribe((data:any)=>{
      console.log(data) ;
      this.alertService.clear() ;
      this.sessionTimer.stopTimer() ;
      if(this.fromBranch){
        this.router.navigate(['/authentication/login-branchuser'], { queryParams: { registered: 'false' } });
      }else if(this.fromAgent){ 
        this.router.navigate(['/authentication/login-agent'], { queryParams: { registered: 'false' } });
      }
     },
     error => {
      console.log(error) ;
      this.alertService.clear() ;
      this.alertService.error("Oops Something went wrong. Please try again !") ;
     }
    )
   
  }

  onSubmit(): void {

    let productCode = this.store.getItem('PRODUCT_CODE_BIZ') ? this.store.getItem('PRODUCT_CODE_BIZ') : ""; //get productcode value from login res
    this.mfa = this.mfaForm.controls['mfaCode'].value ;
    if (this.mfa && this.mfa.length === 6) {
     console.log(this.mfa)
     this.loader = true;
     this.mfaValidation = false;
     this.mfaRq.emailId = this.store.getItem("LOGGEDIN_ID");
     this.mfaRq.mfaCode = this.mfa;
     this.mfaRq.mfaEnrollment = "Y"
     console.log(this.mfaRq);
     
     this.authService.validateMFA(this.mfaRq)
       .pipe(first())
       .subscribe(
         data => {
           console.log(data.result);
           if (data.status === "SUCCESS") {
            const role = this.store.getItem('USER_ROLE');
             console.log(role);
             console.log("fromBranch = ",this.fromBranch);
             console.log("fromAgent = ",this.fromAgent);

             if(role === roleIdDetails.CONSUMER || role === roleIdDetails.CORPORATE_OWNER || role === roleIdDetails.CORPORATE_RUNNER || role === roleIdDetails.CORPORATE_DEALER ){
               this.alertService.clear() ;
               this.alertService.error("Request Failed. Try Again");
             }
             if (role && this.fromBranch) {
               if(productCode == "RT"){
                this.router.navigate(['/dashboard/empdash']); //--> Remittance user dashboard
              }
              else if(productCode == "MC"){
                this.router.navigate(['/moneychanger/dashboard']) ;  //--> Money changer user dashboard
              }
              //this.router.navigate(['/dashboard/empdash']);
            } else if (role && role === roleIdDetails.AGENT && this.fromAgent) {
                this.router.navigate(['dashboard/agent']);
            } else{
              this.alertService.clear()
             this.alertService.error("You may entered incorrect code!");
             this.loader = false;
             this.mfaValidation = true;
            }  
           } else {
             this.alertService.clear()
             this.alertService.error("You may entered incorrect code!");
             this.loader = false;
             this.mfaValidation = true;
           }
         },
         error => {
           this.alertService.clear()
           this.alertService.error("You may entered incorrect code!");
           this.loader = false;
           this.mfaValidation = true;
         });
   } else {
     this.alertService.clear()
     this.alertService.error("Please enter correct code");

   }

 }
  
}
