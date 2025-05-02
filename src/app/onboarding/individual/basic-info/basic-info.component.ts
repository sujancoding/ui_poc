import { Component, OnInit, AfterViewInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ProfileinfoService } from 'src/app/core/services/profileinfo.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApplicationUpdate, Name } from 'src/app/core/model/Appication Update/Application_Update';
import { Address , Demographics } from 'src/app/core/model/Appication Update/Application_Update';
import { ReviewService } from 'src/app/core/services/review.service';

import _moment from 'moment';
//_moment = require('moment');
import * as _ from 'lodash';
import { MatDialog, MatDialogClose, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddressComponent } from '../sow/sourceofwealth.component';
import { ApplicationService } from 'src/app/core/services/application.service';
import { ApplicationSteps } from 'src/app/core/model/ApplicationFlagSteps';
import { ConfirmationDialogComponent } from 'src/app/backoffice/shared/modals/confirmation-dialog.component';

import { ApplicationInquiry } from 'src/app/core/model/ApplicationInquiry/Application-Inquiry';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CustomerInquiry, CustomerName, EmailUpdate, PhoneNumberUpdate, UpdateCustomerDatas } from 'src/app/core/model/Customer Inquiry/customer-inquiry';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { ErrorDialogComponent } from '../../modals/errordialog.component';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';

import { CustomValidators } from 'ngx-custom-validators';
import { noWhitespaceValidator } from 'src/app/shared/models/phone.model';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { roleIdDetails } from 'src/assets/userrole';
import { countryArr, nationalityArray } from 'src/assets/dropdownvalues';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
const moment = _moment;
import { nricRegex } from 'src/assets/dropdownvalues';



