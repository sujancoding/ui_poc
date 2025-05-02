import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GlobalConstants } from "src/app/shared/global.constant";
import { InMemoryCache } from "src/app/shared/services/cache.service";
import { MultipleDealCancel, NewDealMoneyChanger, UpdateDealMc } from "../model/mcdeals/mcdeals.model";

@Injectable({
    providedIn: 'root'
  })
  export class MoneyChangerDealsService {
  
    constructor(private http : HttpClient,private store : InMemoryCache) { }

    errorHandler(httpErrorResponse : HttpErrorResponse){
      return Observable.throw(httpErrorResponse || "server issue") 
    }

    //Deal Search API 
    //filters => v1/mc/deal/inquiry?id=&dealId=&custId=&custType=&custName=&buySellInd=&ccyNo=&ccyCode=&dateGt=&dateLt=&status=
    getDealListings(ccyCode:string,customerId:string, customerName:string, buySellInd:string, status:string, id:string, dateGt:any, dateLt:any, isShipment: boolean):Observable<any>{
        return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_DEAL_INQUIRY_API + "ccyCode=" + ccyCode + "&custId=" + customerId +
        "&custName=" + customerName + "&buySellInd=" + buySellInd + "&status=" + status + "&id=" + id + "&dateGt=" + dateGt + "&dateLt=" + dateLt
      + "&isShipment=" + isShipment)
         .catch(this.errorHandler) ;
    }

    
    //Deal book API 
    bookDeal(addDealReqPayload : NewDealMoneyChanger): Observable<any> {
      return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.MC_BOOK_DEAL_API, addDealReqPayload).catch(this.errorHandler)
  }

  //Deal detail inquiry API 
  getDealDetailInquiry(dealId:string):Observable<any>{
    return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_DEAL_DETAIL_INQUIRY_API.replace("{dealID}",dealId))
     .catch(this.errorHandler) ;
}

//update deal 
  updateDeal(dealId:string , updateDealReqPayload : UpdateDealMc): Observable<any> {
    return this.http.put(GlobalConstants.API_BASE_URL + GlobalConstants.MC_UPDATE_DEAL_API.replace("{dealId}",dealId), updateDealReqPayload).catch(this.errorHandler)
}

//multiple deal cancel api
multipleDealCancel(reqPayload : MultipleDealCancel): Observable<any> {
  return this.http.put(GlobalConstants.API_BASE_URL + GlobalConstants.MC_DEAL_MULTIPLE_CANCEL_API, reqPayload).catch(this.errorHandler)
}

  }

  



 




