import { Injectable } from "@angular/core";
import { AsyncSubject, observable, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import 'rxjs/add/observable/throw';
import "rxjs/add/operator/catch";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { InMemoryCache } from "src/app/shared/services/cache.service";
import { MatDialog } from "@angular/material/dialog";
import { GlobalConstants } from "src/app/shared/global.constant";
import { CommissionReq } from "src/app/backoffice/dailysetup/model/commission.model";

@Injectable({
    providedIn: 'root'
  })


export class CommissionService {

    
    constructor(private http : HttpClient,private store : InMemoryCache,private dialogRef : MatDialog) { }


    //error handler function
    errorHandler(error:HttpErrorResponse){
      return Observable.throw(error.error.errorMessage || "server issue")
    }

     //error handling function for to handle 401 status code
     errorHandling(error:HttpErrorResponse){
      return Observable.throw(error || "server issue")
    }

   //backoffice >> update commission 
    updateCommission(commissionReq: CommissionReq): Observable<any> {
        return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.COMMISSION_MAINTANANCE_API, commissionReq).catch(this.errorHandling)
    }

    //backoffice >> get commission
  getCommission():Observable<any[]>{
    let commissionUrl  =  GlobalConstants.COMMISSION_MAINTANANCE_API ;
    return this.http.get<any[]>(GlobalConstants.API_BASE_URL + commissionUrl ).catch(this.errorHandling);
  }
    
  }  