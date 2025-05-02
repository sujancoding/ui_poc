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
import { ForceLogoutComponent } from 'src/app/shared/modals/force-logout/force-logout.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-mfa',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.scss']
})
export class AuthenticatorComponent implements OnInit {
  showOtpComponent = true;
  mfa!: string;
  mfaCode!: string;
  fromBranch!: boolean;
  fromAgent!: boolean;

  loader = false;
  mfaValidation = true;

  public mfaForm: FormGroup = Object.create(null);

  private mfaRq: MFARq = new MFARq;

  constructor(private fb: FormBuilder, private router: Router,
    private store: InMemoryCache,
    private authService: AuthenticationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private dialog : MatDialog
  ) { }

  ngOnInit(): void {

    this.mfaForm = this.fb.group({
      mfaCode: [null, [Validators.compose([Validators.required,noWhitespaceValidator, Validators.pattern("^[0-9]+$"),Validators.minLength(6)])]],

    });


  }


  ngAfterContentInit() {
    console.log("ngAfterContentInit ");
    setTimeout(() => {
      this.route.queryParams.subscribe(param => {
        if (param.branch !== undefined && param.branch === 'true') {
          this.fromBranch = true;
        } else if (param.agent !== undefined && param.agent === 'true') {
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
      this.authService.logout() ;
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
      this.mfaRq.mfaCode = this.mfa;
      this.mfaRq.emailId = this.store.getItem("LOGGEDIN_ID");
      this.mfaRq.mfaEnrollment = "N"
      this.mfaRq.mfaRefNo = this.store.getItem("MFA_REFNO");
      console.log(this.mfaRq);
      
      this.authService.validateMFA(this.mfaRq)
        .pipe(first())
        .subscribe(
          data => {
            console.log(data.status);
            if (data.status === "SUCCESS") {
              const role = this.store.getItem('USER_ROLE');
              console.log(role);
              console.log(this.fromBranch);

              if(role === roleIdDetails.CONSUMER || role === roleIdDetails.CORPORATE_OWNER || role === roleIdDetails.CORPORATE_RUNNER || role === roleIdDetails.CORPORATE_DEALER ){
                this.alertService.clear() ;
                this.alertService.error("Login Failed. Try Again");
              }
              if (role && this.fromBranch) {
                if(productCode == "RT"){
                  this.router.navigate(['/dashboard/empdash']); //--> Remittance user dashboard
                }
                else if(productCode == "MC"){
                  this.router.navigate(['/moneychanger/dashboard']) ;  //--> Money changer user dashboard
                }
              } 
              else if (role && role === roleIdDetails.AGENT && this.fromAgent) {
                  this.router.navigate(['dashboard/agent']);
              } 
              else{
                this.alertService.clear()
               this.alertService.error("You may entered incorrect code!");
               this.loader = false;
               this.mfaValidation = true;
              }  
            } 
            else {
              this.alertService.clear()
              this.alertService.error("You may entered incorrect code!");
              this.loader = false;
              this.mfaValidation = true;
            }
          },
          error => {
            this.alertService.clear() ;
            this.loader = false;
            this.mfaValidation = true;
            if(error.error.errorMessage == "User account is locked"){
              this.alertService.error("Too many MFA attempts. Logout and retry !");
              this.dialog.open(ForceLogoutComponent,{
                width : '500px', 
                height : '238px',
                disableClose : true
              })
            }
            else{
              this.alertService.error("You may entered incorrect code!");
            }
          });
    } 
    else {
      this.alertService.clear()
      this.alertService.error("Please enter correct code");

    }

  }
}
