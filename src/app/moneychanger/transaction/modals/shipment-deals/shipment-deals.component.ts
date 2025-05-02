import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getDealBgcolorMoneyChanger, getDealColorMoneyChanger } from 'src/assets/transactionstatus';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'moment';
import { ShipmentMaintenanceService } from 'src/app/core/services/shipment.service';

@Component({
  selector: 'app-shipment-deals',
  templateUrl: './shipment-deals.component.html',
  styleUrls: ['./shipment-deals.component.scss','../../../../../assets/styles/tables/table-style.scss'],

})
export class ShipmentDealsComponent implements OnInit {

  @Input() checkStatus !: string;
  radioOptionsArray = [
    {value : "I" , displayValue : "Import" , checked : "false" , disabled : "false"},
    {value : "E" , displayValue : "Export" ,checked : "true" , disabled : "false"}
  ]
  dealListings : any[] = [] ;
  isActive!:false;
  p: number = 1;
  itemsPerPage: number = 20;
  loader : Boolean = false ;
  public getScreenWidth: any;
  public getScreenHeight: any;
  public filterForm : FormGroup = Object.create(null);
  showOKButton = false ;
  checkBoxArray : any[] = [] ;
  currencyArray : any[] = [] ;
  typeList : any[] = [
    {"value" : "" , "description" : "--Select--"},
    {"value" : "B" , "description" : "BUY"},
    {"value" : "S" , "description" : "SELL"},
  ];
  statusList : any[] = [
    {"value" : "1" , "description" : "OPEN"},
    {"value" : "3" , "description" : "PARTIAL"},
    {"value" : "4" , "description" : "CANCELLED"},
    {"value" : "6" , "description" : "CLOSED"},
  ];
  xpandStatus = false;
  filterValues : any[] = [];
  minStartDate!: Date;
  maxStartDate!: Date;
  minEndDate!: any;
  maxEndDate!: any;
  validateEndDate: any;
  validateStartDate: any;
  dateGt : any;
  dateLt : any ;
  customerId : any ;
  dealStatus : any[] = [] ;
  internalStatus : any;
  @Output() updateShipmentEvent = new EventEmitter<any[]>();
  @Input() modalMessage !: boolean ;
  @Input() retriveCustomerId !: string ;
  @Output() shipmentLoaded = new EventEmitter<any[]>();
  shipmentType = "E"; //initial set as E -> Export.

  constructor(private router: Router,
    private dialog : MatDialog, private fb:FormBuilder,
    public dialogRef: MatDialogRef<ShipmentDealsComponent>, private store : InMemoryCache,
    private currencyMaintenanceService : MoneyChangerMaintenanceService, private shipmentService : ShipmentMaintenanceService) { }

   //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  //This function will be triggered if user hits enter but this will be called from parent component 'parent deal selection comp'
 handleKeyDownEvent() {
   //Entry point > Add transaction or Add shipment > After customer selection open deal window > onEnter export deals in the parent screen.
       this.navigateParentScreen() ;  
   
 }

  changeTableHeight(){
    return { 'height': (this.getScreenHeight - 398 )+'px' , 'overflow-y' : 'auto' }; 
  }
  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  ngOnInit(): void {
   
    this.filterForm = this.fb.group({
      ccyCode : [null],
      type : [null],
      status : [null],
      startDate: [null,Validators.compose([Validators.required])],
      endDate: [null,Validators.compose([Validators.required])],

    });

    this.filterValues = [] ;

    this.onLoadDateDifferenceActivity();

     //getScreenWidth and getScreenHeight will get the windows inner height and width.
     this.getScreenWidth = window.innerWidth;
     this.getScreenHeight = window.innerHeight;
     console.log("shipment listings tab section...")
    //MC => Add Transaction => select customer and retrieve deals ..
    if(this.modalMessage){
    
      //call deal inquiry api;
      this.customerId = this.retriveCustomerId ? this.retriveCustomerId : ""  ;
      this.statusList = [
        {"value" : "1" , "description" : "OPEN"},
        {"value" : "3" , "description" : "PARTIAL"},
      ];
      this.internalStatus = "1,3" ;
      //BACKUP --> this.callShipmentDealInquiryService('',this.customerId,'',this.internalStatus,this.dateGt,this.dateLt) ;
      this.callShipmentDealInquiryService(this.customerId) ;
    }
   
    

      //getScreenWidth and getScreenHeight will get the windows inner height and width.
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
  }

