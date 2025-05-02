import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { TokenRefreshService } from 'src/app/core/services/refresh-token.service';

@Component({
  selector: 'app-registration-successful',
  templateUrl: './registration-successful.component.html',
  styleUrls: ['./registration-successful.component.scss']
})
export class RegistrationSuccessfulComponent implements OnInit {

  customerType !: string ;
  constructor(private store : InMemoryCache, private router : Router, private authenticationService: AuthenticationService,
    private alertService : AlertService, private refreshTokenService : TokenRefreshService
  ) { }

  ngOnInit(): void {
    this.customerType = this.store.getItem('CUSTOMER_TYPE') ? this.store.getItem('CUSTOMER_TYPE') : "" ;

    //screen onload - we are calling logout service once to remove the token .
    this.authenticationService.logoutService().subscribe((datas:any)=>{
      console.log(datas) ;
    }) ;
  }

  //Go to their corresponding dashboard based on I or C ..
  goToDashboard(){
     // After successful login, trigger the token refresh interval
     this.refreshTokenService.startTokenRefreshPolling();
    if(this.customerType == "I"){  //Take them to Consumer dashboard
      this.router.navigate(['/dashboard/custdash']);
    }
    else if(this.customerType == "C"){  //Take them to Corporate dashboard
      this.router.navigate(['/profile/corporate-dashboard']);
    }
  }

  //Cancel button triggered --> call Logout API and then navigate to customer login ..
  cancel(){
    this.authenticationService.logoutService().subscribe((datas:any)=>{
      console.log(datas) ;
      if(datas.status == "SUCCESS"){ //success case .
        let getCustomerType = this.store.getItem('CUSTOMER_TYPE') ? this.store.getItem('CUSTOMER_TYPE') : "" ;
        if(getCustomerType == "I"){
        this.router.navigate(['/authentication/login'], { queryParams: { registered: 'true' } });
        }
        else if(getCustomerType == "C"){
          this.router.navigate(['/authentication/login-business'], { queryParams: { registered: 'true' } });
        }
      }
      else{  //failure case
        this.alertService.clear() ;
        this.alertService.error("Oops something went wrong. Try Again !") ;
       console.log("Logout Service failed !")
      }
    },
     error => {
      console.log(error) ;
      this.alertService.clear() ;
      this.alertService.error("Oops something went wrong. Try Again !") ;
      console.log("Logout Service failed !")
     }
  )
  }
}
