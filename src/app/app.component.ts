import { Component,  NgZone } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { URLHelperService } from './shared/services/URLHelper.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import ngswFile from 'ngsw-config.json' ;
import { SwUpdateService } from './shared/services/swlog.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  private readonly EVERY_30MIN= 1800 * 1000;
  myApp : any ;
  deviceType !: string ;
  appVersion !: string ;
  logo = 'assets/images/logo1.jpg';
  showCheckingMessage = false; // Controls when the message is displayed
  private isCheckingSubscription!: Subscription;
  private delayTimer!: Subscription;
  private readonly SHOW_DELAY = 2000; // Delay time in milliseconds (e.g., 2 seconds)

  constructor(public swUpdate: SwUpdate, private zone: NgZone,private snackBar: MatSnackBar, 
    private swUpdateService : SwUpdateService
  ) {
    URLHelperService.getAPIBaseURL();
  }
   
  ngOnInit(): void {
    console.log("ngOnit - SW")
    // running the interval outside of Zone.js allows the app to eventually get stable:
     this.zone.runOutsideAngular(() => {
    //   //call immediately 
    console.log("ngOnit - SW Update checking ")
       this.swUpdateService.initializeUpdateChecking() ;
    //   console.log("ngOnit - SW Update checking ")
    //   setInterval(() => {
    //     this.swUpdate.checkForUpdate()
    //   }, this.EVERY_30MIN)
    // })
    // // subscribe for app updates available
    // this.swUpdate.available.subscribe(async update => {
    //   console.log("update avaiable.. ")
    //   const { version, changelog } = update.available.appData as {
    //     [key: string]: string
    //   }
    //   let activatedSW = false;
    //   const config = new MatSnackBarConfig();
    //   config.panelClass = ['red-snackbar'];
    //   config.verticalPosition = 'top';
    //   config.horizontalPosition = 'center';
    //   config.duration = 6000;
    //   let ngswVersionTrack = ngswFile.appData.version ;
    //   let msgStr = `New version ${ngswVersionTrack} is available. Please Update`
    //   let snackBarRef = this.snackBar.open(msgStr, 'Update', config);
     
    //   snackBarRef.onAction().subscribe(async () => {
    //     console.log(`SW activating the newer version onAction  ${version}`)
    //     // trigger the update - this will download all changed files
    //     await this.swUpdate.activateUpdate()
    //     activatedSW = true;
    //     // refresh the page so that the new files become active
    //     document.location.reload()
    //   });

    //   snackBarRef.afterDismissed().subscribe(async () => {
    //     console.log(`SW activating the newer version  afterDismissed ${version}`)

    //     if(!activatedSW){
    //         // trigger the update - this will download all changed files
    //         await this.swUpdate.activateUpdate()
    //         activatedSW = true;
    //         // refresh the page so that the new files become active
    //         document.location.reload()
            
    //     }
      
    //   });
    //   //snackBarRef.dismiss();
     })

       // Subscribe to the update-checking state
    this.isCheckingSubscription = this.swUpdateService.isChecking$.subscribe(
      (isChecking) => {
        if (isChecking) {
          // Start a delay timer to show the message only if it takes longer
          this.delayTimer = timer(this.SHOW_DELAY).subscribe(() => {
            this.showCheckingMessage = true;
          });
        } else {
          // Stop the message and the timer once the check completes
          this.showCheckingMessage = false;
          if (this.delayTimer) {
            this.delayTimer.unsubscribe();
          }
        }
      }
    );

    this.myApp = window.MobileAppService ? window.MobileAppService.isMobileApp() : "" ;
    if(this.myApp != ""){
      this.myApp.then(
        function(resolve: any){
            var isMobileApp = resolve;
            console.log("Its a mobile device..")
            console.log(isMobileApp);
          if (isMobileApp == "Y") {
            sessionStorage.setItem('ISMOBILEAPP', 'Y');
            //If its mobile app , can check device type and app version from native...
            let deviceDetails = window.MobileAppService?.getDeviceDetails();
            if (deviceDetails) {
              let appVersion: string;
              let deviceType: string;
              deviceDetails.then((message: any) => {
                console.log(message);
                let deviceDetailsObject = JSON.parse(message) ;
                deviceType = deviceDetailsObject.osName ? deviceDetailsObject.osName : ""; 
                sessionStorage.setItem('DEVICE_TYPE', deviceType); //eg: Android, iOS, Browser/Desktop
                appVersion = deviceDetailsObject.appVersion ? deviceDetailsObject.appVersion : "";
                sessionStorage.setItem('APP_VERSION', appVersion); //eg: 1.0, 1.1
              }).catch((message: any) => {
                console.log(message);
              });
            }
            //Response from native: {"deviceName : xxxxx , deviceModel":"Pixel 8","osVersion":"14","osName":"Android","appVersion":"1.0"}
          }
        
        },
        function(failure: any){
            console.log(failure) ;
        }
        );
        
    }
    else{
      console.log("Its not a mobile device..") ;
      console.log(navigator.userAgent) ;
      const userAgent = navigator.userAgent;

    if (/android/i.test(userAgent)) {
      this.deviceType = 'Android';
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      this.deviceType = 'iOS';
    } else {
      this.deviceType = 'Desktop';
    }
    console.log(this.deviceType) ;
    sessionStorage.setItem('DEVICE_TYPE', this.deviceType); //eg: Android, iOS, Browser/Deskto
    let ngswVersionTrack = ngswFile.appData.version ;
    sessionStorage.setItem('APP_VERSION', ngswVersionTrack); //eg: 1.0, 1.1
  }

 }

 ngOnDestroy(): void {
  // Clean up subscriptions
  if (this.isCheckingSubscription) {
    this.isCheckingSubscription.unsubscribe();
  }
  if (this.delayTimer) {
    this.delayTimer.unsubscribe();
  }
}
} 
 



