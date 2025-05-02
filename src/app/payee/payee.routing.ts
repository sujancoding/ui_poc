import { Routes } from '@angular/router';
import { AgentSendmoneyComponent } from '../agent/agent-sendmoney/agent-sendmoney.component';

import { AddPayeeComponent } from './add-payee/add-payee.component';
import { AllPayeeComponent } from './all-payee/all-payee.component';
import { AllTransactionsComponent } from './all-transactions/all-transactions.component';
import { PayeeAddedComponent } from './payee-added/payee-added.component';
import { PayeeComponent } from './payee-table/payee.component';
import { QrCodeComponent } from './qrcode/qr-code.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { RemitMoneyComponent } from './remit-money/remit-money.component';
import { ReviewDetailsComponent } from './reviewdetails/review-details.component';
import { CorporateDealSendMoneyComponent } from './corporate-deal-send-money/corporate-deal-send-money.component';
import { CorporateDealReviewTransactionComponent } from './corporate-deal-review-transaction/corporate-deal-review-transaction.component';
import { CorporateDealQrComponent } from './corporate-deal-qr/corporate-deal-qr.component';
import { CorporateDealTransactionReceiptComponent } from './corporate-deal-transaction-receipt/corporate-deal-transaction-receipt.component';



export const PayeeRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: PayeeComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },

            {
                path: 'view-payee/:id',
                component: PayeeComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            
            {
                path: 'money-receipt',
                component: ReceiptComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },

            {
                path: 'payee-receipt',
                component: PayeeAddedComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'customer-review',
                component: ReviewDetailsComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'add-payee',
                component: AddPayeeComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'add-payee/:customerId/:payeeId',
                component: AddPayeeComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },

            {
                path: 'remit-money',
                component: RemitMoneyComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },

            {
                path: 'all-payee',
                component: AllPayeeComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'all-transactions',
                component: AllTransactionsComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'payee',
                component: PayeeComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'qr-code',
                component: QrCodeComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'agent-sendmoney',
                component: AgentSendmoneyComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'corporate-deal-sendmoney',
                component: CorporateDealSendMoneyComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'corporate-deal-review-transaction',
                component: CorporateDealReviewTransactionComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'corporate-deal-qr',
                component: CorporateDealQrComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'corporate-deal-transaction-receipt',
                component: CorporateDealTransactionReceiptComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
        ],
    },

];
