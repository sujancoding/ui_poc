import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-confirmation-dialog',
  templateUrl: './user-confirmation-dialog.component.html',
  styleUrls: ['./user-confirmation-dialog.component.scss']
})
export class UserConfirmationDialogComponent implements OnInit {

  message = "" ;
  noteMessage = "" ;

  constructor(public dialogRef: MatDialogRef<UserConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if(this.data.agentRetrieveContractReview){
      this.message = "Are you sure you want to change the currency ?"
      this.noteMessage = "(Existing contracts will be removed)"
    }
  }

  //user action...
  triggerConfirmation(action:string){
    if(action == "NO"){
      this.dialogRef.close({action : action})
     }
     else if (action == "OK"){
       this.dialogRef.close({action : action})
     }
  }

}