@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class PersonalInfoComponent implements OnInit, AfterViewInit {
  value:any;
  name!: Name
  application: ApplicationUpdate = new ApplicationUpdate()
  dobDate = moment();
  validity = moment();
  passportExpiryDate = moment();
 // tillDate: Date = new Date() ;
 // tooltipMessage = 'NRIC VALID TILL DATE';
  maxDate!: Date;
  date!: Date;
  public form: FormGroup = Object.create(null);
  submitted = false;
  address!: Address[];
  formReady: any = false;
  loading = false;
  loader = false;
  user: any = {};
  applicationId!: string;
  id!: string;
  customerId!: string;
  flag!: Boolean;
  saveBioInfo: Boolean = true;
  customerflag!: Boolean;
  reviewCustomerFlag : Boolean = false;
  showEmptyFields!: Boolean;
  applicationInquiry: ApplicationInquiry = new ApplicationInquiry();
  customerInquiry: CustomerInquiry = new CustomerInquiry();
  primaryAddress :any;
  secondaryAddress : any;
  isReadOnly : Boolean = false;
  applicationStatus: any;
  customerActivate: Boolean = false;
  customerDeactivate :  Boolean = false;
  minDate = new Date(1920, 0, 1); // January 1st, 1920
  nationality : any[] = nationalityArray ;
  showSaveChangesButton : boolean = false ;
  isFormControlChanged: boolean = true;
  filteredNationalities : any[] = nationalityArray ;
  filteredCountries : any[] = countryArr ;
  country : any[] = countryArr ;

  @Output() basicProfileStatusChanged = new EventEmitter<any>();
  formStatus !: string 
  @Input() stepper!: MatStepper; // Receive MatStepper reference from parent component;
  showEditableForBranchChannel : boolean = false ;
  isDisableEditCustomerDetails : boolean = true ;
  showEditInfo : boolean = false ;
  showDontEdit : boolean = false ;
  showApplicationFields : boolean = true ;
  placeOfBirthCountry : any[] =  countryArr;
  getRiskRatingList : any[] = [
    {"VALUE" : "9", "DESC" : "HIGH"},
    {"VALUE" : "5", "DESC" : "MEDIUM"},
    {"VALUE" : "0", "DESC" : "LOW"}
  ];
  showRiskRatingField : boolean = false;


  constructor(public fb: FormBuilder, private profileService: ProfileinfoService,
    private alertService: AlertService, private route: ActivatedRoute, private router: Router,
    private reviewService: ReviewService, @Inject(MAT_DIALOG_DATA) public data: any, private customerSearchService: CustomerSearchService,
    public dialogRef: MatDialog, private applicationService: ApplicationService,private store: InMemoryCache,private headerService : TitleHeaderService,
    private snackBar : MatSnackBar) {
    
   
  }
  clearValidators(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.clearValidators();
      control?.updateValueAndValidity();
 });
 }

 updateValidations() {
  // Reapply validators 
  var regex = nricRegex ;
  this.form.controls['fullname'].setValidators([ Validators.required, Validators.pattern('[a-zA-Z ./,@]*$'), this.whitespaceValidator, this.removeSpaces,Validators.maxLength(50) ]);
  this.form.controls['aliasName'].setValidators([Validators.pattern('^[0-9 ]+$'),Validators.maxLength(50)]),
  this.form.controls['identification'].setValidators([Validators.required,this.removeSpaces, Validators.pattern(regex)]);
  this.form.controls['validTillNric'].setValidators([Validators.required]);
  this.form.controls['dob'].setValidators([ Validators.required,]);
  this.form.controls['Gender'].setValidators([Validators.required,]);
  this.form.controls['email'].setValidators([Validators.required, CustomValidators.email,Validators.maxLength(128)]);
  this.form.controls['phonenumber'].setValidators([Validators.required,this.phoneNumbersValidator,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator]);
  this.form.controls['Nationality'].setValidators([Validators.required]);
  this.form.controls['passportNumber'].setValidators([Validators.maxLength(256)]),
  this.form.controls['Level'].setValidators([Validators.required, Validators.pattern('^[0-9 ]+$'),Validators.maxLength(40),this.removeSpaces,noWhitespaceValidator]);
  this.form.controls['Unit'].setValidators([Validators.required, this.unitFieldValidation,Validators.maxLength(40),this.removeSpaces,noWhitespaceValidator]);
  this.form.controls['Block'].setValidators([Validators.maxLength(40),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')]),
  this.form.controls['streetname'].setValidators([Validators.required,Validators.pattern('^[a-zA-Z0-9 ,.:;-]+$'),Validators.maxLength(40),this.removeSpaces,this.whitespaceValidator]);
  this.form.controls['localpostalcode'].setValidators([Validators.required,Validators.pattern('^[0-9 ]+$'),this.removeSpaces,noWhitespaceValidator]);
  this.form.controls['localcountry'].setValidators([Validators.required]);
  this.form.controls['overseasaddress'].setValidators([Validators.pattern('^[a-zA-Z0-9- ]*$'),Validators.maxLength(40),]);
  this.form.controls['overseascity'].setValidators([Validators.pattern('[a-zA-Z ]*$'),Validators.maxLength(40),this.removeSpaces,this.whitespaceValidator]);
  this.form.controls['overseasstate'].setValidators([Validators.pattern('[a-zA-Z ]*$'),Validators.maxLength(40),this.removeSpaces,this.whitespaceValidator]);
  this.form.controls['overseaspostalcode'].setValidators([Validators.pattern('^[0-9 ]+$'),this.removeSpaces,noWhitespaceValidator]);
  this.form.controls['consumerNationality'].setValidators([Validators.pattern('[a-zA-Z .]*$')]);
  this.form.controls['overseasSearchCountry'].setValidators([Validators.pattern('[a-zA-Z .]*$')]);
  this.form.controls['placeOfBirth'].setValidators([Validators.required,Validators.pattern('[a-zA-Z .]*$')]);
  // After updating validators, update validity status
  this.form.clearValidators();
  this.form.updateValueAndValidity();

  let nricValue = this.form.controls['identification'].value ? this.form.controls['identification'].value : "";
  console.log(nricValue) ;
  if(nricValue && nricValue.startsWith('S') == true){
    this.form.controls['validTillNric'].clearValidators() ;
    this.form.controls['validTillNric'].updateValueAndValidity() ;
  }
    else{
      this.form.controls['validTillNric'].setValidators(Validators.required) ;
      this.form.controls['validTillNric'].updateValueAndValidity() ;
    }

}

  ngOnInit(): void {
    console.log('basic profile loaded') ;
    //Validations
    var regex = nricRegex;
    this.headerService.setTitle('Basic Profile');
    this.maxDate = new Date();
    this.maxDate.setMonth(this.maxDate.getMonth() - 12 * 18);
    this.form = this.fb.group({
      fullname: [null, [Validators.compose([Validators.required]), Validators.pattern('[a-zA-Z ./,@]*$'),this.whitespaceValidator,this.removeSpaces,Validators.maxLength(50)]],
      aliasName : [null, [Validators.pattern('^[0-9 ]+$'),Validators.maxLength(50)]], //Non mandatory field
      identification: [null, [Validators.compose([Validators.required,this.removeSpaces,  Validators.pattern(regex)])]], 
      validTillNric : [null, [Validators.compose([Validators.required])]],
      dob: [null, [Validators.compose([Validators.required])]], 
      Gender: [null, [Validators.compose([Validators.required])]], 
      email: [null, Validators.compose([Validators.required, CustomValidators.email,Validators.maxLength(128)])],
      phonenumber: [null, [Validators.compose([Validators.required,this.phoneNumbersValidator,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator])]],
      Nationality: [null, [Validators.compose([Validators.required])]],
      passportNumber : [null, Validators.compose([Validators.maxLength(256)])],//newly added on 1 feb 2024
      passportExpiry : [null],//newly added on 1 feb 2024
      Level: [null, [Validators.compose([Validators.required]), Validators.pattern('^[0-9 ]+$'),Validators.maxLength(40),this.removeSpaces,noWhitespaceValidator]],
      Unit: [null, [Validators.compose([Validators.required]), this.unitFieldValidation,Validators.maxLength(40),this.removeSpaces,noWhitespaceValidator]],
      Block: [null, Validators.compose([Validators.maxLength(40),Validators.pattern('^[a-zA-Z0-9 ,.:;-]+$')])],
      streetname: [null, [Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9 ,.:;-]+$'),Validators.maxLength(40),this.removeSpaces,this.whitespaceValidator])]],
      localpostalcode: [null, [Validators.compose([Validators.required,Validators.pattern('^[0-9 ]+$'),this.removeSpaces,noWhitespaceValidator])]],
      localcountry: [null, [Validators.compose([Validators.required])]], 
      overseasaddress: [null,[Validators.compose([Validators.pattern('^[a-zA-Z0-9- ]*$'),Validators.maxLength(40)])]],
      overseascity: [null, [Validators.compose([Validators.pattern('[a-zA-Z ]*$'),Validators.maxLength(40),this.removeSpaces,this.whitespaceValidator])]],
      overseasstate: [null, [Validators.compose([Validators.pattern('[a-zA-Z ]*$'),Validators.maxLength(40),this.removeSpaces,this.whitespaceValidator])]],
      overseaspostalcode: [null, [Validators.compose([Validators.pattern('^[0-9 ]+$'),this.removeSpaces,noWhitespaceValidator])]],
      overseascountry: [null],
      consumerNationality : [null , Validators.compose([Validators.pattern('[a-zA-Z .]*$')])], //newly added on 15 Sep2023 , to search nationality in nationality Dropdown
      overseasSearchCountry : [null , Validators.compose([Validators.pattern('[a-zA-Z .]*$')])], //newly added on 15 Sep2023 , to search overseas country in overseas country Dropdown
      placeOfBirth : [null, [Validators.compose([Validators.required,Validators.pattern('[a-zA-Z .]*$')])]],
      riskRating : [null]
    });
   //show empty fields so that the customers will share their bioInfo,SOW & docs on premises
   if (this.data.appOnboardingForMc) {
    this.headerService.setTitle('Account Opening');
    this.showEmptyFields = true;
    this.saveBioInfo = false;
    this.isReadOnly = false ;
  }

  //MC => Application Search => View and editable Basic info with application inquiry details
  if(this.data.appSearchOnboardingForMc){
    this.headerService.setTitle('Account Opening');
    let applicationId = this.data.applicationId ? this.data.applicationId : "" ;
    let applicantId = this.data.applicantId ? this.data.applicantId : "" ;
    this.store.setItem('MC_IND_APPLICATION_ID',applicationId) ;
    this.store.setItem('MC_IND_APPLICANT_ID',applicantId) ;
    this.showEditableForBranchChannel = true;
    this.saveBioInfo = false;
    this.isReadOnly = false ;
    this.loadApplicationInquiryMcOnboarding();
  }
     
    //PrePopulating Datas from particular ID (Basic Profile) --> mobile screen
  let userRole = this.store.getItem('USER_ROLE') ;  //consumer- 111
  if(userRole == roleIdDetails.CONSUMER){
    if(this.store.getItem('APPLICATIONSTATUS') == "NEW" || this.store.getItem('APPLICATIONSTATUS') == "PENDING"){
    this.route.queryParams.subscribe((params: any)=> {
    let applicationId = params.application;
    if(applicationId != undefined)
      this.profileService.getApplicationInquiry(applicationId).subscribe(data => {
        this.applicationInquiry = data;
        //filtering primary address and secondary address 
        this.primaryAddress  =this.applicationInquiry.address.filter(v=>v.isprimary ==="Y");
        this.secondaryAddress  =this.applicationInquiry.address.filter(v=>v.isprimary ==="N");
        this.applicationStatus = this.store.getItem('APPLICATIONSTATUS');
    
      // let basicInfoStatus= this.store.getItem('APPLICATION_SUBMITTED')
       if(this.applicationStatus == "PENDING" || data.status == "PENDING"){
        this.isReadOnly = true;
        this.saveBioInfo = false;
      }
        this.form.patchValue({
          "fullname": this.applicationInquiry.name.name,
          "identification": this.applicationInquiry.demographics.idNumber,
          "validTillNric" :this.applicationInquiry.demographics.validity, //newly added element - nric valid element
          "dob": this.applicationInquiry.demographics.dateOfBirth,
          "Gender": this.applicationInquiry.demographics.gender,
          "email": this.applicationInquiry.email.emailId,
          "phonenumber": this.applicationInquiry.phone.phoneNo,
          "Nationality": this.applicationInquiry.demographics.nationality,
          "consumerNationality" : this.applicationInquiry.demographics.nationality,
          "passportNumber" : this.applicationInquiry.demographics.passportNumber ? this.applicationInquiry.demographics.passportNumber : "",
          "passportExpiry" : this.applicationInquiry.demographics.passportExpiry ? this.applicationInquiry.demographics.passportExpiry : "",
          "Level": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].level,
          "Unit": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].unit,
          "Block": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].block,
          "streetname": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].streetName,
          "localpostalcode": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].postalCode,
          "localcountry": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].country,
          "overseasaddress": _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].streetName,
          "overseascity": _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].city,
          "overseasstate": _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].state,
          "overseaspostalcode": _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].postalCode,
          "overseascountry": _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].country,
          "overseasSearchCountry" :  _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].country,
          "placeOfBirth" : this.applicationInquiry.demographics.placeOfBirth ? this.applicationInquiry.demographics.placeOfBirth : ""
        });
      },
      //error handling completed on 01/07/2023
      (error:any)=>{
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogComponent) ;
        }
      
      }
    
      )
    })
  }
 //consumer -> customer inquiry api call
  if(this.store.getItem('APPLICATIONSTATUS') == "APPROVED" || this.store.getItem('CUSTOMER_STATUS') == 'ACTIVE'){ 
    this.isReadOnly = true;
    this.saveBioInfo = false;
    this.route.queryParams.subscribe((params: any)=> {
      console.log(params)
      let customerId = params.customer;
      if(customerId != undefined)
         this.isReadOnly = true;
         this.saveBioInfo = false;
      this.customerSearchService.getCustomerInquiry(customerId).subscribe(data =>{
        this.customerInquiry = data;
        this.primaryAddress  =this.customerInquiry.address.filter(v=>v.isprimary ==="Y");
        this.secondaryAddress  =this.customerInquiry.address.filter(v=>v.isprimary ==="N");
        this.form.patchValue({
          "fullname": data.name.name,
          "identification": this.customerInquiry.demographics.idNumber,
          "validTillNric" :this.customerInquiry.demographics.validity,  //newly added element - nric valid element
          "dob": this.customerInquiry.demographics.dateOfBirth,
          "Gender": this.customerInquiry.demographics.gender,
          "email": this.customerInquiry.email.emailId,
          "phonenumber": this.customerInquiry.phone.phoneNo,
          "Nationality": this.customerInquiry.demographics.nationality,
          "consumerNationality" : this.customerInquiry.demographics.nationality,
          "passportNumber" : this.customerInquiry.demographics.passportNumber ? this.customerInquiry.demographics.passportNumber : "",
          "passportExpiry" : this.customerInquiry.demographics.passportExpiry ? this.customerInquiry.demographics.passportExpiry : "",
          "Level": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].level,
          "Unit": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].unit,
          "Block": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].block,
          "streetname": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].streetName,
          "localpostalcode": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].postalCode,
          "localcountry": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].country,
          "overseasaddress": _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].streetName,
          "overseascity": _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].city,
          "overseasstate": _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].state,
          "overseaspostalcode": _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].postalCode,
          "overseascountry": _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].country,
          "overseasSearchCountry" :  _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].country,
          "placeOfBirth" : this.customerInquiry.demographics.placeOfBirth ? this.customerInquiry.demographics.placeOfBirth : ""
        });
      },
      //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogComponent) ;
    }
  }
    )
  });
}
  }

  this.form.get('identification')?.valueChanges.subscribe((value:any) => {
    //If NRIC starts with 'S' --> Make NRIC validity field as non mandatory .
    if(value && value.startsWith('S') == true){
      this.form.controls['validTillNric'].clearValidators() ;
      this.form.controls['validTillNric'].updateValueAndValidity() ;
    }
    else{
      this.form.controls['validTillNric'].setValidators(Validators.required) ;
      this.form.controls['validTillNric'].updateValueAndValidity() ;
    }
  })
  
    this.form.get('localcountry',)?.valueChanges.subscribe(value => {
      const overseasaddress = this.form.get('overseasaddress');
      const overseascity = this.form.get('overseascity');
      const overseasstate = this.form.get('overseasstate');
      const overseaspostalcode = this.form.get('overseaspostalcode');
      const overseascountry = this.form.get('overseascountry');
      if (value == 'Malaysia') {
        overseasaddress?.setValidators(Validators.required);
        overseascity?.setValidators(Validators.required);
        overseasstate?.setValidators([Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]);
        overseaspostalcode?.setValidators([Validators.required, Validators.pattern('^[0-9 \-\']+'), Validators.maxLength(6)]);
        overseascountry?.setValidators(Validators.required);
      } else if (value == 'Singapore') {
        overseasaddress?.clearValidators();
        overseascity?.clearValidators();
        overseasstate?.clearValidators();
        overseaspostalcode?.clearValidators();
        overseascountry?.clearValidators();
      }
      overseasaddress?.updateValueAndValidity();
      overseascity?.updateValueAndValidity();
      overseasstate?.updateValueAndValidity();
      overseaspostalcode?.updateValueAndValidity();
      overseascountry?.updateValueAndValidity();

    })

    //Application Search > view BioInfo (datas prepopulated)
    if (this.data.isreview) {
      this.headerService.setTitle('Account Opening');
      this.clearValidators(this.form);
      this.isReadOnly = true;
      this.loading = true;
      this.flag = true;
      this.saveBioInfo = false;
      this.primaryAddress = this.data.isreview.address.filter( function (v:any){ return v.isprimary == "Y"})
      this.secondaryAddress = this.data.isreview.address.filter( function (v:any){ return v.isprimary == "N"})
      this.form.controls['fullname'].setValue(this.data.isreview.name.name),
        this.form.controls['identification'].setValue(this.data.isreview.demographics.idNumber),
        this.form.controls['validTillNric'].setValue(this.data.isreview.demographics.validity), //newly added element - nric valid element
        this.form.controls['dob'].setValue(this.data.isreview.demographics.dateOfBirth),
        this.form.controls['Gender'].setValue(this.data.isreview.demographics.gender),
        this.form.controls['email'].setValue(this.data.isreview.email.emailId),
        this.form.controls['phonenumber'].setValue(this.data.isreview.phone.phoneNo),
        this.form.controls['Nationality'].setValue(this.data.isreview.demographics.nationality),
        this.form.controls['consumerNationality'].setValue(this.data.isreview.demographics.nationality),
        this.form.controls['passportNumber'].setValue(this.data.isreview.demographics.passportNumber ? this.data.isreview.demographics.passportNumber : ""),
        this.form.controls['passportExpiry'].setValue(this.data.isreview.demographics.passportExpiry ? this.data.isreview.demographics.passportExpiry : ""),
        this.form.controls['Level'].setValue( _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].level),
        this.form.controls['Unit'].setValue (_.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].unit),
        this.form.controls['Block'].setValue( _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].block),
        this.form.controls['streetname'].setValue( _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].streetName),
        this.form.controls['localpostalcode'].setValue( _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].postalCode),
        this.form.controls['localcountry'].setValue( _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].country),
        this.form.controls['overseasaddress'].setValue( _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].streetName),
        this.form.controls['overseascity'].setValue(_.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].city),
        this.form.controls['overseasstate'].setValue(_.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].state),
        this.form.controls['overseaspostalcode'].setValue(_.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].postalCode),
        this.form.controls['overseascountry'].setValue(_.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].country),
        this.form.controls['overseasSearchCountry'].setValue(_.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].country),
        this.form.controls['placeOfBirth'].setValue(this.data.isreview.demographics.placeOfBirth ? this.data.isreview.demographics.placeOfBirth : "")
        

    }
 //Customer Search - PrePopulating Datas in Modal Popup Dialog 
 if (this.data.isCustomerReview) {
  this.headerService.setTitle('Customers');
  this.clearValidators(this.form);
  this.showRiskRatingField = true;
  this.isReadOnly = true;
  this.customerflag = true;
  this.saveBioInfo = false;
  this.showEditInfo = true ;
  this.showDontEdit = false ;
  this.isDisableEditCustomerDetails = false ; //enabling edit customer details button .
  this.showApplicationFields = false ; //show alias name ...
   if(this.data.isCustomerReview.status == "0"){ //0 means customer is already deactivated
      this.customerActivate = true;
      this.customerDeactivate = false;
  }
  if(this.data.isCustomerReview.status == "1"){ //1 means customer is already activated
    // this.isReadOnly = false;
    this.customerActivate = false;
    this.customerDeactivate = true;
}
  this.primaryAddress = this.data.isCustomerReview.address.filter( function (v:any){ return v.isprimary == "Y"})
  this.secondaryAddress = this.data.isCustomerReview.address.filter( function (v:any){ return v.isprimary == "N"})
  this.form.controls['fullname'].setValue(this.data.isCustomerReview.name.name),
  this.form.controls['aliasName'].setValue(this.data.isCustomerReview.name.aliasName),
    this.form.controls['identification'].setValue(this.data.isCustomerReview.demographics.idNumber),
    this.form.controls['dob'].setValue(this.data.isCustomerReview.demographics.dateOfBirth),
    this.form.controls['validTillNric'].setValue(this.data.isCustomerReview.demographics.validity), //newly added element - nric valid element
    this.form.controls['Gender'].setValue(this.data.isCustomerReview.demographics.gender),
    this.form.controls['email'].setValue(this.data.isCustomerReview.email.emailId),
    this.form.controls['riskRating'].setValue(
      this.getRiskRatingList.find(option => option.DESC == this.data.isCustomerReview.riskRating)?.VALUE ?? null
    );
    this.form.controls['phonenumber'].setValue(this.data.isCustomerReview.phone.phoneNo),
    this.form.controls['Nationality'].setValue(this.data.isCustomerReview.demographics.nationality),
    this.form.controls['consumerNationality'].setValue(this.data.isCustomerReview.demographics.nationality),
    this.form.controls['passportNumber'].setValue(this.data.isCustomerReview.demographics.passportNumber ? this.data.isCustomerReview.demographics.passportNumber : ""),
    this.form.controls['passportExpiry'].setValue(this.data.isCustomerReview.demographics.passportExpiry ? this.data.isCustomerReview.demographics.passportExpiry : ""),
    this.form.controls['Level'].setValue( _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].level),
    this.form.controls['Unit'].setValue (_.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].unit),
    this.form.controls['Block'].setValue( _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].block),
    this.form.controls['streetname'].setValue( _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].streetName),
    this.form.controls['localpostalcode'].setValue( _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].postalCode),
    this.form.controls['localcountry'].setValue( _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].country),
    this.form.controls['overseasaddress'].setValue( _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].streetName),
    this.form.controls['overseascity'].setValue(_.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].city),
    this.form.controls['overseasstate'].setValue(_.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].state),
    this.form.controls['overseaspostalcode'].setValue(_.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].postalCode),
    this.form.controls['overseascountry'].setValue(_.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].country),
    this.form.controls['overseasSearchCountry'].setValue(_.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].country),
    this.form.controls['placeOfBirth'].setValue(this.data.isCustomerReview.demographics.placeOfBirth ? this.data.isCustomerReview.demographics.placeOfBirth : ""),

