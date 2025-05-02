import { HttpClient,HttpErrorResponse,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { AsyncSubject, Observable, of } from 'rxjs';
import 'rxjs/add/observable/throw';
import "rxjs/add/operator/catch";
import { catchError, filter, map } from 'rxjs/operators';
import { PayeeSearch } from 'src/app/backoffice/customer/model/customer.model';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { ErrorDialogComponent } from 'src/app/onboarding/modals/errordialog.component';
import { GlobalConstants } from 'src/app/shared/global.constant';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { PayeeList, RemitMoney } from '../payeeModel/remit-money';
import { AddPayee} from '../payeeModel/updatePayee';

@Injectable({
  providedIn: 'root'
})
export class PayeeService {
  

  constructor(private http: HttpClient , private store: InMemoryCache , private dialogRef: MatDialog) {}

  errorHandler(error:HttpErrorResponse){
    return Observable.throw(error || "");
  }


  AddPayee(addPayee: AddPayee):Observable<any>{
    console.log(addPayee);
   let customerId = this.store.getItem('CUSTOMER_ID');  
    let addPayeeUrl: string = GlobalConstants.ADD_PAYEE_API.replace("{customerId}", customerId);
     return this.http.post(GlobalConstants.API_BASE_URL + addPayeeUrl, addPayee).catch(this.errorHandler)
  }

  AddPayeeBackoffice(addPayee: AddPayee):Observable<any>{
    console.log(addPayee);
   let customerId = this.store.getItem('BACKOFFICECUSTOMER_ID');  
    let addPayeeUrl: string = GlobalConstants.ADD_PAYEE_API.replace("{customerId}", customerId);
    return this.http.post(GlobalConstants.API_BASE_URL + addPayeeUrl, addPayee).catch(this.errorHandler) ;
  }
  
  AddPayeebyAgent(addPayee: AddPayee):Observable<any>{
    console.log(addPayee);
    let customerId = this.store.getItem('USER_ID');
    let addPayeeUrl: string = GlobalConstants.ADD_PAYEE_API.replace("{customerId}", customerId);
    return this.http.post(GlobalConstants.API_BASE_URL + addPayeeUrl, addPayee).catch(this.errorHandler)
  }
  
  searchPayee(status:any): Observable<PayeeSearch[]> {
    let searchPayeeUrl : string = GlobalConstants.SEARCH_PAYEE_API + "status="+ status;
      return this.http.get<PayeeSearch[]>(GlobalConstants.API_BASE_URL + searchPayeeUrl).catch(this.errorHandler);
    }

    filteredPayeeSearch(payeeName:string,status:string): Observable<PayeeSearch[]> {
      let searchPayeeUrl : string = GlobalConstants.SEARCH_PAYEE_API + "payeeName=" + payeeName + "&status=" + status;
        return this.http.get<PayeeSearch[]>(GlobalConstants.API_BASE_URL + searchPayeeUrl).catch(this.errorHandler) ;
      }

  viewPayee(customerId:any,payeeId:any): Observable<PayeeSearch> {
        let viewPayeeUrl : string = GlobalConstants.VIEW_PAYEE_API.replace("{customerId}",customerId).replace("{payeeId}",payeeId)
          return this.http.get<PayeeSearch>(GlobalConstants.API_BASE_URL + viewPayeeUrl).catch(this.errorHandler) ;
   }
   updatePayee(customerId:any,payeeId:any,updatePayee:AddPayee):Observable<any>{
    let viewPayeeUrl : string = GlobalConstants.VIEW_PAYEE_API.replace("{customerId}",customerId).replace("{payeeId}",payeeId);
    return this.http.put<any>(GlobalConstants.API_BASE_URL + viewPayeeUrl,updatePayee).catch(this.errorHandler) ;
   }
   viewCustomersPayee(customerId:any,status:string): Observable<PayeeSearch> {
    let backofficeViewPayeeUrl : string = GlobalConstants.BACKOFFICE_VIEW_PAYEE_API.replace("{customerId}",customerId) + "status=" + status;
      return this.http.get<PayeeSearch>(GlobalConstants.API_BASE_URL + backofficeViewPayeeUrl).catch(this.errorHandler)
}

filterCustomersPayee(customerId:any,status:string,name : any): Observable<PayeeSearch> {
  let backofficeViewPayeeUrl : string = GlobalConstants.BACKOFFICE_VIEW_PAYEE_API.replace("{customerId}",customerId) + "status=" + status + "&" + "payeeName=" + name;
    return this.http.get<PayeeSearch>(GlobalConstants.API_BASE_URL + backofficeViewPayeeUrl).catch(this.errorHandler) ;
}

   payeeFulFilment(customerId:any,payeeId:any,status:any): Observable<PayeeSearch> {
    let payeeFulFilmentUrl : string = GlobalConstants.PAYEE_FULFILMENT.replace("{customerId}",customerId).replace("{payeeId}",payeeId).replace("{action}",status)
     return this.http.patch<PayeeSearch>(GlobalConstants.API_BASE_URL + payeeFulFilmentUrl,PayeeSearch).catch(this.errorHandler);
}
 
 
sendMoney(remitMoney: RemitMoney):Observable<any>{
  let customerId = this.store.getItem('CUSTOMER_ID'); 
  let addTransactionUrl : string = GlobalConstants.ADD_TRANSACTION.replace("{customerId}" , customerId);
  let subject = new AsyncSubject<any>();
  console.log(remitMoney);
  return this.http.post(GlobalConstants.API_BASE_URL + addTransactionUrl, remitMoney).catch(this.errorHandler)
}

sendMoneyByBranch(remitMoney: RemitMoney):Observable<any>{
  let customerId = this.store.getItem('CUST_ID'); 
  let addTransactionUrl : string = GlobalConstants.ADD_TRANSACTION.replace("{customerId}" , customerId);
  return this.http.post<any>(GlobalConstants.API_BASE_URL + addTransactionUrl, remitMoney).catch(this.errorHandler) ;
}
 
searchPayeeName(status : string,payeeName:string,customerId:string):Observable<any>{
  let consumerPayeeSearchUrl : string = GlobalConstants.BACKOFFICE_SEARCH_PAYEE_API.replace("{customerId}" , customerId) + "status=" +status + "&" + "payeeName=" + payeeName;
  return this.http.get<any>(GlobalConstants.API_BASE_URL + consumerPayeeSearchUrl).catch(this.errorHandler);
}
}
