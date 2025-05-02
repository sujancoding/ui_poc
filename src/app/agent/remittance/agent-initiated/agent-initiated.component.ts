import { Component, HostListener, Input, OnInit } from '@angular/core';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { TransactionData } from 'src/app/dashboards/model/approveddashboard';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

import { AgentServiceService } from '../../agent-service.service';
import { AgentRemittance } from '../../models/agent.model';
import { DatePipe } from '@angular/common';
import { CustomerInquiry } from 'src/app/core/model/Customer Inquiry/customer-inquiry';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { MatDialog } from '@angular/material/dialog';
import { AgentReceiptComponent } from '../../modals/transfer-receipt/agent-receipt.component';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { getBackgroundColor, getColor } from 'src/assets/transactionstatus';

@Component({
  selector: 'app-agent-initiated',
  templateUrl: './agent-initiated.component.html',
  styleUrls: ['./agent-initiated.component.scss', '../../../../assets/styles/tables/table-style.scss'],
})
export class AgentInitiatedComponent implements OnInit {

  p: number = 1;
  itemsPerPage: number = 20;
  @Input() checkStatus !: string;
  agentRemittance : TransactionData[]=[];
  customerInquiry : CustomerInquiry = new CustomerInquiry() ;
  remittanceDetails : any ;
  loader : boolean = false;

  constructor(private agentService: AgentServiceService,private store : InMemoryCache,
    private datePipe : DatePipe,private customerSearchService : CustomerSearchService,
    private dialog : MatDialog) { }

    handlePageChange(event: any): void {
      this.p = event.pageIndex + 1;
    }

  ngOnInit(): void {
    let customerId = this.store.getItem('USER_ID');
    if(this.checkStatus == "fulfillment"){
      this.loader = true;
      setTimeout(() => {
        this.agentService.getAgentInitiatedTransactions(customerId,'3,1,6,5').subscribe((datas:any) =>{
       
          console.log("Changes: " + datas['data']);
          this.agentRemittance = datas['data'];
          console.log(this.agentRemittance);
          this.loader = false;
        },
        //error handling completed on 05-07-2023
      (error:any)=>{
        this.loader = false;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent) ;
        }
      }
        )
      }, 400);
   
  }
  if(this.checkStatus == "history"){ //9 = BANK COMPLETED , 10 = BANK APPROVED //12 = BANK COMPLETE WITH CHANGE
    // 8 = FAILED AT BANK , 20 = CANCELLED 
    this.loader = true;
    setTimeout(() => {
      this.agentService.getAgentInitiatedTransactions(customerId,'9,10,12,8,20').subscribe((datas:any) =>{
       
        console.log("Changes: " + datas['data']);
        this.loader = false;
          this.agentRemittance = datas['data'];
          datas['data'].filter((v:any) => { if( v.TXNSTATUS == "BANK APPROVED"){return v.TXNSTATUS = "SUCCESSFUL";} })
          datas['data'].filter((v:any) => { if( v.TXNSTATUS == "BANK COMPLETED"){return v.TXNSTATUS = "SUCCESSFUL";} })
          datas['data'].filter((v:any) => { if( v.TXNSTATUS == "BANK COMPLETE WITH CHANGE"){return v.TXNSTATUS = "SUCCESSFUL";} })
          datas['data'].filter((v:any) => { if( v.TXNSTATUS == "FAILED AT BANK"){return v.TXNSTATUS = "FAILED";} })
          datas['data'].filter((v:any) => { if( v.TXNSTATUS == "CANCELLED"){return v.TXNSTATUS = "CANCELED";} })
          console.log(this.agentRemittance);
        },
         //error handling completed on 05-07-2023
      (error:any)=>{
        this.loader = false;
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
  //STATUS color diff
  getColor(value: any) {
    return getColor(value);
    }
  
  //bg color for status tags .
  getBackgroundColor(status: string): string {
    return getBackgroundColor(status)
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

  openRecieptDialog(transactionId:string,senderName:string,payeeName:string,accountNo:string,payeeBank:string,swiftCode:string,payeeCountry:string,txnStatus:string,amountRecieved : string
    ,agentExchangeRate : string,sendCcy : string , orgCommision : string,branchAddress :string,customerIdNbr : string ,beneficiaryAddress : string,beneficiaryState : string ,beneficiaryCountry : string ,
    customerPhnNumber : string,updateDate : string,customerDob : string,customerNationality : string,
    customerType : string,customerId : string,remarks:string,originatedRemitter : string,amount:string,contractRate:string, amountSentF : any,contractId:string, purposeOfRemittance:any, sharingType:string, routingCode : string,relationship:string){
    const date = updateDate;

// var payeeGets = this.calculatePayeeGets(amount,contractRate);
var payeeGets : any = amountSentF ; //new change on 15 Nov 2023 , PAYEE GETS VALUE 
if(amountSentF == 0 || amountSentF == null || amountSentF == 0.00){
  payeeGets = this.calculatePayeeGets(amount,contractRate);
 }
const formattedDate = this.datePipe.transform(date, 'd MMMM yyyy, h:mm a');
console.log(formattedDate);

 if(customerType == "A"){
    this.remittanceDetails = {
      "transactionId": transactionId,
      "customerName" : senderName,
      "beneficiaryName" : payeeName,
      "accountNo": accountNo,
      "bankName" : payeeBank,
      "swiftCode": swiftCode ? swiftCode: "",
      "payeeCountry": payeeCountry,
      "transactionStatus": txnStatus,
      "baseAmount" : amountRecieved,
      "amountSentF" : amountSentF, 
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
      "remarks" : remarks,
      "customerId" : customerId ,
      "customerInq" : this.customerInquiry,
      "originatedRemitter" : originatedRemitter,
      "payeeGets" : payeeGets,
      "customerType": customerType,
      "contractRate" : contractRate,
      "contractId" : contractId,
      "amountConsumed" : amount,
      "purposeOfRemittance" : purposeOfRemittance ? purposeOfRemittance : "",
      "sharingType" : sharingType ? sharingType : "",
      "routingCode" : routingCode ? routingCode : "",
      "relationship": relationship ? relationship : ""
     } 
     this.dialog.open(AgentReceiptComponent,{
      height : '850px',
      panelClass: 'custom-modalbox',
      data : this.remittanceDetails,
      autoFocus: false, //prevent scroll to centre 
  })
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
