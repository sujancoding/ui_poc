import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import moment from 'moment';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MoneyChangerTransactionService } from 'src/app/core/services/mctransaction.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

import { getTransactionBgcolorMoneyChanger, getTransactionColorMoneyChanger } from 'src/assets/transactionstatus';
import { roleIdDetails } from 'src/assets/userrole';

@Component({
  selector: 'app-view-transaction-mc',
  templateUrl: './view-transaction-mc.component.html',
  styleUrls: ['./view-transaction-mc.component.scss','../../../../assets/styles/tables/table-style.scss',
    '../../../../assets/styles/buttons/button.scss'
  ],

})
export class ViewTransactionMcComponent implements OnInit {

  transactionListings : any[] = [] ;
  isActive = false;
  p: number = 1;
  itemsPerPage: number = 20;
  loader : Boolean = false ;
  public getScreenWidth: any;
  public getScreenHeight: any;
  public filterForm : FormGroup = Object.create(null);
  xpandStatus = false ;
  typeList : any[] = [
    {"value" : "" , "description" : "--Select--"},
    {"value" : "B" , "description" : "BUY"},
    {"value" : "S" , "description" : "SELL"},
  ];
  statusList : any[] = [
    {"value" : "" , "description" : "--Select--"},
    {"value" : "1" , "description" : "INITIATED"},
    {"value" : "2" , "description" : "CANCELLED"},
  ];
  counterTypeList : any[] = [];
  searchCustomerName !: string ;
  filterValues : any[] = [];
  minStartDate!: Date;
  maxStartDate!: Date;
  minEndDate!: any;
  maxEndDate!: any;
  validateEndDate: any;
  validateStartDate: any;
  dateGt : any;
  dateLt : any ;
  loginResCounterType !: string ;
  userRole !: string ;
  showProfitLoss : boolean = false;
  constructor(private titleService : TitleHeaderService, private router: Router,
    private dialog : MatDialog, private transactionService: MoneyChangerTransactionService, private fb : FormBuilder,
    private store : InMemoryCache) { }
// added suspicious list array .
    suspiciousList : any[] = [
      {"value" : "" , "description" : "--Select--"},
      {"value" : "Y" , "description" : "YES"},
      {"value" : "N" , "description" : "NO"},
    ];

