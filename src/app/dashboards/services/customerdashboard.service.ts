import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AsyncSubject, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { GlobalConstants } from "src/app/shared/global.constant";
import { InMemoryCache } from "src/app/shared/services/cache.service";
import { TransactionHistory } from "../model/approveddashboard";



@Injectable({
    providedIn: 'root'
  })
  export class CustomerDashboardService {
  
  
    constructor(private http : HttpClient,private store: InMemoryCache) { }
  
    errorHandler(error:HttpErrorResponse){
      console.log("error handler =" + error) ;
      return Observable.throw(error || "");
    }
    
    // /v1/dashboard/customer?customerId={customerId}
    getCustomerDashboard(): Observable<TransactionHistory[]> {
        let customerId = this.store.getItem('CUSTOMER_ID');
        let status = '1';
        let customerDashboardUrl : string = GlobalConstants.CUSTOMER_DASHBOARD + "customerId=" + customerId + '&status=' + status;
        return this.http.get<TransactionHistory[]>(GlobalConstants.API_BASE_URL + customerDashboardUrl).catch(this.errorHandler);
      }

      getTransactionHistory(): Observable<TransactionHistory[]> {
        let customerId = this.store.getItem('CUSTOMER_ID')
        let customerDashboardUrl : string = GlobalConstants.TRANSACTION_SEARCH + "customerId=" + customerId;
        return this.http.get<TransactionHistory[]>(GlobalConstants.API_BASE_URL + customerDashboardUrl).catch(this.errorHandler)
      }

  }