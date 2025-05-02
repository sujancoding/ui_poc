import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileinfoService } from 'src/app/core/services/profileinfo.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IdentitydocumentComponent } from '../documents/document-uploader.component';
import { PersonalInfoComponent } from '../basic-info/basic-info.component';
import { ApplicationService } from 'src/app/core/services/application.service';
import { ApplicationSteps } from 'src/app/core/model/ApplicationFlagSteps';
import { ApplicationUpdate } from 'src/app/core/model/Appication Update/Application_Update';
import { SourceOfWealth } from 'src/app/core/model/Appication Update/Application_Update';
import { ApplicationInquiry } from 'src/app/core/model/ApplicationInquiry/Application-Inquiry';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { CustomerInquiry, UpdateCustomerDatas } from 'src/app/core/model/Customer Inquiry/customer-inquiry';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { ErrorDialogComponent } from '../../modals/errordialog.component';
import { countryArr } from 'src/assets/dropdownvalues';
import { MatStepper } from '@angular/material/stepper';
import { DocumentsIndividualMcComponent } from 'src/app/moneychanger/modals/mc-onboarding/documentsindividual/documents-individual-mc.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-sourceofwealth',
  templateUrl: './sourceofwealth.component.html',
  styleUrls: ['./sourceofwealth.component.scss']
})
export class AddressComponent implements OnInit {

  public form: FormGroup = Object.create(null);
  loading = false;
  loader = false;
  submitted = false;
  formReady: any = false;
  id!: string;
  customerId!: string;
  flag!: Boolean;
  saveSOW: Boolean = true;
  application: ApplicationUpdate = new ApplicationUpdate();
  showEmptyFields!: Boolean;
  applicationInquiry: ApplicationInquiry = new ApplicationInquiry();
  customerInquiry: CustomerInquiry = new CustomerInquiry();
  applicationId: any
  isReadOnly: boolean = false;
  applicationStatus: any;
  customerFlag: Boolean = false;
  filteredCountries : any[] = countryArr ;
  country : any[] = countryArr ;
  formStatus !: string;
  @Output() sourceOfWealthStatusChanged = new EventEmitter<any>();
  @Input() stepper!: MatStepper; // Receive MatStepper reference from parent component;
  showEditableForBranchChannel : boolean = false ;
  isDisableEditCustomerDetails : boolean = true ;
  showEditInfo : boolean = false ;
  showDontEdit : boolean = false ;
  showSaveChangesButton : boolean = false ;
  // isFormControlChanged: boolean = true;

  constructor(private fb: FormBuilder, private profileService: ProfileinfoService, private route: ActivatedRoute,
    private router: Router, private alertService: AlertService, private _bottomSheet: MatBottomSheet, private customerSearchService: CustomerSearchService,
    @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialog, private applicationService: ApplicationService, private store: InMemoryCache,
    private headerService: TitleHeaderService,private snackBar : MatSnackBar) {

  }

