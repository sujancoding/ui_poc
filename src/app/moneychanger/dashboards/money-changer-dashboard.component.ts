import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationStart, Router } from '@angular/router';
import moment from 'moment';
import { Subscription, interval } from 'rxjs';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';


@Component({
  selector: 'app-money-changer-dashboard',
  templateUrl: './money-changer-dashboard.component.html',
  styleUrls: ['./money-changer-dashboard.component.scss'],
  
})
export class MoneyChangerDashboardComponent implements OnInit, OnDestroy {
  isActive = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator
  p: number = 1;
  itemsPerPage: number = 20;
  stockListings : any[] = [] ; 
  loader : Boolean = false ;
  myDate:any = new Date;
  private subscription!: Subscription;
 // private readonly intervalTime = 10000; // 10 seconds
  counterType !: string ;
  staffUserName !: string ;
  branchStatus : string = "" ;
  private routerSubscription!: Subscription;
  isBranchOpen : boolean = false;
  branchOpenMessage = "Branch is Open" ;
  branchOpenHintMessage = "Branch closing was done successfully on the last business day" ;
  branchClosedMessage = "Branch is NOT Open" ;
  branchClosedHintMessage = "Branch closing was not done on the last business day" ;
  branchErrorMessage = "An Error occurred !" ;
  branchErrorHintMessage = "Please contact IT" ;

//  logo = 'assets/images/moneyanyicon.jpg' --> this image not used anywhere in this component

  constructor(private titleService : TitleHeaderService, private maintenanceService : MoneyChangerMaintenanceService,
    private dialog : MatDialog, private store : InMemoryCache, private _snackBar : MatSnackBar,private router : Router) { 

      this.routerSubscription = this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this._snackBar.dismiss(); // Close the snackbar on navigation
        }
      });

    }

  public getScreenWidth: any;
  public getScreenHeight: any;
  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  changeTableHeight(){
    return { 'height': (this.getScreenHeight - 239 )+'px' , 'overflow-y' : 'auto' }; 
  }
  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Dashboard') ;

    //getScreenWidth and getScreenHeight will get the windows inner height and width.
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;

    // Register this window with the main process if it's running in Electron
    if (window.electronAPI) {
      console.log("electron API trigger in dashboard") ;
     // window.electronAPI.registerWindow();
    }
    
    this.staffUserName =  this.store.getItem('USERNAME') ? this.store.getItem('USERNAME') : "Money Changer User";
    this.counterType = this.store.getItem('RESPONSE_COUNTER_TYPE') ? this.store.getItem('RESPONSE_COUNTER_TYPE') : "";
    this.loader=true;
    //calling the branch operation status API and check for branch close details..
    this.maintenanceService.branchOperationStatus().subscribe((data:any)=>{
      this.loader = false;
      //success case
      this.branchStatus = data?.isBranchClosed ; //"Y" or "N"
       if(data && data.isBranchClosed == "1"){ //Branch is Open
        this.isBranchOpen = true ;
       
       }
       else if(data && data.isBranchClosed == "2"){ //Branch is NOT Open
        this.isBranchOpen = false ;
       
       }
       else if(data && data.isBranchClosed == "3"){ //Today Branch is Closed
        this.isBranchOpen = false ;
        this.branchClosedHintMessage = "Branch is closed for current date"
       
       }
       else if(data && data.isBranchClosed == "4"){ //Transaction is not made for last 10 days
        this.isBranchOpen = false ;
        this.branchClosedHintMessage = "No transactions have been made in the last 10 days !"
       
       }
  
    },
    //error handling
    (error:any)=>{
      this.loader = false ;
      this.branchClosedMessage = this.branchErrorMessage ;
      this.branchClosedHintMessage = this.branchErrorHintMessage ;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
            data : error.error.errorMessage ? error.error.errorMessage : ""
        }) ;
      }
     }
  )

   // this.callStockInventoryApi(); //initiall call for one time ..

    // Set up the interval to call the API every two seconds
    // this.subscription = interval(this.intervalTime).subscribe(() => {
    //   this.callStockInventoryApi();
    // });
    
    
  }

  ngOnDestroy() {
    // Unsubscribe from router events to avoid memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // ngOnDestroy(): void {
  //   // Unsubscribe from the interval when the component is destroyed
  //   if (this.subscription) {
  //     this.subscription.unsubscribe();
  //   }
  // }

  // callStockInventoryApi(){
  //   this.loader = true ;
  //   this.maintenanceService.getStockInventoryInquiry(this.counterType,'').subscribe((datas:any)=>{
  //     this.stockListings = datas['data'] ;
  //     this.loader = false ;
  //   },
  //   (error:any)=>{
  //     this.loader = false ;
  //     if(error.status != 401){
  //       this.dialog.open(ErrorDialogAdminComponent) ;
  //     }
  //    }
  //   )
  // }


 
}
