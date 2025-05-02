import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { PreviewDocumentComponent } from 'src/app/backoffice/preview-document/preview-document/preview-document.component';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { AGENT_DOCUMENT_ID_MAPPER, AddAgentDocument } from '../../models/agent.model';
import { AgentMaintenanceService } from 'src/app/core/services/agentmaintenance.service';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';

@Component({
  selector: 'app-agent-documents',
  templateUrl: './agent-documents.component.html',
  styleUrls: ['./agent-documents.component.scss']
})
export class AgentDocumentsComponent implements OnInit {

  //variable declaration.

  public form: FormGroup = Object.create(null);
  @Output() agentDocumentsStatusChanged = new EventEmitter<any>();
  documentId !: string;
  buttonMessage: string = '';
  formStatus !: string;
  associateId !: string;
  ownerDocObj !: any;
  acraDocObj !: any;
  runnerDocObj !: any;
  dealerDocObj !: any;
  documentInquiry !: any;
  isScreenLoader: boolean = false;

  //PDf
  pdfUrlAcra: any;
  pdfUrlOwner: any[] = []; 
  pdfUrlDealer: any[] = []; 
  pdfUrlRunner: any[] = []; 

  //ACRA
  showAcraInput: Boolean = true;
  uploadIconACRA: Boolean = true;
  disableAcraInput: Boolean = false;
  loadACRA = false;
  showACRA: Boolean = false;
  showImageAcra: Boolean = true;
  showOtherFormatAcra: Boolean = false;
  reuploadAcra: boolean = false;


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


