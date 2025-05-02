import { Routes } from '@angular/router';
import { AgentDashboardComponent } from './dashboard/agent-dashboard.component';
import { AgentDealComponent } from './deal/agent-deal.component';
import { AgentRemittanceComponent } from './remittance/parent-tab/agent-remittance.component';
import { OrganizationInitiatedComponent } from './remittance/organization-initiated/organization-initiated.component';

import { PayeeComponent } from '../payee/payee-table/payee.component';
import { AgentSendmoneyComponent } from './agent-sendmoney/agent-sendmoney.component';
import { BookContractComponent } from './bookcontract/book-contract.component';
import { AgentViewContractsComponent } from './viewcontracts/agent-view-contracts.component';

export const AgentRoutes: Routes = [
  {
      path: '',
      children: [
    {
      path: 'agent-remittance',
      component: AgentRemittanceComponent,
      data: {
          title: 'Dashboard ',
          urls: [{ title: 'Dashboard', url: '/agent/agent-remittance' }, { title: 'Dashboard ' }],
      },
  },
  {
    path: 'agent-remittance-history',
    component: AgentRemittanceComponent,
    data: {
        title: 'Dashboard ',
        urls: [{ title: 'Dashboard', url: '/agent/agent-remittance' }, { title: 'Dashboard ' }],
    },
},
  {
    path: 'agent',
    component: AgentDashboardComponent,
    data: {
        title: 'Dashboard ',
        urls: [{ title: 'Dashboard', url: '/dashboard/agent' }, { title: 'Dashboard ' }],
    },
},
{
  path: 'payee',
 component: PayeeComponent,
 data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/agent/payee' }, { title: 'Dashboard' }],
  },
},
{
  path: 'organization-remittance',
 component: OrganizationInitiatedComponent,
 data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/agent/payee' }, { title: 'Dashboard' }],
  },
},
{
  path: 'agent-deal',
 component: AgentDealComponent,
 data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/agent/agent-deal' }, { title: 'Dashboard' }],
  },
},
{
  path: 'agent-add-deal',
 component: BookContractComponent,
 data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/agent/agent-add-deal' }, { title: 'Dashboard' }],
  },
},
{
  path: 'agent-view-contract',
 component: AgentViewContractsComponent,
 data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/agent/agent-view-contract' }, { title: 'Dashboard' }],
  },
},

{
  path: 'agent-sendmoney',
 component: AgentSendmoneyComponent,
 data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/agent/agent-deal' }, { title: 'Dashboard' }],
  },
},
      ]
  }

];