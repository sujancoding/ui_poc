
import {  Routes } from '@angular/router';
import { InventoryWindowComponent } from './inventory-window/inventory-window.component';
import { AddTransactionWindowComponent } from './add-transaction-window/add-transaction-window.component';
import { DisplayRatesWindowComponent } from './display-rates-window/display-rates-window.component';
import { AddDealWindowComponent } from './add-deal-window/add-deal-window.component';
import { DealListingWindowComponent } from './deal-listing-window/deal-listing-window.component';
import { CustomerAccountsWindowComponent } from './customer-accounts-window/customer-accounts-window.component';

export const popupWindowRoutes: Routes = [
  {
    path: '',
    children: [
        {
            path: 'inventory',
            component: InventoryWindowComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },
        {
            path: 'new-transaction',
            component: AddTransactionWindowComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },
        {
            path: 'display-rates',
            component: DisplayRatesWindowComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },
        {
            path: 'add-deal',
            component: AddDealWindowComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },
        //need to add child patch for component 'DealListingWindowComponent' where route is 'deal-listing' ;
        {
            path: 'deal-listing',
            component: DealListingWindowComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        },
        {
            path: 'customer-accounts',
            component: CustomerAccountsWindowComponent,
            data: {
                title: 'Dashboard ',
                urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            },
        }
    ],
},
];


