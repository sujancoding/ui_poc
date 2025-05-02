import { P } from '@angular/cdk/keycodes';
import { Component, Input, OnInit, Inject } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { add, map } from 'lodash';
import { number } from 'ngx-custom-validators/src/app/number/validator';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { AddressComponent } from '../individual/sow/sourceofwealth.component';
import { IdentitydocumentComponent } from '../individual/documents/document-uploader.component';
import { SubmitApplication } from 'src/app/core/model/SubmitApplication';
import { PersonalInfoComponent } from '../individual/basic-info/basic-info.component';
import { ApplicationService } from 'src/app/core/services/application.service';
import { ProfileEvaluatingComponent } from './profile-evaluator-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from './errordialog.component';

@Component({
  selector: 'app-progress-report',
  templateUrl: './progress-report.component.html',
  styleUrls: ['./progress-report.component.scss']
})
export class IndividualComponent implements OnInit {
  message!: string;
  upgrade: any;
  showPercentage!: string;
  progressBar!: number;
  basicInfoLink: Boolean = false;
  sourceOfWealthLink: Boolean = false;
  documentsLink: Boolean = false;
  disabled!: Boolean;
  showProfilePending: Boolean = true;
  showProfileSuccessful: Boolean = false;
  bioInfoSuccessIcon: Boolean = false;
  SowSuccessIcon: Boolean = false;
  documentSuccessIcon: Boolean = false;
  showArrowIcon: Boolean = true;
  submitApplication: SubmitApplication = new SubmitApplication();
  disableButton : Boolean = true;
  loader = false;
  showSaveButton : Boolean = true;

  basicInfo(event: MouseEvent) {
   
    const  applicationId = this.store.getItem('APPLICATION_ID')
      this.router.navigate([`/profile/personalinfo/${applicationId}`],{queryParams:{'application':applicationId}});
    this._bottomSheetRef.afterDismissed().subscribe(() => {
      console.log('Bottom sheet has been dismissed.');
    });

    this._bottomSheetRef.dismiss();
  }
  sow(event: MouseEvent) {
    
      const  applicationId = this.store.getItem('APPLICATION_ID')
      this.router.navigate([`/profile/address/${applicationId}`],{queryParams:{'application':applicationId}});
   
    this._bottomSheetRef.dismiss();
    event.preventDefault();

  }
  docs(event: MouseEvent) {
    const  applicationId = this.store.getItem('APPLICATION_ID')
      this.router.navigate([`/profile/documentUpload/${applicationId}`],{queryParams:{'application':applicationId}});
     
    
    this._bottomSheetRef.dismiss();
    event.preventDefault();

  }

  //Submit for approval
  onSave() {
    this.showSaveButton = false;
    this.loader = true;
    this.applicationService.submitApplication(this.buildApplication()).subscribe(data => {
      this.submitApplication = data;
      this.loader = false;
      this.showSaveButton = true;
      console.log(data);
      this._bottomSheet.open(ProfileEvaluatingComponent, {
        disableClose: false
      });
    },
    //error handlig done on 01/07/2023
    (error:any)=>{
      this.loader = false;
      this.showSaveButton = true;
      if(error.status != 401){
        this.dialog.open(ErrorDialogComponent)
      }
    }
    )

  }
  
  buildApplication(): SubmitApplication {
    let applicantId : string = "";
    //if its consumer onboarding from mobile , get appId and applicantId from login response
      applicantId = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "" ;
    return new SubmitApplication({
      "applicationId": this.applicationId,
      "applicantId" : applicantId
    });
  }
  //retreiving the applicationId from cache
  applicationId = this.store.getItem('APPLICATION_ID')
  constructor(private router: Router, private _bottomSheet: MatBottomSheet, private _bottomSheetRef: MatBottomSheetRef<PersonalInfoComponent>,
    private store: InMemoryCache, @Inject(MAT_BOTTOM_SHEET_DATA) public data: { ApplicationUpgrade: any }, private applicationService: ApplicationService,
    private dialog : MatDialog) {

  }

  ngOnInit(): void {
    if (this.data.ApplicationUpgrade.basicProfileFlag == "N" && this.data.ApplicationUpgrade.sourceOfIncomeFlag == "N" && this.data.ApplicationUpgrade.documentsFlag == "N") {

      this.progressBar = 5
      this.showPercentage = "1%";
    }
    if (this.data.ApplicationUpgrade.basicProfileFlag == "Y") {
      var NumberOfY = Object.values(this.data.ApplicationUpgrade)
      let result = NumberOfY.filter(x => x === "Y").length;
      this.progressBar = result / 3 * 100;
      this.bioInfoSuccessIcon = true;
    }
    if (this.data.ApplicationUpgrade.sourceOfIncomeFlag == "Y") {
      var NumberOfY = Object.values(this.data.ApplicationUpgrade) //taking only the values from applicationStepsFlag obj 
      let result = NumberOfY.filter(x => x === "Y").length; //finding how many "Y"s we got in the object
      this.progressBar = result / 3 * 100;  //based on Y's , we are calculating the progress bar
      this.SowSuccessIcon = true;
    }
    if (this.data.ApplicationUpgrade.documentsFlag == "Y") {
      var NumberOfY = Object.values(this.data.ApplicationUpgrade)
      let result = NumberOfY.filter(x => x === "Y").length;
      this.progressBar = result / 3 * 100;
      this.documentSuccessIcon = true;
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



}
