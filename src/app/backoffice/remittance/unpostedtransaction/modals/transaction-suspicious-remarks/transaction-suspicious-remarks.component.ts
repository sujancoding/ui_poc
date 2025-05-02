import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-transaction-suspicious-remarks',
  templateUrl: './transaction-suspicious-remarks.component.html',
  styleUrls: ['./transaction-suspicious-remarks.component.scss']
})
export class TransactionSuspiciousRemarksComponent implements OnInit {
  form !: FormGroup;
  isUnposted: boolean = false;
  toolbarHeader : string = "";
  readonly : boolean = false ;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<TransactionSuspiciousRemarksComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    let data: any;
    console.log(this.data)
    // if we open this dialod via unposted screen this if will excuted.
    if ('susRemarks' in this.data) {
      data = this.data ? this.data.susRemarks : "";
      this.isUnposted = true;
      this.toolbarHeader = "Suspicious Remarks";
    }
    // if we open this dialog via clicking warning icon this if will executed.
    else if ('remarks' in this.data) {
      data = this.data ? this.data.remarks : ""
      this.isUnposted = false;
      this.toolbarHeader = "View Remarks";
      this.readonly =true;
    }
    else {
      data = ""
    }

    this.form = this.fb.group({
      "susRemarks": [data, [Validators.compose([Validators.pattern('^[a-zA-Z0-9 .,:;-]+$'), Validators.maxLength(40), Validators.required])]]
    })

  }
  // this function will be called when we save form. 
  onSave() {
    if (this.form.valid) {
      // sending suspicious remarks in after close dialog data.
      const susRemarks = this.form.controls['susRemarks'].value ? this.form.controls['susRemarks'].value : "";
      console.log(susRemarks);
      this.dialogRef.close({ remarks: susRemarks });
    } else {
      console.log("Form is invalid");
    }
  }

}
