import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'; 
import { DatePipe } from '@angular/common';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { CorporateService } from 'src/app/core/services/corporate.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import { roleIdDetails } from 'src/assets/userrole';
import { AgentMaintenanceService } from 'src/app/core/services/agentmaintenance.service';
import { CorporateCustomerInquiry } from 'src/app/core/model/corporatecustomerinquiry/corporatecustomerinquiry';
import { SharingTypeArray } from 'src/app/core/model/admintxnreceipt/admintxnreceipt.model';
import { relationArr, sharingTypeValue } from 'src/assets/dropdownvalues';


@Component({
  selector: 'app-success-receipt-admin',
  templateUrl: './success-receipt-admin.component.html',
  styleUrls: ['./success-receipt-admin.component.scss']
})
export class SuccessReceiptAdminComponent implements OnInit {
  @ViewChild('content1') content!:ElementRef;
  referenceIdNumber !: string;
  payeeName !: string;
  customerSends : any;
  totalCustomerSends : any ;
  adminFee : any ;
  orgLogo = 'assets/images/logo1.jpg' ;
  checked = true ;
  applicantDetails : any ;
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
  contractsArray : any;
  originatedRemitter !: string ;
  emailId !: string;
  showSGRemittanceMessage : boolean = false ; //this div contains "DBS - Your Telegraphic Transfer has been submitted" only need to show this message for SG Remittance
  hideDatasForAgent : boolean = false ; 
  showAgentRelatedFields : boolean = false ;
  agentName !: string ;
  purposeOfRemittance !: string ;
  displaySharingType : string = "" ;
  sharingType !: string ;
  customerType !: string;
  sharingTypeValues : SharingTypeArray[] = sharingTypeValue ;
  showModeOfPaymentForBackoffice : Boolean = false ;
  relation :any[] = relationArr ;
  relationCode!: string;
  relationShip = "" ;
  registrationNumber = "" ;
  incorporationPlace = "" ;
  incorporationDate = "" ;
  placeOfBirth = "" ;
  dateOfBirth = "" ;

