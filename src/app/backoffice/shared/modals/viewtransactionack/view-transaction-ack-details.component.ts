import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TransactionService } from 'src/app/core/services/transaction.service';
import {  CommonSearchFilterCard} from 'src/assets/styles/tables/table-styles';
import { ErrorDialogAdminComponent } from '../errordialogadmin/error-dialog-admin.component';
import { getBackgroundColor, getColor, getTooltipText } from 'src/assets/transactionstatus';

@Component({
  selector: 'app-view-transaction-ack-details',
  templateUrl: './view-transaction-ack-details.component.html',
  styleUrls: ['./view-transaction-ack-details.component.scss', '../../../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]
})
export class ViewTransactionAckDetailsComponent implements OnInit {

  isActive = false;
  public getScreenWidth: any;
  public getScreenHeight: any;
  p: number = 1;
  itemsPerPage: number = 20;
  loader !: boolean ;
  getTransactionAckRecords : any[] = [] ;
  transactionId !: string ;
  customerType !: string ;
  transactionStatus !: string ;
  noReportsData : boolean = false ;
  showFetchedData : boolean = true ;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private transactionService : TransactionService,
  private dialog : MatDialog) { }

  ngOnInit(): void {
     //getScreenWidth and getScreenHeight will get the windows inner height and width.
     this.getScreenWidth = window.innerWidth;
     this.getScreenHeight = window.innerHeight;

     //parent (unposted/fulfillment component) --> child component (ViewTransactionAckDetailsComponent) , passing data
     if(this.data.transactionId){
      this.transactionId = this.data.transactionId ;
      this.customerType = this.data.customerType ;
      this.transactionStatus = this.data.transactionStatus ;
      
      this.loader = true ;
       this.transactionService.getTransactionAckApi(this.transactionId).subscribe((datas:any)=>{
        this.loader = false ;
         this.getTransactionAckRecords = datas['data'] ;
         if(this.getTransactionAckRecords.length >= 1){
          this.noReportsData = false; 
          this.showFetchedData =  true ;
         }
         else if(this.getTransactionAckRecords.length == 0){
          this.noReportsData = true; 
          this.showFetchedData =  false ;
         }
       },
       //error handling..
       (error: any) => {
        this.loader = false;
        this.noReportsData = true; 
        this.showFetchedData =  false ;
        if (error.status != 401) {
          this.dialog.open(ErrorDialogAdminComponent);
        }
      }
       )
     }
  }

  
  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

   //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  changeTableHeight(){
    return { 'height': (152)+'px' , 'overflow-y' : 'auto' };
  }

   //STATUS color diff
   getColor(value: any) {
    return getColor(value);
    }
  
  //bg color for status tags .
  getBackgroundColor(status: string): string {
    return getBackgroundColor(status)
    }
    
  //tool tip text value based on txnstatus ..
  getTooltipText(status: string): string {
    return getTooltipText(status)
   }

}
