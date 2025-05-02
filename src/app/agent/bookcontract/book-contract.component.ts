import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { organisation } from 'src/assets/dropdownvalues';
import { foreignCurrencyArr } from 'src/assets/dropdownvalues';
import { AgentContractConfirmationComponent } from '../modals/contract-confirmation/agent-contract-confirmation.component';
import { TenorDatesComponent } from '../modals/tenortype/tenor-dates.component';
import { AgentServiceService } from '../agent-service.service';
import { FxRatePricing } from '../models/agentpricing.model';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { forbiddenNumberValidator } from 'src/app/shared/services/forbiddennumbervalidator';
import moment from 'moment';
import { roleIdDetails } from 'src/assets/userrole';


@Component({
  selector: 'app-book-contract',
  templateUrl: './book-contract.component.html',
  styleUrls: ['./book-contract.component.scss']
})
export class BookContractComponent implements OnInit , OnDestroy {
   myDate:any = new Date;
   public form : FormGroup = Object.create(null);
   organisationName !: string;
   country : any[] = foreignCurrencyArr;
   baseCurrency !: string;
   public getScreenWidth: any;
   public getScreenHeight: any;
   counter : any;
   showStaticTimer : Boolean = true;
   showRunningTimer  : Boolean = false;
   exchangeRate : any = '' ;
   isDisabledGetQuote : Boolean = true;
   bookNowDisabled : Boolean = true;
   foreignCurrency : any;
   sellAmountReadOnly : Boolean = false;
   buyAmountReadOnly : Boolean = true ;
   public runningTimer : any;
   callBackService: any; 
   startDate : any = "No Value";
   endDate : any = "No Value";
   ccyPair:any;
   transactionCurrency !: string ;
   loader : Boolean = false;
   showBookNow:Boolean=true;
   pricingId !: string ;
   months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
   numericMonths = ["01", "02", "03","04", "05", "06", "07", "08", "09", "10", "11", "12"] ;
   isValueDisable : Boolean = false ;
   getQuoteLoader : Boolean = false ;
   showGetQuote : Boolean = true ;
   entityId !: string ;
   entityName !: string ;
   tenor !: string ;
   tenorStartDate !: string ;
   tenorEndDate !: string ;
   disableBuyAmountField : Boolean = true ;
   disableSellAmountField : Boolean = false;
   buyAmount : any;
   tenorRange : any[] = [
    {value:"TODAY",viewValue:"Today"},
    {value : "1W" , viewValue : "1 Week"},
    {value : "1M" , viewValue : "1 Month"},
   ];
   selectedTenor !: string ;
   selectedValue!: string;
   finalStartDate : any;
   finalendDate : any;
   disableTenor : boolean = false;
   isWindowOpen : boolean = false ;

  constructor(private titleHeader : TitleHeaderService,private datePipe: DatePipe,private fb : FormBuilder,
    private matDialog : MatDialog ,private agent_services:AgentServiceService,private store : InMemoryCache) { 
    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
  
    //checking whethere this component is inside popup window
    if(window.opener){
      this.isWindowOpen = true ;
     }
     else{
       this.isWindowOpen = false ;
     }

    this.titleHeader.setTitle('Get Quote and Book Contract');
    this.selectedTenor = "TODAY" ;
    this.organisationName = organisation;
    this.baseCurrency = 'SGD';
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  //  let sellAmtregex: RegExp = new RegExp(/^\d*\.?\d{0,0}$/);
    //let regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/);
    this.form = this.fb.group({
      sellingAmount :  [null,[forbiddenNumberValidator()]],
      buyingAmount : [null],
      buying:[null],
      selling:[null],
    })
    this.foreignCurrency = 'USD';
  }

