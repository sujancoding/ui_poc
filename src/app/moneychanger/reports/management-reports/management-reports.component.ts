

import { Component, HostListener, OnInit } from '@angular/core';

import { PipeTransform, Pipe } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ENTER ,COMMA} from '@angular/cdk/keycodes';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';


import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { ViewManagementReportConfirmationDialogComponent } from 'src/app/backoffice/shared/modals/view-management-report-confirmation-dialog/view-management-report-confirmation-dialog.component';

import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { MoneyChangerReportsService } from 'src/app/core/services/mcreports.service';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';

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
  selector: 'app-management-reports',
  templateUrl: './management-reports.component.html',
  styleUrls: ['./management-reports.component.scss','../../../../assets/styles/tables/table-style.scss',
    '../../../../assets/styles/buttons/button.scss'
  ],

})

export class ManagementReportsComponent implements OnInit {


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
  enteredStartDate : any;
  enteredEndDate : any;
  currentDate = new Date();
  priorDateFor30Days = new Date(new Date().setDate(this.currentDate.getDate() - 30)); //from currenct date - 30 days
  priorDateFor15Days = new Date(new Date().setDate(this.currentDate.getDate() - 15)); //from currenct date - 15 days
  priorDateFor10Days = new Date(new Date().setDate(this.currentDate.getDate() - 10));  //from currenct date - 10 days
  reportName !: string;
  noReportsData : Boolean = true;
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
  retrievedReportsData : Boolean = false;
  filterValues: any[] = [];
  onLoadReportName : string = "" ;
   minStartDate : Date = new Date(2025, 0, 1); 
   maxStartDate!: Date;
   minEndDate!: any;
   maxEndDate!: any;
   disableDateField : Boolean = true ;
   currencyCodeArray : any[] = [] ;
   isDisableCurrencyCodeOptions : boolean = true ; //enable currency code array only for report type == 10 (LWC)
   isTopCustomerNo : boolean = false ;
   getTopCustomerNo: any[] = [];
   topCustomerNoArray : any[] = [
     { "LIMIT": "10" },
     { "LIMIT": "20" },
     { "LIMIT": "30" },
     { "LIMIT": "40" },
     { "LIMIT": "50" }
    ];
    businessTypeArray : any[] = [
      { "DESCRIPTION": "All", "VALUE" : "" },
      { "DESCRIPTION": "Individual", "VALUE" : "I" },
      { "DESCRIPTION": "Local Money Changer", "VALUE" : "LMC" },
      { "DESCRIPTION": "Overseas Money Changer", "VALUE" : "OMC" },
      { "DESCRIPTION": "Other Business", "VALUE" : "OB" }
     ];
     isBusinessType = false ;
     custTypeArray : any[] = [
      { "DESCRIPTION": "Individual", "VALUE" : "I" },
      { "DESCRIPTION": "Corporate", "VALUE" : "C" },
      { "DESCRIPTION": "All", "VALUE" : "" },
     ];
     isCustomerType = false ;
     customerSegmentArray : any[] = [] ;

   

  constructor(private titleHeader : TitleHeaderService,private reportService: MoneyChangerReportsService,
    private fb: FormBuilder,private store: InMemoryCache,private snackBar : MatSnackBar,private dialog : MatDialog,
  private currencyMaintenanceService: MoneyChangerMaintenanceService) { }
    
  ngOnInit(): void {
    this.titleHeader.setTitle('Management Reports');
    this.form = this.fb.group({
      dayRange : [null],
      reportName : [null, [Validators.compose([Validators.required])]],
      startDate : [null,[Validators.compose([Validators.required])]],
      endDate : [null, [Validators.compose([Validators.required])]],
      currencyNo : [null],
      count :  ["10"], //initially patch '10' as default..
      businessType : [null] ,
      customerType : [null],
      segmentType : [null]
    });

    // report list API
    this.getReportListService();

    //Initially , call currency maintenance service and store it in a variable
    this.currencyMaintenanceService.getCurrencyListings('','','').subscribe((datas:any)=>{
      this.currencyCodeArray = datas['data'] ;

    },
    (error:any)=>{ //error handling
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data : { errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) 
      }
    }
  )

  // kyc Search API
  this.getKycCustomerSegmentListService() ;

