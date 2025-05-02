import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { ErrorDialogAdminComponent } from '../errordialogadmin/error-dialog-admin.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PreviewDocumentComponent } from 'src/app/backoffice/preview-document/preview-document/preview-document.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDialogComponent } from 'src/app/onboarding/modals/errordialog.component';
import { AddTransactionScreeningDocument, fetchScreeningDocumentKeyByValue } from 'src/app/core/model/Add Document/add-document';
import _ from 'lodash';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-view-deposit-slip',
  templateUrl: './view-deposit-slip.component.html',
  styleUrls: ['./view-deposit-slip.component.scss']
})
export class ViewDepositSlipComponent implements OnInit {

  depositedSlip : any;
  depositedId !: string;
  documentName !: string;
  documentBinaryData !: string;
  loader: boolean = true;
  showNoDocumentsMessage = false;
  showValidSlip = true ;
  transactionId : string = "";

  public form: FormGroup = Object.create(null);
  
  buttonMessage = 'Click to view !';
  noDocumentMessage = "No document uploaded !"
  documentIds: any = [];
  submitted : boolean = false;
  imageId:any=[];

// deposited slip
 showDepositedImage: boolean = false;
 showOtherFormatDeposited : boolean = false;
 showDepositedSlipButton : boolean = false;
 pdfDeposited : any;
 depositedSlipId : string = ""; 
 uploadDepositSlipIcon : boolean = true ;
 uploadDepositSlip : boolean = true;
 reuploadDepositSlip : boolean = false;
 disableDepositSlipUpload : boolean = false;

  // Doc - 1
  showDocOneImage : boolean = false;
  uploadDocOne : boolean = true ;
  showOtherFormatDocOne:boolean = false;
  showDocOneButton : boolean = false;
  showDocOneInput : boolean = false;
  uploadDocumentOne : boolean = true;
  pdfDocOne: any;
  docOneId : string = ""; 
  reuploadDocOne : boolean = false;

  //Doc - 2
  showDocTwoImage : boolean = false;
  uploadDocTwo : boolean = true ;
  showOtherFormatDocTwo:boolean = false;
  showDocTwoButton : boolean = false;
  showDocTwoInput : boolean = false;
  uploadDocumentTwo : boolean = true;
  pdfDocTwo: any; 
  docTwoId : string = ""; 
  reuploadDocTwo : boolean = false;

  // Doc -  3
  showDocThreeImage : boolean = false;
  uploadDocThree : boolean = true ;
  showOtherFormatDocThree:boolean = false;
  showDocThreeButton : boolean = false;
  showDocThreeInput : boolean = false;
  uploadDocumentThree : boolean = true;
  pdfDocThree: any;
  docThreeId : string = ""; 
  reuploadDocThree : boolean = false;

