import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  goToExchangeRate(){
    this.router.navigate(['/daily-setup/exchange-rate']);
  }
}
