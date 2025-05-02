import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerAccountsComponent } from './customeraccounts/customer-accounts.component';
import { CustomerAccountsHistoryComponent } from './customeraccountshistory/customer-accounts-history.component';

export const customerAccountsRoutes: Routes = [
  {
    path: '',
    children: [
        {
            path: 'customer-accounts',
            component: CustomerAccountsComponent,
            data: {
                title: 'Dashboard',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },
        {
          path: 'customer-accounts-history',
          component: CustomerAccountsHistoryComponent,
          data: {
              title: 'Dashboard',
              urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
          },
      },
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(customerAccountsRoutes)],
  exports: [RouterModule]
})
export class AccountsMoneyChangerRoutingModule { }
