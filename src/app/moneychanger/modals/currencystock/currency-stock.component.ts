import {  Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, interval } from 'rxjs';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

@Component({
  selector: 'app-currency-stock',
  templateUrl: './currency-stock.component.html',
  styleUrls: ['./currency-stock.component.scss']
})
export class CurrencyStockComponent implements OnInit, OnDestroy {

  stockListing : any[]= [] ;
  isActive = false;
  p: number = 1;
  itemsPerPage: number = 20;
  loader : Boolean = false ;
  public getScreenWidth: any;
  public getScreenHeight: any;
  @Output() closeDrawerEvent = new EventEmitter<void>();
  private subscription!: Subscription;
  private readonly intervalTime = 10000; // 10 seconds
  counterType !: string ;
  @Output() childDataEvent = new EventEmitter<void[]>();
  counterTypeDescription !: string ;

  constructor(private maintenanceService : MoneyChangerMaintenanceService, private dialog : MatDialog,
    private store : InMemoryCache) { }

  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  changeTableHeight(){
    return { 'height': (this.getScreenHeight - 232 )+'px' , 'overflow-y' : 'auto' }; 
  }
  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  ngOnInit(): void {

      //getScreenWidth and getScreenHeight will get the windows inner height and width.
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;

      this.counterType = this.store.getItem('RESPONSE_COUNTER_TYPE') ? this.store.getItem('RESPONSE_COUNTER_TYPE') : "";

      if(this.counterType == "W"){
        this.counterTypeDescription = "Wholesale"
      }
      else if(this.counterType == "R"){
        this.counterTypeDescription = "Retail"
      }
      else{
        this.counterTypeDescription = ""
      }

  }

  

  ngOnDestroy() {
    // Unsubscribe from the interval when the component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  //this component acts as a drawer , when drawer toggles in and out , will trigger this function..
  onDrawerOpened(indicatorFromParent:boolean){
    if(indicatorFromParent == true){
      console.log('Drawer opened ');

      this.callStockInventoryApi(); //initiall call for one time ..
         // Set up the interval to call the API every two seconds
  this.subscription = interval(this.intervalTime).subscribe(() => {
    this.callStockInventoryApi();
  });
    }
    else if(indicatorFromParent == false){
      console.log('Drawer closed ');
      this.ngOnDestroy()

    }
  }


  //get stock inventory inquiry api service call 
  callStockInventoryApi(){
    this.loader = true ;
    this.maintenanceService.getStockInventoryInquiry(this.counterType,'','').subscribe((datas:any)=>{
      this.stockListing = datas['data'];
      this.childDataEvent.emit(this.stockListing);
      this.loader = false ;
    },
    (error:any)=>{
      this.loader = false;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
     }
    )
  }

 
  //close drawer
  closeDrawer() {
    this.ngOnDestroy() ;
    this.closeDrawerEvent.emit();
  }

}