  //Deal Inquiry service call
 //BACKUP --> callShipmentDealInquiryService(ccyCode:string, customerId:string, type:string, status:string, dateGt:any, dateLt:any){
  callShipmentDealInquiryService(customerId:string){
    this.loader = true ;

  
    //(ccyCode:string,customerId:string, customerName:string, buySellInd:string, status:string, id:string,dateGt:any, dateLt:any)
    //BACKUP --> this.shipmentService.shipmentCustomerDetailInquiry(ccyCode,customerId,type,status,dateGt, dateLt).subscribe((datas:any)=>{
    this.shipmentService.shipmentCustomerDetailInquiry(customerId, this.shipmentType).subscribe((datas:any)=>{
      this.dealListings = datas['dealDetails'] ;

      this.shipmentLoaded.emit(this.dealListings);                                  
      this.loader = false ;
    },
    (error:any)=>{
      this.loader = false;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage }
        }) ;
      }
     }
    )
  }
 

  //search filter
  searchFilter(){
    this.xpandStatus = false ;
    let ccyCode = this.filterForm.controls['ccyCode'].value ? this.filterForm.controls['ccyCode'].value : "" ;
    let type = this.filterForm.controls['type'].value ? this.filterForm.controls['type'].value : "" ;
    this.dealStatus = this.filterForm.controls['status'].value ? this.filterForm.controls['status'].value : "" ;

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
     this.filterValues = [] ;
  if (ccyCode !== "") {
    this.filterValues.push({"fieldName":"Currency Code","value":ccyCode});
  }
  
  if (type !== "") {
    let filteredTypeList = this.typeList.filter(v => v.value == type) ;
    let typeDescription = filteredTypeList[0].description ;
    this.filterValues.push({"fieldName":"Type","value":typeDescription});
  }
  if (this.dealStatus.length != 0) {
    this.internalStatus = this.dealStatus.join(",");
    // let filteredStatusList = this.statusList.filter(v => v.value == this.dealStatus) ;
    // let statusDescription = filteredStatusList[0].description ;

    const finalArrayNumbers: number[] = this.internalStatus.split(',').map(Number);
    // Use the finalArrayNumbersUnPosted to find the corresponding TXNSTATUS values
    const status: string[] = finalArrayNumbers.map((num) => {
      const entry = this.statusList.find((item) => item.value == num);
      return entry ? entry.description : '';
    });
    status.join(', '); // Output: "Initiated, Amount Received"

    this.filterValues.push({"fieldName":"Status","value":status});
  }
  //pushing dates
  var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
  var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };
  this.filterValues.push(obj1);
  this.filterValues.push(obj2);
  this.customerId  = this.customerId ? this.customerId  : "" ;
  //BACKUP --> this.callShipmentDealInquiryService(ccyCode,this.customerId ,type,this.internalStatus, this.dateGt, this.dateLt) ;
    this.callShipmentDealInquiryService(this.customerId) ;
  }

  //STATUS color diff
 getColor(status: any) {
  return getDealColorMoneyChanger(status)
}
//bg color for status tags .
getBackgroundColor(status: string): string {
 return getDealBgcolorMoneyChanger(status);
  
}




navigateParentScreen(){
   // Extract dealId values from checkBoxArray
const checkBoxDealIds = this.checkBoxArray.map(item => item.dealItemId);

// Filter dealListings based on checkBoxDealIds
let dealListings = this.dealListings.filter(item => checkBoxDealIds.includes(item.dealItemId));

 dealListings = dealListings.map(item => ({
  ...item, // Spread the existing properties
  exchRate: item.exchRateL // Add the new 'exchRate' field and assign 'exchRateL' value
}));

console.log(dealListings);
//pass data to parent component - Parent-Deal-Selection-Tab Component
this.updateShipmentEvent.emit(dealListings);
//this.dialogRef.close({ data : dealListings });

  
}

