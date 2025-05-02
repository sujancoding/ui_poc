import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { roleIdDetails } from 'src/assets/userrole';
import { InMemoryCache } from '../../services/cache.service';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { WindowManagementService } from '../../services/popupwindow.service';
import { TokenRefreshService } from 'src/app/core/services/refresh-token.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-force-logout',
  templateUrl: './force-logout.component.html',
  styleUrls: ['./force-logout.component.scss']
})
export class ForceLogoutComponent implements OnInit {

  paramsKey! : string
  paramsValue! : string
  constructor(private router : Router,private store : InMemoryCache,private authenticationService : AuthenticationService,
    private windowManagementService: WindowManagementService,private refreshTokenService : TokenRefreshService,private snackBar : MatSnackBar, 
    public dialogRef: MatDialogRef<ForceLogoutComponent>) { }

  ngOnInit(): void {
  }
  logout(){
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
