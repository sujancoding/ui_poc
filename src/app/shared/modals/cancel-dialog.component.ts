import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InMemoryCache } from '../services/cache.service';

@Component({
  selector: 'app-cancel-dialog',
  templateUrl: './cancel-dialog.component.html',
  styleUrls: ['./cancel-dialog.component.scss']
})
export class CancelDialogComponent implements OnInit {

  reviewedBy !: string ;

  constructor(private router: Router,private store: InMemoryCache,public dialogRef: MatDialogRef<CancelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if(this.data.reviewedBy == "BACKOFFICE"){
     this.reviewedBy = "BACKOFFICE";
    }
    else if (this.data.reviewedBy == "AGENT"){
      this.reviewedBy = "AGENT";
    }
    else if(this.data.reviewedBy == "CORPORATE"){
      this.reviewedBy = "CORPORATE";
    }
  }
  cancelRemittance(){
    if(this.reviewedBy == "AGENT"){
      this.store.removeItem('TOTALAMOUNT_FOREIGNCCY') ;
      this.store.removeItem('SELECTED_PAYEEID') ;
       this.store.removeItem('REMARKS') ;
       this.store.removeItem('REF_ID');
       this.store.removeItem('QR'); //storing QR binary from response
       this.dialogRef.close();
       this.router.navigate(['agent/agent-sendmoney']);
    }
    else if(this.reviewedBy == "CORPORATE"){ //Corporate send money
      this.dialogRef.close();
      this.router.navigate(['payee/corporate-deal-sendmoney']);
    }
    else{
      this.dialogRef.close();
       this.router.navigate(['transaction/send-money']);  //Backoffice send money
    }
  }
}
