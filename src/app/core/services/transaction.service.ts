import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AsyncSubject, observable, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import 'rxjs/add/observable/throw';
import "rxjs/add/operator/catch";
import { ErrorDialogAdminComponent } from "src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component";
import { TransactionData, TransactionDeposit } from "src/app/dashboards/model/approveddashboard";
import { ErrorDialogComponent } from "src/app/onboarding/modals/errordialog.component";
import { GlobalConstants } from "src/app/shared/global.constant";
import { InMemoryCache } from "src/app/shared/services/cache.service";
import { AgentApproveTransaction, ApproveTransaction, ApproveTransactionDbs, UpdateTransactionStatus } from "../model/approvetransaction/approvetransaction";
import { GenerateQR } from "../model/qrgenerate/qr.file";
import { TransactionDocumentInquiry } from "../model/transactiondocumentinquiry/transactiondocumentinquiry.model";
import { KycAdd, KycUpdate } from "../model/mckyc-config/kyc-config.model";
import { AddTransactionScreeningDocument } from "../model/Add Document/add-document";

@Injectable({
    providedIn: 'root'
  })
  export class TransactionService {
  
    transactionUrl !: string;
    reportUrl !: string;
    
    constructor(private http : HttpClient,private store : InMemoryCache,private dialogRef : MatDialog) { }
    //error handler function
    errorHandler(error:HttpErrorResponse){
      return Observable.throw(error.error.errorMessage || "server issue")
    }

    //error handling function for handling 401 status code
    errorHandling(error:HttpErrorResponse){
      return Observable.throw(error || "server issue")
    }
  viewTransactions(): Observable<TransactionData[]>{
    let subject = new AsyncSubject<any>();
    this.http.get(GlobalConstants.API_BASE_URL + GlobalConstants.VIEW_TRANSACTION).pipe(map(res => {
      //response from server
      if (res) {
        subject.next(res);
        subject.complete();
      }
    }),
      //error handling
      catchError((err, caught) => {
        this.store.setItem('NO_DATA_FOUND',err);
        return of('error', err);
      })).subscribe();
    return subject;
  }

//aprove transaction using deals - ameer sulthan , lembah
  approveTransaction(postTransaction: ApproveTransaction): Observable<any> {
    return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.TRANSACTION_SEARCH, postTransaction).catch(this.errorHandling)
  }
