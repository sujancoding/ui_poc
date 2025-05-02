import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import {  CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import { ParentNewDealMcComponent } from '../parentnewdealsmc/parent-new-deal-mc.component';
import { MoneyChangerDealsService } from 'src/app/core/services/mcdeals.service';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getDealBgcolorMoneyChanger, getDealColorMoneyChanger } from 'src/assets/transactionstatus';
import { EditDealMcComponent } from '../../modals/editdeal/edit-deal-mc.component';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'moment';
// import { interval, Subscription } from 'rxjs';
import {  MatCheckboxChange } from '@angular/material/checkbox';
import {  DealItems, MultipleDealCancel } from 'src/app/core/model/mcdeals/mcdeals.model';
import { SuccessDialogComponent } from 'src/app/shared/components/success-dialog/success-dialog.component';

@Component({
  selector: 'app-dealsmc',
  templateUrl: './dealsmc.component.html',
  styleUrls: ['./dealsmc.component.scss', '../../../../assets/styles/tables/table-style.scss',
    '../../../../assets/styles/buttons/button.scss'
  ],
})
export class DealsmcComponent implements OnInit {

  dealListings : any[] = [] ;
  isActive!:false;
  p: number = 1;
  itemsPerPage: number = 20;
  loader : Boolean = false ;
  public getScreenWidth: any;
  public getScreenHeight: any;
  public filterForm : FormGroup = Object.create(null);
  showModalDialogContent = false ;
  selectedRadio !: string ;
  showOKButton = false ;
  retrievedDealId !: string ;
  checkBoxArray : any[] = [] ;
  showDealSearchContent = true ;
  currencyArray : any[] = [] ;
  typeList : any[] = [
    {"value" : "" , "description" : "--Select--"},
    {"value" : "B" , "description" : "BUY"},
    {"value" : "S" , "description" : "SELL"},
  ];
  statusList : any[] = [
    //{"value" : "" , "description" : "--Select--"},
    {"value" : "1" , "description" : "OPEN"},
   // {"value" : "2" , "description" : "REALISED"}, //UNUSED
    {"value" : "3" , "description" : "PARTIAL"},
    {"value" : "4" , "description" : "CANCELLED"},
  //  {"value" : "5" , "description" : "DELETED"}, //UNUSED
    {"value" : "6" , "description" : "CLOSED"},
  ];
  xpandStatus = false;
  searchCustomerName !: string ;
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
  // added for calling deal inquiry every 5 seconds
  // private subscription !: Subscription;
  // private readonly intervalTime = 5000; // 5 seconds
  // added multiple deal cancel
  cancelDealCheckbox : boolean = true;
  cancelDealArray : any[] = [];
  

  constructor(private titleService : TitleHeaderService, private router: Router,private dealService: MoneyChangerDealsService,
    private dialog : MatDialog, private fb:FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DealsmcComponent>, private store : InMemoryCache,
    private currencyMaintenanceService : MoneyChangerMaintenanceService) { }

   //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  // HostListener to detect keyup events on the document body
 @HostListener('document:keydown', ['$event'])
 handleKeyDownEvent(event: KeyboardEvent) {
 
   //Entry point > Add transaction or Add shipment > After customer selection open deal window > onEnter export deals in the parent screen.
   if(this.data.isTransactionReview){
     if (event.key == 'Enter') {
       event.preventDefault(); // Prevent default browser behavior
       this.navigateParentScreen() ;
        
     }
   }
   
 }

  changeTableHeight(){
    return { 'height': (this.getScreenHeight - 259 )+'px' , 'overflow-y' : 'auto' }; 
  }
  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Deal Listings') ;
    this.filterForm = this.fb.group({
      ccyCode : [null],
      custName : [null],
      type : [null],
      status : [null],
      startDate: [null,Validators.compose([Validators.required])],
      endDate: [null,Validators.compose([Validators.required])],

    });

    this.filterValues = [] ;

    this.onLoadDateDifferenceActivity();
     
