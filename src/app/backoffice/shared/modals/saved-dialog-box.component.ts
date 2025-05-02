import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-saved-dialog-box',
  templateUrl: './saved-dialog-box.component.html',
  styleUrls: ['./saved-dialog-box.component.scss']
})
export class SavedDialogBoxComponent implements OnInit {
  showValidMessage: boolean = false;
  showInvalidMessage: boolean = false;
  showEmptyMessage: boolean = false;
  showMessage !: string ;
  showValidMessageForMc = false;
  showValidMessageForMcTT = false ;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    if (this.data == "Please Validate ExchangeRate") {
      this.showInvalidMessage = true;
      this.showMessage = "Exchange rate is invalid format" ;
    }
    else if (this.data == "The ExchangeRate should not be empty") {
      this.showEmptyMessage = true;
    }
    else if(this.data == "Open Saved Dialog"){
      this.showValidMessage = true;
    }
    else if(this.data == "Please Enter Amounts"){
      this.showInvalidMessage = true;
      this.showMessage = "Please Enter Amounts" ;
    }
    else if(this.data == "Please enter both rates"){
      this.showInvalidMessage = true;
      this.showMessage = "Please enter both rates" ;
    }
    else if(this.data == "There is no exchange rate for this currency, Please contact admin !"){
      this.showInvalidMessage = true;
      this.showMessage = "There is no exchange rate for this currency, Please contact admin !" ;
    }
    else if(this.data == "Order should not be empty"){
      this.showInvalidMessage = true;
      this.showMessage = "Order field is mandatory !" ;
    }
    else if(this.data.isMCDealSaveReview){
      this.showValidMessageForMc = true;
    }
    else if(this.data.isMCTransactionSaveReview){
      this.showValidMessageForMcTT = true;
    }
    else{
      this.showValidMessage = true;
    }
  }

}
