import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

@Component({
  selector: 'app-error-dialog-admin',
  templateUrl: './error-dialog-admin.component.html',
  styleUrls: ['./error-dialog-admin.component.scss']
})
export class ErrorDialogAdminComponent implements OnInit {
  showImage : any;
  message : string = "";
 
  failedContract : Boolean = false;
  okButton : Boolean = true;
  errorTitleMessage : string = "Error..Something Went Wrong !" ;
  icon = "cancel" ;
  showTryAgainMssg = true ;

  constructor(public dialog : MatDialogRef<ErrorDialogAdminComponent>,@Inject(MAT_DIALOG_DATA) public data: any, 
  public store : InMemoryCache,private router : Router) { }
  
  ngOnInit(): void {
    if(this.data.errorMessage){
      this.message = this.data.errorMessage;
      this.failedContract = false;
      this.okButton = true;
      if(this.data.titleMessage){ // if there is any titlemessage found , there would be dynamic title message in dialog...
        this.errorTitleMessage = this.data.titleMessage ? this.data.titleMessage : "Error..Something Went Wrong !" ;
        this.icon = "warning" ;
        this.showTryAgainMssg = false ;
      }
    }
    if(this.data.agentBookContract == "Booking Failed !"){
      
      this.message = this.data.agentBookContract ;
      this.failedContract = true;
      this.okButton = false;
    }

    else if(this.data.mcManagementReport){ //Agent send Money --> if they try to use couple of contracts with diff f.currencies
      this.message = this.data.mcManagementReport ? this.data.mcManagementReport : "";
      this.failedContract = false;
      this.icon = "warning" ;
      this.showTryAgainMssg = false ;
    }
  }
  closeDialog(){
    this.store.setItem('SERVICE_FAILED', "true")
    this.dialog.close({data: "ErrorDialogClosed"  });
  }

  //this function is called when book contract api is failed - from agent side
  closeDialogAgent(){
    this.router.navigate(['agent/agent-view-contract']);
  }
}
