import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CustomValidators } from 'ngx-custom-validators';
import { Associate, Corporate, CorporateEmail, CorporatePhone, RegisterCorporateRq } from 'src/app/authentication/models/corporateregister.model';
import { UserService } from 'src/app/authentication/services/user.service';
import { noWhitespaceValidator } from 'src/app/shared/models/phone.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import countryCodeArray from 'src/assets/phonecountrycode.json' ;
@Component({
  selector: 'app-corporate-registration',
  templateUrl: './corporate-registration.component.html',
  styleUrls: ['./corporate-registration.component.scss']
})
export class CorporateRegistrationComponent implements OnInit {

  @Output() corpRegistrationStatusChanged = new EventEmitter<any>();
  registerForm : FormGroup = Object.create(null) ;
  hide = true;
  hideMatHint : boolean = true;
  formStatus !: string;
  organisationType : string[] = ['OWNER','RUNNER','DEALER'];
  @Input() corpStepper!: MatStepper; // Receive MatStepper reference from parent component
  phoneNumberCodes = countryCodeArray ;
  countryCode !: string ;

  constructor(private fb : FormBuilder, private userService: UserService,private alertService : AlertService,
    private store : InMemoryCache) { }

  ngOnInit(): void {
    console.log("Corp Registartion loaded") ;
    this.registerForm = this.fb.group({
      email: [null, Validators.compose([Validators.required, CustomValidators.email,Validators.maxLength(128)])],
      phoneNumber: [null, [Validators.compose([Validators.required,noWhitespaceValidator,this.phoneNumberValidator,Validators.pattern("[0-9 ]*$"),Validators.maxLength(15)])]],
      password: [null, Validators.compose([Validators.minLength(8), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).{8,}$"), Validators.required, Validators.maxLength(16)])],
      orgId : [null,[Validators.compose([Validators.required,Validators.pattern("[A-Za-z !@#%^&*$(),.\-]*$"),Validators.maxLength(15),this.whitespaceValidator,this.removeSpaces])]],
      orgType : [null, Validators.compose([Validators.required])],
      phoneCountryCode :  [null, Validators.compose([Validators.required])],
    })

     //onload --> patch SG country code 
     this.registerForm.patchValue({
      "phoneCountryCode" :  "flag-icon flag-icon-sg",
    });
    this.countryCode = "+65" ;

  }

  phoneNumberValidator(control: AbstractControl) {
    const value = control.value;
  
    if (value && value.match("^[0]+")) {
      // if the value consists of zero at beginning of string , return an error object
      return { "isStartzero": true };
    }
    // otherwise, return null (no error)
    return null;
    
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



  onSubmit(){
  
    this.userService.registerCorporate(this.buildCorporateRegister()).subscribe((datas:any)=>{
      this.store.setItem('MC_CORP_APPLICATIONID', datas.applicationId)  ;
      this.store.setItem('MC_CORP_APPLICANTID', datas.corporateId)  ;
      this.formStatus = "Registration Form Submitted Sucessfully"
      this.corpRegistrationStatusChanged.emit('Submitted');
      this.corpStepper.next() ;
    }, 
    (error: any) => {
      this.alertService.clear();
     
      if(error == "CorporateApplicationAddProxyEMAILID already exists"){
        this.alertService.error('Email ID or Phone Number already exists,if you preferred to use same Email Id or Phone Number please contact Admin.');
      }
     else if(error == "CorporateApplicationAddProxyPhoneNumber already exists"){
        this.alertService.error('Email ID or Phone Number already exists,if you preferred to use same Email Id or Phone Number please contact Admin.');
      }
      else {
        this.alertService.error('Registration failed! Try Again');
      }
      console.log(error);
    });
   
  }
  buildCorporateRegister():RegisterCorporateRq{

    return new RegisterCorporateRq({
      "password" : this.registerForm.controls['password'].value,
      "corporate" : this.buildCorporate(),
      "productName" : "TT,MC",
      "controlFlowId" : "1111111",
      "customerType" : "C"
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

  // This function will be trigger automatically  based on the stepper changes in the parent component
  updateStatus(event: any) {
    if(this.formStatus == "Registration Form Submitted Sucessfully"){
     this.registerForm.valueChanges.subscribe(() => { 
       this.corpRegistrationStatusChanged.emit('In Progress');  //Listen for changes whenever the formcontrol value changes ,we change status In-Progress
     });
    }
    else{
     this.corpRegistrationStatusChanged.emit(this.registerForm.valid ? 'Completed' : 'In Progress');  // Emit an stepper status to the parent-stepper component
    }
  
   }

   onSelectPhoneCode(flag:string){
    var array :any[] = countryCodeArray.filter(v => v.FLAG == flag) ;
   if(array.length == 1){
    this.countryCode = array[0].code ;
   }
  }

}
