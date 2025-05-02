
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';

import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/services/alert.service';

import { AddDocument } from 'src/app/core/model/Add Document/add-document';
import { getDocumentKeyByValue, DOCUMENT_ID_MAPPER } from 'src/app/core/model/Add Document/add-document';
import { SubmitDocument } from 'src/app/core/model/Submit Document/SubmitDocument';
import { DocumentService } from 'src/app/core/services/document.service';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';

import { ApprovedProspect, ConfirmationDialogComponent } from 'src/app/backoffice/shared/modals/confirmation-dialog.component';
import { ApplicationService } from 'src/app/core/services/application.service';
import { ApplicationFulFillment } from 'src/app/core/model/ApplicationFulFillment';
import { distinctUntilChanged } from 'rxjs/operators';
import { ApplicationInquiry } from 'src/app/core/model/ApplicationInquiry/Application-Inquiry';
import { ProfileinfoService } from 'src/app/core/services/profileinfo.service';
import { DocumentInquiry } from 'src/app/core/model/Document Inquiry/document-inquiry';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { CustomerInquiry } from 'src/app/core/model/Customer Inquiry/customer-inquiry';

import { ApplicationListings } from 'src/app/core/model/Application Search/application-search';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { PreviewDocumentComponent } from 'src/app/backoffice/preview-document/preview-document/preview-document.component';

import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { ApplicationSubmitDialogComponent } from '../mc-application-submit-dialog/application-submit-dialog.component';
import { AddressComponent } from 'src/app/onboarding/individual/sow/sourceofwealth.component';


@Component({
  selector: 'app-documents-individual-mc',
  templateUrl: './documents-individual-mc.component.html',
  styleUrls: ['./documents-individual-mc.component.scss']
})
export class DocumentsIndividualMcComponent implements OnInit {

