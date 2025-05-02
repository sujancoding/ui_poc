
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { TransactionData } from 'src/app/dashboards/model/approveddashboard';
import { InMemoryCache } from 'src/app/shared/services/cache.service';


@Component({
  selector: 'app-corporate-deal-qr',
  templateUrl: './corporate-deal-qr.component.html',
  styleUrls: ['./corporate-deal-qr.component.scss']
})

export class CorporateDealQrComponent implements OnInit , OnDestroy{

  counter : any;
  callBackService: any; 
  transactionSearch : TransactionData[] = [];
  showQR : Boolean = true;
  showExpiredQR : Boolean = false;
  loader : Boolean = false;
  data : any
  qrImage : any;
  refreshIndicator !: string ;


  constructor(private router: Router, private store: InMemoryCache,private headerService : TitleHeaderService,
    private sanitizer:DomSanitizer,public dialog : MatDialog,private transactionService : TransactionService) { }

  ngOnInit(): void {
    this.headerService.setTitle('QR Image');
    this.data = this.store.getItem('QR'); //QR binary from response
    let indicator = this.store.getItem('QR_EXPIRED') 
    if(indicator == "REFRESHED"){
      this.counter = `00:00`;
      this.data = this.store.getItem('QR') ;
      this.qrImage = this.sanitizer.bypassSecurityTrustUrl(('data:image/jpeg;base64,' + this.data));
      this.showQR = false;
      this.showExpiredQR = true ;
    }
    else{
      this.timer(5); //timer for 5 minutes
      //this.data = qrBinary ;
      this.qrImage = this.sanitizer.bypassSecurityTrustUrl(('data:image/jpeg;base64,' + this.data));
       this.callBack();
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
        clearInterval(timer)
        this.store.setItem('QR_EXPIRED','REFRESHED');
        this.ngOnDestroy();
      }
    }, 1000);
  }
//in 20 seconds -> call transaction search service
callBack(){ 
  this.callBackService = setInterval(()=> {
console.log("Service again Executed!");
let transactionId = this.store.getItem('REF_ID');
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
      this.router.navigate(['payee/corporate-deal-transaction-receipt']);
     }
  })  
},
 //error handling Completed on 06-07-2023 - <DN>
(error : any)=> {
  if(error.status != 401){
    this.dialog.open(ErrorDialogAdminComponent)
  }
})
}, 20000); //20 seconds

}

//User clicks - click here after payment button
paymentStatus(){
  this.loader = true;
  let transactionId = this.store.getItem('REF_ID');
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
          this.router.navigate(['payee/corporate-deal-transaction-receipt']);
         }
      })  
    },
     //error handling Completed on 06-07-2023 - <DN>
    (error : any)=> {
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent)
      }
    }) 
  }, 1000);
 
}
downloadImage(){
console.log('download qr');
this.saveImage();
}
saveImage() {
const linkSource =
'data:image/jpeg;base64,' + this.store.getItem('QR');
const downloadLink = document.createElement('a');
  const fileName = 'QR_CODE.jpeg';
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}
  ngOnDestroy(): void {
    clearInterval(this.callBackService);
  }
}

