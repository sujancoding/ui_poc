import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import { PreviewDocumentComponent } from 'src/app/backoffice/preview-document/preview-document/preview-document.component';
import { ApprovedProspect, ConfirmationDialogComponent } from 'src/app/backoffice/shared/modals/confirmation-dialog.component';
import { CorporateConfirmationDialogComponent } from 'src/app/backoffice/shared/modals/corporateconfirmationdialog/corporate-confirmation-dialog.component';
import { AddDocument, CORPORATE_DOCUMENT_ID_MAPPER, CorporateAddDocument, DOCUMENT_ID_MAPPER, fetchDocumentKeyByValue } from 'src/app/core/model/Add Document/add-document';
import { ApplicationFulFillment } from 'src/app/core/model/ApplicationFulFillment';
import { CorporateApplicationInquiry } from 'src/app/core/model/corporateapplicationinquiry/corporateapplicationinquiry';
import { CorporateCustomerInquiry } from 'src/app/core/model/corporatecustomerinquiry/corporatecustomerinquiry';
import { DocumentInquiry, DocumentUpdateCustomer } from 'src/app/core/model/Document Inquiry/document-inquiry';
import { SubmitDocument } from 'src/app/core/model/Submit Document/SubmitDocument';
import { ApplicationService } from 'src/app/core/services/application.service';
import { CorporateService } from 'src/app/core/services/corporate.service';
import { DocumentService } from 'src/app/core/services/document.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CompanyAssociateComponent } from '../sow/company.associate.component';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { ApplicationSubmitDialogComponent } from 'src/app/moneychanger/modals/mc-onboarding/mc-application-submit-dialog/application-submit-dialog.component';

@Component({
  selector: 'app-company-documents',
  templateUrl: './company-documents.component.html',
  styleUrls: ['./company-documents.component.scss']
})
export class CompanyDocumentsComponent implements OnInit {

  //variable declaration
  fieldAcra : Boolean = true;
  fieldOwner : Boolean = true;
  fieldDealer : Boolean = true;
  fieldRunner : Boolean = true;
  
  
 
  clicked:Boolean = false;
  uploadOwnerNric : Boolean = false;
  
  disableAcraNric : Boolean = true;
  uploadAcraNric : Boolean = false;
  disableDealerNric : Boolean = true;
  uploadDealerNric : Boolean = false;
  disableRunnerNric : Boolean = true;
  uploadRunnerNric : Boolean = false;
  hideImage: Boolean = true;
  public form: FormGroup = Object.create(null);
  submitted = false;
  loader = false;
  
  flag!: Boolean;
  convertedFlag : Boolean = false;
  saveDocuments :Boolean = true;
  showNoDocuments : Boolean = false;
  view_ACRA !: Boolean;
  view_OWNER !: Boolean;
  view_DEALER !: Boolean;
  view_RUNNER !: Boolean;
  showEmptyFields!: Boolean;
  applicationId:any;
  documentId !: string; 
  noImage!: string;
  buttonMessage:string='';
  hideAddressProof: Boolean = true;
  hidePayslip:Boolean = true;
  customerId!: string;
  corporateApplicationInquiry : any ; //MOCK HERE
  corporateCustomerInquiry !: CorporateCustomerInquiry;
  documentInquiry !: DocumentInquiry;
  applicationFlag : Boolean = false; 
  customerFlag : Boolean = false;
  
  approverejectFlag !: Boolean;
  
  @Output() companyDocumentsStatusChanged = new EventEmitter<any>();
  formStatus !: string ;
  productCode : string = "";
  showEditableForBranchChannel = false ;
  showApplicationFulfillmentBtnMc = false;
  applicationStatus !: string ;


 //Bcckoffice > Cutomer search > view documents(Corporate) > No Documents found button
noAcraDocument: Boolean = false;
noOwnerDocument : Boolean[] = [];
noDealerDocument : Boolean[] = [];
noRunnerDocument : Boolean[] = [];

//12 NEW DOCUMENTS - DONE
noIncorporationCertDocument : Boolean = false ;
noArticlesAssociationDocument: Boolean = false;
noBankLicenseDocument: Boolean = false;
noTradeLicenseDocument: Boolean = false;
noAmlPolicyAndProceduresDocument: Boolean = false;
noAuditReportDocument: Boolean = false;
noAmlAuditReportDocument: Boolean = false;
noOrganisationStructureDocument: Boolean = false;
noManagementListDocument: Boolean = false;
noIdCopiesDocument: Boolean = false;
noKycFormDocument: Boolean = false;
noWolfsbergFormDocument: Boolean = false;
noOnboardingDocument : Boolean =false

noDocumentMessage = "";

//Bcckoffice > Cutomer search > view documents(Corporate) > This array is used to push the Document Id that we get from the updateCustomerDocument response
acraSuccessResponseArray : any[] = []
ownerSuccessResponseArray : any[] = []
dealerSuccessResponseArray : any[] = []
runnerSuccessResponseArray : any[] = []

//NEWLY ADDED..

 //ACRA
 showAcraInput: Boolean = true;
 uploadIconACRA: Boolean = true;
 disableAcraInput: Boolean = false;
 loadACRA = false;
 showACRA: Boolean = false;
 showImageAcra: Boolean = true;
 showOtherFormatAcra: Boolean = false;
 reuploadAcra: boolean = false;

  //INCORPORATION CERTIFICATE ..
  showIncorporationCertInput: Boolean = true;
  uploadIconIncorporationCert: Boolean = true;
  disableIncorporationCertInput: Boolean = false;
  loadIncorporationCert = false;
  showIncorporationCert : Boolean = false;
  showImageIncorporationCert: Boolean = true;
  showOtherFormatIncorporationCert: Boolean = false;
  reuploadIncorporationCert: boolean = false;

  // ARTICLES_ASSOCIATION field
showArticlesAssociationInput: Boolean = true;
uploadIconArticlesAssociation: Boolean = true;
disableArticlesAssociationInput: Boolean = false;
loadArticlesAssociation = false;
showArticlesAssociation: Boolean = false;
showImageArticlesAssociation: Boolean = true;
showOtherFormatArticlesAssociation: Boolean = false;
reuploadArticlesAssociation: boolean = false;

// BANK_LICENSE field
showBankLicenseInput: Boolean = true;
uploadIconBankLicense: Boolean = true;
disableBankLicenseInput: Boolean = false;
loadBankLicense = false;
showBankLicense: Boolean = false;
showImageBankLicense: Boolean = true;
showOtherFormatBankLicense: Boolean = false;
reuploadBankLicense: boolean = false;

// TRADE_LICENSE field
showTradeLicenseInput: Boolean = true;
uploadIconTradeLicense: Boolean = true;
disableTradeLicenseInput: Boolean = false;
loadTradeLicense = false;
showTradeLicense: Boolean = false;
showImageTradeLicense: Boolean = true;
showOtherFormatTradeLicense: Boolean = false;
reuploadTradeLicense: boolean = false;

// AML_POLICY_AND_PROCEDURES field
showAmlPolicyAndProceduresInput: Boolean = true;
uploadIconAmlPolicyAndProcedures: Boolean = true;
disableAmlPolicyAndProceduresInput: Boolean = false;
loadAmlPolicyAndProcedures = false;
showAmlPolicyAndProcedures: Boolean = false;
showImageAmlPolicyAndProcedures: Boolean = true;
showOtherFormatAmlPolicyAndProcedures: Boolean = false;
reuploadAmlPolicyAndProcedures: boolean = false;

// AUDIT_REPORT field
showAuditReportInput: Boolean = true;
uploadIconAuditReport: Boolean = true;
disableAuditReportInput: Boolean = false;
loadAuditReport = false;
showAuditReport: Boolean = false;
showImageAuditReport: Boolean = true;
showOtherFormatAuditReport: Boolean = false;
reuploadAuditReport: boolean = false;

// LATEST_AML_AUDIT_REPORT field
showAmlAuditReportInput: Boolean = true;
uploadIconAmlAuditReport: Boolean = true;
disableAmlAuditReportInput: Boolean = false;
loadAmlAuditReport = false;
showAmlAuditReport: Boolean = false;
showImageAmlAuditReport: Boolean = true;
showOtherFormatAmlAuditReport: Boolean = false;
reuploadAmlAuditReport: boolean = false;

// LATEST_ORGANISATION_STRUCTURE field
showOrganisationStructureInput: Boolean = true;
uploadIconOrganisationStructure: Boolean = true;
disableOrganisationStructureInput: Boolean = false;
loadOrganisationStructure = false;
showOrganisationStructure: Boolean = false;
showImageOrganisationStructure: Boolean = true;
showOtherFormatOrganisationStructure: Boolean = false;
reuploadOrganisationStructure: boolean = false;

// MANAGEMENT_LIST field
showManagementListInput: Boolean = true;
uploadIconManagementList: Boolean = true;
disableManagementListInput: Boolean = false;
loadManagementList = false;
showManagementList: Boolean = false;
showImageManagementList: Boolean = true;
showOtherFormatManagementList: Boolean = false;
reuploadManagementList: boolean = false;

// ID_COPIES field
showIdCopiesInput: Boolean = true;
uploadIconIdCopies: Boolean = true;
disableIdCopiesInput: Boolean = false;
loadIdCopies = false;
showIdCopies: Boolean = false;
showImageIdCopies: Boolean = true;
showOtherFormatIdCopies: Boolean = false;
reuploadIdCopies: boolean = false;

// KYC_FORM field
showKycFormInput: Boolean = true;
uploadIconKycForm: Boolean = true;
disableKycFormInput: Boolean = false;
loadKycForm = false;
showKycForm: Boolean = false;
showImageKycForm: Boolean = true;
showOtherFormatKycForm: Boolean = false;
reuploadKycForm: boolean = false;

// WOLFSBERG_FORM field
showWolfsbergFormInput: Boolean = true;
uploadIconWolfsbergForm: Boolean = true;
disableWolfsbergFormInput: Boolean = false;
loadWolfsbergForm = false;
showWolfsbergForm: Boolean = false;
showImageWolfsbergForm: Boolean = true;
showOtherFormatWolfsbergForm: Boolean = false;
reuploadWolfsbergForm: boolean = false;

// ONBOARDING_DOCUMENT field
showOnboardingDocInput: Boolean = true;
uploadIconOnboardingDoc: Boolean = true;
disableOnboardingDocInput: Boolean = false;
loadOnboardingDoc = false;
showOnboardingDoc: Boolean = false;
showImageOnboardingDoc: Boolean = true;
showOtherFormatOnboardingDoc: Boolean = false;
reuploadOnboardingDoc: boolean = false;

 //Owner
 showImageOwner: boolean[] = [];
 showOtherFormatOwner: boolean[] = [];
 showOWNER: boolean[] = [];
 uploadIconOWNER: boolean[] = [];
 showOwnerInput: boolean[] = [];
 reuploadOwner: boolean[] = [];
 loadOWNER: boolean[] = [];
 disableOwnerInput: boolean[] = [];
 combinedOwnerData: any[] = [];

 //dealer
 showImageDealer: boolean[] = [];
 showOtherFormatDealer: boolean[] = [];
 showDEALER: boolean[] = [];
 uploadIconDEALER: boolean[] = [];
 showDealerInput: boolean[] = [];
 reuploadDealer: boolean[] = [];
 loadDEALER: boolean[] = [];
 disableDealerInput: boolean[] = [];
 combinedDealerData: any[] = [];

 //runner
 showImageRunner: boolean[] = [];
 showOtherFormatRunner: boolean[] = [];
 showRUNNER: boolean[] = [];
 uploadIconRUNNER: boolean[] = [];
 showRunnerInput: boolean[] = [];
 reuploadRunner: boolean[] = [];
 loadRUNNER: boolean[] = [];
 disableRunnerInput: boolean[] = [];
 combinedRunnerData: any[] = [];

 //segerate owner,dealer,runner
 owners: any[] = [];
 dealers: any[] = [];
 runners: any[] = [];

associateId !: string;
ownerDocObj !: any;
acraDocObj !: any;
runnerDocObj !: any;
dealerDocObj !: any;

//12 NEW DOCUMENTS
incorporationCertDocObj !: any;
articlesAssociationDocObj !: any;
bankLicenseDocObj !: any;
tradeLicenseDocObj !: any;
amlPolicyAndProceduresDocObj !: any;
auditReportDocObj !: any;
amlAuditReportDocObj !: any;
organisationStructureDocObj !: any;
managementListDocObj !: any;
idCopiesDocObj !: any;
kycFormDocObj !: any;
wolfsbergFormDocObj !: any;
onboardingDocObj !: any;        

//PDf
pdfUrlAcra: any;
pdfUrlOwner: any[] = []; 
pdfUrlDealer: any[] = []; 
pdfUrlRunner: any[] = []; 

//12 NEW DOCUMENTS - DONE
pdfUrlIncorporationCert : any;
pdfUrlArticlesAssociation: any;
pdfUrlBankLicense: any;
pdfUrlTradeLicense: any;
pdfUrlAmlPolicyAndProcedures: any;
pdfUrlAuditReport: any;
pdfUrlAmlAuditReport: any;
pdfUrlOrganisationStructure: any;
pdfUrlManagementList: any;
pdfUrlIdCopies: any;
pdfUrlKycForm: any;
pdfUrlWolfsbergForm: any;
pdfUrlOnboardingDoc : any;

flowEntryPoint : string = "" ;

showEditInfoOwner : Boolean[] = [] ;
showEditInfoDealer : Boolean[] = [];
showEditInfoRunner : Boolean[] = [];
showEditInfoAcra : Boolean = false;

//12 NEW DOCUMENTS - DONE
showEditInfoIncorporationCert : Boolean = false ;
showEditInfoArticlesAssociation: Boolean = false;
showEditInfoBankLicense: Boolean = false;
showEditInfoTradeLicense: Boolean = false;
showEditInfoAmlPolicyAndProcedures: Boolean = false;
showEditInfoAuditReport: Boolean = false;
showEditInfoAmlAuditReport: Boolean = false;
showEditInfoOrganisationStructure: Boolean = false;
showEditInfoManagementList: Boolean = false;
showEditInfoIdCopies: Boolean = false;
showEditInfoKycForm: Boolean = false;
showEditInfoWolfsbergForm: Boolean = false;
showEditInfoOnboardingDoc: Boolean = false;

isDisableEditOwnerNric : Boolean[] = [] ;
isDisableEditDealerNric : Boolean[] = [];
isDisableEditRunnerNric : Boolean[] = [];
isDisableEditAcra : Boolean = false;

//12 NEW DOCUMENTS
isDisableEditIncorporationCert : Boolean = false ;
isDisableEditArticlesAssociation: Boolean = false;
isDisableEditBankLicense: Boolean = false;
isDisableEditTradeLicense: Boolean = false;
isDisableEditAmlPolicyAndProcedures: Boolean = false;
isDisableEditAuditReport: Boolean = false;
isDisableEditAmlAuditReport: Boolean = false;
isDisableEditOrganisationStructure: Boolean = false;
isDisableEditManagementList: Boolean = false;
isDisableEditIdCopies: Boolean = false;
isDisableEditKycForm: Boolean = false;
isDisableEditWolfsbergForm: Boolean = false;
isDisableEditOnboardingDoc: Boolean = false;

showReuploadCustomerOwnerNric : Boolean[]=[];
showReuploadCustomerDealerNric : Boolean[]=[];
showReuploadCustomerRunnerNric : Boolean[]=[];
showReuploadCustomerAcra : Boolean = false;

//12 NEW DOCUMENTS - DONE
showReuploadIncorporationCert : Boolean = false ;
showReuploadArticlesAssociation: Boolean = false;
showReuploadBankLicense: Boolean = false;
showReuploadTradeLicense: Boolean = false;
showReuploadAmlPolicyAndProcedures: Boolean = false;
showReuploadAuditReport: Boolean = false;
showReuploadAmlAuditReport: Boolean = false;
showReuploadOrganisationStructure: Boolean = false;
showReuploadManagementList: Boolean = false;
showReuploadIdCopies: Boolean = false;
showReuploadKycForm: Boolean = false;
showReuploadWolfsbergForm: Boolean = false;
showReuploadOnboardingDoc: Boolean = false;

// ACRA: '1005',
// OWNER_NRIC:'1006' ,
// DEALER_NRIC: '1007',
// RUNNER_NRIC: '1008',

isScreenLoader : Boolean = false ;




  constructor(private router: Router , private fb: FormBuilder,private documentService: DocumentService,private alertService : AlertService,private corporateService : CorporateService,
    private applicationService : ApplicationService,private headerService : TitleHeaderService,private _snackBar: MatSnackBar, 
    @Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialog,private route : ActivatedRoute,private store : InMemoryCache,
    private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.headerService.setTitle('Company Documents');
    console.log("company documents load")
    this.form = this.fb.group({
      acra: [null],
      ownerNric: [null],
      dealerNric: [null],
      runnerNric: [null],
      //12 NEW DOCUMENTS - DONE
      incorporationCertificate : [null] ,
      articlesAssociation: [null],
      bankLicense: [null],
      tradeLicense: [null],
      amlPolicyAndProcedures: [null],
      auditReport: [null],
      amlAuditReport: [null],
      organisationStructure: [null],
      managementList: [null],
      idCopies: [null],
      kycForm: [null],
      wolfsbergForm: [null],
      onboardingDoc: [null],

    });

     //corporate mobile - APPLICATION INQUIRY
   this.route.queryParams.subscribe((params: any)=> {
    let applicationId = params.application ? params.application : "";
    this.applicationStatus = this.store.getItem('APPLICATIONSTATUS') ? this.store.getItem('APPLICATIONSTATUS') : "" ;
    if(this.applicationStatus == "NEW" ){
      if(applicationId != undefined){
      //  var datas : any = corpAppInq ;
        this.corporateService.getCorporateApplicationInquiry(applicationId).subscribe(datas => {
        this.corporateApplicationInquiry = datas;
        if(this.store.getItem('APPLICATIONSTATUS') == "APPROVED"){
          this.saveDocuments = false;
        }
        if(this.store.getItem('APPLICATIONSTATUS') == "PENDING"){
          this.saveDocuments = false;
        }

       this.initialLayoutSetup(datas, "CORPMOBILE-NEW");

      });
    }
  }
});

this.applicationStatus = this.store.getItem('APPLICATIONSTATUS') ? this.store.getItem('APPLICATIONSTATUS') : "" ;
if(this.applicationStatus == "PENDING" ){
  let applicationId = this.store.getItem('APPLICATION_ID') ? this.store.getItem('APPLICATION_ID') : "";
  this.saveDocuments = false;
  if(applicationId != undefined){
      this.corporateService.getCorporateApplicationInquiry(applicationId).subscribe(datas => {
      this.corporateApplicationInquiry = datas;
      this.initialLayoutSetup(datas, "CORPMOBILE-PENDING");

    });
  }

}
//mobile - customer inquiry 
this.applicationStatus = this.store.getItem('APPLICATIONSTATUS') ? this.store.getItem('APPLICATIONSTATUS') : "" ;
if(this.applicationStatus == "APPROVED" || this.store.getItem('CUSTOMER_STATUS') =="ACTIVE" || this.store.getItem('CUSTOMER_STATUS') =="INACTIVE"){
  let customerId =  this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "";
  this.saveDocuments = false;
  this.corporateService.getCorporateCustomerInquiry(customerId).subscribe(datas => {
       this.corporateApplicationInquiry = datas;
       this.initialActiveCustomerLayoutSetup(datas, "CORPMOBILE-APPROVED");
  });
}

//Backoffice >>> application search >>> View Application (Channel is MOBILE , Branch is NEW) >>> View Documenys
if(this.data.applicationCompanyDocumentsReview){
  this.headerService.setTitle('Account Opening');
  this.applicationFlag = true;
  this.saveDocuments = false;
  let hasSpecificItem : string = this.store.getItem('APPLICATION_APPROVE_REJECT_ACCESS_CONTROL') ;
  if(hasSpecificItem == "true"){
    //based on requirement , we must enable Approve-Reject button only when app status === "PENDING" ;
    if(this.data.applicationCompanyDocumentsReview.status == "APPROVED" || this.data.applicationCompanyDocumentsReview.status == "NEW" || this.data.applicationCompanyDocumentsReview.status == "REJECTED"){
      this.approverejectFlag = false;
     }
     if(this.data.applicationCompanyDocumentsReview.status == "PENDING"){
       this.approverejectFlag = true;
      }
      if(this.data.applicationCompanyDocumentsReview.document == null){
       this.showNoDocuments = true;
      }
  }
  else{
    this.approverejectFlag = false;
  }
  this.initialLayoutSetup(this.data.applicationCompanyDocumentsReview, "BACKOFFICEMOBILE-ALLSTATUS");
  
}

//Entry Point : Backoffice > Application Search > Add Corporate > View Documents > Update(Stepper flow)
if (this.data.appOnboardingForMc) {
  this.headerService.setTitle('Account Opening');
  this.showEmptyFields = true;
  this.saveDocuments = false;
  this.productCode = "MC" ;
}

//Entry Point : Backoffice > Application Search > View Application(onClick Action Icon) > View Documents > Upload
if (this.data.appSearchOnboardingForMc) {
  this.headerService.setTitle('Account Opening');
  this.saveDocuments = false;
  this.showEditableForBranchChannel = true;
  let applicationId = this.data.applicationId ? this.data.applicationId : "" ;
  let applicantId = this.data.applicantId ? this.data.applicantId : "" ;
  this.store.setItem('MC_CORP_APPLICATIONID',applicationId) ;
  this.store.setItem('MC_CORP_APPLICANTID',applicantId) ;
  this.productCode = "MC";
  this.callApplicationInquiryApi("NEW");
  

}

//Customer search > 
  if(this.data.customerCompanyDocumentsReview){
    this.headerService.setTitle('Customers');
    this.customerId = this.data.customerCompanyDocumentsReview.customerId;
    this.customerFlag = true;
    this.saveDocuments = false;
    
      //Showing all edit info buttons irrespective of their document fields but in disbaled condition initially ..
     this.showEditInfoAcra = true ;
     let ownerArr : any[] = this.data.customerCompanyDocumentsReview.associates ? this.data.customerCompanyDocumentsReview.associates.owner : [] ;
     let dealerArr : any[] = this.data.customerCompanyDocumentsReview.associates ? this.data.customerCompanyDocumentsReview.associates.dealer : [] ;
     let runnerArr : any[] = this.data.customerCompanyDocumentsReview.associates ? this.data.customerCompanyDocumentsReview.associates.runner : [] ;
     if(ownerArr != undefined){
      ownerArr.forEach((item:any,index:number)=>{
        this.showEditInfoOwner[index] = true ;
        this.isDisableEditOwnerNric[index] = true ;
      })
     }
     if(dealerArr != undefined){
      dealerArr.forEach((item:any,index:number)=>{
        this.showEditInfoDealer[index] = true ;
        this.isDisableEditDealerNric[index] = true ;
      })
     }
     if(runnerArr != undefined ){
      runnerArr.forEach((item:any,index:number)=>{
        this.showEditInfoRunner[index] = true ;
        this.isDisableEditRunnerNric[index] = true ;
      })
     }
     // changed to false for upload document 
     this.showEditInfoAcra = true ;
     this.isDisableEditAcra = true ;

     //NEW 12 DOCUMENTS
     //INCORPORATION_CERTIFICATE
     this.showEditInfoIncorporationCert = true ;
     this.isDisableEditIncorporationCert = true ;

     //ARTICLES_ASSOCIATION
     this.showEditInfoArticlesAssociation = true ;
     this.isDisableEditArticlesAssociation = true ;

      //BANK_LICENSE
      this.showEditInfoBankLicense = true ;
      this.isDisableEditBankLicense = true ;

      //TRADE_LICENSE
      this.showEditInfoTradeLicense = true ;
      this.isDisableEditTradeLicense = true ;

       //AML_POLICY_AND_PROCEDURES
       this.showEditInfoAmlPolicyAndProcedures = true ;
       this.isDisableEditAmlPolicyAndProcedures = true ;

       //AUDIT_REPORT
       this.showEditInfoAuditReport = true ;
       this.isDisableEditAuditReport = true ;

        //LATEST_AML_AUDIT_REPORT
        this.showEditInfoAmlAuditReport = true ;
        this.isDisableEditAmlAuditReport = true ;

         //LATEST_ORGANISATION_STRUCTURE
         this.showEditInfoOrganisationStructure = true ;
         this.isDisableEditOrganisationStructure = true ;

          //MANAGEMENT_LIST
          this.showEditInfoManagementList = true ;
          this.isDisableEditManagementList = true ;

           //ID_COPIES
           this.showEditInfoIdCopies = true ;
           this.isDisableEditIdCopies = true ;

            //KYC_FORM
            this.showEditInfoKycForm = true ;
            this.isDisableEditKycForm = true ;

             //WOLFSBERG_FORM
           this.showEditInfoWolfsbergForm = true ;
           this.isDisableEditWolfsbergForm = true ;

             //ONBOARDING_DOCUMENT
             this.showEditInfoOnboardingDoc = true ;
             this.isDisableEditOnboardingDoc = true ;
 

    // if(this.data.customerCompanyDocumentsReview.document.length == 0){
    //   this.showNoDocuments = true;
    //  }
    

     this.initialActiveCustomerLayoutSetup(this.data.customerCompanyDocumentsReview , "BACKOFFICE-CUSTOMERSEARCH");
  }
  }

  url: any = {};
  documentIds: any = [];
  imageId:any=[];
  acra = CORPORATE_DOCUMENT_ID_MAPPER.ACRA;
  ownerNRIC = CORPORATE_DOCUMENT_ID_MAPPER.OWNER_NRIC;
  dealerNRIC = CORPORATE_DOCUMENT_ID_MAPPER.DEALER_NRIC;
  runnerNRIC = CORPORATE_DOCUMENT_ID_MAPPER.RUNNER_NRIC;
  // 12 NEW DOCUMENTS - DONE
  incorporationCertificate = CORPORATE_DOCUMENT_ID_MAPPER.INCORPORATION_CERTIFICATE ;
  articlesAssociation = CORPORATE_DOCUMENT_ID_MAPPER.ARTICLES_ASSOCIATION;
  bankLicense = CORPORATE_DOCUMENT_ID_MAPPER.BANK_LICENSE;
  tradeLicense = CORPORATE_DOCUMENT_ID_MAPPER.TRADE_LICENSE;
  amlPolicyAndProcedures = CORPORATE_DOCUMENT_ID_MAPPER.AML_POLICY_AND_PROCEDURES;
  auditReport = CORPORATE_DOCUMENT_ID_MAPPER.AUDIT_REPORT;
  amlAuditReport = CORPORATE_DOCUMENT_ID_MAPPER.LATEST_AML_AUDIT_REPORT;
  organisationStructure = CORPORATE_DOCUMENT_ID_MAPPER.LATEST_ORGANISATION_STRUCTURE;
  managementList = CORPORATE_DOCUMENT_ID_MAPPER.MANAGEMENT_LIST;
  idCopies = CORPORATE_DOCUMENT_ID_MAPPER.ID_COPIES;
  kycForm = CORPORATE_DOCUMENT_ID_MAPPER.KYC_FORM;
  wolfsbergForm = CORPORATE_DOCUMENT_ID_MAPPER.WOLFSBERG_FORM;
  onboardingDoc = CORPORATE_DOCUMENT_ID_MAPPER.ONBOARDING_DOCUMENT;
  updateDocumentIdObject : any ;
  updateDocumentId = "" ;
  fileOwnerData : string[] = [];
  fileDealerData : string[] = [];
  fileRunnerData : string[] = [];
  fileAcraData : string[] = [];

  //12 NEW DOCUMENTS - DONE
  fileIncorporationCertData : string[] = [] ;
  fileArticlesAssociationData: string[] = [];
  fileBankLicenseData: string[] = [];
  fileTradeLicenseData: string[] = [];
  fileAmlPolicyAndProceduresData: string[] = [];
  fileAuditReportData: string[] = [];
  fileAmlAuditReportData: string[] = [];
  fileOrganisationStructureData: string[] = [];
  fileManagementListData: string[] = [];
  fileIdCopiesData: string[] = [];
  fileKycFormData: string[] = [];
  fileWolfsbergFormData: string[] = [];
  fileOnboardingDocData: string[] = [];

  extractDocument(docs: AddDocument[], id: string) {
    docs.filter(v => v.id == id)[0].documentData;
  }

//ADD DOCUMENT API CALL 
//ADD DOCUMENT API CALL 
onSelectFile(e: any, id: string, documentName: string, index: number) {
  console.log("Selected index" + index);

  //block will execute when there is a file 
  if (e.target.files) {
    if (e.target.files[0].size <= 10485760) { //10485760 bytes = 10mb  
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]); //It reads the file and once its completed,the data is converted into binary data 
      reader.onload = (event: any) => {   //after the file reading is successfully completed onLoad is triggered
           //Allowing only jpeg , png and pdf file format only for documents uploading .
          // documentData : data:image/jpeg
         // documentData : data:image/png
        // documentData : data:application/pdf
      
       //Checking whether it's a jpeg or png or pdf..   
   if(e.target.files[0].type == "image/jpeg" || e.target.files[0].type == "image/png" || e.target.files[0].type == "application/pdf"){  
    let binaryData = event.target.result; //convertion of binary data 
    let appStatus = this.applicationStatus ? this.applicationStatus : "" ;
          // block will execute when pdf is uploaded
          if (e.target.files[0].type == "application/pdf") {
            //Entry points :
            //1. Corporate > app status as NEW > upload PDF 
            //2. Backoffice > application search > add corporate > documents > upload PDF 

              let fileData = e.target.files[0] ;
              const blob = new Blob([fileData], { type: "application/pdf" });
              const blobUrl = URL.createObjectURL(blob);

            if(this.productCode == "MC" || appStatus == "NEW"){ //Entry point : Backoffice > Application Search > Add Corporate > Upload Documents
              this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                width: '1380px',
                height: '720px',
                panelClass: 'custom-modalbox',
                data: { customersearch_documentName: documentName, customersearch_documentData: event.target.result, fileBlob: blob }
              });

              
                 // block will execute (PDF)- ACRA
            if (documentName == "ACRA") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageAcra = false; //img tag
              this.showOtherFormatAcra = true;  //object tag
              this.pdfUrlAcra = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadACRA = false;
              this.showACRA = false;
              this.uploadIconACRA = false;
              this.showAcraInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.reuploadAcra = true;
              this.associateId = "";  //assoicate id empty string for ACRA
            }
            // block will execute (PDF)- INCORPORATION_CERTIFICATE
            if (documentName == "INCORPORATION_CERTIFICATE") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageIncorporationCert = false; //img tag
              this.showOtherFormatIncorporationCert = true;  //object tag
              this.pdfUrlIncorporationCert = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadIncorporationCert = false;
              this.showIncorporationCert = false;
              this.uploadIconIncorporationCert = false;
              this.showIncorporationCertInput = false; //we need to false the showIncorporationCertInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.reuploadIncorporationCert = true;
              this.associateId = "";  //assoicate id empty string for INCORPORATION_CERTIFICATE
            }
             // block will execute (PDF)- ARTICLES_ASSOCIATION
             if (documentName == "ARTICLES_ASSOCIATION") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageArticlesAssociation = false; //img tag
              this.showOtherFormatArticlesAssociation = true;  //object tag
              this.pdfUrlArticlesAssociation = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadArticlesAssociation = false;
              this.showArticlesAssociation = false;
              this.uploadIconArticlesAssociation = false;
              this.showArticlesAssociationInput = false; //we need to false the showArticlesAssociationInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.reuploadArticlesAssociation = true;
              this.associateId = "";  //assoicate id empty string for ARTICLES_ASSOCIATION
            }
             // block will execute (PDF)- BANK_LICENSE
             if (documentName == "BANK_LICENSE") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageBankLicense = false; //img tag
              this.showOtherFormatBankLicense = true;  //object tag
              this.pdfUrlBankLicense = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadBankLicense = false;
              this.showBankLicense = false;
              this.uploadIconBankLicense = false;
              this.showBankLicenseInput = false; //we need to false the showBankLicenseInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.reuploadBankLicense = true;
              this.associateId = "";  //assoicate id empty string for BANK_LICENSE
            }
             // block will execute (PDF)- TRADE_LICENSE
             if (documentName == "TRADE_LICENSE") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageTradeLicense = false; //img tag
              this.showOtherFormatTradeLicense = true;  //object tag
              this.pdfUrlTradeLicense = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadTradeLicense = false;
              this.showTradeLicense = false;
              this.uploadIconTradeLicense = false;
              this.showTradeLicenseInput = false; //we need to false the showTradeLicenseInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.reuploadTradeLicense = true;
              this.associateId = "";  //assoicate id empty string for TRADE_LICENSE
            }
             // block will execute (PDF)- AML_POLICY_AND_PROCEDURES
             if (documentName == "AML_POLICY_AND_PROCEDURES") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageAmlPolicyAndProcedures = false; //img tag
              this.showOtherFormatAmlPolicyAndProcedures = true;  //object tag
              this.pdfUrlAmlPolicyAndProcedures = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadAmlPolicyAndProcedures = false;
              this.showAmlPolicyAndProcedures = false;
              this.uploadIconAmlPolicyAndProcedures = false;
              this.showAmlPolicyAndProceduresInput = false; //we need to false the showAmlPolicyAndProceduresInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.reuploadAmlPolicyAndProcedures = true;
              this.associateId = "";  //assoicate id empty string for AML_POLICY_AND_PROCEDURES
            }
            // block will execute (PDF)- AUDIT_REPORT
            if (documentName == "AUDIT_REPORT") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageAuditReport = false; //img tag
              this.showOtherFormatAuditReport = true;  //object tag
              this.pdfUrlAuditReport = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadAuditReport = false;
              this.showAuditReport = false;
              this.uploadIconAuditReport = false;
              this.showAuditReportInput = false; //we need to false the showAuditReportInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.reuploadAuditReport = true;
              this.associateId = "";  //assoicate id empty string for AUDIT_REPORT
            }
             // block will execute (PDF)- LATEST_AML_AUDIT_REPORT
             if (documentName == "LATEST_AML_AUDIT_REPORT") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageAmlAuditReport = false; //img tag
              this.showOtherFormatAmlAuditReport = true;  //object tag
              this.pdfUrlAmlAuditReport = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadAmlAuditReport = false;
              this.showAmlAuditReport = false;
              this.uploadIconAmlAuditReport = false;
              this.showAmlAuditReportInput = false; //we need to false the showAmlAuditReportInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.reuploadAmlAuditReport = true;
              this.associateId = "";  //assoicate id empty string for LATEST_AML_AUDIT_REPORT
            }
             // block will execute (PDF)- LATEST_ORGANISATION_STRUCTURE
             if (documentName == "LATEST_ORGANISATION_STRUCTURE") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageOrganisationStructure = false; //img tag
              this.showOtherFormatOrganisationStructure = true;  //object tag
              this.pdfUrlOrganisationStructure = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadOrganisationStructure = false;
              this.showOrganisationStructure = false;
              this.uploadIconOrganisationStructure = false;
              this.showOrganisationStructureInput = false; //we need to false the showOrganisationStructureInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.reuploadOrganisationStructure = true;
              this.associateId = "";  //assoicate id empty string for LATEST_ORGANISATION_STRUCTURE
            }
             // block will execute (PDF)- MANAGEMENT_LIST
             if (documentName == "MANAGEMENT_LIST") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageManagementList = false; //img tag
              this.showOtherFormatManagementList = true;  //object tag
              this.pdfUrlManagementList = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadManagementList = false;
              this.showManagementList = false;
              this.uploadIconManagementList = false;
              this.showManagementListInput = false; //we need to false the showManagementListInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.reuploadManagementList = true;
              this.associateId = "";  //assoicate id empty string for MANAGEMENT_LIST
            }
             // block will execute (PDF)- ID_COPIES
             if (documentName == "ID_COPIES") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageIdCopies = false; //img tag
              this.showOtherFormatIdCopies = true;  //object tag
              this.pdfUrlIdCopies = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadIdCopies = false;
              this.showIdCopies = false;
              this.uploadIconIdCopies = false;
              this.showIdCopiesInput = false; //we need to false the showIdCopiesInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.reuploadIdCopies = true;
              this.associateId = "";  //assoicate id empty string for ID_COPIES
            }
             // block will execute (PDF)- KYC_FORM
             if (documentName == "KYC_FORM") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageKycForm = false; //img tag
              this.showOtherFormatKycForm = true;  //object tag
              this.pdfUrlKycForm = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadKycForm = false;
              this.showKycForm = false;
              this.uploadIconKycForm = false;
              this.showKycFormInput = false; //we need to false the showKycFormInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.reuploadKycForm = true;
              this.associateId = "";  //assoicate id empty string for KYC_FORM
            }
            // block will execute (PDF)- WOLFSBERG_FORM
            if (documentName == "WOLFSBERG_FORM") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageWolfsbergForm = false; //img tag
              this.showOtherFormatWolfsbergForm = true;  //object tag
              this.pdfUrlWolfsbergForm = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadWolfsbergForm = false;
              this.showWolfsbergForm = false;
              this.uploadIconWolfsbergForm = false;
              this.showWolfsbergFormInput = false; //we need to false the showWolfsbergFormInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.reuploadWolfsbergForm = true;
              this.associateId = "";  //assoicate id empty string for WOLFSBERG_FORM
            }
             // block will execute (PDF)- ONBOARDING DOC
             if (documentName == "ONBOARDING_DOCUMENT") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageOnboardingDoc = false; //img tag
              this.showOtherFormatOnboardingDoc = true;  //object tag
              this.pdfUrlOnboardingDoc = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadOnboardingDoc = false;
              this.showOnboardingDoc = false;
              this.uploadIconOnboardingDoc = false;
              this.showOnboardingDocInput = false; //we need to false the showOnboardingDocInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.reuploadOnboardingDoc = true;
              this.associateId = "";  //assoicate id empty string for ONBOARDING_DOCUMENT
            }
            //block will execute (PDF) - OWNER NRIC
            if (documentName == "OWNER_NRIC") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageOwner[index] = false; //img tag
              this.showOtherFormatOwner[index] = true;  //object tag
              this.pdfUrlOwner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadOWNER[index] = false;
              this.showOWNER[index] = false;
              this.showOwnerInput[index] = false; //we need to false the showOwnerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.uploadIconOWNER[index] = false;
              this.reuploadOwner[index] = true;
              const selectedOwner = this.owners[index];// Retrieve the associateId based on the index
              this.associateId = selectedOwner.associateId;
              console.log(this.associateId);
            }
            //block will execute (PDF) - DEALER NRIC
            if (documentName == "DEALER_NRIC") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageDealer[index] = false; //img tag
              this.showOtherFormatDealer[index] = true;  //object tag
              this.pdfUrlDealer[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadDEALER[index] = false;
              this.showDEALER[index] = false;
              this.showDealerInput[index] = false; //we need to false the showDealerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.uploadIconDEALER[index] = false;
              this.reuploadDealer[index] = true;
              const selectedDealer = this.dealers[index]; // Retrieve the associateId based on the index
              this.associateId = selectedDealer.associateId;
              console.log(this.associateId);
            }
            //block will execute (PDF) - RUNNER NRIC
            if (documentName == "RUNNER_NRIC") {
              this.callApplicationInquiryService("NEW") ;
              this.showImageRunner[index] = false; //img tag
              this.showOtherFormatRunner[index] = true;  //object tag
              this.pdfUrlRunner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadRUNNER[index] = false;
              this.showRUNNER[index] = false;
              this.showRunnerInput[index] = false; //we need to false the showRunnerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.uploadIconRUNNER[index] = false;
              this.reuploadRunner[index] = true;
              const selectedRunner = this.runners[index];// Retrieve the associateId based on the index
              this.associateId = selectedRunner.associateId;
              console.log(this.associateId);
            }

            }
            //Entry point :Backoffice -> customer search -> view company documents - uploading PDF
          else if(e.target.files[0].type == "application/pdf" && this.customerFlag == true ){
            this.callCustomerInquiryApi(id); //passing dynamic id in customerInquiry API

            let fileData = e.target.files[0] ;
              const blob = new Blob([fileData], { type: "application/pdf" });
              const blobUrl = URL.createObjectURL(blob);

            this.dialogRef.open(PreviewDocumentComponent, {
              width: '1300px',
              height: '650px',
              panelClass: 'custom-modalbox',
              data: { customersearch_documentName: documentName, customersearch_documentData: event.target.result, fileBlob: blob  }
            });


            if (documentName == "ACRA") {
              this.noAcraDocument = false ;
              this.showImageAcra = false; //img tag
              this.showOtherFormatAcra = true;  //object tag
              this.pdfUrlAcra = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
              this.loadACRA = false;
              this.showACRA = false;
              this.disableAcraInput = true;
              this.showAcraInput = false ;
              this.view_ACRA = false;
              this.uploadIconACRA = false;
              this.associateId = "";
            }
            // New 12 documents
            // block will execute (PDF) - INCORPORATION_CERTIFICATE
            if (documentName == "INCORPORATION_CERTIFICATE") {
              this.noIncorporationCertDocument = false ;
              this.showImageIncorporationCert = false; //img tag
              this.showOtherFormatIncorporationCert = true;  //object tag
              this.pdfUrlIncorporationCert = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
              this.loadIncorporationCert = false;
              this.showIncorporationCert = false;
              this.disableIncorporationCertInput = true;
              this.showIncorporationCertInput = false ;
              this.uploadIconIncorporationCert = false;
              this.associateId = "";
            }
             // block will execute (PDF) - ARTICLES_ASSOCIATION
             if (documentName == "ARTICLES_ASSOCIATION") {
              this.noArticlesAssociationDocument = false ;
              this.showImageArticlesAssociation = false; //img tag
              this.showOtherFormatArticlesAssociation = true;  //object tag
              this.pdfUrlArticlesAssociation = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
              this.loadArticlesAssociation = false;
              this.showArticlesAssociation = false;
              this.disableArticlesAssociationInput = true;
              this.showArticlesAssociationInput = false ;
              this.uploadIconArticlesAssociation = false;
              this.associateId = "";
            }
            // block will execute (PDF) - BANK_LICENSE
            if (documentName == "BANK_LICENSE") {
              this.noBankLicenseDocument = false ;
              this.showImageBankLicense = false; //img tag
              this.showOtherFormatBankLicense = true;  //object tag
              this.pdfUrlBankLicense = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
              this.loadBankLicense = false;
              this.showBankLicense = false;
              this.disableBankLicenseInput = true;
              this.showBankLicenseInput = false ;
              this.uploadIconBankLicense = false;
              this.associateId = "";
            }
             // block will execute (PDF) - TRADE_LICENSE
             if (documentName == "TRADE_LICENSE") {
              this.noTradeLicenseDocument = false ;
              this.showImageTradeLicense = false; //img tag
              this.showOtherFormatTradeLicense = true;  //object tag
              this.pdfUrlTradeLicense = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
              this.loadTradeLicense = false;
              this.showTradeLicense = false;
              this.disableTradeLicenseInput = true;
              this.showTradeLicenseInput = false ;
              this.uploadIconTradeLicense = false;
              this.associateId = "";
            }
             // block will execute (PDF) - AML_POLICY_AND_PROCEDURES
             if (documentName == "AML_POLICY_AND_PROCEDURES") {
              this.noAmlPolicyAndProceduresDocument = false ;
              this.showImageAmlPolicyAndProcedures = false; //img tag
              this.showOtherFormatAmlPolicyAndProcedures = true;  //object tag
              this.pdfUrlAmlPolicyAndProcedures = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
              this.loadAmlPolicyAndProcedures = false;
              this.showAmlPolicyAndProcedures = false;
              this.disableAmlPolicyAndProceduresInput = true;
              this.showAmlPolicyAndProceduresInput = false ;
              this.uploadIconAmlPolicyAndProcedures = false;
              this.associateId = "";
            }
            // block will execute (PDF) - AUDIT_REPORT
            if (documentName == "AUDIT_REPORT") {
              this.noAuditReportDocument = false ;
              this.showImageAuditReport = false; //img tag
              this.showOtherFormatAuditReport = true;  //object tag
              this.pdfUrlAuditReport = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
              this.loadAuditReport = false;
              this.showAuditReport = false;
              this.disableAuditReportInput = true;
              this.showAuditReportInput = false ;
              this.uploadIconAuditReport = false;
              this.associateId = "";
            }
             // block will execute (PDF) - LATEST_AML_AUDIT_REPORT
             if (documentName == "LATEST_AML_AUDIT_REPORT") {
              this.noAmlAuditReportDocument = false ;
              this.showImageAmlAuditReport = false; //img tag
              this.showOtherFormatAmlAuditReport = true;  //object tag
              this.pdfUrlAmlAuditReport = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
              this.loadAmlAuditReport = false;
              this.showAmlAuditReport = false;
              this.disableAmlAuditReportInput = true;
              this.showAmlAuditReportInput = false ;
              this.uploadIconAmlAuditReport = false;
              this.associateId = "";
            }
             // block will execute (PDF) - LATEST_ORGANISATION_STRUCTURE
             if (documentName == "LATEST_ORGANISATION_STRUCTURE") {
              this.noOrganisationStructureDocument = false ;
              this.showImageOrganisationStructure = false; //img tag
              this.showOtherFormatOrganisationStructure = true;  //object tag
              this.pdfUrlOrganisationStructure = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
              this.loadOrganisationStructure = false;
              this.showOrganisationStructure = false;
              this.disableOrganisationStructureInput = true;
              this.showOrganisationStructureInput = false ;
              this.uploadIconOrganisationStructure = false;
              this.associateId = "";
            }
            // block will execute (PDF) - MANAGEMENT_LIST
            if (documentName == "MANAGEMENT_LIST") {
              this.noManagementListDocument = false ;
              this.showImageManagementList = false; //img tag
              this.showOtherFormatManagementList = true;  //object tag
              this.pdfUrlManagementList = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
              this.loadManagementList = false;
              this.showManagementList = false;
              this.disableManagementListInput = true;
              this.showManagementListInput = false ;
              this.uploadIconManagementList = false;
              this.associateId = "";
            }
              // block will execute (PDF) - ID_COPIES
              if (documentName == "ID_COPIES") {
                this.noIdCopiesDocument = false ;
                this.showImageIdCopies = false; //img tag
                this.showOtherFormatIdCopies = true;  //object tag
                this.pdfUrlIdCopies = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
                this.loadIdCopies = false;
                this.showIdCopies = false;
                this.disableIdCopiesInput = true;
                this.showIdCopiesInput = false ;
                this.uploadIconIdCopies = false;
                this.associateId = "";
              }
              // block will execute (PDF) - KYC_FORM
              if (documentName == "KYC_FORM") {
                this.noKycFormDocument = false ;
                this.showImageKycForm = false; //img tag
                this.showOtherFormatKycForm = true;  //object tag
                this.pdfUrlKycForm = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
                this.loadKycForm = false;
                this.showKycForm = false;
                this.disableKycFormInput = true;
                this.showKycFormInput = false ;
                this.uploadIconKycForm = false;
                this.associateId = "";
              }
               // block will execute (PDF) - WOLFSBERG_FORM
               if (documentName == "WOLFSBERG_FORM") {
                this.noWolfsbergFormDocument = false ;
                this.showImageWolfsbergForm = false; //img tag
                this.showOtherFormatWolfsbergForm = true;  //object tag
                this.pdfUrlWolfsbergForm = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
                this.loadWolfsbergForm = false;
                this.showWolfsbergForm = false;
                this.disableWolfsbergFormInput = true;
                this.showWolfsbergFormInput = false ;
                this.uploadIconWolfsbergForm = false;
                this.associateId = "";
              }
              // block will execute (PDF) - ONBOARDING_DOCUMENT
              if (documentName == "ONBOARDING_DOCUMENT") {
                this.noOnboardingDocument = false ;
                this.showImageOnboardingDoc = false; //img tag
                this.showOtherFormatOnboardingDoc = true;  //object tag
                this.pdfUrlOnboardingDoc = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
                this.loadOnboardingDoc = false;
                this.showOnboardingDoc = false;
                this.disableOnboardingDocInput = true;
                this.showOnboardingDocInput = false ;
                this.uploadIconOnboardingDoc = false;
                this.associateId = "";
              }
            if (documentName == "OWNER_NRIC") {
              this.noOwnerDocument[index] = false ;
              this.showImageOwner[index] = false; //img tag
              this.showOtherFormatOwner[index] = true;  //object tag
              this.pdfUrlOwner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
              this.loadOWNER[index] = false;
              this.showOWNER[index] = false;
              this.disableOwnerInput[index] = true;
              this.showOwnerInput[index] = false ;
              this.view_OWNER = false;
              this.uploadIconOWNER[index] = false;
              const selectedOwner = this.owners[index];// Retrieve the associateId based on the index
              this.associateId = selectedOwner.associateId;
              console.log(this.associateId);
            }
            if (documentName == "DEALER_NRIC") {
               this.noDealerDocument[index] = false ;
              this.showImageDealer[index] = false; //img tag
              this.showOtherFormatDealer[index] = true;  //object tag
              this.pdfUrlDealer[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
              this.loadDEALER[index] = false;
              this.showDEALER[index] = false;
              this.disableDealerInput[index] = true;
              this.showDealerInput[index] = false ;
              this.view_DEALER = false;
              this.uploadIconDEALER[index] = false;
              const selectedDealer = this.dealers[index];  // Retrieve the associateId based on the index
              this.associateId = selectedDealer.associateId;
              console.log(this.associateId);
            }
            if (documentName == "RUNNER_NRIC") {
              this.noRunnerDocument[index] = false ;
              this.showImageRunner[index] = false; //img tag
              this.showOtherFormatRunner[index] = true;  //object tag
              this.pdfUrlRunner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl); 
              this.loadRUNNER[index] = false;
              this.showRUNNER[index] = false;
              this.disableRunnerInput[index] = true;
              this.showRunnerInput[index] = false ;
              this.view_RUNNER = false;
              this.uploadIconRUNNER[index] = false;
              const selectedRunner = this.runners[index]; // Retrieve the associateId based on the index
              this.associateId = selectedRunner.associateId;
              console.log(this.associateId);
            }

          }
         
          }
            //Jpeg and Png checking..
       if(e.target.files[0].type == "image/jpeg" || e.target.files[0].type == "image/png"){
        if(this.productCode == "MC" || this.customerFlag == true || appStatus == "NEW"){
             //block will execute (img/png)- ACRA
            if (id == "1005") {
              this.fileAcraData[index] = binaryData; 
              this.showOtherFormatAcra = false;  //object tag
              this.showImageAcra = true; //img tag
              this.uploadIconACRA = false;
              this.showAcraInput = true;
              if(this.customerFlag == true){
                this.showACRA = false ;
                this.noAcraDocument = false ;
                this.disableAcraInput = true; //Layout is not clickable
              }
              else{
                this.disableAcraInput = false;
              }
              this.reuploadAcra = false;
              this.associateId = ""; //assoicate id empty string for ACRA
            }
            //block will execute (img/png)- Owner Nric
            if (id == "1006") {
              this.fileOwnerData[index] = binaryData;
              this.uploadIconOWNER[index] = false;
              this.showOwnerInput[index] = true;
              if(this.customerFlag == true){
                this.showOWNER[index] = false ;
                this.noOwnerDocument[index] = false ;
                this.disableOwnerInput[index] = true;
              }
              else{
                this.disableOwnerInput[index] = false;
              }
              this.showOtherFormatOwner[index] = false;
              this.showImageOwner[index] = true;
              this.reuploadOwner[index] = false;
              const selectedOwner = this.owners[index];// Retrieve the associateId based on the index
              this.associateId = selectedOwner.associateId;
              console.log(this.associateId);
            }
            //block will execute (img/png)- Dealer Nric
            if (id == "1007") {
              this.fileDealerData[index]=binaryData; 
              this.uploadIconDEALER[index] = false;
              this.showDealerInput[index] = true;
              if(this.customerFlag == true){
                this.showDEALER[index] = false ;
                this.noDealerDocument[index] = false ;
                this.disableDealerInput[index] = true;
              }
              else{
                this.disableDealerInput[index] = false;
              }
              this.showOtherFormatDealer[index] = false;
              this.showImageDealer[index] = true;
              this.reuploadDealer[index] = false;
              const selectedDealer = this.dealers[index];  // Retrieve the associateId based on the index
              this.associateId = selectedDealer.associateId;
              console.log(this.associateId);
            }
            // block will execute (img/png)- Runner Nric
            if (id == "1008") {
              this.fileRunnerData[index] = binaryData;
              this.uploadIconRUNNER[index] = false;
              this.showRunnerInput[index] = true;
              if(this.customerFlag == true){
                this.showRUNNER[index] = false ;
                this.noRunnerDocument[index] = false ;
                this.disableRunnerInput[index] = true;
              }
              else{
                this.disableRunnerInput[index] = false;
              }
              this.showOtherFormatRunner[index] = false;
              this.showImageRunner[index] = true;
              this.reuploadRunner[index] = false;
              const selectedRunner = this.runners[index]; // Retrieve the associateId based on the index
              this.associateId = selectedRunner.associateId;
              console.log(this.associateId);
            }
             //block will execute (img/png)- INCORPORATION_CERTIFICATE
             if (id == "1009") {
              this.fileIncorporationCertData[index] = binaryData; 
              this.showOtherFormatIncorporationCert = false;  //object tag
              this.showImageIncorporationCert = true; //img tag
              this.uploadIconIncorporationCert = false;
              this.showIncorporationCertInput = true;
              if(this.customerFlag == true){
                this.showIncorporationCert = false ;
                this.noIncorporationCertDocument = false ;
                this.disableIncorporationCertInput = true; //Layout is not clickable
              }
              else{
                this.disableIncorporationCertInput = false;
              }
              this.reuploadIncorporationCert = false;
              this.associateId = ""; //assoicate id empty string for ACRA
            }
             //block will execute (img/png)- ARTICLES_ASSOCIATION
             if (id == "1010") {
              this.fileArticlesAssociationData[index] = binaryData; 
              this.showOtherFormatArticlesAssociation = false;  //object tag
              this.showImageArticlesAssociation = true; //img tag
              this.uploadIconArticlesAssociation = false;
              this.showArticlesAssociationInput = true;
              if(this.customerFlag == true){
                this.showArticlesAssociation = false ;
                this.noArticlesAssociationDocument = false ;
                this.disableArticlesAssociationInput = true; //Layout is not clickable
              }
              else{
                this.disableArticlesAssociationInput = false;
              }
              this.reuploadArticlesAssociation = false;
              this.associateId = ""; //assoicate id empty string for ACRA
            }
             //block will execute (img/png)- BANK_LICENSE
             if (id == "1011") {
              this.fileBankLicenseData[index] = binaryData; 
              this.showOtherFormatBankLicense = false;  //object tag
              this.showImageBankLicense = true; //img tag
              this.uploadIconBankLicense = false;
              this.showBankLicenseInput = true;
              if(this.customerFlag == true){
                this.showBankLicense = false ;
                this.noBankLicenseDocument = false ;
                this.disableBankLicenseInput = true; //Layout is not clickable
              }
              else{
                this.disableBankLicenseInput = false;
              }
              this.reuploadBankLicense = false;
              this.associateId = ""; //assoicate id empty string for ACRA
            }
             //block will execute (img/png)- TRADE_LICENSE
             if (id == "1012") {
              this.fileTradeLicenseData[index] = binaryData; 
              this.showOtherFormatTradeLicense = false;  //object tag
              this.showImageTradeLicense = true; //img tag
              this.uploadIconTradeLicense = false;
              this.showTradeLicenseInput = true;
              if(this.customerFlag == true){
                this.showTradeLicense = false ;
                this.noTradeLicenseDocument = false ;
                this.disableTradeLicenseInput = true; //Layout is not clickable
              }
              else{
                this.disableTradeLicenseInput = false;
              }
              this.reuploadTradeLicense = false;
              this.associateId = ""; //assoicate id empty string for ACRA
            }
            //block will execute (img/png)- AML_POLICY_AND_PROCEDURES
            if (id == "1013") {
              this.fileAmlPolicyAndProceduresData[index] = binaryData; 
              this.showOtherFormatAmlPolicyAndProcedures = false;  //object tag
              this.showImageAmlPolicyAndProcedures = true; //img tag
              this.uploadIconAmlPolicyAndProcedures = false;
              this.showAmlPolicyAndProceduresInput = true;
              if(this.customerFlag == true){
                this.showAmlPolicyAndProcedures = false ;
                this.noAmlPolicyAndProceduresDocument = false ;
                this.disableAmlPolicyAndProceduresInput = true; //Layout is not clickable
              }
              else{
                this.disableAmlPolicyAndProceduresInput = false;
              }
              this.reuploadAmlPolicyAndProcedures = false;
              this.associateId = ""; //assoicate id empty string for ACRA
            }
             //block will execute (img/png)- AUDIT_REPORT
             if (id == "1014") {
              this.fileAuditReportData[index] = binaryData; 
              this.showOtherFormatAuditReport = false;  //object tag
              this.showImageAuditReport = true; //img tag
              this.uploadIconAuditReport = false;
              this.showAuditReportInput = true;
              if(this.customerFlag == true){
                this.showAuditReport = false ;
                this.noAuditReportDocument = false ;
                this.disableAuditReportInput = true; //Layout is not clickable
              }
              else{
                this.disableAuditReportInput = false;
              }
              this.reuploadAuditReport = false;
              this.associateId = ""; //assoicate id empty string for ACRA
            }
             //block will execute (img/png)- LATEST_AML_AUDIT_REPORT
             if (id == "1015") {
              this.fileAmlAuditReportData[index] = binaryData; 
              this.showOtherFormatAmlAuditReport = false;  //object tag
              this.showImageAmlAuditReport = true; //img tag
              this.uploadIconAmlAuditReport = false;
              this.showAmlAuditReportInput = true;
              if(this.customerFlag == true){
                this.showAmlAuditReport = false ;
                this.noAmlAuditReportDocument = false ;
                this.disableAmlAuditReportInput = true; //Layout is not clickable
              }
              else{
                this.disableAmlAuditReportInput = false;
              }
              this.reuploadAmlAuditReport = false;
              this.associateId = ""; //assoicate id empty string for ACRA
            }
             //block will execute (img/png)- LATEST_ORGANISATION_STRUCTURE
             if (id == "1016") {
              this.fileOrganisationStructureData[index] = binaryData; 
              this.showOtherFormatOrganisationStructure = false;  //object tag
              this.showImageOrganisationStructure = true; //img tag
              this.uploadIconOrganisationStructure = false;
              this.showOrganisationStructureInput = true;
              if(this.customerFlag == true){
                this.showOrganisationStructure = false ;
                this.noOrganisationStructureDocument = false ;
                this.disableOrganisationStructureInput = true; //Layout is not clickable
              }
              else{
                this.disableOrganisationStructureInput = false;
              }
              this.reuploadOrganisationStructure = false;
              this.associateId = ""; //assoicate id empty string for ACRA
            }
              //block will execute (img/png)- MANAGEMENT_LIST
              if (id == "1017") {
                this.fileManagementListData[index] = binaryData; 
                this.showOtherFormatManagementList = false;  //object tag
                this.showImageManagementList = true; //img tag
                this.uploadIconManagementList = false;
                this.showManagementListInput = true;
                if(this.customerFlag == true){
                  this.showManagementList = false ;
                  this.noManagementListDocument = false ;
                  this.disableManagementListInput = true; //Layout is not clickable
                }
                else{
                  this.disableManagementListInput = false;
                }
                this.reuploadManagementList = false;
                this.associateId = ""; //assoicate id empty string for ACRA
              }
               //block will execute (img/png)- ID_COPIES
               if (id == "1018") {
                this.fileIdCopiesData[index] = binaryData; 
                this.showOtherFormatIdCopies = false;  //object tag
                this.showImageIdCopies = true; //img tag
                this.uploadIconIdCopies = false;
                this.showIdCopiesInput = true;
                if(this.customerFlag == true){
                  this.showIdCopies = false ;
                  this.noIdCopiesDocument = false ;
                  this.disableIdCopiesInput = true; //Layout is not clickable
                }
                else{
                  this.disableIdCopiesInput = false;
                }
                this.reuploadIdCopies = false;
                this.associateId = ""; //assoicate id empty string for ACRA
              }
               //block will execute (img/png)- KYC_FORM
               if (id == "1019") {
                this.fileKycFormData[index] = binaryData; 
                this.showOtherFormatKycForm = false;  //object tag
                this.showImageKycForm = true; //img tag
                this.uploadIconKycForm = false;
                this.showKycFormInput = true;
                if(this.customerFlag == true){
                  this.showKycForm = false ;
                  this.noKycFormDocument = false ;
                  this.disableKycFormInput = true; //Layout is not clickable
                }
                else{
                  this.disableKycFormInput = false;
                }
                this.reuploadKycForm = false;
                this.associateId = ""; //assoicate id empty string for ACRA
              }
               //block will execute (img/png)- WOLFSBERG_FORM
               if (id == "1020") {
                this.fileWolfsbergFormData[index] = binaryData; 
                this.showOtherFormatWolfsbergForm = false;  //object tag
                this.showImageWolfsbergForm = true; //img tag
                this.uploadIconWolfsbergForm = false;
                this.showWolfsbergFormInput = true;
                if(this.customerFlag == true){
                  this.showWolfsbergForm = false ;
                  this.noWolfsbergFormDocument = false ;
                  this.disableWolfsbergFormInput = true; //Layout is not clickable
                }
                else{
                  this.disableWolfsbergFormInput = false;
                }
                this.reuploadWolfsbergForm = false;
                this.associateId = ""; //assoicate id empty string for ACRA
              }
               //block will execute (img/png)- ONBOARDING_DOCUMENT
               if (id == "1021") {
                this.fileOnboardingDocData[index] = binaryData; 
                this.showOtherFormatOnboardingDoc = false;  //object tag
                this.showImageOnboardingDoc = true; //img tag
                this.uploadIconOnboardingDoc = false;
                this.showOnboardingDocInput = true;
                if(this.customerFlag == true){
                  this.showOnboardingDoc = false ;
                  this.noOnboardingDocument = false ;
                  this.disableOnboardingDocInput = true; //Layout is not clickable
                }
                else{
                  this.disableOnboardingDocInput = false;
                }
                this.reuploadOnboardingDoc = false;
                this.associateId = ""; //assoicate id empty string for ACRA
              }
          }
          else{ //Corporate --> Add Document..
            this.fileAcraData[index] = binaryData; 

          }
          }

          if(this.customerFlag == true){
            console.log(this.customerFlag) ;
            setTimeout(() => {
            let docId : string = "" ;
            let document : any;
            // if(this.updateDocumentIdObject != undefined){ //When a user uploads existing PDF file, it comes inside this condition (we call customerInquiry API to retrieve the documentID)
            //   docId = this.updateDocumentId ;
            // }
          //  else{ //When the user uploads JPG or PNG or PDF --> we dont call customerInquiry API for this scenario, only for PDF
              document =  this.data.customerCompanyDocumentsReview.document.find((doc:any) => doc.docTypeId == id) ;
              docId = document?.docId ? document.docId : "" ;

              if(this.acraDocObj.length == 1 && documentName == "ACRA"){
                docId =  this.acraDocObj[0] ? this.acraDocObj[0].docId : "" ;
              }
              // NEW 12 DOCUMENTS
              else if(this.incorporationCertDocObj.length == 1 && documentName == "INCORPORATION_CERTIFICATE"){
                docId =  this.incorporationCertDocObj[0] ? this.incorporationCertDocObj[0].docId : "" ;
              }
              else if(this.articlesAssociationDocObj.length == 1 && documentName == "ARTICLES_ASSOCIATION"){
                docId =  this.articlesAssociationDocObj[0] ? this.articlesAssociationDocObj[0].docId : "" ;
              }
              else if(this.bankLicenseDocObj.length == 1 && documentName == "BANK_LICENSE"){
                docId =  this.bankLicenseDocObj[0] ? this.bankLicenseDocObj[0].docId : "" ;
              }
              else if(this.tradeLicenseDocObj.length == 1 && documentName == "TRADE_LICENSE"){
                docId =  this.tradeLicenseDocObj[0] ? this.tradeLicenseDocObj[0].docId : "" ;
              }
              else if(this.amlPolicyAndProceduresDocObj.length == 1 && documentName == "AML_POLICY_AND_PROCEDURES"){
                docId =  this.amlPolicyAndProceduresDocObj[0] ? this.amlPolicyAndProceduresDocObj[0].docId : "" ;
              }
              else if(this.auditReportDocObj.length == 1 && documentName == "AUDIT_REPORT"){
                docId =  this.auditReportDocObj[0] ? this.auditReportDocObj[0].docId : "" ;
              }
              else if(this.amlAuditReportDocObj.length == 1 && documentName == "LATEST_AML_AUDIT_REPORT"){
                docId =  this.amlAuditReportDocObj[0] ? this.amlAuditReportDocObj[0].docId : "" ;
              }
              else if(this.organisationStructureDocObj.length == 1 && documentName == "LATEST_ORGANISATION_STRUCTURE"){
                docId =  this.organisationStructureDocObj[0] ? this.organisationStructureDocObj[0].docId : "" ;
              }
              else if(this.managementListDocObj.length == 1 && documentName == "MANAGEMENT_LIST"){
                docId =  this.managementListDocObj[0] ? this.managementListDocObj[0].docId : "" ;
              }
              else if(this.idCopiesDocObj.length == 1 && documentName == "ID_COPIES"){
                docId =  this.idCopiesDocObj[0] ? this.idCopiesDocObj[0].docId : "" ;
              }
              else if(this.kycFormDocObj.length == 1 && documentName == "KYC_FORM"){
                docId =  this.kycFormDocObj[0] ? this.kycFormDocObj[0].docId : "" ;
              }
              else if(this.wolfsbergFormDocObj.length == 1 && documentName == "WOLFSBERG_FORM"){
                docId =  this.wolfsbergFormDocObj[0] ? this.wolfsbergFormDocObj[0].docId : "" ;
              }
              else if(this.onboardingDocObj.length == 1 && documentName == "ONBOARDING_DOCUMENT"){
                docId =  this.onboardingDocObj[0] ? this.onboardingDocObj[0].docId : "" ;
              }
              else if(documentName == "OWNER_NRIC" && this.combinedOwnerData.length >= 1){
                let getDocId = this.combinedOwnerData.filter(v => v.ownerNodeIndex == index);
                docId = getDocId[0] ? getDocId[0].documentId : "";
              }
              else if(documentName == "DEALER_NRIC" && this.combinedDealerData.length >= 1){
                let getDocId = this.combinedDealerData.filter(v => v.dealerNodeIndex == index);
                docId = getDocId[0] ? getDocId[0].documentId : "";
              }
              else if(documentName == "RUNNER_NRIC" && this.combinedRunnerData.length >= 1){
                let getDocId = this.combinedRunnerData.filter(v => v.runnerNodeIndex == index);
                docId = getDocId[0] ? getDocId[0].documentId : "";
              }
          //  }
            console.log(docId) ;
            let updateCustomerDocument: DocumentUpdateCustomer =  _.cloneDeep(this.updateCustDocument(id,documentName,binaryData,docId));
          //service call  
          this.documentService.updateCorporateCustomerDocument(_.cloneDeep(updateCustomerDocument),this.customerId).subscribe
            (data => {
              this.submitted = true;
              this.documentIds.push(data.documentId);
              if(documentName == "ACRA"){
                this.acraDocObj.pop();
                let acraObj = {
                  docId : data.documentId,
                  documentName: documentName
                }
                this.acraDocObj.push(acraObj);
              }
              //NEW 12 DOCUMENTS
              if(documentName == "INCORPORATION_CERTIFICATE"){
                this.incorporationCertDocObj.pop();
                let incorporationCertObj = {
                  docId : data.documentId,
                  documentName: documentName
                }
                this.incorporationCertDocObj.push(incorporationCertObj);
              }
              if(documentName == "ARTICLES_ASSOCIATION"){
                this.articlesAssociationDocObj.pop();
                let articlesAssociationObj = {
                  docId : data.documentId,
                  documentName: documentName
                }
                this.articlesAssociationDocObj.push(articlesAssociationObj);
              }
              if(documentName == "BANK_LICENSE"){
                this.bankLicenseDocObj.pop();
                let bankLicenseObj = {
                  docId : data.documentId,
                  documentName: documentName
                }
                this.bankLicenseDocObj.push(bankLicenseObj);
              }
              if(documentName == "TRADE_LICENSE"){
                this.tradeLicenseDocObj.pop();
                let tradeLicenseObj = {
                  docId : data.documentId,
                  documentName: documentName
                }
                this.tradeLicenseDocObj.push(tradeLicenseObj);
              }
              if(documentName == "AML_POLICY_AND_PROCEDURES"){
                this.amlPolicyAndProceduresDocObj.pop();
                let amlPolicyAndProceduresObj = {
                  docId : data.documentId,
                  documentName: documentName
                }
                this.amlPolicyAndProceduresDocObj.push(amlPolicyAndProceduresObj);
              }
              if(documentName == "AUDIT_REPORT"){
                this.auditReportDocObj.pop();
                let auditReportDocObj = {
                  docId : data.documentId,
                  documentName: documentName
                }
                this.auditReportDocObj.push(auditReportDocObj);
              }
              if(documentName == "LATEST_AML_AUDIT_REPORT"){
                this.amlAuditReportDocObj.pop();
                let amlAuditReportObj = {
                  docId : data.documentId,
                  documentName: documentName
                }
                this.amlAuditReportDocObj.push(amlAuditReportObj);
              }
              if(documentName == "LATEST_ORGANISATION_STRUCTURE"){
                this.organisationStructureDocObj.pop();
                let organisationStructureObj = {
                  docId : data.documentId,
                  documentName: documentName
                }
                this.organisationStructureDocObj.push(organisationStructureObj);
              }
              if(documentName == "MANAGEMENT_LIST"){
                this.managementListDocObj.pop();
                let managementListObj = {
                  docId : data.documentId,
                  documentName: documentName
                }
                this.managementListDocObj.push(managementListObj);
              }
              if(documentName == "ID_COPIES"){
                this.idCopiesDocObj.pop();
                let idCopiesObj = {
                  docId : data.documentId,
                  documentName: documentName
                }
                this.idCopiesDocObj.push(idCopiesObj);
              }
              if(documentName == "KYC_FORM"){
                this.kycFormDocObj.pop();
                let kycFormObj = {
                  docId : data.documentId,
                  documentName: documentName
                }
                this.kycFormDocObj.push(kycFormObj);
              }
              if(documentName == "WOLFSBERG_FORM"){
                this.wolfsbergFormDocObj.pop();
                let wolfsbergFormObj = {
                  docId : data.documentId,
                  documentName: documentName
                }
                this.wolfsbergFormDocObj.push(wolfsbergFormObj);
              }
              if(documentName == "ONBOARDING_DOCUMENT"){
                this.onboardingDocObj.pop();
                let onboardingDocumentObj = {
                  docId : data.documentId,
                  documentName: documentName
                }
                this.onboardingDocObj.push(onboardingDocumentObj);
              }
              //-----------------------------------------------
               //Pushing latest document id's when add document service is success . 
            if(documentName == "OWNER_NRIC"){
              const combinedOwnerObj = {
                documentId: data.documentId,
                documentName: documentName,
                ownerNodeIndex: index // Index of ownerNode
              };
              this.combinedOwnerData.push(combinedOwnerObj);
            }
            if(documentName == "RUNNER_NRIC"){
              const combinedRunnerObj = {
                documentId: data.documentId,
                documentName: documentName,
                runnerNodeIndex: index // Index of runner node
              };
              this.combinedRunnerData.push(combinedRunnerObj);
            }
            if(documentName == "DEALER_NRIC"){
              const combinedDealerObj = {
                documentId: data.documentId,
                documentName: documentName,
                dealerNodeIndex: index // Index of dealer node
              };
              this.combinedDealerData.push(combinedDealerObj);
            }
            //---------------------------------------------
           
            this._snackBar.open("Document has been uploaded successfully!", "Ok",{
              duration: 3000,
              panelClass: "green-notification-snackbar"
            });
          
            },
          //error handling Completed on 06-07-2023 - <DN>
     (error:any)=>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    });
  
  }, 400);
  
}
else{
          let newDocument: CorporateAddDocument = _.cloneDeep(this.addDocuments(id,binaryData));
          //service call 
          this.documentService.updateCorporateDocument(_.cloneDeep(newDocument)).subscribe((data: any) => {
            console.log("You submitted Document Sucessfully");
            this.imageId.push(data.imageId)
            this.documentIds.push(data.documentId)

             if(documentName == "ACRA"){
                this.acraDocObj.pop();
                let acraObj = {
                  docId : data.imageId,
                  documentName: documentName
                }
                this.acraDocObj.push(acraObj);
              }
              //NEW 12 DOCUMENTS
              if(documentName == "INCORPORATION_CERTIFICATE"){
                this.incorporationCertDocObj.pop();
                let incorporationCertObj = {
                  docId : data.imageId,
                  documentName: documentName
                }
                this.incorporationCertDocObj.push(incorporationCertObj);
              }
              if(documentName == "ARTICLES_ASSOCIATION"){
                this.articlesAssociationDocObj.pop();
                let articlesAssociationObj = {
                  docId : data.imageId,
                  documentName: documentName
                }
                this.articlesAssociationDocObj.push(articlesAssociationObj);
              }
              if(documentName == "BANK_LICENSE"){
                this.bankLicenseDocObj.pop();
                let bankLicenseObj = {
                  docId : data.imageId,
                  documentName: documentName
                }
                this.bankLicenseDocObj.push(bankLicenseObj);
              }
              if(documentName == "TRADE_LICENSE"){
                this.tradeLicenseDocObj.pop();
                let tradeLicenseObj = {
                  docId : data.imageId,
                  documentName: documentName
                }
                this.tradeLicenseDocObj.push(tradeLicenseObj);
              }
              if(documentName == "AML_POLICY_AND_PROCEDURES"){
                this.amlPolicyAndProceduresDocObj.pop();
                let amlPolicyAndProceduresObj = {
                  docId : data.imageId,
                  documentName: documentName
                }
                this.amlPolicyAndProceduresDocObj.push(amlPolicyAndProceduresObj);
              }
              if(documentName == "AUDIT_REPORT"){
                this.auditReportDocObj.pop();
                let auditReportDocObj = {
                  docId : data.imageId,
                  documentName: documentName
                }
                this.auditReportDocObj.push(auditReportDocObj);
              }
              if(documentName == "LATEST_AML_AUDIT_REPORT"){
                this.amlAuditReportDocObj.pop();
                let amlAuditReportObj = {
                  docId : data.imageId,
                  documentName: documentName
                }
                this.amlAuditReportDocObj.push(amlAuditReportObj);
              }
              if(documentName == "LATEST_ORGANISATION_STRUCTURE"){
                this.organisationStructureDocObj.pop();
                let organisationStructureObj = {
                  docId : data.imageId,
                  documentName: documentName
                }
                this.organisationStructureDocObj.push(organisationStructureObj);
              }
              if(documentName == "MANAGEMENT_LIST"){
                this.managementListDocObj.pop();
                let managementListObj = {
                  docId : data.imageId,
                  documentName: documentName
                }
                this.managementListDocObj.push(managementListObj);
              }
              if(documentName == "ID_COPIES"){
                this.idCopiesDocObj.pop(); //idCopiesDocObj
                let idCopiesObj = {
                  docId : data.imageId,
                  documentName: documentName
                }
                this.idCopiesDocObj.push(idCopiesObj);
              }
              if(documentName == "KYC_FORM"){
                this.kycFormDocObj.pop();
                let kycFormObj = {
                  docId : data.imageId,
                  documentName: documentName
                }
                this.kycFormDocObj.push(kycFormObj);
              }
              if(documentName == "WOLFSBERG_FORM"){
                this.wolfsbergFormDocObj.pop();
                let wolfsbergFormObj = {
                  docId : data.imageId,
                  documentName: documentName
                }
                this.wolfsbergFormDocObj.push(wolfsbergFormObj);
              }
              if(documentName == "ONBOARDING_DOCUMENT"){
                this.onboardingDocObj.pop();
                let onboardingDocumentObj = {
                  docId : data.imageId,
                  documentName: documentName
                }
                this.onboardingDocObj.push(onboardingDocumentObj);
              }
            //Pushing latest document id's when add document service is success . 
            if(documentName == "OWNER_NRIC"){
              const combinedOwnerObj = {
                documentId: data.imageId,
                documentName: documentName,
                ownerNodeIndex: index // Index of ownerNode
              };
              this.combinedOwnerData.push(combinedOwnerObj);
            }
            if(documentName == "RUNNER_NRIC"){
              const combinedRunnerObj = {
                documentId: data.imageId,
                documentName: documentName,
                runnerNodeIndex: index // Index of runner node
              };
              this.combinedRunnerData.push(combinedRunnerObj);
            }
            if(documentName == "DEALER_NRIC"){
              const combinedDealerObj = {
                documentId: data.imageId,
                documentName: documentName,
                dealerNodeIndex: index // Index of dealer node
              };
              this.combinedDealerData.push(combinedDealerObj);
            }

            this._snackBar.open("Document has been uploaded successfully!", "Ok",{
              duration: 3000,
              panelClass: "green-notification-snackbar"
            });
          },
            (error: any) => {
              if (error.status != 401) {
                this.dialogRef.open(ErrorDialogAdminComponent);
              }
            })
          }
        }
        //will not fire add document api...
        else{
          if (e.target.files[0].type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            this._snackBar.open("Sorry, DOCX files are not supported for upload. Please choose a different file format.", "Ok", {
              duration: 3000,
            });
          }
          else if (e.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            this._snackBar.open("Sorry,Spreadsheets are not supported for upload. Please choose a different file format.", "Ok", {
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
    }
    else {
      console.log('file size is too large');
      this._snackBar.open("file size should not exceed more than 10mb", "Ok", {
        duration: 3000,
      });
    }
  }
}

//build payload for update customer document ..
updateCustDocument(id: string,documentName : string,binaryData:any,docId:string): DocumentUpdateCustomer{
  return new DocumentUpdateCustomer({
    "customerType" : "C",
    "documentData": binaryData,
    "documentName": documentName,
    "documentTypeId": id,
    "associateId" : this.associateId,
    "documentId" : docId
  })
}

addDocuments(id: string,binaryData:any): CorporateAddDocument {
  let applicationId :string = "";
  let applicantId : string = "";
  let channelType =  this.store.getItem('CHANNEL_TYPE') ? this.store.getItem('CHANNEL_TYPE') : "" ;
  if(channelType == "MOBILE"){ //if its corporate onboarding from mobile/laptop , get appId and applicantId from login response
    applicationId = this.store.getItem('APPLICATION_ID') ? this.store.getItem('APPLICATION_ID') : "";
    applicantId = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "" ;
  }
  else if(channelType == ""){ //MC
    applicationId = this.store.getItem('MC_CORP_APPLICATIONID') ? this.store.getItem('MC_CORP_APPLICATIONID') : "" ;
    applicantId = this.store.getItem('MC_CORP_APPLICANTID') ? this.store.getItem('MC_CORP_APPLICANTID') : "" ;
  }
  return new CorporateAddDocument({
    "applicationId" : applicationId,
    "applicantId" : applicantId,
    "documentId": id,
    "documentName": fetchDocumentKeyByValue(id),
    "documentData": binaryData,
    "associateId" : this.associateId
  });
}

onSave(id:any){
  this.saveDocuments = false;
   this.loader = true; 
  this.documentService.submitDocumentCorporate(this.submitApplication(id)).subscribe
  (data => {
    console.log(data);
    this.loader = false;
    this.saveDocuments = true;
    this.applicationService.corporateScreenstatus('documentsFlag');
    this.router.navigate(["/profile/corporate-dashboard"]);
    this.documentIds.push(data.documentId);
    if(this.form.valid){
    this.alertService.clear()
    this.alertService.success("Successful!!");
    }
  },
            //error handling Completed on 06-07-2023 - <DN>
            (error:any)=>{
              this.submitted = false;
               // this.loading = false;
              // console.log(error.message);
              // this.alertService.clear()
              // this.alertService.error(" Failed. Try Again");
              if(error.status != 401){
                this.dialogRef.open(ErrorDialogAdminComponent) ;
              }
            });


}

submitApplication(id: string): SubmitDocument {
  if(this.store.getItem('IMAGE_ID') != undefined){
    let imageId = this.store.getItem('IMAGE_ID') ;
    this.imageId.push(imageId) ;
  }
  let applicationId :string = "";
  let applicantId : string = "";
  //if its corporate onboarding from mobile/laptop , get appId and applicantId from login response
    applicationId = this.store.getItem('APPLICATION_ID') ? this.store.getItem('APPLICATION_ID') : "";
    applicantId = this.store.getItem('CUSTOMER_ID') ? this.store.getItem('CUSTOMER_ID') : "" ;

return new SubmitDocument({
   "documentIds": this.imageId,
  "applicationId" : applicationId,
  "applicantId" : applicantId
  });
}

//MC >>> Submit document API
submitCorpDocumentApplication(): SubmitDocument{
  if(this.store.getItem('IMAGE_ID') != undefined){
    let imageId = this.store.getItem('IMAGE_ID') ;
    this.imageId.push(imageId) ;

  }
  let mcApplicationId = this.store.getItem('MC_CORP_APPLICATIONID') ?  this.store.getItem('MC_CORP_APPLICATIONID') : "";
  let mcApplicantId = this.store.getItem('MC_CORP_APPLICANTID') ?  this.store.getItem('MC_CORP_APPLICANTID') : "";
  return new SubmitDocument({ 
    "applicationId" : mcApplicationId,
    "applicantId" : mcApplicantId,
    "documentIds": this.imageId 
  });
}


 //In Application Listings > view Documents - this function calls document inquiry (back office) & after converted into customer(mobile)
  loadBinaryData(documentName:any,id: string,isBlur:string, index:number){

  const applicationStatus = this.store.getItem('APPLICATIONSTATUS') ? this.store.getItem('APPLICATIONSTATUS') : "";
  const customerStatus = this.store.getItem('CUSTOMER_STATUS') ? this.store.getItem('CUSTOMER_STATUS') : null ;
  const isBackofficeCustomerSearchCustomerId = this.customerId ? this.customerId : "" ;

  if(this.productCode != "MC"){  //Not MC onboarding related code
//Entry point :
//All entry points in corporate and backoffice where user clicked on blur image of PDF ..
if(isBlur == "blurPdf"){
  //Corporate "NEW"
   if(applicationStatus == "NEW"){
   if (documentName == "ACRA") {
     this.loadACRA = true;
     this.reuploadAcra = false;
   this.documentId = this.acraDocObj[0].docId;
   this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
   this.documentInquiry = data;
   let binaryData = data.documentData;

   let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);

   this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
     width: '1380px',
     height: '720px',
     panelClass: 'custom-modalbox',
     data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
   });
   this.callApplicationInquiryApi(applicationStatus) ;
   this.showImageAcra = false; //img tag
   this.showOtherFormatAcra = true;  //object tag
   this.pdfUrlAcra = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
   this.loadACRA = false;
   this.showACRA = false;
   this.uploadIconACRA = false;
   this.showAcraInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
   this.reuploadAcra = true;
   this.associateId = "";  //assoicate id empty string for ACRA
   });
    
   }
   // NEW 12 DOCUMENTS
   if (documentName == "INCORPORATION_CERTIFICATE") {
    this.loadIncorporationCert = true;
    this.reuploadIncorporationCert = false;
  this.documentId = this.incorporationCertDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageIncorporationCert = false; //img tag
  this.showOtherFormatIncorporationCert = true;  //object tag
  this.pdfUrlIncorporationCert = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadIncorporationCert = false;
  this.showIncorporationCert = false;
  this.uploadIconIncorporationCert = false;
  this.showIncorporationCertInput = false; //we need to false the showIncorporationCertInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadIncorporationCert = true;
  this.associateId = "";  //assoicate id empty string for INCORPORATION_CERTIFICATE
  });
   
  }
  if (documentName == "ARTICLES_ASSOCIATION") {
    this.loadArticlesAssociation = true;
    this.reuploadArticlesAssociation = false;
  this.documentId = this.articlesAssociationDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageArticlesAssociation = false; //img tag
  this.showOtherFormatArticlesAssociation = true;  //object tag
  this.pdfUrlArticlesAssociation = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadArticlesAssociation = false;
  this.showArticlesAssociation = false;
  this.uploadIconArticlesAssociation = false;
  this.showArticlesAssociationInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadArticlesAssociation = true;
  this.associateId = "";  //assoicate id empty string for ACRA
  });
   
  }
  if (documentName == "BANK_LICENSE") {
    this.loadBankLicense = true;
    this.reuploadBankLicense = false;
  this.documentId = this.bankLicenseDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageBankLicense = false; //img tag
  this.showOtherFormatBankLicense = true;  //object tag
  this.pdfUrlBankLicense = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadBankLicense = false;
  this.showBankLicense = false;
  this.uploadIconBankLicense = false;
  this.showBankLicenseInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadBankLicense = true;
  this.associateId = "";  //assoicate id empty string for ACRA
  });
   
  }
  if (documentName == "TRADE_LICENSE") {
    this.loadTradeLicense = true;
    this.reuploadTradeLicense = false;
  this.documentId = this.tradeLicenseDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageTradeLicense = false; //img tag
  this.showOtherFormatTradeLicense = true;  //object tag
  this.pdfUrlTradeLicense = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadTradeLicense = false;
  this.showTradeLicense = false;
  this.uploadIconTradeLicense = false;
  this.showTradeLicenseInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadTradeLicense = true;
  this.associateId = "";  //assoicate id empty string for ACRA
  });
   
  }
  if (documentName == "AML_POLICY_AND_PROCEDURES") {
    this.loadAmlPolicyAndProcedures = true;
    this.reuploadAmlPolicyAndProcedures = false;
  this.documentId = this.amlPolicyAndProceduresDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageAmlPolicyAndProcedures = false; //img tag
  this.showOtherFormatAmlPolicyAndProcedures = true;  //object tag
  this.pdfUrlAmlPolicyAndProcedures = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadAmlPolicyAndProcedures = false;
  this.showAmlPolicyAndProcedures = false;
  this.uploadIconAmlPolicyAndProcedures = false;
  this.showAmlPolicyAndProceduresInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadAmlPolicyAndProcedures = true;
  this.associateId = "";  //assoicate id empty string for ACRA
  });
   
  }
  if (documentName == "AUDIT_REPORT") {
    this.loadAuditReport = true;
    this.reuploadAuditReport = false;
  this.documentId = this.auditReportDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageAuditReport = false; //img tag
  this.showOtherFormatAuditReport = true;  //object tag
  this.pdfUrlAuditReport = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadAuditReport = false;
  this.showAuditReport = false;
  this.uploadIconAuditReport = false;
  this.showAuditReportInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadAuditReport = true;
  this.associateId = "";  //assoicate id empty string for ACRA
  });
   
  }
  if (documentName == "LATEST_AML_AUDIT_REPORT") {
    this.loadAmlAuditReport = true;
    this.reuploadAmlAuditReport = false;
  this.documentId = this.amlAuditReportDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageAmlAuditReport = false; //img tag
  this.showOtherFormatAmlAuditReport = true;  //object tag
  this.pdfUrlAmlAuditReport = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadAmlAuditReport = false;
  this.showAmlAuditReport = false;
  this.uploadIconAmlAuditReport = false;
  this.showAmlAuditReportInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadAmlAuditReport = true;
  this.associateId = "";  //assoicate id empty string for ACRA
  });
   
  }
  if (documentName == "LATEST_ORGANISATION_STRUCTURE") {
    this.loadOrganisationStructure = true;
    this.reuploadOrganisationStructure = false;
  this.documentId = this.organisationStructureDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageOrganisationStructure = false; //img tag
  this.showOtherFormatOrganisationStructure = true;  //object tag
  this.pdfUrlOrganisationStructure = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadOrganisationStructure = false;
  this.showOrganisationStructure = false;
  this.uploadIconOrganisationStructure = false;
  this.showOrganisationStructureInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadOrganisationStructure = true;
  this.associateId = "";  //assoicate id empty string for ACRA
  });
   
  }
  if (documentName == "MANAGEMENT_LIST") {
    this.loadManagementList = true;
    this.reuploadManagementList = false;
  this.documentId = this.managementListDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageManagementList = false; //img tag
  this.showOtherFormatManagementList = true;  //object tag
  this.pdfUrlManagementList = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadManagementList = false;
  this.showManagementList = false;
  this.uploadIconManagementList = false;
  this.showManagementListInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadManagementList = true;
  this.associateId = "";  //assoicate id empty string for ACRA
  });
   
  }
  if (documentName == "ID_COPIES") {
    this.loadIdCopies = true;
    this.reuploadIdCopies = false;
  this.documentId = this.idCopiesDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageIdCopies = false; //img tag
  this.showOtherFormatIdCopies = true;  //object tag
  this.pdfUrlIdCopies = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadIdCopies = false;
  this.showIdCopies = false;
  this.uploadIconIdCopies = false;
  this.showIdCopiesInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadIdCopies = true;
  this.associateId = "";  //assoicate id empty string for ACRA
  });
   
  }
  if (documentName == "KYC_FORM") {
    this.loadKycForm = true;
    this.reuploadKycForm = false;
  this.documentId = this.kycFormDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageKycForm = false; //img tag
  this.showOtherFormatKycForm = true;  //object tag
  this.pdfUrlKycForm = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadKycForm = false;
  this.showKycForm = false;
  this.uploadIconKycForm = false;
  this.showKycFormInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadKycForm = true;
  this.associateId = "";  //assoicate id empty string for ACRA
  });
   
  }
  if (documentName == "WOLFSBERG_FORM") {
    this.loadWolfsbergForm = true;
    this.reuploadWolfsbergForm = false;
  this.documentId = this.wolfsbergFormDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageWolfsbergForm = false; //img tag
  this.showOtherFormatWolfsbergForm = true;  //object tag
  this.pdfUrlWolfsbergForm = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadWolfsbergForm = false;
  this.showWolfsbergForm = false;
  this.uploadIconWolfsbergForm = false;
  this.showWolfsbergFormInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadWolfsbergForm = true;
  this.associateId = "";  //assoicate id empty string for ACRA
  });
   
  }

  if (documentName == "ONBOARDING_DOCUMENT") {
    this.loadOnboardingDoc = true;
    this.reuploadOnboardingDoc = false;
  this.documentId = this.onboardingDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageOnboardingDoc = false; //img tag
  this.showOtherFormatOnboardingDoc = true;  //object tag
  this.pdfUrlOnboardingDoc = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadOnboardingDoc = false;
  this.showOnboardingDoc = false;
  this.uploadIconOnboardingDoc = false;
  this.showOnboardingDocInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadOnboardingDoc = true;
  this.associateId = "";  //assoicate id empty string for ACRA
  });
   
  }

   if (documentName == "OWNER_NRIC") {
     this.loadOWNER[index] = true;
   this.reuploadOwner[index] = false;
   let getDocId = this.combinedOwnerData.filter(v => v.ownerNodeIndex == index);
   this.documentId = getDocId[0].documentId;
   console.log(this.documentId);
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
       let binaryData = data.documentData;

       let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);

       this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
         width: '1380px',
         height: '720px',
         panelClass: 'custom-modalbox',
         data: { customersearch_documentName: documentName, customersearch_documentData: binaryData,fileBlob: blob  }
       });
       this.callApplicationInquiryApi(applicationStatus) ;
       this.showImageOwner[index] = false; //img tag
       this.showOtherFormatOwner[index] = true;  //object tag
       this.pdfUrlOwner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
       this.loadOWNER[index] = false;
       this.showOWNER[index] = false;
       this.showOwnerInput[index] = false; //we need to false the showOwnerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
       this.uploadIconOWNER[index] = false;
       this.reuploadOwner[index] = true;
       const selectedOwner = this.owners[index];// Retrieve the associateId based on the index
       this.associateId = selectedOwner.associateId;
       console.log(this.associateId);
     });
   }
   //block will execute (PDF) - DEALER NRIC
   if (documentName == "DEALER_NRIC") {
     this.loadDEALER[index] = true;
   this.reuploadDealer[index] = false;
   let getDocId = this.combinedDealerData.filter(v => v.dealerNodeIndex == index);
   this.documentId = getDocId[0].documentId;
   console.log(this.documentId);
   this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);

     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageDealer[index] = false; //img tag
     this.showOtherFormatDealer[index] = true;  //object tag
     this.pdfUrlDealer[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.loadDEALER[index] = false;
     this.showDEALER[index] = false;
     this.showDealerInput[index] = false; //we need to false the showDealerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.uploadIconDEALER[index] = false;
     this.reuploadDealer[index] = true;
     const selectedDealer = this.dealers[index]; // Retrieve the associateId based on the index
     this.associateId = selectedDealer.associateId;
     console.log(this.associateId);
   });
   }
   //block will execute (PDF) - RUNNER NRIC
   if (documentName == "RUNNER_NRIC") {
     this.loadRUNNER[index] = true;
   this.reuploadRunner[index] = false;
   let getDocId = this.combinedRunnerData.filter(v => v.runnerNodeIndex == index);
   this.documentId = getDocId[0].documentId;
   console.log(this.documentId);
   this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);

     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageRunner[index] = false; //img tag
     this.showOtherFormatRunner[index] = true;  //object tag
     this.pdfUrlRunner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.loadRUNNER[index] = false;
     this.showRUNNER[index] = false;
     this.showRunnerInput[index] = false; //we need to false the showRunnerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.uploadIconRUNNER[index] = false;
     this.reuploadRunner[index] = true;
     const selectedRunner = this.runners[index];// Retrieve the associateId based on the index
     this.associateId = selectedRunner.associateId;
     console.log(this.associateId);
   });
   }
   }
   else if(applicationStatus == "APPROVED" || applicationStatus == "PENDING" || applicationStatus == "REJECTED" || this.flowEntryPoint == "BACKOFFICEMOBILE-ALLSTATUS" || isBackofficeCustomerSearchCustomerId != "" || customerStatus == "ACTIVE"){
     if (documentName == "ACRA") {
      // this.loadACRA = true;
      this.isScreenLoader = true ;
      // this.showEditInfoAcra = false;
     this.documentId = this.acraDocObj[0].docId;
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     this.documentInquiry = data;
     this.isScreenLoader = false ;
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageAcra = false; //img tag
     this.showOtherFormatAcra = true;  //object tag
     this.pdfUrlAcra = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     //this.loadACRA = false;
     this.showACRA = false;
     this.uploadIconACRA = false;
     this.showAcraInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.reuploadAcra = false;
     this.associateId = "";  //assoicate id empty string for ACRA
     });
      
     }
     // NEW 12 DOCUMENTS
     if (documentName == "INCORPORATION_CERTIFICATE") {
      this.isScreenLoader = true ;
     this.documentId = this.incorporationCertDocObj[0].docId;
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     this.documentInquiry = data;
     this.isScreenLoader = false ;
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageIncorporationCert = false; //img tag
     this.showOtherFormatIncorporationCert = true;  //object tag
     this.pdfUrlIncorporationCert = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.showIncorporationCert = false;
     this.uploadIconIncorporationCert = false;
     this.showIncorporationCertInput = false; //we need to false the showIncorporationCertInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.reuploadIncorporationCert = false;
     this.associateId = "";  //assoicate id empty string for INCORPORATION_CERTIFICATE
     });
      
     }
     if (documentName == "ARTICLES_ASSOCIATION") {
      this.isScreenLoader = true ;
     this.documentId = this.articlesAssociationDocObj[0].docId;
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     this.documentInquiry = data;
     this.isScreenLoader = false ;
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageArticlesAssociation = false; //img tag
     this.showOtherFormatArticlesAssociation = true;  //object tag
     this.pdfUrlArticlesAssociation = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.showArticlesAssociation = false;
     this.uploadIconArticlesAssociation = false;
     this.showArticlesAssociationInput = false; //we need to false the showArticlesAssociationInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.reuploadArticlesAssociation = false;
     this.associateId = "";  //assoicate id empty string for ARTICLES_ASSOCIATION
     });
      
     }
     if (documentName == "BANK_LICENSE") {
      this.isScreenLoader = true ;
     this.documentId = this.bankLicenseDocObj[0].docId;
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     this.documentInquiry = data;
     this.isScreenLoader = false ;
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageBankLicense = false; //img tag
     this.showOtherFormatBankLicense = true;  //object tag
     this.pdfUrlBankLicense = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.showBankLicense = false;
     this.uploadIconBankLicense = false;
     this.showBankLicenseInput = false; //we need to false the showBankLicenseInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.reuploadBankLicense = false;
     this.associateId = "";  //assoicate id empty string for BANK_LICENSE
     });
      
     }
     if (documentName == "TRADE_LICENSE") {
      this.isScreenLoader = true ;
     this.documentId = this.tradeLicenseDocObj[0].docId;
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     this.documentInquiry = data;
     this.isScreenLoader = false ;
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageTradeLicense = false; //img tag
     this.showOtherFormatTradeLicense = true;  //object tag
     this.pdfUrlTradeLicense = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.showTradeLicense = false;
     this.uploadIconTradeLicense = false;
     this.showTradeLicenseInput = false; //we need to false the showTradeLicenseInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.reuploadTradeLicense = false;
     this.associateId = "";  //assoicate id empty string for TRADE_LICENSE
     });
      
     }
     if (documentName == "AML_POLICY_AND_PROCEDURES") {
      this.isScreenLoader = true ;
     this.documentId = this.amlPolicyAndProceduresDocObj[0].docId;
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     this.documentInquiry = data;
     this.isScreenLoader = false ;
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageAmlPolicyAndProcedures = false; //img tag
     this.showOtherFormatAmlPolicyAndProcedures = true;  //object tag
     this.pdfUrlAmlPolicyAndProcedures = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.showAmlPolicyAndProcedures = false;
     this.uploadIconAmlPolicyAndProcedures = false;
     this.showAmlPolicyAndProceduresInput = false; //we need to false the showAmlPolicyAndProceduresInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.reuploadAmlPolicyAndProcedures = false;
     this.associateId = "";  //assoicate id empty string for AML_POLICY_AND_PROCEDURES
     });
      
     }
     if (documentName == "AUDIT_REPORT") {
      this.isScreenLoader = true ;
     this.documentId = this.auditReportDocObj[0].docId;
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     this.documentInquiry = data;
     this.isScreenLoader = false ;
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageAuditReport = false; //img tag
     this.showOtherFormatAuditReport = true;  //object tag
     this.pdfUrlAuditReport = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.showAuditReport = false;
     this.uploadIconAuditReport = false;
     this.showAuditReportInput = false; //we need to false the showAuditReportInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.reuploadAuditReport = false;
     this.associateId = "";  //assoicate id empty string for AUDIT_REPORT
     });
      
     }
     if (documentName == "LATEST_AML_AUDIT_REPORT") {
      this.isScreenLoader = true ;
     this.documentId = this.amlAuditReportDocObj[0].docId;
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     this.documentInquiry = data;
     this.isScreenLoader = false ;
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageAmlAuditReport = false; //img tag
     this.showOtherFormatAmlAuditReport = true;  //object tag
     this.pdfUrlAmlAuditReport = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.showAmlAuditReport = false;
     this.uploadIconAmlAuditReport = false;
     this.showAmlAuditReportInput = false; //we need to false the showAmlAuditReportInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.reuploadAmlAuditReport = false;
     this.associateId = "";  //assoicate id empty string for LATEST_AML_AUDIT_REPORT
     });
      
     }
     if (documentName == "LATEST_ORGANISATION_STRUCTURE") {
      this.isScreenLoader = true ;
     this.documentId = this.organisationStructureDocObj[0].docId;
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     this.documentInquiry = data;
     this.isScreenLoader = false ;
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageOrganisationStructure = false; //img tag
     this.showOtherFormatOrganisationStructure = true;  //object tag
     this.pdfUrlOrganisationStructure = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.showOrganisationStructure = false;
     this.uploadIconOrganisationStructure = false;
     this.showOrganisationStructureInput = false; //we need to false the showOrganisationStructureInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.reuploadOrganisationStructure = false;
     this.associateId = "";  //assoicate id empty string for LATEST_ORGANISATION_STRUCTURE
     });
      
     }
     if (documentName == "MANAGEMENT_LIST") {
      this.isScreenLoader = true ;
     this.documentId = this.managementListDocObj[0].docId;
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     this.documentInquiry = data;
     this.isScreenLoader = false ;
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageManagementList = false; //img tag
     this.showOtherFormatManagementList = true;  //object tag
     this.pdfUrlManagementList = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.showManagementList = false;
     this.uploadIconManagementList = false;
     this.showManagementListInput = false; //we need to false the showManagementListInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.reuploadManagementList = false;
     this.associateId = "";  //assoicate id empty string for MANAGEMENT_LIST
     });
      
     }
     if (documentName == "ID_COPIES") {
      this.isScreenLoader = true ;
     this.documentId = this.idCopiesDocObj[0].docId;
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     this.documentInquiry = data;
     this.isScreenLoader = false ;
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageIdCopies = false; //img tag
     this.showOtherFormatIdCopies = true;  //object tag
     this.pdfUrlIdCopies = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.showIdCopies = false;
     this.uploadIconIdCopies = false;
     this.showIdCopiesInput = false; //we need to false the showIdCopiesInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.reuploadIdCopies = false;
     this.associateId = "";  //assoicate id empty string for ID_COPIES
     });
      
     }
     if (documentName == "KYC_FORM") {
      this.isScreenLoader = true ;
     this.documentId = this.kycFormDocObj[0].docId;
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     this.documentInquiry = data;
     this.isScreenLoader = false ;
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageKycForm = false; //img tag
     this.showOtherFormatKycForm = true;  //object tag
     this.pdfUrlKycForm = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.showKycForm = false;
     this.uploadIconKycForm = false;
     this.showKycFormInput = false; //we need to false the showKycFormInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.reuploadKycForm = false;
     this.associateId = "";  //assoicate id empty string for KYC_FORM
     });
      
     }
     if (documentName == "WOLFSBERG_FORM") {
      this.isScreenLoader = true ;
     this.documentId = this.wolfsbergFormDocObj[0].docId;
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     this.documentInquiry = data;
     this.isScreenLoader = false ;
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageWolfsbergForm = false; //img tag
     this.showOtherFormatWolfsbergForm = true;  //object tag
     this.pdfUrlWolfsbergForm = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.showWolfsbergForm = false;
     this.uploadIconWolfsbergForm = false;
     this.showWolfsbergFormInput = false; //we need to false the showWolfsbergFormInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.reuploadWolfsbergForm = false;
     this.associateId = "";  //assoicate id empty string for WOLFSBERG_FORM
     });
      
     }

     if (documentName == "ONBOARDING_DOCUMENT") {
      this.isScreenLoader = true ;
     this.documentId = this.onboardingDocObj[0].docId;
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     this.documentInquiry = data;
     this.isScreenLoader = false ;
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageOnboardingDoc = false; //img tag
     this.showOtherFormatOnboardingDoc = true;  //object tag
     this.pdfUrlOnboardingDoc = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.showOnboardingDoc = false;
     this.uploadIconOnboardingDoc = false;
     this.showOnboardingDocInput = false; 
     this.reuploadOnboardingDoc = false;
     this.associateId = "";  //assoicate id empty string for ONBOARDING_DOCUMENT
     });
      
     }

     if (documentName == "OWNER_NRIC") {
    //  this.loadOWNER[index] = true;
      // this.showEditInfoOwner[index] = false;
      this.isScreenLoader = true ;
     this.reuploadOwner[index] = false;
     let getDocId = this.combinedOwnerData.filter(v => v.ownerNodeIndex == index);
     this.documentId = getDocId[0].documentId;
     console.log(this.documentId);
       this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
        this.isScreenLoader = false ;
         let binaryData = data.documentData;

         let base64 = await fetch(binaryData);

         let blob = await base64.blob();
      
         const blobUrl = URL.createObjectURL(blob);
      
         console.log(blob);
         this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
           width: '1380px',
           height: '720px',
           panelClass: 'custom-modalbox',
           data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
         });
         this.callApplicationInquiryApi(applicationStatus) ;
         this.showImageOwner[index] = false; //img tag
         this.showOtherFormatOwner[index] = true;  //object tag
         this.pdfUrlOwner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        // this.loadOWNER[index] = false;
         this.showOWNER[index] = false;
         this.showOwnerInput[index] = false; //we need to false the showOwnerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
         this.uploadIconOWNER[index] = false;
         this.reuploadOwner[index] = false;
         const selectedOwner = this.owners[index];// Retrieve the associateId based on the index
         this.associateId = selectedOwner.associateId;
         console.log(this.associateId);
       });
     }
     //block will execute (PDF) - DEALER NRIC
     if (documentName == "DEALER_NRIC") {
      // this.loadDEALER[index] = true;
      // this.showEditInfoDealer[index] = false;
      this.isScreenLoader = true ;
     this.reuploadDealer[index] = false;
     let getDocId = this.combinedDealerData.filter(v => v.dealerNodeIndex == index);
     this.documentId = getDocId[0].documentId;
     console.log(this.documentId);
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
      this.isScreenLoader = false ;
       let binaryData = data.documentData;

       let base64 = await fetch(binaryData);

       let blob = await base64.blob();
    
       const blobUrl = URL.createObjectURL(blob);
    
       console.log(blob);
       this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
         width: '1380px',
         height: '720px',
         panelClass: 'custom-modalbox',
         data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
       });
       this.callApplicationInquiryApi(applicationStatus) ;
       this.showImageDealer[index] = false; //img tag
       this.showOtherFormatDealer[index] = true;  //object tag
       this.pdfUrlDealer[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
       //this.loadDEALER[index] = false;
       this.showDEALER[index] = false;
       this.showDealerInput[index] = false; //we need to false the showDealerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
       this.uploadIconDEALER[index] = false;
       this.reuploadDealer[index] = false;
       const selectedDealer = this.dealers[index]; // Retrieve the associateId based on the index
       this.associateId = selectedDealer.associateId;
       console.log(this.associateId);
     });
     }
     //block will execute (PDF) - RUNNER NRIC
     if (documentName == "RUNNER_NRIC") {
     // this.loadRUNNER[index] = true;
     //  this.showEditInfoRunner[index] = false;
     this.isScreenLoader = true ;
     this.reuploadRunner[index] = false;
     let getDocId = this.combinedRunnerData.filter(v => v.runnerNodeIndex == index);
     this.documentId = getDocId[0].documentId;
     console.log(this.documentId);
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
      this.isScreenLoader = false ;
       let binaryData = data.documentData;

       let base64 = await fetch(binaryData);

       let blob = await base64.blob();
    
       const blobUrl = URL.createObjectURL(blob);
    
       console.log(blob);
       this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
         width: '1380px',
         height: '720px',
         panelClass: 'custom-modalbox',
         data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
       });
       this.callApplicationInquiryApi(applicationStatus) ;
       this.showImageRunner[index] = false; //img tag
       this.showOtherFormatRunner[index] = true;  //object tag
       this.pdfUrlRunner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      // this.loadRUNNER[index] = false;
       this.showRUNNER[index] = false;
       this.showRunnerInput[index] = false; //we need to false the showRunnerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
       this.uploadIconRUNNER[index] = false;
       this.reuploadRunner[index] = false;
       const selectedRunner = this.runners[index];// Retrieve the associateId based on the index
       this.associateId = selectedRunner.associateId;
       console.log(this.associateId);
     });
     }
   }
 }
   //Entry point :
//All entry points in corporate and backoffice where user clicked on 'Click to View' ..
else if(isBlur == ""){
     if(applicationStatus == "NEW"){
      if (documentName == "ACRA") {
      this.loadACRA = true;
      this.reuploadAcra = false;
      this.documentId = this.acraDocObj[0].docId;
      this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
      this.documentInquiry = data;
      let binaryData = data.documentData;

      let base64 = await fetch(binaryData);

      let blob = await base64.blob();
   
      const blobUrl = URL.createObjectURL(blob);
   
      console.log(blob);
      if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
        this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
          width: '1380px',
          height: '720px',
          panelClass: 'custom-modalbox',
          data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
        });
        this.callApplicationInquiryApi(applicationStatus) ;
        this.showImageAcra = false; //img tag
        this.showOtherFormatAcra = true;  //object tag
        this.pdfUrlAcra = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.loadACRA = false;
        this.showACRA = false;
        this.uploadIconACRA = false;
        this.showAcraInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
        this.reuploadAcra = true;
        this.associateId = "";  //assoicate id empty string for ACRA
      }  
       //else if response data is jpeg or png
      else{
      this.fileAcraData[index] = binaryData; 
      this.showACRA = false; 
      this.showOtherFormatAcra = false;  //object tag
      this.showImageAcra = true; //img tag
      this.uploadIconACRA = false;
      this.showAcraInput = true;
      this.disableAcraInput = false;
      this.reuploadAcra = false;
      this.associateId = ""; //assoicate id empty string for ACRA
      this.loadACRA = false;
      }
      });
       
      }
      // NEW 12 DOCUMENTS
      if (documentName == "INCORPORATION_CERTIFICATE") {
        this.loadIncorporationCert = true;
        this.reuploadIncorporationCert = false;
        this.documentId = this.incorporationCertDocObj[0].docId;
        this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
        this.documentInquiry = data;
        let binaryData = data.documentData;
  
        let base64 = await fetch(binaryData);
  
        let blob = await base64.blob();
     
        const blobUrl = URL.createObjectURL(blob);
     
        console.log(blob);
        if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
          this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
            width: '1380px',
            height: '720px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
          });
          this.callApplicationInquiryApi(applicationStatus) ;
          this.showImageIncorporationCert = false; //img tag
          this.showOtherFormatIncorporationCert = true;  //object tag
          this.pdfUrlIncorporationCert = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
          this.loadIncorporationCert = false;
          this.showIncorporationCert = false;
          this.uploadIconIncorporationCert = false;
          this.showIncorporationCertInput = false; //we need to false the showIncorporationCertInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
          this.reuploadIncorporationCert = true;
          this.associateId = "";  //assoicate id empty string for INCORPORATION_CERTIFICATE
        }  
         //else if response data is jpeg or png
        else{
        this.fileIncorporationCertData[index] = binaryData; 
        this.showIncorporationCert = false; 
        this.showOtherFormatIncorporationCert = false;  //object tag
        this.showImageIncorporationCert = true; //img tag
        this.uploadIconIncorporationCert = false;
        this.showIncorporationCertInput = true;
        this.disableIncorporationCertInput = false;
        this.reuploadIncorporationCert = false;
        this.associateId = ""; //assoicate id empty string for INCORPORATION_CERTIFICATE
        this.loadIncorporationCert = false;
        }
        });
         
        }
        if (documentName == "ARTICLES_ASSOCIATION") {
          this.loadArticlesAssociation = true;
          this.reuploadArticlesAssociation = false;
          this.documentId = this.articlesAssociationDocObj[0].docId;
          this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
          this.documentInquiry = data;
          let binaryData = data.documentData;
    
          let base64 = await fetch(binaryData);
    
          let blob = await base64.blob();
       
          const blobUrl = URL.createObjectURL(blob);
       
          console.log(blob);
          if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
            this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
              width: '1380px',
              height: '720px',
              panelClass: 'custom-modalbox',
              data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
            });
            this.callApplicationInquiryApi(applicationStatus) ;
            this.showImageArticlesAssociation = false; //img tag
            this.showOtherFormatArticlesAssociation = true;  //object tag
            this.pdfUrlArticlesAssociation = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
            this.loadArticlesAssociation = false;
            this.showArticlesAssociation = false;
            this.uploadIconArticlesAssociation = false;
            this.showArticlesAssociationInput = false; //we need to false the showArticlesAssociationInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
            this.reuploadArticlesAssociation = true;
            this.associateId = "";  //assoicate id empty string for ARTICLES_ASSOCIATION
          }  
           //else if response data is jpeg or png
          else{
          this.fileArticlesAssociationData[index] = binaryData; 
          this.showArticlesAssociation = false; 
          this.showOtherFormatArticlesAssociation = false;  //object tag
          this.showImageArticlesAssociation = true; //img tag
          this.uploadIconArticlesAssociation = false;
          this.showArticlesAssociationInput = true;
          this.disableArticlesAssociationInput = false;
          this.reuploadArticlesAssociation = false;
          this.associateId = ""; //assoicate id empty string for ARTICLES_ASSOCIATION
          this.loadArticlesAssociation = false;
          }
          });
           
          }
          if (documentName == "BANK_LICENSE") {
            this.loadBankLicense = true;
            this.reuploadBankLicense = false;
            this.documentId = this.bankLicenseDocObj[0].docId;
            this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
            this.documentInquiry = data;
            let binaryData = data.documentData;
      
            let base64 = await fetch(binaryData);
      
            let blob = await base64.blob();
         
            const blobUrl = URL.createObjectURL(blob);
         
            console.log(blob);
            if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
              this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                width: '1380px',
                height: '720px',
                panelClass: 'custom-modalbox',
                data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
              });
              this.callApplicationInquiryApi(applicationStatus) ;
              this.showImageBankLicense = false; //img tag
              this.showOtherFormatBankLicense = true;  //object tag
              this.pdfUrlBankLicense = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadBankLicense = false;
              this.showBankLicense = false;
              this.uploadIconBankLicense = false;
              this.showBankLicenseInput = false; //we need to false the showBankLicenseInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.reuploadBankLicense = true;
              this.associateId = "";  //assoicate id empty string for BANK_LICENSE
            }  
             //else if response data is jpeg or png
            else{
            this.fileBankLicenseData[index] = binaryData; 
            this.showBankLicense = false; 
            this.showOtherFormatBankLicense = false;  //object tag
            this.showImageBankLicense = true; //img tag
            this.uploadIconBankLicense = false;
            this.showBankLicenseInput = true;
            this.disableBankLicenseInput = false;
            this.reuploadBankLicense = false;
            this.associateId = ""; //assoicate id empty string for BANK_LICENSE
            this.loadBankLicense = false;
            }
            });
             
            }
            if (documentName == "TRADE_LICENSE") {
              this.loadTradeLicense = true;
              this.reuploadTradeLicense = false;
              this.documentId = this.tradeLicenseDocObj[0].docId;
              this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
              this.documentInquiry = data;
              let binaryData = data.documentData;
        
              let base64 = await fetch(binaryData);
        
              let blob = await base64.blob();
           
              const blobUrl = URL.createObjectURL(blob);
           
              console.log(blob);
              if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                  width: '1380px',
                  height: '720px',
                  panelClass: 'custom-modalbox',
                  data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                });
                this.callApplicationInquiryApi(applicationStatus) ;
                this.showImageTradeLicense = false; //img tag
                this.showOtherFormatTradeLicense = true;  //object tag
                this.pdfUrlTradeLicense = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                this.loadTradeLicense = false;
                this.showTradeLicense = false;
                this.uploadIconTradeLicense = false;
                this.showTradeLicenseInput = false; //we need to false the showTradeLicenseInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                this.reuploadTradeLicense = true;
                this.associateId = "";  //assoicate id empty string for TRADE_LICENSE
              }  
               //else if response data is jpeg or png
              else{
              this.fileTradeLicenseData[index] = binaryData; 
              this.showTradeLicense = false; 
              this.showOtherFormatTradeLicense = false;  //object tag
              this.showImageTradeLicense = true; //img tag
              this.uploadIconTradeLicense = false;
              this.showTradeLicenseInput = true;
              this.disableTradeLicenseInput = false;
              this.reuploadTradeLicense = false;
              this.associateId = ""; //assoicate id empty string for TRADE_LICENSE
              this.loadTradeLicense = false;
              }
              });
               
              }      
              if (documentName == "AML_POLICY_AND_PROCEDURES") {
                this.loadAmlPolicyAndProcedures = true;
                this.reuploadAmlPolicyAndProcedures = false;
                this.documentId = this.amlPolicyAndProceduresDocObj[0].docId;
                this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
                this.documentInquiry = data;
                let binaryData = data.documentData;
          
                let base64 = await fetch(binaryData);
          
                let blob = await base64.blob();
             
                const blobUrl = URL.createObjectURL(blob);
             
                console.log(blob);
                if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                    width: '1380px',
                    height: '720px',
                    panelClass: 'custom-modalbox',
                    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                  });
                  this.callApplicationInquiryApi(applicationStatus) ;
                  this.showImageAmlPolicyAndProcedures = false; //img tag
                  this.showOtherFormatAmlPolicyAndProcedures = true;  //object tag
                  this.pdfUrlAmlPolicyAndProcedures = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                  this.loadAmlPolicyAndProcedures = false;
                  this.showAmlPolicyAndProcedures = false;
                  this.uploadIconAmlPolicyAndProcedures = false;
                  this.showAmlPolicyAndProceduresInput = false; //we need to false the showAmlPolicyAndProceduresInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                  this.reuploadAmlPolicyAndProcedures = true;
                  this.associateId = "";  //assoicate id empty string for AML_POLICY_AND_PROCEDURES
                }  
                 //else if response data is jpeg or png
                else{
                this.fileAmlPolicyAndProceduresData[index] = binaryData; 
                this.showAmlPolicyAndProcedures = false; 
                this.showOtherFormatAmlPolicyAndProcedures = false;  //object tag
                this.showImageAmlPolicyAndProcedures = true; //img tag
                this.uploadIconAmlPolicyAndProcedures = false;
                this.showAmlPolicyAndProceduresInput = true;
                this.disableAmlPolicyAndProceduresInput = false;
                this.reuploadAmlPolicyAndProcedures = false;
                this.associateId = ""; //assoicate id empty string for AML_POLICY_AND_PROCEDURES
                this.loadAmlPolicyAndProcedures = false;
                }
                });
                 
                }
                if (documentName == "AUDIT_REPORT") {
                  this.loadAuditReport = true;
                  this.reuploadAuditReport = false;
                  this.documentId = this.auditReportDocObj[0].docId;
                  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
                  this.documentInquiry = data;
                  let binaryData = data.documentData;
            
                  let base64 = await fetch(binaryData);
            
                  let blob = await base64.blob();
               
                  const blobUrl = URL.createObjectURL(blob);
               
                  console.log(blob);
                  if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                    this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                      width: '1380px',
                      height: '720px',
                      panelClass: 'custom-modalbox',
                      data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                    });
                    this.callApplicationInquiryApi(applicationStatus) ;
                    this.showImageAuditReport = false; //img tag
                    this.showOtherFormatAuditReport = true;  //object tag
                    this.pdfUrlAuditReport = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                    this.loadAuditReport = false;
                    this.showAuditReport = false;
                    this.uploadIconAuditReport = false;
                    this.showAuditReportInput = false; //we need to false the showAuditReportInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                    this.reuploadAuditReport = true;
                    this.associateId = "";  //assoicate id empty string for AUDIT_REPORT
                  }  
                   //else if response data is jpeg or png
                  else{
                  this.fileAuditReportData[index] = binaryData; 
                  this.showAuditReport = false; 
                  this.showOtherFormatAuditReport = false;  //object tag
                  this.showImageAuditReport = true; //img tag
                  this.uploadIconAuditReport = false;
                  this.showAuditReportInput = true;
                  this.disableAuditReportInput = false;
                  this.reuploadAuditReport = false;
                  this.associateId = ""; //assoicate id empty string for AUDIT_REPORT
                  this.loadAuditReport = false;
                  }
                  });
                   
                  }
                  if (documentName == "LATEST_AML_AUDIT_REPORT") {
                    this.loadAmlAuditReport = true;
                    this.reuploadAmlAuditReport = false;
                    this.documentId = this.amlAuditReportDocObj[0].docId;
                    this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
                    this.documentInquiry = data;
                    let binaryData = data.documentData;
              
                    let base64 = await fetch(binaryData);
              
                    let blob = await base64.blob();
                 
                    const blobUrl = URL.createObjectURL(blob);
                 
                    console.log(blob);
                    if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                      this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                        width: '1380px',
                        height: '720px',
                        panelClass: 'custom-modalbox',
                        data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                      });
                      this.callApplicationInquiryApi(applicationStatus) ;
                      this.showImageAmlAuditReport = false; //img tag
                      this.showOtherFormatAmlAuditReport = true;  //object tag
                      this.pdfUrlAmlAuditReport = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                      this.loadAmlAuditReport = false;
                      this.showAmlAuditReport = false;
                      this.uploadIconAmlAuditReport = false;
                      this.showAmlAuditReportInput = false; //we need to false the showAmlAuditReportInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                      this.reuploadAmlAuditReport = true;
                      this.associateId = "";  //assoicate id empty string for LATEST_AML_AUDIT_REPORT
                    }  
                     //else if response data is jpeg or png
                    else{
                    this.fileAmlAuditReportData[index] = binaryData; 
                    this.showAmlAuditReport = false; 
                    this.showOtherFormatAmlAuditReport = false;  //object tag
                    this.showImageAmlAuditReport = true; //img tag
                    this.uploadIconAmlAuditReport = false;
                    this.showAmlAuditReportInput = true;
                    this.disableAmlAuditReportInput = false;
                    this.reuploadAmlAuditReport = false;
                    this.associateId = ""; //assoicate id empty string for LATEST_AML_AUDIT_REPORT
                    this.loadAmlAuditReport = false;
                    }
                    });
                     
                    }            
                    if (documentName == "LATEST_ORGANISATION_STRUCTURE") {
                      this.loadOrganisationStructure = true;
                      this.reuploadOrganisationStructure = false;
                      this.documentId = this.organisationStructureDocObj[0].docId;
                      this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
                      this.documentInquiry = data;
                      let binaryData = data.documentData;
                
                      let base64 = await fetch(binaryData);
                
                      let blob = await base64.blob();
                   
                      const blobUrl = URL.createObjectURL(blob);
                   
                      console.log(blob);
                      if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                        this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                          width: '1380px',
                          height: '720px',
                          panelClass: 'custom-modalbox',
                          data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                        });
                        this.callApplicationInquiryApi(applicationStatus) ;
                        this.showImageOrganisationStructure = false; //img tag
                        this.showOtherFormatOrganisationStructure = true;  //object tag
                        this.pdfUrlOrganisationStructure = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                        this.loadOrganisationStructure = false;
                        this.showOrganisationStructure = false;
                        this.uploadIconOrganisationStructure = false;
                        this.showOrganisationStructureInput = false; //we need to false the showOrganisationStructureInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                        this.reuploadOrganisationStructure = true;
                        this.associateId = "";  //assoicate id empty string for LATEST_ORGANISATION_STRUCTURE
                      }  
                       //else if response data is jpeg or png
                      else{
                      this.fileOrganisationStructureData[index] = binaryData; 
                      this.showOrganisationStructure = false; 
                      this.showOtherFormatOrganisationStructure = false;  //object tag
                      this.showImageOrganisationStructure = true; //img tag
                      this.uploadIconOrganisationStructure = false;
                      this.showOrganisationStructureInput = true;
                      this.disableOrganisationStructureInput = false;
                      this.reuploadOrganisationStructure = false;
                      this.associateId = ""; //assoicate id empty string for LATEST_ORGANISATION_STRUCTURE
                      this.loadOrganisationStructure = false;
                      }
                      });
                       
                      }  
                      if (documentName == "MANAGEMENT_LIST") {
                        this.loadManagementList = true;
                        this.reuploadManagementList = false;
                        this.documentId = this.managementListDocObj[0].docId;
                        this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
                        this.documentInquiry = data;
                        let binaryData = data.documentData;
                  
                        let base64 = await fetch(binaryData);
                  
                        let blob = await base64.blob();
                     
                        const blobUrl = URL.createObjectURL(blob);
                     
                        console.log(blob);
                        if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                          this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                            width: '1380px',
                            height: '720px',
                            panelClass: 'custom-modalbox',
                            data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                          });
                          this.callApplicationInquiryApi(applicationStatus) ;
                          this.showImageManagementList = false; //img tag
                          this.showOtherFormatManagementList = true;  //object tag
                          this.pdfUrlManagementList = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                          this.loadManagementList = false;
                          this.showManagementList = false;
                          this.uploadIconManagementList = false;
                          this.showManagementListInput = false; //we need to false the showOrganisationStructureInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                          this.reuploadManagementList = true;
                          this.associateId = "";  //assoicate id empty string for MANAGEMENT_LIST
                        }  
                         //else if response data is jpeg or png
                        else{
                        this.fileManagementListData[index] = binaryData; 
                        this.showManagementList = false; 
                        this.showOtherFormatManagementList = false;  //object tag
                        this.showImageManagementList = true; //img tag
                        this.uploadIconManagementList = false;
                        this.showManagementListInput = true;
                        this.disableManagementListInput = false;
                        this.reuploadManagementList = false;
                        this.associateId = ""; //assoicate id empty string for MANAGEMENT_LIST
                        this.loadManagementList = false;
                        }
                        });
                         
                        }  
                        if (documentName == "ID_COPIES") {
                          this.loadIdCopies = true;
                          this.reuploadIdCopies = false;
                          this.documentId = this.idCopiesDocObj[0].docId;
                          this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
                          this.documentInquiry = data;
                          let binaryData = data.documentData;
                    
                          let base64 = await fetch(binaryData);
                    
                          let blob = await base64.blob();
                       
                          const blobUrl = URL.createObjectURL(blob);
                       
                          console.log(blob);
                          if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                            this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                              width: '1380px',
                              height: '720px',
                              panelClass: 'custom-modalbox',
                              data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                            });
                            this.callApplicationInquiryApi(applicationStatus) ;
                            this.showImageIdCopies = false; //img tag
                            this.showOtherFormatIdCopies = true;  //object tag
                            this.pdfUrlIdCopies = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                            this.loadIdCopies = false;
                            this.showIdCopies = false;
                            this.uploadIconIdCopies = false;
                            this.showIdCopiesInput = false; //we need to false the showOrganisationStructureInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                            this.reuploadIdCopies = true;
                            this.associateId = "";  //assoicate id empty string for MANAGEMENT_LIST
                          }  
                           //else if response data is jpeg or png
                          else{
                          this.fileIdCopiesData[index] = binaryData; 
                          this.showIdCopies = false; 
                          this.showOtherFormatIdCopies = false;  //object tag
                          this.showImageIdCopies = true; //img tag
                          this.uploadIconIdCopies = false;
                          this.showIdCopiesInput = true;
                          this.disableIdCopiesInput = false;
                          this.reuploadIdCopies = false;
                          this.associateId = ""; //assoicate id empty string for MANAGEMENT_LIST
                          this.loadIdCopies = false;
                          }
                          });
                           
                          }  
                          if (documentName == "KYC_FORM") {
                            this.loadKycForm = true;
                            this.reuploadKycForm = false;
                            this.documentId = this.kycFormDocObj[0].docId;
                            this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
                            this.documentInquiry = data;
                            let binaryData = data.documentData;
                      
                            let base64 = await fetch(binaryData);
                      
                            let blob = await base64.blob();
                         
                            const blobUrl = URL.createObjectURL(blob);
                         
                            console.log(blob);
                            if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                              this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                                width: '1380px',
                                height: '720px',
                                panelClass: 'custom-modalbox',
                                data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                              });
                              this.callApplicationInquiryApi(applicationStatus) ;
                              this.showImageKycForm = false; //img tag
                              this.showOtherFormatKycForm = true;  //object tag
                              this.pdfUrlKycForm = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                              this.loadKycForm = false;
                              this.showKycForm = false;
                              this.uploadIconKycForm = false;
                              this.showKycFormInput = false; //we need to false the showOrganisationStructureInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                              this.reuploadKycForm = true;
                              this.associateId = "";  //assoicate id empty string for KYC_FORM
                            }  
                             //else if response data is jpeg or png
                            else{
                            this.fileKycFormData[index] = binaryData; 
                            this.showKycForm = false; 
                            this.showOtherFormatKycForm = false;  //object tag
                            this.showImageKycForm = true; //img tag
                            this.uploadIconKycForm = false;
                            this.showKycFormInput = true;
                            this.disableKycFormInput = false;
                            this.reuploadKycForm = false;
                            this.associateId = ""; //assoicate id empty string for KYC_FORM
                            this.loadKycForm = false;
                            }
                            });
                             
                            }  
                            if (documentName == "WOLFSBERG_FORM") {
                              this.loadWolfsbergForm = true;
                              this.reuploadWolfsbergForm = false;
                              this.documentId = this.wolfsbergFormDocObj[0].docId;
                              this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
                              this.documentInquiry = data;
                              let binaryData = data.documentData;
                        
                              let base64 = await fetch(binaryData);
                        
                              let blob = await base64.blob();
                           
                              const blobUrl = URL.createObjectURL(blob);
                           
                              console.log(blob);
                              if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                                this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                                  width: '1380px',
                                  height: '720px',
                                  panelClass: 'custom-modalbox',
                                  data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                                });
                                this.callApplicationInquiryApi(applicationStatus) ;
                                this.showImageWolfsbergForm = false; //img tag
                                this.showOtherFormatWolfsbergForm = true;  //object tag
                                this.pdfUrlWolfsbergForm = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                                this.loadWolfsbergForm = false;
                                this.showWolfsbergForm = false;
                                this.uploadIconWolfsbergForm = false;
                                this.showWolfsbergFormInput = false; //we need to false the showOrganisationStructureInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                                this.reuploadWolfsbergForm = true;
                                this.associateId = "";  //assoicate id empty string for WOLFSBERG_FORM
                              }  
                               //else if response data is jpeg or png
                              else{
                              this.fileWolfsbergFormData[index] = binaryData; 
                              this.showWolfsbergForm = false; 
                              this.showOtherFormatWolfsbergForm = false;  //object tag
                              this.showImageWolfsbergForm = true; //img tag
                              this.uploadIconWolfsbergForm = false;
                              this.showWolfsbergFormInput = true;
                              this.disableWolfsbergFormInput = false;
                              this.reuploadWolfsbergForm = false;
                              this.associateId = ""; //assoicate id empty string for WOLFSBERG_FORM
                              this.loadWolfsbergForm = false;
                              }
                              });
                               
                              }  

                              if (documentName == "ONBOARDING_DOCUMENT") {
                                this.loadOnboardingDoc = true;
                                this.reuploadOnboardingDoc = false;
                                this.documentId = this.onboardingDocObj[0].docId;
                                this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
                                this.documentInquiry = data;
                                let binaryData = data.documentData;
                          
                                let base64 = await fetch(binaryData);
                          
                                let blob = await base64.blob();
                             
                                const blobUrl = URL.createObjectURL(blob);
                             
                                console.log(blob);
                                if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                                  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                                    width: '1380px',
                                    height: '720px',
                                    panelClass: 'custom-modalbox',
                                    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                                  });
                                  this.callApplicationInquiryApi(applicationStatus) ;
                                  this.showImageOnboardingDoc = false; //img tag
                                  this.showOtherFormatOnboardingDoc = true;  //object tag
                                  this.pdfUrlOnboardingDoc = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                                  this.loadOnboardingDoc = false;
                                  this.showOnboardingDoc = false;
                                  this.uploadIconOnboardingDoc = false;
                                  this.showOnboardingDocInput = false; //we need to false the showOnboardingDocInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                                  this.reuploadOnboardingDoc = true;
                                  this.associateId = "";  //assoicate id empty string for ONBOARDING_DOCUMENT
                                  
                                }  
                                 //else if response data is jpeg or png
                                else{
                                this.fileOnboardingDocData[index] = binaryData; 
                                this.showOnboardingDoc = false; 
                                this.showOtherFormatOnboardingDoc = false;  //object tag
                                this.showImageOnboardingDoc = true; //img tag
                                this.uploadIconOnboardingDoc = false;
                                this.showOnboardingDocInput = true;
                                this.disableOnboardingDocInput = false;
                                this.reuploadOnboardingDoc = false;
                                this.associateId = ""; //assoicate id empty string for ONBOARDING_DOCUMENT
                                this.loadOnboardingDoc = false;
                                }
                                });
                                 
                                }  

      if (documentName == "OWNER_NRIC") {
        this.loadOWNER[index] = true;
      this.reuploadOwner[index] = false;
      let getDocId = this.combinedOwnerData.filter(v => v.ownerNodeIndex == index);
      this.documentId = getDocId[0].documentId;
      console.log(this.documentId);
        this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
          this.documentInquiry = data;
      let binaryData = data.documentData;

      
      let base64 = await fetch(binaryData);

      let blob = await base64.blob();
   
      const blobUrl = URL.createObjectURL(blob);
   
      console.log(blob);
      if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
        this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
          width: '1380px',
          height: '720px',
          panelClass: 'custom-modalbox',
          data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
        });
        this.callApplicationInquiryApi(applicationStatus) ;
          this.showImageOwner[index] = false; //img tag
          this.showOtherFormatOwner[index] = true;  //object tag
          this.pdfUrlOwner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
          this.loadOWNER[index] = false;
          this.showOWNER[index] = false;
          this.showOwnerInput[index] = false; //we need to false the showOwnerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
          this.uploadIconOWNER[index] = false;
          this.reuploadOwner[index] = true;
          const selectedOwner = this.owners[index];// Retrieve the associateId based on the index
          this.associateId = selectedOwner.associateId;
          console.log(this.associateId);
      }
      else{
      this.fileOwnerData[index] = binaryData; 
      this.showOWNER[index] = false; 
      this.showOtherFormatOwner[index] = false;  //object tag
      this.showImageOwner[index] = true; //img tag
      this.uploadIconOWNER[index] = false;
      this.showOwnerInput[index] = true; 
      this.disableOwnerInput[index] = false;
      this.reuploadOwner[index] = false;
      this.loadOWNER[index] = false;
          const selectedOwner = this.owners[index];// Retrieve the associateId based on the index
          this.associateId = selectedOwner.associateId;
          console.log(this.associateId);
      }
        });
      }
      //block will execute (PDF) - DEALER NRIC
      if (documentName == "DEALER_NRIC") {
        this.loadDEALER[index] = true;
      this.reuploadDealer[index] = false;
      let getDocId = this.combinedDealerData.filter(v => v.dealerNodeIndex == index);
      this.documentId = getDocId[0].documentId;
      console.log(this.documentId);
      this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
      this.documentInquiry = data;
      let binaryData = data.documentData;

      let base64 = await fetch(binaryData);

      let blob = await base64.blob();
   
      const blobUrl = URL.createObjectURL(blob);
   
      console.log(blob);
      if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
        this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
          width: '1380px',
          height: '720px',
          panelClass: 'custom-modalbox',
          data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
        });
        this.callApplicationInquiryApi(applicationStatus) ;
        this.showImageDealer[index] = false; //img tag
        this.showOtherFormatDealer[index] = true;  //object tag
        this.pdfUrlDealer[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.loadDEALER[index] = false;
        this.showDEALER[index] = false;
        this.showDealerInput[index] = false; //we need to false the showDealerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
        this.uploadIconDEALER[index] = false;
        this.reuploadDealer[index] = true;
        const selectedDealer = this.dealers[index]; // Retrieve the associateId based on the index
        this.associateId = selectedDealer.associateId;
        console.log(this.associateId);
      }
      else{
        this.fileDealerData[index] = binaryData; 
        this.showDEALER[index] = false; 
        this.showOtherFormatDealer[index] = false;  //object tag
        this.showImageDealer[index] = true; //img tag
        this.uploadIconDEALER[index] = false;
        this.showDealerInput[index] = true;
        this.disableDealerInput[index] = false;
        this.reuploadDealer[index] = false;
        this.loadDEALER[index] = false;
          const selectedDealer = this.dealers[index]; // Retrieve the associateId based on the index
          this.associateId = selectedDealer.associateId;
          console.log(this.associateId);
      }
     
      });
      }
      //block will execute (PDF) - RUNNER NRIC
      if (documentName == "RUNNER_NRIC") {
        this.loadRUNNER[index] = true;
      this.reuploadRunner[index] = false;
      let getDocId = this.combinedRunnerData.filter(v => v.runnerNodeIndex == index);
      this.documentId = getDocId[0].documentId;
      console.log(this.documentId);
      this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
        this.documentInquiry = data;
        let binaryData = data.documentData;

        let base64 = await fetch(binaryData);

        let blob = await base64.blob();
     
        const blobUrl = URL.createObjectURL(blob);
     
        console.log(blob);
        if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
          this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
            width: '1380px',
            height: '720px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
          });
          this.callApplicationInquiryApi(applicationStatus) ;
        this.showImageRunner[index] = false; //img tag
        this.showOtherFormatRunner[index] = true;  //object tag
        this.pdfUrlRunner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.loadRUNNER[index] = false;
        this.showRUNNER[index] = false;
        this.showRunnerInput[index] = false; //we need to false the showRunnerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
        this.uploadIconRUNNER[index] = false;
        this.reuploadRunner[index] = true;
        const selectedRunner = this.runners[index];// Retrieve the associateId based on the index
        this.associateId = selectedRunner.associateId;
        console.log(this.associateId);
        }
        else{
          this.fileRunnerData[index] = binaryData; 
          this.showRUNNER[index] = false; 
          this.showOtherFormatRunner[index] = false;  //object tag
          this.showImageRunner[index] = true; //img tag
          this.uploadIconRUNNER[index] = false;
          this.showRunnerInput[index] = true;
          this.disableRunnerInput[index] = false;
          this.reuploadRunner[index] = false;
          this.loadRUNNER[index] = false;
          const selectedRunner = this.runners[index];// Retrieve the associateId based on the index
          this.associateId = selectedRunner.associateId;
          console.log(this.associateId);
        }
      });
      }
     }
     else if(customerStatus == "ACTIVE"  || applicationStatus == "PENDING" || applicationStatus == "REJECTED" ||  this.flowEntryPoint == "BACKOFFICEMOBILE-ALLSTATUS" || isBackofficeCustomerSearchCustomerId != ""){
      if (documentName == "ACRA") {
       // this.loadACRA = true;
       // this.showEditInfoAcra = false;
       this.isScreenLoader = true ;
        if(isBackofficeCustomerSearchCustomerId != ""){
          this.isDisableEditAcra = false ;
        }
      this.documentId = this.acraDocObj[0].docId;
      this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
        this.isScreenLoader = false ;
        this.documentInquiry = data;
        let binaryData = data.documentData;

        let base64 = await fetch(binaryData);

        let blob = await base64.blob();
     
        const blobUrl = URL.createObjectURL(blob);
     
        console.log(blob);
        if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
          this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
            width: '1380px',
            height: '720px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
          });
          this.callApplicationInquiryApi(applicationStatus) ;
          this.showImageAcra = false; //img tag
          this.showOtherFormatAcra = true;  //object tag
          this.pdfUrlAcra = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
          this.loadACRA = false;
          this.showACRA = false;
          this.disableAcraInput = true;
          this.uploadIconACRA = false;
          this.showAcraInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
          this.reuploadAcra = false;
          this.associateId = "";  //assoicate id empty string for ACRA
        }  
    else{
      this.fileAcraData[index] = binaryData; 
      this.showOtherFormatAcra = false;  //object tag
      this.showImageAcra = true; //img tag
      this.uploadIconACRA = false;
      this.showAcraInput = false;
      this.disableAcraInput = true;
      this.reuploadAcra = false;
      this.showACRA = false;
      this.associateId = ""; //assoicate id empty string for ACRA
      //this.loadACRA = false;
     
    }
     
      });
      }
      // NEW 12 DOCUMENTS
      if (documentName == "INCORPORATION_CERTIFICATE") {
        this.isScreenLoader = true ;
         if(isBackofficeCustomerSearchCustomerId != ""){
           this.isDisableEditIncorporationCert = false ;
         }
       this.documentId = this.incorporationCertDocObj[0].docId;
       this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
         this.isScreenLoader = false ;
         this.documentInquiry = data;
         let binaryData = data.documentData;
 
         let base64 = await fetch(binaryData);
 
         let blob = await base64.blob();
      
         const blobUrl = URL.createObjectURL(blob);
      
         console.log(blob);
         if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
           this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
             width: '1380px',
             height: '720px',
             panelClass: 'custom-modalbox',
             data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
           });
           this.callApplicationInquiryApi(applicationStatus) ;
           this.showImageIncorporationCert = false; //img tag
           this.showOtherFormatIncorporationCert = true;  //object tag
           this.pdfUrlIncorporationCert = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
           this.loadIncorporationCert = false;
           this.showIncorporationCert = false;
           this.disableIncorporationCertInput = true;
           this.uploadIconIncorporationCert = false;
           this.showIncorporationCertInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
           this.reuploadIncorporationCert = false;
           this.associateId = "";  //assoicate id empty string for INCORPORATION_CERTIFICATE
         }  
     else{
       this.fileIncorporationCertData[index] = binaryData; 
       this.showOtherFormatIncorporationCert = false;  //object tag
       this.showImageIncorporationCert = true; //img tag
       this.uploadIconIncorporationCert = false;
       this.showIncorporationCertInput = false;
       this.disableIncorporationCertInput = true;
       this.reuploadIncorporationCert = false;
       this.showIncorporationCert = false;
       this.associateId = ""; //assoicate id empty string for INCORPORATION_CERTIFICATE
      
     }
      
       });
       }
       if (documentName == "ARTICLES_ASSOCIATION") {
        this.isScreenLoader = true ;
         if(isBackofficeCustomerSearchCustomerId != ""){
           this.isDisableEditArticlesAssociation = false ;
         }
       this.documentId = this.articlesAssociationDocObj[0].docId;
       this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
         this.isScreenLoader = false ;
         this.documentInquiry = data;
         let binaryData = data.documentData;
 
         let base64 = await fetch(binaryData);
 
         let blob = await base64.blob();
      
         const blobUrl = URL.createObjectURL(blob);
      
         console.log(blob);
         if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
           this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
             width: '1380px',
             height: '720px',
             panelClass: 'custom-modalbox',
             data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
           });
           this.callApplicationInquiryApi(applicationStatus) ;
           this.showImageArticlesAssociation = false; //img tag
           this.showOtherFormatArticlesAssociation = true;  //object tag
           this.pdfUrlArticlesAssociation = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
           this.loadArticlesAssociation = false;
           this.showArticlesAssociation = false;
           this.disableArticlesAssociationInput = true;
           this.uploadIconArticlesAssociation = false;
           this.showArticlesAssociationInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
           this.reuploadArticlesAssociation = false;
           this.associateId = "";  //assoicate id empty string for ARTICLES_ASSOCIATION
         }  
     else{
       this.fileArticlesAssociationData[index] = binaryData; 
       this.showOtherFormatArticlesAssociation = false;  //object tag
       this.showImageArticlesAssociation = true; //img tag
       this.uploadIconArticlesAssociation = false;
       this.showArticlesAssociationInput = false;
       this.disableArticlesAssociationInput = true;
       this.reuploadArticlesAssociation = false;
       this.showArticlesAssociation = false;
       this.associateId = ""; //assoicate id empty string for ARTICLES_ASSOCIATION
      
     }
      
       });
       }
       if (documentName == "BANK_LICENSE") {
        this.isScreenLoader = true ;
         if(isBackofficeCustomerSearchCustomerId != ""){
           this.isDisableEditBankLicense = false ;
         }
       this.documentId = this.bankLicenseDocObj[0].docId;
       this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
         this.isScreenLoader = false ;
         this.documentInquiry = data;
         let binaryData = data.documentData;
 
         let base64 = await fetch(binaryData);
 
         let blob = await base64.blob();
      
         const blobUrl = URL.createObjectURL(blob);
      
         console.log(blob);
         if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
           this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
             width: '1380px',
             height: '720px',
             panelClass: 'custom-modalbox',
             data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
           });
           this.callApplicationInquiryApi(applicationStatus) ;
           this.showImageBankLicense = false; //img tag
           this.showOtherFormatBankLicense = true;  //object tag
           this.pdfUrlBankLicense = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
           this.loadBankLicense = false;
           this.showBankLicense = false;
           this.disableBankLicenseInput = true;
           this.uploadIconBankLicense = false;
           this.showBankLicenseInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
           this.reuploadBankLicense = false;
           this.associateId = "";  //assoicate id empty string for BANK_LICENSE
         }  
     else{
       this.fileBankLicenseData[index] = binaryData; 
       this.showOtherFormatBankLicense = false;  //object tag
       this.showImageBankLicense = true; //img tag
       this.uploadIconBankLicense = false;
       this.showBankLicenseInput = false;
       this.disableBankLicenseInput = true;
       this.reuploadBankLicense = false;
       this.showBankLicense = false;
       this.associateId = ""; //assoicate id empty string for BANK_LICENSE
      
     }
      
       });
       }
       if (documentName == "TRADE_LICENSE") {
        this.isScreenLoader = true ;
         if(isBackofficeCustomerSearchCustomerId != ""){
           this.isDisableEditTradeLicense = false ;
         }
       this.documentId = this.tradeLicenseDocObj[0].docId;
       this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
         this.isScreenLoader = false ;
         this.documentInquiry = data;
         let binaryData = data.documentData;
 
         let base64 = await fetch(binaryData);
 
         let blob = await base64.blob();
      
         const blobUrl = URL.createObjectURL(blob);
      
         console.log(blob);
         if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
           this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
             width: '1380px',
             height: '720px',
             panelClass: 'custom-modalbox',
             data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
           });
           this.callApplicationInquiryApi(applicationStatus) ;
           this.showImageTradeLicense = false; //img tag
           this.showOtherFormatTradeLicense = true;  //object tag
           this.pdfUrlTradeLicense = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
           this.loadTradeLicense = false;
           this.showTradeLicense = false;
           this.disableTradeLicenseInput = true;
           this.uploadIconTradeLicense = false;
           this.showTradeLicenseInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
           this.reuploadTradeLicense = false;
           this.associateId = "";  //assoicate id empty string for BANK_LICENSE
         }  
     else{
       this.fileTradeLicenseData[index] = binaryData; 
       this.showOtherFormatTradeLicense = false;  //object tag
       this.showImageTradeLicense = true; //img tag
       this.uploadIconTradeLicense = false;
       this.showTradeLicenseInput = false;
       this.disableTradeLicenseInput = true;
       this.reuploadTradeLicense = false;
       this.showTradeLicense = false;
       this.associateId = ""; //assoicate id empty string for BANK_LICENSE
      
     }
      
       });
       }
       if (documentName == "AML_POLICY_AND_PROCEDURES") {
        this.isScreenLoader = true ;
         if(isBackofficeCustomerSearchCustomerId != ""){
           this.isDisableEditAmlPolicyAndProcedures = false ;
         }
       this.documentId = this.amlPolicyAndProceduresDocObj[0].docId;
       this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
         this.isScreenLoader = false ;
         this.documentInquiry = data;
         let binaryData = data.documentData;
 
         let base64 = await fetch(binaryData);
 
         let blob = await base64.blob();
      
         const blobUrl = URL.createObjectURL(blob);
      
         console.log(blob);
         if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
           this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
             width: '1380px',
             height: '720px',
             panelClass: 'custom-modalbox',
             data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
           });
           this.callApplicationInquiryApi(applicationStatus) ;
           this.showImageAmlPolicyAndProcedures = false; //img tag
           this.showOtherFormatAmlPolicyAndProcedures = true;  //object tag
           this.pdfUrlAmlPolicyAndProcedures = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
           this.loadAmlPolicyAndProcedures = false;
           this.showAmlPolicyAndProcedures = false;
           this.disableAmlPolicyAndProceduresInput = true;
           this.uploadIconAmlPolicyAndProcedures = false;
           this.showAmlPolicyAndProceduresInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
           this.reuploadAmlPolicyAndProcedures = false;
           this.associateId = "";  //assoicate id empty string for AML_POLICY_AND_PROCEDURES
         }  
     else{
       this.fileAmlPolicyAndProceduresData[index] = binaryData; 
       this.showOtherFormatAmlPolicyAndProcedures = false;  //object tag
       this.showImageAmlPolicyAndProcedures = true; //img tag
       this.uploadIconAmlPolicyAndProcedures = false;
       this.showAmlPolicyAndProceduresInput = false;
       this.disableAmlPolicyAndProceduresInput = true;
       this.reuploadAmlPolicyAndProcedures = false;
       this.showAmlPolicyAndProcedures = false;
       this.associateId = ""; //assoicate id empty string for AML_POLICY_AND_PROCEDURES
      
     }
      
       });
       }
       if (documentName == "AUDIT_REPORT") {
        this.isScreenLoader = true ;
         if(isBackofficeCustomerSearchCustomerId != ""){
           this.isDisableEditAuditReport = false ;
         }
       this.documentId = this.auditReportDocObj[0].docId;
       this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
         this.isScreenLoader = false ;
         this.documentInquiry = data;
         let binaryData = data.documentData;
 
         let base64 = await fetch(binaryData);
 
         let blob = await base64.blob();
      
         const blobUrl = URL.createObjectURL(blob);
      
         console.log(blob);
         if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
           this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
             width: '1380px',
             height: '720px',
             panelClass: 'custom-modalbox',
             data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
           });
           this.callApplicationInquiryApi(applicationStatus) ;
           this.showImageAuditReport = false; //img tag
           this.showOtherFormatAuditReport = true;  //object tag
           this.pdfUrlAuditReport = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
           this.loadAuditReport = false;
           this.showAuditReport = false;
           this.disableAuditReportInput = true;
           this.uploadIconAuditReport = false;
           this.showAuditReportInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
           this.reuploadAuditReport = false;
           this.associateId = "";  //assoicate id empty string for AUDIT_REPORT
         }  
     else{
       this.fileAuditReportData[index] = binaryData; 
       this.showOtherFormatAuditReport = false;  //object tag
       this.showImageAuditReport = true; //img tag
       this.uploadIconAuditReport = false;
       this.showAuditReportInput = false;
       this.disableAuditReportInput = true;
       this.reuploadAuditReport = false;
       this.showAuditReport = false;
       this.associateId = ""; //assoicate id empty string for AUDIT_REPORT
      
     }
      
       });
       }
       if (documentName == "LATEST_AML_AUDIT_REPORT") {
        this.isScreenLoader = true ;
         if(isBackofficeCustomerSearchCustomerId != ""){
           this.isDisableEditAmlAuditReport = false ;
         }
       this.documentId = this.amlAuditReportDocObj[0].docId;
       this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
         this.isScreenLoader = false ;
         this.documentInquiry = data;
         let binaryData = data.documentData;
 
         let base64 = await fetch(binaryData);
 
         let blob = await base64.blob();
      
         const blobUrl = URL.createObjectURL(blob);
      
         console.log(blob);
         if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
           this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
             width: '1380px',
             height: '720px',
             panelClass: 'custom-modalbox',
             data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
           });
           this.callApplicationInquiryApi(applicationStatus) ;
           this.showImageAmlAuditReport = false; //img tag
           this.showOtherFormatAmlAuditReport = true;  //object tag
           this.pdfUrlAmlAuditReport = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
           this.loadAmlAuditReport = false;
           this.showAmlAuditReport = false;
           this.disableAmlAuditReportInput = true;
           this.uploadIconAmlAuditReport = false;
           this.showAmlAuditReportInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
           this.reuploadAmlAuditReport = false;
           this.associateId = "";  //assoicate id empty string for LATEST_AML_AUDIT_REPORT
         }  
     else{
       this.fileAmlAuditReportData[index] = binaryData; 
       this.showOtherFormatAmlAuditReport = false;  //object tag
       this.showImageAmlAuditReport = true; //img tag
       this.uploadIconAmlAuditReport = false;
       this.showAmlAuditReportInput = false;
       this.disableAmlAuditReportInput = true;
       this.reuploadAmlAuditReport = false;
       this.showAmlAuditReport = false;
       this.associateId = ""; //assoicate id empty string for LATEST_AML_AUDIT_REPORT
      
     }
      
       });
       }
       if (documentName == "LATEST_ORGANISATION_STRUCTURE") {
        this.isScreenLoader = true ;
         if(isBackofficeCustomerSearchCustomerId != ""){
           this.isDisableEditOrganisationStructure = false ;
         }
       this.documentId = this.organisationStructureDocObj[0].docId;
       this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
         this.isScreenLoader = false ;
         this.documentInquiry = data;
         let binaryData = data.documentData;
 
         let base64 = await fetch(binaryData);
 
         let blob = await base64.blob();
      
         const blobUrl = URL.createObjectURL(blob);
      
         console.log(blob);
         if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
           this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
             width: '1380px',
             height: '720px',
             panelClass: 'custom-modalbox',
             data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
           });
           this.callApplicationInquiryApi(applicationStatus) ;
           this.showImageOrganisationStructure = false; //img tag
           this.showOtherFormatOrganisationStructure = true;  //object tag
           this.pdfUrlOrganisationStructure = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
           this.loadOrganisationStructure = false;
           this.showOrganisationStructure = false;
           this.disableOrganisationStructureInput = true;
           this.uploadIconOrganisationStructure = false;
           this.showOrganisationStructureInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
           this.reuploadOrganisationStructure = false;
           this.associateId = "";  //assoicate id empty string for LATEST_ORGANISATION_STRUCTURE
         }  
     else{
       this.fileOrganisationStructureData[index] = binaryData; 
       this.showOtherFormatOrganisationStructure = false;  //object tag
       this.showImageOrganisationStructure = true; //img tag
       this.uploadIconOrganisationStructure = false;
       this.showOrganisationStructureInput = false;
       this.disableOrganisationStructureInput = true;
       this.reuploadOrganisationStructure = false;
       this.showOrganisationStructure = false;
       this.associateId = ""; //assoicate id empty string for LATEST_ORGANISATION_STRUCTURE
      
     }
      
       });
       }
       if (documentName == "MANAGEMENT_LIST") {
        this.isScreenLoader = true ;
         if(isBackofficeCustomerSearchCustomerId != ""){
           this.isDisableEditManagementList = false ;
         }
       this.documentId = this.managementListDocObj[0].docId;
       this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
         this.isScreenLoader = false ;
         this.documentInquiry = data;
         let binaryData = data.documentData;
 
         let base64 = await fetch(binaryData);
 
         let blob = await base64.blob();
      
         const blobUrl = URL.createObjectURL(blob);
      
         console.log(blob);
         if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
           this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
             width: '1380px',
             height: '720px',
             panelClass: 'custom-modalbox',
             data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
           });
           this.callApplicationInquiryApi(applicationStatus) ;
           this.showImageManagementList = false; //img tag
           this.showOtherFormatManagementList = true;  //object tag
           this.pdfUrlManagementList = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
           this.loadManagementList = false;
           this.showManagementList = false;
           this.disableManagementListInput = true;
           this.uploadIconManagementList = false;
           this.showManagementListInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
           this.reuploadManagementList = false;
           this.associateId = "";  //assoicate id empty string for MANAGEMENT_LIST
         }  
     else{
       this.fileManagementListData[index] = binaryData; 
       this.showOtherFormatManagementList = false;  //object tag
       this.showImageManagementList = true; //img tag
       this.uploadIconManagementList = false;
       this.showManagementListInput = false;
       this.disableManagementListInput = true;
       this.reuploadManagementList = false;
       this.showManagementList = false;
       this.associateId = ""; //assoicate id empty string for MANAGEMENT_LIST
      
     }
      
       });
       }
       if (documentName == "ID_COPIES") {
        this.isScreenLoader = true ;
         if(isBackofficeCustomerSearchCustomerId != ""){
           this.isDisableEditIdCopies = false ;
         }
       this.documentId = this.idCopiesDocObj[0].docId;
       this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
         this.isScreenLoader = false ;
         this.documentInquiry = data;
         let binaryData = data.documentData;
 
         let base64 = await fetch(binaryData);
 
         let blob = await base64.blob();
      
         const blobUrl = URL.createObjectURL(blob);
      
         console.log(blob);
         if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
           this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
             width: '1380px',
             height: '720px',
             panelClass: 'custom-modalbox',
             data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
           });
           this.callApplicationInquiryApi(applicationStatus) ;
           this.showImageIdCopies = false; //img tag
           this.showOtherFormatIdCopies = true;  //object tag
           this.pdfUrlIdCopies = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
           this.loadIdCopies = false;
           this.showIdCopies = false;
           this.disableIdCopiesInput = true;
           this.uploadIconIdCopies = false;
           this.showIdCopiesInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
           this.reuploadIdCopies = false;
           this.associateId = "";  //assoicate id empty string for ID_COPIES
         }  
     else{
       this.fileIdCopiesData[index] = binaryData; 
       this.showOtherFormatIdCopies = false;  //object tag
       this.showImageIdCopies = true; //img tag
       this.uploadIconIdCopies = false;
       this.showIdCopiesInput = false;
       this.disableIdCopiesInput = true;
       this.reuploadIdCopies = false;
       this.showIdCopies = false;
       this.associateId = ""; //assoicate id empty string for ID_COPIES
      
     }
      
       });
       }
       if (documentName == "KYC_FORM") {
        this.isScreenLoader = true ;
         if(isBackofficeCustomerSearchCustomerId != ""){
           this.isDisableEditKycForm = false ;
         }
       this.documentId = this.kycFormDocObj[0].docId;
       this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
         this.isScreenLoader = false ;
         this.documentInquiry = data;
         let binaryData = data.documentData;
 
         let base64 = await fetch(binaryData);
 
         let blob = await base64.blob();
      
         const blobUrl = URL.createObjectURL(blob);
      
         console.log(blob);
         if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
           this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
             width: '1380px',
             height: '720px',
             panelClass: 'custom-modalbox',
             data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
           });
           this.callApplicationInquiryApi(applicationStatus) ;
           this.showImageKycForm = false; //img tag
           this.showOtherFormatKycForm = true;  //object tag
           this.pdfUrlKycForm = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
           this.loadKycForm = false;
           this.showKycForm = false;
           this.disableKycFormInput = true;
           this.uploadIconKycForm = false;
           this.showKycFormInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
           this.reuploadKycForm = false;
           this.associateId = "";  //assoicate id empty string for KYC_FORM
         }  
     else{
       this.fileKycFormData[index] = binaryData; 
       this.showOtherFormatKycForm = false;  //object tag
       this.showImageKycForm = true; //img tag
       this.uploadIconKycForm = false;
       this.showKycFormInput = false;
       this.disableKycFormInput = true;
       this.reuploadKycForm = false;
       this.showKycForm = false;
       this.associateId = ""; //assoicate id empty string for KYC_FORM
      
     }
      
       });
       }
       if (documentName == "WOLFSBERG_FORM") {
        this.isScreenLoader = true ;
         if(isBackofficeCustomerSearchCustomerId != ""){
           this.isDisableEditWolfsbergForm = false ;
         }
       this.documentId = this.wolfsbergFormDocObj[0].docId;
       this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
         this.isScreenLoader = false ;
         this.documentInquiry = data;
         let binaryData = data.documentData;
 
         let base64 = await fetch(binaryData);
 
         let blob = await base64.blob();
      
         const blobUrl = URL.createObjectURL(blob);
      
         console.log(blob);
         if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
           this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
             width: '1380px',
             height: '720px',
             panelClass: 'custom-modalbox',
             data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
           });
           this.callApplicationInquiryApi(applicationStatus) ;
           this.showImageWolfsbergForm = false; //img tag
           this.showOtherFormatWolfsbergForm = true;  //object tag
           this.pdfUrlWolfsbergForm = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
           this.loadWolfsbergForm = false;
           this.showWolfsbergForm = false;
           this.disableWolfsbergFormInput = true;
           this.uploadIconWolfsbergForm = false;
           this.showWolfsbergFormInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
           this.reuploadWolfsbergForm = false;
           this.associateId = "";  //assoicate id empty string for KYC_FORM
         }  
     else{
       this.fileWolfsbergFormData[index] = binaryData; 
       this.showOtherFormatWolfsbergForm = false;  //object tag
       this.showImageWolfsbergForm = true; //img tag
       this.uploadIconWolfsbergForm = false;
       this.showWolfsbergFormInput = false;
       this.disableWolfsbergFormInput = true;
       this.reuploadWolfsbergForm = false;
       this.showWolfsbergForm = false;
       this.associateId = ""; //assoicate id empty string for KYC_FORM
      
     }
      
       });
       }

       if (documentName == "ONBOARDING_DOCUMENT") {
        this.isScreenLoader = true ;
         if(isBackofficeCustomerSearchCustomerId != ""){
           this.isDisableEditOnboardingDoc = false ;
         }
       this.documentId = this.onboardingDocObj[0].docId;
       this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
         this.isScreenLoader = false ;
         this.documentInquiry = data;
         let binaryData = data.documentData;
 
         let base64 = await fetch(binaryData);
 
         let blob = await base64.blob();
      
         const blobUrl = URL.createObjectURL(blob);
      
         console.log(blob);
         if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
           this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
             width: '1380px',
             height: '720px',
             panelClass: 'custom-modalbox',
             data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
           });
           this.callApplicationInquiryApi(applicationStatus) ;
           this.showImageOnboardingDoc = false; //img tag
           this.showOtherFormatOnboardingDoc = true;  //object tag
           this.pdfUrlOnboardingDoc = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
           this.loadOnboardingDoc = false;
           this.showOnboardingDoc = false;
           this.disableOnboardingDocInput = true;
           this.uploadIconOnboardingDoc = false;
           this.showOnboardingDocInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
           this.reuploadOnboardingDoc = false;
           this.associateId = "";  //assoicate id empty string for KYC_FORM
         }  
     else{
       this.fileOnboardingDocData[index] = binaryData; 
       this.showOtherFormatOnboardingDoc = false;  //object tag
       this.showImageOnboardingDoc = true; //img tag
       this.uploadIconOnboardingDoc = false;
       this.showOnboardingDocInput = false;
       this.disableOnboardingDocInput = true;
       this.reuploadOnboardingDoc = false;
       this.showOnboardingDoc = false;
       this.associateId = ""; //assoicate id empty string for KYC_FORM
      
     }
      
       });
       }

      if (documentName == "OWNER_NRIC") {
     //   this.loadOWNER[index] = true;
      //  this.showEditInfoOwner[index] = false;
      this.isScreenLoader = true ;
      this.reuploadOwner[index] = false;
      if(isBackofficeCustomerSearchCustomerId != ""){
        this.isDisableEditOwnerNric[index] = false ;
      }
      let getDocId = this.combinedOwnerData.filter(v => v.ownerNodeIndex == index);
      this.documentId = getDocId[0].documentId;
      console.log(this.documentId);
        this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
          this.documentInquiry = data;
          this.isScreenLoader = false ;
          let binaryData = data.documentData;

          let base64 = await fetch(binaryData);

        let blob = await base64.blob();
     
        const blobUrl = URL.createObjectURL(blob);
     
        console.log(blob);
          if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
            this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
              width: '1380px',
              height: '720px',
              panelClass: 'custom-modalbox',
              data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
            });
            this.callApplicationInquiryApi(applicationStatus) ;
              this.showImageOwner[index] = false; //img tag
              this.showOtherFormatOwner[index] = true;  //object tag
              this.pdfUrlOwner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
             // this.loadOWNER[index] = false;
              this.showOWNER[index] = false;
              this.disableOwnerInput[index] = true ;
              this.showOwnerInput[index] = false; //we need to false the showOwnerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.uploadIconOWNER[index] = false;
              this.reuploadOwner[index] = false;
              const selectedOwner = this.owners[index];// Retrieve the associateId based on the index
              this.associateId = selectedOwner.associateId;
              console.log(this.associateId);
          }
else{
  this.fileOwnerData[index] = binaryData; 
  this.showOtherFormatOwner[index] = false;  //object tag
  this.showImageOwner[index] = true; //img tag
  this.uploadIconOWNER[index] = false;
  this.showOwnerInput[index] = false;
  this.disableOwnerInput[index] = true;
  this.reuploadOwner[index] = false;
  //this.loadOWNER[index] = false;
  this.showOWNER[index] = false;
  const selectedOwner = this.owners[index];// Retrieve the associateId based on the index
  this.associateId = selectedOwner.associateId;
  console.log(this.associateId);
}
         
        });
      }
      //block will execute (PDF) - DEALER NRIC
      if (documentName == "DEALER_NRIC") {
      //  this.loadDEALER[index] = true;
      //  this.showEditInfoDealer[index] = false;
      this.reuploadDealer[index] = false;
      if(isBackofficeCustomerSearchCustomerId != ""){
        this.isDisableEditDealerNric[index] = false ;
      }
      this.isScreenLoader = true ;
      let getDocId = this.combinedDealerData.filter(v => v.dealerNodeIndex == index);
      this.documentId = getDocId[0].documentId;
      console.log(this.documentId);
      this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
        this.documentInquiry = data;
        this.isScreenLoader = false ;
        let binaryData = data.documentData;

        let base64 = await fetch(binaryData);

        let blob = await base64.blob();
     
        const blobUrl = URL.createObjectURL(blob);
     
        console.log(blob);
        if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
          this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
            width: '1380px',
            height: '720px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
          });
          this.callApplicationInquiryApi(applicationStatus) ;
          this.showImageDealer[index] = false; //img tag
          this.showOtherFormatDealer[index] = true;  //object tag
          this.pdfUrlDealer[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
         // this.loadDEALER[index] = false;
          this.showDEALER[index] = false;
          this.showDealerInput[index] = false; //we need to false the showDealerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
          this.uploadIconDEALER[index] = false;
          this.reuploadDealer[index] = false;
          this.disableDealerInput[index] = true ;
          const selectedDealer = this.dealers[index]; // Retrieve the associateId based on the index
          this.associateId = selectedDealer.associateId;
          console.log(this.associateId);
        }
        else{
          this.fileDealerData[index] = binaryData; 
          this.showOtherFormatDealer[index] = false;  //object tag
          this.showImageDealer[index] = true; //img tag
          this.uploadIconDEALER[index] = false;
          this.showDealerInput[index] = false;
          this.disableDealerInput[index] = true;
          this.reuploadDealer[index] = false;
          //this.loadDEALER[index] = false;
          this.showDEALER[index] = false;
          const selectedDealer = this.dealers[index]; // Retrieve the associateId based on the index
          this.associateId = selectedDealer.associateId;
          console.log(this.associateId);
        }
        
      });
      }
      //block will execute (PDF) - RUNNER NRIC
      if (documentName == "RUNNER_NRIC") {
      //  this.loadRUNNER[index] = true;
      //  this.showEditInfoRunner[index] = false;
      this.isScreenLoader = true ;
      this.reuploadRunner[index] = false;
      if(isBackofficeCustomerSearchCustomerId != ""){
        this.isDisableEditRunnerNric[index] = false ;
      }
      let getDocId = this.combinedRunnerData.filter(v => v.runnerNodeIndex == index);
      this.documentId = getDocId[0].documentId;
      console.log(this.documentId);
      this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
        this.documentInquiry = data;
        this.isScreenLoader = false ;
        let binaryData = data.documentData;

        let base64 = await fetch(binaryData);

        let blob = await base64.blob();
     
        const blobUrl = URL.createObjectURL(blob);
     
        console.log(blob);
        if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
          this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
            width: '1380px',
            height: '720px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
          });
          this.callApplicationInquiryApi(applicationStatus) ;
        this.showImageRunner[index] = false; //img tag
        this.showOtherFormatRunner[index] = true;  //object tag
        this.pdfUrlRunner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
       // this.loadRUNNER[index] = false;
        this.showRUNNER[index] = false;
        this.showRunnerInput[index] = false; //we need to false the showRunnerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
        this.uploadIconRUNNER[index] = false;
        this.reuploadRunner[index] = false;
        this.disableRunnerInput[index] = true ;
        const selectedRunner = this.runners[index];// Retrieve the associateId based on the index
        this.associateId = selectedRunner.associateId;
        console.log(this.associateId);
        }
        else{
          this.fileRunnerData[index] = binaryData; 
          this.showOtherFormatRunner[index] = false;  //object tag
          this.showImageRunner[index] = true; //img tag
          this.uploadIconRUNNER[index] = false;
          this.showRunnerInput[index] = false;
          this.disableRunnerInput[index] = true;
          this.reuploadRunner[index] = false;
         // this.loadRUNNER[index] = false;
          this.showRUNNER[index] = false;
          const selectedRunner = this.runners[index];// Retrieve the associateId based on the index
          this.associateId = selectedRunner.associateId;
          console.log(this.associateId);
        }
        
      });
      }
     }
    }
  }

  //This is Document onboarding by staff
  else{ //Product code is MC
   //Entry point --> Corporate > Documents > onClick blur image of PDF .
 if(isBlur == "blurPdf"){
  //Corporate "NEW"
   if (documentName == "ACRA") {
     this.loadACRA = true;
   this.documentId = this.acraDocObj[0].docId;
   this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
   this.documentInquiry = data;
   let binaryData = data.documentData;

   let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);

   this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
     width: '1380px',
     height: '720px',
     panelClass: 'custom-modalbox',
     data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
   });
   this.callApplicationInquiryApi(applicationStatus) ;
   this.showImageAcra = false; //img tag
   this.showOtherFormatAcra = true;  //object tag
   this.pdfUrlAcra = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
   this.loadACRA = false;
   this.showACRA = false;
   this.uploadIconACRA = false;
   this.showAcraInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
   this.reuploadAcra = true;
   this.associateId = "";  //assoicate id empty string for ACRA
   });
    
   }
   // NEW 12 DOCUMENTS
   if (documentName == "INCORPORATION_CERTIFICATE") {
    this.loadIncorporationCert = true;
  this.documentId = this.incorporationCertDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageIncorporationCert = false; //img tag
  this.showOtherFormatIncorporationCert = true;  //object tag
  this.pdfUrlIncorporationCert = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadIncorporationCert = false;
  this.showIncorporationCert = false;
  this.uploadIconIncorporationCert = false;
  this.showIncorporationCertInput = false; //we need to false the showIncorporationCertInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadIncorporationCert = true;
  this.associateId = "";  //assoicate id empty string for INCORPORATION_CERTIFICATE
  });
   
  }
  if (documentName == "ARTICLES_ASSOCIATION") {
    this.loadArticlesAssociation = true;
  this.documentId = this.articlesAssociationDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageArticlesAssociation = false; //img tag
  this.showOtherFormatArticlesAssociation = true;  //object tag
  this.pdfUrlArticlesAssociation = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadArticlesAssociation = false;
  this.showArticlesAssociation = false;
  this.uploadIconArticlesAssociation = false;
  this.showArticlesAssociationInput = false; //we need to false the showArticlesAssociationInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadArticlesAssociation = true;
  this.associateId = "";  //assoicate id empty string for INCORPORATION_CERTIFICATE
  });
   
  }
  if (documentName == "BANK_LICENSE") {
    this.loadBankLicense = true;
  this.documentId = this.bankLicenseDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageBankLicense = false; //img tag
  this.showOtherFormatBankLicense = true;  //object tag
  this.pdfUrlBankLicense = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadBankLicense = false;
  this.showBankLicense = false;
  this.uploadIconBankLicense = false;
  this.showBankLicenseInput = false; //we need to false the showBankLicenseInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadBankLicense = true;
  this.associateId = "";  //assoicate id empty string for BANK_LICENSE
  });
   
  }
  if (documentName == "TRADE_LICENSE") {
    this.loadTradeLicense = true;
  this.documentId = this.tradeLicenseDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageTradeLicense = false; //img tag
  this.showOtherFormatTradeLicense = true;  //object tag
  this.pdfUrlTradeLicense = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadTradeLicense = false;
  this.showTradeLicense = false;
  this.uploadIconTradeLicense = false;
  this.showTradeLicenseInput = false; //we need to false the showTradeLicenseInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadTradeLicense = true;
  this.associateId = "";  //assoicate id empty string for TRADE_LICENSE
  });
   
  }
  if (documentName == "AML_POLICY_AND_PROCEDURES") {
    this.loadAmlPolicyAndProcedures = true;
  this.documentId = this.amlPolicyAndProceduresDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageAmlPolicyAndProcedures = false; //img tag
  this.showOtherFormatAmlPolicyAndProcedures = true;  //object tag
  this.pdfUrlAmlPolicyAndProcedures = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadAmlPolicyAndProcedures = false;
  this.showAmlPolicyAndProcedures = false;
  this.uploadIconAmlPolicyAndProcedures = false;
  this.showAmlPolicyAndProceduresInput = false; //we need to false the showAmlPolicyAndProceduresInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadAmlPolicyAndProcedures = true;
  this.associateId = "";  //assoicate id empty string for AML_POLICY_AND_PROCEDURES
  });
   
  }
  if (documentName == "AUDIT_REPORT") {
    this.loadAuditReport = true;
  this.documentId = this.auditReportDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageAuditReport = false; //img tag
  this.showOtherFormatAuditReport = true;  //object tag
  this.pdfUrlAuditReport = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadAuditReport = false;
  this.showAuditReport = false;
  this.uploadIconAuditReport = false;
  this.showAuditReportInput = false; //we need to false the showAmlPolicyAndProceduresInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadAuditReport = true;
  this.associateId = "";  //assoicate id empty string for AUDIT_REPORT
  });
   
  }
  if (documentName == "LATEST_AML_AUDIT_REPORT") {
    this.loadAmlAuditReport = true;
  this.documentId = this.amlAuditReportDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageAmlAuditReport = false; //img tag
  this.showOtherFormatAmlAuditReport = true;  //object tag
  this.pdfUrlAmlAuditReport = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadAmlAuditReport = false;
  this.showAmlAuditReport = false;
  this.uploadIconAmlAuditReport = false;
  this.showAmlAuditReportInput = false; //we need to false the showAmlAuditReportInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadAmlAuditReport = true;
  this.associateId = "";  //assoicate id empty string for LATEST_AML_AUDIT_REPORT
  });
   
  }
  if (documentName == "LATEST_ORGANISATION_STRUCTURE") {
    this.loadOrganisationStructure = true;
  this.documentId = this.organisationStructureDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageOrganisationStructure = false; //img tag
  this.showOtherFormatOrganisationStructure = true;  //object tag
  this.pdfUrlOrganisationStructure = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadOrganisationStructure = false;
  this.showOrganisationStructure = false;
  this.uploadIconOrganisationStructure = false;
  this.showOrganisationStructureInput = false; //we need to false the showOrganisationStructureInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadOrganisationStructure = true;
  this.associateId = "";  //assoicate id empty string for LATEST_ORGANISATION_STRUCTURE
  });
   
  }
  if (documentName == "MANAGEMENT_LIST") {
    this.loadManagementList = true;
  this.documentId = this.managementListDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageManagementList = false; //img tag
  this.showOtherFormatManagementList = true;  //object tag
  this.pdfUrlManagementList = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadManagementList = false;
  this.showManagementList = false;
  this.uploadIconManagementList = false;
  this.showManagementListInput = false; //we need to false the showManagementListInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadManagementList = true;
  this.associateId = "";  //assoicate id empty string for MANAGEMENT_LIST
  });
   
  }
  if (documentName == "ID_COPIES") {
    this.loadIdCopies = true;
  this.documentId = this.idCopiesDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageIdCopies = false; //img tag
  this.showOtherFormatIdCopies = true;  //object tag
  this.pdfUrlIdCopies = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadIdCopies = false;
  this.showIdCopies = false;
  this.uploadIconIdCopies = false;
  this.showIdCopiesInput = false; //we need to false the showOrganisationStructureInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadIdCopies = true;
  this.associateId = "";  //assoicate id empty string for ID_COPIES
  });
   
  }
  if (documentName == "KYC_FORM") {
    this.loadKycForm = true;
  this.documentId = this.kycFormDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageKycForm = false; //img tag
  this.showOtherFormatKycForm = true;  //object tag
  this.pdfUrlKycForm = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadKycForm = false;
  this.showKycForm = false;
  this.uploadIconKycForm = false;
  this.showKycFormInput = false; //we need to false the showOrganisationStructureInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadKycForm = true;
  this.associateId = "";  //assoicate id empty string for ID_COPIES
  });
   
  }
  if (documentName == "WOLFSBERG_FORM") {
    this.loadWolfsbergForm = true;
  this.documentId = this.wolfsbergFormDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageWolfsbergForm = false; //img tag
  this.showOtherFormatWolfsbergForm = true;  //object tag
  this.pdfUrlWolfsbergForm = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadWolfsbergForm = false;
  this.showWolfsbergForm = false;
  this.uploadIconWolfsbergForm = false;
  this.showWolfsbergFormInput = false; //we need to false the showOrganisationStructureInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadWolfsbergForm = true;
  this.associateId = "";  //assoicate id empty string for ID_COPIES
  });
   
  }

  if (documentName == "ONBOARDING_DOCUMENT") {
    this.loadOnboardingDoc = true;
  this.documentId = this.onboardingDocObj[0].docId;
  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
  this.documentInquiry = data;
  let binaryData = data.documentData;

  let base64 = await fetch(binaryData);

  let blob = await base64.blob();

  const blobUrl = URL.createObjectURL(blob);

  console.log(blob);

  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
    width: '1380px',
    height: '720px',
    panelClass: 'custom-modalbox',
    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
  });
  this.callApplicationInquiryApi(applicationStatus) ;
  this.showImageOnboardingDoc = false; //img tag
  this.showOtherFormatOnboardingDoc = true;  //object tag
  this.pdfUrlOnboardingDoc = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  this.loadOnboardingDoc = false;
  this.showOnboardingDoc = false;
  this.uploadIconOnboardingDoc = false;
  this.showOnboardingDocInput = false; //we need to false the showOrganisationStructureInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
  this.reuploadOnboardingDoc = true;
  this.associateId = "";  //assoicate id empty string for ID_COPIES
  });
   
  }

   if (documentName == "OWNER_NRIC") {
     this.loadOWNER[index] = true;
   this.reuploadOwner[index] = false;
   let getDocId = this.combinedOwnerData.filter(v => v.ownerNodeIndex == index);
   this.documentId = getDocId[0].documentId;
   console.log(this.documentId);
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
       let binaryData = data.documentData;

       let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);

       this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
         width: '1380px',
         height: '720px',
         panelClass: 'custom-modalbox',
         data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
       });
       this.callApplicationInquiryApi(applicationStatus) ;
       this.showImageOwner[index] = false; //img tag
       this.showOtherFormatOwner[index] = true;  //object tag
       this.pdfUrlOwner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
       this.loadOWNER[index] = false;
       this.showOWNER[index] = false;
       this.showOwnerInput[index] = false; //we need to false the showOwnerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
       this.uploadIconOWNER[index] = false;
       this.reuploadOwner[index] = true;
       const selectedOwner = this.owners[index];// Retrieve the associateId based on the index
       this.associateId = selectedOwner.associateId;
       console.log(this.associateId);
     });
   }
   //block will execute (PDF) - DEALER NRIC
   if (documentName == "DEALER_NRIC") {
     this.loadDEALER[index] = true;
   this.reuploadDealer[index] = false;
   let getDocId = this.combinedDealerData.filter(v => v.dealerNodeIndex == index);
   this.documentId = getDocId[0].documentId;
   console.log(this.documentId);
   this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);

     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageDealer[index] = false; //img tag
     this.showOtherFormatDealer[index] = true;  //object tag
     this.pdfUrlDealer[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.loadDEALER[index] = false;
     this.showDEALER[index] = false;
     this.showDealerInput[index] = false; //we need to false the showDealerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.uploadIconDEALER[index] = false;
     this.reuploadDealer[index] = true;
     const selectedDealer = this.dealers[index]; // Retrieve the associateId based on the index
     this.associateId = selectedDealer.associateId;
     console.log(this.associateId);
   });
   }
   //block will execute (PDF) - RUNNER NRIC
   if (documentName == "RUNNER_NRIC") {
     this.loadRUNNER[index] = true;
   this.reuploadRunner[index] = false;
   let getDocId = this.combinedRunnerData.filter(v => v.runnerNodeIndex == index);
   this.documentId = getDocId[0].documentId;
   console.log(this.documentId);
   this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);

     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageRunner[index] = false; //img tag
     this.showOtherFormatRunner[index] = true;  //object tag
     this.pdfUrlRunner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.loadRUNNER[index] = false;
     this.showRUNNER[index] = false;
     this.showRunnerInput[index] = false; //we need to false the showRunnerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.uploadIconRUNNER[index] = false;
     this.reuploadRunner[index] = true;
     const selectedRunner = this.runners[index];// Retrieve the associateId based on the index
     this.associateId = selectedRunner.associateId;
     console.log(this.associateId);
   });
   }
   
 }
 //Entry point --> Corporate > Documents > onClick image of JPEG or png , also PDF need to handle (Click to View) .
else if(isBlur == ""){
   if (documentName == "ACRA") {
   this.loadACRA = true;
   this.documentId = this.acraDocObj[0].docId;
   this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
   this.documentInquiry = data;
   let binaryData = data.documentData;

   let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);


   if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageAcra = false; //img tag
     this.showOtherFormatAcra = true;  //object tag
     this.pdfUrlAcra = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.loadACRA = false;
     this.showACRA = false;
     this.uploadIconACRA = false;
     this.showAcraInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.reuploadAcra = true;
     this.associateId = "";  //assoicate id empty string for ACRA
   }  
    //else if response data is jpeg or png
   else{
   this.fileAcraData[index] = binaryData; 
   this.showACRA = false; 
   this.showOtherFormatAcra = false;  //object tag
   this.showImageAcra = true; //img tag
   this.uploadIconACRA = false;
   this.showAcraInput = true;
   this.disableAcraInput = false;
   this.reuploadAcra = false;
   this.associateId = ""; //assoicate id empty string for ACRA
   this.loadACRA = false;
   }
   });
    
   }
   // NEW 12 DOCUMENTS
   if (documentName == "INCORPORATION_CERTIFICATE") {
    this.loadIncorporationCert = true;
    this.documentId = this.incorporationCertDocObj[0].docId;
    this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
    this.documentInquiry = data;
    let binaryData = data.documentData;
 
    let base64 = await fetch(binaryData);
 
    let blob = await base64.blob();
 
    const blobUrl = URL.createObjectURL(blob);
 
    console.log(blob);
 
 
    if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
      this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
        width: '1380px',
        height: '720px',
        panelClass: 'custom-modalbox',
        data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
      });
      this.callApplicationInquiryApi(applicationStatus) ;
      this.showImageIncorporationCert = false; //img tag
      this.showOtherFormatIncorporationCert = true;  //object tag
      this.pdfUrlIncorporationCert = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      this.loadIncorporationCert = false;
      this.showIncorporationCert = false;
      this.uploadIconIncorporationCert = false;
      this.showIncorporationCertInput = false; //we need to false the showIncorporationCertInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
      this.reuploadIncorporationCert = true;
      this.associateId = "";  //assoicate id empty string for INCORPORATION_CERTIFICATE
    }  
     //else if response data is jpeg or png
    else{
    this.fileIncorporationCertData[index] = binaryData; 
    this.showIncorporationCert = false; 
    this.showOtherFormatIncorporationCert = false;  //object tag
    this.showImageIncorporationCert = true; //img tag
    this.uploadIconIncorporationCert = false;
    this.showIncorporationCertInput = true;
    this.disableIncorporationCertInput = false;
    this.reuploadIncorporationCert = false;
    this.associateId = ""; //assoicate id empty string for INCORPORATION_CERTIFICATE
    this.loadIncorporationCert = false;
    }
    });
     
    }
    if (documentName == "ARTICLES_ASSOCIATION") {
      this.loadArticlesAssociation = true;
      this.documentId = this.articlesAssociationDocObj[0].docId;
      this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
      this.documentInquiry = data;
      let binaryData = data.documentData;
   
      let base64 = await fetch(binaryData);
   
      let blob = await base64.blob();
   
      const blobUrl = URL.createObjectURL(blob);
   
      console.log(blob);
   
   
      if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
        this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
          width: '1380px',
          height: '720px',
          panelClass: 'custom-modalbox',
          data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
        });
        this.callApplicationInquiryApi(applicationStatus) ;
        this.showImageArticlesAssociation = false; //img tag
        this.showOtherFormatArticlesAssociation = true;  //object tag
        this.pdfUrlArticlesAssociation = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.loadArticlesAssociation = false;
        this.showArticlesAssociation = false;
        this.uploadIconArticlesAssociation = false;
        this.showArticlesAssociationInput = false; //we need to false the showArticlesAssociationInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
        this.reuploadArticlesAssociation = true;
        this.associateId = "";  //assoicate id empty string for ARTICLES_ASSOCIATION
      }  
       //else if response data is jpeg or png
      else{
      this.fileArticlesAssociationData[index] = binaryData; 
      this.showArticlesAssociation = false; 
      this.showOtherFormatArticlesAssociation = false;  //object tag
      this.showImageArticlesAssociation = true; //img tag
      this.uploadIconArticlesAssociation = false;
      this.showArticlesAssociationInput = true;
      this.disableArticlesAssociationInput = false;
      this.reuploadArticlesAssociation = false;
      this.associateId = ""; //assoicate id empty string for ARTICLES_ASSOCIATION
      this.loadArticlesAssociation = false;
      }
      });
       
      }
      if (documentName == "BANK_LICENSE") {
        this.loadBankLicense = true;
        this.documentId = this.bankLicenseDocObj[0].docId;
        this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
        this.documentInquiry = data;
        let binaryData = data.documentData;
     
        let base64 = await fetch(binaryData);
     
        let blob = await base64.blob();
     
        const blobUrl = URL.createObjectURL(blob);
     
        console.log(blob);
     
     
        if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
          this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
            width: '1380px',
            height: '720px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
          });
          this.callApplicationInquiryApi(applicationStatus) ;
          this.showImageBankLicense = false; //img tag
          this.showOtherFormatBankLicense = true;  //object tag
          this.pdfUrlBankLicense = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
          this.loadBankLicense = false;
          this.showBankLicense = false;
          this.uploadIconBankLicense = false;
          this.showBankLicenseInput = false; //we need to false the showBankLicenseInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
          this.reuploadBankLicense = true;
          this.associateId = "";  //assoicate id empty string for BANK_LICENSE
        }  
         //else if response data is jpeg or png
        else{
        this.fileBankLicenseData[index] = binaryData; 
        this.showBankLicense = false; 
        this.showOtherFormatBankLicense = false;  //object tag
        this.showImageBankLicense = true; //img tag
        this.uploadIconBankLicense = false;
        this.showBankLicenseInput = true;
        this.disableBankLicenseInput = false;
        this.reuploadBankLicense = false;
        this.associateId = ""; //assoicate id empty string for BANK_LICENSE
        this.loadBankLicense = false;
        }
        });
         
        }
        if (documentName == "TRADE_LICENSE") {
          this.loadTradeLicense = true;
          this.documentId = this.tradeLicenseDocObj[0].docId;
          this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
          this.documentInquiry = data;
          let binaryData = data.documentData;
       
          let base64 = await fetch(binaryData);
       
          let blob = await base64.blob();
       
          const blobUrl = URL.createObjectURL(blob);
       
          console.log(blob);
       
       
          if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
            this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
              width: '1380px',
              height: '720px',
              panelClass: 'custom-modalbox',
              data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
            });
            this.callApplicationInquiryApi(applicationStatus) ;
            this.showImageTradeLicense = false; //img tag
            this.showOtherFormatTradeLicense = true;  //object tag
            this.pdfUrlTradeLicense = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
            this.loadTradeLicense = false;
            this.showTradeLicense = false;
            this.uploadIconTradeLicense = false;
            this.showTradeLicenseInput = false; //we need to false the showTradeLicenseInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
            this.reuploadTradeLicense = true;
            this.associateId = "";  //assoicate id empty string for TRADE_LICENSE
          }  
           //else if response data is jpeg or png
          else{
          this.fileTradeLicenseData[index] = binaryData; 
          this.showTradeLicense = false; 
          this.showOtherFormatTradeLicense = false;  //object tag
          this.showImageTradeLicense = true; //img tag
          this.uploadIconTradeLicense = false;
          this.showTradeLicenseInput = true;
          this.disableTradeLicenseInput = false;
          this.reuploadTradeLicense = false;
          this.associateId = ""; //assoicate id empty string for TRADE_LICENSE
          this.loadTradeLicense = false;
          }
          });
           
          }
          if (documentName == "AML_POLICY_AND_PROCEDURES") {
            this.loadAmlPolicyAndProcedures = true;
            this.documentId = this.amlPolicyAndProceduresDocObj[0].docId;
            this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
            this.documentInquiry = data;
            let binaryData = data.documentData;
         
            let base64 = await fetch(binaryData);
         
            let blob = await base64.blob();
         
            const blobUrl = URL.createObjectURL(blob);
         
            console.log(blob);
         
         
            if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
              this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                width: '1380px',
                height: '720px',
                panelClass: 'custom-modalbox',
                data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
              });
              this.callApplicationInquiryApi(applicationStatus) ;
              this.showImageAmlPolicyAndProcedures = false; //img tag
              this.showOtherFormatAmlPolicyAndProcedures = true;  //object tag
              this.pdfUrlAmlPolicyAndProcedures = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
              this.loadAmlPolicyAndProcedures = false;
              this.showAmlPolicyAndProcedures = false;
              this.uploadIconAmlPolicyAndProcedures = false;
              this.showAmlPolicyAndProceduresInput = false; //we need to false the showAmlPolicyAndProceduresInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
              this.reuploadAmlPolicyAndProcedures = true;
              this.associateId = "";  //assoicate id empty string for AML_POLICY_AND_PROCEDURES
            }  
             //else if response data is jpeg or png
            else{
            this.fileAmlPolicyAndProceduresData[index] = binaryData; 
            this.showAmlPolicyAndProcedures = false; 
            this.showOtherFormatAmlPolicyAndProcedures = false;  //object tag
            this.showImageAmlPolicyAndProcedures = true; //img tag
            this.uploadIconAmlPolicyAndProcedures = false;
            this.showAmlPolicyAndProceduresInput = true;
            this.disableAmlPolicyAndProceduresInput = false;
            this.reuploadAmlPolicyAndProcedures = false;
            this.associateId = ""; //assoicate id empty string for AML_POLICY_AND_PROCEDURES
            this.loadAmlPolicyAndProcedures = false;
            }
            });
             
            }
            if (documentName == "AUDIT_REPORT") {
              this.loadAuditReport = true;
              this.documentId = this.auditReportDocObj[0].docId;
              this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
              this.documentInquiry = data;
              let binaryData = data.documentData;
           
              let base64 = await fetch(binaryData);
           
              let blob = await base64.blob();
           
              const blobUrl = URL.createObjectURL(blob);
           
              console.log(blob);
           
           
              if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                  width: '1380px',
                  height: '720px',
                  panelClass: 'custom-modalbox',
                  data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                });
                this.callApplicationInquiryApi(applicationStatus) ;
                this.showImageAuditReport = false; //img tag
                this.showOtherFormatAuditReport = true;  //object tag
                this.pdfUrlAuditReport = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                this.loadAuditReport = false;
                this.showAuditReport = false;
                this.uploadIconAuditReport = false;
                this.showAuditReportInput = false; //we need to false the showAuditReportInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                this.reuploadAuditReport = true;
                this.associateId = "";  //assoicate id empty string for AUDIT_REPORT
              }  
               //else if response data is jpeg or png
              else{
              this.fileAuditReportData[index] = binaryData; 
              this.showAuditReport = false; 
              this.showOtherFormatAuditReport = false;  //object tag
              this.showImageAuditReport = true; //img tag
              this.uploadIconAuditReport = false;
              this.showAuditReportInput = true;
              this.disableAuditReportInput = false;
              this.reuploadAuditReport = false;
              this.associateId = ""; //assoicate id empty string for AUDIT_REPORT
              this.loadAuditReport = false;
              }
              });
               
              }
              if (documentName == "LATEST_AML_AUDIT_REPORT") {
                this.loadAmlAuditReport = true;
                this.documentId = this.amlAuditReportDocObj[0].docId;
                this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
                this.documentInquiry = data;
                let binaryData = data.documentData;
             
                let base64 = await fetch(binaryData);
             
                let blob = await base64.blob();
             
                const blobUrl = URL.createObjectURL(blob);
             
                console.log(blob);
             
             
                if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                  this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                    width: '1380px',
                    height: '720px',
                    panelClass: 'custom-modalbox',
                    data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                  });
                  this.callApplicationInquiryApi(applicationStatus) ;
                  this.showImageAmlAuditReport = false; //img tag
                  this.showOtherFormatAmlAuditReport = true;  //object tag
                  this.pdfUrlAmlAuditReport = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                  this.loadAmlAuditReport = false;
                  this.showAmlAuditReport = false;
                  this.uploadIconAmlAuditReport = false;
                  this.showAmlAuditReportInput = false; //we need to false the showAmlAuditReportInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                  this.reuploadAmlAuditReport = true;
                  this.associateId = "";  //assoicate id empty string for LATEST_AML_AUDIT_REPORT
                }  
                 //else if response data is jpeg or png
                else{
                this.fileAmlAuditReportData[index] = binaryData; 
                this.showAmlAuditReport = false; 
                this.showOtherFormatAmlAuditReport = false;  //object tag
                this.showImageAmlAuditReport = true; //img tag
                this.uploadIconAmlAuditReport = false;
                this.showAmlAuditReportInput = true;
                this.disableAmlAuditReportInput = false;
                this.reuploadAmlAuditReport = false;
                this.associateId = ""; //assoicate id empty string for LATEST_AML_AUDIT_REPORT
                this.loadAmlAuditReport = false;
                }
                });
                 
                }
                if (documentName == "LATEST_ORGANISATION_STRUCTURE") {
                  this.loadOrganisationStructure = true;
                  this.documentId = this.organisationStructureDocObj[0].docId;
                  this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
                  this.documentInquiry = data;
                  let binaryData = data.documentData;
               
                  let base64 = await fetch(binaryData);
               
                  let blob = await base64.blob();
               
                  const blobUrl = URL.createObjectURL(blob);
               
                  console.log(blob);
               
               
                  if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                    this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                      width: '1380px',
                      height: '720px',
                      panelClass: 'custom-modalbox',
                      data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                    });
                    this.callApplicationInquiryApi(applicationStatus) ;
                    this.showImageOrganisationStructure = false; //img tag
                    this.showOtherFormatOrganisationStructure = true;  //object tag
                    this.pdfUrlOrganisationStructure = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                    this.loadOrganisationStructure = false;
                    this.showOrganisationStructure = false;
                    this.uploadIconOrganisationStructure = false;
                    this.showOrganisationStructureInput = false; //we need to false the showOrganisationStructureInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                    this.reuploadOrganisationStructure = true;
                    this.associateId = "";  //assoicate id empty string for LATEST_ORGANISATION_STRUCTURE
                  }  
                   //else if response data is jpeg or png
                  else{
                  this.fileOrganisationStructureData[index] = binaryData; 
                  this.showOrganisationStructure = false; 
                  this.showOtherFormatOrganisationStructure = false;  //object tag
                  this.showImageOrganisationStructure = true; //img tag
                  this.uploadIconOrganisationStructure = false;
                  this.showOrganisationStructureInput = true;
                  this.disableOrganisationStructureInput = false;
                  this.reuploadOrganisationStructure = false;
                  this.associateId = ""; //assoicate id empty string for LATEST_ORGANISATION_STRUCTURE
                  this.loadOrganisationStructure = false;
                  }
                  });
                   
                  }
                  if (documentName == "MANAGEMENT_LIST") {
                    this.loadManagementList = true;
                    this.documentId = this.managementListDocObj[0].docId;
                    this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
                    this.documentInquiry = data;
                    let binaryData = data.documentData;
                 
                    let base64 = await fetch(binaryData);
                 
                    let blob = await base64.blob();
                 
                    const blobUrl = URL.createObjectURL(blob);
                 
                    console.log(blob);
                 
                 
                    if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                      this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                        width: '1380px',
                        height: '720px',
                        panelClass: 'custom-modalbox',
                        data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                      });
                      this.callApplicationInquiryApi(applicationStatus) ;
                      this.showImageManagementList = false; //img tag
                      this.showOtherFormatManagementList = true;  //object tag
                      this.pdfUrlManagementList = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                      this.loadManagementList = false;
                      this.showManagementList = false;
                      this.uploadIconManagementList = false;
                      this.showManagementListInput = false; //we need to false the showManagementListInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                      this.reuploadManagementList = true;
                      this.associateId = "";  //assoicate id empty string for MANAGEMENT_LIST
                    }  
                     //else if response data is jpeg or png
                    else{
                    this.fileManagementListData[index] = binaryData; 
                    this.showManagementList = false; 
                    this.showOtherFormatManagementList = false;  //object tag
                    this.showImageManagementList = true; //img tag
                    this.uploadIconManagementList = false;
                    this.showManagementListInput = true;
                    this.disableManagementListInput = false;
                    this.reuploadManagementList = false;
                    this.associateId = ""; //assoicate id empty string for MANAGEMENT_LIST
                    this.loadManagementList = false;
                    }
                    });
                     
                    }
                    if (documentName == "ID_COPIES") {
                      this.loadIdCopies = true;
                      this.documentId = this.idCopiesDocObj[0].docId;
                      this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
                      this.documentInquiry = data;
                      let binaryData = data.documentData;
                   
                      let base64 = await fetch(binaryData);
                   
                      let blob = await base64.blob();
                   
                      const blobUrl = URL.createObjectURL(blob);
                   
                      console.log(blob);
                   
                   
                      if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                        this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                          width: '1380px',
                          height: '720px',
                          panelClass: 'custom-modalbox',
                          data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                        });
                        this.callApplicationInquiryApi(applicationStatus) ;
                        this.showImageIdCopies = false; //img tag
                        this.showOtherFormatIdCopies = true;  //object tag
                        this.pdfUrlIdCopies = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                        this.loadIdCopies = false;
                        this.showIdCopies = false;
                        this.uploadIconIdCopies = false;
                        this.showIdCopiesInput = false; //we need to false the showIdCopiesInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                        this.reuploadIdCopies = true;
                        this.associateId = "";  //assoicate id empty string for ID_COPIES
                      }  
                       //else if response data is jpeg or png
                      else{
                      this.fileIdCopiesData[index] = binaryData; 
                      this.showIdCopies = false; 
                      this.showOtherFormatIdCopies = false;  //object tag
                      this.showImageIdCopies = true; //img tag
                      this.uploadIconIdCopies = false;
                      this.showIdCopiesInput = true;
                      this.disableIdCopiesInput = false;
                      this.reuploadIdCopies = false;
                      this.associateId = ""; //assoicate id empty string for ID_COPIES
                      this.loadIdCopies = false;
                      }
                      });
                       
                      }
                      if (documentName == "KYC_FORM") {
                        this.loadKycForm = true;
                        this.documentId = this.kycFormDocObj[0].docId;
                        this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
                        this.documentInquiry = data;
                        let binaryData = data.documentData;
                     
                        let base64 = await fetch(binaryData);
                     
                        let blob = await base64.blob();
                     
                        const blobUrl = URL.createObjectURL(blob);
                     
                        console.log(blob);
                     
                     
                        if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                          this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                            width: '1380px',
                            height: '720px',
                            panelClass: 'custom-modalbox',
                            data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                          });
                          this.callApplicationInquiryApi(applicationStatus) ;
                          this.showImageKycForm = false; //img tag
                          this.showOtherFormatKycForm = true;  //object tag
                          this.pdfUrlKycForm = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                          this.loadKycForm = false;
                          this.showKycForm = false;
                          this.uploadIconKycForm = false;
                          this.showKycFormInput = false; //we need to false the showKycFormInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                          this.reuploadKycForm = true;
                          this.associateId = "";  //assoicate id empty string for KYC_FORM
                        }  
                         //else if response data is jpeg or png
                        else{
                        this.fileKycFormData[index] = binaryData; 
                        this.showKycForm = false; 
                        this.showOtherFormatKycForm = false;  //object tag
                        this.showImageKycForm = true; //img tag
                        this.uploadIconKycForm = false;
                        this.showKycFormInput = true;
                        this.disableKycFormInput = false;
                        this.reuploadKycForm = false;
                        this.associateId = ""; //assoicate id empty string for KYC_FORM
                        this.loadKycForm = false;
                        }
                        });
                         
                        }
                        if (documentName == "WOLFSBERG_FORM") {
                          this.loadWolfsbergForm = true;
                          this.documentId = this.wolfsbergFormDocObj[0].docId;
                          this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
                          this.documentInquiry = data;
                          let binaryData = data.documentData;
                       
                          let base64 = await fetch(binaryData);
                       
                          let blob = await base64.blob();
                       
                          const blobUrl = URL.createObjectURL(blob);
                       
                          console.log(blob);
                       
                       
                          if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                            this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                              width: '1380px',
                              height: '720px',
                              panelClass: 'custom-modalbox',
                              data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                            });
                            this.callApplicationInquiryApi(applicationStatus) ;
                            this.showImageWolfsbergForm = false; //img tag
                            this.showOtherFormatWolfsbergForm = true;  //object tag
                            this.pdfUrlWolfsbergForm = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                            this.loadWolfsbergForm = false;
                            this.showWolfsbergForm = false;
                            this.uploadIconWolfsbergForm = false;
                            this.showWolfsbergFormInput = false; //we need to false the showWolfsbergFormInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                            this.reuploadWolfsbergForm = true;
                            this.associateId = "";  //assoicate id empty string for WOLFSBERG_FORM
                          }  
                           //else if response data is jpeg or png
                          else{
                          this.fileWolfsbergFormData[index] = binaryData; 
                          this.showWolfsbergForm = false; 
                          this.showOtherFormatWolfsbergForm = false;  //object tag
                          this.showImageWolfsbergForm = true; //img tag
                          this.uploadIconWolfsbergForm = false;
                          this.showWolfsbergFormInput = true;
                          this.disableWolfsbergFormInput = false;
                          this.reuploadWolfsbergForm = false;
                          this.associateId = ""; //assoicate id empty string for WOLFSBERG_FORM
                          this.loadWolfsbergForm = false;
                          }
                          });
                           
                          }

                          if (documentName == "ONBOARDING_DOCUMENT") {
                            this.loadOnboardingDoc = true;
                            this.documentId = this.onboardingDocObj[0].docId;
                            this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
                            this.documentInquiry = data;
                            let binaryData = data.documentData;
                         
                            let base64 = await fetch(binaryData);
                         
                            let blob = await base64.blob();
                         
                            const blobUrl = URL.createObjectURL(blob);
                         
                            console.log(blob);
                         
                         
                            if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
                              this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                                width: '1380px',
                                height: '720px',
                                panelClass: 'custom-modalbox',
                                data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
                              });
                              this.callApplicationInquiryApi(applicationStatus) ;
                              this.showImageOnboardingDoc = false; //img tag
                              this.showOtherFormatOnboardingDoc = true;  //object tag
                              this.pdfUrlOnboardingDoc = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                              this.loadOnboardingDoc = false;
                              this.showOnboardingDoc = false;
                              this.uploadIconOnboardingDoc = false;
                              this.showOnboardingDocInput = false; //we need to false the showOnboardingDocInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                              this.reuploadOnboardingDoc = true;
                              this.associateId = "";  //assoicate id empty string for ONBOARDING_DOCUMENT
                            }  
                             //else if response data is jpeg or png
                            else{
                            this.fileOnboardingDocData[index] = binaryData; 
                            this.showOnboardingDoc = false; 
                            this.showOtherFormatOnboardingDoc = false;  //object tag
                            this.showImageOnboardingDoc = true; //img tag
                            this.uploadIconOnboardingDoc = false;
                            this.showOnboardingDocInput = true;
                            this.disableOnboardingDocInput = false;
                            this.reuploadOnboardingDoc = false;
                            this.associateId = ""; //assoicate id empty string for ONBOARDING_DOCUMENT
                            this.loadOnboardingDoc = false;
                            }
                            });
                             
                            }
    
  

   if (documentName == "OWNER_NRIC") {
     this.loadOWNER[index] = true;
   this.reuploadOwner[index] = false;
   let getDocId = this.combinedOwnerData.filter(v => v.ownerNodeIndex == index);
   this.documentId = getDocId[0].documentId;
   console.log(this.documentId);
     this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
       this.documentInquiry = data;
   let binaryData = data.documentData;

   let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);

   if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
       this.showImageOwner[index] = false; //img tag
       this.showOtherFormatOwner[index] = true;  //object tag
       this.pdfUrlOwner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
       this.loadOWNER[index] = false;
       this.showOWNER[index] = false;
       this.showOwnerInput[index] = false; //we need to false the showOwnerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
       this.uploadIconOWNER[index] = false;
       this.reuploadOwner[index] = true;
       const selectedOwner = this.owners[index];// Retrieve the associateId based on the index
       this.associateId = selectedOwner.associateId;
       console.log(this.associateId);
   }
   else{
   this.fileOwnerData[index] = binaryData; 
   this.showOWNER[index] = false; 
   this.showOtherFormatOwner[index] = false;  //object tag
   this.showImageOwner[index] = true; //img tag
   this.uploadIconOWNER[index] = false;
   this.showOwnerInput[index] = true; 
   this.disableOwnerInput[index] = false;
   this.reuploadOwner[index] = false;
   this.loadOWNER[index] = false;
       const selectedOwner = this.owners[index];// Retrieve the associateId based on the index
       this.associateId = selectedOwner.associateId;
       console.log(this.associateId);
   }
     });
   }
   //block will execute (PDF) - DEALER NRIC
   if (documentName == "DEALER_NRIC") {
     this.loadDEALER[index] = true;
   this.reuploadDealer[index] = false;
   let getDocId = this.combinedDealerData.filter(v => v.dealerNodeIndex == index);
   this.documentId = getDocId[0].documentId;
   console.log(this.documentId);
   this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
   this.documentInquiry = data;
   let binaryData = data.documentData;

   let base64 = await fetch(binaryData);

   let blob = await base64.blob();

   const blobUrl = URL.createObjectURL(blob);

   console.log(blob);

   if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
     this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
       width: '1380px',
       height: '720px',
       panelClass: 'custom-modalbox',
       data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
     });
     this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageDealer[index] = false; //img tag
     this.showOtherFormatDealer[index] = true;  //object tag
     this.pdfUrlDealer[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.loadDEALER[index] = false;
     this.showDEALER[index] = false;
     this.showDealerInput[index] = false; //we need to false the showDealerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.uploadIconDEALER[index] = false;
     this.reuploadDealer[index] = true;
     const selectedDealer = this.dealers[index]; // Retrieve the associateId based on the index
     this.associateId = selectedDealer.associateId;
     console.log(this.associateId);
   }
   else{
     this.fileDealerData[index] = binaryData; 
     this.showDEALER[index] = false; 
     this.showOtherFormatDealer[index] = false;  //object tag
     this.showImageDealer[index] = true; //img tag
     this.uploadIconDEALER[index] = false;
     this.showDealerInput[index] = true;
     this.disableDealerInput[index] = false;
     this.reuploadDealer[index] = false;
     this.loadDEALER[index] = false;
       const selectedDealer = this.dealers[index]; // Retrieve the associateId based on the index
       this.associateId = selectedDealer.associateId;
       console.log(this.associateId);
   }
  
   });
   }
   //block will execute (PDF) - RUNNER NRIC
   if (documentName == "RUNNER_NRIC") {
     this.loadRUNNER[index] = true;
   this.reuploadRunner[index] = false;
   let getDocId = this.combinedRunnerData.filter(v => v.runnerNodeIndex == index);
   this.documentId = getDocId[0].documentId;
   console.log(this.documentId);
   this.documentService.getCorporateDocumentInquiry(this.documentId,this.customerFlag).subscribe(async data => {
     this.documentInquiry = data;
     let binaryData = data.documentData;

     let base64 = await fetch(binaryData);

     let blob = await base64.blob();
  
     const blobUrl = URL.createObjectURL(blob);
  
     console.log(blob);

     if(binaryData.substring(5,20) == 'application/pdf'){ //If response data is PDF
       this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
         width: '1380px',
         height: '720px',
         panelClass: 'custom-modalbox',
         data: { customersearch_documentName: documentName, customersearch_documentData: binaryData, fileBlob: blob }
       });
       this.callApplicationInquiryApi(applicationStatus) ;
     this.showImageRunner[index] = false; //img tag
     this.showOtherFormatRunner[index] = true;  //object tag
     this.pdfUrlRunner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
     this.loadRUNNER[index] = false;
     this.showRUNNER[index] = false;
     this.showRunnerInput[index] = false; //we need to false the showRunnerInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
     this.uploadIconRUNNER[index] = false;
     this.reuploadRunner[index] = true;
     const selectedRunner = this.runners[index];// Retrieve the associateId based on the index
     this.associateId = selectedRunner.associateId;
     console.log(this.associateId);
     }
     else{
       this.fileRunnerData[index] = binaryData; 
       this.showRUNNER[index] = false; 
       this.showOtherFormatRunner[index] = false;  //object tag
       this.showImageRunner[index] = true; //img tag
       this.uploadIconRUNNER[index] = false;
       this.showRunnerInput[index] = true;
       this.disableRunnerInput[index] = false;
       this.reuploadRunner[index] = false;
       this.loadRUNNER[index] = false;
       const selectedRunner = this.runners[index];// Retrieve the associateId based on the index
       this.associateId = selectedRunner.associateId;
       console.log(this.associateId);
     }
   });
   }
  
 }

  }


   
       
}
   
  goBack(){
    this.router.navigate(['company/company-associate']);
  }


 //Application Search > Modal popup > on click back button > route back to Companyassociates Component.
 back(){
  let applicationId = this.store.getItem('CORPORATE_APPLICATION_ID');
    this.corporateService.getCorporateApplicationInquiry(applicationId).subscribe(data => {
  this.dialogRef.open(CompanyAssociateComponent,{
    data: { applicationCompanyAssociateReview:data },
    panelClass: 'custom-modalbox',
    width:'1245px',
    height:'575px',
    disableClose : true
  })
},
  //error handling Completed on 06-07-2023 - <DN>
 (error:any)=>{
  if(error.status != 401){
    this.dialogRef.open(ErrorDialogAdminComponent) ;
  }
});
}
//branch user > view docs > onClick Reject button 
openRejected(){
  console.log('reject button triggered')
  this.dialogRef.open(CorporateConfirmationDialogComponent,{
    data : {productCode : this.productCode ? this.productCode : "" }
  })
}
//Approved - APPLICATION FULLFILMENT API  
openApproved() {
  console.log('approve button triggered')
  this.applicationService.corporateApplicationFulFilment(this.approved()).subscribe(data => {
    console.log(data);
    if(data != undefined){
        this.store.setItem('APPLICATION_APPROVED',data);
      }
    this.dialogRef.open(ApprovedProspect);
  });
}
approved(): ApplicationFulFillment{
  let applicationId : any ;
  if(this.productCode == "MC"){
    applicationId = this.store.getItem('MC_CORP_APPLICATIONID') ? this.store.getItem('MC_CORP_APPLICATIONID') : "" ;
  }
  else if(this.productCode == ""){
    applicationId = this.store.getItem('CORPORATE_APPLICATION_ID');
  }
  return new ApplicationFulFillment({
    "applicationId": applicationId,
    "status": "APPROVED"
})
}

customerBack() { //Backoffice > customerSearch > onClick back button 
  let customerId = this.store.getItem('CUSTOMER_ID');
  this.corporateService.getCorporateCustomerInquiry(customerId).subscribe(data => {
  this.dialogRef.open(CompanyAssociateComponent, {
    data: { isCompanyAssociateReview:data },
    panelClass: 'custom-modalbox',
    width:'1245px',
    height:'575px',
    disableClose : true
  })
},  //error handling Completed on 06-07-2023 - <DN>
    (error:any)=>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    });
}

onCompanyDocumentsOnboardingSubmit(){
  this.documentService.submitDocumentCorporate(this.submitCorpDocumentApplication()).subscribe
  (data => {
    this.formStatus = "Company Documents Form Submitted Sucessfully"
    this.companyDocumentsStatusChanged.emit('Submitted');
    this.dialogRef.open(ApplicationSubmitDialogComponent, {
      width: '460px',
      data : {isCorporateReview : true}
    })
  });

 
}

// This function will be trigger automatically  based on the stepper changes in the parent component
updateStatus(event: any) {
  if(this.formStatus == "Company Documents Form Submitted Sucessfully"){
   this.form.valueChanges.subscribe(() => { 
     this.companyDocumentsStatusChanged.emit('In Progress');  //Listen for changes whenever the formcontrol value changes ,we change status In-Progress
   });
  }
  else{
   this.companyDocumentsStatusChanged.emit(this.form.valid ? 'Completed' : 'In Progress');  // Emit an stepper status to the parent-stepper component
  }

 }
//This function is reused in below entry point 
// 1.Backoffice > Application Search > Add Corporate > View Documents > Called applicationInquiryApi
// 2.Corporate > Application Status as NEW > Called applicationInquiryApi
 callApplicationInquiryApi(isCallService:string){

  let applicationId = "" ;
  let corporateOnboadingByStaff = this.data.appOnboardingForMc ? this.data.appOnboardingForMc : ""; //entry point: Backoffice > Application Search > Add Corporate > View Documents (stepper flow)
  let corporateOnboadingByStaffSearch = this.data.appSearchOnboardingForMc ? this.data.appSearchOnboardingForMc : "" //entry point: Backoffice > Application Search > View Application(onclick action icon) >  View Documents
    if(isCallService == "NEW" || corporateOnboadingByStaff != "" || corporateOnboadingByStaffSearch != ""){
      if (corporateOnboadingByStaff == "C" || corporateOnboadingByStaffSearch != "") {
        applicationId = this.store.getItem('MC_CORP_APPLICATIONID') ? this.store.getItem('MC_CORP_APPLICATIONID') : "";
      }
      else {
        applicationId = this.store.getItem('APPLICATION_ID') ? this.store.getItem('APPLICATION_ID') : "";
      }

      this.corporateService.getCorporateApplicationInquiry(applicationId).subscribe(data => {
        this.corporateApplicationInquiry = data;
        if(this.corporateApplicationInquiry.document != null){
          this.acraDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "ACRA");
          // NEW 12 DOCUMENTS
          this.incorporationCertDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "INCORPORATION_CERTIFICATE");
          this.articlesAssociationDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "ARTICLES_ASSOCIATION");
          this.bankLicenseDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "BANK_LICENSE");
          this.tradeLicenseDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "TRADE_LICENSE");
          this.amlPolicyAndProceduresDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "AML_POLICY_AND_PROCEDURES");
          this.auditReportDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "AUDIT_REPORT");
          this.amlAuditReportDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "LATEST_AML_AUDIT_REPORT");
          this.organisationStructureDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "LATEST_ORGANISATION_STRUCTURE");
          this.managementListDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "MANAGEMENT_LIST");
          this.idCopiesDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "ID_COPIES");
          this.kycFormDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "KYC_FORM");
          this.wolfsbergFormDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "WOLFSBERG_FORM");
          this.onboardingDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "ONBOARDING_DOCUMENT");

          this.ownerDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "OWNER_NRIC");
          this.dealerDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "DEALER_NRIC");
          this.runnerDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "RUNNER_NRIC");
        }

        if(corporateOnboadingByStaff != "" && (this.documentInquiry == undefined || this.documentInquiry == null )){ //added documentInquiry null check b'cause we dont need to trigger initialLayoutSetup .
          this.initialLayoutSetup(data, "BACKOFFICEBRANCH-NEW");
          this.showEmptyFields = true;
       }
        if (corporateOnboadingByStaffSearch != "" && (this.documentInquiry == undefined || this.documentInquiry == null)){ //added documentInquiry null check b'cause we dont need to trigger initialLayoutSetup .
          this.initialLayoutSetup(data, "BACKOFFICEBRANCH-NEW");
        }
    
      });
    }
    else{
      return "No service need" ;
    }
 
 

 }

 callApplicationInquiryService(isCallService:string){

  let applicationId = "" ;
  let corporateOnboadingByStaff = this.data.appOnboardingForMc ? this.data.appOnboardingForMc : ""; //entry point: Backoffice > Application Search > Add Corporate > View Documents (stepper flow)
  let corporateOnboadingByStaffSearch = this.data.appSearchOnboardingForMc ? this.data.appSearchOnboardingForMc : "" //entry point: Backoffice > Application Search > View Application(onclick action icon) >  View Documents
    if(isCallService == "NEW" || corporateOnboadingByStaff != "" || corporateOnboadingByStaffSearch != ""){
      if (corporateOnboadingByStaff == "C" || corporateOnboadingByStaffSearch != "") {
        applicationId = this.store.getItem('MC_CORP_APPLICATIONID') ? this.store.getItem('MC_CORP_APPLICATIONID') : "";
      }
      else {
        applicationId = this.store.getItem('APPLICATION_ID') ? this.store.getItem('APPLICATION_ID') : "";
      }

      this.corporateService.getCorporateApplicationInquiry(applicationId).subscribe(data => {
        this.corporateApplicationInquiry = data;
        if(this.corporateApplicationInquiry.document != null){
          this.acraDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "ACRA");
           // NEW 12 DOCUMENTS
           this.incorporationCertDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "INCORPORATION_CERTIFICATE");
           this.articlesAssociationDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "ARTICLES_ASSOCIATION");
           this.bankLicenseDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "BANK_LICENSE");
           this.tradeLicenseDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "TRADE_LICENSE");
           this.amlPolicyAndProceduresDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "AML_POLICY_AND_PROCEDURES");
           this.auditReportDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "AUDIT_REPORT");
           this.amlAuditReportDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "LATEST_AML_AUDIT_REPORT");
           this.organisationStructureDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "LATEST_ORGANISATION_STRUCTURE");
           this.managementListDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "MANAGEMENT_LIST");
           this.idCopiesDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "ID_COPIES");
           this.kycFormDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "KYC_FORM");
           this.wolfsbergFormDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "WOLFSBERG_FORM");
           this.onboardingDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "ONBOARDING_DOCUMENT");

          this.ownerDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "OWNER_NRIC");
          this.dealerDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "DEALER_NRIC");
          this.runnerDocObj = this.corporateApplicationInquiry.document?.filter((v: any) => v.docName == "RUNNER_NRIC");
        }

    
      });
    }
    else{
      return "No service need" ;
    }
 
 

 }


 //This function triggers when a PDF file is closed.(backoffice-> customer search -> view corporate documents)
 callCustomerInquiryApi(id:string){
    let customerId = this.store.getItem('CUSTOMER_ID');
      this.corporateService.getCorporateCustomerInquiry(customerId).subscribe(data => {
      this.corporateCustomerInquiry = data;
      this.updateDocumentIdObject = this.corporateCustomerInquiry.document.find((doc:any) => doc.docTypeId == id) ;
      this.updateDocumentId = this.updateDocumentIdObject.docId ? this.updateDocumentIdObject.docId : "" ;
      this.acraDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="ACRA"));
      //NEW 12 DOCUMENTS
      this.incorporationCertDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="INCORPORATION_CERTIFICATE"));
      this.articlesAssociationDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="ARTICLES_ASSOCIATION"));
      this.bankLicenseDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="BANK_LICENSE"));
      this.tradeLicenseDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="TRADE_LICENSE"));
      this.amlPolicyAndProceduresDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="AML_POLICY_AND_PROCEDURES"));
      this.auditReportDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="AUDIT_REPORT"));
      this.amlAuditReportDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="LATEST_AML_AUDIT_REPORT"));
      this.organisationStructureDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="LATEST_ORGANISATION_STRUCTURE"));
      this.managementListDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="MANAGEMENT_LIST"));
      this.idCopiesDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="ID_COPIES"));
      this.kycFormDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="KYC_FORM"));
      this.wolfsbergFormDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="WOLFSBERG_FORM"));
      this.onboardingDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="ONBOARDING_DOCUMENT"));

      this.ownerDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="OWNER_NRIC"));
      this.dealerDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="DEALER_NRIC"));
      this.runnerDocObj = this.corporateCustomerInquiry.document.filter((v=>v.docName ==="RUNNER_NRIC"));
    });
 
 }

 callApplicationInquiryAppSearch(index:number){
  let applicationId =  this.store.getItem('MC_CORP_APPLICATIONID') ? this.store.getItem('MC_CORP_APPLICATIONID') : "" ;
  setTimeout(() => {
    this.corporateService.getCorporateApplicationInquiry(applicationId).subscribe(data => {
      this.corporateApplicationInquiry = data;
      this.applicationStatus = data.status ? data.status : "" ;

      let hasSpecificItem : string = this.store.getItem('APPLICATION_APPROVE_REJECT_ACCESS_CONTROL') ;
      if(hasSpecificItem == "true"){ //Approve reject button should enable only when app status is PENDING
        if(this.applicationStatus == "PENDING"){
          this.showApplicationFulfillmentBtnMc = true ;
        }
        else{
          this.showApplicationFulfillmentBtnMc = false ;
        }
      }
      else if(hasSpecificItem == "false"){
        this.showApplicationFulfillmentBtnMc = false ;
      }

      this.acraDocObj = this.corporateApplicationInquiry.document.filter(((v:any)=>v.docName ==="ACRA"));
       // NEW 12 DOCUMENTS
       this.incorporationCertDocObj = this.corporateApplicationInquiry.document.filter(((v: any) => v.docName ==="INCORPORATION_CERTIFICATE"));
       this.articlesAssociationDocObj = this.corporateApplicationInquiry.document.filter(((v: any) => v.docName ==="ARTICLES_ASSOCIATION"));
       this.bankLicenseDocObj = this.corporateApplicationInquiry.document.filter(((v: any) => v.docName ==="BANK_LICENSE"));
       this.tradeLicenseDocObj = this.corporateApplicationInquiry.document.filter(((v: any) => v.docName ==="TRADE_LICENSE"));
       this.amlPolicyAndProceduresDocObj = this.corporateApplicationInquiry.document.filter(((v: any) => v.docName ==="AML_POLICY_AND_PROCEDURES"));
       this.auditReportDocObj = this.corporateApplicationInquiry.document.filter(((v: any) => v.docName ==="AUDIT_REPORT"));
       this.amlAuditReportDocObj = this.corporateApplicationInquiry.document.filter(((v: any) => v.docName ==="LATEST_AML_AUDIT_REPORT"));
       this.organisationStructureDocObj = this.corporateApplicationInquiry.document.filter(((v: any) => v.docName ==="LATEST_ORGANISATION_STRUCTURE"));
       this.managementListDocObj = this.corporateApplicationInquiry.document.filter(((v: any) => v.docName ==="MANAGEMENT_LIST"));
       this.idCopiesDocObj = this.corporateApplicationInquiry.document.filter(((v: any) => v.docName ==="ID_COPIES"));
       this.kycFormDocObj = this.corporateApplicationInquiry.document.filter(((v: any) => v.docName ==="KYC_FORM"));
       this.wolfsbergFormDocObj = this.corporateApplicationInquiry.document.filter(((v: any) => v.docName ==="WOLFSBERG_FORM"));
       this.onboardingDocObj = this.corporateApplicationInquiry.document.filter(((v: any) => v.docName ==="ONBOARDING_DOCUMENT"));

      this.ownerDocObj = this.corporateApplicationInquiry.document.filter(((v:any)=>v.docName ==="OWNER_NRIC"));
      this.dealerDocObj = this.corporateApplicationInquiry.document.filter(((v:any)=>v.docName ==="DEALER_NRIC"));
      this.runnerDocObj = this.corporateApplicationInquiry.document.filter(((v:any)=>v.docName ==="RUNNER_NRIC"));
  
      if(this.acraDocObj[0] != undefined){
        this.disableAcraInput = true;
        this.showAcraInput = false;
        this.buttonMessage = 'Click to view !'
        this.uploadIconACRA = false;
        this.showACRA = true; //new
        }
      //NEW 12 DOCUMENTS
      // INCORPORATION_CERTIFICATE
      if(this.incorporationCertDocObj[0] != undefined){
        this.disableIncorporationCertInput = true;
        this.showIncorporationCertInput = false;
        this.buttonMessage = 'Click to view !'
        this.uploadIconIncorporationCert = false;
        this.showIncorporationCert = true; //new
        }
         // ARTICLES_ASSOCIATION
      if(this.articlesAssociationDocObj[0] != undefined){
        this.disableArticlesAssociationInput = true;
        this.showArticlesAssociationInput = false;
        this.buttonMessage = 'Click to view !'
        this.uploadIconArticlesAssociation = false;
        this.showArticlesAssociation = true; //new
        }
        // BANK_LICENSE
      if(this.bankLicenseDocObj[0] != undefined){
        this.disableBankLicenseInput = true;
        this.showBankLicenseInput = false;
        this.buttonMessage = 'Click to view !'
        this.uploadIconBankLicense = false;
        this.showBankLicense = true; //new
        }
         // TRADE_LICENSE
      if(this.tradeLicenseDocObj[0] != undefined){
        this.disableTradeLicenseInput = true;
        this.showTradeLicenseInput = false;
        this.buttonMessage = 'Click to view !'
        this.uploadIconTradeLicense = false;
        this.showTradeLicense = true; //new
        }
         // AML_POLICY_AND_PROCEDURES
      if(this.amlPolicyAndProceduresDocObj[0] != undefined){
        this.disableAmlPolicyAndProceduresInput = true;
        this.showAmlPolicyAndProceduresInput = false;
        this.buttonMessage = 'Click to view !'
        this.uploadIconAmlPolicyAndProcedures = false;
        this.showAmlPolicyAndProcedures = true; //new
        }
         // AUDIT_REPORT
      if(this.auditReportDocObj[0] != undefined){
        this.disableAuditReportInput = true;
        this.showAuditReportInput = false;
        this.buttonMessage = 'Click to view !'
        this.uploadIconAuditReport = false;
        this.showAuditReport = true; //new
        }
         // LATEST_AML_AUDIT_REPORT
      if(this.amlAuditReportDocObj[0] != undefined){
        this.disableAmlAuditReportInput = true;
        this.showAmlAuditReportInput = false;
        this.buttonMessage = 'Click to view !'
        this.uploadIconAmlAuditReport = false;
        this.showAmlAuditReport = true; //new
        }
         // LATEST_ORGANISATION_STRUCTURE
      if(this.organisationStructureDocObj[0] != undefined){
        this.disableOrganisationStructureInput = true;
        this.showOrganisationStructureInput = false;
        this.buttonMessage = 'Click to view !'
        this.uploadIconOrganisationStructure = false;
        this.showOrganisationStructure = true; //new
        }
        // MANAGEMENT_LIST
      if(this.managementListDocObj[0] != undefined){
        this.disableManagementListInput = true;
        this.showManagementListInput = false;
        this.buttonMessage = 'Click to view !'
        this.uploadIconManagementList = false;
        this.showManagementList = true; //new
        }
         // ID_COPIES
      if(this.idCopiesDocObj[0] != undefined){
        this.disableIdCopiesInput = true;
        this.showIdCopiesInput = false;
        this.buttonMessage = 'Click to view !'
        this.uploadIconIdCopies = false;
        this.showIdCopies = true; //new
        }
         // KYC_FORM
      if(this.kycFormDocObj[0] != undefined){
        this.disableKycFormInput = true;
        this.showKycFormInput = false;
        this.buttonMessage = 'Click to view !'
        this.uploadIconKycForm = false;
        this.showKycForm = true; //new
        }
         // WOLFSBERG_FORM
      if(this.wolfsbergFormDocObj[0] != undefined){
        this.disableWolfsbergFormInput = true;
        this.showWolfsbergFormInput = false;
        this.buttonMessage = 'Click to view !'
        this.uploadIconWolfsbergForm = false;
        this.showWolfsbergForm = true; //new
        }
        //ONBOARDING_DOCUMENT
        if(this.onboardingDocObj[0] != undefined){
          this.disableOnboardingDocInput = true;
          this.showOnboardingDocInput = false;
          this.buttonMessage = 'Click to view !'
          this.uploadIconOnboardingDoc = false;
          this.showOnboardingDoc = true; //new
          }
 

        if(this.ownerDocObj[0] != undefined){
          this.disableOwnerInput[index] = true;
          this.showOwnerInput[index] = false;
          this.buttonMessage = 'Click to view !'
          this.uploadIconOWNER[index] = false;
          this.showOWNER[index] = true;
        }
    
        if(this.dealerDocObj[0] != undefined){
          this.disableDealerInput[index] = true;
          this.showDealerInput[index] = false;
          this.buttonMessage = 'Click to view !'
          this.uploadIconDEALER[index] = false;
          this.showDEALER[index] = true;
        }
    
        if(this.runnerDocObj[0] != undefined){
          this.disableRunnerInput[index] = true;
          this.showRunnerInput[index] = false;
          this.buttonMessage = 'Click to view !'
          this.showRUNNER[index] = true;
          this.uploadIconRUNNER[index] = false;
        }
        
    });
  }, 800);

  
 }

 editData(documentTypeId:string,messageDesc:string,index: number){
  console.log(messageDesc) ;
  if(documentTypeId == "1005"){
    this.showReuploadCustomerAcra = true ; //Show upload ACRA button
    this.showEditInfoAcra = false ; //Hide Edit button 
    //this.uploadFENric = true
    //this.disableFENric = false
    }

  if(documentTypeId == "1006"){
    this.showReuploadCustomerOwnerNric[index] = true ; //Show upload Owner NRIC button
    this.showEditInfoOwner[index] = false ; //Hide Edit button 
    //this.uploadFENric = true
    //this.disableFENric = false
      }

  if(documentTypeId == "1007"){
     this.showReuploadCustomerDealerNric[index] = true ; //Show upload Dealer NRIC button
     this.showEditInfoDealer[index] = false ; //Hide Edit button 
    //this.uploadFENric = true
    //this.disableFENric = false
        }

  if(documentTypeId == "1008"){
     this.showReuploadCustomerRunnerNric[index] = true ; //Show upload Runner NRIC button
     this.showEditInfoRunner[index] = false ; //Hide Edit button 
     //this.uploadFENric = true
    //this.disableFENric = false
        }

     //NEW 12 DOCUMENTS
     //INCORPORATION_CERTIFICATE
        if(documentTypeId == "1009"){
          this.showReuploadIncorporationCert = true ; //Show upload INCORPORATION_CERTIFICATE button
          this.showEditInfoIncorporationCert = false ; //Hide Edit button 
          }      
           //ARTICLES_ASSOCIATION
        if(documentTypeId == "1010"){
          this.showReuploadArticlesAssociation = true ; //Show upload ARTICLES_ASSOCIATION button
          this.showEditInfoArticlesAssociation = false ; //Hide Edit button 
          }   
          //BANK_LICENSE
          if(documentTypeId == "1011"){
            this.showReuploadBankLicense = true ; //Show upload BANK_LICENSE button
            this.showEditInfoBankLicense = false ; //Hide Edit button 
            }   
             //TRADE_LICENSE
          if(documentTypeId == "1012"){
            this.showReuploadTradeLicense = true ; //Show upload TRADE_LICENSE button
            this.showEditInfoTradeLicense = false ; //Hide Edit button 
            }   
            //AML_POLICY_AND_PROCEDURES
          if(documentTypeId == "1013"){
            this.showReuploadAmlPolicyAndProcedures = true ; //Show upload AML_POLICY_AND_PROCEDURES button
            this.showEditInfoAmlPolicyAndProcedures = false ; //Hide Edit button 
            }   
            //AUDIT_REPORT
          if(documentTypeId == "1014"){
            this.showReuploadAuditReport = true ; //Show upload AUDIT_REPORT button
            this.showEditInfoAuditReport = false ; //Hide Edit button 
            }   
             //LATEST_AML_AUDIT_REPORT
          if(documentTypeId == "1015"){
            this.showReuploadAmlAuditReport = true ; //Show upload LATEST_AML_AUDIT_REPORT button
            this.showEditInfoAmlAuditReport = false ; //Hide Edit button 
            }   
             //LATEST_ORGANISATION_STRUCTURE
          if(documentTypeId == "1016"){
            this.showReuploadOrganisationStructure = true ; //Show upload LATEST_ORGANISATION_STRUCTURE button
            this.showEditInfoOrganisationStructure = false ; //Hide Edit button 
            }   
             //MANAGEMENT_LIST
          if(documentTypeId == "1017"){
            this.showReuploadManagementList = true ; //Show upload MANAGEMENT_LIST button
            this.showEditInfoManagementList = false ; //Hide Edit button 
            }   
             //ID_COPIES
          if(documentTypeId == "1018"){
            this.showReuploadIdCopies = true ; //Show upload ID_COPIES button
            this.showEditInfoIdCopies = false ; //Hide Edit button 
            }   
             //KYC_FORM
          if(documentTypeId == "1019"){
            this.showReuploadKycForm = true ; //Show upload KYC_FORM button
            this.showEditInfoKycForm = false ; //Hide Edit button 
            }   
             //WOLFSBERG_FORM
          if(documentTypeId == "1020"){
            this.showReuploadWolfsbergForm = true ; //Show upload WOLFSBERG_FORM button
            this.showEditInfoWolfsbergForm = false ; //Hide Edit button 
            }   
             //ONBOARDING_DOCUMENT
          if(documentTypeId == "1021"){
            this.showReuploadOnboardingDoc = true ; //Show upload ONBOARDING_DOCUMENT button
            this.showEditInfoOnboardingDoc = false ; //Hide Edit button 
            }   
           
 }

//Application search => MC => Submit Document API .
 onCompanyDocumentsOnboardingEditSubmit(){
  this.documentService.submitDocumentCorporate(this.submitCorpDocumentApplication()).subscribe
  (data => {
    if(this.applicationStatus != "PENDING" && this.applicationStatus != "APPROVED" && this.applicationStatus != "REJECTED"){
      this.dialogRef.open(ApplicationSubmitDialogComponent, {
        width: '460px',
        data : {isCorporateReview : true}
      })
    }
    else { //this.applicationStatus == "PENDING" and "APPROVED" --> just submit document and close all dialog . should not open application fulfillment dialog
      this.dialogRef.closeAll() ;
    }
   
  });
 }


 goToCompanyAssociatesAppSearch(){

  let applicationId = this.store.getItem('MC_CORP_APPLICATIONID') ? this.store.getItem('MC_CORP_APPLICATIONID') : "" ;
  let applicantId = this.store.getItem('MC_CORP_APPLICANTID') ? this.store.getItem('MC_CORP_APPLICANTID') : "" ;

    this.dialogRef.open(CompanyAssociateComponent, {
      data: { appSearchOnboardingForMc:true,applicationId:applicationId, applicantId : applicantId },
      panelClass: 'custom-modalbox',
      width:'1245px',
      height: '575px',
      disableClose : true
    })
  
 
 }


 // Corporate mobile onload > APPSTATUS === "NEW"
 applicationInquiryDataModel !: CorporateApplicationInquiry ;
 customerInquiryDataModel !: CorporateCustomerInquiry ;

 initialLayoutSetup(datas:CorporateApplicationInquiry , entryPoint : string){
  if(entryPoint == "CORPMOBILE-NEW" || entryPoint == "BACKOFFICEBRANCH-NEW"){ 
    // 1. Based on associates : iterate documents layout 
    // 2. Can able to Upload 
    // 3. Click to view : JPEG n PDF 
     //to change default - ACRA;
   this.showAcraInput = true;
   this.uploadIconACRA  = true;
   this.disableAcraInput  = false;
   this.loadACRA = false;
   this.showACRA  = false;
   this.showImageAcra  = true;
   this.showOtherFormatAcra  = false;
   this.reuploadAcra  = false;

   // NEW 12 DOCUMENTS
   //to change default - INCORPORATION_CERTIFICATE;
   this.showIncorporationCertInput = true;
   this.uploadIconIncorporationCert  = true;
   this.disableIncorporationCertInput  = false;
   this.loadIncorporationCert = false;
   this.showIncorporationCert  = false;
   this.showImageIncorporationCert  = true;
   this.showOtherFormatIncorporationCert  = false;
   this.reuploadIncorporationCert  = false;

    //to change default - ARTICLES_ASSOCIATION;
    this.showArticlesAssociationInput = true;
    this.uploadIconArticlesAssociation  = true;
    this.disableArticlesAssociationInput  = false;
    this.loadArticlesAssociation = false;
    this.showArticlesAssociation  = false;
    this.showImageArticlesAssociation  = true;
    this.showOtherFormatArticlesAssociation  = false;
    this.reuploadArticlesAssociation  = false;

    //to change default - BANK_LICENSE;
    this.showBankLicenseInput = true;
    this.uploadIconBankLicense  = true;
    this.disableBankLicenseInput  = false;
    this.loadBankLicense = false;
    this.showBankLicense  = false;
    this.showImageBankLicense  = true;
    this.showOtherFormatBankLicense  = false;
    this.reuploadBankLicense  = false;

    //to change default - TRADE_LICENSE;
    this.showTradeLicenseInput = true;
    this.uploadIconTradeLicense  = true;
    this.disableTradeLicenseInput  = false;
    this.loadTradeLicense = false;
    this.showTradeLicense  = false;
    this.showImageTradeLicense  = true;
    this.showOtherFormatTradeLicense  = false;
    this.reuploadTradeLicense  = false;

    //to change default - AML_POLICY_AND_PROCEDURES;
    this.showAmlPolicyAndProceduresInput = true;
    this.uploadIconAmlPolicyAndProcedures  = true;
    this.disableAmlPolicyAndProceduresInput  = false;
    this.loadAmlPolicyAndProcedures = false;
    this.showAmlPolicyAndProcedures  = false;
    this.showImageAmlPolicyAndProcedures  = true;
    this.showOtherFormatAmlPolicyAndProcedures  = false;
    this.reuploadAmlPolicyAndProcedures  = false;

    //to change default - AUDIT_REPORT;
    this.showAuditReportInput = true;
    this.uploadIconAuditReport  = true;
    this.disableAuditReportInput  = false;
    this.loadAuditReport = false;
    this.showAuditReport  = false;
    this.showImageAuditReport  = true;
    this.showOtherFormatAuditReport  = false;
    this.reuploadAuditReport  = false;

    //to change default - LATEST_AML_AUDIT_REPORT;
    this.showAmlAuditReportInput = true;
    this.uploadIconAmlAuditReport  = true;
    this.disableAmlAuditReportInput  = false;
    this.loadAmlAuditReport = false;
    this.showAmlAuditReport  = false;
    this.showImageAmlAuditReport  = true;
    this.showOtherFormatAmlAuditReport  = false;
    this.reuploadAmlAuditReport  = false;

     //to change default - LATEST_ORGANISATION_STRUCTURE;
     this.showOrganisationStructureInput = true;
     this.uploadIconOrganisationStructure  = true;
     this.disableOrganisationStructureInput  = false;
     this.loadOrganisationStructure = false;
     this.showOrganisationStructure  = false;
     this.showImageOrganisationStructure  = true;
     this.showOtherFormatOrganisationStructure  = false;
     this.reuploadOrganisationStructure  = false;

      //to change default - MANAGEMENT_LIST;
      this.showManagementListInput = true;
      this.uploadIconManagementList  = true;
      this.disableManagementListInput  = false;
      this.loadManagementList = false;
      this.showManagementList  = false;
      this.showImageManagementList  = true;
      this.showOtherFormatManagementList  = false;
      this.reuploadManagementList  = false;

       //to change default - ID_COPIES;
       this.showIdCopiesInput = true;
       this.uploadIconIdCopies  = true;
       this.disableIdCopiesInput  = false;
       this.loadIdCopies = false;
       this.showIdCopies  = false;
       this.showImageIdCopies  = true;
       this.showOtherFormatIdCopies  = false;
       this.reuploadIdCopies  = false;

       //to change default - KYC_FORM;
       this.showKycFormInput = true;
       this.uploadIconKycForm  = true;
       this.disableKycFormInput  = false;
       this.loadKycForm = false;
       this.showKycForm  = false;
       this.showImageKycForm  = true;
       this.showOtherFormatKycForm  = false;
       this.reuploadKycForm  = false;

        //to change default - WOLFSBERG_FORM;
        this.showWolfsbergFormInput = true;
        this.uploadIconWolfsbergForm  = true;
        this.disableWolfsbergFormInput  = false;
        this.loadWolfsbergForm = false;
        this.showWolfsbergForm  = false;
        this.showImageWolfsbergForm  = true;
        this.showOtherFormatWolfsbergForm  = false;
        this.reuploadWolfsbergForm  = false;

         //to change default - ONBOARDING_DOCUMENT;
         this.showOnboardingDocInput = true;
         this.uploadIconOnboardingDoc  = true;
         this.disableOnboardingDocInput  = false;
         this.loadOnboardingDoc = false;
         this.showOnboardingDoc  = false;
         this.showImageOnboardingDoc  = true;
         this.showOtherFormatOnboardingDoc  = false;
         this.reuploadOnboardingDoc  = false;
 

  //clear owners array
  this.owners = [];
  this.showImageOwner =[];
  this.showOtherFormatOwner =[];
  this.showOWNER =[];
  this.uploadIconOWNER =[];
  this.showOwnerInput =[];
  this.reuploadOwner =[];
  this.loadOWNER =[];
  this.disableOwnerInput =[];
  this.combinedOwnerData =[];

   //clear dealers array
  this.dealers = [];
  this.showImageDealer =[];
  this.showOtherFormatDealer =[];
  this.showDEALER =[];
  this.uploadIconDEALER =[];
  this.showDealerInput =[];
  this.reuploadDealer =[];
  this.loadDEALER =[];
  this.disableDealerInput =[];
  this.combinedDealerData =[];

   //clear runners array
  this.runners = [];
  this.showImageRunner =[];
  this.showOtherFormatRunner =[];
  this.showRUNNER =[];
  this.uploadIconRUNNER =[];
  this.showRunnerInput =[];
  this.reuploadRunner =[];
  this.loadRUNNER =[];
  this.disableRunnerInput =[];
  this.combinedRunnerData =[];

        //segerate owner,dealer,runner.
        this.owners = datas.corporate.associate?.owner ? datas.corporate.associate.owner : [];
        this.dealers = datas.corporate.associate?.dealer ? datas.corporate.associate.dealer : [];
        this.runners = datas.corporate.associate?.runner ? datas.corporate.associate.runner : [];

        //dynamically control,while iterate multiple documents field - owners.
        if(this.owners.length != 0){
        for (let i = 0; i < this.owners.length; i++) {
          this.showImageOwner.push(true);
          this.showOtherFormatOwner.push(false);
          this.showOWNER.push(false);
          this.uploadIconOWNER.push(true);
          this.showOwnerInput.push(true);
          this.reuploadOwner.push(false);
          this.loadOWNER.push(false);
          this.disableOwnerInput.push(false)
        }
      }

        //dealers
        if(this.dealers.length != 0){
        for (let i = 0; i < this.dealers.length; i++) {
          this.showImageDealer.push(true);
          this.showOtherFormatDealer.push(false);
          this.showDEALER.push(false);
          this.uploadIconDEALER.push(true);
          this.showDealerInput.push(true);
          this.reuploadDealer.push(false);
          this.loadDEALER.push(false);
          this.disableDealerInput.push(false);
        }
        }

        //runners
        if(this.runners.length != 0){
        for (let i = 0; i < this.runners.length; i++) {
          this.showImageRunner.push(true);
          this.showOtherFormatRunner.push(false);
          this.showRUNNER.push(false);
          this.uploadIconRUNNER.push(true);
          this.showRunnerInput.push(true);
          this.reuploadRunner.push(false);
          this.loadRUNNER.push(false);
          this.disableRunnerInput.push(false);
        }
      }

        //Filtering documents node object using document name.
        if (datas.document != undefined || datas.document != null) {
          this.acraDocObj = datas.document.filter((v: any) => v.docName == "ACRA");
          // NEW 12 DOCUMENTS
          this.incorporationCertDocObj = datas.document.filter((v: any) => v.docName == "INCORPORATION_CERTIFICATE");
          this.articlesAssociationDocObj = datas.document.filter((v: any) => v.docName == "ARTICLES_ASSOCIATION");
          this.bankLicenseDocObj = datas.document.filter((v: any) => v.docName == "BANK_LICENSE");
          this.tradeLicenseDocObj = datas.document.filter((v: any) => v.docName == "TRADE_LICENSE");
          this.amlPolicyAndProceduresDocObj = datas.document.filter((v: any) => v.docName == "AML_POLICY_AND_PROCEDURES");
          this.auditReportDocObj = datas.document.filter((v: any) => v.docName == "AUDIT_REPORT");
          this.amlAuditReportDocObj = datas.document.filter((v: any) => v.docName == "LATEST_AML_AUDIT_REPORT");
          this.organisationStructureDocObj = datas.document.filter((v: any) => v.docName == "LATEST_ORGANISATION_STRUCTURE");
          this.managementListDocObj = datas.document.filter((v: any) => v.docName == "MANAGEMENT_LIST");
          this.idCopiesDocObj = datas.document.filter((v: any) => v.docName == "ID_COPIES");
          this.kycFormDocObj = datas.document.filter((v: any) => v.docName == "KYC_FORM");
          this.wolfsbergFormDocObj = datas.document.filter((v: any) => v.docName == "WOLFSBERG_FORM");
          this.onboardingDocObj = datas.document.filter((v: any) => v.docName == "ONBOARDING_DOCUMENT");


          this.ownerDocObj = datas.document.filter((v: any) => v.docName == "OWNER_NRIC");
          this.dealerDocObj = datas.document.filter((v: any) => v.docName == "DEALER_NRIC");
          this.runnerDocObj = datas.document.filter((v: any) => v.docName == "RUNNER_NRIC");
        }
        else {
          this.acraDocObj = [];
          //NEW 12 DOCUMENTS
          this.incorporationCertDocObj = [];
          this.articlesAssociationDocObj = [];
          this.bankLicenseDocObj = [];
          this.tradeLicenseDocObj = [];
          this.amlPolicyAndProceduresDocObj = [];
          this.auditReportDocObj = [];
          this.amlAuditReportDocObj = [];
          this.organisationStructureDocObj = [];
          this.managementListDocObj = [];
          this.idCopiesDocObj = [];
          this.kycFormDocObj = [];
          this.wolfsbergFormDocObj = [];
          this.onboardingDocObj = [];

          this.ownerDocObj = [];
          this.dealerDocObj = [];
          this.runnerDocObj = [];
        }

        if (datas.document != null) {
          console.log("Documents already exist");

          //ACRA - if Document already uploaded.
          if (this.acraDocObj[0] != undefined && this.acraDocObj.length != 0) {
            this.disableAcraInput = true;
            this.showAcraInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconACRA = false;
            this.showACRA = true;
            this.reuploadAcra = false;
          }
          // NEW 12 DOCUMENTS
          //INCORPORATION_CERTIFICATE - if Document already uploaded.
          if (this.incorporationCertDocObj[0] != undefined && this.incorporationCertDocObj.length != 0) {
            this.disableIncorporationCertInput = true;
            this.showIncorporationCertInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconIncorporationCert = false;
            this.showIncorporationCert = true;
            this.reuploadIncorporationCert = false;
          }
          //ARTICLES_ASSOCIATION - if Document already uploaded.
          if (this.articlesAssociationDocObj[0] != undefined && this.articlesAssociationDocObj.length != 0) {
            this.disableArticlesAssociationInput = true;
            this.showArticlesAssociationInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconArticlesAssociation = false;
            this.showArticlesAssociation = true;
            this.reuploadArticlesAssociation = false;
          }
           //BANK_LICENSE - if Document already uploaded.
           if (this.bankLicenseDocObj[0] != undefined && this.bankLicenseDocObj.length != 0) {
            this.disableBankLicenseInput = true;
            this.showBankLicenseInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconBankLicense = false;
            this.showBankLicense = true;
            this.reuploadBankLicense = false;
          }
          //TRADE_LICENSE - if Document already uploaded.
          if (this.tradeLicenseDocObj[0] != undefined && this.tradeLicenseDocObj.length != 0) {
            this.disableTradeLicenseInput = true;
            this.showTradeLicenseInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconTradeLicense = false;
            this.showTradeLicense = true;
            this.reuploadTradeLicense = false;
          }
           //AML_POLICY_AND_PROCEDURES - if Document already uploaded.
           if (this.amlPolicyAndProceduresDocObj[0] != undefined && this.amlPolicyAndProceduresDocObj.length != 0) {
            this.disableAmlPolicyAndProceduresInput = true;
            this.showAmlPolicyAndProceduresInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconAmlPolicyAndProcedures = false;
            this.showAmlPolicyAndProcedures = true;
            this.reuploadAmlPolicyAndProcedures = false;
          }
           //AUDIT_REPORT - if Document already uploaded.
           if (this.auditReportDocObj[0] != undefined && this.auditReportDocObj.length != 0) {
            this.disableAuditReportInput = true;
            this.showAuditReportInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconAuditReport = false;
            this.showAuditReport = true;
            this.reuploadAuditReport = false;
          }
           //LATEST_AML_AUDIT_REPORT - if Document already uploaded.
           if (this.amlAuditReportDocObj[0] != undefined && this.amlAuditReportDocObj.length != 0) {
            this.disableAmlAuditReportInput = true;
            this.showAmlAuditReportInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconAmlAuditReport = false;
            this.showAmlAuditReport = true;
            this.reuploadAmlAuditReport = false;
          }
            //LATEST_ORGANISATION_STRUCTURE - if Document already uploaded.
            if (this.organisationStructureDocObj[0] != undefined && this.organisationStructureDocObj.length != 0) {
              this.disableOrganisationStructureInput = true;
              this.showOrganisationStructureInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconOrganisationStructure = false;
              this.showOrganisationStructure = true;
              this.reuploadOrganisationStructure = false;
            }
              //MANAGEMENT_LIST - if Document already uploaded.
            if (this.managementListDocObj[0] != undefined && this.managementListDocObj.length != 0) {
              this.disableManagementListInput = true;
              this.showManagementListInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconManagementList = false;
              this.showManagementList = true;
              this.reuploadManagementList = false;
            }
              //ID_COPIES - if Document already uploaded.
              if (this.idCopiesDocObj[0] != undefined && this.idCopiesDocObj.length != 0) {
                this.disableIdCopiesInput = true;
                this.showIdCopiesInput = false;
                this.buttonMessage = 'Click to view !';
                this.uploadIconIdCopies = false;
                this.showIdCopies = true;
                this.reuploadIdCopies = false;
              }
               //KYC_FORM - if Document already uploaded.
               if (this.kycFormDocObj[0] != undefined && this.kycFormDocObj.length != 0) {
                this.disableKycFormInput = true;
                this.showKycFormInput = false;
                this.buttonMessage = 'Click to view !';
                this.uploadIconKycForm = false;
                this.showKycForm = true;
                this.reuploadKycForm = false;
              }
               //WOLFSBERG_FORM - if Document already uploaded.
               if (this.wolfsbergFormDocObj[0] != undefined && this.wolfsbergFormDocObj.length != 0) {
                this.disableWolfsbergFormInput = true;
                this.showWolfsbergFormInput = false;
                this.buttonMessage = 'Click to view !';
                this.uploadIconWolfsbergForm = false;
                this.showWolfsbergForm = true;
                this.reuploadWolfsbergForm = false;
              }

              //ONBOARDING_DOCUMENT - if Document already uploaded.
              if (this.onboardingDocObj[0] != undefined && this.onboardingDocObj.length != 0) {
                this.disableOnboardingDocInput = true;
                this.showOnboardingDocInput = false;
                this.buttonMessage = 'Click to view !';
                this.uploadIconOnboardingDoc = false;
                this.showOnboardingDoc = true;
                this.reuploadOnboardingDoc = false;
              }

          //Owner Nric - If Document already Uploaded.
          if (this.ownerDocObj.length >= 1) {
            console.log("Owner Doc is already exist");
            let ownerDocNode = datas.document;
            this.owners.forEach((owner, ownerIndex) => { //This owners array --> stored from application inquiry response . 
              const ownerDocMatch = ownerDocNode.find((doc: any) => doc.associateId === owner.associateId && doc.docName === "OWNER_NRIC");
              //combined object if assoicatedId match
              if (ownerDocMatch) {
                const combinedOwnerObj = {
                  ...owner,
                  documentId: ownerDocMatch.docId,
                  documentName: ownerDocMatch.docName,
                  ownerNodeIndex: ownerIndex // Index of ownerNode
                };
                this.combinedOwnerData.push(combinedOwnerObj);
              }
            });
            // to show documents corresponding field
            this.combinedOwnerData.forEach((item: any) => {
              let index = item.ownerNodeIndex
              this.disableOwnerInput[index] = true;
              this.showOwnerInput[index] = false;
              this.buttonMessage = 'Click to view!';
              this.uploadIconOWNER[index] = false;
              this.showOWNER[index] = true;
              this.reuploadOwner[index] = false;
            });

          }
          //Dealer Nric - If Document already Uploaded.
          if (this.dealerDocObj.length >= 1) {
            console.log("Dealer Doc is already exist");
            let dealerDocNode = datas.document;
            this.dealers.forEach((dealer, dealerIndex) => {
              const dealerDocMatch = dealerDocNode.find((doc: any) => doc.associateId === dealer.associateId && doc.docName === "DEALER_NRIC"); 
              //combined object if assoicatedId match
              if (dealerDocMatch) {
                const combinedDealerObj = {
                  ...dealer,
                  documentId: dealerDocMatch.docId,
                  documentName: dealerDocMatch.docName,
                  dealerNodeIndex: dealerIndex // Index of dealerNode
                };
                this.combinedDealerData.push(combinedDealerObj);
              }
            });
            // to show documents corresponding field
            this.combinedDealerData.forEach((item: any) => {
              let index = item.dealerNodeIndex
              this.disableDealerInput[index] = true;
              this.showDealerInput[index] = false;
              this.buttonMessage = 'Click to view !'
              this.uploadIconDEALER[index] = false;
              this.showDEALER[index] = true;
              this.reuploadDealer[index] = false;
            });

          }

          //Runner Nric - If Document already Uploaded.
          if (this.runnerDocObj.length >= 1) {
            console.log("Runner Doc is already exist");
            let runnerDocNode = datas.document;
            this.runners.forEach((runner, runnerIndex) => {
              const runnerDocMatch = runnerDocNode.find((doc: any) => doc.associateId === runner.associateId && doc.docName === "RUNNER_NRIC");
              //combined object if assoicatedId match
              if (runnerDocMatch) {
                const combinedRunnerObj = {
                  ...runner,
                  documentId: runnerDocMatch.docId,
                  documentName: runnerDocMatch.docName,
                  runnerNodeIndex: runnerIndex // Index of runnerNode
                };
                this.combinedRunnerData.push(combinedRunnerObj);
              }
            });
            // to show documents corresponding field
            this.combinedRunnerData.forEach((item: any) => {
              let index = item.runnerNodeIndex
              this.disableRunnerInput[index] = true;
              this.showRunnerInput[index] = false;
              this.buttonMessage = 'Click to view !'
              this.uploadIconRUNNER[index] = false;
              this.showRUNNER[index] = true;
              this.reuploadRunner[index] = false;
            });

          }
        }
        else {
          console.log("No Documents uploaded.");
        }
  }
  else if(entryPoint == "CORPMOBILE-PENDING" || entryPoint == "BACKOFFICEMOBILE-ALLSTATUS"){
    this.flowEntryPoint = entryPoint ;
     // 1. Based on associates : iterate documents layout 
    // 2. Not able to Upload 
    // 3. Click to view : JPEG n PDF 
      //to change default - ACRA;
      this.showAcraInput = true;
      this.uploadIconACRA  = true;
      this.disableAcraInput  = true; //disable ACRA input
      this.loadACRA = false;
      this.showACRA  = false;
      this.showImageAcra  = true;
      this.showOtherFormatAcra  = false;
      this.reuploadAcra  = false;

      // NEW 12 DOCUMENTS
   //to change default - INCORPORATION_CERTIFICATE;
   this.showIncorporationCertInput = true;
   this.uploadIconIncorporationCert  = true;
   this.disableIncorporationCertInput  = true;
   this.loadIncorporationCert = false;
   this.showIncorporationCert  = false;
   this.showImageIncorporationCert  = true;
   this.showOtherFormatIncorporationCert  = false;
   this.reuploadIncorporationCert  = false;

    //to change default - ARTICLES_ASSOCIATION;
    this.showArticlesAssociationInput = true;
    this.uploadIconArticlesAssociation  = true;
    this.disableArticlesAssociationInput  = true;
    this.loadArticlesAssociation = false;
    this.showArticlesAssociation  = false;
    this.showImageArticlesAssociation  = true;
    this.showOtherFormatArticlesAssociation  = false;
    this.reuploadArticlesAssociation  = false;

    //to change default - BANK_LICENSE;
    this.showBankLicenseInput = true;
    this.uploadIconBankLicense  = true;
    this.disableBankLicenseInput  = true;
    this.loadBankLicense = false;
    this.showBankLicense  = false;
    this.showImageBankLicense  = true;
    this.showOtherFormatBankLicense  = false;
    this.reuploadBankLicense  = false;

    //to change default - TRADE_LICENSE;
    this.showTradeLicenseInput = true;
    this.uploadIconTradeLicense  = true;
    this.disableTradeLicenseInput  = true;
    this.loadTradeLicense = false;
    this.showTradeLicense  = false;
    this.showImageTradeLicense  = true;
    this.showOtherFormatTradeLicense  = false;
    this.reuploadTradeLicense  = false;

    //to change default - AML_POLICY_AND_PROCEDURES;
    this.showAmlPolicyAndProceduresInput = true;
    this.uploadIconAmlPolicyAndProcedures  = true;
    this.disableAmlPolicyAndProceduresInput  = true;
    this.loadAmlPolicyAndProcedures = false;
    this.showAmlPolicyAndProcedures  = false;
    this.showImageAmlPolicyAndProcedures  = true;
    this.showOtherFormatAmlPolicyAndProcedures  = false;
    this.reuploadAmlPolicyAndProcedures  = false;

    //to change default - AUDIT_REPORT;
    this.showAuditReportInput = true;
    this.uploadIconAuditReport  = true;
    this.disableAuditReportInput  = true;
    this.loadAuditReport = false;
    this.showAuditReport  = false;
    this.showImageAuditReport  = true;
    this.showOtherFormatAuditReport  = false;
    this.reuploadAuditReport  = false;

    //to change default - LATEST_AML_AUDIT_REPORT;
    this.showAmlAuditReportInput = true;
    this.uploadIconAmlAuditReport  = true;
    this.disableAmlAuditReportInput  = true;
    this.loadAmlAuditReport = false;
    this.showAmlAuditReport  = false;
    this.showImageAmlAuditReport  = true;
    this.showOtherFormatAmlAuditReport  = false;
    this.reuploadAmlAuditReport  = false;

     //to change default - LATEST_ORGANISATION_STRUCTURE;
     this.showOrganisationStructureInput = true;
     this.uploadIconOrganisationStructure  = true;
     this.disableOrganisationStructureInput  = true;
     this.loadOrganisationStructure = false;
     this.showOrganisationStructure  = false;
     this.showImageOrganisationStructure  = true;
     this.showOtherFormatOrganisationStructure  = false;
     this.reuploadOrganisationStructure  = false;

      //to change default - MANAGEMENT_LIST;
      this.showManagementListInput = true;
      this.uploadIconManagementList  = true;
      this.disableManagementListInput  = true;
      this.loadManagementList = false;
      this.showManagementList  = false;
      this.showImageManagementList  = true;
      this.showOtherFormatManagementList  = false;
      this.reuploadManagementList  = false;

       //to change default - ID_COPIES;
       this.showIdCopiesInput = true;
       this.uploadIconIdCopies  = true;
       this.disableIdCopiesInput  = true;
       this.loadIdCopies = false;
       this.showIdCopies  = false;
       this.showImageIdCopies  = true;
       this.showOtherFormatIdCopies  = false;
       this.reuploadIdCopies  = false;

       //to change default - KYC_FORM;
       this.showKycFormInput = true;
       this.uploadIconKycForm  = true;
       this.disableKycFormInput  = true;
       this.loadKycForm = false;
       this.showKycForm  = false;
       this.showImageKycForm  = true;
       this.showOtherFormatKycForm  = false;
       this.reuploadKycForm  = false;

        //to change default - WOLFSBERG_FORM;
        this.showWolfsbergFormInput = true;
        this.uploadIconWolfsbergForm  = true;
        this.disableWolfsbergFormInput  = true;
        this.loadWolfsbergForm = false;
        this.showWolfsbergForm  = false;
        this.showImageWolfsbergForm  = true;
        this.showOtherFormatWolfsbergForm  = false;
        this.reuploadWolfsbergForm  = false;

        //to change default - ONBOARDING_DOCUMENT;
        this.showOnboardingDocInput = true;
        this.uploadIconOnboardingDoc = true;
        this.disableOnboardingDocInput = true;
        this.loadOnboardingDoc = false;
        this.showOnboardingDoc = false;
        this.showImageOnboardingDoc = true;
        this.showOtherFormatOnboardingDoc = false;
        this.reuploadOnboardingDoc = false;
   
     //clear owners array
     this.owners = [];
     this.showImageOwner =[];
     this.showOtherFormatOwner =[];
     this.showOWNER =[];
     this.uploadIconOWNER =[];
     this.showOwnerInput =[];
     this.reuploadOwner =[];
     this.loadOWNER =[];
     this.disableOwnerInput =[];
     this.combinedOwnerData =[];
   
      //clear dealers array
     this.dealers = [];
     this.showImageDealer =[];
     this.showOtherFormatDealer =[];
     this.showDEALER =[];
     this.uploadIconDEALER =[];
     this.showDealerInput =[];
     this.reuploadDealer =[];
     this.loadDEALER =[];
     this.disableDealerInput =[];
     this.combinedDealerData =[];
   
      //clear runners array
     this.runners = [];
     this.showImageRunner =[];
     this.showOtherFormatRunner =[];
     this.showRUNNER =[];
     this.uploadIconRUNNER =[];
     this.showRunnerInput =[];
     this.reuploadRunner =[];
     this.loadRUNNER =[];
     this.disableRunnerInput =[];
     this.combinedRunnerData =[];
   
           //segerate owner,dealer,runner.
           this.owners = datas.corporate.associate.owner ? datas.corporate.associate.owner : [];
           this.dealers = datas.corporate.associate.dealer ? datas.corporate.associate.dealer : [];
           this.runners = datas.corporate.associate.runner ? datas.corporate.associate.runner : [];
   
           //dynamically control,while iterate multiple documents field - owners.
           if(this.owners.length != 0){
           for (let i = 0; i < this.owners.length; i++) {
             this.showImageOwner.push(true);
             this.showOtherFormatOwner.push(false);
             this.showOWNER.push(false);
             this.uploadIconOWNER.push(true);
             this.showOwnerInput.push(true);
             this.reuploadOwner.push(false);
             this.loadOWNER.push(false);
             this.disableOwnerInput.push(true) //User not allowed to upload documents
           }
         }
   
           //dealers
           if(this.dealers.length != 0){
           for (let i = 0; i < this.dealers.length; i++) {
             this.showImageDealer.push(true);
             this.showOtherFormatDealer.push(false);
             this.showDEALER.push(false);
             this.uploadIconDEALER.push(true);
             this.showDealerInput.push(true);
             this.reuploadDealer.push(false);
             this.loadDEALER.push(false);
             this.disableDealerInput.push(true); //User not allowed to upload documents
           }
           }
   
           //runners
           if(this.runners.length != 0){
           for (let i = 0; i < this.runners.length; i++) {
             this.showImageRunner.push(true);
             this.showOtherFormatRunner.push(false);
             this.showRUNNER.push(false);
             this.uploadIconRUNNER.push(true);
             this.showRunnerInput.push(true);
             this.reuploadRunner.push(false);
             this.loadRUNNER.push(false);
             this.disableRunnerInput.push(true); //User not allowed to upload documents
           }
         }
   
           //Filtering documents node object using document name.
           if (datas.document != undefined || datas.document != null) {
             this.acraDocObj = datas.document.filter((v: any) => v.docName == "ACRA");
  
               // NEW 12 DOCUMENTS
             this.incorporationCertDocObj = datas.document.filter((v: any) => v.docName == "INCORPORATION_CERTIFICATE");
             this.articlesAssociationDocObj = datas.document.filter((v: any) => v.docName == "ARTICLES_ASSOCIATION");
             this.bankLicenseDocObj = datas.document.filter((v: any) => v.docName == "BANK_LICENSE");
             this.tradeLicenseDocObj = datas.document.filter((v: any) => v.docName == "TRADE_LICENSE");
             this.amlPolicyAndProceduresDocObj = datas.document.filter((v: any) => v.docName == "AML_POLICY_AND_PROCEDURES");
             this.auditReportDocObj = datas.document.filter((v: any) => v.docName == "AUDIT_REPORT");
             this.amlAuditReportDocObj = datas.document.filter((v: any) => v.docName == "LATEST_AML_AUDIT_REPORT");
             this.organisationStructureDocObj = datas.document.filter((v: any) => v.docName == "LATEST_ORGANISATION_STRUCTURE");
             this.managementListDocObj = datas.document.filter((v: any) => v.docName == "MANAGEMENT_LIST");
             this.idCopiesDocObj = datas.document.filter((v: any) => v.docName == "ID_COPIES");
             this.kycFormDocObj = datas.document.filter((v: any) => v.docName == "KYC_FORM");
             this.wolfsbergFormDocObj = datas.document.filter((v: any) => v.docName == "WOLFSBERG_FORM");
             this.onboardingDocObj = datas.document.filter((v: any) => v.docName == "ONBOARDING_DOCUMENT");

             this.ownerDocObj = datas.document.filter((v: any) => v.docName == "OWNER_NRIC");
             this.dealerDocObj = datas.document.filter((v: any) => v.docName == "DEALER_NRIC");
             this.runnerDocObj = datas.document.filter((v: any) => v.docName == "RUNNER_NRIC");
  
              //ACRA - if Document already uploaded.
              if (this.acraDocObj[0] != undefined && this.acraDocObj.length != 0) {
                this.disableAcraInput = true;
                this.showAcraInput = false;
                this.buttonMessage = 'Click to view !';
                this.uploadIconACRA = false;
                this.showACRA = true;
                this.reuploadAcra = false;
              }

               // NEW 12 DOCUMENTS
          //INCORPORATION_CERTIFICATE - if Document already uploaded.
          if (this.incorporationCertDocObj[0] != undefined && this.incorporationCertDocObj.length != 0) {
            this.disableIncorporationCertInput = true;
            this.showIncorporationCertInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconIncorporationCert = false;
            this.showIncorporationCert = true;
            this.reuploadIncorporationCert = false;
          }
          //ARTICLES_ASSOCIATION - if Document already uploaded.
          if (this.articlesAssociationDocObj[0] != undefined && this.articlesAssociationDocObj.length != 0) {
            this.disableArticlesAssociationInput = true;
            this.showArticlesAssociationInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconArticlesAssociation = false;
            this.showArticlesAssociation = true;
            this.reuploadArticlesAssociation = false;
          }
           //BANK_LICENSE - if Document already uploaded.
           if (this.bankLicenseDocObj[0] != undefined && this.bankLicenseDocObj.length != 0) {
            this.disableBankLicenseInput = true;
            this.showBankLicenseInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconBankLicense = false;
            this.showBankLicense = true;
            this.reuploadBankLicense = false;
          }
          //TRADE_LICENSE - if Document already uploaded.
          if (this.tradeLicenseDocObj[0] != undefined && this.tradeLicenseDocObj.length != 0) {
            this.disableTradeLicenseInput = true;
            this.showTradeLicenseInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconTradeLicense = false;
            this.showTradeLicense = true;
            this.reuploadTradeLicense = false;
          }
           //AML_POLICY_AND_PROCEDURES - if Document already uploaded.
           if (this.amlPolicyAndProceduresDocObj[0] != undefined && this.amlPolicyAndProceduresDocObj.length != 0) {
            this.disableAmlPolicyAndProceduresInput = true;
            this.showAmlPolicyAndProceduresInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconAmlPolicyAndProcedures = false;
            this.showAmlPolicyAndProcedures = true;
            this.reuploadAmlPolicyAndProcedures = false;
          }
           //AUDIT_REPORT - if Document already uploaded.
           if (this.auditReportDocObj[0] != undefined && this.auditReportDocObj.length != 0) {
            this.disableAuditReportInput = true;
            this.showAuditReportInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconAuditReport = false;
            this.showAuditReport = true;
            this.reuploadAuditReport = false;
          }
           //LATEST_AML_AUDIT_REPORT - if Document already uploaded.
           if (this.amlAuditReportDocObj[0] != undefined && this.amlAuditReportDocObj.length != 0) {
            this.disableAmlAuditReportInput = true;
            this.showAmlAuditReportInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconAmlAuditReport = false;
            this.showAmlAuditReport = true;
            this.reuploadAmlAuditReport = false;
          }
            //LATEST_ORGANISATION_STRUCTURE - if Document already uploaded.
            if (this.organisationStructureDocObj[0] != undefined && this.organisationStructureDocObj.length != 0) {
              this.disableOrganisationStructureInput = true;
              this.showOrganisationStructureInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconOrganisationStructure = false;
              this.showOrganisationStructure = true;
              this.reuploadOrganisationStructure = false;
            }
              //MANAGEMENT_LIST - if Document already uploaded.
            if (this.managementListDocObj[0] != undefined && this.managementListDocObj.length != 0) {
              this.disableManagementListInput = true;
              this.showManagementListInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconManagementList = false;
              this.showManagementList = true;
              this.reuploadManagementList = false;
            }
              //ID_COPIES - if Document already uploaded.
              if (this.idCopiesDocObj[0] != undefined && this.idCopiesDocObj.length != 0) {
                this.disableIdCopiesInput = true;
                this.showIdCopiesInput = false;
                this.buttonMessage = 'Click to view !';
                this.uploadIconIdCopies = false;
                this.showIdCopies = true;
                this.reuploadIdCopies = false;
              }
               //KYC_FORM - if Document already uploaded.
               if (this.kycFormDocObj[0] != undefined && this.kycFormDocObj.length != 0) {
                this.disableKycFormInput = true;
                this.showKycFormInput = false;
                this.buttonMessage = 'Click to view !';
                this.uploadIconKycForm = false;
                this.showKycForm = true;
                this.reuploadKycForm = false;
              }
               //WOLFSBERG_FORM - if Document already uploaded.
               if (this.wolfsbergFormDocObj[0] != undefined && this.wolfsbergFormDocObj.length != 0) {
                this.disableWolfsbergFormInput = true;
                this.showWolfsbergFormInput = false;
                this.buttonMessage = 'Click to view !';
                this.uploadIconWolfsbergForm = false;
                this.showWolfsbergForm = true;
                this.reuploadWolfsbergForm = false;
              }

              //ONBOARDING_DOCUMENT - if Document already uploaded.
              if (this.onboardingDocObj[0] != undefined && this.onboardingDocObj.length != 0) {
                this.disableOnboardingDocInput = true;
                this.showOnboardingDocInput = false;
                this.buttonMessage = 'Click to view !';
                this.uploadIconOnboardingDoc = false;
                this.showOnboardingDoc = true;
                this.reuploadOnboardingDoc = false;
              }
    
              //Owner Nric - If Document already Uploaded.
              if (this.ownerDocObj.length >= 1) {
                console.log("Owner Doc is already exist");
                let ownerDocNode = datas.document;
                this.owners.forEach((owner, ownerIndex) => {
                  const ownerDocMatch = ownerDocNode.find((doc: any) => doc.associateId === owner.associateId && doc.docName === "OWNER_NRIC");
                  //combined object if assoicatedId match
                  if (ownerDocMatch) {
                    const combinedOwnerObj = {
                      ...owner,
                      documentId: ownerDocMatch.docId,
                      documentName: ownerDocMatch.docName,
                      ownerNodeIndex: ownerIndex // Index of ownerNode
                    };
                    this.combinedOwnerData.push(combinedOwnerObj);
                  }
                });
                // to show documents corresponding field
                this.combinedOwnerData.forEach((item: any) => {
                  let index = item.ownerNodeIndex
                  this.disableOwnerInput[index] = true;
                  this.showOwnerInput[index] = false;
                  this.buttonMessage = 'Click to view!';
                  this.uploadIconOWNER[index] = false;
                  this.showOWNER[index] = true;
                  this.reuploadOwner[index] = false;
                });
    
              }
              //Dealer Nric - If Document already Uploaded.
              if (this.dealerDocObj.length >= 1) {
                console.log("Dealer Doc is already exist");
                let dealerDocNode = datas.document;
                this.dealers.forEach((dealer, dealerIndex) => {
                  const dealerDocMatch = dealerDocNode.find((doc: any) => doc.associateId === dealer.associateId && doc.docName === "DEALER_NRIC");
                  //combined object if assoicatedId match
                  if (dealerDocMatch) {
                    const combinedDealerObj = {
                      ...dealer,
                      documentId: dealerDocMatch.docId,
                      documentName: dealerDocMatch.docName,
                      dealerNodeIndex: dealerIndex // Index of dealerNode
                    };
                    this.combinedDealerData.push(combinedDealerObj);
                  }
                });
                // to show documents corresponding field
                this.combinedDealerData.forEach((item: any) => {
                  let index = item.dealerNodeIndex
                  this.disableDealerInput[index] = true;
                  this.showDealerInput[index] = false;
                  this.buttonMessage = 'Click to view !'
                  this.uploadIconDEALER[index] = false;
                  this.showDEALER[index] = true;
                  this.reuploadDealer[index] = false;
                });
    
              }
    
              //Runner Nric - If Document already Uploaded.
              if (this.runnerDocObj.length >= 1) {
                console.log("Runner Doc is already exist");
                let runnerDocNode = datas.document;
                this.runners.forEach((runner, runnerIndex) => {
                  const runnerDocMatch = runnerDocNode.find((doc: any) => doc.associateId === runner.associateId && doc.docName === "RUNNER_NRIC");
                  //combined object if assoicatedId match
                  if (runnerDocMatch) {
                    const combinedRunnerObj = {
                      ...runner,
                      documentId: runnerDocMatch.docId,
                      documentName: runnerDocMatch.docName,
                      runnerNodeIndex: runnerIndex // Index of runnerNode
                    };
                    this.combinedRunnerData.push(combinedRunnerObj);
                  }
                });
                // to show documents corresponding field
                this.combinedRunnerData.forEach((item: any) => {
                  let index = item.runnerNodeIndex
                  this.disableRunnerInput[index] = true;
                  this.showRunnerInput[index] = false;
                  this.buttonMessage = 'Click to view !'
                  this.uploadIconRUNNER[index] = false;
                  this.showRUNNER[index] = true;
                  this.reuploadRunner[index] = false;
                });
    
              }
  
           }
           else {
            console.log("No Documents uploaded.");
             this.acraDocObj = [];
             //NEW 12 DOCUMENTS
            this.incorporationCertDocObj = [];
            this.articlesAssociationDocObj = [];
            this.bankLicenseDocObj = [];
            this.tradeLicenseDocObj = [];
            this.amlPolicyAndProceduresDocObj = [];
            this.auditReportDocObj = [];
            this.amlAuditReportDocObj = [];
            this.organisationStructureDocObj = [];
            this.managementListDocObj = [];
            this.idCopiesDocObj = [];
            this.kycFormDocObj = [];
            this.wolfsbergFormDocObj = [];
            this.onboardingDocObj = [];

             this.ownerDocObj = [];
             this.dealerDocObj = [];
             this.runnerDocObj = [];
           }
          

  }
  
 }

  // Corporate mobile onload > APPSTATUS === "APPROVED" || "REJECTED"
  initialActiveCustomerLayoutSetup(datas:CorporateCustomerInquiry, entryPoint : string){
    if(entryPoint == "CORPMOBILE-APPROVED" || entryPoint == "CORPMOBILE-REJECTED"){
      // 1. Based on associates : iterate documents layout 
     // 2. Not able to Upload 
     // 3. Click to view : JPEG n PDF 

    //to change default - ACRA;
    this.showAcraInput = true;
    this.uploadIconACRA  = true;
    this.disableAcraInput  = true; //disable ACRA input
    this.loadACRA = false;
    this.showACRA  = false;
    this.showImageAcra  = true;
    this.showOtherFormatAcra  = false;
    this.reuploadAcra  = false;

     // NEW 12 DOCUMENTS
   //to change default - INCORPORATION_CERTIFICATE;
   this.showIncorporationCertInput = true;
   this.uploadIconIncorporationCert  = true;
   this.disableIncorporationCertInput  = true;
   this.loadIncorporationCert = false;
   this.showIncorporationCert  = false;
   this.showImageIncorporationCert  = true;
   this.showOtherFormatIncorporationCert  = false;
   this.reuploadIncorporationCert  = false;

    //to change default - ARTICLES_ASSOCIATION;
    this.showArticlesAssociationInput = true;
    this.uploadIconArticlesAssociation  = true;
    this.disableArticlesAssociationInput  = true;
    this.loadArticlesAssociation = false;
    this.showArticlesAssociation  = false;
    this.showImageArticlesAssociation  = true;
    this.showOtherFormatArticlesAssociation  = false;
    this.reuploadArticlesAssociation  = false;

    //to change default - BANK_LICENSE;
    this.showBankLicenseInput = true;
    this.uploadIconBankLicense  = true;
    this.disableBankLicenseInput  = true;
    this.loadBankLicense = false;
    this.showBankLicense  = false;
    this.showImageBankLicense  = true;
    this.showOtherFormatBankLicense  = false;
    this.reuploadBankLicense  = false;

    //to change default - TRADE_LICENSE;
    this.showTradeLicenseInput = true;
    this.uploadIconTradeLicense  = true;
    this.disableTradeLicenseInput  = true;
    this.loadTradeLicense = false;
    this.showTradeLicense  = false;
    this.showImageTradeLicense  = true;
    this.showOtherFormatTradeLicense  = false;
    this.reuploadTradeLicense  = false;

    //to change default - AML_POLICY_AND_PROCEDURES;
    this.showAmlPolicyAndProceduresInput = true;
    this.uploadIconAmlPolicyAndProcedures  = true;
    this.disableAmlPolicyAndProceduresInput  = true;
    this.loadAmlPolicyAndProcedures = false;
    this.showAmlPolicyAndProcedures  = false;
    this.showImageAmlPolicyAndProcedures  = true;
    this.showOtherFormatAmlPolicyAndProcedures  = false;
    this.reuploadAmlPolicyAndProcedures  = false;

    //to change default - AUDIT_REPORT;
    this.showAuditReportInput = true;
    this.uploadIconAuditReport  = true;
    this.disableAuditReportInput  = true;
    this.loadAuditReport = false;
    this.showAuditReport  = false;
    this.showImageAuditReport  = true;
    this.showOtherFormatAuditReport  = false;
    this.reuploadAuditReport  = false;

    //to change default - LATEST_AML_AUDIT_REPORT;
    this.showAmlAuditReportInput = true;
    this.uploadIconAmlAuditReport  = true;
    this.disableAmlAuditReportInput  = true;
    this.loadAmlAuditReport = false;
    this.showAmlAuditReport  = false;
    this.showImageAmlAuditReport  = true;
    this.showOtherFormatAmlAuditReport  = false;
    this.reuploadAmlAuditReport  = false;

     //to change default - LATEST_ORGANISATION_STRUCTURE;
     this.showOrganisationStructureInput = true;
     this.uploadIconOrganisationStructure  = true;
     this.disableOrganisationStructureInput  = true;
     this.loadOrganisationStructure = false;
     this.showOrganisationStructure  = false;
     this.showImageOrganisationStructure  = true;
     this.showOtherFormatOrganisationStructure  = false;
     this.reuploadOrganisationStructure  = false;

      //to change default - MANAGEMENT_LIST;
      this.showManagementListInput = true;
      this.uploadIconManagementList  = true;
      this.disableManagementListInput  = true;
      this.loadManagementList = false;
      this.showManagementList  = false;
      this.showImageManagementList  = true;
      this.showOtherFormatManagementList  = false;
      this.reuploadManagementList  = false;

       //to change default - ID_COPIES;
       this.showIdCopiesInput = true;
       this.uploadIconIdCopies  = true;
       this.disableIdCopiesInput  = true;
       this.loadIdCopies = false;
       this.showIdCopies  = false;
       this.showImageIdCopies  = true;
       this.showOtherFormatIdCopies  = false;
       this.reuploadIdCopies  = false;

       //to change default - KYC_FORM;
       this.showKycFormInput = true;
       this.uploadIconKycForm  = true;
       this.disableKycFormInput  = true;
       this.loadKycForm = false;
       this.showKycForm  = false;
       this.showImageKycForm  = true;
       this.showOtherFormatKycForm  = false;
       this.reuploadKycForm  = false;

        //to change default - WOLFSBERG_FORM;
        this.showWolfsbergFormInput = true;
        this.uploadIconWolfsbergForm  = true;
        this.disableWolfsbergFormInput  = true;
        this.loadWolfsbergForm = false;
        this.showWolfsbergForm  = false;
        this.showImageWolfsbergForm  = true;
        this.showOtherFormatWolfsbergForm  = false;
        this.reuploadWolfsbergForm  = false;

        //to change default - ONBOARDING_DOCUMENT;
        this.showOnboardingDocInput = true;
        this.uploadIconOnboardingDoc  = true;
        this.disableOnboardingDocInput  = true;
        this.loadOnboardingDoc = false;
        this.showOnboardingDoc  = false;
        this.showImageOnboardingDoc  = true;
        this.showOtherFormatOnboardingDoc  = false;
        this.reuploadOnboardingDoc  = false;
 
   //clear owners array
   this.owners = [];
   this.showImageOwner =[];
   this.showOtherFormatOwner =[];
   this.showOWNER =[];
   this.uploadIconOWNER =[];
   this.showOwnerInput =[];
   this.reuploadOwner =[];
   this.loadOWNER =[];
   this.disableOwnerInput =[];
   this.combinedOwnerData =[];
 
    //clear dealers array
   this.dealers = [];
   this.showImageDealer =[];
   this.showOtherFormatDealer =[];
   this.showDEALER =[];
   this.uploadIconDEALER =[];
   this.showDealerInput =[];
   this.reuploadDealer =[];
   this.loadDEALER =[];
   this.disableDealerInput =[];
   this.combinedDealerData =[];
 
    //clear runners array
   this.runners = [];
   this.showImageRunner =[];
   this.showOtherFormatRunner =[];
   this.showRUNNER =[];
   this.uploadIconRUNNER =[];
   this.showRunnerInput =[];
   this.reuploadRunner =[];
   this.loadRUNNER =[];
   this.disableRunnerInput =[];
   this.combinedRunnerData =[];
 
         //segerate owner,dealer,runner.
         this.owners = datas.associates.owner ? datas.associates.owner : [];
         this.dealers = datas.associates.dealer ? datas.associates.dealer : [];
         this.runners = datas.associates.runner ? datas.associates.runner : [];
 
         //dynamically control,while iterate multiple documents field - owners.
         if(this.owners.length != 0){
         for (let i = 0; i < this.owners.length; i++) {
           this.showImageOwner.push(true);
           this.showOtherFormatOwner.push(false);
           this.showOWNER.push(false);
           this.uploadIconOWNER.push(true);
           this.showOwnerInput.push(true);
           this.reuploadOwner.push(false);
           this.loadOWNER.push(false);
           this.disableOwnerInput.push(true) //User not allowed to upload documents
         }
       }
 
         //dealers
         if(this.dealers.length != 0){
         for (let i = 0; i < this.dealers.length; i++) {
           this.showImageDealer.push(true);
           this.showOtherFormatDealer.push(false);
           this.showDEALER.push(false);
           this.uploadIconDEALER.push(true);
           this.showDealerInput.push(true);
           this.reuploadDealer.push(false);
           this.loadDEALER.push(false);
           this.disableDealerInput.push(true); //User not allowed to upload documents
         }
         }
 
         //runners
         if(this.runners.length != 0){
         for (let i = 0; i < this.runners.length; i++) {
           this.showImageRunner.push(true);
           this.showOtherFormatRunner.push(false);
           this.showRUNNER.push(false);
           this.uploadIconRUNNER.push(true);
           this.showRunnerInput.push(true);
           this.reuploadRunner.push(false);
           this.loadRUNNER.push(false);
           this.disableRunnerInput.push(true); //User not allowed to upload documents
         }
       }
 
         //Filtering documents node object using document name.
         if (datas.document != undefined || datas.document != null) {
           this.acraDocObj = datas.document.filter((v: any) => v.docName == "ACRA");

         // NEW 12 DOCUMENTS
         this.incorporationCertDocObj = datas.document.filter((v: any) => v.docName == "INCORPORATION_CERTIFICATE");
         this.articlesAssociationDocObj = datas.document.filter((v: any) => v.docName == "ARTICLES_ASSOCIATION");
         this.bankLicenseDocObj = datas.document.filter((v: any) => v.docName == "BANK_LICENSE");
         this.tradeLicenseDocObj = datas.document.filter((v: any) => v.docName == "TRADE_LICENSE");
         this.amlPolicyAndProceduresDocObj = datas.document.filter((v: any) => v.docName == "AML_POLICY_AND_PROCEDURES");
         this.auditReportDocObj = datas.document.filter((v: any) => v.docName == "AUDIT_REPORT");
         this.amlAuditReportDocObj = datas.document.filter((v: any) => v.docName == "LATEST_AML_AUDIT_REPORT");
         this.organisationStructureDocObj = datas.document.filter((v: any) => v.docName == "LATEST_ORGANISATION_STRUCTURE");
         this.managementListDocObj = datas.document.filter((v: any) => v.docName == "MANAGEMENT_LIST");
         this.idCopiesDocObj = datas.document.filter((v: any) => v.docName == "ID_COPIES");
         this.kycFormDocObj = datas.document.filter((v: any) => v.docName == "KYC_FORM");
         this.wolfsbergFormDocObj = datas.document.filter((v: any) => v.docName == "WOLFSBERG_FORM");
         this.onboardingDocObj = datas.document.filter((v: any) => v.docName == "ONBOARDING_DOCUMENT");
           
           this.ownerDocObj = datas.document.filter((v: any) => v.docName == "OWNER_NRIC");
           this.dealerDocObj = datas.document.filter((v: any) => v.docName == "DEALER_NRIC");
           this.runnerDocObj = datas.document.filter((v: any) => v.docName == "RUNNER_NRIC");

            //ACRA - if Document already uploaded.
            if (this.acraDocObj[0] != undefined && this.acraDocObj.length != 0) {
              this.disableAcraInput = true;
              this.showAcraInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconACRA = false;
              this.showACRA = true;
              this.reuploadAcra = false;
            } 
             // NEW 12 DOCUMENTS
          //INCORPORATION_CERTIFICATE - if Document already uploaded.
          if (this.incorporationCertDocObj[0] != undefined && this.incorporationCertDocObj.length != 0) {
            this.disableIncorporationCertInput = true;
            this.showIncorporationCertInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconIncorporationCert = false;
            this.showIncorporationCert = true;
            this.reuploadIncorporationCert = false;
          }
          //ARTICLES_ASSOCIATION - if Document already uploaded.
          if (this.articlesAssociationDocObj[0] != undefined && this.articlesAssociationDocObj.length != 0) {
            this.disableArticlesAssociationInput = true;
            this.showArticlesAssociationInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconArticlesAssociation = false;
            this.showArticlesAssociation = true;
            this.reuploadArticlesAssociation = false;
          }
           //BANK_LICENSE - if Document already uploaded.
           if (this.bankLicenseDocObj[0] != undefined && this.bankLicenseDocObj.length != 0) {
            this.disableBankLicenseInput = true;
            this.showBankLicenseInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconBankLicense = false;
            this.showBankLicense = true;
            this.reuploadBankLicense = false;
          }
          //TRADE_LICENSE - if Document already uploaded.
          if (this.tradeLicenseDocObj[0] != undefined && this.tradeLicenseDocObj.length != 0) {
            this.disableTradeLicenseInput = true;
            this.showTradeLicenseInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconTradeLicense = false;
            this.showTradeLicense = true;
            this.reuploadTradeLicense = false;
          }
           //AML_POLICY_AND_PROCEDURES - if Document already uploaded.
           if (this.amlPolicyAndProceduresDocObj[0] != undefined && this.amlPolicyAndProceduresDocObj.length != 0) {
            this.disableAmlPolicyAndProceduresInput = true;
            this.showAmlPolicyAndProceduresInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconAmlPolicyAndProcedures = false;
            this.showAmlPolicyAndProcedures = true;
            this.reuploadAmlPolicyAndProcedures = false;
          }
           //AUDIT_REPORT - if Document already uploaded.
           if (this.auditReportDocObj[0] != undefined && this.auditReportDocObj.length != 0) {
            this.disableAuditReportInput = true;
            this.showAuditReportInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconAuditReport = false;
            this.showAuditReport = true;
            this.reuploadAuditReport = false;
          }
           //LATEST_AML_AUDIT_REPORT - if Document already uploaded.
           if (this.amlAuditReportDocObj[0] != undefined && this.amlAuditReportDocObj.length != 0) {
            this.disableAmlAuditReportInput = true;
            this.showAmlAuditReportInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconAmlAuditReport = false;
            this.showAmlAuditReport = true;
            this.reuploadAmlAuditReport = false;
          }
            //LATEST_ORGANISATION_STRUCTURE - if Document already uploaded.
            if (this.organisationStructureDocObj[0] != undefined && this.organisationStructureDocObj.length != 0) {
              this.disableOrganisationStructureInput = true;
              this.showOrganisationStructureInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconOrganisationStructure = false;
              this.showOrganisationStructure = true;
              this.reuploadOrganisationStructure = false;
            }
              //MANAGEMENT_LIST - if Document already uploaded.
            if (this.managementListDocObj[0] != undefined && this.managementListDocObj.length != 0) {
              this.disableManagementListInput = true;
              this.showManagementListInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconManagementList = false;
              this.showManagementList = true;
              this.reuploadManagementList = false;
            }
              //ID_COPIES - if Document already uploaded.
              if (this.idCopiesDocObj[0] != undefined && this.idCopiesDocObj.length != 0) {
                this.disableIdCopiesInput = true;
                this.showIdCopiesInput = false;
                this.buttonMessage = 'Click to view !';
                this.uploadIconIdCopies = false;
                this.showIdCopies = true;
                this.reuploadIdCopies = false;
              }
               //KYC_FORM - if Document already uploaded.
               if (this.kycFormDocObj[0] != undefined && this.kycFormDocObj.length != 0) {
                this.disableKycFormInput = true;
                this.showKycFormInput = false;
                this.buttonMessage = 'Click to view !';
                this.uploadIconKycForm = false;
                this.showKycForm = true;
                this.reuploadKycForm = false;
              }
               //WOLFSBERG_FORM - if Document already uploaded.
               if (this.wolfsbergFormDocObj[0] != undefined && this.wolfsbergFormDocObj.length != 0) {
                this.disableWolfsbergFormInput = true;
                this.showWolfsbergFormInput = false;
                this.buttonMessage = 'Click to view !';
                this.uploadIconWolfsbergForm = false;
                this.showWolfsbergForm = true;
                this.reuploadWolfsbergForm = false;
              }

              // ONBOARDING_DOCUMENT - if Document already uploaded.
               if (this.onboardingDocObj[0] != undefined && this.onboardingDocObj.length != 0) {
                this.disableOnboardingDocInput = true;
                this.showOnboardingDocInput = false;
                this.buttonMessage = 'Click to view !';
                this.uploadIconOnboardingDoc = false;
                this.showOnboardingDoc = true;
                this.reuploadOnboardingDoc = false;
              }
  
            //Owner Nric - If Document already Uploaded.
            if (this.ownerDocObj.length >= 1) {
              console.log("Owner Doc is already exist");
              let ownerDocNode = datas.document;
              this.owners.forEach((owner, ownerIndex) => {
                const ownerDocMatch = ownerDocNode.find((doc: any) => doc.associateId === owner.associateId && doc.docName === "OWNER_NRIC");
                //combined object if assoicatedId match
                if (ownerDocMatch) {
                  const combinedOwnerObj = {
                    ...owner,
                    documentId: ownerDocMatch.docId,
                    documentName: ownerDocMatch.docName,
                    ownerNodeIndex: ownerIndex // Index of ownerNode
                  };
                  this.combinedOwnerData.push(combinedOwnerObj);
                }
              });
              // to show documents corresponding field
              if(this.combinedOwnerData.length != 0){
                this.combinedOwnerData.forEach((item: any) => {
                  let index = item.ownerNodeIndex
                  this.disableOwnerInput[index] = true;
                  this.showOwnerInput[index] = false;
                  this.buttonMessage = 'Click to view!';
                  this.uploadIconOWNER[index] = false;
                  this.showOWNER[index] = true;
                  this.reuploadOwner[index] = false;
                });
              }
            }
           
           
            //Dealer Nric - If Document already Uploaded.
            if (this.dealerDocObj.length >= 1) {
              console.log("Dealer Doc is already exist");
              let dealerDocNode = datas.document;
              this.dealers.forEach((dealer, dealerIndex) => {
                const dealerDocMatch = dealerDocNode.find((doc: any) => doc.associateId === dealer.associateId && doc.docName === "DEALER_NRIC");
                //combined object if assoicatedId match
                if (dealerDocMatch) {
                  const combinedDealerObj = {
                    ...dealer,
                    documentId: dealerDocMatch.docId,
                    documentName: dealerDocMatch.docName,
                    dealerNodeIndex: dealerIndex // Index of dealerNode
                  };
                  this.combinedDealerData.push(combinedDealerObj);
                }
              });
              // to show documents corresponding field
              this.combinedDealerData.forEach((item: any) => {
                let index = item.dealerNodeIndex
                this.disableDealerInput[index] = true;
                this.showDealerInput[index] = false;
                this.buttonMessage = 'Click to view !'
                this.uploadIconDEALER[index] = false;
                this.showDEALER[index] = true;
                this.reuploadDealer[index] = false;
              });
  
            }
           
  
            //Runner Nric - If Document already Uploaded.
            if (this.runnerDocObj.length >= 1) {
              console.log("Runner Doc is already exist");
              let runnerDocNode = datas.document;
              this.runners.forEach((runner, runnerIndex) => {
                const runnerDocMatch = runnerDocNode.find((doc: any) => doc.associateId === runner.associateId && doc.docName === "RUNNER_NRIC");
                //combined object if assoicatedId match
                if (runnerDocMatch) {
                  const combinedRunnerObj = {
                    ...runner,
                    documentId: runnerDocMatch.docId,
                    documentName: runnerDocMatch.docName,
                    runnerNodeIndex: runnerIndex // Index of runnerNode
                  };
                  this.combinedRunnerData.push(combinedRunnerObj);
                }
              });
              // to show documents corresponding field
              this.combinedRunnerData.forEach((item: any) => {
                let index = item.runnerNodeIndex
                this.disableRunnerInput[index] = true;
                this.showRunnerInput[index] = false;
                this.buttonMessage = 'Click to view !'
                this.uploadIconRUNNER[index] = false;
                this.showRUNNER[index] = true;
                this.reuploadRunner[index] = false;
              });
  
            }
          

         }
         else {
          console.log("No Documents uploaded.");
           this.acraDocObj = [];

            //NEW 12 DOCUMENTS
            this.incorporationCertDocObj = [];
            this.articlesAssociationDocObj = [];
            this.bankLicenseDocObj = [];
            this.tradeLicenseDocObj = [];
            this.amlPolicyAndProceduresDocObj = [];
            this.auditReportDocObj = [];
            this.amlAuditReportDocObj = [];
            this.organisationStructureDocObj = [];
            this.managementListDocObj = [];
            this.idCopiesDocObj = [];
            this.kycFormDocObj = [];
            this.wolfsbergFormDocObj = [];
            this.onboardingDocObj = [];

           this.ownerDocObj = [];
           this.dealerDocObj = [];
           this.runnerDocObj = [];
         }
    }
    else if (entryPoint == "BACKOFFICE-CUSTOMERSEARCH"){
   // 1. Based on associates : iterate documents layout 
     // 2. Not able to Upload 
     // 3. Click to view : JPEG n PDF 

    //to change default - ACRA;
    this.showAcraInput = true;
    this.uploadIconACRA  = true;
    this.disableAcraInput  = true; //disable ACRA input
    this.loadACRA = false;
    this.showACRA  = false;
    this.showImageAcra  = true;
    this.showOtherFormatAcra  = false;
    this.reuploadAcra  = false;

     // NEW 12 DOCUMENTS
   //to change default - INCORPORATION_CERTIFICATE;
   this.showIncorporationCertInput = true;
   this.uploadIconIncorporationCert  = true;
   this.disableIncorporationCertInput  = true;
   this.loadIncorporationCert = false;
   this.showIncorporationCert  = false;
   this.showImageIncorporationCert  = true;
   this.showOtherFormatIncorporationCert  = false;
   this.reuploadIncorporationCert  = false;

    //to change default - ARTICLES_ASSOCIATION;
    this.showArticlesAssociationInput = true;
    this.uploadIconArticlesAssociation  = true;
    this.disableArticlesAssociationInput  = true;
    this.loadArticlesAssociation = false;
    this.showArticlesAssociation  = false;
    this.showImageArticlesAssociation  = true;
    this.showOtherFormatArticlesAssociation  = false;
    this.reuploadArticlesAssociation  = false;

    //to change default - BANK_LICENSE;
    this.showBankLicenseInput = true;
    this.uploadIconBankLicense  = true;
    this.disableBankLicenseInput  = true;
    this.loadBankLicense = false;
    this.showBankLicense  = false;
    this.showImageBankLicense  = true;
    this.showOtherFormatBankLicense  = false;
    this.reuploadBankLicense  = false;

    //to change default - TRADE_LICENSE;
    this.showTradeLicenseInput = true;
    this.uploadIconTradeLicense  = true;
    this.disableTradeLicenseInput  = true;
    this.loadTradeLicense = false;
    this.showTradeLicense  = false;
    this.showImageTradeLicense  = true;
    this.showOtherFormatTradeLicense  = false;
    this.reuploadTradeLicense  = false;

    //to change default - AML_POLICY_AND_PROCEDURES;
    this.showAmlPolicyAndProceduresInput = true;
    this.uploadIconAmlPolicyAndProcedures  = true;
    this.disableAmlPolicyAndProceduresInput  = true;
    this.loadAmlPolicyAndProcedures = false;
    this.showAmlPolicyAndProcedures  = false;
    this.showImageAmlPolicyAndProcedures  = true;
    this.showOtherFormatAmlPolicyAndProcedures  = false;
    this.reuploadAmlPolicyAndProcedures  = false;

    //to change default - AUDIT_REPORT;
    this.showAuditReportInput = true;
    this.uploadIconAuditReport  = true;
    this.disableAuditReportInput  = true;
    this.loadAuditReport = false;
    this.showAuditReport  = false;
    this.showImageAuditReport  = true;
    this.showOtherFormatAuditReport  = false;
    this.reuploadAuditReport  = false;

    //to change default - LATEST_AML_AUDIT_REPORT;
    this.showAmlAuditReportInput = true;
    this.uploadIconAmlAuditReport  = true;
    this.disableAmlAuditReportInput  = true;
    this.loadAmlAuditReport = false;
    this.showAmlAuditReport  = false;
    this.showImageAmlAuditReport  = true;
    this.showOtherFormatAmlAuditReport  = false;
    this.reuploadAmlAuditReport  = false;

     //to change default - LATEST_ORGANISATION_STRUCTURE;
     this.showOrganisationStructureInput = true;
     this.uploadIconOrganisationStructure  = true;
     this.disableOrganisationStructureInput  = true;
     this.loadOrganisationStructure = false;
     this.showOrganisationStructure  = false;
     this.showImageOrganisationStructure  = true;
     this.showOtherFormatOrganisationStructure  = false;
     this.reuploadOrganisationStructure  = false;

      //to change default - MANAGEMENT_LIST;
      this.showManagementListInput = true;
      this.uploadIconManagementList  = true;
      this.disableManagementListInput  = true;
      this.loadManagementList = false;
      this.showManagementList  = false;
      this.showImageManagementList  = true;
      this.showOtherFormatManagementList  = false;
      this.reuploadManagementList  = false;

       //to change default - ID_COPIES;
       this.showIdCopiesInput = true;
       this.uploadIconIdCopies  = true;
       this.disableIdCopiesInput  = true;
       this.loadIdCopies = false;
       this.showIdCopies  = false;
       this.showImageIdCopies  = true;
       this.showOtherFormatIdCopies  = false;
       this.reuploadIdCopies  = false;

       //to change default - KYC_FORM;
       this.showKycFormInput = true;
       this.uploadIconKycForm  = true;
       this.disableKycFormInput  = true;
       this.loadKycForm = false;
       this.showKycForm  = false;
       this.showImageKycForm  = true;
       this.showOtherFormatKycForm  = false;
       this.reuploadKycForm  = false;

        //to change default - WOLFSBERG_FORM;
        this.showWolfsbergFormInput = true;
        this.uploadIconWolfsbergForm  = true;
        this.disableWolfsbergFormInput  = true;
        this.loadWolfsbergForm = false;
        this.showWolfsbergForm  = false;
        this.showImageWolfsbergForm  = true;
        this.showOtherFormatWolfsbergForm  = false;
        this.reuploadWolfsbergForm  = false;

         //to change default - ONBOARDING_DOCUMENT;
         this.showOnboardingDocInput = true;
         this.uploadIconOnboardingDoc  = true;
         this.disableOnboardingDocInput  = true;
         this.loadOnboardingDoc = false;
         this.showOnboardingDoc  = false;
         this.showImageOnboardingDoc  = true;
         this.showOtherFormatOnboardingDoc  = false;
         this.reuploadOnboardingDoc  = false;
 
   //clear owners array
   this.owners = [];
   this.showImageOwner =[];
   this.showOtherFormatOwner =[];
   this.showOWNER =[];
   this.uploadIconOWNER =[];
   this.showOwnerInput =[];
   this.reuploadOwner =[];
   this.loadOWNER =[];
   this.disableOwnerInput =[];
   this.combinedOwnerData =[];
 
    //clear dealers array
   this.dealers = [];
   this.showImageDealer =[];
   this.showOtherFormatDealer =[];
   this.showDEALER =[];
   this.uploadIconDEALER =[];
   this.showDealerInput =[];
   this.reuploadDealer =[];
   this.loadDEALER =[];
   this.disableDealerInput =[];
   this.combinedDealerData =[];
 
    //clear runners array
   this.runners = [];
   this.showImageRunner =[];
   this.showOtherFormatRunner =[];
   this.showRUNNER =[];
   this.uploadIconRUNNER =[];
   this.showRunnerInput =[];
   this.reuploadRunner =[];
   this.loadRUNNER =[];
   this.disableRunnerInput =[];
   this.combinedRunnerData =[];
 
         //segerate owner,dealer,runner.
         this.owners = datas.associates.owner ? datas.associates.owner : [];
         this.dealers = datas.associates.dealer ? datas.associates.dealer : [];
         this.runners = datas.associates.runner ? datas.associates.runner : [];
 
         //dynamically control,while iterate multiple documents field - owners.
         if(this.owners.length != 0){
         for (let i = 0; i < this.owners.length; i++) {
           this.showImageOwner.push(true);
           this.showOtherFormatOwner.push(false);
           this.showOWNER.push(false);
           this.uploadIconOWNER.push(true);
           this.showOwnerInput.push(true);
           this.reuploadOwner.push(false);
           this.loadOWNER.push(false);
           this.disableOwnerInput.push(true) //User not allowed to upload documents
         }
       }
 
         //dealers
         if(this.dealers.length != 0){
         for (let i = 0; i < this.dealers.length; i++) {
           this.showImageDealer.push(true);
           this.showOtherFormatDealer.push(false);
           this.showDEALER.push(false);
           this.uploadIconDEALER.push(true);
           this.showDealerInput.push(true);
           this.reuploadDealer.push(false);
           this.loadDEALER.push(false);
           this.disableDealerInput.push(true); //User not allowed to upload documents
         }
         }
 
         //runners
         if(this.runners.length != 0){
         for (let i = 0; i < this.runners.length; i++) {
           this.showImageRunner.push(true);
           this.showOtherFormatRunner.push(false);
           this.showRUNNER.push(false);
           this.uploadIconRUNNER.push(true);
           this.showRunnerInput.push(true);
           this.reuploadRunner.push(false);
           this.loadRUNNER.push(false);
           this.disableRunnerInput.push(true); //User not allowed to upload documents
         }
       }
 
         //Filtering documents node object using document name.
         if (datas.document != undefined || datas.document != null) {
           this.acraDocObj = datas.document.filter((v: any) => v.docName == "ACRA");

         // NEW 12 DOCUMENTS
         this.incorporationCertDocObj = datas.document.filter((v: any) => v.docName == "INCORPORATION_CERTIFICATE");
         this.articlesAssociationDocObj = datas.document.filter((v: any) => v.docName == "ARTICLES_ASSOCIATION");
         this.bankLicenseDocObj = datas.document.filter((v: any) => v.docName == "BANK_LICENSE");
         this.tradeLicenseDocObj = datas.document.filter((v: any) => v.docName == "TRADE_LICENSE");
         this.amlPolicyAndProceduresDocObj = datas.document.filter((v: any) => v.docName == "AML_POLICY_AND_PROCEDURES");
         this.auditReportDocObj = datas.document.filter((v: any) => v.docName == "AUDIT_REPORT");
         this.amlAuditReportDocObj = datas.document.filter((v: any) => v.docName == "LATEST_AML_AUDIT_REPORT");
         this.organisationStructureDocObj = datas.document.filter((v: any) => v.docName == "LATEST_ORGANISATION_STRUCTURE");
         this.managementListDocObj = datas.document.filter((v: any) => v.docName == "MANAGEMENT_LIST");
         this.idCopiesDocObj = datas.document.filter((v: any) => v.docName == "ID_COPIES");
         this.kycFormDocObj = datas.document.filter((v: any) => v.docName == "KYC_FORM");
         this.wolfsbergFormDocObj = datas.document.filter((v: any) => v.docName == "WOLFSBERG_FORM");
         this.onboardingDocObj = datas.document.filter((v: any) => v.docName == "ONBOARDING_DOCUMENT");

           this.ownerDocObj = datas.document.filter((v: any) => v.docName == "OWNER_NRIC");
           this.dealerDocObj = datas.document.filter((v: any) => v.docName == "DEALER_NRIC");
           this.runnerDocObj = datas.document.filter((v: any) => v.docName == "RUNNER_NRIC");

            //ACRA - if Document already uploaded.
            if (this.acraDocObj[0] != undefined && this.acraDocObj.length != 0) {
              this.disableAcraInput = true;
              this.showAcraInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconACRA = false;
              this.showACRA = true;
              this.reuploadAcra = false;
            } else{
              this.disableAcraInput = true;
              this.showAcraInput = false;
              this.noDocumentMessage = 'No Document Found !';
              this.noAcraDocument = true;
              this.isDisableEditAcra = false;
              this.uploadIconACRA = false;
              this.showACRA = true;
              this.reuploadAcra = false;
            }
            // NEW 12 DOCUMENTS
             //INCORPORATION_CERTIFICATE - if Document already uploaded.
             if (this.incorporationCertDocObj[0] != undefined && this.incorporationCertDocObj.length != 0) {
              this.disableIncorporationCertInput = true;
              this.showIncorporationCertInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconIncorporationCert = false;
              this.showIncorporationCert = true;
              this.reuploadIncorporationCert = false;
            } else{
              this.disableIncorporationCertInput = true;
              this.showIncorporationCertInput = false;
              this.noDocumentMessage = 'No Document Found !';
              this.noIncorporationCertDocument = true;
              this.isDisableEditIncorporationCert = false;
              this.uploadIconIncorporationCert = false;
              this.showIncorporationCert = true;
              this.reuploadIncorporationCert = false;
            }

             //ARTICLES_ASSOCIATION - if Document already uploaded.
             if (this.articlesAssociationDocObj[0] != undefined && this.articlesAssociationDocObj.length != 0) {
              this.disableArticlesAssociationInput = true;
              this.showArticlesAssociationInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconArticlesAssociation = false;
              this.showArticlesAssociation = true;
              this.reuploadArticlesAssociation = false;
            } else{
              this.disableArticlesAssociationInput = true;
              this.showArticlesAssociationInput = false;
              this.noDocumentMessage = 'No Document Found !';
              this.noArticlesAssociationDocument = true;
              this.isDisableEditArticlesAssociation = false;
              this.uploadIconArticlesAssociation = false;
              this.showArticlesAssociation = true;
              this.reuploadArticlesAssociation = false;
            }

             //BANK_LICENSE - if Document already uploaded.
             if (this.bankLicenseDocObj[0] != undefined && this.bankLicenseDocObj.length != 0) {
              this.disableBankLicenseInput = true;
              this.showBankLicenseInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconBankLicense = false;
              this.showBankLicense = true;
              this.reuploadBankLicense = false;
            } else{
              this.disableBankLicenseInput = true;
              this.showBankLicenseInput = false;
              this.noDocumentMessage = 'No Document Found !';
              this.noBankLicenseDocument = true;
              this.isDisableEditBankLicense = false;
              this.uploadIconBankLicense = false;
              this.showBankLicense = true;
              this.reuploadBankLicense = false;
            }

             //TRADE_LICENSE - if Document already uploaded.
             if (this.tradeLicenseDocObj[0] != undefined && this.tradeLicenseDocObj.length != 0) {
              this.disableTradeLicenseInput = true;
              this.showTradeLicenseInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconTradeLicense = false;
              this.showTradeLicense = true;
              this.reuploadTradeLicense = false;
            } else{
              this.disableTradeLicenseInput = true;
              this.showTradeLicenseInput = false;
              this.noDocumentMessage = 'No Document Found !';
              this.noTradeLicenseDocument = true;
              this.isDisableEditTradeLicense = false;
              this.uploadIconTradeLicense = false;
              this.showTradeLicense = true;
              this.reuploadTradeLicense = false;
            }

             //AML_POLICY_AND_PROCEDURES - if Document already uploaded.
             if (this.amlPolicyAndProceduresDocObj[0] != undefined && this.amlPolicyAndProceduresDocObj.length != 0) {
              this.disableAmlPolicyAndProceduresInput = true;
              this.showAmlPolicyAndProceduresInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconAmlPolicyAndProcedures = false;
              this.showAmlPolicyAndProcedures = true;
              this.reuploadAmlPolicyAndProcedures = false;
            } else{
              this.disableAmlPolicyAndProceduresInput = true;
              this.showAmlPolicyAndProceduresInput = false;
              this.noDocumentMessage = 'No Document Found !';
              this.noAmlPolicyAndProceduresDocument = true;
              this.isDisableEditAmlPolicyAndProcedures = false;
              this.uploadIconAmlPolicyAndProcedures = false;
              this.showAmlPolicyAndProcedures = true;
              this.reuploadAmlPolicyAndProcedures = false;
            }

             //AUDIT_REPORT - if Document already uploaded.
             if (this.auditReportDocObj[0] != undefined && this.auditReportDocObj.length != 0) {
              this.disableAuditReportInput = true;
              this.showAuditReportInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconAuditReport = false;
              this.showAuditReport = true;
              this.reuploadAuditReport = false;
            } else{
              this.disableAuditReportInput = true;
              this.showAuditReportInput = false;
              this.noDocumentMessage = 'No Document Found !';
              this.noAuditReportDocument = true;
              this.isDisableEditAuditReport = false;
              this.uploadIconAuditReport = false;
              this.showAuditReport = true;
              this.reuploadAuditReport = false;
            }

             //LATEST_AML_AUDIT_REPORT - if Document already uploaded.
             if (this.amlAuditReportDocObj[0] != undefined && this.amlAuditReportDocObj.length != 0) {
              this.disableAmlAuditReportInput = true;
              this.showAmlAuditReportInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconAmlAuditReport = false;
              this.showAmlAuditReport = true;
              this.reuploadAmlAuditReport = false;
            } else{
              this.disableAmlAuditReportInput = true;
              this.showAmlAuditReportInput = false;
              this.noDocumentMessage = 'No Document Found !';
              this.noAmlAuditReportDocument = true;
              this.isDisableEditAmlAuditReport = false;
              this.uploadIconAmlAuditReport = false;
              this.showAmlAuditReport = true;
              this.reuploadAmlAuditReport = false;
            }

             //LATEST_ORGANISATION_STRUCTURE - if Document already uploaded.
             if (this.organisationStructureDocObj[0] != undefined && this.organisationStructureDocObj.length != 0) {
              this.disableOrganisationStructureInput = true;
              this.showOrganisationStructureInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconOrganisationStructure = false;
              this.showOrganisationStructure = true;
              this.reuploadOrganisationStructure = false;
            } else{
              this.disableOrganisationStructureInput = true;
              this.showOrganisationStructureInput = false;
              this.noDocumentMessage = 'No Document Found !';
              this.noOrganisationStructureDocument = true;
              this.isDisableEditOrganisationStructure = false;
              this.uploadIconOrganisationStructure = false;
              this.showOrganisationStructure = true;
              this.reuploadOrganisationStructure = false;
            }

             //MANAGEMENT_LIST - if Document already uploaded.
             if (this.managementListDocObj[0] != undefined && this.managementListDocObj.length != 0) {
              this.disableManagementListInput = true;
              this.showManagementListInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconManagementList = false;
              this.showManagementList = true;
              this.reuploadManagementList = false;
            } else{
              this.disableManagementListInput = true;
              this.showManagementListInput = false;
              this.noDocumentMessage = 'No Document Found !';
              this.noManagementListDocument = true;
              this.isDisableEditManagementList = false;
              this.uploadIconManagementList = false;
              this.showManagementList = true;
              this.reuploadManagementList = false;
            }

            //ID_COPIES - if Document already uploaded.
            if (this.idCopiesDocObj[0] != undefined && this.idCopiesDocObj.length != 0) {
              this.disableIdCopiesInput = true;
              this.showIdCopiesInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconIdCopies = false;
              this.showIdCopies = true;
              this.reuploadIdCopies = false;
            } else{
              this.disableIdCopiesInput = true;
              this.showIdCopiesInput = false;
              this.noDocumentMessage = 'No Document Found !';
              this.noIdCopiesDocument = true;
              this.isDisableEditIdCopies = false;
              this.uploadIconIdCopies = false;
              this.showIdCopies = true;
              this.reuploadIdCopies = false;
            }
            
             //KYC_FORM - if Document already uploaded.
             if (this.kycFormDocObj[0] != undefined && this.kycFormDocObj.length != 0) {
              this.disableKycFormInput = true;
              this.showKycFormInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconKycForm = false;
              this.showKycForm = true;
              this.reuploadKycForm = false;
            } else{
              this.disableKycFormInput = true;
              this.showKycFormInput = false;
              this.noDocumentMessage = 'No Document Found !';
              this.noKycFormDocument = true;
              this.isDisableEditKycForm = false;
              this.uploadIconKycForm = false;
              this.showKycForm = true;
              this.reuploadKycForm = false;
            }

             //WOLFSBERG_FORM - if Document already uploaded.
             if (this.wolfsbergFormDocObj[0] != undefined && this.wolfsbergFormDocObj.length != 0) {
              this.disableWolfsbergFormInput = true;
              this.showWolfsbergFormInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconWolfsbergForm = false;
              this.showWolfsbergForm = true;
              this.reuploadWolfsbergForm = false;
            } else{
              this.disableWolfsbergFormInput = true;
              this.showWolfsbergFormInput = false;
              this.noDocumentMessage = 'No Document Found !';
              this.noWolfsbergFormDocument = true;
              this.isDisableEditWolfsbergForm = false;
              this.uploadIconWolfsbergForm = false;
              this.showWolfsbergForm = true;
              this.reuploadWolfsbergForm = false;
            }

             //ONBOARDING_DOCUMENT - if Document already uploaded.
             if (this.onboardingDocObj[0] != undefined && this.onboardingDocObj.length != 0) {
              this.disableOnboardingDocInput = true;
              this.showOnboardingDocInput = false;
              this.buttonMessage = 'Click to view !';
              this.uploadIconOnboardingDoc = false;
              this.showOnboardingDoc = true;
              this.reuploadOnboardingDoc = false;
            } else{
              this.disableOnboardingDocInput = true;
              this.showOnboardingDocInput = false;
              this.noDocumentMessage = 'No Document Found !';
              this.noOnboardingDocument = true;
              this.isDisableEditOnboardingDoc = false;
              this.uploadIconOnboardingDoc = false;
              this.showOnboardingDoc = true;
              this.reuploadOnboardingDoc = false;
            }

            //Owner Nric - If Document already Uploaded.
            if (this.ownerDocObj.length >= 1) {
              console.log("Owner Doc is already exist");
              let ownerDocNode = datas.document;
              this.owners.forEach((owner, ownerIndex) => {
                const ownerDocMatch = ownerDocNode.find((doc: any) => doc.associateId === owner.associateId && doc.docName === "OWNER_NRIC");
                //combined object if assoicatedId match
                if (ownerDocMatch) {
                  const combinedOwnerObj = {
                    ...owner,
                    documentId: ownerDocMatch.docId,
                    documentName: ownerDocMatch.docName,
                    ownerNodeIndex: ownerIndex // Index of ownerNode
                  };
                  this.combinedOwnerData.push(combinedOwnerObj);
                }
                else{
                  if(this.owners.length >= 1){  //No documents found message if document is there for owner but no associate id available.
                   
                      this.disableOwnerInput[ownerIndex] = true;
                      this.showOwnerInput[ownerIndex] = false;
                      this.noOwnerDocument[ownerIndex] = true ;
                      this.isDisableEditOwnerNric[ownerIndex] = false ;
                      this.noDocumentMessage = 'No Document Found !';
                      this.uploadIconOWNER[ownerIndex] = false;
                      this.showOWNER[ownerIndex] = true;
                      this.reuploadOwner[ownerIndex] = false;
                   
                  }
                }
              });
              // to show documents corresponding field
              if(this.combinedOwnerData.length != 0){
                this.combinedOwnerData.forEach((item: any) => {
                  let index = item.ownerNodeIndex
                  this.disableOwnerInput[index] = true;
                  this.showOwnerInput[index] = false;
                  this.buttonMessage = 'Click to view!';
                  this.uploadIconOWNER[index] = false;
                  this.showOWNER[index] = true;
                  this.reuploadOwner[index] = false;
                });
              }
            }
            else{
                if(this.owners.length >= 1){
                  this.owners.forEach((item:any,index:number)=>{
                    this.disableOwnerInput[index] = true;
                    this.showOwnerInput[index] = false;
                    this.noOwnerDocument[index] = true ;
                    this.isDisableEditOwnerNric[index] = false ;
                    this.noDocumentMessage = 'No Document Found !';
                    this.uploadIconOWNER[index] = false;
                    this.showOWNER[index] = true;
                    this.reuploadOwner[index] = false;
                  })
                }
               
            
            }
           
            //Dealer Nric - If Document already Uploaded.
            if (this.dealerDocObj.length >= 1) {
              console.log("Dealer Doc is already exist");
              let dealerDocNode = datas.document;
              this.dealers.forEach((dealer, dealerIndex) => {
                const dealerDocMatch = dealerDocNode.find((doc: any) => doc.associateId === dealer.associateId && doc.docName === "DEALER_NRIC");
                //combined object if assoicatedId match
                if (dealerDocMatch) {
                  const combinedDealerObj = {
                    ...dealer,
                    documentId: dealerDocMatch.docId,
                    documentName: dealerDocMatch.docName,
                    dealerNodeIndex: dealerIndex // Index of dealerNode
                  };
                  this.combinedDealerData.push(combinedDealerObj);
                }
                else{
                  if(this.dealers.length >= 1){ //No documents found message if document is there for dealer but no associate id available.
                   
                       this.disableDealerInput[dealerIndex] = true;
                       this.showDealerInput[dealerIndex] = false;
                       this.noDealerDocument[dealerIndex] = true ;
                       this.isDisableEditDealerNric[dealerIndex] = false ;
                       this.noDocumentMessage = 'No Document Found !';
                       this.uploadIconDEALER[dealerIndex] = false;
                       this.showDEALER[dealerIndex] = true;
                       this.reuploadDealer[dealerIndex] = false;
                   
                     } 
                }
              });
              // to show documents corresponding field
              this.combinedDealerData.forEach((item: any) => {
                let index = item.dealerNodeIndex
                this.disableDealerInput[index] = true;
                this.showDealerInput[index] = false;
                this.buttonMessage = 'Click to view !'
                this.uploadIconDEALER[index] = false;
                this.showDEALER[index] = true;
                this.reuploadDealer[index] = false;
              });
  
            }
            else{
              if(this.dealers.length >= 1){
             this.dealers.forEach((item:any,index:number)=>{
                this.disableDealerInput[index] = true;
                this.showDealerInput[index] = false;
                this.noDealerDocument[index] = true ;
                this.isDisableEditDealerNric[index] = false ;
                this.noDocumentMessage = 'No Document Found !';
                this.uploadIconDEALER[index] = false;
                this.showDEALER[index] = true;
                this.reuploadDealer[index] = false;
             })
              }
            }
  
            //Runner Nric - If Document already Uploaded.
            if (this.runnerDocObj.length >= 1) {
              console.log("Runner Doc is already exist");
              let runnerDocNode = datas.document;
              this.runners.forEach((runner, runnerIndex) => {
                const runnerDocMatch = runnerDocNode.find((doc: any) => doc.associateId === runner.associateId && doc.docName === "RUNNER_NRIC");
                //combined object if assoicatedId match
                if (runnerDocMatch) {
                  const combinedRunnerObj = {
                    ...runner,
                    documentId: runnerDocMatch.docId,
                    documentName: runnerDocMatch.docName,
                    runnerNodeIndex: runnerIndex // Index of runnerNode
                  };
                  this.combinedRunnerData.push(combinedRunnerObj);
                }
                else{ //No documents found message if document is there for runner but no associate id available.
                  if(this.runners.length >= 1){
                      this.disableRunnerInput[runnerIndex] = true;
                      this.showRunnerInput[runnerIndex] = false;
                      this.noRunnerDocument[runnerIndex] = true ;
                      this.isDisableEditRunnerNric[runnerIndex] = false ;
                      this.noDocumentMessage = 'No Document Found !';
                      this.uploadIconRUNNER[runnerIndex] = false;
                      this.showRUNNER[runnerIndex] = true;
                      this.reuploadRunner[runnerIndex] = false;
                     }
                }
              });
              // to show documents corresponding field
              this.combinedRunnerData.forEach((item: any) => {
                let index = item.runnerNodeIndex
                this.disableRunnerInput[index] = true;
                this.showRunnerInput[index] = false;
                this.buttonMessage = 'Click to view !'
                this.uploadIconRUNNER[index] = false;
                this.showRUNNER[index] = true;
                this.reuploadRunner[index] = false;
              });
  
            }
            else{
              if(this.runners.length >= 1){
                this.runners.forEach((item:any,index:number)=>{
                  this.disableRunnerInput[index] = true;
                  this.showRunnerInput[index] = false;
                  this.noRunnerDocument[index] = true ;
                  this.isDisableEditRunnerNric[index] = false ;
                  this.noDocumentMessage = 'No Document Found !';
                  this.uploadIconRUNNER[index] = false;
                  this.showRUNNER[index] = true;
                  this.reuploadRunner[index] = false;
                })
                 }
            }

         }
         else {
          console.log("No Documents uploaded.");
           this.acraDocObj = [];

            //NEW 12 DOCUMENTS
            this.incorporationCertDocObj = [];
            this.articlesAssociationDocObj = [];
            this.bankLicenseDocObj = [];
            this.tradeLicenseDocObj = [];
            this.amlPolicyAndProceduresDocObj = [];
            this.auditReportDocObj = [];
            this.amlAuditReportDocObj = [];
            this.organisationStructureDocObj = [];
            this.managementListDocObj = [];
            this.idCopiesDocObj = [];
            this.kycFormDocObj = [];
            this.wolfsbergFormDocObj = [];
            this.onboardingDocObj = [];

           this.ownerDocObj = [];
           this.dealerDocObj = [];
           this.runnerDocObj = [];
         }

    }
  }

  loadEmptyDocuments(){
    console.log("No Document Found")
  }
}