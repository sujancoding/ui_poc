import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { TransactionService } from 'src/app/core/services/transaction.service';

import { PipeTransform, Pipe } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ENTER ,COMMA} from '@angular/cdk/keycodes';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { ViewManagementReportConfirmationDialogComponent } from '../../shared/modals/view-management-report-confirmation-dialog/view-management-report-confirmation-dialog.component';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value: any, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push(key);
    }
    return keys;
  }
}
@Component({
  selector: 'app-reports-type',
  templateUrl: './reports-type.component.html',
  styleUrls: ['./reports-type.component.scss', '../../../../assets/styles/tables/table-style.scss',
    '../../../../assets/styles/buttons/button.scss'
  ],
  
})

export class ReportsTypeComponent implements OnInit {

  searchReport !: string;
  showCounts !: Boolean; 
  selectedReport !: string;
  loader : Boolean = false;
  isActive = false;
  disableFilter : Boolean = true;
  p: number = 1;
  itemsPerPage: number = 20;
  win = (window.screen.height - 250);
  rowData : any[] = [];
  reportDatas : any[] = [];
  headerData : any[] = [];
  form: FormGroup = Object.create(null);
  xpandStatus = false;
  selectedType !: string;
  selectable: boolean = true;
  selected!: Date | null;
  selectedEnddate !: Date | null;
  selectedStatus !: string;
  isDisabled : Boolean = true;
  public separatorKeysCodes = [ENTER, COMMA];
  public filteredArrayList : any[]= [];
  removable = true;
  selectedDayRange !: string;
  offers = [ 'Consumer' , 'Agent' ,  'Corporate' ];
  testObj : any = {};
  selectedOffer: any;
  searchResultsLabel : Boolean = false;
  enteredStartDate : any;
  enteredEndDate : any;
  currentDate = new Date();
  priorDateFor30Days = new Date(new Date().setDate(this.currentDate.getDate() - 30)); //from currenct date - 30 days
  priorDateFor15Days = new Date(new Date().setDate(this.currentDate.getDate() - 15)); //from currenct date - 15 days
  priorDateFor10Days = new Date(new Date().setDate(this.currentDate.getDate() - 10));  //from currenct date - 10 days
  reportName !: string;
  noReportsData : Boolean = false;
  selectedCustomerType : string = '';
  count : any;
  validateEndDate : any;
  validateStartDate : any;
  public getScreenWidth: any;
  public getScreenHeight: any;
  getReports: any[] = [];
  topCountries : Boolean = false;
  topCountryHeader : string[] = ['Country' , 'No Of Transactions' , 'Total Amount(SGD)'];
  topCurrencies : Boolean = false;
  topCurrencyHeader : string[] = ['Currency' , 'No Of Transactions' , 'Total Amount(SGD)'];
  retrievedReportsData : Boolean = true;
  filterValues: any[] = [];
  onLoadReportName : string = "" ;
  minStartDate : Date = new Date(2025, 0, 1); 
   maxStartDate!: Date;
   minEndDate!: any;
   maxEndDate!: any;
   disableDateField : Boolean = true ;
   showProfitLoss : boolean = true;
   isKycReport : boolean = false;
   custTypeArray : any[] = [
    { "DESCRIPTION": "Individual", "VALUE" : "I" },
    { "DESCRIPTION": "Corporate", "VALUE" : "C" },
    { "DESCRIPTION": "Agent", "VALUE" : "A" },
    { "DESCRIPTION": "All", "VALUE" : "" },
   ];
   customerSegmentArray : any[] = [] ;
   selectedCategoryType : string = "";

  constructor(private titleHeader : TitleHeaderService, private transactionService : TransactionService,
    private fb: FormBuilder,private store: InMemoryCache,private snackBar : MatSnackBar,private dialog : MatDialog) { }
    