  @Output() documentStatusChanged = new EventEmitter<any>();
  formStatus !: string;
  public form: FormGroup = Object.create(null);
  isDisableReject: Boolean = false;
  isDisableApprove: Boolean = false;
  disableFEInput: Boolean = false;
  disableBEInput: Boolean = false;
  disableOFEInput: Boolean = false;
  disableOBEInput: Boolean = false;
  disableAddressInput: Boolean = false;
  disablePayslipInput: Boolean = false;
  disableOnboardingDocInput : Boolean = false;
  showFEInput: Boolean = true;
  showBEInput: Boolean = true;
  showOFEInput: Boolean = true;
  showOBEInput: Boolean = true;
  showAddressInput: Boolean = true;
  showPayslipInput: Boolean = true;
  showOnboardingDocInput : Boolean = true;
  uploadFENric: Boolean = false;
  disableFENric: Boolean = false;
  uploadBENric: Boolean = false;
  disableBENric: Boolean = false;
  uploadOFENric: Boolean = false;
  disableOFENric: Boolean = false;
  uploadOBENric: Boolean = false;
  disableOBENric: Boolean = false;
  uploadAddressNric: Boolean = false;
  disableAddressNric: Boolean = false;
  uploadPayslipNric: Boolean = false;
  uploadOnboardingDoc: Boolean = false;
  disablePayslipNric: Boolean = false;
  disableOnboardingDoc: Boolean = false;
  showFEButton: Boolean = false;
  showBEButton: Boolean = false;
  showOFEButton: Boolean = false;
  showOBEButton: Boolean = false;
  showAddressProofButton: Boolean = false;
  showPayslipButton: Boolean = false;
  showOnboardingDocButton: Boolean = false;
  uploadFE: Boolean = true;
  uploadBE: Boolean = true;
  uploadOFE: Boolean = true;
  uploadOBE: Boolean = true;
  hideImage: Boolean = true;
  showNoDocuments: Boolean = false;
  application: AddDocument = new AddDocument()
  submitted = false;
  loader = false;
  loadNRICFRONT = false;
  loadNRICBACK = false;
  loadOTHERNRICFRONT = false;
  loadOTHERNRICBACK = false;
  loadAddressProof = false;
  loadPayslip = false;
  loadOnboardingDoc = false;
  saveDocuments: Boolean = true;
  viewNRIC_FE: any;
  viewNRIC_BE: any;
  viewOTHER_NRIC_FE: any;
  viewOTHER_NRIC_BE: any;
  viewPayslip: any;
  viewOnboardingDoc: any;
  viewAddressProof: any;
  NRICBEViewButton: Boolean = false;
  getDoc: AddDocument[] = [];
  addDocument!: AddDocument;
  showEmptyFields!: Boolean;
  applicationInquiry: ApplicationInquiry = new ApplicationInquiry();
  customerInquiry: CustomerInquiry = new CustomerInquiry();
  applicationId: any;
  documentInquiry: DocumentInquiry = new DocumentInquiry();
  documentId !: string;
  noImage!: string;
  buttonMessage: string = '';
  hideAddressProof: Boolean = true;
  hidePayslip: Boolean = true;
  hideOnboardingDoc: Boolean = true;
  docFE: any;
  docBE: any;
  docOFE: any;
  docOBE: any;
  docPayslip: any;
  docOnboarding:any;
  docAddress: any;
  UploadPayslip = true;
  uploadOnboardingDocIcon = true;
  UploadAddress = true;
  showFEImage: Boolean = true;
  showBEImage: Boolean = true;
  showOFEImage: Boolean = true;
  showOBEImage: Boolean = true;
  showAddressProof: Boolean = true;
  showPayslip: Boolean = true;
  showOnboardingDoc: Boolean = true;
  customerId!: string;
  reuploadNricFront: Boolean = false;
  reuploadNricBack: Boolean = false;
  reuploadOtherNricFront: Boolean = false;
  reuploadOtherNricBack: Boolean = false;
  reuploadPayslip: Boolean = false;
  reuploadOnboardingDoc: Boolean = false;
  reuploadAddress: Boolean = false;
  previewPdf: Boolean = false;
  showImageFE: Boolean = true;
  showImageBE: Boolean = true;
  showImageOFE: Boolean = true;
  showImageOBE: Boolean = true;
  showImageAddress: Boolean = true;
  showImagePayslip: Boolean = true;
  showImageOnboardingDoc: Boolean = true;
  showOtherFormatFEDoc: Boolean = false;
  showOtherFormatBEDoc: Boolean = false;
  showOtherFormatOFEDoc: Boolean = false;
  showOtherFormatOBEDoc: Boolean = false;
  showOtherFormatAddressDoc: Boolean = false;
  showOtherFormatPaySlipDoc: Boolean = false;
  showOtherFormatOnboardingDoc: Boolean = false;
  pdfUrlFE: any;
  pdfUrlBE: any;
  pdfUrlOFE: any;
  pdfUrlOBE: any;
  pdfUrlAddress: any;
  pdfUrlPaySlip: any;
  pdfUrlOnboardingDoc: any;
  url: any = {};
  documentIds: any = [];
  imageId: any = [];
  nricFront = DOCUMENT_ID_MAPPER.NRIC_FRONT_IMAGE; //nricFront = 1001
  nricBack = DOCUMENT_ID_MAPPER.NRIC_BACK_IMAGE;
  otherNRICfront = DOCUMENT_ID_MAPPER.OTHER_NRIC_FRONT;
  otherNRICback = DOCUMENT_ID_MAPPER.OTHER_NRIC_BACK;
  addressProof = DOCUMENT_ID_MAPPER.ADDRESS_PROOF;
  paySlip = DOCUMENT_ID_MAPPER.PAYSLIP;
  onboardingDoc = DOCUMENT_ID_MAPPER.ONBOARDING_DOCUMENT;
  retrievedApplicantId !: string;
  retrievedApplicationId !: string;
  showEditableForBranchChannel: boolean = false ;
  showStepperButtons= true ;
  showApplicationFulfillmentBtnMc = false ;
  applicationStatus !: string ;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private titleService: TitleHeaderService,
    public fb: FormBuilder, private profileService: ProfileinfoService, private documentService: DocumentService, private route: ActivatedRoute,
    private alertService: AlertService, private router: Router, private _bottomSheet: MatBottomSheet, private customerSearchService: CustomerSearchService,
    private dialogRef: MatDialog, private applicationService: ApplicationService, private store: InMemoryCache,
    private _snackBar: MatSnackBar, private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.titleService.setTitle('Account Opening');
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

//MC => Application search 
    if(this.data.appSearchOnboardingForMc){
      this.store.setItem('MC_IND_APPLICATION_ID',this.data.applicationId); //MC_IND_APPLICATION_ID
      this.store.setItem('MC_IND_APPLICANT_ID',this.data.applicantId) //MC_IND_APPLICANT_ID
      this.showEditableForBranchChannel = true ;
      this.showStepperButtons = false ;
     
    }
    //MC --> Add Documents screen (modal dialog) >>> initially should call application inquiry and check ..
    this.retrievedApplicationId = this.store.getItem('MC_IND_APPLICATION_ID') ? this.store.getItem('MC_IND_APPLICATION_ID') : "";
    this.retrievedApplicantId = this.store.getItem('MC_IND_APPLICANT_ID') ? this.store.getItem('MC_IND_APPLICANT_ID') : "";
    if (this.retrievedApplicationId != "") {

      this.profileService.getApplicationInquiry(this.retrievedApplicationId).subscribe(data => {
        this.applicationInquiry = data;

     //   let nricValue = this.applicationInquiry.demographics?.idNumber ? this.applicationInquiry.demographics?.idNumber : "" ;
    //If NRIC starts with 'S' --> Make NRIC validity field as non mandatory .
  //   if(nricValue.startsWith('S') == true){
  //    this.form.controls['AddressProof'].clearValidators() ;
  //    this.form.controls['AddressProof'].updateValueAndValidity() ;
  //  }
  //  else{
  //    this.form.controls['AddressProof'].setValidators(Validators.required) ;
  //    this.form.controls['AddressProof'].updateValueAndValidity() ;
  //  }

        this.applicationStatus = data.status ? data.status : "" ; //this application status is used for checking what app status is this .
        console.log("Application status =" + this.applicationStatus) ;

        let hasSpecificItem : string = this.store.getItem('APPLICATION_APPROVE_REJECT_ACCESS_CONTROL') ;
        //we should enable this approve and reject btn only when hasSpecificItem is true and executed ..
        if(hasSpecificItem == "true"){
          if(this.applicationStatus == "PENDING"){ //approve reject button shown only when app status is PENDING .
            this.showApplicationFulfillmentBtnMc = true ;
          }
          else{
            this.showApplicationFulfillmentBtnMc = false ;
          }
        }
        else if(hasSpecificItem == "false"){
          this.showApplicationFulfillmentBtnMc = false ;
        }

        this.docFE = this.applicationInquiry.document.filter(((v: any) => v.docName === "NRIC_FRONT_IMAGE"))
        this.docBE = this.applicationInquiry.document.filter(((v: any) => v.docName === "NRIC_BACK_IMAGE"))
        this.docOFE = this.applicationInquiry.document.filter(((v: any) => v.docName === "OTHER_NRIC_FRONT"))
        this.docOBE = this.applicationInquiry.document.filter(((v: any) => v.docName === "OTHER_NRIC_BACK"))
        this.docPayslip = this.applicationInquiry.document.filter(((v: any) => v.docName === "PAYSLIP"))
        this.docOnboarding = this.applicationInquiry.document.filter(((v: any) => v.docName === "ONBOARDING_DOCUMENT"))
        this.docAddress = this.applicationInquiry.document.filter(((v: any) => v.docName === "ADDRESS_PROOF"))

        if (this.docFE[0] != undefined) {
          this.disableFEInput = true;
          this.showFEInput = false;
          this.buttonMessage = 'Click to view !'
          this.uploadFE = false;
          this.viewNRIC_FE = true;
          this.form.get('NRICFront')?.clearValidators();
          this.form.get('NRICFront')?.updateValueAndValidity();
        }
        if (this.docBE[0] != undefined) {
          this.disableBEInput = true;
          this.showBEInput = false;
          this.buttonMessage = 'Click to view !'
          this.uploadBE = false;
          this.viewNRIC_BE = true;
          this.form.get('NRICBack')?.clearValidators();
          this.form.get('NRICBack')?.updateValueAndValidity();
        }

        if (this.docOBE[0] != undefined) {
          this.disableOBEInput = true;
          this.showOBEInput = false;
          this.buttonMessage = 'Click to view !'
          this.uploadOBE = false;
          this.viewOTHER_NRIC_BE = true;
        }

        if (this.docOFE[0] != undefined) {
          this.disableOFEInput = true;
          this.showOFEInput = false;
          this.buttonMessage = 'Click to view !'
          this.viewOTHER_NRIC_FE = true;
          this.uploadOFE = false;
        }

        if (this.docPayslip[0] != undefined) {
          this.disablePayslipInput = true;
          this.showPayslipInput = false;
          this.buttonMessage = 'Click to view !'
          this.viewPayslip = true;
          this.UploadPayslip = false;
          this.form.get('PaySlip')?.clearValidators();
          this.form.get('PaySlip')?.updateValueAndValidity();
        }

        if (this.docOnboarding[0] != undefined) {
          this.disableOnboardingDocInput = true;
          this.showOnboardingDocInput = false;
          this.buttonMessage = 'Click to view !'
          this.viewOnboardingDoc = true;
          this.uploadOnboardingDocIcon = false;
          this.form.get('OnboardingDoc')?.clearValidators();
          this.form.get('OnboardingDoc')?.updateValueAndValidity();
        }

        if (this.docAddress[0] != undefined) {
          this.disableAddressInput = true;
          this.showAddressInput = false;
          this.buttonMessage = 'Click to view !';
          this.viewAddressProof = true;
          this.UploadAddress = false;
          this.form.get('AddressProof')?.clearValidators();
          this.form.get('AddressProof')?.updateValueAndValidity();
        }

      },
        //error handling completed in 30-06-2023
        (error: any) => {
          if (error.status != 401) {
            this.dialogRef.open(ErrorDialogAdminComponent);
          }
        }
      )
    }



  }


  //when backoffice clicks the click to view layout..
  loadDocumentData(documentName: any) {
    console.log("load document  function")
    const applicationStatus = this.store.getItem('APPLICATIONSTATUS');
    if (documentName == 'NRIC_FRONT_IMAGE') {
      this.loadNRICFRONT = true;
      this.reuploadNricFront = false;
      this.documentId = this.docFE[0].docId;
      //document inquiry api call
      this.documentService.getDocumentInquiry(this.documentId,false).subscribe(data => {
        this.documentInquiry = data;
        this.loadNRICFRONT = false;
        this.form.get('NRICFront')?.clearValidators();
        this.form.get('NRICFront')?.updateValueAndValidity();
        this.url[this.nricFront] = data.documentData;

        let text = data.documentData;
        //checks it is pdf
        if (text.substring(5, 20) == 'application/pdf') {
          this.dialogRef.open(PreviewDocumentComponent, {
            width: '1300px',
            height: '650px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: data.documentData }
          })
          // this.showImageFE = false;
          // this.showOtherFormatFEDoc = true;
          // this.pdfUrlFE = this.domSanitizer.bypassSecurityTrustResourceUrl(data.documentData);
          // this.loadNRICFRONT = false;
          // this.viewNRIC_FE = false;
          // this.disableFEInput = true;
          // this.disableFENric = true;
          this.callApplicationInquiryAp();
          this.reuploadNricFront = true; //new
        }
        //if not pdf , that will be in image type (jpeg or png) , also image can be editable ..
        else {
          this.showImageFE = true;
          this.uploadFE = false;
          this.showFEButton = false;
          this.showOtherFormatFEDoc = false;
          this.reuploadNricFront = false;
          this.viewNRIC_FE = false;
          this.uploadFENric = true;
          this.disableFEInput = false; //enabling input
          this.disableFENric = false;  //enabling input
          this.url[this.nricFront] = data.documentData;
          this.form.get('NRICFront')?.clearValidators();
          this.form.get('NRICFront')?.updateValueAndValidity();

        }


      },
        //error handling completed in 01-06-2023
        (error: any) => {
          this.loadNRICFRONT = false;
          if (error.status != 401) {
            //Opending error dialog based on user 

            this.dialogRef.open(ErrorDialogAdminComponent);

          }
        }
      )

    }
    if (documentName == 'NRIC_BACK_IMAGE') {
      this.loadNRICBACK = true;
      this.reuploadNricBack = false;
      this.documentId = this.docBE[0].docId;
      //document inq api call 
      this.documentService.getDocumentInquiry(this.documentId,false).subscribe(data => {
        this.loadNRICBACK = false;
        this.documentInquiry = data;
        this.form.controls['NRICBack']?.clearValidators();
        this.form.controls['NRICBack']?.updateValueAndValidity();


        let text = data.documentData;
        if (text.substring(5, 20) == 'application/pdf') {
          this.dialogRef.open(PreviewDocumentComponent, {
            width: '1300px',
            height: '650px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: data.documentData }
          })
          this.callApplicationInquiryAp();
          this.reuploadNricBack = true; //new
        }
        else {
          this.showImageBE = true;
          this.uploadBE = false;
          this.showBEButton = false;
          this.showOtherFormatBEDoc = false;
          this.reuploadNricBack = false;
          this.viewNRIC_BE = false;
          this.uploadBENric = true;
          this.disableBEInput = false; //enabling input
          this.disableBENric = false;  //enabling input
          this.url[this.nricBack] = data.documentData;
          this.form.get('NRICBack')?.clearValidators();
          this.form.get('NRICBack')?.updateValueAndValidity();

        }


      },
        //error handling completed in 01-06-2023
        (error: any) => {
          this.loadNRICBACK = false;
          if (error.status != 401) {
            //Opending error dialog based on user 

            this.dialogRef.open(ErrorDialogAdminComponent);

          }
        }
      )
    }
    if (documentName == 'OTHER_NRIC_FRONT') {
      this.loadOTHERNRICFRONT = true;
      this.reuploadOtherNricFront = false;
      this.documentId = this.docOFE[0].docId;
      this.documentService.getDocumentInquiry(this.documentId,false).subscribe(data => {
        this.documentInquiry = data;
        this.loadOTHERNRICFRONT = false;
        this.form.controls['OtherNRICFront']?.clearValidators();
        this.form.controls['OtherNRICFront']?.updateValueAndValidity();


        let text = data.documentData;
        if (text.substring(5, 20) == 'application/pdf') {
          this.dialogRef.open(PreviewDocumentComponent, {
            width: '1300px',
            height: '650px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: data.documentData }
          })
          this.callApplicationInquiryAp();
          this.reuploadOtherNricFront = true; //new
        }
        else {
          this.showImageOFE = true;
          this.uploadOFE = false;
          this.showOFEButton = false;
          this.showOtherFormatOFEDoc = false;
          this.reuploadOtherNricFront = false;
          this.viewOTHER_NRIC_FE = false;
          this.uploadOFENric = true;
          this.disableOFEInput = false; //enabling input
          this.disableOFENric = false;  //enabling input    
          this.url[this.otherNRICfront] = data.documentData;
        }


      },
        //error handling completed in 01-06-2023
        (error: any) => {
          this.loadOTHERNRICFRONT = false;
          if (error.status != 401) {
            //Opending error dialog based on user 
            this.dialogRef.open(ErrorDialogAdminComponent);
          }
        }
      )
    }
    if (documentName == 'OTHER_NRIC_BACK') {
      this.loadOTHERNRICBACK = true;
      this.reuploadOtherNricBack = false;
      this.documentId = this.docOBE[0].docId;
      this.documentService.getDocumentInquiry(this.documentId,false).subscribe(data => {
        this.documentInquiry = data;
        this.loadOTHERNRICBACK = false;
        this.form.controls['OtherNRICBack']?.clearValidators();
        this.form.controls['OtherNRICBack']?.updateValueAndValidity();


        let text = data.documentData;
        if (text.substring(5, 20) == 'application/pdf') {
          this.dialogRef.open(PreviewDocumentComponent, {
            width: '1300px',
            height: '650px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: data.documentData }
          })
          this.callApplicationInquiryAp();
          this.reuploadOtherNricBack = true; //new
        }
        else {
          this.showImageOBE = true;
          this.uploadOBE = false;
          this.showOBEButton = false;
          this.showOtherFormatOBEDoc = false;
          this.reuploadOtherNricBack = false;
          this.viewOTHER_NRIC_BE = false;
          this.uploadOBENric = true;
          this.disableOBEInput = false; //enabling input
          this.disableOBENric = false;  //enabling input    
          this.url[this.otherNRICback] = data.documentData;
        }


      },


        //error handling completed in 01-06-2023
        (error: any) => {
          this.loadOTHERNRICBACK = false;
          if (error.status != 401) {
            //Opending error dialog based on user 

            this.dialogRef.open(ErrorDialogAdminComponent);


          }
        }
      )
    }
    if (documentName == 'ADDRESS_PROOF') {
      this.loadAddressProof = true;
      this.reuploadAddress = false;
      this.documentId = this.docAddress[0].docId;
      this.documentService.getDocumentInquiry(this.documentId,false).subscribe(data => {
        this.documentInquiry = data;
        this.loadAddressProof = false;
        this.form.get('AddressProof')?.clearValidators();
        this.form.get('AddressProof')?.updateValueAndValidity();


        let text = data.documentData;
        if (text.substring(5, 20) == 'application/pdf') {
          this.dialogRef.open(PreviewDocumentComponent, {
            width: '1300px',
            height: '650px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: data.documentData }
          })
          this.callApplicationInquiryAp();
          this.reuploadAddress = true; //new
        }
        else {
          this.showImageAddress = true;
          this.uploadAddressNric = false;
          this.showAddressProofButton = false;
          this.showOtherFormatAddressDoc = false;
          this.reuploadAddress = false;
          this.viewAddressProof = false;
          this.uploadAddressNric = true;
          this.disableAddressInput = false; //enabling input
          this.disableAddressNric = false;  //enabling input
          this.url[this.addressProof] = data.documentData;
        }


      },
        //error handling completed in 01-06-2023
        (error: any) => {
          this.loadAddressProof = false;
          if (error.status != 401) {


            this.dialogRef.open(ErrorDialogAdminComponent);

          }
        }
      )
    }
    if (documentName == 'PAYSLIP') {
      this.loadPayslip = true;
      this.reuploadPayslip = false;
      this.documentId = this.docPayslip[0].docId;
      this.documentService.getDocumentInquiry(this.documentId,false).subscribe(data => {
        this.documentInquiry = data;
        this.loadPayslip = false;
        this.form.get('PaySlip')?.clearValidators();
        this.form.get('PaySlip')?.updateValueAndValidity()

        let text = data.documentData;
        if (text.substring(5, 20) == 'application/pdf') {
          this.dialogRef.open(PreviewDocumentComponent, {
            width: '1300px',
            height: '650px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: data.documentData }
          })
          this.callApplicationInquiryAp();
          this.reuploadPayslip = true; //new
        }
        else {
          this.showImagePayslip = true;
          this.uploadPayslipNric = false;
          this.showPayslipButton = false;
          this.showOtherFormatPaySlipDoc = false;
          this.reuploadPayslip = false;
          this.viewPayslip = false;
          this.uploadPayslipNric = true;
          this.disablePayslipInput = false; //enabling input
          this.disablePayslipNric = false;  //enabling input
          this.url[this.paySlip] = data.documentData;
        }


      },
        //error handling completed in 01-06-2023
        (error: any) => {
          this.loadPayslip = false;
          if (error.status != 401) {
            //Opending error dialog based on user 

            this.dialogRef.open(ErrorDialogAdminComponent);

          }
        }
      )
    }
    if (documentName == 'ONBOARDING_DOCUMENT') {
      this.loadOnboardingDoc = true;
      this.reuploadOnboardingDoc = false;
      this.documentId = this.docOnboarding[0].docId;
      this.documentService.getDocumentInquiry(this.documentId,false).subscribe(data => {
        this.documentInquiry = data;
        this.loadOnboardingDoc = false;
        this.form.get('OnboardingDoc')?.clearValidators();
        this.form.get('OnboardingDoc')?.updateValueAndValidity()

        let text = data.documentData;
        if (text.substring(5, 20) == 'application/pdf') {
          this.dialogRef.open(PreviewDocumentComponent, {
            width: '1300px',
            height: '650px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: data.documentData }
          })
          this.callApplicationInquiryAp();
          this.reuploadOnboardingDoc = true; //new
        }
        else {
          this.showImageOnboardingDoc = true;
          this.uploadOnboardingDoc = false;
          this.showOnboardingDocButton = false;
          this.showOtherFormatOnboardingDoc = false;
          this.reuploadOnboardingDoc = false;
          this.viewOnboardingDoc = false;
          this.uploadOnboardingDoc = true;
          this.disableOnboardingDocInput = false; //enabling input
          this.disableOnboardingDoc = false;  //enabling input
          this.url[this.onboardingDoc] = data.documentData;
        }


      },
        //error handling completed in 01-06-2023
        (error: any) => {
          this.loadOnboardingDoc = false;
          if (error.status != 401) {
            //Opending error dialog based on user 

            this.dialogRef.open(ErrorDialogAdminComponent);

          }
        }
      )
    }
  }

  //ADD DOCUMENT API CALL 
  onSelectFile(e: any, id: string, documentName: string) {
    console.log("onSelect file  function")
    if (e.target.files) {
      if (e.target.files[0].size <= 10485760) { //10485760 bytes = 10mb , in backend they are only allowing 16mb
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]); //It reads the file and once its completed,the data is converted into binary data 
        reader.onload = (event: any) => {   //after the file reading is successfully completed onLoad is triggered

          //Allowing only jpeg , png and pdf file format only for documents uploading .
          // documentData : data:image/jpeg
          // documentData : data:image/png
          // documentData : data:application/pdf

          //Checking whether it's a jpeg or png or pdf..   
          if (e.target.files[0].type == "application/pdf" || e.target.files[0].type == "image/jpeg" || e.target.files[0].type == "image/png") {
            this.url[id] = event.target.result;
            //PDF Checking..
            if (e.target.files[0].type == "application/pdf") {

              this.dialogRef.open(PreviewDocumentComponent, {
                width: '1300px',
                height: '650px',
                panelClass: 'custom-modalbox',
                data: { customersearch_documentName: documentName, customersearch_documentData: event.target.result }
              })
              if (documentName == "NRIC_FRONT_IMAGE") {
                this.callApplicationInquiryAp();
                this.reuploadNricFront = true; //new
                this.uploadFENric = false;
                this.disableFEInput = true; //disabling input
                this.disableFENric = true;  //disabling input
                // this.viewNRIC_FE = true ;
                // this.reuploadNricFront = true ;
                // this.uploadFE = false ;
                // this.showImageFE = false;
                // this.showOtherFormatFEDoc = true;
                // this.pdfUrlFE = this.domSanitizer.bypassSecurityTrustResourceUrl(event.target.result);
                // this.loadNRICFRONT = false;
                // this.viewNRIC_FE = false;
                // this.disableFEInput = true;
                // this.disableFENric = true;
              }
              else if (documentName == "NRIC_BACK_IMAGE") {
                this.callApplicationInquiryAp();
                this.reuploadNricBack = true; //new
                this.uploadBENric = false;
                this.disableBEInput = true; //disabling input
                this.disableBENric = true;  //disabling input
                // this.viewNRIC_BE = true ;
                // this.reuploadNricBack = true ;
                // this.uploadBE = false ;
                // this.showImageBE = false;
                // this.showOtherFormatBEDoc = true;
                // this.pdfUrlBE = this.domSanitizer.bypassSecurityTrustResourceUrl(event.target.result);
                // this.loadNRICBACK = false;
                // this.viewNRIC_BE = false;
                // this.disableBEInput = false;
                // this.disableBENric = false;
              }
              else if (documentName == "OTHER_NRIC_FRONT") {
                this.callApplicationInquiryAp();
                this.reuploadOtherNricFront = true; //new
                this.uploadOFENric = false;
                this.disableOFEInput = true; //disabling input
                this.disableOFENric = true;  //disabling input
              }
              else if (documentName == "OTHER_NRIC_BACK") {
                this.callApplicationInquiryAp();
                this.reuploadOtherNricBack = true; //new
                this.uploadOBENric = false;
                this.disableOBEInput = true; //disabling input
                this.disableOBENric = true;  //disabling input
              }
              else if (documentName == "ADDRESS_PROOF") {
                this.callApplicationInquiryAp();
                this.reuploadAddress = true; //new
                this.uploadAddressNric = false;
                this.disableAddressInput = true; //disabling input
                this.disableAddressNric = true;  //disabling input
              }
              else if (documentName == "PAYSLIP") {
                this.callApplicationInquiryAp();
                this.reuploadPayslip = true; //new
                this.uploadPayslipNric = false;
                this.disablePayslipInput = true; //disabling input
                this.disablePayslipNric = true;  //disabling input
              }
              else if (documentName == "ONBOARDING_DOCUMENT") {
                this.callApplicationInquiryAp();
                this.reuploadOnboardingDoc = true; //new
                this.uploadOnboardingDoc = false;
                this.disableOnboardingDocInput = true; //disabling input
                this.disableOnboardingDoc = true;  //disabling input
              }

            }
            //Jpeg and Png checking..
            if (e.target.files[0].type == "image/jpeg" || e.target.files[0].type == "image/png") {
              if (id == "1001") {

                this.showImageFE = true;
                this.uploadFE = false;
                this.showFEButton = false;
                this.showOtherFormatFEDoc = false;
                this.reuploadNricFront = false;
                this.viewNRIC_FE = false;
                this.uploadFENric = true;
                this.disableFEInput = false; //enabling input
                this.disableFENric = false;  //enabling input
                this.form.get('NRICFront')?.clearValidators();
                this.form.get('NRICFront')?.updateValueAndValidity();
              }
              if (id == "1002") {
                this.showImageBE = true;
                this.uploadBE = false;
                this.showBEButton = false;
                this.showOtherFormatBEDoc = false;
                this.reuploadNricBack = false;
                this.viewNRIC_BE = false;
                this.uploadBENric = true;
                this.disableBEInput = false; //enabling input
                this.disableBENric = false;  //enabling input
                this.form.get('NRICBack')?.clearValidators();
                this.form.get('NRICBack')?.updateValueAndValidity();
              }
              if (id == "1003") {
                this.showImageOFE = true;
                this.uploadOFE = false;
                this.showOFEButton = false;
                this.showOtherFormatOFEDoc = false;
                this.reuploadOtherNricFront = false;
                this.viewOTHER_NRIC_FE = false;
                this.uploadOFENric = true;
                this.disableOFEInput = false; //enabling input
                this.disableOFENric = false;  //enabling input

              }
              if (id == "1004") {
                this.showImageOBE = true;
                this.uploadOBE = false;
                this.showOBEButton = false;
                this.showOtherFormatOBEDoc = false;
                this.reuploadOtherNricBack = false;
                this.viewOTHER_NRIC_BE = false;
                this.uploadOBENric = true;
                this.disableOBEInput = false; //enabling input
                this.disableOBENric = false;  //enabling input
              }
              if (id == "1005") {
                this.showImageAddress = true;
                this.UploadAddress = false;
                this.showAddressProofButton = false;
                this.showOtherFormatAddressDoc = false;
                this.reuploadAddress = false;
                this.viewAddressProof = false;
                this.uploadAddressNric = true;
                this.disableAddressInput = false; //enabling input
                this.disableAddressNric = false;  //enabling input
                this.form.get('AddressProof')?.clearValidators();
                this.form.get('AddressProof')?.updateValueAndValidity();
              }
              if (id == "1006") {
                this.showImagePayslip = true;
                this.UploadPayslip = false;
                this.showPayslipButton = false;
                this.showOtherFormatPaySlipDoc = false;
                this.reuploadPayslip = false;
                this.viewPayslip = false;
                this.uploadPayslipNric = true;
                this.disablePayslipInput = false; //enabling input
                this.disablePayslipNric = false;  //enabling input
                this.form.get('PaySlip')?.clearValidators();
                this.form.get('PaySlip')?.updateValueAndValidity();
              }
              if (id == "1007") {
                this.showImageOnboardingDoc = true;
                this.uploadOnboardingDocIcon = false;
                this.showOnboardingDocButton = false;
                this.showOtherFormatOnboardingDoc = false;
                this.reuploadOnboardingDoc = false;
                this.viewOnboardingDoc = false;
                this.uploadOnboardingDoc = true;
                this.disableOnboardingDocInput = false; //enabling input
                this.disableOnboardingDoc = false;  //enabling input
                this.form.get('OnboardingDoc')?.clearValidators();
                this.form.get('OnboardingDoc')?.updateValueAndValidity();
              }
            }
            this.submitted = true;
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
                (error: any) => {
                  console.log(error.message);
                  this.alertService.clear()
                  this.alertService.error(" Failed. Try Again");
                  if (error.status != 401) { //error handling completed on 01-07-2023
                    this.dialogRef.open(ErrorDialogAdminComponent);
                  }
                })

          }
          //else will not fire add document api .
          else {
            //Word Document --> Restriction
            if (e.target.files[0].type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
              this._snackBar.open("Sorry, DOCX files are not supported for upload. Please choose a different file format.", "Ok", {
                duration: 3000,
              });
            }
            //Excel sheet --> Restriction
            else if (e.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
              this._snackBar.open("Sorry,Spreadsheets are not supported for upload. Please choose a different file format.", "Ok", {
                duration: 3000,
              });
            }
            //Other files --> Restriction
            else {
              this._snackBar.open("Sorry,This file is not supported for upload. Please choose a different file format.", "Ok", {
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
      else {
        this._snackBar.open('File size exceeds 10mb, Kindly reupload file below 10mb !', "Ok", {
          duration: 3000,
          panelClass: "red-notification-snackbar"
        });
      }
    }
  }

  addDocuments(id: string): AddDocument {
    return new AddDocument({
      "documentId": id,
      "documentName": getDocumentKeyByValue(id),
      "documentData": this.url[id],
      "applicationId": this.retrievedApplicationId,
      "applicantId": this.retrievedApplicantId
    });
  }


  //SUBMIT DOCUMENT API CALL - onSave  
  onSave(id: string) {
    this.documentService.submitDocument(this.submitApplication(id)).subscribe
      (data => {
        console.log(data);
        this.dialogRef.open(ApplicationSubmitDialogComponent, {
          width: '460px',
          data : {isIndReview : true}
        })
        this.formStatus = "Documents Form Submitted Sucessfully"
        this.documentStatusChanged.emit('Submitted');
        this.documentIds.push(data.documentId);
        if(this.form.valid) {
          this.alertService.clear()
          this.alertService.success("Successful!!");
        }
      },
        (error: any) => {
          console.log(error.message);
          this.alertService.clear()
          this.alertService.error(" Failed. Try Again");

          if (error.status != 401) { //error handling completed on 01/07/2023
            this.dialogRef.open(ErrorDialogAdminComponent);
          }
        })


  }

  submitApplication(id: string): SubmitDocument {
    return new SubmitDocument({
      "documentIds": this.imageId,
      "applicationId": this.store.getItem('MC_IND_APPLICATION_ID') ? this.store.getItem('MC_IND_APPLICATION_ID') : "",
      "applicantId": this.store.getItem('MC_IND_APPLICANT_ID') ? this.store.getItem('MC_IND_APPLICANT_ID') : ""

    });
  }



  // This function will be trigger automatically  based on the stepper changes in the parent component
  updateStatus(event: any) {
    if (this.formStatus == "Documents Form Submitted Sucessfully") {
      this.form.valueChanges.subscribe(() => {
        this.documentStatusChanged.emit('In Progress');   //Listen for changes whenever the formcontrol value changes ,we change status In-Progress
      });
    }
    else {
      this.documentStatusChanged.emit(this.form.valid ? 'Completed' : 'In Progress');  // Emit an stepper status to the parent-stepper component
    }

  }

  callApplicationInquiryAp() {
    let applicationId: string = this.store.getItem('MC_IND_APPLICATION_ID') ? this.store.getItem('MC_IND_APPLICATION_ID') : "";
    //MC --> Add Documents screen (modal dialog) >>> initially should call application inquiry and check ..
    this.retrievedApplicationId = this.store.getItem('MC_IND_APPLICATION_ID') ? this.store.getItem('MC_IND_APPLICATION_ID') : "";
    this.retrievedApplicantId = this.store.getItem('MC_IND_APPLICANT_ID') ? this.store.getItem('MC_IND_APPLICANT_ID') : "";
    setTimeout(() => {
      this.profileService.getApplicationInquiry(applicationId).subscribe(data => {
        this.applicationInquiry = data;

    //    let nricValue = this.applicationInquiry.demographics?.idNumber ? this.applicationInquiry.demographics?.idNumber : "" ;
    //If NRIC starts with 'S' --> Make NRIC validity field as non mandatory .
  //   if(nricValue.startsWith('S') == true){
  //    this.form.controls['AddressProof'].clearValidators() ;
  //    this.form.controls['AddressProof'].updateValueAndValidity() ;
  //  }
  //  else{
  //    this.form.controls['AddressProof'].setValidators(Validators.required) ;
  //    this.form.controls['AddressProof'].updateValueAndValidity() ;
  //  }

        this.docFE = this.applicationInquiry.document.filter(((v: any) => v.docName === "NRIC_FRONT_IMAGE"))
        this.docBE = this.applicationInquiry.document.filter(((v: any) => v.docName === "NRIC_BACK_IMAGE"))
        this.docOFE = this.applicationInquiry.document.filter(((v: any) => v.docName === "OTHER_NRIC_FRONT"))
        this.docOBE = this.applicationInquiry.document.filter(((v: any) => v.docName === "OTHER_NRIC_BACK"))
        this.docPayslip = this.applicationInquiry.document.filter(((v: any) => v.docName === "PAYSLIP"))
        this.docOnboarding = this.applicationInquiry.document.filter(((v: any) => v.docName === "ONBOARDING_DOCUMENT"))
        this.docAddress = this.applicationInquiry.document.filter(((v: any) => v.docName === "ADDRESS_PROOF"))

        if (this.docFE[0] != undefined) {

          this.disableFEInput = true;
          this.showFEInput = false;
          this.buttonMessage = 'Click to view !'
          this.uploadFE = false;
          this.viewNRIC_FE = true;

          this.uploadFENric = false;
          this.disableFENric = true;  //disabling input

          this.form.get('NRICFront')?.clearValidators();
          this.form.get('NRICFront')?.updateValueAndValidity();
        }
        if (this.docBE[0] != undefined) {
          this.disableBEInput = true;
          this.showBEInput = false;
          this.buttonMessage = 'Click to view !'
          this.uploadBE = false;
          this.viewNRIC_BE = true;

          this.uploadBENric = false;
          this.disableBENric = true;  //disabling input

          this.form.get('NRICBack')?.clearValidators();
          this.form.get('NRICBack')?.updateValueAndValidity();
        }

        if (this.docOBE[0] != undefined) {
          this.disableOBEInput = true;
          this.showOBEInput = false;
          this.buttonMessage = 'Click to view !'
          this.uploadOBE = false;
          this.viewOTHER_NRIC_BE = true;

          this.uploadOBENric = false;
          this.disableOBENric = true;  //disabling input
        }

        if (this.docOFE[0] != undefined) {
          this.disableOFEInput = true;
          this.showOFEInput = false;
          this.buttonMessage = 'Click to view !'
          this.viewOTHER_NRIC_FE = true;
          this.uploadOFE = false;
          this.uploadOFENric = false;
          this.disableOFENric = true;  //disabling input
        }

        if (this.docPayslip[0] != undefined) {
          this.disablePayslipInput = true;
          this.showPayslipInput = false;
          this.buttonMessage = 'Click to view !'
          this.viewPayslip = true;
          this.UploadPayslip = false;
          this.uploadPayslipNric = false;
          this.disablePayslipNric = true;  //disabling input
          this.form.get('PaySlip')?.clearValidators();
          this.form.get('PaySlip')?.updateValueAndValidity();
        }

        if (this.docOnboarding[0] != undefined) {
          this.disableOnboardingDocInput = true;
          this.showOnboardingDocInput = false;
          this.buttonMessage = 'Click to view !'
          this.viewOnboardingDoc = true;
          this.uploadOnboardingDocIcon = false;
          this.uploadOnboardingDoc = false;
          this.disableOnboardingDoc = true;  //disabling input
          this.form.get('OnboardingDoc')?.clearValidators();
          this.form.get('OnboardingDoc')?.updateValueAndValidity();
        }

        if (this.docAddress[0] != undefined) {
          this.disableAddressInput = true;
          this.showAddressInput = false;
          this.buttonMessage = 'Click to view !';
          this.viewAddressProof = true;
          this.UploadAddress = false;
          this.uploadAddressNric = false;
          this.disableAddressNric = true;  //disabling input
          this.form.get('AddressProof')?.clearValidators();
          this.form.get('AddressProof')?.updateValueAndValidity();
        }

      },
        //error handling completed in 30-06-2023
        (error: any) => {
          if (error.status != 401) {
            this.dialogRef.open(ErrorDialogAdminComponent);
          }
        })
    }, 1000);

  }


  //MC => Application search => save documents editable
  saveDocumentsMc(){
    this.documentService.submitDocument(this.submitIndDocumentsMc()).subscribe
    (data => {
      console.log(data);
      if(this.applicationStatus != "PENDING" && this.applicationStatus != "APPROVED" && this.applicationStatus != "REJECTED"){
        this.dialogRef.open(ApplicationSubmitDialogComponent, {
          width: '460px',
          data : {isIndReview : true}
        })
      }
      else { //this.applicationStatus == "PENDING" OR "APPROVED" OR "REJECTED" --> just submit document and close all dialog . should not open application fulfillment dialog
        this.dialogRef.closeAll() ;
      }
      this.documentIds.push(data.documentId);
      // if(this.form.valid) {
       
      // }
    },
      (error: any) => {
        console.log(error.message);
        if (error.status != 401) { //error handling completed on 01/07/2023
          this.dialogRef.open(ErrorDialogAdminComponent);
        }
      })

  }

 
  submitIndDocumentsMc(): SubmitDocument {
      return new SubmitDocument({
        "documentIds": this.imageId,
        "applicationId": this.store.getItem('MC_IND_APPLICATION_ID') ? this.store.getItem('MC_IND_APPLICATION_ID') : "",
        "applicantId": this.store.getItem('MC_IND_APPLICANT_ID') ? this.store.getItem('MC_IND_APPLICANT_ID') : ""
  
      });
    }
  
  

   //MC => Application search => from documents modal to sow modal .
  goToSow(){
    let applicationId = this.store.getItem('MC_IND_APPLICATION_ID') ? this.store.getItem('MC_IND_APPLICATION_ID') : "" ;
    let applicantId = this.store.getItem('MC_IND_APPLICANT_ID') ? this.store.getItem('MC_IND_APPLICANT_ID') : "";
    this.profileService.getApplicationInquiry(applicationId).subscribe(data => {
      this.applicationInquiry = data;
      this.dialogRef.open(AddressComponent, {
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

  //MC => Application search => Ind Documents - Reject application
  openRejected() {
    this.dialogRef.open(ConfirmationDialogComponent, {
      data: { rejectApplication : true , productCode : 'MC'}
    })
  
  }
 
//MC => Application search => Ind Documents - Approve application
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
      "applicationId": this.store.getItem('MC_IND_APPLICATION_ID'),
      "status": "APPROVED"
  })
  }

}
