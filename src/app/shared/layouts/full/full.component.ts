import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AfterContentChecked, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MenuItems } from '../../menu-items/menu-items';

import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from '../../services/cache.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationDialogComponent } from '../../modals/logoutconfirmationdialog/logout-confirmation-dialog/logout-confirmation-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { roleIdDetails } from 'src/assets/userrole';
import { WindowManagementService } from '../../services/popupwindow.service';
import { MatSidenav } from '@angular/material/sidenav';

/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: [],
  animations: [
    trigger('imageState', [
      state('clicked', style({ transform: 'scale(0.9)' })),
      transition('* => clicked', animate('200ms')),
    ]),
  ],
})
export class FullComponent implements OnDestroy, AfterContentChecked , OnInit {
  mobileQuery: MediaQueryList;
  imageAnimationState: 'normal' | 'clicked' = 'normal';
  showSettings : Boolean = true ;
  dir = 'ltr';
  dark = false;
  minisidebar = false;
  boxed = false;
  horizontal = false;
  title = '';
  green = false;
  blue = false;
  danger = false;
  showHide = false;
  url = '';
  sidebarOpened = false;
  inventorySidebarOpened = false ;
  status = false;
  invStatus = true ;
  staticMessage : Boolean = true;
  showLogoutButton !: Boolean ;
  logo = 'assets/images/logo1.jpg';
  showChatBotWidget = false ;

  public showSearch = false;
  showShortCutMenu = false ;
  showRemittanceShortCutMenu = false ;
  public config: PerfectScrollbarConfigInterface = {};
  // tslint:disable-next-line - Disables all
  private _mobileQueryListener: () => void;
  showMoneyChangerLinks = false ;
  showRemittanceLinks = false ;
  businessType : string = "" ;
  moneyChangerShortCutLinksArray = [
    { icon : "chrome_reader_mode" , displayLink : "Inventory" , toolTipMessage: "Open Stock Inventory Window"},
    { icon : "attach_money" , displayLink : "Buy/Sell" , toolTipMessage: "Open Add Transaction Window"},
    { icon : "add" , displayLink : "Deal" , toolTipMessage: "Go to Add Deal"},
    { icon : "list_alt" , displayLink : "Deal Listings" , toolTipMessage: "Go to Deal Listings"},
    { icon : "people" , displayLink : "Customer Accounts" , toolTipMessage: "Go to Customer Accounts"},
    { icon : "table_chart" , displayLink : "Customer" , toolTipMessage: "Go to Customer Search"},
  ] ;
  remittanceShortCutLinksArray = [
    { icon : "event" , displayLink : "Exchange Rate" },
    { icon : "list_alt" , displayLink : "Deals" },
    { icon : "attach_money" , displayLink : "Contracts" },
    { icon : "table_chart" , displayLink : "Customers" },
  ];
  @ViewChild('rightsnav') rightsnav!: MatSidenav;

