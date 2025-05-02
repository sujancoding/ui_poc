import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { interval, Subscription } from 'rxjs';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

@Component({
  selector: 'app-inventory-vertical-sidebar',
  templateUrl: './inventory-vertical-sidebar.component.html',
  styleUrls: ['./inventory-vertical-sidebar.component.scss']
})
export class InventoryVerticalSidebarComponent implements OnInit, OnDestroy, OnChanges {
  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery!: MediaQueryList;
  private _mobileQueryListener: () => void;
  @Input() showClass: boolean = true;
  @Input() productType: string = "" ;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();
  stockListing: any[] = [];
  isActive = false;
  loader: Boolean = false;
  public getScreenWidth: any;
  public getScreenHeight: any;
  private subscription!: Subscription;
  private readonly intervalTime = 10000; // 10 seconds
  counterType !: string;
  counterTypeDescription !: string;
    
  constructor(changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private maintenanceService : MoneyChangerMaintenanceService, private dialog : MatDialog,
    private store: InMemoryCache) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  //On every change detection (sidenav open/close) -> below onChange lifecycle hook will be triggered and call API dynamically
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.showClass) ;
    if(this.showClass == true){  // Right side nav is opened
      if (this.productType === 'MC') { //Business should be MC
        this.counterType = this.counterType ? this.counterType : this.store.getItem('RESPONSE_COUNTER_TYPE');
        this.callStockInventoryApi(); // Initial call when opened
        this.subscription = interval(this.intervalTime).subscribe(() => { //Start periodic call for 10 secs
          this.callStockInventoryApi();
        });
      }
    }
    else{
      if (this.subscription) {  //right side nav is closed
        this.subscription.unsubscribe(); // Stop the interval
      }
    }
  }

  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  changeTableHeight() {
    return { 'height': (this.getScreenHeight - 94) + 'px', 'overflow-y': 'auto' };
  }
    
  ngOnInit(): void {
    //getScreenWidth and getScreenHeight will get the windows inner height and width.
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;

    this.counterType = this.store.getItem('RESPONSE_COUNTER_TYPE') ? this.store.getItem('RESPONSE_COUNTER_TYPE') : "";

    if (this.counterType == "W") {
      this.counterTypeDescription = "Wholesale"
    }
    else if (this.counterType == "R") {
      this.counterTypeDescription = "Retail"
    }
    else {
      this.counterTypeDescription = ""
    }

    if (this.productType === 'MC') { //Business should be MC
      this.callStockInventoryApi();
     }
  //   //onload service call
  //   if(this.productType == "MC"  && this.showClass){
  //   this.callStockInventoryApi(); //initiall call for one time ..
  //   // Set up the interval to call the API every two seconds
  //   this.subscription = interval(this.intervalTime).subscribe(() => {
  //     this.callStockInventoryApi();
  //   });
  // }
  }

  //parent to child interaction call...
  handleNotify() {
    if (window.innerWidth < 1024) {
      this.notify.emit(!this.showClass);
    }
  }

  //Component destroy
  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);

     // Unsubscribe from the interval when the component is destroyed
     if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  //get stock inventory inquiry api service call 
    callStockInventoryApi(){
      this.loader = true ;
      this.maintenanceService.getStockInventoryInquiry(this.counterType,'','').subscribe((datas:any)=>{
        this.stockListing = datas['data'];
        this.loader = false ;
      },
      (error:any)=>{
        this.loader = false;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
          }) ;
        }
       }
      )
    }

    //On click close icon in inventory table and pass data to parent component (i.e., full component)
  closeSideBar(){
    this.notify.emit(!this.showClass);
    if (this.subscription) {
      this.subscription.unsubscribe(); // Stop the interval
    }
    
  }
}
