import { Component, HostListener, OnInit, Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import {  MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TransactionService } from 'src/app/core/services/transaction.service';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import { currencyFilterArray, nricRegex } from 'src/assets/dropdownvalues';
import { getBackgroundColor, getColor, getTooltipText } from 'src/assets/transactionstatus';
import { ViewManagementReportConfirmationDialogComponent } from '../../shared/modals/view-management-report-confirmation-dialog/view-management-report-confirmation-dialog.component';


@Pipe({name: 'keys'})
export class TransactionReportKeysPipe implements PipeTransform {
  transform(value: any, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push(key);
    }
    return keys;
  }
}

@Component({
  selector: 'app-online-reports',
  templateUrl: './online-reports.component.html',
  styleUrls: ['./online-reports.component.scss','../../../../assets/styles/tables/table-style.scss',
    '../../../../assets/styles/buttons/button.scss'
  ],
})
export class OnlineReportsComponent implements OnInit {
  //variable declaration
  isActive = false;
  form!: FormGroup;
  selectedType !: string;
  selectedStatus !: any;
  selectedDayRange !: string;
  customerName !: string;
  offers = [ 'Consumer' , 'Agent' ,  'Corporate' ];
  dateGt !: string ;
  dateLt !: string ;
  authorisedDateGt !: string ;
  authorisedDateLt !: string ;
  loader : boolean = false;
  p: number = 1;
  itemsPerPage: number = 20;
  xpandStatus = false;
  filterValues: any[] = [];
  searchCustomerName !: string
  idNbr !: string;
  phnNumber !: string;
  payeePhnNumber !: string;
  payeeName !: string;
  getTransactionStatus: any[] = [
    { "NO": 1, "TXNSTATUS": "Initiated" },
    { "NO": 2, "TXNSTATUS": "Amount Received" },
    { "NO": 5, "TXNSTATUS": "Pending" },
    { "NO": 3, "TXNSTATUS": "Approved" },
    { "NO": 6, "TXNSTATUS": "Acknowledged" },
    { "NO": 7, "TXNSTATUS": "Deposited" },
    { "NO": 8, "TXNSTATUS": "Failed at Bank" },
    { "NO": 9, "TXNSTATUS":"Bank Completed"}, // unused in backend
    { "NO": 10, "TXNSTATUS": "Bank Approved" },
    { "NO": 11, "TXNSTATUS": "Bank Request Received" },
    { "NO": 12, "TXNSTATUS": "Bank Complete with Change" },
    { "NO": 20, "TXNSTATUS": "Cancelled Transaction" }
  ];
  daysRange : any []=[
    { "DAYS": "", "DAYRANGE": "--Select--" , "DISABLED" : true },
    { "DAYS": "Current Date", "DAYRANGE": "Current Date" ,"DISABLED" : false },
    { "DAYS": "10 days", "DAYRANGE": "Last 10 Days", "DISABLED" : false },
    { "DAYS": "15 days", "DAYRANGE": "Last 15 Days", "DISABLED" : false },
    { "DAYS": "30 days", "DAYRANGE": "Last 30 Days", "DISABLED" : false },
    { "DAYS": "Custom Date", "DAYRANGE": "Custom Dates", "DISABLED" : false },
  ]
  disableDateField : boolean = true;
  disableAuthorisedDateField : boolean = true;
  patchStartDate !: string;
  patchEndDate !: string;
  patchAuthoriseStartDate !: string;
  patchAuthoriseEndDate !: string;
  minEndDate !: any;
  maxEndDate !: any;
  minAuthorisedEndDate !: any;
  maxAuthorisedEndDate !: any;
  validateEndDate !: Date;
  validateStartDate !: Date;
  validateAuthorisedEndDate !: Date;
  validateAuthorisedStartDate !: Date;
  selectedTransactionStatusArray : any = "";
  transactionStatus !: string;
  agentName !: string;
  recordsCount : any = "";
  selectedCountryCode : string = "";
  currencyCodeArray = currencyFilterArray;
  sendCurrency : string = "";
  retrievedReportsData : boolean = true ;
  noReportsData : Boolean = false;
  reportDatas : any[] = [] ;
  selectedPaymentMode : any  ;
  selectedSuspicious : any ;
  minStartDate : Date = new Date(2025, 0, 1); 
  constructor(private titleHeader : TitleHeaderService,private fb: FormBuilder,
    private transactionService : TransactionService , private dialog : MatDialog ) { }

