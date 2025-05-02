
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { RemitMoney } from 'src/app/payee/payeeModel/remit-money';
import { PayeeService } from 'src/app/payee/service/payee.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

import { CancelDialogComponent } from 'src/app/shared/modals/cancel-dialog.component';

import { DatePipe } from '@angular/common';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { CorporateCustomerInquiry } from 'src/app/core/model/corporatecustomerinquiry/corporatecustomerinquiry';
import { CorporateService } from 'src/app/core/services/corporate.service';
import { relationArr, sharingTypeValue } from 'src/assets/dropdownvalues';


@Component({
  selector: 'app-corporate-deal-review-transaction',
  templateUrl: './corporate-deal-review-transaction.component.html',
  styleUrls: ['./corporate-deal-review-transaction.component.scss']
})
export class CorporateDealReviewTransactionComponent implements OnInit {

  sendMoney:RemitMoney[]=[];
  customerSends : any;
  payeeCurrencyCode !: string;
  customerName !: string;
  payeeName !: string;
  remarks !: string;
  payeeId : any;
  exchangeRate : any;
  customerPhone !: string;
  payeeCountry !: string;
  payeePhoneNo : any;
  customerAccountNo : any;
  payeeAccountNumber : any;
  customerType !: string;
  adminFee : any ;
  totalAmount: any ;
  customerInquiry: CorporateCustomerInquiry = new CorporateCustomerInquiry();
  payeeSearch : any ;
  initatedDate !: any;
  showSubmitButton : boolean = true;
  submitButtonLoader : boolean = false;
  transactionDate : any ;
  payeeGets : any ; //newly added on 16 Nov , This payeeGets value will mapped into sendAmountF element in request payload (Add Txn)
  amountEnteredIndicator !: string ;
  customerId !: string ;
  sharingType !: string ;
  displaySharingType !: string ;
  sharingTypeValues = sharingTypeValue ;
  relationshipCode = "" ;
  relationArray : any[] = relationArr ;
  relationship = "" ;


  constructor(private router: Router,private payeeService:PayeeService,private route: ActivatedRoute,private store: InMemoryCache,
   private dialogRef : MatDialog,private headerService : TitleHeaderService,private corporateService: CorporateService,private datePipe : DatePipe,
   private dialog : MatDialog) { }