  ngOnInit(): void {
    this.titleHeader.setTitle('Management Reports');
    this.form = this.fb.group({
      payeeName : [null,[Validators.pattern('^[a-zA-Z\. ]*$')]],
      payeePhoneNumber : [null,[Validators.maxLength(8)]],
      dayRange : [null],
      reportName : [null, [Validators.compose([Validators.required])]],
      startDate : [null,[Validators.compose([Validators.required])]],
      endDate : [null, [Validators.compose([Validators.required])]],
      customerType : [null],
      categoryType : [null]

    });
   
    // getting ACCESS_CONTROLS_ARRAY from store.
    let accessControlDtl = this.store.getItem('ACCESS_CONTROLS_ARRAY') ? this.store.getItem('ACCESS_CONTROLS_ARRAY') : "";
    let arrayOfObjects : any ;
    if (accessControlDtl != "") {
      // storing objects in arrayOfObjects
       arrayOfObjects = JSON.parse(accessControlDtl);
       // if arrayOfObjects contain accessID == "BPRL" and name ="REMITTANCE PROFIT-LOSS COLUMN" changing status of showProfitLoss as true.
      this.showProfitLoss= arrayOfObjects.some((item:any)=>{
        return item.accessId == "BRPL" && item.name == 'REMITTANCE PROFIT-LOSS COLUMN' ;
       }) ;
    }

    //get dropdown reports values from a service call

    this.transactionService.getManagementReportsDrpdownValues().subscribe((datas: any) => {
      let reports : any [] = datas['data'] ;
      reports = reports.filter(report => report.TYPE == "RTMANAGEMENT");
      // filter profit loss based on showProfitLoss
      if(this.showProfitLoss == false){
        this.getReports = reports.filter(report => report.VALUE !== "1" && report.VALUE !== "17"); //org p/l and p/l report
      }
      else {
        this.getReports = reports;
      }
    },
      //error handling completed in 01-06-2023
      (error: any) => {
        if (error.status != 401) {
          this.dialog.open(ErrorDialogAdminComponent);
        }
      }

    );


      //getScreenWidth and getScreenHeight will get the windows inner height and width.
     this.getScreenWidth = window.innerWidth;
     this.getScreenHeight = window.innerHeight;

     // call customer segement service...
     this.getKycCustomerSegmentListService();
  }
  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  tableHeight(){
    return { 'height': (this.getScreenHeight - 283)+'px' , 'overflow-y' : 'auto' };
  }
 
  
//! THIS FUNCTION IS UNUSED , WHOLE removeMatChips FUNCTION IS UNUSED !
  removeMatChips(data: any): void {
    this.store.setItem('FILTERED_DATA',data);
    if(data.substring(0,8) == 'end-date'){
     let sliceData = data.slice(11)
     data = sliceData;
    }
    if(data.substring(0,10) == 'start-date'){
      let sliceData = data.slice(13);
      data = sliceData;
      }
    //getObjKey function will help you to get the value based on key (data)
    function getObjKey(obj:any, value:any) {
      return Object.keys(obj).find(key => obj[key] === value);
    }
    console.log(getObjKey(this.testObj, data));
    
    if(getObjKey(this.testObj, data) == "dayRange"){
      this.form.patchValue({
        "dayRange" : ""
      })
    }
    if(getObjKey(this.testObj, data) == "startDate"){
      this.form.controls.startDate.reset();
    }
    if(getObjKey(this.testObj, data) == "endDate"){
      this.form.controls.endDate.reset();
    }
  
      if(this.store.getItem('FILTERED_DATA')){
        this.filteredArrayList.splice(this.filteredArrayList.indexOf(this.store.getItem('FILTERED_DATA')));
    }
    let startDate ;
    let endDate ;
    if(this.form.controls.startDate.value != null){
     startDate = this.form.controls.startDate.value.getFullYear() +"-" + (this.form.controls.startDate.value.getMonth()+1) + "-" + this.form.controls.startDate.value.getDate()
    }else{
      startDate = "";
    }
    if(this.form.controls.endDate.value != null){
      endDate = this.form.controls.endDate.value.getFullYear() +"-" + (this.form.controls.endDate.value.getMonth()+1) + "-" + this.form.controls.endDate.value.getDate()
     }else{
      endDate = "";
     }
    //service call
    this.loader = true;
    this.transactionService.getOnlineReports(this.reportName,startDate,endDate,this.selectedCustomerType,"" , "").subscribe((datas:any) =>{
      console.log(datas['data']);
      this.loader = false;
      this.reportDatas = datas['data'];
      this.count = this.reportDatas.length;
      if(this.reportDatas.length == 0){
        this.noReportsData = true;
      }
      else{
        this.noReportsData = false;
      }
    },//error handling done on 01/07/2023
    (error:any) => { 
      if(error.status != 401){
        const dialogRef = this.dialog.open(ErrorDialogAdminComponent,{
          data : {isReview : true}
        }) 
        dialogRef.afterClosed().subscribe(res => {
          this.loader = false;
          this.noReportsData = true;
          this.retrievedReportsData = false;
        }) 
        this.count = '0'
      }
  }  );
  }

