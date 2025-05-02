import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { TransactionData } from 'src/app/dashboards/model/approveddashboard';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

import { AgentServiceService } from '../../agent-service.service';
import { AcknowledgeTransactionComponent } from '../../modals/acknowledge-transaction/acknowledge-transaction.component';
import { OrganizationRemittance } from '../../models/agent.model';
import { AgentReceiptComponent } from '../../modals/transfer-receipt/agent-receipt.component';
import { DatePipe } from '@angular/common';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { CustomerInquiry } from 'src/app/core/model/Customer Inquiry/customer-inquiry';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { getBackgroundColor, getColor } from 'src/assets/transactionstatus';

@Component({
  selector: 'app-organization-initiated',
  templateUrl: './organization-initiated.component.html',
  styleUrls: ['./organization-initiated.component.scss', '../../../../assets/styles/tables/table-style.scss' ],
})
export class OrganizationInitiatedComponent implements OnInit {

  p: number = 1;
  itemsPerPage: number = 20; 
  @Input() checkStatus !: string;
  organizationRemittance : TransactionData[] = [];
  isDisable !: Boolean;
  loader : Boolean = false;
  customerInquiry : CustomerInquiry = new CustomerInquiry();
  remittanceDetails : any ;

  constructor(private dialog : MatDialog,private agentService: AgentServiceService,private store : InMemoryCache,private datePipe: DatePipe,
    private customerSearchService : CustomerSearchService) { }

    
    handlePageChange(event: any): void {
      this.p = event.pageIndex + 1;
    }

