import { Component,HostListener, OnInit, Pipe, PipeTransform } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';

import moment from 'moment';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { ViewManagementReportConfirmationDialogComponent } from 'src/app/backoffice/shared/modals/view-management-report-confirmation-dialog/view-management-report-confirmation-dialog.component';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MoneyChangerReportsService } from 'src/app/core/services/mcreports.service';


import { getTransactionBgcolorMoneyChanger, getTransactionColorMoneyChanger } from 'src/assets/transactionstatus';


@Pipe({name: 'keys'})
export class TransactionReportKeysPipe implements PipeTransform {
  transform(value: any, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push(key);
    }
    return keys;
  }
}

@Component({
  selector: 'app-transaction-reports',
  templateUrl: './transaction-reports.component.html',
  styleUrls: ['./transaction-reports.component.scss','../../../../assets/styles/tables/table-style.scss',
    '../../../../assets/styles/buttons/button.scss'
  ],

})
export class TransactionReportsComponent implements OnInit {
  transactionListings : any[] = [] ;
  isActive = false;
  p: number = 1;
  itemsPerPage: number = 20;
  loader : Boolean = false ;
  public getScreenWidth: any;
  public getScreenHeight: any;
  public filterForm : FormGroup = Object.create(null);
  xpandStatus = false ;
  typeList : any[] = [
    {"value" : "" , "description" : "--Select--"},
    {"value" : "B" , "description" : "BUY"},
    {"value" : "S" , "description" : "SELL"},
  ];
  statusList : any[] = [
    {"value" : "" , "description" : "--Select--"},
    {"value" : "1" , "description" : "INITIATED"},
    {"value" : "2" , "description" : "CANCELLED"},
  ];
  searchCustomerName !: string ;
  filterValues : any[] = [];
  minStartDate : Date = new Date(2025, 0, 1); 
  maxStartDate!: Date;
  minEndDate!: any;
  maxEndDate!: any;
  validateEndDate: any;
  validateStartDate: any;
  dateGt : any;
  dateLt : any ;
  retrievedReportsData = false ;
  noReportsData = true ;
// added suspicious Array of objects.
  suspiciousList : any[] = [
    {"value" : "" , "description" : "--Select--"},
    {"value" : "Y" , "description" : "YES"},
    {"value" : "N" , "description" : "NO"},
  ];
  constructor(private titleService : TitleHeaderService, 
    private dialog : MatDialog, private transactionReportService: MoneyChangerReportsService, private fb : FormBuilder,
    ) { }

