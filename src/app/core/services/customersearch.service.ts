import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AsyncSubject, Observable, of } from "rxjs";
import { catchError, delay, map } from "rxjs/operators";
import { ErrorDialogAdminComponent } from "src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component";
import { GlobalConstants } from "src/app/shared/global.constant";
import { InMemoryCache } from "src/app/shared/services/cache.service";
import { CustomerInquiry, UpdateCustomerAccountsRq, UpdateCustomerDatas } from "../model/Customer Inquiry/customer-inquiry";
import { CustomerSearch, CustomerStatusUpdate } from "../model/customersearch/customersearch";

@Injectable({
    providedIn: 'root'
  })
  
  export class CustomerSearchService {


    customerSearchUrl: any;
    constructor(private http : HttpClient,private store:InMemoryCache,private dialogRef : MatDialog){}

      //1. error handler function
      errorHandler(error:HttpErrorResponse){
        return Observable.throw(error.error.errorMessage || "server issue")
      }
       // 2. error handler function
       errorHandling(error:HttpErrorResponse){
        return Observable.throw(error || "server issue")
      }
    getCustomerSearch(type:any,value:any,customerName:string,aliasName:string): Observable<CustomerSearch> {
        this.customerSearchUrl = GlobalConstants.CUSTOMER_SEARCH_API + "customerType=" +type + "&" + "status=" + value + "&name=" + customerName + "&aliasName=" + aliasName;
        return this.http.get<CustomerSearch>(GlobalConstants.API_BASE_URL + this.customerSearchUrl).catch(this.errorHandling) ;
      }
      filteredCustomerSearch(name:string,phoneNumber:string,idNumber:string,type:any,status:any,dateGt : any, dateLt: any,aliasName:string,account:string, emailId:string, riskRating : string): Observable<CustomerSearch> {
        if(dateGt == "NaN-NaN-NaN"){
          dateGt = "" ;
        }
        if(dateLt == "NaN-NaN-NaN"){
          dateLt = "" ;
        }
          this.customerSearchUrl = GlobalConstants.CUSTOMER_SEARCH_API + "name="+ name+ "&phoneNo="+ phoneNumber +
          "&idNbr=" + idNumber + "&customerType=" + type + "&" + "status=" + status + "&dateGt=" + dateGt
          + "&dateLt=" + dateLt + "&aliasName=" + aliasName + "&accountType=" + account + "&emailId=" + emailId + "&riskRating=" + riskRating ;
          return this.http.get<CustomerSearch>(GlobalConstants.API_BASE_URL + this.customerSearchUrl).catch(this.errorHandling);
        }



      getCustomerInquiry(customerId:any): Observable<CustomerInquiry> {
        let customerInqUrl: string = GlobalConstants.CUSTOMER_INQUIRY_API.replace("{customerId}", customerId);
        return this.http.get<CustomerInquiry>(GlobalConstants.API_BASE_URL + customerInqUrl).catch(this.errorHandling) ;
      }

      //added on 19 June 2023 , for handling errors - i opened this function
      retrieveCustomerInquiry(customerId:any): Observable<CustomerInquiry> {
        let customerInqUrl: string = GlobalConstants.CUSTOMER_INQUIRY_API.replace("{customerId}", customerId);
        return this.http.get<CustomerInquiry>(GlobalConstants.API_BASE_URL + customerInqUrl).catch(this.errorHandler);

      }
     
      customerStatusUpdate(customerId:any,status:any,customerStatusReqPayload: CustomerStatusUpdate): Observable<CustomerInquiry> {
        let customerStatusUrl: string = GlobalConstants.CUSTOMER_STATUS_UPDATE_API.replace("{customer_id}",customerId).replace("{action}",status);
        let subject = new AsyncSubject<any>();
        this.http.patch(GlobalConstants.API_BASE_URL + customerStatusUrl ,customerStatusReqPayload).pipe(map(res => {
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

      //mock server testing -> customer search
      getCustomerSearchMock(): Observable<CustomerSearch> {
      return this.http.get<CustomerSearch>("https://localhost:3000" + "/customer-search")
         
    }
    corporateCustomerInquiryMock(): Observable<CustomerInquiry>{
      return this.http.get<CustomerInquiry>("https://localhost:3000" + "/corporate-customer-inquiry")
    }

    //customer search server side pagination .
    customerSearchServerPagination(type:any,value:any,startValue:any, limit : any): Observable<CustomerSearch> {
      this.customerSearchUrl = GlobalConstants.CUSTOMER_SEARCH_API + "customerType=" +type + "&" + "status=" + value + "&startValue=" + startValue + "&limit=" + limit;
      return this.http.get<CustomerSearch>(GlobalConstants.API_BASE_URL + this.customerSearchUrl).catch(this.errorHandling) ;
    }

    //customer update API - consumer 
    updateCustomer(customerId:string , updateCustomerReqPayload : UpdateCustomerDatas): Observable<any> {
    return this.http.put(GlobalConstants.API_BASE_URL + GlobalConstants.CUSTOMER_INQUIRY_API.replace("{customerId}",customerId), updateCustomerReqPayload).catch(this.errorHandling)
}

//customer accounts inquiry service .
getCustomerAccountsInquiry(customerId : string): Observable<any> {
  return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.CUSTOMER_ACCOUNTS_INQUIRY_API.replace("{customerId}", customerId)).catch(this.errorHandling) ;
}

  //customer accounts update API - consumer 
  updateCustomerAccounts(updateCustomerAcReqPayload : UpdateCustomerAccountsRq): Observable<any> {
    return this.http.put(GlobalConstants.API_BASE_URL + GlobalConstants.CUSTOMER_ACCOUNTS_UPDATE_API, updateCustomerAcReqPayload).catch(this.errorHandling)
}


getCustomerMasterReport(name:string,phoneNumber:string,idNumber:string,type:any,status:any,dateGt : any, dateLt: any,aliasName:string,account:string, emailId: string,isPDF:boolean,isExcel: boolean,riskRating:string):Observable<any>{
  let reportUri = GlobalConstants.CUSTOMER_LIST_REPORT_API +  "&isPDF=" + isPDF + "&name="+ name+ "&phoneNo="+ phoneNumber +
          "&idNbr=" + idNumber + "&customerType=" + type + "&" + "status=" + status + "&dateGt=" + dateGt
          + "&dateLt=" + dateLt + "&aliasName=" + aliasName + "&accountType=" + account + "&emailId=" + emailId + "&isExcel=" + isExcel + "&riskRating=" + riskRating;
  return this.http.get(GlobalConstants.API_BASE_URL + reportUri,{responseType:'arraybuffer'}).catch(this.errorHandler)
}

getBizProfileReportAsPdf(customerId:string,customerType:string,reportName:string,isPdf:boolean):Observable<any>{
  let reportUri = GlobalConstants.BIZ_PROFILE_REPORT_API +  "isPDF=" + isPdf + "&customerId=" + customerId + 
  "&reportName=" + reportName + "&customerType=" + customerType;
  return this.http.get(GlobalConstants.API_BASE_URL + reportUri,{responseType:'arraybuffer'}).catch(this.errorHandler)
}
    
  }