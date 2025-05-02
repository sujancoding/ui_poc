import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddDealComponent } from '../../shared/modals/add-deal.component';


@Component({
  selector: 'app-deal-booking',
  templateUrl: './deal-booking.component.html',
  styleUrls: ['./deal-booking.component.scss']
})
export class DealBookingComponent implements OnInit {

  p: number = 1;
  dealBooking : [] =
  [
  ]

  openDialog(){
    this.dialogRef.open(AddDealComponent, {
      panelClass: 'custom-modalbox',
      height:'350px',
      width:'1250px'
     })
  }

  constructor(private router:Router,public dialogRef: MatDialog) { }

  ngOnInit(): void {
  }
  dealHistory(){
    this.router.navigate(['/daily-setup/deal-history']);
  }
}
