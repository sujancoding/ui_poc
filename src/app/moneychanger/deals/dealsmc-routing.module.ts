import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DealsmcComponent } from './viewdealsmc/dealsmc.component';
import { ParentNewDealMcComponent } from './parentnewdealsmc/parent-new-deal-mc.component';

export const dealsMcRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'view-deals',
                component: DealsmcComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'add-deals',
                component: ParentNewDealMcComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(dealsMcRoutes)],
  exports: [RouterModule]
})
export class DealsMcRoutingModule { }
