import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApplicationUpdate } from '../../core/model/Appication Update/Application_Update';
import { GlobalConstants } from 'src/app/shared/global.constant';
//import { applicationUpdateSourceOfWealth } from '../models/SOW/applicationupdateSOW';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { ApplicationListings } from '../../core/model/Application Search/application-search';
import { ApplicationInquiry } from '../../core/model/ApplicationInquiry/Application-Inquiry';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/onboarding/modals/errordialog.component';



@Injectable({
  providedIn: 'root'
})
export class ProfileinfoService {


  handleError: any;
  application: ApplicationUpdate = new ApplicationUpdate();
  applicationInquiry: ApplicationInquiry = new ApplicationInquiry();
  applicationSearchUrl : any;
  id: any;
  status: any;
  constructor(private http: HttpClient, private store: InMemoryCache , private dialogRef: MatDialog) { }


  addApplicationUpdate(applicationUpdate: ApplicationUpdate): Observable<any> {
    console.log(applicationUpdate);
     return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.APP_UPD_API, applicationUpdate).catch(this.errorHandling)
  }

    //error handler function
    errorHandler(error:HttpErrorResponse){
      return Observable.throw(error.error.errorMessage || "server issue")
    }

    //error handling function is declared because we will not take the error message from response , we take only status code here (401)
    errorHandling(error:HttpErrorResponse){
      return Observable.throw(error || "server issue") ;
    }
    

  //This  API method for Basic-info , SOW , docs (Individual Onboarding)  

  getApplicationInquiry(applicationId: string): Observable<ApplicationInquiry> {
    console.log("appId from Rq " + applicationId);
   // let appId: string = this.store.getItem('APPLICATION_ID');
    console.log("appId from store " + applicationId);
    let appInqUrl: string = GlobalConstants.APP_INQ.replace("{applicationId}", applicationId);
    console.log("appInqUrl " + appInqUrl);
    return this.http.get<ApplicationInquiry>(GlobalConstants.API_BASE_URL + appInqUrl).catch(this.errorHandling) ;
  }


  /*"/v1/applications/search?status="NEW"*/ 
  getApplicationListings(status:any,type:any): Observable<ApplicationListings> {
    if(status != undefined && type != undefined){
       this.applicationSearchUrl = GlobalConstants.APP_SEARCH  + "status=" + status + "&"+ "applicationType=" + type;
    }
    else if(status == undefined && type !=undefined){
      this.applicationSearchUrl = GlobalConstants.APP_SEARCH + "status=" + "PENDING" + "&"+ "applicationType=" + type;
    }
    else if (status == undefined && type == undefined){
      this.applicationSearchUrl = GlobalConstants.APP_SEARCH ;
    }
      return this.http.get<ApplicationListings>(GlobalConstants.API_BASE_URL + this.applicationSearchUrl).catch(this.errorHandling);
    }

//service call after apply filter in application search
 filteredApplicationListings(name:string,phoneNo:string,type:any,status:any,emailId:string): Observable<ApplicationListings> {
  this.applicationSearchUrl = GlobalConstants.APP_SEARCH + "name="+ name+ "&phoneNo="+ phoneNo + "&applicationType=" + type + "&" + "status=" + status + "&emailId=" + emailId;
      return this.http.get<ApplicationListings>(GlobalConstants.API_BASE_URL + this.applicationSearchUrl).catch(this.errorHandling);
    }




}
