import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GlobalConstants } from "src/app/shared/global.constant";
import { InMemoryCache } from "src/app/shared/services/cache.service";
import { AddTransactionMoneyChanger } from "../model/mctransaction/mctransaction.model";


@Injectable({
    providedIn: 'root'
  })
  export class MoneyChangerTransactionService {
  
    constructor(private http : HttpClient,private store : InMemoryCache) { }

    errorHandler(httpErrorResponse : HttpErrorResponse){
      return Observable.throw(httpErrorResponse || "server issue") 
    }

    //Transaction Search API 
    //currency filter , customerid , customer name, buysell indicator, transaction status, counter type, date gt, date Lt, suspicious
    getTransactionListings(currencyCode:string, customerId:string, customerName:string, 
      buySellInd:string, dateGt:any, dateLt:any, counterType:string, status:string , isSuspicious:string):Observable<any>{
        return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_TRANSACTION_INQUIRY + "ccyCode=" + currencyCode +
        "&customerId=" + customerId + "&customerName=" + customerName + "&buySellInd=" + buySellInd + 
          "&dateGt=" + dateGt + "&dateLt=" + dateLt + "&counterType=" + counterType + "&status=" + status + "&suspicious=" + isSuspicious) 
         .catch(this.errorHandler) ;
    }

    
  //Add Transaction API 
  addTransactionMoneyChanger(addTxnReq: AddTransactionMoneyChanger): Observable<any> {
    return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.MC_ADD_TRANSACTION_API, addTxnReq).catch(this.errorHandler)
}

  getTransactionDetailInquiry(transactionId:string):Observable<any>{
    return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_TRANSACTION_DETAIL_INQUIRY + "transactionId=" + transactionId) 
       .catch(this.errorHandler) ;
  }

  }