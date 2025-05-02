import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import moment from 'moment';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { ViewManagementReportConfirmationDialogComponent } from 'src/app/backoffice/shared/modals/view-management-report-confirmation-dialog/view-management-report-confirmation-dialog.component';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MoneyChangerAccountsService } from 'src/app/core/services/mcaccounts.service';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import {  CommonSearchFilterCard} from 'src/assets/styles/tables/table-styles';

@Component({
  selector: 'app-inventory-history',
  templateUrl: './inventory-history.component.html',
  styleUrls: ['./inventory-history.component.scss', '../../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]
})
export class InventoryHistoryComponent implements OnInit {
  loginResCounterType !: string;
  currencyNumber : any ;
  dateGt:any;
  dateLt:any;
  inventoryHistoryArray : any[] = [] ;
  loader : boolean = false ;
  p: number = 1;
  itemsPerPage = 20 ;
  isActive : Boolean = false;
  filterForm : FormGroup = Object.create(null);
  minStartDate : Date = new Date(2025, 0, 1); 
  minEndDate!: any;
  maxEndDate!: any;
  validateEndDate: any;
  validateStartDate: any;
  currencyName !: string ;
  ccyCode !: string;
  constructor(private titleHeaderService: TitleHeaderService,private store: InMemoryCache,
    private maintenanceService: MoneyChangerMaintenanceService,private dialog : MatDialog, private router:Router,
    private fb: FormBuilder, private accountsService :MoneyChangerAccountsService) { }


    public getScreenWidth: any;
    public getScreenHeight: any;
    //The HostListener is a Decorator used for listening to the DOM,
    // and It provides a handler method to run when that event occurs.
    @HostListener('window:resize', ['$event'])
    onWindowResize() {
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
    }
  
    changeTableHeight() {
      return { 'height': (this.getScreenHeight - 210) + 'px', 'overflow-y': 'auto' };
    }

    handlePageChange(event: any): void {
      this.p = event.pageIndex + 1;
    }

    
  ngOnInit(): void {
   
    this.titleHeaderService.setTitle('Inventory History') ;

    //getScreenWidth and getScreenHeight will get the windows inner height and width.
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;

    this.loginResCounterType = this.store.getItem('RESPONSE_COUNTER_TYPE') ? this.store.getItem('RESPONSE_COUNTER_TYPE') : "";
    this.currencyNumber = this.store.getItem('SELECTED_CCYNO') ? this.store.getItem('SELECTED_CCYNO') : "" ;
    this.currencyName = this.store.getItem('SELECTED_CCYNAME') ? this.store.getItem('SELECTED_CCYNAME') : "" ;
    this.ccyCode =  this.store.getItem('SELECTED_CCYCODE') ? this.store.getItem('SELECTED_CCYCODE') : "" ;
    this.filterForm = this.fb.group({
     "currencyName" : [null],
     "startDate": [null,Validators.compose([Validators.required])],
     "endDate": [null, Validators.compose([Validators.required])]
    })

    this.filterForm.patchValue({"currencyName":this.currencyName})

    //date on load should be start date = current date - one month and end date = current date
    const todayFormatted = new Date();
    const dateDifference = new Date(todayFormatted.getTime() - 30 * 24 * 60 * 60 * 1000); // startdate = current date - 30 days

    this.filterForm.controls.startDate.setValue(dateDifference);
    this.filterForm.controls.endDate.setValue(todayFormatted);
    this.dateGt = dateDifference.getFullYear() + "-" + (dateDifference.getMonth() + 1) + "-" + dateDifference.getDate();
    this.dateLt = todayFormatted.getFullYear() + "-" + (todayFormatted.getMonth() + 1) + "-" + todayFormatted.getDate();

    this.loader = true ;
    this.callInventoryHistoryService(this.dateGt, this.dateLt) ;

  }

  callInventoryHistoryService(dateGt:any, dateLt:any){
 //mapping currency number and counter type in inventory history API .
 this.maintenanceService.getInventoryHistory(this.loginResCounterType,this.currencyNumber,dateGt,dateLt).subscribe((datas:any)=>{
  this.loader = false;
  this.inventoryHistoryArray =  datas['data'] ;
  },
  (error:any)=>{
    this.loader = false ;
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent,{
        data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
      }) ;
    }
   }
  )
  }

  //search filter
  searchFilter(){
       this.dialog.open(ViewManagementReportConfirmationDialogComponent, {
          width: "500px",
          data : {isExcel : false}
        }).afterClosed().subscribe((response: any) => {
          console.log(response)
          if (response && response.action == "VIEW") {
            this.loader = true;
      var start_date: any = moment(this.filterForm.controls.startDate.value);
      var end_date: any = moment(this.filterForm.controls.endDate.value);
  
      //start date and end date format YYY-MM-DD - internally.
      this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
      this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

      this.callInventoryHistoryService(this.dateGt, this.dateLt);
          }
          else if (response && response.action == "SAVE") {
          this.loader = true
            var start_date: any = moment(this.filterForm.controls.startDate.value);
              var end_date: any = moment(this.filterForm.controls.endDate.value);
          
              //start date and end date format YYY-MM-DD - internally.
              this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
              this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
              this.accountsService.getCurrencyLedger(this.currencyNumber, this.dateGt, this.dateLt, true, false).subscribe((datas: ArrayBuffer)=>{
                this.loader = false;
                 // Handle the ArrayBuffer data here
                 const blob = new Blob([datas], { type: 'application/pdf' });
          
                 // Create a File with a specified filename
                 const filename = `${this.ccyCode} LEDGER-${this.dateGt}-${this.dateLt}.pdf` ;
           
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
          else if (response && response.action == "XLSX") {
            this.loader = true
              var start_date: any = moment(this.filterForm.controls.startDate.value);
                var end_date: any = moment(this.filterForm.controls.endDate.value);
            
                //start date and end date format YYY-MM-DD - internally.
                this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
                this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
                this.accountsService.getCurrencyLedger(this.currencyNumber, this.dateGt, this.dateLt, false, true).subscribe((datas: ArrayBuffer)=>{
                  this.loader = false;
                  const blob = new Blob([datas], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                  // Create a filename for the XLSX file
                  const filename =`${this.ccyCode} LEDGER`;
            
                 // Create a File object
                  const file = new File([blob], filename, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            
                  // Create a data URL from the File
                   const url = URL.createObjectURL(file);
            
                   const a = document.createElement("a");
                    a.href = url;
                    a.download = file.name; // Ensures correct file name
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
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

  }
)
  
    
  }

  public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateEndDate = event.value._d;

  }
  public onStartDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateStartDate = event.value._d;
    this.minEndDate = this.validateStartDate  //max end date is 8 days and exclude sat and sun
    this.maxEndDate = new Date(this.minEndDate.getTime() + 365 * 24 * 60 * 60 * 1000);
  }


  //go back to inventory screen
  goToInventory(){
    this.router.navigate(['moneychanger-inventory/search']);
  }

    //record level -> download transaction summary/ledger , only one day entry
  downloadLedgerFile(ccyNo:string, ccyCode:string, recordDate:any){
    console.log(ccyNo , ccyCode) ;
    this.loader = true ;
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


}