  constructor(
    public router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,private store : InMemoryCache,
    private authService: AuthenticationService,private headerService : TitleHeaderService,private cdr: ChangeDetectorRef,private dialog : MatDialog ,
    private windowManagementService : WindowManagementService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 1100px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);
    // this is for dark theme
    // const body = document.getElementsByTagName('body')[0];
    // body.classList.toggle('dark');
    this.dark = true;
    this.headerService.title.subscribe(title => {
      this.title = title;
    });
  }
  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }
  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  clickEvent(): void {
    this.status = !this.status;
  }

  //MC > Right side panel open for Inventory
  toggleRightSNav(){
    this.rightsnav.toggle()
    if(this.rightsnav.opened == true){ //side nav opened
     console.log("Inventory side nav is opened")
     this.invStatus = true ;
    }
    else{ //sidenav is closed
      console.log("Inventory side nav is closed")
      this.invStatus = false ;
    }
  }

  darkClick() {

    const body = document.getElementsByTagName('body')[0];
    body.classList.toggle('dark');

  }
  controlPosition(){
    let role : string = this.store.getItem('USER_ROLE');
    switch(role){
     case  `${roleIdDetails.CONSUMER}` :  //consumer
     return 'left';
      case `${roleIdDetails.AGENT}` :  //agent
        return 'center';
        case `${roleIdDetails.CORPORATE_OWNER}` :  //corporate owner - 555
        return 'center';
        case `${roleIdDetails.CORPORATE_RUNNER}` :  //corporate runner - 556
        return 'center';
        case `${roleIdDetails.CORPORATE_DEALER}` :  //corporate dealer - 557
        return 'center';
        default :       //backoffice
        return 'center' ;
    }
  }
   ngOnInit(): void {

    let role : string = this.store.getItem('USER_ROLE');
    //Retrieve what business it is ;
    this.businessType = this.store.getItem('PRODUCT_CODE_BIZ') ? this.store.getItem('PRODUCT_CODE_BIZ') : "";
    if(role == roleIdDetails.CORPORATE_OWNER || role == roleIdDetails.CORPORATE_RUNNER || role == roleIdDetails.CORPORATE_DEALER){ //Corporate user - 555 - owner , 556-runner , 557-dealer      this.staticMessage = true;
      this.showSettings = true ;
      this.showLogoutButton = false ;
    }
   else if(role == roleIdDetails.CONSUMER){    //consumer users - 111
    this.staticMessage = false;
    this.showSettings = true ;
    this.showLogoutButton = false ;
    }
    else if(role == roleIdDetails.AGENT){   //Agent users -888
      this.staticMessage = true;
      this.showSettings = false ;
      this.showLogoutButton = false ;
    }
    else{   //backoffice users
      this.staticMessage = true;
      this.showSettings = false ;
      this.showLogoutButton = true ;
      if(this.businessType == "MC"){
        this.showMoneyChangerLinks = true ;
      }
      else if (this.businessType == "RT"){
        this.showRemittanceLinks = true ;
      }
    }

    //CHECK SCREEN WIDTH
  this.checkScreenWidth(this.businessType);

   }

  logout() {
   this.dialog.open(LogoutConfirmationDialogComponent,{
    width: '460px',
   })

  }
  navigateCustomerDashboard(){
    this.router.navigate(['dashboard/custdash']);
  }

  goToHomePage(){
    this.imageAnimationState = 'clicked';
    let userBusiness : string = this.store.getItem('MONEY_CHANGER_BUSINESS');
    let role : string = this.store.getItem('USER_ROLE');
    if(role == roleIdDetails.CORPORATE_OWNER || role == roleIdDetails.CORPORATE_RUNNER || role == roleIdDetails.CORPORATE_DEALER){ //Corporate user - 555 - owner , 556-runner , 557-dealer
      this.router.navigate(['/profile/corporate-dashboard']) ;
     }
     else if(role == roleIdDetails.CONSUMER){    //consumer users -111
       this.router.navigate(['dashboard/custdash']) ;
     }
     else if(role == roleIdDetails.AGENT){   //Agent users -888
       this.router.navigate(['dashboard/agent']) ;
     }
     else{              //Backoffice users    
      if(userBusiness == "Remittance"){
        this.router.navigate(['/dashboard/empdash']) ;
      }   
      else if(userBusiness == "Money Changer"){
        this.router.navigate(['/moneychanger/dashboard']) ;
      }          
     }

    setTimeout(() => {
      this.imageAnimationState = 'normal';
    }, 200);
  }


  //Shortcut links for Backoffice MoneyChanger
  openShortCutLink(displayLink:string){
    if(displayLink == "Inventory"){
      console.log("Open stock inventory window");
      this.windowManagementService.openStockInventoryWindow() ;
    }
    else if(displayLink == "Buy/Sell"){
      console.log("add transaction window") ;
      this.windowManagementService.openAddTransactionWindow() ;

    }
    else if(displayLink == "Deal"){
      console.log("add deal screen") ;
      this.windowManagementService.openAddDealWindow() ; //can open multiple add deal windows as like buy/sell .

    }
    else if(displayLink == "Deal Listings"){
      console.log("deal listing window") ;
      this.windowManagementService.openDealListingWindow() ;
    }
    else if(displayLink == "Customer Accounts"){
      this.windowManagementService.openCustomerAccountsWindow() ;
    }
    else if(displayLink == "Customer"){
      // this.router.navigate(['/customer/table']) ;
      this.windowManagementService.openRtCustomer() ;
    }
   

    

  }


  //Shortcut links for Backoffice Remittance
  openRemittanceShortCutLink(displayLink : string){
    if(displayLink == "Exchange Rate"){
     // this.router.navigate(['/daily-setup/exchange-rate']) ;
      this.windowManagementService.openRtExchangeRate() ;
    }
    else if(displayLink == "Deals"){
     // this.router.navigate(['/daily-setup/deal-history']) ;
      this.windowManagementService.openRtDeals() ;

    }
    else if(displayLink == "Contracts"){
      // this.router.navigate(['/daily-setup/deal-history']) ;
       this.windowManagementService.openRtContractListing() ;
     }
    else if(displayLink == "Customers"){
    //  this.router.navigate(['/daily-setup/deal-history']) ;
      this.windowManagementService.openRtCustomer() ;

    }
  }


@HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    let businessType = this.businessType ;
    this.checkScreenWidth(businessType);
  }

checkScreenWidth(businessType:string) {
  if(businessType == "MC"){
  const screenWidth = window.innerWidth;
  this.showShortCutMenu = screenWidth < 1570;
  this.showMoneyChangerLinks = screenWidth > 1570 ;
  }
  else if (businessType == "RT"){
    const screenWidth = window.innerWidth;
    this.showRemittanceShortCutMenu = screenWidth < 1475;
    this.showRemittanceLinks = screenWidth > 1475 ;
  }
}


}