  constructor(private store: InMemoryCache,private route : ActivatedRoute,private headerService : TitleHeaderService, private customerServices : CorporateService,
    private datePipe : DatePipe,private dialogRef : MatDialog,private agentMainteanceService :AgentMaintenanceService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Transaction Receipt');
    let userRole = this.store.getItem("USER_ROLE");
    this.loggedInUser = this.store.getItem("LOGGEDIN_EMAIL_ID") ? this.store.getItem("LOGGEDIN_EMAIL_ID") : "";
    this.referenceIdNumber = this.store.getItem('REFERENCE_NUMBER_ADMIN');
    this.formattedDate =  this.store.getItem("TRANSACTION_INITIATED_DATE");
    this.originatedRemitter = this.store.getItem('ORIGINATED_REMITTER') ? this.store.getItem('ORIGINATED_REMITTER') : "No Originated Remitter" ;
  if(userRole == roleIdDetails.CORPORATE_OWNER || userRole == roleIdDetails.CORPORATE_RUNNER || userRole == roleIdDetails.CORPORATE_DEALER){ //555 - owner , 556-runner , 557-dealer
    this.contractsArray = JSON.parse(this.store.getItem('REMIT_RECIPT_ARRAY'));
    //To show SGD vs FCY format for rates more than 1 FCY rate and to show FCY vs SGD format for less than 1 FCY rate
    this.contractsArray.forEach((item:any) => {
      if(item.exchangeRate < 1){
        item.exchangeRate = 1 / item.exchangeRate
      } 
    } )
    this.contractTable = true;
    this.sharingType = this.store.getItem('AGENT_SHARINGTYPE') ? this.store.getItem('AGENT_SHARINGTYPE') : "" ;
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
     this.sharingType = "2" ;
    }
    
    let customerId = this.store.getItem("CUSTOMER_ID");
    this.customerServices.getCorporateCustomerInquiry(customerId).subscribe(data=>{
      this.customerDetails = data;
      this.addressObj = this.customerDetails.address.filter((v:any) => v.isprimary == "Y");
      this.addressObj = this.addressObj[0] ;
      let addressUnit = this.addressObj.unit == 0 || this.addressObj.unit == null ? '' : `- ${this.addressObj.unit},`;
      let addressLevel = this.addressObj.level == 0 || this.addressObj.level == null ? '' : `# ${this.addressObj.level}`;
      let addressBlock = this.addressObj.block == 0 || this.addressObj.block == null ? '' : ` ${this.addressObj.block},`;
          //expected Address format for corporate : street name, building name (block is building name) , #level-unit, country
        this.address = this.addressObj.streetName + "," + addressBlock +  addressLevel + addressUnit + this.addressObj.country;
      this.postalCode = this.addressObj.postalCode;

      this.customerName = this.customerDetails.companyName ? this.customerDetails.companyName : "No Company Name" ;
      this.phoneNumber = this.customerDetails.phone.phoneNo ? this.customerDetails.phone.phoneNo : "No Company Phone Number" ; 
      this.emailId = this.customerDetails.email.emailId ? this.customerDetails.email.emailId : "No Company Email Id" ;
      this.registrationNumber = this.customerDetails.registrationNo ? this.customerDetails.registrationNo : "ROC Not Provided" ;
      this.incorporationPlace = this.customerDetails.incorporationPlace ? this.customerDetails.incorporationPlace : "Not Provided";
      this.incorporationDate = this.customerDetails.incorporationDate ? this.customerDetails.incorporationDate : "Not Provided";
      this.hideDatasForAgent = true ; //for corporate txn receipt --> we need to hide NRIC and Nationality content in customer details card.

    },
     //error handling Completed on 06-07-2023 - <DN>
    (error:any)=>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    })
    let corporatePayeeDetails = this.store.getItem("SELECTED_PAYEE");
    let selectedPayeeDetails = JSON.parse(corporatePayeeDetails);
    this.payeeDetails = selectedPayeeDetails.payeeData[0]
    this.beneficiaryName = this.payeeDetails.NAME;
    this.bankName = this.payeeDetails.BANKNAME;
    this.branchName = this.payeeDetails.BRANCHNAME;
    this.accountNumber = this.payeeDetails.ACCOUNTNBR;
    this.swiftCode =this.payeeDetails.SWIFTCODE;
    this.routingCode = this.payeeDetails.ROUTINGCODE ;
    this.beneficiaryAddress = this.payeeDetails.ADDRESS + ","+ this.payeeDetails.STATE +  ","+  this.payeeDetails.COUNTRY;
    this.fcyCurrency = this.store.getItem('SELECTED_CURRENCY') ;
    this.adminFee = this.store.getItem('ADMIN_FEE');
    this.totalCustomerSends = this.store.getItem("FINAL_CUSTOMER_SENDS_AMOUNT");
    this.totalFcyAmount= this.store.getItem('TOTALAMOUNT_FOREIGNCCY');
    this.purpose = this.store.getItem('REMARKS') ;
    this.relationCode = this.store.getItem('RELATIONSHIPCODE');
    if(this.relationCode != ""){
      this.relationShip = this.getRelationDescription(this.relationCode) ;
    }
  }
 else if(userRole == roleIdDetails.AGENT){ // 888 - agent
  this.purposeOfRemittance = this.store.getItem('AGENT_TT_PURPOSE_OF_REMITTANCE') ? this.store.getItem('AGENT_TT_PURPOSE_OF_REMITTANCE') : "" ;
  this.showAgentRelatedFields = true ;  //show agent name and purpose of RT(agent inquiry service --> map companyName)
  this.hideDatasForAgent = true ; //for agent txn receipt --> we need to hide NRIC and Nationality content in customer details card.
    this.contractsArray = JSON.parse(this.store.getItem('REMIT_RECIPT_ARRAY'));
    this.showSGRemittanceMessage = true ; //only if its agent , show DBS message ..
    //To show SGD vs FCY format for rates more than 1 FCY rate and to show FCY vs SGD format for less than 1 FCY rate
    this.contractsArray.forEach((item:any) => {
    if(item.exchangeRate < 1){
      item.exchangeRate = 1 / item.exchangeRate
    } 
  } )
   
    this.contractTable =  true;

    this.sharingType = this.store.getItem('AGENT_SHARINGTYPE') ? this.store.getItem('AGENT_SHARINGTYPE') : "" ;
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
      this.sharingType = "2" ;
     }

   // this.customerName = this.store.getItem('USERNAME');
   this.customerName = this.originatedRemitter ; //when agent initiated , we show customer name as originated remitter details
   let agentId = this.store.getItem('USER_ID')
   this.agentMainteanceService.getAgentInquiry(agentId).subscribe((data:any)=>{
    this.dob = "DOB not provided";
    this.nationality = "Nationality not specified";
    this.nricId = "NRIC/ID not provided";
    this.agentName = data.companyName ? data.companyName : "Agent Name not found" ;
    let streetName = data.address.street ? `${data.address.street}, ` : "";
    let country = data.address.country ? data.address.country : "No country";

    //Expected Address format for agent -> street name, building name , #level-unit , country
    let addressUnit = data.address.unit == 0 || data.address.unit == null ? '' : `- ${data.address.unit},`;
    let addressLevel = data.address.level == 0 || data.address.level == null ? '' : ` # ${data.address.level}`;
    let addressBuildingName = data.address.buildingName == 0 || data.address.buildingName == null ? '' : `${data.address.buildingName} ,`;
    this.address = streetName + addressBuildingName + addressLevel + addressUnit + country;
    // this.address = data.address.level + "," + data.address.unit + "," + data.address.buildingName + "," + data.address.street + "," + data.address.country;
    this.postalCode = data.address.postalCode ?  data.address.postalCode : "PostalCode not provided";
    this.emailId = data.emailId ?   data.emailId : "EmailId not provided";
    this.phoneNumber = data.phoneNo ? data.phoneNo  :"PhoneNumber not provided" ;
    this.incorporationPlace = data.incorporationPlace ? data.incorporationPlace : "Not Provided";
    this.incorporationDate = data.incorporationDate ? data.incorporationDate : "Not Provided";
   },
   (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent)
    }
   })
    let corporatePayeeDetails = this.store.getItem("SELECTED_PAYEE");
    let selectedPayeeDetails = JSON.parse(corporatePayeeDetails);
    this.payeeDetails = selectedPayeeDetails.payeeData[0]
    this.beneficiaryName = this.payeeDetails.NAME;
    this.bankName = this.payeeDetails.BANKNAME;
    this.branchName = this.payeeDetails.BRANCHNAME;
    this.accountNumber = this.payeeDetails.ACCOUNTNBR;
    this.swiftCode =this.payeeDetails.SWIFTCODE;
    this.routingCode = this.payeeDetails.ROUTINGCODE ;
    this.beneficiaryAddress = this.payeeDetails.ADDRESS + ","+  this.payeeDetails.STATE +  ","+  this.payeeDetails.COUNTRY;
    this.fcyCurrency = this.store.getItem('SELECTED_CURRENCY') ;
    this.adminFee = this.store.getItem('ADMIN_FEE');
    this.totalAmount = this.store.getItem('CUSTOMER_SENDS_AMOUNT')
    this.totalCustomerSends = this.store.getItem("FINAL_CUSTOMER_SENDS_AMOUNT");
    this.totalFcyAmount= this.store.getItem('TOTALAMOUNT_FOREIGNCCY');
    this.purpose = this.store.getItem('REMARKS') ;
    this.relationCode =this.store.getItem('RELATIONSHIPCODE'); // eg: ER, OT..
    if(this.relationCode != ""){
      this.relationShip = this.getRelationDescription(this.relationCode) ;
    }
  }
  else { // if role other than 888/555/556/557 , the block will executed .
    console.log("Transaction receipt..")
      this.summaryTable = true;
      this.applicantDetails =  JSON.parse(this.store.getItem('WALKIN_CUSTOMER_DETAILS'));
      this.customerName = this.applicantDetails.name.name;
      this.customerType = this.applicantDetails.customerType ? this.applicantDetails.customerType : ""; 
      if(this.customerType == "I"){
        this.hideDatasForAgent = false ;
        this.showModeOfPaymentForBackoffice = false ;
        this.dob = this.applicantDetails.demographics.dateOfBirth;
        this.nationality = this.applicantDetails.demographics.nationality;
        this.nricId = this.applicantDetails.demographics.idNumber.substr(0, 5) + '*'.repeat(4);
        this.placeOfBirth = this.applicantDetails.demographics.placeOfBirth ? this.applicantDetails.demographics.placeOfBirth : "Not Provided";
        this.dateOfBirth = this.applicantDetails.demographics.dateOfBirth ? this.applicantDetails.demographics.dateOfBirth : "Not Provided";
      }
      else if(this.customerType == "C"){
        this.registrationNumber = this.applicantDetails.registrationNo ? this.applicantDetails.registrationNo : "ROC Not Provided" ;
        this.incorporationPlace = this.applicantDetails.incorporationPlace ? this.applicantDetails.incorporationPlace : "Not Provided";
        this.incorporationDate = this.applicantDetails.incorporationDate ? this.applicantDetails.incorporationDate : "Not Provided";
        this.showModeOfPaymentForBackoffice = true ;
        this.hideDatasForAgent = true ;
      }
      this.phoneNumber = this.applicantDetails.phone.phoneNo;
      this.emailId = this.applicantDetails.email.emailId ? this.applicantDetails.email.emailId : "No EmailId found" ;
  
      this.payeeDetails = JSON.parse(this.store.getItem('WALKIN_PAYEE_DETAILS')); 
      this.payeeDetails = this.payeeDetails[0] ;
      this.beneficiaryName = this.payeeDetails.NAME;
      this.bankName = this.payeeDetails.BANKNAME;
      this.branchName = this.payeeDetails.BRANCHNAME;
      this.accountNumber = this.payeeDetails.ACCOUNTNBR;
      this.swiftCode =this.payeeDetails.SWIFTCODE;
      this.routingCode = this.payeeDetails.ROUTINGCODE ;
     this.beneficiaryAddress = this.payeeDetails.ADDRESS + "," + this.payeeDetails.STATE + "," + this.payeeDetails.COUNTRY;
     this.relationCode =this.payeeDetails.RELATIONSHIP ? this.payeeDetails.RELATIONSHIP : "";

     if(this.relationCode != ""){
      this.relationShip = this.getRelationDescription(this.relationCode) ;
    }

     this.addressObj = this.applicantDetails.address.filter((v:any) => v.isprimary == "Y");
     this.addressObj = this.addressObj[0] ? this.addressObj[0] : "" ;
     
     if(this.addressObj != ""){
      if(this.customerType == "I"){
      //Expected Address format : block , street name , #level - unit , country .
      let addressUnit = this.addressObj.unit == 0 || this.addressObj.unit == null ? '' : `- ${this.addressObj.unit}`;
      let addressLevel = this.addressObj.level == 0 || this.addressObj.level == null ? '' : `, # ${this.addressObj.level}`;
      let addressBlock = this.addressObj.block == 0 || this.addressObj.block == null ? '' : `BLK ${this.addressObj.block} ,`;
      this.address = addressBlock + this.addressObj.streetName + addressLevel + addressUnit + "," + this.addressObj.country
      this.postalCode = this.addressObj.postalCode ? this.addressObj.postalCode : "No Postal Code found";
      }
      else{
        //If the customer type is "C", this block will execute and expected address format is street name, building name , #level-unit , postal code, country
        let addressUnit = this.addressObj.unit == 0 || this.addressObj.unit == null ? '' : `- ${this.addressObj.unit},`;
        let addressLevel = this.addressObj.level == 0 || this.addressObj.level == null ? '' : `# ${this.addressObj.level}`;
        let addressBlock = this.addressObj.block == 0 || this.addressObj.block == null ? '' : ` ${this.addressObj.block},`;
            //expected Address format for corporate : street name, building name (block is building name) , #level-unit, country
          this.address = this.addressObj.streetName + "," + addressBlock +  addressLevel + addressUnit + this.addressObj.country;
      this.postalCode = this.addressObj.postalCode ? this.addressObj.postalCode : "No Postal Code found";  
    }
     }
     else{
      this.address = "No Address found" ;
      this.postalCode = "No Postal code found";
     }
     this.receiptObject = JSON.parse(this.store.getItem('ADMIN_TXN_RECEIPT_OBJECT'));
     this.totalFcyAmount= this.receiptObject.AMOUNT_IN_FCY;
     this.fcyCurrency = this.receiptObject.FOREIGN_CURRENCY ;
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
      this.sharingType = "2" ;
     }
  
     this.totalAmount = this.store.getItem('BACKOFFICE_TOTALSENDAMOUNT');
     this.exchangeRate = this.receiptObject.EXCHANGE_RATE;
     this.payeeName = this.store.getItem('PAYEE_NAME_ADMIN');
     this.adminFee = this.store.getItem('BACKOFFICE_ADMIN_FEE');
     this.route.queryParams.subscribe((params: any)=> {
      console.log(params)
      this.customerSends = params.customer_sends;
     });
     this.totalCustomerSends = this.store.getItem('BACKOFFICE_TOTALSENDAMOUNT');
     this.purpose = this.store.getItem("REMARKS");
     if(this.purpose ==""){
      this.purpose = "Remarks not provided";
     }
  }
}
  //downloadReceipt(){
    // var node:any = document.getElementById('my-node');
    // htmlToImage.toJpeg(node, { quality: 0.95 })
    // .then(function (dataUrl) {
    //   var link = document.createElement('a');
    //   link.download = 'Receipt';
    //   link.href = dataUrl;
    //   link.click();
    // });
 // }

  SavePDF() {
  //  let pdf = new jsPDF('p', 'mm', 'a4');

  //  pdf.html(this.content.nativeElement,{
  //   callback : (pdf) => {
  //     pdf.save('test123.pdf');
  //   }
  //  })

  // let content : any = document.getElementById('content1')  ;
  
  // const pageWidth = 210; // Adjust the page width as per your requirement
  // const scaleFactor = 1.0;

  // html2canvas(content, { scale: scaleFactor }).then((canvas) => {
 
  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //      const pageHeight = pdf.internal.pageSize.getHeight();

  //     // Add the first content to the first page
  //     pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pageWidth,pageHeight);
  //     //pdf.addPage();
  //     // Save the PDF
  //     pdf.save('Receipt.pdf');
   
  // });
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


    getRelationDescription(code: string): string {
      let relationship = this.relation.find(item => item.CODE === code);
      return relationship ? relationship.RELATION : ""; 
    }
}
