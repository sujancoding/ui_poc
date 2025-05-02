import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { AlertDialogComponent } from 'src/app/backoffice/shared/modals/alertdialogbox/alert-dialog.component';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PayeeService } from '../service/payee.service';
import { DatePipe } from '@angular/common';
import { getTxnStatusAndColor } from 'src/assets/transactionstatus';
import { MatSnackBar } from '@angular/material/snack-bar';
import { relationArr, sharingTypeValue } from 'src/assets/dropdownvalues';

declare global {
  interface Window {
      MobileAppService: any;
  }
}

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit  {
  
  sentMoney:any;
  payeeName !: string;
  referenceNumber !: string;
  customerSends : any;
  counter : any;
  showQR : Boolean = true;
  showExpiredQR : Boolean = false;
  adminFee : any ;
  @ViewChild('content1', { static: false }) content1!: ElementRef;
  orgLogo = 'assets/images/logo1.jpg' ;
  paymentMode  = ["Paynow","Cheque","Cash"] ;
  customerInquiry : any ;
  payeeInquiry : any ;
  addressObj: any ;
  payeename : any ;
  payeeaddress  : any ;
  purpose  : any ;
  bankname : any ;
  branchname : any ;
  accountno : string = "" ;
  swiftCode : string = "" ;
  routingCode : string = "" ;
  remitForeignCcy : any ;
  orgRate: any ;
  payeeGets : any ;
  loggedInUser !: string;
  formattedDate : any ;
  status: any;
  totalCustomerSends : any ;
  downloadReceiptButton : boolean = true ;
  loader = false ;
  sharingType !: string ;
  sharingTypeValues = sharingTypeValue ;
  displaySharingType !: string ;
  relationship : string = "";
  relation:any []=relationArr;
  relationshipCode = "" ;


  constructor(private route: ActivatedRoute,private store: InMemoryCache,private headerService : TitleHeaderService,
    private sanitizer:DomSanitizer,private http : HttpClient,public dialog : MatDialog,private payeeService : PayeeService,
    private datePipe : DatePipe, private snackBar : MatSnackBar) { }
  

  
  ngOnInit(): void {
   this.headerService.setTitle('Receipt');
   console.log('TXN RECEIPT') ;
    this.loggedInUser = this.store.getItem("LOGGEDIN_ID");
    var date = new Date() ;
     this.formattedDate = this.datePipe.transform(date, 'd MMMM yyyy, h:mm a');
   //Retrieving customer details and payee details for showing in receipts .
   this.customerInquiry = JSON.parse(this.store.getItem('CUSTOMER_INQUIRY_ARRAY')) ;
   this.payeeInquiry = JSON.parse(this.store.getItem('PAYEE_ARRAY')) ;

   this.sharingType = this.store.getItem('CONSUMER_SENDMONEY_SHARINGTYPE') ? this.store.getItem('CONSUMER_SENDMONEY_SHARINGTYPE') : "" ;
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


   this.addressObj = this.customerInquiry.address.filter((v:any) => v.isprimary == "Y");
   this.addressObj = this.addressObj[0];
   this.payeename = this.payeeInquiry[0].NAME;
this.payeeaddress = this.payeeInquiry[0].ADDRESS
this.purpose = this.store.getItem('CUSTOMER_REMARKS') ;
this.bankname = this.payeeInquiry[0].BANKNAME ;
this.branchname = this.payeeInquiry[0].BRANCHNAME ;
this.accountno = this.payeeInquiry[0].ACCOUNTNBR ;
this.swiftCode = this.payeeInquiry[0].SWIFTCODE ;
this.routingCode = this.payeeInquiry[0].ROUTINGCODE ;
this.remitForeignCcy = this.store.getItem('REMIT_FOREIGN_CCY') ;
  this.orgRate = this.store.getItem('ORG_RATE') ;
  this.payeeGets = this.store.getItem('RECIPIENT_GETS') ;
   this.payeeName =  this.store.getItem('PAYEE_NAME');
   this.referenceNumber = this.store.getItem('REFERENCE_NUMBER');
   this.customerSends = this.store.getItem('CUSTOMER_SEND');
   this.adminFee = this.store.getItem('ADMIN_FEE');
   this.totalCustomerSends = parseFloat(this.customerSends) + parseFloat(this.adminFee);
 this.relationshipCode=this.payeeInquiry[0].RELATIONSHIP ? this.payeeInquiry[0].RELATIONSHIP : "";
 if(this.relationshipCode != ""){
  this.relationship = this.getRelationDescription(this.relationshipCode) ;
 }
}

savePDF(){
  const doc = new jsPDF('p', 'pt', 'a4'); // Set document size to A4

  const element : any = document.getElementById('content1');

  html2canvas(element).then((canvas) => {
    const imageData = canvas.toDataURL('image/jpeg', 1.0);
    const doc = new jsPDF('p', 'pt', 'a4');
    const imgWidth = doc.internal.pageSize.getWidth() ;
    const imgHeight = 950 ;
    doc.addImage(imageData, 'JPEG', 0, 0, imgWidth, imgHeight);
    doc.save('receipt.pdf');
  });
}


getColor(status: string){
  const statusObj : any= getTxnStatusAndColor(status);
  this.status = statusObj.status; 
  return statusObj.color;
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
  else{ //Normal download from chrome browser
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