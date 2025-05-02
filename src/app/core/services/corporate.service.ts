import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from "@angular/common/http";
import { AsyncSubject, Observable, observable, of } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/shared/global.constant';
import { CompanyProfile,  UpdateCorporate, UpdateCorporateProfile } from '../model/Company Profile/company-profile';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/onboarding/modals/errordialog.component';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CorporateApplicationInquiry } from '../model/corporateapplicationinquiry/corporateapplicationinquiry';
import { CorporateCustomerInquiry } from '../model/corporatecustomerinquiry/corporatecustomerinquiry';
import { RemitMoney } from 'src/app/payee/payeeModel/remit-money';

@Injectable({
  providedIn: 'root'
})
export class CorporateService {


  constructor(private http : HttpClient,private dialogRef : MatDialog,private store : InMemoryCache
    ) { }

    errorHandler(error:HttpErrorResponse){
      return Observable.throw(error || "server issue")
    }

  corporateApplicationUpdate(companyProfile:CompanyProfile,productCode : string): Observable<any> {
    let applicationId : any ;
    if(productCode == "MC"){
      applicationId = this.store.getItem('MC_CORP_APPLICATIONID') ;
     }
     else if(productCode == ""){
      applicationId = this.store.getItem('APPLICATION_ID');
    }
    let applicationUpdateUrl : string =  GlobalConstants.CORPORATE_APPLICATION_UPDATE.replace("{applicationId}",applicationId)
     return this.http.post(GlobalConstants.API_BASE_URL + applicationUpdateUrl , companyProfile).catch(this.errorHandler)

    
    

   
  }

  getCorporateApplicationInquiry(applicationId:any): Observable<CorporateApplicationInquiry> {
    let applicationInq : string = GlobalConstants.CORPORATE_APPLICATION_INQUIRY.replace("{applicationId}", applicationId);
     return this.http.get<CorporateApplicationInquiry>(GlobalConstants.API_BASE_URL + applicationInq).catch(this.errorHandler)
  }

  getCorporateCustomerInquiry(customerId:string): Observable<CorporateCustomerInquiry> {
    let customerInq : string = GlobalConstants.CUSTOMER_INQUIRY_API.replace("{customerId}", customerId);
   return this.http.get<CorporateCustomerInquiry>(GlobalConstants.API_BASE_URL + customerInq).catch(this.errorHandler)
  }

   //customer update API - corporate profile 
   updateCompanyProfile(customerId:string , updateCorporateProfile : UpdateCorporateProfile): Observable<any> {
    return this.http.put(GlobalConstants.API_BASE_URL + GlobalConstants.CUSTOMER_INQUIRY_API.replace("{customerId}",customerId), updateCorporateProfile).catch(this.errorHandler)
}

  //customer update API - corporate profile 
  updateCompanyAssociates(customerId:string , updateAssociates : UpdateCorporate): Observable<any> {
    return this.http.put(GlobalConstants.API_BASE_URL + GlobalConstants.CUSTOMER_INQUIRY_API.replace("{customerId}",customerId), updateAssociates).catch(this.errorHandler)
}

//send money deal flow >>> corporate
sendMoney(remitMoney: RemitMoney, customerId : string):Observable<any>{
  let addTransactionUrl : string = GlobalConstants.ADD_TRANSACTION.replace("{customerId}" , customerId);
  return this.http.post<any>(GlobalConstants.API_BASE_URL + addTransactionUrl, remitMoney).catch(this.errorHandler) ;
}

 

}
