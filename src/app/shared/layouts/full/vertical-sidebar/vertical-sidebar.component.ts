import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from 'src/app/shared/menu-items/menu-items';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { LogoutConfirmationDialogComponent } from 'src/app/shared/modals/logoutconfirmationdialog/logout-confirmation-dialog/logout-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-vertical-sidebar',
  templateUrl: './vertical-sidebar.component.html',
  styleUrls: [],
})
export class VerticalAppSidebarComponent implements OnDestroy {
  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;
  logo = 'assets/images/logo1.jpg'
  @Input() showClass: boolean = false;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _mobileQueryListener: () => void;
  status = true;
  showMenu = '';
  itemSelect: number[] = [];
  parentIndex = 0;
  childIndex = 0;
  productName : string = "";

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  subclickEvent(): void {
    this.status = true;
  }
  scrollToTop(): void {
    document.querySelector('.page-wrapper')?.scroll({
      top: 0,
      left: 0,
    });
  }

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems, private router: Router,
    private store: InMemoryCache, private authService: AuthenticationService,private dialog : MatDialog
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);

     this.productName = this.store.getItem('PRODUCT_CODE_BIZ') ? this.store.getItem('PRODUCT_CODE_BIZ') : "";
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


  getMenuItemsByRole() {

  }

  handleNotify() {
    if (window.innerWidth < 1024) {
      this.notify.emit(!this.showClass);
    }
  }
  handleSignOut(menuitem : any){
    if(menuitem.name == "Sign Out"){
      this.dialog.open(LogoutConfirmationDialogComponent,{
        width: '460px',
      })
       }
     }
  logout() {
    this.authService.logout()

  }

  //rendering product name either its money changer or remittance 
  renderProductName():string{
    if(this.productName == "MC"){
     return "MoneyAny" ;
    }else{
      return "RemitAny" ;
    }
  }


}
