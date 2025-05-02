import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/shared/global.constant';
import { AddRole, UpdateRole } from '../model/rolemaintenance/role.model';




@Injectable({
  providedIn: 'root'
})
export class RoleMaintenanceService {


    constructor(private http: HttpClient) {

    }
    //error handling function is declared because we will not take the error message from response , we take only status code here (401)
    errorHandling(error: HttpErrorResponse) {
        return Observable.throw(error || "server issue");
    }


    /*/v1/roles*/
    getRoleSearch(): Observable<any[]> {
        return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.SEARCH_ROLE_API).catch(this.errorHandling);
    }


     /*/v1/role/accesslist*/
     getAccessControlList(): Observable<any[]> {
        return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.GET_ACCESSCONTROLLIST_API).catch(this.errorHandling);
    }

    addRole(addRole: AddRole): Observable<any> {
         return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.ADD_ROLE_API, addRole).catch(this.errorHandling)
      }

     /* "/v1/role/{roleId}/accesslist" */
     getRoleSearchWithAccessControl(roleId : string): Observable<any[]> {
        return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.SEARCH_ROLE_WITH_ACCESSCONTROL_API.replace("{roleId}",roleId)).catch(this.errorHandling);
    }

    updateRole(updateRole: UpdateRole,roleId:string): Observable<any> {
        return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.UPSERT_ROLE_API.replace("{roleId}",roleId), updateRole).catch(this.errorHandling)
     }

}