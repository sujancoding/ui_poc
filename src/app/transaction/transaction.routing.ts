import { Routes } from '@angular/router';
import { AgentSettlementComponent } from '../agent/settlement/agent-settlement.component';
//import { TransactionProgressComponent } from './all-transactions/transaction-progress/transaction-progress.component';
import { NewSettlementComponent } from './new-settlement/new-settlement.component';
import { PayeeCardComponent } from './payee-card/payee-card.component';
import { TransactionComponent } from '../backoffice/remittance/unpostedtransaction/customers/transaction.component';
import { SettlementHistoryComponent } from './settlement-history/settlement-history.component';
import { UnpostedTransactionComponent } from '../backoffice/remittance/unpostedtransaction/modals/unposted-transaction.component';
import { AgentTableComponent } from '../backoffice/remittance/unpostedtransaction/agents/agent-transactions.component';
import { SendMoneyComponent } from '../backoffice/remittance/sendmoney/send-money.component';
import { PostedTransactionComponent } from '../backoffice/remittance/postedtransaction/posted-transaction.component';
import { OrganisationSettlementComponent } from '../backoffice/remittance/orgsettlement/organisation-settlement.component';
import { OnlineReportsComponent } from '../backoffice/onlinereports/transactionreports/online-reports.component';
import { ReportsTypeComponent } from '../backoffice/onlinereports/reportstype/reports-type.component';
import { TransactionSummaryReportComponent } from '../backoffice/onlinereports/transaction-summary-report/transaction-summary-report.component';
import { RtKycConfigComponent } from '../backoffice/onlinereports/rt-kyc-config/rt-kyc-config.component';



export const TransactionRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: TransactionComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            // {
            //     path: 'posted',
            //     component: TransactionComponent,
            //     data: {
            //         title: 'Dashboard ',
            //         urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            //     },
            // },

            {
                path: 'unposted',
                component: TransactionComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },

            {
                path: 'search',
                component: TransactionComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'settlement',
                component: OrganisationSettlementComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },

            // {
            //     path: 'send-money',
            //     component: TransactionComponent,
            //     data: {
            //         title: 'Dashboard ',
            //         urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            //     },
            // },

            // {
            //     path: 'transaction-progress',
            //     component: TransactionProgressComponent,
            //     data: {
            //         title: 'Dashboard ',
            //         urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            //     },
            // },

            {
                path: 'agent-settlement',
                component: AgentSettlementComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },

            {
                path: 'payee-card',
                component: PayeeCardComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'new-settlement',
                component: NewSettlementComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'settlement-history',
                component: SettlementHistoryComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'settlement-history/:agentId',
                component: SettlementHistoryComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'unposted-transaction',
                component: TransactionComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'agent-table',
                component: AgentTableComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'send-money',
                component: SendMoneyComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'posted-transaction',
                component: TransactionComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },

            {
                path: 'reports',
                component: OnlineReportsComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },

            {
                path: 'reports-type',
                component: ReportsTypeComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'transaction-summary-report',
                component: TransactionSummaryReportComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'kyc-config',
                component: RtKycConfigComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },

        ],
    },

];
