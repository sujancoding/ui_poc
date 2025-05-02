import { Component, OnInit } from '@angular/core';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';

@Component({
  selector: 'app-promotions-customer',
  templateUrl: './promotions-customer.component.html',
  styleUrls: ['./promotions-customer.component.scss']
})
export class PromotionsCustomerComponent implements OnInit {

  constructor(private headerService : TitleHeaderService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Promotions');
  }

}