   //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  responsiveCardHeight() {
    return { 'height': (this.getScreenHeight - 10) + 'px', 'margin':'0px','border':'1px solid rgb(225, 225, 225)' };

  }

  responsiveContent(){
    return {
      'height': 50 + 'vh',
      'background': '#123969',
      'box-shadow': '0px 4px 4px rgb(0 0 0 / 25%)',
      'margin': '15px',
      'width': '1173px',
      'border-radius': '10px'
    }
    
  }

  getQuote(sellCcy:any,buyCcy:any){
    this.entityId = this.store.getItem('USER_ID') ;
    this.entityName = this.store.getItem('USERNAME') ;
    let roleId = this.store.getItem('USER_ROLE') ;
    if(roleId == roleIdDetails.AGENT || roleId == roleIdDetails.CORPORATE_OWNER || roleId == roleIdDetails.CORPORATE_RUNNER || roleId == roleIdDetails.CORPORATE_DEALER){
      this.entityId = this.entityId;
      this.entityName = this.entityName;
    }
    else{
      this.entityId = "APT";
      this.entityName = "APT";
  }
    this.showGetQuote = false ;
    this.getQuoteLoader = true ;
    this.showStaticTimer = false;
    this.showRunningTimer = true;
    let sellAmount : any = this.form.controls['sellingAmount'].value ;
    let buyAmount : any = this.form.controls['buyingAmount'].value ;
    this.ccyPair= buyCcy + sellCcy ;  //eg USD + SGD
    this.transactionCurrency = buyCcy ;
    this.isValueDisable = true ;
    this.sellAmountReadOnly = true; //once get quote button is clicked -> selling amount  field is readonly state
   
    // if(this.startDate == this.endDate){
    //    this.tenor = "TODAY" ;
    //    this.tenorStartDate = "" ;
    //    this.tenorEndDate = "" ;
    // }
    // else{
    //   this.tenor = "" ;
    //   let formattedStartDate : any = this.datePipe.transform(this.startDate, 'yyyyMMdd');
    //   let formattedEndDate : any = this.datePipe.transform(this.endDate, 'yyyyMMdd');
    //   this.tenorStartDate = formattedStartDate ;
    //   this.tenorEndDate = formattedEndDate ;
    //   console.log(this.tenorStartDate + "+" + this.tenorEndDate) ;
    // }

    this.agent_services.getPricing(this.buildPayload()).subscribe(data =>{
      this.isValueDisable = true ; //if pricing api is success - user is not allowed to change the country code dropdown value again .
      this.timer(15); //timer for 15 minutes
      console.log(data);
      this.disableSellAmountField = true; //sell amount - onKey up event will not fire
      this.bookNowDisabled = false ;
      this.getQuoteLoader = false ;
      this.showGetQuote = true ;
      this.disableTenor = true ;
      this.exchangeRate = data.rate;
      this.pricingId = data.pricingId ;
      this.store.setItem('PRICING_ID',this.pricingId);
      if(sellAmount != ""){
       let formattedSellAmount =  (sellAmount.replace(/,/g, '') * this.exchangeRate).toFixed(2)//formattedSellAmount --> will remove the commas seperators.
       let sellAmountViewValue = this.formatValue(parseFloat(formattedSellAmount)) ;
        this.form.patchValue({
          "buyingAmount" : sellAmountViewValue
        })
        this.isDisabledGetQuote = true;
       }
       //unused if
       if(buyAmount != ""){
        this.form.patchValue({
          "sellingAmount" : (buyAmount * this.exchangeRate).toFixed(2)
        })
         this.isDisabledGetQuote = true;
       }
     },
     //error handling completed on 05/07/2023
     (error:any) => {
      if(error.status != 401){
        if(error.error.errorMessage){
          this.matDialog.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : error.error.errorMessage }
          }) 
        }
      }
      this.buyAmount = "";
     this.getQuoteLoader = false ;  //controlling loader and get quote button
     this.disableSellAmountField = false;
     this.showGetQuote = true ;  //controlling loader and get quote button
     this.isValueDisable = false ; //if pricing api is failed - user can change the country code dropdown value again .
     this.form.reset(); //clearing all fields
     this.sellAmountReadOnly = false; //enabling user to enter values because we cleared all fields
     if(this.exchangeRate == undefined || this.exchangeRate == ""){
      this.bookNowDisabled = true ;
      if(sellAmount != ""){
        this.form.patchValue({
          "buyingAmount" : ""
        })
        this.isDisabledGetQuote = true;
       }
       if(buyAmount != ""){
        this.form.patchValue({
          "sellingAmount" : ""
        })
         this.isDisabledGetQuote = true;
       }
     }
     clearInterval(this.runningTimer); // even if timer started - for safety , we are clearing the timer again .
     this.showStaticTimer = true;   //15:00
     this.showRunningTimer = false; //dynamic running timer
    
    
    }
     )

   
  }
  buildPayload():FxRatePricing{
     return new FxRatePricing({
       "entityId"  :  this.entityId ,
      "entityName": this.entityName ,
       "ccyPair"   : this.ccyPair,
      "txnAmount" : (this.form.controls['sellingAmount'].value).replace(/,/g, ''), //will remove commas separator if any .,  //foreign ccy amount
      "dealtSide" : "BUY" ,  //Date : 31-05-2023 , Sujan . Description : DBS requested to send dealtSide as BUY
      "txnCcy"   : this.transactionCurrency ,
      "tenor"     : this.selectedTenor,
      "startDate" : this.finalStartDate,
     "endDate" : this.finalendDate
    })

  }
  
  formatValue(value : any){
   return value.toLocaleString('en-US') ;
  }

  resetQuote(){
    this.disableTenor = false;
    this.isValueDisable = false ;
    this.sellAmountReadOnly = false;
    this.disableSellAmountField = false;
    this.buyAmount = "";
    this.form.reset();
    this.exchangeRate = "" ;
    this.isDisabledGetQuote = true;
    this.bookNowDisabled = true;
    clearInterval(this.runningTimer);
    this.showStaticTimer = true;
    this.showRunningTimer = false;
  }