  ngOnInit(): void {
    this.titleHeader.setTitle('Transaction Search');
   //form
   var regex = nricRegex ;
    this.form = this.fb.group({
      accountTitle : [null, [Validators.compose([Validators.pattern('^[a-zA-Z0-9 ./,@]+$')])]],
      idNumber : [null, [Validators.compose([Validators.pattern(regex)])]],
      phoneNumber : [null,[Validators.compose([Validators.maxLength(15),Validators.pattern('^[0-9 ]+$')])]],
      customerType : [null],
      payeeName : [null,[Validators.compose([Validators.pattern('^[a-zA-Z0-9 +?:().,/-]+$')])]],
      payeePhoneNumber : [null,[Validators.compose([Validators.maxLength(15),Validators.pattern('^[0-9 ]+$')])]],
      status : [null],
      dayRange : [null], //Transaction Day range
      startDate : [null,[Validators.compose([Validators.required])]], //Transaction start date
      endDate : [null, Validators.compose([Validators.required])],  //Transaction end date
      authorisedDayRange : [null], //Authorised Day range 
      authorisedStartDate : [null,[Validators.compose([Validators.required])]], //Authorised start date
      authorisedEndDate : [null, Validators.compose([Validators.required])],  //Authorised end date
      agentName : [null],
      foreginCurrency : [null],
      paymentMode : [null],
      suspicious : [null]
    });
    //to load current date transcation.
   this.getCurrentDateReports();
   this.getScreenWidth = window.innerWidth;
   this.getScreenHeight = window.innerHeight;
  }
public getScreenWidth: any;
public getScreenHeight: any;

//The HostListener is a Decorator used for listening to the DOM,
@HostListener('window:resize', ['$event'])
onWindowResize() {
  this.getScreenWidth = window.innerWidth;
  this.getScreenHeight = window.innerHeight;
}
//pagination.
  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  } 
