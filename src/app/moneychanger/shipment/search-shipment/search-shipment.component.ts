import { Component, HostListener, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

import moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ShipmentMaintenanceService } from 'src/app/core/services/shipment.service';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import {  getShipmentBgColor, getShipmentColor, getShipmentTooltipText } from 'src/assets/transactionstatus';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-search-shipment',
  templateUrl: './search-shipment.component.html',
  styleUrls: ['./search-shipment.component.scss','../../../../assets/styles/tables/table-style.scss',
    '../../../../assets/styles/buttons/button.scss'
  ],

})
export class SearchShipmentComponent implements OnInit {
  shipmentListings : any[] = [] ;
  isActive = false;
  p: number = 1;
  itemsPerPage: number = 20;
  loader : Boolean = false ;
  public getScreenWidth: any;
  public getScreenHeight: any;
  public filterForm : FormGroup = Object.create(null);
  xpandStatus = false ;
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
  expandedRecord: any;
  loading: boolean = false;
  dataContent = false
  getDealInquiry : any[] = [];
  shipmentDetailInquiry : any ;
  updateShipmentdata : any[] = [];

  constructor(private titleService : TitleHeaderService, private router: Router,
    private dialog : MatDialog, private fb : FormBuilder,
    private store : InMemoryCache, private shipmentService: ShipmentMaintenanceService,
  private snackBar : MatSnackBar) { }

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

  ngOnInit(): void {
    this.titleService.setTitle('Search') ;

    //Filter Form Group
    this.filterForm = this.fb.group({
      custName : [null],
      shipmentId : [null] ,
      startDate: [null,Validators.compose([Validators.required])],
      endDate: [null,Validators.compose([Validators.required])],

    });
  
    this.onLoadFiltersSetup();

    this.callShipmentSearch('','',this.dateGt, this.dateLt);

      //getScreenWidth and getScreenHeight will get the windows inner height and width.
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
  }
  

  callShipmentSearch(customerName:string, shipmentId:string, dateGt:any, dateLt:any){
    //1. CALL SHIPMENT SEARCH SERVICE , store it in shipmentListings reference variable . error handling is important
    // 2. in service function arguement , map --> customer name , shipment id , dateGt and dateLt .
    // Write code here .
    this.loader = true;
    this.shipmentService.shipmentSearch(customerName, shipmentId, dateGt, dateLt).subscribe((datas:any) => {
      this.shipmentListings = datas['data'];
      this.loader = false;
     },
     //error Handling
     (error:any)=>{
      this.loader = false;
      if(error.status != 401){
        this.loader = false;
        this.dialog.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
     }
    )
    
  }
 
  navigateToAddShipment(){
    this.router.navigate(['shipment/add']) ;
  }
 

  //Search filter 
  searchFilter(){
    this.xpandStatus = false ;
    let customerName = this.filterForm.controls['custName'].value ? this.filterForm.controls['custName'].value : "" ;
    let shipmentId = this.filterForm.controls['shipmentId'].value ? this.filterForm.controls['shipmentId'].value : "" ;
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
  if (customerName !== "") {
    this.filterValues.push({"fieldName":"Customer Name","value":customerName});
  }
  if(shipmentId !== ""){
    this.filterValues.push({"fieldName":"Shipment Id","value":shipmentId});
  }
  //pushing dates
  var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
  var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };

  this.filterValues.push(obj1);
  this.filterValues.push(obj2);
 
    this.callShipmentSearch(customerName, shipmentId, this.dateGt, this.dateLt) ;
  }

  //Reset filter
  resetFilter(){
    this.xpandStatus = false ;
    this.searchCustomerName = "";
   this.onLoadFiltersSetup() ;
   this.callShipmentSearch('','',this.dateGt, this.dateLt);
  }