sellValue : any;
buyValue : any;


  changeSellingAmount(value : any ,e:any ) {
    console.log(value) ;
  if(value != ""){
    this.buyAmount = value ;
  
    this.sellValue = value;
    if(this.startDate != "No Value" && this.endDate !=  "No Value"){
      this.isDisabledGetQuote = false;
      //this.bookNowDisabled = false;
    }
   
   //entered value should not starts in zero
    if(value == 0 || value.startsWith(0)){
    this.isDisabledGetQuote = true;
   // this.bookNowDisabled = true;
   }
  
   const myNumber = value;
  // const hasDecimal = myNumber.indexOf('.') !== -1; //checking my entered value containes decimal point or not .
   const myVariable = value;
   const hasAlphabets = /[a-zA-Z]/.test(myVariable); //checking my entered value containes alphabet or not .

   if(hasAlphabets == true || myNumber.endsWith(".")){
    this.isDisabledGetQuote = true;
   }
  //  if(hasDecimal == false && hasAlphabets == false){
  //   this.isDisabledGetQuote = false;
  //  }

   if(value == ""){
    this.sellValue = "";
    this.isDisabledGetQuote = true;
   // this.bookNowDisabled = true;
   }
  
   if(this.buyValue != undefined || this.buyValue != ""){
    this.form.patchValue({
      "buyingAmount" : ""
    })
   }
  }else{

    console.log("Your entered value is not in number") ;
    this.isDisabledGetQuote = true;
    if(value == 0){
      this.isDisabledGetQuote = true;
     // this.bookNowDisabled = true;
     }
       if(value == ""){
        this.buyValue = "";
        this.buyAmount = "";
        this.isDisabledGetQuote = true;
       // this.bookNowDisabled = true;
       }
  }
 
  }

  changeBuyingAmount(value : any,e:any){
    console.log(value) ;
    let keyCode = e.code ;
    if(keyCode.slice(0,5) == "Digit"){
    if(value != "" && this.startDate != "No Value"){
      this.buyValue = value;
      this.isDisabledGetQuote = false;
    //  this.bookNowDisabled = false;
   } 
   if(value == 0){
    this.isDisabledGetQuote = true;
   // this.bookNowDisabled = true;
   }
     if(value == ""){
      this.buyValue = "";
      this.isDisabledGetQuote = true;
     // this.bookNowDisabled = true;
     }
     
     if(this.sellValue != undefined || this.sellValue != ""){
      this.form.patchValue({
        "sellingAmount" : ""
      })
     }
    }else{
      console.log("Your entered value is not in number") ;
      if(value == 0){
        this.isDisabledGetQuote = true;
       // this.bookNowDisabled = true;
       }
         if(value == ""){
          this.buyValue = "";
          this.isDisabledGetQuote = true;
         // this.bookNowDisabled = true;
         }
    }
  }