// Listen for changes whenever the formcontrol value changes on the entire form
    this.form.valueChanges.subscribe(() => {   
        this.isFormControlChanged = false;
      });

      this.form.get('identification')?.valueChanges.subscribe((value:any) => {
        //If NRIC starts with 'S' --> Make NRIC validity field as non mandatory .
        if(value && value.startsWith('S') == true){
          this.form.controls['validTillNric'].clearValidators() ;
          this.form.controls['validTillNric'].updateValueAndValidity() ;
        }
        else{
          this.form.controls['validTillNric'].setValidators(Validators.required) ;
          this.form.controls['validTillNric'].updateValueAndValidity() ;
        }
      })
}

//backoffice - approve payee screen  
  if(this.data.reviewCustomerDetails){
    this.headerService.setTitle('Approve Payee');
    this.isReadOnly = true;
    this.reviewCustomerFlag = true;
    this.saveBioInfo = false;
    this.clearValidators(this.form);
    this.primaryAddress = this.data.reviewCustomerDetails.address.filter( function (v:any){ return v.isprimary == "Y"})
    this.secondaryAddress = this.data.reviewCustomerDetails.address.filter( function (v:any){ return v.isprimary == "N"})
    this.form.controls['fullname'].setValue(this.data.reviewCustomerDetails.name.name),
      this.form.controls['identification'].setValue(this.data.reviewCustomerDetails.demographics.idNumber),
      this.form.controls['validTillNric'].setValue(this.data.reviewCustomerDetails.demographics.validity),//newly added element - nric valid element
      this.form.controls['dob'].setValue(this.data.reviewCustomerDetails.demographics.dateOfBirth),
      this.form.controls['Gender'].setValue(this.data.reviewCustomerDetails.demographics.gender),
      this.form.controls['email'].setValue(this.data.reviewCustomerDetails.email.emailId),
      this.form.controls['phonenumber'].setValue(this.data.reviewCustomerDetails.phone.phoneNo),
      this.form.controls['Nationality'].setValue(this.data.reviewCustomerDetails.demographics.nationality),
      this.form.controls['consumerNationality'].setValue(this.data.reviewCustomerDetails.demographics.nationality),

      this.form.controls['passportNumber'].setValue(this.data.reviewCustomerDetails.demographics.passportNumber ? this.data.reviewCustomerDetails.demographics.passportNumber : ""),
      this.form.controls['passportExpiry'].setValue(this.data.reviewCustomerDetails.demographics.passportExpiry ? this.data.reviewCustomerDetails.demographics.passportExpiry : ""),

      this.form.controls['Level'].setValue( _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].level),
      this.form.controls['Unit'].setValue (_.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].unit),
      this.form.controls['Block'].setValue( _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].block),
      this.form.controls['streetname'].setValue( _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].streetName),
      this.form.controls['localpostalcode'].setValue( _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].postalCode),
      this.form.controls['localcountry'].setValue( _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].country),
      this.form.controls['overseasaddress'].setValue( _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].streetName),
      this.form.controls['overseascity'].setValue(_.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].city),
      this.form.controls['overseasstate'].setValue(_.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].state),
      this.form.controls['overseaspostalcode'].setValue(_.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].postalCode),
      this.form.controls['overseascountry'].setValue(_.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].country),
      this.form.controls['overseasSearchCountry'].setValue(_.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].country),
      this.form.controls['placeOfBirth'].setValue(this.data.reviewCustomerDetails.demographics.placeOfBirth ? this.data.reviewCustomerDetails.demographics.placeOfBirth : "")
  
  }
  

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.formReady = true;
    }, 10)

  }
  phoneNumbersValidator(control: AbstractControl) {

    const value = control.value;
        if (value && value.match("^[0]+")) {  // if the value consists of zero at beginning of string , return an error object
      return { "isStartzero": true };
     }

    const startsWithNumber = /^[0-9]/.test(value)
      if (value && startsWithNumber && value.length < 8) { // Company number start with number and the length is less than 6 , return a error object
        return { "minlength": true };
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
  
    if (value && value.match("^[ .]+")) {
      // if the value consists of whitespace or fullstop at beginning of string , return an error object
      return { "isWhitespace": true };
    }
    // otherwise, return null (no error)
    return null;
    
  }
  postalNumberValidator(control: AbstractControl){
    const value = control.value;
    const startsWithNum = /^[0-9]/.test(value)
    if (value && startsWithNum && value.length < 6) { // Postal code start with number and the length is less than 6 , return a error object
      console.log("The postal code value is" + value);
      
      return { "minLength": true };
      
      
    }
    // otherwise, return null (no error)
    return null;
    
  }


  get f() { return this.form.controls; }


  //onSave() method -> After Clicking Next Button
  onSave() {
    console.log("onSave()")
    this.loader = true;
    this.saveBioInfo = false;
    this.profileService.addApplicationUpdate(this.buildApplicationUpdate('MOBILE')).subscribe(
      data => {
        this.router.navigate(["/dashboard/custdash"]);
        this.loader = false;
        this.saveBioInfo = true;
        console.log(data);
        this.applicationService.updateScreenstatus('basicProfileFlag')
        this.alertService.clear()
        this.alertService.success("Registration Successful!!");  //success message
      },
      (error:any) => {
        this.alertService.clear()
        this.alertService.error("Application Failed. Try Again");
        this.loading = false;
        this.submitted = false;   //failure message
        this.loader = false;
        this.saveBioInfo = true;
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogComponent);
        }
        
      }
    )


  }



  /** Payload MAker for Application Update - Reference */
  buildApplicationUpdate(channel:string): ApplicationUpdate {
    let applicationId :string = "";
    let applicantId : string = "";
    if(channel == "MOBILE"){ //if its consumer onboarding from mobile , get appId and applicantId from login response
      applicationId = this.store.getItem('APPLICATION_ID') ? this.store.getItem('APPLICATION_ID') : "";
      applicantId = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "" ;
    }
    else if(channel == ""){  //if its consumer onboarding from BRANCH (MC), get appId and applicantId from register response .
      applicationId = this.store.getItem('MC_IND_APPLICATION_ID') ? this.store.getItem('MC_IND_APPLICATION_ID') : "" ;
      applicantId =  this.store.getItem('MC_IND_APPLICANT_ID') ? this.store.getItem('MC_IND_APPLICANT_ID') : "" ;
    }
    return new ApplicationUpdate({
      "applicationType": "I",
      "applicationId" : applicationId,
      "applicantId" :  applicantId,
      "name": this.buildName(), "demographics": this.buildDemographics(), "address": this.buildAddress()
    })
  }
  buildName(): Name {
    let name = new Name({ "fullName": this.form.controls['fullname'].value });
   return name;
     
  }
  //this function only used for aliasName purpose. entry point:  backoffice > customer search > basic info edit . 
  buildCustomerName(): CustomerName {
    let name = new CustomerName({ 
      "fullName": this.form.controls['fullname'].value ,
      "aliasName": this.form.controls['aliasName'].value ? this.form.controls['aliasName'].value : ""  
    });
   return name;
     
  }

  buildDemographics(): Demographics {
    console.log("buildDemographics()")
    this.dobDate = moment(this.form.controls['dob'].value);
    let passPortExpiryDateCheck = this.form.controls['passportExpiry'].value ? this.form.controls['passportExpiry'].value : "" ;
    let passportExpiry = null ;
    if(passPortExpiryDateCheck != ""){ //if it contains value ..
      this.passportExpiryDate = moment(this.form.controls['passportExpiry'].value);
       passportExpiry = this.passportExpiryDate.format('YYYY') + "-" + this.passportExpiryDate.format('MM') + "-" + this.passportExpiryDate.format('DD')
    }else{
      passportExpiry = null ;
    }
    let nricValidity = this.form.controls['validTillNric'].value ? this.form.controls['validTillNric'].value : "" ;
    var validTillDate = null ;
    if(nricValidity != ""){
      this.validity = moment(this.form.controls['validTillNric'].value);
       validTillDate = this.validity.format('YYYY') + "-" + this.validity.format('MM') + "-" + this.validity.format('DD');
    }
    else{
      validTillDate = null ;
    }
    const selectedDate = this.dobDate.format('YYYY') + "-" + this.dobDate.format('MM') + "-" + this.dobDate.format('DD')
    
    console.log(selectedDate);
    console.log(validTillDate);
    let demographics = new Demographics({
      "idNumber": this.form.controls['identification'].value,
      "gender": this.form.controls['Gender'].value,
      "dateOfBirth": selectedDate,
      "nationality": this.form.controls['Nationality'].value,
      "validity": validTillDate,
      "passportNumber" : this.form.controls['passportNumber'].value ? this.form.controls['passportNumber'].value : "",
      "passportExpiry" : passportExpiry ? passportExpiry : null,
      "placeOfBirth" :  this.form.controls['placeOfBirth'].value ? this.form.controls['placeOfBirth'].value : "",
    });

    return demographics;
  }

  buildAddress(): Address[] {
    let addresses: Address[] = [];
    addresses.push(new Address({
      "isprimary": "Y",
      "level": this.form.controls['Level'].value,
      "unit": this.form.controls['Unit'].value,
      "block": this.form.controls['Block'].value ? this.form.controls['Block'].value : "",
      "streetName": this.form.controls['streetname'].value,
      "postalCode": this.form.controls['localpostalcode'].value,
      "country": this.form.controls['localcountry'].value
    }));
    addresses.push(new Address({
      "isprimary": "N",
      "city": this.form.controls['overseascity'].value,
      "address": this.form.controls['overseasaddress'].value,
      "state": this.form.controls['overseasstate'].value,
      "postalCode": this.form.controls['overseaspostalcode'].value,
      "country": this.form.controls['overseascountry'].value
    }));
    return addresses;

  }

  //Customer Listings - rejecting / inactive a customer
  openRejected() {
    this.dialogRef.open(ConfirmationDialogComponent, {
      data: { inactiveCustomer : true }
    })
  }