//approve transaction using dbs
  approveTransactionDbs(postTransaction: ApproveTransactionDbs): Observable<any> {
    return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.TRANSACTION_SEARCH, postTransaction).catch(this.errorHandling)
  }
  
  //approve transaction for agent/corporate
  agentApproveTransaction(postTransaction: AgentApproveTransaction): Observable<any> {
    return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.TRANSACTION_SEARCH, postTransaction).catch(this.errorHandling)
  }
  
  getTransactions(status : string,dateGt : any, dateLt : any):Observable<any>{ //
    let getTransUrl : string = GlobalConstants.TRANSACTION_SEARCH + "&status=" + status 
    + "&dateGt=" + dateGt + "&dateLt=" + dateLt    ;
    return this.http.get(GlobalConstants.API_BASE_URL + getTransUrl ).catch(this.errorHandling) ;
  }
  getfilteredTransactions(name:string,idNumber:string,phone:string, status : string ,sendCcy : string,dateGt:any, dateLt: any,transactionId : string ):Observable<any>{
    if(dateGt == "NaN-NaN-NaN"){
      dateGt = "" ;
    }
    if(dateLt == "NaN-NaN-NaN"){
      dateLt = "" ;
    }
    let getTransUrl : string = GlobalConstants.TRANSACTION_SEARCH + "custName="+name+"&"+"idNbr="+ idNumber +"&"+ "custPhone="+phone+"&status=" + status + "&sendCcy="+ sendCcy
    + "&dateGt=" + dateGt + "&dateLt=" + dateLt + "&transactionId=" + transactionId;
    // if(name == "" && idNumber == "" && phone == "" && status == "" && sendCcy == ""){
    //   getTransUrl = GlobalConstants.TRANSACTION_SEARCH + "status=" + "3,6,7,9";
    // }  ==> removed because its unnessaccary .
    return this.http.get<any>(GlobalConstants.API_BASE_URL + getTransUrl ).catch(this.errorHandling) ;
  }
  getApplyFilter(status:string,name:string,phone:string,fromDate:string,toDate:string){
    let subject = new AsyncSubject<any>();
    let filterTransUrl : string =  GlobalConstants.TRANSACTION_SEARCH +"status=" + status+"&"+ "name="+name+"&"+ "phoneNo="+phone+"&"+"dateGt="+fromDate+"&"+"dateLt="+toDate;
    this.http.get(GlobalConstants.API_BASE_URL + filterTransUrl ).pipe(map(res => {
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
//Management Reports 
//startDate & endDate format = "yyyy/mm/dd"
  getOnlineReports(reportType:string,startDate:any,endDate:any,customerType: string, reportName: string , categoryName : string):Observable<any[]>{
    this.reportUrl  =  GlobalConstants.MANAGEMENT_REPORTS + "reportType=" + reportType + "&startDate=" + startDate + "&endDate=" + endDate + "&custType=" + customerType
    + "&reportName=" + reportName +"&label=" + categoryName ;
    return this.http.get<any[]>(GlobalConstants.API_BASE_URL + this.reportUrl ).catch(this.errorHandling);
  }

  getManagementReportAsPdf(reportType:string,startDate:any,endDate:any,customerType: string, reportName: string, isPdf:boolean , isExcel: boolean, categoryType : string):Observable<any>{
    let reportUri  =  GlobalConstants.MANAGEMENT_REPORTS + "reportType=" + reportType + "&startDate=" + startDate + "&endDate=" + endDate + "&custType=" + customerType
    + "&reportName=" + reportName + "&isPDF=" + isPdf + "&isExcel=" + isExcel + "&label=" + categoryType;
    return this.http.get(GlobalConstants.API_BASE_URL + reportUri,{responseType:'arraybuffer'} ).catch(this.errorHandling);
  }

  getManagementReportsDrpdownValues():Observable<any[]>{
    let mgmtReportsUrl : string =  GlobalConstants.MANAGEMENT_REPORTS_VALUES;
    return this.http.get<any[]>(GlobalConstants.API_BASE_URL + mgmtReportsUrl ).catch(this.errorHandling) ;
  }

  getTransactionSearch(transactionId : any):Observable<any[]>{
    let transUrl : string =  GlobalConstants.TRANSACTION_SEARCH +"transactionId=" + transactionId;
    return this.http.get<any[]>(GlobalConstants.API_BASE_URL + transUrl ).catch(this.errorHandling);
  }

  generateQR(qrReq : GenerateQR): Observable<any> {
      return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.QR_REGENERATE.replace("{partner_id}",'dbs'), qrReq).catch(this.errorHandler)
    }


//Transaction Reports 
//startDate & endDate format = "yyyy/mm/dd"
getTransactionReports(customerName:string, idNbr:string, customerPhnNo:string, customerType:string, payeeName:string,
  payeePhoneNo:string, txnStatus:string, dateGt:string, dateLt:string,agentName:string,sendCcy:string,isPdf:boolean,authorisedStartDate:string,authorisedEndDate:string,paymentMode:string,suspicious:string ):Observable<any[]>{
  this.reportUrl  =  GlobalConstants.TRANSACTION_REPORTS + "custName=" + customerName + "&idNbr=" + idNbr + "&custPhone=" + customerPhnNo + 
                   "&status=" + txnStatus + "&custType=" + customerType + "&payeeName=" + payeeName + "&payeePhone=" + payeePhoneNo +
                   "&startDate=" + dateGt + "&endDate=" + dateLt + "&agentName=" + agentName + "&sendCcy=" + sendCcy + "&authorisedStartDate=" + authorisedStartDate + "&authorisedEndDate=" + authorisedEndDate + "&isPDF=" + isPdf +"&paymentMode=" + paymentMode + "&suspicious=" +suspicious;
  return this.http.get<any[]>(GlobalConstants.API_BASE_URL + this.reportUrl ).catch(this.errorHandling);
}

getTransactionReportAsPdf(customerName:string, idNbr:string, customerPhnNo:string, customerType:string, payeeName:string,
  payeePhoneNo:string, txnStatus:string, dateGt:string, dateLt:string,agentName:string,sendCcy:string,isPdf:boolean, authorisedStartDate:string,authorisedEndDate:string,isExcel:boolean,paymentMode:string,suspicious:string):Observable<any>{
    this.reportUrl  =  GlobalConstants.TRANSACTION_REPORTS + "custName=" + customerName + "&idNbr=" + idNbr + "&custPhone=" + customerPhnNo + 
    "&status=" + txnStatus + "&custType=" + customerType + "&payeeName=" + payeeName + "&payeePhone=" + payeePhoneNo +
    "&startDate=" + dateGt + "&endDate=" + dateLt + "&agentName=" + agentName + "&sendCcy=" + sendCcy + "&authorisedStartDate=" + authorisedStartDate + "&authorisedEndDate=" + authorisedEndDate + "&isPDF=" + isPdf +"&isExcel=" + isExcel + "&paymentMode=" + paymentMode + "&suspicious=" +suspicious;
return this.http.get(GlobalConstants.API_BASE_URL + this.reportUrl , {responseType:'arraybuffer'} ).catch(this.errorHandling);
}


 getSearchTransaction(transactionId : string):Observable<TransactionDeposit[]>{
  let searchUrl : string = GlobalConstants.TRANSACTION_SEARCH + "isDocReq=" + true + "&transactionId="+ transactionId;
  return this.http.get<TransactionDeposit[]>(GlobalConstants.API_BASE_URL + searchUrl).catch(this.errorHandling)
 } 
 getDepositedTransaction(transactionId: string , documentName : string , documentId : string):Observable<TransactionDocumentInquiry[]>{
  let depositedUrl = GlobalConstants.DEPOSITED_DOCUMENT_ENQUIRY + "transactionId=" + transactionId + "&documentName=" + documentName + "&documentId=" + documentId;
  return this.http.get<TransactionDocumentInquiry[]>(GlobalConstants.API_BASE_URL + depositedUrl).catch(this.errorHandling)
}

searchPayeeName(PayeeName : string,customerId : string):Observable<any[]>{
let searchPayeeUrl =  GlobalConstants.TRANSACTION_SEARCH +"customerId="+ customerId + "&payeeName=" + PayeeName;

return this.http.get<any>(GlobalConstants.API_BASE_URL +searchPayeeUrl).catch(this.errorHandler);

}

  cancelTransactionApi(transactionId : string): Observable<any> {
    return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.CANCEL_TRANSACTION_API.replace("{transactionId}",transactionId),{}).catch(this.errorHandler)
  }

  //get transaction ack api..
  getTransactionAckApi(transactionId : string):Observable<any[]>{
    let transactionAckUri =  GlobalConstants.GET_TRANSACTION_ACK_API.replace("{transactionId}",transactionId) ;
    return this.http.get<any>(GlobalConstants.API_BASE_URL +transactionAckUri).catch(this.errorHandler);
    
    }

    //This service called for update transaction status API which is triggered in backoffice (RT) unposted screen
    updateTransactionStatus(transactionStatusNo:string,requestBody:UpdateTransactionStatus):Observable<any[]>{
      //1. write the service . 
      //2. return type should be oberservable 
      return this.http.put<any>(GlobalConstants.API_BASE_URL + GlobalConstants.AGENT_FULFILLMENT.replace("{status}",transactionStatusNo),requestBody).catch(this.errorHandling);
    }

    //RT KYC Config - GET API
    searchKyc():Observable<any>{
      return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.RT_KYC_GET_API) 
       .catch(this.errorHandler) ;
  }
    //RT KYC Config - POST API
    addKyc(reqPayload: KycAdd): Observable<any> {
      return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.RT_KYC_ADD_API, reqPayload).catch(this.errorHandler)
  }
    //RT KYC Config - PUT API
    updateKyc(reqPayload: KycUpdate): Observable<any> {
      return this.http.put(GlobalConstants.API_BASE_URL + GlobalConstants.RT_KYC_UPDATE_API , reqPayload).catch(this.errorHandler)
  }
    //RT KYC Config - DELETE API (POST http Method)
    deleteKyc(id:string):Observable<any>{
      return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.RT_KYC_DELETE_API.replace("{id}", id) , {}) 
       .catch(this.errorHandler) ;
  }
  // RT Add Transaction Documents API
    addTransactionDocuments(reqPayload : AddTransactionScreeningDocument): Observable<any>{
      return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.RT_TRANSACTION_ADD_SCREENING_DOCUMENT_API , reqPayload).catch(this.errorHandler)
  }
}