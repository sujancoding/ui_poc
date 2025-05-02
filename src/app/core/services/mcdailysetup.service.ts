import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { InMemoryCache } from "src/app/shared/services/cache.service";
import { MoneyChangerUpsertRate, NoteUpdateRq } from "../model/mcdailysetup/dailysetup.model";
import { GlobalConstants } from "src/app/shared/global.constant";

@Injectable({
    providedIn: 'root'
  })
  export class MoneyChangerDailySetupService {
  
    constructor(private http: HttpClient,private dialogRef : MatDialog,private store: InMemoryCache) { }
  
    errorHandler(error : HttpErrorResponse){
     return Observable.throw(error || "") ;
    }
  
    updateExchangeRate(exchangeRate : MoneyChangerUpsertRate):Observable<any>{
     return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_EXCHANGERATE, exchangeRate).catch(this.errorHandler)
    }
    //req params : ccyCode , units
    getExchangeRates(ccyCode : string, units : string, displayRate : boolean): Observable<any[]>{
      let reqParams = "" ;
      if(displayRate == true && ccyCode == "" && units == ""){ // No need to send displayRate , ccyCode and units in query params ..
        reqParams = "" ;
      }
      else{
        reqParams = `ccyCode=${ccyCode}` + `&units=${units}` + `&displayRate=${displayRate}`;
      }
      return this.http.get<any[]>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_EXCHANGERATE + reqParams).catch(this.errorHandler)
    }
    getNotes(): Observable<any[]>{
      return this.http.get<any[]>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_NOTES_API).catch(this.errorHandler)
    }
    updateNotes(noteReq : NoteUpdateRq):Observable<any>{
      return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.MC_NOTES_API, noteReq).catch(this.errorHandler)
     }
    
  }