  constructor(private _snackBar: MatSnackBar, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialog, private store: InMemoryCache, private domSanitizer: DomSanitizer, private agentMainteanceServices: AgentMaintenanceService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      acra: [null],
      ownerNric: [null],
      dealerNric: [null],
      runnerNric: [null],
    });
  }
  // This function will be triggered from the parent component when the "Agent Documents" step is selected.
  onloadDocuments(): void {
    let agentId = this.store.getItem('AGENT_ID')
    this.isScreenLoader = true;
    setTimeout(() => {
      this.agentMainteanceServices.getAgentInquiry(agentId).subscribe((datas: any) => {
        this.isScreenLoader = false;

  //to change default - ACRA;
   this.showAcraInput = true;
   this.uploadIconACRA  = true;
   this.disableAcraInput  = false;
   this.loadACRA = false;
   this.showACRA  = false;
   this.showImageAcra  = true;
   this.showOtherFormatAcra  = false;
   this.reuploadAcra  = false;

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
        this.owners = datas.associate.owner ? datas.associate.owner : [];
        this.dealers = datas.associate.dealer ? datas.associate.dealer : [];
        this.runners = datas.associate.runner ? datas.associate.runner : [];

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
        if (datas.documents != undefined || datas.documents != null) {
          this.acraDocObj = datas.documents.filter((v: any) => v.documentName == "ACRA");
          this.ownerDocObj = datas.documents.filter((v: any) => v.documentName == "OWNER_NRIC");
          this.dealerDocObj = datas.documents.filter((v: any) => v.documentName == "DEALER_NRIC");
          this.runnerDocObj = datas.documents.filter((v: any) => v.documentName == "RUNNER_NRIC");
        }
        else {
          this.acraDocObj = [];
          this.ownerDocObj = [];
          this.dealerDocObj = [];
          this.runnerDocObj = [];
        }

        if (datas.documents != null) {
          console.log("Documents is already exist");

          //ACRA - if Document already uploaded.
          if (this.acraDocObj[0] != undefined && this.acraDocObj.length != 0) {
            this.disableAcraInput = true;
            this.showAcraInput = false;
            this.buttonMessage = 'Click to view !';
            this.uploadIconACRA = false;
            this.showACRA = true;
            this.reuploadAcra = false;
          }

          //Owner Nric - If Document already Uploaded.
          if (this.ownerDocObj.length >= 1) {
            console.log("Owner Doc is already exist");
            let ownerDocNode = datas.documents;
            this.owners.forEach((owner, ownerIndex) => {
              const ownerDocMatch = ownerDocNode.find((doc: any) => doc.associateId === owner.associateId);
              //combined object if assoicatedId match
              if (ownerDocMatch) {
                const combinedOwnerObj = {
                  ...owner,
                  documentId: ownerDocMatch.documentId,
                  documentName: ownerDocMatch.documentName,
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
            let dealerDocNode = datas.documents;
            this.dealers.forEach((dealer, dealerIndex) => {
              const dealerDocMatch = dealerDocNode.find((doc: any) => doc.associateId === dealer.associateId);
              //combined object if assoicatedId match
              if (dealerDocMatch) {
                const combinedDealerObj = {
                  ...dealer,
                  documentId: dealerDocMatch.documentId,
                  documentName: dealerDocMatch.documentName,
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
            let runnerDocNode = datas.documents;
            this.runners.forEach((runner, runnerIndex) => {
              const runnerDocMatch = runnerDocNode.find((doc: any) => doc.associateId === runner.associateId);
              //combined object if assoicatedId match
              if (runnerDocMatch) {
                const combinedRunnerObj = {
                  ...runner,
                  documentId: runnerDocMatch.documentId,
                  documentName: runnerDocMatch.documentName,
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
      },
        //error handling
        (error: any) => {
          this.isScreenLoader = false;
          if (error.status != 401) {
            this.dialogRef.open(ErrorDialogAdminComponent);
          }
        })
    }, 1000);
  }
//for checking img file.
  acra = AGENT_DOCUMENT_ID_MAPPER.ACRA;
  ownerNric = AGENT_DOCUMENT_ID_MAPPER.OWNER_NRIC;
  dealerNric = AGENT_DOCUMENT_ID_MAPPER.DEALER_NRIC;
  runnerNric = AGENT_DOCUMENT_ID_MAPPER.RUNNER_NRIC;
  fileOwnerData : string[] = [];
  fileDealerData : string[] = [];
  fileRunnerData : string[] = [];
  fileAcraData : string[] = [];

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

            // block will execute when pdf is uploaded
            if (e.target.files[0].type == "application/pdf") {
              this.store.setItem('AGENT_DOC_DATA',binaryData );
              this.store.setItem('AGENT_DOC_DATA', documentName); 
              this.dialogRef.open(PreviewDocumentComponent, {  // navigate to anthoer component if file is pdf.
                width: '1380px',
                height: '720px',
                panelClass: 'custom-modalbox',
                data: { agent_document_Name: documentName, agent_doc_data: binaryData }
              });
              // block will execute (PDF)- ACRA
              if (documentName == "ACRA") {
                this.onloadDocuments();  //we refresh to old state
                this.showImageAcra = false; //img tag
                this.showOtherFormatAcra = true;  //object tag
                this.pdfUrlAcra = this.domSanitizer.bypassSecurityTrustResourceUrl(binaryData);
                this.loadACRA = false;
                this.showACRA = false;
                this.uploadIconACRA = false;
                this.showAcraInput = false; //we need to false the showAcraInput , so we can restrict the re-upload when cliked on blurry img of PDF, therefore it will open a PDF review mmodal dialog.
                this.reuploadAcra = true;
                this.associateId = "";  //assoicate id empty string for ACRA
              }
              //block will execute (PDF) - OWNER NRIC
              if (documentName == "OWNER_NRIC") {
                this.onloadDocuments(); 
                this.showImageOwner[index] = false; //img tag
                this.showOtherFormatOwner[index] = true;  //object tag
                this.pdfUrlOwner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(binaryData);
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
                this.onloadDocuments();
                this.showImageDealer[index] = false; //img tag
                this.showOtherFormatDealer[index] = true;  //object tag
                this.pdfUrlDealer[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(binaryData);
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
                this.onloadDocuments();
                this.showImageRunner[index] = false; //img tag
                this.showOtherFormatRunner[index] = true;  //object tag
                this.pdfUrlRunner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(binaryData);
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
              //Jpeg and Png checking..
         if(e.target.files[0].type == "image/jpeg" || e.target.files[0].type == "image/png"){
               //block will execute (img/png)- ACRA
              if (id == "1005") {
                this.fileAcraData[index] = binaryData; 
                this.showOtherFormatAcra = false;  //object tag
                this.showImageAcra = true; //img tag
                this.uploadIconACRA = false;
                this.showAcraInput = true;
                this.disableAcraInput = false;
                this.reuploadAcra = false;
                this.associateId = ""; //assoicate id empty string for ACRA
              }
              //block will execute (img/png)- Owner Nric
              if (id == "1006") {
                this.fileOwnerData[index] = binaryData;
                this.uploadIconOWNER[index] = false;
                this.showOwnerInput[index] = true;
                this.disableOwnerInput[index] = false;
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
                this.disableDealerInput[index] = false;
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
                this.disableRunnerInput[index] = false;
                this.showOtherFormatRunner[index] = false;
                this.showImageRunner[index] = true;
                this.reuploadRunner[index] = false;
                const selectedRunner = this.runners[index]; // Retrieve the associateId based on the index
                this.associateId = selectedRunner.associateId;
                console.log(this.associateId);
              }
            }
            let newAgentDocument: AddAgentDocument = this.addDocuments(documentName, binaryData);
            //service call 
            this.agentMainteanceServices.addAgentDocument(newAgentDocument).subscribe((datas: any) => {
              console.log("You submitted Document Sucessfully");

            },
              (error: any) => {
                if (error.status != 401) {
                  this.dialogRef.open(ErrorDialogAdminComponent);
                }
              })
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
  addDocuments(documentName: string, documentData: string): AddAgentDocument {
    let agentId = this.store.getItem("AGENT_ID");
    return new AddAgentDocument({
      "agentId": agentId,
      "associateId": this.associateId,
      "documentName": documentName,
      "documentId": "",
      "documentData": documentData
    })
  }
  // This function will be called automatically whenever the stepper changes in the parent component
  updateStatus(event: any) {
    // Listen for changes whenever the formcontrol value changes on the entire form
    if (this.form.touched == true && this.formStatus == "Form Submitted Sucessfully") {
      this.form.valueChanges.subscribe(() => {
        this.agentDocumentsStatusChanged.emit(this.form.valid ? 'Completed' : 'In Progress');  // Emit an stepper status to the parent-stepper component
      });
    }
    else {
      this.agentDocumentsStatusChanged.emit('In Progress');
    }
  }

  onSave() {
    console.log("All Documents are submitted succesfully");

    this.formStatus = "Form Submitted Sucessfully"
    this.agentDocumentsStatusChanged.emit('Completed');
  }

  loadBinaryData(documentName: any, index: number) {
    console.log(index);
    if (documentName == 'ACRA') {
      this.loadACRA = true;
      this.reuploadAcra = false;
      this.documentId = this.acraDocObj[0].documentId;
      this.agentMainteanceServices.getAgentDocumentInquiry(this.documentId).subscribe((datas: any) => {
        this.documentInquiry = datas['data'];
        this.associateId = this.documentInquiry[0].associateId;
        let text = this.documentInquiry[0].documentData;
        if (text.substring(5, 20) == 'application/pdf') {
          this.dialogRef.open(PreviewDocumentComponent, {
            width: '1380px',
            height: '720px',
            panelClass: 'custom-modalbox',
            data: { agent_document_Name: documentName, agent_doc_data: this.documentInquiry[0].documentData }
          })
          this.showImageAcra = false; //img tag
          this.showOtherFormatAcra = true;  //object tag
          this.pdfUrlAcra = this.domSanitizer.bypassSecurityTrustResourceUrl(this.documentInquiry[0].documentData);
          this.loadACRA = false;
          this.showACRA = false;
          this.disableAcraInput = true;
          this.uploadIconACRA = false;
          this.reuploadAcra = true;

        }
        else {
          console.log(index);
          this.loadACRA = false;
          this.showACRA = false;
          this.fileAcraData[index] = this.documentInquiry[0].documentData;
          this.uploadIconACRA = false;
          this.showAcraInput = true;
          this.disableAcraInput = false;

        }
      },
        //error handling
        (error: any) => {
          if (error.status != 401) {
            this.dialogRef.open(ErrorDialogAdminComponent);
          }
        });
    }
    else if (documentName == 'OWNER_NRIC') {
      this.loadOWNER[index] = true;
      this.reuploadOwner[index] = false;
      let getDocId = this.combinedOwnerData.filter(v => v.ownerNodeIndex == index);
      this.documentId = getDocId[0].documentId;
      console.log(this.documentId);
      this.agentMainteanceServices.getAgentDocumentInquiry(this.documentId).subscribe((datas: any) => {
        this.documentInquiry = datas['data'];
        this.associateId = this.documentInquiry[0].associateId;
        let text = this.documentInquiry[0].documentData;
        if (text.substring(5, 20) == 'application/pdf') {
          this.dialogRef.open(PreviewDocumentComponent, {
            width: '1380px',
            height: '720px',
            panelClass: 'custom-modalbox',
            data: { agent_document_Name: documentName, agent_doc_data: this.documentInquiry[0].documentData }
          })
          this.showImageOwner[index] = false; //img tag
          this.showOtherFormatOwner[index] = true;  //object tag
          this.pdfUrlOwner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(this.documentInquiry[0].documentData);
          this.loadOWNER[index] = false;
          this.showOWNER[index] = false;
          this.disableOwnerInput[index] = true;
          this.uploadIconOWNER[index] = false;
          this.reuploadOwner[index] = true;
        }
        else {
          this.loadOWNER[index] = false;
          this.showOWNER[index] = false;
          this.fileOwnerData[index] = this.documentInquiry[0].documentData;
          this.uploadIconOWNER[index] = false;
          this.showOwnerInput[index] = true;
          this.disableOwnerInput[index] = false;
        }
      },
        //error handling 
        (error: any) => {
          if (error.status != 401) {
            this.dialogRef.open(ErrorDialogAdminComponent);
          }
        });
    }
    else if (documentName == 'DEALER_NRIC') {
      this.loadDEALER[index] = true;
      this.reuploadDealer[index] = false;
      let getDocId = this.combinedDealerData.filter(v => v.dealerNodeIndex == index);
      this.documentId = getDocId[0].documentId;
      console.log(this.documentId);
      this.agentMainteanceServices.getAgentDocumentInquiry(this.documentId).subscribe((datas: any) => {
        this.documentInquiry = datas['data'];
        this.associateId = this.documentInquiry[0].associateId
        let text = this.documentInquiry[0].documentData;
        if (text.substring(5, 20) == 'application/pdf') {
          this.dialogRef.open(PreviewDocumentComponent, {
            width: '1380px',
            height: '720px',
            panelClass: 'custom-modalbox',
            data: { agent_document_Name: documentName, agent_doc_data: this.documentInquiry[0].documentData }
          })
          this.showImageDealer[index] = false; //img tag
          this.showOtherFormatDealer[index] = true;  //object tag
          this.pdfUrlDealer[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(this.documentInquiry[0].documentData);
          this.loadDEALER[index] = false;
          this.showDEALER[index] = false;
          this.disableDealerInput[index] = true;
          this.uploadIconDEALER[index] = false;
          this.reuploadDealer[index] = true;
        }
        else {
          this.loadDEALER[index] = false;
          this.showDEALER[index] = false;
          this.fileDealerData[index] = this.documentInquiry[0].documentData;
          this.uploadIconDEALER[index] = false;
          this.showDealerInput[index] = true;
          this.disableDealerInput[index] = false;
        }

      },
        //error handling 
        (error: any) => {
          if (error.status != 401) {
            this.dialogRef.open(ErrorDialogAdminComponent);
          }
        });
    }
    else if (documentName == 'RUNNER_NRIC') {
      this.loadRUNNER[index] = true;
      this.reuploadRunner[index] = false;
      let getDocId = this.combinedRunnerData.filter(v => v.runnerNodeIndex == index);
      this.documentId = getDocId[0].documentId;
      console.log(this.documentId);
      this.agentMainteanceServices.getAgentDocumentInquiry(this.documentId).subscribe((datas: any) => {
        this.documentInquiry = datas['data'];
        this.associateId = this.documentInquiry[0].associateId
        let text = this.documentInquiry[0].documentData;;
        if (text.substring(5, 20) == 'application/pdf') {
          this.dialogRef.open(PreviewDocumentComponent, {
            width: '1380px',
            height: '720px',
            panelClass: 'custom-modalbox',
            data: { agent_document_Name: documentName, agent_doc_data: this.documentInquiry[0].documentData }
          })
          this.showImageRunner[index] = false; //img tag
          this.showOtherFormatRunner[index] = true;  //object tag
          this.pdfUrlRunner[index] = this.domSanitizer.bypassSecurityTrustResourceUrl(this.documentInquiry[0].documentData);
          this.loadRUNNER[index] = false;
          this.showRUNNER[index] = false;
          this.disableRunnerInput[index] = true;
          this.uploadIconRUNNER[index] = false;
          this.reuploadRunner[index] = true;
        }
        else {
          this.loadRUNNER[index] = false;
          this.showRUNNER[index] = false;
          this.fileRunnerData[index] = this.documentInquiry[0].documentData;
          this.uploadIconRUNNER[index] = false;
          this.showRunnerInput[index] = true;
          this.disableRunnerInput[index] = false;
        }
      },
        //error handling 
        (error: any) => {
          if (error.status != 401) {
            this.dialogRef.open(ErrorDialogAdminComponent);
          }
        });
    }


  }
}