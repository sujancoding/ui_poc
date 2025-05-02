import { Component, Inject, OnInit } from '@angular/core';
import { transactionStatusArray } from 'src/assets/dropdownvalues';
import { MAT_DIALOG_DATA ,MatDialog,MatDialogRef } from '@angular/material/dialog';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { ErrorDialogAdminComponent } from '../errordialogadmin/error-dialog-admin.component';
import { UpdateTransactionStatus } from 'src/app/core/model/approvetransaction/approvetransaction';

@Component({
  selector: 'app-update-transaction-status',
  templateUrl: './update-transaction-status.component.html',
  styleUrls: ['./update-transaction-status.component.scss']
})
export class UpdateTransactionStatusComponent implements OnInit {
  
  transactionStatusArray : any[] = transactionStatusArray ;
  transactionStatusNumber : string = "" ;
  transactionStatus: string="";
  transactionId: string="";
  isLoading: boolean = false;
  customerName : string = '';
  amountSGD : any = "";
  amountF : any = "" ;
  sendCcy : string = "" ;
  paymentMode : string = ""

  constructor(@Inject(MAT_DIALOG_DATA) public data: any ,private dialogRef: MatDialogRef<UpdateTransactionStatusComponent>,
  private transactionService: TransactionService,private dialog: MatDialog) {  }
  //constructor parameter --> Inject MATDIALOG data property

  ngOnInit(): void {
    // 1. receive that data and patch in UI 
    // 2. patch transaction status and transaction Id

    //customerName : customerName, amountSGD : amountSGD, amountF : amountF
    this.customerName = this.data.customerName;
    this.amountSGD = this.data.amountSGD;
    this.amountF = this.data.amountF;
    this.sendCcy = this.data.sendCcy;
    if (this.data && this.data.transactionId) {
      this.transactionStatus = this.data.transactionStatus ? this.data.transactionStatus : "";
      this.transactionId = this.data.transactionId ? this.data.transactionId : "" ;
    }
    else {
      this.transactionStatus = "";
      this.transactionId = "No Transaction Id found"
    }
  }

  saveChanges(){
    //1. trigger UpdateTransaction Status API 
    //2. Once service is success --> close the mat dialog . dialogRef.close({data:'SUCCESS'})
    //3. In error handling --> close the mat dialog and open the ErrorDialogAdmin Component ..
    let transactionStatus = this.transactionStatus ? this.transactionStatus : "" ;
    if(transactionStatus != ""){
      this.transactionStatusNumber = this.getTransactionStatusNO(transactionStatus);
    }
    this.isLoading = true;
    setTimeout(() => {
      //Update transaction status service call...
      this.transactionService.updateTransactionStatus(this.transactionStatusNumber, this.buildTransactionStatus()).subscribe(
        (datas: any) => {
          this.isLoading = false;
          console.log(datas) ;
          this.dialogRef.close({ data: 'SUCCESS' });

        },
        (error: any) => {
          this.dialogRef.close({data : "SERVICE ISSUE"});
          this.isLoading = false;
          if (error.status !== 401) {
            this.dialog.open(ErrorDialogAdminComponent,{
              data : {errorMessage : error.error.errorMessage ? error.error.errorMessage : ""}
            });
          }
        }
      );
    }, 0); 
  }
  buildTransactionStatus() :UpdateTransactionStatus {
    {
    return new UpdateTransactionStatus({
    "transactionId":this.transactionId ? this.transactionId : "",
     "documentData":"",
     "paymentMode" : this.paymentMode ? this.paymentMode : "" // added payment mode in payload
    })
   }
  }
  getTransactionStatusNO(status: string): string {
    let transactionStatusNumber = this.transactionStatusArray.find(item => item.DESCRIPTION == status);
    return transactionStatusNumber ? transactionStatusNumber.NO : ""; 
  }
  closeDialog(): void {
    this.dialogRef.close({data : "NO DATA"});
  }
}

