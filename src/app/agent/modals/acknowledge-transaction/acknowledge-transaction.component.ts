import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, ReplaySubject } from 'rxjs';
import { SavedDialogBoxComponent } from 'src/app/backoffice/shared/modals/saved-dialog-box.component';
import { SuccessDialogComponent } from 'src/app/shared/components/success-dialog/success-dialog.component';
import { AgentServiceService } from '../../agent-service.service';
import { TransactionStatusUpdate } from '../../models/agentupdatetransaction.model';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-acknowledge-transaction',
  templateUrl: './acknowledge-transaction.component.html',
  styleUrls: ['./acknowledge-transaction.component.scss']
})
export class AcknowledgeTransactionComponent implements OnInit {
  senderName !: string;
  payeeName !: string;
  payeeAccountNo !: string;
  payeeBank !: string;
  swiftCode !: string;
  payeeCountry !: string;
  transactionId !: string;
  selectedStatus !: string;
  isDisabled : Boolean = true;
  base64Output !: string;
  disableUpdateButton : Boolean = true;
  showAcknowledgementDropdown !: Boolean ;
  showDepositedDropdown !: Boolean;
  statusUpdate !: string; 

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private agentService : AgentServiceService, private dialogRef : MatDialog,
  public dialog: MatDialogRef<AcknowledgeTransactionComponent>,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if(this.data != undefined){
     this.transactionId = this.data.transactionId;
     this.senderName = this.data.accountTitle;
     this.payeeName = this.data.payeeName;
     this.payeeAccountNo = this.data.accountNumber;
     this.payeeBank = this.data.payeeBank;
     this.swiftCode = this.data.swiftCode;
     this.payeeCountry = this.data.payeeCountry;
     if(this.data.transactionStatus == "APPROVED"){
       this.showAcknowledgementDropdown = true;
     }
     if(this.data.transactionStatus == "ACKNOWLEDGED"){
      this.showDepositedDropdown = true;
    }
     
    }
  }
  //onSelect - dropdown
  transactionStatusUpdate(status:string){
   if(status == "ACKNOWLEDGED"){
    this.isDisabled = true;
    this.disableUpdateButton = false;
    this.statusUpdate = "ACKNOWLEDGED";
   }
   if(status == "DEPOSITED"){
    this.isDisabled = false;
    this.disableUpdateButton = true;
    this.statusUpdate = "DEPOSITED";
  }
  }
  updateTransactionStatus(status:string){
   if(status == "ACKNOWLEDGED"){
     status = "6";
     this.agentService.updateTransactionStatus(this.acknowledgedStatusUpdate(),status).subscribe(data => {
       console.log(data);
      this.dialogRef.open(SavedDialogBoxComponent,{
        panelClass: 'custom-modalbox',
        width:'322px',
        height:'140px',
        data : "Open Saved Dialog"
      });
   },
     //error handling completed on 05-07-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  }
   )
   this.dialog.close({status : 'ACKNOWLEDGED'});
  }
  if(status == "DEPOSITED"){
    status = "7";
    this.agentService.updateTransactionStatus(this.buildPayload(),status).subscribe(data => {
      console.log(data);
      this.dialogRef.open(SavedDialogBoxComponent,{
        panelClass: 'custom-modalbox',
        width:'322px',
        height:'140px',
        data : "Open Saved Dialog"
      });
    },
      //error handling completed on 05-07-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  }
    );
    this.dialog.close({status : 'DEPOSITED'});
  }
  }
  buildPayload():TransactionStatusUpdate{
   return new TransactionStatusUpdate({
    "transactionId": this.transactionId,
    "documentData": this.base64Output
   })
  }
  acknowledgedStatusUpdate():TransactionStatusUpdate{
    return new TransactionStatusUpdate({
      "transactionId": this.transactionId,
      "documentData": ""
     })
  }
  
  onSelectFile(e: any) {
    this.disableUpdateButton = true;
    if (e.target.files) {
      if (e.target.files[0].size <= 10485760) { //10485760 bytes = 10mb , in backend they are only allowing 16mb
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]); //It reads the file and once its completed,the data is converted into binary data 
        reader.onload = (event: any) => {   //after the file reading is successfully completed onLoad is triggered

          //Allowing only jpeg , png and pdf file format only for documents uploading .
          // documentData : data:image/jpeg
          // documentData : data:image/png
          // documentData : data:application/pdf

          //Checking whether it's a jpeg or png or pdf..   
          if (e.target.files[0].type == "application/pdf" || e.target.files[0].type == "image/jpeg" || e.target.files[0].type == "image/png") {
            this.disableUpdateButton = false;
            this.base64Output= event.target.result;
          }
          //else will not fire add document api .
          else {
            //Word Document --> Restriction
            if (e.target.files[0].type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
              this._snackBar.open("Sorry, DOCX files are not supported for upload. Please choose a different file format.", "Ok", {
                duration: 3000,
              });
            }
            //Excel sheet --> Restriction
            else if (e.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
              this._snackBar.open("Sorry,Spreadsheets are not supported for upload. Please choose a different file format.", "Ok", {
                duration: 3000,
              });
            }
            //Other files --> Restriction
            else {
              this._snackBar.open("Sorry,This file is not supported for upload. Please choose a different file format.", "Ok", {
                duration: 3000,
              });
            }
          }

        }

      }
      else {
        this._snackBar.open('File size exceeds 10mb, Kindly reupload file below 10mb !', "Ok", {
          duration: 3000,
          panelClass: "red-notification-snackbar"
        });
      }
    }
  }

}
