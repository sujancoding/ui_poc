import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { TransactionHistory } from 'src/app/dashboards/model/approveddashboard';
import { RecentTransaction } from 'src/app/dashboards/model/recent transaction/Recent Transaction';
import { CustomerDashboardService } from 'src/app/dashboards/services/customerdashboard.service';
import { ErrorDialogComponent } from 'src/app/onboarding/modals/errordialog.component';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

import { getTxnStatusAndColor } from 'src/assets/transactionstatus';
import { roleIdDetails } from 'src/assets/userrole';


@Component({
  selector: 'app-all-transactions',
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.scss','../../../assets/styles/tables/table-style.scss'],

})
export class AllTransactionsComponent implements OnInit {
  customerDashboard : TransactionHistory [] = [];
  transactionData : any[] = [];
  payeeData : any;
  rowData : any;
  status !: string;
  refreshIcon !: Boolean;
  loader !: Boolean ;
  contentIndividual : boolean = false;
  contentCorporate : boolean = false ;
  showNoTransactionMessage : boolean = false ;
  itemsPerPage: number = 20;
  p: number = 1;



  constructor(private store : InMemoryCache,private customerService: CustomerDashboardService,
    private router: Router,private headerService : TitleHeaderService,private dialog:MatDialog) { }

  ngOnInit(): void {
    let role = this.store.getItem('USER_ROLE');
    this.loader = true;
    let appStatus = this.store.getItem('APPLICATIONSTATUS');
    if(role == roleIdDetails.CONSUMER){ // invidual - 111
    this.contentIndividual = true ;

    }
    if(role == roleIdDetails.CORPORATE_OWNER ||role == roleIdDetails.CORPORATE_RUNNER ||role == roleIdDetails.CORPORATE_DEALER){ // 555-owner, 556-runner , 557-dealer
    this.contentCorporate = true;
    }

    this.refreshIcon = true;
    this.headerService.setTitle('All Transactions');
    let customerId = this.store.getItem('CUSTOMER_ID');
    if(customerId != undefined){
      if(appStatus == "NEW" || appStatus == "PENDING"){
        this.contentIndividual = false ;
        this.contentCorporate = false ;
        this.showNoTransactionMessage = true ;
      }
      else{
        this.customerService.getTransactionHistory().subscribe((datas:any)=>{
          this.loader= false;
          this.customerDashboard = datas;
          this.transactionData = datas['data'];
          if(this.transactionData.length == 0){
            this.contentIndividual = false ;
            this.contentCorporate = false ;
            this.showNoTransactionMessage = true ;
          }
          else{
            this.showNoTransactionMessage = false ;
          }
        },
        //error handling completed - 30/06/2023
        (error:any) => {
          this.loader = false;
          if(error.status != 401){
            this.dialog.open(ErrorDialogComponent) ;
          }
         
        })
      }
    }
    //getScreenWidth will get the windows inner width.
  this.getScreenWidth = window.innerWidth;
  this.getScreenHeight = window.innerHeight;
  console.log(this.getScreenWidth);
  }

  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
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
  // getTooltipText(status: any){
  //   const statusObj : any= getTxnStatusAndColor(status);
  //   return statusObj.tooltipText;
  // }
  
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

//   openTransactionDetails(transactionId : any){
//     this.router.navigate([`customers/transfer-details`])
//    this.rowData = this.transactionData.filter((v:any) => v.TRANSACTIONID == transactionId);
//    this.store.setItem('TRANSACTION_ID',this.rowData);
//  }
 refresh(){
  console.log("refresh");
  this.loader = true;
  setTimeout(() => {
    this.customerService.getTransactionHistory().subscribe((datas:any)=>{
      this.customerDashboard = datas;
      this.loader = false;
      this.transactionData = datas['data'] ;
    },
    
    //error handling completed - 30/06/2023
    (error:any) => {
      this.loader = false;
      this.refreshIcon = true;
      if(error.status != 401){
        this.dialog.open(ErrorDialogComponent) ;
      }
     
    });
  }, 800);
 }
 changeTableHeight(){
  return { 'height': (this.getScreenHeight - 160) + 'px', 'overflow-y': 'auto','margin-top' : '17px' };
}
navigateReceipt(transactionId:any, type:string, forexBookingType :any){
   this.rowData= this.transactionData.filter((v:any) => v.TRANSACTIONID == transactionId);
   const myArray = this.rowData
   const jsonString = JSON.stringify(myArray);
   this.store.setItem('TRANSACTION_ID',jsonString);
   if(type == "C"){
    this.store.setItem('CORPORATE_DASHBOARD_TRANSACTION_TYPE', forexBookingType) ;
    this.router.navigate([`customers/transfer-details`]);
  }
  else if(type == "I"){
    this.router.navigate([`customers/receipt-details`]);
  }
}
}
