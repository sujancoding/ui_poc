import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reprint-transaction',
  templateUrl: './reprint-transaction.component.html',
  styleUrls: ['./reprint-transaction.component.scss']
})
export class ReprintTransactionComponent implements OnInit {
  txnForm !: FormGroup;
  constructor(private fb : FormBuilder,public dialogRef: MatDialogRef<ReprintTransactionComponent>) { }

  ngOnInit(): void {
    this.txnForm = this.fb.group({
      "txnId" : [null,[Validators.compose([Validators.pattern('^[0-9 ]+$'),Validators.maxLength(40),Validators.minLength(1),Validators.required])]]
    })
  }

  print(){
    //console.log the transactionId whatever user tries to feed .
    //for now close the dialogRef 'ReprintTransactionComponent'
    if (this.txnForm.valid) {
      const transactionId = this.txnForm.controls['txnId'].value ? this.txnForm.controls['txnId'].value : "" ;
      console.log(transactionId);
      this.dialogRef.close({txnId:transactionId});
    } else {
      console.log("Form is invalid");
    }
  }
}
