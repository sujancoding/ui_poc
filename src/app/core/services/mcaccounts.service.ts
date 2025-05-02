import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GlobalConstants } from "src/app/shared/global.constant";
import { InMemoryCache } from "src/app/shared/services/cache.service";

@Injectable({
    providedIn: 'root'
  })

  export class MoneyChangerAccountsService {
  
    constructor(private http : HttpClient,private store : InMemoryCache) { }

    errorHandler(httpErrorResponse : HttpErrorResponse){
      return Observable.throw(httpErrorResponse || "server issue") 
    }

//Customer accounts Search API ==> acctNo=&entityName=&acctStatus=&custId=&custType=
//acctNo=&entityName=&custId=&custType=&dateGt=&dateLt=
    getCustomerAccounts(acctNo:string, entityName:string, acctStatus:string, custId:string, custType:string, dateGt:any, dateLt:any, ccyNo:string, aliasName:string):Observable<any>{
        return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_CUSTOMER_ACCOUNTS_INQUIRY + 
          "acctNo=" + acctNo + "&entityName=" + entityName + "&acctStatus=" + acctStatus + "&custId=" + custId + 
          "&custType=" + custType + "&dateGt=" + dateGt + "&dateLt=" + dateLt + "&ccyNo=" + ccyNo + "&aliasName=" + aliasName)
         .catch(this.errorHandler) ;
    }

    //get customer accounts ledger --> startDate=2024-01-27&endDate=2024-01-27&accountNo=MC57933&exportFlag=true
     getCustomerAccountsLedger(accountNo : string, startDate:any, endDate:any, exportFlag:boolean, isExcel:boolean ):Observable<any>{
      let ledgerUri = GlobalConstants.MC_CUSTOMER_AC_LEDGER_API + "accountNo=" + accountNo + "&startDate=" + startDate + 
      "&endDate=" + endDate + "&exportFlag=" + exportFlag + "&isExcel=" + isExcel
      return this.http.get(GlobalConstants.API_BASE_URL + ledgerUri,{responseType:'arraybuffer'}).catch(this.errorHandler)
    }

    getCurrencyLedger(ccyNo : string, startDate:any, endDate:any, exportFlag:boolean, isExcel : boolean):Observable<any>{
      let ledgerUri = GlobalConstants.MC_CUSTOMER_AC_LEDGER_API + "ccyNo=" + ccyNo + "&startDate=" + startDate + 
      "&endDate=" + endDate + "&exportFlag=" + exportFlag + "&isExcel=" + isExcel
      return this.http.get(GlobalConstants.API_BASE_URL + ledgerUri,{responseType:'arraybuffer'}).catch(this.errorHandler)
    }

    //MC > Customer Accounts > Asset details 
    getCustomerAccountAsset():Observable<any>{
      return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_CUSTOMER_ACCOUNTS_ASSET_DETAIL_API)
       .catch(this.errorHandler) ;
  }

}