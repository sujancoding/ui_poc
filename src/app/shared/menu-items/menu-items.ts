import { Injectable } from '@angular/core';
import { InMemoryCache } from '../services/cache.service';
import { Router } from '@angular/router';
import { roleIdDetails } from 'src/assets/userrole';
export interface BadgeItem {
  type: string;
  value: string;
}
export interface Saperator {
  name: string;
  type?: string;
}
export interface SubChildren {
  state: string;
  name: string;
  type?: string;
}
export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  child?: SubChildren[];
  accessId : string ;  
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  saperator?: Saperator[];
  children?: ChildrenItems[];
}


const CUST_MENUITEMS = [
  {
    state: '',
    name: 'Remittance',
    type: 'saperator',
    icon: 'av_timer',
  },

  {
    state: 'custdash',
    name: 'Dashboard',
    type: 'link',
    icon: 'av_timer',
  },
  {
    state: 'payee',
    name: 'Remittance',
    type: 'sub',
    icon: 'payment',
    children: [
      {name:'Send Money',state:'all-payee',type:'link', accessId : ''},
      {name:'All Transaction',state:'all-transactions',type:'link', accessId : ''}
    ]
  },
  {
    state: 'exchange-rate',
    name: 'Rates',
    type: 'link',
    icon: 'rate_review',
  },

  // {
  //   state: 'promotions',
  //   name: 'Promotions',
  //   type: 'link',
  //   icon: 'local_offer',
  // },
  {
    state: '',
    name: 'Account',
    type: 'saperator',
    icon: 'av_timer',
  },
  {
    state: 'customer-login',
    name: 'Sign Out',
    type: 'click',
    icon: 'logout',
  },
];

const EMP_REM_MENUITEMS = [
 
  {
    state: 'empdash',
    name: 'Dashboard',
    type: 'link',
    icon: 'dashboard',
  },
  {
    state: 'transaction',
    name: 'Remittance',
    type: 'sub',
    icon: 'send',
    children: [
      { state: 'send-money', name: 'Send Money', type: 'link', accessId : 'BRSM' },
      { state: 'unposted-transaction', name: 'UnPosted', type: 'link', accessId : 'BRUM' },
      {state:'posted-transaction' , name:'Fulfillment' , type:'link', accessId : 'BRFM'},
      {state:'reports' , name:'Search' , type:'link', accessId : 'BRTM'},
      
    ],
  },
  {
    state: 'daily-setup',
    name: 'Forex',
    type: 'sub',
    icon: 'attach_money',
    children: [
      { state: 'deal-history', name: 'Deals', type: 'link', accessId : 'BFDM' },
      {state : 'backoffice-view-contracts' , name:'Contracts' , type: 'link', accessId : 'BFCM'},
    ],
  },

  {
    state: 'daily-setup',
    name: 'Daily Setup',
    type: 'sub',
    icon: 'event',
    children: [
     
      { state: 'exchange-rate', name: 'Exchange Rate', type: 'link', accessId : 'BDEM' },
      { state: 'commission-charge-setup', name: 'Commission', type: 'link', accessId : 'BDCM' },
      { state: 'pips-search', name: 'Pips Maintenance', type: 'link', accessId : 'BDPM'},
    

    ],
  },


  {
    state: 'customer',
    name: 'Customer',
    type: 'sub',
    icon: 'people',
    children: [
      { state: 'table', name: 'Search', type: 'link', accessId : 'BCSM' },
      {state:'approve-payee', name:'Approve Payee' , type:'link', accessId : 'BCAM'}
    ],
  },

  
  {
    state: 'transaction',
    name: 'Accounts',
    type: 'sub',
    icon: 'account_balance',
    children: [
      {state:'settlement',name:'Organization',type:'link', accessId : 'BAOM'} ,
      { state: 'agent-settlement', name: 'Agent', type: 'link' , accessId : 'BAAM'},
    ],
  },

  {
    state: 'profile',
    name: 'Application',
    type: 'sub',
    icon: 'apps',
    children: [
      { state: 'Application-Listings', name: 'Search', type: 'link', accessId : 'BASM' } 
    ],
  },
  




  {
    state: 'transaction',
    name: 'Reports',
    type: 'sub',
    icon: 'list_alt',
    children: [
       {state:'transaction-summary-report' , name:'Transaction' , type:'link', accessId : 'BRTSM'},
      {state:'reports-type',name:'Management',type:'link', accessId : 'BRMM'},
      {state:'kyc-config',name:'KYC Config',type:'link', accessId : 'BRKCM'}
    ],
  },

  {
    state: 'access-control',
    name: 'Admin',
    type: 'sub',
    icon: 'account_circle',
    children: [
     // { state: 'role-search-table', name: 'Role Maintenance', type: 'link' , accessId : 'BARM'},
      { state: 'agent-onboarding', name: 'Agent Maintenance', type: 'link', accessId : 'BAAMA' },
      { state: 'user-search-table', name: 'Staff Maintenance', type: 'link' , accessId : 'BASMA'},
   
    ],
  }

 

];

