import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GlobalConstants } from "src/app/shared/global.constant";
import { KycAdd, KycUpdate } from "../model/mckyc-config/kyc-config.model";


@Injectable({
    providedIn: 'root'
  })
  export class MoneyChangerReportsService {
  
    constructor(private http : HttpClient) { }

    errorHandler(httpErrorResponse : HttpErrorResponse){
      return Observable.throw(httpErrorResponse || "server issue") 
    }

  // get mc management reports as normal JSON data
    getManagementReportsAsData(reportType:string,startDate:any,endDate:any,customerType: string, reportName: string, isPdf:boolean, ccyNo:string, count:string,
      businessType:string, customerSegmentType: string
    ):Observable<any>{
      let reportUri = "" ;
      if(reportType == '9' || reportType == '5'){ //for report such as Deal Txn and Location wise stock --> need to send counterType
        reportUri  =  GlobalConstants.MC_MANAGEMENT_REPORT_API + "reportType=" + reportType + "&startDate=" + startDate + "&endDate=" + endDate 
        + "&reportName=" + reportName + "&isPDF=" + isPdf  ;
      }
      else if(reportType == '10' ){   // for report such as Location wise currency , need to send both counterType and ccyNo in req params
        reportUri  =  GlobalConstants.MC_MANAGEMENT_REPORT_API + "reportType=" + reportType + "&startDate=" + startDate + "&endDate=" + endDate 
        + "&reportName=" + reportName + "&isPDF=" + isPdf  + "&ccyNo=" + ccyNo   ;
      }
      else if(reportType == '1' || reportType == '13' || reportType == '16'){ //for report such as 'Top Customer' or 'Top currency purchase' or 'Top currency sold' --> we need to send limit parameter in service call .
        reportUri  =  GlobalConstants.MC_MANAGEMENT_REPORT_API + "reportType=" + reportType + "&startDate=" + startDate + "&endDate=" + endDate 
        + "&reportName=" + reportName + "&isPDF=" + isPdf + "&limit=" + count  ;
      }
      else if(reportType == '11'){ //for report such as 'statement of transaction' 
        reportUri  =  GlobalConstants.MC_MANAGEMENT_REPORT_API + "reportType=" + reportType + "&startDate=" + startDate + "&endDate=" + endDate 
        + "&reportName=" + reportName + "&isPDF=" + isPdf + "&businessType=" + businessType  ;
      }
      else if(reportType == '14'){ //for report such as 'kyc' 
        reportUri  =  GlobalConstants.MC_MANAGEMENT_REPORT_API + "reportType=" + reportType + "&startDate=" + startDate + "&endDate=" + endDate 
        + "&reportName=" + reportName + "&isPDF=" + isPdf + "&custType=" + customerType + "&label=" + customerSegmentType  ;
      }
      else{  // else no need to send counterType and ccyNo in req params .
         reportUri  =  GlobalConstants.MC_MANAGEMENT_REPORT_API + "reportType=" + reportType + "&startDate=" + startDate + "&endDate=" + endDate
        + "&reportName=" + reportName + "&isPDF=" + isPdf ;
      }
        return this.http.get<any>(GlobalConstants.API_BASE_URL + reportUri ) 
         .catch(this.errorHandler) ;
    }

    //get mc management reports as PDF
    getManagementReportsAsPdf(reportType:string,startDate:any,endDate:any,customerType: string, reportName: string, isPdf:boolean, ccyNo:string,count:string,
      businessType:string, customerSegmentType: string, isExcel :boolean
    ):Observable<any>{
      let reportUri = "" ;
      if(reportType == '9' || reportType == '5'){ //for report such as Deal Txn and Location wise stock --> need to send counterType
        reportUri  =  GlobalConstants.MC_MANAGEMENT_REPORT_API + "reportType=" + reportType + "&startDate=" + startDate + "&endDate=" + endDate + "&custType=" + customerType
        + "&reportName=" + reportName + "&isPDF=" + isPdf + "&isExcel=" +isExcel  ;
      }
      else if(reportType == '10' ){   // for report such as Location wise currency , need to send both counterType and ccyNo in req params
        reportUri  =  GlobalConstants.MC_MANAGEMENT_REPORT_API + "reportType=" + reportType + "&startDate=" + startDate + "&endDate=" + endDate 
        + "&reportName=" + reportName + "&isPDF=" + isPdf  + "&ccyNo=" + ccyNo + "&isExcel=" +isExcel;
      }
      else if(reportType == '1' || reportType == '13' || reportType == '16' ){ //for report such as 'Top Customer' or 'Top currency purcahse' or 'Top currency sold' --> we need to send limit parameter in service call .
        reportUri  =  GlobalConstants.MC_MANAGEMENT_REPORT_API + "reportType=" + reportType + "&startDate=" + startDate + "&endDate=" + endDate 
        + "&reportName=" + reportName + "&isPDF=" + isPdf + "&limit=" + count  + "&isExcel=" +isExcel;
      }
      else if(reportType == '11'){ //for report such as 'statement of transaction' 
        reportUri  =  GlobalConstants.MC_MANAGEMENT_REPORT_API + "reportType=" + reportType + "&startDate=" + startDate + "&endDate=" + endDate
        + "&reportName=" + reportName + "&isPDF=" + isPdf + "&businessType=" + businessType  + "&isExcel=" +isExcel;
      }
      else if(reportType == '14'){ //for report such as 'kyc' 
        reportUri  =  GlobalConstants.MC_MANAGEMENT_REPORT_API + "reportType=" + reportType + "&startDate=" + startDate + "&endDate=" + endDate 
        + "&reportName=" + reportName + "&isPDF=" + isPdf + "&custType=" + customerType + "&label=" + customerSegmentType + "&isExcel=" +isExcel;
      }
      else{  // else no need to send counterType and ccyNo in req params .
         reportUri  =  GlobalConstants.MC_MANAGEMENT_REPORT_API + "reportType=" + reportType + "&startDate=" + startDate + "&endDate=" + endDate + "&custType=" + customerType
        + "&reportName=" + reportName + "&isPDF=" + isPdf + "&isExcel=" +isExcel;
      }
        return this.http.get(GlobalConstants.API_BASE_URL + reportUri,{responseType:'arraybuffer'}).catch(this.errorHandler)
      }

        // get mc transaction reports as normal JSON data
        //supportive req params : currencyCode, customerId, customerName, buySellInd,dateGt, dateLt, transactionStatus, counterType, suspicious
    getTransactionReportsAsData(currencyCode: string, customerId:string, customerName:string, buySellInd:string,dateGt:string, dateLt: string, transactionStatus: string, isSupicious:string):Observable<any>{
        return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_TRANSACTION_REPORT_API  + "ccyCode=" + currencyCode +
          "&customerId=" + customerId + "&customerName=" + customerName + "&buySellInd=" + buySellInd + 
            "&dateGt=" + dateGt + "&dateLt=" + dateLt + "&status=" + transactionStatus + "&suspicious=" + isSupicious

         ) 
         .catch(this.errorHandler) ;
    }

    //get mc transaction reports as PDF
    //ccyCode=&customerId=&customerName=&buySellInd=&dateGt=202-09-26&dateLt=2024-10-26&status=1&isPDF=true&counterTypeInd=W&suspicious=Y

    getTransactionReportsAsPDF(currencyCode: string, customerId: string, customerName: string, buySellInd: string, dateGt: string, dateLt: string, transactionStatus: string, isPdf : boolean, isSupicious:string , isExcel:boolean):Observable<any>{
        let reportUri = GlobalConstants.MC_TRANSACTION_REPORT_API + "ccyCode=" + currencyCode +
        "&customerId=" + customerId + "&customerName=" + customerName + "&buySellInd=" + buySellInd + 
          "&dateGt=" + dateGt + "&dateLt=" + dateLt + "&status=" + transactionStatus + "&isPDF=" + isPdf + "&suspicious=" + isSupicious + "&isExcel=" + isExcel
        return this.http.get(GlobalConstants.API_BASE_URL + reportUri,{responseType:'arraybuffer'}).catch(this.errorHandler)
      }

      getManagementReportList():Observable<any>{
        return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_REPORT_LIST_API) 
         .catch(this.errorHandler) ;
    }


    //Add KYC API 
        addKyc(reqPayload: KycAdd): Observable<any> {
          return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.MC_KYC_ADD_API, reqPayload).catch(this.errorHandler)
      }
    
      //Update KYC API 
      updateKyc(reqPayload: KycUpdate): Observable<any> {
        return this.http.put(GlobalConstants.API_BASE_URL + GlobalConstants.MC_KYC_UPDATE_API , reqPayload).catch(this.errorHandler)
    }

    // Get KYC API
    searchKyc():Observable<any>{
      return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_KYC_GET_API) 
       .catch(this.errorHandler) ;
  }

   // Delete KYC API
   deleteKyc(id:string):Observable<any>{
    return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_KYC_DELETE_API.replace("{id}", id) , {}) 
     .catch(this.errorHandler) ;
}
  

  }