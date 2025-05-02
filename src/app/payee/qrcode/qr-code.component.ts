import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import {  Observable } from 'rxjs/Observable';
import { interval, observable, Subscription } from 'rxjs';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { TransactionData } from 'src/app/dashboards/model/approveddashboard';
import { Router } from '@angular/router';
import { GenerateQR } from 'src/app/core/model/qrgenerate/qr.file';
import { ErrorDialogComponent } from 'src/app/onboarding/modals/errordialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

declare global {
  interface Window {
      MobileAppService: any;
  }
}

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit , OnDestroy {
  qrImage : any;
  sentMoney:any;
  payeeName !: string;
  referenceNumber !: string;
  customerSends : any;
  data : any
  counter : any;
  showQR : Boolean = true;
  showExpiredQR : Boolean = false;
  callBackService: any; 
  transactionSearch : TransactionData[] = [];
  loader : Boolean = false;
  transactionStatus : any;
  downloadQrButton = true ;
  qrloader = false ;
  
  constructor(private router: Router, private store: InMemoryCache,private headerService : TitleHeaderService,
    private sanitizer:DomSanitizer,public dialog : MatDialog,private transactionService : TransactionService,
    private snackBar : MatSnackBar) {
     }
  ngOnDestroy(): void {
    clearInterval(this.callBackService);
  }
  
  ngOnInit(): void {
   this.headerService.setTitle('QR Image');
   this.timer(5); //timer for 5 minutes
   this.referenceNumber = this.store.getItem('REFERENCE_NUMBER');
   this.data = this.store.getItem('QR_BINARYDATA');
   this.qrImage = this.sanitizer.bypassSecurityTrustUrl(('data:image/jpeg;base64,' + this.data));
   this.callBack();
 
  }
 //in 60 seconds -> call transaction search service
 callBack(){ 
      this.callBackService = setInterval(()=> {
    console.log("Service again Executed!");
    let transactionId = this.store.getItem('REFERENCE_NUMBER');
    this.transactionService.getTransactionSearch(transactionId).subscribe((datas:any) =>{
      console.log(datas['data']);
      this.transactionSearch = datas['data'];
      this.transactionSearch.filter((v:any)=> {
        if(v.TXNSTATUS == "INITIATED"){
          console.log("INITIATED");
        }
        if(v.TXNSTATUS == "AMOUNT RECEIVED"){
          console.log("AMOUNT RECEIVED");
          this.ngOnDestroy();
          this.router.navigate(['payee/money-receipt']);
         }
      })  
    },
      //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialog.open(ErrorDialogComponent) ;
    }
  }
    )
  }, 20000); //20 seconds
  
 
  
  }
 
  //User clicks - click here after payment button
  paymentStatus(){
    this.loader = true;
    let transactionId = this.store.getItem('REFERENCE_NUMBER');
    setTimeout(() => {
      this.transactionService.getTransactionSearch(transactionId).subscribe((datas:any) =>{
        console.log(datas['data']);
        this.transactionSearch = datas['data'];
        this.loader = false;
        this.transactionSearch.filter((v:any)=> {
          if(v.TXNSTATUS == "INITIATED"){
           console.log("Initiated");
          }
          if(v.TXNSTATUS == "AMOUNT RECEIVED"){
            console.log("AMOUNT RECEIVED");
            this.ngOnDestroy();
            this.router.navigate(['payee/money-receipt']);
           }
        })  
      },
         //error handling completed in 30-06-2023
  (error:any)=>{
    this.loader = false;
    if(error.status != 401){
      this.dialog.open(ErrorDialogComponent) ;
    }
  }
      ) 
    }, 1000);
   
  }
downloadImage(){
  console.log('download qr');
  this.saveImage();
}
saveImage() {
  this.downloadQrButton = false ;
  this.qrloader = true ;
  let isMobileApp = sessionStorage.getItem('ISMOBILEAPP') ? sessionStorage.getItem('ISMOBILEAPP') : "" ;
  if(isMobileApp == "Y"){  //User tries thru mobile application (apk)
    let binaryData = 'data:image/jpeg;base64,' + this.store.getItem('QR_BINARYDATA');
    var downImage = window.MobileAppService.saveImageToGallery({imageData : binaryData, format: 'base64' }) ;
    downImage.then(
      (resolve: any)=>{
          var downSuccess= resolve;
          console.log(downSuccess);
          this.downloadQrButton = true ;
          this.qrloader = false ;
          this.snackBar.open("Receipt successfully downloaded", "Ok",{
            duration: 2000,
            panelClass: "green-notification-snackbar"
          });
      
      },
      (failure: any)=>{
          console.log(failure);
          this.downloadQrButton = true ;
          this.qrloader = false ;
          this.snackBar.open("Receipt download failed", "Ok",{
            duration: 2000,
            panelClass: "red-notification-snackbar"
          });
      }
      );
  }
  else{ //User tries thru chrome browser
  const linkSource =
  'data:image/jpeg;base64,' + this.store.getItem('QR_BINARYDATA');
          this.downloadQrButton = true ;
          this.qrloader = false ;
const downloadLink = document.createElement('a');
    const fileName = 'QR_CODE.jpeg';
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}
timer(minute:any) {
  let seconds: number = minute * 60;
  let textSec: any = "0";
  let statSec: number = 0;

  const prefix = minute < 10 ? "0" : "";

  const timer = setInterval(() => {
    seconds--;
    if (statSec != 0) statSec--;
    else statSec = 59;

    if (statSec < 10) {
      textSec = "0" + statSec;
    } else textSec = statSec;

    this.counter = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

    if (seconds == 0) {
      this.showExpiredQR = true;
      this.showQR = false;
      clearInterval(timer);
      this.ngOnDestroy();
    }
  }, 1000);
}

}