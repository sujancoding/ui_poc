import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GlobalConstants } from "src/app/shared/global.constant";
import { InMemoryCache } from "src/app/shared/services/cache.service";
import { AddStaff, UpdateStaff } from "../model/staffmaintenance/staff.model";

@Injectable({
    providedIn: 'root'
  })
  export class StaffMaintenanceService {
    
    constructor(private http : HttpClient,private store : InMemoryCache) { }
  

    //error handling function for handling 401 status code
    errorHandling(error:HttpErrorResponse){
      return Observable.throw(error || "server issue")
    }
///v1/staff?name={name}&id={id}
    getStaffApi(name : any): Observable<any[]> {
        return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.GET_STAFF_API + "name=" + name).catch(this.errorHandling);
    }

    addStaffApi(addStaff : AddStaff):Observable<any> {
        return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.ADD_STAFF_API,addStaff).catch(this.errorHandling);
    }

    staffInquiryApi(id : string): Observable<any[]> {
      return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.STAFF_INQUIRY_API.replace("{id}", id)).catch(this.errorHandling);
  }
  //staffId
  updateStaffApi(updateStaff : UpdateStaff,staffId : string):Observable<any> {
    return this.http.put(GlobalConstants.API_BASE_URL + GlobalConstants.UPDATE_STAFF_API.replace("{staffId}",staffId),updateStaff).catch(this.errorHandling);
}
}