    //MC => Add Transaction => select customer and retrieve deals ..
    if(this.data.isTransactionReview){
      if(this.data.isAddShipmentReview){
        this.titleService.setTitle('Add Shipment') ;
      }
      else{
        this.titleService.setTitle('Add Transaction') ;
      }
      this.filterForm.controls.custName.disable() ;
      // removing multiple deal cancel checkbox in add txn deal dialog
      this.cancelDealCheckbox = false;
       this.showModalDialogContent = true ;
       this.showDealSearchContent = false ;
      //call deal inquiry api;
      this.customerId = this.data.customerId  ;
      this.statusList = [
        {"value" : "1" , "description" : "OPEN"},
        {"value" : "3" , "description" : "PARTIAL"},
      ];
      this.internalStatus = "1,3" ;
      this.callDealInquiryService('',this.customerId,'','',this.internalStatus,this.dateGt,this.dateLt) ;
    }
    else{

      this.statusList = [
       // {"value" : "" , "description" : "--Select--"},
        {"value" : "1" , "description" : "OPEN"},
      //  {"value" : "2" , "description" : "REALISED"}, //UNUSED
        {"value" : "3" , "description" : "PARTIAL"},
        {"value" : "4" , "description" : "CANCELLED"},
      //  {"value" : "5" , "description" : "DELETED"}, //UNUSED
        {"value" : "6" , "description" : "CLOSED"},
      ]
      //call get currency service ;
      this.getCurrencyMaintenance() ;
      this.internalStatus = "1,3" ;
      this.callDealInquiryService('','','','',this.internalStatus,this.dateGt,this.dateLt) ;

    }
    

//CODE	DEAL STATUS
// O	Open
// R	Realised --> Not used
// P	Partial
// C	Cancelled
// D	Deleted --> Not used
// L	Closed
      //getScreenWidth and getScreenHeight will get the windows inner height and width.
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
      // calling deal inquiry api for every 5 seconds.
     // this.subscription = interval(this.intervalTime).subscribe(() => {
      //  this.callDealInquiryService('', '', '', '', '','','');
     // });
  }

  //Deal Inquiry service call
  callDealInquiryService(ccyCode:string, customerId:string, customerName:string, type:string, status:string, dateGt:any, dateLt:any){
    this.loader = true ;
    this.cancelDealArray = [] ; //empty the cancel deal array whenever deal inquiry service is called
    let dealItemId = this.store.getItem('SIGNAL_FROM_ADD_TXN_TO_EDITDEAL') ? this.store.getItem('SIGNAL_FROM_ADD_TXN_TO_EDITDEAL') : "" ;
    let dealId = this.store.getItem('SIGNAL_FROM_ADD_TXN_TO_EDITDEAL_DEALID') ? this.store.getItem('SIGNAL_FROM_ADD_TXN_TO_EDITDEAL_DEALID') : "" ;
    let isShipment : boolean = true;
    if(this.data.isAddShipmentReview){
      isShipment = false; //send isShipment as false in deal inq service (flow is shipment) -> so BE will give deals where there is no shipment id tagged... 
    }
    //(ccyCode:string,customerId:string, customerName:string, buySellInd:string, status:string, id:string,dateGt:any, dateLt:any)
    this.dealService.getDealListings(ccyCode,customerId,customerName,type,status,dealItemId,dateGt, dateLt, isShipment).subscribe((datas:any)=>{
      this.dealListings = datas['data'] ;
  
      if( this.showModalDialogContent == true ){

      // Use `map` to create a new array with only the `dealItemId` property
    const simplifiedItems = this.dealListings
    .filter(item => this.isToday(item.valueDate))  // Filter items where valueDate is today and Filters out where valueDate is other than current date...
    .map(item => ({ dealItemId: item.dealItemId , "booleanIndicator" :  true }));
    this.checkBoxArray = simplifiedItems ;
    
    console.log(this.checkBoxArray);
    if(this.checkBoxArray.length >= 1){
      this.showOKButton = true ;
     }
     else{
      this.showOKButton = false;
     }
    }
      this.loader = false ;
      if(dealItemId != ""){
        this.openEditDealDialog(dealItemId,dealId,'fromTransactionAdd') ;
        this.store.removeItem('SIGNAL_FROM_ADD_TXN_TO_EDITDEAL') ;
        this.store.removeItem('SIGNAL_FROM_ADD_TXN_TO_EDITDEAL_DEALID') ;
      }
    },
    (error:any)=>{
      this.loader = false;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
     }
    )
  }
  //onclick --> navigate to add deal screen (MC)
  navigateToAddDeal(){
    if(this.showModalDialogContent == true){
      this.dialog.closeAll() ;
    }
    this.router.navigate(['moneychanger-deals/add-deals']) ;
  }

  //search filter
  searchFilter(){
    this.xpandStatus = false ;
    let ccyCode = this.filterForm.controls['ccyCode'].value ? this.filterForm.controls['ccyCode'].value : "" ;
    let customerName = this.filterForm.controls['custName'].value ? this.filterForm.controls['custName'].value : "" ;
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
  if (customerName !== "") {
    this.filterValues.push({"fieldName":"Customer Name","value":customerName});
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
    this.callDealInquiryService(ccyCode,this.customerId ,customerName,type,this.internalStatus, this.dateGt, this.dateLt) ;
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

console.log(dealListings);
//close dialog
this.dialogRef.close({ data : dealListings });

  
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

//open edit deal dialog 
openEditDealDialog(dealItemId:string, dealId:string, anySignal:string){
  let dealListArray = [] ;
  console.log(dealId) ;
  if(anySignal == "fromTransactionAdd"){
     dealListArray = this.dealListings ;
  }
  else if(anySignal == "cancel-deal"){
    dealListArray = this.dealListings.filter(v => v.dealItemId == dealItemId) ;
  }
  else{
    dealListArray = this.dealListings.filter(v => v.dealItemId == dealItemId) ;
  }
  this.dialog.open(EditDealMcComponent,{
    panelClass: 'custom-modalbox',
    data : {records : dealListArray, currencyRecords : this.currencyArray, anySignal : anySignal}
   // width:'322px',
    //height:'140px',
  }).afterClosed().subscribe((res:any)=>{
    if(res.response){
      this.internalStatus = this.internalStatus ? this.internalStatus : "" ;
      // this.callDealInquiryService('','','','',this.internalStatus,this.dateGt,this.dateLt);
      this.searchFilter();
    }
  })
}


//From add transaction ==> Deal items ==> Edit deal ==> we will navigate to deal search and open the modal default
navigateEditDealDialog(dealItemId:string, dealId:string){
  this.store.setItem('SIGNAL_FROM_ADD_TXN_TO_EDITDEAL',dealItemId) ;
  this.store.setItem('SIGNAL_FROM_ADD_TXN_TO_EDITDEAL_DEALID',dealId) ;
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

//customer name filter on inpuyt 
// onCustomerNameChange(){
//   const customerNameControl = this.filterForm.controls['custName'];
//     // Get the current value of the input field
//     const inputText = customerNameControl.value;
//     customerNameControl.setValue(inputText.toUpperCase());

//     if (inputText.length >= 3 && /^[a-zA-Z ]+$/.test(inputText)) {
//       this.searchFilter();
//     }
//     else if(inputText.length == 0 ){
//       this.searchFilter();
//     }
// }

resetFilter(){
  this.filterValues = [] ;
  this.xpandStatus = false ;
  this.searchCustomerName = "";
  this.filterForm.patchValue({
    ccyCode : "",
      custName :"",
      type : "",
      status : []
  });

 this.onLoadDateDifferenceActivity() ;
 this.customerId  = this.customerId  ? this.customerId  : ""
  this.callDealInquiryService('',this.customerId , '','',this.internalStatus,this.dateGt, this.dateLt);
}

public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
  this.validateEndDate = event.value._d;

}
public onStartDateChange(event: MatDatepickerInputEvent<any>): void {
  this.validateStartDate = event.value._d;
  this.minEndDate = this.validateStartDate  //max end date is 30 days
  this.maxEndDate = new Date(this.minEndDate.getTime() + 30 * 24 * 60 * 60 * 1000);
}

onLoadDateDifferenceActivity(){

  //onload, patch deal status = OPEN , PARTIAL
  this.internalStatus = "1,3"
  this.filterForm.patchValue({
    status : ['1', '3']
  }) ;
  this.minEndDate = new Date() //max end date is 30 days
    this.maxEndDate = new Date(this.minEndDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Patch one month difference for both start date and end date
    const todayFormatted = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(todayFormatted.getDate() - 30); // Subtract 30 days to get one month ago
    
    this.filterForm.controls.startDate.setValue(oneMonthAgo);
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
// when we change to other component calling dealinquiry every 5 seconds should be stopped.
// ngOnDestroy(){
// this.subscription.unsubscribe();
// }

onCheckBoxSelection(index: number, dealItemId: string, event: MatCheckboxChange,searchRecord:any): void {
  if (event.checked == true) {
    // Add the deal to the array if checked
      this.cancelDealArray.push( searchRecord );
      console.log(this.cancelDealArray);
  } else if(event.checked == false) {
    // Remove the deal from the array if unchecked
    const itemIndex = this.cancelDealArray.findIndex(deal => deal.dealItemId == dealItemId);
    if (itemIndex !== -1) {
      this.cancelDealArray.splice(itemIndex, 1);
    }
    console.log(this.cancelDealArray);
  }
}

//CANCEL MULTIPLE DEALS BUTTON
onMultipleDealsCancel(){
    this.dealService.multipleDealCancel(this.buildMultipleCancelDealPayload()).subscribe((data:any)=>{
      //success case
      if(data){
      let response = data.dealItemId ;
      console.log(response) ;

      this.dialog.open(SuccessDialogComponent,{
        data : "Selected Deals are cancelled !"
      })

        this.onLoadDateDifferenceActivity();
        this.internalStatus = "1,3" ;
        this.callDealInquiryService('', '', '', '', this.internalStatus, this.dateGt, this.dateLt);
      }

    },
   //error handling
   (error:any)=>{
    if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "Issue Occured.." }
        })
    }
   }
  )
}

buildMultipleCancelDealPayload() : MultipleDealCancel{
   return new MultipleDealCancel({
     "dealItems" : this.buildDealItemsArray()
   })
}

buildDealItemsArray():DealItems[]{
  let dealItems : DealItems[] = [] ;
  if(this.cancelDealArray.length >= 1){ // we need objects in cancel deal array to map in payload
  this.cancelDealArray.forEach(deal => { //looping one by one object using foreach...
  dealItems.push(new DealItems({
    "dealItemId" : deal.dealItemId ? deal.dealItemId : "" ,
  })) ;
}) ; //foreach ends...

} else {
  dealItems = [] ;
}
  return dealItems ;
}

// added for deal to selected when we change pages.
isDealSelected(dealItemId: string): boolean {
  return !!this.cancelDealArray.find(deal => deal.dealItemId === dealItemId);
}


}
