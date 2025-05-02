
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'; 
import { CorporateService } from 'src/app/core/services/corporate.service';
import { MatDialog } from '@angular/material/dialog';

import { roleIdDetails } from 'src/assets/userrole';
import { AgentMaintenanceService } from 'src/app/core/services/agentmaintenance.service';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { CorporateCustomerInquiry } from 'src/app/core/model/corporatecustomerinquiry/corporatecustomerinquiry';
import { sharingTypeValue } from 'src/assets/dropdownvalues';


@Component({
  selector: 'app-corporate-deal-transaction-receipt',
  templateUrl: './corporate-deal-transaction-receipt.component.html',
  styleUrls: ['./corporate-deal-transaction-receipt.component.scss']
})

export class CorporateDealTransactionReceiptComponent implements OnInit {
  @ViewChild('content1') content!:ElementRef;
  referenceIdNumber !: string;
  payeeName !: string;
  customerSends : any;
  totalCustomerSends : any ;
  adminFee : any ;
  orgLogo = 'assets/images/logo1.jpg' ;
  checked = true ;
  payeeDetails : any ;
  addressObj : any ;
  receiptObject : any ;
  totalAmount : any ;
  myDate = this.store.getItem("TRANSACTION_INITIATED_DATE")
  nricId !: any ;
  branchUserName = this.store.getItem('USERNAME');
  paymentMode  = ["Paynow","Cheque","Cash"] ;
  loggedInUser !: string;
  formattedDate : any ;
  loader : boolean = false;
  corporateDetails : any;
  customerDetails : CorporateCustomerInquiry = new CorporateCustomerInquiry() ;
  customerName !: string;
  dob !: string;
  nationality !: string;
  phoneNumber !: string;
  beneficiaryName !: string;
  bankName !: string;
  branchName !: string;
  accountNumber!: string;
  swiftCode!: string;
  routingCode : string = "" ;
  beneficiaryAddress !: string;
  postalCode !: string;
  totalFcyAmount !: string;
  fcyCurrency !: string;
  exchangeRate !: string;
  purpose !: any;
  address !: string;
  contractTable : boolean = false;
  summaryTable : boolean = false;
  emailId !: string;
  hideDatasForAgent : boolean = false ; 
  showAgentRelatedFields : boolean = false ;
  agentName !: string ;
  purposeOfRemittance !: string ;
  displaySharingType !: string ;
  sharingType !: string ;
  sharingTypeValues= sharingTypeValue;
  relationship!: string;
  registrationNo = "";
  incorporationPlace = "" ;
  incorporationDate = "" ;

  constructor(private store: InMemoryCache,private route : ActivatedRoute,private headerService : TitleHeaderService, private customerServices : CorporateService,
    private dialogRef : MatDialog) { }

