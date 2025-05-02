import { Routes } from '@angular/router';
import { DeleteAccountComponent } from './delete-account/delete-account.component';

export const deleteAccountRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'delete-account',
                component: DeleteAccountComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
        ],
    },

];