  clearValidators(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.clearValidators();
      control?.updateValueAndValidity();
 });
 }
 
 updateValidations(employmentType: string) {
  if (employmentType === 'UNEMPLOYED' || employmentType === 'RETIRED') {
    // marking office name, level, unit, block, streetname, country, postalcode, officedesknumber as non mandatory.
 this.form.controls['EmployerName'].setValidators([Validators.maxLength(100)]);
 this.form.controls['SourceOfIncome'].setValidators([Validators.required]);
 this.form.controls['YearlyIncomeRange'].setValidators([ Validators.required,]);
 this.form.controls['Level'].setValidators([Validators.pattern('^[0-9 \-\']+'),Validators.maxLength(40)]);
 this.form.controls['Unit'].setValidators([Validators.pattern('^[0-9 \-\']+'),Validators.maxLength(40)]);
 this.form.controls['Block'].setValidators([Validators.maxLength(40)]);
 this.form.controls['StreetName'].setValidators([Validators.maxLength(40)]);
 this.form.controls['Country'].clearValidators();
 this.form.controls['PostalCode'].setValidators([Validators.pattern('^[0-9 \-\']+'), Validators.maxLength(10)]);
 this.form.controls['officedesknumber'].setValidators([Validators.pattern('^[0-9 \-\']+'), Validators.maxLength(8)]);
 this.form.controls['designation'].setValidators([Validators.required,Validators.pattern('[a-zA-Z0-9 ,.:;-]*$'),Validators.maxLength(40)]);
 }
 
 else{
 this.form.controls['EmployerName'].setValidators([Validators.required,Validators.maxLength(100)]);
 this.form.controls['SourceOfIncome'].setValidators([Validators.required]);
 this.form.controls['YearlyIncomeRange'].setValidators([ Validators.required,]);
 this.form.controls['Level'].setValidators([Validators.required,Validators.pattern('^[0-9 \-\']+'),Validators.maxLength(40)]);
 this.form.controls['Unit'].setValidators([Validators.required, Validators.pattern('^[0-9 \-\']+'),Validators.maxLength(40)]);
 this.form.controls['Block'].setValidators([Validators.required,Validators.maxLength(40)]);
 this.form.controls['StreetName'].setValidators([Validators.required,Validators.maxLength(40)]);
 this.form.controls['Country'].setValidators([Validators.required]);
 this.form.controls['PostalCode'].setValidators([Validators.required, Validators.pattern('^[0-9 \-\']+'), Validators.maxLength(10)]);
 this.form.controls['officedesknumber'].setValidators([Validators.required,Validators.pattern('^[0-9 \-\']+'), Validators.maxLength(8)]);
 // added designation field 
 this.form.controls['designation'].setValidators([Validators.required,Validators.pattern('[a-zA-Z0-9 ,.:;-]*$'),Validators.maxLength(40)]); 
}
 // After updating validators, update validity status
 for (const controlName in this.form.controls) {
   if (this.form.controls.hasOwnProperty(controlName)) {
     // Set validators and update validity
     this.form.controls[controlName].updateValueAndValidity({ onlySelf: true, emitEvent: false });
   }
 }

}


  ngOnInit(): void {
    console.log('sow loaded') ;
    this.headerService.setTitle('Source Of Wealth');
    this.form = this.fb.group({
      EmploymentType: [null, Validators.compose([Validators.required])],
      EmployerName: [null, [Validators.compose([Validators.required]),Validators.maxLength(100)]],
      SourceOfIncome: [null, [Validators.compose([Validators.required])]],
      YearlyIncomeRange: [null, Validators.compose([Validators.required])],
      Level: [null, [Validators.compose([Validators.required]), Validators.pattern('^[0-9 \-\']+'),Validators.maxLength(40)]],
      Unit: [null, [Validators.compose([Validators.required]), Validators.pattern('^[0-9 \-\']+'),Validators.maxLength(40)]],
      Block: [null, [Validators.compose([Validators.required]),Validators.maxLength(40)]],
      StreetName: [null, [Validators.compose([Validators.required]),Validators.maxLength(40)]],
      Country: [null, [Validators.compose([Validators.required])]],
      PostalCode: [null, [Validators.compose([Validators.required]), Validators.pattern('^[0-9 \-\']+'), Validators.maxLength(10)]],
      officedesknumber: [null, [Validators.compose([Validators.required]), Validators.pattern('^[0-9 \-\']+'), Validators.maxLength(8)]],
      companyCountry : [null], //newly added on 15 Sep2023 , to search country in country Dropdown
      designation : [null, [Validators.compose([Validators.required,Validators.pattern('[a-zA-Z0-9 ,.:;-]*$'),Validators.maxLength(40)])]], // added designation field in form 
    });
    // accessing form control using employmentTypeControl
    const employmentTypeControl = this.form.get('EmploymentType'); 
    if (employmentTypeControl) {
      employmentTypeControl.valueChanges.subscribe(value => { 
        // update validators according to employment type.
        this.updateValidations(value); 
      }); 
    }

     //show empty fields so that the customers will share their bioInfo,SOW & docs on premises
     if (this.data.appOnboardingForMc) {
      this.headerService.setTitle('Account Opening');
      this.showEmptyFields = true;
      this.saveSOW = false;
      this.isReadOnly = false ;
    }

    //MC => Application Search => Open basic profile , edit => Open SOW , edit
    if(this.data.appSearchOnboardingForMc){
      this.headerService.setTitle('Account Opening');
      this.showEditableForBranchChannel = true;
      let applicationId = this.data.applicationId ? this.data.applicationId : "" ;
      let applicantId = this.data.applicantId ? this.data.applicantId : "" ;
      this.store.setItem('MC_IND_APPLICATION_ID',applicationId) ;
      this.store.setItem('MC_IND_APPLICANT_ID',applicantId) ;
      this.saveSOW = false;
      this.isReadOnly = false ;
      this.loadApplicationInquiryMcOnboarding() ;
    }

    //APPLICATION INQUIRY (Customer -> mobile)
    if (this.store.getItem('APPLICATIONSTATUS') == "NEW" || this.store.getItem('APPLICATIONSTATUS') == "PENDING") {
      this.route.queryParams.subscribe((params: any) => {
        let applicationId = params.application;
        if (applicationId != undefined) {
          this.profileService.getApplicationInquiry(applicationId).subscribe(data => {
            this.applicationInquiry = data;
            this.applicationStatus = this.store.getItem('APPLICATIONSTATUS');
            if (this.applicationStatus == "PENDING" || data.status == "PENDING") {
              this.isReadOnly = true;
              this.saveSOW = false;
            }
            this.form.patchValue({
              "EmploymentType": this.applicationInquiry.sourceOfWealth.employmentType ? this.applicationInquiry.sourceOfWealth.employmentType : "",
              "EmployerName": this.applicationInquiry.sourceOfWealth.officeName ? this.applicationInquiry.sourceOfWealth.officeName : "",
              "SourceOfIncome": this.applicationInquiry.sourceOfWealth.sourceOfIncome ? this.applicationInquiry.sourceOfWealth.sourceOfIncome : "",
              "YearlyIncomeRange": this.applicationInquiry.sourceOfWealth.yearlyIncomeRange ? this.applicationInquiry.sourceOfWealth.yearlyIncomeRange : "",
              "Level": this.applicationInquiry.sourceOfWealth.level ? this.applicationInquiry.sourceOfWealth.level : "",
              "Unit": this.applicationInquiry.sourceOfWealth.unit ? this.applicationInquiry.sourceOfWealth.unit : "",
              "Block": this.applicationInquiry.sourceOfWealth.block ? this.applicationInquiry.sourceOfWealth.block : "",
              "StreetName": this.applicationInquiry.sourceOfWealth.streetName ? this.applicationInquiry.sourceOfWealth.streetName : "",
              "Country": this.applicationInquiry.sourceOfWealth.country ? this.applicationInquiry.sourceOfWealth.country : "",
              "PostalCode": this.applicationInquiry.sourceOfWealth.postalCode ? this.applicationInquiry.sourceOfWealth.postalCode : "",
              "officedesknumber": this.applicationInquiry.sourceOfWealth.officeContactNumber ? this.applicationInquiry.sourceOfWealth.officeContactNumber : "",
              "companyCountry" : this.applicationInquiry.sourceOfWealth.country ? this.applicationInquiry.sourceOfWealth.country : "",
              "designation" : this.applicationInquiry.sourceOfWealth.designation ? this.applicationInquiry.sourceOfWealth.designation : ""
            });


          },
           //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogComponent) ;
    }
  })
        }
      })
    }

    //CUSTOMER INQUIRY (Customer -> mobile)
    if (this.store.getItem('APPLICATIONSTATUS') == "APPROVED" || this.store.getItem('CUSTOMER_STATUS') == 'ACTIVE') {
        this.isReadOnly = true;
        this.saveSOW = false;
        this.route.queryParams.subscribe((params: any) => {
        let customerId = params.customer;
        if (customerId != undefined) {
          this.customerSearchService.getCustomerInquiry(customerId).subscribe(data => {
            this.customerInquiry = data;
            this.isReadOnly = true;
            this.saveSOW = false;
            this.form.patchValue({
              "EmploymentType": this.customerInquiry.sourceOfWealth.employmentType ? this.customerInquiry.sourceOfWealth.employmentType : "",
              "EmployerName": this.customerInquiry.sourceOfWealth.officeName ? this.customerInquiry.sourceOfWealth.officeName : "",
              "SourceOfIncome": this.customerInquiry.sourceOfWealth.sourceOfIncome ? this.customerInquiry.sourceOfWealth.sourceOfIncome : "",
              "YearlyIncomeRange": this.customerInquiry.sourceOfWealth.yearlyIncomeRange ? this.customerInquiry.sourceOfWealth.yearlyIncomeRange : "",
              "Level": this.customerInquiry.sourceOfWealth.level ? this.customerInquiry.sourceOfWealth.level : "",
              "Unit": this.customerInquiry.sourceOfWealth.unit ? this.customerInquiry.sourceOfWealth.unit : "",
              "Block": this.customerInquiry.sourceOfWealth.block ? this.customerInquiry.sourceOfWealth.block : "",
              "StreetName": this.customerInquiry.sourceOfWealth.streetName ? this.customerInquiry.sourceOfWealth.streetName : "",
              "Country": this.customerInquiry.sourceOfWealth.country ? this.customerInquiry.sourceOfWealth.country : "",
              "PostalCode": this.customerInquiry.sourceOfWealth.postalCode ? this.customerInquiry.sourceOfWealth.postalCode : "",
              "officedesknumber": this.customerInquiry.sourceOfWealth.officeContactNumber ? this.customerInquiry.sourceOfWealth.officeContactNumber : "",
              "companyCountry" : this.customerInquiry.sourceOfWealth.country ? this.customerInquiry.sourceOfWealth.country : "",
              "designation" : this.customerInquiry.sourceOfWealth.designation ? this.customerInquiry.sourceOfWealth.designation : ""
            });


          },
             //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogComponent) ;
    }
  })
        }
      })
    }


    //PrePopulating Datas in Modal Popup Dialog in Desktop Branch Unapproved listings(SOW Screen)
    if (this.data.isreview) {
      this.headerService.setTitle('Account Opening');
      this.clearValidators(this.form);
      this.flag = true;
      this.isReadOnly = true;
      this.saveSOW = false;
      this.form.controls['EmploymentType'].setValue(this.data.isreview.sourceOfWealth.employmentType ? this.data.isreview.sourceOfWealth.employmentType : ""),
        this.form.controls['EmployerName'].setValue(this.data.isreview.sourceOfWealth.officeName ? this.data.isreview.sourceOfWealth.officeName : ""),
        this.form.controls['SourceOfIncome'].setValue(this.data.isreview.sourceOfWealth.sourceOfIncome ? this.data.isreview.sourceOfWealth.sourceOfIncome : ""),
        this.form.controls['YearlyIncomeRange'].setValue(this.data.isreview.sourceOfWealth.yearlyIncomeRange ? this.data.isreview.sourceOfWealth.yearlyIncomeRange : ""),
        this.form.controls['Level'].setValue(this.data.isreview.sourceOfWealth.level ? this.data.isreview.sourceOfWealth.level : ""),
        this.form.controls['Unit'].setValue(this.data.isreview.sourceOfWealth.unit ? this.data.isreview.sourceOfWealth.unit : ""),
        this.form.controls['Block'].setValue(this.data.isreview.sourceOfWealth.block ? this.data.isreview.sourceOfWealth.block : ""),
        this.form.controls['StreetName'].setValue(this.data.isreview.sourceOfWealth.streetName ? this.data.isreview.sourceOfWealth.streetName : ""),
        this.form.controls['Country'].setValue(this.data.isreview.sourceOfWealth.country ? this.data.isreview.sourceOfWealth.country : ""),
        this.form.controls['PostalCode'].setValue(this.data.isreview.sourceOfWealth.postalCode ? this.data.isreview.sourceOfWealth.postalCode : ""),
        this.form.controls['officedesknumber'].setValue(this.data.isreview.sourceOfWealth.officeContactNumber ? this.data.isreview.sourceOfWealth.officeContactNumber : "")
        this.form.controls['companyCountry'].setValue(this.data.isreview.sourceOfWealth.country ? this.data.isreview.sourceOfWealth.country : "")
        this.form.controls['designation'].setValue(this.data.isreview.sourceOfWealth.designation ? this.data.isreview.sourceOfWealth.designation : "");
        // ask sujan sir for adding null set here
    }

    if (this.data.isCustomerReview) {
      this.headerService.setTitle('Customers');
      this.customerFlag = true;
      this.isReadOnly = true;
      this.saveSOW = false;
      this.showEditInfo  = true ;
      this.showDontEdit  = false ;
      this.isDisableEditCustomerDetails = false ; //enabling edit customer details button .
      if(this.data.isCustomerReview.sourceOfWealth){
      this.form.controls['EmploymentType'].setValue(this.data.isCustomerReview.sourceOfWealth.employmentType ? this.data.isCustomerReview.sourceOfWealth.employmentType : '' ),
        this.form.controls['EmployerName'].setValue(this.data.isCustomerReview.sourceOfWealth.officeName ? this.data.isCustomerReview.sourceOfWealth.officeName : ""),
        this.form.controls['SourceOfIncome'].setValue(this.data.isCustomerReview.sourceOfWealth.sourceOfIncome ? this.data.isCustomerReview.sourceOfWealth.sourceOfIncome : ""),
        this.form.controls['YearlyIncomeRange'].setValue(this.data.isCustomerReview.sourceOfWealth.yearlyIncomeRange ? this.data.isCustomerReview.sourceOfWealth.yearlyIncomeRange : ""),
        this.form.controls['Level'].setValue(this.data.isCustomerReview.sourceOfWealth.level ? this.data.isCustomerReview.sourceOfWealth.level : ""),
        this.form.controls['Unit'].setValue(this.data.isCustomerReview.sourceOfWealth.unit ? this.data.isCustomerReview.sourceOfWealth.unit : ""),
        this.form.controls['Block'].setValue(this.data.isCustomerReview.sourceOfWealth.block ? this.data.isCustomerReview.sourceOfWealth.block : ""),
        this.form.controls['StreetName'].setValue(this.data.isCustomerReview.sourceOfWealth.streetName ? this.data.isCustomerReview.sourceOfWealth.streetName : ""),
        this.form.controls['Country'].setValue(this.data.isCustomerReview.sourceOfWealth.country ? this.data.isCustomerReview.sourceOfWealth.country : ""),
        this.form.controls['PostalCode'].setValue(this.data.isCustomerReview.sourceOfWealth.postalCode ? this.data.isCustomerReview.sourceOfWealth.postalCode : ""),
        this.form.controls['officedesknumber'].setValue(this.data.isCustomerReview.sourceOfWealth.officeContactNumber ? this.data.isCustomerReview.sourceOfWealth.officeContactNumber : ""),
        this.form.controls['companyCountry'].setValue(this.data.isCustomerReview.sourceOfWealth.country ? this.data.isCustomerReview.sourceOfWealth.country : "")
        // added designation field    
        this.form.controls['designation'].setValue(this.data.isCustomerReview.sourceOfWealth.designation ? this.data.isCustomerReview.sourceOfWealth.designation : "") 
      }
    //   Listen for changes whenever the formcontrol value changes on the entire form
    // this.form.valueChanges.subscribe(() => {   
    //   this.isFormControlChanged = false;
    // });

    }
  }




  get f() { return this.form.controls; }

  onSave() {
    this.saveSOW = false;
    this.loader = true;
    this.profileService.addApplicationUpdate(this.buildUpdateSourceOfWealth('MOBILE')).subscribe(
      data => {
        this.router.navigate(["/dashboard/custdash"]);
        console.log(data)
        this.loader = false;
        this.saveSOW = true;
        this.applicationService.updateScreenstatus('sourceOfIncomeFlag')
        this.alertService.clear()
        this.alertService.success("Application Successful!!");

      },
      //error handling completed on 01-07-2023
      (error:any) => {
        this.alertService.clear()
        this.alertService.error("Application Failed. Try Again");
        this.loading = false;
        this.loader = false;
        this.saveSOW = true;
        this.submitted = false;
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogComponent) ;
         }
      }
    )

  }

  buildUpdateSourceOfWealth(channel:string): ApplicationUpdate {
    let applicationId :string = "";
    let applicantId : string = "";
    if(channel == "MOBILE"){ //if its consumer onboarding from mobile , get appId and applicantId from login response
      applicationId = this.store.getItem('APPLICATION_ID') ? this.store.getItem('APPLICATION_ID') : "";
      applicantId = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "" ;
    }
    else if(channel == ""){
      applicationId = this.store.getItem('MC_IND_APPLICATION_ID') ? this.store.getItem('MC_IND_APPLICATION_ID') : "" ;
      applicantId =  this.store.getItem('MC_IND_APPLICANT_ID') ? this.store.getItem('MC_IND_APPLICANT_ID') : "";
    }
    return new ApplicationUpdate({
      "applicationType": "I",
      "applicationId" : applicationId,
      "applicantId" :  applicantId ,
      "sourceOfWealth": this.buildSourceOfWealth()
    })
  }
  buildSourceOfWealth(): SourceOfWealth {
    return new SourceOfWealth({
      "employmentType": this.form.controls['EmploymentType'].value ? this.form.controls['EmploymentType'].value : "",
      "officeName": this.form.controls['EmployerName'].value ? this.form.controls['EmployerName'].value : "",
      "sourceOfIncome": this.form.controls['SourceOfIncome'].value ? this.form.controls['SourceOfIncome'].value : "",
      "yearlyIncomeRange": this.form.controls['YearlyIncomeRange'].value ? this.form.controls['YearlyIncomeRange'].value : "",
      "level": this.form.controls['Level'].value ? this.form.controls['Level'].value : "",
      "unit": this.form.controls['Unit'].value ? this.form.controls['Unit'].value : "",
      "block": this.form.controls['Block'].value ? this.form.controls['Block'].value : "",
      "streetName": this.form.controls['StreetName'].value ? this.form.controls['StreetName'].value : "",
      "country": this.form.controls['Country'].value ? this.form.controls['Country'].value : "",
      "postalCode": this.form.controls['PostalCode'].value ? this.form.controls['PostalCode'].value : "",
      "officeContactNumber": this.form.controls['officedesknumber'].value ? this.form.controls['officedesknumber'].value : "",
      // added designation field 
      "designation": this.form.controls['designation'].value ? this.form.controls['designation'].value : ""
    })
  }
  //open document screen in Application Listings > view Docs
  openDocs() {
    this.applicationId = this.store.getItem('APPLICATION_ID');
    this.profileService.getApplicationInquiry(this.applicationId).subscribe(data => {
      this.applicationInquiry = data;
      this.dialogRef.open(IdentitydocumentComponent, {
        width: '1300px',
        height: '575px',
        panelClass: 'custom-modalbox',
        disableClose : true,
        data: { isreview: data }
      })
    },
    //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  }
    )
  }

  //Customer search > view sow - this function helps in navigating to document screen modal
  openDocsCustomerReview() {
    this.customerId = this.store.getItem('CUSTOMER_ID');
    this.customerSearchService.getCustomerInquiry(this.customerId).subscribe(data => {
      this.customerInquiry = data;
      this.dialogRef.open(IdentitydocumentComponent, {
        width: '1300px',
        height: '575px',
        panelClass: 'custom-modalbox',
        disableClose : true,
        data: { isCustomerReview: data }
      })
    },
     //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  }
    )
  }
  //personal info component prepopulated on back
  back() {
    this.applicationId = this.store.getItem('APPLICATION_ID');
    this.profileService.getApplicationInquiry(this.applicationId).subscribe(data => {
      this.applicationInquiry = data;
      this.dialogRef.open(PersonalInfoComponent, {
        width: '1245px',
        height: '575px',
        panelClass: 'custom-modalbox',
        disableClose : true,
        data: { isreview: data }
      })
    },
    //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  }
    )
  }

  //Customer search > view sow - this function helps in going back to basic info modal
  backCustomerReview() {
    this.customerId = this.store.getItem('CUSTOMER_ID')
    this.customerSearchService.getCustomerInquiry(this.customerId).subscribe(data => {
      this.customerInquiry = data;
      this.dialogRef.open(PersonalInfoComponent, {
        width: '1245px',
        height: '575px',
        panelClass: 'custom-modalbox',
        disableClose : true,
        data: { isCustomerReview: data }
      })
    },
    //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  } 
    )
  }
  //personal info component with empty fields on back
  goBack() {
    this.dialogRef.open(PersonalInfoComponent, {
      width: '1240px',
      height: '575px',
      panelClass: 'custom-modalbox',
      data: { emptyfields: true }
    })
  }

  //open document screen with no datas (empty fields)  
  // openDocuments(){
  //   this.profileService.addApplicationUpdate(this.buildUpdateSourceOfWealth()).subscribe(
  //     data => {
  //       console.log(data)
  //       if(this.form.valid){
  //       console.log('Source Of Wealth Application Success')
  //       this.alertService.success("Application Successful!!");
  //       this.alertService.clear()
  //     }
  //     else{
  //       this.alertService.clear()
  //       this.alertService.error("Application Failed. Try Again");
  //       this.loading = false;
  //       this.submitted = false;  
  //     }
  //     }
  //   )
  //   this.dialogRef.open(IdentitydocumentComponent, {
  //     width:'1240px',
  //     height: '600px',
  //     panelClass:'custom-modalbox',
  //     data: {emptyfields:true}
  //   }) 
  // }  

  //this function triggers when value entered in search payee country field 
  filterCountry(country:HTMLInputElement){
    country.value = country.value.toUpperCase() ;
    if (country.value == '') {
      // If the search input is empty, show all countries
      this.filteredCountries = this.country;
  }
  else {
      // Filter countries based on the search input
      this.filteredCountries = this.country.filter((v: any) => v.COUNTRY.includes(country.value));
      if(this.filteredCountries.length == 0){
        this.filteredCountries = this.country;
      }  
  }
  }

  onSaveSow(){
    this.profileService.addApplicationUpdate(this.buildUpdateSourceOfWealth('')).subscribe(
      data => {
        this.formStatus = "SOW Form Submitted Sucessfully"
    this.sourceOfWealthStatusChanged.emit('Submitted');
        console.log(data)
        this.stepper.next() ;


      },
      //error handling completed on 01-07-2023
      (error:any) => {
        this.alertService.clear()
       
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent) ;
         }
      }
    )
   
  }

   // This function will be trigger automatically  based on the stepper changes in the parent component
   updateStatus(event: any) {
   if(this.formStatus == "SOW Form Submitted Sucessfully"){
    this.form.valueChanges.subscribe(() => { 
      this.sourceOfWealthStatusChanged.emit('In Progress');  //Listen for changes whenever the formcontrol value changes ,we change status In-Progress
    });
   }
   else{
    this.sourceOfWealthStatusChanged.emit(this.form.valid ? 'Completed' : 'In Progress');  // Emit an stepper status to the parent-stepper component
   }
 
  }

  loadApplicationInquiryMcOnboarding(){
    let applicationId = this.store.getItem('MC_IND_APPLICATION_ID') ? this.store.getItem('MC_IND_APPLICATION_ID') : "" ;
    this.profileService.getApplicationInquiry(applicationId).subscribe(data => {
      this.applicationInquiry = data;
     
      this.form.patchValue({
        "EmploymentType": this.applicationInquiry.sourceOfWealth.employmentType ? this.applicationInquiry.sourceOfWealth.employmentType : "",
        "EmployerName": this.applicationInquiry.sourceOfWealth.officeName ? this.applicationInquiry.sourceOfWealth.officeName : "",
        "SourceOfIncome": this.applicationInquiry.sourceOfWealth.sourceOfIncome ? this.applicationInquiry.sourceOfWealth.sourceOfIncome : "",
        "YearlyIncomeRange": this.applicationInquiry.sourceOfWealth.yearlyIncomeRange ? this.applicationInquiry.sourceOfWealth.yearlyIncomeRange : "",
        "Level": this.applicationInquiry.sourceOfWealth.level ? this.applicationInquiry.sourceOfWealth.level : "",
        "Unit": this.applicationInquiry.sourceOfWealth.unit ? this.applicationInquiry.sourceOfWealth.unit : "",
        "Block": this.applicationInquiry.sourceOfWealth.block ? this.applicationInquiry.sourceOfWealth.block : "",
        "StreetName": this.applicationInquiry.sourceOfWealth.streetName ? this.applicationInquiry.sourceOfWealth.streetName : "",
        "Country": this.applicationInquiry.sourceOfWealth.country ? this.applicationInquiry.sourceOfWealth.country : "",
        "PostalCode": this.applicationInquiry.sourceOfWealth.postalCode ? this.applicationInquiry.sourceOfWealth.postalCode : "",
        "officedesknumber": this.applicationInquiry.sourceOfWealth.officeContactNumber ? this.applicationInquiry.sourceOfWealth.officeContactNumber : "",
        "companyCountry" :  this.applicationInquiry.sourceOfWealth.country ? this.applicationInquiry.sourceOfWealth.country : "",
       // added designation field 
         "designation" : this.applicationInquiry.sourceOfWealth.designation ? this.applicationInquiry.sourceOfWealth.designation : ""
      });


    },
     //error handling completed in 30-06-2023
(error:any)=>{
if(error.status != 401){
this.dialogRef.open(ErrorDialogComponent) ;
}
})
  }

   //MC => Application search => Save SOW details
  onUpdateSowMc(){
    this.profileService.addApplicationUpdate(this.buildUpdateSourceOfWealth('')).subscribe(
      data => {
         //open Modal Dialog
         let applicationId = this.store.getItem('MC_IND_APPLICATION_ID') ? this.store.getItem('MC_IND_APPLICATION_ID') : "" ;
         let applicantId = this.store.getItem('MC_IND_APPLICANT_ID') ? this.store.getItem('MC_IND_APPLICANT_ID') : "";
        this.dialogRef.open(DocumentsIndividualMcComponent, {
          width: '1300px',
          height: '575px',
          panelClass: 'custom-modalbox',
          disableClose : true,
          data: { appSearchOnboardingForMc: data , applicationId: applicationId , applicantId : applicantId}
        })
      },
      //error handling completed on 01-07-2023
      (error:any) => {
        this.alertService.clear()
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent) ;
         }
      }
    )
  }


  //MC => Application search => SOW Modal to Basic info modal (MC)
  backBasicInfoEdit(){
    let applicationId = this.store.getItem('MC_IND_APPLICATION_ID') ? this.store.getItem('MC_IND_APPLICATION_ID') : "" ;
    let applicantId = this.store.getItem('MC_IND_APPLICANT_ID') ? this.store.getItem('MC_IND_APPLICANT_ID') : "";
    this.profileService.getApplicationInquiry(applicationId).subscribe(data => {
      this.applicationInquiry = data;
      this.dialogRef.open(PersonalInfoComponent, {
        width: '1245px',
        height: '575px',
        panelClass: 'custom-modalbox',
        disableClose : true,
        data: { appSearchOnboardingForMc: data , applicationId: applicationId , applicantId : applicantId}
      })
    },
    //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  }
    )
  }

  editData(){
    this.isReadOnly = false;
    this.showSaveChangesButton = true ;
    this.showEditInfo = false ;
    this.showDontEdit = true ;
    let empType=this.form.controls['EmploymentType'].value ? this.form.controls['EmploymentType'].value : '';
    console.log(empType)
    this.updateValidations(empType);
    this.snackBar.open("Fields are editable now !" , "Ok",{
      panelClass: "custom-green-notification-snackbar",
      duration: 3000
    }) ;
  }

  //backoffice >>> customer search >>> back to fields as not editable function
  makeFieldsAsReadable(){
    this.showEditInfo = true ;
    this.showDontEdit = false ;
    this.isReadOnly = true;
  }

  //update sow details of consumer --> Update Customer service trigger .
  updateCustomerBasicProfile(){
    let custId =  this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "" ;
    this.customerSearchService.updateCustomer(custId, this.buildUpdateCustomerSowPayload()).subscribe((datas:any)=>{
      this.snackBar.open("Changes Updated Successfully !" , "Ok",{
        panelClass: "custom-green-notification-snackbar",
        duration: 3000
      }) ;
      this.clearValidators(this.form) ;
      this.isReadOnly = true;
      this.showEditInfo = true ;
      this.showDontEdit = false ;
      this.showSaveChangesButton = false ;
      this.isDisableEditCustomerDetails = false ; //enabling edit customer details button .
     },
     (error:any) => {
      this.snackBar.open("Update Failed. Try Again", "Ok",{
        panelClass: "custom-red-notification-snackbar",
        duration: 3000,
      });
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        });
      }
    })
  }

  //building payload --> customer update SOW 
  buildUpdateCustomerSowPayload():UpdateCustomerDatas{
   return new UpdateCustomerDatas({
    "customerType" : "I" ,
    "sourceOfWealth": this.buildSourceOfWealth()
   })
  }

}
