import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { UpdateInventory } from 'src/app/core/model/mcmaintenance/mcmaintenance.model';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MoneyChangerAccountsService } from 'src/app/core/services/mcaccounts.service';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CommonSearchFilterCard} from 'src/assets/styles/tables/table-styles';
import { roleIdDetails } from 'src/assets/userrole';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss', '../../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]
})
export class InventoryComponent implements OnInit {

  public getScreenWidth: any;
  public getScreenHeight: any;
  isActive = false;
  p: number = 1;
  itemsPerPage: number = 20;
  stockListings : any[] = [] ; 
  loader : Boolean = false ;
  public filterForm : FormGroup = Object.create(null);
  counterTypeArray : any[] = [];
  // counterTypeEditArray : any[] = [
  //   {"value" : "W" , "description" : "Wholesale"},
  //   {"value" : "R" , "description" : "Retail"}
  // ];
  stockListingsBackup : any[] = [] ;
  searchCounterType !: string ;
  searchCurrencyCode !: string ;
  options: any[] = [];
  filteredOptions!: Observable<any[]>;
  loginResCounterType !: string ;
  userRole !: string ;

  constructor(private titleService : TitleHeaderService, private maintenanceService : MoneyChangerMaintenanceService,
    private dialog : MatDialog, private fb : FormBuilder, private store : InMemoryCache,private accountsService : MoneyChangerAccountsService,
    private router: Router) { }

  ngOnInit(): void {
    this.titleService.setTitle('Inventory') ;

    this.filterForm = this.fb.group({
      counterType : [null],
      currencyCode : [null]

    });

     //getScreenWidth and getScreenHeight will get the windows inner height and width.
     this.getScreenWidth = window.innerWidth;
     this.getScreenHeight = window.innerHeight;

     this.loginResCounterType = this.store.getItem('RESPONSE_COUNTER_TYPE') ? this.store.getItem('RESPONSE_COUNTER_TYPE') : "";
     this.userRole = this.store.getItem('USER_ROLE') ? this.store.getItem('USER_ROLE') : "" ;
     if(this.loginResCounterType == "W"){
      this.counterTypeArray = [
        {"value" : "W" , "description" : "Wholesale"},
      ]
     }
      if(this.loginResCounterType == "R"){
      this.counterTypeArray = [
        {"value" : "R" , "description" : "Retail"}
      ]
     }
     if(this.userRole == roleIdDetails.STAFF_OWNER){ //444
       this.counterTypeArray = [
        {"value" : "W" , "description" : "Wholesale"},
        {"value" : "R" , "description" : "Retail"}
       ];
     }

     this.filterForm.patchValue({
      counterType : this.loginResCounterType
     });
     
     //initially on load screen , to pull only Wholesale counter details
       this.callStockInventoryApi(this.loginResCounterType,'') ;
   
    
     
  }

  displayFn(inventory: any): string {
    return inventory && inventory.ccyCode ? inventory.ccyCode : '';
  }

  private _filter(ccyCode: string): any[] {
    const filterValue = ccyCode.toLowerCase();

    return this.options.filter(option => option.ccyCode.toLowerCase().includes(filterValue));
  }
  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  changeTableHeight(){
    return { 'height': (this.getScreenHeight - 210 )+'px' , 'overflow-y' : 'auto' }; 
  }
  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  //search filter 
  searchFilter(){
    console.log("Search filter triggered") ;
    this.searchCounterType = this.filterForm.controls['counterType'].value ? this.filterForm.controls['counterType'].value : "" ;
    if(this.filterForm.controls['currencyCode'].value != null){
      this.searchCurrencyCode = this.filterForm.controls['currencyCode'].value.ccyCode ? this.filterForm.controls['currencyCode'].value.ccyCode : this.filterForm.controls['currencyCode'].value ;
      this.searchCurrencyCode = this.searchCurrencyCode ? this.searchCurrencyCode : "" ;
    }
    else if(this.filterForm.controls['currencyCode'].value == null){
      this.searchCurrencyCode = "" ;
    }
   
      this.callStockInventoryApi(this.searchCounterType, this.searchCurrencyCode);
   
  }