//responsive table height
  changeTableHeight(){
    return (this.getScreenHeight - 350 );
  }
  getOverFlow(){
    return 'auto';
  }

  tableHeight(){
    return { 'height': (this.getScreenHeight - 284)+'px' , 'overflow-y' : 'auto' };
  }


 //STATUS color diff
 getColor(value: any) {
  return getColor(value);
 }
 //bg color for status tags .
 getBackgroundColor(status: string): string {
  return getBackgroundColor(status)
 
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

//function trigger when dayrange dropdown change.
  onSelectionChange(e:any,selectedDate:string,flag:string){
   if(flag == "INITIATED"){

    //CLEARING AUTHORISED GROUP FIELDS
     this.form.controls['authorisedStartDate'].setValue("");
     this.form.controls['authorisedEndDate'].setValue("");
     this.form.controls['authorisedDayRange'].setValue("");

     this.form.controls['authorisedStartDate'].clearValidators();
     this.form.controls['authorisedStartDate'].updateValueAndValidity();
     this.form.controls['authorisedEndDate'].clearValidators();
     this.form.controls['authorisedEndDate'].updateValueAndValidity();

     // setting validators for Start date and end date
     this.form.controls['startDate'].setValidators([Validators.required,this.minDateValidator.bind(this)]);
     this.form.controls['startDate'].updateValueAndValidity() ;
     this.form.controls['endDate'].setValidators([Validators.required]);
     this.form.controls['endDate'].updateValueAndValidity() ;

     this.disableAuthorisedDateField = true;
     this.authorisedDateGt = "";
     this.authorisedDateLt = "";

     //To patch Current date in endDate field.
     const currentDate = new Date();
     let month = (currentDate.getMonth() + 1) ;
     this.dateLt = currentDate.getFullYear() +"-" + month + "-" + currentDate.getDate();
     this.form.controls['endDate'].setValue(currentDate);
     this.minEndDate = null; // to set null in min and max property.
     this.maxEndDate = null;

     //last 10 days
    if(selectedDate == "10 days"){
      this.disableDateField = true;
      const futureDate = new Date(currentDate.getTime() - (10 * 24 * 60 * 60 * 1000)); // startDate = current date - 10days
      this.form.controls['startDate'].setValue(futureDate);
      const futureDateString = futureDate;
      this.dateGt = futureDateString.getFullYear() +"-" + (futureDateString.getMonth() + 1) + "-" + futureDateString.getDate();
    }
    
    //last 15 days
    if(selectedDate == "15 days"){
      this.disableDateField = true;
      const futureDate = new Date(currentDate.getTime() - (15 * 24 * 60 * 60 * 1000)); // startDate = current date - 15days
      this.form.controls['startDate'].setValue(futureDate);
      const futureDateString = futureDate;
      this.dateGt = futureDateString.getFullYear() +"-" + (futureDateString.getMonth() + 1) + "-" + futureDateString.getDate();
    }

    //last 30 days
    if(selectedDate == "30 days"){
      this.disableDateField = true;
      const futureDate = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000)); // startDate = current date - 30days
      this.form.controls['startDate'].setValue(futureDate);
      const futureDateString = futureDate;
      this.dateGt = futureDateString.getFullYear() +"-" + (futureDateString.getMonth() + 1) + "-" + futureDateString.getDate(); 
    }


    //current day
    if(selectedDate == "Current Date"){
      this.disableDateField = true;
      const currentDate = new Date();                   //startDate = current date
      let month = (currentDate.getMonth() + 1) ;
      this.dateGt = currentDate.getFullYear() +"-" + month + "-" + currentDate.getDate();
      this.form.controls['startDate'].setValue(currentDate);
     }

     //custom days
    if(selectedDate == "Custom Date"){
      console.log("choosed custom dates");
      // this.form.controls['startDate'].setValidators(Validators.required); // issue found to set validation here , so we set validation onload().
      // this.form.controls['endDate'].setValidators(Validators.required);
      this.disableDateField = false;
      this.dateGt = "";
      this.dateLt = "";
      this.patchStartDate = "";
      this.patchEndDate = "";
      this.form.controls['startDate'].setValue(null);
      this.form.controls['endDate'].setValue(null);
    }
    }
    else if (flag == "AUTHORISED"){

          //CLEARING AUTHORISED GROUP FIELDS
          this.form.controls['startDate'].setValue("");
          this.form.controls['endDate'].setValue("");
          this.form.controls['dayRange'].setValue("");
      
          this.form.controls['startDate'].clearValidators() ;
          this.form.controls['startDate'].updateValueAndValidity() ;
          this.form.controls['endDate'].clearValidators() ;
          this.form.controls['endDate'].updateValueAndValidity() ;

          // setting validators for Authorised Start date and Authorised End date
          this.form.controls['authorisedStartDate'].setValidators([Validators.required,this.minDateValidator.bind(this)]);
          this.form.controls['authorisedStartDate'].updateValueAndValidity();
          this.form.controls['authorisedEndDate'].setValidators([Validators.required]);
          this.form.controls['authorisedEndDate'].updateValueAndValidity();

          this.disableDateField = true; 
          this.dateGt = "";
          this.dateLt = "";

    //To patch Current date in endDate field.
    const currentDate = new Date();
    let month = (currentDate.getMonth() + 1) ;
    this.authorisedDateLt = currentDate.getFullYear() +"-" + month + "-" + currentDate.getDate();
    this.form.controls['authorisedEndDate'].setValue(currentDate);
    this.minAuthorisedEndDate = null; // to set null in min and max property.
    this.maxAuthorisedEndDate = null;

    //last 10 days
   if(selectedDate == "10 days"){
     this.disableAuthorisedDateField = true;
     const futureDate = new Date(currentDate.getTime() - (10 * 24 * 60 * 60 * 1000)); // startDate = current date - 10days
     this.form.controls['authorisedStartDate'].setValue(futureDate);
     const futureDateString = futureDate;
     this.authorisedDateGt = futureDateString.getFullYear() +"-" + (futureDateString.getMonth() + 1) + "-" + futureDateString.getDate();
   }
   
   //last 15 days
   if(selectedDate == "15 days"){
     this.disableAuthorisedDateField = true;
     const futureDate = new Date(currentDate.getTime() - (15 * 24 * 60 * 60 * 1000)); // startDate = current date - 15days
     this.form.controls['authorisedStartDate'].setValue(futureDate);
     const futureDateString = futureDate;
     this.authorisedDateGt = futureDateString.getFullYear() +"-" + (futureDateString.getMonth() + 1) + "-" + futureDateString.getDate();
   }

   //last 30 days
   if(selectedDate == "30 days"){
     this.disableAuthorisedDateField = true;
     const futureDate = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000)); // startDate = current date - 30days
     this.form.controls['authorisedStartDate'].setValue(futureDate);
     const futureDateString = futureDate;
     this.authorisedDateGt = futureDateString.getFullYear() +"-" + (futureDateString.getMonth() + 1) + "-" + futureDateString.getDate(); 
   }


   //current day
   if(selectedDate == "Current Date"){
     this.disableAuthorisedDateField = true;
     const currentDate = new Date();                   //startDate = current date
     let month = (currentDate.getMonth() + 1) ;
     this.authorisedDateGt = currentDate.getFullYear() +"-" + month + "-" + currentDate.getDate();
     this.form.controls['authorisedStartDate'].setValue(currentDate);
    }

    //custom days
   if(selectedDate == "Custom Date"){
     console.log("choose authorised custom dates");
     
     this.disableAuthorisedDateField = false;
     this.authorisedDateGt = "";
     this.authorisedDateLt = "";
     this.patchAuthoriseStartDate = "";
     this.patchAuthoriseEndDate = "";
     this.form.controls['authorisedStartDate'].setValue(null);
     this.form.controls['authorisedEndDate'].setValue(null);
   }
    }
  }

  //method is used for onload and Reset.
  getCurrentDateReports(){
    this.searchCustomerName =  "";
    this.idNbr = "";
    this.phnNumber =  "";
    this.payeePhnNumber =  "";
    this.payeeName = "";
    this.agentName = "";
    this.selectedType =  "";
    this.selectedStatus = "";
    this.selectedDayRange = "";
    this.selectedTransactionStatusArray = "";
    this.sendCurrency = "";
    this.form.controls['customerType'].setValue(null);
    this.form.controls['status'].setValue(null);


     //push Transaction status.
     this.filterValues.push({"fieldName": "Transaction Status" , "value" : "Approved, Acknowledged, Deposited, Bank Completed, Bank Approved, Bank Request Received, Bank Completed With Change"})
     this.selectedTransactionStatusArray = "3,4,6,7,9,10,11,12"; //APPROVED, PAYMENT RECEIVED, ACK, DEPOSITED, BANK COMP, BANK APPR,BANK REQUEST RECEIVED AND BANK COMPLETED WITH CHANGE
    
     // onLoad sent payment Mode as ""
     this.selectedPaymentMode = "";
     this.form.controls['paymentMode'].setValue("");

     //push Suspicious
     this.selectedSuspicious = "N";
     this.form.controls['suspicious'].setValue("No");
     const newFilterObject = { "fieldName": "Suspicious", "value":  this.form.controls['suspicious'].value };
     this.filterValues.push(newFilterObject);

    //patch current date in Start date and End date and Day range.
    const currentDate = new Date();
    let month = (currentDate.getMonth() + 1) ;

    //Group : transaction dates
    this.form.controls['startDate'].setValue("");
    this.form.controls['endDate'].setValue("");
    this.form.controls['dayRange'].setValue("");

    this.form.controls['startDate'].clearValidators() ;
    this.form.controls['startDate'].updateValueAndValidity() ;
    this.form.controls['endDate'].clearValidators() ;
    this.form.controls['endDate'].updateValueAndValidity() ;

    //Group : authorised dates
    this.form.controls['authorisedStartDate'].setValue(currentDate);
    this.form.controls['authorisedEndDate'].setValue(currentDate);
    this.form.controls['authorisedDayRange'].setValue("Current Date");

    //while testing issues found on minEndate and maxEndDate.
    this.minEndDate = new Date(currentDate);
    this.maxEndDate = new Date(currentDate);

    this.minAuthorisedEndDate = new Date(currentDate);
    this.maxAuthorisedEndDate = new Date(currentDate);

    this.disableDateField = true; //diable startDate and endDate ,except custom dates.
    this.disableAuthorisedDateField = true;

    //start date and end date format YYY-MM-DD - internally. 
    this.dateGt = "";
    this.dateLt = "";

     //start date and end date format YYY-MM-DD - internally. 
     this.authorisedDateGt = currentDate.getFullYear() +"-" + month + "-" + currentDate.getDate();
     this.authorisedDateLt = currentDate.getFullYear() +"-" + month + "-" + currentDate.getDate();

       // Use toLocaleDateString to format the date as "dd/mm/yyyy"
       let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
       this.patchStartDate = this.form.controls.authorisedStartDate.value.toLocaleDateString('en-GB', options);
       this.patchEndDate = this.form.controls.authorisedEndDate.value.toLocaleDateString('en-GB', options);


     //pushing current date  for startDate and end date onload
     var obj1 = { "fieldName": "Authorised Start Date (DD/MM/YYYY)", "value": this.patchStartDate };
     var obj2 = { "fieldName": "Authorised End Date (DD/MM/YYYY)", "value": this.patchEndDate };
     this.filterValues.push(obj1);
     this.filterValues.push(obj2);

     this.loader = true;
      setTimeout(() => {
         //service call for retrive transaction report for Current Date 
       this.transactionService.getTransactionReports(this.searchCustomerName,this.idNbr,this.phnNumber,this.selectedType,this.payeeName
        ,this.payeePhnNumber,this.selectedTransactionStatusArray,this.dateGt,this.dateLt,this.agentName,this.sendCurrency,false, this.authorisedDateGt,this.authorisedDateLt, this.selectedPaymentMode,this.selectedSuspicious).subscribe((datas:any)=>{
        this.loader = false;
        this.reportDatas = datas['data'];
        this.recordsCount = this.reportDatas.length;
        if(this.reportDatas.length == 0){
          this.noReportsData = true;
          this.retrievedReportsData = false;
        }
        else{
          this.noReportsData = false;
          this.retrievedReportsData = true;
        }
       },
       (error:any)=>{
        this.loader = false;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent,{
            data : {errorMessage : error.error.errorMessage}
          }) ;
        }
       })
      }, 500);
  }
  applyFilter(searchCustomerName:string,idNbr:string,phnNumber:string,payeePhnNumber:string,payeeName:string,agentName:string){
    this.xpandStatus = false;
   // Reset page to 1
   this.p = 1;

   this.dialog.open(ViewManagementReportConfirmationDialogComponent,{
     width : "500px"
   }).afterClosed().subscribe((response:any)=>{
    console.log(response) ;
    // added filters commonly for View , PDF, Excel.
    // clear filtervalues.
    this.filterValues = [];
    this.loader = true;
    this.searchCustomerName = searchCustomerName ? searchCustomerName : "";
    this.idNbr = idNbr ? idNbr : "";
    this.phnNumber = phnNumber ? phnNumber : "";
    this.payeePhnNumber = payeePhnNumber ? payeePhnNumber : "";
    this.payeeName = payeeName ? payeeName : "";
    this.agentName = agentName ? agentName : "";
    this.selectedType = this.form.controls['customerType'].value ? this.form.controls['customerType'].value : "";
    this.selectedStatus = this.form.controls['status'].value ?  this.form.controls['status'].value  : "";
    this.selectedDayRange = this.form.controls['dayRange'].value ? this.form.controls['dayRange'].value : "";
    this.selectedPaymentMode = this.form.controls['paymentMode'].value ? this.form.controls['paymentMode'].value : "";
    this.selectedSuspicious = this.form.controls['suspicious'].value ? this.form.controls['suspicious'].value : "";
    //pushing customer name        
    if ( this.searchCustomerName != "") {

      let modifiedCustomerName =  this.searchCustomerName;
  
      if ( this.searchCustomerName.length > 15) { //we Append "..." ,if customername length is more than 15 (AMEER SULTAN AH...)
        modifiedCustomerName =  this.searchCustomerName.substring(0, 15) + " ...";
      }
      const newFilterObject = { "fieldName": "Customer Name", "value": modifiedCustomerName };
      this.filterValues.push(newFilterObject);
    }

    //pushing agent Name
    if(this.agentName != ""){
     let modifiedAgentName = this.agentName;
     if(this.agentName.length > 15){
      modifiedAgentName = this.agentName.substring(0,15) + "..."
     }
     const newFilterobj = {'fieldName':"Agent Name",'value':modifiedAgentName};
     this.filterValues.push(newFilterobj);
    }
    //pushing NRIC        
    if ( this.idNbr != "") {
      const newFilterObject = { "fieldName": "NRIC", "value":  this.idNbr };
      this.filterValues.push(newFilterObject);
    }
    //pushing Phone Number         
    if ( this.phnNumber != "") {
      const newFilterObject = { "fieldName": "Phone Number", "value":  this.phnNumber };
      this.filterValues.push(newFilterObject);
    }

    //pushing payee Phone Number        
    if ( this.payeePhnNumber != "") {
      const newFilterObject = { "fieldName": "Payee PhoneNo", "value":  this.payeePhnNumber };
      this.filterValues.push(newFilterObject);
    }
    //pushing payee Name       
    if ( this.payeeName != "") {

      let modifiedPayeeName =  this.payeeName;
  
      if ( this.payeeName.length > 15) {
        modifiedPayeeName =  this.payeeName.substring(0, 15) + " ...";
      }
      const newFilterObject = { "fieldName": "Payee Name", "value": modifiedPayeeName };
      this.filterValues.push(newFilterObject);
    }
   
   // new change - foreignCurrency  
   let foreginCurrencyFlag = this.form.controls['foreginCurrency'].value ? this.form.controls['foreginCurrency'].value : "";
   var sendCcy = '';

    if (foreginCurrencyFlag != "") {
      const index = this.currencyCodeArray.findIndex((v: any) => v.FLAG == foreginCurrencyFlag);
      sendCcy = this.currencyCodeArray[index].CURRENCYCODE;
      this.sendCurrency = sendCcy; 
    }
    else {
      this.sendCurrency = "";
    }
     //pushing foreign currency        
     if (this.sendCurrency != "") {
      const newFilterObject = { "fieldName": "Foreign Currency", "value": this.sendCurrency };
      this.filterValues.push(newFilterObject);
    }

     //pushing Type      
     if ( this.selectedType != "") {
      if(this.selectedType == "Agent"){
       this.selectedType = "A"
      }
      if(this.selectedType == "Consumer"){
        this.selectedType = "I"
       }
       if(this.selectedType == "Corporate"){
        this.selectedType = "C"
       }
      const newFilterObject = { "fieldName": "Type", "value":  this.form.controls['customerType'].value };
      this.filterValues.push(newFilterObject);
      console.log(this.selectedType);
      
    }
     //pushing Status 
    if (this.selectedStatus != "") {
      this.selectedTransactionStatusArray = this.selectedStatus.join(',');
      let array : string[] = [];
      array = this.selectedTransactionStatusArray.split(",");

      const allStatusFilter = this.getTransactionStatus.map(status => status.NO); //if user selected all txn status's , will show 'All'
      if (allStatusFilter.length == this.form.controls['status'].value.length) {
        this.filterValues.push({ "fieldName": "Transaction Status", "value": "All" });
      }
      else {
        const finalArrayNumbersSelected: number[] = this.selectedTransactionStatusArray.split(',').map(Number);
        // Use the finalArrayNumbersUnPosted to find the corresponding TXNSTATUS values
        const status: string[] = finalArrayNumbersSelected.map((num) => {
          const entry = this.getTransactionStatus.find((item) => item.NO === num);
          return entry ? entry.TXNSTATUS : '';
        });
        status.join(', '); // Output: "Initiated, Amount Received,Pending,Depoisted"
        var selectedTxnStatusObj = { "fieldName": "Transaction Status", "value": status.join(', ') }
        this.filterValues.push(selectedTxnStatusObj);
      }
    }
    //send all status execpt INITIATED, AMOUNT RECIEVED , CANCELLED AND FAILED AT BANK - when transcation status is not selected.
    else if(this.selectedStatus == ""){
      this.selectedTransactionStatusArray = "3,4,6,7,9,10,11,12"; //APPROVED, PAYMENT RECEIVED, ACK, DEPOSITED, BANK COMP, BANK APPR,BANK REQUEST RECEIVED AND BANK COMPLETED WITH CHANGE
      this.filterValues.push({"fieldName": "Transaction Status" , "value" : "Approved, Acknowledged, Deposited, Bank Completed, Bank Approved, Bank Request Received, Bank Completed With Change"})
    }

        //pushing PaymentMode

        if (this.selectedPaymentMode) {
          if(this.selectedPaymentMode == "PayNow"){
            this.selectedPaymentMode = "PN";
           }
           else if(this.selectedPaymentMode == "Cash"){
             this.selectedPaymentMode = "CH";
            }
           const newFilterObject = { "fieldName": "Payment Mode", "value":  this.form.controls['paymentMode'].value };
           this.filterValues.push(newFilterObject);
          }
          else{
            this.selectedPaymentMode = "";
          }

        //pushing suspicious type
        if (this.selectedSuspicious) {

          if(this.selectedSuspicious == "Yes"){
            this.selectedSuspicious = "Y"
           }
           else if(this.selectedSuspicious == "No"){
             this.selectedSuspicious = "N"
            }
           const newFilterObject = { "fieldName": "Suspicious", "value":  this.form.controls['suspicious'].value };
           this.filterValues.push(newFilterObject);
            }
            else{
              this.selectedSuspicious = "";
    }

    var start_date: any = this.form.controls.startDate.value ? moment(this.form.controls.startDate.value) : null ; 
    var end_date: any = this.form.controls.endDate.value ? moment(this.form.controls.endDate.value) : null ;

    var authorised_start_date: any = this.form.controls.authorisedStartDate.value ? moment(this.form.controls.authorisedStartDate.value) : null;
    var authorised_end_date: any = this.form.controls.authorisedEndDate.value ? moment(this.form.controls.authorisedEndDate.value) : null;

    // Use toLocaleDateString to format the date as "dd/mm/yyyy"
    let options = { day: '2-digit', month: '2-digit', year: 'numeric' };

    //start date and end date format YYY-MM-DD - internally.
    if(start_date && end_date ){
    this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
    this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

    this.patchStartDate = this.form.controls.startDate.value.toLocaleDateString('en-GB', options);
     this.patchEndDate = this.form.controls.endDate.value.toLocaleDateString('en-GB', options);

     if(this.patchStartDate == 'NaN-NaN-NaN'){
      this.patchStartDate = "" ;
    }
    if(this.patchEndDate == 'NaN-NaN-NaN'){
      this.patchEndDate = "" ;
    }

    var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": this.patchStartDate };
    var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": this.patchEndDate };
    this.filterValues.push(obj1);
    this.filterValues.push(obj2);

    }

    if(authorised_start_date && authorised_end_date){
    this.authorisedDateGt = authorised_start_date._d.getFullYear() + "-" + (authorised_start_date._d.getMonth() + 1) + "-" + authorised_start_date._d.getDate();
    this.authorisedDateLt = authorised_end_date._d.getFullYear() + "-" + (authorised_end_date._d.getMonth() + 1) + "-" + authorised_end_date._d.getDate();

    this.patchAuthoriseStartDate = this.form.controls.authorisedStartDate.value.toLocaleDateString('en-GB', options);
     this.patchAuthoriseEndDate = this.form.controls.authorisedEndDate.value.toLocaleDateString('en-GB', options);

       if(this.patchAuthoriseStartDate == 'NaN-NaN-NaN'){
      this.patchAuthoriseStartDate = "" ;
    }
    if(this.patchAuthoriseEndDate == 'NaN-NaN-NaN'){
      this.patchAuthoriseEndDate = "" ;
    }

    //pushing dates
    var obj3 = { "fieldName": "Authorised Start Date (DD/MM/YYYY)", "value": this.patchAuthoriseStartDate };
    var obj4 = { "fieldName": "Authorised End Date (DD/MM/YYYY)", "value": this.patchAuthoriseEndDate };
    this.filterValues.push(obj3);
    this.filterValues.push(obj4);
    }
   if(response && response.action == "VIEW"){


    setTimeout(() => {
       //services call
     this.transactionService.getTransactionReports(this.searchCustomerName,this.idNbr,this.phnNumber,this.selectedType,this.payeeName
      ,this.payeePhnNumber,this.selectedTransactionStatusArray,this.dateGt,this.dateLt,this.agentName,this.sendCurrency,false, this.authorisedDateGt,this.authorisedDateLt,this.selectedPaymentMode,this.selectedSuspicious).subscribe((datas:any)=>{
        this.reportDatas = datas['data'];
        this.recordsCount = this.reportDatas.length;
        this.loader = false;

        if(this.reportDatas.length == 0){
          this.noReportsData = true;
          this.retrievedReportsData = false;
        }
        else{
          this.noReportsData = false;
          this.retrievedReportsData = true;
        }

      },
      (error:any)=>{
        this.loader = false;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent,{
            data : {errorMessage : error.error.errorMessage}
          }) ;
        }
      })
    }, 500);
 

  }
  else if(response && response.action == "SAVE"){
 setTimeout(() => {
    //services call
  this.transactionService.getTransactionReportAsPdf(this.searchCustomerName,this.idNbr,this.phnNumber,this.selectedType,this.payeeName
   ,this.payeePhnNumber,this.selectedTransactionStatusArray,this.dateGt,this.dateLt,this.agentName,this.sendCurrency,true, this.authorisedDateGt,this.authorisedDateLt,false,this.selectedPaymentMode,this.selectedSuspicious).subscribe((datas:ArrayBuffer)=>{
    this.loader = false ;

      // Handle the ArrayBuffer data here
      const blob = new Blob([datas], { type: 'application/pdf' });

      // Create a File with a specified filename
      const filename = `TransactionReport.pdf` ;

      const file = new File([blob], filename, { type: 'application/pdf' });

      // Create a data URL from the File
      const url = URL.createObjectURL(file);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name; // Ensures correct file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Cleanup the blob URL to free memory
      URL.revokeObjectURL(url);

      // Open the PDF in a new tab or download as needed
      // window.open(url);
   },
   (error:any)=>{
     this.loader = false;
     if(error.status != 401){
       this.dialog.open(ErrorDialogAdminComponent,{
        data : {errorMessage : error.error.errorMessage}
       }) ;
     }
   })
 }, 500);
  }
  else if(response && response.action == "XLSX"){ //excel
 setTimeout(() => {
  //services call
this.transactionService.getTransactionReportAsPdf(this.searchCustomerName,this.idNbr,this.phnNumber,this.selectedType,this.payeeName
 ,this.payeePhnNumber,this.selectedTransactionStatusArray,this.dateGt,this.dateLt,this.agentName,this.sendCurrency,false, this.authorisedDateGt,this.authorisedDateLt,true,this.selectedPaymentMode,this.selectedSuspicious).subscribe((datas:ArrayBuffer)=>{
  this.loader = false ;
  
 // Handle the ArrayBuffer data here
 const blob = new Blob([datas], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
 // Create a filename for the XLSX file
 const filename = `TransactionSearch.xlsx`;

// Create a File object
 const file = new File([blob], filename, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

 // Create a data URL from the File
  const url = URL.createObjectURL(file);

  const a = document.createElement("a");
  a.href = url;
  a.download = file.name; // Ensures correct file name
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

 // Open the PDF in a new tab or download as needed
//  window.open(url);
 },
 (error:any)=>{
   this.loader = false;
   if(error.status != 401){
     this.dialog.open(ErrorDialogAdminComponent,{
      data : {errorMessage : error.error.errorMessage}
     }) ;
   }
 })
}, 500);

  }
  
  else{
    console.log("Dialog is closed without any action provided...")
  }
})

  }