const EMP_MC_MENUITEMS = [
 
  {  //Dashboard -> Stock
    state: 'empmcdashboard',
    name: 'Dashboard',
    type: 'link',
    icon: 'dashboard',
  },
  {  //Deals
    state: 'moneychanger-deals',
    name: 'Deals',
    type: 'sub',
    icon: 'attach_money',
    children: [
      { state: 'view-deals', name: 'Search', type: 'link' , accessId : 'BDSM' } , //access id added
      { state: 'add-deals', name: 'New', type: 'link',  accessId : 'BDNM' } //access id added
    ],
  },
 
  {  //Transaction
    state: 'moneychanger-transaction',
    name: 'Transaction',
    type: 'sub',
    icon: 'send',
    children: [
      { state: 'view-transaction', name: 'Search', type: 'link' , accessId : 'BTSM' } , //access id added
      { state: 'new-transaction', name: 'New', type: 'link',  accessId : 'BTNM' } //access id added
    ],
  },

  {  //Customer search
    state: 'customer',
    name: 'Customer',
    type: 'sub',
    icon: 'people',
    children: [
      { state: 'table', name: 'Search', type: 'link', accessId : 'BCSM' },
    ],
  },

  {  //Application search
    state: 'profile',
    name: 'Application',
    type: 'sub',
    icon: 'apps',
    children: [
      { state: 'Application-Listings', name: 'Search', type: 'link', accessId : 'BASM' } 
    ],
  },
  {  //MC Maintenance
    state: 'moneychanger-maintenance',
    name: 'Maintenance',
    type: 'sub',
    icon: 'timeline',
    children: [
      { state: 'currency', name: 'Currency', type: 'link', accessId : 'BMCMA' } ,
      { state: 'counter', name: 'Counter', type: 'link', accessId : 'BMCM' } 
    ],
  },
  {  //MC Exchange rate
    state: 'moneychanger-dailysetup',
    name: 'DailySetup',
    type: 'sub',
    icon: 'event',
    children: [
      { state: 'rate-setup', name: 'ExchangeRate Setup', type: 'link', accessId : 'BMDEM' } , 
      { state: 'display-rates', name: 'Display Rates', type: 'link', accessId : 'BMDDM' } ,
    ],
  },
  { //Accounts
    state: 'moneychanger-accounts',
    name: 'Accounts',
    type: 'sub',
    icon: 'account_balance',
    children: [
      { state: 'customer-accounts', name: 'Customer', type: 'link' , accessId : 'BACM'},
   
    ],
  },
  { //Shipment
    state: 'shipment',
    name: 'Shipment',
    type: 'sub',
    icon: 'local_airport',
    children: [
      { state: 'search', name: 'Search', type: 'link' , accessId : 'BSSM'},
      { state: 'add', name: 'Add', type: 'link' , accessId : 'BSAM'},
   
    ],
  },
  { //Staff Maintenance , Branch Close
    state: 'access-control',
    name: 'Admin',
    type: 'sub',
    icon: 'account_circle',
    children: [
      { state: 'user-search-table', name: 'Staff Maintenance', type: 'link' , accessId : 'BASMA'},
      {state: 'day-end', name:'Branch Close', type: 'link', accessId: 'BADEM'}
    ],
  },
  { //Reports
    state: 'reports',
    name: 'Reports',
    type: 'sub',
    icon: 'list_alt',
    children: [
      {state:'management',name:'Management',type:'link', accessId : 'BMRM'},
      //Add object where state is 'routename' , name is 'Transaction' , type is link and accessId : 'BTRM' (Write code here...)
      {state:'transaction',name:'Transaction',type:'link', accessId : 'BTRM'} ,
      {state:'kyc-config',name:'KYC Config',type:'link', accessId : 'BKCM'} 
    ],
  },
  { //Stock inventory - search and update
    state: 'moneychanger-inventory',
    name: 'Inventory',
    type: 'sub',
    icon: 'chrome_reader_mode',
    children: [
      { state: 'search', name: 'Search', type: 'link' , accessId : 'BISM'},
    ],
  },

  

  


 

];

