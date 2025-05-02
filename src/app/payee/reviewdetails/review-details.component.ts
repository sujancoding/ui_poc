import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { ErrorDialogComponent } from 'src/app/onboarding/modals/errordialog.component';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { RemitMoney } from '../payeeModel/remit-money';
import { PayeeService } from '../service/payee.service';
import { relationArr, sharingTypeValue } from 'src/assets/dropdownvalues';

@Component({
  selector: 'app-review-details',
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.scss']
})
export class ReviewDetailsComponent implements OnInit {
  username!: string;
  payeePhoneNo !: number;
  remitButton : Boolean = true;
  loader : Boolean = false;
  payeeName !: string;
  customerSends !: any;
  remarks!: string;
  exchangeRate !: number;
  payeeCountryCode !: string;
  customerType !: string;
  adminFee : any ;
  addedConsumerSends : any ;
  disableSubmit : boolean = true;
  customerInquiry :any ;
  payeeInquiry : any ;
  payeeGets : any ; //newly added on 16 Nov 2023 , This payeeGets value will mapped into sendAmountF element in request payload (Add Txn)
  amountEnteredIndicator !: string ;
  displaySharingType !: string ; 
  sharingType !: string ;
  sharingTypeValues = sharingTypeValue ;
  relationshipCode : string = "";
  relation:any []=relationArr;
  relationship = "" ;

  constructor(private store: InMemoryCache,private route: ActivatedRoute,private payeeService: PayeeService,private router: Router,
    private headerService : TitleHeaderService ,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.headerService.setTitle('Review');
    this.payeeGets = this.store.getItem('RECIPIENT_GETS') ? this.store.getItem('RECIPIENT_GETS') : "" ;
    this.route.queryParams.subscribe((params: any)=> {
      console.log(params)
    this.remarks = params.Remarks;

    this.sharingType = params.sharingType ? params.sharingType : "";
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

    this.store.setItem('CUSTOMER_REMARKS',this.remarks) ;
     this.exchangeRate = params.ExchRate;
     this.payeeCountryCode = params.payeeCountryCode;
     this.store.setItem('REMIT_FOREIGN_CCY',this.payeeCountryCode) ;
     let rate = params.ExchRate
     this.store.setItem('ORG_RATE',rate) ;
    })

   this.username = this.store.getItem('USERNAME');
   this.payeePhoneNo = this.store.getItem('PAYEE_PHONENO');
   this.payeeName = this.store.getItem('PAYEE_NAME');
   this.customerSends = this.store.getItem('CUSTOMER_SEND');
   this.adminFee = this.store.getItem('ADMIN_FEE');
   this.addedConsumerSends = parseFloat(this.customerSends) + parseFloat(this.adminFee);
   this.addedConsumerSends = this.addedConsumerSends.toFixed(2) ;
   this.customerType =  this.store.getItem('CUSTOMER_TYPE');
   this.relationshipCode=this.store.getItem('RELATIONSHIPCODE');
   if(this.relationshipCode != ""){
    this.relationship = this.getRelationDescription(this.relationshipCode)
   }
  }
  remitMoney(){
    this.loader = true;
    this.remitButton = false;
    this.amountEnteredIndicator = this.store.getItem('CONSUMERMOBILE_AMOUNT_ENTERED_INDICATOR') ? this.store.getItem('CONSUMERMOBILE_AMOUNT_ENTERED_INDICATOR') : "" ;
   this.payeeService.sendMoney(this.buildTransaction()).subscribe(data =>{
    console.log(data);
    this.store.setItem('CONSUMER_SENDMONEY_SHARINGTYPE',this.sharingType) ;
    this.store.setItem('QR_BINARYDATA',data.qrCode); //storing QR binary from response
    this.loader = false;
    this.remitButton = true;
    this.router.navigate(['payee/qr-code'],{queryParams:{'Send_Money':this.customerSends}})
      this.store.setItem('REFERENCE_NUMBER',data.transactionId);
   },
   
 //error handling completed in 30-06-2023
 (error:any)=>{
  this.loader = false;
  this.remitButton = true;
  if(error.status != 401){
    this.dialog.open(ErrorDialogComponent) ;
  }
}
   )
  }
  buildTransaction():RemitMoney{
    return new RemitMoney({
    "customerType" : this.customerType,
    "payeeId" : this.store.getItem('PAYEEID'),
    "sendAmount" : this.customerSends,
    "sendCurrencyCode" :  this.payeeCountryCode,
    "orgExchRate": this.exchangeRate,
    "remarks" :this.remarks,
    "sendAmountF" : this.payeeGets,
    "sharingType" : this.sharingType ,
    "amountEnteredIndicator" : this.amountEnteredIndicator, // newly added on 08 Dec where we send L or F based on user entered field  .
    "forexBookingType" : "D" //'D'--> Its initiating transaction Without contract ..
    })
  }
  onSelect(event : any){
    if(event.checked == true){
    this.disableSubmit = false;
    }
   else if(event.checked == false){
    this.disableSubmit = true;
    }
    }
    getRelationDescription(code: string): string {
      let relationship = this.relation.find(item => item.CODE === code);
      return relationship ? relationship.RELATION : ""; // Fallback to code if no match is found
    }
}
