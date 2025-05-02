import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionTimerService } from '../services/session-timer.service';
import { GlobalConstants } from '../../global.constant';

@Injectable()
export class SessionTimerHttpInterceptor implements HttpInterceptor {
  constructor(private readonly timerService: SessionTimerService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Reason for adding this condition:
    // 1. Idle time for consumer, corporate, and agent users is 15 minutes, whereas idle time for backoffice users is 45 minutes.
    // 2. The refresh token polling interval is 9 minutes for consumers and 19 minutes for others.
    // 3. User inactivity time was sometimes longer than the refresh token polling interval. As a result, the idle timer would reset when any API or service call was made.
    // 4. To prevent the resetTimer function from being triggered by the refresh token polling API, this condition was added.
    if(!request.url.includes(GlobalConstants.REFRESH_JWT_TOKEN_API)){ //if URI matched with refresh token API URI , don't trigger resetTimer function.
    this.timerService.resetTimer();
    }
    return next.handle(request);
  }
}
