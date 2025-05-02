import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InMemoryCache } from '../../services/cache.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { roleIdDetails } from 'src/assets/userrole';
import { TokenRefreshService } from 'src/app/core/services/refresh-token.service';
import { WindowManagementService } from '../../services/popupwindow.service';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-token-expired-dialog',
  templateUrl: './token-expired-dialog.component.html',
  styleUrls: ['./token-expired-dialog.component.scss']
})
export class TokenExpiredDialogComponent implements OnInit {

  constructor(private router : Router,private store : InMemoryCache,
    public dialogRef: MatDialog,private bottomSheet : MatBottomSheet, private refreshTokenService : TokenRefreshService,
    private windowManagementService : WindowManagementService, private authenticationService : AuthenticationService,
  private snackBar : MatSnackBar) { }

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