  resetFilter(){
    this.xpandStatus = false;
    this.filterValues = [] ;
    this.form.patchValue({
      "dayRange" : "",
    });

    // Patch empty in all fields
    this.form.controls.startDate.setValue("");
    this.form.controls.endDate.setValue("");
      //service call - onLoad call org pl records
      this.loader = true;
      setTimeout(() => {
        this.loader = false;
        this.reportDatas = [];
        this.count = this.reportDatas.length;
        if(this.reportDatas.length == 0){
         this.noReportsData = true;
        }
        else{
         this.noReportsData = false;
        }
      }, 200);
  }


  //fetch functio 
  searchFilter(dayRange:any,reportName:string){ //report name will be like '1' | '2' ..


    this.dialog.open(ViewManagementReportConfirmationDialogComponent,{
      width : "500px"
    }).afterClosed().subscribe((response:any)=>{
      console.log(response)
      if(response && response.action == "VIEW"){
        console.log("Its View")
        this.loader = true;
    this.showCounts = true;
   // this.topConsumers = false;
   //  this.topAgents = false;
   // this.topCorporates = false;
    this.selectedCustomerType = '';
    this.xpandStatus = false //close expansion panel .
    this.filterValues = [] ; //clearing filter values array 

    //pushing report name 
    var reportNameArr =  this.getReports.filter(v => v.VALUE == reportName);
    let name = reportNameArr[0].TEXT ? reportNameArr[0].TEXT : "" ;
    var reportNameObj = { "fieldName": "Report Name", "value": name};
    this.filterValues.push(reportNameObj) ;

    //push customer type and catrgory type if its KYC report (VALUE).

    this.reportName = reportName; // eg : this.reportName = '1' ;
    this.searchReport = reportName;  // eg : this.searchReport = '1' ;
    //}

    if(this.isKycReport){
      // pushing customer Type
      this.selectedCustomerType = this.form.controls['customerType'].value ? this.form.controls['customerType'].value : ""
     let array = this.custTypeArray.filter(v => v.VALUE == this.selectedCustomerType) ;
     const customerType = array ? array[0].DESCRIPTION : "";
     var customerTypeObj = { "fieldName": "Customer Type", "value": customerType};
    this.filterValues.push(customerTypeObj) ;

    // pushing category Type
    const categoryType = this.form.controls['categoryType'].value ? this.form.controls['categoryType'].value : ""
    var categoryTypeObj = { "fieldName": "Category Type", "value": categoryType};
   this.filterValues.push(categoryTypeObj) ;
    }
     
   let todaysDay = this.currentDate.getDate();
   let todaysMonth = this.currentDate.getMonth() + 1;
   let todaysYear = this.currentDate.getFullYear();
   let startDate;
   let endDate;

    if(dayRange == "10days"){
       endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
       startDate = this.priorDateFor10Days.getFullYear() + "-" + (this.priorDateFor10Days.getMonth() + 1) + "-" + this.priorDateFor10Days.getDate();
       var start_date: any = moment(this.form.controls.startDate.value);
       var end_date: any = moment(this.form.controls.endDate.value);
       // Use toLocaleDateString to format the date as "dd/mm/yyyy"
       let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
       let patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
       let patchEndDate = end_date._d.toLocaleDateString('en-GB', options);
       var obj2 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
       var obj3 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };
       var dayRangeObj = { "fieldName": "Day Range", "value": "Last 10 Days" };
       this.filterValues.push(dayRangeObj) ;
       this.filterValues.push(obj2) ;
       this.filterValues.push(obj3) ;
    }
    else if(dayRange == "15days"){
      endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
      startDate = this.priorDateFor15Days.getFullYear() + "-" + (this.priorDateFor15Days.getMonth() + 1) + "-" + this.priorDateFor15Days.getDate();
      var start_date: any = moment(this.form.controls.startDate.value);
      var end_date: any = moment(this.form.controls.endDate.value);
      // Use toLocaleDateString to format the date as "dd/mm/yyyy"
      let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      let patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
      let patchEndDate = end_date._d.toLocaleDateString('en-GB', options);
      var obj2 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
      var obj3 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };
      var dayRangeObj = { "fieldName": "Day Range", "value": "Last 15 Days" };
      this.filterValues.push(dayRangeObj) ;
      this.filterValues.push(obj2) ;
      this.filterValues.push(obj3) ;
   }
   else if(dayRange == "30days"){
    endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
    startDate = this.priorDateFor30Days.getFullYear() + "-" + (this.priorDateFor30Days.getMonth() + 1 )+ "-" + this.priorDateFor30Days.getDate();
    var start_date: any = moment(this.form.controls.startDate.value);
       var end_date: any = moment(this.form.controls.endDate.value);
       // Use toLocaleDateString to format the date as "dd/mm/yyyy"
       let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
       let patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
       let patchEndDate = end_date._d.toLocaleDateString('en-GB', options);
       var obj2 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
       var obj3 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };
       var dayRangeObj = { "fieldName": "Day Range", "value": "Last 30 Days" };
       this.filterValues.push(dayRangeObj) ;
       this.filterValues.push(obj2) ;
       this.filterValues.push(obj3) ;
   }
   else if(dayRange == "Current Date"){
  startDate = this.currentDate.getFullYear() +"-" + (this.currentDate.getMonth()+1) +"-" + this.currentDate.getDate();
  endDate = this.currentDate.getFullYear() +"-" + (this.currentDate.getMonth()+1) +"-" + this.currentDate.getDate();
  var start_date: any = moment(this.form.controls.startDate.value);
       var end_date: any = moment(this.form.controls.endDate.value);
       // Use toLocaleDateString to format the date as "dd/mm/yyyy"
       let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
       let patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
       let patchEndDate = end_date._d.toLocaleDateString('en-GB', options);
       var obj2 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
       var obj3 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };
       var dayRangeObj = { "fieldName": "Day Range", "value": "Current Date" };
       this.filterValues.push(dayRangeObj) ;
       this.filterValues.push(obj2) ;
       this.filterValues.push(obj3) ;
   }
   
