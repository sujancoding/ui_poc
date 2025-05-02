import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import moment from 'moment';
import { Subscription, interval } from 'rxjs';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MoneyChangerAccountsService } from 'src/app/core/services/mcaccounts.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';

@Component({
  selector: 'app-customer-accounts',
  templateUrl: './customer-accounts.component.html',
  styleUrls: ['./customer-accounts.component.scss', '../../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]
})
export class CustomerAccountsComponent implements OnInit, OnDestroy {

  p: number = 1;
  loader : boolean = false;
  itemsPerPage = 20 ;
  isActive : Boolean = false;
  filterForm : FormGroup = Object.create(null);
  customerAccountsRecords : any[] = [] ;
  private subscription !: Subscription;
  private readonly intervalTime = 20000; // 20 seconds
  showArrowUpward : boolean = false ;
  showArrowDownward : boolean = true ;
  showCustomerNameArrowUpward : boolean = false ;
  showCustomerNameArrowDownward : boolean = true ;
  //added for bottom value in screen
  customerBalanceForm!: FormGroup ;
  stockExpansionPanelStatus : string = "opened" ;
  stockDetails : any[] = [] ;
  arrayOfObjects : any ;
  isShowAsset : boolean = false;
  constructor(private router: Router,
    private headerService: TitleHeaderService,private dialog : MatDialog,private fb : FormBuilder,
    private accountsService : MoneyChangerAccountsService, private store : InMemoryCache) { }


  ngOnDestroy() {
     // Unsubscribe from the interval when the component is destroyed
     if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

    handlePageChange(event: any): void {
      this.p = event.pageIndex + 1;
    }

  ngOnInit(): void {

    this.headerService.setTitle('Customer Accounts');
    
    this.filterForm = this.fb.group({
     "customerName" : [null],
     "customerCode" : [null]
    });

    //created form for showing bottom records such as Balance, Asset, Stock
    this.customerBalanceForm =this.fb.group({
      "stock" : [null],
      "customer" : [null],
      "asset" : [null]
    });

    this.callCustomerAccountsInquiry('', '', '', '', '','','','');

      // Set up the interval to call the API every two seconds
  this.subscription = interval(this.intervalTime).subscribe(() => {
    this.callCustomerAccountsInquiry('', '', '', '', '','','','');
  });
   

    //getScreenWidth and getScreenHeight will get the windows inner height and width.
   this.getScreenWidth = window.innerWidth;
   this.getScreenHeight = window.innerHeight;

   // retriving access control array from Store .
   let accessControlDtl = this.store.getItem('ACCESS_CONTROLS_ARRAY') ? this.store.getItem('ACCESS_CONTROLS_ARRAY') : "";
    if (accessControlDtl != "") {
       this.arrayOfObjects = JSON.parse(accessControlDtl);
    }
      // Enable this.isShowAsset as true when access id "BMCA" is present in access control array...
      this.isShowAsset = this.arrayOfObjects.some((item:any)=>{
        return item.accessId == "BMCA" && item.name == 'MC CUSTOMER ACCOUNTS ASSET FIELD' ;
      }) ;
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

  //STATUS color diff
 getColor(status: any) {
  switch (status) {
    case '1':
      return 'rgb(30 189 40)'; 
    case '0':
      return 'red'
    default:
      return '';
  }
}
//bg color for status tags .
getBackgroundColor(status: string): string {
  switch (status) {
    case '1':
      return '#E1FCEF'; 
    case '0':
      return '#FFEDDF'
    default:
      return '';
  }
  
}

  changeTableHeight(action:string) {
    if(action == "opened"){
      return { 'height': (this.getScreenHeight - 344) + 'px', 'overflow-y': 'auto' };
    }
    else if(action == "closed"){
      return { 'height': (this.getScreenHeight - 269) + 'px', 'overflow-y': 'auto' };
    }
    else{
      return { 'height': (this.getScreenHeight - 269) + 'px', 'overflow-y': 'auto' };
    }
    
  }


  searchFilter(){
   let customerName = this.filterForm.controls['customerName'].value ? this.filterForm.controls['customerName'].value : "" ;
   let customerCode = this.filterForm.controls['customerCode'].value ? this.filterForm.controls['customerCode'].value : "" ;
   this.callCustomerAccountsInquiry('',customerName,'','','','','',customerCode);
  }

  //customer accounts service function 
  callCustomerAccountsInquiry(acctNo:string, entityName:string, acctStatus:string, custId:string, custType:string, dateGt:any, dateLt:any, aliasName:any){
    // getCustomerAccounts(acctNo:string, entityName:string, acctStatus:string, custId:string, custType:string)
    this.loader = true ;
    this.showArrowUpward  = false ;
    this.showArrowDownward  = true ;
    let ccyNo = '01';
    this.accountsService.getCustomerAccounts(acctNo, entityName, acctStatus, custId, custType, dateGt, dateLt, ccyNo, aliasName).subscribe((datas:any)=>{
    this.loader = false ;
    this.customerAccountsRecords = datas['data'] ;
    // sort by asc
    if(this.customerAccountsRecords.length > 0){
    this.customerAccountsRecords = this.customerAccountsRecords
    .sort((a: any, b: any) => a.outstandingBalance - b.outstandingBalance);
    }
//once customer accounts service is success --> call customer accounts asset .
    this.callCustomerAccountsAsset() ;

    },
    (error:any)=>{
      this.loader = false ;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
            data : error.error.errorMessage ? error.error.errorMessage : ""
        }) ;
      }
     }
    )
  }


    //asset service function 
    callCustomerAccountsAsset(){
      this.accountsService.getCustomerAccountAsset().subscribe((datas:any)=>{
      this.stockDetails = datas['data'] ;
  
      if(this.stockDetails.length >= 1){ //checking for assetData node is not empty array...
      this.customerBalanceForm.patchValue({
        "stock" : this.stockDetails[0].STOCK ? this.stockDetails[0].STOCK : "" ,
        "customer" : this.stockDetails[0].CUSTOMERBALANCE ? this.stockDetails[0].CUSTOMERBALANCE : "" ,
        "asset" : this.stockDetails[0].ASSET ? this.stockDetails[0].ASSET : "" ,
      })

    }
  
      },
      (error:any)=>{
        this.loader = false ;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent,{
             data : error.error.errorMessage ? error.error.errorMessage : ""
          }) ;
        }
       }
      )
    }

  openAccountsHistory(accountNo:string, entityName:string){
    console.log(accountNo, entityName) ;
    this.store.setItem('MC_CUSTOMERACCOUNTS_ACCOUNTNO', accountNo) ;
    this.store.setItem('MC_CUSTOMERACCOUNTS_ACCOUNTNAME', entityName) ;
    this.router.navigate(['/moneychanger-accounts/customer-accounts-history']); //navigate to customer accounts history screen 
  }

  //record level -> download transaction summary/ledger , only one day entry
  downloadLedgerFile(acctNo:string, recordDate:any, orgName:string){
    console.log(acctNo , recordDate) ;
    this.loader = true ;
    let date : any = moment(recordDate) ;
    let creationDate = date._d.getFullYear() + "-" + (date._d.getMonth() + 1) + "-" + date._d.getDate();
    this.accountsService.getCustomerAccountsLedger(acctNo, creationDate, creationDate, true, false).subscribe((datas: ArrayBuffer)=>{
      this.loader = false;
      // Handle the ArrayBuffer data here
      const blob = new Blob([datas], { type: 'application/pdf' });

      // Create a File with a specified filename
      const filename = `${orgName} LEDGER-${recordDate}.pdf` ;

      const file = new File([blob], filename, { type: 'application/pdf' });

      // Create a data URL from the File
      const url = URL.createObjectURL(file);

      // Open the PDF in a new tab or download as needed
      window.open(url);
    },
    (error:any)=>{
      this.loader = false;
      if(error.status = 401){
          if(error.status == 500){
            // Decode the ArrayBuffer to JSON if it's an error response
            const textDecoder = new TextDecoder("utf-8");
            const errorText = textDecoder.decode(error.error);
            let errorMessage = "";
            try {
              const errorJson = JSON.parse(errorText);
              errorMessage = errorJson.errorMessage || "An error occurred";
            } catch (e) {
              errorMessage = "An error occurred"; // Fallback in case JSON parsing fails
            }
            this.dialog.open(ErrorDialogAdminComponent,{
              data :{ errorMessage : errorMessage ? errorMessage : "" }
            }) 
          }
      else{
        this.dialog.open(ErrorDialogAdminComponent) 
    }
    }
  }
)
  }
    

  //Sorting function onclick arrow icons in OUTSTANDING BALANCE TH 
  toggleSort(sortBy:string, headerName:string){
    if(headerName == "OUTSTANDING BALANCE" && sortBy == "ASC"){
      this.showArrowUpward =false ;
      this.showArrowDownward = true ;
      if(this.customerAccountsRecords.length > 0){
      //  sort in ascending order
      this.customerAccountsRecords = this.customerAccountsRecords
      .sort((a: any, b: any) => a.outstandingBalance - b.outstandingBalance);
    }
  }
    else if(headerName == "OUTSTANDING BALANCE" && sortBy == "DESC"){
      this.showArrowDownward = false ;
      this.showArrowUpward =true ;
      if(this.customerAccountsRecords.length > 0){
      //  sort in descending order
      this.customerAccountsRecords = this.customerAccountsRecords
      .sort((a: any, b: any) => b.outstandingBalance - a.outstandingBalance);
    }
  }
  else if(headerName == "CUSTOMER NAME" && sortBy == "ASC"){
    this.showCustomerNameArrowUpward =false ;
    this.showCustomerNameArrowDownward = true ;
    if(this.customerAccountsRecords.length > 0){
    //  sort in ascending order
    this.customerAccountsRecords = this.customerAccountsRecords
    .sort((a: any, b: any) => { return a.entityName.localeCompare(b.entityName)});
  }
  }
  else if(headerName == "CUSTOMER NAME" && sortBy == "DESC"){
    this.showCustomerNameArrowDownward = false ;
    this.showCustomerNameArrowUpward = true ;
    if(this.customerAccountsRecords.length > 0){
    //  sort in ascending order
    this.customerAccountsRecords = this.customerAccountsRecords
    .sort((a: any, b: any) => { return b.entityName.localeCompare(a.entityName)});
  }
  }
  }


  onPanelToggle(action:string) {
    this.stockExpansionPanelStatus = action ;
     this.changeTableHeight(action);
  }


}