  ngOnInit(): void {
    this.headerService.setTitle('Review and Submit');
    console.log("Review") ;
   this.transactionDate =  this.store.getItem("TRANSACTION_DATE") ;

   //Activated Route params , getting values from route params .
   this.route.queryParams.subscribe((params: any)=> {
    console.log(params) ;
   this.customerSends = (params.customer_sends).replace(/,/g, '');
   this.payeeCurrencyCode = params.fyc;
   this.store.setItem('PAYEE_NAME_ADMIN',this.payeeName);
   this.remarks = params.remarks ? params.remarks : "Remarks not provided" ;
  })
 
  this.payeeId = this.store.getItem('PAYEE__ID');
  this.exchangeRate = this.store.getItem('ORG_EXCHANGE_RATE');
  this.payeePhoneNo = this.store.getItem('PAYEE_PHONENUMBER');
  this.customerType = "C";

    let receiptObject = JSON.parse(this.store.getItem('CORP_TXN_RECEIPT_OBJECT'));
    this.adminFee = receiptObject.ADMIN_FEE ;

    this.sharingType = receiptObject.SHARINGTYPE ? receiptObject.SHARINGTYPE : "" ;
    if(this.sharingType == "1"){ //Its SHA
     this.displaySharingType = this.sharingTypeValues[0].shared ;
    }
    else if(this.sharingType == "2"){ //Its OUR
      this.displaySharingType = this.sharingTypeValues[0].our  ;
    }
    else if(this.sharingType == "3"){ // Its BEN
      this.displaySharingType = this.sharingTypeValues[0].they ;
    }
    else { // Its empty string , so it must be currencies like MYR or THB or IDR .
      this.displaySharingType = this.sharingTypeValues[0].our  ;
      this.sharingType = "2" ;
    }

    this.totalAmount = parseFloat(this.customerSends) +  parseFloat(this.adminFee) ;
    this.store.setItem('TOTALSENDAMOUNT',this.totalAmount);
    this.customerId  = receiptObject.CUSTOMER_ID ;
    var payeeId : string = receiptObject.PAYEE_ID ;
    this.payeeGets = receiptObject.AMOUNT_IN_FCY ? receiptObject.AMOUNT_IN_FCY : "" ;
  
    //CUSTOMER INQUIRY API CALL 
    this.corporateService.getCorporateCustomerInquiry(this.customerId).subscribe(data => {
      this.customerInquiry = data;
      let customerDetails = JSON.stringify(this.customerInquiry);
      this.store.setItem('CUSTOMER_DETAILS', customerDetails); 
      this.customerName = this.customerInquiry.companyName ? this.customerInquiry.companyName : "" ;
      this.customerPhone = this.customerInquiry.phone.phoneNo ? this.customerInquiry.phone.phoneNo : "" ;
   
    },
    //error handling completed 
  (error:any)=>{
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent) ;
    }
  }
    ) ;
    //PAYEE SEARCH API CALL 
    this.payeeService.viewPayee(this.customerId,payeeId).subscribe((datas:any)=>{
      this.payeeSearch = datas['data'];
      let payeeDetails = JSON.stringify(this.payeeSearch);
      this.store.setItem('PAYEE_DETAILS', payeeDetails); 
      this.payeeName = this.payeeSearch[0].NAME;
      this.payeeCountry = this.payeeSearch[0].COUNTRY;
      this.payeeAccountNumber = this.payeeSearch[0].ACCOUNTNBR;
      this.relationshipCode = this.payeeSearch[0].RELATIONSHIP ? this.payeeSearch[0].RELATIONSHIP : "" ;
      if(this.relationshipCode != ""){
        this.relationship = this.getRelationDescription(this.relationshipCode) ;
        this.store.setItem('CORP_DEAL_RELATIONSHIP', this.relationship) ;
      }

    },
    
     //error handling - completed
     (error:any) => { 
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
    })
    
   
   
   
  }

  onSubmit(){
    this.showSubmitButton = false;
    this.submitButtonLoader = true;
    var date = new Date() ;
    this.initatedDate = this.datePipe.transform(date, 'd MMMM yyyy, h:mm a');
    this.store.setItem("TRANSACTION_INITIATED_DATE",this.initatedDate);
    this.store.setItem('REMARKS', this.remarks ) ;
    //retrieving the amountEnteredIndicator == L or F ;
      this.amountEnteredIndicator = this.store.getItem('AMOUNT_ENTERED_INDICATOR') ? this.store.getItem('AMOUNT_ENTERED_INDICATOR') : "" ;

      this.corporateService.sendMoney(this.buildAddTransaction(),this.customerId).subscribe(data => { 
      this.sendMoney = data;
      this.showSubmitButton = true;
      this.submitButtonLoader = false;
      this.store.setItem('REF_ID',data.transactionId);
      this.store.setItem('QR',data.qrCode); //storing QR binary from response
      this.store.removeItem('QR_EXPIRED');
      this.router.navigate(['payee/corporate-deal-qr']) ;
      },
      //error handling done on 03/07/2023
     (error:any) =>{
      this.showSubmitButton = true;
      this.submitButtonLoader = false;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
    }
      );

  }
  buildAddTransaction(){
    return new RemitMoney({
     "customerType" : this.customerType,
     "payeeId" : this.payeeId,
     "sendAmount" : this.customerSends,
     "sendCurrencyCode" : this.payeeCurrencyCode,
     "orgExchRate" : this.exchangeRate,
     "remarks" : this.remarks,
     "isMocked" : false,
     "sendAmountF" : this.payeeGets ,
     "amountEnteredIndicator" : this.amountEnteredIndicator ,
     "sharingType" : this.sharingType,
     "forexBookingType" : "D" //'D'--> Its initiating transaction Without contract ..
    })
  }
  backSendMoney(){
      this.dialogRef.open( CancelDialogComponent,{
       data : {reviewedBy : 'CORPORATE'},
        width : "500px"
      })
  }


  getRelationDescription(code: string): string {
    let relationship = this.relationArray.find(item => item.CODE === code);
    return relationship ? relationship.RELATION : ""; // Fallback to code if no match is found
  }

}