       //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  changeTableHeight(){
    return { 'height': (this.getScreenHeight - 254 )+'px' , 'overflow-y' : 'auto' }; 
  }
  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  ngOnInit(): void { this.titleService.setTitle('Transaction Reports') ;
    this.filterForm = this.fb.group({
      ccyCode : [null],
      custName : [null],
      buySellInd : [null],
      status : [null],
      startDate: [null,Validators.compose([Validators.required])],
      endDate: [null,Validators.compose([Validators.required])],
      suspicious : [null]

    });

  
   

    this.onLoadFiltersSetup();

    //call initiall service..transaction report api (for now used transaction inquiry API)
    this.callTransactionReportAsData('', '', '', '','1', this.dateGt, this.dateLt,'');

      //getScreenWidth and getScreenHeight will get the windows inner height and width.
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
  
  }


  callTransactionReportAsData(currencyCode:string,customerId:string, customerName:string, buySellInd:string, 
    transactionStatus:string, dateGt:any, dateLt:any, isSupicious:string){
    this.loader = true;
    // getting value of isSuspicious from filter form.
    isSupicious = this.filterForm.controls['suspicious'].value ? this.filterForm.controls['suspicious'].value : "";
     this.transactionReportService.getTransactionReportsAsData(currencyCode, customerId, customerName, buySellInd, 
       dateGt, dateLt, transactionStatus,isSupicious ).subscribe((datas:any)=>{
        this.transactionListings = datas['data'] ;
        if(this.transactionListings.length >= 1){
          this.retrievedReportsData = true ;
          this.noReportsData = false ;
        }
        else{
          this.retrievedReportsData = false ;
          this.noReportsData = true ;
        }
        this.loader = false;
     },
     (error:any)=>{
      this.loader = false;
      this.transactionListings = [] ;
      if(this.transactionListings.length >= 1){
        this.retrievedReportsData = true ;
        this.noReportsData = false ;
      }
      else{
        this.retrievedReportsData = false ;
        this.noReportsData = true ;
      }

      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data : { errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
     }
     )
  }


  callTransactionReportAsPdf(currencyCode:string,customerId:string, customerName:string, buySellInd:string, 
    transactionStatus:string, dateGt:any, dateLt:any, isSupicious:string){
    this.loader = true;
    // getting value of isSuspicious from filter form.
    isSupicious = this.filterForm.controls['suspicious'].value ? this.filterForm.controls['suspicious'].value : "";
     this.transactionReportService.getTransactionReportsAsPDF(currencyCode, customerId, customerName, buySellInd, 
       dateGt, dateLt, transactionStatus,true,isSupicious,false).subscribe((datas:ArrayBuffer)=>{
        this.loader = false;

         // Handle the ArrayBuffer data here
      const blob = new Blob([datas], { type: 'application/pdf' });

      // Create a File with a specified filename
      const filename = `Transaction-report.pdf` ;

      const file = new File([blob], filename, { type: 'application/pdf' });

      // Create a data URL from the File
      const url = URL.createObjectURL(file);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name; // Ensures correct file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Cleanup the blob URL to free memory
      URL.revokeObjectURL(url);

      // Open the PDF in a new tab or download as needed
      // window.open(url);

     },
     (error:any)=>{
      this.loader = false;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data : { errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
     }
     )
  }


  public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateEndDate = event.value._d;
  
  }
  public onStartDateChange(event: MatDatepickerInputEvent<any>): void {// Changed to 1 year
    this.validateStartDate = event.value._d;
    this.minEndDate = this.validateStartDate  //max end date is 8 days and exclude sat and sun
    this.maxEndDate = new Date(this.minEndDate.getTime() + 365 * 24 * 60 * 60 * 1000);
  }


  onLoadFiltersSetup(){

    this.filterValues = [] ;
    this.filterForm.patchValue({
      ccyCode : "",
      custName : "",
      buySellInd : "",
      status : "1",
      suspicious : "N"
    });

     //pushing txn status 
     this.filterValues.push({"fieldName":"Status","value": "INITIATED"});


      this.minEndDate = new Date() //max end date is 7 days and exclude sat and sun
      this.maxEndDate = new Date(this.minEndDate.getTime() + 31 * 24 * 60 * 60 * 1000);
  
      // Patch one month difference for both start date and end date
      const todayFormatted = new Date();
      // const date = new Date();
      // date.setDate(date.getDate() - 7); 
      
      this.filterForm.controls.startDate.setValue(todayFormatted);
      this.filterForm.controls.endDate.setValue(todayFormatted);
  
      var start_date: any = moment(this.filterForm.controls.startDate.value);
      var end_date: any = moment(this.filterForm.controls.endDate.value)
  
       // Use toLocaleDateString to format the date as "dd/mm/yyyy"
       let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
       let patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
       let patchEndDate = end_date._d.toLocaleDateString('en-GB', options);
  
       var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
       var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };
   
       this.filterValues.push(obj1);
       this.filterValues.push(obj2); //

       //pushing suspicious 
        let supiciousValue = this.filterForm.controls['suspicious'].value ? this.filterForm.controls['suspicious'].value : "" ;
        let supiciousDesc = this.suspiciousList.filter(v => v.value == supiciousValue) ;
        this.filterValues.push({"fieldName":"Suspicious","value": supiciousDesc ? supiciousDesc[0].description : "" });
  
       var start_date: any = moment(this.filterForm.controls.startDate.value);
       var end_date: any = moment(this.filterForm.controls.endDate.value)
       this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
       this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
  }



  searchFilter(){
    this.xpandStatus = false ;

    this.dialog.open(ViewManagementReportConfirmationDialogComponent,{
       width : "500px"
    }).afterClosed().subscribe((response:any)=>{
      console.log(response)

      this.filterValues = [] ;

      let ccyCode = this.filterForm.controls['ccyCode'].value ? this.filterForm.controls['ccyCode'].value : "" ;
      let customerName = this.filterForm.controls['custName'].value ? this.filterForm.controls['custName'].value : "" ;
      let buySellInd = this.filterForm.controls['buySellInd'].value ? this.filterForm.controls['buySellInd'].value : "" ;
      let status = this.filterForm.controls['status'].value ? this.filterForm.controls['status'].value : "" ;
      //handling start date and end date 
      var start_date: any = moment(this.filterForm.controls.startDate.value);
      var end_date: any = moment(this.filterForm.controls.endDate.value);
      this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
      this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

      // Use toLocaleDateString to format the date as "dd/mm/yyyy"
      let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      let patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
      let patchEndDate = end_date._d.toLocaleDateString('en-GB', options);

      
    if(patchStartDate == 'NaN-NaN-NaN'){
      patchStartDate = "" ;
    }
    if(patchEndDate == 'NaN-NaN-NaN'){
      patchEndDate = "" ;
    }
     // Check each variable and add non-empty ones to the filter values array

      if (ccyCode !== "") {
        this.filterValues.push({"fieldName":"Currency Code","value":ccyCode});
      }
      if (customerName !== "") {
        this.filterValues.push({"fieldName":"Customer Name","value":customerName});
      }
      if (buySellInd !== "") {
        let filteredTypeList = this.typeList.filter(v => v.value == buySellInd) ;
        let typeDescription = filteredTypeList[0].description ;
        this.filterValues.push({"fieldName":"Type","value":typeDescription});
      }
      if (status !== "") {
        let filteredStatusList = this.statusList.filter(v => v.value == status) ;
        let statusDescription = filteredStatusList[0].description ;
        this.filterValues.push({"fieldName":"Status","value":statusDescription});
      }
      //pushing dates
      var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
      var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };

      this.filterValues.push(obj1);
      this.filterValues.push(obj2);
      //pushing suspicious 
      let supiciousDesc = [] ;
      let supiciousValue = this.filterForm.controls['suspicious'].value ? this.filterForm.controls['suspicious'].value : "" ;
      if(supiciousValue != ""){
        supiciousDesc = this.suspiciousList.filter(v => v.value == supiciousValue) ;
        this.filterValues.push({"fieldName":"Suspicious","value": supiciousDesc ? supiciousDesc[0].description : "" });
      }

      if(response && response.action == "VIEW"){
    this.callTransactionReportAsData(ccyCode,'',customerName, buySellInd, status, this.dateGt, this.dateLt , '') ;
  }

  else if(response && response.action == "SAVE"){
    this.callTransactionReportAsPdf(ccyCode,'',customerName, buySellInd, status, this.dateGt, this.dateLt, '') ;
  }

  else if(response && response.action == "XLSX"){
    this.callTransactionReportAsExcel(ccyCode,'',customerName, buySellInd, status, this.dateGt, this.dateLt, '') ;
  }
})



  }


  resetFilter(){
    this.xpandStatus = false ;
    this.searchCustomerName = "";
   this.onLoadFiltersSetup() ;
   this.callTransactionReportAsData('', '', '', '','1', this.dateGt, this.dateLt,'');
  }

    //STATUS color diff
 getColor(status: any) {
  return getTransactionColorMoneyChanger(status)
}
//bg color for status tags .
getBackgroundColor(status: string): string {
 return getTransactionBgcolorMoneyChanger(status);
  
}
  callTransactionReportAsExcel(currencyCode:string,customerId:string, customerName:string, buySellInd:string, 
    transactionStatus:string, dateGt:any, dateLt:any, isSupicious:string){
      this.loader = true;
    // getting value of isSuspicious from filter form.
    isSupicious = this.filterForm.controls['suspicious'].value ? this.filterForm.controls['suspicious'].value : "";
     this.transactionReportService.getTransactionReportsAsPDF(currencyCode, customerId, customerName, buySellInd, 
       dateGt, dateLt, transactionStatus,false,isSupicious,true).subscribe((datas:ArrayBuffer)=>{
        this.loader = false;

        // Handle the ArrayBuffer data here
         const blob = new Blob([datas], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                  
        // Create a filename for the XLSX file
        const filename = `Transaction-report.xlsx`;

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

        // Open the PDF in a new tab or download as needed
        // window.open(url);
     },
     (error:any)=>{
      this.loader = false;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data : { errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
     }
     )
  }
}
