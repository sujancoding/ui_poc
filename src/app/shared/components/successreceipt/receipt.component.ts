import { Component, OnInit } from '@angular/core';
import * as htmlToImage from 'html-to-image';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from '../../services/cache.service';
@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {
  payeeName !: string ;
  referenceNumber !: string;
  customerSends : any;
  finalAmountSent : any ;
  adminFee : any ;

  constructor(private titleHeader: TitleHeaderService,private store: InMemoryCache) { }

  ngOnInit(): void {
    this.titleHeader.setTitle('Receipt');
    this.payeeName = this.store.getItem('PAYEENAME');
    this.referenceNumber = this.store.getItem('REF_ID');
    this.adminFee = this.store.getItem('ADMIN_FEE');
   // this.customerSends = this.store.getItem('CUSTOMER_SENDS_AMOUNT');
    if( this.store.getItem('CUSTOMER_SENDS_AMOUNT') != undefined){
      this.customerSends = this.store.getItem('CUSTOMER_SENDS_AMOUNT');
    }
    if( this.store.getItem('FINAL_CUSTOMER_SENDS_AMOUNT') != undefined){
      this.customerSends = this.store.getItem('FINAL_CUSTOMER_SENDS_AMOUNT');
    }
  }
  downloadReceipt(){
    var node:any = document.getElementById('my-node');
    htmlToImage.toJpeg(node, { quality: 0.95 })
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = 'Receipt';
      link.href = dataUrl;
      link.click();
    });
  }
}
