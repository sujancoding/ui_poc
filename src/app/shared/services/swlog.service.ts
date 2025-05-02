import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subject, from } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SwUpdateService {
  private updateChecked = new Subject<boolean>();
  private readonly CHECK_INTERVAL = 1800 * 1000; // 30 minutes
  private isCheckingUpdates = new BehaviorSubject<boolean>(false);// Update checking state
  
  constructor(
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar
  ) {
    this.initializeUpdateChecking();
  }
  get isChecking$(): Observable<boolean> {
    return this.isCheckingUpdates.asObservable();
  }

   initializeUpdateChecking() {
    console.log("started checking")
    if (!this.swUpdate.isEnabled) {
      this.updateChecked.next(true);
      return;
    }

    this.swUpdate.versionUpdates.subscribe(async (event) => {
      if (event.type === 'VERSION_READY') {
        console.log("Update available!");
        const { version } = event.latestVersion.appData as { version: string };
        await this.promptUserToUpdate(version);
      }
    });

    // Set up periodic checks
    setInterval(() => {
      this.swUpdate.checkForUpdate();
    }, this.CHECK_INTERVAL);
  }

  private async promptUserToUpdate(version: string): Promise<void> {
    console.log("prompt user")
    // const config = new MatSnackBarConfig();
    // config.panelClass = ['blue-snackbar'];
    // config.verticalPosition = 'top';
    // config.horizontalPosition = 'center';
    // config.duration = 6000;

    // const snackBarRef = this.snackBar.open(
    //   `App Updated to Version ${version} `,
    //   '',
    //   config
    // );

    try {
      // const userAction = await Promise.race([
      //   snackBarRef.onAction().pipe(take(1)).toPromise(),
      //   snackBarRef.afterDismissed().pipe(take(1)).toPromise()
      // ]);

      await this.swUpdate.activateUpdate();
      document.location.reload();
    } catch (error) {
      console.log('Error during update:', error);
      this.updateChecked.next(true); // Allow app to proceed even if update fails
    }
  }

  public checkForUpdates(): Observable<boolean> {
    if (!this.swUpdate.isEnabled) {
      return from(Promise.resolve(true));
    }

    this.isCheckingUpdates.next(true); // Notify UI that update check is in progress
    this.swUpdate.checkForUpdate().then(
      () => {
        this.updateChecked.next(true);
        this.isCheckingUpdates.next(false); // Update check completed
      },
      (error) => {
        console.log('Error checking for updates:', error);
        this.updateChecked.next(true);
        this.isCheckingUpdates.next(false); // Update check completed
      }
    );

    return this.updateChecked.asObservable();
  }
}