const AGT_MENUITEMS = [
  // {
  //   state: '',
  //   name: 'Remittance',
  //   type: 'saperator',
  //   icon: 'av_timer',
  // },
  {
    state: 'agent',
    name: 'Dashboard',
    type: 'link',
    icon: 'dashboard',
  },
  {
    state: 'agent',
    name: 'Remittance',
    type: 'sub',
    icon: 'today',
    children: [
      { state: 'agent-remittance', name: 'Fulfillment', type: 'link' , accessId : ''},
      { state: 'agent-remittance-history', name: 'History', type: 'link' , accessId : ''},
      { state: 'agent-sendmoney', name: 'Send Money', type: 'link', accessId : '' },

    ],
  },
  {
    state: 'payee',
    name: 'Payee',
    type: 'link',
    icon: 'people',
  },
  {
    state: 'agent-view-contract',
    name: 'Contracts',
    type: 'link',
    icon: 'poll',
  },
  {
    state: 'agent-deal',
    name: 'View Deals',
    type: 'link',
    icon: 'today',
  },

  {
    state: '',
    name: 'Account',
    type: 'saperator',
    icon: 'av_timer',
  },
  {
    state: 'agent-login',
    name: 'Sign Out',
    type: 'click',
    icon: 'logout',
  },
  
];
const CORP_MENUITEMS = [
  {
    state: '',
    name: 'Remittance',
    type: 'saperator',
    icon: 'av_timer',
  },

  {
    state: 'corporate-dashboard',
    name: 'Dashboard',
    type: 'link',
    icon: 'av_timer',
  },
  {
    state: 'payee',
    name: 'Remittance',
    type: 'sub',
    icon: 'payment',
    children: [
      {name:'Send Money (Contract)',state:'agent-sendmoney',type:'link', accessId : ''},
      {name:'Send Money (Deal)',state:'corporate-deal-sendmoney',type:'link', accessId : ''},
      {name:'All Transaction',state:'all-transactions',type:'link', accessId : ''}
    ]
  },
  {
    state: 'agent-view-contract',
    name: 'Contracts',
    type: 'link',
    icon: 'today',
  },
  {
    state: 'payee',
    name: 'Payee',
    type: 'link',
    icon: 'people',
  },
  // {
  //   state: 'exchange-rate',
  //   name: 'Rates',
  //   type: 'link',
  //   icon: 'rate_review',
  // },

  {
    state: '',
    name: 'Account',
    type: 'saperator',
    icon: 'av_timer',
  },
  {
    state: 'business-login', 
    name: 'Sign Out',
    type: 'click',
    icon: 'logout',
  },

  // {
  //   state: 'promotions',
  //   name: 'Promotions',
  //   type: 'link',
  //   icon: 'local_offer',
  // }
]



@Injectable()
export class MenuItems {
  constructor(private store: InMemoryCache) {
  }

 
  getMenuitem(): Menu[] {
    const userRole =  sessionStorage.getItem('USER_ROLE');
    const userBusiness =   this.store.getItem('MONEY_CHANGER_BUSINESS') ;
    if (userRole && userRole === roleIdDetails.CONSUMER) { // consumer - 111
      let appStatus = this.store.getItem('APPLICATIONSTATUS')
      return CUST_MENUITEMS;
    } else if(userRole && userRole === roleIdDetails.AGENT){ // agent-888
      return AGT_MENUITEMS;
    }else if(userRole && userRole === roleIdDetails.CORPORATE_OWNER){ // corporate 555 - owner.
      return CORP_MENUITEMS
    }else if(userRole && userRole === roleIdDetails.CORPORATE_RUNNER){ // corporate 556 - runner
      return CORP_MENUITEMS
    }else if(userRole && userRole === roleIdDetails.CORPORATE_DEALER){ // corporate 557 - dealer
      return CORP_MENUITEMS
    }
    //backoffice
    else {
      const accessControlDtl = this.store.getItem('ACCESS_CONTROLS_ARRAY');

      if (accessControlDtl) {
        const arrayOfObjects = JSON.parse(accessControlDtl);
        // Extract valid accessIds from arrayOfObjects
        const validAccessIds = arrayOfObjects.map((item: any) => item.accessId);


        if (userBusiness == "Remittance") {
          // Filter and modify EMP_MENUITEMS based on valid accessIds
          const filteredRemittanceMenuItems = EMP_REM_MENUITEMS.map(menuItem => {
            if (menuItem.children) {
              menuItem.children = menuItem.children.filter(child => {
                // Check if the child's accessId is in the list of valid accessIds
                return validAccessIds.includes(child.accessId);
              });

              return menuItem.children.length > 0 ? menuItem : null;
            }
            else {
              return menuItem;
            }
          }).filter(item => item !== null) as Menu[];
          return filteredRemittanceMenuItems;
        }
        //userBusiness == "Money changer"
        else {
          // Filter and modify EMP_MC_MENUITEMS based on valid accessIds
          const filteredMoneyChangerMenuItems = EMP_MC_MENUITEMS.map(menuItem => {
            if (menuItem.children) {
              menuItem.children = menuItem.children.filter(child => {
                // Check if the child's accessId is in the list of valid accessIds
                return validAccessIds.includes(child.accessId);
              });

              return menuItem.children.length > 0 ? menuItem : null;
            }
            else {
              return menuItem;
            }
          }).filter(item => item !== null) as Menu[];
          return filteredMoneyChangerMenuItems;
          //for time being this code (COMMENTED ON 19 Dec 2023) ..
        // const filteredMoneyChangerMenuItems = EMP_MC_MENUITEMS ;
          //return filteredMoneyChangerMenuItems;
        }

      }


//if no access control dtls received ,for handling this issue 
      else {
        if (userBusiness == "Remittance") {
          return EMP_REM_MENUITEMS;
        }
        else {
          return EMP_MC_MENUITEMS;
        }
      }




    }
  }
     
  

}


