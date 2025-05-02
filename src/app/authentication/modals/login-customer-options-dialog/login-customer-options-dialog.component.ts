import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-customer-options-dialog',
  templateUrl: './login-customer-options-dialog.component.html',
  styleUrls: ['./login-customer-options-dialog.component.scss']
})
export class LoginCustomerOptionsDialogComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  navigateCustomerLogin(customerType : string){
    if(customerType == "I"){
      this.router.navigate(['/authentication/login']);
    }
    else if (customerType == "C"){
      this.router.navigate(['/authentication/login-business']);
    }
  }
}
