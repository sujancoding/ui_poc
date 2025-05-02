import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AsyncSubject, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { GlobalConstants } from "src/app/shared/global.constant";
import { InMemoryCache } from "src/app/shared/services/cache.service";
import { AssetAccountSettlement, OrganisationSettlement } from "../model/orgsettlement/orgsettlement";
import {  ResetAccountDetails } from "src/app/transaction/model/TransactionModel";

@Injectable({
    providedIn: 'root'
  })
  export class OrganisationSettlementService {
  
   
    constructor(private http : HttpClient,private store : InMemoryCache) { }
  
    errorHandler(error : HttpErrorResponse){
     return Observable.throw(error || "") ;
    }

    getOrgSettlement(entity : any, accountNo : any, dateGt:any, dateLt:any, entityId:string):Observable<any>{
      let orgUri = GlobalConstants.ACCOUNTS_MASTER_API.replace("{entity}", entity) + "accountNo=" + accountNo +
      "&dateGt=" + dateGt + "&dateLt=" + dateLt + "&entityId=" + entityId ;
       return this.http.get<any>(GlobalConstants.API_BASE_URL + orgUri).catch(this.errorHandler)
  }

  getOrgAccounts(entity : any):Observable<any>{
    let orgUri = GlobalConstants.ACCOUNTS_MASTER_API.replace("{entity}", entity) ;
     return this.http.get<any>(GlobalConstants.API_BASE_URL + orgUri).catch(this.errorHandler)
}

//Manual Settlement of Profit loss account or commission account (based on accountNo)
  assetAccountSettlement(accountNo : string , settlementBody: AssetAccountSettlement):Observable<any>{
  let orgUri = GlobalConstants.ORGANISATION_ASSET_ACCOUNT_SETTLEMENT.replace("{accountNo}", accountNo) ;
   return this.http.post<any>(GlobalConstants.API_BASE_URL + orgUri , settlementBody).catch(this.errorHandler)
}
// Reset account balance for transaction profit loss , commision profit loss, expenses.
  resetAccountBalance(accountNo : string, resetAccountDeatails : ResetAccountDetails):Observable<any>{
  return this.http.put(GlobalConstants.API_BASE_URL + GlobalConstants.RESET_ACCOUNT_BALANCE.replace("{accountNo}", accountNo),resetAccountDeatails).catch(this.errorHandler)
  

 } 
}

  
  