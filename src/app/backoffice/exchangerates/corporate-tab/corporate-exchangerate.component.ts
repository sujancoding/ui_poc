import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CorporateExchangeratesComponent } from '../../shared/modals/addcorporatecustomers/corporate-exchangerates.component';

@Component({
  selector: 'app-corporate-exchangerate',
  templateUrl: './corporate-exchangerate.component.html',
  styleUrls: ['./corporate-exchangerate.component.scss']
})
export class CorporateExchangerateComponent implements OnInit {
  isActive = false;
  p: number = 1;
  loader: Boolean = false;
  test : any;
  arr = [];
  numbers = 0;
  constructor(private dialogRef :MatDialog) { }

  ngOnInit(): void {
  }
  //adding new corporate customer to the table
  addCurrencyCode(){
    this.dialogRef.open(CorporateExchangeratesComponent, {
      panelClass: 'custom-modalbox',
      height:'550px',
      width:'550px'
     })
    
    

}

}