   //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  changeTableHeight(){
    return { 'height': (this.getScreenHeight - 254 )+'px' , 'overflow-y' : 'auto' }; 
  }
  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Transaction Listings') ;
    this.filterForm = this.fb.group({
      ccyCode : [null],
      custName : [null],
      buySellInd : [null],
      status : [null],
      counterType : [null],
      startDate: [null,Validators.compose([Validators.required])],
      endDate: [null,Validators.compose([Validators.required])],
      suspicious : [null]
    });

    this.loginResCounterType = this.store.getItem('RESPONSE_COUNTER_TYPE') ? this.store.getItem('RESPONSE_COUNTER_TYPE') : "";
    this.userRole = this.store.getItem('USER_ROLE') ? this.store.getItem('USER_ROLE') : "" ;
    if(this.loginResCounterType == "W"){
     this.counterTypeList = [
      {"value" : "W" , "description" : "WHOLESALE"}
     ]
    }
     if(this.loginResCounterType == "R"){
     this.counterTypeList = [
      {"value" : "R" , "description" : "RETAIL"}
     ]
    }
    if(this.userRole == roleIdDetails.STAFF_OWNER){ //444
      this.counterTypeList = [
        {"value" : "W" , "description" : "WHOLESALE"},
        {"value" : "R" , "description" : "RETAIL"},
      ];
    }

    this.onLoadFiltersSetup();
    this.callTransactionInquiryApi('', '', '', '','1', this.loginResCounterType, this.dateGt, this.dateLt, '');

      //getScreenWidth and getScreenHeight will get the windows inner height and width.
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
       // getting ACCESS_CONTROLS_ARRAY from store.
      let accessControlDtl = this.store.getItem('ACCESS_CONTROLS_ARRAY') ? this.store.getItem('ACCESS_CONTROLS_ARRAY') : "";
      let arrayOfObjects : any ;
      if (accessControlDtl != "") {
        // storing objects in arrayOfObjects
         arrayOfObjects = JSON.parse(accessControlDtl);
         // if arrayOfObjects contain accessID == "BMPL" and name ="MONEYCHANGER PROFIT-LOSS COLUMN" changing status of showProfitLoss as true.
     this.showProfitLoss  = arrayOfObjects.some((item:any)=>{
      return item.accessId == "BMPL" && item.name == 'MONEYCHANGER PROFIT-LOSS COLUMN' ;
     }) ;
      }
  
     
     console.log(this.showProfitLoss);

  }

  callTransactionInquiryApi(currencyCode:string,customerId:string, customerName:string, buySellInd:string, 
    transactionStatus:string, counterType:string, dateGt:any, dateLt:any ,isSuspicious:string){
    this.loader = true;
    console.log(transactionStatus, counterType) ;
    isSuspicious = this.filterForm.controls['suspicious'].value ? this.filterForm.controls['suspicious'].value : ""
    // getTransactionListings(currencyCode:string, customerId:string, customerName:string, 
    //buySellInd:string, transactionStatus:string, counterType:string, dateGt:any, dateLt:any)
     this.transactionService.getTransactionListings(currencyCode, customerId, customerName, buySellInd, 
       dateGt, dateLt, counterType, transactionStatus, isSuspicious).subscribe((datas:any)=>{
        this.transactionListings = datas['data'] ;
        this.loader = false;
     },
     (error:any)=>{
      this.loader = false;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
     }
     )
  }
  //onclick --> navigate to add deal screen (MC)
  navigateToAddTransaction(){
    this.router.navigate(['moneychanger-transaction/new-transaction']) ;
  }
 

  searchFilter(){
    this.xpandStatus = false ;
    let ccyCode = this.filterForm.controls['ccyCode'].value ? this.filterForm.controls['ccyCode'].value : "" ;
    let customerName = this.filterForm.controls['custName'].value ? this.filterForm.controls['custName'].value : "" ;
    let buySellInd = this.filterForm.controls['buySellInd'].value ? this.filterForm.controls['buySellInd'].value : "" ;
    let status = this.filterForm.controls['status'].value ? this.filterForm.controls['status'].value : "" ;
    let counterType = this.filterForm.controls['counterType'].value ? this.filterForm.controls['counterType'].value : "" ;
    // added suspicious in search filter.
    let isSuspicious = this.filterForm.controls['suspicious'].value ? this.filterForm.controls['suspicious'].value : "";

    //handling start date and end date 
    var start_date: any = moment(this.filterForm.controls.startDate.value);
    var end_date: any = moment(this.filterForm.controls.endDate.value);
    this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
    this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

  
       // Use toLocaleDateString to format the date as "dd/mm/yyyy"
       let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
       let patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
       let patchEndDate = end_date._d.toLocaleDateString('en-GB', options);

    if(patchStartDate == 'NaN-NaN-NaN'){
      patchStartDate = "" ;
    }
    if(patchEndDate == 'NaN-NaN-NaN'){
      patchEndDate = "" ;
    }
     // Check each variable and add non-empty ones to the filter values array
     this.filterValues = [] ;
  if (ccyCode !== "") {
    this.filterValues.push({"fieldName":"Currency Code","value":ccyCode});
  }
  if (customerName !== "") {
    this.filterValues.push({"fieldName":"Customer Name","value":customerName});
  }
  if (buySellInd !== "") {
    let filteredTypeList = this.typeList.filter(v => v.value == buySellInd) ;
    let typeDescription = filteredTypeList[0].description ;
    this.filterValues.push({"fieldName":"Type","value":typeDescription});
  }
  if (status !== "") {
    let filteredStatusList = this.statusList.filter(v => v.value == status) ;
    let statusDescription = filteredStatusList[0].description ;
    this.filterValues.push({"fieldName":"Status","value":statusDescription});
  }
  if (counterType !== "") {
    let filteredCounterTypeList = this.counterTypeList.filter(v => v.value == counterType) ;
    let counterTypeDescription = filteredCounterTypeList[0].description ;
    this.filterValues.push({"fieldName":"Counter Type","value":counterTypeDescription});
  }
  //pushing dates
  var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
  var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };

  this.filterValues.push(obj1);
  this.filterValues.push(obj2);
 
  //pushing suspicious 
  let supiciousDesc = [] ;
  let supiciousValue = this.filterForm.controls['suspicious'].value ? this.filterForm.controls['suspicious'].value : "" ;
  if(supiciousValue != ""){
    supiciousDesc = this.suspiciousList.filter(v => v.value == supiciousValue) ;
    this.filterValues.push({"fieldName":"Suspicious","value": supiciousDesc ? supiciousDesc[0].description : "" });
  }

    this.callTransactionInquiryApi(ccyCode,'',customerName, buySellInd, status, counterType, this.dateGt, this.dateLt,isSuspicious) ;
  }

  resetFilter(){
    this.xpandStatus = false ;
    this.searchCustomerName = "";
   this.onLoadFiltersSetup() ; 
   this.callTransactionInquiryApi('', '', '', '','1', this.loginResCounterType, this.dateGt, this.dateLt,'');
  }

  public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateEndDate = event.value._d;
  
  }
  public onStartDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateStartDate = event.value._d;
    this.minEndDate = this.validateStartDate  //max end date is 8 days and exclude sat and sun
    this.maxEndDate = new Date(this.minEndDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  // onCustomerNameChange(){  //not used 
  //   const customerNameControl = this.filterForm.controls['custName'];
  //   // Get the current value of the input field
  //   const inputText = customerNameControl.value;
  //   customerNameControl.setValue(inputText.toUpperCase());

  //   if (inputText.length >= 3 && /^[a-zA-Z ]+$/.test(inputText)) {
  //     this.searchFilter();
  //   }
  //   else if(inputText.length == 0 ){
  //     this.searchFilter();
  //   }
  // }

  onLoadFiltersSetup(){

    this.filterValues = [] ;
    this.loginResCounterType ;
    this.filterForm.patchValue({
      ccyCode : "",
      custName : "",
      buySellInd : "",
      status : "1",
      counterType : this.loginResCounterType,
      suspicious : "N"
    });

     //pushing txn status 
     this.filterValues.push({"fieldName":"Status","value": "INITIATED"});

    // pushing counter Type 
    let type = this.loginResCounterType ;
    if(type == "W"){
      type = "WHOLESALE" ;
    }
    else if(type == "R"){
      type = "RETAIL" ;
    }
    this.filterValues.push({"fieldName":"Counter Type","value": type});

      this.minEndDate = new Date() //max end date is 7 days and exclude sat and sun
      this.maxEndDate = new Date(this.minEndDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  
      // Patch one month difference for both start date and end date
      const todayFormatted = new Date();
      // const date = new Date();
      // date.setDate(date.getDate() - 7); 
      
      this.filterForm.controls.startDate.setValue(todayFormatted);
      this.filterForm.controls.endDate.setValue(todayFormatted);
  
      var start_date: any = moment(this.filterForm.controls.startDate.value);
      var end_date: any = moment(this.filterForm.controls.endDate.value)
  
       // Use toLocaleDateString to format the date as "dd/mm/yyyy"
       let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
       let patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
       let patchEndDate = end_date._d.toLocaleDateString('en-GB', options);
  
       var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
       var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };
   
       this.filterValues.push(obj1);
       this.filterValues.push(obj2); //
  
       var start_date: any = moment(this.filterForm.controls.startDate.value);
       var end_date: any = moment(this.filterForm.controls.endDate.value)
       this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
       this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

       //pushing suspicious 
  let supiciousDesc = [] ;
  let supiciousValue = this.filterForm.controls['suspicious'].value ? this.filterForm.controls['suspicious'].value : "" ;
  if(supiciousValue != ""){
    supiciousDesc = this.suspiciousList.filter(v => v.value == supiciousValue) ;
    this.filterValues.push({"fieldName":"Suspicious","value": supiciousDesc ? supiciousDesc[0].description : "" });
  }
  
  }

    //STATUS color diff
 getColor(status: any) {
  return getTransactionColorMoneyChanger(status)
}
//bg color for status tags .
getBackgroundColor(status: string): string {
 return getTransactionBgcolorMoneyChanger(status);
  
}
  

}
