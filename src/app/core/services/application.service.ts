// 1. Create a Application Service
// 2. Have a global object with type of Status.
// 3. Once User Logged in - Greb the applicationSteps from AppInquiry Service and update to  global Object
// 4. By updation of each step, Based on response code, Update the status
// 5. Application service should have feature to update entire status & step wise
// 6. Service status should have feasibility to provide the status to UI globally
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/shared/global.constant';
import * as _ from 'lodash'
import { ApplicationSteps, CorporateApplicationSteps } from '../model/ApplicationFlagSteps';
import { ApplicationFulFillment } from '../model/ApplicationFulFillment';
import { SubmitApplication } from '../model/SubmitApplication';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/onboarding/modals/errordialog.component';



@Injectable({
  providedIn: 'root'
})

export class ApplicationService {

  constructor(private http: HttpClient,private store: InMemoryCache , private dialogRef : MatDialog) { }
  private AppStatus!: ApplicationSteps 

  errorHandler(httpErrorResponse : HttpErrorResponse){
    return Observable.throw(httpErrorResponse.error.errorMessage || "server issue") 
  }
//errorhandling function only to handle for 401 status code
  errorHandling(error : HttpErrorResponse){
    return Observable.throw(error || "server issue") 
  }
  
  updateScreenstatus(key: string) {
    if (key == 'sourceOfIncomeFlag'){
      let myObj = JSON.parse(this.store.getItem('APPLICATION_STEPS'));
      myObj.sourceOfIncomeFlag = "Y";
      this.store.setItem('APPLICATION_STEPS', JSON.stringify(myObj));

    }else if (key == 'basicProfileFlag') {
      let myObj = JSON.parse(this.store.getItem('APPLICATION_STEPS'));
      myObj.basicProfileFlag = "Y";
      this.store.setItem('APPLICATION_STEPS', JSON.stringify(myObj));

    }else {
      let myObj = JSON.parse(this.store.getItem('APPLICATION_STEPS'));
      myObj.documentsFlag = "Y";
      this.store.setItem('APPLICATION_STEPS', JSON.stringify(myObj));
    }
  }
  
  applicationFulFilment(appfulfillment: ApplicationFulFillment): Observable<any> {
    return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.APP_FULFILMENT, appfulfillment).catch(this.errorHandling)
  } 
  corporateApplicationFulFilment(appfulfillment: ApplicationFulFillment): AsyncSubject<any> {
    let subject = new AsyncSubject<any>();
    this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.CORPORATE_APPLICATION_FULFILLMENT, appfulfillment).pipe(map(res => {
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
  
  submitApplication(submitApplication:SubmitApplication): Observable<any> {
    return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.APP_SUBMIT_API, submitApplication).catch(this.errorHandling);
  }
//error handling done in component
  corporateSubmitApplication(submitApplication:SubmitApplication): Observable<any> {
    return this.http.post(GlobalConstants.API_BASE_URL + GlobalConstants.CORPORATE_SUBMIT_APPLICATION, submitApplication).catch(this.errorHandler) ;
    
  }

  corporateScreenstatus(key: string) {
    if (key == 'associatesFlag'){
      let myObj = JSON.parse(this.store.getItem('APPLICATION_STEPS'));
      myObj.associatesFlag = "Y";
      this.store.setItem('APPLICATION_STEPS', JSON.stringify(myObj));

    }else if (key == 'companyProfileFlag') {
      let myObj = JSON.parse(this.store.getItem('APPLICATION_STEPS'));
      myObj.companyProfileFlag = "Y";
      this.store.setItem('APPLICATION_STEPS', JSON.stringify(myObj));

    }else {
      let myObj = JSON.parse(this.store.getItem('APPLICATION_STEPS'));
      myObj.documentsFlag = "Y";
      this.store.setItem('APPLICATION_STEPS', JSON.stringify(myObj));
    }
  }
 
}