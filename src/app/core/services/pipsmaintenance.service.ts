import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { GlobalConstants } from "src/app/shared/global.constant";
import { UpdatePips } from "../model/pipsmaintenance/pipsmaintenance.model";

@Injectable({
    providedIn: 'root'
  })
  
export class PipsMaintenanceService{
    
    constructor(private http : HttpClient){}
    
    errorHandler(error : HttpErrorResponse){
        return Observable.throw(error || "") ;
       }
       
    getPips():Observable<any>{
        return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.PIPS_API).catch(this.errorHandler)
        
    }
    updatePips(updatePips: UpdatePips): Observable<any> {
        return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.PIPS_API, updatePips).catch(this.errorHandler)
     }
}