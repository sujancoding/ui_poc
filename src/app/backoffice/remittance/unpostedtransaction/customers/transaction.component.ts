import { Component, HostListener, Inject, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionData } from 'src/app/dashboards/model/approveddashboard';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { DatePipe } from '@angular/common';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MatDialog } from '@angular/material/dialog';
import { AcknowledgeTransactionComponent } from 'src/app/agent/modals/acknowledge-transaction/acknowledge-transaction.component';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewDepositSlipComponent } from 'src/app/backoffice/shared/modals/viewdepositslip/view-deposit-slip.component';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import {  currencyFilterArray, dbsSupportCurrency, nricRegex } from 'src/assets/dropdownvalues';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { CustomerInquiry } from 'src/app/core/model/Customer Inquiry/customer-inquiry';
import { AgentReceiptComponent } from 'src/app/agent/modals/transfer-receipt/agent-receipt.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'moment';
import { getBackgroundColor, getColor,getTooltipText} from 'src/assets/transactionstatus'
import { CancelTransactionComponent } from 'src/app/shared/modals/canceltransaction/cancel-transaction.component';
import { ViewTransactionAckDetailsComponent } from 'src/app/backoffice/shared/modals/viewtransactionack/view-transaction-ack-details.component';
import { UpdateTransactionStatusComponent } from 'src/app/backoffice/shared/modals/update-transaction-status/update-transaction-status.component';
import { TransactionSuspiciousRemarksComponent } from '../modals/transaction-suspicious-remarks/transaction-suspicious-remarks.component';



