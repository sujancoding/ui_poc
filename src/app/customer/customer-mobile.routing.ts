import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangeRateComponent } from './exchange-rate/exchange-rate.component';
import { PromotionsCustomerComponent } from './promotions/promotions-customer.component';
import { TransferDetailsComponent } from './transfer-details/transfer-details.component';
import { ConsumerTransferReceiptComponent } from './consumertransferreceipt/consumer-transfer-receipt.component';


export const CustomerMobileRoutes: Routes = [
  {
      path: '',
      children: [
          {
              path: 'exchange-rate',
              component: ExchangeRateComponent,
              data: {
                  title: 'Dashboard ',
                  urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
              },
          },
          {
            path: 'transfer-details',
            component: TransferDetailsComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },
        {
            path: 'receipt-details',
            component: ConsumerTransferReceiptComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },
        {
            path: 'promotions',
            component: PromotionsCustomerComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },

      ],
  },

];
