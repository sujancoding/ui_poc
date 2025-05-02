import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as Rx from "rxjs/Rx";
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/shared/global.constant';
import { RegisterUserRs } from '../models/registerrs.model';
import { ConsumerRegisterInitiateRq, RegisterUserRq } from '../models/registerrq.model';
import { RegisterCorporateRq } from '../models/corporateregister.model';
import { InMemoryCache } from 'src/app/shared/services/cache.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private httpClient: HttpClient, private store : InMemoryCache) { }

  errorHandler(httpResponse : HttpErrorResponse){
    return Observable.throw(httpResponse.error.errorMessage || "server issue")
  }
  registerIndividual(resisterRq: RegisterUserRq): Observable<any> {
    console.log(": register individual")
    return this.httpClient.post<RegisterUserRs>(GlobalConstants.API_BASE_URL + GlobalConstants.REG_API, resisterRq).catch(this.errorHandler)
  }

  registerCorporate(resisterCorporateRq: RegisterCorporateRq): Observable<any> {
    console.log(": register corporate")
    return this.httpClient.post<RegisterUserRq>(GlobalConstants.API_BASE_URL + GlobalConstants.REG_COR_API, resisterCorporateRq).catch(this.errorHandler)
  }

  //Customer Registration > Consumer > Initiate API .
  registerIndividualInitiate(registerRq: ConsumerRegisterInitiateRq): Observable<any> {
    console.log(": register individual initiate")
    return this.httpClient.post<ConsumerRegisterInitiateRq>(GlobalConstants.API_BASE_URL + GlobalConstants.CUSTOMER_REGISTER_CONSUMER_INITIATE_API, registerRq).catch(this.errorHandler)
  }

}





