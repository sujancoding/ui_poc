import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss']
})
export class PdfPreviewComponent implements OnInit {
  pdfUrl : any ;
  test !: string;
  constructor(private sanitizer:DomSanitizer,private store : InMemoryCache,private headerService : TitleHeaderService,
    private route : ActivatedRoute,private router : Router) { }
 
  ngOnInit(): void {
    
    this.headerService.setTitle('View Document');
    if(this.store.getItem('DOCUMENT_INQ_DATA') != undefined){
      let documentData = this.store.getItem('DOCUMENT_INQ_DATA');
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(documentData);
      this.store.removeItem('DOCUMENT_INQ_DATA');
    }
    // this.route.queryParams.subscribe((params: any)=> {
    //   console.log(params)
    // this.test = params.state;
    // })
    if(this.store.getItem('DOC_DATA')){
      let data = this.store.getItem('DOC_DATA');
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data);
    this.store.removeItem('DOC_DATA');
    }
     //corporate pdf Preview
     if(this.store.getItem('CORP_DOC_DATA')){
      let corpData = this.store.getItem('CORP_DOC_DATA');
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(corpData);
      this.store.removeItem('CORP_DOC_DATA');
    }
  }
  navigateDocument(){
    if(this.store.getItem('DOCUMENT_NAME')){
    let documentName = this.store.getItem('DOCUMENT_NAME');
    if(this.store.getItem('APPLICATIONSTATUS') == "NEW"){
      const  applicationId = this.store.getItem('APPLICATION_ID');
      if(applicationId != undefined){
        this.router.navigate([`/profile/documentUpload/${applicationId}`],{queryParams:{"application":applicationId,"indicator":documentName}});
      }
    }
    if(this.store.getItem('APPLICATIONSTATUS') == "PENDING"){
      const  applicationId = this.store.getItem('APPLICATION_ID');
      if(applicationId != undefined){
        this.router.navigate([`/profile/documentUpload/${applicationId}`],{queryParams:{"application":applicationId,"signal":"PENDING_DOCUMENT"}});
      }
    }
    if(this.store.getItem('APPLICATIONSTATUS') == "APPROVED" || this.store.getItem('CUSTOMER_STATUS') == "ACTIVE"){
      const customerId = this.store.getItem('CUSTOMER_ID');
      if(customerId != undefined){
        this.router.navigate([`/profile/documentUpload/${customerId}`],{queryParams:{"customer":customerId}});
      }
    } 
    }
    //corp 
    if(this.store.getItem('CORP_DOC_NAME')){
      let corpDocName = this.store.getItem('CORP_DOC_NAME');
      if(this.store.getItem('APPLICATIONSTATUS') == "NEW"){
        const  corpApplicationId = this.store.getItem('APPLICATION_ID')
        this.router.navigate([`/profile/corporate-documents/${corpApplicationId}`],{queryParams:{"application":corpApplicationId, "indicator": corpDocName}});
      }
      if(this.store.getItem('APPLICATIONSTATUS') == "PENDING"){
        const  corpApplicationId = this.store.getItem('APPLICATION_ID');
        if(corpApplicationId != undefined){
          this.router.navigate([`/profile/corporate-documents/${corpApplicationId}`],{queryParams:{"application":corpApplicationId,"signal":"CORP_PENDING_DOCUMENT"}});
        }
      }
      if(this.store.getItem('APPLICATIONSTATUS') == "APPROVED" || this.store.getItem('CUSTOMER_STATUS') == "ACTIVE"){
        const customerId = this.store.getItem('CUSTOMER_ID');
        if(customerId != undefined){
          this.router.navigate([`/profile/corporate-documents/${customerId}`],{queryParams:{"customer":customerId}});
        }
      } 
    }
  }
}
