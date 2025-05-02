import { Routes } from '@angular/router';
import { RatesComponent } from './rates/rates.component';



export const RatesRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: RatesComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },


        ],
    },

];