//Book Contract
  submitContract(){
    this.loader=true;
    this.showBookNow=false;
  
    setTimeout(() => {
      const dialog = this.matDialog.open(AgentContractConfirmationComponent,{
        disableClose : true,
        data : {
                contractReview : this.counter,
                foreignCurrency : this.foreignCurrency,
                sellingAmount :  this.form.controls['sellingAmount'].value,
                buyingAmount : this.form.controls['buyingAmount'].value,
                exchangeRate : this.exchangeRate ,
                windowStatus: this.isWindowOpen //either true or false based on window.opener
        },
      }) ;
      this.loader=false;
      this.showBookNow=true;
    }, 1000);
   
  }
  timer(minute:any) {
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 0;
  
    const prefix = minute < 10 ? "0" : "";
  
     this.runningTimer = setInterval(() => {
      seconds--;
      if (statSec != 0)
       statSec--;
      else statSec = 59;
  
      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;
  
      this.counter = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
  
      if (seconds == 0) {
        clearInterval(this.runningTimer);
        this.ngOnDestroy();
      }
    }, 1000);
  }
  selectedForeignCurrency(ccyCode : any){
   console.log(ccyCode);
   this.foreignCurrency = ccyCode;
  }
  ngOnDestroy(): void {
    clearInterval(this.runningTimer);
  }

  //book contracts time range
  // timePeriodChange(e:any){
  //   this.selectedTenor = e.value ;
  // }

  //this function is unused now -> we will not open tenor dates modal dialog
  openDialog() {
    const dialogRef = this.matDialog.open(TenorDatesComponent,{
      disableClose : true ,
      data:{isTenorDateReview:true},
      width:"860px"
    });
    dialogRef.afterClosed().subscribe(result =>{
      console.log(result);
      if(result != undefined){
        const date = new Date();
        date.setDate(date.getDate() + 1) ; //for tomorrow
        this.startDate = result.startDate;
        this.startDate =this.startDate.getDate() + " " + this.months[this.startDate.getMonth()] + " " +this.startDate.getFullYear()
        this.endDate = result.endDate;
        this.endDate =this.endDate.getDate() + " " + this.months[this.endDate.getMonth()] + " " +this.endDate.getFullYear()
        if(result.endDate.toLocaleDateString() == new Date().toLocaleDateString()){
          this.selectedTenor = "TODAY";
          this.finalStartDate = "";
          this.finalendDate = "";
         
        }
        if(result.endDate.toLocaleDateString() == date.toLocaleDateString() ){
         this.selectedTenor = "TOM";
         this.finalStartDate = "";
         this.finalendDate = "";
         
        }
      //   if(result.startDate.toLocaleDateString() != result.endDate.toLocaleDateString()){
      //     this.selectedTenor = "";
      //    let start = result.startDate.toLocaleDateString();
      //    let end =  result.endDate.toLocaleDateString();
      //      // Format startDate as yyyyMMdd
      // const date = moment(start, 'MM/DD/YYYY');
      // this.finalStartDate = date.format('YYYYMMDD');
      // // Format endDate as yyyyMMdd
      // const endDate = moment(end,'MM/DD/YYYY');
      // this.finalendDate = endDate.format('YYYYMMDD');
      // console.log(this.finalendDate);
      //   }
     
      if(result.startDate.toLocaleDateString() != result.endDate.toLocaleDateString()){
        this.selectedTenor = "";
      if(result.startDate!= undefined){
        let startDate = new Date(result.startDate).getDate();
        if(startDate < 10){
          const testdate = startDate.toString();
          var finaldate : string  = testdate.padStart(2,"0");
         }
         else{
          const testdate = startDate.toString();
          var finaldate : string  = testdate;
         }

        const month = new Date(result.startDate).getMonth() + 1;
       if(month < 10){
        const testmonth = month.toString();
        var finalmonth : string  = testmonth.padStart(2,"0");
       }
       else{
        const testmonth = month.toString();
        var finalmonth : string  = testmonth;
       }
        const year = new Date(result.startDate).getFullYear();
        var finalyear = year.toString();
        this.finalStartDate =  finalyear + finalmonth + finaldate ;  //YYYMMDD
        console.log("The Start Date is "+ this.finalStartDate);
        
      }
      if(result.endDate!= undefined){
        let endDate = new Date(result.endDate).getDate();
        if(endDate < 10){
          const testdate = endDate.toString();
          var finaldate : string  = testdate.padStart(2,"0");
         }
         else{
          const testdate = endDate.toString();
          var finaldate : string  = testdate;
         }
        const month =  new Date(result.endDate).getMonth() + 1;
        if(month < 10){
          const testmonth = month.toString();
          var finalmonth : string = testmonth.padStart(2,"0");
         }
         else{
          const testmonth = month.toString();
          var finalmonth : string  = testmonth;
         }
        const year = new Date(result.endDate).getFullYear();
        var finalyear = year.toString();
        this.finalendDate =  finalyear + finalmonth + finaldate ;  //YYYMMDD
        console.log("The End Date is "+ this.finalendDate);
       }
      }
      
        if(result.oneWeekIndicator == "1W"){
          this.selectedTenor = "1W";
          this.finalStartDate = "";
          this.finalendDate = "";
        }
        if(this.startDate != undefined || this.startDate != ""){
         // const hasDecimalPoint = this.buyAmount.indexOf('.') !== -1; // newly added on 17-11-2023 ,checking  buyAmount containes decimal point or not .
          if(this.buyAmount == undefined || this.buyAmount == ""){
            this.isDisabledGetQuote = true;
          }
          else if(this.buyAmount != ""){   // newly added on 17-11-2023 ,checking  buyAmount should not empty and should not contain decimal points
            this.isDisabledGetQuote = false;
          }
         
        }
      }
      else{
        if(this.startDate != "No Value" && this.buyAmount != ""){
          this.isDisabledGetQuote = false; 
        }else{
          this.isDisabledGetQuote = true; 
        }
        console.log("throw");
      }
     
    })
  }

 
  // onChange(value: string) {
  //   if (value == 'TODAY') {  //Today
  //     let startDate = new Date().toLocaleDateString();
  //     let endDate = this.getEndDate(0).toLocaleDateString();
  //     this.start = this.datePipe.transform(startDate, 'dd/MM/yyyy');
  //     this.end = this.datePipe.transform(endDate, 'dd/MM/yyyy');
  //     this.selectedTenor = "TODAY";
  //   }
  //   else if (value == 'twoDays') {  //Current Date +2Days
  //     let startDate = new Date().toLocaleDateString();
  //     let endDate = this.getEndDate(1).toLocaleDateString();
  //     this.start = this.datePipe.transform(startDate, 'dd/MM/yyyy');
  //     this.end = this.datePipe.transform(endDate, 'dd/MM/yyyy');
      
  //     // Format startDate as yyyyMMdd
  //     const startDateParts = this.start.split('/');
  //     const year = startDateParts[2];
  //     const month = startDateParts[1].padStart(2, '0');
  //     const day = startDateParts[0].padStart(2, '0');
  //     this.finalStartDate = year + month + day;
  //     console.log(this.finalStartDate);

  //     // Format endDate as yyyyMMdd
  //     const endDateParts = this.end.split('/');
  //     const endDateyear = endDateParts[2];
  //     const endDatemonth = endDateParts[1].padStart(2, '0');
  //     const endDateday = endDateParts[0].padStart(2, '0');
  //     this.finalendDate = endDateyear + endDatemonth + endDateday;
  //     console.log(this.finalendDate);


  //   }
  //   else if (value == 'threeDays') {  //Current Date +3Days
  //     let startDate = new Date().toLocaleDateString();
  //     let endDate = this.getEndDate(2).toLocaleDateString();
  //     this.start = this.datePipe.transform(startDate, 'dd/MM/yyyy');
  //     this.end = this.datePipe.transform(endDate, 'dd/MM/yyyy');
      
  //     // Format startDate as yyyyMMdd
  //     const startDateParts = this.start.split('/');
  //     const year = startDateParts[2];
  //     const month = startDateParts[1].padStart(2, '0');
  //     const day = startDateParts[0].padStart(2, '0');
  //     this.finalStartDate = year + month + day;
  //     console.log(this.finalStartDate);

  //     // Format endDate as yyyyMMdd
  //     const endDateParts = this.end.split('/');
  //     const endDateyear = endDateParts[2];
  //     const endDatemonth = endDateParts[1].padStart(2, '0');
  //     const endDateday = endDateParts[0].padStart(2, '0');
  //     this.finalendDate = endDateyear + endDatemonth + endDateday;
  //     console.log(this.finalendDate);


  //   }
  //   else if (value == 'TOM') {    //Tomorrow
  //     const date = new Date();
  //     date.setDate(date.getDate() + 1).toLocaleString();
  //     let startDate = date.toLocaleDateString();
  //     let endDate = date.toLocaleDateString();
  //     this.start = this.datePipe.transform(startDate, 'dd/MM/yyyy');
  //     this.end = this.datePipe.transform(endDate, 'dd/MM/yyyy');
  //     this.selectedTenor = "TOM";
  //     this.finalendDate = '';
  //     this.finalStartDate = '';

  //   } else if (value == '1W') {      //1 Week
  //     let startDate = new Date().toLocaleDateString();
  //     let endDate = this.getEndDate(3).toLocaleDateString();
  //     this.start = this.datePipe.transform(startDate, 'dd/MM/yyyy');
  //     this.end = this.datePipe.transform(endDate, 'dd/MM/yyyy');
  //     this.selectedTenor = "1W";
  //     this.finalendDate = '';
  //     this.finalStartDate = '';
  //   }

  // }

  getEndDate(numDays:any) {
    const date = new Date();
    date.setDate(date.getDate() + numDays);
    let count = 0;
    while (count < numDays) {
      if (date.getDay() != 0 && date.getDay() != 6) {
        count++;
      }
      if (date.getDay() == 6) {
        date.setDate(date.getDate() + 2);
      }
      else{
        if(count == 2){
          date.setDate(date.getDate());
        }
        else{
          date.setDate(date.getDate() + 1);
        }
      }
     
    }
    return date;
  }

}



