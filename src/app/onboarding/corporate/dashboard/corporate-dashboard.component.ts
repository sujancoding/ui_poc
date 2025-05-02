import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { CorporateApplicationSteps } from 'src/app/core/model/ApplicationFlagSteps';
import { ApplicationService } from 'src/app/core/services/application.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { TransactionHistory } from 'src/app/dashboards/model/approveddashboard';
import { CustomerDashboardService } from 'src/app/dashboards/services/customerdashboard.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CorporateProgressReportComponent } from '../../modals/corporate-progressreport/corporate-progress-report.component';
import { ProfileEvaluatingComponent } from '../../modals/profile-evaluator-alert.component';
import SwiperCore , {Navigation , Pagination , Scrollbar , A11y} from 'swiper' ;

import { TransactionService } from 'src/app/core/services/transaction.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../modals/errordialog.component';
import { getTxnStatusAndColor } from 'src/assets/transactionstatus';
import { CorporateService } from 'src/app/core/services/corporate.service';
SwiperCore.use([Navigation , Pagination , Scrollbar , A11y]) ;

@Component({
  selector: 'app-corporate-dashboard',
  templateUrl: './corporate-dashboard.component.html',
  styleUrls: ['./corporate-dashboard.component.scss', '../../../../assets/styles/tables/table-style.scss'],

})
export class CorporateDashboardComponent implements OnInit {
  
  isDisabled!: Boolean ;
  customerDashboard : TransactionHistory [] = [];
  transactionData : any[] = [];
  payeeData : any;
  rowData : any;
  status !: string;
  userName !: string ;
  loggedInUser !: string ;
  transactionDataLength : any ;
  payeeDataLength : any ;
  customerId !: string;
  filterForm : FormGroup = Object.create(null);
  loader : boolean = false;
  itemsPerPage: number = 20;
  p: number = 1;

  
  constructor(private router: Router, private _bottomSheet: MatBottomSheet, private store: InMemoryCache,private applicationSevice: ApplicationService,
    private headerService : TitleHeaderService,private customerService : CustomerDashboardService,private searchTransaction : TransactionService,private fb : FormBuilder,private dialog : MatDialog,private corporateService:CorporateService) { }

    handlePageChange(event: any): void {
      this.p = event.pageIndex + 1;
    }

  ngOnInit(): void {
    this.headerService.setTitle('Dashboard');
   // let appStatus = this.store.getItem('APPLICATIONSTATUS');
    let customerStatus = this.store.getItem('CUSTOMER_STATUS') ?  this.store.getItem('CUSTOMER_STATUS') : "";
    this.loggedInUser = this.store.getItem('LOGGEDIN_EMAIL_ID') ? this.store.getItem('LOGGEDIN_EMAIL_ID') : "" ; //loggedIn User id 
    this.userName = this.store.getItem('USERNAME') ? this.store.getItem('USERNAME') : "!"  ; //username
    this.customerId = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "" ;
    this.filterForm = this.fb.group({
      "payeeName" : [null,Validators.compose([Validators.pattern('^[a-zA-Z0-9 +?:().,/-]+$'),Validators.maxLength(35)])],
    })
    if(customerStatus == "ACTIVE"){
      if(this.customerId != ""){
      this.isDisabled = false;
      this.loader = true;
      this.customerService.getCustomerDashboard().subscribe((data:any)=>{
        this.loader = false;
        this.customerDashboard = data;
        this.transactionData = data.transactionData.slice(0,5); //show only 5 transaction datas
        this.payeeData = data.payeeData.slice(0,5); //show only 5 payee datas
        this.transactionDataLength = this.transactionData.length ;
        this.payeeDataLength = this.payeeData.length ;
        if(this.transactionDataLength == 0){
          this.transactionDataLength = 0 ;
        }
        if(this.payeeDataLength == 0){
          this.payeeDataLength = 0 ;
        }
        
      }
      , //error handling Completed on 06-07-2023 - <DN>
      (error:any) => {
        this.loader = false;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent) ;
        }
      }
      )
    }
  }
  else{
    let applicationId = this.store.getItem('APPLICATION_ID')
    this.corporateService.getCorporateApplicationInquiry(applicationId).subscribe((data:any)=>{
       let appStatus = data.status;
      let updatedSteps = JSON.parse(this.store.getItem('APPLICATION_STEPS'));
       let progress = updatedSteps;
         if(appStatus == "NEW"){
           this.isDisabled = true; 
           this.transactionData.length = 0 ;
           this.transactionDataLength = 0;
           this.payeeDataLength = 0 ;
           this._bottomSheet.open(CorporateProgressReportComponent, {
           data:{ corporateApplicationUpgrade:  progress},
           disableClose: false,
         })
       }
       if(appStatus == "PENDING"){
         this.isDisabled = true; 
         this.transactionData.length = 0 ;
         this.transactionDataLength = 0;
         this.payeeDataLength = 0 ;
         this._bottomSheet.open(ProfileEvaluatingComponent, {
           disableClose: false,
         })
       }  
    },
    (error:any)=>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent);
      }
    })
  }
  //getScreenWidth will get the windows inner width.
  this.getScreenWidth = window.innerWidth;
  this.getScreenHeight = window.innerHeight;
  console.log(this.getScreenWidth);
 
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
//responsvie table height based on windows inner height
responsiveSpaceBetween() {
    return {  
      'flex-direction': 'row',
      'box-sizing': 'border-box',
      'display': 'flex',
      'position': 'relative',
      'left': (this.getScreenWidth - 1898) + 'px',
      'top': '-120px;'
    };
  }

  changeTableHeight(){
    return { 'height': (this.getScreenHeight - 465) + 'px', 'overflow-y': 'auto' };
  }
  
  getColor(status: any){
    const statusObj : any= getTxnStatusAndColor(status);
    this.status = statusObj.status;
    return statusObj.color;
  }

  getBackgroundColor(status: any){
    const statusObj : any= getTxnStatusAndColor(status);
    return statusObj.bgcolor;
  }
  getTooltipText(status: any){
    const statusObj : any= getTxnStatusAndColor(status);
    return statusObj.tooltipText;
  }

 
  
    
  navigateAllPayee(){
    this.router.navigate(['payee/all-payee']);
  }
  AddPayee() {
    this.router.navigate(['agent/payee/'])
  }
  navigateViewPayee(customerId:any,payeeId:any){
    this.router.navigate([`payee/add-payee/${customerId}/${payeeId}`])
  }
  navigateAllTransaction(){
    this.router.navigate(['payee/all-transactions']);
  }
  navigateReceipt(transactionId:any, forexBookingType:string){
    this.rowData = this.transactionData.filter((v:any) => v.TRANSACTIONID == transactionId);
   const myArray = this.rowData
   const jsonString = JSON.stringify(myArray);
   this.store.setItem('TRANSACTION_ID',jsonString);
   this.store.setItem('CORPORATE_DASHBOARD_TRANSACTION_TYPE', forexBookingType) ;
    this.router.navigate([`customers/transfer-details`]);

  }
  
  fetchPayee(payeeName: string) {
    let corporateId = this.customerId;
     this.loader = true;
    payeeName =  payeeName ? payeeName : "" ;
    this.searchTransaction.searchPayeeName(payeeName, corporateId).subscribe((data:any) => {
    if(payeeName == ""){
      this.transactionData = data['data'].slice(0,5) ; //show only 5 transaction datas
    }
    else{
      this.transactionData = data['data'];
    }
     this.loader = false;
    },//error handling
       (error : any) => {
        this.dialog.open(ErrorDialogAdminComponent)
        this.loader = false;
       } 
     )
  }
}
