import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import { SearchShipmentComponent } from './search-shipment/search-shipment.component';

const routes: Routes = [
  {
    path: '',
    children: [
        {
            path: 'add',
            component: AddShipmentComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },
        {
          path: 'search',
          component: SearchShipmentComponent,
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
export class ShipmentRoutingModule { }
