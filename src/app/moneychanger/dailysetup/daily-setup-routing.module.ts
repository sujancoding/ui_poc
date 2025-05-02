import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RateSetupComponent } from './rate-setup/rate-setup.component';
import { DisplayRatesComponent } from './display-rates/display-rates.component';

export const dailySetupMcRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'rate-setup',
                component: RateSetupComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'display-rates',
                component: DisplayRatesComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(dailySetupMcRoutes)],
  exports: [RouterModule]
})


export class DailySetupRoutingModule { }
