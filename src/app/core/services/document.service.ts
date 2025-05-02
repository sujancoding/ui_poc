import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


import { AsyncSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { ErrorDialogComponent } from 'src/app/onboarding/modals/errordialog.component';
import { GlobalConstants } from 'src/app/shared/global.constant';
import { AddDocument, CorporateAddDocument } from '../../core/model/Add Document/add-document';
import { getDocumentKeyByValue } from '../../core/model/Add Document/add-document';
import { DocumentInquiry, DocumentUpdateConsumer, DocumentUpdateCustomer } from '../../core/model/Document Inquiry/document-inquiry';
import { SubmitDocument } from '../../core/model/Submit Document/SubmitDocument';
import { InMemoryCache } from 'src/app/shared/services/cache.service';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {


  handleError: any;
 

  constructor(private http: HttpClient , private dialogRef : MatDialog,private store: InMemoryCache) { }

  //error handler function
  errorHandler(error : HttpErrorResponse){
   return Observable.throw(error || "server issue") ;
  }

  //Documents-upload Service - Individual
  updateDocument(updatedocuments: AddDocument): Observable<any> {
    return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.APP_DOC_API, updatedocuments).catch(this.errorHandler)
  }

  submitDocument(submitdocument: SubmitDocument): Observable<any> {
    submitdocument['id'] = Math.random();
    console.log(submitdocument);
    return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.APP_DOCSUBMIT_API, submitdocument).catch(this.errorHandler)
  }
  //individual - document inquiry
  getDocumentInquiry(documentId:string,isCustomerDocumentFlag:Boolean): Observable<DocumentInquiry>{
    let docInqUrl: string;
    if(isCustomerDocumentFlag == true){
      docInqUrl  = GlobalConstants.CUSTOMER_DOCUMENT_INQUIRY.replace("{documentId}", documentId);
    }
    else{
      docInqUrl  = GlobalConstants.DOCUMENT_INQUIRY.replace("{documentId}", documentId);
    }
    
    return this.http.get<DocumentInquiry>(GlobalConstants.API_BASE_URL + docInqUrl).catch(this.errorHandler) ;
  }


  adminDocumentInquiry(documentId:string,isCustomerDocumentFlag:Boolean): Observable<DocumentInquiry>{
    let docInqUrl: string;
    if(isCustomerDocumentFlag == true){
      docInqUrl  = GlobalConstants.CUSTOMER_DOCUMENT_INQUIRY.replace("{documentId}", documentId);
    }
    else{
      docInqUrl  = GlobalConstants.DOCUMENT_INQUIRY.replace("{documentId}", documentId);
    }
   
    return this.http.get<DocumentInquiry>(GlobalConstants.API_BASE_URL + docInqUrl).catch(this.errorHandler);
  }


  downloadPDF(url: string): Observable<Blob> {
    const options = { responseType: 'blob' as 'json' };
    return this.http
   .get<Blob>(url, options)
   .pipe(map(res => new Blob([res], { type: 'application/pdf' })));
 }
 
  //Documents-upload Service - corporate
  updateCorporateDocument(updatedocuments: CorporateAddDocument): Observable<any> {
     return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.CORPORATE_ADD_DOCUMENT, updatedocuments).catch(this.errorHandler)
  }
//submit document -> corporate(mobile)
  submitDocumentCorporate(submitdocument: SubmitDocument): Observable<any> {
    submitdocument['id'] = Math.random();
    console.log(submitdocument);
   return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.CORPORATE_SUBMIT_DOCUMENT, submitdocument).catch(this.errorHandler)
  }


 //corporate - document inquiry
 getCorporateDocumentInquiry(documentId:string,isCustomerDocumentFlag:Boolean): Observable<DocumentInquiry>{
  let docInqUrl :  string;
  const customerStatus = this.store.getItem('CUSTOMER_STATUS') ? this.store.getItem('CUSTOMER_STATUS') : "";
  if(isCustomerDocumentFlag == true || customerStatus == "ACTIVE"){ //Entry point -> Backoffice > Customer search > View documents And Corporate (ACTIVE) > Profile > View Documents..
    docInqUrl  = GlobalConstants.CUSTOMER_DOCUMENT_INQUIRY.replace("{documentId}", documentId);
  }else{
    docInqUrl = GlobalConstants.CORPORATE_DOCUMENT_INQUIRY.replace("{documentId}", documentId);
  }

 return this.http.get<DocumentInquiry>(GlobalConstants.API_BASE_URL + docInqUrl).catch(this.errorHandler)
}

updateCorporateCustomerDocument(updateCustomerdocuments: DocumentUpdateCustomer,customerId:string): Observable<any> {
  //Entry Point : Backoffice > Cust Search > View Documents > Update existing/NEW document for a user
  let updateDocUrl = GlobalConstants.UPDATE_CUSTOMER_DOCUMENT.replace("{customerId}", customerId);
  
  return this.http.put(GlobalConstants.API_BASE_URL + updateDocUrl, updateCustomerdocuments).catch(this.errorHandler)
}

updateConsumerDocument(updateCustomerdocuments: DocumentUpdateConsumer,customerId:string): Observable<any> {
   //Entry Point : Backoffice > Cust Search > View Documents > Update existing/NEW document for a user
   let updateDocUrl = GlobalConstants.UPDATE_CUSTOMER_DOCUMENT.replace("{customerId}", customerId);
  return this.http.put(GlobalConstants.API_BASE_URL + updateDocUrl, updateCustomerdocuments).catch(this.errorHandler)
}
}
