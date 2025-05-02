import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-management-report-confirmation-dialog',
  templateUrl: './view-management-report-confirmation-dialog.component.html',
  styleUrls: ['./view-management-report-confirmation-dialog.component.scss']
})
export class ViewManagementReportConfirmationDialogComponent implements OnInit {

  showViewButton = true ;
  constructor(public dialogRef: MatDialogRef<ViewManagementReportConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if(this.data?.isCustomerTableReview){
      this.showViewButton = false ; //hide the view button if entry point is > Backoffice > Customer search > PDF or EXCEL save
    }
    else{
      this.showViewButton = true ; //else show the view button
    }
  }

  //ON CLICK EITHER ACTION BUTTON --> VIEW OR SAVE AS PDF
  triggerConfirmation(action:string){
   if(action == "VIEW"){ //JSON
    this.dialogRef.close({action : action})
   }
   else if (action == "SAVE"){ //PDF
     this.dialogRef.close({action : action})
   }
   else if (action == "XLSX"){ //Excel
    this.dialogRef.close({action : action})
  }
  }

}
