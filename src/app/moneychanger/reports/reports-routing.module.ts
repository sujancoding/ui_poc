import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementReportsComponent } from './management-reports/management-reports.component';
import { TransactionReportsComponent } from './transaction-reports/transaction-reports.component';
import { KycReportsConfigComponent } from './kyc-reports-config/kyc-reports-config.component';

const routes: Routes = [
  {
    path: '',
    children: [
        {
            path: 'management',
            component: ManagementReportsComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },

      //add 'transaction' path to load TransactionReportsComponent
      //Write code here...

      {
        path: 'transaction',
        component: TransactionReportsComponent,
        data: {
            title: 'Dashboard ',
            urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
        },
    },
    {
      path: 'kyc-config',
      component: KycReportsConfigComponent,
      data: {
          title: 'Dashboard ',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
      },
  }

    ],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }


