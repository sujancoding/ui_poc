import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-deal-summary',
  templateUrl: './view-deal-summary.component.html',
  styleUrls: ['./view-deal-summary.component.scss']
})
export class ViewDealSummaryComponent implements OnInit {

  dealArray : any[] = [] ;
  dealsCount : number = 0 ;
  fCcy : string = "" ;
  averageRate : number = 0 ;
  dealBalanceL : number = 0 ;
  dealBalanceF : number = 0 ;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<ViewDealSummaryComponent>) { }

  ngOnInit(): void {
    if(this.data.isDealReview && this.data.selectedRecordsArray){
       this.dealArray = this.data.selectedRecordsArray ;
       this.dealsCount = this.dealArray ? this.dealArray.length : 0;  //Deal Count
       this.averageRate = this.data.averageRate ; //Average rate
       if(this.dealArray.length >= 1){
        this.fCcy = this.dealArray[0].BUYCURRENCY ? this.dealArray[0].BUYCURRENCY : "" ; //Foreign currency
         // Calculate the sum of DEALBALANCEF and DEALBALANCE
         const totalDealBalanceF = this.dealArray.reduce((sum, deal) => sum + deal.DEALBALANCEF, 0);
         const totalDealBalance = this.dealArray.reduce((sum, deal) => sum + deal.DEALBALANCE, 0);

         this.dealBalanceF = totalDealBalanceF ? totalDealBalanceF: 0 ;
         this.dealBalanceL = totalDealBalance ? totalDealBalance: 0 ;

       }
    }
  }
  

}