  ngOnInit(): void {
    this.headerService.setTitle('Transaction Receipt');
    console.log("Transaction Receipt") ;
    this.loggedInUser = this.store.getItem("LOGGEDIN_EMAIL_ID") ? this.store.getItem("LOGGEDIN_EMAIL_ID") : "";
    this.referenceIdNumber = this.store.getItem('REF_ID');
    this.formattedDate =  this.store.getItem("TRANSACTION_INITIATED_DATE");

   
    let customerId = this.store.getItem("CUSTOMER_ID");
    //call corporate customer inquiry API .
    this.customerServices.getCorporateCustomerInquiry(customerId).subscribe(data=>{
      this.customerDetails = data;
      this.addressObj = this.customerDetails.address.filter((v:any) => v.isprimary == "Y");
      this.addressObj = this.addressObj[0] ? this.addressObj[0] : "" ;
      if(this.addressObj != ""){
        let addressUnit = this.addressObj.unit == 0 || this.addressObj.unit == null ? '' : `- ${this.addressObj.unit},`;
        let addressLevel = this.addressObj.level == 0 || this.addressObj.level == null ? '' : `# ${this.addressObj.level}`;
        let addressBlock = this.addressObj.block == 0 || this.addressObj.block == null ? '' : ` ${this.addressObj.block},`;
            //expected Address format for corporate : street name, building name (block is building name) , #level-unit, country
          this.address = this.addressObj.streetName + "," + addressBlock +  addressLevel + addressUnit + this.addressObj.country;
        this.postalCode = this.addressObj.postalCode ? this.addressObj.postalCode : "No Company Postal Code";
      }
      this.customerName = this.customerDetails.companyName ? this.customerDetails.companyName : "No Company Name" ;
      this.phoneNumber = this.customerDetails.phone.phoneNo ? this.customerDetails.phone.phoneNo : "No Company Phone Number" ; 
      this.emailId = this.customerDetails.email.emailId ? this.customerDetails.email.emailId : "No Company Email Id" ;
      this.registrationNo = this.customerDetails.registrationNo ? this.customerDetails.registrationNo : "Not Provided"; 
      this.incorporationPlace = this.customerDetails.incorporationPlace ? this.customerDetails.incorporationPlace : "Not Provided"; 
      this.incorporationDate = this.customerDetails.incorporationDate ? this.customerDetails.incorporationDate : "Not Provided"; 

          this.payeeDetails = JSON.parse(this.store.getItem('PAYEE_DETAILS')); 
          this.payeeDetails = this.payeeDetails[0] ;
          this.beneficiaryName = this.payeeDetails.NAME;
          this.bankName = this.payeeDetails.BANKNAME;
          this.branchName = this.payeeDetails.BRANCHNAME;
          this.accountNumber = this.payeeDetails.ACCOUNTNBR;
          this.swiftCode = this.payeeDetails.SWIFTCODE ? this.payeeDetails.SWIFTCODE : "" ;
          this.routingCode = this.payeeDetails.ROUTINGCODE ? this.payeeDetails.ROUTINGCODE : "" ;
         this.beneficiaryAddress = this.payeeDetails.ADDRESS + "," + this.payeeDetails.STATE + "," + this.payeeDetails.COUNTRY;
         
        
         this.receiptObject = JSON.parse(this.store.getItem('CORP_TXN_RECEIPT_OBJECT'));
         this.totalFcyAmount= this.receiptObject.AMOUNT_IN_FCY;
         this.fcyCurrency = this.receiptObject.FOREIGN_CURRENCY

         this.sharingType = this.receiptObject.SHARINGTYPE ? this.receiptObject.SHARINGTYPE : "" ;
         if(this.sharingType == "1"){ //Its SHA
          this.displaySharingType = this.sharingTypeValues[0].shared ;
         }
        else if(this.sharingType == "2"){ //Its OUR
           this.displaySharingType = this.sharingTypeValues[0].our ;
         }
        else if(this.sharingType == "3"){ // Its BEN
           this.displaySharingType = this.sharingTypeValues[0].they ;
         }
         else { // Its empty string , so it must be currencies like MYR or THB or IDR .
          this.displaySharingType = this.sharingTypeValues[0].our ;
         }
      
         this.totalAmount = this.store.getItem('TOTALSENDAMOUNT');
         this.exchangeRate = this.receiptObject.EXCHANGE_RATE;
         this.payeeName = this.store.getItem('PAYEE_NAME_ADMIN');
         this.adminFee = this.store.getItem('CORP_ADMIN_FEE');
         this.relationship= this.store.getItem('CORP_DEAL_RELATIONSHIP') ? this.store.getItem('CORP_DEAL_RELATIONSHIP') : "" ;
         this.route.queryParams.subscribe((params: any)=> {
          console.log(params)
          this.customerSends = params.customer_sends;
         });
         this.totalCustomerSends = this.store.getItem('TOTALSENDAMOUNT');
         this.purpose = this.store.getItem("REMARKS");
         if(this.purpose =="undefined"){
          this.purpose = "Remarks not provided";
         }
    },
     //error handling Completed on 06-07-2023 - <DN>
    (error:any)=>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    })
   
    this.fcyCurrency = this.store.getItem('SELECTED_CURRENCY') ;
    this.adminFee = this.store.getItem('CORP_ADMIN_FEE');
    this.totalCustomerSends = this.store.getItem("FINAL_CUSTOMER_SENDS_AMOUNT");
    this.totalFcyAmount= this.store.getItem('TOTALAMOUNT_FOREIGNCCY');
    this.purpose = this.store.getItem('REMARKS') ;
  

}


  SavePDF() {
 
  this.loader = true;
  const doc = new jsPDF('p', 'pt', 'a4'); // Set document size to A4

  const element : any = document.getElementById('content1');

  html2canvas(element, { scale: 2 }).then((canvas) => { // Increase scale factor if necessary
    const imageData = canvas.toDataURL('image/jpeg', 2.0);
    const imageProps = doc.getImageProperties(imageData);

    const imgWidth = doc.internal.pageSize.getWidth();
    //const imgHeight = (imageProps.height * imgWidth) / imageProps.width;
    const imgHeight = 850 ;

    doc.addImage(imageData, 'JPEG', 0, 0, imgWidth, imgHeight);
    doc.save(`Receipt-${this.referenceIdNumber}.pdf`);
  });
  this.loader = false;
    }
}

