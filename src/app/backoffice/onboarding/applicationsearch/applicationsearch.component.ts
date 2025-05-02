import { Component,  HostListener,  OnChanges,  OnInit, Pipe, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ApplicationUpdate } from 'src/app/core/model/Appication Update/Application_Update';
import { PersonalInfoComponent } from 'src/app/onboarding/individual/basic-info/basic-info.component';
import { ProfileinfoService } from 'src/app/core/services/profileinfo.service';
import { MatPaginator } from '@angular/material/paginator'
import { ApplicationListings } from 'src/app/core/model/Application Search/application-search';
import { ApplicationInquiry } from 'src/app/core/model/ApplicationInquiry/Application-Inquiry';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import {InMemoryCache} from 'src/app/shared/services/cache.service';
import { HttpHeaders } from '@angular/common/http';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { CompanyProfileComponent } from 'src/app/onboarding/corporate/profile/company-profile.component';
import { CorporateService } from 'src/app/core/services/corporate.service';
import { IdentitydocumentComponent } from 'src/app/onboarding/individual/documents/document-uploader.component';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import { ParentStepperOnboardingComponent } from 'src/app/moneychanger/modals/mc-onboarding/onboardingparentstepper/parent-stepper-onboarding.component';
import { getApplicantStatusBgColor, getApplicantStatusColor, getApplicantTooltipText } from 'src/assets/transactionstatus';


@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss', '../../../../assets/styles/tables/table-style.scss'],
  
})

export class DesktopBranchComponent implements OnInit  {
  isActive = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filterForm : FormGroup = Object.create(null);
  isDesc!: boolean;
  resultsLength = 0;
  p: number = 1;
  itemsPerPage: number = 20;
  applicationListings: ApplicationListings[] = [];
  applicationInquiry: ApplicationInquiry = new ApplicationInquiry();
  applicationId: any;
  searchValue!: string;
  searchNumber!: string;
  searchEmailId !: string ;
  status:any;
  sortedData : ApplicationListings[] = [];
  individualImage : any;
  appType : any;
  selectedAppType : any;
  individual : any;
  checkedValue !: string;
  selectedStatus : any;
  type:any;
  loader : Boolean = false;

  //new changes -> dheepan 
  xpandStatus = false;
  filterValues: any[] = [];
  recordsCount: any = '';
  searchFieldTyped: Boolean = false;
  searchName!: string;
  showAddCustomerBtn : Boolean = true ;

