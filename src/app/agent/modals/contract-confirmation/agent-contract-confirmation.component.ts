import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AgentServiceService } from '../../agent-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { BookContract} from '../../models/agentpricing.model';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

@Component({
  selector: 'app-agent-contract-confirmation',
  templateUrl: './agent-contract-confirmation.component.html',
  styleUrls: ['./agent-contract-confirmation.component.scss']
})
export class AgentContractConfirmationComponent implements OnInit,OnDestroy {
  counter : any;
  minutes : any;
  seconds : any;
  foreignCurrency : any;
  sellingAmount : any;
  buyingAmount : any;
  loader : Boolean = false;
  showBookNow:Boolean=true;
  timerInterval : any;
  exchangeRate : any ;
  isWindowOpen : boolean = false ;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private router : Router,private agentService:AgentServiceService
  ,private matDialog:MatDialog,private store : InMemoryCache,
  private dialogRef: MatDialogRef<AgentContractConfirmationComponent>) { }
  
  

  ngOnInit(): void {
    this.isWindowOpen = this.data.windowStatus;
    if(this.data.contractReview){
      console.log(this.data.windowStatus) ;
      console.log(this.data.contractReview);
      this.minutes = this.data.contractReview;
      var minute = this.minutes.split(":")[0];
      this.seconds = this.minutes.split(":")[1];
      this.timer(minute);
      this.foreignCurrency = this.data.foreignCurrency;
      this.sellingAmount = this.data.buyingAmount;
      this.buyingAmount =  this.data.sellingAmount;
      this.exchangeRate = this.data.exchangeRate ;
    }
  }
  confirmBookContract(){
    this.loader=true;
    this.showBookNow=false;
    if(this.store.getItem('PRICING_ID') != undefined){
      var pricingId = this.store.getItem('PRICING_ID') ;
    }
   
    this.agentService.bookContract(this.buildPayload(pricingId)).subscribe(data=>{
      this.loader=false;
        this.showBookNow=true;
        this.store.setItem('AGENT_BOOKCONTRACT_INTIME','Contract Booked Successfully !');
        clearInterval(this.timerInterval);
        // if isWindowOpen == true , redirect to popup contract listing , close the dialogRef
        if(this.isWindowOpen == true){
          this.router.navigate(['rt-popups-window/contract-listing']);
          this.ngOnDestroy();
        }
        else{ //else redirect to view contract screen .
        this.router.navigate(['agent/agent-view-contract']);
        this.ngOnDestroy();
        }
        console.log(data)},
        //error handling completed on 05/07/2023
      (error:any) => {
        this.loader=false;
        this.showBookNow=true;
        console.log("Current time error is " + error);
        if(error.status != 401){
          this.matDialog.open(ErrorDialogAdminComponent , {
            disableClose : true,
            data : {agentBookContract : "Booking Failed !"}
          })
        }
        clearInterval(this.timerInterval);
        this.ngOnDestroy() ;
      });
    }
    buildPayload(pricingId:string):BookContract{
     return new BookContract({
      "pricingId":pricingId 
     })
      
    }
  timer(minute:any) {
    let seconds: number = this.seconds;
    let textSec: any = "0";
    let statSec: number = this.seconds;
  
    const prefix = minute < 10 ? "0" : "";
  
     this.timerInterval = setInterval(() => {
      seconds--;
      if (statSec != 0)
       statSec--;
      else
       statSec = 59;
  
      if (statSec < 10) {
        textSec = "0" + statSec;
        if(textSec == "00"){
          minute-- ;
        }
      }
       else{
        textSec = statSec;
       }
        
  
      this.counter = `${prefix}${Math.floor(minute)}:${textSec}`;
  
      if (seconds == 0 && minute == 0) {
        clearInterval(this.timerInterval);
        this.store.setItem('AGENT_BOOKCONTRACT_TIMEOUT','Due to lack of time , Last contract was failed !');
        this.dialogRef.close();
        if(this.isWindowOpen == true){
          this.router.navigate(['rt-popups-window/contract-listing']);
        }
        else{
        this.router.navigate(['agent/agent-view-contract']);
        }
        this.ngOnDestroy();
      }
    }, 1000);
  }
  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
    
  }
rejectedScreen(){
  if(this.isWindowOpen == true){
    this.router.navigate(['rt-popups-window/contract-listing']);
    this.store.setItem("CANCEL_CONTRACT","Last Contract was cancelled by you !")
  }
  else{
 this.router.navigate(['agent/agent-view-contract']);
 this.store.setItem("CANCEL_CONTRACT","Last Contract was cancelled by you !")
  }
}
  }
  