  url: any = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer, private store: InMemoryCache, private transactionService: TransactionService,
    private dialog: MatDialog,public fb: FormBuilder,private _snackBar: MatSnackBar,private alertService: AlertService,) {

  }
  ngOnInit(): void {

    if(this.data.transactionId){
      this.transactionId = this.data.transactionId ;
      if(this.data.dealId !== null){ // Its DEAL FLOW.
        this.disableDepositSlipUpload = true;
      }
      this.data.documents.forEach((doc: { DOCUMENTTYPEID: string , DOCUMENTID : string }) => {// getting Txn id and Doc id
        if (doc.DOCUMENTTYPEID === '2001') {
          this.showDepositedSlipButton = true; 
          this.depositedSlipId = doc.DOCUMENTID ; 
          this.uploadDepositSlipIcon = false;
          this.uploadDepositSlip = false;
        }
         else if (doc.DOCUMENTTYPEID === '2002') {
          this.showDocOneButton = true; 
          this.uploadDocOne = false;
          this.uploadDocumentOne = false; 
          this.docOneId = doc.DOCUMENTID ;  
        }
        else if (doc.DOCUMENTTYPEID === '2003') {
          this.showDocTwoButton = true;
          this.uploadDocTwo = false; 
          this.uploadDocumentTwo = false; 
          this.docTwoId = doc.DOCUMENTID ;  
        }
        else if (doc.DOCUMENTTYPEID === '2004') {
          this.showDocThreeButton= true; 
          this.uploadDocThree = false; 
          this.uploadDocumentThree = false; 
          this.docThreeId = doc.DOCUMENTID ;  
        }

      });
      this.loader = false;
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
              
                this.dialog.open(PreviewDocumentComponent, {
                  width: '1300px',
                  height: '650px',
                  panelClass: 'custom-modalbox',
                  data: { customersearch_documentName: documentName, customersearch_documentData: event.target.result }
                })
          
              if (documentName == "TXN_SCREENING_DOC_1") {
                this.reuploadDocOne = true;
                this.uploadDocOne = false;
                this.uploadDocumentOne = false;
                this.showDocOneImage = false;
                this.showOtherFormatDocOne = true;
                this.pdfDocOne = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.result);
                console.log(this.pdfDocOne)
                this.showDocOneButton = false;
              }
              else if (documentName == "TXN_SCREENING_DOC_2") {
                this.reuploadDocTwo = true;
                this.uploadDocTwo = false;
                this.uploadDocumentTwo = false;
                this.showDocTwoImage = false;
                this.showOtherFormatDocTwo = true;
                this.pdfDocTwo = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.result);
                this.showDocTwoButton = false;
              }
              else if (documentName == "TXN_SCREENING_DOC_3") { 
                this.reuploadDocThree = true;
                this.uploadDocThree = false;
                this.uploadDocumentThree = false;
                this.showDocThreeImage = false;
                this.showOtherFormatDocThree = true;
                this.pdfDocThree = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.result);
                this.showDocThreeButton = false;
              }
              else if (documentName == "DEPOSITED_SLIP") { 
                this.reuploadDepositSlip = true;
                this.uploadDepositSlipIcon = false;
                this.uploadDepositSlip = false;
                this.showDepositedImage = false;
                this.showOtherFormatDeposited = true;
                this.pdfDeposited = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.result);
                this.showDepositedSlipButton = false;
              }
            }
            // Jpeg and Png checking..
            if (e.target.files[0].type == "image/jpeg" || e.target.files[0].type == "image/png") {
              if (id == "2001") {
                this.showDepositedImage = true;
                this.uploadDepositSlipIcon = false;
                this.showDepositedSlipButton = false;
                this.showOtherFormatDeposited = false;
                this.uploadDepositSlip = true;
                this.reuploadDepositSlip = false;
                let newDocument: AddTransactionScreeningDocument = _.cloneDeep(this.addDocuments(id));
                console.log(_.cloneDeep(newDocument));
                console.log(this.url[id])
              }
              if (id == "2002") {
                this.showDocOneImage = true;
                this.uploadDocOne = false;
                this.showDocOneButton = false;
                this.showOtherFormatDocOne = false;
                this.uploadDocumentOne = true;
                this.reuploadDocOne = false;
                // this.disableBEInput = false; //enabling input
                // this.disableBENric = false;  //enabling input
                let newDocument: AddTransactionScreeningDocument = _.cloneDeep(this.addDocuments(id));
                console.log(_.cloneDeep(newDocument));
                console.log(this.url[id])
              }
              if (id == "2003") {
                this.showDocTwoImage = true;
                this.uploadDocTwo = false;
                this.showDocTwoButton = false;
                this.showOtherFormatDocTwo = false;
                this.uploadDocumentTwo = true;
                this.reuploadDocTwo = false;
                // this.disableBEInput = false; //enabling input
                // this.disableBENric = false;  //enabling input

                let newDocument: AddTransactionScreeningDocument = _.cloneDeep(this.addDocuments(id));
                console.log(_.cloneDeep(newDocument));
                console.log(this.url[id])
              }
              if (id == "2004") {
                this.showDocThreeImage = true;
                this.uploadDocThree = false;
                this.showDocThreeButton = false;
                this.showOtherFormatDocThree = false;
                this.uploadDocumentThree = true;
                this.reuploadDocThree = false;
                // this.disableBEInput = false; //enabling input
                // this.disableBENric = false;  //enabling input

                let newDocument: AddTransactionScreeningDocument = _.cloneDeep(this.addDocuments(id));
                console.log(_.cloneDeep(newDocument));
                console.log(this.url[id])

              }
            }
            this.transactionService.addTransactionDocuments(this.addDocuments(id)).subscribe((data: any) =>{
              if(data){
                if(data.docTypeId == "2001"){
                  this.depositedSlipId = data.docId;
                }
                else if(data.docTypeId == "2002"){
                  this.docOneId = data.docId;
                }
                else if(data.docTypeId == "2003"){
                  this.docTwoId = data.docId;
                }
                else if(data.docTypeId == "2004"){
                  this.docThreeId = data.docId;
                }
              this._snackBar.open("Document has been uploaded successfully!", "Ok",{
                duration: 3000,
                panelClass: "green-notification-snackbar"
              });
            }
            },
            (error:any) => {
              console.log(error.message);
              this.alertService.clear()
              this.alertService.error(" Failed. Try Again");
              if(error.status != 401){ //error handling completed on 01-07-2023
                this.dialog.open(ErrorDialogComponent) ;
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

      }
      else {
        this._snackBar.open('File size exceeds 10mb, Kindly reupload file below 10mb !', "Ok", {
          duration: 3000,
          panelClass: "red-notification-snackbar"
        });
      }
    }
  }
  loadDocumentData(documentName: any, documentTypeId: string, documentId: string) {
    this.loader = true;
    this.transactionService.getDepositedTransaction(this.transactionId, documentName, documentId).subscribe((datas: any) => {
      this.loader = false;
      this.documentBinaryData = datas.data[0].DOCUMENTDATA;
      const allowedFormats = ['data:application/pdf', 'data:image/png', 'data:image/jpeg'];

      // Check if binarydata starts with an allowed format
     const isValidFormat = allowedFormats.some(format => this.documentBinaryData.startsWith(format));

     if (isValidFormat) {
      if (documentName == 'DEPOSITED_SLIP') {
       this.reuploadDepositSlip = false;
       this.uploadDepositSlip = false;
       this.url[documentTypeId] = datas.data[0].DOCUMENTDATA;
       let text = this.url[documentTypeId];
        if (text.substring(5, 20) == 'application/pdf') {
          this.dialog.open(PreviewDocumentComponent, {
            width: '1300px',
            height: '650px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: text }
          })
          this.showDepositedSlipButton = false;
          this.showOtherFormatDeposited = true;
          this.reuploadDepositSlip = true;
          this.pdfDeposited = this.sanitizer.bypassSecurityTrustResourceUrl(text);
        }
        else {
          this.showDepositedImage = true;
          this.showDepositedSlipButton = false;
          // this.disableDocOneInput = true;
          // this.disableDocumnetOneInput = true;
          // this.url[id] = data.documentData; 
          this.uploadDepositSlip = true;
          let newDocument: AddTransactionScreeningDocument = _.cloneDeep(this.addDocuments(documentTypeId));
          console.log(_.cloneDeep(newDocument));
          console.log(this.url[documentTypeId])
        }
  
      }
      if (documentName == 'TXN_SCREENING_DOC_1') {
        this.reuploadDocOne = false;
        this.uploadDocumentOne = false;
        this.url[documentTypeId] = datas.data[0].DOCUMENTDATA;
        let text = this.url[documentTypeId];
        //checks it is pdf
        //viewDocOne
        if (text.substring(5, 20) == 'application/pdf') {
          this.dialog.open(PreviewDocumentComponent, {
            width: '1300px',
            height: '650px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: text }
          })
          this.showDocOneButton = false;
          this.showDocOneImage = false;
          this.showOtherFormatDocOne = true;
          this.reuploadDocOne = true;
          this.pdfDocOne = this.sanitizer.bypassSecurityTrustResourceUrl(text);
        }
        else {
          this.showDocOneImage = true;
          this.showDocOneButton = false;
          this.showOtherFormatDocOne = false;
          this.uploadDocumentOne = true; 
          let newDocument: AddTransactionScreeningDocument = _.cloneDeep(this.addDocuments(documentTypeId));
          console.log(_.cloneDeep(newDocument));
          console.log(this.url[documentTypeId])
        }
  
      }
      if (documentName == 'TXN_SCREENING_DOC_2') {
        this.reuploadDocTwo = false;
        this.uploadDocumentTwo = false;
        this.url[documentTypeId] = datas.data[0].DOCUMENTDATA;
        let text = this.url[documentTypeId];
        //checks it is pdf
        //viewDocOne
        if (text.substring(5, 20) == 'application/pdf') {
          this.dialog.open(PreviewDocumentComponent, {
            width: '1300px',
            height: '650px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: text }
          })
          this.showDocTwoButton = false;
          this.showDocTwoImage = false;
          this.showOtherFormatDocTwo = true;
          this.reuploadDocTwo = true;
          this.pdfDocTwo = this.sanitizer.bypassSecurityTrustResourceUrl(text);
        }
  
        else {
          this.showDocTwoImage = true;
          this.showDocTwoButton = false;
          this.showOtherFormatDocTwo = false;
          this.uploadDocumentTwo = true;
          let newDocument: AddTransactionScreeningDocument = _.cloneDeep(this.addDocuments(documentTypeId));
          console.log(_.cloneDeep(newDocument));
          console.log(this.url[documentTypeId]);
        }
  
      }
      if (documentName == 'TXN_SCREENING_DOC_3') {
        this.reuploadDocThree = false;
        this.uploadDocumentThree = false;
        this.url[documentTypeId] = datas.data[0].DOCUMENTDATA;
        let text = this.url[documentTypeId];
        //checks it is pdf
        //viewDocOne
        if (text.substring(5, 20) == 'application/pdf') {
          this.dialog.open(PreviewDocumentComponent, {
            width: '1300px',
            height: '650px',
            panelClass: 'custom-modalbox',
            data: { customersearch_documentName: documentName, customersearch_documentData: text }
          })
          this.showDocThreeButton = false;
          this.showOtherFormatDocThree = true;
          this.showDocThreeImage = false;
          this.reuploadDocThree = true;
          this.pdfDocThree = this.sanitizer.bypassSecurityTrustResourceUrl(text);
        }
        else {
          this.showDocThreeImage = true;
          this.showDocThreeButton = false;
          this.showOtherFormatDocThree = false;
          this.uploadDocumentThree = true;
          let newDocument: AddTransactionScreeningDocument = _.cloneDeep(this.addDocuments(documentTypeId));
          console.log(_.cloneDeep(newDocument));
          console.log(this.url[documentTypeId])
        }
      }
      console.log('Sending binary data successfully');
    } else {
      this.showValidSlip = false;
      this.showNoDocumentsMessage = true ;
      this.loader = false;
      console.log('Invalid binary data format. Cannot send.');
    }
    },
      (error:any) => { //error handling completed on 03-07-2023
         if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent) ;
        }
        this.loader = false;
      });
 
  }
  addDocuments(id: string): AddTransactionScreeningDocument {
    return new AddTransactionScreeningDocument({
      "docTypeId": id,
      "documentName": fetchScreeningDocumentKeyByValue(id),
      "documentData": this.url[id],
      "transactionId" : this.transactionId 
    });
  }

}
