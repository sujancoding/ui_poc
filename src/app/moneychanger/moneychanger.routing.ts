import { Routes } from '@angular/router';
import { MoneyChangerDashboardComponent } from './dashboards/money-changer-dashboard.component';







export const moneyChangerRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'dashboard',
                component: MoneyChangerDashboardComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
        ],
    },

];