//deal selection
selectedCheckBox(event:any, index:any, dealItemId : string){
 console.log(event)
 if(event.checked == true){
  this.checkBoxArray.push({
   "booleanIndicator" :  true,
   "dealItemId" :  dealItemId,
  }) ;
 }
 if(event.checked == false){
  let indexValue = this.checkBoxArray.findIndex(v => v.dealItemId == dealItemId) ;
  this.checkBoxArray.splice(indexValue,1) ;
 }
 if(this.checkBoxArray.length >= 1){
  this.showOKButton = true ;
 }
 else{
  this.showOKButton = false;
 }

  console.log(this.checkBoxArray) ;
}




//From add transaction ==> Deal items ==> Edit deal ==> we will navigate to deal search and open the modal default
navigateEditDealDialog(dealItemId:string){
  this.store.setItem('SIGNAL_FROM_ADD_TXN_TO_EDITDEAL',dealItemId) ;
  this.router.navigate(['moneychanger-deals/view-deals']) ;
}

//get currency service 
getCurrencyMaintenance() {
  // Your function logic when F1 key is pressed
  console.log('currency get triggerd');
    this.currencyMaintenanceService.getCurrencyListings('','','').subscribe((datas:any)=>{
      this.currencyArray = datas['data'] ;
      }) ;
 
}



resetFilter(){
  this.filterValues = [] ;
  this.xpandStatus = false ;
  this.filterForm.patchValue({
    ccyCode : "",
      type : "",
      status : []
  });

 this.onLoadDateDifferenceActivity() ;
 this.customerId  = this.customerId  ? this.customerId  : "";
 // BACKUP --> this.callShipmentDealInquiryService('',this.customerId ,'',this.internalStatus,this.dateGt, this.dateLt);
  this.callShipmentDealInquiryService(this.customerId);
}

public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
  this.validateEndDate = event.value._d;

}
public onStartDateChange(event: MatDatepickerInputEvent<any>): void {
  this.validateStartDate = event.value._d;
  this.minEndDate = this.validateStartDate  //max end date is 7 days and exclude sat and sun
  this.maxEndDate = new Date(this.minEndDate.getTime() + 7 * 24 * 60 * 60 * 1000);
}

onLoadDateDifferenceActivity(){

  //onload, patch deal status = OPEN , PARTIAL
  this.internalStatus = "1,3"
  this.filterForm.patchValue({
    status : ['1', '3']
  }) ;
  this.minEndDate = new Date() //max end date is 30 days and exclude sat and sun
    this.maxEndDate = new Date(this.minEndDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Patch one month difference for both start date and end date
    const todayFormatted = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(todayFormatted.getDate() - 7); // Subtract 7 days to get one week ago
    
    this.filterForm.controls.startDate.setValue(oneWeekAgo);
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

     //pushing deal status 
     this.filterValues.push({"fieldName":"Status","value": "OPEN, PARTIAL"});

     var start_date: any = moment(this.filterForm.controls.startDate.value);
     var end_date: any = moment(this.filterForm.controls.endDate.value)
     this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
     this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
}


// Function to check if the valueDate was today's date and previous dates .
isToday(valueDate: string): boolean {
  const today = new Date();  //Current Date
  const dateToCheck = new Date(valueDate);  //Value Date
  
 // Check if valueDate is today or any past date
 return dateToCheck <= today; // returns true if Value Date was Current Date or Previous dates.
}

//import/export -> radio button changes.
onSelectionChange(event: any) {
  console.log("Selected Value:", event.value);
  this.shipmentType = event.value;

  this.callShipmentDealInquiryService(this.customerId) ;
}
 

}
