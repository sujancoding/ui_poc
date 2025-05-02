import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/shared/global.constant';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { Dashboard } from '../model/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class BranchUserService {

  constructor(private http : HttpClient,private store: InMemoryCache) { }

  errorHandler(error:HttpErrorResponse){
    console.log("error handler =" + error) ;
    return Observable.throw(error || "");
  }
  
  
  getApplicationWidget(): Observable<Dashboard[]> {
    return this.http.get<Dashboard[]>(GlobalConstants.API_BASE_URL + GlobalConstants.BRANCH_DASHBOARD).catch(this.errorHandler);
  }

}
