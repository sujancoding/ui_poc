import { Routes } from '@angular/router';
import { PartnerComponent } from './partner/partner.component';



export const PartnerRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'search',
                component: PartnerComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },


        ],
    },

];
