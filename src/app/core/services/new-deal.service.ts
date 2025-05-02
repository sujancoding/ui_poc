import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/shared/global.constant';
import { AddDeal, RetrieveDeals } from 'src/app/backoffice/dailysetup/model/deal';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';


@Injectable({
  providedIn: 'root'
})
export class NewDealService {

  dealUrl : any;
  agentUrl : any;
  constructor(private http : HttpClient,private store : InMemoryCache,private dialogRef : MatDialog) { }

  errorHandler(error:HttpErrorResponse){
   return Observable.throw(error || "server issue") ;
  }
  getAgentList(): Observable<AddDeal>{
    return this.http.get<AddDeal>(GlobalConstants.API_BASE_URL + GlobalConstants.GET_AGENT_API).catch(this.errorHandler)
  }

  AddDeal(deal : AddDeal):Observable<any>{
    let agentId = this.store.getItem('AGENT_ID');
    let addDealUrl : string = GlobalConstants.BOOK_DEAL_API.replace("{agentId}",agentId);
    return this.http.post<any>(GlobalConstants.API_BASE_URL + addDealUrl, deal).catch(this.errorHandler);
  }

  getDealSummary(status:any,initiatedBy:string): Observable<AddDeal>{
    if(status == undefined){
      this.dealUrl  = GlobalConstants.GET_DEALS_API + "status=INPROGRESS" + "&" + "initiatedBy=" + initiatedBy ;
    }
    else if(status != undefined && initiatedBy != undefined){
      this.dealUrl  = GlobalConstants.GET_DEALS_API + "status=" + status + "&" + "initiatedBy=" + initiatedBy ;
    }
    return this.http.get<AddDeal>(GlobalConstants.API_BASE_URL + this.dealUrl).catch(this.errorHandler);
  }

  filteredDealSummary(name : string,status : string , initiatedBy : string,foreignCurrency:string,dateGt:string,dateLt:string,dealId:string): Observable<AddDeal>{
    if(dateGt == "NaN-NaN-NaN"){
      dateGt = "" ;
    }
    if(dateLt == "NaN-NaN-NaN"){
      dateLt = "" ;
    }
    this.dealUrl = GlobalConstants.GET_DEALS_API + "name=" + name + "&status="+ status + "&initiatedBy=" + initiatedBy
    + "&buyCurrencyCode=" + foreignCurrency + "&dateGt=" + dateGt + "&dateLt=" + dateLt  + "&dealId=" + dealId;
   return this.http.get<AddDeal>(GlobalConstants.API_BASE_URL + this.dealUrl).catch(this.errorHandler) ;
  }

  getDeals(agentId:any,buyCCYCode : any): Observable<AddDeal>{
   let dealsUrl : string = GlobalConstants.GET_DEALS_API + "agentId=" + agentId + "&" + "buyCurrencyCode=" + buyCCYCode;
    return this.http.get<AddDeal>(GlobalConstants.API_BASE_URL + dealsUrl).catch(this.errorHandler);
  }

  //Agent > send money - this service will retrieve only the deals which is initiated by agent
  agentInitiatedDeals(agentId:any,initiatedBy : string,status:string,buyCurrencyCode : string): Observable<RetrieveDeals>{
    let dealsUrl : string = GlobalConstants.GET_DEALS_API + "agentId=" + agentId + "&" + "initiatedBy=" + initiatedBy + "&" + "status=" + status + "&buyCurrencyCode=" + buyCurrencyCode;
     let subject = new AsyncSubject<any>();
     this.http.get(GlobalConstants.API_BASE_URL + dealsUrl).pipe(map(res => {
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

  //Agent > send money - this service will retrieve only the deals which is initiated by agent
  getAgentDeals(agentId:any,initiatedBy : string): Observable<RetrieveDeals>{
    let dealsUrl : string = GlobalConstants.GET_DEALS_API + "agentId=" + agentId + "&" + "initiatedBy=" + initiatedBy ;
    return this.http.get<RetrieveDeals>(GlobalConstants.API_BASE_URL + dealsUrl).catch(this.errorHandler) ;
   }
  
  viewAgent(agentId:any):Observable<any>{
    let viewAgentUrl = GlobalConstants.GET_AGENT_API + "agentId=" + agentId;
    return this.http.get<any>(GlobalConstants.API_BASE_URL + viewAgentUrl).catch(this.errorHandler);
  }
}


