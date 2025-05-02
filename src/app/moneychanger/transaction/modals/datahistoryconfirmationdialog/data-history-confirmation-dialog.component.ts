import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-data-history-confirmation-dialog',
  templateUrl: './data-history-confirmation-dialog.component.html',
  styleUrls: ['./data-history-confirmation-dialog.component.scss']
})
export class DataHistoryConfirmationDialogComponent implements OnInit {

  message !: string ;
  restoreMessageIndicator = false ;

  constructor(public dialogRef: MatDialogRef<DataHistoryConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if(this.data.restoredata == true){ //retrieve data from store 
      let sequenceCustomerName = this.data.sequenceCustomerName ;
      this.message = `Are you sure , you want to restore the informations which is inside ${sequenceCustomerName} ?` ;
      this.restoreMessageIndicator = true ;
    }
    else{   //store or capture the values
      this.message = "Are you sure , you want to save this current information and make this as a draft ?" ;
      this.restoreMessageIndicator = false ;
    }
  }

  confirmToStore(){
    //close the window and add sequence number..
  if(this.restoreMessageIndicator == false){
    this.dialogRef.close({storeData : true}) ;
  }
  //close the window --> retrieve values in parent component --> kill the sequence and circle
  else{
    this.dialogRef.close({killCircle : true}) ;
  }
  }

}