    // this.filteredArrayList = []; --> old code , This can be used when removeMatChips function was enabled .

     else if(dayRange == "custom date"){
     
      const givenStartDate = this.form.controls.startDate.value._d ;
      const givenEndDate = this.form.controls.endDate.value._d  ;
      startDate = givenStartDate.getFullYear() + "-" + (givenStartDate.getMonth() + 1) + "-" + givenStartDate.getDate();
      endDate = givenEndDate.getFullYear() + "-" + (givenEndDate.getMonth() + 1) + "-" + givenEndDate.getDate();
      // Use toLocaleDateString to format the date as "dd/mm/yyyy"
      let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      let patchStartDate = this.form.controls.startDate.value._d.toLocaleDateString('en-GB', options);
      let patchEndDate = this.form.controls.endDate.value._d.toLocaleDateString('en-GB', options);
      var obj2 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
      var obj3 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };
      this.filterValues.push(obj2);
      this.filterValues.push(obj3);  //

      //! THIS CODE IS UNUSED BECAUSE WE AREN'T USING MAT CHIPS !
     // this.filteredArrayList.push(dayRange,("start-date : "+startDate) ,("end-date : "+ endDate) );
     // var B = this.filteredArrayList.filter(function(item){ return item !== undefined});
   //  this.filteredArrayList =  B.filter(v => v);
   //  var newArray = this.filteredArrayList.filter(e => e !== 'start-date : undefined' && e !== 'end-date : undefined');
    // this.filteredArrayList = newArray;
      
     }
    
        this.searchResultsLabel = true;
        this.selectedCustomerType = this.form.controls['customerType'].value ? this.form.controls['customerType'].value : "";
        this.selectedCategoryType = this.form.controls['categoryType'].value ? this.form.controls['categoryType'].value : "";

      //service call
      if(startDate != undefined && endDate != undefined){
    this.transactionService.getOnlineReports(this.reportName,startDate,endDate,this.selectedCustomerType,name,this.selectedCategoryType).subscribe((datas:any) =>{
      console.log(datas['data']);
      this.loader = false;
      this.isDisabled = true;
      this.reportDatas = datas['data'];
      this.count = this.reportDatas.length;
      if(this.reportDatas.length == 0){
        this.noReportsData = true;
        this.retrievedReportsData = false;
      }
      else{
        this.noReportsData = false;
        this.retrievedReportsData = true;
      }
    },//error handling
    (error:any) => { 
      if(error.status != 401){
        this.loader = false ;
        const dialogRef = this.dialog.open(ErrorDialogAdminComponent,{
          data : {isReview : true}
        }) 
        dialogRef.afterClosed().subscribe(res => {
          this.loader = false;
          this.noReportsData = true;
          this.retrievedReportsData = false;
        }) 
        this.count = '0'
      }
     
  }  
);
  }
  else{
    this.loader = false;
    this.snackBar.open("Please Enter Day Range" , "Ok");
  }


      }
  else if(response && response.action == "SAVE"){
    console.log("Its Save") ;
    this.loader = true;
    this.reportName = reportName; // eg : this.reportName = '1' ;
    this.searchReport = reportName;  // eg : this.searchReport = '1' ;
    //}
   let todaysDay = this.currentDate.getDate();
   let todaysMonth = this.currentDate.getMonth() + 1;
   let todaysYear = this.currentDate.getFullYear();
   let startDate;
   let endDate;

   var reportNameArr =  this.getReports.filter(v => v.VALUE == reportName);
   let name = reportNameArr[0].TEXT ? reportNameArr[0].TEXT : "" ;

    if(dayRange == "10days"){
       endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
       startDate = this.priorDateFor10Days.getFullYear() + "-" + (this.priorDateFor10Days.getMonth() + 1) + "-" + this.priorDateFor10Days.getDate();
    }
    else if(dayRange == "15days"){
      endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
      startDate = this.priorDateFor15Days.getFullYear() + "-" + (this.priorDateFor15Days.getMonth() + 1) + "-" + this.priorDateFor15Days.getDate();
   }
   else if(dayRange == "30days"){
    endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
    startDate = this.priorDateFor30Days.getFullYear() + "-" + (this.priorDateFor30Days.getMonth() + 1 )+ "-" + this.priorDateFor30Days.getDate();
   }
   else if(dayRange == "Current Date"){
  startDate = this.currentDate.getFullYear() +"-" + (this.currentDate.getMonth()+1) +"-" + this.currentDate.getDate();
  endDate = this.currentDate.getFullYear() +"-" + (this.currentDate.getMonth()+1) +"-" + this.currentDate.getDate();
   }
   
    // this.filteredArrayList = []; --> old code , This can be used when removeMatChips function was enabled .

     else if(dayRange == "custom date"){
     
      const givenStartDate = this.form.controls.startDate.value._d ;
      const givenEndDate = this.form.controls.endDate.value._d  ;
      startDate = givenStartDate.getFullYear() + "-" + (givenStartDate.getMonth() + 1) + "-" + givenStartDate.getDate();
      endDate = givenEndDate.getFullYear() + "-" + (givenEndDate.getMonth() + 1) + "-" + givenEndDate.getDate();
     }
     this.selectedCustomerType = this.form.controls['customerType'].value ? this.form.controls['customerType'].value : "";
     this.selectedCategoryType = this.form.controls['categoryType'].value ? this.form.controls['categoryType'].value : "";
    
      //service call
      if(startDate != undefined && endDate != undefined){
    this.transactionService.getManagementReportAsPdf(this.reportName,startDate,endDate,this.selectedCustomerType,name,true,false,this.selectedCategoryType).subscribe((datas:ArrayBuffer) =>{
      this.loader = false;
      
      // Handle the ArrayBuffer data here
      const blob = new Blob([datas], { type: 'application/pdf' });

      // Create a File with a specified filename
      const filename = `${name}.pdf` ;

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
      // URL.revokeObjectURL(url);

      // Open the PDF in a new tab or download as needed
      // window.open(url);
    },//error handling
    (error:any) => { 
      if(error.status != 401){
        this.loader = false;
        this.dialog.open(ErrorDialogAdminComponent,{
          data : {errorMessage : error.error.errorMessage}
        }) 
      }
     
  }  
);
  }
  else{
    this.snackBar.open("Please Enter Day Range" , "Ok");
  }

  }
  else if(response && response.action == "XLSX"){ //excel
    console.log("Its EXCEL") ;
    this.loader = true;
    this.reportName = reportName; // eg : this.reportName = '1' ;
    this.searchReport = reportName;  // eg : this.searchReport = '1' ;
    //}
   let todaysDay = this.currentDate.getDate();
   let todaysMonth = this.currentDate.getMonth() + 1;
   let todaysYear = this.currentDate.getFullYear();
   let startDate;
   let endDate;

   var reportNameArr =  this.getReports.filter(v => v.VALUE == reportName);
   let name = reportNameArr[0].TEXT ? reportNameArr[0].TEXT : "" ;

    if(dayRange == "10days"){
       endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
       startDate = this.priorDateFor10Days.getFullYear() + "-" + (this.priorDateFor10Days.getMonth() + 1) + "-" + this.priorDateFor10Days.getDate();
    }
    else if(dayRange == "15days"){
      endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
      startDate = this.priorDateFor15Days.getFullYear() + "-" + (this.priorDateFor15Days.getMonth() + 1) + "-" + this.priorDateFor15Days.getDate();
   }
   else if(dayRange == "30days"){
    endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
    startDate = this.priorDateFor30Days.getFullYear() + "-" + (this.priorDateFor30Days.getMonth() + 1 )+ "-" + this.priorDateFor30Days.getDate();
   }
   else if(dayRange == "Current Date"){
  startDate = this.currentDate.getFullYear() +"-" + (this.currentDate.getMonth()+1) +"-" + this.currentDate.getDate();
  endDate = this.currentDate.getFullYear() +"-" + (this.currentDate.getMonth()+1) +"-" + this.currentDate.getDate();
   }
   
    // this.filteredArrayList = []; --> old code , This can be used when removeMatChips function was enabled .

     else if(dayRange == "custom date"){
     
      const givenStartDate = this.form.controls.startDate.value._d ;
      const givenEndDate = this.form.controls.endDate.value._d  ;
      startDate = givenStartDate.getFullYear() + "-" + (givenStartDate.getMonth() + 1) + "-" + givenStartDate.getDate();
      endDate = givenEndDate.getFullYear() + "-" + (givenEndDate.getMonth() + 1) + "-" + givenEndDate.getDate();
     }
     this.selectedCustomerType = this.form.controls['customerType'].value ? this.form.controls['customerType'].value : "";
     this.selectedCategoryType = this.form.controls['categoryType'].value ? this.form.controls['categoryType'].value : "";

      //service call
      if(startDate != undefined && endDate != undefined){
    this.transactionService.getManagementReportAsPdf(this.reportName,startDate,endDate,this.selectedCustomerType,name,false, true,this.selectedCategoryType).subscribe((datas:ArrayBuffer) =>{
      this.loader = false;
      
      // Handle the ArrayBuffer data here
      const blob = new Blob([datas], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create a filename for the XLSX file
      const filename = `${name}.xlsx`;

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
    },//error handling
    (error:any) => { 
      if(error.status != 401){
        this.loader = false;
        this.dialog.open(ErrorDialogAdminComponent,{
          data : {errorMessage : error.error.errorMessage}
        }) 
      }
     
  }  
);
  }
}
  else{
    console.log("Dialog is closed without any action provided...")
  }

})


  }

  //selectionChange event fired when they selecting values in "Day Range" Dropdown
  dayRangeSelection(dayRange:string){
   //To patch Current date in endDate field.
   const currentDate = new Date();
   this.form.controls['endDate'].setValue(currentDate);
   this.minEndDate = null; // to set null in min and max property.
   this.maxEndDate = null;

   //last 10 days
  if(dayRange == "10days"){
    this.disableDateField = true;
    const futureDate = new Date(currentDate.getTime() - (10 * 24 * 60 * 60 * 1000)); // startDate = current date - 10days
    this.form.controls['startDate'].setValue(futureDate);
  }
  
  //last 15 days
  else if(dayRange == "15days"){
    this.disableDateField = true;
    const futureDate = new Date(currentDate.getTime() - (15 * 24 * 60 * 60 * 1000)); // startDate = current date - 15days
    this.form.controls['startDate'].setValue(futureDate);
   
  }

  //last 30 days
  else if(dayRange == "30days"){
    this.disableDateField = true;
    const futureDate = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000)); // startDate = current date - 30days
    this.form.controls['startDate'].setValue(futureDate); 
  }


  //current day
  else if(dayRange == "Current Date"){
    this.disableDateField = true;
    const currentDate = new Date();     //startDate = current date
    this.form.controls['startDate'].setValue(currentDate);
   }

   //custom days
   else if(dayRange == "custom date"){
    this.disableDateField = false;
    this.form.controls['startDate'].setValue(null);
    this.form.controls['endDate'].setValue(null);
  }
  }

