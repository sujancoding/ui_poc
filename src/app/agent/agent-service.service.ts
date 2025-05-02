import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AsyncSubject, observable, Observable, of } from 'rxjs';
import { catchError, map, observeOn } from 'rxjs/operators';
import { AddDeal, RetrieveDeals } from '../backoffice/dailysetup/model/deal';
import { ErrorDialogAdminComponent } from '../backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { ErrorDialogComponent } from '../onboarding/modals/errordialog.component';
import { AddPayee, } from '../payee/payeeModel/updatePayee';
import { GlobalConstants } from '../shared/global.constant';
import { InMemoryCache } from '../shared/services/cache.service';
import { BookContract, FxRatePricing } from './models/agentpricing.model';
import { AgentSendMoney } from './models/agentsendmoney.model';
import { TransactionStatusUpdate } from './models/agentupdatetransaction.model';


@Injectable({
  providedIn: 'root'
})
export class AgentServiceService {
  forexInqUri : any;
  constructor(private http: HttpClient,private store : InMemoryCache,private dialogRef : MatDialog) { }
 
  //Agent > send money - POST API CALL
  agentSendMoney(sendMoney : AgentSendMoney,agentId:string):Observable<any>{
    let agentSendMoneyUrl : string = GlobalConstants.ADD_TRANSACTION.replace("{customerId}",agentId);
    return this.http.post(GlobalConstants.API_BASE_URL + agentSendMoneyUrl, sendMoney).catch(this.errorHandler) 
  }

  
  getPayeeListings(status:any):Observable<any>{
    let customerId = this.store.getItem('USER_ID');
    let payeeListingUrl : string = GlobalConstants.BACKOFFICE_SEARCH_PAYEE_API.replace("{customerId}",customerId) + "status=" + status;
    return this.http.get<any>(GlobalConstants.API_BASE_URL + payeeListingUrl ).catch(this.errorHandling) ;
  }

  getAgentDeal(): Observable<RetrieveDeals>{
    let subject = new AsyncSubject<any>();
  let agentId =  this.store.getItem('USER_ID');
    let getDealUrl : string = GlobalConstants.GET_DEALS_API + "agentId=" + agentId;
    this.http.get(GlobalConstants.API_BASE_URL + getDealUrl ).pipe(map(res => {
      //response from server
      if (res) {
        subject.next(res);
        subject.complete();
      }
    }),
      //error handling
      catchError((err, caught) => {
        return of('error', err);
      })).subscribe();
    return subject;
  }
 
  updatePayee(id: number , addPayee: AddPayee):AsyncSubject<any>{
    let subject = new AsyncSubject<any>();
   this.http.put(`http://localhost:3000/Add-Payee-Agent/`,id).pipe(map(res => {
    //response from server
     if (res) {
      subject.next(res);  
       subject.complete() ;
     }
   }),
   //error handling
     catchError((err, caught) => {
       return of('error', err);
     })).subscribe();
   return subject;  
  }
  
  

   
   getPayee(status:any,PayeeID:any):Observable<any>{
    let customerId = this.store.getItem('USER_ID');
    let payeeUrl : string = GlobalConstants.VIEW_PAYEE_API.replace("{customerId}",customerId).replace("{payeeId}",PayeeID) + "status=" + status;
    return this.http.get<any>(GlobalConstants.API_BASE_URL + payeeUrl ).catch(this.errorHandling) ;

  }

  getAgentInitiatedTransactions(customerId:string,status:string):Observable<any>{
    let transactionUrl : string = GlobalConstants.TRANSACTION_SEARCH + "customerId=" + customerId + "&status=" + status;
    return this.http.get<any>(GlobalConstants.API_BASE_URL + transactionUrl ).catch(this.errorHandling);
  }
  getOrgInitiatedTransactions(agentId:string,status:string):Observable<any>{
    let transactionUrl : string = GlobalConstants.TRANSACTION_SEARCH + "agentId=" + agentId + "&status=" + status;
    return this.http.get<any>(GlobalConstants.API_BASE_URL + transactionUrl ).catch(this.errorHandling) ;
  }

