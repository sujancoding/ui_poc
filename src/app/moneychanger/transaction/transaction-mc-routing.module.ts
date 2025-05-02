import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewTransactionMcComponent } from './viewtransaction/view-transaction-mc.component';
import { AddTransactionComponent } from './addtransaction/add-transaction.component';

export const transactionMcRoutes: Routes = [
  {
    path: '',
    children: [
        {
            path: 'view-transaction',
            component: ViewTransactionMcComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },
        {
          path: 'new-transaction',
          component: AddTransactionComponent,
          data: {
              title: 'Dashboard ',
              urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
          },
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(transactionMcRoutes)],
  exports: [RouterModule]
})
export class TransactionMcRoutingModule { }