// function trigger , when foriegn currency drop down changes.
  selectCurrencyCode(flag: string) {
    this.selectedCountryCode = flag;
  }
  resetFilter(){
    // Reset page to 1
    this.p = 1;

    // clear filter values.
    this.filterValues = [];
    this.xpandStatus = false;

    //reset foreginCurrency value and flag.
    this.form.controls['foreginCurrency'].setValue([]);
    this.selectedCountryCode = "" ;

    //load current date transaction after reset clicked.
    this.getCurrentDateReports();
  }

  public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateEndDate = event.value._d;
    this.form.controls['endDate'].setValue(this.validateEndDate);
  }
  public onStartDateChange(event: MatDatepickerInputEvent<any>): void { // changed to one year
    this.validateStartDate = event.value._d;
    this.minEndDate = this.validateStartDate;
    this.maxEndDate = new Date(this.minEndDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    this.form.controls['startDate'].setValue(this.validateStartDate);
  }

  //Authorisation start date and end date changes .
  public onAuthorisedEndDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateAuthorisedEndDate = event.value._d;
    this.form.controls['authorisedEndDate'].setValue(this.validateAuthorisedEndDate);
  }
  public onAuthorisedStartDateChange(event: MatDatepickerInputEvent<any>): void {// changed to one year
    this.validateAuthorisedStartDate = event.value._d;
    this.minAuthorisedEndDate = this.validateAuthorisedStartDate;
    this.maxAuthorisedEndDate = new Date(this.minAuthorisedEndDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    this.form.controls['authorisedStartDate'].setValue(this.validateAuthorisedStartDate);
  }

  calculatePayeeGets(amount: string, rate: string): string {
    const amountValues : any[] = amount.split(',').map(value => parseFloat(value)); // spilt amount and change string to numbers
    const rateValues : any[] = rate.split(',').map(value => parseFloat(value));    // spilt rate and change string to numbers
  
    const payeeValues : any[] = amountValues.map((amt, index) => amt / rateValues[index]); // calucaltae payee gets based on corresponding amount & rate
  
    const payeeGets = payeeValues.reduce((total, value) => total + value); // total payeegets amount
  
    return payeeGets;
  }

 
  getTruncatedText(text: string, limit: number): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }


  minDateValidator(control: AbstractControl): ValidationErrors | null {
    const input = control.value;
    if (!input) return null;

    const inputDate = new Date(input);
    if (inputDate < this.minStartDate) {
      return { minDate: true };
    }
    return null;
  }

}