  callStockInventoryApi(counterType:string, ccyCode:string){
    this.loader = true ;
    setTimeout(() => {
      this.maintenanceService.getStockInventoryInquiry(counterType,ccyCode,'').subscribe((datas:any)=>{
        this.stockListings = datas['data'] ;
        this.options = this.stockListings.map(item => ({ccyCode : item.ccyCode})) ;
        this.filteredOptions = this.filterForm.controls['currencyCode'].valueChanges.pipe(
         startWith(''),
         map(value => {
           const ccyCode = typeof value === 'string' ? value : value?.ccyCode;
           return ccyCode ? this._filter(ccyCode as string) : this.options.slice();
         }),
       );
        this.loader = false ;
       this.stockListingsBackup = datas['data'] ;
       let backupSearch = JSON.stringify(this.stockListingsBackup) ;
       this.store.setItem('INVENTORY_LIST_BACKUP',backupSearch);
      },
      (error:any)=>{
        this.loader = false ;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent) ;
        }
       }
      )
    }, 400);
    
  }

  //edit specific stock record 
  onEdit(index:any){
    // Set edit mode for the specific item in the array
   this.stockListings[index].editMode = true;
   this.disableOtherRows(index);
  }

  //save edited record --> UNUSED FUNCTION SO FAR..
  // onUpdateRecord(index:any, record:any, ccyNo:any, counterType:string, currentStock:string, dealStock:string, avgCost:string){
  //   this.stockListings[index].editMode = false;
  //   //call update stock api 
  //   this.maintenanceService.updateStockInventory(ccyNo,this.buildUpdateStockPayload(counterType, currentStock, dealStock, avgCost)).subscribe((data:any)=>{
  //     this.searchCounterType = counterType ? counterType : "" ;
  //     this.searchCurrencyCode = this.searchCurrencyCode ? this.searchCurrencyCode : "" ;
  //     this.callStockInventoryApi(this.searchCounterType, this.searchCurrencyCode) ;
  //   },
  //   (error:any)=>{
  //     this.loader = false ;
  //     if(error.status != 401){
  //       this.dialog.open(ErrorDialogAdminComponent) ;
  //     }
  //    }
  //   )
  //   this.enableAllRows();
  // }

  //update stock payload object ;
  // buildUpdateStockPayload(counterType:string, currentStock:string, dealStock:string, avgCost:string):UpdateInventory{
  //   return new UpdateInventory({
  //     counter : counterType,
  //     currentStock : currentStock,
  //     dealStock : dealStock,
  //     avgCost : avgCost,
  //   })
  // }

  //disabling other rows except selected record
  disableOtherRows(index: number): void {
    this.stockListings.forEach((item, i) => {
      if (i !== index) {
        item.disable = true;
      }
    });
  }

  //enable all rows after saving
  enableAllRows(): void {
    this.stockListings.forEach(item => {
      item.disable = false;
    });
  }

   //reset specific deal item --> UNUSED FUNCTION SOR FAR..
  //  onResetRecord(index:any,id:string){
  //   let inventoryDetailBackup = this.store.getItem('INVENTORY_LIST_BACKUP') ? this.store.getItem('INVENTORY_LIST_BACKUP') : "" ;
  //   const arrayOfObjects = JSON.parse(inventoryDetailBackup);
  //   if(arrayOfObjects != ""){
  //     let listingsBackup = arrayOfObjects.filter((v:any) => v.id == id) ;
  //     //resetting counter type , current stock , deal stock and avg cost from backuplist
  //     this.stockListings[index].counterType = listingsBackup[0].counterType ;
  //     this.stockListings[index].currentStock = listingsBackup[0].currentStock ;
  //     this.stockListings[index].dealStock = listingsBackup[0].dealStock ;
  //     this.stockListings[index].avgCost = listingsBackup[0].avgCost ;
  //   }
  //   this.stockListings[index].editMode = false;
  //   this.enableAllRows();

  // }

  //record level -> download transaction summary/ledger , only one day entry
  downloadLedgerFile(ccyNo:string, ccyCode:string){
    console.log(ccyNo , ccyCode) ;
    this.loader = true ;
    let recordDate = new Date() ;
    let date : any = moment(recordDate) ;
    let creationDate = date._d.getFullYear() + "-" + (date._d.getMonth() + 1) + "-" + date._d.getDate();
    //ccyNo : string, startDate:any, endDate:any, exportFlag:boolean
    this.accountsService.getCurrencyLedger(ccyNo, creationDate, creationDate, true, false).subscribe((datas: ArrayBuffer)=>{
      this.loader = false;
       // Handle the ArrayBuffer data here
       const blob = new Blob([datas], { type: 'application/pdf' });

       // Create a File with a specified filename
       const filename = `${ccyCode} LEDGER-${recordDate}.pdf` ;
 
       const file = new File([blob], filename, { type: 'application/pdf' });
 
       // Create a data URL from the File
       const url = URL.createObjectURL(file);
 
       // Open the PDF in a new tab or download as needed
       window.open(url);
    },
    (error:any)=>{
      this.loader = false;
      if(error.status != 401){
        if(error.status == 500){
          // Decode the ArrayBuffer to JSON if it's an error response
          const textDecoder = new TextDecoder("utf-8");
          const errorText = textDecoder.decode(error.error);
          let errorMessage = "";
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.errorMessage || "An error occurred";
          } catch (e) {
            errorMessage = "An error occurred"; // Fallback in case JSON parsing fails
          }
          this.dialog.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : errorMessage ? errorMessage : "" }
          }) 
        }
        else{
          this.dialog.open(ErrorDialogAdminComponent) 
        }
      }
    }
    )
  }


  openCurrencyHistory(ccyNo:any, ccyName:string, ccyCode : string){
   console.log(ccyNo) ;
   this.store.setItem('SELECTED_CCYNO',ccyNo) ;
   this.store.setItem('SELECTED_CCYNAME',ccyName) ;
   this.store.setItem('SELECTED_CCYCODE',ccyCode)
   this.router.navigate(['moneychanger-inventory/search-history']);
  }


}
