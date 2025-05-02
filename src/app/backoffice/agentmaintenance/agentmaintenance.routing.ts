import {  NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentListingsComponent } from './agentlistings/agent-listings.component';




const AgentMaintenanceRoutes: Routes = [
{
  path: 'agent-onboarding',
  component: AgentListingsComponent,
  data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
  },
}
];

@NgModule({
  imports: [RouterModule.forChild(AgentMaintenanceRoutes)],
  exports: [RouterModule]
})
export class AgentMaintenanceRoutingModule {}
