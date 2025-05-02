import { Routes } from '@angular/router';
import { RatesComponent } from '../../rates/rates/rates.component';
import { OrganisationSettlementComponent } from '../remittance/orgsettlement/organisation-settlement.component';
import { ReviewDetailsBackofficeComponent } from '../remittance/reviewdetails/review-details-backoffice.component';
import { SuccessReceiptAdminComponent } from '../remittance/successreceipt/success-receipt-admin.component';
import { BackofficeUsersComponent } from '../accesscontrol/users/backoffice-users.component';
import { OrganizationAccountsHistoryComponent } from '../remittance/orgaccountshistory/organization-accounts-history.component';
import { AgentAccountsHistoryComponent } from '../remittance/agentaccountshistory/agent-accounts-history.component';
import { ExpensesTransactionHistoryComponent } from '../remittance/expenses-transaction-history/expenses-transaction-history.component';
import { ResetAccountsHistoryComponent } from '../remittance/reset-accounts-history/reset-accounts-history.component';
//import { DaysetupComponent } from './daysetup/daysetup.component';



export const AdminRoutes: Routes = [
    {
        path: '',
        children: [
           
            {
                path: 'rates',
                component: RatesComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'backoffice-review',
                component: ReviewDetailsBackofficeComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'backoffice-receipt',
                component: SuccessReceiptAdminComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'users',
                component: BackofficeUsersComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'org-accounts-history',
                component: OrganizationAccountsHistoryComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'agent-accounts-history',
                component: AgentAccountsHistoryComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'expenses-transaction-history',
                component: ExpensesTransactionHistoryComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'reset-account-history',
                component: ResetAccountsHistoryComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
        ]
    }

];
