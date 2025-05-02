import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, interval } from 'rxjs';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';


@Component({
  selector: 'app-inventory-window',
  templateUrl: './inventory-window.component.html',
  styleUrls: ['./inventory-window.component.scss'],
   
})
export class InventoryWindowComponent implements OnInit {
  stockListing : any[]= [] ;
  isActive = false;
  loader : Boolean = false ;
  public getScreenWidth: any;
  public getScreenHeight: any;
  private subscription!: Subscription;
  private readonly intervalTime = 10000; // 10 seconds
  counterType !: string ;
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
    return { 'height': (this.getScreenHeight - 5 )+'px' , 'overflow-y' : 'auto' }; 
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

      //onload service call
      this.callStockInventoryApi(); //initiall call for one time ..
         // Set up the interval to call the API every two seconds
  this.subscription = interval(this.intervalTime).subscribe(() => {
    this.callStockInventoryApi();
  });

  }

  

  ngOnDestroy() {
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
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
     }
    )
  }



}

