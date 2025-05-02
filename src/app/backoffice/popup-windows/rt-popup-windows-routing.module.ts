import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangeRateComponent } from '../exchangerates/exchange-rate.component';

import { DealComponent } from '../dailysetup/deal-history/deal.component';
import { BookContractComponent } from 'src/app/agent/bookcontract/book-contract.component';
import { AgentViewContractsComponent } from 'src/app/agent/viewcontracts/agent-view-contracts.component';
import { CustomerTableComponent } from '../customer/customersearch/customer-table.component';

export const rtPopupWindowRoutes: Routes = [
  {
    path: '',
    children: [
        {
            path: 'exchangerate-setup',
            component: ExchangeRateComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },
        {
            path: 'book-deal',
            component: DealComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },
        {
            path: 'book-contract',
            component: BookContractComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },
        {
            path: 'contract-listing',
            component: AgentViewContractsComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },
        {
          path: 'customer-search',
          component: CustomerTableComponent,
          data: {
              title: 'Dashboard ',
              urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
          },
      },
    ],
},
];

@NgModule({
  imports: [RouterModule.forChild(rtPopupWindowRoutes)],
  exports: [RouterModule]
})
export class RtPopupWindowsRoutingModule { }
