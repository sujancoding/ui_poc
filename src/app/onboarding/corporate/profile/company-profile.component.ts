
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ConfirmationDialogComponent } from 'src/app/backoffice/shared/modals/confirmation-dialog.component';
import { CompanyPhone, CompanyProfile, CorporateAddress, CorporateProfile, CorporateProfileCustomerUpdate, UpdateCorporateProfile } from 'src/app/core/model/Company Profile/company-profile';
import { CorporateApplicationInquiry } from 'src/app/core/model/corporateapplicationinquiry/corporateapplicationinquiry';
import { CorporateCustomerInquiry } from 'src/app/core/model/corporatecustomerinquiry/corporatecustomerinquiry';
import { ApplicationService } from 'src/app/core/services/application.service';
import { CorporateService } from 'src/app/core/services/corporate.service';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CompanyAssociateComponent } from '../sow/company.associate.component';
import { ErrorDialogComponent } from '../../modals/errordialog.component';
import { countryArr } from 'src/assets/dropdownvalues';
import { noWhitespaceValidator} from 'src/app/shared/models/phone.model'
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomValidators } from 'ngx-custom-validators';
import { EmailAddress } from 'src/app/core/model/customerupdate/customerupdate';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit {
  public form: FormGroup = Object.create(null);
  corporateApplicationInquiry !: CorporateApplicationInquiry; 
  corporateCustomerInquiry !: CorporateCustomerInquiry;
  saveBioInfo : Boolean = true;
  loader : Boolean = false;
  customerActivate : Boolean = false;
  customerDeactivate : Boolean = false;
  customerFlag : Boolean = false;
  applicationFlag : Boolean = false;
  isReadOnly : Boolean = false;
  corApplicationId : any;
  corCustomerId : any;
  incDate = moment();
  validFrom = moment();
  validTill = moment();
  //added by Shafi @ 08/11/2022
  reviewCorporateCust : boolean =false;
  validDate !: any;
  nationality : any[]=countryArr ;
  incorporationPlace :any[]=countryArr;
  validTillDate !: Date
  validFromDate = new Date();
  tillStartDate !: Date
  tillEndDate !: Date
  showValidMessage : boolean = false;
  filteredCountries: any[] = countryArr;
  filterCountries : any[]= countryArr;
  filterIncorporationCountry : any[] = countryArr;
 // @ViewChild('targetInput', { static: false }) targetInput!: ElementRef<HTMLInputElement>;
 showEditableForBranchChannel = false ;
 
  @Output() companyProfileStatusChanged = new EventEmitter<any>();
  formStatus !: string ;
  showEmptyFields : boolean = false ;
  @Input() corpStepper!: MatStepper; // Receive MatStepper reference from parent component
  showSaveChangesButton : boolean = false;
  isDisableEditCustomerDetails : boolean = true ;
  showEditInfo : boolean = false ;
  isFormControlChanged: boolean = true;
  natureOfBusinessList : any[] = [
    {"value":"Local Money Changer"} , {"value": "Overseas Money Changer"} , {"value":"Other Business"}
  ];
  showApplicationFields = true ;
  getRiskRatingList : any[] = [
    {"VALUE" : "9", "DESC" : "HIGH"},
    {"VALUE" : "5", "DESC" : "MEDIUM"},
    {"VALUE" : "0", "DESC" : "LOW"}
  ];
  showRiskRatingField : boolean = false;

  constructor(private fb: FormBuilder,private router: Router,private corporateService:CorporateService,private alertService:AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any, private applicationService : ApplicationService,private headerService : TitleHeaderService,
    private store : InMemoryCache,private route : ActivatedRoute, public dialogRef: MatDialog,private customerSearchService : CustomerSearchService,
    private snackBar : MatSnackBar) { }

    clearValidators(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.get(key);
        control?.clearValidators();
        control?.updateValueAndValidity();
   });
   
   }

   updateValidations(){
    // Reapply validators 
  
  this.form.controls['CompanyName'].setValidators([ Validators.required, Validators.pattern('[a-zA-Z0-9 .]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator ]);
  this.form.controls['aliasName'].setValidators([Validators.pattern('^[0-9 ]+$'),Validators.maxLength(50)]),
  this.form.controls['email'].setValidators([Validators.required,CustomValidators.email,Validators.maxLength(128)]);
  this.form.controls['RegNo'].setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'),Validators.maxLength(20),this.removeSpaces,noWhitespaceValidator]);
  this.form.controls['Type'].setValidators([Validators.required]);
  this.form.controls['natureOfBusiness'].setValidators([Validators.required]);
  this.form.controls['IncDate'].setValidators([ Validators.required,]);
  this.form.controls['IncPlace'].setValidators([Validators.required,]);
  this.form.controls['RemittanceLicense'].setValidators([this.removeSpaces,Validators.maxLength(50)]);
  this.form.controls['TurnOver'].setValidators([Validators.required,Validators.pattern('^[0-9 ]+$'),this.removeSpaces,noWhitespaceValidator,Validators.maxLength(19)]);
  this.form.controls['ValidFrom'].setValidators([Validators.required]);
  this.form.controls['ValidTill'].setValidators([Validators.required]);
  this.form.controls['IssuingAuthority'].setValidators([Validators.required, this.removeSpaces,Validators.maxLength(50)]);
  this.form.controls['Country'].setValidators([Validators.required]);
  this.form.controls['Level'].setValidators([Validators.pattern('^[0-9 ]+$'),this.removeSpaces,noWhitespaceValidator,Validators.maxLength(40)]);
  this.form.controls['Unit'].setValidators([Validators.maxLength(40),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')]);
  this.form.controls['BuildingName'].setValidators([Validators.required, Validators.pattern('[a-zA-Z0-9 ,.:;-]*$'),this.removeSpaces,this.whitespaceValidator,Validators.maxLength(60)]);
  this.form.controls['StreetName'].setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9 ,.:;-]+'),this.removeSpaces,this.whitespaceValidator,Validators.maxLength(60)]);
  this.form.controls['CountryOffice'].setValidators([Validators.required]);
  this.form.controls['PostalCode'].setValidators([Validators.required,Validators.pattern('^[0-9 ]+$'),this.postalNumberValidator,this.removeSpaces,noWhitespaceValidator]);
  this.form.controls['CompanyPhone'].setValidators([Validators.required,Validators.pattern("[0-9 ]*$"),this.phoneNumbersValidator,this.removeSpaces,noWhitespaceValidator]);
  this.form.controls['companyCountry'].setValidators([Validators.pattern('[a-zA-Z .]*$')]);
  this.form.controls['profileCountry'].setValidators([Validators.pattern('[a-zA-Z .]*$')]);
  this.form.controls['incorporationCountry'].setValidators([Validators.pattern('[a-zA-Z .]*$')]); //newly added on 18Jul2024 , to search incorporation country in Incorporation Place Dropdown while updating customer details.
  // After updating validators, update validity status
  this.form.clearValidators();
  this.form.updateValueAndValidity();
    
   }

  ngOnInit(): void {
    this.headerService.setTitle('Company Profile');
    console.log("company profile load")
    this.form = this.fb.group({
      CompanyName: [null ,[Validators.compose([Validators.required]), Validators.pattern('[a-zA-Z0-9 .]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator]],
      aliasName : [null, [Validators.pattern('^[0-9 ]+$'),Validators.maxLength(50)]], //Non mandatory field
      email: [null ,[Validators.required,CustomValidators.email,Validators.maxLength(128)]],
      RegNo: [null ,[Validators.compose([Validators.required]), Validators.pattern('^[a-zA-Z0-9 ]+$'),Validators.maxLength(20),this.removeSpaces,noWhitespaceValidator]],
      Type: [null ,[Validators.compose([Validators.required])]],
      natureOfBusiness : [null ,[Validators.compose([Validators.required])]],
      IncDate: [null ,Validators.compose([Validators.required]),],
      IncPlace: [null ,[Validators.compose([Validators.required])]],
      RemittanceLicense: [null ,[this.removeSpaces,Validators.maxLength(50)]],
      TurnOver: [null ,[Validators.compose([Validators.required]), Validators.pattern('^[0-9 ]+$'),this.removeSpaces,noWhitespaceValidator,Validators.maxLength(19)]],
      ValidFrom: [null ,Validators.compose([Validators.required])],
      ValidTill: [null ,Validators.compose([Validators.required])],
      IssuingAuthority: [null,[this.removeSpaces,Validators.maxLength(50)]],
      Country: [null ,[Validators.compose([Validators.required])]],
      Level: [null ,[Validators.compose([Validators.pattern('^[0-9 ]+$'),this.removeSpaces,noWhitespaceValidator,Validators.maxLength(40)])]],
      Unit: [null ,[Validators.compose([Validators.maxLength(40),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')])]],
      BuildingName: [null ,[Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9 ,.:;-]*$'),this.removeSpaces,this.whitespaceValidator,Validators.maxLength(60)])]],
      StreetName: [null ,[Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 ,.:;-]+'),this.removeSpaces,this.whitespaceValidator,Validators.maxLength(60)])]],
      CountryOffice: [null ,[Validators.compose([Validators.required])]],
      PostalCode: [null ,[Validators.compose([Validators.required,Validators.pattern('^[0-9 ]+$'),this.postalNumberValidator,this.removeSpaces,noWhitespaceValidator])]],
      CompanyPhone: [null ,[Validators.compose([Validators.required,Validators.pattern("[0-9 ]*$"),this.phoneNumbersValidator,this.removeSpaces,noWhitespaceValidator])]],
      companyCountry : [null,Validators.compose([Validators.pattern('[a-zA-Z .]*$')])], //newly added on 15Sep2023 , to search company country in Company Country Dropdown
      profileCountry : [null,Validators.compose([Validators.pattern('[a-zA-Z .]*$')])], //newly added on 15Sep2023 , to search company country in Company Country Dropdown
      incorporationCountry : [null,Validators.compose([Validators.pattern('[a-zA-Z .]*$')])] ,//newly added on 18Jul2024 , to search incorporation country in Incorporation Place Dropdown
      riskRating : [null]

    })
     //show empty fields so that the customers will share their company profile .
   if (this.data.appOnboardingForMc) {
    this.headerService.setTitle('Account Opening');
    this.showEmptyFields = true;
    this.saveBioInfo = false;
  }

 
    //MC => Application Search => View and editable company profile info with application inquiry details
     if (this.data.appSearchOnboardingForMc) {
      this.headerService.setTitle('Account Opening');
      let applicationId = this.data.applicationId ? this.data.applicationId : "" ;
      let applicantId = this.data.applicantId ? this.data.applicantId : "" ;
      this.store.setItem('MC_CORP_APPLICATIONID',applicationId) ;
      this.store.setItem('MC_CORP_APPLICANTID',applicantId) ;
      this.showEditableForBranchChannel = true;
      this.saveBioInfo = false;
      this.isReadOnly = false ;
      this.form.patchValue({
      "CompanyName": this.data.appSearchOnboardingForMc.corporate.companyName, 
      "email" : this.data.appSearchOnboardingForMc.corporate.email.emailId ? this.data.appSearchOnboardingForMc.corporate.email.emailId : "", 
      "RegNo": this.data.appSearchOnboardingForMc.corporate.registrationNo,
      "Type": this.data.appSearchOnboardingForMc.corporate.registrationType,
      "natureOfBusiness" : this.data.appSearchOnboardingForMc.corporate.natureOfBusiness ? this.data.appSearchOnboardingForMc.corporate.natureOfBusiness : "",
      "IncDate":this.data.appSearchOnboardingForMc.corporate.incorporationDate,
      "IncPlace": this.data.appSearchOnboardingForMc.corporate.incorporationPlace,
      "RemittanceLicense": this.data.appSearchOnboardingForMc.corporate.license,
      "TurnOver": this.data.appSearchOnboardingForMc.corporate.turnOver,
      "ValidFrom": this.data.appSearchOnboardingForMc.corporate.validFrom,
      "ValidTill": this.data.appSearchOnboardingForMc.corporate.validTill,
      "IssuingAuthority": this.data.appSearchOnboardingForMc.corporate.issuingAuthority,
      "Country" :this.data.appSearchOnboardingForMc.corporate.issuingCountry,
      "Level":this.data.appSearchOnboardingForMc.corporate.address ? this.data.appSearchOnboardingForMc.corporate.address.level : "",
      "Unit": this.data.appSearchOnboardingForMc.corporate.address ? this.data.appSearchOnboardingForMc.corporate.address.unit : "",
      "BuildingName": this.data.appSearchOnboardingForMc.corporate.address ? this.data.appSearchOnboardingForMc.corporate.address.building : "",
      "StreetName": this.data.appSearchOnboardingForMc.corporate.address ? this.data.appSearchOnboardingForMc.corporate.address.streetName : "",
      "CountryOffice":this.data.appSearchOnboardingForMc.corporate.address ? this.data.appSearchOnboardingForMc.corporate.address.countryCode : "",
      "PostalCode":this.data.appSearchOnboardingForMc.corporate.address ? this.data.appSearchOnboardingForMc.corporate.address.postalCode : "",
      "CompanyPhone": this.data.appSearchOnboardingForMc.corporate.phone.phoneNumber,
      "companyCountry" : this.data.appSearchOnboardingForMc.corporate.address ? this.data.appSearchOnboardingForMc.corporate.address.countryCode : "",
      "profileCountry" : this.data.appSearchOnboardingForMc.corporate.issuingCountry,

    })
    }

    //Backoffice > Customer search > View company profile
    if(this.data.isCompanyProfileReview){
      this.headerService.setTitle('Customers');
      this.isReadOnly = true;
      this.showRiskRatingField = true;
      this.customerFlag = true;
      this.showEditInfo = true ;
      this.isDisableEditCustomerDetails = false ; //enabling edit customer details button .
      this.saveBioInfo = false;
      this.customerActivate = true;
      this.customerDeactivate = true;
      this.showApplicationFields = false ; //show aliasname fields
      if(this.data.isCompanyProfileReview.status == "0"){
        this.customerActivate = true;
        this.customerDeactivate = false;
    }
    if(this.data.isCompanyProfileReview.status == "1"){
      this.customerActivate = false;
      this.customerDeactivate = true;
  }
 
 
  if(this.data.isCompanyProfileReview.registrationType == "LC"){ //Type = "Local Company"
     //nature of business dropdown value changes :
     this.natureOfBusinessList = [
      {"value": "Local Money Changer"} , {"value":"Other Business"}
    ] ;
  }
  else if(this.data.isCompanyProfileReview.registrationType == "RA" || this.data.isCompanyProfileReview.registrationType == "OC"){ //Type = "Remittance Agent" or "Overseas Company"
    //nature of business dropdown value changes :
    this.natureOfBusinessList = [
      {"value": "Overseas Money Changer"} , {"value":"Other Business"}
    ] ;
  }
      this.form.patchValue({
      "CompanyName": this.data.isCompanyProfileReview.companyName, 
      "riskRating": this.getRiskRatingList.find(option => option.DESC == this.data.isCompanyProfileReview.riskRating)?.VALUE ?? null,
      "aliasName" : this.data.isCompanyProfileReview.name.aliasName ? this.data.isCompanyProfileReview.name.aliasName : "" ,
      "email" : this.data.isCompanyProfileReview.email.emailId ? this.data.isCompanyProfileReview.email.emailId : "" ,
      "RegNo": this.data.isCompanyProfileReview.registrationNo,
      "Type": this.data.isCompanyProfileReview.registrationType,
      "natureOfBusiness" : this.data.isCompanyProfileReview.natureOfBusiness ? this.data.isCompanyProfileReview.natureOfBusiness : "" ,
      "IncDate":this.data.isCompanyProfileReview.incorporationDate,
      "IncPlace": this.data.isCompanyProfileReview.incorporationPlace,
      "RemittanceLicense": this.data.isCompanyProfileReview.license,
      "TurnOver": this.data.isCompanyProfileReview.turnOver,
      "ValidFrom": this.data.isCompanyProfileReview.validFrom,
      "ValidTill": this.data.isCompanyProfileReview.validTill,
      "IssuingAuthority": this.data.isCompanyProfileReview.issuingAuthority,
      "Country" :this.data.isCompanyProfileReview.issuingCountry,
      "Level": this.data.isCompanyProfileReview.address[0].level ? this.data.isCompanyProfileReview.address[0].level : "",
      "Unit": this.data.isCompanyProfileReview.address[0].unit ? this.data.isCompanyProfileReview.address[0].unit : "",
      "BuildingName": this.data.isCompanyProfileReview.address[0].block,
      "StreetName": this.data.isCompanyProfileReview.address[0].streetName,
      "CountryOffice": this.data.isCompanyProfileReview.address[0].country,
      "PostalCode": this.data.isCompanyProfileReview.address[0].postalCode,
      "CompanyPhone": this.data.isCompanyProfileReview.phone.phoneNo,
      "companyCountry" : this.data.isCompanyProfileReview.address[0].country,
      "profileCountry" : this.data.isCompanyProfileReview.issuingCountry,
      })
      // Listen for changes whenever the formcontrol value changes on the entire form
    this.form.valueChanges.subscribe(() => {   
      this.isFormControlChanged = false;
    });
    }

    //application search in backoffice
   if(this.data.applicationCompanyProfileReview){
    this.headerService.setTitle('Account Opening');
    this.clearValidators(this.form);
     this.applicationFlag = true;
     this.saveBioInfo = false;
     this.isReadOnly = true;
     this.isReadOnly = true;
      this.form.patchValue({
      "CompanyName": this.data.applicationCompanyProfileReview.corporate.companyName, 
      "email" : this.data.applicationCompanyProfileReview.corporate.email.emailId ? this.data.applicationCompanyProfileReview.corporate.email.emailId : "",
      "RegNo": this.data.applicationCompanyProfileReview.corporate.registrationNo,
      "Type": this.data.applicationCompanyProfileReview.corporate.registrationType,
      "natureOfBusiness": this.data.applicationCompanyProfileReview.corporate.natureOfBusiness ? this.data.applicationCompanyProfileReview.corporate.natureOfBusiness : "",
      "IncDate":this.data.applicationCompanyProfileReview.corporate.incorporationDate,
      "IncPlace": this.data.applicationCompanyProfileReview.corporate.incorporationPlace,
      "RemittanceLicense": this.data.applicationCompanyProfileReview.corporate.license,
      "TurnOver": this.data.applicationCompanyProfileReview.corporate.turnOver,
      "ValidFrom": this.data.applicationCompanyProfileReview.corporate.validFrom,
      "ValidTill": this.data.applicationCompanyProfileReview.corporate.validTill,
      "IssuingAuthority": this.data.applicationCompanyProfileReview.corporate.issuingAuthority,
      "Country" :this.data.applicationCompanyProfileReview.corporate.issuingCountry,
      "Level":this.data.applicationCompanyProfileReview.corporate.address ? this.data.applicationCompanyProfileReview.corporate.address.level : "",
      "Unit": this.data.applicationCompanyProfileReview.corporate.address ? this.data.applicationCompanyProfileReview.corporate.address.unit : "",
      "BuildingName": this.data.applicationCompanyProfileReview.corporate.address ? this.data.applicationCompanyProfileReview.corporate.address.building : "",
      "StreetName": this.data.applicationCompanyProfileReview.corporate.address ? this.data.applicationCompanyProfileReview.corporate.address.streetName : "",
      "CountryOffice":this.data.applicationCompanyProfileReview.corporate.address ? this.data.applicationCompanyProfileReview.corporate.address.countryCode : "",
      "PostalCode":this.data.applicationCompanyProfileReview.corporate.address ? this.data.applicationCompanyProfileReview.corporate.address.postalCode : "",
      "CompanyPhone": this.data.applicationCompanyProfileReview.corporate.phone.phoneNumber,
      "companyCountry" : this.data.applicationCompanyProfileReview.corporate.address ? this.data.applicationCompanyProfileReview.corporate.address.countryCode : "",
      "profileCountry" : this.data.applicationCompanyProfileReview.corporate.issuingCountry,

    })
   }

   //fetching applicationId from url params and calling applicationInquiry , only app status is new or pending
  if(this.store.getItem('APPLICATIONSTATUS') == "NEW" || this.store.getItem('APPLICATIONSTATUS') == "PENDING" ){
  this.route.queryParams.subscribe((params: any)=> {
  this.corApplicationId = params.application;
  if(this.corApplicationId != undefined){
   this.corporateService.getCorporateApplicationInquiry(this.corApplicationId).subscribe(data => {
    console.log(data);
    if(this.store.getItem('APPLICATIONSTATUS') == "PENDING"){
      this.saveBioInfo = false;
      this.isReadOnly = true;
    }
    this.corporateApplicationInquiry = data;
    this.form.patchValue({
      "CompanyName": this.corporateApplicationInquiry.corporate.companyName, 
      "email" : this.corporateApplicationInquiry.corporate.email.emailId ? this.corporateApplicationInquiry.corporate.email.emailId : "",
      "RegNo": this.corporateApplicationInquiry.corporate.registrationNo,
      "Type": this.corporateApplicationInquiry.corporate.registrationType,
      "natureOfBusiness" : this.corporateApplicationInquiry.corporate.natureOfBusiness ? this.corporateApplicationInquiry.corporate.natureOfBusiness : "",
      "IncDate":this.corporateApplicationInquiry.corporate.incorporationDate,
      "IncPlace": this.corporateApplicationInquiry.corporate.incorporationPlace,
      "RemittanceLicense": this.corporateApplicationInquiry.corporate.license,
      "TurnOver": this.corporateApplicationInquiry.corporate.turnOver,
      "ValidFrom": this.corporateApplicationInquiry.corporate.validFrom,
      "ValidTill": this.corporateApplicationInquiry.corporate.validTill,
      "IssuingAuthority": this.corporateApplicationInquiry.corporate.issuingAuthority,
      "Country" :this.corporateApplicationInquiry.corporate.issuingCountry,
      "Level":this.corporateApplicationInquiry.corporate.address ? this.corporateApplicationInquiry.corporate.address.level : "",
      "Unit": this.corporateApplicationInquiry.corporate.address ? this.corporateApplicationInquiry.corporate.address.unit : "",
      "BuildingName": this.corporateApplicationInquiry.corporate.address ? this.corporateApplicationInquiry.corporate.address.building : "",
      "StreetName": this.corporateApplicationInquiry.corporate.address ? this.corporateApplicationInquiry.corporate.address.streetName : "",
      "CountryOffice":this.corporateApplicationInquiry.corporate.address ? this.corporateApplicationInquiry.corporate.address.countryCode : "",
      "PostalCode":this.corporateApplicationInquiry.corporate.address ? this.corporateApplicationInquiry.corporate.address.postalCode : "",
      "CompanyPhone": this.corporateApplicationInquiry.corporate.phone.phoneNumber,
      "companyCountry" : this.corporateApplicationInquiry.corporate.address ? this.corporateApplicationInquiry.corporate.address.countryCode : "",
      "profileCountry" : this.corporateApplicationInquiry.corporate.issuingCountry,

    })
   },
     //error handling Completed on 06-07-2023 - <DN>
   (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  })
  }
  });
}

//fetching customerId from url params and calling customerInquiry 
if(this.store.getItem('APPLICATIONSTATUS') == "APPROVED" || this.store.getItem('CUSTOMER_STATUS')=="ACTIVE"){
  this.saveBioInfo = false;
  this.isReadOnly = true;
  this.route.queryParams.subscribe((params: any)=> {
    let customerId = params.customer;
    if(customerId != undefined){
      this.corporateService.getCorporateCustomerInquiry(customerId).subscribe(data => {
        this.corporateCustomerInquiry = data;
        
      this.form.patchValue({
        "CompanyName": this.corporateCustomerInquiry.companyName, 
        "email" : this.corporateCustomerInquiry.email.emailId ? this.corporateCustomerInquiry.email.emailId : "" ,
        "RegNo": this.corporateCustomerInquiry.registrationNo,
        "Type": this.corporateCustomerInquiry.registrationType,
        "natureOfBusiness" : this.corporateCustomerInquiry.natureOfBusiness ? this.corporateCustomerInquiry.natureOfBusiness : "",
        "IncDate": this.corporateCustomerInquiry.incorporationDate,
        "IncPlace": this.corporateCustomerInquiry.incorporationPlace,
        "RemittanceLicense": this.corporateCustomerInquiry.license,
        "TurnOver": this.corporateCustomerInquiry.turnOver,
        "ValidFrom":this.corporateCustomerInquiry.validFrom,
        "ValidTill": this.corporateCustomerInquiry.validTill,
        "IssuingAuthority": this.corporateCustomerInquiry.issuingAuthority,
        "Country" :this.corporateCustomerInquiry.issuingCountry,
        "Level": this.corporateCustomerInquiry.address[0].level ? this.corporateCustomerInquiry.address[0].level : "",
        "Unit": this.corporateCustomerInquiry.address[0].unit ? this.corporateCustomerInquiry.address[0].unit : "",
        "BuildingName": this.corporateCustomerInquiry.address[0].block,
        "StreetName": this.corporateCustomerInquiry.address[0].streetName,
        "CountryOffice": this.corporateCustomerInquiry.address[0].country,
        "PostalCode": this.corporateCustomerInquiry.address[0].postalCode,
        "CompanyPhone": this.corporateCustomerInquiry.phone.phoneNo,
        "companyCountry" :  this.corporateCustomerInquiry.address[0].country,
        "profileCountry" : this.corporateCustomerInquiry.issuingCountry,
        
        })
      },
       //error handling Completed on 06-07-2023 - <DN>
    (error:any)=>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    })
    
    }
  });

  }
  
  //BackOffice > Approve Payee Screen
  if(this.data.reviewCorpCustomerDetails){
    this.headerService.setTitle('Approve Payee');
    this.reviewCorporateCust = true;
    this.saveBioInfo = false;
    this.isReadOnly = true;
    this.form.patchValue({
      "CompanyName": this.data.reviewCorpCustomerDetails.companyName, 
      "email" : this.data.reviewCorpCustomerDetails.email.emailId ? this.data.reviewCorpCustomerDetails.email.emailId : "",
      "RegNo": this.data.reviewCorpCustomerDetails.registrationNo,
      "Type": this.data.reviewCorpCustomerDetails.registrationType,
      "natureOfBusiness" : this.data.reviewCorpCustomerDetails.natureOfBusiness ? this.data.reviewCorpCustomerDetails.natureOfBusiness : "" , 
      "IncDate":this.data.reviewCorpCustomerDetails.incorporationDate,
      "IncPlace": this.data.reviewCorpCustomerDetails.incorporationPlace,
      "RemittanceLicense": this.data.reviewCorpCustomerDetails.license,
      "TurnOver": this.data.reviewCorpCustomerDetails.turnOver,
      "ValidFrom": this.data.reviewCorpCustomerDetails.validFrom,
      "ValidTill": this.data.reviewCorpCustomerDetails.validTill,
      "IssuingAuthority": this.data.reviewCorpCustomerDetails.issuingAuthority,
      "Country" :this.data.reviewCorpCustomerDetails.issuingCountry,
      "Level":this.data.reviewCorpCustomerDetails.address[0].level ? this.data.reviewCorpCustomerDetails.address[0].level : "",
      "Unit": this.data.reviewCorpCustomerDetails.address[0].unit ? this.data.reviewCorpCustomerDetails.address[0].unit : "",
      "BuildingName": this.data.reviewCorpCustomerDetails.address[0].block,
      "StreetName": this.data.reviewCorpCustomerDetails.address[0].streetName,
      "CountryOffice":this.data.reviewCorpCustomerDetails.address[0].country,
      "PostalCode":this.data.reviewCorpCustomerDetails.address[0].postalCode,
      "CompanyPhone": this.data.reviewCorpCustomerDetails.phone.phoneNo,
      "companyCountry" : this.data.reviewCorpCustomerDetails.address[0].country,
      "profileCountry" : this.data.reviewCorpCustomerDetails.issuingCountry,
    })

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
    
      if (value && value.match("^[ .]+")) {
        // if the value consists of whitespace at beginning of string , return an error object
        return { "isWhitespace": true };
      }
      // otherwise, return null (no error)
      return null;
      
    }
    phoneNumbersValidator(control: AbstractControl) {
    
      const value = control.value;
    
      if (value && value.match("^[0]+")) {
        // if the value consists of zero at beginning of string , return an error object
        return { "isStartzero": true };
      }
      const startsWithNumber = /^[0-9]/.test(value)
      // if (value && startsWithNumber) { // Company number start with number and the length is less than 6 , return a error object
      //   return { "minlength": true };
      // }
      // otherwise, return null (no error)
      return null;
      
  }
  postalNumberValidator(control: AbstractControl){
    const value = control.value;
    const startsWithNum = /^[0-9]/.test(value)
    if (value && startsWithNum) { // Postal code start with number and the length is less than 6 , return a error object
      console.log("The postal code value is" + value);
      
      //return { "minLength": true };
      
      
    }
    // otherwise, return null (no error)
    return null;
    
  }
  noWhitespaceValidator(control: AbstractControl) {
    const isSpace = (control.value || '').match(/\s/g);
    if(!isSpace && control.value != ""){
      return isSpace ? {'whitespace': true} : null;
    }
    
    
  }
  onSave(){
    this.saveBioInfo = false;
    this.loader = true;
    this.corporateService.corporateApplicationUpdate(this.buildCompanyDetails('MOBILE'),'').subscribe(data => {
      console.log(data);
      this.router.navigate(['profile/corporate-dashboard']);
      this.saveBioInfo = true;
      this.loader = false;
      this.applicationService.corporateScreenstatus('companyProfileFlag')
      this.alertService.clear()
      this.alertService.success("Form Successful!!");
      //success message
    },
     //error handling Completed on 06-07-2023 - <DN>
    (error : any )=> {
      console.log(error.message);
      this.saveBioInfo = true;
      this.loader = false;
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
      this.alertService.clear()
      this.alertService.error("Company Profile Form Failed. Try Again");
   
     })


    //this.router.navigate(['company/company-associate'])
  }
  
  buildCompanyDetails(channel:string): CompanyProfile{
    let applicationId :string = "";
    let applicantId : string = "";
    if(channel == "MOBILE"){ //if its corporate onboarding from mobile/laptop , get appId and applicantId from login response
      applicationId = this.store.getItem('APPLICATION_ID') ? this.store.getItem('APPLICATION_ID') : "";
      applicantId = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "" ;
    }
    else if(channel == ""){ //MC
      applicationId = this.store.getItem('MC_CORP_APPLICATIONID') ? this.store.getItem('MC_CORP_APPLICATIONID') : "" ;
      applicantId = this.store.getItem('MC_CORP_APPLICANTID') ? this.store.getItem('MC_CORP_APPLICANTID') : "" ;
    }
    return new CompanyProfile({
      "applicationId" : applicationId ,
      "applicantId" : applicantId  ,
      "corporate" : this.buildCompanyInfo(''),
    })
  }

  buildCompanyInfo(indicator:string): CorporateProfile{
    //date format(DD/MM/YYYY) while sending request to server
    this.incDate = moment(this.form.controls['IncDate'].value);
    const incorporationDate = this.incDate.format('YYYY') + "-" + this.incDate.format('MM') + "-" + this.incDate.format('DD');

    this.validFrom = moment(this.form.controls['ValidFrom'].value);
    const validFromDate = this.validFrom.format('YYYY') + "-" + this.validFrom.format('MM') + "-" + this.validFrom.format('DD');

    this.validTill = moment(this.form.controls['ValidTill'].value);
    const validTillDate = this.validTill.format('YYYY') + "-" + this.validTill.format('MM') + "-" + this.validTill.format('DD');
    var corporateId : any ;
     if(indicator == "STAFF_CUSTOMER_UPDATE"){
      corporateId = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "" ;
     }
     else{
      corporateId = this.store.getItem('USER_ID') ? this.store.getItem('USER_ID') : "" ;
      let mcCorporateApplicantId = this.store.getItem('MC_CORP_APPLICANTID') ? this.store.getItem('MC_CORP_APPLICANTID') : "" ;
      if(mcCorporateApplicantId != ""){
      corporateId = mcCorporateApplicantId ;
      }
     }
    return new CorporateProfile({
       "corporateId" : corporateId,
		    "companyName" : this.form.controls['CompanyName'].value,
        "registrationNo" :  this.form.controls['RegNo'].value,
        "registrationType" : this.form.controls['Type'].value,
        "incorporationDate" : incorporationDate,
        "incorporationPlace" : this.form.controls['IncPlace'].value,
        "license" : this.form.controls['RemittanceLicense'].value,
        "turnOver" : this.form.controls['TurnOver'].value,
        "validFrom" : validFromDate,
        "validTill" : validTillDate,
        "issuingAuthority" : this.form.controls['IssuingAuthority'].value,
        "issuingCountry" : this.form.controls['Country'].value ,
        "natureOfBusiness" : this.form.controls['natureOfBusiness'].value ,
        "address": this.buildCompanyAddress(),
        "phone": this.buildPhone(),
        "email" : this.buildEmailAddress()
    }
    )
  }

  buildUpdateCompanyInfo(indicator:string):CorporateProfileCustomerUpdate{
    //date format(DD/MM/YYYY) while sending request to server
    this.incDate = moment(this.form.controls['IncDate'].value);
    const incorporationDate = this.incDate.format('YYYY') + "-" + this.incDate.format('MM') + "-" + this.incDate.format('DD');

    this.validFrom = moment(this.form.controls['ValidFrom'].value);
    const validFromDate = this.validFrom.format('YYYY') + "-" + this.validFrom.format('MM') + "-" + this.validFrom.format('DD');

    this.validTill = moment(this.form.controls['ValidTill'].value);
    const validTillDate = this.validTill.format('YYYY') + "-" + this.validTill.format('MM') + "-" + this.validTill.format('DD');
    var corporateId : any ;
     if(indicator == "STAFF_CUSTOMER_UPDATE"){
      corporateId = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "" ;
     }
    return new CorporateProfileCustomerUpdate({
       "corporateId" : corporateId,
        "aliasName" : this.form.controls['aliasName'].value ? this.form.controls['aliasName'].value : "" ,
		    "companyName" : this.form.controls['CompanyName'].value,
        "registrationNo" :  this.form.controls['RegNo'].value,
        "registrationType" : this.form.controls['Type'].value,
        "incorporationDate" : incorporationDate,
        "incorporationPlace" : this.form.controls['IncPlace'].value,
        "license" : this.form.controls['RemittanceLicense'].value,
        "turnOver" : this.form.controls['TurnOver'].value,
        "validFrom" : validFromDate,
        "validTill" : validTillDate,
        "issuingAuthority" : this.form.controls['IssuingAuthority'].value,
        "issuingCountry" : this.form.controls['Country'].value ,
        "natureOfBusiness" : this.form.controls['natureOfBusiness'].value ,
        "address": this.buildCompanyAddress(),
        "phone": this.buildPhone(),
        "riskRating" : this.form.controls['riskRating'].value ? this.form.controls['riskRating'].value : null ,
        "email" : this.buildEmailAddress()
    }
    )
  }
  
  buildCompanyAddress(): CorporateAddress{
    return new CorporateAddress({
      "level": this.form.controls['Level'].value ? this.form.controls['Level'].value : "" ,
      "unit": this.form.controls['Unit'].value ? this.form.controls['Unit'].value : "" ,
      "building" : this.form.controls['BuildingName'].value ,
      "streetName" : this.form.controls['StreetName'].value ,
      "countryCode" : this.form.controls['CountryOffice'].value , //doubt ask kalai
      "postalCode" : this.form.controls['PostalCode'].value 
    }
    )
  }
  buildPhone():CompanyPhone{
   return new CompanyPhone({
    "phoneNumber" : this.form.controls['CompanyPhone'].value,
    "phoneCountryCode" : "SG"
   })
  }

  buildEmailAddress():EmailAddress{
    return new EmailAddress({
      "emailAddress" : this.form.controls['email'].value ? this.form.controls['email'].value : "" 
    })
  }
  
  //Back Office > application search > route company Associate Component in Modal popup
  openCompanyAssociate(){
    let applicationId = this.store.getItem('CORPORATE_APPLICATION_ID');
    this.corporateService.getCorporateApplicationInquiry(applicationId).subscribe(data => {
    this.dialogRef.open(CompanyAssociateComponent,{
      data: { applicationCompanyAssociateReview:data , applicationId : applicationId },
      panelClass: 'custom-modalbox',
      width:'1245px',
      height:'575px',
      disableClose : true
    })
  },
    //error handling Completed on 06-07-2023 - <DN>
   (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  });
  }
  //Back Office > customer search > route company Associate Component in Modal popup
  navigateCompanyAssociate(){
    let customerId = this.store.getItem('CUSTOMER_ID');
    this.corporateService.getCorporateCustomerInquiry(customerId).subscribe(data => {
    this.dialogRef.open((CompanyAssociateComponent),{
      data: { isCompanyAssociateReview: data },
      panelClass: 'custom-modalbox',
      width:'1245px',
      height: '575px',
      disableClose : true
    })
  },
   //error handling Completed on 06-07-2023 - <DN>
   (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  });
  }

   //Customer Listings - rejecting / inactive a customer
   openRejected() {
    this.dialogRef.open(ConfirmationDialogComponent, {
      data: { inactiveCustomer : true }
    })
  }
//Customer Listings - activate a customer
  openActivated(){
    // let customerId = this.store.getItem('CUSTOMER_ID');
    // let status = '1';
    // this.customerSearchService.customerStatusUpdate(customerId,status).subscribe(data => {
    this.dialogRef.open(ConfirmationDialogComponent, {
      data: { activeCustomer : true }
    })
 // });
  }
public validEndDateChange(event: MatDatepickerInputEvent<any>): void {
  this.tillEndDate = event.value._d;
  if (new Date(this.tillStartDate).getTime() == new Date(this.tillEndDate).getTime()) {
    console.log("Valid from date should not equal to valid till date");
    this.form.controls['ValidTill'].setErrors({'inValid': true});
  }
  else{
    this.form.controls['ValidTill'].setErrors(null);
    this.form.controls['ValidFrom'].setErrors(null);
  }
  this.showValidMessage = false;
}
  public validStartDateChange(event: MatDatepickerInputEvent<any>):void{
    this.tillStartDate = event.value._d;
    if(new Date(this.tillStartDate).getTime() > new Date(this.tillEndDate).getTime()){ // The valid from Date should be greater than valid till date ,other return error
      console.log("Valid from date is less than valid till date");
      this.showValidMessage = true;
    }
    else if(new Date(this.tillStartDate).getTime() < new Date(this.tillEndDate).getTime()){
      this.showValidMessage = false;
    }
     if (new Date(this.tillStartDate).getTime() == new Date(this.tillEndDate).getTime()) {
      setTimeout(()=>{
        console.log("Valid from date should not equal to valid till date");
      this.form.controls['ValidFrom'].setErrors({'isValid': true});
      this.showValidMessage = false;
      },10)
    }
    else{
      this.form.controls['ValidFrom'].setErrors(null);
    }
  }
  onSelectChange(e : any){
    console.log("The value is"+ e.value);
    var companyType = e.value;
   if(companyType == "RA"){
    this.form.controls['RemittanceLicense'].setValidators([Validators.pattern("^[a-zA-Z0-9 ]+"),Validators.required,Validators.maxLength(50),this.removeSpaces,noWhitespaceValidator]);
    this.form.controls['RemittanceLicense'].updateValueAndValidity();
    this.form.controls['RemittanceLicense'].markAsTouched();
    this.form.controls['IssuingAuthority'].setValidators([Validators.pattern("^[a-zA-Z0-9 ]+"),Validators.required,Validators.maxLength(50),this.removeSpaces,noWhitespaceValidator]);
    this.form.controls['IssuingAuthority'].updateValueAndValidity();
    this.form.controls['IssuingAuthority'].markAsTouched();
    //nature of business dropdown value changes :
    this.natureOfBusinessList = [
      {"value": "Overseas Money Changer"} , {"value":"Other Business"}
    ] ;
  } 
  else if(companyType == "LC"){
    this.form.controls['RemittanceLicense'].setValidators([Validators.pattern("^[a-zA-Z0-9 ]+"),Validators.maxLength(50),this.removeSpaces,noWhitespaceValidator]);
    this.form.controls['RemittanceLicense'].updateValueAndValidity();
    this.form.controls['IssuingAuthority'].setValidators([Validators.pattern("^[a-zA-Z0-9 ]+"),Validators.maxLength(50),this.removeSpaces,noWhitespaceValidator]);
    this.form.controls['IssuingAuthority'].updateValueAndValidity();
     //nature of business dropdown value changes :
     this.natureOfBusinessList = [
      {"value": "Local Money Changer"} , {"value":"Other Business"}
    ] ;
  }
  else if(companyType == "OC"){
     //nature of business dropdown value changes :
     this.natureOfBusinessList = [
      {"value": "Overseas Money Changer"} , {"value":"Other Business"}
    ] ;
  }
  }

  filteredIncorporationCountry(country:HTMLInputElement){
    country.value = country.value.toUpperCase() ;
    if (country.value == '') {
      // If the search input is empty, show all countries
      this.filterIncorporationCountry = this.incorporationPlace;
  }
  else {
      // Filter countries based on the search input
      this.filterIncorporationCountry = this.incorporationPlace.filter((v: any) => v.COUNTRY.includes(country.value));
      if(this.filterIncorporationCountry.length == 0){
        this.filterIncorporationCountry = this.incorporationPlace;
      }  
  }
  }

  //this function triggers when value entered in search  country field 
  filterCountry(country:HTMLInputElement){
    country.value = country.value.toUpperCase() ;
    if (country.value == '') {
      // If the search input is empty, show all countries
      this.filteredCountries = this.nationality;
  }
  else {
      // Filter countries based on the search input
      this.filteredCountries = this.nationality.filter((v: any) => v.COUNTRY.includes(country.value));
      if(this.filteredCountries.length == 0){
        this.filteredCountries = this.nationality;
      }  
  }
  }
  searchCountry(country:HTMLInputElement){
    country.value = country.value.toUpperCase() ;
    if (country.value == '') {
      // If the search input is empty, show all nationalities
      this.filterCountries = this.nationality;
  }
  else {
      // Filter nationality based on the search input
      this.filterCountries = this.nationality.filter((v: any) => v.COUNTRY.includes(country.value));
      if(this.filterCountries.length == 0){
        this.filterCountries = this.nationality;
      }  
  }
  }

  onCompanyProfileOnboardingSubmit(){
    this.corporateService.corporateApplicationUpdate(this.buildCompanyDetails(''),'MC').subscribe((datas:any)=>{
      this.formStatus = "Company Profile Form Submitted Sucessfully"
      this.companyProfileStatusChanged.emit('Submitted');
      this.corpStepper.next() ;
    },
      //error handling Completed on 06-07-2023 - <DN>
      (error : any )=> {
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent) ;
        }
        this.alertService.clear()
        this.alertService.error("Company Profile Form Failed. Try Again");
     
       }
    )
   
  }

  // This function will be trigger automatically  based on the stepper changes in the parent component
  updateStatus(event: any) {
    if(this.formStatus == "Company Profile Form Submitted Sucessfully"){
     this.form.valueChanges.subscribe(() => { 
       this.companyProfileStatusChanged.emit('In Progress');  //Listen for changes whenever the formcontrol value changes ,we change status In-Progress
     });
    }
    else{
     this.companyProfileStatusChanged.emit(this.form.valid ? 'Completed' : 'In Progress');  // Emit an stepper status to the parent-stepper component
    }
  
   }

   //MC => Application search => Save company info details
   onUpdateCompanyProfileMc(){
    this.corporateService.corporateApplicationUpdate(this.buildCompanyDetails(''),'MC').subscribe((data:any)=>{
      let applicationId =  this.store.getItem('MC_CORP_APPLICATIONID') ? this.store.getItem('MC_CORP_APPLICATIONID') : "" ;
      let applicantId = this.store.getItem('MC_CORP_APPLICANTID') ? this.store.getItem('MC_CORP_APPLICANTID') : "" ;
      this.dialogRef.open(CompanyAssociateComponent,{
        data: { appSearchOnboardingForMc:data , applicationId: applicationId , applicantId : applicantId },
        panelClass: 'custom-modalbox',
        width:'1245px',
        height:'575px',
        disableClose : true
      })
    },
      //error handling Completed on 06-07-2023 - <DN>
      (error : any )=> {
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent) ;
        }
     
       }
    )
   }

   editData(){
    this.isReadOnly = false;
    this.showSaveChangesButton = true ;
    this.showEditInfo = false ;
    this.updateValidations();
    this.snackBar.open("Fields are editable now !" , "Ok",{
      panelClass: "custom-green-notification-snackbar",
      duration: 3000
    }) ;
   }
   //update company profile details from backoffice >>> customer search
   updateCustomerBasicProfile(){
    let custId = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "" ;
    this.corporateService.updateCompanyProfile(custId, this.buildUpdateProfilePayload()).subscribe((datas:any)=>{
      console.log(datas) ;
      this.snackBar.open("Changes are updated successfully !" , "Ok",{
        panelClass: "custom-green-notification-snackbar",
        duration: 3000
      }) ;
      this.clearValidators(this.form) ;
      this.isReadOnly = true;
      this.showEditInfo = true ;
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
    })
   }

   buildUpdateProfilePayload():UpdateCorporateProfile{
    return new UpdateCorporateProfile({
      "customerType" : "C" ,
      "corporate" : this.buildUpdateCompanyInfo('STAFF_CUSTOMER_UPDATE')
    })
   }

   loadApplicationInquiryMcOnboarding(){
    let applicationId =  this.store.getItem('MC_CORP_APPLICATIONID') ;
    this.corporateService.getCorporateApplicationInquiry(applicationId).subscribe(data => {

      this.corporateApplicationInquiry = data;
      this.form.patchValue({
        "CompanyName": this.corporateApplicationInquiry.corporate.companyName ? this.corporateApplicationInquiry.corporate.companyName : "", 
        "email" : this.corporateApplicationInquiry.corporate.email.emailId ? this.corporateApplicationInquiry.corporate.email.emailId : "",
        "RegNo": this.corporateApplicationInquiry.corporate.registrationNo ? this.corporateApplicationInquiry.corporate.registrationNo : "",
        "Type": this.corporateApplicationInquiry.corporate.registrationType ? this.corporateApplicationInquiry.corporate.registrationType : "",
        "natureOfBusiness" : this.corporateApplicationInquiry.corporate.natureOfBusiness ? this.corporateApplicationInquiry.corporate.natureOfBusiness : "",
        "IncDate":this.corporateApplicationInquiry.corporate.incorporationDate ? this.corporateApplicationInquiry.corporate.incorporationDate : "",
        "IncPlace": this.corporateApplicationInquiry.corporate.incorporationPlace ? this.corporateApplicationInquiry.corporate.incorporationPlace : "",
        "RemittanceLicense": this.corporateApplicationInquiry.corporate.license ? this.corporateApplicationInquiry.corporate.license : "",
        "TurnOver": this.corporateApplicationInquiry.corporate.turnOver ? this.corporateApplicationInquiry.corporate.turnOver : "",
        "ValidFrom": this.corporateApplicationInquiry.corporate.validFrom ? this.corporateApplicationInquiry.corporate.validFrom : "",
        "ValidTill": this.corporateApplicationInquiry.corporate.validTill ? this.corporateApplicationInquiry.corporate.validTill : "",
        "IssuingAuthority": this.corporateApplicationInquiry.corporate.issuingAuthority ? this.corporateApplicationInquiry.corporate.issuingAuthority : "",
        "Country" :this.corporateApplicationInquiry.corporate.issuingCountry ? this.corporateApplicationInquiry.corporate.issuingCountry : "",
        "Level":this.corporateApplicationInquiry.corporate.address ? this.corporateApplicationInquiry.corporate.address.level : "",
        "Unit": this.corporateApplicationInquiry.corporate.address ? this.corporateApplicationInquiry.corporate.address.unit : "",
        "BuildingName": this.corporateApplicationInquiry.corporate.address ? this.corporateApplicationInquiry.corporate.address.building : "",
        "StreetName": this.corporateApplicationInquiry.corporate.address ? this.corporateApplicationInquiry.corporate.address.streetName : "",
        "CountryOffice":this.corporateApplicationInquiry.corporate.address ? this.corporateApplicationInquiry.corporate.address.countryCode : "",
        "PostalCode":this.corporateApplicationInquiry.corporate.address ? this.corporateApplicationInquiry.corporate.address.postalCode : "",
        "CompanyPhone": this.corporateApplicationInquiry.corporate.phone.phoneNumber,
        "companyCountry" : this.corporateApplicationInquiry.corporate.address ? this.corporateApplicationInquiry.corporate.address.countryCode : "",
        "profileCountry" : this.corporateApplicationInquiry.corporate.issuingCountry,
  
      })
     },
       //error handling Completed on 06-07-2023 - <DN>
     (error:any)=>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    });
    }
   
}