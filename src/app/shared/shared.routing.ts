import { Routes } from '@angular/router';
import { ReviewRemittanceComponent } from './components/review/review-remittance.component';
import { ReceiptComponent } from './components/successreceipt/receipt.component';
import { CancelDialogComponent } from './modals/cancel-dialog.component';


export const sharedRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'review',
                component: ReviewRemittanceComponent,
                data: {
                    title: 'Dashboard',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },

            {
                path: 'receipt',
                component: ReceiptComponent,
                data: {
                    title: 'Dashboard',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
          
        ]
        }

];
