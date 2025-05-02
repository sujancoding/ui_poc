import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AsyncSubject, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ErrorDialogAdminComponent } from "src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component";
import { GlobalConstants } from "src/app/shared/global.constant";
import { InMemoryCache } from "src/app/shared/services/cache.service";
import { AgentSettlement, NewSettlement } from "src/app/transaction/model/TransactionModel";

@Injectable({
    providedIn: 'root'
  })
  export class AgentSettlementService {
  
     agentUrl !: string;
    constructor(private http : HttpClient,private store : InMemoryCache,private dialogRef : MatDialog) { }

    errorHandler(httpErrorResponse : HttpErrorResponse){
      return Observable.throw(httpErrorResponse.error.errorMessage || "server issue") 
    }

    errorHandling(error : HttpErrorResponse){
     return Observable.throw(error || "") ;
    }
  
    getAgentSettlement(entity : any, entityId:any, dateGt:any, dateLt:any):Observable<any>{
      let agentAccountsUri =  GlobalConstants.ACCOUNTS_MASTER_API.replace("{entity}",entity) + "&entityId=" + entityId +
      "&dateGt=" + dateGt + "&dateLt=" + dateLt ;
       return this.http.get<any>(GlobalConstants.API_BASE_URL + agentAccountsUri).catch(this.errorHandling) ;
      }

      filteredAgentSettlement(agentName: string):Observable<AgentSettlement>{
        if(agentName != undefined){
        this.agentUrl  = GlobalConstants.ACCOUNTS_MASTER_API.replace("{entity}",'AGENT') + "&entityName=" + agentName
        }
        if (agentName == ""){
          this.agentUrl  =  GlobalConstants.ACCOUNTS_MASTER_API.replace("{entity}",'AGENT') + "&entityName=" + agentName
        }
        return this.http.get<AgentSettlement>(GlobalConstants.API_BASE_URL + this.agentUrl)
        .catch(this.errorHandling)
      }

      postAgentSettlement(newSettlement : NewSettlement): Observable<any> {
       let agentId =  this.store.getItem('AGENTID');
        let postSettlementUrl = GlobalConstants.POST_AGENT_SETTLEMENT_API.replace("{agentId}",agentId);
        return this.http.post<any>(GlobalConstants.API_BASE_URL + postSettlementUrl,newSettlement)
        .catch(this.errorHandling);
      }

      //agent settlement history service function ..
      //entityId=&entity=AMEER SULTAN COMPANY&dateGt=2023-11-26&dateLt=2023-11-28
      getAgentSettlementHistory(agentId : any, entityName : string, dateGt : any, dateLt : any, channel:string):Observable<any>{
        let settlementHistoryUrl = GlobalConstants.GET_AGENT_SETTLEMENT_HISTORY + "entityId=" + agentId + "&entity=" + entityName 
        + "&dateGt=" + dateGt + "&dateLt=" + dateLt + "&channel=" + channel;
        return this.http.get<any>(GlobalConstants.API_BASE_URL + settlementHistoryUrl)
        .catch(this.errorHandling) ;
      }

      //Agent ledger download api - startDate=2024-01-22&endDate=2024-01-22&accountNo=12125&exportFlag=true
     getAgentLedger(accountNo : string, startDate:any, endDate:any, exportFlag:boolean, isExcel : boolean):Observable<any>{
      let agentLedgerUri = GlobalConstants.RT_AGENT_LEDGER_API + "accountNo=" + accountNo + "&startDate=" + startDate + 
      "&endDate=" + endDate + "&exportFlag=" + exportFlag + "&isExcel=" + isExcel
      return this.http.get(GlobalConstants.API_BASE_URL + agentLedgerUri,{responseType:'arraybuffer'}).catch(this.errorHandler)
    }

    getExpensesTransactionHistory(accountNo : any, dateGt : any,dateLt : any):Observable<any>{
      let expensesTransactionHistoryUrl = GlobalConstants.GET_AGENT_SETTLEMENT_HISTORY + "accountNo=" + accountNo  
      + "&dateGt=" + dateGt + "&dateLt=" + dateLt ;
      return this.http.get<any>(GlobalConstants.API_BASE_URL + expensesTransactionHistoryUrl)
      .catch(this.errorHandling) ;
    }

    // Reset Account history API
    getResetAccountHistory(accountNo : any, startDate : any,endDate : any):Observable<any>{
      let resetAccountHistoryUrl = GlobalConstants.RESET_ACCOUNT_HISTORY + "accountNo=" + accountNo  
      + "&startDate=" + startDate + "&endDate=" + endDate ;
      return this.http.get<any>(GlobalConstants.API_BASE_URL + resetAccountHistoryUrl)
      .catch(this.errorHandling) ;
    }
  }

  
  