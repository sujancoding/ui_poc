import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { SubmitApplication } from 'src/app/core/model/SubmitApplication';
import { ApplicationService } from 'src/app/core/services/application.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { ProfileEvaluatingComponent } from '../profile-evaluator-alert.component';
import { ErrorDialogComponent } from '../errordialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';


@Component({
  selector: 'app-corporate-progress-report',
  templateUrl: './corporate-progress-report.component.html',
  styleUrls: ['./corporate-progress-report.component.scss']
})
export class CorporateProgressReportComponent implements OnInit {
  disableButton : Boolean = true;
  progressBar: number = 5;
  showPercentage!: string;
  profileSuccessIcon: Boolean = false;
  associatesSuccessIcon: Boolean = false;
  documentsSuccessIcon: Boolean = false;
  showArrowIcon: Boolean = true;
  showSaveButton : Boolean = true;
  loader : Boolean = false;
  submitApplication: SubmitApplication = new SubmitApplication();

  constructor(private dialog : MatDialog, private router: Router, private _bottomSheet: MatBottomSheet, private _bottomSheetRef: MatBottomSheetRef<CorporateProgressReportComponent>,
    private store: InMemoryCache, @Inject(MAT_BOTTOM_SHEET_DATA) public data: { corporateApplicationUpgrade: any }, private applicationService: ApplicationService) {

  }

  ngOnInit(): void {
    if (this.data.corporateApplicationUpgrade.companyProfileFlag == "N" && this.data.corporateApplicationUpgrade.associatesFlag == "N" && this.data.corporateApplicationUpgrade.documentsFlag == "N") {

      this.progressBar = 5
      this.showPercentage = "1%";
    }
    if (this.data.corporateApplicationUpgrade.companyProfileFlag == "Y") {
      var NumberOfY = Object.values(this.data.corporateApplicationUpgrade)
      let result = NumberOfY.filter(x => x === "Y").length;
      this.progressBar = result / 3 * 100;
      this.profileSuccessIcon = true;
    }
    if (this.data.corporateApplicationUpgrade.associatesFlag == "Y") {
      var NumberOfY = Object.values(this.data.corporateApplicationUpgrade)
      let result = NumberOfY.filter(x => x === "Y").length;
      this.progressBar = result / 3 * 100;
      this.associatesSuccessIcon = true;
    }
    if (this.data.corporateApplicationUpgrade.documentsFlag == "Y") {
      var NumberOfY = Object.values(this.data.corporateApplicationUpgrade)
      let result = NumberOfY.filter(x => x === "Y").length;
      this.progressBar = result / 3 * 100;
      this.documentsSuccessIcon = true;
    }
    if (this.progressBar == 33.33333333333333) {
      this.showPercentage = "33%";
    }
    if (this.progressBar == 66.66666666666666) {
      this.showPercentage = "66%";
    }
    if (this.progressBar == 100) {
      this.showPercentage = "100%"
      this.disableButton = false;
    }
  }
  routeDocuments(){
    const  applicationId = this.store.getItem('APPLICATION_ID');
    if(applicationId != undefined){
      this.router.navigate([`/profile/corporate-documents/${applicationId}`],{queryParams:{"application":applicationId}});
    }
    this._bottomSheetRef.dismiss();
  }
  routeCompanyProfile(){
    const  applicationId = this.store.getItem('APPLICATION_ID');
    if(applicationId != undefined){
      this.router.navigate([`/profile/company-profile/${applicationId}`],{queryParams:{"application":applicationId}});
    }
    this._bottomSheetRef.dismiss();
  }
  routeCompanyAssociate(){
    const  applicationId = this.store.getItem('APPLICATION_ID');
    if(applicationId != undefined){
      this.router.navigate([`/company/company-associate/${applicationId}`],{queryParams:{"application":applicationId}});
    }
    this._bottomSheetRef.dismiss();
  }
  submitForApproval(){
    this.showSaveButton = false;
    this.loader = true;
    this.applicationService.corporateSubmitApplication(this.buildApplication()).subscribe(data => {
      this.submitApplication = data;
      this._bottomSheet.open(ProfileEvaluatingComponent, {
        disableClose: false
      });
      this.loader = false;
      this.showSaveButton = true;
      console.log(data);
       //error handling Completed on 06-07-2023 - <DN>
    },(error : any)=> {
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent)
      }
      this.loader = false;
      this.showSaveButton = true;
    }
    
    )
    
  }
  
  
  buildApplication(): SubmitApplication {
    let applicationId : string = this.store.getItem('APPLICATION_ID') ? this.store.getItem('APPLICATION_ID') : "";
    let applicantId : string = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "";
    return new SubmitApplication({
      "applicationId": applicationId,
      "applicantId" : applicantId
    });
  }
  
  
}
