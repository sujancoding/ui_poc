import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { UserService } from '../services/user.service';
import { ConsumerApplicant, ConsumerApplicantEmail, ConsumerApplicantPhone, ConsumerRegisterInitiateRq, RegisterUserRq } from '../models/registerrq.model';
import { Applicant } from 'src/app/shared/models/applicant.model';
import { Name } from 'src/app/shared/models/name.model';
import { Email } from 'src/app/shared/models/email.model';
import { CorporateEmail, CorporatePhone } from '../models/corporateregister.model';
import { Phone } from 'src/app/shared/models/phone.model';
import { AlertService } from '../../shared/services/alert.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { Associate, Corporate, RegisterCorporateRq } from '../models/corporateregister.model';
import { noWhitespaceValidator } from 'src/app/shared/models/phone.model';
import countryCodeArray from 'src/assets/phonecountrycode.json' ;
import { MatDialog } from '@angular/material/dialog';
import { AgreementDialogComponent } from '../modals/agreement-dialog/agreement-dialog.component';
import { LoginCustomerOptionsDialogComponent } from '../modals/login-customer-options-dialog/login-customer-options-dialog.component';
const password = new FormControl('', Validators.required);
//const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup = Object.create(null);
  public registerRq: RegisterUserRq = Object.create(null);
  applicant: Applicant = Object.create(null);
  selectedCustomerType !: string;
  showCorporateFields : Boolean = false;
  submitted = false;
  loading = false;
  hide = true;
  customerType : string[] = ['Individual','Corporate'];
  organisationType : string[] = ['OWNER','RUNNER','DEALER'];
  logo = 'assets/images/logo1.jpg'
  logoShow : Boolean = false;
  invalidPassword :boolean = false;
  invalidPattern : boolean = false ;
  signUpButton : Boolean = true ;
  loader : Boolean = false ;
 
  passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-_!@$]).{8,}$"; //atleast one UPPERCASE , number , special character .
  //like #, %, ^, &, *, ., ,, and ?, which are often used in SQL injection attacks. 
  //The remaining characters -, _, !, @, and $ are generally safer to use in SQL queries.
  hideMatHint : boolean = true;
  phoneNumberCodes = [{
    "country": "Singapore",
    "code": "+65",
    "maxLength": 8,
    "FLAG": "flag-icon flag-icon-sg"
  }]; ;
  phoneNumberMaxLength : number = 8 ;
  countryCode !: string ;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService,
    private alertService: AlertService, private store: InMemoryCache,private ref: ChangeDetectorRef,
  private dialog : MatDialog) { }
    
  ngOnInit(): void {  
    //OnLoad animated APT Logo  
    // setTimeout(() => {
    //   this.logoShow = false
    // }, 2000);

    //form builder
    this.registerForm = this.fb.group({
      phoneNumber: [null, [Validators.compose([Validators.required,noWhitespaceValidator,this.phoneNumberValidator,Validators.pattern("[0-9 ]*$")])]],
      email: [null, Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+(?<!\\.)\\.[a-zA-Z]{2,}$"),Validators.maxLength(128)])],
      password:[null,[Validators.compose([Validators.required,Validators.maxLength(16),Validators.minLength(8),Validators.pattern(this.passwordPattern)])]],
      //  confirmPassword: confirmPassword,
      orgId : [null,[Validators.compose([Validators.required,Validators.pattern("[A-Za-z !@#%^&*$(),.\-]*$"),Validators.maxLength(15),this.whitespaceValidator,this.removeSpaces])]],
      orgType : [null],
      phoneCountryCode :[null, Validators.compose([Validators.required])],
      applicantType: new FormControl(''),
      termsAgreement: new FormControl(true, [Validators.requiredTrue]), 
    });

    //onload --> patch SG country code 
    this.registerForm.patchValue({
      "phoneCountryCode" :  "flag-icon flag-icon-sg",
    });
    this.countryCode = "+65" ;
  
    
    this.selectedCustomerType = 'Individual';

    if(this.selectedCustomerType == 'Individual'){
      this.registerForm.controls['orgId'].clearValidators();
      this.registerForm.controls['orgType'].clearValidators()
      this.registerForm.controls['orgId'].updateValueAndValidity();
      this.registerForm.controls['orgType'].updateValueAndValidity();
      // this.phoneNumberCodes = [ {
      //   "country": "Singapore",
      //   "code": "+65",
      //   "maxLength": 8,
      //   "FLAG": "flag-icon flag-icon-sg"
      // }];
    }
  }
  onSelectPhoneCode(flag:string){
    var array :any[] = countryCodeArray.filter(v => v.FLAG == flag) ;
   if(array.length == 1){
    this.countryCode = array[0].code ;
   }
  }
  removeSpaces(control: AbstractControl) {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
    }
    return null;
  }
  
   whitespaceValidator(control: AbstractControl) {
        const value = control.value;
        const pattern = /^(?![ !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]).*/;
      
        if (value && !pattern.test(value)) {
          // if the value consists of whitespace or special characters at beginning of string , return an error object
          return { "isSpecialCharacter": true };
        }
        // otherwise, return null (no error)
        return null;
        
      }
  phoneNumberValidator(control: AbstractControl) {
    const value = control.value;
  
    if (value && value.match("^[0]+")) {
      // if the value consists of zero at beginning of string , return an error object
      return { "isStartzero": true };
    }
    if (value && !value.match("^[89]+")) {
      // if the value not start with 8 or 9 at beginning of string , return an error object
      return { "isInvalid": true };
    }

    // otherwise, return null (no error)
    return null;
    
  }
 
