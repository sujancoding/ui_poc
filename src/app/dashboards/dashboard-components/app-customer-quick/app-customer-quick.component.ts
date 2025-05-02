
import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {  Router } from '@angular/router';

import { IndividualComponent } from 'src/app/onboarding/modals/progress-report.component';

import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { ProfileEvaluatingComponent } from 'src/app/onboarding/modals/profile-evaluator-alert.component';
import { TransactionHistory } from '../../model/approveddashboard';
import { CustomerDashboardService } from '../../services/customerdashboard.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/onboarding/modals/errordialog.component';
import { ProfileinfoService } from 'src/app/core/services/profileinfo.service';

declare global {
  interface Window {
      MobileAppService: any;
  }
}



@Component({
  selector: 'app-customer-quick',
  templateUrl: './app-customer-quick.component.html',
  styleUrls: ['./app-customer-quick.component.scss']
})
export class AppCustomerQuickComponent implements OnInit {

  customerDashboard : TransactionHistory [] = [];
  transactionData : any;
  payeeData : any;
  showBottomSheet:Boolean = false;
  initialStageProgress: any;
  appStatus : any;
  sowProgress:any;
  docProgress: any;
  isDisabled !: Boolean ;
  date = new Date();
  rowData : any;
  customerName !: string;
  transactionLoader : Boolean = false;
  refreshIcon: Boolean = true;
  showNoTransactionMessage : Boolean = false ;
  showTransactionData : Boolean = false ;
  myApp : any ;

  constructor(private router: Router, private _bottomSheet: MatBottomSheet, private store: InMemoryCache,private headerService : TitleHeaderService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {progress: number,progressProfile:number},private customerService: CustomerDashboardService,private profileService : ProfileinfoService,
    private dialog : MatDialog) { }

  ngOnInit(): void {
   // this.customerName = this.store.getItem('USERNAME');
    this.headerService.setTitle('Dashboard');
    console.log('Dashboard') ;
    this.myApp = window.MobileAppService ? window.MobileAppService.isMobileApp() : "" ;
    if(this.myApp != ""){
      this.myApp.then(
        function(resolve: any){
            var isMobileApp = resolve;
            console.log(isMobileApp);
            if(isMobileApp == "Y"){
              sessionStorage.setItem('ISMOBILEAPP', 'Y') ;
            }
        
        },
        function(failure: any){
            console.log(failure) ;
        }
        );
        
    }
    let customerId = this.store.getItem('CUSTOMER_ID');
    let customerStatus = this.store.getItem('CUSTOMER_STATUS');
    if(customerStatus ==  "ACTIVE"){
      if(customerId != undefined){
      this.customerService.getCustomerDashboard().subscribe((data:any)=>{
        this.customerDashboard = data;
        this.transactionData = data.transactionData.slice(0,5); //show only 5 transaction datas
        this.payeeData = data.payeeData.slice(0,5); //show only 5 payee datas
        this.isDisabled = false;
        this.showNoTransactionMessage = false;
        this.showTransactionData = true ; 
        if(this.customerDashboard.length == 0){
         this.showNoTransactionMessage = true ; 
         this.showTransactionData = false ; 
        }
      },
      
      (error:any) => {
        if(error.status != 401){
          this.dialog.open(ErrorDialogComponent) ;
        }
       
      })
    }
    else if (customerStatus == "INACTIVE"){
      this.customerService.getCustomerDashboard().subscribe((data:any)=>{
        this.customerDashboard = data;
        this.showTransactionData = true ; 
        this.transactionData = data.transactionData.slice(0,5); //show only 5 transaction datas
        this.payeeData = data.payeeData.slice(0,5); //show only 5 payee datas
      },
      (error:any) => {
        this.dialog.open(ErrorDialogComponent) ;
      }
      )
     this.dialog.open(ErrorDialogComponent,{
      data : {errorMessage : 'INACTIVE'}
     }) ;
     this.isDisabled = true;
    }
    }
    else{
      let applicationId = this.store.getItem("APPLICATION_ID")
      this.profileService.getApplicationInquiry(applicationId).subscribe((data:any)=>{
            this.appStatus = data.status;
            // this.appStatus = this.store.getItem('APPLICATIONSTATUS');
            let progress = JSON.parse(this.store.getItem('APPLICATION_STEPS'));
            if(this.appStatus == "NEW"){
            this.isDisabled = true;  
            this.showTransactionData = false ; 
            this.showNoTransactionMessage = true ; 
            this._bottomSheet.open(IndividualComponent, {
              data:{ ApplicationUpgrade:  progress},
              disableClose: false,
            })
          }
          if(this.appStatus == "PENDING"){
            this.isDisabled = true; 
            this.showTransactionData = false ; 
            this.showNoTransactionMessage = true ; 
            this._bottomSheet.open(ProfileEvaluatingComponent, {
              disableClose: false,
            })
          }
      },
       //error handling completed
       (error:any)=>{
        if(error.status != 401){
          this.dialog.open(ErrorDialogComponent) ;
        }
      
      }
    )
    
    
    }
    
  }
  
  
  status !: string;
  getColor(status: any){
    switch(status) {
      case 'INITIATED':  //1
        this.status = 'Payment due'
        return 'red';

        case 'PENDING':  //1
        this.status = 'In-Progress'
        return 'orange';

      case 'AMOUNT RECEIVED':  //2
        this.status = 'In-Progress';
        return 'orange';

        case 'PAYMENTRCVD':  //2
        this.status = 'In-Progress';
        return 'orange';

      case 'APPROVED':    //3
        this.status = 'In-Progress'
        return 'orange';

      case 'FAILED AT BANK':
        this.status = 'Failed';
        return 'red';

        case 'BANKCOMPLETED':
          this.status = 'Successful';
          return 'green';

           case 'BANK APPROVED':
        this.status = 'In-Progress'
        return 'orange';

      case 'ACKNOWLEDGED':
        this.status = 'In-Progress'
        return 'orange';

      case 'DEPOSITED':
        this.status = 'Successful'
        return 'green';

        case 'CANCELLED':  //1
        this.status = 'Cancelled'
        return 'red';
    }

    
  }

  AddPayee() {
    this.router.navigate(['payee/add-payee/'])
  }
  navigateViewPayee(customerId:any,payeeId:any){
    this.router.navigate([`payee/add-payee/${customerId}/${payeeId}`])
  }
  navigateAllPayee(){
    this.router.navigate(['payee/all-payee']);
  }
  navigateAllTransaction(){
    this.router.navigate(['payee/all-transactions']);
  }
  navigateReceipt(transactionId:any){
    this.router.navigate([`customers/receipt-details`])
   this.rowData = this.transactionData.filter((v:any) => v.TRANSACTIONID == transactionId);
   const myArray = this.rowData
   const jsonString = JSON.stringify(myArray);
   this.store.setItem('TRANSACTION_ID',jsonString);

  }
//call transaction search api and refresh
  refresh(){
    this.transactionLoader = true;
    this.refreshIcon = false;
    setTimeout(() => {
      this.customerService.getTransactionHistory().subscribe((datas:any)=>{
        this.customerDashboard = datas;
        this.transactionLoader = false;
        this.refreshIcon = true;
        this.transactionData = datas['data'].slice(0,5); //show only 5 transaction datas
      },
      //error handling - completed 30/06/2023
      (error:any) => {
        this.transactionLoader = false;
        this.refreshIcon = true;
        if(error.status != 401){
          this.dialog.open(ErrorDialogComponent) ;
        }
       
      }
      );
    }, 2000);
  }
}
