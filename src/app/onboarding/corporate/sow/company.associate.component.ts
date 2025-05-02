import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {  CompanyProfile, CorporateAssociate, CorporateProfile, UpdateAssociateAddress, UpdateAssociates, UpdateCorporate, UpdateCorporateAssociates } from 'src/app/core/model/Company Profile/company-profile';
import { ApplicationService } from 'src/app/core/services/application.service';
import { CorporateService } from 'src/app/core/services/corporate.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import _moment from 'moment';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { AssociateGroupDetails, CorporateApplicationInquiry } from 'src/app/core/model/corporateapplicationinquiry/corporateapplicationinquiry';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanyProfileComponent } from '../profile/company-profile.component';
import { CompanyDocumentsComponent } from '../documents/company-documents.component';
import { AssociatesDetails, CorporateCustomerInquiry } from 'src/app/core/model/corporatecustomerinquiry/corporatecustomerinquiry';
import { CustomValidators } from 'ngx-custom-validators';

import { noWhitespaceValidator } from 'src/app/shared/models/phone.model';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { nationalityArray } from 'src/assets/dropdownvalues';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
const moment = _moment;
import { nricRegex } from 'src/assets/dropdownvalues';

@Component({
    selector: 'app-company-associate',
    templateUrl: './company-associate.component.html',
    styleUrls: ['./company-associate.component.scss']
  })

  export class CompanyAssociateComponent implements OnInit{
    dealerDobDate = moment();
    ownerDobDate = moment();
    runnerDobDate = moment();

    passportExpiryOwnerDate = moment();  //Passport expiry date series ..
    passportExpiryDealerDate = moment();
    passportExpiryRunnerDate = moment();

    passportIssueDateOwner = moment(); //Passport Issue date series ..
    passportIssueDateDealer = moment();
    passportIssueDateRunner = moment();

    saveCompanyAssociate : boolean = true;
    loader : boolean = false;
  
    corporateApplicationInquiry !: CorporateApplicationInquiry; 
    corporateCustomerInquiry !: CorporateCustomerInquiry;
    applicationFlag : Boolean = false;
    customerFlag : Boolean = false;
    minDate = new Date(1920, 0, 1); // January 1st, 1920
    maxDate = new Date();
    // new change 
    filteredOwnerNationalities : any[] = nationalityArray ;
    filteredDealerNationalities : any[]= nationalityArray;
    filteredRunnerNationalities : any[]= nationalityArray;
    nationality : any = nationalityArray;

    @Output() companyAssociatesStatusChanged = new EventEmitter<any>();
    formStatus !: string ;
    showEmptyFields : boolean = false ;
    @Input() corpStepper!: MatStepper; // Receive MatStepper reference from parent component
    showEditableForBranchChannel = false ;
    showSaveChangesButton : boolean = false;
    isDisableEditCustomerDetails : boolean = true ;
    showEditInfo : boolean = false ;
    isFormControlChanged: boolean = true;
    isReadOnlyOwner : Boolean = false;
    isReadOnlyDealer : Boolean = false;
    isReadOnlyRunner : Boolean = false;
    ownerDetails : any[] =[] ;
    dealerDetails : any[] =[] ;
    runnerDetails : any[] = [] ;
    ownerAssociateId !: string ;
    dealerAssociateId !: string ;
    runnerAssociateId !: string ;

    //new 18 Mar 2024
     // Define FormArrays for dynamic sections
   ownerGroupsArray!: FormArray;
   dealerGroupsArray !: FormArray;
   runnerGroupsArray !: FormArray;
   public ownerMainGroup :  FormGroup = Object.create(null);
   public dealerMainGroup : FormGroup = Object.create(null);
   public runnerMainGroup : FormGroup = Object.create(null);
   nationalityArray : any[] = nationalityArray ;
   filteredMainOwnerNationalities : any[] = nationalityArray ;
   filteredMainDealerNationalities : any[] = nationalityArray ;
   filteredMainRunnerNationalities : any[] = nationalityArray ;
   isDisableAddAssociatesButton : boolean = false ;
   customerRegistrationType : string = "" ;
   showStatusField : boolean = false ;
   nricPattern = nricRegex; 
   appSearchRegisterType !: string ;
  
    constructor(private router: Router , private fb: FormBuilder,private corporateService:CorporateService,private alertService:AlertService,
      private applicationService : ApplicationService,private headerService : TitleHeaderService,private store : InMemoryCache, @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialog,private route : ActivatedRoute, private snackBar : MatSnackBar){}

    ngOnInit(){
      this.headerService.setTitle('Company Associates');
       // Initialize ownerGroupsArray,runnerGroupsArray,dealerGroupsArray as an empty FormArray which will dynamic formgroups
    this.ownerGroupsArray = this.fb.array([]);
    this.dealerGroupsArray = this.fb.array([]);
    this.runnerGroupsArray = this.fb.array([]); 

    //static fields ownerMainGroup , dealerMainGroup and runnerMainGroup
    this.ownerMainGroup = this.fb.group({
      fullName: [null ,[Validators.compose([Validators.required,Validators.pattern('[a-zA-Z ./,@]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator])]],
      nric: [null ,[Validators.compose([Validators.required , this.removeSpaces, Validators.pattern(this.nricPattern)])]],
      dob: [null ,Validators.compose([Validators.required])],
      gender: [null ,Validators.compose([Validators.required])],
      email: [null ,[Validators.required,CustomValidators.email,Validators.maxLength(128)]],
      phoneNumber: [null ,[Validators.compose([Validators.required,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator])]],
      nationality: [null ,[Validators.compose([Validators.required])]],
      ownerPassportNumber : [null],
      ownerPassportIssueDate : [null],
      ownerPassportExpiryDate : [null],
      ownerOverseasId : [null, Validators.compose([Validators.maxLength(128)])],
      associateId : [null],
      status : [null],
      address: [null, Validators.compose([Validators.maxLength(50),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')])],
    }),
    this.dealerMainGroup = this.fb.group({
        dealerFullname: [null ,[Validators.compose([Validators.required,Validators.pattern('[a-zA-Z ./,@]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator])]],
        dealerNric: [null ,[Validators.compose([Validators.required, this.removeSpaces, Validators.pattern(this.nricPattern)])]],
        dealerDob: [null ,Validators.compose([Validators.required])],
        dealerGender: [null ,Validators.compose([Validators.required])],
        dealerEmail: [null ,[Validators.required,CustomValidators.email,Validators.maxLength(128)]],
        dealerPhoneNumber: [null ,[Validators.compose([Validators.required,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator])]],
        dealerNationality: [null ,[Validators.compose([Validators.required])]],
        dealerPassportNumber : [null],
        dealerPassportIssueDate : [null],
        dealerPassportExpiryDate : [null],
        dealerOverseasId : [null, Validators.compose([Validators.maxLength(128)])],
        associateId : [null],
        status : [null],
        address: [null, Validators.compose([Validators.maxLength(50),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')])]
    }),
    this.runnerMainGroup = this.fb.group({
        runnerFullname: [null ,[Validators.compose([Validators.required,Validators.pattern('[a-zA-Z ./,@]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator])]],
        runnerNric: [null ,[Validators.compose([Validators.required, this.removeSpaces, Validators.pattern(this.nricPattern)])]],
        runnerDob: [null ,Validators.compose([Validators.required])],
        runnerGender: [null ,Validators.compose([Validators.required])],
        runnerEmail: [null ,[Validators.required,CustomValidators.email,Validators.maxLength(128)]],
        runnerPhoneNumber: [null ,[Validators.compose([Validators.required,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator])]],
        runnerNationality: [null ,[Validators.compose([Validators.required])]],
        runnerPassportNumber : [null],
        runnerPassportIssueDate : [null],
        runnerPassportExpiryDate : [null],
        runnerOverseasId : [null, Validators.compose([Validators.maxLength(128)])],
        associateId : [null],
        status : [null],
        address: [null, Validators.compose([Validators.maxLength(50),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')])]
    });

    //CORPORATE MOBILE LOGIN > VIEW COMPANY ASSOCIATES SCREEN WHEN APPSTATUS IS "NEW" OR "PENDING" 
   let applicationId : string = this.store.getItem('APPLICATION_ID');
   if(this.store.getItem('APPLICATIONSTATUS') == "NEW" || this.store.getItem('APPLICATIONSTATUS') == "PENDING" ){
   this.corporateService.getCorporateApplicationInquiry(applicationId).subscribe(data => {
    console.log(data);
    if(this.store.getItem('APPLICATIONSTATUS') == "PENDING"){
      this.isReadOnlyOwner  = true;
      this.isReadOnlyDealer = true;
      this.isReadOnlyRunner = true;
      this.saveCompanyAssociate = false;
      this.isDisableAddAssociatesButton = true ;
    }
    this.corporateApplicationInquiry = data;
   
    if(this.corporateApplicationInquiry.corporate.associate != null){

      this.ownerDetails = this.corporateApplicationInquiry.corporate.associate.owner ? this.corporateApplicationInquiry.corporate.associate.owner : [] ;
      this.dealerDetails = this.corporateApplicationInquiry.corporate.associate.dealer ? this.corporateApplicationInquiry.corporate.associate.dealer : [];
      this.runnerDetails = this.corporateApplicationInquiry.corporate.associate.runner ? this.corporateApplicationInquiry.corporate.associate.runner : [];
      if(this.runnerDetails.length == 0){
        const associates : any = this.corporateApplicationInquiry.corporate.associate ; 
        this.runnerDetails = associates.teller ? associates.teller : [] ;
      }

      //Always , we patch first object of every node --> "owner" , "runner" and "dealer" Main Form Groups . 
      if(this.ownerDetails.length != 0){
      this.ownerMainGroup.patchValue({
        fullName: this.ownerDetails[0].name ? this.ownerDetails[0].name : "" ,
        nric:  this.ownerDetails[0].idNumber ? this.ownerDetails[0].idNumber : "" ,
        dob:  this.ownerDetails[0].dob ? this.ownerDetails[0].dob : "" ,
        gender:  this.ownerDetails[0].gender ? this.ownerDetails[0].gender : "" ,
        email: this.ownerDetails[0].emailId ? this.ownerDetails[0].emailId : "" ,
        phoneNumber: this.ownerDetails[0].phoneNo ? this.ownerDetails[0].phoneNo : "" ,
        nationality:  this.ownerDetails[0].nationality ? this.ownerDetails[0].nationality: "" ,
        ownerPassportNumber : this.ownerDetails[0].passportNumber ? this.ownerDetails[0].passportNumber : "",
        ownerPassportIssueDate : this.ownerDetails[0].passportIssueDate ? this.ownerDetails[0].passportIssueDate : "" ,
        ownerPassportExpiryDate : this.ownerDetails[0].passportExpiry ? this.ownerDetails[0].passportExpiry : "",
        ownerOverseasId : this.ownerDetails[0].overseasId ? this.ownerDetails[0].overseasId: "" ,
        associateId : this.ownerDetails[0].associateId ? this.ownerDetails[0].associateId : "",
        status : this.ownerDetails[0].status ? this.ownerDetails[0].status : "",
        address : this.ownerDetails[0].address ? this.ownerDetails[0].address[0].level : "" 
    });
  }
   if(this.runnerDetails.length != 0){
    this.runnerMainGroup.patchValue({
      runnerFullname: this.runnerDetails[0].name ? this.runnerDetails[0].name : "" ,
      runnerNric:  this.runnerDetails[0].idNumber ? this.runnerDetails[0].idNumber : "" ,
      runnerDob:  this.runnerDetails[0].dob ? this.runnerDetails[0].dob : "" ,
      runnerGender:  this.runnerDetails[0].gender ? this.runnerDetails[0].gender : "" ,
      runnerEmail: this.runnerDetails[0].emailId ? this.runnerDetails[0].emailId : "" ,
      runnerPhoneNumber: this.runnerDetails[0].phoneNo ? this.runnerDetails[0].phoneNo : "" ,
      runnerNationality:  this.runnerDetails[0].nationality ? this.runnerDetails[0].nationality : "" ,
      runnerPassportNumber : this.runnerDetails[0].passportNumber ? this.runnerDetails[0].passportNumber : "",
      runnerPassportIssueDate : this.runnerDetails[0].passportIssueDate ? this.runnerDetails[0].passportIssueDate : "",
      runnerPassportExpiryDate : this.runnerDetails[0].passportExpiry ? this.runnerDetails[0].passportExpiry : "",
      runnerOverseasId : this.runnerDetails[0].overseasId ? this.runnerDetails[0].overseasId : "",
      associateId : this.runnerDetails[0].associateId ? this.runnerDetails[0].associateId : "",
      status : this.runnerDetails[0].status ? this.runnerDetails[0].status : "",
      address : this.runnerDetails[0].address ? this.runnerDetails[0].address[0].level : ""
  });
}
if(this.dealerDetails.length != 0){
  this.dealerMainGroup.patchValue({
    dealerFullname: this.dealerDetails[0].name ? this.dealerDetails[0].name: "" ,
    dealerNric:  this.dealerDetails[0].idNumber ? this.dealerDetails[0].idNumber : "" ,
    dealerDob:  this.dealerDetails[0].dob ? this.dealerDetails[0].dob : "" ,
    dealerGender:  this.dealerDetails[0].gender ? this.dealerDetails[0].gender : ""  ,
    dealerEmail: this.dealerDetails[0].emailId ? this.dealerDetails[0].emailId : "" ,
    dealerPhoneNumber: this.dealerDetails[0].phoneNo ? this.dealerDetails[0].phoneNo : "" ,
    dealerNationality:  this.dealerDetails[0].nationality ? this.dealerDetails[0].nationality : "" ,
    dealerPassportNumber : this.dealerDetails[0].passportNumber ? this.dealerDetails[0].passportNumber : "" ,
    dealerPassportIssueDate : this.dealerDetails[0].passportIssueDate ? this.dealerDetails[0].passportIssueDate : "",
    dealerPassportExpiryDate : this.dealerDetails[0].passportExpiry ? this.dealerDetails[0].passportExpiry : "",
    dealerOverseasId : this.dealerDetails[0].overseasId ? this.dealerDetails[0].overseasId : "" ,
    associateId : this.dealerDetails[0].associateId ? this.dealerDetails[0].associateId : "",
    status : this.dealerDetails[0].status ? this.dealerDetails[0].status : "",
    address : this.dealerDetails[0].address ? this.dealerDetails[0].address[0].level : ""
});
}

    //when we have more than or equal to two objects inside "owner" node , we first add owner dynamic fields and then patch 
     if(this.ownerDetails.length >= 2){
        this.addOwner('additional_owners') ;  
      }

      //when we have more than or equal to two objects inside "runner" node , we first add runner dynamic fields and then patch 
     if(this.runnerDetails.length >= 2){
      this.addRunner('additional_runners') ;  
    }

    //when we have more than or equal to two objects inside "dealer" node , we first add dealer dynamic fields and then patch 
    if(this.dealerDetails.length >= 2){
      this.addDealer('additional_dealers') ;  
    }

    //getting the "type" from inquiry response and validations created .
  //  let type : string = this.corporateApplicationInquiry.corporate.registrationType ? this.corporateApplicationInquiry.corporate.registrationType : "" ;
  //  if(type != ""){
  //     this.performConditionalValidtion(type) ;
  //  }


    }
    
  
   },
    //error handling Completed on 06-07-2023 - <DN>
    (error:any)=>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    })
   
  }
   //CORPORATE MOBILE LOGIN > fetching customerId from url params and calling customerInquiry in company associates screen . 
if(this.store.getItem('APPLICATIONSTATUS') == "APPROVED" || this.store.getItem('CUSTOMER_STATUS')=="ACTIVE"){
  this.isReadOnlyOwner  = true;
  this.isReadOnlyDealer = true;
  this.isReadOnlyRunner = true;
  this.saveCompanyAssociate = false;
  this.isDisableAddAssociatesButton = true ;
  this.route.queryParams.subscribe((params: any)=> {
    let customerId = params.customer;
    if(customerId != undefined){
      this.corporateService.getCorporateCustomerInquiry(customerId).subscribe(data => {
        this.corporateCustomerInquiry = data;
   
        this.ownerDetails = this.corporateCustomerInquiry.associates.owner ? this.corporateCustomerInquiry.associates.owner : [] ;
        this.dealerDetails = this.corporateCustomerInquiry.associates.dealer ? this.corporateCustomerInquiry.associates.dealer : [];
        this.runnerDetails = this.corporateCustomerInquiry.associates.runner ? this.corporateCustomerInquiry.associates.runner : []; 
        if(this.runnerDetails.length == 0){
          const associates : any = this.corporateCustomerInquiry.associates ; 
          this.runnerDetails = associates.teller ? associates.teller : [] ;
        }
        //Always , we patch first object of every node --> "owner" , "runner" and "dealer" Main Form Groups . 
    if(this.ownerDetails.length != 0){    
    this.ownerMainGroup.patchValue({
      fullName: this.ownerDetails[0].name ? this.ownerDetails[0].name : "" ,
      nric:  this.ownerDetails[0].idNumber ? this.ownerDetails[0].idNumber : "" ,
      dob:  this.ownerDetails[0].dob ? this.ownerDetails[0].dob : "" ,
      gender:  this.ownerDetails[0].gender ? this.ownerDetails[0].gender : "" ,
      email: this.ownerDetails[0].email ? this.ownerDetails[0].email : "" ,
      phoneNumber: this.ownerDetails[0].phone ? this.ownerDetails[0].phone : "" ,
      nationality:  this.ownerDetails[0].nationality ? this.ownerDetails[0].nationality: "" ,
      ownerPassportNumber : this.ownerDetails[0].passportNumber ? this.ownerDetails[0].passportNumber : "",
      ownerPassportIssueDate : this.ownerDetails[0].passportIssueDate ? this.ownerDetails[0].passportIssueDate : "" ,
      ownerPassportExpiryDate : this.ownerDetails[0].passportExpiry ? this.ownerDetails[0].passportExpiry : "",
      ownerOverseasId : this.ownerDetails[0].overseasId ? this.ownerDetails[0].overseasId: "" ,
      associateId : this.ownerDetails[0].associateId ? this.ownerDetails[0].associateId : "",
      status : this.ownerDetails[0].status ? this.ownerDetails[0].status : "",
      address : this.ownerDetails[0].address ? this.ownerDetails[0].address[0].level : "" 
  });
}

if(this.runnerDetails.length != 0){  
  this.runnerMainGroup.patchValue({
    runnerFullname: this.runnerDetails[0].name ? this.runnerDetails[0].name : "" ,
    runnerNric:  this.runnerDetails[0].idNumber ? this.runnerDetails[0].idNumber : "" ,
    runnerDob:  this.runnerDetails[0].dob ? this.runnerDetails[0].dob : "" ,
    runnerGender:  this.runnerDetails[0].gender ? this.runnerDetails[0].gender : "" ,
    runnerEmail: this.runnerDetails[0].email ? this.runnerDetails[0].email : "" ,
    runnerPhoneNumber: this.runnerDetails[0].phone ? this.runnerDetails[0].phone : "" ,
    runnerNationality:  this.runnerDetails[0].nationality ? this.runnerDetails[0].nationality : "" ,
    runnerPassportNumber : this.runnerDetails[0].passportNumber ? this.runnerDetails[0].passportNumber : "",
    runnerPassportIssueDate : this.runnerDetails[0].passportIssueDate ? this.runnerDetails[0].passportIssueDate : "",
    runnerPassportExpiryDate : this.runnerDetails[0].passportExpiry ? this.runnerDetails[0].passportExpiry : "",
    runnerOverseasId : this.runnerDetails[0].overseasId ? this.runnerDetails[0].overseasId : "",
    associateId : this.runnerDetails[0].associateId ? this.runnerDetails[0].associateId : "",
    status : this.runnerDetails[0].status ? this.runnerDetails[0].status : "",
    address : this.runnerDetails[0].address ? this.runnerDetails[0].address[0].level : "" 
});
}

if(this.dealerDetails.length != 0){  
this.dealerMainGroup.patchValue({
  dealerFullname: this.dealerDetails[0].name ? this.dealerDetails[0].name: "" ,
  dealerNric:  this.dealerDetails[0].idNumber ? this.dealerDetails[0].idNumber : "" ,
  dealerDob:  this.dealerDetails[0].dob ? this.dealerDetails[0].dob : "" ,
  dealerGender:  this.dealerDetails[0].gender ? this.dealerDetails[0].gender : ""  ,
  dealerEmail: this.dealerDetails[0].email ? this.dealerDetails[0].email : "" ,
  dealerPhoneNumber: this.dealerDetails[0].phone ? this.dealerDetails[0].phone : "" ,
  dealerNationality:  this.dealerDetails[0].nationality ? this.dealerDetails[0].nationality : "" ,
  dealerPassportNumber : this.dealerDetails[0].passportNumber ? this.dealerDetails[0].passportNumber : "" ,
  dealerPassportIssueDate : this.dealerDetails[0].passportIssueDate ? this.dealerDetails[0].passportIssueDate : "",
  dealerPassportExpiryDate : this.dealerDetails[0].passportExpiry ? this.dealerDetails[0].passportExpiry : "",
  dealerOverseasId : this.dealerDetails[0].overseasId ? this.dealerDetails[0].overseasId : "" ,
  associateId : this.dealerDetails[0].associateId ? this.dealerDetails[0].associateId : "",
  status : this.dealerDetails[0].status ? this.dealerDetails[0].status : "",
  address : this.dealerDetails[0].address ? this.dealerDetails[0].address[0].level : "" 
});
}

  //when we have more than or equal to two objects inside "owner" node , we first add owner dynamic fields and then patch 
   if(this.ownerDetails.length >= 2){
      this.viewCorporateCustomerSubGroups('OWNER') ;  
    }

    //when we have more than or equal to two objects inside "runner" node , we first add runner dynamic fields and then patch 
   if(this.runnerDetails.length >= 2){
    this.viewCorporateCustomerSubGroups('RUNNER') ;  
  }

  //when we have more than or equal to two objects inside "dealer" node , we first add dealer dynamic fields and then patch 
  if(this.dealerDetails.length >= 2){
    this.viewCorporateCustomerSubGroups('DEALER') ;  
  }

      //getting the "type" from inquiry response and validations created .
      // let type : string = this.corporateCustomerInquiry.registrationType ? this.corporateCustomerInquiry.registrationType : "" ;
      // if(type != ""){
      //    this.performConditionalValidtion(type) ;
      // }

      },
       //error handling Completed on 06-07-2023 - <DN>
    (error:any)=>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    });
    
    }
  });

  }
   //BACKOFFICE LOGIN > APPLICATION SEARCH > VIEW COMPANY ASSOCIATES (APPLICATION INQUIRY) 
   if(this.data.applicationCompanyAssociateReview){
    this.headerService.setTitle('Account Opening');
    this.clearValidators(this.ownerMainGroup); //clear validations for all MainGroups
      this.clearValidators(this.dealerMainGroup);
      this.clearValidators(this.runnerMainGroup);
      this.clearSubGroupValidators(this.ownerGroupsArray) ; //clear validations for all SubGroups
      this.clearSubGroupValidators(this.dealerGroupsArray) ;
      this.clearSubGroupValidators(this.runnerGroupsArray) ;
    this.isReadOnlyOwner  = true;
      this.isReadOnlyDealer = true;
      this.isReadOnlyRunner = true;
     this.applicationFlag = true;
     this.saveCompanyAssociate = false;
     this.isDisableAddAssociatesButton = true;
     
    this.corporateApplicationInquiry = this.data.applicationCompanyAssociateReview;

    this.ownerDetails = this.data.applicationCompanyAssociateReview.corporate.associate.owner ? this.data.applicationCompanyAssociateReview.corporate.associate.owner : [];
    this.dealerDetails = this.data.applicationCompanyAssociateReview.corporate.associate.dealer ? this.data.applicationCompanyAssociateReview.corporate.associate.dealer : [];
    this.runnerDetails = this.data.applicationCompanyAssociateReview.corporate.associate.runner ? this.data.applicationCompanyAssociateReview.corporate.associate.runner : [] ;

    if(this.runnerDetails.length == 0){ //Some node=== "teller"
      const associates : any = this.data.applicationCompanyAssociateReview.corporate.associate ; 
      this.runnerDetails = associates.teller ? associates.teller : [] ;
    }
    
    //Always , we patch first object of every node --> "owner" , "runner" and "dealer" Main Form Groups . 
    if(this.ownerDetails.length != 0){
      this.ownerMainGroup.patchValue({
        fullName: this.ownerDetails[0].name ? this.ownerDetails[0].name : "" ,
        nric:  this.ownerDetails[0].idNumber ? this.ownerDetails[0].idNumber : "" ,
        dob:  this.ownerDetails[0].dob ? this.ownerDetails[0].dob : "" ,
        gender:  this.ownerDetails[0].gender ? this.ownerDetails[0].gender : "" ,
        email: this.ownerDetails[0].emailId ? this.ownerDetails[0].emailId : "" ,
        phoneNumber: this.ownerDetails[0].phoneNo ? this.ownerDetails[0].phoneNo : "" ,
        nationality:  this.ownerDetails[0].nationality ? this.ownerDetails[0].nationality: "" ,
        ownerPassportNumber : this.ownerDetails[0].passportNumber ? this.ownerDetails[0].passportNumber : "",
        ownerPassportIssueDate : this.ownerDetails[0].passportIssueDate ? this.ownerDetails[0].passportIssueDate : "" ,
        ownerPassportExpiryDate : this.ownerDetails[0].passportExpiry ? this.ownerDetails[0].passportExpiry : "",
        ownerOverseasId : this.ownerDetails[0].overseasId ? this.ownerDetails[0].overseasId: "" ,
        associateId : this.ownerDetails[0].associateId ? this.ownerDetails[0].associateId : "",
        status : this.ownerDetails[0].status ? this.ownerDetails[0].status : "",
        address : this.ownerDetails[0].address ? this.ownerDetails[0].address[0].level : "" 
    });
    }

  if(this.runnerDetails.length != 0){
    this.runnerMainGroup.patchValue({
      runnerFullname: this.runnerDetails[0].name ? this.runnerDetails[0].name : "" ,
      runnerNric:  this.runnerDetails[0].idNumber ? this.runnerDetails[0].idNumber : "" ,
      runnerDob:  this.runnerDetails[0].dob ? this.runnerDetails[0].dob : "" ,
      runnerGender:  this.runnerDetails[0].gender ? this.runnerDetails[0].gender : "" ,
      runnerEmail: this.runnerDetails[0].emailId ? this.runnerDetails[0].emailId : "" ,
      runnerPhoneNumber: this.runnerDetails[0].phoneNo ? this.runnerDetails[0].phoneNo : "" ,
      runnerNationality:  this.runnerDetails[0].nationality ? this.runnerDetails[0].nationality : "" ,
      runnerPassportNumber : this.runnerDetails[0].passportNumber ? this.runnerDetails[0].passportNumber : "",
      runnerPassportIssueDate : this.runnerDetails[0].passportIssueDate ? this.runnerDetails[0].passportIssueDate : "",
      runnerPassportExpiryDate : this.runnerDetails[0].passportExpiry ? this.runnerDetails[0].passportExpiry : "",
      runnerOverseasId : this.runnerDetails[0].overseasId ? this.runnerDetails[0].overseasId : "",
      associateId : this.runnerDetails[0].associateId ? this.runnerDetails[0].associateId : "",
      status : this.runnerDetails[0].status ? this.runnerDetails[0].status : "",
      address : this.runnerDetails[0].address ? this.runnerDetails[0].address[0].level : "" 
  });
  }
 
if(this.dealerDetails.length != 0){
this.dealerMainGroup.patchValue({
  dealerFullname: this.dealerDetails[0].name ? this.dealerDetails[0].name: "" ,
  dealerNric:  this.dealerDetails[0].idNumber ? this.dealerDetails[0].idNumber : "" ,
  dealerDob:  this.dealerDetails[0].dob ? this.dealerDetails[0].dob : "" ,
  dealerGender:  this.dealerDetails[0].gender ? this.dealerDetails[0].gender : ""  ,
  dealerEmail: this.dealerDetails[0].emailId ? this.dealerDetails[0].emailId : "" ,
  dealerPhoneNumber: this.dealerDetails[0].phoneNo ? this.dealerDetails[0].phoneNo : "" ,
  dealerNationality:  this.dealerDetails[0].nationality ? this.dealerDetails[0].nationality : "" ,
  dealerPassportNumber : this.dealerDetails[0].passportNumber ? this.dealerDetails[0].passportNumber : "" ,
  dealerPassportIssueDate : this.dealerDetails[0].passportIssueDate ? this.dealerDetails[0].passportIssueDate : "",
  dealerPassportExpiryDate : this.dealerDetails[0].passportExpiry ? this.dealerDetails[0].passportExpiry : "",
  dealerOverseasId : this.dealerDetails[0].overseasId ? this.dealerDetails[0].overseasId : "" ,
  associateId : this.dealerDetails[0].associateId ? this.dealerDetails[0].associateId : "",
  status : this.dealerDetails[0].status ? this.dealerDetails[0].status : "",
  address : this.dealerDetails[0].address ? this.dealerDetails[0].address[0].level : "" 
});
}

  //when we have more than or equal to two objects inside "owner" node , we first add owner dynamic fields and then patch 
   if(this.ownerDetails.length >= 2){
      this.addOwner('additional_owners') ;  
    }

    //when we have more than or equal to two objects inside "runner" node , we first add runner dynamic fields and then patch 
   if(this.runnerDetails.length >= 2){
    this.addRunner('additional_runners') ;  
  }

  //when we have more than or equal to two objects inside "dealer" node , we first add dealer dynamic fields and then patch 
  if(this.dealerDetails.length >= 2){
    this.addDealer('additional_dealers') ;  
  }

   }
   //BACKOFFICE LOGIN > CUSTOMER SEARCH > VIEW COMPANY ASSOCIATES (CUSTOMER INQUIRY API)
   if(this.data.isCompanyAssociateReview){
    this.headerService.setTitle('Customers');
    this.customerFlag = true;
    this.showEditInfo = true ;
    this.isDisableEditCustomerDetails = false ; //enabling edit customer details button .
    this.saveCompanyAssociate = false;
    this.isReadOnlyOwner  = true;
      this.isReadOnlyDealer = true;
      this.isReadOnlyRunner = true;
      this.isDisableAddAssociatesButton = true ;
      this.showStatusField = true ; //show Status dropdown --> 'ACTIVE' and 'INACTIVE' .
      this.clearValidators(this.ownerMainGroup); //clear validations for all MainGroups
      this.clearValidators(this.dealerMainGroup);
      this.clearValidators(this.runnerMainGroup);
      this.clearSubGroupValidators(this.ownerGroupsArray) ; //clear validations for all SubGroups
      this.clearSubGroupValidators(this.dealerGroupsArray) ;
      this.clearSubGroupValidators(this.runnerGroupsArray) ;
  
    this.ownerDetails = this.data.isCompanyAssociateReview.associates.owner ? this.data.isCompanyAssociateReview.associates.owner : [];
    this.dealerDetails = this.data.isCompanyAssociateReview.associates.dealer ? this.data.isCompanyAssociateReview.associates.dealer : [];
    this.runnerDetails = this.data.isCompanyAssociateReview.associates.runner ? this.data.isCompanyAssociateReview.associates.runner : [];

    if(this.runnerDetails.length == 0){ //Some node=== "teller"
      const associates : any = this.data.isCompanyAssociateReview.associates ; 
      this.runnerDetails = associates.teller ? associates.teller : [] ;
    }
     //getting the "type" from inquiry response and validations created .
   this.customerRegistrationType = this.data.isCompanyAssociateReview.registrationType ? this.data.isCompanyAssociateReview.registrationType : "" ;

       //Always , we patch first object of every node --> "owner" , "runner" and "dealer" Main Form Groups . 
    if(this.ownerDetails.length != 0){   
    this.ownerMainGroup.patchValue({
      fullName: this.ownerDetails[0].name ? this.ownerDetails[0].name : "" ,
      nric:  this.ownerDetails[0].idNumber ? this.ownerDetails[0].idNumber : "" ,
      dob:  this.ownerDetails[0].dob ? this.ownerDetails[0].dob : "" ,
      gender:  this.ownerDetails[0].gender ? this.ownerDetails[0].gender : "" ,
      email: this.ownerDetails[0].email ? this.ownerDetails[0].email : "" ,
      phoneNumber: this.ownerDetails[0].phone ? this.ownerDetails[0].phone : "" ,
      nationality:  this.ownerDetails[0].nationality ? this.ownerDetails[0].nationality: "" ,
      ownerPassportNumber : this.ownerDetails[0].passportNumber ? this.ownerDetails[0].passportNumber : "",
      ownerPassportIssueDate : this.ownerDetails[0].passportIssueDate ? this.ownerDetails[0].passportIssueDate : "" ,
      ownerPassportExpiryDate : this.ownerDetails[0].passportExpiry ? this.ownerDetails[0].passportExpiry : "",
      ownerOverseasId : this.ownerDetails[0].overseasId ? this.ownerDetails[0].overseasId: "" ,
      associateId : this.ownerDetails[0].associateId ? this.ownerDetails[0].associateId : "",
      status : this.ownerDetails[0].status ? this.ownerDetails[0].status : "",
      address : this.ownerDetails[0].address ? this.ownerDetails[0].address[0].level : ""
  });
}
if(this.runnerDetails.length != 0){  
  this.runnerMainGroup.patchValue({
    runnerFullname: this.runnerDetails[0].name ? this.runnerDetails[0].name : "" ,
    runnerNric:  this.runnerDetails[0].idNumber ? this.runnerDetails[0].idNumber : "" ,
    runnerDob:  this.runnerDetails[0].dob ? this.runnerDetails[0].dob : "" ,
    runnerGender:  this.runnerDetails[0].gender ? this.runnerDetails[0].gender : "" ,
    runnerEmail: this.runnerDetails[0].email ? this.runnerDetails[0].email : "" ,
    runnerPhoneNumber: this.runnerDetails[0].phone ? this.runnerDetails[0].phone : "" ,
    runnerNationality:  this.runnerDetails[0].nationality ? this.runnerDetails[0].nationality : "" ,
    runnerPassportNumber : this.runnerDetails[0].passportNumber ? this.runnerDetails[0].passportNumber : "",
    runnerPassportIssueDate : this.runnerDetails[0].passportIssueDate ? this.runnerDetails[0].passportIssueDate : "",
    runnerPassportExpiryDate : this.runnerDetails[0].passportExpiry ? this.runnerDetails[0].passportExpiry : "",
    runnerOverseasId : this.runnerDetails[0].overseasId ? this.runnerDetails[0].overseasId : "",
    associateId : this.runnerDetails[0].associateId ? this.runnerDetails[0].associateId : "",
    status : this.runnerDetails[0].status ? this.runnerDetails[0].status : "",
    address : this.runnerDetails[0].address ? this.runnerDetails[0].address[0].level : ""
});
}

if(this.dealerDetails.length != 0){
this.dealerMainGroup.patchValue({
  dealerFullname: this.dealerDetails[0].name ? this.dealerDetails[0].name: "" ,
  dealerNric:  this.dealerDetails[0].idNumber ? this.dealerDetails[0].idNumber : "" ,
  dealerDob:  this.dealerDetails[0].dob ? this.dealerDetails[0].dob : "" ,
  dealerGender:  this.dealerDetails[0].gender ? this.dealerDetails[0].gender : ""  ,
  dealerEmail: this.dealerDetails[0].email ? this.dealerDetails[0].email : "" ,
  dealerPhoneNumber: this.dealerDetails[0].phone ? this.dealerDetails[0].phone : "" ,
  dealerNationality:  this.dealerDetails[0].nationality ? this.dealerDetails[0].nationality : "" ,
  dealerPassportNumber : this.dealerDetails[0].passportNumber ? this.dealerDetails[0].passportNumber : "" ,
  dealerPassportIssueDate : this.dealerDetails[0].passportIssueDate ? this.dealerDetails[0].passportIssueDate : "",
  dealerPassportExpiryDate : this.dealerDetails[0].passportExpiry ? this.dealerDetails[0].passportExpiry : "",
  dealerOverseasId : this.dealerDetails[0].overseasId ? this.dealerDetails[0].overseasId : "" ,
  associateId : this.dealerDetails[0].associateId ? this.dealerDetails[0].associateId : "",
  status : this.dealerDetails[0].status ? this.dealerDetails[0].status : "",
  address : this.dealerDetails[0].address ? this.dealerDetails[0].address[0].level : ""
});
}

  //when we have more than or equal to two objects inside "owner" node , we first add owner dynamic fields and then patch 
   if(this.ownerDetails.length >= 2){
      this.viewCorporateCustomerSubGroups('OWNER') ;  
    }

    //when we have more than or equal to two objects inside "runner" node , we first add runner dynamic fields and then patch 
   if(this.runnerDetails.length >= 2){
    this.viewCorporateCustomerSubGroups('RUNNER') ;  
  }

  //when we have more than or equal to two objects inside "dealer" node , we first add dealer dynamic fields and then patch 
  if(this.dealerDetails.length >= 2){
    this.viewCorporateCustomerSubGroups('DEALER') ;  
  }



   }

    //BACKOFFICE MC/RT LOGIN > APPLICATION SEARCH > ADD CORPORATE > STEPPER FLOW .
    if (this.data.appOnboardingForMc) {
      this.headerService.setTitle('Account Opening');
      this.showEmptyFields = true; 
      this.saveCompanyAssociate = false;
      
    }

    //BACKOFFICE MC/RT LOGIN > APPLICATION SEARCH > CLICK ACTION ICON > SAVE & CONTINUE ASSOCIATES .
    if (this.data.appSearchOnboardingForMc) {
      this.headerService.setTitle('Account Opening');
      this.saveCompanyAssociate = false;
      this.showEditableForBranchChannel = true;
      let applicationId = this.data.applicationId ? this.data.applicationId : "" ;
      let applicantId = this.data.applicantId ? this.data.applicantId : "" ;
      this.store.setItem('MC_CORP_APPLICATIONID',applicationId) ;
      this.store.setItem('MC_CORP_APPLICANTID',applicantId) ;
      this.isReadOnlyOwner  = false; //All fields as editable only ..
      this.isReadOnlyDealer = false;
      this.isReadOnlyRunner = false;
      this.loadApplicationInquiryMcOnboarding() ;
    }

    // added for updating nric validators.
    this.updateNricValidators();

    }

// Methods to add owner dynamic fields in ownerGroupsArray
addOwner(value : string) {
  if(value == "single_owner"){  //this block executes when add owner button clicked ..
// Create a new FormGroup for an owner
const ownerFormGroup = this.fb.group({
  fullName: [null ,[Validators.compose([Validators.required,Validators.pattern('[a-zA-Z ./,@]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator])]],
  nric: [null ,[Validators.compose([Validators.required, this.removeSpaces, Validators.pattern(this.nricPattern)])]],
  dob: [null ,Validators.compose([Validators.required])],
  gender: [null ,Validators.compose([Validators.required])],
  email: [null ,[Validators.required,CustomValidators.email,Validators.maxLength(128)]],
  phoneNumber: [null ,[Validators.compose([Validators.required,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator])]],
  nationality: [null ,[Validators.compose([Validators.required])]],
  associateId : [null],
  ownerPassportNumber : [null],
  ownerPassportIssueDate : [null],
  ownerPassportExpiryDate : [null],
  ownerOverseasId : [null, Validators.compose([Validators.maxLength(128)])],
  status : [null],
  address: [null, Validators.compose([Validators.maxLength(50),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')])],
});
// Add the new owner FormGroup to the ownerGroupsArray FormArray
this.ownerGroupsArray.push(ownerFormGroup);

// while adding owner subscribing to nationality changes
this.ownerGroupsArray.controls.forEach((group: AbstractControl, index: number) => {
  const nationality = group.get('nationality');
  const nric = group.get('nric');

  if (nationality && nric) {
    nationality.valueChanges.subscribe((value: string) => {
      console.log(`Index: ${index}, Nationality: ${value}`); // Print index and value to the console
      this.updateOwnerNricValidators(index, value);
    });
  }
});
// let appSearchStepperFlow = this.data.appOnboardingForMc ; //Entry point > Backoffice > Application search > Add Corporate > Stepper flow ...
// let appSearchRecordFlow = this.data.appSearchOnboardingForMc ;  //Entry point > Backoffice > Application search > Record action click > channel as 'BRANCH' ...

// if(this.customerRegistrationType != ""){ //entry point include : Backoffice > Customer search > Open associates > Edit Associates ..
//   this.performConditionalValidtionForOwner(this.customerRegistrationType);
//   }
//   else if(appSearchStepperFlow && this.appSearchRegisterType){ //Entry point > Backoffice > Application search > Add Corporate > Stepper flow ...
//     this.performConditionalValidtionForOwner(this.appSearchRegisterType);
//   }
//   else if(appSearchRecordFlow && this.appSearchRegisterType){  //Entry point > Backoffice > Application search > Record action click > channel as 'BRANCH' ...
//     this.performConditionalValidtionForOwner(this.appSearchRegisterType);
//   }
  }
  //we patching datas of additional owners in this dynamic fields .
  if(value == "additional_owners"){
    this.ownerGroupsArray.clear();
    let owners = this.ownerDetails;
    // Remove the first owner object from the array using shift func because first object will be patched in static fields(main groups) .
   owners.shift();
   owners.forEach((owner:AssociateGroupDetails) => {
      const ownerFormGroup = this.fb.group({
        fullName: [owner.name, [Validators.required, Validators.pattern('[a-zA-Z ./,@]*$'), Validators.maxLength(50)]],
        nric: [owner.idNumber, [Validators.required, this.removeSpaces, Validators.pattern(this.nricPattern)]],
        dob: [owner.dob, [Validators.required]],
        gender: [owner.gender, [Validators.required]],
        email: [owner.emailId, [Validators.required, CustomValidators.email,Validators.maxLength(128)]],
        phoneNumber: [owner.phoneNo, [Validators.required, Validators.pattern("[0-9 ]*$")]],
        nationality: [owner.nationality, [Validators.required]],
        associateId : [owner.associateId],
        ownerPassportNumber : [owner.passportNumber],
        ownerPassportIssueDate : [owner.passportIssueDate],
        ownerPassportExpiryDate : [owner.passportExpiry],
        ownerOverseasId : [owner.overseasId, [Validators.maxLength(128)]] ,
        status : [owner.status],
        address : [owner.address ? owner.address[0].level : null,[Validators.maxLength(50),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')]]
      });
  
      this.ownerGroupsArray.push(ownerFormGroup);
      this.updateNricValidators();
    });
  }
}
//method to remove section
removeOwner(index: number) {
  this.ownerGroupsArray.removeAt(index);
}

addDealer(value : string){
  if(value == "single_dealer"){
  const dealerFormGroup = this.fb.group({
    dealerFullname: [null ,[Validators.compose([Validators.required,Validators.pattern('[a-zA-Z ./,@]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator])]],
    dealerNric: [null ,[Validators.compose([Validators.required, this.removeSpaces, Validators.pattern(this.nricPattern)])]],
    dealerDob: [null ,Validators.compose([Validators.required])],
    dealerGender: [null ,Validators.compose([Validators.required])],
    dealerEmail: [null ,[Validators.required,CustomValidators.email,Validators.maxLength(128)]],
    dealerPhoneNumber: [null ,[Validators.compose([Validators.required,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator])]],
    dealerNationality: [null ,[Validators.compose([Validators.required])]],
    associateId : [null],
    dealerPassportNumber : [null],
    dealerPassportIssueDate : [null],
    dealerPassportExpiryDate : [null],
    dealerOverseasId : [null, Validators.compose([Validators.maxLength(128)])],
    status : [null],
    address: [null, Validators.compose([Validators.maxLength(50),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')])],
    
  });

  this.dealerGroupsArray.push(dealerFormGroup);

  this.dealerGroupsArray.controls.forEach((group: AbstractControl, index: number) => {
    const nationality = group.get('dealerNationality');
    const nric = group.get('dealerNric');
  
    if (nationality && nric) {
      nationality.valueChanges.subscribe((value: string) => {
        console.log(`Index: ${index}, Nationality: ${value}`);
        this.updateDealerNricValidators(index, value);
      });
    }
  });
  // let appSearchStepperFlow = this.data.appOnboardingForMc ; //Entry point > Backoffice > Application search > Add Corporate > Stepper flow ...
  // let appSearchRecordFlow = this.data.appSearchOnboardingForMc ;  //Entry point > Backoffice > Application search > Record action click > channel as 'BRANCH' ...

  // if(this.customerRegistrationType != ""){ //entry point include : Backoffice > Customer search > Open associates > Edit Associates ..
  //   this.performConditionalValidtionForDealer(this.customerRegistrationType);
  //   }
  //   else if(appSearchStepperFlow && this.appSearchRegisterType){ //Entry point > Backoffice > Application search > Add Corporate > Stepper flow ...
  //     this.performConditionalValidtionForDealer(this.appSearchRegisterType);
  //   }
  //   else if(appSearchRecordFlow && this.appSearchRegisterType){  //Entry point > Backoffice > Application search > Record action click > channel as 'BRANCH' ...
  //     this.performConditionalValidtionForDealer(this.appSearchRegisterType);
  //   }
}

 //we patching datas of additional dealers in this dynamic fields .
 if(value == "additional_dealers"){
  this.dealerGroupsArray.clear();
  const dealers = this.dealerDetails;
  // Remove the first owner object from the array because first object will be patched in static fields .
  dealers.shift();
  dealers.forEach((dealer:AssociateGroupDetails) => {
    const dealerFormGroup = this.fb.group({
      dealerFullname: [dealer.name, [Validators.required, Validators.pattern('[a-zA-Z ./,@]*$'), Validators.maxLength(50)]],
      dealerNric: [dealer.idNumber, [Validators.required, this.removeSpaces, Validators.pattern(this.nricPattern)]],
      dealerDob: [dealer.dob, [Validators.required]],
      dealerGender: [dealer.gender, [Validators.required]],
      dealerEmail: [dealer.emailId, [Validators.required, CustomValidators.email,Validators.maxLength(128)]],
      dealerPhoneNumber: [dealer.phoneNo, [Validators.required, Validators.pattern("[0-9 ]*$")]],
      dealerNationality: [dealer.nationality, [Validators.required]],
      associateId : [dealer.associateId],
      dealerPassportNumber : [dealer.passportNumber],
      dealerPassportIssueDate : [dealer.passportIssueDate],
      dealerPassportExpiryDate : [dealer.passportExpiry],
      dealerOverseasId : [dealer.overseasId, [Validators.maxLength(128)]] ,
      status : [dealer.status],
      address : [dealer.address ? dealer.address[0].level : null, [Validators.maxLength(50),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')]]
      
    });

    this.dealerGroupsArray.push(dealerFormGroup);
  });
  this.updateNricValidators();
}

}

removeDealer(index:number){
  this.dealerGroupsArray.removeAt(index)
}


addRunner(value : string){
  if(value == "single_runner"){
  const runnerFormGroup = this.fb.group({
    runnerFullname: [null ,[Validators.compose([Validators.required,Validators.pattern('[a-zA-Z ./,@]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator])]],
    runnerNric: [null ,[Validators.compose([Validators.required, this.removeSpaces, Validators.pattern(this.nricPattern)])]],
    runnerDob: [null ,Validators.compose([Validators.required])],
    runnerGender: [null ,Validators.compose([Validators.required])],
    runnerEmail: [null ,[Validators.required,CustomValidators.email,Validators.maxLength(128)]],
    runnerPhoneNumber: [null ,[Validators.compose([Validators.required,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator])]],
    runnerNationality: [null ,[Validators.compose([Validators.required])]],
    associateId : [null],
    runnerPassportNumber : [null],
    runnerPassportIssueDate : [null],
    runnerPassportExpiryDate : [null],
    runnerOverseasId : [null, Validators.compose([Validators.maxLength(128)])],
    status : [null],
    address : [null, Validators.compose([Validators.maxLength(50),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')])]
  });
  this.runnerGroupsArray.push(runnerFormGroup)

  this.runnerGroupsArray.controls.forEach((group: AbstractControl, index: number) => {
    const nationality = group.get('runnerNationality');
    const nric = group.get('runnerNric');
  
    if (nationality && nric) {
      nationality.valueChanges.subscribe((value: string) => {
        console.log(`Index: ${index}, Nationality: ${value}`); // Print index and value to the console
        this.updateRunnerNricValidators(index, value);
      });
    }
  });
  // let appSearchStepperFlow = this.data.appOnboardingForMc ; //Entry point > Backoffice > Application search > Add Corporate > Stepper flow ...
  // let appSearchRecordFlow = this.data.appSearchOnboardingForMc ;  //Entry point > Backoffice > Application search > Record action click > channel as 'BRANCH' ...

  // if(this.customerRegistrationType != ""){ //entry point include : Backoffice > Customer search > Open associates > Edit Associates ..
  //   this.performConditionalValidtionForRunner(this.customerRegistrationType);
  //   }
  //   else if(appSearchStepperFlow && this.appSearchRegisterType){ //Entry point > Backoffice > Application search > Add Corporate > Stepper flow ...
  //     this.performConditionalValidtionForRunner(this.appSearchRegisterType);
  //   }
  //   else if(appSearchRecordFlow && this.appSearchRegisterType){  //Entry point > Backoffice > Application search > Record action click > channel as 'BRANCH' ...
  //     this.performConditionalValidtionForRunner(this.appSearchRegisterType);
  //   }
}
//we patching datas of additional dealers in this dynamic fields .
if(value == "additional_runners"){
  this.runnerGroupsArray.clear();
  const runners = this.runnerDetails;
  // Remove the first owner object from the array because first object will be patched in static fields .
  runners.shift();
  runners.forEach((runner:AssociateGroupDetails) => {
    const runnerFormGroup = this.fb.group({
      runnerFullname: [runner.name, [Validators.required, Validators.pattern('[a-zA-Z ./,@]*$'), Validators.maxLength(50)]],
      runnerNric: [runner.idNumber, [Validators.required, this.removeSpaces, Validators.pattern(this.nricPattern)]],
      runnerDob: [runner.dob, [Validators.required]],
      runnerGender: [runner.gender, [Validators.required]],
      runnerEmail: [runner.emailId, [Validators.required, CustomValidators.email,Validators.maxLength(128)]],
      runnerPhoneNumber: [runner.phoneNo, [Validators.required, Validators.pattern("[0-9 ]*$")]],
      runnerNationality: [runner.nationality, [Validators.required]],
      associateId : [runner.associateId],
      runnerPassportNumber : [runner.passportNumber],
    runnerPassportIssueDate : [runner.passportIssueDate],
    runnerPassportExpiryDate : [runner.passportExpiry],
    runnerOverseasId : [runner.overseasId, [Validators.maxLength(128)]] ,
    status : [runner.status],
    address : [runner.address? runner.address[0].level : null, [Validators.maxLength(50),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')] ]
    });

    this.runnerGroupsArray.push(runnerFormGroup);
  });
  this.updateNricValidators();
}

}
removeRunner(index:number){
  this.runnerGroupsArray.removeAt(index)
}


viewCorporateCustomerSubGroups(jobTitle:string){
if(jobTitle == "OWNER"){
  this.ownerGroupsArray.clear();
  let owners = this.ownerDetails;
  // Remove the first owner object from the array using shift func because first object will be patched in static fields(main groups) .
 owners.shift();
 owners.forEach((owner:AssociatesDetails) => {
    const ownerFormGroup = this.fb.group({
      fullName: [owner.name, [Validators.required, Validators.pattern('[a-zA-Z ./,@]*$'), Validators.maxLength(50)]],
      nric: [owner.idNumber, [Validators.required, this.removeSpaces, Validators.pattern(this.nricPattern)]],
      dob: [owner.dob, [Validators.required]],
      gender: [owner.gender, [Validators.required]],
      email: [owner.email, [Validators.required, CustomValidators.email,Validators.maxLength(128)]],
      phoneNumber: [owner.phone, [Validators.required, Validators.pattern("[0-9 ]*$")]],
      nationality: [owner.nationality, [Validators.required]],
      associateId : [owner.associateId],
      ownerPassportNumber : [owner.passportNumber],
      ownerPassportIssueDate : [owner.passportIssueDate],
      ownerPassportExpiryDate : [owner.passportExpiry],
      ownerOverseasId : [owner.overseasId, [Validators.maxLength(128)]] ,
      status : [owner.status],
      address : [owner.address ? owner.address[0].level : null, [Validators.maxLength(50),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')]]
    });

    this.ownerGroupsArray.push(ownerFormGroup);
  });
}
else if(jobTitle == "DEALER"){
  this.dealerGroupsArray.clear();
  const dealers = this.dealerDetails;
  // Remove the first owner object from the array because first object will be patched in static fields .
  dealers.shift();
  dealers.forEach((dealer:AssociatesDetails) => {
    const dealerFormGroup = this.fb.group({
      dealerFullname: [dealer.name, [Validators.required, Validators.pattern('[a-zA-Z ./,@]*$'), Validators.maxLength(50)]],
      dealerNric: [dealer.idNumber, [Validators.required, this.removeSpaces, Validators.pattern(this.nricPattern)]],
      dealerDob: [dealer.dob, [Validators.required]],
      dealerGender: [dealer.gender, [Validators.required]],
      dealerEmail: [dealer.email, [Validators.required, CustomValidators.email, Validators.maxLength(128)]],
      dealerPhoneNumber: [dealer.phone, [Validators.required, Validators.pattern("[0-9 ]*$")]],
      dealerNationality: [dealer.nationality, [Validators.required]],
      associateId : [dealer.associateId],
      dealerPassportNumber : [dealer.passportNumber],
      dealerPassportIssueDate : [dealer.passportIssueDate],
      dealerPassportExpiryDate : [dealer.passportExpiry],
      dealerOverseasId : [dealer.overseasId, [Validators.maxLength(128)]] ,
      status : [dealer.status],
      address : [dealer.address ? dealer.address[0].level : null, [Validators.maxLength(50),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')]]
      
    });

    this.dealerGroupsArray.push(dealerFormGroup);
  });

}
else if(jobTitle == "RUNNER"){
  this.runnerGroupsArray.clear();
  const runners = this.runnerDetails;
  // Remove the first owner object from the array because first object will be patched in static fields .
  runners.shift();
  runners.forEach((runner:AssociatesDetails) => {
    const runnerFormGroup = this.fb.group({
      runnerFullname: [runner.name, [Validators.required, Validators.pattern('[a-zA-Z ./,@]*$'), Validators.maxLength(50)]],
      runnerNric: [runner.idNumber, [Validators.required, this.removeSpaces, Validators.pattern(this.nricPattern)]],
      runnerDob: [runner.dob, [Validators.required]],
      runnerGender: [runner.gender, [Validators.required]],
      runnerEmail: [runner.email, [Validators.required, CustomValidators.email,Validators.maxLength(128)]],
      runnerPhoneNumber: [runner.phone, [Validators.required, Validators.pattern("[0-9 ]*$")]],
      runnerNationality: [runner.nationality, [Validators.required]],
      associateId : [runner.associateId],
      runnerPassportNumber : [runner.passportNumber],
    runnerPassportIssueDate : [runner.passportIssueDate],
    runnerPassportExpiryDate : [runner.passportExpiry],
    runnerOverseasId : [runner.overseasId, [Validators.maxLength(128)]] ,
    status : [runner.status],
    address : [runner.address ? runner.address[0].level : null, [Validators.maxLength(50),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')]]
    });

    this.runnerGroupsArray.push(runnerFormGroup);
  });

}
}

clearValidators(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);
    control?.clearValidators();
    control?.updateValueAndValidity();
});
}

clearSubGroupValidators(formArray: FormArray) {
  Object.keys(formArray.controls).forEach(key => {
    const control = formArray.get(key);
    control?.clearValidators();
    control?.updateValueAndValidity();
});
}


//Based on type , need to setup validations for NRIC related informations and passport related informations .
// performConditionalValidtion(type: string){
//   if(type == "LC"){ //NRIC Number and NRIC expiry date is mandatory , whereas Passport related informations are non mandatory .
//     this.ownerMainGroup.controls['nric'].setValidators([Validators.required , Validators.pattern(this.nricPattern), this.removeSpaces]);
//     this.ownerMainGroup.controls['nric'].updateValueAndValidity();
//     this.ownerGroupsArray.controls.forEach((group : AbstractControl)=>{
//       const nricControl = group.get('nric');
//       if (nricControl) { // Ensure nricControl is not null or undefined
//        nricControl.setValidators([Validators.required ,Validators.pattern(this.nricPattern), this.removeSpaces]);
//        nricControl.updateValueAndValidity();
//       }
//     })

//     this.dealerMainGroup.controls['dealerNric'].setValidators(([Validators.required ,Validators.pattern(this.nricPattern), this.removeSpaces]));
//     this.dealerMainGroup.controls['dealerNric'].updateValueAndValidity();
//     this.dealerGroupsArray.controls.forEach((group : AbstractControl)=>{
//       const nricControl = group.get('dealerNric');
//       if (nricControl) { // Ensure nricControl is not null or undefined
//        nricControl.setValidators([Validators.required ,Validators.pattern(this.nricPattern), this.removeSpaces]);
//        nricControl.updateValueAndValidity();
//       }
//     })

//     this.runnerMainGroup.controls['runnerNric'].setValidators(([Validators.required ,Validators.pattern(this.nricPattern), this.removeSpaces]));
//     this.runnerMainGroup.controls['runnerNric'].updateValueAndValidity();
//     this.runnerGroupsArray.controls.forEach((group : AbstractControl)=>{
//       const nricControl = group.get('runnerNric');
//       if (nricControl) { // Ensure nricControl is not null or undefined
//        nricControl.setValidators([Validators.required ,Validators.pattern(this.nricPattern), this.removeSpaces]);
//        nricControl.updateValueAndValidity();
//       }
//     })

//      //CLEARING PASSPORT RELATED VALIDATIONS >>> OWNER , RUNNER and DEALER...
//      this.ownerMainGroup.controls['ownerPassportNumber'].clearValidators();
//      this.ownerMainGroup.controls['ownerPassportNumber'].updateValueAndValidity();
//      this.ownerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportNumberControl = group.get('ownerPassportNumber');
//        if (passportNumberControl) { // Ensure passportNumberControl is not null or undefined
//         passportNumberControl.clearValidators();
//         passportNumberControl.setValidators([Validators.maxLength(256)]) ;
//         passportNumberControl.updateValueAndValidity();
//        }
//      })

//      this.ownerMainGroup.controls['ownerPassportIssueDate'].clearValidators();
//      this.ownerMainGroup.controls['ownerPassportIssueDate'].updateValueAndValidity();
//      this.ownerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportIssueDateControl = group.get('ownerPassportIssueDate');
//        if (passportIssueDateControl) { // Ensure passportIssueDateControl is not null or undefined
//         passportIssueDateControl.clearValidators();
//         passportIssueDateControl.updateValueAndValidity();
//        }
//      })

//      this.ownerMainGroup.controls['ownerPassportExpiryDate'].clearValidators();
//      this.ownerMainGroup.controls['ownerPassportExpiryDate'].updateValueAndValidity();
//      this.ownerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportExpControl = group.get('ownerPassportExpiryDate');
//        if (passportExpControl) { // Ensure passportExpControl is not null or undefined
//         passportExpControl.clearValidators();
//         passportExpControl.updateValueAndValidity();
//        }
//      })

//      this.runnerMainGroup.controls['runnerPassportNumber'].clearValidators();
//      this.runnerMainGroup.controls['runnerPassportNumber'].updateValueAndValidity();
//      this.runnerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportNumberControl = group.get('runnerPassportNumber');
//        if (passportNumberControl) { // Ensure passportNumberControl is not null or undefined
//         passportNumberControl.clearValidators();
//         passportNumberControl.updateValueAndValidity();
//        }
//      })

//      this.runnerMainGroup.controls['runnerPassportIssueDate'].clearValidators();
//      this.runnerMainGroup.controls['runnerPassportIssueDate'].updateValueAndValidity();
//      this.runnerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportIssueDateControl = group.get('runnerPassportIssueDate');
//        if (passportIssueDateControl) { // Ensure passportIssuedateControl is not null or undefined
//         passportIssueDateControl.clearValidators();
//         passportIssueDateControl.updateValueAndValidity();
//        }
//      })

//      this.runnerMainGroup.controls['runnerPassportExpiryDate'].clearValidators();
//      this.runnerMainGroup.controls['runnerPassportExpiryDate'].updateValueAndValidity();
//      this.runnerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportExpControl = group.get('runnerPassportExpiryDate');
//        if (passportExpControl) { // Ensure passportExpControl is not null or undefined
//         passportExpControl.clearValidators();
//         passportExpControl.updateValueAndValidity();
//        }
//      })

//      this.dealerMainGroup.controls['dealerPassportNumber'].clearValidators();
//      this.dealerMainGroup.controls['dealerPassportNumber'].updateValueAndValidity();
//      this.dealerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportNumberControl = group.get('dealerPassportNumber');
//        if (passportNumberControl) { // Ensure passportNumberControl is not null or undefined
//         passportNumberControl.clearValidators();
//         passportNumberControl.updateValueAndValidity();
//        }
//      })

//      this.dealerMainGroup.controls['dealerPassportIssueDate'].clearValidators();
//      this.dealerMainGroup.controls['dealerPassportIssueDate'].updateValueAndValidity();
//      this.dealerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportIssueDateControl = group.get('dealerPassportIssueDate');
//        if (passportIssueDateControl) { // Ensure passportIssuedateControl is not null or undefined
//         passportIssueDateControl.clearValidators();
//         passportIssueDateControl.updateValueAndValidity();
//        }
//      })

//      this.dealerMainGroup.controls['dealerPassportExpiryDate'].clearValidators();
//      this.dealerMainGroup.controls['dealerPassportExpiryDate'].updateValueAndValidity();
//      this.dealerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportExpControl = group.get('dealerPassportExpiryDate');
//        if (passportExpControl) { // Ensure passportExpControl is not null or undefined
//         passportExpControl.clearValidators();
//         passportExpControl.updateValueAndValidity();
//        }
//      })

//   }
//   else if(type == "OC" || type == "RA"){ //Passport Number , Passport Expiry and Passport Issue Date are non mandatory , also NRIC related informations are non mandatory .
   

//      //CLEARING NRIC RELATED VALIDATIONS ...
//      this.ownerMainGroup.controls['nric'].clearValidators();
//      this.ownerMainGroup.controls['nric'].updateValueAndValidity();
//      this.ownerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const nricControl = group.get('nric');
//        if (nricControl) { // Ensure nricControl is not null or undefined
//         nricControl.clearValidators();
//         nricControl.updateValueAndValidity();
//        }
//      })
 
//      this.dealerMainGroup.controls['dealerNric'].clearValidators();
//      this.dealerMainGroup.controls['dealerNric'].updateValueAndValidity();
//      this.dealerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const nricControl = group.get('dealerNric');
//        if (nricControl) { // Ensure nricControl is not null or undefined
//         nricControl.clearValidators();
//         nricControl.updateValueAndValidity();
//        }
//      })
 
//      this.runnerMainGroup.controls['runnerNric'].clearValidators();
//      this.runnerMainGroup.controls['runnerNric'].updateValueAndValidity();
//      this.runnerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const nricControl = group.get('runnerNric');
//        if (nricControl) { // Ensure nricControl is not null or undefined
//         nricControl.clearValidators();
//         nricControl.updateValueAndValidity();
//        }
//      })

//   }
 
//   else {

//   }
// }


// //Based on type , need to setup validations for NRIC related informations and passport related informations .
// performConditionalValidtionForOwner(type: string){
//   if(type == "LC"){ 
//     //NRIC Number and NRIC expiry date is mandatory , whereas Passport related informations are non mandatory .
//     this.ownerMainGroup.controls['nric'].setValidators([Validators.required , Validators.pattern(this.nricPattern), this.removeSpaces]);
//     this.ownerMainGroup.controls['nric'].updateValueAndValidity();
//     this.ownerGroupsArray.controls.forEach((group : AbstractControl)=>{
//       const nricControl = group.get('nric');
//       if (nricControl) { // Ensure nricControl is not null or undefined
//        nricControl.setValidators([Validators.required ,Validators.pattern(this.nricPattern), this.removeSpaces]);
//        nricControl.updateValueAndValidity();
//       }
//     })

//      //CLEARING PASSPORT RELATED VALIDATIONS >>> OWNER , RUNNER and DEALER...
//      this.ownerMainGroup.controls['ownerPassportNumber'].clearValidators();
//      this.ownerMainGroup.controls['ownerPassportNumber'].updateValueAndValidity();
//      this.ownerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportNumberControl = group.get('ownerPassportNumber');
//        if (passportNumberControl) { // Ensure passportNumberControl is not null or undefined
//         passportNumberControl.clearValidators();
//         passportNumberControl.setValidators([Validators.maxLength(256)]) ;
//         passportNumberControl.updateValueAndValidity();
//        }
//      })

//      this.ownerMainGroup.controls['ownerPassportIssueDate'].clearValidators();
//      this.ownerMainGroup.controls['ownerPassportIssueDate'].updateValueAndValidity();
//      this.ownerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportIssueDateControl = group.get('ownerPassportIssueDate');
//        if (passportIssueDateControl) { // Ensure passportIssueDateControl is not null or undefined
//         passportIssueDateControl.clearValidators();
//         passportIssueDateControl.updateValueAndValidity();
//        }
//      })

//      this.ownerMainGroup.controls['ownerPassportExpiryDate'].clearValidators();
//      this.ownerMainGroup.controls['ownerPassportExpiryDate'].updateValueAndValidity();
//      this.ownerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportExpControl = group.get('ownerPassportExpiryDate');
//        if (passportExpControl) { // Ensure passportExpControl is not null or undefined
//         passportExpControl.clearValidators();
//         passportExpControl.updateValueAndValidity();
//        }
//      })
    

//   }
//   else if(type == "OC" || type == "RA"){ //Passport Number , Passport Expiry and Passport Issue Date are non mandatory , whereas also NRIC related informations are non mandatory .

//      //CLEARING NRIC RELATED VALIDATIONS ...
//      this.ownerMainGroup.controls['nric'].clearValidators();
//      this.ownerMainGroup.controls['nric'].updateValueAndValidity();
//      this.ownerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const nricControl = group.get('nric');
//        if (nricControl) { // Ensure nricControl is not null or undefined
//         nricControl.clearValidators();
//         nricControl.updateValueAndValidity();
//        }
//      })

//   }
 
//   else {
//     console.log("test") ;
//   }
// }


// //Based on type , need to setup validations for NRIC related informations and passport related informations .
// performConditionalValidtionForDealer(type: string){
//   if(type == "LC"){ //NRIC Number and NRIC expiry date is mandatory , whereas Passport related informations are non mandatory .

//     this.dealerMainGroup.controls['dealerNric'].setValidators(([Validators.required ,Validators.pattern(this.nricPattern), this.removeSpaces]));
//     this.dealerMainGroup.controls['dealerNric'].updateValueAndValidity();
//     this.dealerGroupsArray.controls.forEach((group : AbstractControl)=>{
//       const nricControl = group.get('dealerNric');
//       if (nricControl) { // Ensure nricControl is not null or undefined
//        nricControl.setValidators([Validators.required ,Validators.pattern(this.nricPattern), this.removeSpaces]);
//        nricControl.updateValueAndValidity();
//       }
//     })


//      this.dealerMainGroup.controls['dealerPassportNumber'].clearValidators();
//      this.dealerMainGroup.controls['dealerPassportNumber'].updateValueAndValidity();
//      this.dealerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportNumberControl = group.get('dealerPassportNumber');
//        if (passportNumberControl) { // Ensure passportNumberControl is not null or undefined
//         passportNumberControl.clearValidators();
//         passportNumberControl.updateValueAndValidity();
//        }
//      })

//      this.dealerMainGroup.controls['dealerPassportIssueDate'].clearValidators();
//      this.dealerMainGroup.controls['dealerPassportIssueDate'].updateValueAndValidity();
//      this.dealerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportIssueDateControl = group.get('dealerPassportIssueDate');
//        if (passportIssueDateControl) { // Ensure passportIssuedateControl is not null or undefined
//         passportIssueDateControl.clearValidators();
//         passportIssueDateControl.updateValueAndValidity();
//        }
//      })

//      this.dealerMainGroup.controls['dealerPassportExpiryDate'].clearValidators();
//      this.dealerMainGroup.controls['dealerPassportExpiryDate'].updateValueAndValidity();
//      this.dealerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportExpControl = group.get('dealerPassportExpiryDate');
//        if (passportExpControl) { // Ensure passportExpControl is not null or undefined
//         passportExpControl.clearValidators();
//         passportExpControl.updateValueAndValidity();
//        }
//      })

//   }
//   else if(type == "OC" || type == "RA"){ //Passport Number , Passport Expiry and Passport Issue Date are non mandatory , whereas also NRIC related informations are non mandatory .
 
//      this.dealerMainGroup.controls['dealerNric'].clearValidators();
//      this.dealerMainGroup.controls['dealerNric'].updateValueAndValidity();
//      this.dealerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const nricControl = group.get('dealerNric');
//        if (nricControl) { // Ensure nricControl is not null or undefined
//         nricControl.clearValidators();
//         nricControl.updateValueAndValidity();
//        }
//      })
 
//   }
 
//   else {
//     console.log("test") ;
//   }
// }

// //Based on type , need to setup validations for NRIC related informations and passport related informations .
// performConditionalValidtionForRunner(type: string){
//   if(type == "LC"){ //NRIC Number and NRIC expiry date is mandatory , whereas Passport related informations are non mandatory .

//     this.runnerMainGroup.controls['runnerNric'].setValidators(([Validators.required ,Validators.pattern(this.nricPattern), this.removeSpaces]));
//     this.runnerMainGroup.controls['runnerNric'].updateValueAndValidity();
//     this.runnerGroupsArray.controls.forEach((group : AbstractControl)=>{
//       const nricControl = group.get('runnerNric');
//       if (nricControl) { // Ensure nricControl is not null or undefined
//        nricControl.setValidators([Validators.required ,Validators.pattern(this.nricPattern), this.removeSpaces]);
//        nricControl.updateValueAndValidity();
//       }
//     })

//      //CLEARING PASSPORT RELATED VALIDATIONS >>> OWNER , RUNNER and DEALER...
//      this.runnerMainGroup.controls['runnerPassportNumber'].clearValidators();
//      this.runnerMainGroup.controls['runnerPassportNumber'].updateValueAndValidity();
//      this.runnerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportNumberControl = group.get('runnerPassportNumber');
//        if (passportNumberControl) { // Ensure passportNumberControl is not null or undefined
//         passportNumberControl.clearValidators();
//         passportNumberControl.updateValueAndValidity();
//        }
//      })

//      this.runnerMainGroup.controls['runnerPassportIssueDate'].clearValidators();
//      this.runnerMainGroup.controls['runnerPassportIssueDate'].updateValueAndValidity();
//      this.runnerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportIssueDateControl = group.get('runnerPassportIssueDate');
//        if (passportIssueDateControl) { // Ensure passportIssuedateControl is not null or undefined
//         passportIssueDateControl.clearValidators();
//         passportIssueDateControl.updateValueAndValidity();
//        }
//      })

//      this.runnerMainGroup.controls['runnerPassportExpiryDate'].clearValidators();
//      this.runnerMainGroup.controls['runnerPassportExpiryDate'].updateValueAndValidity();
//      this.runnerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const passportExpControl = group.get('runnerPassportExpiryDate');
//        if (passportExpControl) { // Ensure passportExpControl is not null or undefined
//         passportExpControl.clearValidators();
//         passportExpControl.updateValueAndValidity();
//        }
//      })


//   }
//   else if(type == "OC" || type == "RA"){ //Passport Number , Passport Expiry and Passport Issue Date are non mandatory , whereas also NRIC related informations are non mandatory .

//      //CLEARING NRIC RELATED VALIDATIONS ...
//      this.runnerMainGroup.controls['runnerNric'].clearValidators();
//      this.runnerMainGroup.controls['runnerNric'].updateValueAndValidity();
//      this.runnerGroupsArray.controls.forEach((group : AbstractControl)=>{
//        const nricControl = group.get('runnerNric');
//        if (nricControl) { // Ensure nricControl is not null or undefined
//         nricControl.clearValidators();
//         nricControl.updateValueAndValidity();
//        }
//      })

//   }
 
//   else {
//    console.log('test') ;
//   }
// }


//this function triggers when value entered in main owner nationality field 
filterMainOwnerNationality(nationality:HTMLInputElement){
  nationality.value = nationality.value.toUpperCase() ;
  if (nationality.value == '') {
    // If the search input is empty, show all nationalities
    this.filteredMainOwnerNationalities = this.nationalityArray;
}
else {
    // Filter nationality based on the search input
    this.filteredMainOwnerNationalities = this.nationalityArray.filter((v: any) => v.NATIONALITY.includes(nationality.value));
    if(this.filteredMainOwnerNationalities.length == 0){
      this.filteredMainOwnerNationalities = this.nationalityArray;
    }  
}
}

//this function triggers when value entered in main dealer nationality field 
filterMainDealerNationality(nationality:HTMLInputElement){
  nationality.value = nationality.value.toUpperCase() ;
  if (nationality.value == '') {
    // If the search input is empty, show all nationalities
    this.filteredMainDealerNationalities = this.nationalityArray;
}
else {
    // Filter nationality based on the search input
    this.filteredMainDealerNationalities = this.nationalityArray.filter((v: any) => v.NATIONALITY.includes(nationality.value));
    if(this.filteredMainDealerNationalities.length == 0){
      this.filteredMainDealerNationalities = this.nationalityArray;
    }  
}
}

//this function triggers when value entered in main runner nationality field 
filterMainRunnerNationality(nationality:HTMLInputElement){
  nationality.value = nationality.value.toUpperCase() ;
  if (nationality.value == '') {
    // If the search input is empty, show all nationalities
    this.filteredMainRunnerNationalities = this.nationalityArray;
}
else {
    // Filter nationality based on the search input
    this.filteredMainRunnerNationalities = this.nationalityArray.filter((v: any) => v.NATIONALITY.includes(nationality.value));
    if(this.filteredMainRunnerNationalities.length == 0){
      this.filteredMainRunnerNationalities = this.nationalityArray;
    }  
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
        // if the value consists of whitespace or fullstop at beginning of string , return an error object
        return { "isWhitespace": true };
      }
      // otherwise, return null (no error)
      return null;
      
    }
 
  //CORPORATE MOBILE > SAVE ASSOCIATES .
    onSave(){
      this.saveCompanyAssociate = false;
      this.loader = true;
      //enhance the buildCompanyAssociatesDetails based on enhanced request body ..
        this.corporateService.corporateApplicationUpdate(this.buildCompanyAssociatesDetails('MOBILE'),'').subscribe(data => {
            console.log(data);
             this.router.navigate(['profile/corporate-dashboard'])
             this.saveCompanyAssociate = true;
             this.loader = false;
             this.applicationService.corporateScreenstatus('associatesFlag')
            this.alertService.clear()
            this.alertService.success("Registration Successful!!");
            //success message
            //alertService.succes
          },
           //error handling Completed on 06-07-2023 - <DN>
          (error : any) => {
            console.log(error.message);
            this.saveCompanyAssociate = true;
             this.loader = false;
             if(error.status != 401){
              this.dialogRef.open(ErrorDialogAdminComponent,{
                data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
              });
            }
            this.alertService.clear()
            this.alertService.error("Login Failed. Try Again");
           })
    }

    buildCompanyAssociatesDetails(channel:string): CompanyProfile{
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
        "applicantId" : applicantId ,
        "corporate":this.buildCorporate()
      })
    }
    
    buildCorporate():CorporateProfile{
      let corporateId = this.store.getItem('USER_ID');
      let mcCorporateApplicantId = this.store.getItem('MC_CORP_APPLICANTID') ? this.store.getItem('MC_CORP_APPLICANTID') : "" ;
      if(mcCorporateApplicantId != ""){
      corporateId = mcCorporateApplicantId ;
      }
      return new CorporateProfile({
        "corporateId":corporateId,
        "associate":this.buildCompanyAssociate()
      })
    }

    buildCompanyAssociate(): CorporateAssociate[] {
      console.log("buildCompanyAssociate") ;
      let dealerDate = null ;
      let ownerDate = null ;
      let runnerDate = null ;
      //dealerdob
      let dealerDobCheck = this.dealerMainGroup.controls['dealerDob'].value ? this.dealerMainGroup.controls['dealerDob'].value : "" ;
      if(dealerDobCheck != ""){
        this.dealerDobDate = moment(this.dealerMainGroup.controls['dealerDob'].value);
        dealerDate = this.dealerDobDate.format('YYYY') + "-" + this.dealerDobDate.format('MM') + "-" + this.dealerDobDate.format('DD');
      }
      //ownerdob
      let ownerDobCheck = this.ownerMainGroup.controls['dob'].value ? this.ownerMainGroup.controls['dob'].value : "" ;
      if(ownerDobCheck != ""){
        this.ownerDobDate = moment(this.ownerMainGroup.controls['dob'].value);
        ownerDate = this.ownerDobDate.format('YYYY') + "-" + this.ownerDobDate.format('MM') + "-" + this.ownerDobDate.format('DD');
      }
      //runnerdob
      let runnerDobCheck = this.runnerMainGroup.controls['runnerDob'].value ? this.runnerMainGroup.controls['runnerDob'].value : "" ;
      if(runnerDobCheck != ""){
        this.runnerDobDate = moment(this.runnerMainGroup.controls['runnerDob'].value);
        runnerDate = this.runnerDobDate.format('YYYY') + "-" + this.runnerDobDate.format('MM') + "-" + this.runnerDobDate.format('DD')
      }

          //passport expiry series
          let ownerPassportExpiryDate = null ;
          let dealerPassportExpiryDate = null ;
          let runnerPassportExpiryDate = null ;

          //passport issue date series
          let ownerPassportIssueDate = null ;
          let dealerPassportIssueDate = null ;
          let runnerPassportIssueDate = null ;

          let passportExpiryOwnerDateCheck = this.ownerMainGroup.controls['ownerPassportExpiryDate'].value ? this.ownerMainGroup.controls['ownerPassportExpiryDate'].value : "" ;
          let passportExpiryDealerCheck = this.dealerMainGroup.controls['dealerPassportExpiryDate'].value ? this.dealerMainGroup.controls['dealerPassportExpiryDate'].value : "" ;
          let passportExpiryRunnerCheck = this.runnerMainGroup.controls['runnerPassportExpiryDate'].value ? this.runnerMainGroup.controls['runnerPassportExpiryDate'].value : "" ;

          let passportIssueDateOwnerCheck = this.ownerMainGroup.controls['ownerPassportIssueDate'].value ? this.ownerMainGroup.controls['ownerPassportIssueDate'].value : "" ;
          let passportIssueDateDealerCheck = this.dealerMainGroup.controls['dealerPassportIssueDate'].value ? this.dealerMainGroup.controls['dealerPassportIssueDate'].value : "" ;
          let passportIssueDateRunnerCheck = this.runnerMainGroup.controls['runnerPassportIssueDate'].value ? this.runnerMainGroup.controls['runnerPassportIssueDate'].value : "" ;

      if (passportExpiryOwnerDateCheck != "") {
        this.passportExpiryOwnerDate = moment(this.ownerMainGroup.controls['ownerPassportExpiryDate'].value);
        ownerPassportExpiryDate = this.passportExpiryOwnerDate.format('YYYY') + "-" + this.passportExpiryOwnerDate.format('MM') + "-" + this.passportExpiryOwnerDate.format('DD');
      }
      if (passportExpiryDealerCheck != "") {
        //passport expiry -> dealer
        this.passportExpiryDealerDate = moment(this.dealerMainGroup.controls['dealerPassportExpiryDate'].value);
        dealerPassportExpiryDate = this.passportExpiryDealerDate.format('YYYY') + "-" + this.passportExpiryDealerDate.format('MM') + "-" + this.passportExpiryDealerDate.format('DD');
      }
      if (passportExpiryRunnerCheck != "") {
        //passport expiry -> runner
        this.passportExpiryRunnerDate = moment(this.runnerMainGroup.controls['runnerPassportExpiryDate'].value);
        runnerPassportExpiryDate = this.passportExpiryRunnerDate.format('YYYY') + "-" + this.passportExpiryRunnerDate.format('MM') + "-" + this.passportExpiryRunnerDate.format('DD')
      }
       //passport issue date -> owner
      if (passportIssueDateOwnerCheck != "") {
        this.passportIssueDateOwner = moment(this.ownerMainGroup.controls['ownerPassportIssueDate'].value);
        ownerPassportIssueDate = this.passportIssueDateOwner.format('YYYY') + "-" + this.passportIssueDateOwner.format('MM') + "-" + this.passportIssueDateOwner.format('DD')
      }
       //passport issue date -> dealer
       if (passportIssueDateDealerCheck != "") {
        this.passportIssueDateDealer = moment(this.dealerMainGroup.controls['dealerPassportIssueDate'].value);
        dealerPassportIssueDate = this.passportIssueDateDealer.format('YYYY') + "-" + this.passportIssueDateDealer.format('MM') + "-" + this.passportIssueDateDealer.format('DD')
      }
       //passport issue date -> runner
       if (passportIssueDateRunnerCheck != "") {
        this.passportIssueDateRunner = moment(this.runnerMainGroup.controls['runnerPassportIssueDate'].value);
        runnerPassportIssueDate = this.passportIssueDateRunner.format('YYYY') + "-" + this.passportIssueDateRunner.format('MM') + "-" + this.passportIssueDateRunner.format('DD')
      }

      let associates: CorporateAssociate[] = [];

      let runnerMainGroupAssociateId : string = this.runnerMainGroup.controls['associateId'].value ? this.runnerMainGroup.controls['associateId'].value : "" ;
      let ownerMainGroupAssociateId : string = this.ownerMainGroup.controls['associateId'].value ? this.ownerMainGroup.controls['associateId'].value : "" ;
      let dealerMainGroupAssociateId : string = this.dealerMainGroup.controls['associateId'].value ? this.dealerMainGroup.controls['associateId'].value : "" ;
      let runnerMainGroupStatus : string = this.runnerMainGroup.controls['status'].value ? this.runnerMainGroup.controls['status'].value : "" ;
      let ownerMainGroupStatus : string = this.ownerMainGroup.controls['status'].value ? this.ownerMainGroup.controls['status'].value : "" ;
      let dealerMainGroupStatus : string = this.dealerMainGroup.controls['status'].value ? this.dealerMainGroup.controls['status'].value : "" ;

      // Assign actions for runner, owner, and dealer
      let runnerAction: string = this.determineAction(runnerMainGroupAssociateId, runnerMainGroupStatus);
      let ownerAction: string = this.determineAction(ownerMainGroupAssociateId, ownerMainGroupStatus);
      let dealerAction: string = this.determineAction(dealerMainGroupAssociateId, dealerMainGroupStatus);
      
      associates.push(new CorporateAssociate({
        associateId : this.runnerMainGroup.controls['associateId'].value ? this.runnerMainGroup.controls['associateId'].value : "" ,
        "jobTitle" : "RUNNER",
        "name": this.runnerMainGroup.controls['runnerFullname'].value,
        "idNumber":this.runnerMainGroup.controls['runnerNric'].value,
        "gender": this.runnerMainGroup.controls['runnerGender'].value,
        "nationality" : this.runnerMainGroup.controls['runnerNationality'].value,
        "emailId" : this.runnerMainGroup.controls['runnerEmail'].value,
        "phoneNo" : this.runnerMainGroup.controls['runnerPhoneNumber'].value,
        "dob" : runnerDate,
        "passportNumber": this.runnerMainGroup.controls['runnerPassportNumber'].value ? this.runnerMainGroup.controls['runnerPassportNumber'].value : "",
        "passportExpiry": runnerPassportExpiryDate ? runnerPassportExpiryDate : null,
        "passportIssueDate" : runnerPassportIssueDate,
        "overseasId" : this.runnerMainGroup.controls['runnerOverseasId'].value ? this.runnerMainGroup.controls['runnerOverseasId'].value : "",
        "action" : runnerAction,
        "address" : this.buildUpdateRunnerAddressPayload('RUNNER_MAIN_GROUP','')
      }));
      associates.push(new CorporateAssociate({
        "associateId" :  this.ownerMainGroup.controls['associateId'].value ? this.ownerMainGroup.controls['associateId'].value : "" ,
        "jobTitle" : "OWNER",
        "name": this.ownerMainGroup.controls['fullName'].value,
        "idNumber":this.ownerMainGroup.controls['nric'].value,
        "gender": this.ownerMainGroup.controls['gender'].value,
        "nationality" : this.ownerMainGroup.controls['nationality'].value ,
        "emailId" : this.ownerMainGroup.controls['email'].value,
        "phoneNo" : this.ownerMainGroup.controls['phoneNumber'].value ,
        "dob" : ownerDate,
        "passportNumber": this.ownerMainGroup.controls['ownerPassportNumber'].value ? this.ownerMainGroup.controls['ownerPassportNumber'].value : "",
        "passportExpiry": ownerPassportExpiryDate ? ownerPassportExpiryDate : null,
        "passportIssueDate" : ownerPassportIssueDate,
        "overseasId" : this.ownerMainGroup.controls['ownerOverseasId'].value ? this.ownerMainGroup.controls['ownerOverseasId'].value : "",
        "action" : ownerAction,
        "address" : this.buildUpdateOwnerAddressPayload('OWNER_MAIN_GROUP','')
      }));
      associates.push(new CorporateAssociate({
        "associateId" : this.dealerMainGroup.controls['associateId'].value ? this.dealerMainGroup.controls['associateId'].value : "" ,
        "jobTitle" : "DEALER",
        "name": this.dealerMainGroup.controls['dealerFullname'].value,
        "idNumber":this.dealerMainGroup.controls['dealerNric'].value,
        "gender": this.dealerMainGroup.controls['dealerGender'].value,
        "nationality" :  this.dealerMainGroup.controls['dealerNationality'].value,
        "emailId" : this.dealerMainGroup.controls['dealerEmail'].value,
        "phoneNo" : this.dealerMainGroup.controls['dealerPhoneNumber'].value,
        "dob" : dealerDate,
        "passportNumber": this.dealerMainGroup.controls['dealerPassportNumber'].value ? this.dealerMainGroup.controls['dealerPassportNumber'].value : "",
        "passportExpiry": dealerPassportExpiryDate ? dealerPassportExpiryDate : null,
        "passportIssueDate" : dealerPassportIssueDate,
        "overseasId" : this.dealerMainGroup.controls['dealerOverseasId'].value ? this.dealerMainGroup.controls['dealerOverseasId'].value : "",
        "action" : dealerAction,
        "address" : this.buildUpdateDealerAddressPayload('DEALER_MAIN_GROUP','')
      }));

      // to add associate objects for multiple owner
var ownerArray : any = this.ownerGroupsArray.value; 

for (var i = 0; i < ownerArray.length; i++) { // loop will itereate corresponding multiple owner
  //Date Of Birth
  var ownerValue = ownerArray[i];
  let ownerDynamicAddress = ownerValue.address ? ownerValue.address : "" ;
  let ownerDobDate = moment(ownerValue.dob);
  const dobOwner = ownerDobDate.format("YYYY") + "-" + ownerDobDate.format("MM") + "-" +  ownerDobDate.format("DD");
  // Passport Expiry Date
  let ownerPassportExpiryDate = null ;
  let ownerPassportExpiryDateCheck = ownerArray[i].ownerPassportExpiryDate ? ownerArray[i].ownerPassportExpiryDate : "" ;
  if (ownerPassportExpiryDateCheck != "") {
    let momentOwnerExpiry = moment(ownerArray[i].ownerPassportExpiryDate);
    ownerPassportExpiryDate = momentOwnerExpiry.format('YYYY') + "-" + momentOwnerExpiry.format('MM') + "-" + momentOwnerExpiry.format('DD');
  }
   // Passport Issue Date
   let ownerPassportIssueDate = null ;
   let ownerPassportIssueDateCheck = ownerArray[i].ownerPassportIssueDate ? ownerArray[i].ownerPassportIssueDate : "" ;
   if (ownerPassportIssueDateCheck != "") {
     let momentOwnerPassportIssueDate = moment(ownerArray[i].ownerPassportIssueDate);
     ownerPassportIssueDate = momentOwnerPassportIssueDate.format('YYYY') + "-" + momentOwnerPassportIssueDate.format('MM') + "-" + momentOwnerPassportIssueDate.format('DD');
   }
   
      let ownerSubGroupAssociateId : string = ownerValue.associateId ? ownerValue.associateId : "" ;
      let ownerSubGroupStatus : string = ownerValue.status ? ownerValue.status : "" ;
      let ownerAction: string = this.determineAction(ownerSubGroupAssociateId, ownerSubGroupStatus);

  var addOwner = new CorporateAssociate({
    "associateId" :  ownerValue.associateId ? ownerValue.associateId : "",
    "jobTitle" : "OWNER",
    "name": ownerValue.fullName,
    "idNumber": ownerValue.nric,
    "gender": ownerValue.gender,
    "nationality" : ownerValue.nationality,
    "emailId" : ownerValue.email,
    "phoneNo" :  ownerValue.phoneNumber ,
    "dob" : dobOwner,
    "passportNumber": ownerValue.ownerPassportNumber ? ownerValue.ownerPassportNumber : "",
    "passportExpiry": ownerPassportExpiryDate ,
    "passportIssueDate" : ownerPassportIssueDate,
    "overseasId" : ownerValue.ownerOverseasId ? ownerValue.ownerOverseasId : "",
    "action" : ownerAction,
    "address" : this.buildUpdateOwnerAddressPayload('OWNER_ARRAY',ownerDynamicAddress) 
  });

  associates.push(addOwner);
}

// to add associate objects for multiple dealer
var dealerArray : any = this.dealerGroupsArray.value;
console.log('DEALER ARRAY', dealerArray) ;
for (var i = 0; i < dealerArray.length; i++) {  // loop will itereate corresponding multiple dealer
  var dealerValue = dealerArray[i];
  let dealerArrayAddress = dealerValue.address ? dealerValue.address : "" ;
  //Dealer Date Of Birth
  let dealerDobDate = moment(dealerValue.dealerDob);
  const dobDealer = dealerDobDate.format("YYYY") + "-" + dealerDobDate.format("MM") + "-" +  dealerDobDate.format("DD");

  // Dealer Passport Expiry Date
  let dealerPassportExpiryDate = null ;
  let dealerPassportExpiryDateCheck = dealerArray[i].dealerPassportExpiryDate ? dealerArray[i].dealerPassportExpiryDate : "" ;
  if (dealerPassportExpiryDateCheck != "") {
    let momentDealerPassportExpiry = moment(dealerArray[i].dealerPassportExpiryDate);
    dealerPassportExpiryDate = momentDealerPassportExpiry.format('YYYY') + "-" + momentDealerPassportExpiry.format('MM') + "-" + momentDealerPassportExpiry.format('DD');
  }
   // Dealer Passport Issue Date
   let dealerPassportIssueDate = null ;
   let dealerPassportIssueDateCheck = dealerArray[i].dealerPassportIssueDate ? dealerArray[i].dealerPassportIssueDate : "" ;
   if (dealerPassportIssueDateCheck != "") {
     let momentDealerPassportIssueDate = moment(dealerArray[i].dealerPassportIssueDate);
     dealerPassportIssueDate = momentDealerPassportIssueDate.format('YYYY') + "-" + momentDealerPassportIssueDate.format('MM') + "-" + momentDealerPassportIssueDate.format('DD');
   }

   let dealerSubGroupAssociateId : string = dealerValue.associateId ? dealerValue.associateId : "" ;
   let dealerSubGroupStatus : string = dealerValue.status ? dealerValue.status : "" ;
   let dealerAction: string = this.determineAction(dealerSubGroupAssociateId, dealerSubGroupStatus);

  var addDealer= new CorporateAssociate({
    "associateId" :  dealerValue.associateId ? dealerValue.associateId : "",
    "name": dealerValue.dealerFullname,
    "jobTitle": "DEALER",
    "dob": dobDealer,
    "gender": dealerValue.dealerGender,
    "idNumber": dealerValue.dealerNric,
    "nationality": dealerValue.dealerNationality,
    "emailId": dealerValue.dealerEmail,
    "phoneNo": dealerValue.dealerPhoneNumber,
    "passportNumber": dealerValue.dealerPassportNumber ? dealerValue.dealerPassportNumber : "",
    "passportExpiry": dealerPassportExpiryDate ,
    "passportIssueDate" : dealerPassportIssueDate,
    "overseasId" : dealerValue.dealerOverseasId ? dealerValue.dealerOverseasId : "",
    "action" : dealerAction,
    "address" : this.buildUpdateDealerAddressPayload('DEALER_ARRAY',dealerArrayAddress)
  });
  associates.push(addDealer);
}

// to add associate objects for multiple runner
var runnerArray : any = this.runnerGroupsArray.value;
for (var i = 0; i < runnerArray.length; i++) { // loop will itereate corresponding multiple runner
  var runnerValue = runnerArray[i];
  let runnerArrayAddress = runnerValue.address ? runnerValue.address : "" ;
  let runnerDobDate = moment(runnerValue.runnerDob);
  const dobRunner = runnerDobDate.format("YYYY") + "-" + runnerDobDate.format("MM") + "-" +  runnerDobDate.format("DD");

  // Runner Passport Expiry Date
  let runnerPassportExpiryDate = null ;
  let runnerPassportExpiryDateCheck = runnerArray[i].runnerPassportExpiryDate ? runnerArray[i].runnerPassportExpiryDate : "" ;
  if (runnerPassportExpiryDateCheck != "") {
    let momentRunnerPassportExpiry = moment(runnerArray[i].runnerPassportExpiryDate);
    runnerPassportExpiryDate = momentRunnerPassportExpiry.format('YYYY') + "-" + momentRunnerPassportExpiry.format('MM') + "-" + momentRunnerPassportExpiry.format('DD');
  }
   // Runner Passport Issue Date
   let runnerPassportIssueDate = null ;
   let runnerPassportIssueDateCheck = runnerArray[i].runnerPassportIssueDate ? runnerArray[i].runnerPassportIssueDate : "" ;
   if (runnerPassportIssueDateCheck != "") {
     let momentRunnerPassportIssueDate = moment(runnerArray[i].runnerPassportIssueDate);
     runnerPassportIssueDate = momentRunnerPassportIssueDate.format('YYYY') + "-" + momentRunnerPassportIssueDate.format('MM') + "-" + momentRunnerPassportIssueDate.format('DD');
   }

   let runnerSubGroupAssociateId : string = runnerValue.associateId ? runnerValue.associateId : "" ;
   let runnerSubGroupStatus : string = runnerValue.status ? runnerValue.status : "" ;
   let runnerAction: string = this.determineAction(runnerSubGroupAssociateId, runnerSubGroupStatus);

  var addRunner = new CorporateAssociate({
    "associateId": runnerValue.associateId ? runnerValue.associateId : null,
    "name": runnerValue.runnerFullname,
    "jobTitle": "RUNNER",
    "dob": dobRunner,
    "gender": runnerValue.runnerGender,
    "idNumber": runnerValue.runnerNric,
    "nationality": runnerValue.runnerNationality,
    "emailId": runnerValue.runnerEmail,
    "phoneNo": runnerValue.runnerPhoneNumber,
    "passportNumber": runnerValue.runnerPassportNumber ? runnerValue.runnerPassportNumber : "",
    "passportExpiry": runnerPassportExpiryDate ,
    "passportIssueDate" : runnerPassportIssueDate,
    "overseasId" : runnerValue.runnerOverseasId ? runnerValue.runnerOverseasId : "",
    "action" : runnerAction,
    "address" : this.buildUpdateRunnerAddressPayload('RUNNER_ARRAY',runnerArrayAddress)
  });
  associates.push(addRunner);
}
// Filter out objects with empty values (will not pass empty value object inside request payload)
associates = associates.filter((associate) => {
  return (
    (associate.name?.trim() !== "" && associate.name != null) &&
    (associate.dob !== "Invalid date-Invalid date-Invalid date" && associate.dob != null) &&
    (associate.gender?.trim() !== "" && associate.gender != null) &&
   // (associate.idNumber?.trim() !== "" && associate.idNumber != null) &&
    (associate.nationality?.trim() !== "" && associate.nationality != null) &&
    (associate.emailId?.trim() !== "" && associate.emailId != null) &&
    (associate.phoneNo?.trim() !== "" && associate.phoneNo != null)
  );
  });
      return associates;
      
    }

  buildUpdateOwnerAddressPayload(flag:string,ownerArrayAddress:string): UpdateAssociateAddress[] {
    let addresses: UpdateAssociateAddress[] = [];
    if(flag == "OWNER_MAIN_GROUP"){
    addresses.push(new UpdateAssociateAddress({
      "level": this.ownerMainGroup.controls['address'].value ? this.ownerMainGroup.controls['address'].value : "",
      "unit": "",
      "building": "",
      "streetName": "",
      "countryCode": "",
      "postalCode": "",
    }));
  }
  else if(flag == "OWNER_ARRAY"){
    addresses.push(new UpdateAssociateAddress({
      "level": ownerArrayAddress,
      "unit": "",
      "building": "",
      "streetName": "",
      "countryCode": "",
      "postalCode": "",
    }));
  }
    return addresses;
  }

  buildUpdateDealerAddressPayload(flag:string,dealerArrayAddress:string): UpdateAssociateAddress[] {
    let addresses: UpdateAssociateAddress[] = [];
    if(flag == "DEALER_MAIN_GROUP"){
    addresses.push(new UpdateAssociateAddress({
      "level": this.dealerMainGroup.controls['address'].value ? this.dealerMainGroup.controls['address'].value : "",
      "unit": "",
      "building": "",
      "streetName": "",
      "countryCode": "",
      "postalCode": "",
    }));
   }
   else if(flag == "DEALER_ARRAY"){
    addresses.push(new UpdateAssociateAddress({
      "level": dealerArrayAddress,
      "unit": "",
      "building": "",
      "streetName": "",
      "countryCode": "",
      "postalCode": "",
    }));
  }
    return addresses;
  }

  buildUpdateRunnerAddressPayload(flag:string,runnerArrayAddress:string): UpdateAssociateAddress[] {
    let addresses: UpdateAssociateAddress[] = [];
    if(flag == "RUNNER_MAIN_GROUP"){
    addresses.push(new UpdateAssociateAddress({
      "level": this.runnerMainGroup.controls['address'].value ? this.runnerMainGroup.controls['address'].value : "",
      "unit": "",
      "building": "",
      "streetName": "",
      "countryCode": "",
      "postalCode": "",
    }));
  }
  else if(flag == "RUNNER_ARRAY"){
    addresses.push(new UpdateAssociateAddress({
      "level": runnerArrayAddress,
      "unit": "",
      "building": "",
      "streetName": "",
      "countryCode": "",
      "postalCode": "",
    }));
  }
    return addresses;
  }

    // Determine action based on associateId and status
 determineAction(associateId: string, status: string): string {
  if (status == "INACTIVE") {
      return "DEL";
  } else if (associateId == "") {
      return "ADD";
  } else {
      return "UPD";
  }
}

    goBack(){
        this.router.navigate(['company/company-profile'])
    }

   
    //Application Search > Modal popup > route back to CompanyProfile Component.
    back(){
      let applicationId = this.store.getItem('CORPORATE_APPLICATION_ID');
    this.corporateService.getCorporateApplicationInquiry(applicationId).subscribe(data => {
      this.dialogRef.open(CompanyProfileComponent, {
        data: { applicationCompanyProfileReview:data },
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
    //Application Search > Modal popup > route to CompanyDocuments Component.
    openCompanyDocument() {
    let applicationId = this.store.getItem('CORPORATE_APPLICATION_ID');
    this.corporateService.getCorporateApplicationInquiry(applicationId).subscribe(data => {
      this.dialogRef.open(CompanyDocumentsComponent, {
        data: { applicationCompanyDocumentsReview:data , application_Id : applicationId},
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

     //customer Search > Modal popup > route back to CompanyProfile Component.
     backCompanyProfile(){
      let customerId = this.store.getItem('CUSTOMER_ID');
    this.corporateService.getCorporateCustomerInquiry(customerId).subscribe(data => {
      this.dialogRef.open(CompanyProfileComponent, {
        data: { isCompanyProfileReview:data },
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
    });;
    }
    //customer Search > Modal popup > route to CompanyDocuments Component.
    navigateCompanyDocument() {
      let customerId = this.store.getItem('CUSTOMER_ID');
      this.corporateService.getCorporateCustomerInquiry(customerId).subscribe(data => {
      this.dialogRef.open(CompanyDocumentsComponent, {
        data: { customerCompanyDocumentsReview:data },
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
    });;
    }
     //this function triggers when value entered in search nationality field 
   filterNationality(nationality:HTMLInputElement){
    nationality.value = nationality.value.toUpperCase() ;
    if (nationality.value == '') {
      // If the search input is empty, show all nationalities
      this.filteredOwnerNationalities = this.nationality;
  }
  else {
      // Filter nationality based on the search input
      this.filteredOwnerNationalities = this.nationality.filter((v: any) => v.NATIONALITY.includes(nationality.value));
      if(this.filteredOwnerNationalities.length == 0){
        this.filteredOwnerNationalities = this.nationality;
      }  
  }
  }
  filterDealerNationality(nationality:HTMLInputElement){
    nationality.value = nationality.value.toUpperCase() ;
    if (nationality.value == '') {
      // If the search input is empty, show all nationalities
      this.filteredDealerNationalities = this.nationality;
  }
  else {
      // Filter nationality based on the search input
      this.filteredDealerNationalities = this.nationality.filter((v: any) => v.NATIONALITY.includes(nationality.value));
      if(this.filteredDealerNationalities.length == 0){
        this.filteredDealerNationalities = this.nationality;
      }  
  }
  }
  filterRunnerNationality(nationality:HTMLInputElement){
    nationality.value = nationality.value.toUpperCase() ;
    if (nationality.value == '') {
      // If the search input is empty, show all nationalities
      this.filteredRunnerNationalities = this.nationality;
  }
  else {
      // Filter nationality based on the search input
      this.filteredRunnerNationalities = this.nationality.filter((v: any) => v.NATIONALITY.includes(nationality.value));
      if(this.filteredRunnerNationalities.length == 0){
        this.filteredRunnerNationalities = this.nationality;
      }  
  }
  }

  onCompanyAssociatesOnboardingSubmit(){
    //enhance buildCompanyAssociatesDetails based on request body .
    this.corporateService.corporateApplicationUpdate(this.buildCompanyAssociatesDetails(''),'MC').subscribe((datas:any)=>{
      this.formStatus = "Company Associates Form Submitted Sucessfully"
      this.companyAssociatesStatusChanged.emit('Submitted');
      this.corpStepper.next() ;
    },
        //error handling Completed on 06-07-2023 - <DN>
        (error : any) => {
           if(error.status != 401){
            this.dialogRef.open(ErrorDialogAdminComponent,{
              data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
            });
          }
          this.alertService.clear()
          this.alertService.error("Failed. Try Again");
         }
    )
  
  }

  // This function will be trigger automatically  based on the stepper changes in the parent component
  updateStatus(event: any) {
    let anyGroupValid = false;

    if (this.ownerMainGroup && this.ownerMainGroup.valid) {
      anyGroupValid = true;
    }  if (this.runnerMainGroup && this.runnerMainGroup.valid) {
      anyGroupValid = true;
    }  if (this.dealerMainGroup && this.dealerMainGroup.valid) {
      anyGroupValid = true;
    }  if (this.ownerGroupsArray && this.ownerGroupsArray.controls) {
      anyGroupValid = this.ownerGroupsArray.controls.some((control: AbstractControl) => control.valid);
    }  if (this.runnerGroupsArray && this.runnerGroupsArray.controls) {
      anyGroupValid = this.runnerGroupsArray.controls.some((control: AbstractControl) => control.valid);
    }  if (this.dealerGroupsArray && this.dealerGroupsArray.controls) {
      anyGroupValid = this.dealerGroupsArray.controls.some((control: AbstractControl) => control.valid);
    }
  
    if (this.formStatus === "Company Associates Form Submitted Successfully") {
      // Listen for changes whenever any of the form groups' value changes, then emit 'In Progress'
      this.ownerMainGroup.valueChanges.subscribe(() => {
        this.companyAssociatesStatusChanged.emit('In Progress');
      });
      this.runnerMainGroup.valueChanges.subscribe(() => {
        this.companyAssociatesStatusChanged.emit('In Progress');
      });
      this.dealerMainGroup.valueChanges.subscribe(() => {
        this.companyAssociatesStatusChanged.emit('In Progress');
      });
      this.ownerGroupsArray.valueChanges.subscribe(() => {
        this.companyAssociatesStatusChanged.emit('In Progress');
      });
      this.runnerGroupsArray.valueChanges.subscribe(() => {
        this.companyAssociatesStatusChanged.emit('In Progress');
      });
      this.dealerGroupsArray.valueChanges.subscribe(() => {
        this.companyAssociatesStatusChanged.emit('In Progress');
      });
    } else {
      // Emit 'Completed' if any of the form groups are valid, otherwise, emit 'In Progress'
      this.companyAssociatesStatusChanged.emit(anyGroupValid ? 'Completed' : 'In Progress');
    }
  
   }

   loadApplicationInquiryMcOnboarding(){
    let applicationId =  this.store.getItem('MC_CORP_APPLICATIONID') ;
     //need to change code here below , need to change application inquiry data model..
    this.corporateService.getCorporateApplicationInquiry(applicationId).subscribe(data => {
      //to check associate contains objects or not .
      if(data.corporate.associate != null){
        this.ownerDetails = data.corporate.associate.owner ? data.corporate.associate.owner : [];
        this.runnerDetails = data.corporate.associate.runner ? data.corporate.associate.runner : [];
        this.dealerDetails = data.corporate.associate.dealer ? data.corporate.associate.dealer : [];
        if(this.runnerDetails.length == 0){ //Some node=== "teller"
          const associates : any = data.corporate.associate ; 
          this.runnerDetails = associates.teller ? associates.teller : [] ;
        }
  
        //Always , we patch first object of every node --> "owner" , "runner" and "dealer" Main Form Groups . 
      if(this.ownerDetails.length != 0){
        this.ownerMainGroup.patchValue({
          fullName: this.ownerDetails[0].name ? this.ownerDetails[0].name : "" ,
          nric:  this.ownerDetails[0].idNumber ? this.ownerDetails[0].idNumber : "" ,
          dob:  this.ownerDetails[0].dob ? this.ownerDetails[0].dob : "" ,
          gender:  this.ownerDetails[0].gender ? this.ownerDetails[0].gender : "" ,
          email: this.ownerDetails[0].emailId ? this.ownerDetails[0].emailId : "" ,
          phoneNumber: this.ownerDetails[0].phoneNo ? this.ownerDetails[0].phoneNo : "" ,
          nationality:  this.ownerDetails[0].nationality ? this.ownerDetails[0].nationality: "" ,
          ownerPassportNumber : this.ownerDetails[0].passportNumber ? this.ownerDetails[0].passportNumber : "",
          ownerPassportIssueDate : this.ownerDetails[0].passportIssueDate ? this.ownerDetails[0].passportIssueDate : "" ,
          ownerPassportExpiryDate : this.ownerDetails[0].passportExpiry ? this.ownerDetails[0].passportExpiry : "",
          ownerOverseasId : this.ownerDetails[0].overseasId ? this.ownerDetails[0].overseasId: "" ,
          associateId : this.ownerDetails[0].associateId ? this.ownerDetails[0].associateId : "",
          status : this.ownerDetails[0].status ? this.ownerDetails[0].status : "",
          address : this.ownerDetails[0].address ? this.ownerDetails[0].address[0].level : ""
      });
      }  
      if(this.runnerDetails.length != 0){
    this.runnerMainGroup.patchValue({
      runnerFullname: this.runnerDetails[0].name ? this.runnerDetails[0].name : "" ,
      runnerNric:  this.runnerDetails[0].idNumber ? this.runnerDetails[0].idNumber : "" ,
      runnerDob:  this.runnerDetails[0].dob ? this.runnerDetails[0].dob : "" ,
      runnerGender:  this.runnerDetails[0].gender ? this.runnerDetails[0].gender : "" ,
      runnerEmail: this.runnerDetails[0].emailId ? this.runnerDetails[0].emailId : "" ,
      runnerPhoneNumber: this.runnerDetails[0].phoneNo ? this.runnerDetails[0].phoneNo : "" ,
      runnerNationality:  this.runnerDetails[0].nationality ? this.runnerDetails[0].nationality : "" ,
      runnerPassportNumber : this.runnerDetails[0].passportNumber ? this.runnerDetails[0].passportNumber : "",
      runnerPassportIssueDate : this.runnerDetails[0].passportIssueDate ? this.runnerDetails[0].passportIssueDate : "",
      runnerPassportExpiryDate : this.runnerDetails[0].passportExpiry ? this.runnerDetails[0].passportExpiry : "",
      runnerOverseasId : this.runnerDetails[0].overseasId ? this.runnerDetails[0].overseasId : "",
      associateId : this.runnerDetails[0].associateId ? this.runnerDetails[0].associateId : "",
      status : this.runnerDetails[0].status ? this.runnerDetails[0].status : "",
      address : this.runnerDetails[0].address ? this.runnerDetails[0].address[0].level : ""
  });
      }
  
   if(this.dealerDetails.length != 0){
  this.dealerMainGroup.patchValue({
    dealerFullname: this.dealerDetails[0].name ? this.dealerDetails[0].name: "" ,
    dealerNric:  this.dealerDetails[0].idNumber ? this.dealerDetails[0].idNumber : "" ,
    dealerDob:  this.dealerDetails[0].dob ? this.dealerDetails[0].dob : "" ,
    dealerGender:  this.dealerDetails[0].gender ? this.dealerDetails[0].gender : ""  ,
    dealerEmail: this.dealerDetails[0].emailId ? this.dealerDetails[0].emailId : "" ,
    dealerPhoneNumber: this.dealerDetails[0].phoneNo ? this.dealerDetails[0].phoneNo : "" ,
    dealerNationality:  this.dealerDetails[0].nationality ? this.dealerDetails[0].nationality : "" ,
    dealerPassportNumber : this.dealerDetails[0].passportNumber ? this.dealerDetails[0].passportNumber : "" ,
    dealerPassportIssueDate : this.dealerDetails[0].passportIssueDate ? this.dealerDetails[0].passportIssueDate : "",
    dealerPassportExpiryDate : this.dealerDetails[0].passportExpiry ? this.dealerDetails[0].passportExpiry : "",
    dealerOverseasId : this.dealerDetails[0].overseasId ? this.dealerDetails[0].overseasId : "" ,
    associateId : this.dealerDetails[0].associateId ? this.dealerDetails[0].associateId : "",
    status : this.dealerDetails[0].status ? this.dealerDetails[0].status : "",
    address : this.dealerDetails[0].address ? this.dealerDetails[0].address[0].level : ""
  });
   }
   //when we have more than or equal to two objects inside "owner" node , we first add owner dynamic fields and then patch 
   if(this.ownerDetails.length >= 2){
    this.addOwner('additional_owners') ;  
  }

  //when we have more than or equal to two objects inside "runner" node , we first add runner dynamic fields and then patch 
 if(this.runnerDetails.length >= 2){
  this.addRunner('additional_runners') ;  
}

//when we have more than or equal to two objects inside "dealer" node , we first add dealer dynamic fields and then patch 
if(this.dealerDetails.length >= 2){
  this.addDealer('additional_dealers') ;  
}


      } 
    

   //getting the "type" from inquiry response and validations created .
  //  this.appSearchRegisterType = data.corporate.registrationType ? data.corporate.registrationType : "" ;
  //  if(this.appSearchRegisterType != ""){
  //  this.performConditionalValidtion(this.appSearchRegisterType) ;
  //  }

    });

   }

     //MC => Application search => Save company associates details
   onCompanyAssociatesOnboardingEditSubmit(){
    this.corporateService.corporateApplicationUpdate(this.buildCompanyAssociatesDetails(''),'MC').subscribe((data:any)=>{
      let applicationId =  this.store.getItem('MC_CORP_APPLICATIONID') ? this.store.getItem('MC_CORP_APPLICATIONID') : "" ;
      let applicantId = this.store.getItem('MC_CORP_APPLICANTID') ? this.store.getItem('MC_CORP_APPLICANTID') : "" ;
      this.dialogRef.open(CompanyDocumentsComponent, {
        data: { appSearchOnboardingForMc:data , applicationId: applicationId , applicantId : applicantId },
        panelClass: 'custom-modalbox',
        width:'1245px',
        height: '575px',
        disableClose : true
      })
    },
        //error handling Completed on 06-07-2023 - <DN>
        (error : any) => {
           if(error.status != 401){
            this.dialogRef.open(ErrorDialogAdminComponent,{
              data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
            });
          }
       
         }
    )
   }

    //MC => Application search => associates to profile modal .
   goBackToProfile(){
    let applicationId = this.store.getItem('MC_CORP_APPLICATIONID') ? this.store.getItem('MC_CORP_APPLICATIONID') : "" ;
    let applicantId = this.store.getItem('MC_CORP_APPLICANTID') ? this.store.getItem('MC_CORP_APPLICANTID') : "" ;
    this.corporateService.getCorporateApplicationInquiry(applicationId).subscribe(data => {
      this.dialogRef.open(CompanyProfileComponent, {
        data: { appSearchOnboardingForMc:data,applicationId:applicationId, applicantId : applicantId },
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

   //need to enhance ..
   editData(){
    //based on associates response (from customer inquiry response) , we decide to make feilds as editable .
    this.isDisableAddAssociatesButton = false ; //enable all add associates button .
        this.isReadOnlyOwner  = false;
        this.isReadOnlyDealer  = false;
        this.isReadOnlyRunner = false;
    this.showSaveChangesButton = true ;
    this.showEditInfo = false ;
    this.updateValidators();
    this.snackBar.open("Fields are editable now !" , "Ok",{
      panelClass: "custom-green-notification-snackbar",
      duration: 3000
    }) ;
   }

   updateValidators(){
    const ownerControlValidators: { [key: string]: any } = {
      fullName: [Validators.compose([Validators.required,Validators.pattern('[a-zA-Z ./,@]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator])],
      nric: [Validators.compose([Validators.required ,Validators.pattern(this.nricPattern), this.removeSpaces])],
      dob: [ Validators.compose([Validators.required])],
      gender: [ Validators.compose([Validators.required])],
      email: [ Validators.required,CustomValidators.email,Validators.maxLength(128)],
      phoneNumber: [ Validators.compose([Validators.required,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator])],
      nationality: [ Validators.compose([Validators.required])],
      ownerPassportNumber : [],
      ownerPassportIssueDate : [],
      ownerPassportExpiryDate : [],
      ownerOverseasId : [Validators.compose([Validators.maxLength(128)])],
      associateId : [],
      status : [],
      address : [Validators.compose([Validators.maxLength(50),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')])]
    };

    const dealerControlValidators: { [key: string]: any } = {
      dealerFullname: [Validators.compose([Validators.required,Validators.pattern('[a-zA-Z ./,@]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator])],
      dealerNric: [Validators.compose([Validators.required ,  this.removeSpaces, Validators.pattern(this.nricPattern)])],
      dealerDob: [Validators.compose([Validators.required])],
      dealerGender: [Validators.compose([Validators.required])],
      dealerEmail: [Validators.required,CustomValidators.email,Validators.maxLength(128)],
      dealerPhoneNumber: [Validators.compose([Validators.required,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator])],
      dealerNationality: [Validators.compose([Validators.required])],
      dealerPassportNumber : [],
      dealerPassportIssueDate : [],
      dealerPassportExpiryDate : [],
      dealerOverseasId : [Validators.compose([Validators.maxLength(128)])],
      associateId : [],
      status : [],
      address : [Validators.compose([Validators.maxLength(50),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')])]
    };

    const runnerControlValidators: { [key: string]: any } = {
      runnerFullname: [Validators.compose([Validators.required,Validators.pattern('[a-zA-Z ./,@]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator])],
        runnerNric: [Validators.compose([Validators.required ,this.removeSpaces, Validators.pattern(this.nricPattern)])],
        runnerDob: [Validators.compose([Validators.required])],
        runnerGender: [Validators.compose([Validators.required])],
        runnerEmail: [Validators.required,CustomValidators.email,Validators.maxLength(128)],
        runnerPhoneNumber: [Validators.compose([Validators.required,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator])],
        runnerNationality: [Validators.compose([Validators.required])],
        runnerPassportNumber : [],
        runnerPassportIssueDate : [],
        runnerPassportExpiryDate : [],
        runnerOverseasId : [Validators.compose([Validators.maxLength(128)])],
        associateId : [],
        status :[],
        address : [Validators.compose([Validators.maxLength(50),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')])]
    };
  
    // OWNER MAIN GROUP => Loop through the ownercontrolValidators object and set validators for each control
  Object.keys(ownerControlValidators).forEach((key:any) => {
    const control = this.ownerMainGroup.get(key);
    if (control) {
      control.setValidators(ownerControlValidators[key]);
      control.updateValueAndValidity();
    }
  });

  // DEALER MAIN GROUP => Loop through the dealercontrolValidators object and set validators for each control
  Object.keys(dealerControlValidators).forEach((key:any) => {
    const control = this.dealerMainGroup.get(key);
    if (control) {
      control.setValidators(dealerControlValidators[key]);
      control.updateValueAndValidity();
    }
  });

  // RUNNER MAIN GROUP => Loop through the runnercontrolValidators object and set validators for each control
  Object.keys(runnerControlValidators).forEach((key:any) => {
    const control = this.runnerMainGroup.get(key);
    if (control) {
      control.setValidators(runnerControlValidators[key]);
      control.updateValueAndValidity();
    }
  });

     // OWNER SUB GROUP => Loop through the ownercontrolValidators object and set validators for each control
     Object.keys(ownerControlValidators).forEach((key:any) => {
      const control = this.ownerGroupsArray.get(key);
      if (control) {
        control.setValidators(ownerControlValidators[key]);
        control.updateValueAndValidity();
      }
    });
  
    // DEALER SUB GROUP => Loop through the dealercontrolValidators object and set validators for each control
    Object.keys(dealerControlValidators).forEach((key:any) => {
      const control = this.dealerGroupsArray.get(key);
      if (control) {
        control.setValidators(dealerControlValidators[key]);
        control.updateValueAndValidity();
      }
    });
  
    // RUNNER SUB GROUP => Loop through the runnercontrolValidators object and set validators for each control
    Object.keys(runnerControlValidators).forEach((key:any) => {
      const control = this.runnerGroupsArray.get(key);
      if (control) {
        control.setValidators(runnerControlValidators[key]);
        control.updateValueAndValidity();
      }
    });

    // if(this.customerRegistrationType != ""){
    // this.performConditionalValidtion(this.customerRegistrationType);
    // }
    // added for updating validators for nric on clicking edit data button.
    this.updateNricValidators();
    
   }
   //update customer --> corporate associates via backoffice 
   updateCorporateAssociates(){
    let custId = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "" ;
    this.corporateService.updateCompanyAssociates(custId, this.buildUpdateAssociates()).subscribe((datas:any)=>{
      console.log(datas) ;
      this.snackBar.open("Changes are updated successfully !" , "Ok",{
        panelClass: "custom-green-notification-snackbar",
        duration: 3000
      }) ;
      this.isReadOnlyOwner = true;
      this.isReadOnlyDealer = true;
       this.isReadOnlyRunner = true;
      this.showEditInfo = true ;
      this.showSaveChangesButton = false ;
      this.isDisableEditCustomerDetails = false ; //enabling edit customer details button .
      this.isDisableAddAssociatesButton = true ;
      this.clearValidators(this.ownerMainGroup); //clear validations for all MainGroups
      this.clearValidators(this.dealerMainGroup);
      this.clearValidators(this.runnerMainGroup);
      this.clearSubGroupValidators(this.ownerGroupsArray) ; //clear validations for all SubGroups
      this.clearSubGroupValidators(this.dealerGroupsArray) ;
      this.clearSubGroupValidators(this.runnerGroupsArray) ;
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
   buildUpdateAssociates():UpdateCorporate{
     return new UpdateCorporate({
      "customerType" : "C",
      "corporate" : this.buildCorporateAssociates()
     })
   }

   buildCorporateAssociates():UpdateCorporateAssociates{
    let corporateId = this.store.getItem('CUSTOMER_ID');
    return new UpdateCorporateAssociates({
      "corporateId":corporateId,
      "associate":this.buildCompanyAssociate()
    })
   }


  //disable and enable save button based on below conditions:
  //1. if any one of main groups found valid --> enable button
  //2 . if user add additional associates (owner or runner or dealer) , we need to evaluate those fields also whether additional associates validations are valid
  //3. Entry points : 
  //   Backoffice > Customer search > Company associates .
  //   Backoffice > Application search > Stepper flow > Company associates .
  //   Backoffice > Application search >  Record level Action icon > Company associates .
  onDisableCompanyAssociates():boolean{
  // Check all form controls which come under OWNER
  let ownerControls = [
    'fullName',
    'nric',
    'dob',
    'gender',
    'email',
    'phoneNumber',
    'nationality',
    'ownerPassportNumber',
    'ownerPassportIssueDate',
    'ownerPassportExpiryDate',
    'ownerOverseasId'
    
];

// Check all form controls which come under DEALER
let dealerControls = [
   'dealerFullname',
    'dealerNric',
    'dealerDob',
   'dealerGender',
    'dealerEmail',
    'dealerPhoneNumber',
    'dealerNationality',
    'dealerPassportNumber',
    'dealerPassportIssueDate',
    'dealerPassportExpiryDate',
    'dealerOverseasId'
    
];

// Check all form controls which come under RUNNER
let runnerControls = [
 
    'runnerFullname',
    'runnerNric',
    'runnerDob',
    'runnerGender',
    'runnerEmail',
    'runnerPhoneNumber',
    'runnerNationality',
    'runnerPassportNumber',
    'runnerPassportIssueDate',
    'runnerPassportExpiryDate',
    'runnerOverseasId'
    
];

// Validate additional form groups if they exist (length >= 1)
let areAllAdditionalGroupsValid = true;

let additionalOwnersArray = this.ownerGroupsArray.length ;
let additionalDealersArray = this.dealerGroupsArray.length ;
let additionalRunnersArray = this.runnerGroupsArray.length ; 

if(additionalOwnersArray >= 1){ //If additional owners found more than 1 , need to check validation was valid?
  areAllAdditionalGroupsValid  = areAllAdditionalGroupsValid && this.areOwnerAdditionalGroupsValid(ownerControls);
  //This method will return true only if all the controls in all the FormGroup instances are valid;
  // otherwise, it returns false.
}

if(additionalDealersArray >= 1){ //If additional dealers found more than 1 , need to check validation was valid?
  areAllAdditionalGroupsValid = areAllAdditionalGroupsValid && this.areDealerAdditionalGroupsValid(dealerControls);
  //This method will return true only if all the controls in all the FormGroup instances are valid;
  // otherwise, it returns false.
}

if(additionalRunnersArray >= 1){ //If additional runners found more than 1 , need to check validation was valid?
  areAllAdditionalGroupsValid = areAllAdditionalGroupsValid && this.areRunnerAdditionalGroupsValid(runnerControls);
  //This method will return true only if all the controls in all the FormGroup instances are valid;
  // otherwise, it returns false.
}

// Validate main groups
const isAnyMainGroupValid = this.areOwnerMainGroupControlsValid(ownerControls) ||
this.areDealerMainGroupControlsValid(dealerControls) ||
this.areRunnerMainGroupControlsValid(runnerControls);

// Check for any filled but invalid main group
const isAnyGroupInvalidWithData = this.isGroupInvalidWithData(ownerControls, this.ownerMainGroup) ||
this.isGroupInvalidWithData(dealerControls, this.dealerMainGroup) ||
this.isGroupInvalidWithData(runnerControls, this.runnerMainGroup);

// If any main group is filled and invalid, notify the user and disable the button
if (isAnyGroupInvalidWithData) {
//  console.log("Please correct the invalid fields in the respective group(s) before proceeding.");
  return true; // Disable the button
}

// Enable the "Save" button if any main group is valid or all additional groups (if present) are valid
if (isAnyMainGroupValid && areAllAdditionalGroupsValid) {
  return false; // Enable the button
}

return true; // Disable the button if none of the conditions are met

  }


  //disable and enable save button based on below condition for below entry points :
  //1. Corporate(mobile) > Company Asociates
  isDisableCompanyAssociates():boolean{
    // Check all form controls which come under OWNER
    let ownerControls = [
      'fullName',
      'nric',
      'dob',
      'gender',
      'email',
      'phoneNumber',
      'nationality',
      'ownerPassportNumber',
      'ownerPassportIssueDate',
      'ownerPassportExpiryDate',
      'ownerOverseasId'
      
  ];
  
  // Check all form controls which come under DEALER
  let dealerControls = [
     'dealerFullname',
      'dealerNric',
      'dealerDob',
     'dealerGender',
      'dealerEmail',
      'dealerPhoneNumber',
      'dealerNationality',
      'dealerPassportNumber',
      'dealerPassportIssueDate',
      'dealerPassportExpiryDate',
      'dealerOverseasId'
      
  ];
  
  // Check all form controls which come under RUNNER
  let runnerControls = [
   
      'runnerFullname',
      'runnerNric',
      'runnerDob',
      'runnerGender',
      'runnerEmail',
      'runnerPhoneNumber',
      'runnerNationality',
      'runnerPassportNumber',
      'runnerPassportIssueDate',
      'runnerPassportExpiryDate',
      'runnerOverseasId'
      
  ];

   // Check if any of the controls under OWNER, DEALER, or RUNNER have values
   if (this.areOwnerMainGroupControlsValid(ownerControls) ||
    this.areDealerMainGroupControlsValid(dealerControls) ||
   this.areRunnerMainGroupControlsValid(runnerControls) ) {
      return false; // Enable the "Save" button if any array has all non-empty values and form is valid
  }
  
  return true; // Return true if none of the controls have values --> disable it
  
  }
    


 // method to check if a group is invalid but has data
isGroupInvalidWithData(controls: string[], group: FormGroup): boolean {
  const hasData = controls.some(controlName => !!group.get(controlName)?.value);
  const isInvalid = controls.some(controlName => group.get(controlName)?.invalid);
  return hasData && isInvalid;
}

  hasAllValues(array: any[]): boolean {
    // Check if all elements in the array are non-empty strings
    return array.every(value => value !== "");
}
areOwnerMainGroupControlsValid(controls: any[]): boolean {
  // Check if all form controls in the provided array are valid
  return controls.every(control => this.ownerMainGroup.get(control)?.valid);
}

areDealerMainGroupControlsValid(controls: any[]): boolean {
  // Check if all form controls in the provided array are valid
  return controls.every(control => this.dealerMainGroup.get(control)?.valid);
}

areRunnerMainGroupControlsValid(controls: any[]): boolean {
  // Check if all form controls in the provided array are valid
  return controls.every(control => this.runnerMainGroup.get(control)?.valid);
}

areOwnerAdditionalGroupsValid(controls: string[]): boolean {
  // Iterate through each FormGroup in the ownerGroupsArray
  return this.ownerGroupsArray.controls.every((formGroup: AbstractControl) => {
    // Check if every control in the ownerControls array is valid in the current FormGroup
    return controls.every(controlName => formGroup.get(controlName)?.valid);
  });
}

areDealerAdditionalGroupsValid(controls: string[]): boolean {
  // Iterate through each FormGroup in the dealerGroupsArray
  return this.dealerGroupsArray.controls.every((formGroup: AbstractControl) => {
    // Check if every control in the dealerControls array is valid in the current FormGroup
    return controls.every(controlName => formGroup.get(controlName)?.valid);
  });
}

areRunnerAdditionalGroupsValid(controls: string[]): boolean {
  // Iterate through each FormGroup in the runnerGroupsArray
  return this.runnerGroupsArray.controls.every((formGroup: AbstractControl) => {
    // Check if every control in the runnerControls array is valid in the current FormGroup
    return controls.every(controlName => formGroup.get(controlName)?.valid);
  });
}

// added for updating validation Associates NRIC.
  updateNricValidators(){
  // get the value of the 'nationality' field of ownerMainGroup
const ownerNationalityValue = this.ownerMainGroup.controls['nationality'].value;
if(ownerNationalityValue !== ''){
  console.log(ownerNationalityValue);

if (ownerNationalityValue === 'SINGAPOREAN') {
  this.ownerMainGroup.controls['nric'].setValidators([Validators.required, Validators.pattern(this.nricPattern), this.removeSpaces]);
} 
else {
  this.ownerMainGroup.controls['nric'].setValidators([Validators.pattern(this.nricPattern), this.removeSpaces]);
}
this.ownerMainGroup.controls['nric'].updateValueAndValidity();
}

// for owner Main group removing required validator when nationality is not singaporean
this.ownerMainGroup.controls['nationality'].valueChanges.subscribe(value=>{
  console.log(value);
  if(value=="SINGAPOREAN"){
    this.ownerMainGroup.controls['nric'].setValidators([Validators.required , Validators.pattern(this.nricPattern), this.removeSpaces]);
  }
  else{
    this.ownerMainGroup.controls['nric'].setValidators([Validators.pattern(this.nricPattern), this.removeSpaces]);
  }
  this.ownerMainGroup.controls['nric'].updateValueAndValidity();
})

// for additional owners removing required validator when nationality is not singaporean
this.ownerGroupsArray.controls.forEach((group: AbstractControl, index: number) => {
  const nationality = group.get('nationality');
  let value =  nationality ? nationality.value : '';
  if(value!==''){
    console.log(value);
    this.updateOwnerNricValidators(index, value);
  }
  if(nationality){
    nationality.valueChanges.subscribe((value: string) => {
      console.log(`Index: ${index}, Nationality: ${value}`); // Print index and value to the console
      this.updateOwnerNricValidators(index, value);
    });
  }
});

// get the value of the 'nationality' field of dealerMainGroup
const dealerNationalityValue = this.dealerMainGroup.controls['dealerNationality'].value;
if(dealerNationalityValue !== ''){

console.log(dealerNationalityValue);
if (dealerNationalityValue === 'SINGAPOREAN') {
  this.dealerMainGroup.controls['dealerNric'].setValidators([Validators.required, Validators.pattern(this.nricPattern), this.removeSpaces]);
} 
else {
  this.dealerMainGroup.controls['dealerNric'].setValidators([Validators.pattern(this.nricPattern), this.removeSpaces]);
}
this.dealerMainGroup.controls['dealerNric'].updateValueAndValidity();
}

 // for dealer Main group removing required validator when nationality is not singaporean
 this.dealerMainGroup.controls['dealerNationality'].valueChanges.subscribe(value=>{
  console.log(value);
  if(value=="SINGAPOREAN"){
    this.dealerMainGroup.controls['dealerNric'].setValidators([Validators.required , Validators.pattern(this.nricPattern), this.removeSpaces]);
  }
  else{
    this.dealerMainGroup.controls['dealerNric'].setValidators([Validators.pattern(this.nricPattern), this.removeSpaces]);
  }
  this.dealerMainGroup.controls['dealerNric'].updateValueAndValidity();
})

 // for additional dealer removing required validator when nationality is not singaporean
 this.dealerGroupsArray.controls.forEach((group: AbstractControl, index: number) => {
  const nationality = group.get('dealerNationality');
  let value =  nationality ? nationality.value : '';
  if(value!==''){
    console.log(value);
    this.updateDealerNricValidators(index, value);
  }

  if (nationality) {
    nationality.valueChanges.subscribe((value: string) => {
      console.log(`Index: ${index}, Nationality: ${value}`); 
      this.updateDealerNricValidators(index, value);
    });
  }
});

// get the value of the 'nationality' field of ownerMainGroup
const runnerNationalityValue = this.runnerMainGroup.controls['runnerNationality'].value;
if(runnerNationalityValue !== ''){

console.log(runnerNationalityValue)
if (runnerNationalityValue === 'SINGAPOREAN') {
  this.runnerMainGroup.controls['runnerNric'].setValidators([Validators.required, Validators.pattern(this.nricPattern), this.removeSpaces]);
} 
else {
  this.runnerMainGroup.controls['runnerNric'].setValidators([Validators.pattern(this.nricPattern), this.removeSpaces]);
}
this.runnerMainGroup.controls['runnerNric'].updateValueAndValidity();
}

    // for runner Main group removing required validator when nationality is not singaporean
    this.runnerMainGroup.controls['runnerNationality'].valueChanges.subscribe(value=>{
      console.log(value);
      if(value=="SINGAPOREAN"){
        this.runnerMainGroup.controls['runnerNric'].setValidators([Validators.required , Validators.pattern(this.nricPattern), this.removeSpaces]);
      }
      else{
        this.runnerMainGroup.controls['runnerNric'].setValidators([Validators.pattern(this.nricPattern), this.removeSpaces])
      }
      this.runnerMainGroup.controls['runnerNric'].updateValueAndValidity();
    })

    // for additional runner removing required validator when nationality is not singaporean
    this.runnerGroupsArray.controls.forEach((group: AbstractControl, index: number) => {
  const nationality = group.get('runnerNationality');
  let value =  nationality ? nationality.value : '';
  if(value!==''){
    console.log(value);
    this.updateRunnerNricValidators(index, value);
  }

  if (nationality) {
    nationality.valueChanges.subscribe((value: string) => {
      console.log(`Index: ${index}, Nationality: ${value}`); // Print index and value to the console
      this.updateRunnerNricValidators(index, value);
    });
  }
});
}


  updateOwnerNricValidators(index: number, value: string) {
  const group = this.ownerGroupsArray.at(index);
  const nric = group.get('nric'); 

  if (nric) {
    if (value === 'SINGAPOREAN') {
      nric.setValidators([Validators.required, Validators.pattern(this.nricPattern), this.removeSpaces]);
    } 
    else {
      nric.setValidators([Validators.pattern(this.nricPattern), this.removeSpaces]);
    }
    nric.updateValueAndValidity();
  }
}


  updateDealerNricValidators(index: number, value: string) {
  const group = this.dealerGroupsArray.at(index) ;
  const nric = group.get('dealerNric'); 

  if (nric) {
    if (value === 'SINGAPOREAN') {
      nric.setValidators([Validators.required, Validators.pattern(this.nricPattern), this.removeSpaces]);
    } 
    else {
      nric.setValidators([Validators.pattern(this.nricPattern), this.removeSpaces]);
    }
    nric.updateValueAndValidity(); 
  }
}


  updateRunnerNricValidators(index: number, value: string) {
  const group = this.runnerGroupsArray.at(index) ; 
  const nric = group.get('runnerNric'); 

  if (nric) {
    if (value === 'SINGAPOREAN') {
      nric.setValidators([Validators.required, Validators.pattern(this.nricPattern), this.removeSpaces]);
    } 
    else {
      nric.setValidators([Validators.pattern(this.nricPattern), this.removeSpaces]);
    }
    nric.updateValueAndValidity(); 
  }
}
  
  }