import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyComponent } from './currency/currency.component';
import { CounterComponent } from './counter/counter.component';

const routes: Routes = [
  {
    path: '',
    children: [
        {
            path: 'currency',
            component: CurrencyComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },
        {
          path: 'counter',
          component: CounterComponent,
          data: {
              title: 'Dashboard ',
              urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
          },
      },
    ],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
