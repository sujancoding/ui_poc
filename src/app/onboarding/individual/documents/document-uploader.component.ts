import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/services/alert.service';

import { AddDocument } from 'src/app/core/model/Add Document/add-document';
import { getDocumentKeyByValue , DOCUMENT_ID_MAPPER  } from 'src/app/core/model/Add Document/add-document';
import { SubmitDocument } from 'src/app/core/model/Submit Document/SubmitDocument';
import { DocumentService } from 'src/app/core/services/document.service';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddressComponent } from '../sow/sourceofwealth.component';
import { ApprovedProspect , ConfirmationDialogComponent } from 'src/app/backoffice/shared/modals/confirmation-dialog.component';
import { ApplicationService } from 'src/app/core/services/application.service';
import { ApplicationFulFillment } from 'src/app/core/model/ApplicationFulFillment';
import { distinctUntilChanged } from 'rxjs/operators';
import { ApplicationInquiry } from 'src/app/core/model/ApplicationInquiry/Application-Inquiry';
import { ProfileinfoService } from 'src/app/core/services/profileinfo.service';
import { DocumentInquiry, DocumentUpdateConsumer } from 'src/app/core/model/Document Inquiry/document-inquiry';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { CustomerInquiry } from 'src/app/core/model/Customer Inquiry/customer-inquiry';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { ApplicationListings } from 'src/app/core/model/Application Search/application-search';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PdfPreviewComponent } from '../pdfpreview/pdf-preview/pdf-preview.component';
import { PreviewDocumentComponent } from 'src/app/backoffice/preview-document/preview-document/preview-document.component';
import { ErrorDialogComponent } from '../../modals/errordialog.component';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';




@Component({
  selector: 'app-document-uploader',
  templateUrl: './document-uploader.component.html',
  styleUrls: ['./document-uploader.component.scss']
})
export class IdentitydocumentComponent implements OnInit {
  isDisableReject : Boolean = false;
  isDisableApprove : Boolean = false;
  disableFEInput : Boolean = false;
  disableBEInput : Boolean = false;
  disableOFEInput : Boolean = false;
  disableOBEInput : Boolean = false;
  disableAddressInput : Boolean = false;
  disablePayslipInput : Boolean = false;
  disableOnboardingDocInput : boolean = false;
  showFEInput : Boolean = true;
  showBEInput : Boolean = true;
  showOFEInput : Boolean = true;
  showOBEInput : Boolean = true;
  showAddressInput : Boolean = true;
  showPayslipInput : Boolean = true;
  showOnboardingDocInput : boolean = true;
  uploadFENric : Boolean = false;
  disableFENric : Boolean = false;
  uploadBENric : Boolean = false;
  disableBENric : Boolean = false;
  uploadOFENric : Boolean = false;
  disableOFENric : Boolean = false;
  uploadOBENric : Boolean = false;
  disableOBENric : Boolean = false;
  uploadAddressNric : Boolean = false;
  disableAddressNric : Boolean = false;
  uploadPayslipNric : Boolean = false;
  uploadOnboardingDoc : boolean = false;
  disablePayslipNric : Boolean = false;
  disableOnboardingDoc : boolean = false;
  showFEButton: Boolean = false;
  showBEButton : Boolean = false;
  showOFEButton : Boolean = false;
  showOBEButton : Boolean = false;
  showAddressProofButton : Boolean = false;
  showPayslipButton : Boolean = false;
  showOnboardingDocButton  : boolean = false;
  uploadFE: Boolean = true;
  uploadBE: Boolean = true;
  uploadOFE : Boolean = true;
  uploadOBE: Boolean = true;
  hideImage: Boolean = true;
  showNoDocuments : Boolean = false;
  application: AddDocument = new AddDocument()
  public form: FormGroup = Object.create(null);
  submitted = false;
  loader = false;
  loadNRICFRONT = false;
  loadNRICBACK = false;
  loadOTHERNRICFRONT = false;
  loadOTHERNRICBACK = false;
  loadAddressProof = false;
  loadPayslip = false;
  loadOnboardingDoc = false;
  flag!: Boolean;
  customerflag: Boolean = false;
  convertedFlag : Boolean = false;
  saveDocuments :Boolean = true;
  viewNRIC_FE : any;
  viewNRIC_BE : any;
  viewOTHER_NRIC_FE : any;
  viewOTHER_NRIC_BE : any;
  viewPayslip : any;
  viewOnboardingDoc : any;
  viewAddressProof : any;
  NRICBEViewButton:Boolean =false;
  getDoc: AddDocument[] = [];
  addDocument!:AddDocument;
  showEmptyFields!: Boolean;
  applicationInquiry: ApplicationInquiry = new ApplicationInquiry();
  customerInquiry : CustomerInquiry = new CustomerInquiry();
  applicationId:any;
  documentInquiry: DocumentInquiry = new DocumentInquiry();
  documentId !: string; 
  noImage!: string;
  buttonMessage:string='';
  hideAddressProof: Boolean = true;
  hidePayslip:Boolean = true;
  docFE : any;
  docBE : any;
  docOFE : any;
  docOBE : any;
  docPayslip : any;
  docAddress: any;
  docOnboarding : any;
  UploadPayslip = true;
  uploadOnboardingDocIcon = true;
  UploadAddress = true;
  showFEImage : Boolean = true;
  showBEImage :Boolean = true;
  showOFEImage : Boolean = true;
  showOBEImage : Boolean = true;
  showAddressProof : Boolean = true;
  showPayslip : Boolean = true;
  showOnboardingDoc : Boolean = true;
  customerId!: string;
  reuploadNricFront  : Boolean = false;
  reuploadNricBack : Boolean = false;
  reuploadOtherNricFront : Boolean = false;
  reuploadOtherNricBack : Boolean = false;
  reuploadPayslip : Boolean = false;
  reuploadOnboardingDoc  : Boolean = false;
  reuploadAddress : Boolean = false;
  previewPdf : Boolean = false;
  showImageFE : Boolean = true;
  showImageBE : Boolean = true;
  showImageOFE : Boolean = true;
  showImageOBE : Boolean = true;
  showImageAddress : Boolean = true;
  showImagePayslip : Boolean = true;
  showImageOnboardingDoc : boolean = true;
  showOtherFormatFEDoc : Boolean = false;
  showOtherFormatBEDoc : Boolean = false;
  showOtherFormatOFEDoc : Boolean = false;
  showOtherFormatOBEDoc : Boolean = false;
  showOtherFormatAddressDoc : Boolean = false;
  showOtherFormatPaySlipDoc : Boolean = false;
  showOtherFormatOnboardingDoc : boolean = false;
  pdfUrlFE : any;
  pdfUrlBE : any;
  pdfUrlOFE : any;
  pdfUrlOBE : any;
  pdfUrlAddress : any;
  pdfUrlPaySlip : any;
  pdfUrlOnboardingDoc  : any;
  approveRejectFlag :boolean = false ;

  //Edit Button (tagged with ngIf) ..
  showEditInfoNricFront : boolean = false ; 
  showEditInfoNricBack: boolean = false; 
  showEditInfoOtherNricFront: boolean = false;
  showEditInfoOtherNricBack: boolean = false;
  showEditInfoAddressProof: boolean = false;
  showEditInfoPayslip: boolean = false;
  showEditInfoOnboardingDoc : boolean =false;

  //Edit Button (tagged with disabled attribute) ..
  isDisableEditCustomerDetails: boolean = true;
  isDisableEditCustomerDetailsNricBack: boolean = true;
  isDisableEditCustomerDetailsOtherNricFront:boolean = true;
  isDisableEditCustomerDetailsOtherNricBack: boolean = true;
  isDisableEditCustomerDetailsAddressProof: boolean = true;
  isDisableEditCustomerDetailsPayslip: boolean = true;
  isDisableEditCustomerDetailsOnboardingDoc : boolean = true;

  //Backoffice > Customer Search > View documents > Reupload button (ngIf)
  showReuploadCustomerNricFront = false ;
  showReuploadCustomerNricBack = false;
  showReuploadCustomerOtherNricFront = false;
  showReuploadCustomerOtherNricBack = false;
  showReuploadCustomerAddressProof = false;
  showReuploadCustomerPayslip = false;
  showReuploadCustomerOnboardingDoc = false;

  customerMobileAppStatus : string = "" ;

  //Bcckoffice > Cutomer search > view documents(Consumer) > No Documents found button
  noNricFrontDocument: boolean = false;
  noNricBackDocument: boolean = false;
  noOtherNricFrontDocument: boolean = false;
  noOtherNricBackDocument: boolean = false;
  noAddressProofDocument: boolean = false;
  noPayslipDocument: boolean = false;
  noOnboardingDocument : boolean = false;

  noDocumentMessage = "";

  //Bcckoffice > Cutomer search > view documents(Consumer) > This array is used to push the Document Id that we get from the updateCustomerDocument response
  nricFrontSuccessResponseArray : any[] = []
  nricBackSuccessResponseArray : any[] = []
  otherNricFrontSuccessResponseArray : any[] = []
  otherNricBackSuccessResponseArray : any[] = []
  addressProofSuccessResponseArray : any[] = []
  payslipSuccessResponseArray : any[] = []
  onBoardingDocSuccessResponseArray : any [] = []



  constructor(public fb: FormBuilder,private profileService: ProfileinfoService, private documentService: DocumentService, private route: ActivatedRoute,
    private alertService: AlertService, private router: Router, private _bottomSheet: MatBottomSheet,private customerSearchService: CustomerSearchService,
    @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialog,private applicationService: ApplicationService , private store: InMemoryCache,
    private headerService : TitleHeaderService,private _snackBar: MatSnackBar,private domSanitizer: DomSanitizer,private snackBar : MatSnackBar) {

  }

