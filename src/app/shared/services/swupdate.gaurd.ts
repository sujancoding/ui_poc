import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SwUpdateService } from './swlog.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SwUpdateGuard implements CanActivate {
  constructor(
    private swUpdateService: SwUpdateService,
    private router: Router
  ) {}

  //updates are checked before activating a specific route

  canActivate(): Observable<boolean> {
    return this.swUpdateService.checkForUpdates().pipe(
      tap(checked => {
        if (!checked) {
          this.router.navigate(['/']);
        }
      })
    );
  }
}