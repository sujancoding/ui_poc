import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { SuccessDialogComponent } from '../../components/success-dialog/success-dialog.component';
import { MoneyChangerReportsService } from 'src/app/core/services/mcreports.service';

@Component({
  selector: 'app-cancel-transaction',
  templateUrl: './cancel-transaction.component.html',
  styleUrls: ['./cancel-transaction.component.scss']
})
export class CancelTransactionComponent implements OnInit {

  transactionId : string = "" ;
  labelMessage : string = "" ;
  entityId : string = "" ;
  kycLabel : string = "" ;
  kycId : string = "" ;
  branch : string = "" ;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private transactionService : TransactionService,
  private dialog : MatDialog, public dialogRef: MatDialogRef<CancelTransactionComponent>,
private mcReportService: MoneyChangerReportsService) { }

  ngOnInit(): void {

    if(this.data){
    if(this.data.txnId){  //entry point: RT > REMITTANCE > UNPOSTED > CANCEL TXN .
      this.labelMessage = "Are you sure , you want to cancel this transaction Id : "
      this.transactionId = this.data.txnId ;
      this.entityId = this.data.txnId ;
    }
    else if(this.data.kycId){ //entry point: MC > REPORT > KYC CONFIG > DELETE KYC .
      this.labelMessage = "Are you sure , you want to delete this category : "
      this.entityId = this.data.kycLabel ? this.data.kycLabel : "" ;
      this.kycLabel = this.data.kycLabel ? this.data.kycLabel : "" ;
      this.kycId = this.data.kycId ? this.data.kycId : "" ;
      this.branch = this.data.branch ? this.data.branch : "";
    }
  }
  }

  onDeleteEntity(){
    if(this.transactionId != ""){
     this.transactionService.cancelTransactionApi(this.transactionId).subscribe((datas:any)=>{
       this.dialogRef.close("Cancel Transaction API Success") ;
       this.dialog.open(SuccessDialogComponent,{
        data : "Cancel Transaction Success"
       })
     },
     (error:any) =>{
      this.dialogRef.close("Cancel Transaction API Failure") ;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
    }
     ) ;
    }
    else if(this.kycId != ""){
      if(this.branch == "RT"){
        this.transactionService.deleteKyc(this.kycId).subscribe(data => {
          //success case
          this.dialogRef.close(data) ;
          this.dialog.open(SuccessDialogComponent,{
           data : `${this.kycLabel}: Deleted successfully`
          })
       },
       (error:any) =>{
         this.dialogRef.close("API Failure") ;
         if(error.status != 401){
           this.dialog.open(ErrorDialogAdminComponent,{
             data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
           }) ;
         }
       }
     )
      }
      else{
        this.mcReportService.deleteKyc(this.kycId).subscribe(data => {
          //success case
          this.dialogRef.close(data) ;
          this.dialog.open(SuccessDialogComponent,{
           data : `${this.kycLabel}: Deleted successfully`
          })
       },
       (error:any) =>{
         this.dialogRef.close("API Failure") ;
         if(error.status != 401){
           this.dialog.open(ErrorDialogAdminComponent,{
             data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
           }) ;
         }
       }
     )
      }
    }
  }

  onClose(){
    this.dialogRef.close() ;
  }

}
