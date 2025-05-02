import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { ErrorDialogComponent } from 'src/app/onboarding/modals/errordialog.component';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';
import { getTxnStatusAndColor } from 'src/assets/transactionstatus';
import { MatSnackBar } from '@angular/material/snack-bar';
import { relationArr, sharingTypeValue } from 'src/assets/dropdownvalues';

declare global {
  interface Window {
      MobileAppService: any;
  }
}

@Component({
  selector: 'app-consumer-transfer-receipt',
  templateUrl: './consumer-transfer-receipt.component.html',
  styleUrls: ['./consumer-transfer-receipt.component.scss']
})
export class ConsumerTransferReceiptComponent implements OnInit {

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
address !: string;
orgExchangeRate !: any;
amountSent !: any;
sendCurrency !: string;
commission !: any;
txnStatus !: string;
customerName !: string;
payeeName !: string;
downloadReceiptButton : boolean = true ;
sharingType !: string ;
sharingTypeValues = sharingTypeValue ;
displaySharingType !: string;
amountSentF !: number ;
accountNo : string = "" ;
swiftCode : string = "" ;
routingCode : string = "" ;
relationship : string = "";
relation:any []=relationArr;

constructor(private store: InMemoryCache,private headerService:TitleHeaderService,
  private datePipe : DatePipe , private customerSearchService : CustomerSearchService,
  private dialog : MatDialog,private snackBar : MatSnackBar) { }
  ngOnInit(): void {
    this.headerService.setTitle('Transfer Details');
    this.loggedInUser = this.store.getItem("LOGGEDIN_ID");
    let jsonString = this.store.getItem('TRANSACTION_ID');
    console.log('TRANSFER RECEIPT') ;
    this.transactiondata = JSON.parse(jsonString);

    this.sharingType = this.transactiondata[0].SHARINGTYPE ? this.transactiondata[0].SHARINGTYPE : "";
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
    }

    this.orgExchangeRate = this.transactiondata[0].ORGEXCHRATE;
    this.amountSent = this.transactiondata[0].AMOUNTSENT;
    this.sendCurrency = this.transactiondata[0].SENDCCY;
    this.commission = this.transactiondata[0].ORGCOMMISSION;
    this.txnStatus = this.transactiondata[0].TXNSTATUS;
    this.customerName = this.transactiondata[0].ACCOUNTTITLE;
    this.payeeName = this.transactiondata[0].NAME;
    this.referenceIdNumber = this.transactiondata[0].TRANSACTIONID ;
    this.amountSentF = this.transactiondata[0].AMOUNTSENTF ? this.transactiondata[0].AMOUNTSENTF : (this.transactiondata[0].AMOUNTSENT * this.transactiondata[0].ORGEXCHRATE) ;
    this.accountNo = this.transactiondata[0].ACCOUNTNBR ? this.transactiondata[0].ACCOUNTNBR : "" ;
    this.swiftCode = this.transactiondata[0].SWIFTCODE ? this.transactiondata[0].SWIFTCODE : "" ;
    this.routingCode = this.transactiondata[0].ROUTINGCODE ? this.transactiondata[0].ROUTINGCODE : "" ;
    let customerId = this.transactiondata[0].CUSTOMERID ;
    var date = this.transactiondata[0].CREATEDDATE ;
    this.formattedDate = this.datePipe.transform(date, 'd MMMM yyyy, h:mm a');
    let relationshipCode = this.transactiondata[0].RELATIONSHIP ? this.transactiondata[0].RELATIONSHIP : "";
    if(relationshipCode != ""){
     this.relationship = this.getRelationDescription(relationshipCode) ;
    }
    this.customerSearchService.retrieveCustomerInquiry(customerId).subscribe((data:any) => {
      this.customerInquiry = data;
      this.localAddress = data.address.filter((v:any) => v.isprimary == "Y");
      this.localAddress = this.localAddress[0] ;
      if(this.localAddress == undefined){
        this.address = "Address not provided";
      }
      this.address = this.localAddress.level +","+ this.localAddress.block  +","+ this.localAddress.unit +","+ this.localAddress.streetName  +","+this.localAddress.country;
    },
    error =>{
      this.dialog.open(ErrorDialogComponent)
    });

  }
  
  getColor(status: any){
    const statusObj : any= getTxnStatusAndColor(status);
    this.status = statusObj.status; 
    return statusObj.color;
  }
transferDetailsImg : any;
navigator : any;
  async share(){
    this.shareBtn = false;
    this.loader = true;
   let newnavigator = window.navigator;
    //Consumer > transactionDetails > after Clicking Share button > Converting DOM into image 
     var node:any = document.getElementById('my-node');
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

}

downloadReceipt() {
  console.log("download receipt ") ;
  this.downloadReceiptButton = false ;
  this.loader = true ;
  let isMobileApp = sessionStorage.getItem('ISMOBILEAPP') ? sessionStorage.getItem('ISMOBILEAPP') : "" ;
  if(isMobileApp == "Y"){  //User tries thru mobile application (apk)
    var node: any = document.getElementById('content1');
  // Set the options for html2canvas
  var options = {
    scale: 2, // Adjust the scale factor as needed
    quality: 1, // Adjust the image quality as needed
    width: node.offsetWidth, // Use the original width of the element
    height: node.offsetHeight, // Use the original height of the element
  };

// Use html2canvas to capture the content and convert it to an image
html2canvas(node, options).then( (canvas) => {
// Convert the canvas to a data URL
var dataUrl = canvas.toDataURL('image/jpeg'); // Change 'image/jpeg' to 'image/png' for PNG format

var downImage = window.MobileAppService.saveImageToGallery({imageData : dataUrl, format: 'base64' }) ;
downImage.then(
  (resolve: any)=>{
      var downSuccess= resolve;
      console.log(downSuccess);
      this.downloadReceiptButton = true ;
      this.loader = false ;
      this.snackBar.open("Receipt successfully downloaded", "Ok",{
        duration: 2000,
        panelClass: "green-notification-snackbar"
      });
  
  },
  (failure: any)=>{
      console.log(failure);
      this.downloadReceiptButton = true ;
      this.loader = false ;
      this.snackBar.open("Receipt download failed", "Ok",{
        duration: 2000,
        panelClass: "red-notification-snackbar"
      });
  }
  );
});

}
else{ //Thru its chrome browser
  var node: any = document.getElementById('content1');
  // Set the options for html2canvas
  var options = {
    scale: 2, // Adjust the scale factor as needed
    quality: 1, // Adjust the image quality as needed
    width: node.offsetWidth, // Use the original width of the element
    height: node.offsetHeight, // Use the original height of the element
  };
  this.downloadReceiptButton = true ;
  this.loader = false ;
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
}
getRelationDescription(code: string): string {
  let relationship = this.relation.find(item => item.CODE === code);
  return relationship ? relationship.RELATION : ""; // Fallback to code if no match is found
}
}
