import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Phone, noWhitespaceValidator } from 'src/app/shared/models/phone.model';
import { CustomValidators } from 'ngx-custom-validators';
import { UserService } from 'src/app/authentication/services/user.service';
import { Applicant } from 'src/app/shared/models/applicant.model';
import { RegisterUserRq } from 'src/app/authentication/models/registerrq.model';
import { Name } from 'src/app/shared/models/name.model';
import { Email } from 'src/app/shared/models/email.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationSubmitDialogComponent } from '../mc-onboarding/mc-application-submit-dialog/application-submit-dialog.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  @Output() registrationStatusChanged = new EventEmitter<any>();
  registerForm : FormGroup = Object.create(null) ;
  hide = true;
  hideMatHint : boolean = true;
  formStatus !: string;
  public registerRq: RegisterUserRq = Object.create(null);
  applicant: Applicant = Object.create(null);
  @Input() stepper!: MatStepper; // Receive MatStepper reference from parent component
  phoneNumberCodes :any[] = [
    {
      "country": "Singapore",
      "code": "+65",
      "maxLength": 8,
      "FLAG": "flag-icon flag-icon-sg"
    },
  ] ;
  selectedCode: string = '';
  phoneNumberMaxLength : number = 8 ;
  countryCode !: string ;

  constructor(private fb : FormBuilder,private userService : UserService, private alertService : AlertService,
    private store : InMemoryCache, private dialog : MatDialog) { }

  ngOnInit(): void {
    console.log("Registartion loaded") ;
    this.registerForm = this.fb.group({
      email: [null, Validators.compose([Validators.required, CustomValidators.email,Validators.maxLength(128)])],
      phoneNumber: [null, [Validators.compose([Validators.required,noWhitespaceValidator,this.phoneNumberValidator,Validators.pattern("[0-9 ]*$"),Validators.minLength(8)])]],
      password: [null, Validators.compose([Validators.minLength(8), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).{8,}$"), Validators.required, Validators.maxLength(16)])],
      phoneCountryCode :[null, Validators.compose([Validators.required])],
    });
     //onload --> patch SG country code 
     this.registerForm.patchValue({
      "phoneCountryCode" :  "flag-icon flag-icon-sg",
    });
    this.countryCode = "+65" ;
  }

  onSubmit(){
    //service call..
    this.userService.registerIndividual(this.createRegisterRq(this.registerForm)).subscribe((datas:any)=>{
      this.store.setItem('MC_IND_APPLICATION_ID',datas.applicationId)  ;
      this.store.setItem('MC_IND_APPLICANT_ID',datas.applicantId)  ;
      this.alertService.clear();
      this.stepper.next();
      this.formStatus = "Registration Form Submitted Sucessfully"
      this.registrationStatusChanged.emit('Submitted');
    },
    (error: any) => {
     
      this.alertService.clear();
     
      if(error == "ConsumerApplicationAddProxyEMAILID already exists"){
        this.alertService.error('Email ID or Phone Number already exists,if you preferred to use same Email Id or Phone Number please contact Admin.');
      }
      else if(error == "ConsumerApplicationAddProxyPhoneNumber already exists"){
        this.alertService.error('Email ID or Phone Number already exists,if you preferred to use same Email Id or Phone Number please contact Admin.');
      }
      else {
        this.alertService.error('Registration failed! Try Again');
      }
      console.log(error);
    }
    )
  }

  private createRegisterRq(registerForm: FormGroup): RegisterUserRq {
    
    let countryFlag = this.registerForm.controls['phoneCountryCode'].value ? this.registerForm.controls['phoneCountryCode'].value : "" ;
    let retrieveCountryArray : any[] = this.phoneNumberCodes.filter(v => v.FLAG == countryFlag) ;
    let value = retrieveCountryArray[0].code ? retrieveCountryArray[0].code : "" ;
    let countryCode = value.replace('+', ''); // Removing the '+' character
    console.log("country code value =", countryCode); 

    this.applicant = new Applicant(new Name('', '', ''), [new Email(registerForm.value.email, 'Y')], [new Phone('M', registerForm.value.phoneNumber, countryCode)])
    var appType;
    appType = 'I'

    this.registerRq = new RegisterUserRq(
      appType,
      "TT,MC",
      this.applicant,
      this.registerForm.value.password,
      this.registerRq.otpRefNo = '555',
      'I'
    );
    console.log(JSON.stringify(this.registerRq))
    return this.registerRq;
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

  // This function will be trigger automatically  based on the stepper changes in the parent component
  updateStatus(event: any) {
    

    // Listen for changes whenever the formcontrol value changes on the entire form
   if(this.formStatus == "Registration Form Submitted Sucessfully"){
    this.registerForm.valueChanges.subscribe(() => { 
      this.registrationStatusChanged.emit('In Progress'); //Listen for changes whenever the formcontrol value changes ,we change status In-Progress
    });
   }
   else{
    this.registrationStatusChanged.emit(this.registerForm.valid ? 'Completed' : 'In Progress');  //if form is valid emit status 'Completed', otherWise "In-Progress"
  }
 
  }

  onSelectPhoneCode(flag:string){
    var array :any[] = this.phoneNumberCodes.filter(v => v.FLAG == flag) ;
   if(array.length == 1){
    this.countryCode = array[0].code ;
   }
  }


}
