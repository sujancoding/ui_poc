import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'; 
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AgentMaintenanceService } from 'src/app/core/services/agentmaintenance.service';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { SharingTypeArray } from 'src/app/core/model/admintxnreceipt/admintxnreceipt.model';
import { relationArr, sharingTypeValue } from 'src/assets/dropdownvalues';

@Component({
  selector: 'app-agent-receipt',
  templateUrl: './agent-receipt.component.html',
  styleUrls: ['./agent-receipt.component.scss']
})
export class AgentReceiptComponent implements OnInit {
  @ViewChild('content1') content!:ElementRef;
  referenceNumber : any;
  payeeName !: string;
  customerSends : any;
  totalCustomerSends : any ;
  adminFee : any ;
  remittanceDetails !: any;
  nricId !: string;
  orgLogo = 'assets/images/logo1.jpg' ;
  paymentMode  = ["Paynow","Cheque","Cash"] ;
  loader : boolean = false;
  localAddress : any ;
  customerName !: string;
  nationality !: string;
  phoneNumber !: string;
  address !: string;
  remarks !: string;
  beneficiaryAddress !: string;
  bankName !: string;
  branchName !: string;
  accountNumber !: string;
  swiftCode !: string;
  routingCode : string = "" ;
  postalCode !: string;
  originatedRemitter !: string;
  referenceIdNumber : any ;
  hideCharges !: string ;
  dealsArray : any []=[];
  contractsArray : any []=[];
  showSGRemittanceMessage : boolean = false ; //this div contains "DBS - Your Telegraphic Transfer has been submitted" only need to show this message for SG Remittance
  purposeOfRemittance !: string; //this variable only used for agent related receipts
  displaySharingType : string = "" ;
  sharingTypeValues : SharingTypeArray[] = sharingTypeValue ;
  showPaymentModeForCharges = true ;
  relationship : string = "" ;
  relationShipArray :any[] = relationArr ;
  registrationNumber : string = "" ;
  incorporationPlace = "" ;
  incorporationDate = "" ;
  dateOfBirth = "" ;
  placeOfBirth = "" ;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private agentMainteanceService :AgentMaintenanceService,private dialog : MatDialog,private store : InMemoryCache) { }

  ngOnInit(): void {
    this.remittanceDetails = this.data ;
    console.log(this.remittanceDetails);
    this.hideCharges = this.remittanceDetails.hideCharges ? this.remittanceDetails.hideCharges : "Show Charges" ;
    this.referenceIdNumber = this.remittanceDetails.transactionId; 
    let sharingType = this.remittanceDetails.sharingType ? this.remittanceDetails.sharingType : "" ;
    if(sharingType != ""){
      if(sharingType == "1"){ //Its SHA
        this.displaySharingType = this.sharingTypeValues[0].shared  ;
       }
      else if(sharingType == "2"){ //Its OUR
         this.displaySharingType = this.sharingTypeValues[0].our ;
       }
      else if(sharingType == "3"){ // Its BEN
         this.displaySharingType = this.sharingTypeValues[0].they  ;
       }
       else { // Its empty string , so it must be currencies like MYR or THB or IDR .
         this.displaySharingType = this.sharingTypeValues[0].our  ;
       }
       }
    // block will execute for Individual and Corporate.
    if(this.remittanceDetails.customerType == "I" || this.remittanceDetails.customerType == "C"){
      this.customerName = this.remittanceDetails.customerName;
      this.phoneNumber = this.remittanceDetails.customerPhoneNumber ? this.remittanceDetails.customerPhoneNumber : "Phone Number not provided" ;
      if(this.remittanceDetails.customerType == "I"){
      this.nricId = this.remittanceDetails.nricId ? this.remittanceDetails.nricId.substr(0, 5) + '*'.repeat(4) : "NRIC/ID not provided";
      this.nationality = this.remittanceDetails.customerNationality ? this.remittanceDetails.customerNationality : "Nationality not specified";
      this.dateOfBirth = this.remittanceDetails.customerInq.demographics.dateOfBirth ? this.remittanceDetails.customerInq.demographics.dateOfBirth : "Not Provided";
      this.placeOfBirth = this.remittanceDetails.customerInq.demographics.placeOfBirth ? this.remittanceDetails.customerInq.demographics.placeOfBirth : "Not Provided" ;
      }
      else if(this.remittanceDetails.customerType == "C"){ //for corporate -> show NRIC and Nationality value as N/A
        this.nricId = "N/A";
        this.nationality = "N/A";
        this.registrationNumber = this.remittanceDetails.customerInq.registrationNo ? this.remittanceDetails.customerInq.registrationNo : "ROC Not Provided" ;
        this.incorporationPlace = this.remittanceDetails.customerInq.incorporationPlace ? this.remittanceDetails.customerInq.incorporationPlace : "Not Provided" ;
        this.incorporationDate = this.remittanceDetails.customerInq.incorporationDate ? this.remittanceDetails.customerInq.incorporationDate : "Not Provided" ;
      }
      let relationCode = this.remittanceDetails.relationship ? this.remittanceDetails.relationship : "" ;
      let relationDesc = "" ;
      if(relationCode != ""){
         let relationObj = this.relationShipArray.find(v => v.CODE == relationCode ) ;
         relationDesc = relationObj ? relationObj.RELATION : "" ;
      }
      this.relationship = relationDesc ? relationDesc : "" ;
      
      this.localAddress = this.remittanceDetails.customerInq.address.filter((v:any) => v.isprimary == "Y");
      this.localAddress = this.localAddress[0];
      //Block is for consumer and Building name is for corporate (internally in customer Inq response , block is considered as building name)
      if(this.localAddress == undefined){
        this.localAddress = "Address not provided";
      }
      else{ 
        if(this.remittanceDetails.customerType == "I"){
          let addressUnit = this.localAddress.unit == 0 || this.localAddress.unit == null ? '' : `- ${this.localAddress.unit}`;
          let addressLevel = this.localAddress.level == 0 || this.localAddress.level == null ? '' : `# ${this.localAddress.level}`;
          let addressBlock = this.localAddress.block == 0 || this.localAddress.block == null ? '' : `BLK ${this.localAddress.block} ,`;
            //Expected Address format for individual : block , street name , #level - unit , country .
            this.address =  addressBlock + this.localAddress.streetName + "," + addressLevel + addressUnit + "," + this.localAddress.country;
            }
            else if(this.remittanceDetails.customerType == "C"){
          let addressUnit = this.localAddress.unit == 0 || this.localAddress.unit == null ? '' : `- ${this.localAddress.unit},`;
          let addressLevel = this.localAddress.level == 0 || this.localAddress.level == null ? '' : `# ${this.localAddress.level}`;
          let addressBlock = this.localAddress.block == 0 || this.localAddress.block == null ? '' : ` ${this.localAddress.block},`;
              //expected Address format for corporate : street name, building name (block is building name) , #level-unit , postal code, country
            this.address = this.localAddress.streetName + "," + addressBlock +  addressLevel + addressUnit + this.localAddress.country;
            }
    }
      this.postalCode =  this.localAddress.postalCode ?  this.localAddress.postalCode : "Postal code not specified";
      this.payeeName = this.remittanceDetails.beneficiaryName;
      this.beneficiaryAddress =  this.remittanceDetails.beneficiaryAddress +',' + this.remittanceDetails.beneficiaryState +',' + this.remittanceDetails.beneficiaryCountry;
      this.bankName =  this.remittanceDetails.bankName;
      this.branchName =  this.remittanceDetails.branchName;
      this.accountNumber =  this.remittanceDetails.accountNo;
      this.swiftCode =  this.remittanceDetails.swiftCode;
      this.routingCode = this.remittanceDetails.routingCode ;
      this.remarks = this.remittanceDetails.remarks ? this.remittanceDetails.remarks : "Remarks not provided";
      if(this.remittanceDetails.remarks == "null"){
        this.remarks = "Remarks not provided" ;
     }
     if((this.remittanceDetails.customerType == "C"  && this.remittanceDetails.contractId != null)
    || (this.remittanceDetails.customerType == 'I' && this.remittanceDetails.contractId != null)){
 //change string into array
 const contractIds = this.remittanceDetails.contractId.split(',');
 const contractRates = this.remittanceDetails.contractRate.split(',');
 const amountConsumed = this.remittanceDetails.amountConsumed.split(',');


 this.contractsArray = contractIds.map((contractId: any, index: any) => ({
   bookingId: contractId,
   exchangeRate: contractRates[index], //based on index map the rate and amount
   amount: amountConsumed[index]
 }));
      
      
      
 }

 // block will execute in Agent >> APT tab.
 if(this.remittanceDetails.customerType == "I" && this.remittanceDetails.initiatedBy == 'ORG-AGENT' || (this.remittanceDetails.customerType == 'C' && this.remittanceDetails.forexBookingType == 'D' && this.remittanceDetails.initiatedBy == 'ORG-AGENT')||
 (this.remittanceDetails.customerType == 'I' && this.remittanceDetails.initiatedBy == 'ORG' && this.remittanceDetails.agentName !== null && this.remittanceDetails.dealId != null ) || 
 (this.remittanceDetails.customerType == 'C' && this.remittanceDetails.forexBookingType == 'D' &&  this.remittanceDetails.initiatedBy == 'ORG' && this.remittanceDetails.agentName != null && this.remittanceDetails.dealId != null)){
  //change string into array
  this.showPaymentModeForCharges = false ;
  const dealIds =  this.remittanceDetails.dealId.split(',');
  const dealRates = this.remittanceDetails.dealRate.split(',');
  const amountConsumed = this.remittanceDetails.amountConsumed.split(',');

   
  this.dealsArray = dealIds.map((dealId:any, index:any) => ({
    dealId: dealId,
    dealRate: dealRates[index], //based on index map the rate and amount
    amount: amountConsumed[index]
  }));
}
    }
    //block will execute for Agent.
    else{ 
      this.showSGRemittanceMessage = true ; //only if its agent , show DBS message ..
      let agentId = this.remittanceDetails.customerId;
      this.purposeOfRemittance = this.remittanceDetails.purposeOfRemittance ? this.remittanceDetails.purposeOfRemittance : "";
      this.loader = true;
      let relationCode = this.remittanceDetails.relationship ? this.remittanceDetails.relationship : "" ;
      let relationDesc = "" ;
      if(relationCode != ""){
         let relationObj = this.relationShipArray.find(v => v.CODE == relationCode ) ;
         relationDesc = relationObj ? relationObj.RELATION : "" ;
      }
      this.relationship = relationDesc ? relationDesc : "" ;
      this.agentMainteanceService.getAgentInquiry(agentId).subscribe((data:any)=>{
      this.loader = false;

        this.registrationNumber = data.registrationNo ? data.registrationNo : "ROC Not Provided";
        this.incorporationPlace = data.incorporationPlace ? data.incorporationPlace : "Not Provided";
        this.incorporationDate = data.incorporationDate ? data.incorporationDate : "Not Provided";

     //if originated remitter is not null , then customer name is originated remitter
        this.originatedRemitter  = this.remittanceDetails.originatedRemitter  ? this.remittanceDetails.originatedRemitter : "Originated Remitter not specified";
        this.customerName = this.remittanceDetails.customerName;
        this.nationality = "N/A";
        this.nricId = "N/A";
        let streetName = data.address.street ? `${data.address.street}, ` : "";
        let country = data.address.country ? data.address.country : "No country";

        //Expected Address format for agent -> street name, building name , #level-unit , country
        let addressUnit = data.address.unit == 0 || data.address.unit == null ? '' : `- ${data.address.unit},`;
        let addressLevel = data.address.level == 0 || data.address.level == null ? '' : ` # ${data.address.level}`;
        let addressBuildingName = data.address.buildingName == 0 || data.address.buildingName == null ? '' : `${data.address.buildingName} ,`;
        this.address = streetName + addressBuildingName + addressLevel + addressUnit + country;

        this.postalCode = data.address.postalCode ? data.address.postalCode : "Postal code not specified";
        this.phoneNumber = data.phoneNo ? data.phoneNo :  "Phone Number not provided";
        this.payeeName = this.remittanceDetails.beneficiaryName;
        this.beneficiaryAddress =  this.remittanceDetails.beneficiaryAddress +',' + this.remittanceDetails.beneficiaryState +',' + this.remittanceDetails.beneficiaryCountry;
        this.bankName =  this.remittanceDetails.bankName
        this.branchName =  this.remittanceDetails.branchName
        this.accountNumber =  this.remittanceDetails.accountNo
        this.swiftCode =  this.remittanceDetails.swiftCode;
        this.routingCode = this.remittanceDetails.routingCode ;
        this.remarks = this.remittanceDetails.remarks ? this.remittanceDetails.remarks : "Remarks not provided";
        if(this.remittanceDetails.remarks == "null"){
          this.remarks = "Remarks not provided" ;
       }
      
         //change string into array
         const contractIds =  this.remittanceDetails.contractId.split(',');
         const contractRates = this.remittanceDetails.contractRate.split(',');
         const amountConsumed = this.remittanceDetails.amountConsumed.split(',');
   
          
         this.contractsArray = contractIds.map((contractId:any, index:any) => ({
           bookingId: contractId,
           exchangeRate: contractRates[index], //based on index map the rate and amount
           amount: amountConsumed[index]
         }));

       },
       (error:any)=>{
        this.loader = false;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent)
        }
       })
    }
  }

  savePDF(){
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
      this.loader = false;
    });
  }

}