//Customer Listings - activate a customer
  openActivated(){
    this.dialogRef.open(ConfirmationDialogComponent, {
      data: { activeCustomer : true }
  });
  }


  //Application Listings > view SOW
  openSOWWithDatas() {
    this.applicationId =  this.store.getItem('APPLICATION_ID') ;
    this.profileService.getApplicationInquiry(this.applicationId).subscribe(data => {
      this.applicationInquiry = data;
      console.log(data);
      //open Modal Dialog
      this.dialogRef.open(AddressComponent, {
        width:'1245px',
        height: '575px',
        panelClass: 'custom-modalbox',
        disableClose : true,
        data: { isreview: data }
      })
    },
    //error handling completed on 01/07/2023
    (error:any)=>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    
    }
    )
  }

  openSOWCustomerReview(){ //Backoffice > Customer search > view SOW
    this.customerId = this.store.getItem('CUSTOMER_ID');
    this.customerSearchService.getCustomerInquiry(this.customerId).subscribe(data => {
      this.customerInquiry = data;
      this.dialogRef.open(AddressComponent, {
        width: '1240px',
        height: '575px',
        panelClass: 'custom-modalbox',
        disableClose : true,
        data: { isCustomerReview: data }
      })
    },
    //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  }
    )
  }

  //Application Listings > add Sow details on premises
  openSOW() {
    this.profileService.addApplicationUpdate(this.buildApplicationUpdate('')).subscribe(
      data => {
        console.log(data);
        if (this.form.valid) {
          this.loading = true;
          this.submitted = true;
          console.log('success mssg')
          this.alertService.success("Application Successful!!");
          this.alertService.clear()

        } else {
          this.alertService.clear()
          this.alertService.error("Application Failed. Try Again");
          this.loading = false;
          this.submitted = false;   //failure message
        }
      },
//error handling completed on 01/07/2023
      (error:any)=>{
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent) ;
        }
      }
    )
    this.dialogRef.open(AddressComponent, {
      width: '1240px',
      height: '575px',
      panelClass: 'custom-modalbox',
      data: { emptyfields: true }
    })
  }

  editData(){
    this.isReadOnly = false;
    this.showSaveChangesButton = true ;
    this.showEditInfo = false ;
    this.showDontEdit = true ;
    this.updateValidations();
    this.snackBar.open("Fields are editable now !" , "Ok",{
      panelClass: "custom-green-notification-snackbar",
      duration: 3000
    }) ;
  }

  //backoffice >>> customer search >>> back to fields as not editable function
  makeFieldsAsReadable(){
    this.showSaveChangesButton = false ;
    this.showEditInfo = true ;
    this.showDontEdit = false ;
    this.isReadOnly = true;
  }

  //Update customer service call for basic profile datas (consumer)
  updateCustomerBasicProfile(){
    let custId = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "" ;
   this.customerSearchService.updateCustomer(custId, this.buildCustomerUpdate()).subscribe((datas:any)=>{
    console.log(datas) ;
    this.clearValidators(this.form);
    this.snackBar.open("Changes are updated successfully !" , "Ok",{
      panelClass: "custom-green-notification-snackbar",
      duration: 3000
    }) ;
    this.isReadOnly = true;
    this.showEditInfo = true ;
    this.showDontEdit = false ;
    this.showSaveChangesButton = false ;
    this.isDisableEditCustomerDetails = false ; //enabling edit customer details button .
   },
   (error:any) => {
    this.alertService.clear();
    this.snackBar.open("Update Failed. Try Again", "Ok",{
      panelClass: "custom-red-notification-snackbar",
      duration: 3000,
    });
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent,{
        data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
      });
    }
  }
   )
  }

  buildCustomerUpdate():UpdateCustomerDatas{
   return new UpdateCustomerDatas({
    "customerType" : "I" ,
    "name" : this.buildCustomerName() ,
    "demographics" : this.buildDemographics() ,
    "email" : this.buildEmailAddressUpdate(),
    "phone" : this.buildPhoneNumberUpdate(),
    "address" : this.buildAddress(),
    "riskRating" : this.form.controls['riskRating'].value ? this.form.controls['riskRating'].value : null 
   })
  }

  buildEmailAddressUpdate() : EmailUpdate[]{
   let emailUpdate : EmailUpdate[] = [] ;
   emailUpdate.push(new EmailUpdate({
      "emailAddress" : this.form.controls['email'].value 
    })) ;
    return emailUpdate ;
  }

  buildPhoneNumberUpdate() : PhoneNumberUpdate[]{
    let phoneNumberUpdate : PhoneNumberUpdate[] = [] ;
    phoneNumberUpdate.push(new PhoneNumberUpdate({
      "phoneNumber" : this.form.controls['phonenumber'].value
     })) ;
     return phoneNumberUpdate ;
   }
  
   //this function triggers when value entered in search nationality field 
   filterNationality(nationality:HTMLInputElement){
    nationality.value = nationality.value.toUpperCase() ;
    if (nationality.value == '') {
      // If the search input is empty, show all nationalities
      this.filteredNationalities = this.nationality;
  }
  else {
      // Filter nationality based on the search input
      this.filteredNationalities = this.nationality.filter((v: any) => v.NATIONALITY.includes(nationality.value));
      if(this.filteredNationalities.length == 0){
        this.filteredNationalities = this.nationality;
      }  
  }
  }

  //this function triggers when value entered in search overseas country field 
  filterOverseasCountry(country:HTMLInputElement){
    country.value = country.value.toUpperCase() ;
    if (country.value == '') {
      // If the search input is empty, show all countries
      this.filteredCountries = this.country;
  }
  else {
      // Filter countries based on the search input
      this.filteredCountries = this.country.filter((v: any) => v.COUNTRY.includes(country.value));
      if(this.filteredCountries.length == 0){
        this.filteredCountries = this.country;
      }  
  }
  }

  onSaveBasicProfile(){

    this.profileService.addApplicationUpdate(this.buildApplicationUpdate('')).subscribe(
      data => {
        console.log(data) ;
        this.formStatus = "Basic Profile Form Submitted Sucessfully"
        this.basicProfileStatusChanged.emit('Submitted');
        this.stepper.next() ;
        console.log(data);
      
      },
      (error:any) => {
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent);
        }
        
      }
    )


  }

  // This function will be trigger automatically  based on the stepper changes in the parent component
  updateStatus(event: any) {
   if(this.formStatus == "Basic Profile Form Submitted Sucessfully"){
    this.form.valueChanges.subscribe(() => { 
      this.basicProfileStatusChanged.emit('In Progress'); //Listen for changes whenever the formcontrol value changes ,we change status In-Progress
    });
   }
   else{
    this.basicProfileStatusChanged.emit(this.form.valid ? 'Completed' : 'In Progress');  // Emit an stepper status to the parent-stepper component
  }
 
  }
  
  loadApplicationInquiryMcOnboarding(){
  
    this.applicationId = this.store.getItem('MC_IND_APPLICATION_ID') ? this.store.getItem('MC_IND_APPLICATION_ID') : "" ;
    this.profileService.getApplicationInquiry(this.applicationId).subscribe(data => {
      this.applicationInquiry = data;
        //filtering primary address and secondary address 
        this.primaryAddress  =this.applicationInquiry.address.filter(v=>v.isprimary ==="Y");
        this.secondaryAddress  =this.applicationInquiry.address.filter(v=>v.isprimary ==="N");

        this.form.patchValue({
          "fullname": this.applicationInquiry.name.name,
          "identification": this.applicationInquiry.demographics.idNumber,
          "validTillNric" :this.applicationInquiry.demographics.validity, //newly added element - nric valid element
          "dob": this.applicationInquiry.demographics.dateOfBirth,
          "Gender": this.applicationInquiry.demographics.gender,
          "email": this.applicationInquiry.email.emailId,
          "phonenumber": this.applicationInquiry.phone.phoneNo,
          "Nationality": this.applicationInquiry.demographics.nationality,
          "consumerNationality" : this.applicationInquiry.demographics.nationality,
          "passportNumber" : this.applicationInquiry.demographics.passportNumber ? this.applicationInquiry.demographics.passportNumber : "",
          "passportExpiry" : this.applicationInquiry.demographics.passportExpiry ? this.applicationInquiry.demographics.passportExpiry : "",
          "Level": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].level,
          "Unit": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].unit,
          "Block": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].block,
          "streetname": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].streetName,
          "localpostalcode": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].postalCode,
          "localcountry": _.isUndefined(this.primaryAddress[0]) ? "" : this.primaryAddress[0].country,
          "overseasaddress": _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].streetName,
          "overseascity": _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].city,
          "overseasstate": _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].state,
          "overseaspostalcode": _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].postalCode,
          "overseascountry": _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].country,
          "overseasSearchCountry" :  _.isUndefined(this.secondaryAddress[0]) ? "" : this.secondaryAddress[0].country,
          "placeOfBirth" : this.applicationInquiry.demographics.placeOfBirth ? this.applicationInquiry.demographics.placeOfBirth : "",
        });

    })
  }

  //MC => Application search => Save basic info details
  onUpdateBasicProfileMc(){
    this.profileService.addApplicationUpdate(this.buildApplicationUpdate('')).subscribe(
      data => {
        console.log(data) ;
        //open Modal Dialog
        let applicationId = this.store.getItem('MC_IND_APPLICATION_ID') ? this.store.getItem('MC_IND_APPLICATION_ID') : "" ;
        let applicantId = this.store.getItem('MC_IND_APPLICANT_ID') ? this.store.getItem('MC_IND_APPLICANT_ID') : "";
      this.dialogRef.open(AddressComponent, {
        width:'1245px',
        height: '575px',
        panelClass: 'custom-modalbox',
        disableClose : true,
        data: { appSearchOnboardingForMc: data , applicationId: applicationId , applicantId : applicantId}
      })
      },
      (error:any) => {
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent);
        }
        
      }
    )
  }
  unitFieldValidation(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
  
    // Return null if there's no input
    if (!value) return null;
    const alphabetRegex  = /[a-zA-Z]/;
    const invalidSpecialCharRegex = /[^0-9 ,.:;-]/;
    if (alphabetRegex.test(value)) {
      return { alphabetError: 'Only Numbers are allowed' };
    }
    if (invalidSpecialCharRegex.test(value)) {
      return { specialCharError: 'Symbols , . : ; - are allowed.' };
    }
  
    // No errors
    return null;
  }

    //this function triggers when value entered in search place of birth field 
    filterPlaceOfBirth(country:HTMLInputElement){
      country.value = country.value.toUpperCase() ;
      if (country.value == '') {
        // If the search input is empty, show all countries
        this.placeOfBirthCountry = this.country;
    }
    else {
        // Filter countries based on the search input
        this.placeOfBirthCountry = this.country.filter((v: any) => v.COUNTRY.includes(country.value));
        if(this.placeOfBirthCountry.length == 0){
          this.placeOfBirthCountry = this.country;
        }  
    }
  }
}


