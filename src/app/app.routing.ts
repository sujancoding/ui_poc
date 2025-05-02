import { RouterModule, Routes } from '@angular/router';

import { FullComponent } from './shared/layouts/full/full.component';
import { AppBlankComponent } from './shared/layouts/blank/blank.component';

import { AuthGuard } from './shared/services/auth.guard';

import { NgModule } from '@angular/core';
import { OrganizationMarketingComponent } from './marketing/organization/organization-marketing.component';


 const AppRoutes: Routes = [
  {
    path : "apt-home",
    component : OrganizationMarketingComponent
  },
  {
   path : '',
   redirectTo : 'apt-home',
   pathMatch : 'full'
  },
  {
    path: '',
    component: AppBlankComponent,  //this AppBlank component will not have side menu and top mat header
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./authentication/authentication.module').then((m) => m.AuthenticationModule),
      },
      {
        path : 'popups-window',
        loadChildren: () => 
        import('./moneychanger/shortcuts-window/shortcuts-window.module').then((m) => m.ShortcutsWindowModule),
      },
      {
        path : 'privacy',
        loadChildren: () => 
        import('./privacy/privacy.module').then((m) => m.PrivacyModule) 
      },
      {
        path : 'delete',
        loadChildren: () => 
        import('./delete-account/delete-account.module').then((m) => m.DeleteAccountModule) 
      },
      { //RT Popups
        path : 'rt-popups-window',
        loadChildren: () => 
        import('./backoffice/popup-windows/rt-popup-windows.module').then((m) => m.RtPopupWindowsModule)
      },
      // {
      //   path: 'marketing',
      //   loadChildren: () =>
      //     import('./marketing/marketing.module').then((m) => m.MarketingModule),
      // },
      // { path: '', redirectTo: 'authentication/login', pathMatch: "full" }

    ],
  },
  {
    path: 'customer-login',
    redirectTo: 'authentication/login',
    pathMatch: "full"
  },
  {
    path: 'business-login',
    redirectTo: 'authentication/login-business',
    pathMatch: "full"
  },
  {
    path: 'agent-login',
    redirectTo: 'authentication/login-agent',
    pathMatch: "full"
  },
  {
    path: 'custdash',
    redirectTo: 'dashboard/custdash',
    pathMatch: "full"
  },
  {
    path: 'corporate-dashboard',
    redirectTo: 'profile/corporate-dashboard',
    pathMatch: "full"
  },
  {
    path: 'empdash',
    redirectTo: 'dashboard/empdash',
    pathMatch: "full"
  },
  {
    path: 'empmcdashboard',
    redirectTo: 'moneychanger/dashboard',
    pathMatch: "full"
  },
  {
    path: 'agent',
    redirectTo: 'dashboard/agent',
    pathMatch: "full",
  },
  {
    path: 'agent-deal',
    redirectTo: 'agent/agent-deal',
    pathMatch: "full"
  },
  {
    path: 'agent-view-contract',
    redirectTo: 'agent/agent-view-contract',
    pathMatch: "full"
  },

  {
    path:'payee',
    redirectTo:'agent/payee',
    pathMatch:'full'
  },
  {
    path:'agent-remittance',
    redirectTo:'agent/agent-remittance',
    pathMatch:'full'
  },
  {
    path:'exchange-rate',
    redirectTo:'customers/exchange-rate',
    pathMatch:'full'
  },
  {
    path:'promotions',
    redirectTo:'customers/promotions',
    pathMatch:'full'
  },
  {
    path:'reports',
    redirectTo:'transaction/reports',
    pathMatch:'full'
  },
  {
    path:'users',
    redirectTo:'admin/users',
    pathMatch:'full'
  },
 
  {
    path: '',
    component: FullComponent, //this Full component will  have side menu and top mat header
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboards/dashboards.module').then((m) => m.DashboardsModule),
      },
      {
        path: 'transaction',
        loadChildren: () =>
          import('./transaction/transaction.module').then((m) => m.TransactionModule),
      },
      {
        path: 'rates',
        loadChildren: () =>
          import('./rates/rates.module').then((m) => m.RatesModule),
      },
      {
        path: 'promotions',
        loadChildren: () =>
          import('./promotions/promotions.module').then((m) => m.PromotionsModule),
      },
      {
        path: 'payee',
        loadChildren: () =>
          import('./payee/payee.module').then((m) => m.PayeeModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./onboarding/onboarding.module').then((m) => m.ProfileModule),
      },
      {
        path: 'company',
        loadChildren: () =>
          import('./onboarding/corporate/profile/company.module').then((m) => m.CompanyModule),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./backoffice/shared/user.module').then((m) => m.AdminModule),
      },
      {
        path: 'shared',
        loadChildren: () =>
          import('./shared/shared.module').then((m) => m.SharedModule),
      },
      // {
      //   path: 'application',
      //   loadChildren: () =>
      //     import('./admin/admin.module').then((m) => m.ApplicationModule),
      // },
      {
        path: 'partner',
        loadChildren: () =>
          import('./partner/partner.module').then((m) => m.PartnerModule),
      },
      {
        path: 'customer',
        loadChildren: () =>
          import('./backoffice/customer/customer.module').then((m) => m.CustomerModule),
      },
      {
        path: 'daily-setup',
        loadChildren: () =>
          import('./backoffice/dailysetup/dailysetup.module').then((m) => m.DailySetupModule),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'agent',
        loadChildren: () =>
          import('./agent/agent.module').then((m) => m.AgentModule),
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('./customer/customer-mobile.module').then((m) => m.CustomerModuleModule),
      },
      {
        path: 'access-control',
        loadChildren: () =>
         import('./backoffice/accesscontrol/access-control.module').then((m) => m.AccessControlModule) 
      },
      {
        path: 'agent-mainteance',
        loadChildren: () =>
          import('./backoffice/agentmaintenance/agentmaintenance.module').then((m) => m.AgentMaintenanceModule),
      },
      { //parent --> MC parent module
        path: 'moneychanger',
        loadChildren: () =>
         import('./moneychanger/moneychanger.module').then((m)=>m.MoneyChangerModule)
      },
      { //MC --> Deal module
        path: 'moneychanger-deals',
        loadChildren: () =>
         import('./moneychanger/deals/dealsmc.module').then((m)=>m.DealsMcModule) 
      },
      { //MC --> Maintenance module (we have counter and currency)
        path: 'moneychanger-maintenance',
        loadChildren: () =>
         import('./moneychanger/maintenance/maintenance.module').then((m)=>m.MaintenanceModule) 
      },
      { //MC --> Transaction module 
        path: 'moneychanger-transaction',
        loadChildren: () =>
         import('./moneychanger/transaction/transaction-mc.module').then((m)=> m.TransactionMcModule) 
      },
      { //MC --> Accounts module 
        path: 'moneychanger-accounts',
        loadChildren: () =>
         import('./moneychanger/accounts-money-changer/accounts-money-changer.module').then((m)=> m.AccountsMoneyChangerModule)  
      },
      {//MC --> Inventory module
        path : 'moneychanger-inventory',
        loadChildren: ()=>
        import('./moneychanger/stock-inventory/stock-inventory.module').then((m) => m.StockInventoryModule) 
      },
       {//MC --> Dailysetup module
        path : 'moneychanger-dailysetup',
        loadChildren: ()=>
        import('./moneychanger/dailysetup/daily-setup.module').then((m) => m.DailySetupModule) 
      },
        {//Consumer --> Delete account
          path : 'feature',
          loadChildren: ()=>
          import('./delete-account/delete-account.module').then((m) => m.DeleteAccountModule)
        },
        //  {// Chat Bot Module
        //   path : 'chat',
        //   loadChildren: ()=>
        //   import('./chat-bot/chat-bot.module').then((m) => m.ChatBotModule) 
        // },
        {// MC > Shipment Module
          path : 'shipment',
          loadChildren: ()=>
          import('./moneychanger/shipment/shipment.module').then((m) => m.ShipmentModule) 
        },
        {// MC > Reports Module
          path : 'reports',
          loadChildren: ()=>
          import('./moneychanger/reports/reports.module').then((m) => m.ReportsModule) 
        }
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
