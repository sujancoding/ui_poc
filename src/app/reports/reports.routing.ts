import { Routes } from '@angular/router';
import { BasicreportComponent } from './basicreport/basicreport.component';



export const ReportsRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'basic',
                component: BasicreportComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'complaince',
                component: BasicreportComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },

        ],
    },

];
