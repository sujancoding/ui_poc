import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

@Component({
  selector: 'app-preview-document',
  templateUrl: './preview-document.component.html',
  styleUrls: ['./preview-document.component.scss']
})
export class PreviewDocumentComponent implements OnInit {
  pdfUrl : any ;
  test !: string;
  customerSearchPreview : Boolean = false;
  applicationSearchPreview : Boolean = false;
  agentDocumentPreview : boolean = false;
  documentName !: string;
  constructor(private sanitizer:DomSanitizer,private store : InMemoryCache,private headerService : TitleHeaderService,
    private route : ActivatedRoute,private router : Router, @Inject(MAT_DIALOG_DATA) public data: any ) { }
 
  ngOnInit(): void {
    
    this.route.queryParams.subscribe((params: any)=> {
   // let applicationId = params.applicationId;
    let customerId = params.customerId;
    this.documentName = params.documentName;
   // this.store.setItem('APPLICATION_ID',applicationId);
    this.store.setItem('ID',customerId);
    });
  //  this.headerService.setTitle('View Document');
    if(this.store.getItem('DOC_DATA_PREVIEW') != undefined){
      this.applicationSearchPreview = true
      let documentData = this.store.getItem('DOC_DATA_PREVIEW');
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(documentData);
      this.store.removeItem('DOC_DATA_PREVIEW');
    }
    if(this.store.getItem('CUSTOMER_DOCDATA_PREVIEW') != undefined){
      this.customerSearchPreview = true;
      let documentData = this.store.getItem('CUSTOMER_DOCDATA_PREVIEW');
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(documentData);
      this.store.removeItem('CUSTOMER_DOCDATA_PREVIEW');
    }
      // dheepan changes 25-08-2023 agent pdf Preview by backoffice 
      if(this.store.getItem('AGENT_DOC_DATA')){
        this.agentDocumentPreview = true;
        let documentData = this.store.getItem('AGENT_DOC_DATA');
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(documentData);
        this.store.removeItem('AGENT_DOC_DATA');
      }

    // dheepan changes 25-08-2023 agent pdf Preview by backoffice
      if(this.data.agent_document_Name != undefined){
        this.agentDocumentPreview = true
        this.documentName = this.data.agent_document_Name;
        let docData = this.data.agent_doc_data;
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(docData);
      }

    if(this.data.document_Name != undefined){
      this.applicationSearchPreview = true
     // this.headerService.setTitle('Account Opening');
      this.documentName = this.data.document_Name;
      let docData = this.data.doc_data;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(docData);
    }
    if(this.data.customersearch_documentName != undefined){
      this.customerSearchPreview = true;
     // this.headerService.setTitle('Customers');
      this.documentName = this.data.customersearch_documentName;
      let docData = this.data.customersearch_documentData; 
      let blob = this.data?.fileBlob ;
      if(blob){
        const blobUrl = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      }
      else{
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(docData);
      }
      
    }
  }
  navigatetoDocument(entity:string){
    if(entity == "APPLICATION_SEARCH"){
    this.router.navigate([`/profile/Application-Listings`],{queryParams:{"indicator":"FROM_PREVIEW"}});
    }
    if(entity == "CUSTOMER_SEARCH"){
      this.router.navigate([`/customer/table`],{queryParams:{"indicator":"FROM_CUSTOMER_PREVIEW"}}); 
    }
  }

}
