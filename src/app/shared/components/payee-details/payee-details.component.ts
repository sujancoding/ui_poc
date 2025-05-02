import { Component, HostListener, Input, OnChanges, OnInit } from '@angular/core';
import { TransactionData } from 'src/app/dashboards/model/approveddashboard';
import { InMemoryCache } from '../../services/cache.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AgentReceiptComponent } from 'src/app/agent/modals/transfer-receipt/agent-receipt.component';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { CustomerInquiry } from 'src/app/core/model/Customer Inquiry/customer-inquiry';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { SharingTypeArray } from 'src/app/core/model/admintxnreceipt/admintxnreceipt.model';
import { sharingTypeValue } from 'src/assets/dropdownvalues';

@Component({
  selector: 'app-payee-details',
  templateUrl: './payee-details.component.html',
  styleUrls: ['./payee-details.component.scss']
})
export class PayeeDetailsComponent implements OnInit , OnChanges{
  @Input() transactionDetails : any;
  transaction !: TransactionData[];
  amountRecieved !: number;
  loader : Boolean = false;
  public getScreenWidth: any;
  public getScreenHeight: any;
  showContractInfo = false ;
  showDealInfo = false ;
  dealId1 : any ;
  dealId2 : any ;
  rate1 : any ;
  rate2 : any ;
  contractId1 : any ;
  contractId2 : any ;
  c_rate1 : any ;
  c_rate2 : any ;
  customerInquiry: CustomerInquiry = new CustomerInquiry();
  isDisable : boolean = false;
  remittanceDetails : any
  displaySharingType : string = "" ;
  sharingTypeValues : SharingTypeArray[] = sharingTypeValue ;
  paymentMode : string = ""

  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }
  constructor(private dialog : MatDialog, private datePipe : DatePipe,private customerSearchService: CustomerSearchService) { 
  }
  ngOnChanges(): void {
    this.loader = true;
    setTimeout(() => {
      this.transaction = this.transactionDetails ? this.transactionDetails : [];
      if(this.transaction.length != 0){
      let txnArray: any[] = this.transactionDetails;
      let sharingType = txnArray[0].SHARINGTYPE ? txnArray[0].SHARINGTYPE : "" ; // Payment mode for charges . 
      if(sharingType != ""){
        if(sharingType == "1"){ //Its SHA
          this.displaySharingType = this.sharingTypeValues[0].shared ;
         }
        else if(sharingType == "2"){ //Its OUR
           this.displaySharingType = this.sharingTypeValues[0].our ;
         }
        else if(sharingType == "3"){ // Its BEN
           this.displaySharingType = this.sharingTypeValues[0].they ;
         }
       else { // Its empty string , so it must be currencies like MYR or THB or IDR .
           this.displaySharingType = this.sharingTypeValues[0].our ;
         }
      }
      if(txnArray.length != 0){
      let customerType = txnArray[0].CUSTOMERTYPE;
      // if(customerType == "C"){
      //    this.isDisable= true;
      // }
      // else{
      //   this.isDisable= false;
      // }
      let foreignCcy = txnArray[0].SENDCCY;
      //DEALS
      let deals = txnArray[0].DEALID ? txnArray[0].DEALID : "";
      let dealRates = txnArray[0].DEALRATE ? txnArray[0].DEALRATE : "";
      var [deal1, deal2] = deals.split(",");
      var [rate1, rate2] = dealRates.split(",");

      this.dealId1 = deal1 ? deal1 : "Nil";
      this.dealId2 = deal2 ? deal2 : "Nil";

      this.rate1 = rate1 ? rate1 : "Nil";
      this.rate2 = rate2 ? rate2 : "Nil";

        //CONTRACTS
        let contracts = txnArray[0].CONTRACTID ? txnArray[0].CONTRACTID : "";
        let contractRates = txnArray[0].CONTRACTRATE ? txnArray[0].CONTRACTRATE : "";
        var [contract1, contract2] = contracts.split(",");
        var [c_rate1, c_rate2] = contractRates.split(",");
  
        this.contractId1 = contract1 ? contract1 : "Nil";
        this.contractId2 = contract2 ? contract2 : "Nil";
  
        this.c_rate1 = c_rate1 ? c_rate1 : "Nil";
        this.c_rate2 = c_rate2 ? c_rate2 : "Nil";

      let dealId = txnArray[0].DEALID ? txnArray[0].DEALID : "";
      let contractId = txnArray[0].CONTRACTID ? txnArray[0].CONTRACTID : "";
      //Individual Customer
      if (customerType == "I" || (customerType == "C" && txnArray[0].FOREXBOOKINGTYPE == "D")) {
          if (dealId != "") {
            this.showDealInfo = true;
            this.showContractInfo = false;
          }
          else if(contractId != "") {
            this.showDealInfo = false;
            this.showContractInfo = true;
          }
       
      }
      //Corporate Customer    
      if (customerType == "C" && txnArray[0].FOREXBOOKINGTYPE != "D") {
          if (contractId != "") {
            this.showContractInfo = true;
            this.showDealInfo = false;
          }
      }

      //Agent Customer    
      if (customerType == "A") {
          if (contractId != "") {
            this.showContractInfo = true;
            this.showDealInfo = false;
          }
      }
// in payee details showing payment mode after Amount received.
      let paymentMode =txnArray[0].PAYMENTMODE ? txnArray[0].PAYMENTMODE : ""
      if(paymentMode == "PN"){
        this.paymentMode = "PayNow";
      }
      else if(paymentMode == "CH"){
        this.paymentMode = "Cash";
      }
      else{
        this.paymentMode = "";
      }
    }
  }
      this.loader = false;
    }, 500);
  }
  ngOnInit(): void {
   //getScreenWidth and getScreenHeight will get the windows inner height and width.
   this.getScreenWidth = window.innerWidth;
   this.getScreenHeight = window.innerHeight;

  }
  responsiveCard(){
    return { 'background-color': 'white', 'position': 'relative',
    'margin-top': '11px','width': '90%', 'height': (this.getScreenHeight - 245) + 'px',
    'box-shadow': '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12) !important',
    'border': '1px solid #d1d1d1' , 'border-radius':'11px',
    'top':'-10px'
  }
  }  
  contentScrollable(){
    return {'height': (this.getScreenHeight - 395)+'px','overflow-y': 'auto','position':'relative','top':'25px','opacity':'2'}
  }

  openRecieptDialog(transactionId:string,senderName:string,payeeName:string,accountNo:string,payeeBank:string,swiftCode:string,payeeCountry:string,txnStatus:string,amountRecieved : string
    ,orgExchangeRate : string,sendCcy : string , orgCommision : string,branchAddress :string,customerIdNbr : string ,beneficiaryAddress : string,beneficiaryState : string ,beneficiaryCountry : string ,
    customerPhnNumber : string,updateDate : string,customerDob : string,customerNationality : string,remarks : string,
    customerId : string,customerType : string){
    const date = updateDate;

const formattedDate = this.datePipe.transform(date, 'd MMMM yyyy, h:mm a');
console.log(formattedDate);
if(customerType == "I" || customerType == "C"){
  this.customerSearchService.getCustomerInquiry(customerId).subscribe(data => {
    this.customerInquiry = data;
    this.remittanceDetails = {
      "transactionId": transactionId,
      "customerName" : senderName,
      "beneficiaryName" : payeeName,
      "accountNo": accountNo,
      "bankName" : payeeBank,
      "swiftCode": swiftCode,
      "payeeCountry": payeeCountry,
      "transactionStatus": txnStatus,
      "baseAmount" : amountRecieved,
      "exchangeRate": orgExchangeRate,
      "foreignCurrency": sendCcy,
      "charges" : orgCommision,
      "branchName": branchAddress,
      "nricId":customerIdNbr,
      "beneficiaryAddress":beneficiaryAddress,
      "beneficiaryState":beneficiaryState,
      "beneficiaryCountry":beneficiaryCountry,
      "customerPhoneNumber": customerPhnNumber,
      "updateDate":formattedDate,
      "customerDob":customerDob,
      "customerNationality":customerNationality,
      "remarks" : remarks,
      "customerId" : customerId ,
      "customerInq" : this.customerInquiry
     } 
     this.dialog.open(AgentReceiptComponent,{
      height : '850px',
      panelClass: 'custom-modalbox',
      data : this.remittanceDetails,
      autoFocus: false, //prevent scroll to centre 
 })
  },
   //error handling completed in 30-06-2023
   (error:any)=>{
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent) ;
    }
  }
  ) ;
}
else if(customerType == "A"){
  this.customerInquiry.customerId = "";
  this.customerInquiry.demographics.dateOfBirth = "" ;
  this.customerInquiry.demographics.nationality = "" ;
  this.remittanceDetails = {
    "transactionId": transactionId,
    "customerName" : senderName,
    "beneficiaryName" : payeeName,
    "accountNo": accountNo,
    "bankName" : payeeBank,
    "swiftCode": swiftCode,
    "payeeCountry": payeeCountry,
    "transactionStatus": txnStatus,
    "baseAmount" : amountRecieved,
    "exchangeRate": orgExchangeRate,
    "foreignCurrency": sendCcy,
    "charges" : orgCommision,
    "branchName": branchAddress,
    "nricId":customerIdNbr,
    "beneficiaryAddress":beneficiaryAddress,
    "beneficiaryState":beneficiaryState,
    "beneficiaryCountry":beneficiaryCountry,
    "customerPhoneNumber": customerPhnNumber,
    "updateDate":formattedDate,
    "customerDob":customerDob,
    "customerNationality":customerNationality,
    "remarks" : remarks,
    "customerId" : customerId ,
    "customerInq" : this.customerInquiry
   } 
   this.dialog.open(AgentReceiptComponent,{
    height : '850px',
    panelClass: 'custom-modalbox',
    data : this.remittanceDetails,
    autoFocus: false, //prevent scroll to centre 
})
}
 
}

