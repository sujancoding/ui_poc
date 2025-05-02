import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import * as htmlToImage from 'html-to-image';

import { CustomerSearchService } from 'src/app/core/services/customersearch.service';

import { MatDialog } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import { getTxnStatusAndColor } from 'src/assets/transactionstatus';
import { ErrorDialogComponent } from 'src/app/onboarding/modals/errordialog.component';
import { relationArr, sharingTypeValue } from 'src/assets/dropdownvalues';

@Component({
  selector: 'app-transfer-details',
  templateUrl: './transfer-details.component.html',
  styleUrls: ['./transfer-details.component.scss']
})
export class TransferDetailsComponent implements OnInit {
transactiondata : any [] = [];
binaryData : any;
status !: string;
shareBtn : Boolean = true;
loader : Boolean = false;
paymentMode  = ["Paynow","Cheque","Cash"] ;
loggedInUser !: string;
formattedDate : any ;
referenceIdNumber : any ;
transactionArray : any ;
orgLogo = 'assets/images/logo1.jpg' ;
customerInquiry : any ;
localAddress : any ;
totalFcyAmount !: any;
adminFee !: any;
totalCustomerSends !: any;
fcyCurrency !: any;
address !: string;
userName = this.store.getItem("USERNAME");
transactionTableData : any []=[];
showContractDetails = false ;
showDealDetails = false ;
transferDetailsImg : any;
navigator : any;
companyPostalCode !: string ;
exchangeRate : any ;
sharingType !: string ;
displaySharingType !: string ;
sharingTypeValues = sharingTypeValue ;
relationArr : any[] = relationArr ;
registrationNo : string = "" ;
incorporationPlace = "" ;
incorporationDate = "" ;
 
  constructor(private store: InMemoryCache,private headerService:TitleHeaderService,
    private datePipe : DatePipe , private customerSearchService : CustomerSearchService,
    private dialog : MatDialog) { }

  getColor(status: any){
    const statusObj : any= getTxnStatusAndColor(status);
    this.status = statusObj.status; 
    return statusObj.color;
  }


  ngOnInit(): void {
    this.headerService.setTitle('Transfer Details');
    this.loggedInUser = this.store.getItem("LOGGEDIN_EMAIL_ID") ? this.store.getItem("LOGGEDIN_EMAIL_ID") : ""; 
    let jsonString = this.store.getItem('TRANSACTION_ID');
    this.transactiondata = JSON.parse(jsonString);

    this.sharingType = this.transactiondata[0].SHARINGTYPE ? this.transactiondata[0].SHARINGTYPE : "" ;
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

    //Based on transaction type , will decide to display remittance summary table .
    let forexBookingType : string = this.store.getItem('CORPORATE_DASHBOARD_TRANSACTION_TYPE') ? this.store.getItem('CORPORATE_DASHBOARD_TRANSACTION_TYPE') : "" ;
    if(forexBookingType == "D"){ //TT initiated Without contract
             this.showDealDetails = true ;
             this.showContractDetails = false ;
             this.fcyCurrency =  this.transactiondata[0].SENDCCY ? this.transactiondata[0].SENDCCY : "" ;
             this.totalFcyAmount = this.transactiondata[0].AMOUNTSENTF ? this.transactiondata[0].AMOUNTSENTF : "";
             this.exchangeRate = this.transactiondata[0].ORGEXCHRATE ? this.transactiondata[0].ORGEXCHRATE : "" ;
             this.adminFee = this.transactiondata[0].ORGCOMMISSION ? this.transactiondata[0].ORGCOMMISSION : "0";
             this.totalCustomerSends = this.transactiondata[0].AMOUNTSENT + this.transactiondata[0].ORGCOMMISSION
             if (this.exchangeRate < 1) {
              this.exchangeRate = 1/ this.exchangeRate;
              this.exchangeRate = this.exchangeRate.toFixed(5);
          }
         
        } 
        else { //TT Initiated with contract
          this.showContractDetails = true ;
          this.showDealDetails = false ;
           //change string into array
      const contractIds =  this.transactiondata[0].CONTRACTID.split(',');
      const contractRates = this.transactiondata[0].CONTRACTRATE.split(',');
      const amounts = this.transactiondata[0].AMOUNTCONSUMED.split(',');

      this.transactionTableData = contractIds.map((contractId:any, index:any) => ({
        CONTRACTID: contractId,
        CONTRACTRATE: contractRates[index], //based on index map the rate and amount
        AMOUNTCONSUMED: amounts[index]
      }));

      let amount = this.transactiondata[0].AMOUNTCONSUMED;
      let contractRate = this.transactiondata[0].CONTRACTRATE;

      let fcyAmount = this.transactiondata[0].AMOUNTSENTF ? this.transactiondata[0].AMOUNTSENTF : "";
      if(fcyAmount == ""){
        const amountValues : any[] = amount.split(',').map((value:any)=> parseFloat(value)); // spilt amount and change string to numbers
        const rateValues : any[] = contractRate.split(',').map((value:any) => parseFloat(value));    // spilt rate and change string to numbers
      
        const payeeValues : any[] = amountValues.map((amt, index) => amt / rateValues[index]); // calucaltae payee gets based on corresponding amount & rate
      
        const payeeGets = payeeValues.reduce((total, value) => total + value); // total payeegets amount
      
        this.totalFcyAmount = payeeGets;
      }
      else if(fcyAmount != "") {
        this.totalFcyAmount = this.transactiondata[0].AMOUNTSENTF ? this.transactiondata[0].AMOUNTSENTF : "";
      }
      this.fcyCurrency =  this.transactiondata[0].SENDCCY ;
      this.adminFee = this.transactiondata[0].ORGCOMMISSION;
      this.totalCustomerSends = this.transactiondata[0].AMOUNTSENT + this.transactiondata[0].ORGCOMMISSION

        }
    
  
  
    this.referenceIdNumber = this.transactiondata[0].TRANSACTIONID ;
    let customerId = this.transactiondata[0].CUSTOMERID ;
    var date = this.transactiondata[0].CREATEDDATE ;
    this.formattedDate = this.datePipe.transform(date, 'd MMMM yyyy, h:mm a');
    
    this.customerSearchService.retrieveCustomerInquiry(customerId).subscribe((data:any) => {
      this.customerInquiry = data;
      this.registrationNo = data.registrationNo ? data.registrationNo : "Not provided" ;
      this.incorporationPlace = data.incorporationPlace ? data.incorporationPlace : "Not provided" ;
      this.incorporationDate = data.incorporationDate ? data.incorporationDate : "Not provided" ;
      this.localAddress = data.address.filter((v:any) => v.isprimary == "Y");
      if(this.localAddress.length != 0){
        this.localAddress = this.localAddress[0] ;
        let streetName = this.localAddress.streetName ? `${this.localAddress.streetName}, ` : "";
        let country = this.localAddress.country ? this.localAddress.country : "No country provided";
        let addressUnit = this.localAddress.unit == 0 || this.localAddress.unit == null ? '' : `- ${this.localAddress.unit},`;
        let addressLevel = this.localAddress.level == 0 || this.localAddress.level == null ? '' : `# ${this.localAddress.level}`;
        let addressBlock = this.localAddress.block == 0 || this.localAddress.block == null ? '' : ` ${this.localAddress.block},`;
            //expected Address format for corporate : street name, building name (block is building name) , #level-unit, country
        let formatAddress = streetName + addressBlock +  addressLevel + addressUnit + country;
        this.companyPostalCode = this.localAddress.postalCode ? this.localAddress.postalCode : "no postal code provided"
        this.address = formatAddress;
      }
      else {
        this.address = "Address not provided";
      }
      
    },
    (error:any) =>{
      if(error.status != 401){
      this.dialog.open(ErrorDialogComponent)

      }
    });

  }


