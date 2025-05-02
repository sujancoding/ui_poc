import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { TokenRefreshService } from 'src/app/core/services/refresh-token.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { WindowManagementService } from 'src/app/shared/services/popupwindow.service';
import { roleIdDetails } from 'src/assets/userrole';

@Component({
  selector: 'app-logout-confirmation-dialog',
  templateUrl: './logout-confirmation-dialog.component.html',
  styleUrls: ['./logout-confirmation-dialog.component.scss']
})
export class LogoutConfirmationDialogComponent implements OnInit {

  paramsKey : string = "" ;
  paramsValue : string = "" ;
  constructor(private router : Router,private store : InMemoryCache, private refreshTokenService : TokenRefreshService,
    private windowManagementService: WindowManagementService , private authenticationService : AuthenticationService,
  private snackBar : MatSnackBar ) { }

  ngOnInit(): void {
  }
  logout(){
   //Initially we call Logout Service API --> Once success : perform which login sreen to navigate .
    this.authenticationService.logoutService().subscribe((data:any)=>{
      if(data.status == "SUCCESS"){
       this.authenticationService.logout() ;
      }
    },
    error =>{
      console.log(error) ;
      this.snackBar.open("Oops something went wrong. Try Again !", "Ok") ;
    }
  )
   
    
  }
}
