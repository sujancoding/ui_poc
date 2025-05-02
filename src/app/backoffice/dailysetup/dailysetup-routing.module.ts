import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionsComponent } from 'src/app/promotions/promotions/promotions.component';
import { AddDealComponent } from '../shared/modals/add-deal.component';
import { DealBookingComponent } from './deal-booking/deal-booking.component';
import { DealComponent } from './deal-history/deal.component';
import { ExchangeRateComponent } from '../exchangerates/exchange-rate.component';
import { CalculatorComponent } from '../calculator/calculator.component';
import { ParentCalculatorComponent } from '../calculator-mat-tabs/parent-calculator/parent-calculator.component';
import { MultiDealCalciComponent } from '../calculator-mat-tabs/parent-calculator/multi-deals/multi-deal-calci/multi-deal-calci.component';
import { AgentViewContractsComponent } from 'src/app/agent/viewcontracts/agent-view-contracts.component';
import { CommissionchargesComponent } from './commissioncharges/commissioncharges.component';
import { PipsMaintenanceComponent } from '../accesscontrol/pips-maintenance/pips-maintenance.component';

const routes: Routes = [{
  path: 'deal-history',
  component: DealComponent,
  data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
  },
},

{
  path: 'add-deal',
  component: AddDealComponent,
  data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
  },
},

{
  path: 'deal-booking',
  component: DealBookingComponent,
  data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
  },
},
{
  path: 'exchange-rate',
  component: ExchangeRateComponent,
  data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
  },
},
{
  path: 'promotion-maintenance',
  component: PromotionsComponent,
  data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
  },
},
{
  path: 'calculator',
  component: ParentCalculatorComponent,
  data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
  },
},
{
  path: 'single-deal',
  component: CalculatorComponent,
  data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
  },
},
{
  path: 'multi-deals',
  component: MultiDealCalciComponent,
  data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
  },
},
{
  path: 'backoffice-view-contracts',
  component: AgentViewContractsComponent,
  data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
  },
},
{
  path: 'commission-charge-setup',
  component: CommissionchargesComponent,
  data: {
      title: 'Dashboard ',
      urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
  },
},

  {
    path: 'pips-search',  //pips now moved into daily setup main menu
    component: PipsMaintenanceComponent,
    data: {
        title: 'Dashboard ',
        urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
    },
  
  
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailySetupRoutingModule { }
