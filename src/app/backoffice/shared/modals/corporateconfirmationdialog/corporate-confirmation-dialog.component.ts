import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApplicationFulFillment } from 'src/app/core/model/ApplicationFulFillment';
import { ApplicationService } from 'src/app/core/services/application.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

@Component({
  selector: 'app-corporate-confirmation-dialog',
  templateUrl: './corporate-confirmation-dialog.component.html',
  styleUrls: ['./corporate-confirmation-dialog.component.scss']
})
export class CorporateConfirmationDialogComponent implements OnInit {
  deactivateCustomerFlag !: Boolean;
  rejectApplicant !: Boolean;
  productCode : string = "" ;
  constructor(private dialogRef: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any, private applicationService: ApplicationService,private store: InMemoryCache ) { }

  ngOnInit(): void {
    if(this.data.productCode != ""){
      this.productCode = this.data.productCode ? this.data.productCode : ""
    }
    
  }
  closeAll(){
  this.applicationService.corporateApplicationFulFilment(this.reject()).subscribe(data => {
    console.log(data);
    if(data != undefined){
      this.store.setItem('APPLICATION_REJECTED',data);
      this.dialogRef.closeAll();
    }
  });
}
reject(): ApplicationFulFillment{
  let applicationId : any ;
  if(this.productCode == "MC"){
    applicationId = this.store.getItem('MC_CORP_APPLICATIONID') ? this.store.getItem('MC_CORP_APPLICATIONID') : "" ;
  }
  else if(this.productCode == ""){
    applicationId = this.store.getItem('CORPORATE_APPLICATION_ID');
  }
  return new ApplicationFulFillment({
    "applicationId": applicationId,
    "status": "REJECTED"
})
}
}
