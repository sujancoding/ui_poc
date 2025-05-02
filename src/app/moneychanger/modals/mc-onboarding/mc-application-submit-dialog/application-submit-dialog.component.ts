import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { SubmitApplication } from 'src/app/core/model/SubmitApplication';
import { ApplicationService } from 'src/app/core/services/application.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

@Component({
  selector: 'app-application-submit-dialog',
  templateUrl: './application-submit-dialog.component.html',
  styleUrls: ['./application-submit-dialog.component.scss']
})
export class ApplicationSubmitDialogComponent implements OnInit {

  showCorporateBtn : boolean = false ;
  showIndBtn : boolean = false ;

  constructor(public dialogRef: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,
    private applicationService: ApplicationService, private dialog : MatDialog, private store : InMemoryCache) { }

  ngOnInit(): void {
  //checking corporate application or individual application ..
    if(this.data.isIndReview){
     this.showIndBtn = true ;
     this.showCorporateBtn = false ;
    }
    else if(this.data.isCorporateReview){
      this.showCorporateBtn = true ;
      this.showIndBtn = false ;
    }
  }

  //Submit individual application..
  submitApplication(){
    this.applicationService.submitApplication(this.buildApplication()).subscribe(data => {
      this.store.setItem('MC_APPLICATION_ONBOARDING_INDICATOR','PENDING')
      this.dialogRef.closeAll() ;
      console.log(data);
    },
    //error handlig done on 01/07/2023
    (error:any)=>{
      if(error.status != 401){
        if(error.error.errorMessage){
          this.dialog.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : error.error.errorMessage }
          }) 
        }
        else{
          this.dialog.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : "Please check technical team" }
          }) 
        }
      }
    }
    )
  }

  buildApplication(): SubmitApplication {
    return new SubmitApplication({
      "applicationId" : this.store.getItem('MC_IND_APPLICATION_ID') ? this.store.getItem('MC_IND_APPLICATION_ID') : "" ,
      "applicantId" :  this.store.getItem('MC_IND_APPLICANT_ID') ? this.store.getItem('MC_IND_APPLICANT_ID') : ""
    });
  }

  //Submit corporate application..
  submitCorpApplication(){
    this.applicationService.corporateSubmitApplication(this.buildCorpApplication()).subscribe(data => {
      this.store.setItem('MC_APPLICATION_ONBOARDING_INDICATOR','PENDING') ;
      this.dialogRef.closeAll() ;
      console.log(data);
    },
    //error handlig done on 01/07/2023
    (error:any)=>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent)
      }
    }
    )
  }

  buildCorpApplication(): SubmitApplication {
    return new SubmitApplication({
      "applicationId" : this.store.getItem('MC_CORP_APPLICATIONID') ?  this.store.getItem('MC_CORP_APPLICATIONID') : "" ,
      "applicantId" :  this.store.getItem('MC_CORP_APPLICANTID') ?  this.store.getItem('MC_CORP_APPLICANTID') : ""
    });
  }

}
