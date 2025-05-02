import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerMobileRoutes} from './customer-mobile.routing';
import { ExchangeRateComponent } from './exchange-rate/exchange-rate.component';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from 'src/app/angular-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SearchCurrencyPipe } from '../core/pipe/searchfilter.pipe';
import { FormsModule } from '@angular/forms';
import { TransferDetailsComponent } from './transfer-details/transfer-details.component';
import { PromotionsCustomerComponent } from './promotions/promotions-customer.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { ConsumerTransferReceiptComponent } from './consumertransferreceipt/consumer-transfer-receipt.component';


@NgModule({
  declarations: [
    ExchangeRateComponent,
    SearchCurrencyPipe,
    TransferDetailsComponent,
    PromotionsCustomerComponent,
    ConsumerTransferReceiptComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule,
    NgxPaginationModule,
    FormsModule,
   RouterModule.forChild(CustomerMobileRoutes),
  ]
})
export class CustomerModuleModule { }
