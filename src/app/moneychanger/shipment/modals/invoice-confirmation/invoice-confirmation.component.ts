import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice-confirmation',
  templateUrl: './invoice-confirmation.component.html',
  styleUrls: ['./invoice-confirmation.component.scss']
})
export class InvoiceConfirmationComponent implements OnInit {

  //Variable declaration.
 shipmentId !: string ;

  // can implement dependency inj.
  constructor(public dialogRef: MatDialogRef<InvoiceConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    //No activity needed
    if(this.data.shipmentId){
      this.shipmentId = this.data.shipmentId ? this.data.shipmentId : "" ;
    }
  }


  onSaveConfirmation(flag:string){
    if(flag == "downloadreceipt"){
      //Perform service call : Service need to expose by BE .
      //Once receipt service call is completed and its success --> dialogRef.close('receipt downloaded')
      this.dialogRef.close({message: 'receipt-downloaded', shipmentId: this.shipmentId});
    }
    else if(flag == "noreceipt"){
    //Navigate back to 'Shipment search' screen --> dialogRef.close('receipt not downloaded')
    this.dialogRef.close({message : 'receipt-not-downloaded'});
    }
  }

}