  ngOnInit(): void {
    console.log('documnets loaded') ;
    this.headerService.setTitle('Documents');
    //Building form groups and Validations
    this.form = this.fb.group({
      NRICFront: [null, [Validators.compose([Validators.required])]],
      NRICBack: [null, [Validators.compose([Validators.required])]],
      OtherNRICFront: [],
      OtherNRICBack: [],
      AddressProof: [],
      PaySlip: [],
      OnboardingDoc : [],
    });

      //Application listings > Add Application > no service integration so far.. 
      if(this.data.appOnboardingForMc){
        this.showEmptyFields = true;
        this.saveDocuments = false;
        // this.hideAddressProof = false;
        // this.hidePayslip = false;
        }
        
  
    // indiviudal onboarding > view Docs - onLoad (APPLICATION INQUIRY API)
    if(this.store.getItem('APPLICATIONSTATUS') == "NEW" || this.store.getItem('APPLICATIONSTATUS') == "PENDING"){
    this.route.queryParams.subscribe((params: any)=> {
    console.log(params);
    let indicator = params.indicator;
    let signal = params.signal;
    if(indicator == "NRIC_FRONT_IMAGE"){
      this.reuploadNricFront = true;
      this.form.get('NRICFront')?.clearValidators();
      this.form.get('NRICFront')?.updateValueAndValidity();
    }
    if(indicator == "NRIC_BACK_IMAGE"){
      this.reuploadNricBack = true;
      this.form.get('NRICBack')?.clearValidators();
      this.form.get('NRICBack')?.updateValueAndValidity();
    }
    if(indicator == "OTHER_NRIC_FRONT"){
      this.reuploadOtherNricFront = true;
    }
    if(indicator == "OTHER_NRIC_BACK"){
      this.reuploadOtherNricBack = true;
    }
    if(indicator == "ADDRESS_PROOF"){
      this.reuploadAddress = true;
      this.form.get('AddressProof')?.clearValidators();
      this.form.get('AddressProof')?.updateValueAndValidity();
    }
    if(indicator == "PAYSLIP"){
      this.reuploadPayslip = true;
      this.form.get('PaySlip')?.clearValidators();
      this.form.get('PaySlip')?.updateValueAndValidity();
    }
    if(indicator == "ONBOARDING_DOCUMENT"){
      this.reuploadOnboardingDoc = true;
      this.form.get('OnboardingDoc')?.clearValidators();
      this.form.get('OnboardingDoc')?.updateValueAndValidity();
    }
    if(signal == "PENDING_DOCUMENT"){
      this.reuploadNricFront = false;
      this.reuploadNricBack = false;
      this.reuploadOtherNricFront = false;
      this.reuploadOtherNricBack = false;
      this.reuploadPayslip = false;
      this.reuploadOnboardingDoc = false;
      this.reuploadAddress = false;
    }
   
    let applicationId = params.application;
    if(applicationId != undefined){
    this.profileService.getApplicationInquiry(applicationId).subscribe(data => {
      this.applicationInquiry = data;

    //  let nricValue = this.applicationInquiry.demographics?.idNumber ? this.applicationInquiry.demographics?.idNumber : "" ;
      //If NRIC starts with 'S' --> Make NRIC validity field as non mandatory .
    //   if(nricValue.startsWith('S') == true){
    //    this.form.controls['AddressProof'].clearValidators() ;
    //    this.form.controls['AddressProof'].updateValueAndValidity() ;
    //  }
    //  else{
    //    this.form.controls['AddressProof'].setValidators(Validators.required) ;
    //    this.form.controls['AddressProof'].updateValueAndValidity() ;
    //  }

      if(this.store.getItem('APPLICATIONSTATUS') == "APPROVED"){
        this.saveDocuments = false;
      }
      if(this.store.getItem('APPLICATIONSTATUS') == "PENDING" || data.status == "PENDING"){
        this.saveDocuments = false;
      }
      this.docFE = this.applicationInquiry.document.filter((v=>v.docName ==="NRIC_FRONT_IMAGE"))
      this.docBE = this.applicationInquiry.document.filter((v=>v.docName ==="NRIC_BACK_IMAGE"))
      this.docOFE = this.applicationInquiry.document.filter((v=>v.docName ==="OTHER_NRIC_FRONT"))
      this.docOBE = this.applicationInquiry.document.filter((v=>v.docName ==="OTHER_NRIC_BACK"))
      this.docPayslip = this.applicationInquiry.document.filter((v=>v.docName ==="PAYSLIP"))
      this.docAddress = this.applicationInquiry.document.filter((v=>v.docName ==="ADDRESS_PROOF"))
      this.docOnboarding = this.applicationInquiry.document.filter((v=>v.docName ==="ONBOARDING_DOCUMENT"))

      if(this.docFE[0] != undefined){
      this.disableFEInput = true;
      this.showFEInput = false;
      this.buttonMessage = 'Click to view !'
      this.uploadFE = false;
      this.viewNRIC_FE = true;
      this.form.get('NRICFront')?.clearValidators();
      this.form.get('NRICFront')?.updateValueAndValidity();
      }
      if(this.docBE[0] != undefined){
        this.disableBEInput = true;
        this.showBEInput = false;
        this.buttonMessage = 'Click to view !'
        this.uploadBE = false;
        this.viewNRIC_BE = true;
        this.form.get('NRICBack')?.clearValidators();
        this.form.get('NRICBack')?.updateValueAndValidity();
      }

      if(this.docOBE[0] != undefined){
        this.disableOBEInput = true;
        this.showOBEInput = false;
        this.buttonMessage = 'Click to view !'
        this.uploadOBE = false;
        this.viewOTHER_NRIC_BE = true;
      }

      if(this.docOFE[0] != undefined){
        this.disableOFEInput = true;
        this.showOFEInput = false;
        this.buttonMessage = 'Click to view !'
        this.viewOTHER_NRIC_FE = true;
        this.uploadOFE = false;
      }

      if(this.docPayslip[0] != undefined){
        this.disablePayslipInput = true;
        this.showPayslipInput = false;
        this.buttonMessage = 'Click to view !'
        this.viewPayslip = true;
        this.UploadPayslip = false;
        this.form.get('PaySlip')?.clearValidators();
        this.form.get('PaySlip')?.updateValueAndValidity();
      }

      // pnboarding document
      if(this.docOnboarding[0] != undefined){
        this.disableOnboardingDocInput = true;
        this.showOnboardingDocInput = false;
        this.buttonMessage = 'Click to view !'
        this.viewOnboardingDoc = true;
        this.uploadOnboardingDocIcon = false;
        this.form.get('OnboardingDoc')?.clearValidators();
        this.form.get('OnboardingDoc')?.updateValueAndValidity();
      }

      if(this.docAddress[0] != undefined){
        this.disableAddressInput = true; 
        this.showAddressInput = false;
        this.buttonMessage = 'Click to view !';
        this.viewAddressProof = true;
        this.UploadAddress = false;
        this.form.get('AddressProof')?.clearValidators();
        this.form.get('AddressProof')?.updateValueAndValidity();
      }
      
      //restrict to upload document for empty field
      if(this.store.getItem('APPLICATIONSTATUS') == "PENDING"){
        if(this.docOBE[0] != undefined){
          this.disableOBEInput = true;
          this.showOBEInput = false;
          this.buttonMessage = 'Click to view !'
          this.uploadOBE = false;
          this.viewOTHER_NRIC_BE = true;
        }
        else{
          this.disableBEInput = true;
          this.disableBENric = true;
          this.uploadOBE = true;
          this.showOBEInput = false;
        }
  
        if(this.docOFE[0] != undefined){
          this.disableOFEInput = true;
          this.showOFEInput = false;
          this.buttonMessage = 'Click to view !'
          this.viewOTHER_NRIC_FE = true;
          this.uploadOFE = false;
        }
        else{
          this.disableBEInput = true;
          this.disableBENric = true;
          this.uploadOFE = true;
          this.showOFEInput = false;
        }
      }
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
if(this.store.getItem('APPLICATIONSTATUS') == "APPROVED" || this.store.getItem('CUSTOMER_STATUS') == 'ACTIVE'){ 
this.route.queryParams.subscribe((params: any)=> {
  console.log(params)
let customerId = params.customer;
if (customerId != undefined){
  this.customerSearchService.getCustomerInquiry(customerId).subscribe(data => {
    this.customerInquiry = data;

   // let nricValue = this.customerInquiry.demographics?.idNumber ? this.customerInquiry.demographics?.idNumber : "" ;
    //If NRIC starts with 'S' --> Make NRIC validity field as non mandatory .
  //   if(nricValue.startsWith('S') == true){
  //    this.form.controls['AddressProof'].clearValidators() ;
  //    this.form.controls['AddressProof'].updateValueAndValidity() ;
  //  }
  //  else{
  //    this.form.controls['AddressProof'].setValidators(Validators.required) ;
  //    this.form.controls['AddressProof'].updateValueAndValidity() ;
  //  }

    this.saveDocuments = false;
    this.docFE = this.customerInquiry.document.filter((v=>v.docName ==="NRIC_FRONT_IMAGE"))
    this.docBE = this.customerInquiry.document.filter((v=>v.docName ==="NRIC_BACK_IMAGE"))
    this.docOFE = this.customerInquiry.document.filter((v=>v.docName ==="OTHER_NRIC_FRONT"))
    this.docOBE = this.customerInquiry.document.filter((v=>v.docName ==="OTHER_NRIC_BACK"))
    this.docPayslip = this.customerInquiry.document.filter((v=>v.docName ==="PAYSLIP"))
    this.docAddress = this.customerInquiry.document.filter((v=>v.docName ==="ADDRESS_PROOF"))
    this.docOnboarding = this.customerInquiry.document.filter((v=>v.docName ==="ONBOARDING_DOCUMENT"))
    this.customerMobileAppStatus = "APPROVED" ;
    if(this.docFE[0] != undefined){
      this.disableFEInput = true;
      this.showFEInput = false
      this.buttonMessage = 'Click to view !';
      this.uploadFE = false;
      this.showFEButton = true;
    }  else{
      this.disableFEInput = true;
      this.disableFENric = true;
    }
    //customer is not allowed to upload once he is converted to customer
    
    if(this.docBE[0] != undefined){
      this.disableBEInput = true;
      this.showBEInput = false;
      this.buttonMessage = 'Click to view !';
      this.uploadBE = false;
      this.showBEButton = true;
    }else{
      this.disableBEInput = true;
      this.disableBENric = true;
    }

    if(this.docOFE[0] != undefined){
      this.disableOFEInput = true;
      this.showOFEInput = false;
      this.buttonMessage = 'Click to view !';
      this.uploadOFE = false;
      this.showOFEButton = true;
      }else{
        this.disableOFEInput = true;
        this.disableOFENric = true;
      }
   
    if(this.docOBE[0] != undefined){
      this.disableOBEInput = true;
      this.showOBEInput = false;
      this.buttonMessage = 'Click to view !';
      this.uploadOBE = false;
      this.showOBEButton = true;
    }else{
        this.disableOBEInput = true;
        this.disableOBENric = true;
      }

    if(this.docAddress[0] != undefined){
      this.disableAddressInput = true;
      this.showAddressInput = false;
      this.buttonMessage = 'Click to view !';
      this.UploadAddress = false;
      this.showAddressProofButton = true;
    }else{
      this.disableAddressInput = true;
      this.disableAddressNric = true;
    }

    if(this.docPayslip[0] != undefined){
      this.disablePayslipInput = true;
      this.showPayslipInput = false;
      this.buttonMessage = 'Click to view !';
      this.UploadPayslip = false;
      this.showPayslipButton = true;
    }else{
      this.disablePayslipInput = true;
      this.disablePayslipNric = true;
    }

    // onboarding Document
    if(this.docOnboarding[0] != undefined){
      this.disableOnboardingDocInput = true;
      this.showOnboardingDocInput = false;
      this.buttonMessage = 'Click to view !';
      this.uploadOnboardingDocIcon = false;
      this.showOnboardingDocButton = true;
    }else{
      this.disableOnboardingDocInput = true;
      this.disableOnboardingDoc = true;
    }
    
    
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

  // Application Search > view Docs -  onLoad (APPLICATION INQUIRY API)
    if (this.data.isreview) {
      this.headerService.setTitle('Account Opening');
      this.flag = true;
      this.saveDocuments = false;
      this.applicationId = this.store.getItem('APPLICATION_ID');
      //application inquiry API call
       this.profileService.getApplicationInquiry(this.applicationId).subscribe(data => {
         this.applicationInquiry = data;

         let hasSpecificItem : string = this.store.getItem('APPLICATION_APPROVE_REJECT_ACCESS_CONTROL') ;

         //we should enable this approve and reject btn only when hasSpecificItem is true and executed ..
         if(hasSpecificItem == "true"){
          this.approveRejectFlag = true ; //approve reject button should shown and buttons should be enabled only when app status is PENDING .
          this.isDisableReject = false;
          this.isDisableApprove = false;
          //this condition to not show approve reject button when status is APPROVED, NEW OR REJECTED
          if(this.applicationInquiry.status == "APPROVED" || this.applicationInquiry.status == "NEW" || this.applicationInquiry.status == "REJECTED" ){ //hide approve reject button
            this.approveRejectFlag = false ;
           }
         
           //if document object array length is 0 , will display message -> "No Documents Found !"
           if(this.data.isreview.document == null || this.data.isreview.document.length == 0){ //hide approve reject button
            this.showNoDocuments = true;
            if(this.applicationInquiry.status == "APPROVED" || this.applicationInquiry.status == "REJECTED" || this.applicationInquiry.status == "NEW"){
              this.approveRejectFlag = false ; //dont show approve reject button when status is APPROVED OR REJECTED
            }
            else{ // PENDING
            this.approveRejectFlag = true ; //anyhow display approve reject button if status other than approved or rejected to fulfill the application so that biz can later upload documents thru customer search
            this.isDisableReject = false;
            this.isDisableApprove = false;
            }
           }
         }
         //if object doesnt exist in access control details , we should hide and disable the approve and reject button ..
         else{
          this.approveRejectFlag = false ;
          this.isDisableReject = true;
          this.isDisableApprove = true;
         }
         //backoffice admin should not edit/update while viewing document modal so will disable all upload icons and dont show upload icons
         this.disableAddressInput = true; 
         this.disablePayslipInput = true; 
         this.disableOnboardingDocInput = true;
         this.disableFEInput = true;
         this.disableBEInput =true; this.disableOFEInput = true;this.disableOBEInput = true;
         this.uploadFE = false; this.uploadBE = false; this.uploadOFE = false; this.uploadOBE = false; this.UploadAddress = false; this.UploadPayslip = false; this.uploadOnboardingDocIcon =false;

         this.docFE = this.applicationInquiry.document.filter((v=>v.docName ==="NRIC_FRONT_IMAGE"))
         this.docBE = this.applicationInquiry.document.filter((v=>v.docName ==="NRIC_BACK_IMAGE"))
         this.docOFE = this.applicationInquiry.document.filter((v=>v.docName ==="OTHER_NRIC_FRONT"))
         this.docOBE = this.applicationInquiry.document.filter((v=>v.docName ==="OTHER_NRIC_BACK"))
         this.docPayslip = this.applicationInquiry.document.filter((v=>v.docName ==="PAYSLIP"))
         this.docAddress = this.applicationInquiry.document.filter((v=>v.docName ==="ADDRESS_PROOF"))
         this.docOnboarding = this.applicationInquiry.document.filter((v=>v.docName ==="ONBOARDING_DOCUMENT"))
       
         if(this.docFE[0] != undefined){
          this.disableFEInput = true;
          this.showFEInput = false
          this.buttonMessage = 'Click to view !';
          this.uploadFE = false;
          this.showFEButton = true;
          }else{ //if no document found in this field -> will now show the field
            this.showFEImage = false;
          }
          if(this.docBE[0] != undefined){
            this.disableBEInput = true;
            this.showBEInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadBE = false;
            this.showBEButton = true;
          }else{//if no document found in this field -> will now show the field
            this.showBEImage = false;
          }
          if(this.docOFE[0] != undefined){
            this.disableOFEInput = true;
            this.showOFEInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadOFE = false;
            this.showOFEButton = true;
            
            }else{ //if no document found in this field -> will now show the field
              this.showOFEImage = false;
            }
         
          if(this.docOBE[0] != undefined){
            this.disableOBEInput = true;
            this.showOBEInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadOBE = false;
            this.showOBEButton = true;
          }else{ //if no document found in this field -> will now show the field
            this.showOBEImage = false;
          }
          if(this.docAddress[0] != undefined){
            this.disableAddressInput = true;
            this.showAddressInput = false;
            this.buttonMessage = 'Click to view !';
            this.UploadAddress = false;
            this.showAddressProofButton = true;
          }else{ //if no document found in this field -> will now show the field
            this.showAddressProof = false;
          }
          if(this.docPayslip[0] != undefined){
            this.disablePayslipInput = true;
            this.showPayslipInput = false;
            this.buttonMessage = 'Click to view !';
            this.UploadPayslip = false;
            this.showPayslipButton = true;
          }
          else{ //if no document found in this field -> will now show the field
            this.showPayslip = false;
          }
          //onboarding document
          if(this.docOnboarding[0] != undefined){
            this.disableOnboardingDocInput = true;
            this.showOnboardingDocInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadOnboardingDocIcon = false;
            this.showOnboardingDocButton = true;
          }
          else{ //if no document found in this field -> will now show the field
            this.showOnboardingDoc = false;
          }
        },
        //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  }
        )
    }

    //Entry point: Backoffice >>> Customer Search >>> Action (consumer onclick) >>> View Documents
    if (this.data.isCustomerReview) {
      this.headerService.setTitle('Customers');
      this.customerflag = true;
      this.saveDocuments = false;
      //Showing all edit info buttons irrespective of their document fields but in disbaled condition initially ..
      this.showEditInfoNricFront = true ;
      this.showEditInfoNricBack = true;
      this.showEditInfoOtherNricFront = true;
      this.showEditInfoOtherNricBack = true;
      this.showEditInfoAddressProof = true;
      this.showEditInfoPayslip = true;
      this.showEditInfoOnboardingDoc = true;

      this.customerId = this.store.getItem('CUSTOMER_ID');
      //customer Inquiry API call
      this.customerSearchService.getCustomerInquiry(this.customerId).subscribe(data => {
        this.customerInquiry = data;

          //backoffice admin should not edit/update while viewing document modal so will disable all upload icons and dont show upload icons
         this.disableAddressInput = true; 
         this.disablePayslipInput = true; 
         this.disableOnboardingDocInput = true;
         this.disableFEInput = true;
         this.disableBEInput =true; this.disableOFEInput = true;this.disableOBEInput = true;
         this.uploadFE = false; this.uploadBE = false; this.uploadOFE = false; this.uploadOBE = false; this.UploadAddress = false; this.UploadPayslip = false; this.uploadOnboardingDocIcon = false

         this.docFE = this.customerInquiry.document.filter((v=>v.docName ==="NRIC_FRONT_IMAGE"))
         this.docBE = this.customerInquiry.document.filter((v=>v.docName ==="NRIC_BACK_IMAGE"))
         this.docOFE = this.customerInquiry.document.filter((v=>v.docName ==="OTHER_NRIC_FRONT"))
         this.docOBE = this.customerInquiry.document.filter((v=>v.docName ==="OTHER_NRIC_BACK"))
         this.docPayslip = this.customerInquiry.document.filter((v=>v.docName ==="PAYSLIP"))
         this.docAddress = this.customerInquiry.document.filter((v=>v.docName ==="ADDRESS_PROOF"))
         this.docOnboarding = this.customerInquiry.document.filter((v=>v.docName ==="ONBOARDING_DOCUMENT"))
       
         if(this.docFE[0] != undefined){
          this.disableFEInput = true;
          this.disableFENric = true;
          this.showFEInput = false;
          this.uploadFENric = false;
          this.buttonMessage = 'Click to view !';
          this.uploadFE = false;
          this.viewNRIC_FE = true;
          }else{ //if no document found in this field -> will not show the field
            this.disableFEInput = true;
            this.disableFENric = true;
            this.showFEInput = false;
            this.uploadFENric = false;
            this.uploadFE = false;
            this.viewNRIC_FE = false;
            this.isDisableEditCustomerDetails = false;
            this.noNricFrontDocument = true;
            this.noDocumentMessage = "No document uploaded !"
          }

          if(this.docBE[0] != undefined){
            this.disableBEInput = true;
            this.disableBENric = true;
            this.showBEInput = false;
            this.uploadBENric = false;
            this.buttonMessage = 'Click to view !';
            this.uploadBE = false;
            this.viewNRIC_BE = true;
          }else{ //if no document found in this field -> will now show the field
            this.disableBEInput = true;
            this.disableBENric = true;
            this.showBEInput = false
            this.uploadBENric = false;
            this.uploadBE = false;
            this.viewNRIC_BE = false;
            this.isDisableEditCustomerDetailsNricBack = false;
            this.noNricBackDocument = true;
            this.noDocumentMessage = "No document uploaded !"
          }

          if(this.docOFE[0] != undefined){
            this.disableOFEInput = true;
            this.disableOFENric = true;
            this.showOFEInput = false;
            this.uploadOFENric = false;
            this.buttonMessage = 'Click to view !';
            this.uploadOFE = false;
            this.viewOTHER_NRIC_FE = true;
            }else{ //if no document found in this field -> will now show the field
              this.disableOFEInput = true;
              this.disableOFENric = true;
              this.showOFEInput = false;
              this.uploadOFENric = false;
              this.uploadOFE = false;
              this.viewOTHER_NRIC_FE = false;
              this.isDisableEditCustomerDetailsOtherNricFront = false;
              this.noOtherNricFrontDocument = true;
              this.noDocumentMessage = "No document uploaded !"
            }
         
          if(this.docOBE[0] != undefined){
            this.disableOBEInput = true;
            this.disableOBENric = true;
            this.showOBEInput = false;
            this.uploadOBENric = false;
            this.buttonMessage = 'Click to view !';
            this.uploadOBE = false;
            this.viewOTHER_NRIC_BE = true;
          }else{ //if no document found in this field -> will now show the field
            this.disableOBEInput = true;
            this.disableOBENric = true;
            this.showOBEInput = false
            this.uploadOBENric = false;
            this.uploadOBE = false;
            this.viewOTHER_NRIC_BE = false;
            this.isDisableEditCustomerDetailsOtherNricBack = false;
            this.noOtherNricBackDocument = true;
            this.noDocumentMessage = "No document uploaded !"
          }

          if(this.docAddress[0] != undefined){
            this.disableAddressInput = true;
            this.disableAddressNric = true;
            this.showAddressInput = false;
            this.uploadAddressNric = false;
            this.buttonMessage = 'Click to view !';
            this.UploadAddress = false;
            this.viewAddressProof = true;
          }else{ //if no document found in this field -> will now show the field
            this.disableAddressInput = true;
            this.disableAddressNric = true;
            this.showAddressInput = false;
            this.uploadAddressNric = false;
            this.UploadAddress = false;
            this.viewAddressProof = false;
            this.isDisableEditCustomerDetailsAddressProof = false;
            this.noAddressProofDocument = true;
            this.noDocumentMessage = "No document uploaded !"
          }

          if(this.docPayslip[0] != undefined){
            this.disablePayslipInput = true;
            this.disablePayslipNric = true;
            this.showPayslipInput = false;
            this.uploadPayslipNric = false;
            this.buttonMessage = 'Click to view !';
            this.UploadPayslip = false;
            this.viewPayslip = true;
          }else{ 
            this.disablePayslipInput = true;
            this.disablePayslipNric = true;
            this.showPayslipInput = false
            this.uploadPayslipNric = false;
            this.UploadPayslip = false;
            this.viewPayslip = false;
            this.isDisableEditCustomerDetailsPayslip = false;
            this.noPayslipDocument = true;
            this.noDocumentMessage = "No document uploaded !"
          }

          // onboarding Document
          if(this.docOnboarding[0] != undefined){
            this.disableOnboardingDocInput = true;
            this.disableOnboardingDoc = true;
            this.showOnboardingDocInput = false;
            this.uploadOnboardingDoc = false;
            this.buttonMessage = 'Click to view !';
            this.uploadOnboardingDocIcon = false;
            this.viewOnboardingDoc = true;
          }else{ 
            this.disableOnboardingDocInput = true;
            this.disableOnboardingDoc = true;
            this.showOnboardingDocInput = false
            this.uploadOnboardingDoc = false;
            this.uploadOnboardingDocIcon = false;
            this.viewOnboardingDoc = false;
            this.isDisableEditCustomerDetailsOnboardingDoc = false;
            this.noOnboardingDocument = true;
            this.noDocumentMessage = "No document uploaded !"
          }


        },
        //error handling completed in 30-06-2023
   (error:any)=>{
     if(error.status != 401){
       this.dialogRef.open(ErrorDialogAdminComponent) ;
     }
   }
        )
    }

    //application onboarding in MC .
    if(this.data.appOnboardingForMc){
      this.headerService.setTitle('Account Opening') ;
    }

  }

  //In Application Listings > view Documents - this function calls document inquiry (back office)
  loadBinaryData(documentName:any){
    const applicationStatus = this.store.getItem('APPLICATIONSTATUS');
    const customerStatus = this.store.getItem('CUSTOMER_STATUS');
    if(this.customerflag == true){
      if(documentName == "NRIC_FRONT_IMAGE"){
        this.documentId = this.docFE[0] ? this.docFE[0].docId : this.nricFrontSuccessResponseArray[0];
      }
      else if(documentName == "NRIC_BACK_IMAGE"){
        this.documentId = this.docBE[0] ? this.docBE[0].docId : this.nricBackSuccessResponseArray[0];
      }
      else if(documentName == "OTHER_NRIC_FRONT"){
        this.documentId = this.docOFE[0] ? this.docOFE[0].docId : this.otherNricFrontSuccessResponseArray;
      }
      else if(documentName == "OTHER_NRIC_BACK"){
        this.documentId = this.docOBE[0] ? this.docOBE[0].docId : this.otherNricBackSuccessResponseArray;
      }
      else if(documentName == "ADDRESS_PROOF"){
        this.documentId = this.docAddress[0] ? this.docAddress[0].docId : this.addressProofSuccessResponseArray;
      }
      else if(documentName == "PAYSLIP"){
        this.documentId = this.docPayslip[0] ? this.docPayslip[0].docId : this.payslipSuccessResponseArray;
      }
      else if(documentName == "ONBOARDING_DOCUMENT"){
        this.documentId = this.docOnboarding[0] ? this.docOnboarding[0].docId : this.onBoardingDocSuccessResponseArray;
      }
      this.documentService.adminDocumentInquiry(this.documentId,this.customerflag).subscribe(data => {
       let text = data.documentData;
        if(text.substring(5,20) == 'application/pdf'){ 
        this.dialogRef.open(PreviewDocumentComponent, {
          width: '1300px',
          height: '650px',
          panelClass:'custom-modalbox',
          data: { customersearch_documentName: documentName, customersearch_documentData: data.documentData }
        })
        if(documentName == "NRIC_FRONT_IMAGE"){
          this.showImageFE = false; //img tag
          this.showOtherFormatFEDoc = true;  //object tag
          this.pdfUrlFE = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData); 
        }
        else if(documentName == "NRIC_BACK_IMAGE"){
          this.showImageBE = false; //img tag
          this.showOtherFormatBEDoc = true;  //object tag
          this.pdfUrlBE = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData); 
        }
        else if(documentName == "OTHER_NRIC_FRONT"){
          this.showImageOFE = false; //img tag
          this.showOtherFormatOFEDoc = true;  //object tag
          this.pdfUrlOFE = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData); 
        }
        else if(documentName == "OTHER_NRIC_BACK"){
          this.showImageOBE = false; //img tag
          this.showOtherFormatOBEDoc = true;  //object tag
          this.pdfUrlOBE = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData); 
        }
        else if(documentName == "ADDRESS_PROOF"){
          this.showImageAddress = false; //img tag
          this.showOtherFormatAddressDoc = true;  //object tag
          this.pdfUrlAddress = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData); 
        }
        else if(documentName == "PAYSLIP"){
          this.showImagePayslip = false; //img tag
          this.showOtherFormatPaySlipDoc = true;  //object tag
          this.pdfUrlPaySlip = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData); 
        }
        // onboarding document
        else if(documentName == "ONBOARDING_DOCUMENT"){
          this.showImageOnboardingDoc = false; //img tag
          this.showOtherFormatOnboardingDoc = true;  //object tag
          this.pdfUrlOnboardingDoc = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData); 
        }
       
        }
      })
    }
    else{
    if(documentName == 'NRIC_FRONT_IMAGE'){
      this.loadNRICFRONT = true; //loader
    this.documentId = this.docFE[0].docId;
    //document inquiry api call
    let cust_flag = false ;
    if(this.customerMobileAppStatus == "APPROVED"){ //Customer mobile device --> Where his status is APPROVED so need to customer document Inq API
      cust_flag = true ;
    }
    else{
      cust_flag = false ;
    }
     this.documentService.adminDocumentInquiry(this.documentId,cust_flag).subscribe(data => {
      this.documentInquiry = data;
      //mobile screen - this is converted customer flow
      if(applicationStatus == "APPROVED" || customerStatus == "ACTIVE"){
        let text = data.documentData;
        if(text.substring(5,20) == 'application/pdf'){ 
        this.dialogRef.closeAll(); 
        this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
        this.store.setItem('DOCUMENT_NAME',documentName);
        this.router.navigate([`profile/preview/`]);
        }
        //changes
        else{
          this.showImageFE = true;
          this.loadNRICFRONT = false;
        this.showFEButton = false;
        this.url[this.nricFront] = data.documentData;  
        }
      }
      //desktop screen (application search)
      if(( applicationStatus == undefined || applicationStatus == "undefined") && (customerStatus == undefined || customerStatus == null || customerStatus == "undefined" || customerStatus == "INACTIVE")){
      let text = data.documentData;
      if(text.substring(5,20) == 'application/pdf'){ 
      this.dialogRef.open(PreviewDocumentComponent, {
        width: '1300px',
        height: '650px',
        panelClass:'custom-modalbox',
        data: { document_Name:documentName, doc_data:data.documentData }
      })
      // commented on 25/11
     // window.open(data.documentData);
//
      this.showImageFE = false; //img tag
      this.showOtherFormatFEDoc = true;  //object tag
      this.pdfUrlFE = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData); 
      }
      else{
        //for normal images - jepg / png
        this.showImageFE = true;
        this.loadNRICFRONT = false;
      this.showFEButton = false;
      this.url[this.nricFront] = data.documentData;  
      }
    }
    this.loadNRICFRONT = false;
       this.showFEButton = false;
      // this.url[this.nricFront] = data.documentData;  
     },
      //error handling completed in 01-06-2023
  (error:any)=>{
    if(error.status != 401){
      //Opending error dialog based on user 
      if(this.store.getItem('USER_ROLE') == "111"){ //consumer
        this.dialogRef.open(ErrorDialogComponent) ;
      }
      if(this.store.getItem('USER_ROLE') == "222"){ //backoffice
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    }
  }
     )
    }
    else if( documentName == 'NRIC_BACK_IMAGE'){
      this.loadNRICBACK = true;
     this.documentId = this.docBE[0].docId;
     let cust_flag = false ;
     if(this.customerMobileAppStatus == "APPROVED"){ //Customer mobile device --> Where his status is APPROVED so need to customer document Inq API
       cust_flag = true ;
     }
     else{
       cust_flag = false ;
     }
      this.documentService.adminDocumentInquiry(this.documentId,cust_flag).subscribe(data => {
       this.documentInquiry = data;
       if(applicationStatus == "APPROVED" || customerStatus == "ACTIVE"){
        let text = data.documentData;
        if(text.substring(5,20) == 'application/pdf'){ 
        this.dialogRef.closeAll(); 
        this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
        this.store.setItem('DOCUMENT_NAME',documentName);
        this.router.navigate([`profile/preview/`]);
        }
        else{
          this.showImageBE = true;
          this.loadNRICBACK = false;
        this.showBEButton = false;
        this.url[this.nricBack] = data.documentData;  
        }
      }
      if((applicationStatus == undefined || applicationStatus == "undefined") && (customerStatus == undefined || customerStatus == null || customerStatus == "undefined" || customerStatus == "INACTIVE")){
       let text = data.documentData;
       if(text.substring(5,20) == 'application/pdf'){ 
        this.dialogRef.open(PreviewDocumentComponent, {
          width: '1300px',
          height: '650px',
          panelClass:'custom-modalbox',
          data: { document_Name:documentName, doc_data:data.documentData }
        })
        this.showImageBE = false;
        this.showOtherFormatBEDoc = true;
        this.pdfUrlBE = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData); 
        }
        else{
          this.showImageBE = true;
          this.loadNRICBACK = false;
          this.showBEButton = false;
          this.url[this.nricBack] = data.documentData;  
        }
      }
       this.loadNRICBACK = false;
       this.showBEButton = false;
      //  this.url[this.nricBack] = data.documentData;  
      },
       //error handling completed in 01-06-2023
  (error:any)=>{
    if(error.status != 401){
      //Opending error dialog based on user 
      if(this.store.getItem('USER_ROLE') == "111"){ //consumer
        this.dialogRef.open(ErrorDialogComponent) ;
      }
      if(this.store.getItem('USER_ROLE') == "222"){ //backoffice
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    }
  }
      )
    }
    else if( documentName == 'OTHER_NRIC_FRONT'){
      this.loadOTHERNRICFRONT = true;
      this.documentId = this.docOFE[0].docId;

      let cust_flag = false ;
      if(this.customerMobileAppStatus == "APPROVED"){ //Customer mobile device --> Where his status is APPROVED so need to customer document Inq API
        cust_flag = true ;
      }
      else{
        cust_flag = false ;
      }
      
       this.documentService.adminDocumentInquiry(this.documentId,cust_flag).subscribe(data => {
        this.documentInquiry = data;
        let text = data.documentData;
        if(applicationStatus == "APPROVED" || customerStatus == "ACTIVE"){
          let text = data.documentData;
          if(text.substring(5,20) == 'application/pdf'){ 
          this.dialogRef.closeAll(); 
          this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
          this.store.setItem('DOCUMENT_NAME',documentName);
          this.router.navigate([`profile/preview/`]);
          }
          else{
            this.showImageOFE = true;
            this.loadOTHERNRICFRONT = false;
            this.showOFEButton = false;
            this.url[this.otherNRICfront] = data.documentData;  
          }
        }
        if((applicationStatus == undefined || applicationStatus == "undefined") && (customerStatus == undefined || customerStatus == null || customerStatus == "undefined" || customerStatus == "INACTIVE")){
       if(text.substring(5,20) == 'application/pdf'){ 
        this.dialogRef.open(PreviewDocumentComponent, {
          width: '1300px',
          height: '650px',
          panelClass:'custom-modalbox',
          data: { document_Name:documentName, doc_data:data.documentData }
        })
        this.showImageOFE = false;
        this.showOtherFormatOFEDoc = true;
        this.pdfUrlOFE = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData);
        }
        else{
          this.showImageOFE = true;
          this.loadOTHERNRICFRONT = false;
          this.showOFEButton = false;
          this.url[this.otherNRICfront] = data.documentData;  
        }
      }
        this.loadOTHERNRICFRONT = false;
        this.showOFEButton = false;
        // this.url[this.otherNRICfront] = data.documentData;  
       },
        //error handling completed in 01-06-2023
  (error:any)=>{
    if(error.status != 401){
      //Opending error dialog based on user 
      if(this.store.getItem('USER_ROLE') == "111"){ //consumer
        this.dialogRef.open(ErrorDialogComponent) ;
      }
      if(this.store.getItem('USER_ROLE') == "222"){ //backoffice
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    }
  }
       )
     }
     else if( documentName == 'OTHER_NRIC_BACK'){
      this.loadOTHERNRICBACK = true
      this.documentId = this.docOBE[0].docId;

      let cust_flag = false ;
      if(this.customerMobileAppStatus == "APPROVED"){ //Customer mobile device --> Where his status is APPROVED so need to customer document Inq API
        cust_flag = true ;
      }
      else{
        cust_flag = false ;
      }

       this.documentService.adminDocumentInquiry(this.documentId,cust_flag).subscribe(data => {
        this.documentInquiry = data;
        let text = data.documentData;
        if(applicationStatus == "APPROVED" || customerStatus == "ACTIVE"){
          let text = data.documentData;
          if(text.substring(5,20) == 'application/pdf'){ 
          this.dialogRef.closeAll(); 
          this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
          this.store.setItem('DOCUMENT_NAME',documentName);
          this.router.navigate([`profile/preview/`]);
          }
          else{
            this.showImageOBE = true;
            this.loadOTHERNRICBACK = false;
            this.showOBEButton = false;
            this.url[this.otherNRICback] = data.documentData;  
          }
          
        }
        if((applicationStatus == undefined || applicationStatus == "undefined") && (customerStatus == undefined || customerStatus == null || customerStatus == "undefined" || customerStatus == "INACTIVE")){
       if(text.substring(5,20) == 'application/pdf'){ 
        this.dialogRef.open(PreviewDocumentComponent, {
          width: '1300px',
          height: '650px',
          panelClass:'custom-modalbox',
          data: { document_Name:documentName, doc_data:data.documentData }
        })
        this.showImageOBE = false;
        this.showOtherFormatOBEDoc = true;
        this.pdfUrlOBE = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData);
        }
        else{
          this.showImageOBE = true;
          this.loadOTHERNRICBACK = false;
          this.showOBEButton = false;
          this.url[this.otherNRICback] = data.documentData;  
        }
      }
        this.loadOTHERNRICBACK = false;
        this.showOBEButton = false;
        // this.url[this.otherNRICback] = data.documentData;  
       },
        //error handling completed in 01-06-2023
  (error:any)=>{
    if(error.status != 401){
      //Opending error dialog based on user 
      if(this.store.getItem('USER_ROLE') == "111"){ //consumer
        this.dialogRef.open(ErrorDialogComponent) ;
      }
      if(this.store.getItem('USER_ROLE') == "222"){ //backoffice
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    }
  }
       )
     }
     else if( documentName == 'ADDRESS_PROOF'){
      this.loadAddressProof = true;
      this.documentId = this.docAddress[0].docId;

      let cust_flag = false ;
      if(this.customerMobileAppStatus == "APPROVED"){ //Customer mobile device --> Where his status is APPROVED so need to customer document Inq API
        cust_flag = true ;
      }
      else{
        cust_flag = false ;
      }

       this.documentService.adminDocumentInquiry(this.documentId,cust_flag).subscribe(data => {
        this.documentInquiry = data;
        let text = data.documentData;
        if(applicationStatus == "APPROVED" || customerStatus == "ACTIVE"){
          let text = data.documentData;
          if(text.substring(5,20) == 'application/pdf'){ 
          this.dialogRef.closeAll(); 
          this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
          this.store.setItem('DOCUMENT_NAME',documentName);
          this.router.navigate([`profile/preview/`]);
          }
          else{
            this.showImageAddress = true;
            this.loadAddressProof = false;
            this.showAddressProofButton = false;
            this.url[this.addressProof] = data.documentData;  
          }
        }
        if((applicationStatus == undefined || applicationStatus == "undefined") && ( customerStatus == undefined ||  customerStatus == null || customerStatus == "undefined" || customerStatus == "INACTIVE")){
       if(text.substring(5,20) == 'application/pdf'){ 
        this.dialogRef.open(PreviewDocumentComponent, {
          width: '1300px',
          height: '650px',
          panelClass:'custom-modalbox',
          data: { document_Name:documentName, doc_data:data.documentData }
        })
        this.showImageAddress = false;
        this.showOtherFormatAddressDoc = true;
        this.pdfUrlAddress = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData);
        }
        else{
          this.showImageAddress = true;
          this.loadAddressProof = false;
          this.showAddressProofButton = false;
          this.url[this.addressProof] = data.documentData;  
        }
      }
        this.loadAddressProof = false;
        this.showAddressProofButton = false;
        // this.url[this.addressProof] = data.documentData;  
       },
        //error handling completed in 01-06-2023
  (error:any)=>{
    if(error.status != 401){
      //Opending error dialog based on user 
      if(this.store.getItem('USER_ROLE') == "111"){ //consumer
        this.dialogRef.open(ErrorDialogComponent) ;
      }
      if(this.store.getItem('USER_ROLE') == "222"){ //backoffice
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    }
  }
       )
     }
     else if( documentName == 'PAYSLIP'){
      this.loadPayslip = true;
      this.documentId = this.docPayslip[0].docId;

      let cust_flag = false ;
      if(this.customerMobileAppStatus == "APPROVED"){ //Customer mobile device --> Where his status is APPROVED so need to customer document Inq API
        cust_flag = true ;
      }
      else{
        cust_flag = false ;
      }

       this.documentService.adminDocumentInquiry(this.documentId,cust_flag).subscribe(data => {
        this.documentInquiry = data;
        let text = data.documentData;
        if(applicationStatus == "APPROVED" || customerStatus == "ACTIVE"){
          let text = data.documentData;
          if(text.substring(5,20) == 'application/pdf'){ 
          this.dialogRef.closeAll(); 
          this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
          this.store.setItem('DOCUMENT_NAME',documentName);
          this.router.navigate([`profile/preview/`]);
          }
          else{
            this.showImagePayslip = true;
            this.loadPayslip = false;
            this.showPayslipButton = false;
            this.url[this.paySlip] = data.documentData;  
          }
        }
        if((applicationStatus == undefined || applicationStatus == "undefined") && (customerStatus == undefined || customerStatus == null || customerStatus == "undefined" || customerStatus == "INACTIVE" )){
       if(text.substring(5,20) == 'application/pdf'){ 
        this.dialogRef.open(PreviewDocumentComponent, {
          width: '1300px',
          height: '650px',
          panelClass:'custom-modalbox',
          data: { document_Name:documentName, doc_data:data.documentData }
        })
        this.showImagePayslip = false;
        this.showOtherFormatPaySlipDoc = true;
        this.pdfUrlPaySlip = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData);
        }
        else{
          this.showImagePayslip = true;
          this.loadPayslip = false;
          this.showPayslipButton = false;
          this.url[this.paySlip] = data.documentData;  
        }
      }
        this.loadPayslip = false;
        this.showPayslipButton = false;
        // this.url[this.paySlip] = data.documentData;  
       },
        //error handling completed in 01-06-2023
  (error:any)=>{
    if(error.status != 401){
      //Opending error dialog based on user 
      if(this.store.getItem('USER_ROLE') == "111"){ //consumer
        this.dialogRef.open(ErrorDialogComponent) ;
      }
      if(this.store.getItem('USER_ROLE') == "222"){ //backoffice
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    }
  }
       )
     }  
    // Onboarding Document
      else if (documentName == 'ONBOARDING_DOCUMENT') {
        this.loadOnboardingDoc = true;
        this.documentId = this.docOnboarding[0].docId;

        let cust_flag = false;
        if (this.customerMobileAppStatus == "APPROVED") { //Customer mobile device --> Where his status is APPROVED so need to customer document Inq API
          cust_flag = true;
        }
        else {
          cust_flag = false;
        }

        this.documentService.adminDocumentInquiry(this.documentId, cust_flag).subscribe(data => {
          this.documentInquiry = data;
          let text = data.documentData;
          if (applicationStatus == "APPROVED" || customerStatus == "ACTIVE") {
            let text = data.documentData;
            if (text.substring(5, 20) == 'application/pdf') {
              this.dialogRef.closeAll();
              this.store.setItem('DOCUMENT_INQ_DATA', data.documentData);
              this.store.setItem('DOCUMENT_NAME', documentName);
              this.router.navigate([`profile/preview/`]);
            }
            else {
              this.showImageOnboardingDoc = true;
              this.loadOnboardingDoc = false;
              this.showOnboardingDocButton = false;
              this.url[this.onboardingDoc] = data.documentData;
            }
          }
          if ((applicationStatus == undefined || applicationStatus == "undefined") && (customerStatus == undefined || customerStatus == null || customerStatus == "undefined" || customerStatus == "INACTIVE")) {
            if (text.substring(5, 20) == 'application/pdf') {
              this.dialogRef.open(PreviewDocumentComponent, {
                width: '1300px',
                height: '650px',
                panelClass: 'custom-modalbox',
                data: { document_Name: documentName, doc_data: data.documentData }
              })
              this.showImageOnboardingDoc = false;
              this.showOtherFormatOnboardingDoc = true;
              this.pdfUrlOnboardingDoc = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData);
            }
            else {
              this.showImageOnboardingDoc = true;
              this.loadOnboardingDoc = false;
              this.showOnboardingDocButton = false;
              this.url[this.onboardingDoc] = data.documentData;
            }
          }
          this.loadOnboardingDoc = false;
          this.showOnboardingDocButton = false;
          // this.url[this.paySlip] = data.documentData;  
        },
          //error handling completed in 01-06-2023
          (error: any) => {
            if (error.status != 401) {
              //Opending error dialog based on user 
              if (this.store.getItem('USER_ROLE') == "111") { //consumer
                this.dialogRef.open(ErrorDialogComponent);
              }
              if (this.store.getItem('USER_ROLE') == "222") { //backoffice
                this.dialogRef.open(ErrorDialogAdminComponent);
              }
            }
          }
        )
      }  
    }  
  }
  id:any;
  public fileName : any;
  
  //Individual Onboarding > view Documents - this function calls document inquiry (in mobile screen) & customer search view doc
  loadDocumentData(documentName:any,id:string){
    const applicationStatus = this.store.getItem('APPLICATIONSTATUS');
    const customerStatus = this.store.getItem('CUSTOMER_STATUS');
    if(documentName == 'NRIC_FRONT_IMAGE'){
      this.loadNRICFRONT = true; //spinner is on
      if(this.customerflag == true){ //When entry point is backoffice > customer search > view documents : we can show edit button ..
        this.showEditInfoNricFront = false; //hide nric front edit button
        this.isDisableEditCustomerDetails = false; //enabling the nric front edit button
      }
      this.reuploadNricFront = false;
      this.documentId = this.docFE[0].docId;
      //document inquiry api call
      this.documentService.getDocumentInquiry(this.documentId,this.customerflag).subscribe(data => {
        this.documentInquiry = data;
        this.loadNRICFRONT = false;  //spinner is off
        if(this.customerflag == true){
          this.showEditInfoNricFront = true;  //show nric front edit button
        }
        this.form.get('NRICFront')?.clearValidators();
        this.form.get('NRICFront')?.updateValueAndValidity();
        this.url[this.nricFront] = data.documentData;
        //mobile screen 
        if(applicationStatus == "APPROVED" || applicationStatus == "PENDING" || customerStatus == "ACTIVE"){
          this.disableFEInput = true;
          this.viewNRIC_FE = false;
          this.uploadFE = false;
          this.url[this.nricFront] = data.documentData;
          let text = data.documentData;
          if(text.substring(5,20) == 'application/pdf'){
            this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
            this.store.setItem('DOCUMENT_NAME',documentName);
            this.router.navigate([`profile/preview/`]);
          }
        }
        //customer search screen
       else if((applicationStatus == undefined || applicationStatus == "undefined") && (customerStatus == undefined || customerStatus == "undefined" || customerStatus == "INACTIVE")){
          let text = data.documentData;
          //checks it is pdf
          if(text.substring(5,20) == 'application/pdf'){ 
          this.dialogRef.open(PreviewDocumentComponent,{
            width: '1300px',
            height: '650px',
            panelClass:'custom-modalbox',
            data : {customersearch_documentName : documentName , customersearch_documentData : data.documentData}
          })
          this.showImageFE = false;
          this.showOtherFormatFEDoc = true;
          this.pdfUrlFE = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData);
          this.loadNRICFRONT = false;
          this.viewNRIC_FE = false;
          this.disableFEInput = true;
          this.disableFENric = true;
           }
           //if not pdf , that will be in image type (jpeg or png)
           else{
            this.loadNRICFRONT = false;
            this.viewNRIC_FE = false;
            this.disableFEInput = true;
            this.disableFENric = true;
            this.url[this.nricFront] = data.documentData; 
           }
          }
        else {
          //mobile - appStatus == NEW
          let text = data.documentData;
            if(text.substring(5,20) == 'application/pdf'){
              this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
              this.store.setItem('DOCUMENT_NAME',documentName);
              this.router.navigate([`profile/preview/`]);
            }
        this.disableFEInput = false;
        this.viewNRIC_FE = false;
        this.uploadFE = false;
        this.uploadFENric = true;
        this.disableFENric = false; //changes
        this.url[this.nricFront] = data.documentData;
        }
       },
       //error handling completed in 01-06-2023
  (error:any)=>{
    this.loadNRICFRONT = false;
    if(error.status != 401){
      //Opending error dialog based on user 
      if(this.store.getItem('USER_ROLE') == "111"){ //consumer
        this.dialogRef.open(ErrorDialogComponent) ;
      }
      else{ //backoffice - It can be any role
        if(error.error.errorMessage == "Document not found"){
          this.snackBar.open("Could'nt find this document, kindly reupload !" , "Ok",{
            panelClass: "custom-orange-notification-snackbar",
            duration: 2000
          }) ;
            this.loadNRICFRONT = false;
            
            this.showEditInfoNricFront = true ;
            this.viewNRIC_FE = false;
            this.disableFEInput = true;
            this.disableFENric = true;
          
        }
       else if(error.error.errorMessage != "Document not found"){
        this.dialogRef.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
      
      }
    }
    
 }
      )
      //  let newDocument: AddDocument = _.cloneDeep(this.addDocuments(this.id));
      //  this.documentService.updateDocument(_.cloneDeep(newDocument)).subscribe
      //  (data => {
      //    this.submitted = true;
      //    this.documentIds.push(data.documentId);
      //    this.imageId.push(data.imageId);
      //  })
      
      }
       if( documentName == 'NRIC_BACK_IMAGE'){
        this.loadNRICBACK = true;
        if(this.customerflag == true){ //When entry point is backoffice > customer search > view documents : we can show edit button ..
        this.showEditInfoNricBack = false;
        this.isDisableEditCustomerDetailsNricBack = false;
        }
        this.reuploadNricBack = false;
       this.documentId = this.docBE[0].docId;
       //document inq api call 
        this.documentService.getDocumentInquiry(this.documentId,this.customerflag).subscribe(data => {
          this.loadNRICBACK = false;
          if(this.customerflag == true){
          this.showEditInfoNricBack = true;
          }
         this.documentInquiry = data;
         this.form.controls['NRICBack']?.clearValidators();
         this.form.controls['NRICBack']?.updateValueAndValidity();
         //mobile
         if(applicationStatus == "APPROVED" || applicationStatus == "PENDING" || customerStatus == "ACTIVE"){
          this.disableBEInput = true;
          this.viewNRIC_BE = false;
          this.uploadBE = false;
          this.url[this.nricBack] = data.documentData;
          let text = data.documentData;
          if(text.substring(5,20) == 'application/pdf'){
            this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
            this.store.setItem('DOCUMENT_NAME',documentName);
            this.router.navigate([`profile/preview/`]);
          }
         }
         //customer search
        else if((applicationStatus == undefined || applicationStatus == "undefined") && (customerStatus == undefined || customerStatus == "undefined" || customerStatus == "INACTIVE")){
          let text = data.documentData;
          if(text.substring(5,20) == 'application/pdf'){ 
            this.dialogRef.open(PreviewDocumentComponent,{
              width: '1300px',
              height: '650px',
              panelClass:'custom-modalbox',
              data : {customersearch_documentName : documentName , customersearch_documentData : data.documentData}
            })
            this.showImageBE = false;
          this.showOtherFormatBEDoc = true;
          this.pdfUrlBE = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData);
          this.loadNRICBACK = false;
          this.viewNRIC_BE = false;
          this.disableFEInput = true;
          this.disableFENric = true;
           }
           else{
            this.loadNRICBACK = false;
            this.viewNRIC_BE = false;
            this.disableBEInput = true;
            this.disableBENric = true;
            this.url[this.nricBack] = data.documentData; 
           }
          }
         else{
          let text = data.documentData;
          if(text.substring(5,20) == 'application/pdf'){
            this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
            this.store.setItem('DOCUMENT_NAME',documentName);
            this.router.navigate([`profile/preview/`]);
          }
          this.disableBEInput = false;
          this.viewNRIC_BE = false;
          this.uploadBE = false;
          this.uploadBENric = true;
          this.disableBENric = false; 
          this.url[this.nricBack] = data.documentData;
         }
        },
         //error handling completed in 01-06-2023
  (error:any)=>{
    this.loadNRICBACK = false;
    if(error.status != 401){
      //Opending error dialog based on user 
      if(this.store.getItem('USER_ROLE') == "111"){ //consumer
        this.dialogRef.open(ErrorDialogComponent) ;
      }
      else{ //backoffice - It can be any role
        if(error.error.errorMessage == "Document not found"){
          this.snackBar.open("Could'nt find this document, kindly reupload !" , "Ok",{
            panelClass: "custom-orange-notification-snackbar",
            duration: 2000
          }) ;
            this.loadNRICBACK = false;
            
            this.showEditInfoNricBack = true ;
            this.viewNRIC_BE = false;
            this.disableBEInput = true;
            this.disableBENric = true;
          
        }
       else if(error.error.errorMessage != "Document not found"){
        this.dialogRef.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
      
      }
    }
  }
        )
      }
       if( documentName == 'OTHER_NRIC_FRONT'){
        this.loadOTHERNRICFRONT = true;
        if(this.customerflag == true){ //When entry point is backoffice > customer search > view documents : we can show edit button ..
        this.showEditInfoOtherNricFront = false;
        this.isDisableEditCustomerDetailsOtherNricFront = false;
        }
        this.reuploadOtherNricFront = false;
        this.documentId = this.docOFE[0].docId;
         this.documentService.getDocumentInquiry(this.documentId,this.customerflag).subscribe(data => {
          this.documentInquiry = data;
          this.loadOTHERNRICFRONT = false;
          if(this.customerflag == true){
          this.showEditInfoOtherNricFront = true;
          }
          this.form.controls['OtherNRICFront']?.clearValidators();
          this.form.controls['OtherNRICFront']?.updateValueAndValidity();
          if(applicationStatus == "APPROVED" || applicationStatus == "PENDING" || customerStatus == "ACTIVE"){
            this.disableOFEInput = true; 
            this.viewOTHER_NRIC_FE = false;
            this.uploadOFE = false;
            this.url[this.otherNRICfront] = data.documentData; 
            let text = data.documentData;
          if(text.substring(5,20) == 'application/pdf'){
            this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
            this.store.setItem('DOCUMENT_NAME',documentName);
            this.router.navigate([`profile/preview/`]);
          }
          }
          else if((applicationStatus == undefined || applicationStatus == "undefined") && (customerStatus == undefined || customerStatus == "undefined" || customerStatus == "INACTIVE")){
            let text = data.documentData;
            if(text.substring(5,20) == 'application/pdf'){ 
              this.dialogRef.open(PreviewDocumentComponent,{
                width: '1300px',
                height: '650px',
                panelClass:'custom-modalbox',
                data : {customersearch_documentName : documentName , customersearch_documentData : data.documentData}
              })
              this.showImageOFE = false;
              this.showOtherFormatOFEDoc = true;
              this.pdfUrlOFE = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData);
              this.loadOTHERNRICFRONT = false;
              this.viewOTHER_NRIC_FE = false;
              this.disableOFEInput = true;
              this.disableOFENric = true;
               }
             else{
              this.loadOTHERNRICFRONT = false;
              this.viewOTHER_NRIC_FE = false;
              this.disableOFEInput = true;
              this.disableOFENric = true;
              this.url[this.otherNRICfront] = data.documentData; 
             }
            }
          else{
            let text = data.documentData;
            if(text.substring(5,20) == 'application/pdf'){
              this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
              this.store.setItem('DOCUMENT_NAME',documentName);
              this.router.navigate([`profile/preview/`]);
            }
          this.disableOFEInput = false;
          this.viewOTHER_NRIC_FE = false;
          this.uploadOFE = false;
          this.uploadOFENric = true;
          this.disableOFENric = false;
          this.url[this.otherNRICfront] = data.documentData;
          } 
         },
          //error handling completed in 01-06-2023
  (error:any)=>{
    this.loadOTHERNRICFRONT = false;
    if(error.status != 401){
      //Opending error dialog based on user 
      if(this.store.getItem('USER_ROLE') == "111"){ //consumer
        this.dialogRef.open(ErrorDialogComponent) ;
      }
      else{ //backoffice - It can be any role
        if(error.error.errorMessage == "Document not found"){
          this.snackBar.open("Could'nt find this document, kindly reupload !" , "Ok",{
            panelClass: "custom-orange-notification-snackbar",
            duration: 2000
          }) ;
            this.loadOTHERNRICFRONT = false;
            
            this.showEditInfoOtherNricFront = true ;
            this.viewOTHER_NRIC_FE = false;
            this.disableOFEInput = true;
            this.disableOFENric = true;
          
        }
       else if(error.error.errorMessage != "Document not found"){
        this.dialogRef.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
      
      }
    }
  }
         )
       }
        if( documentName == 'OTHER_NRIC_BACK'){
          this.loadOTHERNRICBACK = true;
          if(this.customerflag == true){ //When entry point is backoffice > customer search > view documents : we can show edit button ..
          this.showEditInfoOtherNricBack = false;
          this.isDisableEditCustomerDetailsOtherNricBack = false;
          }
          this.reuploadOtherNricBack = false;
        this.documentId = this.docOBE[0].docId;
         this.documentService.getDocumentInquiry(this.documentId,this.customerflag).subscribe(data => {
          this.documentInquiry = data;
          this.loadOTHERNRICBACK = false;
          if(this.customerflag == true){
          this.showEditInfoOtherNricBack = true;
          }
          this.form.controls['OtherNRICBack']?.clearValidators();
          this.form.controls['OtherNRICBack']?.updateValueAndValidity();
          if(applicationStatus == "APPROVED" || applicationStatus == "PENDING" || customerStatus == "ACTIVE"){
            this.disableOBEInput = true;
            this.viewOTHER_NRIC_BE = false;
            this.uploadOBE = false;
            this.url[this.otherNRICback] = data.documentData;
            let text = data.documentData;
          if(text.substring(5,20) == 'application/pdf'){
            this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
            this.store.setItem('DOCUMENT_NAME',documentName);
            this.router.navigate([`profile/preview/`]);
          }
          }
          else if((applicationStatus == undefined || applicationStatus == "undefined") && (customerStatus == undefined || customerStatus == "undefined" || customerStatus == "INACTIVE")){
            let text = data.documentData;
            if(text.substring(5,20) == 'application/pdf'){ 
              this.dialogRef.open(PreviewDocumentComponent,{
                width: '1300px',
                height: '650px',
                panelClass:'custom-modalbox',
                data : {customersearch_documentName : documentName , customersearch_documentData : data.documentData}
              })
              this.showImageOBE = false;
              this.showOtherFormatOBEDoc = true;
              this.pdfUrlOBE = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData);
              this.loadOTHERNRICBACK = false;
              this.viewOTHER_NRIC_BE = false;
              this.disableOBEInput = true;
              this.disableOBENric = true;
             }
             else{
              this.loadOTHERNRICBACK = false;
              this.viewOTHER_NRIC_BE = false;
              this.disableOBEInput = true;
              this.disableOBENric = true;
              this.url[this.otherNRICback] = data.documentData; 
             }
            }
          else {
            let text = data.documentData;
            if (text.substring(5, 20) == 'application/pdf') {
              this.store.setItem('DOCUMENT_INQ_DATA', data.documentData);
              this.store.setItem('DOCUMENT_NAME', documentName);
              this.router.navigate([`profile/preview/`]);
            }
          this.disableOBEInput = false;
          this.viewOTHER_NRIC_BE = false;
          this.uploadOBE = false;
          this.uploadOBENric =true;
          this.disableOBENric = false;
          this.url[this.otherNRICback] = data.documentData; 
        }
         },
          //error handling completed in 01-06-2023
  (error:any)=>{
    this.loadOTHERNRICBACK = false;
    if(error.status != 401){
      //Opending error dialog based on user 
      if(this.store.getItem('USER_ROLE') == "111"){ //consumer
        this.dialogRef.open(ErrorDialogComponent) ;
      }
      else{ //backoffice - It can be any role
        if(error.error.errorMessage == "Document not found"){
          this.snackBar.open("Could'nt find this document, kindly reupload !" , "Ok",{
            panelClass: "custom-orange-notification-snackbar",
            duration: 2000
          }) ;
            this.loadOTHERNRICBACK = false;
            
            this.showEditInfoOtherNricBack = true ;
            this.viewOTHER_NRIC_BE = false;
            this.disableOBEInput = true;
            this.disableOBENric = true;
          
        }
       else if(error.error.errorMessage != "Document not found"){
        this.dialogRef.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
      
      }
    }
  }
         )
       }
        if( documentName == 'ADDRESS_PROOF'){
          this.loadAddressProof = true;
          if(this.customerflag == true){ //When entry point is backoffice > customer search > view documents : we can show edit button ..
          this.showEditInfoAddressProof = false;
          this.isDisableEditCustomerDetailsAddressProof = false;
          }
          this.reuploadAddress = false;
        this.documentId = this.docAddress[0].docId;
         this.documentService.getDocumentInquiry(this.documentId,this.customerflag).subscribe(data => {
          this.documentInquiry = data;
          this.loadAddressProof = false;
          if(this.customerflag == true){
          this.showEditInfoAddressProof = true;
          }
          this.form.get('AddressProof')?.clearValidators();
          this.form.get('AddressProof')?.updateValueAndValidity();
          if(applicationStatus == "APPROVED" || applicationStatus == "PENDING" || customerStatus == "ACTIVE"){
            this.disableAddressInput = true;
            this.viewAddressProof = false;
            this.UploadAddress = false;
            this.url[this.addressProof] = data.documentData;
            let text = data.documentData;
          if(text.substring(5,20) == 'application/pdf'){
            this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
            this.store.setItem('DOCUMENT_NAME',documentName);
            this.router.navigate([`profile/preview/`]);
          }
          }
          else if((applicationStatus == undefined || applicationStatus == "undefined") && (customerStatus == undefined || customerStatus == "undefined" || customerStatus == "INACTIVE")){
            let text = data.documentData;
            if(text.substring(5,20) == 'application/pdf'){ 
              this.dialogRef.open(PreviewDocumentComponent,{
                width: '1300px',
                height: '650px',
                panelClass:'custom-modalbox',
                data : {customersearch_documentName : documentName , customersearch_documentData : data.documentData}
              })
              this.showImageAddress = false;
              this.showOtherFormatAddressDoc = true;
              this.pdfUrlAddress = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData);
              this.loadAddressProof = false;
              this.viewAddressProof = false;
              this.disableAddressInput = true;
              this.disableAddressNric = true;
             }
             else{
              this.loadAddressProof = false;
              this.viewAddressProof = false;
              this.disableAddressInput = true;
              this.disableAddressNric = true;
              this.url[this.addressProof] = data.documentData; 
             }
            }
          else{
            let text = data.documentData;
            if(text.substring(5,20) == 'application/pdf'){
              this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
              this.store.setItem('DOCUMENT_NAME',documentName);
              this.router.navigate([`profile/preview/`]);
            }
          this.disableAddressInput = false;
          this.viewAddressProof = false;
          this.UploadAddress = false;
          this.uploadAddressNric = true;
          this.disableAddressNric = false;
          this.url[this.addressProof] = data.documentData; 
          }
         },
          //error handling completed in 01-06-2023
  (error:any)=>{
    this.loadAddressProof = false;
    if(error.status != 401){
      //Opending error dialog based on user 
      if(this.store.getItem('USER_ROLE') == "111"){ //consumer
        this.dialogRef.open(ErrorDialogComponent) ;
      }
      else{ //backoffice - It can be any role
        if(error.error.errorMessage == "Document not found"){
          this.snackBar.open("Could'nt find this document, kindly reupload !" , "Ok",{
            panelClass: "custom-orange-notification-snackbar",
            duration: 2000
          }) ;
            this.loadAddressProof = false;
            
            this.showEditInfoAddressProof = true ;
            this.viewAddressProof = false;
            this.disableAddressInput = true;
            this.disableAddressNric = true;
          
        }
       else if(error.error.errorMessage != "Document not found"){
        this.dialogRef.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
      
      }
    }
  }
         )
       }
        if( documentName == 'PAYSLIP'){
          this.loadPayslip = true;
          if(this.customerflag == true){ //When entry point is backoffice > customer search > view documents : we can show edit button ..
          this.showEditInfoPayslip = false;
          this.isDisableEditCustomerDetailsPayslip = false;
          }
          this.reuploadPayslip = false;
        this.documentId = this.docPayslip[0].docId;
         this.documentService.getDocumentInquiry(this.documentId,this.customerflag).subscribe(data => {
          this.documentInquiry = data;
          this.loadPayslip = false;
          if(this.customerflag == true){
          this.showEditInfoPayslip = true;
          }
          this.form.get('PaySlip')?.clearValidators();
          this.form.get('PaySlip')?.updateValueAndValidity()
          if(applicationStatus == "APPROVED" || applicationStatus == "PENDING" || customerStatus == "ACTIVE"){
          this.disablePayslipInput = true;
          this.viewPayslip = false;
          this.UploadPayslip = false;
          this.url[this.paySlip] = data.documentData; 
          let text = data.documentData;
          if(text.substring(5,20) == 'application/pdf'){
            this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
            this.store.setItem('DOCUMENT_NAME',documentName);
            this.router.navigate([`profile/preview/`]);
          }
          }
          else if((applicationStatus == undefined || applicationStatus == "undefined") && (customerStatus == undefined || customerStatus == "undefined" || customerStatus == "INACTIVE")){
            let text = data.documentData;
            if(text.substring(5,20) == 'application/pdf'){ 
              this.dialogRef.open(PreviewDocumentComponent,{
                width: '1300px',
                height: '650px',
                panelClass:'custom-modalbox',
                data : {customersearch_documentName : documentName , customersearch_documentData : data.documentData}
              })
              this.showImagePayslip = false;
              this.showOtherFormatPaySlipDoc = true;
              this.pdfUrlPaySlip = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData);
              this.loadPayslip = false;
              this.viewPayslip = false;
              this.disablePayslipInput = true;
              this.disablePayslipNric = true;
             }
             else{
              this.loadPayslip = false;
              this.viewPayslip = false;
              this.disablePayslipInput = true;
              this.disablePayslipNric = true;
              this.url[this.paySlip] = data.documentData; 
             }
            }
          else{
            let text = data.documentData;
            if(text.substring(5,20) == 'application/pdf'){
              this.store.setItem('DOCUMENT_INQ_DATA',data.documentData);
              this.store.setItem('DOCUMENT_NAME',documentName);
              this.router.navigate([`profile/preview/`]);
            }
           
          this.disablePayslipInput = false;
          this.viewPayslip = false;
          this.UploadPayslip = false;
          this.uploadPayslipNric = true;
          this.disablePayslipNric = false;
          this.url[this.paySlip] = data.documentData; 
          
        }
         },
          //error handling completed in 01-06-2023
  (error:any)=>{
    this.loadPayslip = false;
    if(error.status != 401){
      //Opending error dialog based on user 
      if(this.store.getItem('USER_ROLE') == "111"){ //consumer
        this.dialogRef.open(ErrorDialogComponent) ;
      }
      else{ //backoffice - It can be any role
        if(error.error.errorMessage == "Document not found"){
          this.snackBar.open("Could'nt find this document, kindly reupload !" , "Ok",{
            panelClass: "custom-orange-notification-snackbar",
            duration: 2000
          }) ;
            this.loadPayslip = false;
            
            this.showEditInfoPayslip = true ;
            this.viewPayslip = false;
            this.disablePayslipInput = true;
            this.disablePayslipNric = true;
          
        }
       else if(error.error.errorMessage != "Document not found"){
        this.dialogRef.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
      
      }
    }
  }
         )
       }

    // onboarding Document

    // check
    if (documentName == 'ONBOARDING_DOCUMENT') {
      this.loadOnboardingDoc = true;
      if (this.customerflag == true) { //When entry point is backoffice > customer search > view documents : we can show edit button ..
        this.showEditInfoOnboardingDoc = false;
        this.isDisableEditCustomerDetailsOnboardingDoc = false;
      }
      this.reuploadOnboardingDoc = false;
      this.documentId = this.docOnboarding[0].docId;
      this.documentService.getDocumentInquiry(this.documentId, this.customerflag).subscribe(data => {
        this.documentInquiry = data;
        this.loadOnboardingDoc = false;
        if (this.customerflag == true) {
          this.showEditInfoOnboardingDoc = true;
        }
        this.form.get('OnboardingDoc')?.clearValidators();
        this.form.get('OnboardingDoc')?.updateValueAndValidity()
        if (applicationStatus == "APPROVED" || applicationStatus == "PENDING" || customerStatus == "ACTIVE") {
          this.disableOnboardingDocInput = true;
          this.viewOnboardingDoc = false;
          this.uploadOnboardingDocIcon = false;
          this.url[this.onboardingDoc] = data.documentData;
          let text = data.documentData;
          if (text.substring(5, 20) == 'application/pdf') {
            this.store.setItem('DOCUMENT_INQ_DATA', data.documentData);
            this.store.setItem('DOCUMENT_NAME', documentName);
            this.router.navigate([`profile/preview/`]);
          }
        }
        else if ((applicationStatus == undefined || applicationStatus == "undefined") && (customerStatus == undefined || customerStatus == "undefined" || customerStatus == "INACTIVE")) {
          let text = data.documentData;
          if (text.substring(5, 20) == 'application/pdf') {
            this.dialogRef.open(PreviewDocumentComponent, {
              width: '1300px',
              height: '650px',
              panelClass: 'custom-modalbox',
              data: { customersearch_documentName: documentName, customersearch_documentData: data.documentData }
            })
            this.showImageOnboardingDoc = false;
            this.showOtherFormatOnboardingDoc = true;
            this.pdfUrlOnboardingDoc = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData);
            this.loadOnboardingDoc = false;
            this.viewOnboardingDoc = false;
            this.disableOnboardingDocInput = true;
            this.disableOnboardingDoc = true;
          }
          else {
            this.loadOnboardingDoc = false;
            this.viewOnboardingDoc = false;
            this.disableOnboardingDocInput = true;
            this.disableOnboardingDoc = true;
            this.url[this.onboardingDoc] = data.documentData;
          }
        }
        else {
          let text = data.documentData;
          if (text.substring(5, 20) == 'application/pdf') {
            this.store.setItem('DOCUMENT_INQ_DATA', data.documentData);
            this.store.setItem('DOCUMENT_NAME', documentName);
            this.router.navigate([`profile/preview/`]);
          }

          this.disableOnboardingDocInput = false;
          this.viewOnboardingDoc = false;
          this.uploadOnboardingDocIcon = false;
          this.uploadOnboardingDoc = true;
          this.disableOnboardingDoc = false;
          this.url[this.onboardingDoc] = data.documentData;

        }
      },
        //error handling completed in 01-06-2023
        (error: any) => {
          this.loadOnboardingDoc = false;
          if (error.status != 401) {
            //Opending error dialog based on user 
            if (this.store.getItem('USER_ROLE') == "111") { //consumer
              this.dialogRef.open(ErrorDialogComponent);
            }
            else { //backoffice - It can be any role
              if (error.error.errorMessage == "Document not found") {
                this.snackBar.open("Could'nt find this document, kindly reupload !", "Ok", {
                  panelClass: "custom-orange-notification-snackbar",
                  duration: 2000
                });
                this.loadOnboardingDoc = false;

                this.showEditInfoOnboardingDoc = true;
                this.viewOnboardingDoc = false;
                this.disableOnboardingDocInput = true;
                this.disableOnboardingDoc = true;

              }
              else if (error.error.errorMessage != "Document not found") {
                this.dialogRef.open(ErrorDialogAdminComponent, {
                  data: { errorMessage: error.error.errorMessage ? error.error.errorMessage : "" }
                });
              }


      
      }
    }
  }
         )
       }
       
  }
  //In Application Listings > view Documents to view SOW (back)  
  back() {
   this.applicationId =this.store.getItem('APPLICATION_ID');
    this.profileService.getApplicationInquiry(this.applicationId).subscribe(data => {
      this.applicationInquiry = data;
    this.dialogRef.open(AddressComponent, {
      width:'1240px',
      height: '575px',
      panelClass:'custom-modalbox',
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

//Application Listings > Add Application > navigating from document screen to SOW screen  
goBack(){
  this.dialogRef.open(AddressComponent, {
    width:'1240px',
    height: '575px',
    panelClass:'custom-modalbox',
    data: { emptyfields: true }
  })
}
goSOW(){//Customersearch > navigating from document screen to SOW screen 
  this.customerId = this.store.getItem('CUSTOMER_ID')
  this.customerSearchService.getCustomerInquiry(this.customerId).subscribe(data => {
    this.customerInquiry = data;
    this.dialogRef.open(AddressComponent, {
      width:'1240px',
      height: '575px',
      panelClass:'custom-modalbox',
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
//branch user > view docs > onClick Reject button , this function triggers
  openRejected() {
    this.dialogRef.open(ConfirmationDialogComponent, {
      data: { rejectApplication : true }
    })
  
  }
 
applicationListings: ApplicationListings[] = [];
//Approved - APPLICATION FULLFILMENT API  
  openApproved() {
    this.applicationService.applicationFulFilment(this.approved()).subscribe(data => {
      console.log(data);
      if(data != undefined){
        this.store.setItem('APPLICATION_APPROVED',data);
      }
      this.dialogRef.open(ApprovedProspect);
    },
    //error handling completed on 01-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  }
    )
     
  }
  approved(): ApplicationFulFillment{
    return new ApplicationFulFillment({
      "applicationId": this.store.getItem('APPLICATION_ID'),
      "status": "APPROVED"
  })
  }
  
// if prospect submitted NRIC_FRONT and NRIC_BACK -> other NRIC_FRONT and BACK is not mandatory.

  
 

  url: any = {};
  documentIds: any = [];
  imageId:any=[];
  nricFront = DOCUMENT_ID_MAPPER.NRIC_FRONT_IMAGE; //nricFront = 1001
  nricBack = DOCUMENT_ID_MAPPER.NRIC_BACK_IMAGE;
  otherNRICfront = DOCUMENT_ID_MAPPER.OTHER_NRIC_FRONT;
  otherNRICback = DOCUMENT_ID_MAPPER.OTHER_NRIC_BACK;
  addressProof = DOCUMENT_ID_MAPPER.ADDRESS_PROOF;
  paySlip = DOCUMENT_ID_MAPPER.PAYSLIP;
  onboardingDoc = DOCUMENT_ID_MAPPER.ONBOARDING_DOCUMENT;
 

  extractDocument(docs: AddDocument[], id: string) {
    docs.filter(v => v.id == id)[0].documentData;
  }

//ADD DOCUMENT API CALL 
  onSelectFile(e: any, id: string,documentName:string) {
    if (e.target.files) {
      if(e.target.files[0].size <= 10485760){ //10485760 bytes = 10mb, in backend they are only allowing 16mb
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]); //It reads the file and once its completed,the data is converted into binary data 
      reader.onload = (event: any) => {   //after the file reading is successfully completed onLoad is triggered

      //Allowing only jpeg , png and pdf file format only for documents uploading .
      // documentData : data:image/jpeg
      // documentData : data:image/png
      // documentData : data:application/pdf

   //Checking whether it's a jpeg or png or pdf..   
     if(e.target.files[0].type == "image/jpeg" || e.target.files[0].type == "image/png" || e.target.files[0].type == "application/pdf"){  
      this.url[id] = event.target.result ;
      //PDF Checking..
        if(e.target.files[0].type == "application/pdf" && this.customerflag != true){ //Customer mobile device
          this.store.setItem('DOC_DATA',this.url[id]);
          this.store.setItem('DOCUMENT_NAME',documentName);
          this.router.navigate(['/profile/preview']);
         }
         if(e.target.files[0].type == "application/pdf" && this.customerflag == true){ //Backoffice > Customer search > View documents > edit documents on select file..
            this.dialogRef.open(PreviewDocumentComponent, {
            width: '1300px',
            height: '650px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: event.target.result }
          })
          if(documentName == "NRIC_FRONT_IMAGE"){
            this.showImageFE = false ;
            this.uploadFENric = false ;
            this.showOtherFormatFEDoc = true;
            this.pdfUrlFE = this.domSanitizer.bypassSecurityTrustResourceUrl(event.target.result);
            this.noNricFrontDocument = false;

          }
          if(documentName == "NRIC_BACK_IMAGE"){
            this.showImageBE = false ;
            this.uploadBENric = false ;
            this.showOtherFormatBEDoc = true;
            this.pdfUrlBE = this.domSanitizer.bypassSecurityTrustResourceUrl(event.target.result);
            this.noNricBackDocument = false;
          }
          if(documentName == "OTHER_NRIC_FRONT"){
            this.showImageOFE = false ;
            this.uploadOFENric = false ;
            this.showOtherFormatOFEDoc = true;
            this.pdfUrlOFE = this.domSanitizer.bypassSecurityTrustResourceUrl(event.target.result);
            this.noOtherNricFrontDocument = false;
          }
          if(documentName == "OTHER_NRIC_BACK"){
            this.showImageOBE = false ;
            this.uploadOBENric = false ;
            this.showOtherFormatOBEDoc = true;
            this.pdfUrlOBE = this.domSanitizer.bypassSecurityTrustResourceUrl(event.target.result);
            this.noOtherNricBackDocument = false;
          }
          if(documentName == "ADDRESS_PROOF"){
            this.showImageAddress = false ;
            this.uploadAddressNric = false ;
            this.showOtherFormatAddressDoc = true;
            this.pdfUrlAddress = this.domSanitizer.bypassSecurityTrustResourceUrl(event.target.result);
            this.noAddressProofDocument = false;
          }
          if(documentName == "PAYSLIP"){
            this.showImagePayslip = false ;
            this.uploadPayslipNric = false ;
            this.showOtherFormatPaySlipDoc = true;
            this.pdfUrlPaySlip = this.domSanitizer.bypassSecurityTrustResourceUrl(event.target.result);
            this.noPayslipDocument = false;
          }//ONBOARDING_DOCUMENT
          if(documentName == "ONBOARDING_DOCUMENT"){
            this.showImageOnboardingDoc = false ;
            this.uploadOnboardingDoc = false ;
            this.showOtherFormatOnboardingDoc = true;
            this.pdfUrlOnboardingDoc = this.domSanitizer.bypassSecurityTrustResourceUrl(event.target.result);
            this.noOnboardingDocument = false;
          }
          //wRITE CODE BELOW ASH
         }
         //Jpeg and Png checking..
         if(e.target.files[0].type == "image/jpeg" || e.target.files[0].type == "image/png"){
          if(id == "1001"){
            this.showImageFE = true ;
            this.noNricFrontDocument = false;
            this.showOtherFormatFEDoc = false ;
            this.uploadFE = false;
            this.showFEButton = false;
            this.reuploadNricFront = false;
            this.viewNRIC_FE = false;
            this.uploadFENric = true;
            this.form.get('NRICFront')?.clearValidators();
            this.form.get('NRICFront')?.updateValueAndValidity();
            }
            if(id == "1002"){
              this.showImageBE = true ;
              this.noNricBackDocument = false;
              this.showOtherFormatBEDoc = false ;
              this.uploadBE = false;
              this.showBEButton = false;
              this.reuploadNricBack = false;
              this.viewNRIC_BE = false;
              this.uploadBENric = true;
              this.form.get('NRICBack')?.clearValidators();
              this.form.get('NRICBack')?.updateValueAndValidity();
              }
              if(id == "1003"){
                this.showImageOFE = true ;
                this.noOtherNricFrontDocument = false;
                this.showOtherFormatOFEDoc = false ;
                //WRITE CODE HERE ASH
                this.uploadOFE = false;
                this.showOFEButton = false;
                this.reuploadOtherNricFront = false;
                this.viewOTHER_NRIC_FE = false;
                this.uploadOFENric = true;
                }
                if(id == "1004"){
                  this.showImageOBE = true ;
                  this.noOtherNricBackDocument = false;
                  this.showOtherFormatOBEDoc = false ;
                  //WRITE CODE HERE ASH
                  this.uploadOBE = false;
                  this.showOBEButton = false;
                  this.reuploadOtherNricBack = false;
                  this.viewOTHER_NRIC_BE = false;
                  this.uploadOBENric = true;
                  }
                  if(id == "1005"){
                    this.showImageAddress = true ;
                    this.noAddressProofDocument = false;
                    this.showOtherFormatAddressDoc = false ;
                    //WRITE CODE HERE ASH
                    this.UploadAddress = false;
                    this.showAddressProofButton = false;
                    this.reuploadAddress = false;
                    this.viewAddressProof = false;
                    this.uploadAddressNric = true;
                    this.form.get('AddressProof')?.clearValidators();
                    this.form.get('AddressProof')?.updateValueAndValidity();
                    }
                    if(id == "1006"){
                      this.showImagePayslip = true ;
                      this.noPayslipDocument = false;
                      this.showOtherFormatPaySlipDoc = false ;
                      //WRITE CODE HERE ASH
                      this.UploadPayslip = false;
                      this.showPayslipButton = false;
                      this.reuploadPayslip = false;
                      this.viewPayslip = false;
                      this.uploadPayslipNric = true;
                      this.form.get('PaySlip')?.clearValidators();
                      this.form.get('PaySlip')?.updateValueAndValidity();
                      }
                      if(id == "1007"){
                        this.showImageOnboardingDoc = true ;
                        this.noOnboardingDocument = false;
                        this.showOtherFormatOnboardingDoc = false ;
                        //WRITE CODE HERE ASH
                        this.uploadOnboardingDocIcon = false;
                        this.showOnboardingDocButton = false;
                        this.reuploadOnboardingDoc = false;
                        this.viewOnboardingDoc = false;
                        this.uploadOnboardingDoc = true;
                        this.form.get('OnboardingDoc')?.clearValidators();
                        this.form.get('OnboardingDoc')?.updateValueAndValidity();
                        }
                    }
          this.submitted = true;


          if(this.customerflag == true){
            console.log(this.customerflag) ;
            let docId : string = "" ;
            let document : any;
            document =  this.customerInquiry.document.find(doc => doc.docTypeId == id) ;
            console.log(document) ;
            if(document != undefined){ // When the document already exists, it has a object in the document variable
              docId = document.docId ? document.docId : "" ;
            }
            else{// When the user is yet to provide the document, the document variable is undefined(no object)
              document =  this.customerInquiry.document.find((doc:any) => doc.docTypeId == id) ;
              docId = document?.docId ? document.docId : "" ;
              if(this.nricFrontSuccessResponseArray.length == 1 && documentName == "NRIC_FRONT_IMAGE"){
                docId =  this.nricFrontSuccessResponseArray[0] ;
              }
              else if(this.nricBackSuccessResponseArray.length == 1 && documentName == "NRIC_BACK_IMAGE"){
                docId =  this.nricBackSuccessResponseArray[0] ;
              }
              else if(this.otherNricFrontSuccessResponseArray.length == 1 && documentName == "OTHER_NRIC_FRONT"){
                docId =  this.otherNricFrontSuccessResponseArray[0] ;
              }
              else if(this.otherNricBackSuccessResponseArray.length == 1 && documentName == "OTHER_NRIC_BACK"){
                docId =  this.otherNricBackSuccessResponseArray[0] ;
              }
              else if(this.addressProofSuccessResponseArray.length == 1 && documentName == "ADDRESS_PROOF"){
                docId =  this.addressProofSuccessResponseArray[0] ;
              }
              else if(this.payslipSuccessResponseArray.length == 1 && documentName == "PAYSLIP"){
                docId =  this.payslipSuccessResponseArray[0] ;
              }
              else if(this.onBoardingDocSuccessResponseArray.length == 1 && documentName == "ONBOARDING_DOCUMENT"){
                docId =  this.onBoardingDocSuccessResponseArray[0] ;
              }
            }
          let updateCustomerDocument: DocumentUpdateConsumer =  _.cloneDeep(this.updateCustDocument(id, documentName,docId));
          this.documentService.updateConsumerDocument(_.cloneDeep(updateCustomerDocument),this.customerId).subscribe
          (data => {
            this.submitted = true;
            this.documentIds.push(data.documentId);
            if(documentName == "NRIC_FRONT_IMAGE"){
              this.nricFrontSuccessResponseArray.pop();
              this.nricFrontSuccessResponseArray.push(data.documentId);
            }
           else if(documentName == "NRIC_BACK_IMAGE"){
              this.nricBackSuccessResponseArray.pop();
              this.nricBackSuccessResponseArray.push(data.documentId);
            }
            else if(documentName == "OTHER_NRIC_FRONT"){
              this.otherNricFrontSuccessResponseArray.pop();
              this.otherNricFrontSuccessResponseArray.push(data.documentId);
            }
            else if(documentName == "OTHER_NRIC_BACK"){
              this.otherNricBackSuccessResponseArray.pop();
              this.otherNricBackSuccessResponseArray.push(data.documentId);
            }
            else if(documentName == "ADDRESS_PROOF"){
              this.addressProofSuccessResponseArray.pop();
              this.addressProofSuccessResponseArray.push(data.documentId);
            }
            else if(documentName == "PAYSLIP"){
              this.payslipSuccessResponseArray.pop();
              this.payslipSuccessResponseArray.push(data.documentId);
            }
            else if(documentName == "ONBOARDING_DOCUMENT"){
              this.onBoardingDocSuccessResponseArray.pop();
              this.onBoardingDocSuccessResponseArray.push(data.documentId);
            }

            this.imageId.push(data.imageId);
            
            this._snackBar.open("Document has been uploaded successfully!", "Ok",{
              duration: 3000,
              panelClass: "green-notification-snackbar"
            });

          },
          (error:any) => {
            console.log(error.message);
            this.alertService.clear()
            this.alertService.error(" Failed. Try Again");
            if(error.status != 401){ //error handling completed on 01-07-2023
              this.dialogRef.open(ErrorDialogComponent) ;
            }
          })

          
          }
         else{
          let newDocument: AddDocument = _.cloneDeep(this.addDocuments(id));
          console.log(_.cloneDeep(newDocument));
          //service call  
          this.documentService.updateDocument(_.cloneDeep(newDocument)).subscribe
            (data => {
              this.submitted = true;
              this.documentIds.push(data.documentId);
              this.imageId.push(data.imageId);
              this._snackBar.open("Document has been uploaded successfully!", "Ok",{
                duration: 3000,
                panelClass: "green-notification-snackbar"
              });
            },
              (error:any) => {
                console.log(error.message);
                this.alertService.clear()
                this.alertService.error(" Failed. Try Again");
                if(error.status != 401){ //error handling completed on 01-07-2023
                  this.dialogRef.open(ErrorDialogComponent) ;
                }
              })
            }
                  
      }
      //else will not fire add document api .
      else{
         //Word Document --> Restriction
         if(e.target.files[0].type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
          this._snackBar.open("Sorry, DOCX files are not supported for upload. Please choose a different file format.", "Ok",{
            duration: 3000,
          });
        }
        //Excel sheet --> Restriction
        else if(e.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
          this._snackBar.open("Sorry,Spreadsheets are not supported for upload. Please choose a different file format.", "Ok",{
            duration: 3000,
          });
        }
        //Other files --> Restriction
        else{
          this._snackBar.open("Sorry,This file is not supported for upload. Please choose a different file format.", "Ok",{
            duration: 3000,
          });
        }
      }
       
      }
      
      
    
   // }
    // else{
    //   console.log('file size is too large');
    //   this._snackBar.open("file size should not exceed more than 500kb", "Ok",{
    //     duration: 3000,
    //   });
    // }
  }
  else{
    this._snackBar.open('File size exceeds 10mb, Kindly reupload file below 10mb !', "Ok", {
      duration:3000,
      panelClass: "red-notification-snackbar"
    });
  }
  }
}

editData(documentTypeId:string, fieldName:string){
  // this._snackBar.open(`${fieldName} !` , "Ok",{
  //   panelClass: "custom-green-notification-snackbar",
  //   duration: 3000
  // }) ;
  if(documentTypeId == "1001"){
  this.showReuploadCustomerNricFront = true ; //Show upload NRIC Front button
  this.showEditInfoNricFront = false ; //Hide Edit button .. need to replicate for type id's..
  //this.uploadFENric = true
  //this.disableFENric = false
  }
  if(documentTypeId == "1002"){
    this.showReuploadCustomerNricBack = true; 
    this.showEditInfoNricBack = false;
 // this.uploadBENric = true  
  //this.disableBENric = false
  }
  if(documentTypeId == "1003"){
    this.showReuploadCustomerOtherNricFront = true;
    this.showEditInfoOtherNricFront = false;
   // this.uploadOFENric = true  
    //this.disableOFENric = false
    }
  if(documentTypeId == "1004"){
    this.showReuploadCustomerOtherNricBack = true;
    this.showEditInfoOtherNricBack = false;
   // this.uploadOBENric = true  
   // this.disableOBENric = false
   }
  if(documentTypeId == "1005"){
    this.showReuploadCustomerAddressProof = true;
    this.showEditInfoAddressProof = false;
   // this.uploadAddressNric = true  
  //  this.disableAddressNric = false
   }
  if(documentTypeId == "1006"){
    this.showReuploadCustomerPayslip = true;
    this.showEditInfoPayslip = false;
   // this.uploadPayslipNric = true  
  //  this.disablePayslipNric = false
   }
   if(documentTypeId == "1007"){
    this.showReuploadCustomerOnboardingDoc = true;
    this.showEditInfoOnboardingDoc = false;
   // this.uploadOnboardingDoc = true  
  //  this.disableOnboardingDoc = false
   }
}

//build payload for update customer document ..
updateCustDocument(id: string, documentName: string,docId:string): DocumentUpdateConsumer{
  return new DocumentUpdateConsumer({
    "customerType" : "I",
    "documentData": this.url[id],
    "documentName": documentName,
    "documentTypeId": id,
    "documentId" : docId
  })
}


  addDocuments(id: string): AddDocument {
    let applicationId :string = "";
    let applicantId : string = "";
    //its consumer onboarding from mobile , get appId and applicantId from login response
      applicationId = this.store.getItem('APPLICATION_ID') ? this.store.getItem('APPLICATION_ID') : "";
      applicantId = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "" ;
    return new AddDocument({
      "documentId": id,
      "documentName": getDocumentKeyByValue(id),
      "documentData": this.url[id],
      "applicationId" : applicationId,
      "applicantId" : applicantId
    });
  }

//SUBMIT DOCUMENT API CALL - onSave  
onSave(id: string) {
  this.saveDocuments = false;
   this.loader = true; 
    this.documentService.submitDocument(this.submitApplication(id)).subscribe
      (data => {
        console.log(data);
        this.loader = false;
        this.saveDocuments = true;
        this.router.navigate(["/dashboard/custdash"]);
        this.applicationService.updateScreenstatus('documentsFlag')
        this.documentIds.push(data.documentId);
        if(this.form.valid){
        this.alertService.clear()
        this.alertService.success("Successful!!");
        }
      },
        (error:any) => {
          console.log(error.message);
          this.alertService.clear()
          this.alertService.error(" Failed. Try Again");
         // this.loading = false;
          this.submitted = false;
          this.saveDocuments = true;
          this.loader = false; 
          if(error.status != 401){ //error handling completed on 01/07/2023
            this.dialogRef.open(ErrorDialogComponent) ;
          }
        })
   
  
  }

  submitApplication(id: string): SubmitDocument {
    let applicationId :string = "";
    let applicantId : string = "";
    //its consumer onboarding from mobile , get appId and applicantId from login response
      applicationId = this.store.getItem('APPLICATION_ID') ? this.store.getItem('APPLICATION_ID') : "";
      applicantId = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "" ;
    return new SubmitDocument({ 
      "documentIds": this.imageId,
      "applicationId" : applicationId,
      "applicantId" : applicantId
     });
  }

  loadEmptyDocuments(){
    console.log("hello world")
   }


 

}








