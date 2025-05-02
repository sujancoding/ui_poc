import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

@Component({
  selector: 'app-errordialog',
  templateUrl: './errordialog.component.html',
  styleUrls: ['./errordialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {
  errorMessage : string = '';
  constructor(private dialogRef: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,private store : InMemoryCache) { }

  ngOnInit(): void {
    if(this.data.errorMessage == "500"){
     this.errorMessage = "File size is too large , kindly reupload !";
    }
    if(this.data.errorMessage == "Internal Server Error"){
      this.errorMessage = "please contact branch";
      this.store.setItem('ERR_MESSAGE',this.errorMessage);
    }
    if(this.data.errorMessage == 'INACTIVE'){
      this.errorMessage = "Your account is deactivated, please contact branch!";
    }
    else{
      this.errorMessage = 'please contact branch';
      this.store.setItem('ERR_MESSAGE',this.errorMessage);
    }
  }
  closeDialog(){
    this.dialogRef.closeAll();
  }
}