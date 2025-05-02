import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { RemitMoney } from 'src/app/payee/payeeModel/remit-money';
import { PayeeService } from 'src/app/payee/service/payee.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { SavedDialogBoxComponent } from '../../shared/modals/saved-dialog-box.component';
import { CancelDialogComponent } from 'src/app/shared/modals/cancel-dialog.component';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { CustomerInquiry } from 'src/app/core/model/Customer Inquiry/customer-inquiry';
import { PayeeSearch } from '../../customer/model/customer.model';
import { DatePipe } from '@angular/common';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import { relationArr, sharingTypeValue } from 'src/assets/dropdownvalues';
import { SharingTypeArray } from 'src/app/core/model/admintxnreceipt/admintxnreceipt.model';

@Component({
  selector: 'app-review-details-backoffice',
  templateUrl: './review-details-backoffice.component.html',
  styleUrls: ['./review-details-backoffice.component.scss']
})
export class ReviewDetailsBackofficeComponent implements OnInit {

  sendMoney:RemitMoney[]=[];
  customerSends : any;
  payeeCurrencyCode !: string;
  customerName !: string;
  payeeName !: string;
  remarks !: string;
  payeeId : any;
  exchangeRate : any;
  customerPhone !: number;
  payeeCountry !: string;
  payeePhoneNo : any;
  customerAccountNo : any;
  payeeAccountNumber : any;
  customerType !: string;
  adminFee : any ;
  totalAmount: any ;
  customerInquiry: CustomerInquiry = new CustomerInquiry();
  payeeSearch : PayeeSearch[] = [];
  initatedDate !: any;
  showSubmitButton : boolean = true;
  submitButtonLoader : boolean = false;
  transactionDate : any ;
  payeeGets : any ; //newly added on 16 Nov , This payeeGets value will mapped into sendAmountF element in request payload (Add Txn)
  amountEnteredIndicator !: string ;
  sharingType !: string ;
  displaySharingType !: string ;
  sharingTypeValues : SharingTypeArray[] = sharingTypeValue ;
  relationship = "" ;
  relationArr : any[] = relationArr ;
  relationshipCode = "" ;

  constructor(private router: Router,private payeeService:PayeeService,private route: ActivatedRoute,private store: InMemoryCache,
   private dialogRef : MatDialog,private headerService : TitleHeaderService,private customerSearchService: CustomerSearchService,private datePipe : DatePipe,
   private dialog : MatDialog) { }

  ngOnInit(): void {
    this.headerService.setTitle('Review and Submit');
   this.transactionDate =  this.store.getItem("TRANSACTION_DATE")
   console.log("Review onload..") ;
    let receiptObject = JSON.parse(this.store.getItem('ADMIN_TXN_RECEIPT_OBJECT'));
    var customerId : string = receiptObject.CUSTOMER_ID ;
    var payeeId : string = receiptObject.PAYEE_ID ;
    this.payeeGets = receiptObject.AMOUNT_IN_FCY ? receiptObject.AMOUNT_IN_FCY : "" ;
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
    //CUSTOMER INQUIRY API CALL 
    this.customerSearchService.getCustomerInquiry(customerId).subscribe(data => {
      this.customerInquiry = data;
      let customerDetails = JSON.stringify(this.customerInquiry);
      this.store.setItem('WALKIN_CUSTOMER_DETAILS', customerDetails); 
      let applicantDetails =  JSON.parse(this.store.getItem('WALKIN_CUSTOMER_DETAILS')); 
   
    },
    //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent,{
        data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
      }) ;
    }
  }
    ) ;
    //PAYEE SEARCH API CALL 
    this.payeeService.viewPayee(customerId,payeeId).subscribe((datas:any)=>{
      this.payeeSearch = datas['data'];
      let payeeDetails = JSON.stringify(this.payeeSearch);
      this.store.setItem('WALKIN_PAYEE_DETAILS', payeeDetails); 
      this.relationshipCode = datas['data'][0].RELATIONSHIP ? datas['data'][0].RELATIONSHIP : "" ;
      if(this.relationshipCode != ""){
        this.relationship = this.getRelationDescription(this.relationshipCode) ;
      }

    let details = JSON.parse(this.store.getItem('WALKIN_PAYEE_DETAILS')); 
    },
    
     //error handling - completed
     (error:any) => { 
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
    })
    
    this.route.queryParams.subscribe((params: any)=> {
      console.log(params)
     this.customerSends = (params.customer_sends).replace(/,/g, '');
     this.payeeCurrencyCode = params.fyc;
     this.payeeName = params.payee_name;
     this.store.setItem('PAYEE_NAME_ADMIN',this.payeeName);
     this.remarks = params.remarks ? params.remarks : "Remarks not provided" ;
     this.payeeCountry = params.payee_country;
     this.payeeAccountNumber = params.payee_accountnbr;
    })
    this.customerPhone =  this.store.getItem('CUSTOMER_PHONENBR');
    this.customerName = this.store.getItem('CUSTOMER_NAME');
    this.payeeId = this.store.getItem('PAYEE__ID');
    this.exchangeRate = this.store.getItem('ORG_EXCHANGE_RATE');
    this.payeePhoneNo = this.store.getItem('PAYEE_PHONENUMBER');
    this.customerAccountNo = this.store.getItem('CUSTOMER_ACCOUNTNBR');
    this.customerType = this.store.getItem('FECTHED_CUSTOMERTYPE');
    this.adminFee = this.store.getItem('BACKOFFICE_ADMIN_FEE');
    this.totalAmount = parseFloat(this.customerSends) +  parseFloat(this.adminFee) ;
    this.store.setItem('BACKOFFICE_TOTALSENDAMOUNT',this.totalAmount);
   
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

      this.payeeService.sendMoneyByBranch(this.buildAddTransaction()).subscribe(data => { 
      this.sendMoney = data;
      this.showSubmitButton = true;
      this.submitButtonLoader = false;
   this.store.setItem('REFERENCE_NUMBER_ADMIN',data.transactionId);
     this.router.navigate(['admin/backoffice-receipt'],{queryParams: {'customer_sends':this.customerSends}});
      },
      //error handling done on 03/07/2023
     (error:any) =>{
      this.showSubmitButton = true;
      this.submitButtonLoader = false;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
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
     "isMocked" : true,
     "sharingType" : this.sharingType,
     "sendAmountF" : this.payeeGets ,// newly added on 16 Nov where we send FCY amount in it .
     "amountEnteredIndicator" : this.amountEnteredIndicator, // newly added on 08 Dec where we send L or F based on user entered field  .
     "forexBookingType" : "D" //'D'--> Its initiating transaction Without contract ..
    })
  }
  backSendMoney(){
      this.dialogRef.open( CancelDialogComponent,{
       data : {reviewedBy : 'BACKOFFICE'},
        width : "500px"
      })
  }

  getRelationDescription(code: string): string {
    let relationship = this.relationArr.find(item => item.CODE === code);
    return relationship ? relationship.RELATION : ""; 
  }
}
