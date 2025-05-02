import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/shared/global.constant';
import { AddDeal } from 'src/app/backoffice/dailysetup/model/deal';


@Injectable({
  providedIn: 'root'
})
export class NewDealService {

  constructor(private http : HttpClient) { }

  AddDeal(deal : AddDeal):AsyncSubject<any>{
    let subject = new AsyncSubject<any>();
    console.log(deal);
    this.http.post(GlobalConstants.API_BASE_URL + "/deal", deal).pipe(map(res => {
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

  getNewDeal(): Observable<AddDeal>{
    let subject = new AsyncSubject<any>();
    let headers = new HttpHeaders();
    headers.set("contentType", "application/json");
    this.http.get(GlobalConstants.API_BASE_URL + "/deal"/*GlobalConstants.APP_UPD_API*/).pipe(map(res => {
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
  
}