@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss', '../../../../../assets/styles/tables/table-style.scss',
    '../../../../../assets/styles/buttons/button.scss'
  ],
  
})
export class TransactionComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  transactionStatus !: string;
  isActive = false;
  isDesc!: boolean;
  resultsLength = 0;
  payeeCountry !: string;
  searchCustomer: string[] = [];
  searchCustomerName !: string;
  idNumber !: string;
  phoneNumber !: string;
  
  payeeCountryCode: TransactionData[] = [];
  p: number = 1;
  rowData: any;
  searchTransaction: TransactionData[] = [];
  customersTransaction: TransactionData[] = [];
  @ViewChildren('myCheckbox') private myCheckboxes: any;
  isChecked = false;
  isDisable = false;
  arr: string[] = [];
  arrLength !: number;
  customerType !: string;
  totalAmount = 0;
  buttonTitle: string = "Hide";
  visible: boolean = false;
  showPayeeDetails: Boolean = false;
  showAgentSettlement: boolean = false;
  disableCheckBox: Boolean = false;
  buyerCurrencyCode: any;
  countryCode !: string;
  payeeGetsAmount: any = 0;
  n!: string;
  color!: boolean;
  accepted !: Boolean;
  eventArray: string[] = [];
  showCheckBox: Boolean = true;
  disable !: Boolean
  custTypeArray: string[] = [];
  showAction: Boolean = false;
  selectedStatus: any;
  loader: Boolean = false;
  getTransactionStatus: any[] = [
    { "NO": 5, "TXNSTATUS": "Pending" },
    { "NO": 3, "TXNSTATUS": "Approved" },
    { "NO": 6, "TXNSTATUS": "Acknowledged" },
    { "NO": 7, "TXNSTATUS": "Deposited" },
    { "NO": 8, "TXNSTATUS": "Failed at Bank" },
    //{"NO":9 , "TXNSTATUS":"Bank Completed"}, unused in backend
    { "NO": 10, "TXNSTATUS": "Bank Approved" },
    { "NO": 11, "TXNSTATUS": "Bank Request Received" },
    { "NO": 12, "TXNSTATUS": "Bank Complete with Change" },
    { "NO": 20, "TXNSTATUS": "Cancelled Transaction" }
  ];
  getUnpostedStatus: any[] = [
    { "NO": 1, "TXNSTATUS": "Initiated" },
    { "NO": 2, "TXNSTATUS": "Amount Received" },
    // {"NO":4 , "TXNSTATUS":"Payment Received"} unused in backend
  ]
  selectedTransactionStatus = new FormControl('');
  adminFee: number = 0;
  transactionId: any[] = [];
  indicatorArray: any[] = [];
  consumerTransactionId: any[] = [];
  filterForm: FormGroup = Object.create(null);
  showDeleteIcon : Boolean = false;
  currencyCodeArray : any[] = currencyFilterArray ;
  selectedCountryCode !: string;
  selectedForeginCurrency = new FormControl('');
  customerInquiry: CustomerInquiry = new CustomerInquiry();
  remittanceDetails: any;
  //newly added -> 20/07/2023
  unpostedStatus: string = "";
  postedStatus: string = "";
  showUnpostedStatus: boolean = false;

  minStartDate!: Date;
  maxStartDate!: Date;
  minEndDate!: Date;
  maxEndDate!: Date;
  validateEndDate: any;
  validateStartDate: any;
  xpandStatus = false;
  filterValues: any[] = [];
  sendCurrency: string = '';
  recordsCount: any = '';
  searchFieldTyped: Boolean = false;
  finalTransactionStatusArray: any = "";
  forexBookingType : any = "" ;
  dbsSupportedCurrencies = dbsSupportCurrency ;
  showProcessedDate = false ;
  iseditbutton=false;
  itemsPerPage: number = 20;
  susRemarks : string = "";
  constructor(private transactionService: TransactionService, private store: InMemoryCache, private _snackBar: MatSnackBar, private router: Router, private fb: FormBuilder,
    @Inject(MAT_SNACK_BAR_DATA) public data: any, private route: ActivatedRoute, private headerService: TitleHeaderService, private dialog: MatDialog,
    private datePipe: DatePipe, private customerSearchService: CustomerSearchService) {



  }

  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  //once transaction is approved , child component(agent-card.comp.ts) sends data and recalls the service again !
  latestTransactionData() {
    this.loader = true;
    this.unpostedStatus = "2,1" //AMOUNT RECEIVED , INITIATED 
    this.finalTransactionStatusArray = "2,1";
   // var start_date: any = moment(this.filterForm.controls.startDate.value);
    //var end_date: any = moment(this.filterForm.controls.endDate.value)
    let dateGt = "";
    let dateLt = "";
    this.transactionService.getTransactions(this.unpostedStatus, dateGt, dateLt).subscribe((datas: any) => {
      this.loader = false;
      this.searchTransaction = datas['data'];
      this.recordsCount = this.searchTransaction.length;
      this.showAgentSettlement = false;
      this.isDisable = false;
      this.eventArray = [];
      this.custTypeArray = [];
      this.transactionId = [];
      this.indicatorArray = [];
      this.consumerTransactionId = [];
      this.arrLength = 0;
      this.arr = [];
      this.totalAmount = 0;
      this.payeeGetsAmount = 0;
      this.adminFee = 0;

    },
      //error handling done on 03-07-2023
      (error: any) => {
        this.loader = false;
        if (error.status != 401) {
          this.dialog.open(ErrorDialogAdminComponent);
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
  responsiveTableHeight() {
    return { 'height': (this.getScreenHeight - 278) + 'px', 'overflow-y': 'auto' };
  }

  ngOnInit(): void {
    var regex = nricRegex ;
    this.filterForm = this.fb.group({
      "customerName": [null, Validators.compose([Validators.pattern("^[a-zA-Z ./,@]+$")])],
      "idNbr": [null, Validators.compose([Validators.pattern(regex)])],
      "phoneNo": [null, Validators.compose([Validators.pattern("^[0-9 ]+$")])],
      "startDate": [null,Validators.compose([Validators.required])],
      "endDate": [null, Validators.compose([Validators.required])],
      "transactionId" : [null, [Validators.compose([Validators.pattern("^[0-9 ]+$")]) , Validators.minLength(12) , Validators.maxLength(12)]]
    })

    //new change on 28 Nov 2023 , based on access control dtls , need to hide and show the approve-reject button .
    let accessControlDtl = this.store.getItem('ACCESS_CONTROLS_ARRAY') ? this.store.getItem('ACCESS_CONTROLS_ARRAY') : "";
    let arrayOfObjects : any ;
    if (accessControlDtl != "") {
       arrayOfObjects = JSON.parse(accessControlDtl);
    }

      // Check if any object has accessId "BAAB" and name "APPLICATION APPROVE-REJECT BUTTON"
      const hasSpecificItem : boolean = arrayOfObjects.some((item:any)=>{
       return item.accessId == "BRUAB" && item.name == "UNPOSTED APPROVE BUTTON" ;
      }) ;

      // Check if any object has cancel transaction option object..
      const hasDeleteOptionObject : boolean = arrayOfObjects.some((item:any)=>{
        return item.accessId == "BRCTB" && item.name == "REMITTANCE CANCEL TRANSACTION BUTTON" ;
       }) ;

      let objectExist : string = "";
      if(hasSpecificItem == true){
       objectExist = "true" ;
      }
      else if(hasSpecificItem == false){
       objectExist = "false" ;
      }

      if(hasDeleteOptionObject == true){
        this.showDeleteIcon = true ;
      }
      
      else if(hasDeleteOptionObject == false){
        this.showDeleteIcon = false ;
      }
      this.store.setItem('UNPOSTED_APPROVE_BUTTON_ACCESS_CONTROL',objectExist) ;


    this.minEndDate = new Date() //max end date is 8 days and exclude sat and sun
    this.maxEndDate = new Date(this.minEndDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  

   //we check router path when user navigate from remittance menu.
    if (this.router.url == "/transaction/posted-transaction") {
      this.store.setItem("POSTED_SCREEN","posted via menu")
      this.transactionStatus = "POSTED_TRANSACTIONS"
      this.showProcessedDate = true ; //Show processed date column for fulfillment screen alone..
    }
    else if (this.router.url == "/transaction/unposted-transaction") {
      this.store.setItem("UN_POSTED_SCREEN","unposted via menu")
      this.transactionStatus = "UNPOSTED_TRANSACTIONS"
      this.showProcessedDate = false ; //Hide processed date column for Unposted screen..
    }
    //we check query params when user navigate from remittance widget
    this.route.queryParams.subscribe((params: any) => {
      console.log(params)
      console.log(params.type);
      if (params.type == "unposted") {
        this.store.setItem("UN_POSTED_SCREEN","unposted via widget")
        this.headerService.setTitle('Unposted Transactions');
        this.showProcessedDate = false ; //Hide processed date column for Unposted screen..
        this.disable = false;
        this.showAction = false;
        this.showUnpostedStatus = true;
        this.visible = true;  //opening view respective transactionId details
        this.getUnpostedTransaction();
      }
      if (params.type == "posted") {
        this.store.setItem("POSTED_SCREEN","posted via widget")
        this.headerService.setTitle('Posted Transactions');
        this.showProcessedDate = true ; //Show processed date column for fulfillment screen alone..
        this.showAction = true;
        this.showUnpostedStatus = false;
        this.disable = true;
        this.visible = true;  //opening view respective transactionId details
        this.getApprovedPostedTranscation();
      }
    })

    //router path when user navigate from remittance menu.
    if (this.transactionStatus == "UNPOSTED_TRANSACTIONS") {
      this.headerService.setTitle('Unposted Transactions');
      this.showAction = false;
      this.showUnpostedStatus = true;
      this.disable = false;
      this.visible = true;  //opening view respective transactionId details
      this.getUnpostedTransaction();

    }
    if (this.transactionStatus == "POSTED_TRANSACTIONS") {
      this.headerService.setTitle('Posted Transactions');
      this.showAction = true;
      this.showUnpostedStatus = false;
      this.disable = true;
      this.visible = true;  //opening view respective transactionId details
      this.getPostedTranscation();

    }
    //getScreenWidth and getScreenHeight will get the windows inner height and width.
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;

    // Split the finalArray string into an array of numbers
    const finalArrayNumbersUnPosted: number[] = this.unpostedStatus.split(',').map(Number);

    if (this.unpostedStatus != "") {
      // Use the finalArrayNumbersUnPosted to find the corresponding TXNSTATUS values
      const status: string[] = finalArrayNumbersUnPosted.map((num) => {
        const entry = this.getUnpostedStatus.find((item) => item.NO === num);
        return entry ? entry.TXNSTATUS : '';
      });
      status.join(', '); // Output: "Initiated, Amount Received"
      var unpostedTxnStatusObj3 = { "fieldName": "Transaction Status", "value": status };
      this.filterValues.push(unpostedTxnStatusObj3);

      this.filterForm.controls['startDate'].clearValidators() ;
      this.filterForm.controls['startDate'].updateValueAndValidity() ;
      this.filterForm.controls['endDate'].clearValidators() ;
      this.filterForm.controls['endDate'].updateValueAndValidity() ;
    }

    else if (this.postedStatus != "") {
      //on load , will fetch all fulfillment status's so will show 'All'
      this.filterValues.push({ "fieldName": "Transaction Status", "value": "All" });

        // Patch the current date on page load
    const todayFormatted = new Date();
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
    }


  }

  //testing -> dheepan changes to calculate payee gets for corporate and agent.
  calculatePayeeGets(amount: string, rate: string): string {
    const amountValues : any[] = amount.split(',').map(value => parseFloat(value)); // spilt amount and change string to numbers
    const rateValues : any[] = rate.split(',').map(value => parseFloat(value));    // spilt rate and change string to numbers

    const payeeValues : any[] = amountValues.map((amt, index) => amt / rateValues[index]); // calucaltae payee gets based on corresponding amount & rate

    const payeeGets = payeeValues.reduce((total, value) => total + value); // total payeegets amount

    return payeeGets;
  }

  //retrieve - transaction listings of unposted
  getUnpostedTransaction() {
    this.iseditbutton=true;
    this.loader = true;
    this.unpostedStatus = "2,1" //AMT_RECIEVED , INITIATED 
    this.finalTransactionStatusArray = "2,1";
   // var start_date: any = moment(this.filterForm.controls.startDate.value);
   // var end_date: any = moment(this.filterForm.controls.endDate.value)
    let dateGt = "";
    let dateLt = "";
    setTimeout(() => {
      this.transactionService.getTransactions(this.unpostedStatus, dateGt, dateLt).subscribe((datas: any) => {
        this.loader = false;
        this.searchTransaction = datas['data'];
        this.recordsCount = this.searchTransaction.length;
        let transactionId: any;
        if (datas['data'].length != 0) {
          transactionId = this.searchTransaction[0].TRANSACTIONID;
        }
        this.rowData = this.searchTransaction.filter(v => v.TRANSACTIONID == transactionId);
        this.n = transactionId;
        this.color = true;  //row color
      },
        //error handling done on 03-07-2023
        (error: any) => {
          this.loader = false;
          if (error.status != 401) {
            this.dialog.open(ErrorDialogAdminComponent);
          }
        }
      );
    }, 700);
  }
  //retrieve - transaction listings of posted
  getPostedTranscation() {
    this.loader = true;
    this.postedStatus = '3,5,6,7,8,10,11,12,20';
    this.finalTransactionStatusArray = '3,5,6,7,8,10,11,12,20';
    const todayFormatted = new Date();
    this.filterForm.controls.startDate.setValue(todayFormatted);
    this.filterForm.controls.endDate.setValue(todayFormatted);
    var start_date: any = moment(this.filterForm.controls.startDate.value);
    var end_date: any = moment(this.filterForm.controls.endDate.value)
    let dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
    let dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
    setTimeout(() => {
      this.transactionService.getTransactions(this.postedStatus, dateGt, dateLt).subscribe((datas: any) => {
        this.loader = false;
        this.searchTransaction = datas['data'];
        this.recordsCount = this.searchTransaction.length;
        let transactionId: any;
        if (datas['data'].length != 0) {
          transactionId = this.searchTransaction[0].TRANSACTIONID;
        }
        this.rowData = this.searchTransaction.filter(v => v.TRANSACTIONID == transactionId);
        this.n = transactionId;
        this.color = true;  //row color
      },
        //error handling done on 03-07-2023
        (error: any) => {
          this.loader = false;
          if (error.status != 401) {
            this.dialog.open(ErrorDialogAdminComponent);
          }
        }
      )
    }, 700);

  }
  getApprovedPostedTranscation() {
    this.postedStatus = '3,5,6,7,8,10,11,12,20';  //when user comes from widget . 
    this.finalTransactionStatusArray = '3,5,6,7,8,10,11,12,20';
    this.loader = true;
    const todayFormatted = new Date();
    this.filterForm.controls.startDate.setValue(todayFormatted);
    this.filterForm.controls.endDate.setValue(todayFormatted);
    var start_date: any = moment(this.filterForm.controls.startDate.value);
    var end_date: any = moment(this.filterForm.controls.endDate.value)
    let dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
    let dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

    setTimeout(() => {
      this.transactionService.getTransactions(this.postedStatus, dateGt, dateLt).subscribe((datas: any) => {
        this.loader = false;
        this.searchTransaction = datas['data'];
        this.recordsCount = this.searchTransaction.length;
        let transactionId = this.searchTransaction[0].TRANSACTIONID;
        this.rowData = this.searchTransaction.filter(v => v.TRANSACTIONID == transactionId);
        this.n = transactionId;
        this.color = true;  //row color
      },
        //error handling done on 03-07-2023
        (error: any) => {
          this.loader = false;
          if (error.status != 401) {
            this.dialog.open(ErrorDialogAdminComponent);
          }
        }
      )
    }, 700);
  }
  //STATUS color diff
  getColor(value: any) {
    return getColor(value);
    }
  
  //bg color for status tags .
  getBackgroundColor(status: string): string {
    return getBackgroundColor(status)
    }


  //this function triggers when we select checkBoxes
  enableCheckBox(e: any, transactionId: string, amount: any, payeeCountry: any, countryCode: any, i: any,orgExchRate : any,  customerType: any, orgCommission: string,amountConsumed:string , 
    contractRate:string, amountSentF : any) {
      let foreignCurrencyAmount : any ;
    //if checkbox status is true(means checkbox is checked)
    if(customerType == "A"||customerType == "C" ){ 
     //let payeeGets = this.calculatePayeeGets(amountConsumed,contractRate);
     let payeeGets : any = amountSentF ;
     if(amountSentF == 0 || amountSentF == null || amountSentF == 0.00){
      payeeGets = this.calculatePayeeGets(amountConsumed,contractRate);
     }
     foreignCurrencyAmount = parseFloat(payeeGets) ;  //foreignCurrencyAmount = amountSentF for agent and corporate;
    }
    else if(customerType == "I"){
      let payeeGets : any = amountSentF ;
      if(amountSentF == 0 || amountSentF == null || amountSentF == 0.00){
        foreignCurrencyAmount = amount * orgExchRate ;
       payeeGets =  parseFloat(foreignCurrencyAmount)
      }
      foreignCurrencyAmount = parseFloat(payeeGets) ;  //foreignCurrencyAmount = amountSentF for agent and corporate;
    }
    this.payeeGetsAmount = parseFloat(this.payeeGetsAmount); // => 0
    const x = this.searchTransaction.findIndex((user: any) => user.CURRENCYCODE === payeeCountry);
    if (e.checked == true) {
      this.color = false;
      this.showAgentSettlement = true; //will show agent name and deal list card
      this.visible = false;   //closing view respective transactionId details
      this.isDisable = true;  //cannot click vertical dotted view button
      this.customerType = customerType; //for determining whether he is individual,corporate / Agent (for agent selection we should list DBS Bank in agent name selection)
      this.eventArray.push(payeeCountry);

      this.custTypeArray.push(customerType);
      console.log("Added CustomerType : ", this.custTypeArray)

      //finding the index value of firstly selected checkbox
      const x = this.searchTransaction.findIndex((user: any) => user.CURRENCYCODE === payeeCountry);
      this.arr.push(transactionId);
      this.arrLength = this.arr.length;
      //calulated total no. of amount required
      this.totalAmount = this.totalAmount + amount;
      this.adminFee = parseFloat(orgCommission) + this.adminFee;
      this.payeeGetsAmount = (this.payeeGetsAmount + foreignCurrencyAmount).toFixed(2);
      this.buyerCurrencyCode = countryCode;

    }

    //if checkbox status is false(means checkbox is unchecked)
    if (e.checked == false) {
      this.color = false;
      this.eventArray.splice(payeeCountry, 1);
      console.log("unselected payee country = " + this.eventArray);

      //added by Shafi @ 01/11/2022
      this.custTypeArray.splice(customerType, 1);
      console.log("unselected Customer Type = " + this.custTypeArray);

      //this.sellerCurrencyCode = undefined;
      const index = this.arr.findIndex(list => list == transactionId);//Find the index of stored transactionid
      this.arr.splice(index, 1); // Then remove the transactionId which is been unselected
      this.arrLength = this.arr.length;
      //calulated total no. of amount required
      this.totalAmount = this.totalAmount - amount;
      this.payeeGetsAmount = (this.payeeGetsAmount - foreignCurrencyAmount).toFixed(2);
      this.adminFee = this.adminFee - parseFloat(orgCommission);
      // this.showAgentSettlement = false;
      this.visible = false;
      this.isDisable = false;
      if (this.consumerTransactionId[0] == this.id) {
        this.indicatorArray = [];
        this.consumerTransactionId = [];
        return true;
      }

    }
  }

  id: any;
  unselect(country: any, customerType: string, id: string, countryCode: string,forexBookingType :any) {
    console.log("unselect function" + country);
    this.id == id;
    this.forexBookingType = forexBookingType ? forexBookingType : "" ; // D or C or Null .
    //checking condition => if selection is == previous selection then allows check else it will reemains uncheck!
    //country is foreign currency
    if (this.eventArray[0] && this.eventArray[0] != country) {
      this._snackBar.open("Please Select Same Currency !", "Ok", {
        panelClass: "red-notification-snackbar",
        duration: 3000
      });
      return false
    }

    else if (customerType == 'A' || (customerType == "C" && forexBookingType != "D")) { //Agent or Corporate initiated TT.
      if (this.transactionId[0] == id) { //checking : user selects same transaction id again .
        this.transactionId = [];
        return true;
      }
      else {
        if (this.custTypeArray[0] && this.custTypeArray[0] != customerType) { // If user selects different customer Type's
          this._snackBar.open("Please Select Same Customer Type !", "Ok", {
            panelClass: "red-notification-snackbar",
            duration: 3000
          });
          return false
        }
        if (this.custTypeArray[0] && this.custTypeArray[0] == customerType) {
          this._snackBar.open("Multiple selection is not allowed for this transaction !", "Ok", {
            panelClass: "red-notification-snackbar",
            duration: 3000
          });
          return false
        }
        else {
          this.transactionId.push(id);
          return true;
        }
      }
    }
    else if (customerType == 'I' || (customerType == "C" && forexBookingType == "D") ) {
      if (this.custTypeArray[0] && (this.custTypeArray[0] == 'A')) {
        this._snackBar.open("Please Select Same Customer Type !", "Ok", {
          panelClass: "red-notification-snackbar",
          duration: 3000
        });
        console.log("Customer type is not Matched!")
        return false
      }
      //new changes
      // if(this.indicatorArray.length >= 2){ //when APT needs to select 2 transaction ids 
      //when user selects more than one transactionId
      let isDbsSupportCurrency = this.dbsSupportedCurrencies.find((v:any) => v.CURRENCYCODE == countryCode);
      isDbsSupportCurrency = isDbsSupportCurrency ? isDbsSupportCurrency : "" ;
      //If currency is found , it returns an object ..
      if (isDbsSupportCurrency) {
        if (this.consumerTransactionId[0] == id) {
          this.indicatorArray = [];
          this.consumerTransactionId = [];
          return true;
        }
        if (this.indicatorArray.length >= 1) {
          this._snackBar.open("Multiple selection is not allowed for this transaction !", "Ok", {
            panelClass: "red-notification-snackbar",
            duration: 3000
          });
          return false
        }
        // else if(this.indicatorArray.length <= 1 && this.indicatorArray.length >= 0){ //when APT needs to select 2 transaction ids 
        //when user selects first transactionId for first time when payee country is USA
        else if (this.indicatorArray.length == 0) {
          this.indicatorArray.push(id);
          this.consumerTransactionId.push(id);
        }

      }
    }
    else if (this.eventArray[0] == undefined) {
      return true; // they can select checkbox
    }
    else return true

  }
  //}
  //view respective transactionIds -> transaction details (view button onClick)  
  openTransactionDetails(transactionId: any) {
    this.n = transactionId;
    this.color = true;
    this.visible = true;
    this.showAgentSettlement = false;
    this.rowData = this.searchTransaction.filter(v => v.TRANSACTIONID == transactionId);

  }
  openAgent() {
    this.showAgentSettlement = !this.showAgentSettlement;
    this.visible = this.visible ? false : true;
    this.buttonTitle = this.visible ? "Show" : "Hide";
  }

  //row color
  selectrow(i: string) {
    this.n = i;
    this.color = !this.color;

  }


  openDialog(transactionId: string, senderName: string, payeeName: string, accountNo: string, payeeBank: string, swiftCode: string, payeeCountry: string, txnStatus: string) {
    this.dialog.open(AcknowledgeTransactionComponent, {
      data: {
        postedTrans: true, transactionId: transactionId, accountTitle: senderName, payeeName: payeeName, accountNumber: accountNo, payeeBank: payeeBank,
        swiftCode: swiftCode, payeeCountry: payeeCountry, transactionStatus: txnStatus
      },
      panelClass: 'custom-modalbox',
      width: '400px',
      height: '500px',
    }).afterClosed().subscribe(res => {
      console.log(res);
      if (res.status == "ACKNOWLEDGED" || res.status == "DEPOSITED") {
        this.loader = true;
        let status = '3,6,7';
        setTimeout(() => {
          this.transactionService.getTransactions(status, this.filterForm.controls.startDate, this.filterForm.controls.endDate).subscribe((datas: any) => {
            this.loader = false;
            this.searchTransaction = datas['data'];
            let transactionId = this.searchTransaction[0].TRANSACTIONID;
            this.rowData = this.searchTransaction.filter(v => v.TRANSACTIONID == transactionId);
            this.n = transactionId;
            this.color = true;  //row color
          })
        }, 700);
      }
    })

  }
  selectCurrencyCode(flag: string) {
    this.selectedCountryCode = flag;
  }

  patchStartDate: any = "";
  patchEndDate: any = "";
  dateGt: any = "";
  dateLt: any = "";

  applyFilter(name: string, nricNumber: string, phoneNo: string) {
    this.xpandStatus = false; //expansion panel will close
    this.isDisable = false;
    this.eventArray = [];
    this.custTypeArray = [];
    this.transactionId = [];
    this.indicatorArray = [];
    this.consumerTransactionId = [];
    this.arrLength = 0;
    this.arr = [];
    this.totalAmount = 0;
    this.payeeGetsAmount = 0;
    this.adminFee = 0;
    this.loader = true;

    name = name ? name : "";
    nricNumber = nricNumber ? nricNumber : "";
    phoneNo = phoneNo ? phoneNo : "";
    this.finalTransactionStatusArray = this.finalTransactionStatusArray ? this.finalTransactionStatusArray : "";

    let statusArray : any= this.selectedTransactionStatus.value;
    let foreginCurrencyFlag = this.selectedForeginCurrency.value;
    var sendCcy = '';
    if (foreginCurrencyFlag != "") {
      const index = this.currencyCodeArray.findIndex((v: any) => v.FLAG == foreginCurrencyFlag);
      sendCcy = this.currencyCodeArray[index].CURRENCYCODE;
      this.sendCurrency = sendCcy; //new element added on 26/07/2023 .
    }
    else {
      this.sendCurrency = "";
    }
    if (statusArray != "") {
      this.finalTransactionStatusArray = statusArray.join(",");
    }
    if (statusArray == "") {
      if (this.unpostedStatus == "" || this.unpostedStatus == undefined) {
        this.finalTransactionStatusArray = this.postedStatus;  //3,5,6,7,8,10,11,12,20
      }
      if (this.postedStatus == "" || this.postedStatus == undefined) {
        this.finalTransactionStatusArray = this.unpostedStatus;  //1,2
      }
    }


    var start_date: any = moment(this.filterForm.controls.startDate.value);
    var end_date: any = moment(this.filterForm.controls.endDate.value);
    this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
    this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

  
       // Use toLocaleDateString to format the date as "dd/mm/yyyy"
       let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
       this.patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
       this.patchEndDate = end_date._d.toLocaleDateString('en-GB', options);

    if(this.patchStartDate == 'NaN-NaN-NaN' || this.patchStartDate == "Invalid Date"){
      this.patchStartDate = "" ;
    }
    if(this.patchEndDate == 'NaN-NaN-NaN' || this.patchEndDate == "Invalid Date" ){
      this.patchEndDate = "" ;
    }

    // Clear the filters array 
    this.filterValues = [];

    //newly added on 26/07/2023 --> filter values to patch .
    //pushing foreign currency        
    if (this.sendCurrency != "") {
      const newFilterObject = { "fieldName": "Foreign Currency", "value": this.sendCurrency };
      this.filterValues.push(newFilterObject);
    }
    //pushing transaction status , that can be unposted or posted        
    if (this.unpostedStatus != "") {
      const finalArrayNumbersUnPosted: number[] = this.finalTransactionStatusArray.split(',').map(Number);
      // Use the finalArrayNumbersUnPosted to find the corresponding TXNSTATUS values
      const status: string[] = finalArrayNumbersUnPosted.map((num) => {
        const entry = this.getUnpostedStatus.find((item) => item.NO === num);
        return entry ? entry.TXNSTATUS : '';
      });
      status.join(', '); // Output: "Initiated, Amount Received"
      var unpostedTxnStatusObj3 = { "fieldName": "Transaction Status", "value": status };
      this.filterValues.push(unpostedTxnStatusObj3);
    }
    else if (this.postedStatus != "") {
      this.finalTransactionStatusArray;
      let array: string[] = [];
      const trimmedString = this.finalTransactionStatusArray.trim();
      array = trimmedString.split(",");

      const allStatusFilter = this.getTransactionStatus.map(status => status.NO); //if user selected all txn status's , will show 'All'
      if (allStatusFilter.length == this.selectedTransactionStatus?.value?.length|| allStatusFilter.length == array.length) {
        this.filterValues.push({ "fieldName": "Transaction Status", "value": "All" });
      }
      else {
        const finalArrayNumbersPosted: number[] = this.finalTransactionStatusArray.split(',').map(Number);
        // Use the finalArrayNumbersUnPosted to find the corresponding TXNSTATUS values
        const status: string[] = finalArrayNumbersPosted.map((num) => {
          const entry = this.getTransactionStatus.find((item) => item.NO === num);
          return entry ? entry.TXNSTATUS : '';
        });
        status.join(', '); // Output: "Initiated, Amount Received"
        var postedTxnStatusObj4 = { "fieldName": "Transaction Status", "value": status }
        this.filterValues.push(postedTxnStatusObj4);
      }
    }
    //pushing dates
    if(this.patchEndDate != "" || this.patchStartDate != "" ){
      var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": this.patchStartDate ? this.patchStartDate : "No Start Date given" };
      var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": this.patchEndDate ? this.patchEndDate : "No End Date given" };
      this.filterValues.push(obj1);
      this.filterValues.push(obj2);
    }

    //pushing customer name        
    if (name != "") {
      const newFilterObject = { "fieldName": "Customer Name", "value": name };
      this.filterValues.push(newFilterObject);
    }

    //pushing Phone Number        
    if (phoneNo != "") {
      const newFilterObject = { "fieldName": "Phone Number", "value": phoneNo };
      this.filterValues.push(newFilterObject);
    }
    //pushing NRIC        
    if (nricNumber != "") {
      const newFilterObject = { "fieldName": "NRIC", "value": nricNumber };
      this.filterValues.push(newFilterObject);
    }
    //pushing transaction id 
    let txnId = this.filterForm.controls['transactionId'].value ? this.filterForm.controls['transactionId'].value : "" ;
    if(txnId != ""){
      const newFilterObject = { "fieldName": "Transaction Id", "value": txnId };
      this.filterValues.push(newFilterObject);
    }

    setTimeout(() => {
      this.transactionService.getfilteredTransactions(name, nricNumber, phoneNo, this.finalTransactionStatusArray, sendCcy, this.dateGt, this.dateLt,txnId).subscribe((datas: any) => {
        this.loader = false;
        this.searchTransaction = datas['data'];
        this.recordsCount = this.searchTransaction.length;
         // Reset page to 1
         this.p = 1;
        if (this.searchTransaction.length == 0) {
          this.rowData = this.searchCustomer
        }
        else {
          let transactionId = this.searchTransaction[0].TRANSACTIONID;
          this.rowData = this.searchTransaction.filter(v => v.TRANSACTIONID == transactionId);
          this.n = transactionId;
          this.color = true;  //row color
        }

      },
        //error handling done on 03-07-2023
        (error: any) => {
          this.loader = false;
          if (error.status != 401) {
            this.dialog.open(ErrorDialogAdminComponent);
          }
        }
      )
    }, 700);
  }

  resetFilter() {
    this.searchCustomerName = "";
    this.idNumber = "";
    this.phoneNumber = "";
    this.filterForm.controls['transactionId'].setValue("") ;
    let txnId = this.filterForm.controls['transactionId'].value ;
    this.isDisable = false;
    this.eventArray = [];
    this.custTypeArray = [];
    this.transactionId = [];
    this.indicatorArray = [];
    this.consumerTransactionId = [];
    this.arrLength = 0;
    this.arr = [];
    this.totalAmount = 0;
    this.payeeGetsAmount = 0;
    this.adminFee = 0;
    this.loader = true;
    let finalArray: any;
    finalArray = finalArray ? finalArray : "";
    let dateGt: any;
    let dateLt: any;
    let patchStartDate : any;
    let patchEndDate : any;

    if (this.unpostedStatus != "") {
      finalArray = this.unpostedStatus;

      this.filterForm.controls['startDate'].clearValidators() ;
      this.filterForm.controls['startDate'].updateValueAndValidity() ;
      this.filterForm.controls['endDate'].clearValidators() ;
      this.filterForm.controls['endDate'].updateValueAndValidity() ;

      dateGt = "";
      dateLt = "" ;

      this.filterForm.controls['startDate'].setValue("") ;
      this.filterForm.controls['endDate'].setValue("") ;
      
    }
    else if (this.postedStatus != "") {
      finalArray = this.postedStatus;

      const todayFormatted = new Date();
      this.filterForm.controls.startDate.setValue(todayFormatted);
      this.filterForm.controls.endDate.setValue(todayFormatted);
      var start_date: any = moment(this.filterForm.controls.startDate.value);
      var end_date: any = moment(this.filterForm.controls.endDate.value);
      dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
      dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
  
       // Use toLocaleDateString to format the date as "dd/mm/yyyy"
       let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
        patchEndDate = end_date._d.toLocaleDateString('en-GB', options);
    }

    this.selectedTransactionStatus.setValue('');
    this.selectedForeginCurrency.setValue('');
    var sendCcy = '';
   

    this.xpandStatus = false; //expansion panel will close

    //issues found when testing and fixed this line .
    this.minEndDate = new Date() //max end date is 8 days and exclude sat and sun
    this.maxEndDate = new Date(this.minEndDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    this.selectedCountryCode = "" ;

    setTimeout(() => {
      this.transactionService.getfilteredTransactions(this.searchCustomerName, this.idNumber, this.phoneNumber, finalArray, sendCcy, dateGt, dateLt,txnId).subscribe((datas: any) => {
        this.loader = false;
        this.searchTransaction = datas['data'];
         // Reset page to 1
         this.p = 1;
        this.recordsCount = this.searchTransaction.length;

        // Clear the filters array 
        this.filterValues = [];

        //newly added on 26/07/2023 --> filter values to patch .

        //pushing transaction status , that can be unposted or posted        
        if (this.unpostedStatus != "") {
          const finalArrayNumbersUnPosted: number[] = this.unpostedStatus.split(',').map(Number);
          // Use the finalArrayNumbersUnPosted to find the corresponding TXNSTATUS values
          const status: string[] = finalArrayNumbersUnPosted.map((num) => {
            const entry = this.getUnpostedStatus.find((item) => item.NO === num);
            return entry ? entry.TXNSTATUS : '';
          });
          status.join(', '); // Output: "Initiated, Amount Received"
          var unpostedTxnStatusObj3 = { "fieldName": "Transaction Status", "value": status };
          this.filterValues.push(unpostedTxnStatusObj3);
        }
        else if (this.postedStatus != "") {
          var postedTxnStatusObj4 = { "fieldName": "Transaction Status", "value": "All" }
          this.filterValues.push(postedTxnStatusObj4);
            //pushing dates
        var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
        var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };
        this.filterValues.push(obj1);
        this.filterValues.push(obj2);
        }
      


        if (this.searchTransaction.length == 0) {
          this.rowData = this.searchCustomer
        }
        else {
          let transactionId = this.searchTransaction[0].TRANSACTIONID;
          this.rowData = this.searchTransaction.filter(v => v.TRANSACTIONID == transactionId);
          this.n = transactionId;
          this.color = true;  //row color
        }

      },
        //error handling done on 03-07-2023
        (error: any) => {
          this.loader = false;
          if (error.status != 401) {
            this.dialog.open(ErrorDialogAdminComponent);
          }
        }
      )
    }, 700);
  }
  viewDeposit(transactionId: string , documents : any) {
    this.dialog.open(ViewDepositSlipComponent, {
      "height": "850px",
      "width": "960px",
      disableClose: true,
      data: {transactionId : transactionId , documents  : documents} 
    }).afterClosed().subscribe((response:any)=>{
      if(response == true){
        this.applyFilter(this.searchCustomerName , this.idNumber , this.phoneNumber);
      }
    })
  }

  //tool tip text value based on txnstatus ..
  getTooltipText(status: string): string {
   return getTooltipText(status)
  }
  //     INITIATED = "1";
  // AMOUNT RECEIVED = "2";
  // APPROVED = "3";
  // PAYMENT RECEIVED = "4";  --> unused
  // PENDING = "5";
  // ACKNOWLEDGED = "6";
  // DEPOSITED = "7";
  // FAILED AT BANK = "8";
  // BANK COMPLETED = "9";  --> unused
  // BANK APPROVED = "10";
  // BANK REQUEST RECEIVED = "11";
  // BANK COMPLETE WITH CHANGE = "12";
  // CANCELLED = "20"

  openRecieptDialog(transactionId: string, senderName: string, payeeName: string, accountNo: string, payeeBank: string, swiftCode: string, payeeCountry: string, txnStatus: string, amountSent: string
    , orgExchangeRate: string, sendCcy: string, orgCommision: string, branchAddress: string, customerIdNbr: string, beneficiaryAddress: string, beneficiaryState: string, beneficiaryCountry: string,
    customerPhnNumber: string, updateDate: string, customerDob: string, customerNationality: string, remarks: string,
    customerId: string, customerType: string,originatedRemitter : string,amount:string,rate:string, amountSentF : any,contractId:string, purposeOfRemittance:any, forexBookingType:any, sharingType:string, routingCode : string, relationship : string,
    agentName: string, dealId: string, dealRate: string, amountRecieved: string) {
    const date = updateDate;

    const formattedDate = this.datePipe.transform(date, 'd MMMM yyyy, h:mm a');
    console.log(formattedDate);
    if(customerType == "A" || customerType == "C"){
     var payeeGets : any = amountSentF ;
     if(amountSentF == 0 || amountSentF == null || amountSentF == 0.00){
      payeeGets = this.calculatePayeeGets(amount,rate);
     }
    }
    else{  //customerType == I
       var payeeGets : any  = amountSentF;
       if(amountSentF == 0 || amountSentF == null || amountSentF == 0.00){
        payeeGets = parseFloat(amountSent) * parseFloat(orgExchangeRate) ;
       }
    }
   
    if (customerType == "I" || customerType == "C") {
      this.customerSearchService.getCustomerInquiry(customerId).subscribe(data => {
        this.customerInquiry = data;
        this.remittanceDetails = {
          "transactionId": transactionId,
          "customerName": senderName,
          "beneficiaryName": payeeName,
          "relationship":relationship ? relationship : "",
          "accountNo": accountNo,
          "bankName": payeeBank,
          "swiftCode": swiftCode,
          "payeeCountry": payeeCountry,
          "transactionStatus": txnStatus,
         "baseAmount": agentName ? amountRecieved : amountSent,
          "exchangeRate": orgExchangeRate,
          "foreignCurrency": sendCcy,
          "charges": orgCommision,
          "branchName": branchAddress,
          "nricId": customerIdNbr,
          "beneficiaryAddress": beneficiaryAddress,
          "beneficiaryState": beneficiaryState,
          "beneficiaryCountry": beneficiaryCountry,
          "customerPhoneNumber": customerPhnNumber,
          "updateDate": formattedDate,
          "customerDob": customerDob,
          "customerNationality": customerNationality,
          "remarks": remarks,
          "customerId": customerId,
          "customerInq": this.customerInquiry,
          "payeeGets" : payeeGets,
          "customerType": customerType,
          "initiatedBy" : "ORG",
          "contractRate" : rate,
          "contractId" : contractId,
          "amountConsumed" : amount,
          "forexBookingType" : forexBookingType,
          "sharingType" : sharingType, 
          "routingCode" : routingCode ? routingCode : "",
          "agentName" : agentName ? agentName : null,
          "dealRate" : dealRate,
          "dealId" : dealId,
  
        }
        this.dialog.open(AgentReceiptComponent, {
          height: '850px',
          panelClass: 'custom-modalbox',
          data: this.remittanceDetails,
          autoFocus: false, //prevent scroll to centre 
        })
      },
        //error handling completed in 30-06-2023
        (error: any) => {
          if (error.status != 401) {
            this.dialog.open(ErrorDialogAdminComponent);
          }
        }
      );
    }
    else if (customerType == "A") {
      // this.customerInquiry.customerId = "";
      // this.customerInquiry.demographics.dateOfBirth = "";
      // this.customerInquiry.demographics.nationality = "";
      this.remittanceDetails = {
        "transactionId": transactionId,
        "customerName": senderName,
        "beneficiaryName": payeeName,
        "relationship":relationship ? relationship : "",
        "accountNo": accountNo,
        "bankName": payeeBank,
        "swiftCode": swiftCode,
        "payeeCountry": payeeCountry,
        "transactionStatus": txnStatus,
        "baseAmount": agentName ? amountRecieved : amountSent,
        "exchangeRate": orgExchangeRate,
        "foreignCurrency": sendCcy,
        "charges": orgCommision,
        "branchName": branchAddress,
        "nricId": customerIdNbr,
        "beneficiaryAddress": beneficiaryAddress,
        "beneficiaryState": beneficiaryState,
        "beneficiaryCountry": beneficiaryCountry,
        "customerPhoneNumber": customerPhnNumber,
        "updateDate": formattedDate,
        "customerDob": customerDob,
        "customerNationality": customerNationality,
        "remarks": remarks,
        "customerId": customerId,
        "customerInq": this.customerInquiry,
        "originatedRemitter" : originatedRemitter,
        "payeeGets" : payeeGets,
        "customerType": customerType,
        "contractRate" : rate,
        "contractId" : contractId,
        "amountConsumed" : amount,
        "purposeOfRemittance" : purposeOfRemittance ? purposeOfRemittance : "",
        "sharingType" : sharingType,
        "routingCode" : routingCode ? routingCode : "",
        "agentName" : agentName ? agentName : null,
        "initiatedBy" : "ORG",
      }
      this.dialog.open(AgentReceiptComponent, {
        height: '850px',
        panelClass: 'custom-modalbox',
        data: this.remittanceDetails,
        autoFocus: false, //prevent scroll to centre 
      })
    }

  }



  onCustomerNameChange() {
    const customerNameControl = this.filterForm.controls['customerName'];
    // Get the current value of the input field
    const inputText = customerNameControl.value;
    customerNameControl.setValue(inputText.toUpperCase());

    //dynamic date values .
    var start_date: any = moment(this.filterForm.controls.startDate.value);
    var end_date: any = moment(this.filterForm.controls.endDate.value);
    this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
    this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

    
     // Use toLocaleDateString to format the date as "dd/mm/yyyy"
     let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
     this.patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
     this.patchEndDate =   end_date._d.toLocaleDateString('en-GB', options);

    if(this.patchStartDate == 'NaN-NaN-NaN'){
      this.patchStartDate = "" ;
    }
    if(this.patchEndDate == 'NaN-NaN-NaN'){
      this.patchEndDate = "" ;
    }

    if (this.searchFieldTyped == true && inputText.length == 0) {
      // Triggered and service is called
      setTimeout(() => {
        this.searchCustomerName = this.searchCustomerName ? this.searchCustomerName : "";
        this.idNumber = this.idNumber ? this.idNumber : "";
        this.phoneNumber = this.phoneNumber ? this.phoneNumber : "";

        this.filterValues = [];
        //start date and end date pushed .
        var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": this.patchStartDate };
        var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": this.patchEndDate };
        this.filterValues.push(obj1);
        this.filterValues.push(obj2); //

        //pushing transaction status , that can be unposted or posted        
        if (this.unpostedStatus != "") {
          this.finalTransactionStatusArray;
          const finalArrayNumbersUnPosted: number[] = this.finalTransactionStatusArray.split(',').map(Number);
          // Use the finalArrayNumbersUnPosted to find the corresponding TXNSTATUS values
          const status: string[] = finalArrayNumbersUnPosted.map((num) => {
            const entry = this.getUnpostedStatus.find((item) => item.NO === num);
            return entry ? entry.TXNSTATUS : '';
          });
          status.join(', '); // Output: "Initiated, Amount Received"
          var unpostedTxnStatusObj3 = { "fieldName": "Transaction Status", "value": status };
          this.filterValues.push(unpostedTxnStatusObj3);
        }
        else if (this.postedStatus != "") {
          this.finalTransactionStatusArray; //this.finalTransactionStatusArray will be equal to = "3,5,6,7,8,10,11,12,20"
          let array: string[] = [];
          const trimmedString = this.finalTransactionStatusArray.trim();
          array = trimmedString.split(",");

          const allStatusFilter = this.getTransactionStatus.map(status => status.NO); //if user selected all txn status's , will show 'All'
          if (allStatusFilter.length == this.selectedTransactionStatus?.value?.length || allStatusFilter.length == array.length) {
            this.filterValues.push({ "fieldName": "Transaction Status", "value": "All" });
          }
          else {
            const finalArrayNumbersPosted: number[] = this.finalTransactionStatusArray.split(',').map(Number);
            // Use the finalArrayNumbersUnPosted to find the corresponding TXNSTATUS values
            const status: string[] = finalArrayNumbersPosted.map((num) => {
              const entry = this.getTransactionStatus.find((item) => item.NO === num);
              return entry ? entry.TXNSTATUS : '';
            });
            status.join(', '); // Output: "Initiated, Amount Received"
            var postedTxnStatusObj4 = { "fieldName": "Transaction Status", "value": status }
            this.filterValues.push(postedTxnStatusObj4);
          }

        }

        //pushing foreign currency        
        if (this.sendCurrency != "") {
          const newFilterObject = { "fieldName": "Foreign Currency", "value": this.sendCurrency };
          this.filterValues.push(newFilterObject);
        }
        //pushing customer name        
        if (this.searchCustomerName != "") {
          const newFilterObject = { "fieldName": "Customer Name", "value": this.searchCustomerName };
          this.filterValues.push(newFilterObject);
        }

        //pushing Phone Number        
        if (this.phoneNumber != "") {
          const newFilterObject = { "fieldName": "Phone Number", "value": this.phoneNumber };
          this.filterValues.push(newFilterObject);
        }
        //pushing NRIC        
        if (this.idNumber != "") {
          const newFilterObject = { "fieldName": "NRIC", "value": this.idNumber };
          this.filterValues.push(newFilterObject);
        }

        //pushing transaction id 
        let txnId = this.filterForm.controls['transactionId'].value ? this.filterForm.controls['transactionId'].value : "";
        if (txnId != "") {
          const newFilterObject = { "fieldName": "Transaction Id", "value": txnId };
          this.filterValues.push(newFilterObject);
        }

        this.transactionService.getfilteredTransactions(this.searchCustomerName, this.idNumber, this.phoneNumber, this.finalTransactionStatusArray, this.sendCurrency, this.dateGt, this.dateLt,txnId).subscribe((datas: any) => {
          // Reset page to 1
        this.p = 1;
          this.loader = false;
          this.searchTransaction = datas['data'];
          this.recordsCount = this.searchTransaction.length;




          if (this.searchTransaction.length == 0) {
            this.rowData = this.searchCustomer
          }
          else {
            let transactionId = this.searchTransaction[0].TRANSACTIONID;
            this.rowData = this.searchTransaction.filter(v => v.TRANSACTIONID == transactionId);
            this.n = transactionId;
            this.color = true;  //row color
          }

        },
          //error handling done on 03-07-2023
          (error: any) => {
            this.loader = false;
            if (error.status != 401) {
              this.dialog.open(ErrorDialogAdminComponent);
            }
          }
        )
      }, 700);
    }
    // Check if the input has at least three characters and contains only alphabets
    if (inputText.length >= 3 && /^[a-zA-Z ]+$/.test(inputText)) {

      this.searchFieldTyped = true;  //once user entered more than 3 char , will call this variable 'searchFieldTyped' and give it as true signal

      // Triggered and service is called
      setTimeout(() => {
        this.searchCustomerName = this.searchCustomerName ? this.searchCustomerName : "";
        this.idNumber = this.idNumber ? this.idNumber : "";
        this.phoneNumber = this.phoneNumber ? this.phoneNumber : "";
        this.filterValues = [];
        //start date and end date pushed .
        var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": this.patchStartDate };
        var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": this.patchEndDate };
        this.filterValues.push(obj1);
        this.filterValues.push(obj2); //
        //pushing transaction status , that can be unposted or posted        
        if (this.unpostedStatus != "") {
          this.finalTransactionStatusArray;
          const finalArrayNumbersUnPosted: number[] = this.finalTransactionStatusArray.split(',').map(Number);
          // Use the finalArrayNumbersUnPosted to find the corresponding TXNSTATUS values
          const status: string[] = finalArrayNumbersUnPosted.map((num) => {
            const entry = this.getUnpostedStatus.find((item) => item.NO === num);
            return entry ? entry.TXNSTATUS : '';
          });
          status.join(', '); // Output: "Initiated, Amount Received"
          var unpostedTxnStatusObj3 = { "fieldName": "Transaction Status", "value": status };
          this.filterValues.push(unpostedTxnStatusObj3);
        }
        else if (this.postedStatus != "") {
          this.finalTransactionStatusArray; //this.finalTransactionStatusArray will be equal to = "3,5,6,7,8,10,11,12,20"
          let array: string[] = [];
          const trimmedString = this.finalTransactionStatusArray.trim();
          array = trimmedString.split(",");

          const allStatusFilter = this.getTransactionStatus.map(status => status.NO); //if user selected all txn status's , will show 'All'
          if (allStatusFilter.length == this.selectedTransactionStatus?.value?.length || allStatusFilter.length == array.length) {
            this.filterValues.push({ "fieldName": "Transaction Status", "value": "All" });
          }
          else {
            const finalArrayNumbersPosted: number[] = this.finalTransactionStatusArray.split(',').map(Number);
            // Use the finalArrayNumbersUnPosted to find the corresponding TXNSTATUS values
            const status: string[] = finalArrayNumbersPosted.map((num) => {
              const entry = this.getTransactionStatus.find((item) => item.NO === num);
              return entry ? entry.TXNSTATUS : '';
            });
            status.join(', '); // Output: "Initiated, Amount Received"
            var postedTxnStatusObj4 = { "fieldName": "Transaction Status", "value": status }
            this.filterValues.push(postedTxnStatusObj4);
          }

        }
        //pushing foreign currency        
        if (this.sendCurrency != "") {
          const newFilterObject = { "fieldName": "Foreign Currency", "value": this.sendCurrency };
          this.filterValues.push(newFilterObject);
        }

        //pushing customer name        
        if (this.searchCustomerName != "") {
          let modifiedCustomerName = this.searchCustomerName;
  
          if (this.searchCustomerName.length > 15) {
            modifiedCustomerName = this.searchCustomerName.substring(0, 15) + " ...";
          }
          const newFilterObject = { "fieldName": "Customer Name", "value": modifiedCustomerName };
          this.filterValues.push(newFilterObject);
        }

        //pushing Phone Number        
        if (this.phoneNumber != "") {
          const newFilterObject = { "fieldName": "Phone Number", "value": this.phoneNumber };
          this.filterValues.push(newFilterObject);
        }
        //pushing NRIC        
        if (this.idNumber != "") {
          const newFilterObject = { "fieldName": "NRIC", "value": this.idNumber };
          this.filterValues.push(newFilterObject);
        }

        //pushing transaction id 
        let txnId = this.filterForm.controls['transactionId'].value ? this.filterForm.controls['transactionId'].value : "";
        if (txnId != "") {
          const newFilterObject = { "fieldName": "Transaction Id", "value": txnId };
          this.filterValues.push(newFilterObject);
        }

        this.transactionService.getfilteredTransactions(this.searchCustomerName, this.idNumber, this.phoneNumber, this.finalTransactionStatusArray, this.sendCurrency, this.dateGt, this.dateLt, txnId).subscribe((datas: any) => {
          this.loader = false;
          this.searchTransaction = datas['data'];
          this.recordsCount = this.searchTransaction.length;
           // Reset page to 1
           this.p = 1;

          if (this.searchTransaction.length == 0) {
            this.rowData = this.searchCustomer
          }
          else {
            let transactionId = this.searchTransaction[0].TRANSACTIONID;
            this.rowData = this.searchTransaction.filter(v => v.TRANSACTIONID == transactionId);
            this.n = transactionId;
            this.color = true;  //row color
          }

        },
          //error handling done on 03-07-2023
          (error: any) => {
            this.loader = false;
            if (error.status != 401) {
              this.dialog.open(ErrorDialogAdminComponent);
            }
          }
        )
      }, 700);

    }
  }

  public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateEndDate = event.value?._d;
    let startDate = this.filterForm.controls['startDate'].value ? this.filterForm.controls['startDate'].value : "" ;
    if(this.validateEndDate){
      let endDate = this.filterForm.controls['endDate'].value ? this.filterForm.controls['endDate'].value : "" ;
      if(endDate != ""){
        this.filterForm.controls['startDate'].setValidators(Validators.required) ;
        this.filterForm.controls['startDate'].updateValueAndValidity();
      }
    }
    else if(startDate == ""){
      if(this.unpostedStatus != ""){ //If it is unposted screen , clear validations for start date and end date .
      this.filterForm.controls['endDate'].clearValidators() ;
      this.filterForm.controls['endDate'].updateValueAndValidity();
      this.filterForm.controls['startDate'].clearValidators() ;
      this.filterForm.controls['startDate'].updateValueAndValidity();
      }
    }


  }
  public onStartDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateStartDate = event.value?._d;
    let endDate = this.filterForm.controls['endDate'].value ? this.filterForm.controls['endDate'].value : "" ;
    if(this.validateStartDate){
      this.minEndDate = this.validateStartDate  //max end date is 8 days and exclude sat and sun
      this.maxEndDate = new Date(this.minEndDate.getTime() + 31 * 24 * 60 * 60 * 1000);
      let startDate = this.filterForm.controls['startDate'].value ? this.filterForm.controls['startDate'].value : "" ;
      if(startDate._d != ""){
        this.filterForm.controls['endDate'].setValidators(Validators.required) ;
        this.filterForm.controls['endDate'].updateValueAndValidity();
      }
 
    }
    else if(endDate == "") {
      if(this.unpostedStatus != ""){ //If it is unposted screen , clear validations for start date and end date .
        this.filterForm.controls['endDate'].clearValidators() ;
        this.filterForm.controls['endDate'].updateValueAndValidity();
        this.filterForm.controls['startDate'].clearValidators() ;
        this.filterForm.controls['startDate'].updateValueAndValidity();
      }
     
    }
   
  }

  getFilterValueStyle(filterValues: any): any {
    // Only trigger getWidth when fieldName is "Transaction Status"
    if (filterValues.fieldName === "Transaction Status") {
      const selectedStatusArray = filterValues.value;
      if (selectedStatusArray.length < 4) {
        return { 'width': 'auto' };
      }
      if (selectedStatusArray.length >= 4 && selectedStatusArray.length <= 5) {
        return { 'width': '450px' };
      }
      if (selectedStatusArray.length >= 6) {
        return { 'width': '659px', 'line-height': '22px', 'position': 'relative', 'top': '-5px' };
      }
      else {
        return { 'width': 'auto' };
      }
    }
    return {}; // Return empty style object for other fields
  }

  loadCurrentDateTransaction(){

     // Clear the filters array 
     this.filterValues = [];

    this.minEndDate = new Date() //max end date is 8 days and exclude sat and sun
    this.maxEndDate = new Date(this.minEndDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Patch the current date on page load
    const todayFormatted = new Date();
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
    this.filterValues.push(obj2); 

    //block will execute Fufillment screen
    if (this.store.getItem("POSTED_SCREEN") == "posted via widget" || this.store.getItem("POSTED_SCREEN") == "posted via menu" ) {

      //push status in FliterValues.
      this.filterValues.push({ "fieldName": "Transaction Status", "value": "All" });

      this.showAction = true; // Will show the "transaction status drpdwn field" in which we iterate all txn status except "Initiated" and "Amount received".
      this.showUnpostedStatus = false; //to hide transaction status of Initiated" and "Amount received in drpdwn field" 
      this.disable = true; // to disable the checkbox in parent transaction table .
      this.visible = true; //to show the information card in right side .
      this.getPostedTranscation();
    }

   //block will execute unposted screen
    else if (this.store.getItem("UN_POSTED_SCREEN") == "unposted via widget" || this.store.getItem("UN_POSTED_SCREEN") == "unposted via menu" ) {

      let unpostedStatus = "2,1" //AMOUNT RECEIVED , INITIATED 

      //push status in FliterValues.
      const finalArrayNumbersUnPosted: number[] = unpostedStatus.split(',').map(Number);
  
        const status: string[] = finalArrayNumbersUnPosted.map((num) => {
          const entry = this.getUnpostedStatus.find((item) => item.NO === num);
          return entry ? entry.TXNSTATUS : '';
        });
        status.join(', '); // Output: "Initiated, Amount Received"
        var unpostedTxnStatusObj = { "fieldName": "Transaction Status", "value": status };
        this.filterValues.push(unpostedTxnStatusObj);

      this.showAction = false; //to hide transaction status of 3,5,6,7,8,10,11,12,20 in drpdwn field"
      this.showUnpostedStatus = true; //To show Transcation status of Initated,Amount Received in dropdown field 
      this.disable = false; // to enable the checkbox in unposted Screen
      this.visible = true; //to show the information card in right side .
      this.getUnpostedTransaction();
    }
  }
  

  openDeleteTransactionDialog(transactionId : string){
    const dialogRef = this.dialog.open(CancelTransactionComponent,{
      data : {txnId : transactionId},
    });
    dialogRef.afterClosed().subscribe((datas:any)=>{
      if(datas == "Cancel Transaction API Success"){
       this.loadCurrentDateTransaction();
      }
      else if(datas == "Cancel Transaction API Failure"){
        this.loadCurrentDateTransaction();
      }
    })
  }

  //this function triggers the get transaction ack api. and open the modal dialog for showing the ACK details..
  onClickTransactionStatus(transactionId : string, customerType : string, txnStatus:string){
    this.dialog.open(ViewTransactionAckDetailsComponent,{
      data :  {transactionId : transactionId, customerType : customerType, transactionStatus : txnStatus} ,
      width : '912px;'
    }) ;
  }


  openTransactionUpdate(event : MouseEvent, transactionStatus:string, transactionId:string, customerName:string, amountSGD:number, amountF:number, sendCcy:string){
   //1. Open mat dialog UpdateTransactionStatusComponent --> pass data : transactionid and transactionstatus
   //2. Mat dialog UI --> top align figma design
   //3. After closed dialog --> based on data recieved --> call the TransactionSearch API again .

   // Get the position of the clicked element
   const target = event.target as HTMLElement;
   let rect  = target.getBoundingClientRect(); // Get the element's position

   // Check if the Y-coordinate of the click event is greater than 605
  let dialogTopPosition: string;
  if (event.clientY > 574) {
    // Position the dialog above the edit icon
    dialogTopPosition = `${rect.top - 410}px`; // Subtract the dialog height to place it above
  } else {
    // Position the dialog below the edit icon
    dialogTopPosition = `${rect.bottom}px`;
  }

   this.dialog.open(UpdateTransactionStatusComponent,{
    data :  {transactionStatus : transactionStatus, transactionId : transactionId, customerName : customerName, amountSGD : amountSGD, amountF : amountF, sendCcy : sendCcy} ,
    height: '355px',
    width: '450px',
    position: {
      top: dialogTopPosition,  // Set the dialog below the clicked icon
      left: `${rect.left - 200}px`,    // Align the dialog with the left edge of the icon 
    },
    panelClass: 'custom-modalbox'
  }).afterClosed().subscribe((datas:any)=>{
    if(datas && datas.data == "SUCCESS"){
     this.getUnpostedTransaction();
    }
  })

  }
  // this function will be called when suspicious icon clicked
  openSusremarks(data : any){
    console.log(data)
    this.susRemarks = data ? data.SUSPREMARKS  : "";
       this.dialog.open(TransactionSuspiciousRemarksComponent, {
        width:"400px",
       // height:"203px",
        panelClass: 'custom-modalbox',
        data:{remarks : this.susRemarks}
          })
  }

}