  async share(){
    this.shareBtn = false;
    this.loader = true;
   let newnavigator = window.navigator;
    //Consumer > transactionDetails > after Clicking Share button > Converting DOM into image 
     var node:any = document.getElementById('my-node');
    //  this.transferDetailsImg = htmlToImage.toPng(node).then(function (dataUrl:any) {
    //  this.transferDetailsImg = htmlToImage.toJpeg(node).then(function (dataUrl:any) {
    //  this.transferDetailsImg = htmlToImage.toBlob(node).then(function (dataUrl:any) {
    //   var img = new Image();
    //   img.src = dataUrl;
    //   console.log("dataURL: "+dataUrl)
    //   return dataUrl
    // })
    //  this.transferDetailsImg = htmlToImage.toBlob(node).then(function (dataUrl:any) {
      this.transferDetailsImg = htmlToImage.toPng(node).then(async  (dataUrl:any) => {
        this.shareBtn = true;
        this.loader = false;
      var img = new Image();
      img.src = dataUrl;
      console.log("dataURL: "+dataUrl)
      console.log(dataUrl)
      const blob : Blob =  await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'filename.png', { type: "image/png" });
      // if(newnavigator.canShare({files:[file]})){
        const shareData = {
          files:[file],
          title:'Share Trasaction Details',
          text: 'Transaction Details'
        };
        try{
          newnavigator.share(shareData);
        }
        catch (err) {
          console.log("Error: "+err);
        }
      // }
    })

     // const shareData = {
    //   files:[file],
    //   title:'Share Trasaction Details',
    //   text: 'Transaction Details'
    // };
    // try{
    //   await navigator.share( shareData )
    // }
    // catch (err) {
    //   console.log("Error: "+err)
    // }
}

downloadReceipt() {
  var node: any = document.getElementById('content1');
  
  // Set the options for html2canvas
  var options = {
    scale: 2, // Adjust the scale factor as needed
    quality: 1, // Adjust the image quality as needed
    width: node.offsetWidth, // Use the original width of the element
    height: node.offsetHeight, // Use the original height of the element
  };

  // Use html2canvas to capture the content and convert it to an image
  html2canvas(node, options).then(function (canvas) {
    // Convert the canvas to a data URL
    var dataUrl = canvas.toDataURL('image/jpeg'); // Change 'image/jpeg' to 'image/png' for PNG format

    // Create a link element and set the data URL as the href
    var link = document.createElement('a');
    link.download = 'Receipt.jpg'; // Change the file name extension to '.png' for PNG format
    link.href = dataUrl;

    // Simulate a click on the link element to trigger the download
    link.click();
  });
}


getRelationDescription(code: string): string {
  let relationship = this.relationArr.find(item => item.CODE === code);
  return relationship ? relationship.RELATION : ""; // Fallback to code if no match is found
}

}
