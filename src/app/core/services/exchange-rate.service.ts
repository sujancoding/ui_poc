import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject , Observable, of} from 'rxjs';
import { GlobalConstants } from 'src/app/shared/global.constant';
import { DailyExchangeRateSetup, PostExchangeRateSetup } from 'src/app/backoffice/exchangerates/model/exchangerate.model';
import { catchError, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  constructor(private http: HttpClient,private dialogRef : MatDialog,private store: InMemoryCache) { }

  errorHandler(error : HttpErrorResponse){
   return Observable.throw(error || "") ;
  }

  updateExchangeRate(exchangeRate : PostExchangeRateSetup):Observable<any>{
   return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.EXCHANGE_RATE_API, exchangeRate).catch(this.errorHandler)
  }
  getExchangeRates(): Observable<DailyExchangeRateSetup[]>{
    return this.http.get<DailyExchangeRateSetup[]>(GlobalConstants.API_BASE_URL + GlobalConstants.EXCHANGE_RATE_API).catch(this.errorHandler)
  }
  
}
