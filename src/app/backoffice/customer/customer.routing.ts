import { Routes } from '@angular/router';
import { ApprovePayeeComponent } from '../payee/approve-payee.component';
import { CustomerTableComponent } from './customersearch/customer-table.component';



export const CustomerRoutes: Routes = [
    {
        path: '',
        children: [
           {
              path: 'table',
              component: CustomerTableComponent ,
               data: {
                    title: 'Dashboard ',
                 urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
           },
           {
            path: 'table/:status',
            component: CustomerTableComponent ,
             data: {
                  title: 'Dashboard ',
               urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
              },
         },
           {
            path: 'approve-payee',
            component: ApprovePayeeComponent ,
             data: {
                  title: 'Dashboard ',
               urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
              },
         },


        ],
    },

];
