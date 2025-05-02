import { Routes } from '@angular/router';
import { AgentDashboardComponent } from '../agent/dashboard/agent-dashboard.component';
import { BranchuserDashboardComponent } from '../backoffice/dashboards/branchuser-dashboard.component';
import { CustomerdashboardComponent } from './customerdashboard/customerdashboard.component';
import { AppCustomerQuickComponent } from './dashboard-components/app-customer-quick/app-customer-quick.component';
import { EmployeedashboardComponent } from './employeedashboard/employeedashboard.component';


export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        component: CustomerdashboardComponent,
        data: {
          title: 'Dashboard ',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
        },
      },
      {
        path: 'custdash',
        component: AppCustomerQuickComponent,  //component changed from customer db to appcustomerQC
        data: {
          title: 'Dashboard ',
          urls: [{ title: 'Dashboard', url: '/dashboard/custdash' }, { title: 'Dashboard ' }],
        },
      },
      {
        path: 'empdash',
        component: BranchuserDashboardComponent,
        data: {
          title: 'Dashboard ',
          urls: [{ title: 'Dashboard', url: '/dashboard/empdash' }, { title: 'Dashboard ' }],
        },
      },
      {
        path: 'branch-user',
        component: BranchuserDashboardComponent,
        data: {
          title: 'Dashboard ',
          urls: [{ title: 'Dashboard', url: '/dashboard/branch-user' }, { title: 'Dashboard ' }],
        },
      },
      {
        path: 'branch-user',
        component: BranchuserDashboardComponent,
        data: {
          title: 'Dashboard ',
          urls: [{ title: 'Dashboard', url: '/dashboard/branch-user' }, { title: 'Dashboard ' }],
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

    ],
  },

];