  constructor(public dialog: MatDialog, private profileService: ProfileinfoService, private route: ActivatedRoute, private router: Router,private store : InMemoryCache,
    private headerService : TitleHeaderService,private corporateService : CorporateService,private fb: FormBuilder,private dialogRef : MatDialog) {
      dialog.afterAllClosed.subscribe(() => {
    // update a variable or call a function when the dialog closes
    if(this.store.getItem('APPLICATION_APPROVED') != undefined){
      this.store.removeItem('APPLICATION_APPROVED');
      var status: string;
      if(this.selectedStatus != undefined){
        status = this.selectedStatus;
      }
      else {
        status = this.status;
      }
      this.loader = true;
      setTimeout(() => {
      this.profileService.getApplicationListings(status,this.selectedAppType).subscribe((data: any) => {
        this.applicationListings = data['records'];
        this.loader = false;
        console.log(data);
      },
       //error handling completed on 01-06-2023
  (error:any)=>{
    this.loader = false ;
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent) ;
    }
  }
      )
      }, 1000);
    }
    if(this.store.getItem('APPLICATION_REJECTED') != undefined){
      this.store.removeItem('APPLICATION_REJECTED');
      this.loader = true;
    setTimeout(() => {
    this.profileService.getApplicationListings(this.status,this.selectedAppType).subscribe((data: any) => {
      this.applicationListings = data['records'];
      this.loader = false;
      console.log(data);
    },
     //error handling completed on 01-06-2023
  (error:any)=>{
    this.loader = false ;
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent) ;
    }
  }
    )
    }, 1000);
    }
    if(this.store.getItem('MC_APPLICATION_ONBOARDING_INDICATOR') != undefined){
      this.loader = true;
      setTimeout(() => {
      this.profileService.getApplicationListings('','').subscribe((data: any) => {
        this.applicationListings = data['records'];
        this.loader = false;
        console.log(data);
      },
       //error handling completed on 01-06-2023
  (error:any)=>{
    this.loader = false ;
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent) ;
    }
  }
      )
      }, 1000);
    }
    }
  );
    
  }
  public getScreenWidth: any;
  public getScreenHeight: any;
  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  changeTableHeight(){
    return { 'height': (this.getScreenHeight - 279 )+'px' , 'overflow-y' : 'auto' }; // dheepan changes -> change table height
  }
  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }
  ngOnInit() {
    this.filterForm = this.fb.group({
      "ApplicantName" : [null,Validators.compose([Validators.pattern("^[a-zA-Z ./,@]+$")])],
      "phoneNo" : [null,Validators.compose([Validators.pattern("^[0-9 ]+$")])],
      "emailId" : [null, Validators.compose([Validators.email])],
    })

    //new change on 27 Nov 2023 , based on access control dtls , need to hide and show the approve-reject button .
    let accessControlDtl = this.store.getItem('ACCESS_CONTROLS_ARRAY') ? this.store.getItem('ACCESS_CONTROLS_ARRAY') : "";
    let arrayOfObjects : any ;
    if (accessControlDtl != "") {
       arrayOfObjects = JSON.parse(accessControlDtl);
    }

      // Check if any object has accessId "BAAB" and name "APPLICATION APPROVE-REJECT BUTTON"
      const hasSpecificItem : boolean = arrayOfObjects.some((item:any)=>{
       return item.accessId == "BAAB" && item.name == "APPLICATION APPROVE-REJECT BUTTON" ;
      }) ;
      let objectExist : string = "";
      if(hasSpecificItem == true){
       objectExist = "true" ;
      }
      else if(hasSpecificItem == false){
       objectExist = "false" ;
      }
      this.store.setItem('APPLICATION_APPROVE_REJECT_ACCESS_CONTROL',objectExist) ;


  //getScreenWidth and getScreenHeight will get the windows inner height and width.
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.headerService.setTitle('Account Opening');
    
    //dropdown values will defined based on status
    this.status = this.route.snapshot.params['status']
    this.selectedStatus = this.status;

     //new change on 07/08/2023 , pushing objects for displaying filter values
     this.filterValues = [] ;
     let applicantStatus = "" ;                      // To add applicant Status in  filterValues (obj)
     if(this.selectedStatus == "PENDING"){
       applicantStatus = "Pending for Approval"
     }
     if(this.selectedStatus == "NEW"){
       applicantStatus = "Draft"
     }
     if(this.selectedStatus == "REJECTED"){
       applicantStatus = "Rejected"
     }
     if(this.selectedStatus == "APPROVED"){
       applicantStatus = "Converted"
     }
     if(this.selectedStatus == ""){
       applicantStatus = "Draft, Pending for Approval, Converted, Rejected"
     }
     if(this.selectedStatus == undefined){                                        //coming from menu items ==> handling applicant status
       applicantStatus = "Draft, Pending for Approval, Converted, Rejected"
    }
     var applicantStatusObj = {"fieldName": "Status", "value" : applicantStatus}
     this.filterValues.push(applicantStatusObj) ;
    
 //Application Type dropdown value will be raised based on sub group clicked
    this.route.queryParams.subscribe((params: any)=> {
      console.log(params);
      let indicator = params.indicator;
      if(indicator == "FROM_PREVIEW"){
        this.applicationId = this.store.getItem('APPLICATION_ID')
        this.profileService.getApplicationInquiry(this.applicationId).subscribe(data => {
          this.applicationInquiry = data;
          this.dialog.open(IdentitydocumentComponent, {
            data: { isreview : data},
            panelClass: 'custom-modalbox',
            width:'1245px',
            height: '616px',
          })
        },
        //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent) ;
    }
  }
        );
      }
      if(params.Application_Type == "I"){
    this.selectedAppType = params.Application_Type;
      }
      if(params.Application_Type == "C"){
        this.selectedAppType = params.Application_Type;
          }
    })
    let applicantType = "" ;           // To add applicant Type in  filter values (obj)
    if(this.selectedAppType == "I"){
      applicantType = "Individual"
    }
    if(this.selectedAppType == "C"){
      applicantType = "Business"
    }
    if(this.selectedAppType == undefined || this.selectedAppType == "" ){ 
      applicantType = "Individual, Business"
   }
    var applicantTypeObj = {"fieldName": "Type", "value" : applicantType} 
    this.filterValues.push(applicantTypeObj) ;


    if(this.status == undefined){
      this.selectedStatus = undefined //if status and type is undefined - will fetch both consumer and corporte datas
      this.selectedAppType = undefined 
     }
    //Application search table
    this.loader = true;
    setTimeout(() => {
    this.profileService.getApplicationListings(this.selectedStatus,this.selectedAppType).subscribe((data: any) => {
      this.applicationListings = data['records'];
      this.recordsCount = this.applicationListings.length ;
      this.loader = false;
      console.log(data);
    },
     //error handling completed on 01-06-2023
  (error:any)=>{
    this.loader = false ;
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent) ;
    }
  }
    )
    }, 1000);
  }
  
  //this function -> applies filter after Application type and status value is captured
  applyFilter(applicantName:string,phoneNumber:string, type:any , status:any, emailID:string){
    this.xpandStatus = false ;
    applicantName = applicantName ? applicantName : "" ;   // null check
    phoneNumber = phoneNumber ? phoneNumber : "" ;
    type = type ? type : "" ;
    status = status ? status : "" ;
    emailID = emailID ? emailID : "" ;

    // Clear the filters array 
    this.filterValues = [];
    //pushing Applicant name        
    if (applicantName != "") {

      let modifiedApplicantName = applicantName;
  
      if (applicantName.length > 15) {
        modifiedApplicantName = applicantName.substring(0, 15) + " ...";
      }
      const newFilterObject = { "fieldName": "Applicant Name", "value": modifiedApplicantName };
      this.filterValues.push(newFilterObject);
    }

    //pushing Phone Number        
    if (phoneNumber != "") {
      const newFilterObject = { "fieldName": "Phone Number", "value": phoneNumber };
      this.filterValues.push(newFilterObject);
    }

     //pushing Phone Number        
     if (emailID != "") {
      const newFilterObject = { "fieldName": "Email ID", "value": emailID };
      this.filterValues.push(newFilterObject);
    }

    //pushing Type 
    if (type != "") {
      let appType = "" ;
      if(type == "I"){
        appType = "Individual"
      }
      if(type == "C"){
        appType = "Business"
      }
      if(type == ""){
        appType = "Individual, Business"
      }
      const newFilterObject = { "fieldName": "Type", "value": appType };
      this.filterValues.push(newFilterObject);
    }
     //pushing Applicant status 
     if (status != "") {
      let applicantStatus = "" ;
      if(status == "PENDING"){
        applicantStatus = "Pending for Approval"
      }
      if(status == "NEW"){
        applicantStatus = "Draft"
      }
      if(status == "REJECTED"){
        applicantStatus = "Rejected"
      }
      if(status == "APPROVED"){
        applicantStatus = "Converted"
      }
      if(status == ""){
        applicantStatus = "Draft, Pending for Approval, Converted, Rejected"
      }
      const newFilterObject = { "fieldName": "Status", "value": applicantStatus };
      this.filterValues.push(newFilterObject);
    }
    //if all element is empty string , push old object back and display it in screen .
    if(applicantName == "" && phoneNumber == "" && type == "" &&  status == ""){
        let applicantStatus = "Draft,Pending for Approval,Converted,Rejected" ;
        let applicantType = "Individual, Business" ;
        const obj = { "fieldName": "Status", "value": applicantStatus } ;
        const obj2 =  { "fieldName": "Type", "value": applicantType };
        this.filterValues.push(obj);
        this.filterValues.push(obj2);
      
    }
    this.loader = true;
    //service call
    setTimeout(() => {
      this.profileService.filteredApplicationListings(applicantName,phoneNumber,type , status, emailID).subscribe((datas:any)=> 
      {
        this.applicationListings = datas['records'];
        // Reset page to 1
        this.p = 1;
        this.recordsCount = this.applicationListings.length ;
        this.loader = false;
      },
      (error:any) =>{
        this.loader = false;
         //error handling completed on 04/07/2023
        if(error.status != 401){
          const dialog = this.dialogRef.open(ErrorDialogAdminComponent);
          dialog.afterClosed().subscribe(result => {
            if(result.data == 'ErrorDialogClosed'){
            }})
        }
      
      }
      )
       
       
    }, 1000);
  }


  resetFilter() {
  
    this.searchName =  "" ;
    this.searchNumber =  "" ;
    this.searchEmailId = "" ;
    this.selectedStatus = "" ;
    this.selectedAppType = "" ;
    this.loader = true;
    this.xpandStatus = false; //expansion panel will close


    setTimeout(() => {
        this.profileService.filteredApplicationListings(this.searchName,this.searchNumber , this.selectedAppType , this.selectedStatus, this.searchEmailId).subscribe((datas:any)=> 
        {
          this.applicationListings = datas['records'];
         this.recordsCount = this.applicationListings.length;
          // Reset page to 1
        this.p = 1;
          this.loader = false;
          // Clear the filters array 
          this.filterValues = [];
  
          let applicantStatus = "Draft, Pending for Approval, Converted, Rejected"
          const newFilterStatusObject = { "fieldName": "Status", "value": applicantStatus };
        this.filterValues.push(newFilterStatusObject);
      
  //pushing Type 
  let appType = "Individual, Business" ;
  const newFilterTypeObject = { "fieldName": "Type", "value": appType };
  this.filterValues.push(newFilterTypeObject); 
  
         },
          //error handling done on 03-07-2023
          (error: any) => {
            this.loader = false;
            if (error.status != 401) {
              this.dialogRef.open(ErrorDialogAdminComponent);
            }
          }
        )
      
    }, 700);
  }

 

  onApplicantNameChange() {
    const applicantNameControl = this.filterForm.controls['ApplicantName'];
    // Get the current value of the input field
    const inputText = applicantNameControl.value;
    applicantNameControl.setValue(inputText.toUpperCase());

   this.searchName  = this.searchName ? this.searchName : "" ;
   this.searchNumber = this.searchNumber ? this.searchNumber : "";
   this.selectedStatus = this.selectedStatus ? this.selectedStatus : "";
   this.selectedAppType = this.selectedAppType ? this.selectedAppType : "" ;
   this.searchEmailId = this.searchEmailId ? this.searchEmailId : "" ;
   
    if (this.searchFieldTyped == true && inputText.length == 0) {
      // Triggered and service is called
      setTimeout(() => {
        this.filterValues = [];
      
        //pushing Applicant name        
        if (this.searchName != "") {
          const newFilterObject = { "fieldName": "Applicant Name", "value": this.searchName };
          this.filterValues.push(newFilterObject);
        }
       
        //pushing Applicant Phone Number        
        if (this.searchNumber != "") {
          const newFilterObject = { "fieldName": "Phone Number", "value": this.searchNumber };
          this.filterValues.push(newFilterObject);
        }

        //pushing Email ID        
        if (this.searchEmailId != "") {
          const newFilterObject = { "fieldName": "Email ID", "value": this.searchEmailId };
          this.filterValues.push(newFilterObject);
        }
     //pushing Type 
 if (this.selectedAppType != "" || this.selectedAppType == undefined) {
  let appType = "" ;
  if(this.selectedAppType == "I"){
    appType = "Individual"
  }
  if(this.selectedAppType == "C"){
    appType = "Business"
  }
  if(this.selectedAppType == ""){
    appType = "Individual, Business"
  }
  const typeFilterObject = { "fieldName": "Type", "value": appType };
  this.filterValues.push(typeFilterObject);
}
 //pushing Applicant status 
 if (this.selectedStatus != "" || this.selectedStatus == undefined) {
  let applicantStatus = "" ;
  if(this.selectedStatus == "PENDING"){
    applicantStatus = "Pending for Approval"
  }
  if(this.selectedStatus == "NEW"){
    applicantStatus = "Draft"
  }
  if(this.selectedStatus == "REJECTED"){
    applicantStatus = "Rejected"
  }
  if(this.selectedStatus == "APPROVED"){
    applicantStatus = "Converted"
  }
  if(this.selectedStatus == ""){
    applicantStatus = "Draft, Pending for Approval, Converted, Rejected"
  }
  const statusFilterObj = { "fieldName": "Status", "value": applicantStatus };
  this.filterValues.push(statusFilterObj);
}
//filter service call 
this.loader = true;
    this.profileService.filteredApplicationListings(this.searchName,this.searchNumber , this.selectedAppType , this.selectedStatus, this.searchEmailId).subscribe((datas:any)=> 
        {
          this.applicationListings = datas['records'];
         this.recordsCount = this.applicationListings.length;
          // Reset page to 1
        this.p = 1;
          this.loader = false;
         },
          //error handling done on 03-07-2023
          (error: any) => {
            this.loader = false;
            if (error.status != 401) {
              this.dialogRef.open(ErrorDialogAdminComponent);
            }
          }
        )
      }, 700);
    }
    // Check if the input has at least three characters and contains only alphabets
    if (inputText.length >= 3 && /^[a-zA-Z ]+$/.test(inputText)) {

      this.searchFieldTyped = true;  //once user entered more than 3 char , will call this variable 'searchFieldTyped' and give it as true signal

      this.filterValues = [];

      //pushing Applicant name        
      if (this.searchName != "") {
        const newFilterObject = { "fieldName": "Applicant Name", "value": this.searchName };
        this.filterValues.push(newFilterObject);
      }
     
      //pushing Phone Number        
      if (this.searchNumber != "") {
        const newFilterObject = { "fieldName": "Phone Number", "value": this.searchNumber };
        this.filterValues.push(newFilterObject);
      }

      //pushing Email ID        
      if (this.searchEmailId != "") {
        const newFilterObject = { "fieldName": "Email ID", "value": this.searchEmailId };
        this.filterValues.push(newFilterObject);
      }

 //pushing Type 
 if (this.selectedAppType != "" || this.selectedAppType == undefined) {
  let appType = "" ;
  if(this.selectedAppType == "I"){
    appType = "Individual"
  }
  if(this.selectedAppType == "C"){
    appType = "Business"
  }
  if(this.selectedAppType == ""){
    appType = "Individual, Business"
  }
  const typeFilterObject = { "fieldName": "Type", "value": appType };
  this.filterValues.push(typeFilterObject);
}
 //pushing Aplicant status 
 if (this.selectedStatus != "" || this.selectedStatus == undefined) {
  let applicantStatus = "" ;
  if(this.selectedStatus == "PENDING"){
    applicantStatus = "Pending for Approval"
  }
  if(this.selectedStatus == "NEW"){
    applicantStatus = "Draft"
  }
  if(this.selectedStatus == "REJECTED"){
    applicantStatus = "Rejected"
  }
  if(this.selectedStatus == "APPROVED"){
    applicantStatus = "Converted"
  }
  if(this.selectedStatus == ""){
    applicantStatus = "Draft, Pending for Approval, Converted, Rejected"
  }
  const statusFilterObject = { "fieldName": "Status", "value": applicantStatus };
  this.filterValues.push(statusFilterObject);
}

      // Triggered and service is called
      this.loader = true;
      setTimeout(() => {
        this.profileService.filteredApplicationListings(this.searchName,this.searchNumber , this.selectedAppType , this.selectedStatus, this.searchEmailId).subscribe((datas:any)=> 
        {
          this.applicationListings = datas['records'];
         this.recordsCount = this.applicationListings.length;
          // Reset page to 1
        this.p = 1;
          this.loader = false;
        
         },
          //error handling done on 03-07-2023
          (error: any) => {
            this.loader = false;
            if (error.status != 401) {
              this.dialogRef.open(ErrorDialogAdminComponent);
            }
          }
        )
      }, 700);

    }
  }
  //Sorting data in table headers (asc,desc)
  sortData(sort: Sort) {
    const data = this.applicationListings;
  if (!sort.active || sort.direction == '') {
    this.sortedData = data;
    return ;
    }
    this.sortedData = data.sort((a:any, b:any) => {
      const isAsc = sort.direction == 'asc';
      switch (sort.active) {
        case 'APPLICATIONID':
          return this.compare(a.APPLICATIONID ,b.APPLICATIONID ,isAsc);
        case 'APPLICANTID':
          return this.compare(a.APPLICANTID, b.APPLICANTID, isAsc);
        case 'NAME':
          return this.compare(a.NAME, b.NAME, isAsc);
        case 'STATUS':
          return this.compare(a.STATUS, b.STATUS, isAsc);
        case 'NATIONALITY':
          return this.compare(a.NATIONALITY, b.NATIONALITY, isAsc);
          case 'PHONENBR':
            return this.compare(a.PHONENBR, b.PHONENBR, isAsc);
            case 'CREATEDDATE':
            return this.compare(a.CREATEDDATE, b.CREATEDDATE, isAsc);
        default:
          return 0;
      }
    });
  }


 compare(a: string, b:  string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

 //STATUS color diff
 getColor(status: any) {
  return getApplicantStatusColor(status)
}
//bg color for status tags .
getBackgroundColor(status: string): string {
 return getApplicantStatusBgColor(status);
  
}

//tool tip text value based on txnstatus ..
getTooltipText(status: string): string {
  return getApplicantTooltipText(status);
}

  application!: ApplicationUpdate[]
  id!: string;

  //Open Modal Dialog in Application Listings > view BioInfo
  openDialog(APPLICATIONID:any,APPLICATIONTYPE:string, APPLICANTID : string, CHANNEL : string) {
    if(APPLICATIONTYPE == "I" && APPLICATIONID != undefined){
    let reqChannel = CHANNEL;
    this.store.setItem('APPLICATION_ID', APPLICATIONID);
    this.applicationId = APPLICATIONID;
    this.profileService.getApplicationInquiry(this.applicationId).subscribe(data => {
      this.applicationInquiry = data;
      if(reqChannel == "BRANCH"){  // datas can be editable mode only when appstatus != APPROVED or PENDING or REJECTED ..

         //store application status value in appStatus variable
        let appStatus = data.status ? data.status : "" ;
       //if appStatus is APPROVED or PENDING or REJECTED , will not allow staff to update datas again .
       if(appStatus == "APPROVED" || appStatus == "PENDING" || appStatus == "REJECTED"){
        this.dialog.open(PersonalInfoComponent, {
          data: { isreview: data , applicationId:APPLICATIONID },
          panelClass: 'custom-modalbox',
          width:'1245px',
          height: '575px',
          disableClose : true
        })
       }
      else{ //if status is NEW only , fields can be editable ..
        this.dialog.open(PersonalInfoComponent, {
          data: { appSearchOnboardingForMc: data , applicationId:APPLICATIONID , applicantId : APPLICANTID},
          panelClass: 'custom-modalbox',
          width:'1245px',
          height: '575px',
          disableClose : true
        })
       }
      }
      else if (reqChannel == "MOBILE"){  //only datas can be read mode only..
        this.dialog.open(PersonalInfoComponent, {
          data: { isreview: data , applicationId:APPLICATIONID },
          panelClass: 'custom-modalbox',
          width:'1245px',
          height: '575px',
          disableClose : true
        })
      }
      else{
        this.dialog.open(PersonalInfoComponent, {
          data: { isreview: data , applicationId:APPLICATIONID },
          panelClass: 'custom-modalbox',
          width:'1245px',
          height: '575px',
          disableClose : true
        })
      }
     
    },
    //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent) ;
    }
  }
    )
  }
  if(APPLICATIONTYPE == "C" && APPLICATIONID != undefined){ //change to != undefined when API is ready
    let reqChannel = CHANNEL;
    this.corporateService.getCorporateApplicationInquiry(APPLICATIONID).subscribe(data => {
    this.store.setItem('CORPORATE_APPLICATION_ID', APPLICATIONID);
    if(reqChannel == "BRANCH"){  // datas can be editable mode only when appstatus != APPROVED or PENDING or REJECTED ..
       //store application status value in appStatus variable
       let appStatus = data.status ? data.status : "" ;
       //if appStatus is APPROVED or PENDING or REJECTED , will not allow staff to update datas again .
       if(appStatus == "APPROVED" || appStatus == "PENDING" || appStatus == "REJECTED"){
        this.dialog.open(CompanyProfileComponent, {
          data: { applicationCompanyProfileReview:data,applicationId:APPLICATIONID },
          panelClass: 'custom-modalbox',
          width:'1245px',
          height: '575px',
          disableClose : true
        })
       }
    else { // appStatus == "NEW" --> Datas are allowed to edit .
      this.dialog.open(CompanyProfileComponent, {
        data: { appSearchOnboardingForMc:data,applicationId:APPLICATIONID, applicantId : APPLICANTID },
        panelClass: 'custom-modalbox',
        width:'1245px',
        height: '575px',
        disableClose : true
      })
    }
    }
    else if (reqChannel == "MOBILE"){  //only datas can be read mode only..
      this.dialog.open(CompanyProfileComponent, {
        data: { applicationCompanyProfileReview:data,applicationId:APPLICATIONID },
        panelClass: 'custom-modalbox',
        width:'1245px',
        height: '575px',
        disableClose : true
      })
    }
    else{
      this.dialog.open(CompanyProfileComponent, {
        data: { applicationCompanyProfileReview:data,applicationId:APPLICATIONID },
        panelClass: 'custom-modalbox',
        width:'1245px',
        height: '575px',
        disableClose : true
      })
    }
  
  },
  //error handling Completed on 06-07-2023 - <DN>
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  });
  }

  }

  
  openApplication(value:string){
  if(value == "I"){
    const dialogRef = this.dialog.open(ParentStepperOnboardingComponent,{
      panelClass: 'custom-modalbox',
      width:'1245px',
      height: '575px',
      disableClose : true,
      data :{appOnboardingForMc : value} 
    })
  }
  else if(value == "C"){
    const dialogRef = this.dialog.open(ParentStepperOnboardingComponent,{
      panelClass: 'custom-modalbox',
      width:'1245px',
      height: '575px',
      disableClose : true,
      data :{appOnboardingForMc : value} 
    })
  }
  }

}