// function => if the value consists only of zeros in field
allZerosValidator(control: FormControl) {
  const value = control.value;

  if (value && value.match(/^0+$/)) {
    // if the value consists only of zeros, return an error object
    return { "allZeros": true };
  }

  // otherwise, return null (no error)
  return null;
}
ngAfterContentChecked() {
  this.ref.detectChanges();
}

  onBusinessSelection(event: any) {

  }
  //function called after radio button is clicked -> are you indivual or corporate
  selectCustomerType(appType:string){
    if(appType == 'Corporate'){
      this.alertService.clear();
      this.phoneNumberMaxLength = 8 ;
      this.selectedCustomerType = "Corporate";
     this.showCorporateFields = true;
    //  this.phoneNumberCodes = countryCodeArray ;
     this.registerForm.controls['orgId'].setValidators(Validators.compose([Validators.required,Validators.pattern("[A-Za-z !@#%^&*$(),.\-]*$"),this.whitespaceValidator,this.removeSpaces,Validators.maxLength(15)]));                                                                                           
     this.registerForm.controls['orgType'].setValidators([Validators.required]);
     this.registerForm.controls['orgId'].updateValueAndValidity();
      this.registerForm.controls['orgType'].updateValueAndValidity()
    }
     if(appType == 'Individual'){
      this.alertService.clear();
      this.phoneNumberMaxLength = 8 ;
      this.selectedCustomerType = "Individual";
      this.showCorporateFields = false;
      // this.phoneNumberCodes = [ {
      //   "country": "Singapore",
      //   "code": "+65",
      //   "maxLength": 8,
      //   "FLAG": "flag-icon flag-icon-sg"
      // }];
      //clearing validations for corporate fields if customer selected indiviual radio button
      this.registerForm.controls['orgId'].setErrors(null);
      this.registerForm.controls['orgType'].setErrors(null);
     }
  }


  private createRegisterRq(registerForm: FormGroup): RegisterUserRq {
    let countryFlag = this.registerForm.controls['phoneCountryCode'].value ? this.registerForm.controls['phoneCountryCode'].value : "" ;
    let customerType = this.store.getItem('CUSTOMER_TYPE') ? this.store.getItem('CUSTOMER_TYPE') : "" ;
    let retrieveCountryArray : any[] = this.phoneNumberCodes.filter(v => v.FLAG == countryFlag) ;
    let value = retrieveCountryArray[0].code ? retrieveCountryArray[0].code : "" ;
    let countryCode = value.replace('+', ''); // Removing the '+' character
    console.log("country code value =", countryCode); 
    this.applicant = new Applicant(new Name('', '', ''), [new Email(registerForm.value.email, 'Y')], [new Phone('M', registerForm.value.phoneNumber, countryCode)])
    var appType;
    if (this.registerForm.value.applicantType) {
      appType = 'C'
    } else {
      appType = 'I'
    }

    this.registerRq = new RegisterUserRq(
      appType,
      "TT,MC",
      this.applicant,
      this.registerForm.value.password,
      this.registerRq.otpRefNo = '555',
      customerType 
    );
    console.log(JSON.stringify(this.registerRq))
    return this.registerRq;
  }

  private registerInitiateRq(): ConsumerRegisterInitiateRq{
    return new ConsumerRegisterInitiateRq({
      "applicant" : this.buildApplicant()
    })
  }

  buildApplicant(): ConsumerApplicant{
   return new ConsumerApplicant({
     "email" : this.buildApplicantEmail(),
     "phone" : this.buildApplicantPhone()
   })
  }

  buildApplicantEmail():ConsumerApplicantEmail[]{
    let email : ConsumerApplicantEmail[]=[] ;
    email.push(new ConsumerApplicantEmail({
      "emailAddress" : this.registerForm.controls['email'].value ? this.registerForm.controls['email'].value : "" 
    })) ;
    return email ;
  }

  buildApplicantPhone():ConsumerApplicantPhone[]{
    let phone : ConsumerApplicantPhone[]=[] ;
    phone.push(new ConsumerApplicantPhone({
      "phoneNumber" : this.registerForm.controls['phoneNumber'].value ? this.registerForm.controls['phoneNumber'].value : "" 
    })) ;
    return phone ;
  }

  onSubmit(): void {
    this.signUpButton = false;
    this.loader = true ;
    let password : any = this.registerForm.controls['password'].value ;
    this.registerForm.controls['password'].updateValueAndValidity(); 
    this.store.setItem('REGISTER_PASSWORD',password) ;
    
    //onSubmit -> Individual customers
    if(this.selectedCustomerType == "Individual"){
      this.store.setItem('CUSTOMER_TYPE', 'I') ;
    this.submitted = true;
    //this.router.navigate(['/authentication/mfa']);
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.store.setItem('USERID',this.registerForm.controls['email'].value);
    this.store.setItem('CHANNEL_ID','MOBILE');
    //  the string matches with the Regex
    
    if (( password.length >= 8 && password.length <= 16)) {
        console.log("password pattern is correct" );
  
    this.userService.registerIndividualInitiate(this.registerInitiateRq())
      .subscribe(
        (data: any) => {
          this.signUpButton = true;
          this.loader = false ;
          let email = this.registerForm.controls['email'].value ? this.registerForm.controls['email'].value : "" ;
          let phoneNumber = this.registerForm.controls['phoneNumber'].value ? this.registerForm.controls['phoneNumber'].value : ""
          this.store.setItem('REGISTER_EMAIL', email) ;
          this.store.setItem('REGISTER_PHONE', phoneNumber) ;
          //I have commented the below following code because BE will provide below elements in stepup API .
          // this.store.setItem('USER_ROLE', data.role);
          // let appSteps = JSON.stringify(data.applicationSteps);
          // this.store.setItem('APPLICATION_STEPS', appSteps);
          // this.store.setItem('APPLICATIONSTATUS', "NEW");
          // this.store.setItem('APPLICATION_ID', data.applicationId);
          // this.store.setItem('USER_ID',data.userId);
          // this.store.setItem('USERNAME',data.loggedInId);
          // this.store.setItem('LOGGEDIN_ID',data.loggedInId);
          // this.store.setItem('CHANNEL_TYPE', 'MOBILE') ; //store this channel type for self onboading purpose , only used in corporate docs .
          // this.store.setItem('OTP_REFNO', data.otpRefNo);      
          // this.store.setItem('CUSTOMER_ID',data.applicantId);

          if (data.phoneNumber) {
            this.router.navigate(['/authentication/mfa'], { queryParams: { registered: 'true' } });
          }
        },
        (error: any) => {
          this.signUpButton = true;
          this.loader = false ;
          this.alertService.clear();
          if(error == "UserPreCheckApplicationProxyEMAILID already exists"){
            this.alertService.error('Email ID or Phone Number already exists,if you preferred to use same Email Id or Phone Number please contact Admin.');
          }
          else if(error == "UserPreCheckApplicationProxyPhoneNumber already exists"){
            this.alertService.error('Email ID or Phone Number already exists,if you preferred to use same Email Id or Phone Number please contact Admin.');
          }
          else{
            this.alertService.error('Registration failed! Try Again');
          }
          console.log(error);
        });
      }
    
    else  {
      this.hideMatHint = false
      this.signUpButton = true;
      this.loader = false ;
      console.log("password pattern is incorrect");
       this.registerForm.controls['password'].setValidators([Validators.pattern(this.passwordPattern),Validators.required,Validators.maxLength(16)]);
       this.registerForm.controls['password'].updateValueAndValidity();
     }

    }
      //onSubmit -> corporate customers
      else if(this.selectedCustomerType == "Corporate"){
        //time being we have down the corporate register ...
        this.alertService.clear();
        this.alertService.error("This feature is down for sometime. <br> Please reach admin for corporate registration !") ;
        this.signUpButton = true;
        this.loader = false ;
    //     this.submitted = true;
    //     this.store.setItem('CUSTOMER_TYPE', 'C') ;
    //     if (this.registerForm.invalid) {
    //       return;
    //     }
    //     this.loading = true;
    //     this.store.setItem('USERID',this.registerForm.controls['email'].value);
    //     this.store.setItem('CHANNEL_ID','MOBILE');
    //     if (( password.length >= 8 && password.length <= 16)) {
    //     this.userService.registerCorporate(this.buildCorporateRegister())
    //       .subscribe(
    //         (data: any) => {
    //           this.signUpButton = true;
    //           this.loader = false ;
    //       this.store.setItem('USER_ROLE', data.role);
    //       let appSteps = JSON.stringify(data.applicationSteps);
    //       this.store.setItem('APPLICATION_STEPS', appSteps);
    //       this.store.setItem('APPLICATIONSTATUS', "NEW");
    //       this.store.setItem('APPLICATION_ID', data.applicationId);
    //       this.store.setItem('USER_ID',data.userId);
    //       this.store.setItem('USERNAME',data.loggedInId);
    //       this.store.setItem('LOGGEDIN_ID',data.loggedInId);
    //       this.store.setItem('CHANNEL_TYPE', 'MOBILE') ; //store this channel type for self onboading purpose , only used in corporate docs .
    //       this.store.setItem('OTP_REFNO', data.otpRefNo);
    //       this.store.setItem('CUSTOMER_ID',data.corporateId);

    //           if (!!data.otpRefNo) {
    //             this.router.navigate(['/authentication/mfa'], { queryParams: { registered: 'true' } });
    //           }
    //         },
    //         (error: any) => {
    //           this.signUpButton = true;
    //           this.loader = false ;
    //           this.alertService.clear();
             
    //           if(error == "CorporateApplicationAddProxyEMAILID already exists"){
    //             this.alertService.error('Email ID or Phone Number already exists,if you preferred to use same Email Id or Phone Number please contact Admin.');
    //           }
    //          else if(error == "CorporateApplicationAddProxyPhoneNumber already exists"){
    //             this.alertService.error('Email ID or Phone Number already exists,if you preferred to use same Email Id or Phone Number please contact Admin.');
    //           }
    //           else {
    //             this.alertService.error('Registration failed! Try Again');
    //           }
    //           console.log(error);
    //         });
    //   } 
    //   else{
    //     this.signUpButton = true;
    //     this.hideMatHint = false ;
    //     this.loader = false ;
    //     console.log("password pattern is incorrect");
    //     this.registerForm.controls['password'].setValidators([Validators.pattern(this.passwordPattern),Validators.required,Validators.maxLength(16)]);
    //     this.registerForm.controls['password'].updateValueAndValidity(); 
    //   }
     }  
  }
  buildCorporateRegister():RegisterCorporateRq{
 let customerType = this.store.getItem('CUSTOMER_TYPE') ? this.store.getItem('CUSTOMER_TYPE') : "" ;
  return new RegisterCorporateRq({
    "password" : this.registerForm.controls['password'].value,
    "corporate" : this.buildCorporate(),
    "productName" : "TT,MC",
    "controlFlowId" : "1111111",
    "customerType" : customerType
  })
  }
  buildCorporate():Corporate{
   return new Corporate({
    "orgId" : this.registerForm.controls['orgId'].value,
    "associate" : this.buildAssociate()
   })
  }
  buildAssociate():Associate{
   return new Associate({
    "jobTitle" :  this.registerForm.controls['orgType'].value,
    "email": this.buildEmail(),
    "phone" : this.buildPhone()
   })
  }
  buildEmail():CorporateEmail{
   return new CorporateEmail({
     "emailAddress" : this.registerForm.controls['email'].value
   })
  }
  buildPhone():CorporatePhone{
    let countryFlag = this.registerForm.controls['phoneCountryCode'].value ? this.registerForm.controls['phoneCountryCode'].value : "" ;
    let retrieveCountryArray : any[] = this.phoneNumberCodes.filter(v => v.FLAG == countryFlag) ;
    let value = retrieveCountryArray[0].code ? retrieveCountryArray[0].code : "" ;
    let countryCode = value.replace('+', ''); // Removing the '+' character
    console.log("country code value =", countryCode); 
    return new CorporatePhone({
      "phoneNumber" : this.registerForm.controls['phoneNumber'].value,
      "phoneCountryCode" : countryCode 
    })
  }
  onClick() {
    this.router.navigate(['/authentication/mfa'])
  }

  //Terms and condition modal dialog ..
  openAgreementModal(){
   this.dialog.open(AgreementDialogComponent,{
    autoFocus: false,
    maxHeight: '90vh' //you can adjust the value as per your view
   })
  }
 

  openLoginOptionDialog(){
    this.dialog.open(LoginCustomerOptionsDialogComponent,{
      width : '335px',
      height : '165px',
      panelClass: 'custom-modalbox',
    })
  }


}
