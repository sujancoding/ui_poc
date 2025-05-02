import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-customerstatus-remarks',
  templateUrl: './view-customerstatus-remarks.component.html',
  styleUrls: ['./view-customerstatus-remarks.component.scss']
})
export class ViewCustomerstatusRemarksComponent implements OnInit {

  //declare variable 
  remarks : string = "" ;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any) { }
  //in constructor function parameter --> inject MatDialog Data for recieving the data which from parent component 'CustomerSearch'

  ngOnInit(): void {
    //write a if condition for receiving the data from parent component .
    //after receiving --> store the remarks data in a reference variable .
    // use that reference variable 'remarks' to interpolate in html and display the reason .
    if(this.data.isCustomerInquiryResponse){
      this.remarks = this.data.isCustomerInquiryResponse.remarks ? this.data.isCustomerInquiryResponse.remarks : "No Data Found !";
    }
  }

}