//dateChange event fired - after start date and end date value is entered
public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
  this.validateEndDate = event.value._d;

}
public onStartDateChange(event: MatDatepickerInputEvent<any>): void {// changed to one year
  if(event.value != null){
    this.validateStartDate = event.value._d;
    this.minEndDate = this.validateStartDate  //max end date is 8 days and exclude sat and sun
    this.maxEndDate = new Date(this.minEndDate.getTime() + 365 * 24 * 60 * 60 * 1000);
   // this.form.controls['endDate'].setValue(this.maxEndDate);
  }
  else{
    this.form.controls['startDate'].clearValidators();
    
    // Apply new validators (or none, if you want to remove validation)
    this.form.controls['startDate'].setValidators([Validators.required, /* other validators */]);

    // Update the control's status and validity
    this.form.controls['startDate'].updateValueAndValidity();
  }
}

  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  onChangeReportName(reportNo:string){
    //if report is KYC -> append field 'Customer Type' and 'Category Type'
    console.log(reportNo)
if(reportNo == "18"){
  this.isKycReport = true
 
    let customerValue = this.custTypeArray[0].VALUE ? this.custTypeArray[0].VALUE : ''
    this.selectedCustomerType = customerValue;
    this.form.controls['customerType'].patchValue(customerValue) ;
       console.log(this.selectedCustomerType)

  if(this.customerSegmentArray.length >= 1){
    let categoryValue = this.customerSegmentArray[0].LABEL ? this.customerSegmentArray[0].LABEL : ""
    this.form.controls['categoryType'].patchValue(categoryValue);
  }
  // when selected report is kyc category type is requied .
  this.form.controls['categoryType'].setValidators([Validators.required]);
}
    //else revert them
    else{
      this.isKycReport = false;
      this.form.patchValue({
        'categoryType' : '',
        'customerType' : ''
      })
      this.selectedCategoryType = "";
      this.selectedCustomerType = "";
      this.form.controls['categoryType'].setValidators(null);
    }
    this.form.controls['categoryType'].updateValueAndValidity();
  }

  getKycCustomerSegmentListService(){
    this.transactionService.searchKyc().subscribe((datas:any)=>{
      this.customerSegmentArray = datas['data'] ;
    },
    (error:any)=>{ //error handling
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data : { errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) 
      }
    }
  )
  }
}
