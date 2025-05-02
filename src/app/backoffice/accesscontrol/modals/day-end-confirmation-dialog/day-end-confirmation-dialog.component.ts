import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';
import { SuccessDialogComponent } from 'src/app/shared/components/success-dialog/success-dialog.component';

@Component({
  selector: 'app-day-end-confirmation-dialog',
  templateUrl: './day-end-confirmation-dialog.component.html',
  styleUrls: ['./day-end-confirmation-dialog.component.scss']
})
export class DayEndConfirmationDialogComponent implements OnInit {

  currentDate : Date = new Date();
  constructor(public dialogRef: MatDialogRef<DayEndConfirmationDialogComponent>,
    private maintenanceService: MoneyChangerMaintenanceService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  dayClose(){
    this.maintenanceService.dayClosing().subscribe((data:any)=>{
      console.log(data) ;
      //success case
      this.dialogRef.close() ;
      this.dialog.open(SuccessDialogComponent,{
      panelClass: 'custom-modalbox',
      width:'322px',
      height:'140px',
      data: "The day closing for today was successful!",
      })
    },
    (error:any)=>{
      //failure case
      this.dialogRef.close() ;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : ""}
        }) ;
      }
    }
    )
  }

}
