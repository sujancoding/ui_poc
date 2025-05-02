import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GlobalConstants } from "src/app/shared/global.constant";
import { InMemoryCache } from "src/app/shared/services/cache.service";
import { AddCounter, AddCurrency, UpdateCounter, UpdateCurrency, UpdateCurrencyValue, UpdateInventory } from "../model/mcmaintenance/mcmaintenance.model";

@Injectable({
    providedIn: 'root'
  })
  export class MoneyChangerMaintenanceService {
  
    constructor(private http : HttpClient,private store : InMemoryCache) { }

    errorHandler(httpErrorResponse : HttpErrorResponse){
      return Observable.throw(httpErrorResponse || "server issue") 
    }

    //Counter Search API 
    getCounterListings(counterId:string , counterType:string , counterIp:string ):Observable<any>{
        return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.COUNTER_MAINTENANCE_API + "counterId=" + 
        counterId + "&counterType=" + counterType + "&counterIp=" + counterIp)
         .catch(this.errorHandler) ;
    }

    //Add Counter API 
    addCounter(addCounterReq: AddCounter): Observable<any> {
      return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.ADD_COUNTER_MAINTENANCE_API, addCounterReq).catch(this.errorHandler)
  }

  //Update Counter API 
  updateCounter(updateCounterReq: UpdateCounter,counterId:string): Observable<any> {
    return this.http.put(GlobalConstants.API_BASE_URL + GlobalConstants.UPDATE_COUNTER_MAINTENANCE_API.replace("{counterId}",counterId), updateCounterReq).catch(this.errorHandler)
}
 

//Currency Search API 
getCurrencyListings(ccyNo:string , ccyCode:string , ccyName:string ):Observable<any>{
  return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.CURRENCY_SEARCH_API + "ccyNo=" + 
  ccyNo + "&ccyCode=" + ccyCode + "&ccyName=" + ccyName)
   .catch(this.errorHandler) ;
}

  //Add Currency API 
  addCurrency(addCurrencyReq: AddCurrency): Observable<any> {
    return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.ADD_CURRENCY_API, addCurrencyReq).catch(this.errorHandler)
}

//Update Currency API 
updateCurrency(updateCurrencyReq: UpdateCurrency,currencyNumber:string): Observable<any> {
  return this.http.put(GlobalConstants.API_BASE_URL + GlobalConstants.UPDATE_CURRENCY_API.replace("{currencyNo}",currencyNumber), updateCurrencyReq).catch(this.errorHandler)
}

//stock inventory inquiry api ?id=&ccyNo=&counterType=&dateGt=&dateLt=
 getStockInventoryInquiry(counterType:string, ccyCode:string, ccyNo : String):Observable<any>{
  return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_STOCK_INVENTORY_INQUIRY_API + 
    "counterType=" + counterType + "&ccyCode=" + ccyCode + "&ccyNo=" + ccyNo)
   .catch(this.errorHandler) ;
}

//stock inventory inquiry api ?id=&ccyNo=&counterType=&dateGt=&dateLt=
updateStockInventory(ccyNo:any, stockPayload:UpdateInventory){
  return this.http.put(GlobalConstants.API_BASE_URL +
     GlobalConstants.MC_UPDATE_STOCK_INVENTORY_API.replace("{ccyNo}",ccyNo), stockPayload)
   .catch(this.errorHandler) ;
}

 
 dayClosing(): Observable<any> {
  return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.MC_DAY_CLOSING_API,{}).catch(this.errorHandler)
}

//stock inventory history inquiry api id=&ccyNo=&counterType=&dateGt=&dateLt=
getInventoryHistory(counterType:string, ccyNo:any, dateGt:any, dateLt:any):Observable<any>{
  return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_STOCK_INVENTORY_INQUIRY_API + 
    "counterType=" + counterType + "&ccyNo=" + ccyNo + "&dateGt=" + dateGt + "&dateLt=" + dateLt)
   .catch(this.errorHandler) ;
}

//Get Currency value inquiry API 
getCurrencyValueInquiry(ccyNo:string):Observable<any>{
  return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.CURRENCY_VALUE_INQUIRY_API.replace("{currencyNo}",ccyNo) )
   .catch(this.errorHandler) ;
}

//Update Currency value API 
updateCurrencyValue(updateCurrencyValueReq: UpdateCurrencyValue,currencyNumber:string): Observable<any> {
  return this.http.put(GlobalConstants.API_BASE_URL + GlobalConstants.CURRENCY_VALUE_UPSERT_API.replace("{currencyNo}",currencyNumber), updateCurrencyValueReq).catch(this.errorHandler)
}

branchCloseInquiry(): Observable<any> {
  return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_BRANCH_CLOSE_INQUIRY_API )
   .catch(this.errorHandler) ;
}

//Get the Money changer branch current status --> closed or open
branchOperationStatus(): Observable<any> {
  return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_BRANCH_OPERATION_STATUS_API )
   .catch(this.errorHandler) ;
}


}