//STATUS color diff
getColor(value: any) {
  switch (value) {
    case 'INITIATED':
      return '#FF5E3A';
    case 'DEPOSITED':
      return 'rgb(104 104 104)';
    case 'APPROVED':
      return '#14804A';
    case 'ACKNOWLEDGED':
      return '#3E8DA6';
    case 'AMOUNT RECEIVED':
      return '#AA5B00'
    case 'PENDING':
      return '#83349F'
    case 'PAYMENT RECEIVED':
      return '#129D57'
    case 'FAILED AT BANK':
      return '#FB5B5B'
    case 'BANK COMPLETED':
      return '#14804A'
    case 'BANK APPROVED':
      return 'rgb(33 129 203)'
    case 'BANK COMPLETE WITH CHANGE':
      return '#14804A'
    case 'CANCELLED':
      return '#D32E38'
    case 'BANK REQUEST RECEIVED':
      return '#AA5B00'
    default:
        return '';
  }
}
//bg color for status tags .
getBackgroundColor(status: string): string {
  switch (status) {
    case 'INITIATED':
      return '#F3F3F3';
    case 'DEPOSITED':
      return 'rgb(242 242 242)';
    case 'APPROVED':
      return '#E1FCEF';
    case 'ACKNOWLEDGED':
      return '#FFFCE0';
    case 'AMOUNT RECEIVED':
      return '#FCF2E6'
    case 'PENDING':
      return '#FFECFF'
    case 'PAYMENT RECEIVED':
      return '#EAEAEA'
    case 'FAILED AT BANK':
      return '#FFEDDF'
    case 'BANK COMPLETED':
      return '#E1FCEF'
    case 'BANK APPROVED':
      return 'rgb(224 243 255)'
    case 'BANK COMPLETE WITH CHANGE':
      return '#E1FCEF'
    case 'CANCELLED':
      return '#ECECEC'
    case 'BANK REQUEST RECEIVED':
      return '#FCF2E6'
    default:
      return '';
  }
  
}
calculatePayeeGets(amount: string, rate: string): string {
  const amountValues : any[] = amount.split(',').map(value => parseFloat(value)); // spilt amount and change string to numbers
  const rateValues : any[] = rate.split(',').map(value => parseFloat(value));    // spilt rate and change string to numbers

  const payeeValues : any[] = amountValues.map((amt, index) => amt / rateValues[index]); // calucaltae payee gets based on corresponding amount & rate

  const payeeGets = payeeValues.reduce((total, value) => total + value); // total payeegets amount

  return payeeGets;
}

}
