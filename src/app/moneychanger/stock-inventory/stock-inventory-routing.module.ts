import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryHistoryComponent } from './inventory-history/inventory-history.component';

const routes: Routes = [
  {
    path: '',
    children: [
        {
            path: 'search',
            component: InventoryComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },
        {
          path: 'search-history',
          component: InventoryHistoryComponent,
          data: {
              title: 'Dashboard ',
              urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
          },
      },
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockInventoryRoutingModule { }
