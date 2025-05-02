import { Injectable, Inject } from '@angular/core';
import { Observable, Subject, interval, Subscription } from 'rxjs';
import {
  ConfigToken,
  SessionExpirationConfig
} from '../models/session-expiration-config';
import { InMemoryCache } from '../../services/cache.service';

@Injectable()
export class SessionTimerService {
  private  _timeoutSeconds!: number;
  private _count: number = 0;
  private timerSubscription!: Subscription;
  private timer: Observable<number> = interval(1000);
  private _remainSeconds = new Subject<number>();
  /**
   * Observable to get session remaining time (in seconds).
   *
   * Subscribers need to unsubscribe to it before hosting element is destroyed.
   *
   * @memberof SessionTimerService
   */
  remainSeconds$ = this._remainSeconds.asObservable();
  userType = "";

  constructor(@Inject(ConfigToken) readonly config: SessionExpirationConfig, private store : InMemoryCache) {
   
  }

  findCustomerType():string{
    this.userType = this.store.getItem('CUSTOMER_TYPE') ? this.store.getItem('CUSTOMER_TYPE') : "" ;
    return this.userType ;
  }

  startTimer() {
    this.stopTimer();

    let customerType = this.findCustomerType() ;
    if(customerType == "I" || customerType == "C" || customerType == "A"){
      this._timeoutSeconds = 900; //900 seconds = 15 mins .. 
    }
    else { //Backoffice
    this._timeoutSeconds = 2700 ; //2700 seconds = 45 mins .. 
    }


    this._count = this._timeoutSeconds;
    this.timerSubscription = this.timer.subscribe(n => {
      if (this._count > 0) {
        this._count--;
        this._remainSeconds.next(this._count);
      }
    });
  }

 

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  resetTimer() {
    this.startTimer();
  }
}