  public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateEndDate = event.value._d;
  
  }
  public onStartDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateStartDate = event.value._d;
    this.minEndDate = this.validateStartDate  //max end date is 8 days and exclude sat and sun
    this.maxEndDate = new Date(this.minEndDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  }

  onCustomerNameChange(){  
    const customerNameControl = this.filterForm.controls['custName'];
    // Get the current value of the input field
    const inputText = customerNameControl.value;
    customerNameControl.setValue(inputText.toUpperCase());

    if (inputText.length >= 3 && /^[a-zA-Z ]+$/.test(inputText)) {
      this.searchFilter();
    }
    else if(inputText.length == 0 ){
      this.searchFilter();
    }
  }

  onLoadFiltersSetup(){

    this.filterValues = [] ;

      this.minEndDate = new Date() //max end date is 1 month and exclude sat and sun
      this.maxEndDate = new Date(this.minEndDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  
      // Patch one month difference for both start date and end date
      const todayFormatted = new Date();

      
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
       this.filterValues.push(obj2); 
  
       var start_date: any = moment(this.filterForm.controls.startDate.value);
       var end_date: any = moment(this.filterForm.controls.endDate.value)
       this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
       this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
  }


toggleExpansionPanel(shipmentId: string) {
  
 
  //Call shipment inquiry API (error handling is important) and store that response in a reference variable and loop it in HTML . 
  //1. Shipment Inquiry service call - in service function arguement , map -->  shipment id  .
  //2. once success --> store this.shipmentDetailInquiry = datas['data'] ;
  //3. In html --> expansion panel area : *ngFor = "let list of shipmentDetailInquiry"

  this.shipmentService.shipmentInquiry(shipmentId).subscribe((datas:any) => {
    this.shipmentDetailInquiry = datas['data'];

    //this below code for opening and closing of expansion panel ..
  // if (this.expandedRecord === shipmentId) {
  //   this.expandedRecord = null; // Collapse the panel if it's already expanded
  // } else {
  //   this.expandedRecord = shipmentId; // Expand the panel for the clicked record
  // }
  },
  (error:any)=>{
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent,{
        data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
      }) ;
    }
   }
)

}


//on click 'edit' --> Open Add shipment modal (Edit)
openEditShipmentModal(shipmentId:string){

  this.shipmentService.shipmentInquiry(shipmentId).subscribe((datas:any) => {
    this.shipmentDetailInquiry = datas;
    this.updateShipmentdata = this.shipmentDetailInquiry; 
    let UpdateShipmentSearch = JSON.stringify(this.shipmentDetailInquiry) ;
    this.store.setItem('SHIPMENT_UPDATE',UpdateShipmentSearch);// Store the response in chache
      this.router.navigate(['shipment/add'], {
        queryParams: { shipmentId: shipmentId }// Only when there is shipmentId, the datas should be patched in add shipment
      }) ;
    // this.dialog.open(AddShipmentComponent,{
    //   data : {isEditShipmentReview : true , response : datas, titleName : 'Search'},
    //   panelClass: 'custom-modalbox',
    //  }).afterClosed().subscribe((data:any)=>{
    //   if(data.data){
    //   this.snackBar.open("Last Shipment Update Successful !", "Ok",{
    //     panelClass: "green-notification-snackbar",
    //     duration: 3000
    //   }) ;
    //   this.callShipmentSearch('','',this.dateGt,this.dateLt);
    //   }
    //  })
  
  },
  (error:any)=>{
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent,{
        data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
      }) ;
    }
   }
)
   //1. call shipmentInquiry service include shipmentId mapping in PATH VARIABLE .
   //2. Once service is success , do below activity .
   //3. Open modal dialog , component is 'AddShipmentComponent' .
   //4. map data property as isEditShipmentReview = true and also map the response in another property ;
   //5. check its ngOnInt and write a if --> if(this.data.isEditShipmentReview)
   //6. after closed --> trigger shipment search service again if any response was returned otherwise wont do anything .
}

//downloading receipt .
downloadShipmentReceipt(shipmentId:string){
  this.loader = true ;
  this.shipmentService.shipmentDownloadReceipt(shipmentId).subscribe((data:ArrayBuffer)=>{

    this.loader = false ;
      // Handle the ArrayBuffer data here
      const blob = new Blob([data], { type: 'application/pdf' });
        
      // Create a File with a specified filename
      const filename = `${shipmentId}-RECEIPT.pdf` ;

      const file = new File([blob], filename, { type: 'application/pdf' });

      // Create a data URL from the File
      const url = URL.createObjectURL(file);

      // Open the PDF in a new tab or download as needed
      window.open(url);
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

getColor(value: any) {
  return getShipmentColor(value);
  }

//bg color for status tags .
getBackgroundColor(status: string): string {
  return getShipmentBgColor(status) ;
  }

  getToolTipText(status:string){
    return getShipmentTooltipText(status) ;
  }

}