  ngOnInit(): void {
    let agentId = this.store.getItem('USER_ID');
    if(this.checkStatus == "fulfillment"){
      this.loader = true;
      this.isDisable = false;
      setTimeout(() => {
        this.agentService.getOrgInitiatedTransactions(agentId,'3,6').subscribe((datas:any) =>{
          this.organizationRemittance = datas['data'];
          console.log(this.organizationRemittance);
          this.loader = false;
        },
         //error handling completed on 05-07-2023
      (error:any)=>{
        this.loader = false;
        this.isDisable = false ;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent) ;
        }
      }
        )
      }, 400);
   
  }
  if(this.checkStatus == "history"){
    this.isDisable = true;
    this.loader = true;
    setTimeout(() => {
      this.agentService.getOrgInitiatedTransactions(agentId,'7,6').subscribe((datas:any) =>{
        this.organizationRemittance = datas['data'];
        this.loader = false;
        console.log(this.organizationRemittance);
      },
       //error handling completed on 05-07-2023
    (error:any)=>{
      this.loader = false;
      this.isDisable = true;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
    }
      )
    }, 400);
   
  }
   //getScreenWidth and getScreenHeight will get the windows inner height and width.
   this.getScreenWidth = window.innerWidth;
   this.getScreenHeight = window.innerHeight;
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
  changeTableHeight() {
    return { 'height': (this.getScreenHeight - 165) + 'px', 'overflow-y': 'auto' };
  }
  openDialog(transactionId:string,senderName:string,payeeName:string,accountNo:string,payeeBank:string,swiftCode:string,payeeCountry:string,txnStatus:string){
    this.dialog.open(AcknowledgeTransactionComponent, {
      data: { isreview: true ,transactionId:transactionId , accountTitle: senderName,payeeName:payeeName, accountNumber: accountNo, payeeBank:payeeBank,swiftCode:swiftCode,payeeCountry:payeeCountry,transactionStatus : txnStatus },
      panelClass: 'custom-modalbox',
      width:'400px',
      height: '500px',
    })
    .afterClosed().subscribe(res => {
      console.log(res);
      if(res.status == "ACKNOWLEDGED" || res.status == "DEPOSITED"){
        this.loader = true;
        let agentId = this.store.getItem('USER_ID');
        setTimeout(() => {
          this.agentService.getOrgInitiatedTransactions(agentId,'3,6').subscribe((datas:any) =>{
            this.organizationRemittance = datas['data'];
            this.loader = false;
            console.log(this.organizationRemittance);
          },
            //error handling completed on 05-07-2023
  (error:any)=>{
    this.loader = false;
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent) ;
    }
  }
          )  
        }, 2000);
      }
    })
  }
   //STATUS color diff
   getColor(value: any) {
    return getColor(value);
    }
  
  //bg color for status tags .
  getBackgroundColor(status: string): string {
    return getBackgroundColor(status)
    }
    
  openRecieptDialog(transactionId:string,senderName:string,payeeName:string,accountNo:string,payeeBank:string,swiftCode:string,payeeCountry:string,txnStatus:string,amountRecieved : string
    ,agentExchangeRate : string,sendCcy : string , orgCommision : string,branchAddress :string,customerIdNbr : string ,beneficiaryAddress : string,beneficiaryState : string ,beneficiaryCountry : string ,
    customerPhnNumber : string,updateDate : string,customerDob : string,customerNationality : string,
    customerType : string,customerId : string,remarks:string,amount:string,dealRate:string,dealId:string, amountSentF : any, forexBookingType:any, routingCode:string,relationship:string){
    const date = updateDate;

const formattedDate = this.datePipe.transform(date, 'd MMMM yyyy, h:mm a');
console.log(formattedDate);


if(customerType == "I" || customerType == "C"){
  var payeeGets : any  ;
  if(amountSentF == 0 || amountSentF == null || amountSentF == 0.00){
   payeeGets = this.calculatePayeeGets(amount,dealRate)
  }
  else{
  payeeGets = amountSentF ;
   }
  this.customerSearchService.getCustomerInquiry(customerId).subscribe(data => {
    this.customerInquiry = data;

    let remittanceDetails = {
      "transactionId": transactionId,
      "customerName" : senderName,
      "beneficiaryName" : payeeName,
      "accountNo": accountNo,
      "bankName" : payeeBank,
      "swiftCode": swiftCode,
      "payeeCountry": payeeCountry,
      "transactionStatus": txnStatus,
      "baseAmount" : amountRecieved,
      "exchangeRate": agentExchangeRate,
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
      "customerInq" : this.customerInquiry,
      "remarks" : remarks,
      "payeeGets" : payeeGets,
      "customerType": customerType,
      "initiatedBy" : "ORG-AGENT",
      "dealRate" : dealRate,
      "amountConsumed":amount,
      "dealId" : dealId,
      "hideCharges" : "hideCharges", //newly added on 17 Nov 2023 , To hide charges column when Agent open receipt dialog from APT initiated tab
      "forexBookingType" : forexBookingType,
      "routingCode" : routingCode ? routingCode : "",
      "relationship":relationship ? relationship :""
     } 
     this.dialog.open(AgentReceiptComponent,{
       height : '850px',
       width : '1000px' ,
       panelClass: 'custom-modalbox',
       data : remittanceDetails,
       autoFocus: false, //prevent scroll to centre .
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

  //this else if block will never execute because we will get only customerType == "I" in organisation initiated component
  // else if(customerType == "A"){
  //   // this.customerInquiry.customerId = "";
  //   // this.customerInquiry.demographics.dateOfBirth = "" ;
  //   // this.customerInquiry.demographics.nationality = "" ;
  //   this.remittanceDetails = {
  //     "transactionId": transactionId,
  //     "customerName" : senderName,
  //     "beneficiaryName" : payeeName,
  //     "accountNo": accountNo,
  //     "bankName" : payeeBank,
  //     "swiftCode": swiftCode,
  //     "payeeCountry": payeeCountry,
  //     "transactionStatus": txnStatus,
  //     "baseAmount" : amountRecieved,
  //    // "exchangeRate": orgExchangeRate,
  //     "foreignCurrency": sendCcy,
  //     "charges" : orgCommision,
  //     "branchName": branchAddress,
  //     "nricId":customerIdNbr,
  //     "beneficiaryAddress":beneficiaryAddress,
  //     "beneficiaryState":beneficiaryState,
  //     "beneficiaryCountry":beneficiaryCountry,
  //     "customerPhoneNumber": customerPhnNumber,
  //     "updateDate":formattedDate,
  //     "customerDob":customerDob,
  //     "customerNationality":customerNationality,
  //    // "remarks" : remarks,
  //     "customerId" : customerId ,
  //     "customerInq" : this.customerInquiry,
  //     "payeeGets" : payeeGets,
  //     "customerType": customerType,
  //    } 
  //    this.dialog.open(AgentReceiptComponent,{
  //     height : '850px',
  //     panelClass: 'custom-modalbox',
  //     data : this.remittanceDetails,
  //     autoFocus: false, //prevent scroll to centre 
  // })
  // }
  
}

calculatePayeeGets(amount: string, rate: string): string {
  const amountValues : any[] = amount.split(',').map(value => parseFloat(value)); // spilt amount and change string to numbers
  const rateValues : any[] = rate.split(',').map(value => parseFloat(value));    // spilt rate and change string to numbers

  const payeeValues : any[] = amountValues.map((amt, index) => amt * rateValues[index]); // calucaltae payee gets based on corresponding amount & rate

  const payeeGets = payeeValues.reduce((total, value) => total + value); // total payeegets amount

  return payeeGets;
}
}