  updateTransactionStatus(transactionStatus : TransactionStatusUpdate,status:string): Observable<any> {
    let url : string = GlobalConstants.AGENT_FULFILLMENT.replace("{status}",status);
    return this.http.put<any>(GlobalConstants.API_BASE_URL + url, transactionStatus).catch(this.errorHandling);
  }
  //apply filter - payee search in agent 
  applyFilter(status:any, Name:any){
    let customerId = this.store.getItem('USER_ID');
    let payeeListingUrl : string = GlobalConstants.BACKOFFICE_SEARCH_PAYEE_API.replace("{customerId}",customerId) + "status=" + status +"&" + "payeeName=" + Name ;
    return this.http.get(GlobalConstants.API_BASE_URL + payeeListingUrl ).catch(this.errorHandling);
      //error handling

  }
  //PRICING API
  getPricing(price_api:FxRatePricing):Observable<any>{
    let pricing_Api: string = GlobalConstants.PRICING_API ;
    return this.http.post(GlobalConstants.API_BASE_URL + pricing_Api , price_api).catch(this.errorHandling)
  }
  
  //BOOKING API
   bookContract(book_api:BookContract):Observable<any>{
    let booking_Api: string = GlobalConstants.BOOKING_API ;
    return this.http.post(GlobalConstants.API_BASE_URL + booking_Api , book_api).catch(this.errorHandling)
   }

   //FOREX INQUIRY
   getForexInquiry(entityId:any,ccyPair:string,status : string,dateGt:string,dateLt:string): Observable<any>{
    status = status ? status : "";
    if(entityId != ""){
    this.forexInqUri = GlobalConstants.FOREX_INQUIRY + "entityId=" + entityId + "&utilizationStatus=" + status + "&dateGt=" + dateGt  + "&dateLt=" + dateLt;
    }
     if (entityId == ""){
      this.forexInqUri = GlobalConstants.FOREX_INQUIRY + "&dateGt=" + dateGt  + "&dateLt=" + dateLt ;
    }
    if(ccyPair != ""){
      this.forexInqUri = GlobalConstants.FOREX_INQUIRY + "entityId=" + entityId + "&" +"ccyPair=" + ccyPair + "&utilizationStatus=" + status  + "&dateGt=" + dateGt  + "&dateLt=" + dateLt;
    }
     return this.http.get<any>(GlobalConstants.API_BASE_URL + this.forexInqUri ).pipe(catchError(this.errorHandling))
     
  }

   //Filter FOREX INQUIRY
   getFilteredForexInquiry(contractNo:string,status:string,entityName:string,dateGt:any,dateLt:any,entityId:string): Observable<any>{
    if(dateGt == "NaN-NaN-NaN"){
      dateGt = "" ;
    }
    if(dateLt == "NaN-NaN-NaN"){
      dateLt = "" ;
    }
      let uri = GlobalConstants.FOREX_INQUIRY +"utilizationStatus=" + status + "&bookingId=" + contractNo
      + "&entityName=" + entityName + "&dateGt=" + dateGt
      + "&dateLt=" + dateLt + "&entityId=" + entityId;
     return this.http.get<any>(GlobalConstants.API_BASE_URL + uri ).pipe(catchError(this.errorHandling))
     
  }

   errorHandler(error:HttpErrorResponse){
    return Observable.throw(error.error.errorMessage || "");
  }

  errorHandling(error : HttpErrorResponse){
   return Observable.throw(error || "server issue") ;
  }

  //FOREX INQUIRY
  getContractForeignExchangeContracts(entityId:string,ccyPair:string): Observable<any>{
    if(entityId != ""){
    this.forexInqUri = GlobalConstants.FOREX_INQUIRY + "entityId=" + entityId + "&ccyPair=" + ccyPair;
    }
     if (entityId == ""){
      this.forexInqUri = GlobalConstants.FOREX_INQUIRY  ;
    }
     return this.http.get<any>(GlobalConstants.API_BASE_URL + this.forexInqUri ).pipe(catchError(this.errorHandler))
     
  }

   //TRANSACTION INQUIRY API
   getTransactionInquiry(dealId : string):Observable<any>{
    let txnInq_Api: string = GlobalConstants.TRANSACTION_INQUIRY_API + "dealId=" + dealId ;
    return this.http.get<any>(GlobalConstants.API_BASE_URL + txnInq_Api).catch(this.errorHandling)
  }
   
}
