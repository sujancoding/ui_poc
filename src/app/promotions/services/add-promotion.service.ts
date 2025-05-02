import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/shared/global.constant';
import { PromotionMaintenance } from '../models/PromotionsModel';

@Injectable({
  providedIn: 'root'
})
export class AddPromotionService {

  constructor(private http : HttpClient) { }

  addPromotion(promotionMaintenance : PromotionMaintenance): AsyncSubject<any> {
    let subject = new AsyncSubject<any>();
    promotionMaintenance['id'] = Math.random();
    console.log(promotionMaintenance);
    let headers = new HttpHeaders();
    headers.set("contentType", "application/json");
    this.http.post(GlobalConstants.API_BASE_URL +"/Promotions"/*GlobalConstants.APP_UPD_API*/, promotionMaintenance).pipe(map(res => {
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

  getPromotions(): Observable<PromotionMaintenance[]>{
    let subject = new AsyncSubject<any>();
    let headers = new HttpHeaders();
    headers.set("contentType", "application/json");
    this.http.get(GlobalConstants.API_BASE_URL + "/Promotions"/*GlobalConstants.APP_UPD_API*/).pipe(map(res => {
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

  deleteProduct(id:number){
    return this.http.delete<any>("http://localhost:3000/Promotions/"+id)
  }
}