      //getScreenWidth and getScreenHeight will get the windows inner height and width.
     this.getScreenWidth = window.innerWidth;
     this.getScreenHeight = window.innerHeight;
  }
  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  tableHeight(){
    return { 'height': (this.getScreenHeight - 279)+'px' , 'overflow-y' : 'auto' };
  }
 
  
  getReportListService(){
    this.reportService.getManagementReportList().subscribe((datas:any)=>{
      console.log(datas) ;
      this.getReports = datas['data'] ;

    let accessControlDtl = this.store.getItem('ACCESS_CONTROLS_ARRAY') ? this.store.getItem('ACCESS_CONTROLS_ARRAY') : "";
    let arrayOfObjects : any ;
    if (accessControlDtl != "") {
       arrayOfObjects = JSON.parse(accessControlDtl);
    }
      // Check if any object has accessId "BMPR" and name ""MANAGEMENT REPORT - P/L REPORT TYPE"
      const hasSpecificItem : boolean = arrayOfObjects.some((item:any)=>{
       return item.accessId == "BMPR" && item.name == "MANAGEMENT REPORT - P/L REPORT TYPE" ;
      }) ;
      
     
      //if hasSpecificItem is not true --> hide the Pl report type option in dropdown else show .
      if(hasSpecificItem != true){
        this.getReports = this.getReports.filter((item: any) => item.VALUE != '15');
      }

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

  getKycCustomerSegmentListService(){
    this.reportService.searchKyc().subscribe((datas:any)=>{
      this.customerSegmentArray = datas['data'] ;
      if(this.customerSegmentArray.length >= 1){
      let value = datas['data'][0].LABEL ? datas['data'][0].LABEL : ""
      this.form.controls['segmentType'].patchValue(value)
      }
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
  }

  resetFilter(){
    this.xpandStatus = false;
    this.filterValues = [] ;
    this.form.patchValue({
      dayRange : '',
      reportName : '',
      startDate : '',
      endDate : '',
      currencyNo:'', // empty currency no while reset
      count:'',
      businessType : '',
      customerType : '',
      segmentType : ''
    });
    this.isTopCustomerNo=false;
    this.isBusinessType = false ;
    this.isCustomerType = false ;
      //service call - onLoad call org pl records
      this.loader = true;
      setTimeout(() => {
        this.loader = false;
        this.reportDatas = [];
        this.retrievedReportsData = false ;
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

    this.selectedCustomerType = '';
    this.xpandStatus = false //close expansion panel .
    this.filterValues = [] ; //clearing filter values array 

    //pushing report name 
    var reportNameArr =  this.getReports.filter(v => v.VALUE == reportName);
    let name = reportNameArr[0].TEXT ? reportNameArr[0].TEXT : "" ;
    var reportNameObj = { "fieldName": "Report Name", "value": name};
    this.filterValues.push(reportNameObj) ;

    if(reportName == "1" || reportName == "13" || reportName == "16"){ //For 'top customer' or 'top currency purchase' or 'top currency sold' report --> push count in filter value array ...
      let countValue = this.form.controls['count'].value ? this.form.controls['count'].value : "" ;
      var countObj = {"fieldName": "Count", "value" : countValue};
      this.filterValues.push(countObj) ;
    }

    if(reportName == "11"){ //For statement of txn report --> push business type in filter value array ...
      let businessTypeValue = this.form.controls['businessType'].value ? this.form.controls['businessType'].value : "" ;
      let arr = this.businessTypeArray.filter(v => v.VALUE == businessTypeValue) ;
      let value = arr[0] ? arr[0].DESCRIPTION : "" ;
      var businessTypeObj = {"fieldName": "Business Type", "value" : value};
      this.filterValues.push(businessTypeObj) ;
    }

    if(reportName == "14"){ //For kyc report --> push customer type in filter value array ...
      let customerTypeValue = this.form.controls['customerType'].value ? this.form.controls['customerType'].value : "" ;
      let arr = this.custTypeArray.filter(v => v.VALUE == customerTypeValue) ;
      let value = arr[0] ? arr[0].DESCRIPTION : "" ;
      var customerTypeObj = {"fieldName": "Customer Type", "value" : value};
      this.filterValues.push(customerTypeObj) ;

      let customerSegmentTypeValue = this.form.controls['segmentType'].value ? this.form.controls['segmentType'].value : "" ;
      let segmentArr = this.customerSegmentArray.filter(v => v.LABEL == customerSegmentTypeValue) ;
      let segmentValue = segmentArr[0] ? segmentArr[0].LABEL : "" ;
      var customerSegmentTypeObj = {"fieldName": "Category Type", "value" : segmentValue};
      this.filterValues.push(customerSegmentTypeObj)
    }

    this.reportName = reportName; // eg : this.reportName = '1' ;
  
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
    

      //service call
      if(startDate != undefined && endDate != undefined){
   //Write code here 
   let ccyNo = this.form.controls['currencyNo'].value ? this.form.controls['currencyNo'].value : "" ;
   let count = this.form.controls['count'].value ? this.form.controls['count'].value : "" ;
   let businessType = this.form.controls['businessType'].value ? this.form.controls['businessType'].value : "" ;
   this.selectedCustomerType = this.form.controls['customerType'].value ? this.form.controls['customerType'].value : "" ; //customer type will be coming if report is KYC
   let customerSegmentType = this.form.controls['segmentType'].value ? this.form.controls['segmentType'].value : "" ;
    this.reportService.getManagementReportsAsData(this.reportName,startDate,endDate,this.selectedCustomerType,name,false,ccyNo,count, businessType, customerSegmentType).subscribe((datas:any)=>{
      this.loader = false;
      console.log(datas['data']);
      this.reportDatas = datas['data'];
      this.xpandStatus = false ;
      this.count = this.reportDatas.length;
      if(this.reportDatas.length == 0){
       this.noReportsData = true;
       this.retrievedReportsData = false ;
      }
      else{
       this.noReportsData = false;
       this.retrievedReportsData = true ;
      }
    },
    (error:any)=>{
      if(error.status != 401){
        this.loader = false ;
        const dialogRef = this.dialog.open(ErrorDialogAdminComponent,{
          data : { errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) 
        dialogRef.afterClosed().subscribe(res => {
          this.noReportsData = true;
          this.retrievedReportsData = false ;
        }) 
        this.count = '0'
      }
    }
  )
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
    
      //service call
      if(startDate != undefined && endDate != undefined){
    //Write code here... need to add parameters reportType:string,startDate:any,endDate:any,customerType: string, reportName: string, isPdf:boolean
    let ccyNo = this.form.controls['currencyNo'].value ? this.form.controls['currencyNo'].value : "" ;
    let count = this.form.controls['count'].value ? this.form.controls['count'].value : "" ;
    let businessType = this.form.controls['businessType'].value ? this.form.controls['businessType'].value : "" ;
    this.selectedCustomerType = this.form.controls['customerType'].value ? this.form.controls['customerType'].value : "" ; //customer type will be coming if report is KYC
    let customerSegmentType = this.form.controls['segmentType'].value ? this.form.controls['segmentType'].value : "" ;
    this.reportService.getManagementReportsAsPdf(this.reportName,startDate,endDate,this.selectedCustomerType,name,true,ccyNo,count, businessType, customerSegmentType,false).subscribe((datas:ArrayBuffer)=>{
      this.xpandStatus = false ;
      this.loader = false ;
      
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
      URL.revokeObjectURL(url);

      // Open the PDF in a new tab or download as needed
      // window.open(url);
    },
    (error:any)=>{
      if(error.status != 401){
        this.loader = false ;
        this.dialog.open(ErrorDialogAdminComponent,{
          data : { errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) 
      }
    }
  )
  }
  else{
    this.snackBar.open("Please Enter Day Range" , "Ok");
  }

  }
  else if(response && response.action == "XLSX"){
    console.log("Its Save") ;
    this.loader = true;
    this.reportName = reportName; // eg : this.reportName = '1' ;
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
    
         
      //service call
      if(startDate != undefined && endDate != undefined){
        //Write code here... need to add parameters reportType:string,startDate:any,endDate:any,customerType: string, reportName: string, isPdf:boolean
        let ccyNo = this.form.controls['currencyNo'].value ? this.form.controls['currencyNo'].value : "" ;
        let count = this.form.controls['count'].value ? this.form.controls['count'].value : "" ;
        let businessType = this.form.controls['businessType'].value ? this.form.controls['businessType'].value : "" ;
        this.selectedCustomerType = this.form.controls['customerType'].value ? this.form.controls['customerType'].value : "" ; //customer type will be coming if report is KYC
        let customerSegmentType = this.form.controls['segmentType'].value ? this.form.controls['segmentType'].value : "" ;
        this.reportService.getManagementReportsAsPdf(this.reportName,startDate,endDate,this.selectedCustomerType,name,false,ccyNo,count, businessType, customerSegmentType,true).subscribe((datas:ArrayBuffer)=>{
          this.xpandStatus = false ;
          this.loader = false ;
          
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
              // Cleanup the blob URL to free memory
              URL.revokeObjectURL(url);

            // Open the PDF in a new tab or download as needed
            // window.open(url);
        },
        (error:any)=>{
          if(error.status != 401){
            this.loader = false ;
            this.dialog.open(ErrorDialogAdminComponent,{
              data : { errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
            }) 
          }
        }
      )
      }
      else{
        this.snackBar.open("Please Enter Day Range" , "Ok");
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

  reportSelection(reportType:string){
    console.log(reportType) ;
    if(reportType == "10"){ //for report such as Location wise currency ---> enable currency code dropdown  .
     this.isDisableCurrencyCodeOptions = false ;
    }
    else{ 
      this.isDisableCurrencyCodeOptions = true ;
        this.form.patchValue({
          currencyNo:''
        });
    }
    if(reportType == "1" || reportType == "13" || reportType == "16"){ //report name such as 'top customer' or 'top currency purchase' or 'top currency sold'
      this.isTopCustomerNo = true ; //show count dropdown
      this.form.patchValue({  //default -> patch '10'
        count :'10'
      });
    }
    else{
      this.isTopCustomerNo = false; //hide count dropdown
      this.form.patchValue({
        count :''
      });
    }
    if(reportType == "11"){ //report name such as 'statement of txn' --> show business type dropdown
      this.isBusinessType = true ; //show business type dropdown 
      this.form.patchValue({  //default -> patch 'All'
        businessType :''
      });
    }
    else{
      this.isBusinessType = false ; //hide business type dropdown 
    }

    if(reportType == "14"){ //report name such as 'kyc' --> show customer type dropdown
      this.isCustomerType = true ; //show customer type dropdown 
      this.form.patchValue({  //default -> patch 'I'
        customerType :'I'
      });
    }
    else{
      this.isCustomerType = false ; //hide CUSTOMER type dropdown 
      this.form.patchValue({ 
        customerType :''
      });
    }
  }
}

