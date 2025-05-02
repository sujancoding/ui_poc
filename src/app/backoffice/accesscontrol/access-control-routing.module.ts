import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleMaintenanceComponent } from './role-maintenance/role-maintenance.component';
import { BackofficeUsersComponent } from './users/backoffice-users.component';

import { PipsMaintenanceComponent } from './pips-maintenance/pips-maintenance.component';
import { AgentListingsComponent } from '../agentmaintenance/agentlistings/agent-listings.component';
import { DayEndComponent } from './day-end/day-end.component';

const routes: Routes = [
  {
    path: 'role-search-table',
    component: RoleMaintenanceComponent,
    // canDeactivate: [CanDeactivateGuard],
    data: {
        title: 'Dashboard ',
        urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
    },
  },
  {
    path: 'user-search-table',
    component: BackofficeUsersComponent,
    // canDeactivate: [CanDeactivateGuard],
    data: {
        title: 'Dashboard ',
        urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
    },
  }, 
  {
    path: 'agent-onboarding',
    component: AgentListingsComponent,
    // canDeactivate: [CanDeactivateGuard],
    data: {
        title: 'Dashboard ',
        urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
    },
  },
  {
    path: 'day-end',
    component: DayEndComponent,
    // canDeactivate: [CanDeactivateGuard],
    data: {
        title: 'Dashboard ',
        urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
    },
  }
  // {  --> commented , pips moved under 'Daily setup' main menu
  //   path: 'pips-search',
  //   component: PipsMaintenanceComponent,
  //   data: {
  //       title: 'Dashboard ',
  //       urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
  //   },
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessControlRoutingModule { }
